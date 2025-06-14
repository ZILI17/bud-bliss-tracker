
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { Brain, Sparkles, Heart, Lightbulb, User, Target } from 'lucide-react';

const AICoach = () => {
  const [todayData, setTodayData] = useState({
    humeur: '',
    difficulte: '',
    progression_ressentie: '',
    notes_personnelles: ''
  });
  
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { consumptions, getStats } = useSupabaseConsumption();

  const stats = getStats();

  // Calculer les données du jour automatiquement
  const today = new Date().toISOString().split('T')[0];
  const todayConsumptions = consumptions.filter(c => c.date.startsWith(today));

  const handleGetAdvice = async () => {
    if (!profile) {
      toast({
        title: "❌ Profil incomplet",
        description: "Complète ton profil dans les paramètres pour recevoir des conseils personnalisés.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAdvice('');

    try {
      // Préparer toutes les données automatiquement
      const aiData = {
        // Données du profil (automatiques)
        age: profile.age,
        poids: profile.weight_kg,
        taille: profile.height_cm,
        activite_physique: profile.activity_level,
        objectif: profile.consumption_goal,
        timeline: profile.goal_timeline,
        motivation: profile.goal_motivation,
        objectif_description: profile.goal_description,
        
        // Données de consommation (automatiques)
        consommation_du_jour: todayConsumptions.length,
        consommation_semaine: Object.values(stats.weekTotal).reduce((a, b) => a + b, 0),
        consommation_mois: Object.values(stats.monthTotal).reduce((a, b) => a + b, 0),
        
        // Données du jour (saisies par l'utilisateur)
        humeur: todayData.humeur,
        difficulte: todayData.difficulte,
        progression: todayData.progression_ressentie,
        notes_personnelles: todayData.notes_personnelles
      };

      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: aiData
      });

      if (error) throw error;

      if (data?.success && data?.advice) {
        setAdvice(data.advice);
        toast({
          title: "✨ Conseil généré",
          description: "Ton coach IA a analysé toutes tes données et te propose un conseil personnalisé.",
        });
      } else {
        throw new Error('Pas de conseil reçu');
      }
    } catch (error) {
      console.error('Erreur coach IA:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer un conseil pour le moment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAdvice = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="relative">
            <Brain className="w-12 h-12 text-purple-500" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 hologram-text">Coach IA Personnel</h1>
        <p className="text-muted-foreground">
          Ton coach utilise automatiquement tes données de profil et tes statistiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Données automatiques + Formulaire du jour */}
        <div className="space-y-6">
          {/* Données automatiques du profil */}
          <Card className="glass-card border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" />
                Tes données de profil
              </CardTitle>
              <CardDescription>
                Données automatiquement récupérées de ton profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="font-medium">Âge</p>
                  <p className="text-green-400">{profile?.age || 'Non défini'} ans</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="font-medium">Objectif</p>
                  <p className="text-green-400 text-xs">{profile?.consumption_goal || 'Non défini'}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="font-medium">Aujourd'hui</p>
                  <p className="text-green-400">{todayConsumptions.length} consommation(s)</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="font-medium">Cette semaine</p>
                  <p className="text-green-400">{Object.values(stats.weekTotal).reduce((a, b) => a + b, 0)} total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire du jour */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Comment ça va aujourd'hui ?
              </CardTitle>
              <CardDescription>
                Partage ton ressenti du moment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Comment te sens-tu ?</label>
                <Select value={todayData.humeur} onValueChange={(value) => setTodayData(prev => ({ ...prev, humeur: value }))}>
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder="Ton état d'esprit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motive">Motivé(e) 💪</SelectItem>
                    <SelectItem value="stresse">Stressé(e) 😰</SelectItem>
                    <SelectItem value="fatigue">Fatigué(e) 😴</SelectItem>
                    <SelectItem value="anxieux">Anxieux/se 😟</SelectItem>
                    <SelectItem value="heureux">Heureux/se 😊</SelectItem>
                    <SelectItem value="triste">Triste 😔</SelectItem>
                    <SelectItem value="neutre">Neutre 😐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulté ressentie</label>
                <Select value={todayData.difficulte} onValueChange={(value) => setTodayData(prev => ({ ...prev, difficulte: value }))}>
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder="Niveau de difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aucune">Aucune difficulté ✅</SelectItem>
                    <SelectItem value="envie_legere">Envie légère 🤏</SelectItem>
                    <SelectItem value="envie_forte">Envie forte 🔥</SelectItem>
                    <SelectItem value="manque_motivation">Manque de motivation 😞</SelectItem>
                    <SelectItem value="pression_sociale">Pression sociale 👥</SelectItem>
                    <SelectItem value="habitude">Force de l'habitude 🔄</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Comment vois-tu ta progression ?</label>
                <Select value={todayData.progression_ressentie} onValueChange={(value) => setTodayData(prev => ({ ...prev, progression_ressentie: value }))}>
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder="Ton ressenti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_progression">En progression 📈</SelectItem>
                    <SelectItem value="stable">Stable ➡️</SelectItem>
                    <SelectItem value="en_difficulte">En difficulté 📉</SelectItem>
                    <SelectItem value="pas_sur">Pas sûr(e) 🤷</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes personnelles (optionnel)</label>
                <Textarea
                  placeholder="Quelque chose de particulier à partager aujourd'hui ?"
                  value={todayData.notes_personnelles}
                  onChange={(e) => setTodayData(prev => ({ ...prev, notes_personnelles: e.target.value }))}
                  className="glass-button min-h-[60px]"
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleGetAdvice}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Recevoir mon conseil personnalisé
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Réponse IA */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Ton conseil personnalisé
            </CardTitle>
            <CardDescription>
              Basé sur ton profil complet et tes données du jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
                  <Brain className="w-6 h-6 text-purple-500 absolute top-3 left-3" />
                </div>
                <p className="text-muted-foreground animate-pulse text-center">
                  Ton coach IA analyse toutes tes données...
                </p>
              </div>
            )}
            
            {advice && !loading && (
              <div className="prose prose-sm max-w-none">
                <div 
                  className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-6 rounded-lg border border-purple-200/30"
                  dangerouslySetInnerHTML={{ 
                    __html: formatAdvice(advice) 
                  }}
                />
              </div>
            )}
            
            {!advice && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Remplis le formulaire du jour et clique sur "Recevoir mon conseil personnalisé" pour obtenir des recommandations adaptées à ta situation actuelle.</p>
                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300">
                    💡 <strong>Nouveau :</strong> Ton coach utilise automatiquement tes données de profil, tes statistiques de consommation et ton objectif personnel !
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
