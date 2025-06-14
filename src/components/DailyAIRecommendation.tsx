
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

  const generateRecommendation = async () => {
    if (!user || !hasEnoughData()) return;
    
    setLoading(true);
    try {
      // Préparer les données pour l'IA
      const today = new Date().toISOString().split('T')[0];
      const todayConsumptions = consumptions.filter(c => c.date.startsWith(today));
      
      const aiData = {
        age: profile?.age,
        objectif: profile?.consumption_goal,
        timeline: profile?.goal_timeline,
        motivation: profile?.goal_motivation,
        objectif_description: profile?.goal_description,
        consommation_du_jour: todayConsumptions.length,
        consommation_semaine: Object.values(stats.weekTotal).reduce((a, b) => a + b, 0),
        consommation_mois: Object.values(stats.monthTotal).reduce((a, b) => a + b, 0),
        progression: consumptions.length > 7 ? 'stable' : 'debut'
      };

      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: aiData
      });

      if (error) throw error;

      if (data?.success && data?.advice) {
        setRecommendation(data.advice);
        setLastGenerated(new Date().toISOString());
      }
    } catch (error) {
      console.error('Erreur génération recommandation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Générer automatiquement la recommandation au chargement si on a assez de données
    if (hasEnoughData() && !recommendation) {
      generateRecommendation();
    }
  }, [profile, consumptions]);

  const formatRecommendation = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
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
            onClick={generateRecommendation}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="glass-button neon-glow"
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
              Ton IA coach analyse tes données et prépare ta recommandation du jour...
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
