import { CloseCircleTwoTone, SaveTwoTone } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Col,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import ProductApis from 'apis/ProductApis';
import Button from 'components/Button/Button';
import ButtonAction from 'components/Button/ButtonAction';
import Content from 'components/Content/Content';
import InputNumberForm from 'components/Input/InputNumberForm';
import LazySelectForm, {
  ILazySelectData,
  ILazySelectParams,
  initLazySelectData,
} from 'components/Select/LazySelectForm';
import TableComponent from 'components/Table/TableComponent';
import TextCustom from 'components/Text/TextCustom';
import { UploadModal } from 'components/UploadModal_V2';
import { useUser } from 'contexts/UserProvider';
import dayjs from 'dayjs';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { URL_IMPORT_TEMPLATE_FILE } from 'utils/constants';
import formatNumber, { checkFormValidate, formatDate } from 'utils/function';
import { toastError } from 'utils/toats';

const optionTypes = [
  {
    label: 'Nhập hàng',
    value: 'Nhập hàng',
  },
  { label: 'Xuất hàng', value: 'Xuất hàng' },
];

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type?: 'import' | 'export' | 'create';
}

const InventoryModalAdd = (props: IProps) => {
  const { isOpen, setIsOpen, type = 'create' } = props;
  const { user } = useUser();
  const [form] = useForm();
  const [indexEdit, setIndexEdit] = useState<number>(-1);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [products, setProduct] = useState<ILazySelectData>(initLazySelectData);
  const [optionsProductDetail, setOptionsProductDetail] = useState<any[]>([]);
  const [dataNewInventory, setDataNewInventory] = useState<any[]>([
    {
      product_id: '66f99743a95a6154c8ed8777',
      product_name:
        'Tai Nghe Có Dây X5 Pro Gaming Super Bass Chống Ồn Cực Tốt Có Mic Đàm Thoại1',
      product_detail_id: '66f99743a95a6154c8ed8779',
      attribute: 'Đen',
      price: 1,
      quantity: 1,
      total: 1,
    },
  ]);

  const columns: ColumnsTypeCustom = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 40,
      align: 'center',
      render: (value: any, record: any, index: number) => index + 1,
    },
    // { title: 'Mã sản phẩm', dataIndex: 'product_id', width: 230 },
    { title: 'Tên sản phẩm', dataIndex: 'product_name', width: 280 },
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
              onClick={(e) => handleEditRow(e, index)}
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

  const mutateProductByShopId = useMutation({
    mutationFn: ProductApis.getByShopId,
    onSuccess: (data) => {
      // console.log('data', data);
      setProduct({
        options: data.data.map((item: any, index: number) => ({
          //   label: item.product_name,
          label: (
            <Tooltip title={item.product_name} placement="topLeft">
              <Space align="center">
                <Image
                  src={item.image}
                  width={40}
                  height={45}
                  className="rounded-md border-[##bfc1c2] border"
                />
                <Space direction="vertical" size={0}>
                  <TextCustom
                    value={item.product_name}
                    color="text-[#131523]"
                  />
                  <TextCustom value={item.category_name} />
                </Space>
              </Space>
            </Tooltip>
          ),
          value: item._id + '-.-' + item.product_name,
          displayName: item.product_name,
        })),
        totalItems: data.pagination.totalProducts,
      });
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateGetAllProductDetailByProductid = useMutation({
    mutationFn: ProductApis.getProductDetails,
    onSuccess: (data: any[]) => {
      // console.log('data', data);
      setOptionsProductDetail(
        data.map((proDetail) => {
          const label = proDetail.custom_attribute_values
            .map((item: any) => item.value)
            .join(', ');
          return {
            label,
            value: proDetail._id + '-.-' + label,
          };
        }),
      );
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateProductDetailById = useMutation({
    mutationFn: ProductApis.getProductDetailById,
    onSuccess: (data) => {
      // console.log('data', data);
    },
    onError: (error) => {
      console.log('error ProductDetailById', error);
    },
  });

  useEffect(() => {
    if (user) {
      //   mutateProductByShopId.mutate({ id: user?._id, page: 0, page_size: 10 });
    }
  }, [isOpen, user]);

  const handleEditRow = (e: any, index: any) => {
    e.stopPropagation();
    setIndexEdit(index);
    form.setFieldsValue({
      quantityEdit: dataNewInventory[index].quantity,
      priceEdit: dataNewInventory[index].price,
      totalEdit: dataNewInventory[index].total,
    });
  };

  const handleDeleteRow = (e: any, index: any) => {
    e.stopPropagation();
    setDataNewInventory((prev) => {
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
    setDataNewInventory((prev) => {
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

  const onOk = async () => {
    if (indexEdit !== -1) {
      toastError('Vui lòng lưu hoặc hủy chỉnh sửa trước khi tạo phiếu');
      return;
    }
    if (!(await checkFormValidate(form))) {
      toastError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    const { ncc, type } = form.getFieldsValue();
    console.log('form', dataNewInventory, ncc, type);
  };

  const onCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleAdd = () => {
    const { product, productDetail, price, quantity } = form.getFieldsValue();
    if (!product) {
      toastError('Vui lòng chọn sản phẩm');
      return;
    }
    if (!productDetail) {
      toastError('Vui lòng chọn sản phẩm chi tiết');
      return;
    }
    if (!price) {
      toastError('Vui lòng nhập giá');
      return;
    }
    if (!quantity) {
      toastError('Vui lòng nhập số lượng');
      return;
    }
    setDataNewInventory((prev) => {
      const productDetailSplit = productDetail.split('-.-');
      const productSplit = product.split('-.-');
      const index = prev.findIndex(
        (item) => item.product_detail_id === productDetailSplit[0],
      );
      if (index !== -1) {
        if (prev[index].price == price) {
          prev[index].quantity += parseInt(quantity);
          prev[index].total = prev[index].quantity * prev[index].price;
          return [...prev];
        }
      }
      return [
        ...prev,
        {
          product_id: productSplit[0],
          product_name: productSplit[1],
          product_detail_id: productDetailSplit[0],
          attribute: productDetailSplit[1],
          price: price,
          quantity: parseInt(quantity),
          total: price * quantity,
        },
      ];
    });
    form.resetFields(['product', 'productDetail', 'price', 'quantity']);
    setOptionsProductDetail([]);
  };

  const onChangeProduct = (value: any, option: any) => {
    mutateGetAllProductDetailByProductid.mutate(value.split('-.-')[0]);
  };

  const handleProductSelectScrollChange = (params: ILazySelectParams) => {
    mutateProductByShopId.mutate({
      id: user?._id,
      page: 0,
      page_size: params.pageSize,
    });
  };

  return (
    <Modal
      open={isOpen}
      width={'85%'}
      title={
        type == 'create'
          ? 'Tạo phiếu nhập/xuất kho'
          : type == 'import'
            ? 'Cập nhật phiếu nhập kho'
            : 'Cập nhật phiếu xuất kho'
      }
      okText={'Tạo phiếu'}
      cancelText="Huỷ"
      onOk={onOk}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Flex gap={15}>
          {/* left */}
          <Content className="w-4/5 !mt-0">
            <Row justify={'space-between'} gutter={[15, 15]} className="mb-3">
              <Col span={14}>
                <Form.Item
                  className="mb-0"
                  label="Sản phẩm"
                  layout="horizontal"
                  name={'product'}
                >
                  <LazySelectForm
                    data={products}
                    optionLabelProp="displayName"
                    onChange={onChangeProduct}
                    loading={mutateProductByShopId.isPending}
                    placeholder={'Sản phẩm'}
                    onSelectScrollChange={handleProductSelectScrollChange}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  className="mb-0"
                  name={'price'}
                  label="Giá"
                  layout="horizontal"
                >
                  <InputNumberForm placeholder="Giá" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  title="Import"
                  customClass="!py-1 !mt-0"
                  type="button"
                  handleOnclick={() => setIsOpenImportModal(true)}
                />
              </Col>
            </Row>
            <Row justify={'space-between'} gutter={[15, 15]} className="mb-3">
              <Col span={14}>
                <Form.Item
                  className="mb-0"
                  label="Chi tiết sản phẩm"
                  layout="horizontal"
                  name={'productDetail'}
                >
                  <Select
                    options={optionsProductDetail}
                    placeholder={'Chi tiết sản phẩm'}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  className="mb-0"
                  label="Số lượng"
                  name={'quantity'}
                  layout="horizontal"
                >
                  <InputNumberForm placeholder="Số lượng" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  title="Thêm"
                  customClass="!py-1 !mt-0"
                  fill
                  handleOnclick={handleAdd}
                />
              </Col>
            </Row>
            <TableComponent columns={columns} dataSource={dataNewInventory} />
          </Content>

          {/* right */}
          <Content className="w-1/5 !mt-0">
            <Form.Item
              className="mb-2"
              label="Ngày"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input placeholder={dayjs().format('DD/MM/YYYY')} disabled />
            </Form.Item>
            <Form.Item
              className="mb-2"
              label="Loại phiếu"
              name={'type'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: 'Vui lòng chọn loại phiếu' }]}
            >
              <Select
                options={optionTypes}
                placeholder={'Chọn loại phiếu'}
                size="middle"
              />
            </Form.Item>
            <Form.Item
              className="mb-2"
              label="Nhà cung cấp/Khách hàng"
              name={'ncc'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
            >
              <Input placeholder="Nhập nhà cung cấp/Khách hàng" />
            </Form.Item>
          </Content>
        </Flex>
      </Form>

      {/* import */}
      <UploadModal
        downloadTemplate={{
          fileName: 'Nhập/xuất kho',
          url: URL_IMPORT_TEMPLATE_FILE.INVENTORY_EXPORT_IMPORT,
        }}
        open={isOpenImportModal}
        title={'Thêm hoá đơn nhập/xuất kho'}
        refetch={() => {
          // handleClearFilter();
          // refetchListRoute();
        }}
        setOpen={setIsOpenImportModal}
        handleConfirm={async (data) => {
          const propsAttribute = ['product_detail_id', 'price', 'quantity'];
          const recordError: any = [];
          const promises = data.map((item: any, i: number) => {
            const newObj: any = {};
            let index = 0;
            for (const key in item) {
              if (key == 'id') continue;
              newObj[propsAttribute[index++]] = item[key];
            }
            return mutateProductDetailById
              .mutateAsync(newObj.product_detail_id)
              .then((res) => {
                const attribute = res.custom_attribute_values
                  .map((item: any) => item.value)
                  .join(', ');
                newObj.product_id = res.product._id;
                newObj.product_name = res.product.product_name;
                newObj.attribute = attribute;
                newObj.price = parseFloat(newObj.price);
                newObj.quantity = parseInt(newObj.quantity);
                newObj.total = newObj.price * newObj.quantity;
                return newObj;
              })
              .catch((error) => {
                console.log('error', error);
                recordError.push(i + 1);
              });
          });
          const result = await Promise.all(promises);
          if (recordError.length > 0) {
            toastError(
              `Không tìm thấy sản phầm dòng ${recordError.join(', ')}`,
            );
          } else {
            setDataNewInventory((prev) => [...prev, ...result]);
            setIsOpenImportModal(false);
          }
        }}
      />
    </Modal>
  );
};

export default memo(InventoryModalAdd);
