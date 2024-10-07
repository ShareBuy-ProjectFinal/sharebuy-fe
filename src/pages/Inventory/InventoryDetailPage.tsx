import { Col, Flex, Row, Space, Typography } from 'antd';
import { RollBackIcon } from 'assets/svgs';
import ButtonDownload from 'components/Button/ButtonDownload';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataInvetory } from 'mocks/Inventory/data';
import React, { forwardRef, memo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from 'routes/Path';

const InventoryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const columns: ColumnsTypeCustom = [
    { title: 'STT', dataIndex: 'stt', width: 40 },
    { title: 'Mã sản phẩm', dataIndex: 'productCode', width: 100 },
    { title: 'Tên sản phẩm', dataIndex: 'productName', width: 200 },
    { title: 'Số lượng', dataIndex: 'quantity', width: 100 },
    { title: 'Giá nhập', dataIndex: 'price', width: 100 },
    { title: 'Thành tiền', dataIndex: 'total', width: 100 },
  ];

  useEffect(() => {
    console.log('id', id);
  }, []);

  const handleDownload = () => {
    // if (childRef && childRef.current) childRef.current.handleDownload();
  };

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex vertical>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(PATH.product)}
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

      <SpaceCustom>
        <Row>
          <Col>Ngày: </Col>
          <Col>12/12/2021</Col>
        </Row>
      </SpaceCustom>

      <SpaceCustom>
        <TableCustom
          // loading={mutateProductByShopId.isPending}
          columns={columns}
          rowClassName={'cursor-pointer'}
          dataSource={dataInvetory}
          // pagination={{
          //   current: page + 1,
          //   pageSize: page_size,
          //   total: mutateProductByShopId?.data?.pagination.totalProducts || 0,
          //   onChange: HocChangePagination(),
          // }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(PATH.inventoryDetailById(record._id || record.key)); //
              },
            };
          }}
          // className="cursor-pointer"
        />
      </SpaceCustom>
    </Flex>
  );
};

export default memo(InventoryDetailPage);
