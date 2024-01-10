"use client";
import { ChartData } from "chart.js";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";
import IntervalSelector from "./IntervalSelector";
import format from "@/lib/dateFormatter";
import { ChartProps } from "@/lib/interfaces";

export default function KeywordsChart({ start, end }: ChartProps) {
  const [keywordData, setKeywordData] = useState<any>([]);
  const [interval, setInterval] = useState<String>("day");

  useEffect(() => {
    (async () => {
      const data = await fetch("http://localhost:3000/api/keywords", {
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

      setKeywordData(data);
    })();
  }, [interval, start, end]);

  const datasetArray = [];
  const colors = ["#7ED7C1", "#F0DBAF", "#A9B388", "#E7BCDE", "#F05941"];
  for (let i = 0; i < 5; i++) {
    datasetArray.push({
      label: `No. ${i + 1}`,
      data:
        keywordData.data?.map((el: any) => el.keywords[i]?.count || 0) || [],
      backgroundColor: colors[i],
    });
  }

  const data: ChartData<"bar", number[], string> = {
    labels:
      keywordData.data?.map((el: any) =>
        format(el.primary, el.secondary, interval)
      ) || [],
    datasets: datasetArray,
  };

  return (
    <div className="bg-gray-400 bg-opacity-20 rounded-xl p-2 w-full h-[40vh] relative ">
      <IntervalSelector
        setInterval={setInterval}
        interval={interval}
        className="absolute top-5 right-5"
      />
      <BarChart data={data} title={`Keywords per ${interval}`} />
    </div>
  );
}
