import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  GetProp,
  Image,
  Input,
  TableColumnsType,
  Upload,
  UploadProps,
} from 'antd';
import { AddIcon } from 'assets/svgs';
import TableCustom from 'components/Table/TableCustom';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataCategoryMen } from 'mocks/Category/data';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import formatNumber from 'utils/function';
import { exportExcel_v2 } from 'utils/functionExport';
import { toastError } from 'utils/toats';

interface IProps {
  data: any;
  isAdd?: boolean;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const TableAddProductDetail = forwardRef((props: IProps, ref: any) => {
  const { data, isAdd = false } = props;
  const [refresh, setRefresh] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<any[]>([]);
  const columns: ColumnsTypeCustom = [
    {
      title: 'STT',
      width: 50,
      align: 'center',
      dataIndex: 'stt',
      render: (value: any, record: any, index: number) => index + 1,
    },
    ...(!isAdd
      ? [
          {
            title: 'Mã chi tiết sản phẩm',
            dataIndex: '_id',
            width: 170,
          },
        ]
      : []),
    {
      title: 'Ảnh',
      width: 150,
      dataIndex: 'image',
      render: (value: any, record, index) => (
        <Upload
          accept=".png,.jpg,.jpeg"
          fileList={backgroundImage}
          onChange={(info) => onChangeImageBackground(info, index)}
          beforeUpload={(file) => {
            const isImage =
              file.type === 'image/png' ||
              file.type === 'image/jpeg' ||
              file.type === 'image/jpg';
            if (!isImage) {
              toastError(
                'Chỉ được phép chọn file hình ảnh với định dạng PNG, JPG, hoặc JPEG',
              );
            }
            return isImage || Upload.LIST_IGNORE;
          }}
          // multiple={true}
          showUploadList={false}
        >
          {value ? (
            <div style={{ position: 'relative' }}>
              <img src={value} alt="avatar" className="border" />
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  transform: 'translate(-5%, -5%)',
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn sự kiện onClick của hình ảnh
                  handleDeleteImage(index);
                }}
              />
            </div>
          ) : (
            <AddIcon className="text-primary-40 border-2" />
          )}
        </Upload>
      ),
    },
    {
      title: 'Danh sách thuộc tính',
      width: 200,
      dataIndex: 'listAttribute',
      isShowRender: true,
      render: (value, record) =>
        value.map((item: any) => item.label).join(', '),
    },
    {
      title: 'Giá',
      width: 150,
      dataIndex: 'price',
      type: 'number',
      render: (item, record, index) => (
        <Input
          type="number"
          defaultValue={item}
          onChange={(value) => onChangePrice(value, index)}
        />
      ),
    },
    {
      title: 'Số lượng',
      type: 'number',
      width: 90,
      dataIndex: 'quantity',
      render: (item, record, index) => formatNumber(item),
      //    (
      //   <Input
      //     type="number"
      //     defaultValue={item}
      //     onChange={(value) => onChangeQuantiy(value, index)}
      //   />
      // ),
    },
  ];

  useImperativeHandle(ref, () => ({
    handleDownload,
  }));

  const handleDownload = () => {
    exportExcel_v2(columns, data, 'Danh sách chi tiết sản phẩm');
  };
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const onChangeImageBackground = (info: any, index: number) => {
    const newFileList = { ...info };
    // console.log('newFileList', newFileList);
    getBase64(newFileList.file.originFileObj as FileType, (url) => {
      data[index].image = url;
      data[index].file = newFileList.file;
      setRefresh(!refresh);
    });
  };

  const handleDeleteImage = (index: number) => {
    delete data[index].image;
    delete data[index].file;
    setRefresh(!refresh);
  };

  const onChangePrice = (value: any, index: any) => {
    data[index].price = value.target.value;
    // setRefresh(!refresh);
  };

  const onChangeQuantiy = (value: any, index: any) => {
    data[index].quantity = value.target.value;
    // setRefresh(!refresh);
  };

  return <TableCustom columns={columns} dataSource={data} />;
});

export default TableAddProductDetail;
