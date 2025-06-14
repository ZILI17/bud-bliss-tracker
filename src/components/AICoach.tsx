import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    generateAIAdvice();
  }, [profile]);

  const weeklyTotal = Object.values(getStats().weekTotal).reduce((a, b) => a + b, 0);
  const monthlyTotal = Object.values(getStats().monthTotal).reduce((a, b) => a + b, 0);
  const dailyAverage = Object.values(getStats().dailyAverage).reduce((a, b) => a + b, 0);

  const generateAIAdvice = async () => {
    setLoading(true);
    try {
      // Construire le contexte enrichi avec toutes les nouvelles données
      const enrichedContext = {
        // Données personnelles de base
        age: profile?.age,
        weight_kg: profile?.weight_kg,
        height_cm: profile?.height_cm,
        activity_level: profile?.activity_level,
        
        // Objectif détaillé
        consumption_goal: profile?.consumption_goal,
        goal_timeline: profile?.goal_timeline,
        goal_description: profile?.goal_description,
        
        // Déclencheurs identifiés
        triggers_moments: profile?.triggers_moments || [],
        triggers_specific: profile?.triggers_specific || [],
        
        // Motivations
        motivation_reasons: profile?.motivation_reasons || [],
        motivation_personal: profile?.motivation_personal,
        
        // Soutien et préférences
        support_entourage: profile?.support_entourage,
        support_preference: profile?.support_preference,
        
        // Activités alternatives
        alternative_activities: profile?.alternative_activities || [],
        wants_daily_suggestions: profile?.wants_daily_suggestions,
        
        // Données du jour (saisies par l'utilisateur)
        daily_mood: formData.mood,
        daily_difficulty: formData.difficulty,
        daily_notes: formData.notes,
        
        // Statistiques de consommation
        stats: {
          daily_average: dailyAverage,
          weekly_total: weeklyTotal,
          monthly_total: monthlyTotal,
          recent_trend: monthlyTotal > weeklyTotal * 4 ? 'hausse' : 
                       monthlyTotal < weeklyTotal * 4 ? 'baisse' : 'stable'
        }
      };

      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context: enrichedContext }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AI Coach API Error:', errorData);
        throw new Error(errorData.error || 'Failed to generate AI advice');
      }

      const data = await response.json();
      setAdvice(data.advice);
    } catch (error: any) {
      console.error('Error generating AI advice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer un conseil personnalisé pour le moment.",
        variant: "destructive",
      });
      setAdvice("Désolé, je ne peux pas générer de conseil pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Ton IA Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mood">Humeur du jour</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
                <SelectTrigger className="glass-button">
                  <SelectValue placeholder="Comment te sens-tu ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutre">Neutre</SelectItem>
                  <SelectItem value="difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulté</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger className="glass-button">
                  <SelectValue placeholder="Niveau de difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible">Faible</SelectItem>
                  <SelectItem value="moderee">Modérée</SelectItem>
                  <SelectItem value="elevee">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ajoute des détails sur ta journée"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="glass-button"
            />
          </div>
          <Button onClick={generateAIAdvice} disabled={loading} className="w-full glass-button neon-glow">
            ✨ Obtenir un conseil personnalisé
          </Button>
        </CardContent>
      </Card>

      {advice && (
        <Card className="glass-card">
          <CardContent>
            <p className="text-sm">{advice}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AICoach;
