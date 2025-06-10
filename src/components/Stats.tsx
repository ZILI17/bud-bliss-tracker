
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, PieChart, Pie, Cell } from 'recharts';
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
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne/jour (30j)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(stats.dailyAverage).map(([type, avg]) => (
              <div key={type} className="flex justify-between text-sm">
                <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                <span className="font-medium">{avg}</span>
              </div>
            ))}
            {Object.keys(stats.dailyAverage).length === 0 && (
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition ce mois</CardTitle>
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
    </div>
  );
};

export default Stats;
