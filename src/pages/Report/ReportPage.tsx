import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem } from 'chart.js';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  Chart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export const options = {
  responsive: true,
  // scales: {
  //   y: {
  //     beginAtZero: true,
  //   },
  // tick: {
  //   font: {
  //     size: 26, // Kích thước phông chữ của nhãn trục x
  //   },
  // },
  // },
  plugins: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 34,
        },
        title: {
          font: {
            size: 34,
          },
        },
      },
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
      font: {
        size: 34,
      },
    },
  },
};

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const data = {
  labels,
  datasets: [
    {
      type: 'line' as const,
      label: 'Dataset 1',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      // data: labels.map(() => randomIntFromInterval(-1000, 1000)),
      //  data cứng không random
      data: [65, 59, 80, 81, 56, 55, 40],
      // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
    // {
    //   type: 'bar' as const,
    //   label: 'Dataset 2',
    //   backgroundColor: 'rgb(75, 192, 192)',
    //   // data: labels.map(() => randomIntFromInterval(-1000, 1000)),
    //   //  data cứng không random
    //   data: [28, -48, 40, -19, 86, 27, 90],
    //   // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    //   borderColor: 'white',
    //   borderWidth: 2,
    // },
    {
      type: 'bar' as const,
      label: 'Dataset 3',
      backgroundColor: 'rgb(53, 162, 235)',
      // data: labels.map(() => randomIntFromInterval(-1000, 1000)),
      data: [65, 59, -80, -81, 56, 55, 40],
      // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
  ],
};

const ReportPage = () => {
  const printDatasetAtEvent = (dataset: InteractionItem[]) => {
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;

    console.log(data.datasets[datasetIndex].label);
  };

  const printElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
  };

  const printElementsAtEvent = (elements: InteractionItem[]) => {
    if (!elements.length) return;

    elements.forEach((element) => {
      const { datasetIndex, index } = element;

      console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
    });
    // console.log(elements.length);
  };

  const chartRef = useRef<ChartJS>(null);

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    printDatasetAtEvent(getDatasetAtEvent(chart, event));
    printElementAtEvent(getElementAtEvent(chart, event));
    printElementsAtEvent(getElementsAtEvent(chart, event));
  };

  return (
    // <div className="h-full">
    //   <Chart
    //     ref={chartRef}
    //     type="bubble"
    //     onClick={onClick}
    //     options={options}
    //     data={data}
    //     className="!w-3/4 !h-1/3"
    //   />
    //   <Chart
    //     ref={chartRef}
    //     type="line"
    //     onClick={onClick}
    //     options={options}
    //     data={data}
    //     className="!w-3/4 !h-1/2"
    //   />
    // </div>
    <div>ReportPage</div>
  );
};

export default ReportPage;
