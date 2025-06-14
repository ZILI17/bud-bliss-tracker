
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro, TrendingUp, AlertTriangle } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';

interface CostStatsProps {
  stats: ConsumptionStats;
}

const CostStats: React.FC<CostStatsProps> = ({ stats }) => {
  const formatEuro = (amount: number) => `${amount.toFixed(2)}€`;

  const weekTotalCost = Object.values(stats.weekCost).reduce((sum, cost) => sum + cost, 0);
  const monthTotalCost = Object.values(stats.monthCost).reduce((sum, cost) => sum + cost, 0);
  const dailyAverageCost = Object.values(stats.dailyCostAverage).reduce((sum, cost) => sum + cost, 0);

  // Calcul des projections
  const yearlyProjection = dailyAverageCost * 365;
  const monthlyProjection = dailyAverageCost * 30;

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Euro className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-blue-600">{formatEuro(weekTotalCost)}</p>
            <p className="text-sm text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Euro className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-purple-600">{formatEuro(monthTotalCost)}</p>
            <p className="text-sm text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">{formatEuro(dailyAverageCost)}</p>
            <p className="text-sm text-muted-foreground">Moyenne/jour</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Euro className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold text-red-600">{formatEuro(stats.totalCost)}</p>
            <p className="text-sm text-muted-foreground">Total enregistré</p>
          </CardContent>
        </Card>
      </div>

      {/* Projections et alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              Projections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Sur un mois :</span>
              <span className="font-semibold text-amber-700">{formatEuro(monthlyProjection)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sur un an :</span>
              <span className="font-bold text-amber-800 text-lg">{formatEuro(yearlyProjection)}</span>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Basé sur votre moyenne journalière actuelle
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <Euro className="w-5 h-5" />
              Répartition des coûts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.weekCost).map(([type, cost]) => {
              const typeLabels = {
                herbe: 'Cannabis',
                hash: 'Hash',
                cigarette: 'Cigarettes'
              };
              
              if (cost > 0) {
                return (
                  <div key={type} className="flex justify-between">
                    <span className="text-sm">{typeLabels[type as keyof typeof typeLabels]} :</span>
                    <span className="font-semibold text-green-700">{formatEuro(cost)}</span>
                  </div>
                );
              }
              return null;
            })}
            <p className="text-xs text-green-600 mt-2">
              Dépenses de cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Message motivationnel */}
      {yearlyProjection > 500 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 mb-1">Impact financier significatif</p>
                <p className="text-sm text-red-600">
                  Avec une projection de <strong>{formatEuro(yearlyProjection)}</strong> par an, 
                  réduire votre consommation pourrait vous faire économiser des centaines d'euros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostStats;
