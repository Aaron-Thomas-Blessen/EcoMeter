import React from 'react';

const OverUsage = ({ smartMeterData, monthlyLimit }) => {
  const dailyOverUsage = smartMeterData.map(data => ({
    date: data.date,
    over_usage: data.total_load - (monthlyLimit / 30),
  }));

  return (
    <div>
      <h2>Over Usage</h2>
      <ul>
        {dailyOverUsage.map((data) => (
          <li key={data.date}>
            {data.date}: {data.over_usage > 0 ? data.over_usage : 0} kWh over usage
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverUsage;
