import React, { useState } from "react";
import { Calendar } from "react-calendar";

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📅 Calendar</h2>
      <Calendar onChange={setDate} value={date} className="w-full" />
    </div>
  );
};

export default CalendarWidget;
