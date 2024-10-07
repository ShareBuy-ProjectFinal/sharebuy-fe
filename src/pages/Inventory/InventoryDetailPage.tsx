import { Col, Flex, Row, Space, Typography } from 'antd';
import { RollBackIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonDownload from 'components/Button/ButtonDownload';
import LableValue from 'components/Dashboard/LableValue';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import TextCustom from 'components/Text/TextCustom';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { dataInvetory } from 'mocks/Inventory/data';
import React, { forwardRef, memo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from 'routes/Path';

const InventoryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleEditRow = (e: any, record: any) => {
    e.stopPropagation();
    console.log('record', record);
  };

  const columns: ColumnsTypeCustom = [
    { title: 'STT', dataIndex: 'stt', width: 40 },
    { title: 'Mã sản phẩm', dataIndex: 'productCode', width: 100 },
    { title: 'Tên sản phẩm', dataIndex: 'productName', width: 200 },
    { title: 'Số lượng', dataIndex: 'quantity', width: 100 },
    { title: 'Giá nhập', dataIndex: 'price', width: 100 },
    { title: 'Thành tiền', dataIndex: 'total', width: 100 },
    {
      fixed: 'right',
      width: 40,
      render: (__, record) => (
        <ButtonAction edit onClick={(e) => handleEditRow(e, record)} />
      ),
    },
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

      <SpaceCustom className="w-full">
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
      </SpaceCustom>

      <SpaceCustom>
        <TableCustom
          // loading={mutateProductByShopId.isPending}
          columns={columns}
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
                console.log('first record', record);
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
