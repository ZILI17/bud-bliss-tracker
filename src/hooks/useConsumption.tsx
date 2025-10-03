
import { useState, useEffect } from 'react';
import { Consumption, ConsumptionStats } from '@/types/consumption';

const STORAGE_KEY = 'consumption-data';

export const useConsumption = () => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConsumptions(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored consumption data:', error);
      }
    }
  }, []);

  const saveToStorage = (data: Consumption[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setConsumptions(data);
  };

  const addConsumption = (consumption: Omit<Consumption, 'id'>) => {
    const newConsumption = {
      ...consumption,
      id: Date.now().toString(),
    };
    const updated = [newConsumption, ...consumptions];
    saveToStorage(updated);
  };

  const deleteConsumption = (id: string) => {
    const updated = consumptions.filter(c => c.id !== id);
    saveToStorage(updated);
  };

  const getStats = (): ConsumptionStats => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter data by period
    const weekData = consumptions.filter(c => new Date(c.date) >= weekAgo);
    const monthData = consumptions.filter(c => new Date(c.date) >= monthAgo);

    // Count by type for each period
    const weekTotal = weekData.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const monthTotal = monthData.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate daily averages
    const dailyAverage = Object.keys(monthTotal).reduce((acc, type) => {
      acc[type] = Math.round((monthTotal[type] / 30) * 100) / 100;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate weight stats (placeholder implementation)
    const weekWeight = {} as { [key: string]: number };
    const monthWeight = {} as { [key: string]: number };
    const dailyWeightAverage = {} as { [key: string]: number };
    
    // Calculate cost stats (placeholder implementation)  
    const weekCost = {} as { [key: string]: number };
    const monthCost = {} as { [key: string]: number };
    const totalCost = 0;
    const dailyCostAverage = {} as { [key: string]: number };

    // Chart data (last 7 days)
    const recentData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = consumptions.filter(c => c.date.startsWith(dateStr));
      
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const dayName = dayNames[date.getDay()];
      const dayMonth = date.getDate();
      
      recentData.push({
        date: `${dayName} ${dayMonth}`,
        herbe: dayData.filter(c => c.type === 'herbe').length,
        hash: dayData.filter(c => c.type === 'hash').length,
        cigarette: dayData.filter(c => c.type === 'cigarette').length,
        totalCigarettes: dayData.filter(c => c.type === 'cigarette').length,
        herbeWeight: 0,
        hashWeight: 0,
        herbeCost: 0,
        hashCost: 0,
        cigaretteCost: 0,
      });
    }

    return { 
      weekTotal, 
      monthTotal, 
      dailyAverage, 
      recentData,
      weekWeight,
      monthWeight,
      dailyWeightAverage,
      weekCost,
      monthCost,
      totalCost,
      dailyCostAverage,
      weekCigarettesTotal: 0,
      monthCigarettesTotal: 0,
      dailyCigarettesAverage: 0
    };
  };

  return {
    consumptions,
    addConsumption,
    deleteConsumption,
    getStats,
  };
};
