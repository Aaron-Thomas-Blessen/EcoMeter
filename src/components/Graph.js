import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const Graph = ({ smartMeterData, monthlyLimit }) => {
  const suggestedUsage = monthlyLimit / 30; // Daily suggested usage

  const processedData = smartMeterData.map((data) => ({
    date: data.date,
    total_load: data.total_load,
    suggested_usage: suggestedUsage,
  }));

  return (
    <div>
      <h2>Energy Usage Graph</h2>
      <LineChart width={600} height={300} data={processedData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Line type="monotone" dataKey="total_load" stroke="red" />
        <Line type="monotone" dataKey="suggested_usage" stroke="blue" />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default Graph;
