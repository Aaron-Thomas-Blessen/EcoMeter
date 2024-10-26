import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const TotalUsageGraph = ({ smartMeterData }) => {
  // Prepare data for the bar chart
  const data = smartMeterData.map((data) => ({
    date: data.date,
    total_load: data.total_load,
  }));

  return (
    <div>
      <h2>Total Usage Bar Graph</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_load" fill="red" />
      </BarChart>
    </div>
  );
};

export default TotalUsageGraph;
