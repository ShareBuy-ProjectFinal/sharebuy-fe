import {
  Col,
  Divider,
  Flex,
  Image,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import { dataCategoryMen, dataCategoryWomen } from 'mocks/Category/data';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';

const CategoryPage = () => {
  const navigate = useNavigate();

  const handleAddOrder = () => {
    navigate(PATH.addProduct);
  };

  return (
    <Space className="pt-7 pb-7 px-8 w-full" direction="vertical">
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Phân loại
        </Typography.Text>
        <Space>
          <ButtonAdd onClick={handleAddOrder} fill />
        </Space>
      </Flex>

      {/* category Men */}
      <Space direction="vertical" className="w-full">
        <LableCustom value={'Thời trang nam'} />
        <Divider className="m-0 mb-2 border" />
        <Space
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none',
          }}
          className="mt-0 mb-3 overflow-x-auto whitespace-nowrap w-full min-w-full hide-scrollbar"
        >
          <List
            dataSource={dataCategoryMen}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                className="!inline-block w-auto mr-10 last:mr-0 !mt-0 !border-none"
              >
                <SpaceCustom direction="vertical" className="px-0 pt-0 m-0">
                  <Image
                    width={400}
                    height={250}
                    preview={false}
                    src="" //thêm
                    // fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    className="border object-cover"
                  />
                  <Space direction="vertical" size={5} className="ml-5">
                    <LableCustom value={item.name} />
                    <TextCustom value={item.quantity} />
                  </Space>
                </SpaceCustom>
              </List.Item>
            )}
          />
        </Space>
      </Space>

      {/* category Women */}
      <Space direction="vertical" className="w-full">
        <LableCustom value={'Thời trang Nữ'} />
        <Divider className="m-0 mb-2 border" />
        <Space
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none',
          }}
          className="mt-0 mb-3 overflow-x-auto whitespace-nowrap w-full min-w-full hide-scrollbar"
        >
          <List
            dataSource={dataCategoryWomen}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                className="!inline-block w-auto mr-10 last:mr-0 !mt-0 !border-none"
                onClick={() => navigate(`${PATH.category}/${item.id}`)}
              >
                <SpaceCustom direction="vertical" className="px-0 pt-0 m-0">
                  <Image
                    width={400}
                    height={250}
                    preview={false}
                    src="" //thêm
                    // fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    className="border object-cover"
                  />
                  <Space direction="vertical" size={5} className="ml-5">
                    <LableCustom value={item.name} />
                    <TextCustom value={item.quantity} />
                  </Space>
                </SpaceCustom>
              </List.Item>
            )}
          />
        </Space>
      </Space>
    </Space>
  );
};

export default CategoryPage;
