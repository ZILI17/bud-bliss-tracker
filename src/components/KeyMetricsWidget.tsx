import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cannabis, Cigarette, Scale, Euro, Target, TrendingUp, Calendar } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';

interface KeyMetricsWidgetProps {
  stats: ConsumptionStats;
}

const KeyMetricsWidget = ({ stats }: KeyMetricsWidgetProps) => {
  // Calculs des métriques clés
  const weekTotalCount = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
  const weekTotalWeight = Object.values(stats.weekWeight).reduce((a, b) => a + b, 0);
  const weekTotalCost = Object.values(stats.weekCost).reduce((a, b) => a + b, 0);
  const weekCigarettesTotal = stats.weekCigarettesTotal || 0;
  
  const monthTotalCount = Object.values(stats.monthTotal).reduce((a, b) => a + b, 0);
  const monthTotalWeight = Object.values(stats.monthWeight).reduce((a, b) => a + b, 0);
  const monthTotalCost = Object.values(stats.monthCost).reduce((a, b) => a + b, 0);
  const monthCigarettesTotal = stats.monthCigarettesTotal || 0;
  
  const dailyAvgCount = Object.values(stats.dailyAverage).reduce((a, b) => a + b, 0);
  const dailyAvgWeight = Object.values(stats.dailyWeightAverage).reduce((a, b) => a + b, 0);
  const dailyAvgCost = Object.values(stats.dailyCostAverage).reduce((a, b) => a + b, 0);
  const dailyAvgCigarettes = stats.dailyCigarettesAverage || 0;

  // Projections
  const monthlyProjection = dailyAvgCost * 30;
  const yearlyProjection = dailyAvgCost * 365;

  const metrics = [
    {
      label: 'Cette semaine',
      icon: Calendar,
      color: 'bg-gradient-to-br from-primary/20 to-primary/10',
      borderColor: 'border-primary/30',
      textColor: 'text-primary',
      mainValue: `${weekTotalCount}`,
      mainUnit: 'unités',
      details: [
        { label: 'Cigarettes', value: `${weekCigarettesTotal.toFixed(1)}` },
        { label: 'Poids', value: `${weekTotalWeight.toFixed(1)}g` },
        { label: 'Coût', value: `${weekTotalCost.toFixed(0)}€` },
      ]
    },
    {
      label: 'Moyenne quotidienne',
      icon: Target,
      color: 'bg-gradient-to-br from-green-500/20 to-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      mainValue: `${dailyAvgCount.toFixed(1)}`,
      mainUnit: 'unités/jour',
      details: [
        { label: 'Cigarettes', value: `${dailyAvgCigarettes.toFixed(1)}/j` },
        { label: 'Poids', value: `${dailyAvgWeight.toFixed(1)}g/j` },
        { label: 'Coût', value: `${dailyAvgCost.toFixed(1)}€/j` },
      ]
    },
    {
      label: 'Ce mois',
      icon: Calendar,
      color: 'bg-gradient-to-br from-orange-500/20 to-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      mainValue: `${monthTotalCount}`,
      mainUnit: 'unités',
      details: [
        { label: 'Poids', value: `${monthTotalWeight.toFixed(1)}g` },
        { label: 'Coût', value: `${monthTotalCost.toFixed(0)}€` },
      ]
    },
    {
      label: 'Projection annuelle',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-amber-500/20 to-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      mainValue: `${yearlyProjection.toFixed(0)}`,
      mainUnit: '€/an',
      details: [
        { label: 'Mensuel', value: `${monthlyProjection.toFixed(0)}€` },
        { label: 'Basé sur', value: `${dailyAvgCost.toFixed(1)}€/j` },
      ]
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className={`${metric.color} border ${metric.borderColor} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <Icon className="w-full h-full" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${metric.textColor}`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${metric.textColor}`}>
                    {metric.mainValue}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {metric.mainUnit}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {metric.details.map((detail, detailIndex) => (
                    <Badge 
                      key={detailIndex} 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-background/50"
                    >
                      {detail.label}: {detail.value}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KeyMetricsWidget;