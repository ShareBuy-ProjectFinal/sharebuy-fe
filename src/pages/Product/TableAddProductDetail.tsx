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
import { dataCategoryMen } from 'mocks/Category/data';
import React, { useMemo, useState } from 'react';
import { toastError } from 'utils/toats';

interface IProps {
  data: any;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const TableAddProductDetail = (props: IProps) => {
  const [refresh, setRefresh] = useState(false);
  const { data } = props;
  const [backgroundImage, setBackgroundImage] = useState<any[]>([]);
  const columns: TableColumnsType<any> = [
    {
      title: 'STT',
      width: 50,
      align: 'center',
      dataIndex: 'stt',
      render: (value: any, record: any, index: number) => index + 1,
    },
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
              <img src={value} alt="avatar" />
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
      //   width: 50,
      dataIndex: 'listAttribute',
      render: (value, record) =>
        value.map((item: any) => item.label).join(', '),
    },
    {
      title: 'Giá',
      width: 150,
      dataIndex: 'price',
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
      width: 90,
      dataIndex: 'quantity',
      render: (item, record, index) => (
        <Input
          type="number"
          defaultValue={item}
          onChange={(value) => onChangeQuantiy(value, index)}
        />
      ),
    },
  ];

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
      data[index].file = newFileList.file.originFileObj;
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
};

export default TableAddProductDetail;
