import { CloseCircleTwoTone, SaveTwoTone } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { InventoryApis } from 'apis/InventoryApis';
import { RollBackIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonDownload from 'components/Button/ButtonDownload';
import ButtonUpload from 'components/Button/ButtonUpload';
import LableValue from 'components/Dashboard/LableValue';
import InputNumberForm from 'components/Input/InputNumberForm';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import TextCustom from 'components/Text/TextCustom';
import { useUser } from 'contexts/UserProvider';
import useQueryParam from 'hook/useQueryParam';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataInventoryItem } from 'mocks/Inventory/data';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from 'routes/Path';
import formatNumber, { formatDate } from 'utils/function';
import { exportExcel_v2 } from 'utils/functionExport';
import { HocChangePagination } from 'utils/HocChangePagination';
import { toastSucess } from 'utils/toats';

const InventoryDetailPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const queryParams = useQueryParam();
  const page = parseInt(queryParams.get('page') + '') - 1 || 0;
  const page_size = parseInt(queryParams.get('page_size') + '') || 10;
  const [indexEdit, setIndexEdit] = useState(-1);
  const [form] = useForm();
  const [dataTable, setDataTable] = useState<any>(dataInventoryItem);

  const columns: ColumnsTypeCustom = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 40,
      render: (value, record, index) => index + 1,
    },
    // { title: 'Mã sản phẩm', dataIndex: 'productCode', width: 100 },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product_detail', 'product', 'product_name'],
      width: 200,
    },
    {
      title: 'Thuộc tính',
      dataIndex: ['product_detail', 'custom_attribute_values'],
      width: 120,
      isShowRender: true,
      render: (value) => value.map((item: any) => item.value).join(', '),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
      align: 'right',
      type: 'number',
      render: (value, record, number) =>
        number === indexEdit ? (
          <Form.Item
            initialValue={value}
            name={'quantityEdit'}
            className="m-0"
            wrapperCol={{ span: 24 }}
          >
            <InputNumberForm
              placeholder="Số lượng"
              onChange={handleEditQuantity}
            />
          </Form.Item>
        ) : (
          formatNumber(value)
        ),
    },
    {
      title: 'Giá nhập',
      dataIndex: 'origin_price',
      width: 100,
      align: 'right',
      type: 'number',
      render: (value, record, number) =>
        number === indexEdit ? (
          <Form.Item
            name={'priceEdit'}
            className="m-0"
            wrapperCol={{ span: 24 }}
          >
            <InputNumberForm placeholder="Giá" onChange={handleEditPrice} />
          </Form.Item>
        ) : (
          formatNumber(value)
        ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total_price',
      width: 100,
      align: 'right',
      type: 'number',
      render: (value, record, number) =>
        number === indexEdit ? (
          <Form.Item
            name={'totalEdit'}
            className="m-0"
            wrapperCol={{ span: 24 }}
          >
            <InputNumberForm disabled />
          </Form.Item>
        ) : (
          formatNumber(value)
        ),
    },
    // {
    //   fixed: 'right',
    //   width: 40,
    //   render: (_, record, index) => {
    //     return indexEdit === index ? (
    //       <Space size={'middle'} className="text-lg ">
    //         <ButtonAction tooltip="Lưu" onClick={() => handleSaveRow(record)}>
    //           <SaveTwoTone style={{ fontSize: 20 }} />
    //         </ButtonAction>
    //         <ButtonAction tooltip="Hủy" onClick={handleCancelRow}>
    //           <CloseCircleTwoTone style={{ fontSize: 20 }} />
    //         </ButtonAction>
    //       </Space>
    //     ) : (
    //       <Space>
    //         <ButtonAction
    //           edit
    //           onClick={(e) => handleEditRow(e, record, index)}
    //           disabled={indexEdit !== -1}
    //         />
    //         <ButtonAction
    //           onClick={(e) => handleDeleteRow(e, index)}
    //           disabled={indexEdit !== -1}
    //         />
    //       </Space>
    //     );
    //   },
    // },
  ];

  const mutateInventoryDetail = useMutation({
    mutationFn: InventoryApis.getInventoryDetailById,
    onSuccess: (data, variables) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error mutateInventoryDetail', error);
    },
  });

  const mutateInventoryDetailExport = useMutation({
    mutationFn: InventoryApis.getInventoryDetailById,
    onSuccess: (data, variables) => {
      exportExcel_v2(
        columns,
        data.data.history_details,
        `Chi tiết phiếu ${mutateInventoryDetail?.data?.data.inventory_receipt._id}`,
      );
      toastSucess('Xuất file thành công');
    },
    onError: (error) => {
      console.log('error mutateInventoryDetail', error);
    },
  });

  useEffect(() => {
    if (user && id) {
      mutateInventoryDetail.mutate({
        inventoryId: id,
        page,
        limit: page_size,
      });
    }
  }, [user]);

  const handleEditRow = (e: any, record: any, index: any) => {
    e.stopPropagation();
    setIndexEdit(index);
    form.setFieldsValue({
      quantityEdit: record.quantity,
      priceEdit: record.price,
      totalEdit: record.total,
    });
  };

  const handleDeleteRow = (e: any, index: any) => {
    e.stopPropagation();
    //api delete inventoryItem
    //api get inventory
    setDataTable((prev: any) => {
      const data = [...prev];
      data.splice(index, 1);
      return data;
    });
  };

  const handleSaveRow = (record: any) => {
    const { quantityEdit, priceEdit } = form.getFieldsValue([
      'quantityEdit',
      'priceEdit',
    ]);
    //api update inventoryItem
    //api get inventory
    setDataTable((prev: any) => {
      const data = [...prev];
      data[indexEdit] = {
        ...data[indexEdit],
        quantity: quantityEdit,
        price: priceEdit,
        total: quantityEdit * priceEdit,
      };
      return data;
    });
    handleCancelRow();
  };

  const handleCancelRow = () => {
    setIndexEdit(-1);
    form.resetFields(['quantityEdit', 'priceEdit', 'totalEdit']);
  };

  const handleEditQuantity = useCallback((value: any) => {
    form.setFieldsValue({
      totalEdit: value * parseFloat(form.getFieldValue('priceEdit')),
    });
  }, []);

  const handleEditPrice = (value: any) => {
    form.setFieldsValue({
      totalEdit: value * form.getFieldValue('quantityEdit'),
    });
  };

  const handleDownload = () => {
    mutateInventoryDetailExport.mutate({
      inventoryId: id || '',
      page,
      limit: mutateInventoryDetail?.data?.pagination.totalCount || 1000,
    });
  };

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex vertical>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <RollBackIcon />
          Quay lại
        </Space>

        <Flex justify="space-between" align="center">
          <Typography.Text className="text-3xl font-bold">
            Chi tiết: {mutateInventoryDetail?.data?.data.inventory_receipt._id}
          </Typography.Text>
          <Space>
            <ButtonDownload onClick={handleDownload} />
          </Space>
        </Flex>
      </Flex>

      <div className="bg-white p-5 w-full rounded-lg shadow-md">
        <Row justify={'space-between'} className="w-full">
          {/* <Col>
            <Row>
              <TextCustom
                value={`Mã: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={mutateInventoryDetail?.data?.data.inventory_receipt._id}
                className="font-medium text-lg"
              />
            </Row>
          </Col> */}
          <Col>
            <Row>
              <TextCustom
                value={`Ngày: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={formatDate(
                  mutateInventoryDetail?.data?.data.inventory_receipt.createdAt,
                  // 'DD/MM/YYYY',
                )}
                className="font-medium text-lg"
              />
            </Row>
          </Col>
          <Col>
            <Row>
              <TextCustom
                value={`Loại: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={
                  mutateInventoryDetail?.data?.data.inventory_receipt.type ==
                  'IN'
                    ? 'Nhập kho'
                    : 'Xuất kho'
                }
                className="font-medium text-lg"
              />
            </Row>
          </Col>
          <Col>
            <Row>
              <TextCustom
                value={`Nhà cung cấp: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={
                  mutateInventoryDetail?.data?.data.inventory_receipt.supplier
                }
                className="font-medium text-lg"
              />
            </Row>
          </Col>
          <Col>
            <Row>
              <TextCustom
                value={`Tổng tiền: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={
                  formatNumber(
                    mutateInventoryDetail?.data?.data?.inventory_receipt
                      .total_price,
                  ) + ' VND'
                }
                className="font-medium text-lg"
              />
            </Row>
          </Col>
        </Row>
      </div>

      <SpaceCustom>
        <Form form={form} layout="vertical">
          <TableCustom
            loading={mutateInventoryDetail.isPending}
            columns={columns}
            dataSource={
              mutateInventoryDetail?.data?.data?.history_details || []
            }
            // pagination={{
            //   current: page,
            //   pageSize: page_size,
            //   total: mutateInventoryDetail?.data?.pagination.totalCount || 0,
            //   onChange: HocChangePagination(),
            // }}
          />
        </Form>
      </SpaceCustom>
    </Flex>
  );
};

export default memo(InventoryDetailPage);
