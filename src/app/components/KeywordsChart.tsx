"use client";
import { ChartData } from "chart.js";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";
import IntervalSelector from "./IntervalSelector";
import format from "@/lib/dateFormatter";
import { ChartProps } from "@/lib/interfaces";
import ReloadButton from "./ReloadButton";

export default function KeywordsChart({ start, end }: ChartProps) {
  const [keywordData, setKeywordData] = useState<any>([]);
  const [interval, setInterval] = useState<String>("day");
  const [reload, toggleReload] = useState<boolean>(false);

  const handleReload = () => {
    toggleReload(!reload);
  };

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
  }, [interval, start, end, reload]);

  const datasetArray = [];
  const colors = ["#7ED7C1", "#F0DBAF", "#A9B388", "#E7BCDE", "#7BD3EA"];
  for (let i = 0; i < 5; i++) {
    datasetArray.push({
      label: `No. ${i + 1}`,
      data:
        keywordData.data?.map((el: any) => el.keywords[i]?.count || 0) || [],
      customLabels:
        keywordData.data?.map((el: any) => el.keywords[i]?.keyword || 0) || [],
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
    <div className="bg-gray-400 bg-opacity-20 rounded-xl p-4 py-8 w-full h-[40vh] relative ">
      <div className="absolute top-5 right-5 flex flex-row items-center gap-4">
        <IntervalSelector setInterval={setInterval} interval={interval} />
        <ReloadButton handler={handleReload} />
      </div>
      <BarChart data={data} title={`Top keywords per ${interval}`} />
    </div>
  );
}
