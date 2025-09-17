import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Zap, Crown, Medal, Award, Gift } from 'lucide-react';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { useProfile } from '@/hooks/useProfile';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  condition: (data: any) => boolean;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

const AchievementSystem = () => {
  const { consumptions, getStats } = useSupabaseConsumption();
  const { profile } = useProfile();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);

  const stats = getStats();

  const allAchievements: Achievement[] = [
    {
      id: 'first_entry',
      title: 'Premier Pas',
      description: 'Enregistrer votre première consommation',
      icon: Star,
      condition: (data) => data.consumptions.length >= 1,
      unlocked: false,
      rarity: 'common',
      points: 10
    },
    {
      id: 'week_tracker',
      title: 'Suivi Hebdomadaire',
      description: 'Enregistrer des données pendant 7 jours',
      icon: Target,
      condition: (data) => {
        const uniqueDays = new Set(data.consumptions.map((c: any) => c.date.split('T')[0]));
        return uniqueDays.size >= 7;
      },
      unlocked: false,
      rarity: 'rare',
      points: 50
    },
    {
      id: 'goal_setter',
      title: 'Visionnaire',
      description: 'Définir un objectif de consommation',
      icon: Trophy,
      condition: (data) => data.profile?.consumption_goal,
      unlocked: false,
      rarity: 'common',
      points: 20
    },
    {
      id: 'reduction_master',
      title: 'Maître de la Réduction',
      description: 'Réduire sa consommation de 50% sur une semaine',
      icon: Crown,
      condition: (data) => {
        // Logique simplifiée - à améliorer avec de vraies données temporelles
        const weekTotal = Object.values(data.stats.weekTotal).reduce((a, b) => Number(a) + Number(b), 0);
        const monthTotal = Object.values(data.stats.monthTotal).reduce((a, b) => Number(a) + Number(b), 0);
        const weeklyAverage = Number(monthTotal) / 4;
        return Number(weekTotal) < weeklyAverage * 0.5;
      },
      unlocked: false,
      rarity: 'epic',
      points: 100
    },
    {
      id: 'data_analyst',
      title: 'Analyste de Données',
      description: 'Consulter les statistiques 10 fois',
      icon: Medal,
      condition: () => {
        const viewCount = parseInt(localStorage.getItem('stats_view_count') || '0');
        return viewCount >= 10;
      },
      unlocked: false,
      rarity: 'rare',
      points: 30
    },
    {
      id: 'ai_coach_user',
      title: 'Élève Modèle',
      description: 'Utiliser le coach IA 5 fois',
      icon: Zap,
      condition: () => {
        const coachCount = parseInt(localStorage.getItem('ai_coach_count') || '0');
        return coachCount >= 5;
      },
      unlocked: false,
      rarity: 'rare',
      points: 40
    },
    {
      id: 'month_tracker',
      title: 'Persistance Légendaire',
      description: 'Enregistrer des données pendant 30 jours',
      icon: Award,
      condition: (data) => {
        const uniqueDays = new Set(data.consumptions.map((c: any) => c.date.split('T')[0]));
        return uniqueDays.size >= 30;
      },
      unlocked: false,
      rarity: 'legendary',
      points: 200
    }
  ];

  useEffect(() => {
    checkAchievements();
  }, [consumptions, profile]);

  const checkAchievements = () => {
    const data = { consumptions, profile, stats };
    const updatedAchievements = allAchievements.map(achievement => {
      const wasUnlocked = achievement.unlocked;
      const isNowUnlocked = achievement.condition(data);
      
      if (!wasUnlocked && isNowUnlocked) {
        setNewUnlocks(prev => [...prev, { ...achievement, unlocked: true }]);
      }
      
      return { ...achievement, unlocked: isNowUnlocked };
    });
    
    setAchievements(updatedAchievements);
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-100 text-gray-800';
      case 'rare': return 'border-blue-400 bg-blue-100 text-blue-800';
      case 'epic': return 'border-purple-400 bg-purple-100 text-purple-800';
      case 'legendary': return 'border-yellow-400 bg-yellow-100 text-yellow-800';
    }
  };

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Points et progression */}
      <Card className="glass-card border-2 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-yellow-400" />
              <span className="hologram-text">Système de Récompenses</span>
            </div>
            <Badge className="bg-yellow-600 text-white border-0 text-lg px-3 py-1">
              {totalPoints} pts
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{unlockedCount}</div>
              <div className="text-sm text-yellow-300">Succès débloqués</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{achievements.length - unlockedCount}</div>
              <div className="text-sm text-blue-300">À débloquer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nouvelles récompenses débloquées */}
      {newUnlocks.length > 0 && (
        <Card className="glass-card border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Nouveau Succès Débloqué !
            </CardTitle>
          </CardHeader>
          <CardContent>
            {newUnlocks.map(achievement => {
              const IconComponent = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg">
                  <IconComponent className="w-8 h-8 text-green-400" />
                  <div>
                    <h4 className="font-bold text-green-300">{achievement.title}</h4>
                    <p className="text-sm text-green-200">{achievement.description}</p>
                    <Badge className="mt-1 bg-green-600 text-white">+{achievement.points} pts</Badge>
                  </div>
                </div>
              );
            })}
            <Button 
              onClick={() => setNewUnlocks([])}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Liste des succès */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(achievement => {
          const IconComponent = achievement.icon;
          return (
            <Card 
              key={achievement.id} 
              className={`glass-card transition-all duration-300 ${
                achievement.unlocked 
                  ? 'border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
                  : 'border border-gray-500/30 opacity-60'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold ${achievement.unlocked ? 'text-green-300' : 'text-gray-400'}`}>
                        {achievement.title}
                      </h4>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className={`text-sm ${achievement.unlocked ? 'text-green-200' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                        {achievement.points} pts
                      </Badge>
                      {achievement.unlocked && (
                        <Badge className="bg-green-600 text-white">
                          ✅ Débloqué
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementSystem;