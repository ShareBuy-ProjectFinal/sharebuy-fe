import { CloseCircleTwoTone, SaveTwoTone } from '@ant-design/icons';
import { Col, Flex, Form, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RollBackIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonDownload from 'components/Button/ButtonDownload';
import ButtonUpload from 'components/Button/ButtonUpload';
import LableValue from 'components/Dashboard/LableValue';
import InputNumberForm from 'components/Input/InputNumberForm';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import TextCustom from 'components/Text/TextCustom';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataInventoryItem } from 'mocks/Inventory/data';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from 'routes/Path';
import formatNumber from 'utils/function';

const InventoryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
    { title: 'Mã sản phẩm', dataIndex: 'productCode', width: 100 },
    { title: 'Tên sản phẩm', dataIndex: 'productName', width: 200 },
    { title: 'Thuộc tính', dataIndex: 'attribute', width: 120 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
      align: 'right',
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
      dataIndex: 'price',
      width: 100,
      align: 'right',
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
      dataIndex: 'total',
      width: 100,
      align: 'right',
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
    {
      fixed: 'right',
      width: 40,
      render: (_, record, index) => {
        return indexEdit === index ? (
          <Space size={'middle'} className="text-lg ">
            <ButtonAction tooltip="Lưu" onClick={() => handleSaveRow(record)}>
              <SaveTwoTone style={{ fontSize: 20 }} />
            </ButtonAction>
            <ButtonAction tooltip="Hủy" onClick={handleCancelRow}>
              <CloseCircleTwoTone style={{ fontSize: 20 }} />
            </ButtonAction>
          </Space>
        ) : (
          <Space>
            <ButtonAction
              edit
              onClick={(e) => handleEditRow(e, record, index)}
              disabled={indexEdit !== -1}
            />
            <ButtonAction
              onClick={(e) => handleDeleteRow(e, index)}
              disabled={indexEdit !== -1}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    console.log('id', id);
  }, []);

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
    // if (childRef && childRef.current) childRef.current.handleDownload();
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
            Chi tiết nhập/xuất kho
          </Typography.Text>
          <Space>
            <ButtonDownload onClick={handleDownload} />
          </Space>
        </Flex>
      </Flex>

      <div className="bg-white p-5 w-full rounded-lg shadow-md">
        <Row justify={'space-between'} className="w-full">
          <Col>
            <Row>
              <TextCustom
                value={`Mã: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom value={`PL0001`} className="font-medium text-lg" />
            </Row>
          </Col>
          <Col>
            <Row>
              <TextCustom
                value={`Ngày: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={`11/11/2024`}
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
              <TextCustom value={`Nhập kho`} className="font-medium text-lg" />
            </Row>
          </Col>
          <Col>
            <Row>
              <TextCustom
                value={`Nhà cung cấp: `}
                className="font-bold text-lg text-black mr-1"
              />
              <TextCustom
                value={`Nha cung cấp 1`}
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
                value={`200.000.000 VND`}
                className="font-medium text-lg"
              />
            </Row>
          </Col>
        </Row>
      </div>

      <SpaceCustom>
        <Form form={form} layout="vertical">
          <TableCustom
            // loading={mutateProductByShopId.isPending}
            columns={columns}
            dataSource={dataTable}
            // pagination={{
            //   current: page + 1,
            //   pageSize: page_size,
            //   total: mutateProductByShopId?.data?.pagination.totalProducts || 0,
            //   onChange: HocChangePagination(),
            // }}
            onRow={(record) => {
              return {
                onClick: () => {
                  console.log('first record', record);
                  navigate(PATH.inventoryDetailById(record._id || record.key)); //
                },
              };
            }}
            // className="cursor-pointer"
          />
        </Form>
      </SpaceCustom>
    </Flex>
  );
};

export default memo(InventoryDetailPage);
