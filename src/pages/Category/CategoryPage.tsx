import { useMutation } from '@tanstack/react-query';
import {
  Col,
  Divider,
  Flex,
  Image,
  List,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography,
} from 'antd';
import CategoryApis from 'apis/CategoryApis';
import { AddBoxIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonCustom from 'components/Button/ButtonCustom';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import { dataCategoryMen, dataCategoryWomen } from 'mocks/Category/data';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';

const CategoryPage = () => {
  const navigate = useNavigate();

  const mutateCategory = useMutation<any>({
    mutationFn: CategoryApis.getAll,
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    mutateCategory.mutate();
  }, []);

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
      <Spin spinning={mutateCategory.isPending} size="large">
        {(mutateCategory.data || []).map((category: any, index: any) => {
          return (
            <Space
              direction="vertical"
              className="relative w-full"
              style={{ position: 'relative' }}
              key={index}
            >
              <ButtonCustom
                className="absolute top-1/2 right-3 z-50"
                value="Thêm"
                // icon={<AddBoxIcon />}
                size="middle"
                fill
              />
              <LableCustom value={category.name} />
              <Divider className="m-0 mb-0 border" />
              <Space className=" mt-0 mb-3  overflow-x-auto whitespace-nowrap w-full min-w-full hide-scrollbar">
                <List
                  dataSource={category.children || []}
                  renderItem={(item: any) => (
                    <List.Item
                      key={item._id}
                      className="!inline-block w-auto ml-1 mr-10 last:mr-1 !mt-0 !border-none cursor-pointer"
                      onClick={() =>
                        navigate(PATH.categoryDetailById(item._id))
                      }
                    >
                      <SpaceCustom
                        direction="vertical"
                        className="px-0 pt-0 m-0"
                      >
                        <Image
                          width={400}
                          height={250}
                          preview={false}
                          src={item.image} //thêm
                          // fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                          className="border object-cover"
                        />
                        <Space direction="vertical" size={5} className="ml-5">
                          <LableCustom value={item.name} />
                          <TextCustom
                            value={`${item.quantity || 5} sản phẩm`}
                          />
                        </Space>
                      </SpaceCustom>
                    </List.Item>
                  )}
                />
              </Space>
            </Space>
          );
        })}
      </Spin>
    </Space>
  );
};

export default CategoryPage;
