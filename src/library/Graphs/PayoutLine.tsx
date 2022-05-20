// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { planckToUnit } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { getGradient } from './Utils';
import { defaultThemes } from '../../theme/default';
import { useTheme } from '../../contexts/Themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutLine = (props: any) => {

  const { mode } = useTheme();
  const { network }: any = useApi();
  const { units } = network;
  const { payouts, height, background } = props;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 30,
          autoSkip: true,
        }
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: false,
        },
        grid: {
          drawBorder: false,
          color: defaultThemes.graphs.grid[mode],
          borderColor: defaultThemes.transparent[mode],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: `${network.unit} Payouts`,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return `${context.parsed.y} ${network.unit}`;
          },
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      }
    },
  };

  const data = {
    labels: payouts.map((item: any, index: number) => {
      return '';
    }),
    datasets: [
      {
        label: 'Price',
        // data: empty_data,
        data: payouts.map((item: any, index: number) => {
          return planckToUnit(item.amount, units);
        }),
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        },
        backgroundColor: defaultThemes.graphs.colors[2][mode],
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2,
      }
    ],
  };

  return (
    <div className='graph_line'
      style={{
        height: height === undefined ? 'auto' : height,
        background: background === undefined ? 'none' : background,
      }}>
      <Line options={options} data={data} />
    </div>
  )
}

export default PayoutLine;