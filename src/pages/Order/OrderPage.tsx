import { CheckOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import {
  Checkbox,
  Flex,
  Input,
  Row,
  Select,
  Space,
  TableColumnsType,
  Tag,
  Typography,
} from 'antd';
import OrderApis, { StatusOrder } from 'apis/OrderApis';
import { AcceptIcon, Search } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import PopupConfirm from 'components/Popup/PopupConfirm';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { useUser } from 'contexts/UserProvider';
import useQueryParam from 'hook/useQueryParam';
import { dataTopProducts } from 'mocks/Dashboard/data';
import { dataOrders } from 'mocks/Order/data';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';
import formatNumber, { formatDate } from 'utils/function';
import { toastSucess } from 'utils/toats';
import PopupHandleOrder from './PopupHandleOrder';
import { HocChangePagination } from 'utils/HocChangePagination';

const optionsFilter = [
  { value: 'all', label: 'Tất cả' },
  { value: 'PREPARING', label: 'Đang chuẩn bị' },
  { value: 'DELIVERY', label: 'Đang giao hàng' },
  { value: 'COMPLETED', label: 'Đã nhận' },
  { value: 'CANCELED', label: 'Đã huỷ' },
];

const OrderPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [valueSearch, setValueSearch] = useState<string>('');
  const valueSearchDebounce = useDebounce(valueSearch, 500);
  const [checkall, setCheckall] = useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<StatusOrder | 'all'>(
    'all',
  );
  const [isCancelOrder, setIsCancelOrder] = useState<boolean>(false);
  const [orderIdHandle, setOrderIdHandle] = useState<string>('');

  const queryParam = useQueryParam();
  const page = parseInt(queryParam.get('page') + '') - 1 || 0;
  const page_size =
    parseInt(queryParam.get('page_size') + '') || DEFAULT_PAGE_SIZE;

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
      title: 'Đơn hàng',
      dataIndex: '_id',
      key: 'order',
      width: 100,
      render: (value: string) => `#${value.slice(-7)}`,
    },
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'date',
      width: 200,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Khách hàng',
      dataIndex: ['address', 'userInfo', 'full_name'],
      key: 'customer',
      width: 180,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payment_method',
      key: 'payment_method',
      width: 180,
      render: (value, record) => {
        const { color, text } = checkStatusPayment(value, record.status);
        return color == 'success' ? <Tag color={color}>{text}</Tag> : '';
      },
    },
    {
      title: 'Trạng thái đặt hàng',
      dataIndex: 'status',
      key: 'orderStatus',
      width: 180,
      render: (value) => {
        const { color, text } = checkStatusOrder(value);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Tổng',
      align: 'right',
      dataIndex: 'total_amount',
      key: 'total',
      width: 140,
      render: (value) => formatNumber(value),
    },
    {
      width: 90,
      fixed: 'right',
      render: (vaalue, record) =>
        record.status == ('PREPARING' as StatusOrder) && (
          <Space size={15}>
            <ButtonAction onClick={(e) => handleAction(e, record._id, true)} />
            <ButtonAction onClick={(e) => handleAction(e, record._id, false)}>
              <AcceptIcon />
            </ButtonAction>
          </Space>
        ),
    },
  ];

  const mutateGetOrderByState = useMutation({
    mutationFn: OrderApis.getOrderByStatus,
    onSuccess: (data) => {
      // console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateUpdateStatusById = useMutation({
    mutationFn: OrderApis.updateStatusById,
    onSuccess: (data) => {
      toastSucess('Cập nhật thành công');
      mutateGetOrderByState.mutate({
        userId: user?._id,
        page,
        page_size,
        ...(selectedFilter != 'all' && { status: selectedFilter }),
      });
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    // valueSearchDebounce && toastSucess('Tìm kiếm: ' + valueSearchDebounce);
    if (user) {
      mutateGetOrderByState.mutate({
        userId: user?._id,
        page,
        page_size,
        ...(selectedFilter != 'all' && { status: selectedFilter }),
      });
    }
  }, [user, page, page_size, valueSearchDebounce, selectedFilter]);

  function checkStatusOrder(status: StatusOrder) {
    switch (status) {
      case 'PENDING':
        return { color: 'warning', text: 'Đang chờ thanh toán' };
      case 'PREPARING':
        return { color: 'processing', text: 'Đang chuẩn bị' };
      case 'DELIVERY':
        return { color: 'cyan', text: 'Đang giao hàng' };
      case 'COMPLETED':
        return { color: 'success', text: 'Đã nhận' };
      default:
        return { color: 'error', text: 'Đã huỷ' };
    }
  }

  function checkStatusPayment(
    statusPayment: 'MOMO' | 'DIRECT',
    statusOrder: StatusOrder,
  ) {
    switch (statusPayment) {
      case 'MOMO':
        return statusOrder != 'CANCELED' && statusOrder != 'PENDING'
          ? {
              color: 'success',
              text: 'Đã thanh toán',
            }
          : { color: 'processing', text: 'Chưa thanh toán' };
      case 'DIRECT':
        return statusOrder == 'COMPLETED'
          ? { color: 'success', text: 'Đã thanh toán' }
          : { color: 'processing', text: 'Chưa thanh toán' };
      default:
        return { color: 'processing', text: 'Chưa thanh toán' };
    }
  }

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

  const handleAction = (e: any, orderId: any, isCancel: boolean) => {
    e.stopPropagation();
    setIsOpenModal(true);
    setIsCancelOrder(isCancel);
    setOrderIdHandle(orderId);
  };

  const handleOk = useCallback(() => {
    setIsOpenModal(false);
    mutateUpdateStatusById.mutate({
      orderId: orderIdHandle,
      status: isCancelOrder ? 'CANCELED' : 'DELIVERY',
    });
  }, [isOpenModal, orderIdHandle]);

  // const handleCancel = useCallback(() => {
  //   setIsOpenModal(false);
  // }, [isOpenModal]);

  const handleOnChangeFilter = (value: StatusOrder | 'all') => {
    setSelectedFilter(value);
  };

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Đơn hàng
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
              value={selectedFilter}
              onChange={handleOnChangeFilter}
              // allowClear
              // onClear={() => {
              //   setSelectedFilter('all');
              // }}
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
        </Row>
        <TableCustom
          loading={mutateGetOrderByState.isPending}
          columns={columnTopProducts}
          dataSource={mutateGetOrderByState.data?.data}
          rowClassName={'cursor-pointer'}
          pagination={{
            current: page + 1,
            pageSize: page_size,
            total: mutateGetOrderByState?.data?.pagination.totalProducts || 0,
            onChange: HocChangePagination(),
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(PATH.orderDetailById(record._id || record.key)); //
              },
            };
          }}
        />
      </SpaceCustom>
      <PopupHandleOrder
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        isCancel={isCancelOrder}
        handleOk={handleOk}
        // handleCancel={handleCancel}
      />
    </Flex>
  );
};

export default OrderPage;
