import { BackwardOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
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
  Tabs,
  TabsProps,
  Tag,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { RevenueApis } from 'apis/RevenueApis';
import { DownloadIcon } from 'assets/svgs';
import ButtonDownload from 'components/Button/ButtonDownload';
import LableValue from 'components/Dashboard/LableValue';
import SpaceCustom from 'components/Space/SpaceCustom';
import TableCustom from 'components/Table/TableCustom';
import LableCustom from 'components/Text/LableCustom';
import { useUser } from 'contexts/UserProvider';
import dayjs from 'dayjs';
import { dataRecentTransactions, dataTopProducts } from 'mocks/Dashboard/data';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import {
  formatDate,
  getStartAndEndOfMonth,
  getStartAndEndOfYear,
} from 'utils/function';
import { toastSucess } from 'utils/toats';
import RevenueByTimeTab from './children/RevenueByTimeTab';
import RevenueByProduct from './children/RevenueByProductTab';
import RevenueByCategoryTab from './children/RevenueByCategoryTab';

const optionTimes = [
  { label: '12 giờ trước', value: '12h' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: 'Hôm nay', value: 'today' },
];

const DashboardPage = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Doanh thu theo thời gian',
      children: <RevenueByTimeTab />,
    },
    {
      key: '2',
      label: 'Doanh thu theo sản phẩm',
      children: <RevenueByProduct />,
    },
    {
      key: '3',
      label: 'Doanh thu theo danh mục',
      children: <RevenueByCategoryTab />,
    },
  ];

  return (
    <Flex className="pt-7 pb-5 px-8" vertical gap={10}>
      <Flex justify="space-between" align="center">
        <Typography.Text className="text-3xl font-bold">
          Dashboard
        </Typography.Text>
        {/* <ButtonDownload fill onClick={handleDownload} /> */}
      </Flex>

      {/* <Row justify={'start'} gutter={[25, 15]}>
        <Col
          className="w-1/5 min-w-[190px] cursor-pointer"
          onClick={() => navigate(PATH.revenueDashboard)}
        >
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
      </Row> */}

      <Tabs defaultActiveKey="1" items={items} />

      {/* <Row gutter={[20, 15]}>
        <Col span={20} className="min-w-[600px]">
          <Space
            direction="vertical"
            className="bg-white p-5 px-7 w-full mb-3 rounded-lg shadow-md"
          >
            <Chart
              // ref={chartRef}
              type="bubble"
              // onClick={onClick}
              options={options}
              data={{
                labels: Array.from(
                  { length: dayjs(toDay).daysInMonth() },
                  (_, i) => i + 1,
                ),
                datasets: datasetsChartDay,
              }}
            />
          </Space>

          <Space
            direction="vertical"
            className="bg-white p-5 px-7 w-full rounded-lg shadow-md"
          >
            <Chart
              ref={chartRef}
              type="bubble"
              onClick={onClick}
              options={options}
              data={{
                labels: labels,
                datasets: datasetsChart,
              }}
            />
          </Space>
        </Col>
        <Col span={4} className="min-w-[200px] flex flex-col gap-3">
          <LableValue
            label="Tổng doanh thu"
            value={renvenueMonthSelected?.total_revenue || 0}
            // footer={'25.2%'}
          />
          <LableValue
            label="Đơn hàng"
            value={renvenueMonthSelected?.total_orders || 0}
            // footer={'25.2%'}
          />
          <LableValue
            label="Số khách hàng mua"
            value={renvenueMonthSelected?.total_customers || 0}
            // footer={'25.2%'}
            // isRaise={false}
          />
          <LableValue
            label="Số lượng sản phẩm"
            value={renvenueMonthSelected?.total_items_sold || 0}
            // footer={'25.2%'}
            // isRaise={false}
          />
          <LableValue
            label="Doanh thu trung bình"
            value={renvenueMonthSelected?.average_order_value || 0}
            // footer={'25.2%'}
            // isRaise={false}
          />
        </Col>
      </Row> */}
    </Flex>
  );
};

export default DashboardPage;
