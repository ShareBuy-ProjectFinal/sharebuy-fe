import { useMutation } from '@tanstack/react-query';
import {
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  List,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
  Upload,
} from 'antd';
import ProductApis from 'apis/ProductApis';
import { RollBackIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonCustom from 'components/Button/ButtonCustom';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
const CategoryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const mutateProductBycategoryId = useMutation({
    mutationFn: ProductApis.getByCategoryID,
    onSuccess: (data: any) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    mutateProductBycategoryId.mutate({ id });
  }, []);
  return (
    <Space className="pt-7 pb-7 px-8 w-full" direction="vertical">
      <Space direction="vertical" size={2}>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(`${PATH.category}`)}
        >
          <RollBackIcon />
          Quay lại
        </Space>
        <Typography.Text className="text-3xl font-bold">{id}</Typography.Text>
      </Space>

      <Form layout="vertical" className="mt-2">
        <Flex className="w-full" gap={25}>
          {/* right */}
          {/* <Spin
            spinning={mutateProductBycategoryId.isPending}
            className="w-full"
          > */}
          <SpaceCustom width="60%" classNames={{ item: 'w-full' }}>
            <div className="overflow-y-auto whitespace-nowrap max-h-screen hide-scrollbar">
              <List
                dataSource={
                  mutateProductBycategoryId?.data?.data?.a || Array(10).fill({})
                }
                renderItem={(item: any, index: number) => (
                  <List.Item
                    key={item._id}
                    className="!justify-start gap-2 cursor-pointer border rounded-md shadow-md !px-4 !py-2 mb-3 last:mb-1"
                    onClick={() => navigate(PATH.product)}
                  >
                    <Image
                      width={50}
                      height={50}
                      preview={false}
                      src={item.image} //thêm
                      // fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                      className="border rounded-md object-cover"
                    />
                    <TextCustom value={`${item.quantity || index} sản phẩm`} />
                  </List.Item>
                )}
              />
            </div>
          </SpaceCustom>
          {/* </Spin> */}

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
            <Space className="mr-4 mb-3 mt-2" size={15}>
              <ButtonCustom size="px-9 py-2" value="Huỷ" />
              <ButtonCustom size="px-9 py-2" value="Lưu" fill />
            </Space>
          </Flex>
        </Flex>
      </Form>
    </Space>
  );
};

export default CategoryDetailPage;
