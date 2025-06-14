
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Euro, TrendingUp, Scale } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';

interface StatsProps {
  stats: ConsumptionStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
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

  const totalMonth = Object.values(stats.monthTotal).reduce((a, b) => a + b, 0);
  const totalWeek = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
  const totalMonthWeight = Object.values(stats.monthWeight || {}).reduce((a, b) => a + b, 0);
  const totalWeekWeight = Object.values(stats.weekWeight || {}).reduce((a, b) => a + b, 0);

  const weekTotalCost = Object.values(stats.weekCost).reduce((sum, cost) => sum + cost, 0);
  const monthTotalCost = Object.values(stats.monthCost).reduce((sum, cost) => sum + cost, 0);
  const dailyAverageCost = Object.values(stats.dailyCostAverage).reduce((sum, cost) => sum + cost, 0);

  const formatEuro = (amount: number) => `${amount.toFixed(2)}€`;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold hologram-text flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Analyse Comportementale
        </h2>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center glass-card">
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
          </CardContent>
        </Card>

        <Card className="text-center glass-card">
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
          </CardContent>
        </Card>

        <Card className="text-center glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-purple-600">
              {Math.round(totalWeekWeight * 100) / 100}g
            </CardTitle>
            <p className="text-sm text-muted-foreground">Poids semaine</p>
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
          </CardContent>
        </Card>

        <Card className="text-center glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-orange-600">
              {formatEuro(weekTotalCost)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Coût semaine</p>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(stats.weekCost).map(([type, cost]) => {
              if (cost > 0) {
                return (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                    <span className="font-medium">{formatEuro(cost)}</span>
                  </div>
                );
              }
              return null;
            })}
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution 7 derniers jours */}
        {stats.recentData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Évolution (7 derniers jours)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {stats.recentData.reduce((acc, day) => acc + day.herbe + day.hash + day.cigarette, 0)} consommations
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

        {/* Répartition du mois */}
        {pieData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Répartition ce mois</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {totalMonth} consommations • {formatEuro(monthTotalCost)}
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
      </div>

      {/* Moyennes et projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moyennes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Moyennes journalières (30j)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Par nombre
                </h4>
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
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Par poids
                  </h4>
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

        {/* Projections financières */}
        <Card className="glass-card border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
              <Euro className="w-5 h-5" />
              Impact financier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Moyenne/jour :</span>
              <span className="font-semibold">{formatEuro(dailyAverageCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Projection mensuelle :</span>
              <span className="font-semibold text-amber-700">{formatEuro(dailyAverageCost * 30)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Projection annuelle :</span>
              <span className="font-bold text-amber-800 text-lg">{formatEuro(dailyAverageCost * 365)}</span>
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-600">
                💡 Basé sur vos habitudes actuelles de consommation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message si pas de données */}
      {stats.recentData.length === 0 && pieData.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Aucune donnée à afficher. Commencez par ajouter des consommations !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Stats;
