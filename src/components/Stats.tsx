
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
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

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(stats.weekTotal).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-sm">{typeLabels[type as keyof typeof typeLabels]}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(stats.weekTotal).length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ce mois
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(stats.monthTotal).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-sm">{typeLabels[type as keyof typeof typeLabels]}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(stats.monthTotal).length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne/jour
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(stats.dailyAverage).map(([type, avg]) => (
              <div key={type} className="flex justify-between">
                <span className="text-sm">{typeLabels[type as keyof typeof typeLabels]}</span>
                <span className="font-semibold">{avg}</span>
              </div>
            ))}
            {Object.keys(stats.dailyAverage).length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune donnée</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Graphique 7 derniers jours */}
      {stats.recentData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentData}>
                  <XAxis dataKey="date" />
                  <YAxis />
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
    </div>
  );
};

export default Stats;
