
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
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  const saveToStorage = (data: Consumption[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addConsumption = (consumption: Omit<Consumption, 'id'>) => {
    const newConsumption = {
      ...consumption,
      id: Date.now().toString(),
    };
    const updated = [newConsumption, ...consumptions];
    setConsumptions(updated);
    saveToStorage(updated);
  };

  const deleteConsumption = (id: string) => {
    const updated = consumptions.filter(c => c.id !== id);
    setConsumptions(updated);
    saveToStorage(updated);
  };

  const getStats = (): ConsumptionStats => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filtrer les données par période
    const weekData = consumptions.filter(c => new Date(c.date) >= weekAgo);
    const monthData = consumptions.filter(c => new Date(c.date) >= monthAgo);

    // Compter par type pour chaque période
    const weekTotal = weekData.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const monthTotal = monthData.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Calculer les moyennes quotidiennes sur 30 jours
    const dailyAverage = Object.keys(monthTotal).reduce((acc, type) => {
      acc[type] = Math.round((monthTotal[type] / 30) * 10) / 10;
      return acc;
    }, {} as { [key: string]: number });

    // Données pour le graphique (7 derniers jours)
    const recentData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = consumptions.filter(c => c.date.startsWith(dateStr));
      
      // Noms des jours en français
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const dayName = dayNames[date.getDay()];
      const dayMonth = date.getDate();
      
      recentData.push({
        date: `${dayName} ${dayMonth}`,
        herbe: dayData.filter(c => c.type === 'herbe').length,
        hash: dayData.filter(c => c.type === 'hash').length,
        cigarette: dayData.filter(c => c.type === 'cigarette').length,
      });
    }

    console.log('Stats calculées:', { weekTotal, monthTotal, dailyAverage, recentData });

    return { weekTotal, monthTotal, dailyAverage, recentData };
  };

  return {
    consumptions,
    addConsumption,
    deleteConsumption,
    getStats,
  };
};
