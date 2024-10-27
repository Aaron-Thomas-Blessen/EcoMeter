// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';




import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Alert, AlertDescription, AlertTitle } from './Alert';
import { X } from 'lucide-react';

const EnergyConsumptionDashboard = () => {
  const [monthlyLimit, setMonthlyLimit] = useState(300);
  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertId, setAlertId] = useState(0);
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);

  const calculateSuggestedUsage = useCallback((currentData, dayIndex) => {
    const daysInMonth = 30;
    const remainingDays = daysInMonth - dayIndex;
    if (remainingDays === 0) return 0;

    const totalConsumedSoFar = currentData
      .slice(0, dayIndex)
      .reduce((sum, day) => sum + (day.actual || 0), 0);

    const remainingBudget = monthlyLimit - totalConsumedSoFar;
    return Math.max(0, remainingBudget / remainingDays);
  }, [monthlyLimit]);

  const initializeData = useCallback(() => {
    const daysInMonth = 30;
    const dailyTarget = monthlyLimit / daysInMonth;
    
    return Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      actual: 0,
      suggested: dailyTarget,
      difference: 0,
      week: Math.floor(index / 7) + 1
    }));
  }, [monthlyLimit]);

  const createAlert = useCallback((message, type = 'warning') => {
    const newAlert = {
      id: alertId,
      message,
      type
    };
    setAlertId(prev => prev + 1);
    setAlerts(prev => [...prev, newAlert]);
  }, [alertId]);

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getWeeklyData = () => {
    const weeklyTotals = data.reduce((acc, day) => {
      if (day.actual) {
        acc[day.week - 1] = (acc[day.week - 1] || 0) + day.actual;
      }
      return acc;
    }, Array(5).fill(0));

    return weeklyTotals.map((total, index) => ({
      name: `Week ${index + 1}`,
      value: parseFloat(total.toFixed(2))
    }));
  };

  const getConsumptionSummary = () => {
    const total = data.reduce((sum, day) => sum + (day.actual || 0), 0);
    const percentageUsed = ((total / monthlyLimit) * 100).toFixed(1);
    return {
      total: total.toFixed(2),
      percentageUsed
    };
  };

  useEffect(() => {
    let restartTimeout;
    if (isSimulationComplete) {
      restartTimeout = setTimeout(() => {
        setIsSimulationComplete(false);
        setData(initializeData());
        setAlerts([]);
        setIsSimulating(true);
      }, 10000);
    }

    return () => {
      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }
    };
  }, [isSimulationComplete, monthlyLimit, initializeData]);

  useEffect(() => {
    let simulationInterval;
    if (isSimulating && !isSimulationComplete) {
      simulationInterval = setInterval(() => {
        setData(currentData => {
          const newData = [...currentData];
          const currentDay = Math.min(
            newData.findIndex(d => d.actual === 0),
            newData.length - 1
          );
          
          if (currentDay >= 0) {
            const dailyTarget = monthlyLimit / 30;
            const randomFactor = 0.6 + Math.random() * 0.8;
            const actualConsumption = dailyTarget * randomFactor;
            
            newData[currentDay] = {
              ...newData[currentDay],
              actual: actualConsumption
            };

            if (actualConsumption > dailyTarget * 1.3) {
              createAlert(`High daily usage on day ${currentDay + 1}: ${actualConsumption.toFixed(2)} kWh (30% above target)`, 'error');
            }

            if (actualConsumption < dailyTarget * 0.7) {
              createAlert(`Excellent energy saving on day ${currentDay + 1}: ${actualConsumption.toFixed(2)} kWh (30% below target)`, 'success');
            }

            const totalSoFar = newData
              .slice(0, currentDay + 1)
              .reduce((sum, day) => sum + day.actual, 0);
            const expectedSoFar = dailyTarget * (currentDay + 1);
            
            if (totalSoFar > expectedSoFar * 1.2 && (currentDay + 1) % 7 === 0) {
              createAlert(`Warning: Weekly consumption is 20% above target at day ${currentDay + 1}`, 'warning');
            }

            for (let i = currentDay; i < newData.length; i++) {
              const suggestedUsage = calculateSuggestedUsage(newData, i);
              newData[i] = {
                ...newData[i],
                suggested: suggestedUsage,
                difference: (newData[i].actual || 0) - suggestedUsage
              };
            }

            if (currentDay === newData.length - 1) {
              setIsSimulationComplete(true);
              clearInterval(simulationInterval);
            }
          }
          return newData;
        });
      }, 1000);
    }

    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [isSimulating, isSimulationComplete, monthlyLimit, calculateSuggestedUsage, createAlert]);

  const handleSimulationToggle = () => {
    if (isSimulating) {
      setIsSimulating(false);
      setIsSimulationComplete(false);
    } else {
      handleStartSimulation();
    }
  };

  const handleStartSimulation = () => {
    setData(initializeData());
    setAlerts([]);
    setIsSimulationComplete(false);
    setIsSimulating(true);
  };

  const WEEK_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Energy Consumption Monitor</CardTitle>
        <div className="flex gap-4 items-center justify-center mt-4">
          <Input
            type="number"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(Number(e.target.value))}
            placeholder="Monthly Limit (kWh)"
            className="w-48"
          />
          <Button onClick={handleSimulationToggle}>
            {isSimulating ? (isSimulationComplete ? 'Restarting in 10s...' : 'Stop Simulation') : 'Start Simulation'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          {alerts.map(alert => (
            <Alert 
              key={alert.id} 
              variant={alert.type === 'error' ? 'destructive' : 'default'}
              className={`relative ${alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}`}
            >
              <AlertTitle className={alert.type === 'success' ? 'text-green-800' : ''}>
                {alert.type === 'error' ? 'High Usage Alert' : 'Energy Usage Notice'}
              </AlertTitle>
              <AlertDescription className={alert.type === 'success' ? 'text-green-700' : ''}>
                {alert.message}
              </AlertDescription>
              <Button variant="ghost" size="icon" className={`absolute top-2 right-2`} onClick={() => removeAlert(alert.id)}>
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'bottom' }} />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Usage" strokeWidth={2} />
              <Line type="monotone" dataKey="suggested" stroke="#82ca9d" name="Suggested Usage" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'bottom' }} />
              <YAxis label={{ value: 'Difference (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="difference" name="Usage Difference">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.difference > 0 ? '#ff4d4f' : '#52c41a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={getWeeklyData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {getWeeklyData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WEEK_COLORS[index % WEEK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 border rounded-lg flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold mb-4">Consumption Summary</h3>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">{getConsumptionSummary().total} kWh</p>
              <p className="text-lg text-gray-600">{getConsumptionSummary().percentageUsed}% of limit used</p>
              <p className="text-sm text-gray-500 mt-2">Monthly Limit: {monthlyLimit} kWh</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyConsumptionDashboard;
