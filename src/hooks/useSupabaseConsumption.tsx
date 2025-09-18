
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Consumption, ConsumptionStats } from '@/types/consumption';

const STORAGE_KEY = 'consumption-data';

export const useSupabaseConsumption = () => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useProfile();

  // Migrate localStorage data to Supabase once when user first logs in
  const migrateLocalStorageData = async () => {
    if (!user) return;

    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const localConsumptions = JSON.parse(storedData);
        
        // Check if we've already migrated for this user
        const migrationKey = `migrated-${user.id}`;
        const hasMigrated = localStorage.getItem(migrationKey);
        
        if (!hasMigrated && localConsumptions.length > 0) {
          console.log('Migrating localStorage data to Supabase...');
          
          // Prepare data for insertion
          const dataToInsert = localConsumptions.map((consumption: any) => ({
            user_id: user.id,
            type: consumption.type,
            quantity: consumption.quantity,
            date: consumption.date,
            note: consumption.note,
            price: consumption.price,
          }));

          const { error } = await supabase
            .from('consumptions')
            .insert(dataToInsert);

          if (!error) {
            localStorage.setItem(migrationKey, 'true');
            console.log('Migration successful!');
          } else {
            console.error('Migration failed:', error);
          }
        }
      } catch (error) {
        console.error('Error during migration:', error);
      }
    }
  };

  const fetchConsumptions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('consumptions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        type: item.type as 'herbe' | 'hash' | 'cigarette',
        quantity: item.quantity,
        date: item.date,
        note: item.note || undefined,
        price: item.price || undefined,
      }));

      setConsumptions(formattedData);
    } catch (error) {
      console.error('Error fetching consumptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      migrateLocalStorageData().then(() => {
        fetchConsumptions();
      });
    } else {
      setConsumptions([]);
      setLoading(false);
    }
  }, [user]);

  const addConsumption = async (consumption: Omit<Consumption, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('consumptions')
        .insert({
          user_id: user.id,
          type: consumption.type,
          quantity: consumption.quantity,
          date: consumption.date,
          note: consumption.note,
          price: consumption.price,
        })
        .select()
        .single();

      if (error) throw error;

      const newConsumption = {
        id: data.id,
        type: data.type as 'herbe' | 'hash' | 'cigarette',
        quantity: data.quantity,
        date: data.date,
        note: data.note || undefined,
        price: data.price || undefined,
      };

      setConsumptions(prev => [newConsumption, ...prev]);

      // Si c'est du cannabis/hash et que l'utilisateur fume avec des cigarettes
      if ((consumption.type === 'herbe' || consumption.type === 'hash') && 
          profile?.smokes_with_cannabis && 
          profile?.cigarettes_per_joint) {
        
        const cigarettesToAdd = [];
        const cigarettesPerJoint = Number(profile.cigarettes_per_joint);
        
        // Ajouter la quantité exacte de cigarettes (peut être décimale)
        const cigaretteDate = new Date(consumption.date);
        cigaretteDate.setMinutes(cigaretteDate.getMinutes() + 1); // Légèrement après la consommation
        
        cigarettesToAdd.push({
          user_id: user.id,
          type: 'cigarette',
          quantity: cigarettesPerJoint.toString(),
          date: cigaretteDate.toISOString(),
          price: (profile.default_cigarette_price || 0.5) * cigarettesPerJoint,
          note: `Avec ${consumption.type} (${cigarettesPerJoint} cigarettes)`
        });

        // Ajouter les cigarettes automatiquement
        const { data: cigaretteData } = await supabase
          .from('consumptions')
          .insert(cigarettesToAdd)
          .select();

        if (cigaretteData) {
          const newCigarettes = cigaretteData.map(item => ({
            id: item.id,
            type: item.type as 'herbe' | 'hash' | 'cigarette',
            quantity: item.quantity,
            date: item.date,
            note: item.note || undefined,
            price: item.price || undefined,
          }));
          setConsumptions(prev => [...newCigarettes, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error adding consumption:', error);
    }
  };

  const deleteConsumption = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('consumptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setConsumptions(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting consumption:', error);
    }
  };

  // Fonction pour extraire le poids numérique d'une chaîne de quantité
  const extractWeight = (quantity: string, type: 'herbe' | 'hash' | 'cigarette'): number => {
    if (type === 'cigarette') return 0; // Les cigarettes ne comptent pas en poids
    
    // Extraire les nombres de la chaîne (ex: "0.5g" -> 0.5, "2g" -> 2)
    const match = quantity.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Fonction pour calculer le prix d'une consommation
  const calculatePrice = (consumption: Consumption): number => {
    if (consumption.price && consumption.price > 0) {
      return consumption.price;
    }

    // Utiliser les prix par défaut du profil
    const weight = extractWeight(consumption.quantity, consumption.type);
    
    switch (consumption.type) {
      case 'herbe':
        return weight * (profile?.default_herbe_price || 10);
      case 'hash':
        return weight * (profile?.default_hash_price || 15);
      case 'cigarette':
        const count = parseInt(consumption.quantity.match(/\d+/)?.[0] || '1');
        return count * (profile?.default_cigarette_price || 0.5);
      default:
        return 0;
    }
  };

  // Fonction pour extraire la quantité réelle de cigarettes
  const extractCigaretteCount = (quantity: string): number => {
    const match = quantity.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  const getStats = (): ConsumptionStats => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter data by period
    const weekData = consumptions.filter(c => new Date(c.date) >= weekAgo);
    const monthData = consumptions.filter(c => new Date(c.date) >= monthAgo);

    // Calculate actual quantities (not just entry count)
    const weekTotal = weekData.reduce((acc, c) => {
      if (c.type === 'cigarette') {
        acc[c.type] = (acc[c.type] || 0) + extractCigaretteCount(c.quantity);
      } else {
        acc[c.type] = (acc[c.type] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    const monthTotal = monthData.reduce((acc, c) => {
      if (c.type === 'cigarette') {
        acc[c.type] = (acc[c.type] || 0) + extractCigaretteCount(c.quantity);
      } else {
        acc[c.type] = (acc[c.type] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Calculate actual days with data for accurate averages
    const uniqueDaysWithData = new Set(
      monthData.map(c => c.date.split('T')[0])
    ).size;
    const daysToUseForAverage = Math.max(uniqueDaysWithData, 1); // Éviter division par 0

    // Calculate daily averages based on actual days with data
    const dailyAverage = Object.keys(monthTotal).reduce((acc, type) => {
      acc[type] = Math.round((monthTotal[type] / daysToUseForAverage) * 100) / 100;
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

    // Calculate daily weight averages based on actual days with data
    const dailyWeightAverage = Object.keys(monthWeight).reduce((acc, type) => {
      acc[type] = Math.round((monthWeight[type] / daysToUseForAverage) * 100) / 100;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate cost totals for week and month
    const weekCost = weekData.reduce((acc, c) => {
      const cost = calculatePrice(c);
      acc[c.type] = (acc[c.type] || 0) + cost;
      return acc;
    }, {} as { [key: string]: number });

    const monthCost = monthData.reduce((acc, c) => {
      const cost = calculatePrice(c);
      acc[c.type] = (acc[c.type] || 0) + cost;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate total cost of all recorded consumptions
    const totalCost = consumptions.reduce((sum, c) => sum + calculatePrice(c), 0);

    // Calculate daily cost averages based on actual days with data
    const dailyCostAverage = Object.keys(monthCost).reduce((acc, type) => {
      acc[type] = Math.round((monthCost[type] / daysToUseForAverage) * 100) / 100;
      return acc;
    }, {} as { [key: string]: number });

    // Chart data (last 7 days) with accurate cigarette counts
    const recentData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = consumptions.filter(c => c.date.startsWith(dateStr));
      
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const dayName = dayNames[date.getDay()];
      const dayMonth = date.getDate();
      
      // Calculate accurate cigarette count for the day
      const cigaretteCount = dayData
        .filter(c => c.type === 'cigarette')
        .reduce((sum, c) => sum + extractCigaretteCount(c.quantity), 0);
      
      recentData.push({
        date: `${dayName} ${dayMonth}`,
        herbe: dayData.filter(c => c.type === 'herbe').length,
        hash: dayData.filter(c => c.type === 'hash').length,
        cigarette: cigaretteCount,
        herbeWeight: dayData.filter(c => c.type === 'herbe').reduce((sum, c) => sum + extractWeight(c.quantity, c.type), 0),
        hashWeight: dayData.filter(c => c.type === 'hash').reduce((sum, c) => sum + extractWeight(c.quantity, c.type), 0),
        herbeCost: dayData.filter(c => c.type === 'herbe').reduce((sum, c) => sum + calculatePrice(c), 0),
        hashCost: dayData.filter(c => c.type === 'hash').reduce((sum, c) => sum + calculatePrice(c), 0),
        cigaretteCost: dayData.filter(c => c.type === 'cigarette').reduce((sum, c) => sum + calculatePrice(c), 0),
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
      dailyCostAverage
    };
  };

  return {
    consumptions,
    addConsumption,
    deleteConsumption,
    getStats,
    loading,
  };
};
