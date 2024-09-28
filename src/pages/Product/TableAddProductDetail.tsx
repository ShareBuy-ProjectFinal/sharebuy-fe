import { UploadOutlined } from '@ant-design/icons';
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
            <img src={value} alt="avatar" />
          ) : (
            <AddIcon className="text-primary-40 border-2" />
          )}

          {/* <AddIcon className="text-primary-40 border-2" /> */}
        </Upload>
      ),
    },
    {
      title: 'Danh sách thuộc tính',
      //   width: 50,
      dataIndex: 'listAttribute',
      render: (value, record) =>
        record.map((item: any) => item.label).join(', '),
    },
    {
      title: 'Giá',
      width: 150,
      dataIndex: 'price',
      render: () => <Input type="number" />,
    },
    {
      title: 'Số lượng',
      width: 90,
      dataIndex: 'quantity',
      render: () => <Input type="number" />,
    },
  ];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const onChangeImageBackground = (info: any, index: number) => {
    const newFileList = { ...info };
    console.log('newFileList', newFileList);
    getBase64(newFileList.file.originFileObj as FileType, (url) => {
      data[index].image = url;
      setRefresh(!refresh);
    });
  };

  return <TableCustom columns={columns} dataSource={data} />;
};

export default TableAddProductDetail;
