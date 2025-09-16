
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

const AICoach = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { getStats } = useSupabaseConsumption();

  const [formData, setFormData] = useState({
    mood: '',
    difficulty: '',
    notes: '',
  });

  useEffect(() => {
    if (profile?.id) {
      generateAIAdvice();
    }
  }, [profile?.id]);

  const generateAIAdvice = async () => {
    if (!profile) {
      console.log('No profile available for AI advice');
      return;
    }

    setLoading(true);
    try {
      const stats = getStats();
      const weeklyTotal = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
      const monthlyTotal = Object.values(stats.monthTotal).reduce((a, b) => a + b, 0);
      const dailyAverage = Object.values(stats.dailyAverage).reduce((a, b) => a + b, 0);

      // Construire le contexte enrichi avec toutes les données
      const enrichedContext = {
        // Données personnelles de base
        age: profile.age || null,
        weight_kg: profile.weight_kg || null,
        height_cm: profile.height_cm || null,
        activity_level: profile.activity_level || null,
        
        // Objectif détaillé
        consumption_goal: profile.consumption_goal || null,
        goal_timeline: profile.goal_timeline || null,
        goal_description: profile.goal_description || null,
        goal_motivation: profile.goal_motivation || null,
        
        // Déclencheurs identifiés
        triggers_moments: profile.triggers_moments || [],
        triggers_specific: profile.triggers_specific || [],
        
        // Motivations
        motivation_reasons: profile.motivation_reasons || [],
        motivation_personal: profile.motivation_personal || null,
        
        // Soutien et préférences
        support_entourage: profile.support_entourage || null,
        support_preference: profile.support_preference || null,
        
        // Activités alternatives
        alternative_activities: profile.alternative_activities || [],
        wants_daily_suggestions: profile.wants_daily_suggestions !== false, // par défaut true
        
        // Données du jour (saisies par l'utilisateur)
        daily_mood: formData.mood || null,
        daily_difficulty: formData.difficulty || null,
        daily_notes: formData.notes || null,
        
        // Statistiques de consommation
        stats: {
          daily_average: dailyAverage || 0,
          weekly_total: weeklyTotal || 0,
          monthly_total: monthlyTotal || 0,
          recent_trend: monthlyTotal > weeklyTotal * 4 ? 'hausse' : 
                       monthlyTotal < weeklyTotal * 4 ? 'baisse' : 'stable'
        }
      };

      console.log('Sending context to AI:', enrichedContext);

      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { context: enrichedContext }
      });

      if (error) {
        console.error('AI Coach Function Error:', error);
        throw error;
      }

      console.log('AI Coach Response:', data);
      
      // Habitudes de consommation
      smokes_with_cannabis: profile.smokes_with_cannabis || false,
      cigarettes_per_joint: profile.cigarettes_per_joint || 1,
      
      // Gérer les réponses avec ou sans erreur
      if (data?.advice) {
        setAdvice(data.advice);
      } else if (data?.error) {
        setAdvice("Désolé, je ne peux pas générer de conseil pour le moment. Veuillez réessayer dans quelques instants.");
        toast({
          title: "Information",
          description: "Le service de conseil IA est temporairement indisponible.",
          variant: "default",
        });
      } else {
        setAdvice("Désolé, je ne peux pas générer de conseil pour le moment.");
      }
    } catch (error: any) {
      console.error('Error generating AI advice:', error);
      setAdvice("Désolé, une erreur technique est survenue. Veuillez réessayer dans quelques instants.");
      toast({
        title: "Erreur temporaire",
        description: "Le service de conseil IA rencontre des difficultés techniques.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Ton IA Coach Personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mood">Comment te sens-tu aujourd'hui ?</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
                <SelectTrigger className="glass-button">
                  <SelectValue placeholder="Ton humeur du jour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motivé">Motivé</SelectItem>
                  <SelectItem value="neutre">Neutre</SelectItem>
                  <SelectItem value="stressé">Stressé</SelectItem>
                  <SelectItem value="fatigué">Fatigué</SelectItem>
                  <SelectItem value="anxieux">Anxieux</SelectItem>
                  <SelectItem value="positif">Positif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Niveau de difficulté ressenti</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger className="glass-button">
                  <SelectValue placeholder="Ta difficulté du jour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aucune">Aucune difficulté</SelectItem>
                  <SelectItem value="légère">Légère envie</SelectItem>
                  <SelectItem value="modérée">Envie modérée</SelectItem>
                  <SelectItem value="forte">Envie forte</SelectItem>
                  <SelectItem value="très-forte">Très difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes personnelles (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Raconte ta journée, tes ressentis, ce qui s'est passé..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="glass-button"
              rows={3}
            />
          </div>
          <Button onClick={generateAIAdvice} disabled={loading} className="w-full glass-button neon-glow">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Obtenir un conseil personnalisé
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {advice && (
        <Card className="glass-card border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              Conseil de ton IA Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{advice}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AICoach;
