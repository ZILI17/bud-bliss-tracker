import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingDown, Calendar, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';

const InteractiveGoalTracker = () => {
  const { profile } = useProfile();
  const { consumptions, getStats } = useSupabaseConsumption();
  const [weeklyGoal, setWeeklyGoal] = useState<number | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);

  const stats = getStats();

  useEffect(() => {
    // Calculer des objectifs basés sur le profil utilisateur
    if (profile?.consumption_goal === 'reduction') {
      const currentWeekly = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
      setWeeklyGoal(Math.max(1, Math.floor(currentWeekly * 0.8))); // Réduction de 20%
      setDailyGoal(Math.max(1, Math.floor(currentWeekly * 0.8 / 7)));
    } else if (profile?.consumption_goal === 'arret') {
      setWeeklyGoal(0);
      setDailyGoal(0);
    } else if (profile?.consumption_goal === 'controle') {
      const currentWeekly = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
      setWeeklyGoal(currentWeekly); // Maintenir le niveau actuel
      setDailyGoal(Math.floor(currentWeekly / 7));
    }
  }, [profile, stats]);

  const currentWeekly = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayConsumptions = consumptions.filter(c => c.date.startsWith(today)).length;

  const weeklyProgress = weeklyGoal ? Math.min(100, (currentWeekly / weeklyGoal) * 100) : 0;
  const dailyProgress = dailyGoal ? Math.min(100, (todayConsumptions / dailyGoal) * 100) : 0;

  const getProgressColor = (progress: number, isReduction: boolean = true) => {
    if (isReduction) {
      if (progress <= 50) return 'bg-green-500';
      if (progress <= 80) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (progress >= 80) return 'bg-green-500';
      if (progress >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const getStatusIcon = (progress: number, isReduction: boolean = true) => {
    const isGood = isReduction ? progress <= 80 : progress >= 80;
    return isGood ? CheckCircle : AlertCircle;
  };

  if (!profile?.consumption_goal || !weeklyGoal) {
    return (
      <Card className="glass-card border-dashed border-2 border-primary/30">
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Définissez votre objectif</h3>
          <p className="text-muted-foreground text-sm">
            Configurez votre objectif dans les paramètres pour activer le suivi interactif.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isReductionGoal = profile.consumption_goal === 'reduction' || profile.consumption_goal === 'arret';

  return (
    <Card className="glass-card border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            <span className="hologram-text">Suivi d'Objectif Interactif</span>
          </div>
          <Badge className="bg-blue-600 text-white border-0">
            {profile.consumption_goal}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Objectif quotidien */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Objectif du jour</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{todayConsumptions}/{dailyGoal}</span>
              {React.createElement(getStatusIcon(dailyProgress, isReductionGoal), {
                className: `w-5 h-5 ${dailyProgress <= 80 && isReductionGoal ? 'text-green-400' : 'text-red-400'}`
              })}
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={dailyProgress} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Aujourd'hui</span>
              <span className={`font-medium ${
                dailyProgress <= 80 && isReductionGoal ? 'text-green-400' : 
                dailyProgress <= 100 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {dailyProgress.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Objectif hebdomadaire */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Objectif de la semaine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{currentWeekly}/{weeklyGoal}</span>
              {React.createElement(getStatusIcon(weeklyProgress, isReductionGoal), {
                className: `w-5 h-5 ${weeklyProgress <= 80 && isReductionGoal ? 'text-green-400' : 'text-red-400'}`
              })}
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={weeklyProgress} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Cette semaine</span>
              <span className={`font-medium ${
                weeklyProgress <= 80 && isReductionGoal ? 'text-green-400' : 
                weeklyProgress <= 100 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {weeklyProgress.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Messages motivationnels dynamiques */}
        <div className="p-4 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">Message du jour</span>
          </div>
          <p className="text-sm">
            {weeklyProgress <= 50 && isReductionGoal && "🌟 Excellent ! Vous êtes en avance sur votre objectif !"}
            {weeklyProgress > 50 && weeklyProgress <= 80 && isReductionGoal && "👍 Bon rythme ! Restez concentré sur votre objectif."}
            {weeklyProgress > 80 && weeklyProgress <= 100 && isReductionGoal && "⚠️ Attention, vous approchez de votre limite hebdomadaire."}
            {weeklyProgress > 100 && isReductionGoal && "🚨 Objectif dépassé. Prenez du recul et analysez vos déclencheurs."}
            {!isReductionGoal && weeklyProgress >= 80 && "✅ Objectif de maintien respecté !"}
            {!isReductionGoal && weeklyProgress < 80 && "📊 Continuez votre suivi régulier."}
          </p>
        </div>

        {/* Conseils basés sur les déclencheurs */}
        {profile.triggers_moments && profile.triggers_moments.length > 0 && (
          <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
            <h4 className="font-medium text-amber-300 mb-2">💡 Conseil basé sur vos déclencheurs</h4>
            <p className="text-xs text-amber-200">
              Vos moments à risque : {profile.triggers_moments.slice(0, 2).join(', ')}. 
              Préparez une alternative pour ces moments !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveGoalTracker;