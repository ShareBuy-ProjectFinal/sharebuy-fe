import { Flex, Space, Typography } from 'antd';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import ButtonUpload from 'components/Button/ButtonUpload';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { Upload } from 'components/Upload/Upload';
import { UploadModal } from 'components/UploadModal_V2';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { DEFAULT_PAGE_SIZE, URL_IMPORT_TEMPLATE_FILE } from 'utils/constants';
import formatNumber, { formatDate } from 'utils/function';
import { IMPORT_ROUTE } from 'utils/importId';
import InventoryModalAdd from './InventoryModalAdd';
import { dataInventorys } from 'mocks/Inventory/data';
import { useMutation } from '@tanstack/react-query';
import { InventoryApis } from 'apis/InventoryApis';
import useQueryParam from 'hook/useQueryParam';
import { HocChangePagination } from 'utils/HocChangePagination';
import { useUser } from 'contexts/UserProvider';
import { toastSucess } from 'utils/toats';
import { IInventoryNew } from 'interfaces/Inventory/Inventory.interface';
import { exportExcel_v2 } from 'utils/functionExport';

const InventoryPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const queryParams = useQueryParam();
  const page = parseInt(queryParams.get('page') + '') - 1 || 0;
  const page_size =
    parseInt(queryParams.get('page_size') + '') || DEFAULT_PAGE_SIZE;
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
      dataIndex: '_id',
      width: 100,
      render: (value) => '#' + value.slice(-7),
    },
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      width: 150,
      isShowRender: true,
      render: (value) => formatDate(value),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 100,
      isShowRender: true,
      render: (value) => (value === 'IN' ? 'Nhập kho' : 'Xuất kho'),
    },
    {
      title: 'Nhà cung cấp/Khách hàng',
      dataIndex: 'supplier',
      width: 250,
    },
    {
      align: 'right',
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      width: 150,
      type: 'number',
      render: (value) => formatNumber(value) + ' VND',
    },
  ];

  useEffect(() => {
    if (user) {
      mutateGetInventory.mutate({
        shopId: user._id,
        page,
        limit: page_size,
      });
    }
  }, [user, page, page_size]);

  const mutateGetInventory = useMutation({
    mutationFn: InventoryApis.getInventoryByShopId,
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      console.log('error mutateGetInventory', error);
    },
  });

  const mutateCreateInventory = useMutation({
    mutationFn: InventoryApis.createInventory,
    onSuccess: (data) => {
      // console.log('data', data);
      toastSucess(
        `Tạo phiếu ${data.type == 'IN' ? 'nhập kho' : 'xuất kho'} thành công`,
      );
      setIsOpenAddModal(false);
      mutateGetInventory.mutate({
        shopId: user?._id,
        page: 0,
        limit: 10,
      });
    },
    onError: (error) => {
      console.log('error mutateCreateInventory', error);
      toastSucess('Tạo phiếu thất bại');
    },
  });

  const mutateCreateInventoryExport = useMutation({
    mutationFn: InventoryApis.getInventoryByShopId,
    onSuccess: (data) => {
      // console.log('data', data);
      exportExcel_v2(columns, data.data, 'Danh sách phiếu xuất/nhập kho');
      toastSucess('Xuất file thành công');
    },
    onError: (error) => {
      console.log('error mutateCreateInventoryExport', error);
    },
  });

  const handleAddOrder = () => {
    setIsOpenAddModal(true);
  };

  const handleDownload = () => {
    if (user) {
      mutateCreateInventoryExport.mutate({
        shopId: user._id,
        page: 0,
        limit: mutateCreateInventory.data?.pagination.totalCount || 1000,
      });
    }
  };
  const handleOk = (data: IInventoryNew) => {
    mutateCreateInventory.mutate(data);
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
          loading={mutateGetInventory.isPending}
          columns={columns}
          rowClassName={'cursor-pointer'}
          dataSource={mutateGetInventory.data?.data || []}
          pagination={{
            current: page + 1,
            pageSize: page_size,
            total: mutateGetInventory?.data?.pagination.totalCount || 0,
            onChange: HocChangePagination(),
          }}
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
        handleOK={handleOk}
      />
    </Flex>
  );
};

export default InventoryPage;
