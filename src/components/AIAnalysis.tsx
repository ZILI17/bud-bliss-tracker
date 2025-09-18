import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { Sparkles, TrendingUp, Target, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AIAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { consumptions, getStats } = useSupabaseConsumption();

  const hasEnoughData = () => {
    return profile?.consumption_goal && consumptions.length >= 3;
  };

  const analyzeConsumption = async () => {
    if (!profile || !hasEnoughData()) {
      toast({
        title: "Données insuffisantes",
        description: "Continue à enregistrer quelques jours pour que je puisse analyser ta consommation.",
        variant: "default",
      });
      return;
    }

    setLoading(true);
    try {
      const stats = getStats();
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Calculer les données nécessaires pour l'analyse
      const todayConsumptions = consumptions.filter(c => c.date.startsWith(today));
      const yesterdayConsumptions = consumptions.filter(c => c.date.startsWith(yesterday));
      const lastWeekConsumptions = consumptions.filter(c => c.date >= weekAgo && c.date < today);
      const thisWeekConsumptions = consumptions.filter(c => c.date >= weekAgo);

      // Compter par type
      const countByType = (consumptionList: any[]) => ({
        herbe: consumptionList.filter(c => c.type === 'herbe').length,
        hash: consumptionList.filter(c => c.type === 'hash').length,
        cigarette: consumptionList.filter(c => c.type === 'cigarette').length,
      });

      // Calculer les coûts
      const calculateCost = (consumptionList: any[]) => {
        return consumptionList.reduce((total, c) => total + (c.price || 0), 0);
      };

      const analysisData = {
        // Données personnelles
        profile: {
          age: profile.age,
          consumption_goal: profile.consumption_goal,
          goal_timeline: profile.goal_timeline,
          goal_description: profile.goal_description,
          goal_motivation: profile.goal_motivation,
          triggers_moments: profile.triggers_moments || [],
          triggers_specific: profile.triggers_specific || [],
          motivation_reasons: profile.motivation_reasons || [],
          motivation_personal: profile.motivation_personal,
          alternative_activities: profile.alternative_activities || [],
          support_entourage: profile.support_entourage,
          support_preference: profile.support_preference,
          activity_level: profile.activity_level,
          weight_kg: profile.weight_kg,
          height_cm: profile.height_cm,
          smokes_with_cannabis: profile.smokes_with_cannabis,
          cigarettes_per_joint: profile.cigarettes_per_joint,
        },

        // Statistiques temporelles
        today: {
          consumptions: countByType(todayConsumptions),
          cost: calculateCost(todayConsumptions),
          total: todayConsumptions.length,
        },
        yesterday: {
          consumptions: countByType(yesterdayConsumptions),
          cost: calculateCost(yesterdayConsumptions),
          total: yesterdayConsumptions.length,
        },
        this_week: {
          consumptions: countByType(thisWeekConsumptions),
          cost: calculateCost(thisWeekConsumptions),
          total: thisWeekConsumptions.length,
        },
        last_week: {
          consumptions: countByType(lastWeekConsumptions),
          cost: calculateCost(lastWeekConsumptions),
          total: lastWeekConsumptions.length,
        },

        // Statistiques globales
        stats: {
          total_consumptions: consumptions.length,
          weekly_average: Object.values(stats.dailyAverage).reduce((a, b) => a + b, 0),
          total_cost: stats.totalCost,
          tracking_days: Math.ceil((new Date().getTime() - new Date(consumptions[consumptions.length - 1]?.date || new Date()).getTime()) / (1000 * 60 * 60 * 24)),
        }
      };

      console.log('Sending analysis data:', analysisData);

      const { data, error } = await supabase.functions.invoke('ai-consumption-analysis', {
        body: analysisData
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: "Analyse terminée",
          description: "Ton analyse personnalisée est prête !",
          variant: "default",
        });
      } else {
        throw new Error('Pas de données d\'analyse reçues');
      }
    } catch (error: any) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'analyse pour le moment. Réessaie dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasEnoughData()) {
    return (
      <Card className="glass-card border-dashed border-2 border-primary/30">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Pas encore assez de données</h3>
          <p className="text-muted-foreground text-sm">
            {!profile?.consumption_goal 
              ? "Définis ton objectif dans les paramètres pour recevoir une analyse personnalisée."
              : "Enregistre au moins 3 consommations pour que l'IA puisse analyser tes habitudes."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Analyse IA de ma consommation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={analyzeConsumption} 
            disabled={loading} 
            className="w-full glass-button neon-glow"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyser ma conso
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          {/* Résumé du jour/semaine */}
          {analysis.summary && (
            <Card className="glass-card border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  Résumé de ta période
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{analysis.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyse personnalisée */}
          {analysis.personal_analysis && (
            <Card className="glass-card border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <TrendingUp className="w-5 h-5" />
                  Analyse de tes habitudes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{analysis.personal_analysis}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conseil pratique */}
          {analysis.practical_advice && (
            <Card className="glass-card border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Sparkles className="w-5 h-5" />
                  Conseil pratique & alternative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{analysis.practical_advice}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progression vers objectif */}
          {analysis.goal_progress && (
            <Card className="glass-card border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="w-5 h-5" />
                  Progression vers ton objectif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{analysis.goal_progress}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;