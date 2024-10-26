import React, { useState } from "react";
import DataInput from "./components/DataInput";
import Graph from "./components/Graph";
import OverUsage from "./components/OverUsage";

const initialData = Array.from({ length: 30 }, (_, index) => ({
  date: `2024-10-${String(index + 1).padStart(2, "0")}`,
  total_load: Math.floor(Math.random() * 11) + 15, // Random load between 15-25
  price: (Math.random() * 5 + 1).toFixed(2), // Random price between 1.00 and 6.00
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
    </div>
  );
}

export default App;
