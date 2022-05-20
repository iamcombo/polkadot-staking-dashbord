// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { defaultThemes } from '../../../theme/default';
import { useApi } from '../../../contexts/Api';
import { useTheme } from '../../../contexts/Themes';

ChartJS.register(ArcElement, Tooltip, Legend);

export const BondedGraph = (props: any) => {

  const { mode } = useTheme();
  const { network }: any = useApi();

  let { active, unlocking, remaining, total } = props;

  let zeroBalance = false;
  if (total === 0 || total === undefined) {
    remaining = -1;
    zeroBalance = true;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spacing: zeroBalance ? 0 : 2,
    plugins: {
      legend: {
        padding: {
          right: 20,
        },
        display: true,
        position: 'left' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          color: defaultThemes.text.primary[mode],
          font: {
            size: 15,
            weight: '500',
          },
        },
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed === -1 ? 0 : context.parsed} ${network.unit}`;
          },
        }
      }
    },
    cutout: '70%',
  };

  const data = {
    labels: ['Active', 'Unlocking', 'Free'],
    datasets: [
      {
        label: network.unit,
        data: [active, unlocking, remaining],
        backgroundColor: [
          defaultThemes.graphs.colors[0][mode],
          defaultThemes.graphs.colors[1][mode],
          defaultThemes.graphs.colors[2][mode],
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Doughnut
      options={options}
      data={data}
    />
  );
}

export default BondedGraph;