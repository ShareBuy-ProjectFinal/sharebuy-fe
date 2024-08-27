import {
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from 'antd';
import { RollBackIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonCustom from 'components/Button/ButtonCustom';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { toastSucess } from 'utils/toats';

const optionCategorys = [
  { label: 'Sắc đẹp', value: 'beauty' },
  { label: 'Sức khỏe', value: 'health' },
  { label: 'Thời trang nam', value: 'fashionMen' },
  { label: 'Thời trang nữ', value: 'fashionWomen' },
];

//áo dài, áo sơ mi, quần đuồi, quần lót
const optionPhanLoais = [
  { label: 'Áo dài', value: 'aoDai' },
  { label: 'Áo sơ mi', value: 'aoSoMi' },
  { label: 'Quần đuồi', value: 'quanDuoi' },
  { label: 'Quần lót', value: 'quanLot' },
];

const optionBrand = [
  { label: 'Adidas', value: 'adidas' },
  { label: 'Nike', value: 'nike' },
  { label: 'Puma', value: 'puma' },
  { label: 'Converse', value: 'converse' },
];
const AddProductPage = () => {
  const navigate = useNavigate();
  return (
    <Space className="pt-7 pb-7 px-8 w-full" direction="vertical">
      <Space direction="vertical" size={2}>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(PATH.product)}
        >
          <RollBackIcon />
          Quay lại
        </Space>
        <Typography.Text className="text-3xl font-bold">
          Thêm sản phẩm
        </Typography.Text>
      </Space>

      <Form layout="vertical" className="mt-2">
        <Flex className="w-full" gap={25}>
          {/* right */}
          <SpaceCustom className="px-8" width="60%" direction="vertical">
            <Space direction="vertical" className="w-full" size={0}>
              <LableCustom value={'Thông tin sản phẩm'} />
              <Form.Item label="Sản phẩm" className="mt-1 mb-3">
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
              <Form.Item label="Mô tả sản phẩm" className="my-0">
                <Input.TextArea placeholder="Nhập tên sản phẩm" rows={4} />
              </Form.Item>
            </Space>

            <Divider className="mt-4 mb-1 border" />
            <Space direction="vertical" className="w-full" size={0}>
              <LableCustom value={'Hình ảnh'} />
              <Form.Item className="mt-3 my-0">
                <Upload.Dragger multiple accept="image/*">
                  <Space direction="vertical" className="m-3">
                    <ButtonCustom size="small">Thêm ảnh</ButtonCustom>
                    <TextCustom value="Kéo thả hoặc chọn ảnh từ máy tính" />
                  </Space>
                </Upload.Dragger>
              </Form.Item>
            </Space>

            <Divider className="mt-4 mb-1 border" />
            <Space direction="vertical" className="w-full" size={0}>
              <LableCustom value={'Giá'} />
              <Row justify={'space-between'} className="mt-1" gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item label="Giá sản phẩm" className="w-full mb-0">
                    <Input placeholder="Nhập giá" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Giá giảm" className="w-full mb-0">
                    <Input placeholder="Nhập giá giảm" />
                  </Form.Item>
                </Col>
              </Row>
            </Space>

            <Divider className="mt-4 mb-1 border" />
            <Space direction="vertical" className="w-full" size={0}>
              <LableCustom value={'Ngành hàng'} />
              <Row justify={'space-between'} className="mt-1" gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item label="ABC??" className="w-full mb-0">
                    <Select
                      placeholder="Chọn ngành hàng"
                      options={optionCategorys}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Số lượng" className="w-full mb-0">
                    <Input placeholder="Nhập số lượng" />
                  </Form.Item>
                </Col>
              </Row>
            </Space>

            <Divider className="mt-4 mb-1 border" />
            <Space direction="vertical" className="w-full" size={0}>
              <Form.Item className="w-1/2 mb-0 mt-1">
                <Select placeholder="Chọn chứng từ" options={optionCategorys} />
              </Form.Item>
              <Form.Item className="mt-3 my-0">
                <Upload.Dragger multiple accept="image/*,.pdf">
                  <Space direction="vertical" className="m-3">
                    <ButtonCustom size="small">Thêm ảnh hoặc PDF</ButtonCustom>
                    <TextCustom value="Kéo thả hoặc chọn ảnh từ máy tính" />
                  </Space>
                </Upload.Dragger>
              </Form.Item>
            </Space>

            <Divider className="mt-4 mb-1 border" />
            <Space direction="vertical" className="w-full m-0" size={0}>
              <LableCustom value={'Thông tin chi tiết'} />
              <Form.Item className="w-full mt-1 mb-0">
                <Space size={3} align="center">
                  <Switch className="scale-[0.8]" />
                  <TextCustom value={'Sản phẩm này có nhiều lựa chọn'} />
                </Space>
              </Form.Item>
            </Space>

            <Divider className="mt-0 mb-1 border" />
            <Space direction="vertical" className="w-full" size={0}>
              <LableCustom value={'Phí vận chuyển'} />
              <Row justify={'space-between'} gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item label="Khối lượng" className="w-full mb-0">
                    <Input placeholder="Nhập số" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Kích thước" className="w-full mb-0">
                    <Space>
                      <Form.Item className="mb-0">
                        <Input placeholder="W (cm)" />
                      </Form.Item>
                      <Form.Item className="mb-0">
                        <Input placeholder="H (cm)" />
                      </Form.Item>
                      <Form.Item className="mb-0">
                        <Input placeholder="L (cm)" />
                      </Form.Item>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={'space-between'} gutter={[20, 20]} align={'bottom'}>
                <Col span={12}>
                  <Form.Item label="Thành phố" className="w-full mb-0 mt-3">
                    <Select
                      options={optionCategorys}
                      placeholder="Chọn thành phố"
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className="flex justify-end items-end h-full">
                  <LableCustom
                    value={'Phí vận chuyển dự kiến: 22.000đ'}
                    className="mb-0"
                  />
                </Col>
              </Row>
            </Space>
          </SpaceCustom>

          {/* left */}
          <Flex
            vertical
            className="w-[40%]"
            justify="space-between"
            align="flex-end"
          >
            {/* top left */}
            <Space direction="vertical" className="w-full" size={20}>
              <SpaceCustom direction="vertical">
                <LableCustom value={'Phân loại'} />
                <Form.Item>
                  <Select
                    placeholder="Chọn danh mục"
                    options={optionPhanLoais}
                    mode="multiple"
                    allowClear
                  />
                  <div
                    className="mt-2 pl-2 py-[5px] text-[#515DEF] font-semibold cursor-pointer hover:opacity-50"
                    onClick={() => toastSucess('Tạo mới danh mục thành công')}
                  >
                    Tạo mới danh mục
                  </div>
                </Form.Item>
              </SpaceCustom>
              <SpaceCustom direction="vertical">
                <LableCustom value={'Thương hiệu'} />
                <Form.Item>
                  <Select
                    placeholder="Chọn thương hiệu"
                    options={optionBrand}
                    mode="multiple"
                    allowClear
                  />
                  <div
                    className="mt-2 pl-2 py-[5px] text-[#515DEF] font-semibold cursor-pointer hover:opacity-50"
                    onClick={() =>
                      toastSucess('Tạo mới thương hiệu thành công')
                    }
                  >
                    Tạo mới thương hiệu
                  </div>
                </Form.Item>
              </SpaceCustom>
              <SpaceCustom direction="vertical">
                <LableCustom value={'Tags'} />
                <Form.Item>
                  <Select
                    placeholder="Nhập tên tags"
                    options={optionBrand}
                    mode="multiple"
                    allowClear
                  />
                </Form.Item>
              </SpaceCustom>
            </Space>

            {/* bottom left */}
            <Space className="mr-4 mb-3" size={15}>
              <ButtonCustom size="px-9 py-2" value="Huỷ" />
              <ButtonCustom size="px-9 py-2" value="Lưu" fill />
            </Space>
          </Flex>
        </Flex>
      </Form>
    </Space>
  );
};

export default AddProductPage;
