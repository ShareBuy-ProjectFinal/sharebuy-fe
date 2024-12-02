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
import { Chart as ChartJS } from 'chart.js';

const optionTimes = [
  { label: '12 giờ trước', value: '12h' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: 'Hôm nay', value: 'today' },
];

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 20,
        },
        title: {
          font: {
            size: 34,
          },
        },
      },
      position: 'bottom' as const,
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Line Chart',
    //   font: {
    //     size: 34,
    //   },
    // },
  },
};

const labels = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [datasetsChart, setDatasetsChart] = useState<any>([]);
  const [datasetsChartDay, setDatasetsChartDay] = useState<any>([]);

  const toDay = new Date();
  const [startDayofMonth, endDayOfMonth] = getStartAndEndOfMonth(new Date());
  const [dayStartOfYear, dayEndOfYear] = getStartAndEndOfYear(toDay);
  const [renvenueMonthSelected, setRenvenueMonthSelected] = useState<any>();

  const mutateGetRevenueByTime = useMutation({
    mutationFn: RevenueApis.getByTime,
    onSuccess: (data, variables) => {
      if (variables.type === 'month') {
        setDatasetsChart([
          {
            type: 'bar' as const,
            label: `Doanh thu ${dayjs(toDay).year()}`,
            data: data?.revenue_by_time?.map((item: any) => item.total_revenue),
            backgroundColor: 'rgb(53, 162, 235)',
          },
        ]);
      } else {
        setDatasetsChartDay([
          {
            type: 'bar' as const,
            label: `Doanh thu tháng ${dayjs(variables.start_date).month() + 1}`,
            data: data?.revenue_by_time?.map((item: any) => item.total_revenue),
            backgroundColor: 'rgb(53, 162, 235)',
          },
        ]);
      }
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateGetOverviewByTime = useMutation({
    mutationFn: RevenueApis.getOverviewByTime,
    onSuccess: (data, variables) => {
      setRenvenueMonthSelected(data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    // console.log('auth', auth);
    if (user) {
      mutateGetRevenueByTime.mutate({
        type: 'month',
        shop_id: user?._id,
        start_date: formatDate(dayStartOfYear, 'YYYY-MM-DD'),
        end_date: formatDate(dayEndOfYear, 'YYYY-MM-DD'),
        interval: 'month',
      });

      mutateGetRevenueByTime.mutate({
        type: 'day',
        shop_id: user?._id,
        start_date: formatDate(startDayofMonth, 'YYYY-MM-DD'),
        end_date: formatDate(endDayOfMonth, 'YYYY-MM-DD'),
        interval: 'day',
      });

      mutateGetOverviewByTime.mutate({
        shop_id: user?._id,
        start_date: formatDate(startDayofMonth, 'YYYY-MM-DD'),
        end_date: formatDate(endDayOfMonth, 'YYYY-MM-DD'),
      });
    }
  }, [user]);

  const handleDownload = () => {
    toastSucess('Tải thành công');
  };

  const chartRef = useRef<ChartJS>(null);

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }
    const element = getElementAtEvent(chart, event);
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    const [startDay, endDay] = getStartAndEndOfMonth(toDay, index);

    mutateGetRevenueByTime.mutate({
      type: 'day',
      shop_id: user?._id,
      start_date: formatDate(startDay, 'YYYY-MM-DD'),
      end_date: formatDate(endDay, 'YYYY-MM-DD'),
      interval: 'day',
    });

    mutateGetOverviewByTime.mutate({
      shop_id: user?._id,
      start_date: formatDate(startDay, 'YYYY-MM-DD'),
      end_date: formatDate(endDay, 'YYYY-MM-DD'),
    });
  };

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

      <Row gutter={[20, 15]}>
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
      </Row>
    </Flex>
  );
};

export default DashboardPage;
