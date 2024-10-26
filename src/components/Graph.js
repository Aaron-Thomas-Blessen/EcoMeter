import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Graph = ({ smartMeterData, monthlyLimit }) => {
  const initialSuggestedUsage = monthlyLimit / 30; // Initial daily suggested usage

  const processedData = smartMeterData.reduce((acc, data, index, array) => {
    let suggestedUsage = initialSuggestedUsage;

    if (index > 0) {
      const prevData = acc[index - 1];
      const prevTotalLoad = prevData.total_load;
      const prevSuggestedUsage = prevData.suggested_usage;

      // Adjust suggested usage based on previous day's total load
      if (prevTotalLoad > prevSuggestedUsage) {
        suggestedUsage = prevSuggestedUsage - 0.5; // Decrease if over
      } else if (prevTotalLoad < prevSuggestedUsage) {
        suggestedUsage = prevSuggestedUsage + 0.3; // Increase if under
      }

      // Ensure suggested usage stays within reasonable bounds
      suggestedUsage = Math.max(suggestedUsage, initialSuggestedUsage * 0.5);
      suggestedUsage = Math.min(suggestedUsage, initialSuggestedUsage * 1.5);
    }

    acc.push({
      date: data.date,
      total_load: data.total_load,
      suggested_usage: parseFloat(suggestedUsage.toFixed(2)),
    });

    return acc;
  }, []);

  return (
    <div>
      <h2>Energy Usage Graph</h2>
      <LineChart width={600} height={300} data={processedData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_load" stroke="red" name="Actual Usage" />
        <Line type="monotone" dataKey="suggested_usage" stroke="blue" name="Suggested Usage" />
      </LineChart>
    </div>
  );
};

export default Graph;
