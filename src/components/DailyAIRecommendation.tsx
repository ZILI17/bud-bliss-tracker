import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { Sparkles, RefreshCw, Target, TrendingDown, Calendar } from 'lucide-react';

const DailyAIRecommendation = () => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { consumptions, getStats } = useSupabaseConsumption();

  const stats = getStats();

  const hasEnoughData = () => {
    return profile?.consumption_goal && consumptions.length > 0;
  };

  // Check if we already have a recommendation for today
  const getTodayRecommendationKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `ai_recommendation_${user?.id}_${today}`;
  };

  const loadTodayRecommendation = () => {
    if (!user) return;
    
    const todayKey = getTodayRecommendationKey();
    const cachedRec = localStorage.getItem(todayKey);
    
    if (cachedRec) {
      try {
        const parsed = JSON.parse(cachedRec);
        setRecommendation(parsed.advice);
        setLastGenerated(parsed.timestamp);
        return true;
      } catch (error) {
        console.error('Error parsing cached recommendation:', error);
      }
    }
    return false;
  };

  const saveTodayRecommendation = (advice: string) => {
    if (!user) return;
    
    const todayKey = getTodayRecommendationKey();
    const dataToCache = {
      advice,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(todayKey, JSON.stringify(dataToCache));
  };

  const generateRecommendation = async () => {
    if (!user || !hasEnoughData()) return;
    
    setLoading(true);
    try {
      // Préparer les données détaillées pour l'IA avec les vraies statistiques
      const today = new Date().toISOString().split('T')[0];
      const todayConsumptions = consumptions.filter(c => c.date.startsWith(today));
      
      // Calculer correctement les stats de la semaine (7 derniers jours)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekConsumptions = consumptions.filter(c => new Date(c.date) >= weekAgo);
      
      // Compter par type pour la semaine
      const consommation_semaine_herbe = weekConsumptions.filter(c => c.type === 'herbe').length;
      const consommation_semaine_hash = weekConsumptions.filter(c => c.type === 'hash').length;
      const consommation_semaine_cigarette = weekConsumptions.filter(c => c.type === 'cigarette').length;

      const aiData = {
        age: profile?.age,
        objectif: profile?.consumption_goal,
        timeline: profile?.goal_timeline,
        motivation: profile?.goal_motivation,
        objectif_description: profile?.goal_description,
        consommations_du_jour: todayConsumptions,
        consommation_semaine_herbe,
        consommation_semaine_hash,
        consommation_semaine_cigarette,
        progression: consumptions.length > 7 ? 'stable' : 'debut',
        triggers_moments: profile?.triggers_moments || [],
        triggers_specific: profile?.triggers_specific || [],
        motivation_reasons: profile?.motivation_reasons || [],
        motivation_personal: profile?.motivation_personal,
        alternative_activities: profile?.alternative_activities || [],
        support_entourage: profile?.support_entourage,
        support_preference: profile?.support_preference,
        smokes_with_cannabis: profile?.smokes_with_cannabis || false,
        cigarettes_per_joint: profile?.cigarettes_per_joint || 1,
        daily_mood: 'normale', // Could be enhanced with user input
        daily_difficulty: 'normale', // Could be enhanced with user input  
        daily_notes: 'aucune' // Could be enhanced with user input
      };

      console.log('Sending correct data to AI:', {
        total_consumptions: consumptions.length,
        today_consumptions: todayConsumptions.length,
        week_herbe: consommation_semaine_herbe,
        week_hash: consommation_semaine_hash,
        week_cigarette: consommation_semaine_cigarette
      });

      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: aiData
      });

      if (error) throw error;

      if (data?.success && data?.advice) {
        setRecommendation(data.advice);
        const timestamp = new Date().toISOString();
        setLastGenerated(timestamp);
        saveTodayRecommendation(data.advice);
      }
    } catch (error) {
      console.error('Erreur génération recommandation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasEnoughData()) {
      // Check if we have a cached recommendation for today first
      const hasCachedRec = loadTodayRecommendation();
      
      // If no cached recommendation, generate a new one
      if (!hasCachedRec) {
        generateRecommendation();
      }
    }
  }, [profile, consumptions]);

  const formatRecommendation = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/🔍 ANALYSE/g, '<strong>🔍 ANALYSE</strong>')
      .replace(/💡 CONSEIL/g, '<strong>💡 CONSEIL</strong>')
      .replace(/🔥 MOTIVATION/g, '<strong>🔥 MOTIVATION</strong>')
      .replace(/🎯 ALTERNATIVE/g, '<strong>🎯 ALTERNATIVE</strong>')
      .replace(/\n/g, '<br/>');
  };

  const forceRefreshRecommendation = async () => {
    // Clear today's cache and generate new recommendation
    const todayKey = getTodayRecommendationKey();
    localStorage.removeItem(todayKey);
    await generateRecommendation();
  };

  if (!hasEnoughData()) {
    return (
      <Card className="glass-card border-dashed border-2 border-primary/30">
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Pas encore assez de données</h3>
          <p className="text-muted-foreground text-sm">
            {!profile?.consumption_goal 
              ? "Définis ton objectif dans les paramètres pour recevoir des recommandations personnalisées."
              : "Enregistre quelques consommations pour que l'IA puisse analyser tes habitudes."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="hologram-text">Recommandation IA du Jour</span>
          </div>
          <Button
            onClick={forceRefreshRecommendation}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="glass-button neon-glow"
            title="Générer une nouvelle recommandation"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
              <Sparkles className="w-6 h-6 text-purple-500 absolute top-3 left-3" />
            </div>
            <p className="text-muted-foreground animate-pulse text-center">
              Ton IA coach analyse tes données et prépare ta recommandation personnalisée...
            </p>
          </div>
        ) : recommendation ? (
          <div className="space-y-4">
            <div 
              className="prose prose-sm max-w-none bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-4 rounded-lg border border-purple-200/30"
              dangerouslySetInnerHTML={{ 
                __html: formatRecommendation(recommendation) 
              }}
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-primary/20">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Objectif: {profile?.consumption_goal}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Aujourd'hui: {consumptions.filter(c => c.date.startsWith(new Date().toISOString().split('T')[0])).length}
                </span>
              </div>
              {lastGenerated && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Généré à {new Date(lastGenerated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Button
              onClick={generateRecommendation}
              className="glass-button neon-glow"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Générer ma recommandation du jour
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyAIRecommendation;
