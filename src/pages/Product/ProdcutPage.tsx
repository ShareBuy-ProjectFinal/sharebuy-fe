import { useDebounce } from '@uidotdev/usehooks';
import {
  Checkbox,
  Flex,
  Image,
  Input,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  Typography,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import { Search } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import PopupConfirm from 'components/Popup/PopupConfirm';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { dataTopProducts } from 'mocks/Dashboard/data';
import React, { useCallback, useEffect, useState } from 'react';
import { toastSucess } from 'utils/toats';

const optionsFilter = [
  { value: '1', label: 'Lọc 1' },
  { value: '2', label: 'Lọc 2' },
  { value: '3', label: 'Lọc 3' },
];

const ProdcutPage = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [valueSearch, setValueSearch] = useState<string>('');
  const valueSearchDebounce = useDebounce(valueSearch, 500);
  const [checkall, setCheckall] = useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any[]>([]);
  const columnTopProducts: TableColumnsType<any> = [
    {
      title: <Checkbox checked={checkall} onChange={handleCheckAll} />,
      width: 35,
      dataIndex: 'checkall',
      key: 'checkall',
      render: (vale, record) => (
        <Checkbox
          checked={
            checkall || dataSelected.some((item) => item.key === record.key)
          }
          onChange={(e) => handleCheckItem(record, e)}
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.image}
            alt={' '}
            style={{ width: '30px', borderRadius: '4px' }}
            preview={false}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Đơn vị bán',
      dataIndex: 'unitsSold',
      key: 'unitsSold',
    },
  ];

  useEffect(() => {
    valueSearchDebounce && toastSucess('Tìm kiếm: ' + valueSearchDebounce);
  }, [valueSearchDebounce]);

  function handleCheckAll(e: any) {
    if (!e.target.checked) {
      setDataSelected([]);
    } else {
      setDataSelected(dataTopProducts);
    }
    setCheckall((pre) => !pre);
  }

  function handleCheckItem(record: any, e: any) {
    setDataSelected((pre) => {
      if (e.target.checked) {
        const index = pre.findIndex((item) => item.key === record.key); //sửa
        if (index === -1) {
          pre.push(record);
          pre.length === dataTopProducts.length && setCheckall(true); //sửa
        }
        return [...pre];
      } else {
        setCheckall(false);
        return pre.filter((item) => item.key !== record.key); //sửa
      }
    });
  }

  const handleDownload = () => {
    toastSucess('Tải thành công');
  };

  const handleAddOrder = () => {
    toastSucess('Thêm đơn hàng thành công');
  };

  const handleEditRow = () => {
    // toastSucess('Sửa thành công');
    setIsOpenModal(true);
    console.log('dataSelected', dataSelected);
  };

  const handleDeleteRow = () => {
    setIsOpenModal(true);
    // toastSucess('Xóa thành công');
  };

  const handleOk = useCallback(() => {
    setIsOpenModal(false);
    toastSucess('Xóa thành công');
  }, [isOpenModal]);

  const handleCancel = useCallback(() => {
    setIsOpenModal(false);
  }, [isOpenModal]);

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Sản phẩm
        </Typography.Text>
        <Space>
          <ButtonDownload onClick={handleDownload} />
          <ButtonAdd onClick={handleAddOrder} fill />
        </Space>
      </Flex>

      <SpaceCustom direction="vertical">
        <Row justify={'space-between'}>
          <Space>
            <Select
              className="w-[150px] rounded-md"
              options={optionsFilter}
              placeholder="Lọc"
              allowClear
            />
            <Input
              placeholder="TÌm kiếm"
              prefix={<Search />}
              className="w-[250px] rounded-md "
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value)}
              allowClear
            />
          </Space>
          <Space size={15}>
            <ButtonAction edit onClick={handleEditRow} />
            <ButtonAction onClick={handleDeleteRow} />
          </Space>
        </Row>
        <TableCustom columns={columnTopProducts} dataSource={dataTopProducts} />
      </SpaceCustom>
      <PopupConfirm
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        value="Bạn có muốn xóa 5 sản phẩm đã chọn không ?" //sửa
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </Flex>
  );
};

export default ProdcutPage;
