import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart as PieChartIcon, Euro, TrendingUp, Calendar, Scale } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';
import CostStats from './CostStats';

interface StatsProps {
  stats: ConsumptionStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const [viewMode, setViewMode] = useState<'count' | 'weight'>('count');

  const typeColors = {
    herbe: '#22c55e',
    hash: '#f59e0b',
    cigarette: '#6b7280',
  };

  const typeLabels = {
    herbe: 'Herbe',
    hash: 'Hash',
    cigarette: 'Cigarettes',
  };

  // Données pour le graphique en camembert (répartition du mois)
  const pieData = Object.entries(stats.monthTotal).map(([type, count]) => ({
    name: typeLabels[type as keyof typeof typeLabels],
    value: count,
    fill: typeColors[type as keyof typeof typeColors],
  }));

  // Données pour le graphique en camembert des poids
  const pieWeightData = Object.entries(stats.monthWeight || {})
    .filter(([type]) => type !== 'cigarette')
    .map(([type, weight]) => ({
      name: typeLabels[type as keyof typeof typeLabels],
      value: Math.round(weight * 100) / 100,
      fill: typeColors[type as keyof typeof typeColors],
    }));

  const totalMonth = Object.values(stats.monthTotal).reduce((a, b) => a + b, 0);
  const totalWeek = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
  const totalMonthWeight = Object.values(stats.monthWeight || {}).reduce((a, b) => a + b, 0);
  const totalWeekWeight = Object.values(stats.weekWeight || {}).reduce((a, b) => a + b, 0);

  // Formatage personnalisé du tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} consommation${entry.value > 1 ? 's' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalMonth) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p>{`${data.value} consommation${data.value > 1 ? 's' : ''}`}</p>
          <p>{`${percentage}% du total`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomWeightTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalMonthWeight) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p>{`${data.value}g consommé${data.value > 1 ? 's' : ''}`}</p>
          <p>{`${percentage}% du poids total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold hologram-text flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Analyse Comportementale
        </h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'count' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('count')}
            className="glass-button"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Quantité
          </Button>
          <Button
            variant={viewMode === 'weight' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('weight')}
            className="glass-button"
          >
            <Scale className="w-4 h-4 mr-2" />
            Poids
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-card p-2 h-14">
          <TabsTrigger value="overview" className="flex items-center gap-2 h-10 glass-button neon-glow">
            <TrendingUp className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2 h-10 glass-button neon-glow">
            <BarChart3 className="w-4 h-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2 h-10 glass-button neon-glow">
            <PieChartIcon className="w-4 h-4" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2 h-10 glass-button neon-glow">
            <Euro className="w-4 h-4" />
            Coûts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-blue-600">
                  {totalWeek}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.entries(stats.weekTotal).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.weekTotal).length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                )}
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-green-600">
                  {totalMonth}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Ce mois</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.entries(stats.monthTotal).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.monthTotal).length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                )}
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-purple-600">
                  {Math.round(totalWeekWeight * 100) / 100}g
                </CardTitle>
                <p className="text-sm text-muted-foreground">Poids cette semaine</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.entries(stats.weekWeight || {})
                  .filter(([type]) => type !== 'cigarette')
                  .map(([type, weight]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                    <span className="font-medium">{Math.round(weight * 100) / 100}g</span>
                  </div>
                ))}
                {Object.keys(stats.weekWeight || {}).filter(type => type !== 'cigarette').length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                )}
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-orange-600">
                  {Math.round(totalMonthWeight * 100) / 100}g
                </CardTitle>
                <p className="text-sm text-muted-foreground">Poids ce mois</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.entries(stats.monthWeight || {})
                  .filter(([type]) => type !== 'cigarette')
                  .map(([type, weight]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                    <span className="font-medium">{Math.round(weight * 100) / 100}g</span>
                  </div>
                ))}
                {Object.keys(stats.monthWeight || {}).filter(type => type !== 'cigarette').length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution 7 derniers jours */}
            {stats.recentData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Évolution (7 derniers jours)</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total: {stats.recentData.reduce((acc, day) => acc + day.herbe + day.hash + day.cigarette, 0)} consommations
                    {totalWeekWeight > 0 && ` • ${Math.round(totalWeekWeight * 100) / 100}g`}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.recentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="herbe" fill={typeColors.herbe} name="Herbe" />
                        <Bar dataKey="hash" fill={typeColors.hash} name="Hash" />
                        <Bar dataKey="cigarette" fill={typeColors.cigarette} name="Cigarettes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Répartition du mois par nombre */}
            {pieData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition ce mois (nombre)</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total: {totalMonth} consommations
                  </p>
                </CardHeader>
                <CardContent>
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
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Répartition du mois par poids */}
            {pieWeightData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition ce mois (poids)</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total: {Math.round(totalMonthWeight * 100) / 100}g consommés
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieWeightData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieWeightData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomWeightTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Moyennes journalières */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moyennes journalières (30j)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Par nombre de consommations</h4>
                    <div className="space-y-1">
                      {Object.entries(stats.dailyAverage).map(([type, avg]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                          <span className="font-medium">{avg}/jour</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {Object.keys(stats.dailyWeightAverage || {}).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Par poids consommé</h4>
                      <div className="space-y-1">
                        {Object.entries(stats.dailyWeightAverage || {})
                          .filter(([type]) => type !== 'cigarette')
                          .map(([type, avg]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                            <span className="font-medium">{avg}g/jour</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message si pas de données */}
          {stats.recentData.length === 0 && pieData.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Aucune donnée à afficher. Commencez par ajouter des consommations !
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends">
          {/* ... keep existing trends content */}
        </TabsContent>

        <TabsContent value="distribution">
          {/* ... keep existing distribution content */}
        </TabsContent>

        <TabsContent value="costs">
          <CostStats stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stats;
