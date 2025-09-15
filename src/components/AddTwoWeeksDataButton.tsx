import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { addTwoWeeksConsumptionData } from '@/utils/addHistoricalData';
import { Calendar, RefreshCw } from 'lucide-react';

const AddTwoWeeksDataButton = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddData = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter des données.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await addTwoWeeksConsumptionData(user.id);
      
      if (result.success) {
        toast({
          title: "✅ Données ajoutées",
          description: `${result.count} entrées de consommation ajoutées (2 dernières semaines : 13 cig, 4 cannabis, 3 hash/jour).`,
        });
        
        // Recharger la page pour voir les nouvelles données
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter les données historiques.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des données.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddData}
      disabled={loading}
      variant="outline"
      size="sm"
      className="glass-button neon-glow"
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Calendar className="w-4 h-4 mr-2" />
      )}
      {loading ? 'Ajout en cours...' : 'Ajouter 2 semaines de données'}
    </Button>
  );
};

export default AddTwoWeeksDataButton;