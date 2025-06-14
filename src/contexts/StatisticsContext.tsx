import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for different statistical data
export interface YieldData {
  name: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
}

export interface FinancialData {
  name: string;
  profitability: number;
  size: number;
  crop: string;
}

export interface CostData {
  name: string;
  value: number;
  color: string;
}

export interface EnvironmentalData {
  indicator: string;
  current: number;
  target: number;
  trend: string;
  status: 'Achieved' | 'In Progress' | 'Behind';
}

interface StatisticsContextType {
  // Yield data
  yieldData: YieldData[];
  setYieldData: React.Dispatch<React.SetStateAction<YieldData[]>>;
  
  // Financial data
  financialData: {
    profitabilityByParcel: FinancialData[];
    costAnalysis: CostData[];
    revenueByMonth: any[];
  };
  setFinancialData: React.Dispatch<React.SetStateAction<{
    profitabilityByParcel: FinancialData[];
    costAnalysis: CostData[];
    revenueByMonth: any[];
  }>>;
  
  // Environmental data
  environmentalData: {
    indicators: EnvironmentalData[];
    carbonFootprint: number;
    waterUsage: number;
    biodiversity: number;
  };
  setEnvironmentalData: React.Dispatch<React.SetStateAction<{
    indicators: EnvironmentalData[];
    carbonFootprint: number;
    waterUsage: number;
    biodiversity: number;
  }>>;
  
  // Forecast data
  forecastData: any[];
  setForecastData: React.Dispatch<React.SetStateAction<any[]>>;
  
  // Period and filters
  period: 'day' | 'week' | 'month' | 'year';
  setPeriod: React.Dispatch<React.SetStateAction<'day' | 'week' | 'month' | 'year'>>;
  cropFilter: string;
  setCropFilter: React.Dispatch<React.SetStateAction<string>>;
  
  // Function to update data based on filters
  updateDataWithFilters: (period: string, crop: string) => void;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};

// Initial data
const initialYieldData: YieldData[] = [
  { name: 'Safety Equipment', current: 95, previous: 90, target: 98, unit: '%' },
  { name: 'Emergency Response', current: 88, previous: 85, target: 90, unit: '%' },
  { name: 'Environmental Compliance', current: 92, previous: 88, target: 95, unit: '%' },
  { name: 'Training Completion', current: 85, previous: 80, target: 90, unit: '%' },
  { name: 'Incident Reduction', current: 78, previous: 75, target: 85, unit: '%' }
];

const initialProfitabilityData: FinancialData[] = [
  { name: 'Safety Equipment', profitability: 12500, size: 12.5, crop: 'PPE' },
  { name: 'Emergency Systems', profitability: 9800, size: 8.3, crop: 'Emergency' },
  { name: 'Environmental Controls', profitability: 15800, size: 15.7, crop: 'Environmental' },
  { name: 'Training Programs', profitability: 8500, size: 10.2, crop: 'Training' },
  { name: 'Maintenance Equipment', profitability: 9200, size: 6.8, crop: 'Maintenance' }
];

const initialCostData: CostData[] = [
  { name: 'Safety Equipment', value: 18000, color: '#4CAF50' },
  { name: 'Training Programs', value: 22000, color: '#8D6E63' },
  { name: 'Environmental Controls', value: 15000, color: '#FFC107' },
  { name: 'Emergency Systems', value: 12000, color: '#2196F3' },
  { name: 'Maintenance', value: 35000, color: '#673AB7' },
  { name: 'Compliance', value: 28000, color: '#E91E63' },
  { name: 'Other', value: 9000, color: '#9E9E9E' }
];

const initialRevenueData = [
  { month: 'Jan', revenue: 285000, expenses: 201000, profit: 84000 },
  { month: 'Feb', revenue: 302000, expenses: 218000, profit: 84000 },
  { month: 'Mar', revenue: 328000, expenses: 224000, profit: 104000 },
  { month: 'Apr', revenue: 355000, expenses: 231000, profit: 124000 },
  { month: 'May', revenue: 382000, expenses: 235000, profit: 147000 },
  { month: 'Jun', revenue: 378000, expenses: 229000, profit: 149000 },
  { month: 'Jul', revenue: 425000, expenses: 242000, profit: 183000 },
  { month: 'Aug', revenue: 448000, expenses: 253000, profit: 195000 },
  { month: 'Sep', revenue: 402000, expenses: 248000, profit: 154000 },
  { month: 'Oct', revenue: 382000, expenses: 231000, profit: 151000 },
  { month: 'Nov', revenue: 365000, expenses: 225000, profit: 140000 },
  { month: 'Dec', revenue: 412000, expenses: 258000, profit: 154000 }
];

const initialEnvironmentalIndicators: EnvironmentalData[] = [
  { indicator: 'CO2 Emissions (t/year)', current: 28, target: 25, trend: '-5%', status: 'In Progress' },
  { indicator: 'Water Usage (m³/month)', current: 3500, target: 3200, trend: '-8%', status: 'Achieved' },
  { indicator: 'Waste Reduction (%)', current: 180, target: 150, trend: '-12%', status: 'In Progress' },
  { indicator: 'Renewable Energy (%)', current: 15, target: 25, trend: '+5%', status: 'In Progress' },
  { indicator: 'Safety Incidents (per month)', current: 2, target: 0, trend: '-50%', status: 'In Progress' }
];

export const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [yieldData, setYieldData] = useState<YieldData[]>(initialYieldData);
  const [financialData, setFinancialData] = useState({
    profitabilityByParcel: initialProfitabilityData,
    costAnalysis: initialCostData,
    revenueByMonth: initialRevenueData
  });
  const [environmentalData, setEnvironmentalData] = useState({
    indicators: initialEnvironmentalIndicators,
    carbonFootprint: -15,
    waterUsage: -8,
    biodiversity: 12
  });
  const [forecastData, setForecastData] = useState(initialRevenueData);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('year');
  const [cropFilter, setCropFilter] = useState('all');
  
  // Function to update data based on filters
  const updateDataWithFilters = (period: string, crop: string) => {
    // Filter yield data by category if necessary
    if (crop !== 'all') {
      const filteredYieldData = initialYieldData.filter(item => item.name === crop);
      setYieldData(filteredYieldData);
      
      // Also filter financial data by category
      const filteredProfitabilityData = initialProfitabilityData.filter(item => item.crop === crop);
      setFinancialData(prev => ({
        ...prev,
        profitabilityByParcel: filteredProfitabilityData
      }));
    } else {
      setYieldData(initialYieldData);
      setFinancialData(prev => ({
        ...prev,
        profitabilityByParcel: initialProfitabilityData
      }));
    }
    
    // You could also adjust other data based on the period
  };
  
  // Update data when filters change
  useEffect(() => {
    updateDataWithFilters(period, cropFilter);
  }, [period, cropFilter]);
  
  return (
    <StatisticsContext.Provider 
      value={{ 
        yieldData, 
        setYieldData,
        financialData,
        setFinancialData,
        environmentalData,
        setEnvironmentalData,
        forecastData,
        setForecastData,
        period,
        setPeriod,
        cropFilter,
        setCropFilter,
        updateDataWithFilters
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};
