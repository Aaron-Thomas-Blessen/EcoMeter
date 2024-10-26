import React from "react";

const Probability = ({ smartMeterData, monthlyLimit }) => {
  const totalUsage = smartMeterData.reduce(
    (acc, curr) => acc + curr.total_load,
    0
  );
  const daysPassed = smartMeterData.length;
  const daysRemaining = 30 - daysPassed;

  // Calculate average daily usage so far
  const averageDailyUsage = totalUsage / daysPassed;

  // Calculate the remaining allowable usage
  const remainingLimit = monthlyLimit - totalUsage;

  // Projected total usage if the current trend continues
  const projectedUsage = totalUsage + daysRemaining * averageDailyUsage;

  // Calculate probability based on trend and remaining limit
  let probability;
  if (projectedUsage <= monthlyLimit) {
    probability = 100; // 100% chance if projected usage is within limit
  } else {
    // Probability decreases the more the projected usage exceeds the limit
    const usageOverLimit = projectedUsage - monthlyLimit;
    const excessFactor = usageOverLimit / monthlyLimit;
    probability = Math.max(0, 100 * (1 - excessFactor)); // Clamped to minimum 0%
  }

  return (
    <div>
      <h2>Probability of Staying Under Limit</h2>
      <p>{probability.toFixed(2)}%</p>
    </div>
  );
};

export default Probability;
