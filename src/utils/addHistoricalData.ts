
import { supabase } from '@/integrations/supabase/client';

export const addHistoricalConsumptionData = async (userId: string) => {
  const historicalData = [];
  
  // Semaine du 09 au 15 juin 2025
  const startDate = new Date('2025-06-09');
  const endDate = new Date('2025-06-15');
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);
    
    // 10 joints par jour répartis aléatoirement entre herbe et hash
    for (let i = 0; i < 10; i++) {
      const isHerbe = Math.random() > 0.4; // 60% herbe, 40% hash
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      
      const consumptionDate = new Date(currentDate);
      consumptionDate.setHours(hour, minute, 0, 0);
      
      historicalData.push({
        user_id: userId,
        type: isHerbe ? 'herbe' : 'hash',
        quantity: isHerbe ? '0.4g' : '0.3g',
        date: consumptionDate.toISOString(),
        created_at: consumptionDate.toISOString(),
        updated_at: consumptionDate.toISOString()
      });
    }
    
    // Entre 8 et 15 cigarettes par jour
    const cigarettesCount = Math.floor(Math.random() * 8) + 8; // 8 à 15
    for (let i = 0; i < cigarettesCount; i++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      
      const consumptionDate = new Date(currentDate);
      consumptionDate.setHours(hour, minute, 0, 0);
      
      historicalData.push({
        user_id: userId,
        type: 'cigarette',
        quantity: '1 cig',
        date: consumptionDate.toISOString(),
        created_at: consumptionDate.toISOString(),
        updated_at: consumptionDate.toISOString()
      });
    }
  }
  
  // Trier par date pour un meilleur ordre
  historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  try {
    const { data, error } = await supabase
      .from('consumptions')
      .insert(historicalData);
    
    if (error) {
      console.error('Erreur lors de l\'ajout des données historiques:', error);
      return { success: false, error };
    }
    
    console.log(`${historicalData.length} entrées de consommation ajoutées avec succès`);
    return { success: true, count: historicalData.length };
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, error };
  }
};
