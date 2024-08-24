import { useDebounce } from '@uidotdev/usehooks';
import { Flex, Image, Input, Select, Space, Table, Typography } from 'antd';
import { Search } from 'assets/svgs';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { dataTopProducts } from 'mocks/Dashboard/data';
import React, { useEffect, useState } from 'react';
import { toastSucess } from 'utils/toats';

const OrderPage = () => {
  const [valueSearch, setValueSearch] = useState<string>('');
  const valueSearchDebounce = useDebounce(valueSearch, 500);
  const columnTopProducts = [
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

  const optionsFilter = [
    { value: '1', label: 'Lọc 1' },
    { value: '2', label: 'Lọc 2' },
    { value: '3', label: 'Lọc 3' },
  ];

  useEffect(() => {
    valueSearchDebounce && toastSucess('Tìm kiếm: ' + valueSearchDebounce);
  }, [valueSearchDebounce]);

  const handleDownload = () => {
    toastSucess('Tải thành công');
  };

  const handleAddOrder = () => {
    toastSucess('Thêm đơn hàng thành công');
  };

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Đặt hàng
        </Typography.Text>
        <Space>
          <ButtonDownload onClick={handleDownload} />
          <ButtonAdd onClick={handleAddOrder} fill />
        </Space>
      </Flex>

      <SpaceCustom direction="vertical">
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
            // onFocus={() => setIsFocus(true)}
            // onBlur={() => setIsFocus(false)}
          />
        </Space>
        <TableCustom columns={columnTopProducts} dataSource={dataTopProducts} />
      </SpaceCustom>
    </Flex>
  );
};

export default OrderPage;
