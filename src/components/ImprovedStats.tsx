import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Calendar, Euro, Target } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';
import WeeklySummary from './WeeklySummary';
import DailyEvolutionChart from './DailyEvolutionChart';
import KeyMetricsWidget from './KeyMetricsWidget';

interface ImprovedStatsProps {
  stats: ConsumptionStats;
  compact?: boolean;
}

const ImprovedStats = ({ stats, compact = false }: ImprovedStatsProps) => {
  // Données pour le pie chart de répartition
  const pieData = useMemo(() => {
    const monthData = [
      { name: 'Cannabis', value: stats.monthTotal.herbe || 0, fill: 'hsl(var(--primary))' },
      { name: 'Hash', value: stats.monthTotal.hash || 0, fill: '#f59e0b' },
      { name: 'Cigarettes', value: stats.monthTotal.cigarette || 0, fill: '#6b7280' },
    ].filter(item => item.value > 0);
    
    return monthData;
  }, [stats.monthTotal]);

  if (compact) {
    return (
      <div className="space-y-4">
        <KeyMetricsWidget stats={stats} />
        <DailyEvolutionChart stats={stats} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analyse détaillée
        </h2>
        <KeyMetricsWidget stats={stats} />
      </div>

      {/* Graphiques avec onglets */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="evolution" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Évolution
          </TabsTrigger>
          <TabsTrigger value="repartition" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Répartition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WeeklySummary stats={stats} />
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <DailyEvolutionChart stats={stats} />
        </TabsContent>

        <TabsContent value="repartition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Répartition mensuelle</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution par type de consommation
                </p>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Aucune donnée pour ce mois
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Moyennes détaillées</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Basées sur les 30 derniers jours
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.dailyAverage).length > 0 ? (
                  Object.entries(stats.dailyAverage).map(([type, avg]) => {
                    const weight = stats.dailyWeightAverage[type] || 0;
                    const cost = stats.dailyCostAverage[type] || 0;
                    
                    const typeConfig = {
                      herbe: { label: 'Cannabis', color: 'text-primary' },
                      hash: { label: 'Hash', color: 'text-orange-400' },
                      cigarette: { label: 'Cigarettes', color: 'text-slate-400' },
                    }[type as keyof typeof stats.dailyAverage];

                    if (!typeConfig || avg === 0) return null;

                    return (
                      <div key={type} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{typeConfig.label}</span>
                          <span className={`text-sm font-bold ${typeConfig.color}`}>
                            {avg.toFixed(1)}/jour
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {weight > 0 && (
                            <div>Poids: {weight.toFixed(1)}g/jour</div>
                          )}
                          <div>Coût: {cost.toFixed(2)}€/jour</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Message si pas de données */}
      {stats.recentData.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucune donnée à afficher</h3>
            <p className="text-muted-foreground">
              Commencez par ajouter des consommations pour voir vos statistiques !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImprovedStats;