import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';
import LableValue from 'components/Dashboard/LableValue';
import { Col, Row, Select, Space } from 'antd';
import { Chart } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import { RevenueApis } from 'apis/RevenueApis';
import { getStartAndEndOfMonth, getStartAndEndOfYear } from 'utils/function';
import { useUser } from 'contexts/UserProvider';

const optionMonthSelect = [
  { label: 'Tháng 1', value: 1 },
  { label: 'Tháng 2', value: 2 },
  { label: 'Tháng 3', value: 3 },
  { label: 'Tháng 4', value: 4 },
  { label: 'Tháng 5', value: 5 },
  { label: 'Tháng 6', value: 6 },
  { label: 'Tháng 7', value: 7 },
  { label: 'Tháng 8', value: 8 },
  { label: 'Tháng 9', value: 9 },
  { label: 'Tháng 10', value: 10 },
  { label: 'Tháng 11', value: 11 },
  { label: 'Tháng 12', value: 12 },
];

const RevenueByProduct = () => {
  const { user } = useUser();
  const [dataChartMonth, setDataChartMonth] = useState<any>(undefined);
  const [dataChartYear, setDataChartYear] = useState<any>(undefined);

  const toDay = new Date();
  const [monthSelected, setMonthSelected] = useState<any>(toDay.getMonth() + 1);
  const [yearSelected, setYearSelected] = useState<any>(toDay.getFullYear());

  const [dayStartOfYear, dayEndOfYear] = getStartAndEndOfYear(
    new Date(yearSelected, monthSelected - 1),
  );
  const [startDayofMonth, endDayOfMonth] = getStartAndEndOfMonth(
    new Date(yearSelected, monthSelected - 1),
  );
  const [renvenueMonthSelected, setRenvenueMonthSelected] = useState<any>();

  const chartRef = useRef<ChartJS>(null);
  const [optionYearSelect, setOptionYearSelect] = useState<any>([]);

  const mutateByProduct = useMutation({
    mutationFn: RevenueApis.getByProduct,
    onSuccess: (res, variables) => {
      // console.log('res', res);
      if (variables.type === 'month') {
        const labels: any[] = [];
        const data: any[] = [];
        res?.revenue_by_product?.forEach((item: any, index: number) => {
          if (index <= 5) {
            index == 5
              ? labels.push('Khác')
              : labels.push(item?.product?.product_name);
            data.push(item?.total_revenue);
          } else {
            data[5] += item?.total_revenue;
          }
        });

        setDataChartMonth({
          labels,
          datasets: [
            {
              label: 'Doanh thu',
              data,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#FFA500',
                'rgba(255, 99, 132, 0.2)',
                'gray',
              ],
              hoverOffset: 4,
            },
          ],
        });
      } else {
        const labels: any[] = [];
        const data: any[] = [];
        res?.revenue_by_product?.forEach((item: any, index: number) => {
          if (index <= 5) {
            index == 5
              ? labels.push('Khác')
              : labels.push(item?.product?.product_name);
            data.push(item?.total_revenue);
          } else {
            data[5] += item?.total_revenue;
          }
        });

        setDataChartYear({
          labels,
          datasets: [
            {
              label: 'Doanh thu',
              data,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#FFA500',
                'rgba(255, 99, 132, 0.2)',
                'gray',
              ],
              hoverOffset: 4,
            },
          ],
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const optionNew = [];
    for (let i = 2023; i <= toDay.getFullYear(); i++) {
      optionNew.push({ label: i, value: i });
    }
    setOptionYearSelect(optionNew);

    if (user) {
      mutateByProduct.mutate({
        type: 'month',
        shop_id: user._id,
        start_date: startDayofMonth,
        end_date: endDayOfMonth,
      });
      mutateByProduct.mutate({
        type: 'year',
        shop_id: user._id,
        start_date: dayStartOfYear,
        end_date: dayEndOfYear,
      });
    }
  }, [user, monthSelected, yearSelected]);

  const optionYears = {
    // responsive: true,
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14,
          },
          title: {
            font: {
              size: 14,
            },
          },
        },
        position: 'bottom' as const,
        align: 'start' as const,
      },
      title: {
        display: true,
        text: `Doanh thu năm ${yearSelected}`,
        font: {
          size: 24,
        },
      },
    },
  };

  const optionMonth = {
    // responsive: true,
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14,
          },
          title: {
            font: {
              size: 14,
            },
          },
        },
        position: 'bottom' as const,
        align: 'start' as const,
      },
      title: {
        display: true,
        text: `Doanh thu tháng ${monthSelected}`,
        font: {
          size: 24,
        },
      },
    },
  };

  return (
    <Row gutter={[20, 15]}>
      <Col span={20} className="min-w-[600px]">
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Space
              direction="vertical"
              className="bg-white p-5 px-7 w-full rounded-lg shadow-md"
            >
              {dataChartMonth && (
                <Chart
                  ref={chartRef}
                  type="pie"
                  options={optionMonth}
                  data={dataChartMonth}
                />
              )}
            </Space>
          </Col>
          <Col span={12}>
            <Space
              direction="vertical"
              className="bg-white p-5 px-7 w-full rounded-lg shadow-md"
            >
              {dataChartYear && (
                <Chart
                  ref={chartRef}
                  type="pie"
                  options={optionYears}
                  data={dataChartYear}
                />
              )}
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={4}>
        <Select
          className="w-full mb-3"
          options={optionMonthSelect}
          value={monthSelected}
          onChange={(value) => setMonthSelected(value)}
        />
        <Select
          className="w-full"
          options={optionYearSelect}
          value={yearSelected}
          onChange={(value) => setYearSelected(value)}
        />
      </Col>
      {/* <Col span={4} className="min-w-[200px] flex flex-col gap-3">
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
      </Col> */}
    </Row>
  );
};

export default RevenueByProduct;
