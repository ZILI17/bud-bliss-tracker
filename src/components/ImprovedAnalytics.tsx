import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Euro, Scale, TrendingUp, Filter, Cannabis, Cigarette } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';
import { cn } from '@/lib/utils';

interface ImprovedAnalyticsProps {
  stats: ConsumptionStats;
  compact?: boolean;
}

type Period = 'week' | 'month';
type DataType = 'count' | 'weight' | 'cost';

const ImprovedAnalytics: React.FC<ImprovedAnalyticsProps> = ({ stats, compact = false }) => {
  const [period, setPeriod] = useState<Period>('week');
  const [dataType, setDataType] = useState<DataType>('count');

  const typeColors = {
    herbe: 'hsl(142, 76%, 36%)',
    hash: 'hsl(38, 92%, 50%)',
    cigarette: 'hsl(215, 16%, 47%)',
  };

  const typeLabels = {
    herbe: 'Cannabis',
    hash: 'Hash',
    cigarette: 'Cigarettes',
  };

  // Données en fonction de la période et du type
  const periodData = useMemo(() => {
    const totals = period === 'week' ? stats.weekTotal : stats.monthTotal;
    const weights = period === 'week' ? stats.weekWeight : stats.monthWeight;
    const costs = period === 'week' ? stats.weekCost : stats.monthCost;

    switch (dataType) {
      case 'weight':
        return Object.entries(weights || {})
          .filter(([type]) => type !== 'cigarette')
          .map(([type, value]) => ({
            type: typeLabels[type as keyof typeof typeLabels],
            value: Math.round(value * 100) / 100,
            fill: typeColors[type as keyof typeof typeColors],
            unit: 'g'
          }));
      case 'cost':
        return Object.entries(costs || {})
          .filter(([, value]) => value > 0)
          .map(([type, value]) => ({
            type: typeLabels[type as keyof typeof typeLabels],
            value: Math.round(value * 100) / 100,
            fill: typeColors[type as keyof typeof typeColors],
            unit: '€'
          }));
      default:
        return Object.entries(totals).map(([type, value]) => ({
          type: typeLabels[type as keyof typeof typeLabels],
          value,
          fill: typeColors[type as keyof typeof typeColors],
          unit: ''
        }));
    }
  }, [period, dataType, stats]);

  // Données séparées pour cannabis vs cigarettes
  const separatedData = useMemo(() => {
    const totals = period === 'week' ? stats.weekTotal : stats.monthTotal;
    const weights = period === 'week' ? stats.weekWeight : stats.monthWeight;
    const costs = period === 'week' ? stats.weekCost : stats.monthCost;

    const cannabisTotal = (totals.herbe || 0) + (totals.hash || 0);
    const cigaretteTotal = totals.cigarette || 0;

    const cannabisWeight = (weights?.herbe || 0) + (weights?.hash || 0);
    const cigaretteCount = totals.cigarette || 0;

    const cannabisCost = (costs.herbe || 0) + (costs.hash || 0);
    const cigaretteCost = costs.cigarette || 0;

    return {
      cannabis: {
        count: cannabisTotal,
        weight: Math.round(cannabisWeight * 100) / 100,
        cost: Math.round(cannabisCost * 100) / 100,
      },
      cigarette: {
        count: cigaretteTotal,
        weight: cigaretteCount, // En nombre de cigarettes
        cost: Math.round(cigaretteCost * 100) / 100,
      }
    };
  }, [period, stats]);

  // Moyennes quotidiennes séparées
  const dailyAverages = useMemo(() => {
    const cannabisAvg = (stats.dailyAverage.herbe || 0) + (stats.dailyAverage.hash || 0);
    const cigaretteAvg = stats.dailyAverage.cigarette || 0;
    
    const cannabisWeightAvg = (stats.dailyWeightAverage?.herbe || 0) + (stats.dailyWeightAverage?.hash || 0);
    
    const cannabisCostAvg = (stats.dailyCostAverage.herbe || 0) + (stats.dailyCostAverage.hash || 0);
    const cigaretteCostAvg = stats.dailyCostAverage.cigarette || 0;

    return {
      cannabis: {
        count: Math.round(cannabisAvg * 100) / 100,
        weight: Math.round(cannabisWeightAvg * 100) / 100,
        cost: Math.round(cannabisCostAvg * 100) / 100,
      },
      cigarette: {
        count: Math.round(cigaretteAvg * 100) / 100,
        cost: Math.round(cigaretteCostAvg * 100) / 100,
      }
    };
  }, [stats]);

  const formatValue = (value: number, unit: string) => {
    return unit === '€' ? `${value.toFixed(2)}€` : `${value}${unit}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.payload.type}</p>
          <p className="text-primary">
            {formatValue(data.value, data.payload.unit)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <div className="space-y-6">
        {/* Aperçu séparé */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cannabis/Hash */}
          <Card className="glass-card border-emerald-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
                <Cannabis className="w-5 h-5" />
                Cannabis & Hash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Moyenne/jour :</span>
                <span className="font-bold text-emerald-600">
                  {dailyAverages.cannabis.count}/j
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Poids/jour :</span>
                <span className="font-bold text-emerald-600">
                  {dailyAverages.cannabis.weight}g/j
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Coût/jour :</span>
                <span className="font-bold text-emerald-600">
                  {dailyAverages.cannabis.cost.toFixed(2)}€/j
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cigarettes */}
          <Card className="glass-card border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <Cigarette className="w-5 h-5" />
                Cigarettes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Moyenne/jour :</span>
                <span className="font-bold text-slate-600">
                  {dailyAverages.cigarette.count}/j
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Coût/jour :</span>
                <span className="font-bold text-slate-600">
                  {dailyAverages.cigarette.cost.toFixed(2)}€/j
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphique simplifié des 7 derniers jours */}
        {stats.recentData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendance (7 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.recentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="herbe" 
                      stackId="1" 
                      stroke={typeColors.herbe} 
                      fill={typeColors.herbe}
                      fillOpacity={0.6}
                      name="Cannabis"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hash" 
                      stackId="1" 
                      stroke={typeColors.hash} 
                      fill={typeColors.hash}
                      fillOpacity={0.6}
                      name="Hash"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cigarette" 
                      stackId="2" 
                      stroke={typeColors.cigarette} 
                      fill={typeColors.cigarette}
                      fillOpacity={0.6}
                      name="Cigarettes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec titre */}
      <div className="text-center">
        <h2 className="text-3xl font-bold hologram-text flex items-center justify-center gap-3">
          <BarChart3 className="w-8 h-8" />
          Analytics Avancées
          <BarChart3 className="w-8 h-8" />
        </h2>
        <p className="text-muted-foreground mt-2">
          Analyse détaillée de vos habitudes avec filtres intelligents
        </p>
      </div>

      {/* Filtres */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <Select value={dataType} onValueChange={(value: DataType) => setDataType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Quantité</SelectItem>
                  <SelectItem value="weight">Poids</SelectItem>
                  <SelectItem value="cost">Coût</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu séparé Cannabis vs Cigarettes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cannabis/Hash */}
        <Card className="glass-card border-emerald-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-emerald-700">
              <Cannabis className="w-6 h-6" />
              Cannabis & Hash
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {period === 'week' ? 'Cette semaine' : 'Ce mois'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card p-3 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{separatedData.cannabis.count}</p>
                <p className="text-xs text-muted-foreground">Consommations</p>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{separatedData.cannabis.weight}g</p>
                <p className="text-xs text-muted-foreground">Poids total</p>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{separatedData.cannabis.cost.toFixed(2)}€</p>
                <p className="text-xs text-muted-foreground">Coût total</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2 text-emerald-700">Moyennes quotidiennes :</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Quantité :</span>
                  <span className="font-medium">{dailyAverages.cannabis.count}/jour</span>
                </div>
                <div className="flex justify-between">
                  <span>Poids :</span>
                  <span className="font-medium">{dailyAverages.cannabis.weight}g/jour</span>
                </div>
                <div className="flex justify-between">
                  <span>Coût :</span>
                  <span className="font-medium">{dailyAverages.cannabis.cost.toFixed(2)}€/jour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cigarettes */}
        <Card className="glass-card border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-slate-700">
              <Cigarette className="w-6 h-6" />
              Cigarettes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {period === 'week' ? 'Cette semaine' : 'Ce mois'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="glass-card p-3 rounded-lg">
                <p className="text-2xl font-bold text-slate-600">{separatedData.cigarette.count}</p>
                <p className="text-xs text-muted-foreground">Cigarettes</p>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <p className="text-2xl font-bold text-slate-600">{separatedData.cigarette.cost.toFixed(2)}€</p>
                <p className="text-xs text-muted-foreground">Coût total</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2 text-slate-700">Moyennes quotidiennes :</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Quantité :</span>
                  <span className="font-medium">{dailyAverages.cigarette.count}/jour</span>
                </div>
                <div className="flex justify-between">
                  <span>Coût :</span>
                  <span className="font-medium">{dailyAverages.cigarette.cost.toFixed(2)}€/jour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques détaillés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique filtré */}
        {periodData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Répartition par {dataType === 'count' ? 'quantité' : dataType === 'weight' ? 'poids' : 'coût'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {period === 'week' ? 'Cette semaine' : 'Ce mois'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={periodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ type, value, unit }) => `${type}: ${formatValue(value, unit)}`}
                    >
                      {periodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Évolution temporelle */}
        {stats.recentData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Évolution (7 derniers jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.recentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="herbe" 
                      stroke={typeColors.herbe} 
                      strokeWidth={3}
                      name="Cannabis"
                      dot={{ fill: typeColors.herbe, strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hash" 
                      stroke={typeColors.hash} 
                      strokeWidth={3}
                      name="Hash"
                      dot={{ fill: typeColors.hash, strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cigarette" 
                      stroke={typeColors.cigarette} 
                      strokeWidth={3}
                      name="Cigarettes"
                      dot={{ fill: typeColors.cigarette, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Projections financières */}
      <Card className="glass-card border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
            <Euro className="w-5 h-5" />
            Projections financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center glass-card p-4 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">
                {((dailyAverages.cannabis.cost + dailyAverages.cigarette.cost) * 30).toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Projection mensuelle</p>
            </div>
            <div className="text-center glass-card p-4 rounded-lg">
              <p className="text-2xl font-bold text-amber-700">
                {((dailyAverages.cannabis.cost + dailyAverages.cigarette.cost) * 365).toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Projection annuelle</p>
            </div>
            <div className="text-center glass-card p-4 rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {(dailyAverages.cannabis.cost + dailyAverages.cigarette.cost).toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Coût moyen/jour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedAnalytics;