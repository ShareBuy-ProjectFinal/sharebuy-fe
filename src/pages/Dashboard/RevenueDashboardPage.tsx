import {
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { RollBackIcon } from 'assets/svgs';
import ButtonAdd from 'components/Button/ButtonAdd';
import ButtonDownload from 'components/Button/ButtonDownload';
import ButtonHeader from 'components/Button/ButtonHeader';
import LableValue from 'components/Dashboard/LableValue';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import LableCustom from 'components/Text/LableCustom';
import { dataRecentTransactions, dataTopProducts } from 'mocks/Dashboard/data';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { toastSucess } from 'utils/toats';

const optionTimes = [
  { label: '12 giờ trước', value: '12h' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: 'Hôm nay', value: 'today' },
];

const RevenueDashboardPage = () => {
  const navigate = useNavigate();

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

  const handleDownload = () => {
    toastSucess('Tải thành công');
  };

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={20}>
      <Space direction="vertical" size={2}>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(PATH.dashboard)}
        >
          <RollBackIcon />
          Quay lại
        </Space>
        <Flex justify="space-between" align="center">
          <Typography.Text className="text-3xl font-bold">
            Tổng doanh thu
          </Typography.Text>
          <Space>
            <ButtonDownload fill onClick={handleDownload} />
          </Space>
        </Flex>
      </Space>

      <Row gutter={[25, 15]}>
        <Col span={18} className="min-w-[600px]">
          <Space
            direction="vertical"
            className="bg-white p-5 px-7 w-full rounded-lg min-h-[400px] shadow-md"
          >
            <Row justify="space-between">
              <LableCustom value={'Báo cáo doanh thu'} />
              <Select
                options={optionTimes}
                defaultValue={optionTimes[0].value}
                className="w-36"
              />
            </Row>
            <Row gutter={[15, 15]}>
              <Col>
                <LableValue
                  label={'Doanh thu theo tuần'}
                  value={'1234'}
                  isStyle={false}
                  reverseOrder
                />
              </Col>
              <Col>
                <LableValue
                  label={'Khấu trừ thuế'}
                  value={'1234'}
                  isStyle={false}
                  reverseOrder
                />
              </Col>
              <Col>
                <LableValue
                  label={'Lượng hàng bán ra'}
                  value={'1234'}
                  isStyle={false}
                  reverseOrder
                />
              </Col>
            </Row>
          </Space>
        </Col>
        <Col span={6} className="min-w-[260px]">
          <Space
            className="bg-white p-5 px-7 w-full rounded-lg min-h-[400px] shadow-md"
            direction="vertical"
          >
            <LableCustom value={'Trạng thái doanh thu'} />
            <LableValue
              label={'Dự kiến doanh thu sau khi tất toán'}
              value={'1.500.000đ'}
              isStyle={false}
              reverseOrder
            />
            <LableValue
              label={'Tổng lợi nhuận'}
              value={'$12.234'}
              isStyle={false}
              reverseOrder
            />
            <Divider className="my-1 border" />
            <LableValue
              label={'Dự kiến doanh thu sau khi tất toán'}
              value={'1.500.000đ'}
              isStyle={false}
              reverseOrder
            />
            <LableValue
              label={'Tổng lợi nhuận'}
              value={'$12.234'}
              isStyle={false}
              reverseOrder
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={[25, 15]}>
        <Col span={12}>
          <SpaceCustom direction="vertical">
            <LableCustom value={'Giao dịch gần đây'} />
            <TableCustom
              columns={columnRecentTransactions}
              dataSource={dataRecentTransactions.slice(0, 5)}
              pagination={false}
            />
          </SpaceCustom>
        </Col>
        <Col span={12}>
          <SpaceCustom direction="vertical">
            <LableCustom value={'Những sản phẩm dẫn đầu'} />
            <TableCustom
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

export default RevenueDashboardPage;
