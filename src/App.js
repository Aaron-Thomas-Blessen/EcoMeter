import React, { useState } from "react";
import DataInput from "./components/DataInput";
import Graph from "./components/Graph";
import OverUsage from "./components/OverUsage";
import Probability from "./components/Probability";

const initialData = Array.from({ length: 30 }, (_, index) => ({
  date: `2024-10-${String(index + 1).padStart(2, "0")}`,
  total_load: Math.floor(Math.random() * 30) + 15, // Random load between 15-45
  price: (Math.random() * 10 + 1).toFixed(2), // Random price
}));

function App() {
  const [smartMeterData, setSmartMeterData] = useState(initialData);
  const [monthlyLimit, setMonthlyLimit] = useState(600);

  const addNewData = (newData) => {
    setSmartMeterData((prevData) => [...prevData, newData]);
  };

  return (
    <div className="App">
      <h1>Smart Meter Dashboard</h1>
      <DataInput addNewData={addNewData} />
      <Graph smartMeterData={smartMeterData} monthlyLimit={monthlyLimit} />
      <OverUsage smartMeterData={smartMeterData} monthlyLimit={monthlyLimit} />
      <Probability
        smartMeterData={smartMeterData}
        monthlyLimit={monthlyLimit}
      />
    </div>
  );
}

export default App;
