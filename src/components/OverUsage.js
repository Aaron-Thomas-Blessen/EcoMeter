import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const OverUsage = ({ smartMeterData, monthlyLimit }) => {
  const suggestedUsagePerDay = monthlyLimit / 30;

  const dailyOverUsage = smartMeterData.map((data) => ({
    date: data.date,
    over_usage: data.total_load - suggestedUsagePerDay,
    isOver: data.total_load > suggestedUsagePerDay,
  }));

  return (
    <div>
      <h2>Over Usage</h2>
      <BarChart width={600} height={300} data={dailyOverUsage}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="over_usage"
          name="Over/Under Usage"
          fill="#82ca9d"
          isAnimationActive={false}
          barSize={20}
        >
          {dailyOverUsage.map((entry, index) => (
            <cell key={`cell-${index}`} fill={entry.isOver ? "red" : "green"} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default OverUsage;
