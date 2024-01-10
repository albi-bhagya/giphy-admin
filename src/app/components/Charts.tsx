"use client";
import { FormEvent, useRef, useState } from "react";
import FavoriteChart from "./FavoriteChart";
import KeywordsChart from "./KeywordsChart";
import UserChart from "./UserChart";
import { one_day, seven_days } from "@/lib/constants";

export default function Charts() {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const [start, setStart] = useState<Date>(new Date(Date.now() - seven_days));
  const [end, setEnd] = useState<Date>(new Date());

  const handleDateChange = (e: FormEvent) => {
    e.preventDefault();

    if (startRef.current && endRef.current) {
      if (new Date(startRef.current.value) > new Date(endRef.current.value)) {
        const temp = startRef.current.value;
        startRef.current.value = endRef.current.value;
        endRef.current.value = temp;
      }

      setStart(new Date(startRef.current.value));
      setEnd(new Date(Date.parse(endRef.current.value) + one_day));
    }
  };

  return (
    <>
      <form
        className="flex flex-row items-stretch my-4"
        onSubmit={handleDateChange}
      >
        <div className="mr-8">
          <p>From</p>
          <input
            type="date"
            name="start"
            ref={startRef}
            defaultValue={start.toISOString().split("T")[0]}
            className="bg-transparent outline rounded-md p-1"
          />
        </div>
        <div className="mr-8">
          <p>To</p>
          <input
            type="date"
            name="end"
            ref={endRef}
            defaultValue={end.toISOString().split("T")[0]}
            className="bg-transparent outline rounded-md p-1"
          />
        </div>
        <button type="submit" className="bg-white text-black p-4 rounded-lg">
          Filter
        </button>
      </form>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
        <UserChart start={start} end={end} />
        <FavoriteChart start={start} end={end} />
        <KeywordsChart start={start} end={end} />
      </div>
    </>
  );
}
