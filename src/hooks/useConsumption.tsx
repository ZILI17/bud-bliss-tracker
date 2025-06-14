
import { useState, useEffect } from 'react';
import { Consumption, ConsumptionStats } from '@/types/consumption';

const STORAGE_KEY = 'consumption-data';

export const useConsumption = () => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setConsumptions(JSON.parse(storedData));
    }
  }, []);

  const saveToStorage = (data: Consumption[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addConsumption = (consumption: Omit<Consumption, 'id'>) => {
    const newConsumption: Consumption = {
      ...consumption,
      id: Date.now().toString(),
    };
    const updatedConsumptions = [newConsumption, ...consumptions];
    setConsumptions(updatedConsumptions);
    saveToStorage(updatedConsumptions);
  };

  const deleteConsumption = (id: string) => {
    const updatedConsumptions = consumptions.filter(c => c.id !== id);
    setConsumptions(updatedConsumptions);
    saveToStorage(updatedConsumptions);
  };

  // Fonction pour extraire le poids numérique d'une chaîne de quantité
  const extractWeight = (quantity: string, type: 'herbe' | 'hash' | 'cigarette'): number => {
    if (type === 'cigarette') return 0; // Les cigarettes ne comptent pas en poids
    
    // Extraire les nombres de la chaîne (ex: "0.5g" -> 0.5, "2g" -> 2)
    const match = quantity.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
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

    // Calculate weight totals for week and month
    const weekWeight = weekData.reduce((acc, c) => {
      const weight = extractWeight(c.quantity, c.type);
      acc[c.type] = (acc[c.type] || 0) + weight;
      return acc;
    }, {} as { [key: string]: number });

    const monthWeight = monthData.reduce((acc, c) => {
      const weight = extractWeight(c.quantity, c.type);
      acc[c.type] = (acc[c.type] || 0) + weight;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate daily averages over 30 days
    const dailyAverage = Object.keys(monthTotal).reduce((acc, type) => {
      acc[type] = Math.round((monthTotal[type] / 30) * 10) / 10;
      return acc;
    }, {} as { [key: string]: number });

    const dailyWeightAverage = Object.keys(monthWeight).reduce((acc, type) => {
      acc[type] = Math.round((monthWeight[type] / 30) * 100) / 100;
      return acc;
    }, {} as { [key: string]: number });

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
        herbeWeight: dayData.filter(c => c.type === 'herbe').reduce((sum, c) => sum + extractWeight(c.quantity, c.type), 0),
        hashWeight: dayData.filter(c => c.type === 'hash').reduce((sum, c) => sum + extractWeight(c.quantity, c.type), 0),
      });
    }

    return { 
      weekTotal, 
      monthTotal, 
      dailyAverage, 
      recentData,
      weekWeight,
      monthWeight,
      dailyWeightAverage
    };
  };

  return {
    consumptions,
    addConsumption,
    deleteConsumption,
    getStats,
  };
};
