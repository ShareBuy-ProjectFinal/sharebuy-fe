import { Flex, Space, Typography } from 'antd';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import ButtonUpload from 'components/Button/ButtonUpload';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { Upload } from 'components/Upload/Upload';
import { UploadModal } from 'components/UploadModal_V2';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { URL_IMPORT_TEMPLATE_FILE } from 'utils/constants';
import formatNumber, { formatDate } from 'utils/function';
import { IMPORT_ROUTE } from 'utils/importId';
import InventoryModalAdd from './InventoryModalAdd';
import { dataInventorys } from 'mocks/Inventory/data';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const columns: ColumnsTypeCustom = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 40,
      render: (value, record, index) => index + 1,
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
      dataIndex: 'total',
      width: 150,
      render: (value) => formatNumber(value),
    },
  ];
  const handleAddOrder = () => {
    setIsOpenAddModal(true);
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
          dataSource={dataInventorys}
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

      <InventoryModalAdd
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
      />
    </Flex>
  );
};

export default InventoryPage;
