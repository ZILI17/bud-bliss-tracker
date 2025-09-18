import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  smokes_with_cannabis?: boolean;
  cigarettes_per_joint?: number;
  default_cigarette_price?: number;
}

export interface MigrationResult {
  success: boolean;
  addedCigarettes: number;
  error?: string;
}

export const migratePastConsumptions = async (
  userId: string, 
  profile: UserProfile
): Promise<MigrationResult> => {
  try {
    if (!profile.smokes_with_cannabis || !profile.cigarettes_per_joint) {
      return { success: true, addedCigarettes: 0 };
    }

    // Récupérer toutes les consommations cannabis/hash existantes
    const { data: consumptions, error: fetchError } = await supabase
      .from('consumptions')
      .select('*')
      .eq('user_id', userId)
      .in('type', ['herbe', 'hash']);

    if (fetchError) throw fetchError;

    if (!consumptions || consumptions.length === 0) {
      return { success: true, addedCigarettes: 0 };
    }

    // Préparer les nouvelles consommations de cigarettes
    const cigarettesToAdd = [];
    const cigarettesPerJoint = Number(profile.cigarettes_per_joint);

    for (const consumption of consumptions) {
      // Pour chaque joint, ajouter la quantité exacte de cigarettes (peut être décimale)
      const cigaretteDate = new Date(consumption.date);
      cigaretteDate.setMinutes(cigaretteDate.getMinutes() + 1); // Légèrement après la consommation

      cigarettesToAdd.push({
        user_id: userId,
        type: 'cigarette',
        quantity: cigarettesPerJoint.toString(),
        date: cigaretteDate.toISOString(),
        price: (profile.default_cigarette_price || 0.5) * cigarettesPerJoint,
        note: `Migration automatique (avec ${consumption.type} - ${cigarettesPerJoint} cigarettes)`
      });
    }

    if (cigarettesToAdd.length === 0) {
      return { success: true, addedCigarettes: 0 };
    }

    // Insérer toutes les cigarettes en une fois
    const { error: insertError } = await supabase
      .from('consumptions')
      .insert(cigarettesToAdd);

    if (insertError) throw insertError;

    return { 
      success: true, 
      addedCigarettes: cigarettesToAdd.length 
    };

  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    return { 
      success: false, 
      addedCigarettes: 0, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};