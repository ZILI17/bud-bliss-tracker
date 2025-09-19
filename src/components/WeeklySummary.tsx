import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Cannabis, Cigarette, Scale, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ConsumptionStats } from '@/types/consumption';

interface WeeklySummaryProps {
  stats: ConsumptionStats;
}

const WeeklySummary = ({ stats }: WeeklySummaryProps) => {
  // Calculs pour cette semaine
  const weekTotalCount = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
  const weekTotalWeight = Object.values(stats.weekWeight).reduce((a, b) => a + b, 0);
  const weekTotalCost = Object.values(stats.weekCost).reduce((a, b) => a + b, 0);
  
  // Moyennes quotidiennes
  const dailyAvgCount = weekTotalCount / 7;
  const dailyAvgWeight = weekTotalWeight / 7;
  const dailyAvgCost = weekTotalCost / 7;

  // Tendances (simulé - en réalité on comparerait avec la semaine précédente)
  const trends = {
    count: Math.random() > 0.5 ? 'up' : 'down',
    weight: Math.random() > 0.5 ? 'up' : 'down',
    cost: Math.random() > 0.5 ? 'up' : 'down',
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cannabis className="w-5 h-5 text-primary" />
          Résumé de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Nombre total */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50/10 to-blue-100/5 border border-blue-200/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cannabis className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-300">Unités</span>
              </div>
              {getTrendIcon(trends.count)}
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-100">{weekTotalCount}</div>
              <div className="text-xs text-blue-300">
                {dailyAvgCount.toFixed(1)}/jour
              </div>
            </div>
          </div>

          {/* Poids total */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50/10 to-green-100/5 border border-green-200/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300">Grammes</span>
              </div>
              {getTrendIcon(trends.weight)}
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-100">{weekTotalWeight.toFixed(1)}g</div>
              <div className="text-xs text-green-300">
                {dailyAvgWeight.toFixed(1)}g/jour
              </div>
            </div>
          </div>

          {/* Cigarettes */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-50/10 to-slate-100/5 border border-slate-200/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cigarette className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300">Cigarettes</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-100">
                {stats.weekTotal.cigarette || 0}
              </div>
              <div className="text-xs text-slate-300">
                {((stats.weekTotal.cigarette || 0) / 7).toFixed(1)}/jour
              </div>
            </div>
          </div>

          {/* Coût total */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/10 to-amber-100/5 border border-amber-200/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-300">Coût</span>
              </div>
              {getTrendIcon(trends.cost)}
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-amber-100">{weekTotalCost.toFixed(0)}€</div>
              <div className="text-xs text-amber-300">
                {dailyAvgCost.toFixed(1)}€/jour
              </div>
            </div>
          </div>
        </div>

        {/* Détails par type */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Détail par type cette semaine</h4>
          <div className="space-y-2">
            {Object.entries(stats.weekTotal).map(([type, count]) => {
              if (count === 0) return null;
              
              const weight = stats.weekWeight[type] || 0;
              const cost = stats.weekCost[type] || 0;
              
              const typeConfig = {
                herbe: { label: 'Cannabis', color: 'bg-green-500/20 text-green-300', icon: Cannabis },
                hash: { label: 'Hash', color: 'bg-orange-500/20 text-orange-300', icon: Cannabis },
                cigarette: { label: 'Cigarettes', color: 'bg-slate-500/20 text-slate-300', icon: Cigarette },
              }[type as keyof typeof stats.weekTotal];

              if (!typeConfig) return null;

              const Icon = typeConfig.icon;

              return (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{typeConfig.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {count} unité{count > 1 ? 's' : ''}
                        {weight > 0 && ` • ${weight.toFixed(1)}g`}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={typeConfig.color}>
                    {cost.toFixed(1)}€
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;