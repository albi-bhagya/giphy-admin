"use client";

import { ChangeEvent } from "react";

export default function IntervalSelector({
  interval,
  setInterval,
  className = "",
}: any) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setInterval(e.target.value);
  };

  return (
    <select
      name="interval"
      value={interval}
      onChange={handleChange}
      className={`rounded-lg bg-transparent text-xs text-gray-400 font-bold outline-none ${className}`}
    >
      <option value="day">Daily</option>
      <option value="week">Weekly</option>
      <option value="month">Monthly</option>
    </select>
  );
}
