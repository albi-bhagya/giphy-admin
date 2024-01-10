"use client";
import { ChartData } from "chart.js";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";
import IntervalSelector from "./IntervalSelector";
import format from "@/lib/dateFormatter";
import { ChartProps } from "@/lib/interfaces";

export default function UserChart({ start, end }: ChartProps) {
  const [userData, setUserData] = useState<any>([]);
  const [interval, setInterval] = useState<String>("day");

  useEffect(() => {
    (async () => {
      const data = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: start,
          end: end,
          interval: interval,
        }),
      }).then((res) => res.json());

      setUserData(data);
    })();
  }, [interval, start, end]);

  const data: ChartData<"bar", number[], string> = {
    labels:
      userData.data?.map((el: any) =>
        format(el.primary, el.secondary, interval)
      ) || [],
    datasets: [
      {
        label: "Active users",
        data: userData.data?.map((el: any) => el.count) || [],
        backgroundColor: "#86A7FC",
      },
    ],
  };

  return (
    <div className="bg-gray-400 bg-opacity-20 rounded-xl p-2 w-full h-[40vh] relative">
      <IntervalSelector
        setInterval={setInterval}
        interval={interval}
        className="absolute top-5 right-5"
      />
      <BarChart data={data} title={`Active users per ${interval}`} />
    </div>
  );
}
