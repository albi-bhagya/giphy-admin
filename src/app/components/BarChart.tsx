"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: ChartData<"bar", number[], string>;
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: title,
      },
      datalabels: {
        formatter: function (value: any, context: any) {
          if (context.dataset.customLabels) {
            return context.dataset.customLabels[context.dataIndex];
          }

          return "";
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
