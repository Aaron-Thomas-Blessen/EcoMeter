import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingDown, Battery, Sun, DollarSign } from 'lucide-react';

// Moved `tips` array outside of the component to avoid `useEffect` dependency warning
const tips = [
  "Shift laundry to off-peak hours (8 PM) to save 15%",
  "HVAC optimization could save 20% in next hour",
  "Solar generation peak expected: Run appliances now",
  "Community battery storage at 80%: Good time to use stored energy",
  "Peak demand expected: Consider reducing usage for next 2 hours"
];

const generateRandomData = (baseValue, variance) => {
  return baseValue + (Math.random() - 0.5) * variance;
};

const EnergyDashboard = () => {
  const [data, setData] = useState([]);
  const [savings, setSavings] = useState(0);
  const [prediction, setPrediction] = useState(0);
  const [optimizationTip, setOptimizationTip] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data
      const now = new Date();
      const baseConsumption = 
        now.getHours() >= 17 && now.getHours() <= 21 ? 4.5 : // Peak hours
        now.getHours() >= 22 || now.getHours() <= 6 ? 1.5 : // Night
        3.0; // Regular hours

      const newReading = {
        time: now.toLocaleTimeString(),
        actual: generateRandomData(baseConsumption, 1),
        optimized: generateRandomData(baseConsumption * 0.7, 0.5),
        community: generateRandomData(baseConsumption * 0.75, 0.3),
      };

      setData(prevData => [...prevData.slice(-20), newReading]);
      setSavings(prev => prev + (newReading.actual - newReading.optimized) * 0.15);
      setPrediction(baseConsumption * 1.2);
      setOptimizationTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">EnergyMinds Live Demo</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Battery className="text-blue-500 mr-2" />
            <h3 className="font-semibold">Current Usage</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {data.length > 0 ? `${data[data.length-1]?.actual.toFixed(2)} kWh` : '0 kWh'}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign className="text-green-500 mr-2" />
            <h3 className="font-semibold">Savings</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">${savings.toFixed(2)}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingDown className="text-purple-500 mr-2" />
            <h3 className="font-semibold">Predicted Next Hour</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700">{prediction.toFixed(2)} kWh</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Sun className="text-orange-500 mr-2" />
            <h3 className="font-semibold">Community Rank</h3>
          </div>
          <p className="text-2xl font-bold text-orange-700">#2 of 50</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#2196F3" 
              name="Current Usage"
            />
            <Line 
              type="monotone" 
              dataKey="optimized" 
              stroke="#4CAF50" 
              name="AI Optimized"
            />
            <Line 
              type="monotone" 
              dataKey="community" 
              stroke="#9C27B0" 
              name="Community Avg"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Optimization Alert */}
      <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
        <AlertCircle className="text-yellow-500 mr-2 mt-1" />
        <div>
          <h3 className="font-semibold text-yellow-700">AI Optimization Tip</h3>
          <p className="text-yellow-600">{optimizationTip}</p>
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;
