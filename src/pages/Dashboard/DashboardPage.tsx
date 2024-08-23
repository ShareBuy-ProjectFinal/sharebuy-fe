import {
  Button,
  Col,
  Dropdown,
  Flex,
  Image,
  MenuProps,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import LableValue from 'components/Dashboard/LableValue';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import {
  dataRecentTransactions,
  dataTopProducts,
} from 'mockups/Dashboard/data';
import React, { useEffect } from 'react';

const optionTimes = [
  { label: '12 giờ trước', value: '12h' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: 'Hôm nay', value: 'today' },
];

const DashboardPage = () => {
  const columnRecentTransactions = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <span className="name-column">{text}</span>,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: any) => <span className="date-column">{date}</span>,
    },
    {
      title: 'Tổng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: any) => <span className="amount-column">{amount}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => (
        <Tag
          className={`status-tag ${status === 'Đã trả' ? 'paid' : 'pending'}`}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const columnTopProducts = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.image}
            alt={' '}
            style={{ width: '30px', borderRadius: '4px' }}
            preview={false}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Đơn vị bán',
      dataIndex: 'unitsSold',
      key: 'unitsSold',
    },
  ];

  useEffect(() => {
    // console.log('auth', auth);
  }, []);

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Dashboard
        </Typography.Text>
        <Button>Xuất</Button>
      </Flex>

      <Row justify={'start'} gutter={[25, 15]}>
        <Col className="w-1/5 min-w-[190px]">
          <LableValue
            label="Tổng doanh thu"
            value={'$10.540'}
            footer={'25.2%'}
          />
        </Col>
        <Col className="w-1/5 min-w-[190px]">
          <LableValue label="Đơn hàng" value={'10.540'} footer={'25.2%'} />
        </Col>
        <Col className="w-1/5 min-w-[190px]">
          <LableValue
            label="Lượt truy cập"
            value={'10.540'}
            footer={'25.2%'}
            isRaise={false}
          />
        </Col>
        <Col className="w-1/5 min-w-[190px]">
          <LableValue
            label="Khách hàng mới"
            value={'10.540'}
            footer={'25.2%'}
            isRaise={false}
          />
        </Col>
        <Col className="w-1/5 min-w-[190px]">
          <LableValue
            label="TNgười dùng hiện tại"
            value={'10.540'}
            footer={'25.2%'}
            isRaise={false}
          />
        </Col>
      </Row>

      <Row gutter={[25, 15]}>
        <Col span={18} className="min-w-[600px]">
          <Space
            direction="vertical"
            className="bg-white p-5 px-7 w-full rounded-lg min-h-[400px] shadow-md"
          >
            <Row justify="space-between">
              <LableCustom value={'Đặt hàng theo thời gian'} />
              <Select
                options={optionTimes}
                defaultValue={optionTimes[0].value}
                className="w-36"
              />
            </Row>
            <Row gutter={[15, 15]}>
              <Col>
                <LableValue
                  label={'Người mua hàng hôm qua'}
                  value={'1234'}
                  isStyle={false}
                />
              </Col>
              <Col>
                <LableValue
                  label={'Người mua hàng hôm nay'}
                  value={'1234'}
                  isStyle={false}
                />
              </Col>
            </Row>
          </Space>
        </Col>
        <Col span={6} className="min-w-[255px]">
          <Space
            className="bg-white p-5 px-7 w-full rounded-lg min-h-[400px] shadow-md"
            direction="vertical"
          >
            <LableCustom value={'Doanh số 1 tuần qua'} />
            <LableValue
              label={'Đơn hàng đã bán'}
              value={'1234'}
              isStyle={false}
            />
            <LableValue label={'Doanh thu'} value={'$12.234'} isStyle={false} />
          </Space>
        </Col>
      </Row>

      <Row gutter={[25, 15]}>
        <Col span={12}>
          <SpaceCustom direction="vertical">
            <LableCustom value={'Giao dịch gần đây'} />
            <Table
              columns={columnRecentTransactions}
              dataSource={dataRecentTransactions.slice(0, 5)}
              pagination={false}
            />
          </SpaceCustom>
        </Col>
        <Col span={12}>
          <SpaceCustom direction="vertical">
            <LableCustom value={'Những sản phẩm dẫn đầu'} />
            <Table
              columns={columnTopProducts}
              dataSource={dataTopProducts.slice(0, 5)}
              pagination={false}
            />
          </SpaceCustom>
        </Col>
      </Row>
    </Flex>
  );
};

export default DashboardPage;
