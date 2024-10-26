import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const WeeklyUsagePieChart = ({ smartMeterData }) => {
  // Calculate total load for the last 7 days
  const lastSevenDaysData = smartMeterData.slice(-7);
  const totalLoad = lastSevenDaysData.reduce(
    (acc, curr) => acc + curr.total_load,
    0
  );

  // Prepare data for the pie chart
  const data = lastSevenDaysData.map((data) => ({
    date: data.date,
    load: data.total_load,
  }));

  // Define colors for each segment
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF5733",
    "#C70039",
    "#900C3F",
  ];

  return (
    <div>
      <h2>Weekly Usage Pie Chart</h2>
      <PieChart width={600} height={300}>
        <Pie
          data={data}
          dataKey="load"
          nameKey="date"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <p>Total Load for Last 7 Days: {totalLoad} kWh</p>
    </div>
  );
};

export default WeeklyUsagePieChart;
