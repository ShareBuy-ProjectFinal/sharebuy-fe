import { useMutation } from '@tanstack/react-query';
import {
  Col,
  DatePicker,
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
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonUpload from 'components/Button/ButtonUpload';
import Content from 'components/Content/Content';
import SelectForm from 'components/Input/SelectForm';
import LazySelectForm, {
  ILazySelectData,
  ILazySelectParams,
  initLazySelectData,
} from 'components/Select/LazySelectForm';
import TableComponent from 'components/Table/TableComponent';
import TableCustom from 'components/Table/TableCustom';
import TextCustom from 'components/Text/TextCustom';
import { UploadModal } from 'components/UploadModal_V2';
import { useUser } from 'contexts/UserProvider';
import dayjs from 'dayjs';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import React, { memo, useEffect, useState } from 'react';
import { URL_IMPORT_TEMPLATE_FILE } from 'utils/constants';
import { formatDate } from 'utils/function';
import { IMPORT_ROUTE } from 'utils/importId';

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
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [products, setProduct] = useState<ILazySelectData>(initLazySelectData);
  const [optionsProductDetail, setOptionsProductDetail] = useState<any[]>([]);

  const columns: ColumnsTypeCustom = [
    { title: 'STT', dataIndex: 'stt', width: 50 },
    { title: 'Mã sản phẩm', dataIndex: 'productCode', width: 150 },
    { title: 'Tên sản phẩm', dataIndex: 'productName', width: 200 },
    { title: 'Số lượng', dataIndex: 'quantity', width: 100 },
    { title: 'Giá nhập', dataIndex: 'price', width: 100 },
    { title: 'Thành tiền', dataIndex: 'total', width: 100 },
    ...(type !== 'create'
      ? ([
          {
            fixed: 'right',
            width: 40,
            render: (value: any, record: any) => (
              <ButtonAction edit onClick={(e) => handleEditRow(e, record)} />
            ),
          },
        ] as ColumnsTypeCustom)
      : []),
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
          value: item._id,
          displayName: item.product_name,
        })),
        totalItems: data.pagination.totalProducts,
      });
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateGetProductDetail = useMutation({
    mutationFn: ProductApis.getProductDetails,
    onSuccess: (data: any[]) => {
      // console.log('data', data);
      setOptionsProductDetail(
        data.map((proDetail) => ({
          label: proDetail.custom_attribute_values
            .map((item: any) => item.value)
            .join(', '),
          value: proDetail._id,
        })),
      );
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    if (user) {
      //   mutateProductByShopId.mutate({ id: user?._id, page: 0, page_size: 10 });
    }
  }, [isOpen, user]);

  const handleEditRow = (e: any, record: any) => {
    e.stopPropagation();
    console.log('record', record);
  };

  const onOk = () => {
    console.log('form', form.getFieldsValue());
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const handleAdd = () => {
    console.log('add order');
  };

  const onChangeProduct = (value: any) => {
    console.log('value', value);
    mutateGetProductDetail.mutate(value);
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
                <Form.Item className="mb-0" label="Giá" layout="horizontal">
                  <Input placeholder="Giá" />
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
                  name={'qunatity'}
                  layout="horizontal"
                >
                  <Input placeholder="Số lượng" />
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
            <TableComponent columns={columns} />
          </Content>

          {/* right */}
          <Content className="w-1/5 !mt-0">
            <Form.Item
              className="mb-2"
              label="Ngày"
              name={'date'}
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
            >
              <Input placeholder="Nhập nhà cung cấp/Khách hàng" />
            </Form.Item>
          </Content>
        </Flex>
      </Form>

      {/* import */}
      <UploadModal
        importId={IMPORT_ROUTE}
        downloadTemplate={{
          fileName: 'Nhập/xuất kho',
          url: URL_IMPORT_TEMPLATE_FILE.SALE_TEAM,
        }}
        open={isOpenImportModal}
        title={'Thêm hoá đơn nhập/xuất kho'}
        refetch={() => {
          // handleClearFilter();
          // refetchListRoute();
        }}
        setOpen={setIsOpenImportModal}
        handleConfirm={(data) => {
          // data.map((item: any) => {
          //   const newObj: { [key: string]: any } = {};
          //   for (const key in item) {
          //    console.log("")
          //   }
          //   return newObj;
          // }),
          console.log('data', data[0]);
          for (const key in data[0]) {
            console.log('key', key, data[0][key]);
          }
        }}
      />
    </Modal>
  );
};

export default memo(InventoryModalAdd);
