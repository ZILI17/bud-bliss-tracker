import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Target, Calendar, Star } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';

const StreakDisplay = () => {
  const { profile } = useProfile();
  const { consumptions } = useSupabaseConsumption();

  // Calculer les streaks côté client (en attendant les champs DB)
  const calculateStreaks = () => {
    if (consumptions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, todayLogged: false };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayConsumptions = consumptions.filter(c => c.date.startsWith(today));
    
    // Grouper par jour
    const dayGroups = consumptions.reduce((acc, consumption) => {
      const day = consumption.date.split('T')[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(consumption);
      return acc;
    }, {} as Record<string, any[]>);

    const sortedDays = Object.keys(dayGroups).sort().reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculer le streak actuel
    for (const day of sortedDays) {
      if (dayGroups[day].length > 0) {
        if (currentStreak === 0 && day === today) {
          currentStreak = 1;
        } else if (currentStreak > 0) {
          currentStreak++;
        }
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
        if (currentStreak === 0) break;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return { 
      currentStreak, 
      longestStreak, 
      todayLogged: todayConsumptions.length > 0 
    };
  };

  const { currentStreak, longestStreak, todayLogged } = calculateStreaks();

  // Calculer les niveaux et récompenses
  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'Légende', color: 'text-purple-400', bg: 'bg-purple-900/30' };
    if (streak >= 14) return { level: 'Expert', color: 'text-blue-400', bg: 'bg-blue-900/30' };
    if (streak >= 7) return { level: 'Avancé', color: 'text-green-400', bg: 'bg-green-900/30' };
    if (streak >= 3) return { level: 'Débutant', color: 'text-yellow-400', bg: 'bg-yellow-900/30' };
    return { level: 'Novice', color: 'text-gray-400', bg: 'bg-gray-900/30' };
  };

  const currentLevel = getStreakLevel(currentStreak);
  const nextMilestone = currentStreak < 3 ? 3 : currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : 30;
  const progressToNext = currentStreak >= 30 ? 100 : (currentStreak / nextMilestone) * 100;

  return (
    <Card className="glass-card border-2 border-primary/30 relative overflow-hidden">
      {/* Effet visuel de gamification */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-green-500/10 pointer-events-none"></div>
      
      <CardHeader className="relative z-10 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-lg font-bold hologram-text">Série de Suivi</span>
          </div>
          <Badge className={`${currentLevel.bg} ${currentLevel.color} border-0 font-bold`}>
            {currentLevel.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        {/* Streak actuel */}
        <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
          <div className="text-4xl font-bold text-orange-400 mb-2">
            {currentStreak}
          </div>
          <div className="text-sm text-orange-300">
            jour{currentStreak > 1 ? 's' : ''} de suivi consécutif{currentStreak > 1 ? 's' : ''}
          </div>
          {todayLogged && (
            <div className="mt-2">
              <Badge className="bg-green-600 text-white border-0">
                ✅ Aujourd'hui enregistré
              </Badge>
            </div>
          )}
        </div>

        {/* Progression vers le prochain niveau */}
        {currentStreak < 30 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prochain niveau :</span>
              <span className="font-medium">{nextMilestone} jours</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              Plus que {nextMilestone - currentStreak} jour{nextMilestone - currentStreak > 1 ? 's' : ''} !
            </div>
          </div>
        )}

        {/* Record personnel */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">Record personnel</span>
          </div>
          <span className="font-bold text-yellow-400">{longestStreak} jours</span>
        </div>

        {/* Motivation du jour */}
        <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
          <Star className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <p className="text-xs text-blue-300">
            {currentStreak === 0 && "Commencez votre série dès aujourd'hui !"}
            {currentStreak === 1 && "Excellent début ! Continuez demain."}
            {currentStreak >= 2 && currentStreak < 7 && "Vous prenez le rythme ! 🔥"}
            {currentStreak >= 7 && currentStreak < 14 && "Une semaine complète ! Impressionnant ! 🌟"}
            {currentStreak >= 14 && currentStreak < 30 && "Deux semaines ! Vous êtes sur la bonne voie ! 🚀"}
            {currentStreak >= 30 && "Un mois complet ! Vous êtes une légende ! 👑"}
          </p>
        </div>

        {/* Objectifs quotidiens */}
        {!todayLogged && (
          <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <Target className="w-5 h-5 mx-auto mb-2 text-green-400" />
            <p className="text-xs text-green-300">
              N'oubliez pas d'enregistrer vos consommations aujourd'hui pour maintenir votre série !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;