import { Flex, Space, Typography } from 'antd';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataInvetory } from 'mocks/Inventory/data';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { formatDate } from 'utils/function';

const InventoryPage = () => {
  const navigate = useNavigate();

  const columns: ColumnsTypeCustom = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 40,
    },
    {
      title: 'Mã',
      dataIndex: 'productCode',
      width: 100,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 100,
      render: (value) => formatDate(value, 'DD/MM/YYYY'),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: 'Nhà cung cấp/Khách hàng',
      dataIndex: 'supplierOrCustomer',
      width: 250,
    },
    {
      title: 'Tổng tiền',
      width: 150,
    },
  ];
  const handleAddOrder = () => {
    navigate(PATH.inventory);
  };

  const handleDownload = () => {
    // toastSucess('Tải thành công');
    // total: mutateProductByShopId?.data?.pagination.totalProducts || 0,
    // mutateProductByShopIdExport.mutate({
    //   id: user?._id,
    //   page: 0,
    //   page_size: mutateProductByShopId?.data?.pagination.totalProducts,
    //   export: true,
    // });
  };
  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Nhập/Xuất kho
        </Typography.Text>
        <Space>
          <ButtonDownload onClick={handleDownload} />
          <ButtonAdd onClick={handleAddOrder} fill />
        </Space>
      </Flex>

      <SpaceCustom>
        <TableCustom
          // loading={mutateProductByShopId.isPending}
          columns={columns}
          rowClassName={'cursor-pointer'}
          dataSource={dataInvetory}
          // pagination={{
          //   current: page + 1,
          //   pageSize: page_size,
          //   total: mutateProductByShopId?.data?.pagination.totalProducts || 0,
          //   onChange: HocChangePagination(),
          // }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(PATH.inventoryDetailById(record._id || record.key)); //
              },
            };
          }}
          // className="cursor-pointer"
        />
      </SpaceCustom>
    </Flex>
  );
};

export default InventoryPage;
