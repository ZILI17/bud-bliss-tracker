import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DeleteAllDataButton = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDeleteAllData = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer des données.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('consumptions')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer les données.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "✅ Données supprimées",
          description: "Toutes vos données de consommation ont été supprimées.",
        });
        
        // Recharger la page pour voir les changements
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="glass-button neon-glow border-destructive/50 hover:bg-destructive/10"
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Suppression...' : 'Supprimer tout'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">⚠️ Supprimer toutes les données</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Toutes vos données de consommation seront définitivement supprimées.
            <br /><br />
            Voulez-vous vraiment continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="glass-button">Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteAllData}
            className="bg-destructive hover:bg-destructive/90"
            disabled={loading}
          >
            Oui, supprimer tout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllDataButton;