
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { addHistoricalConsumptionData } from '@/utils/addHistoricalData';
import { Database, RefreshCw } from 'lucide-react';

const AddHistoricalDataButton = () => {
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
      const result = await addHistoricalConsumptionData(user.id);
      
      if (result.success) {
        toast({
          title: "✅ Données ajoutées",
          description: `${result.count} entrées de consommation historiques ajoutées (09-15 juin).`,
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
        <Database className="w-4 h-4 mr-2" />
      )}
      {loading ? 'Ajout en cours...' : 'Ajouter données 09-15 juin'}
    </Button>
  );
};

export default AddHistoricalDataButton;
