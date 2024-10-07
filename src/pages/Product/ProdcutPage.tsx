import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import {
  Checkbox,
  Flex,
  Image,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import ProductApis from 'apis/ProductApis';
import { Search } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import PopupConfirm from 'components/Popup/PopupConfirm';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import TextCustom from 'components/Text/TextCustom';
import { useUser } from 'contexts/UserProvider';
import useQueryParam from 'hook/useQueryParam';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataTopProducts } from 'mocks/Dashboard/data';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';
import formatNumber from 'utils/function';
import { exportExcel_v2 } from 'utils/functionExport';
import { HocChangePagination } from 'utils/HocChangePagination';
import { toastSucess } from 'utils/toats';

const optionsFilter = [
  { value: '1', label: 'Lọc 1' },
  { value: '2', label: 'Lọc 2' },
  { value: '3', label: 'Lọc 3' },
];

const ProdcutPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const queryParam = useQueryParam();
  const page = parseInt(queryParam.get('page') + '') - 1 || 0;
  const page_size =
    parseInt(queryParam.get('page_size') + '') || DEFAULT_PAGE_SIZE;

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [valueSearch, setValueSearch] = useState<string>('');
  const valueSearchDebounce = useDebounce(valueSearch, 500);
  const [checkall, setCheckall] = useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any[]>([]);
  const columnTopProducts: ColumnsTypeCustom = [
    {
      title: <Checkbox checked={checkall} onChange={handleCheckAll} />,
      width: 35,
      dataIndex: 'checkall',
      isShow: false,
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
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      // width: 200,
      render: (text, record) => (
        <Space align="center">
          <Image
            src={record.image}
            width={40}
            height={45}
            className="rounded-md border-[##bfc1c2] border"
          />
          <Space direction="vertical" size={0}>
            <TextCustom value={text} color="text-[#131523]" />
            <TextCustom value={record.category_name} />
          </Space>
        </Space>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      width: 100,
      type: 'number',
    },
    {
      title: 'Giá',
      width: 130,
      dataIndex: 'price',
      render: (text) => `${formatNumber(text)} VND`,
      isShowRender: true,
    },
    {
      align: 'center',
      title: 'Đánh giá',
      type: 'number',
      width: 100,
      dataIndex: 'average_rating',
      render: (text) => (text ? text.toFixed(2) : 'Chưa có đánh giá'),
    },
  ];

  const mutateProductByShopIdExport = useMutation({
    mutationFn: ProductApis.getByShopId,
    onSuccess: (data, variables) => {
      if (variables.export)
        exportExcel_v2(columnTopProducts, data.data, 'Danh sách ản phẩm');
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateProductByShopId = useMutation({
    mutationFn: ProductApis.getByShopId,
    onSuccess: (data, variables) => {
      if (variables.export)
        exportExcel_v2(columnTopProducts, data.data, 'Danh sách ản phẩm');
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    if (user) {
      mutateProductByShopId.mutate({ id: user?._id, page, page_size }); //check
    }
  }, [page, page_size, user]);

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
    // toastSucess('Tải thành công');
    // total: mutateProductByShopId?.data?.pagination.totalProducts || 0,
    mutateProductByShopIdExport.mutate({
      id: user?._id,
      page: 0,
      page_size: mutateProductByShopId?.data?.pagination.totalProducts,
      export: true,
    });
  };

  const handleAddOrder = () => {
    navigate(PATH.addProduct);
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
        <TableCustom
          loading={mutateProductByShopId.isPending}
          columns={columnTopProducts}
          dataSource={mutateProductByShopId?.data?.data}
          rowClassName={'cursor-pointer'}
          pagination={{
            current: page + 1,
            pageSize: page_size,
            total: mutateProductByShopId?.data?.pagination.totalProducts || 0,
            onChange: HocChangePagination(),
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(PATH.productDetailById(record._id || record.key)); //
              },
            };
          }}
          // className="cursor-pointer"
        />
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
