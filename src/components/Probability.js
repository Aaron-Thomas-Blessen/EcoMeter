import React from 'react';

const Probability = ({ smartMeterData, monthlyLimit }) => {
  const totalUsage = smartMeterData.reduce((acc, curr) => acc + curr.total_load, 0);
  const probability = (1 - (totalUsage / monthlyLimit)) * 100;

  return (
    <div>
      <h2>Probability of Staying Under Limit</h2>
      <p>{probability >= 0 ? probability.toFixed(2) : 0}%</p>
    </div>
  );
};

export default Probability;
