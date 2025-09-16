import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, Cigarette, Cannabis, Euro } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';

interface ImprovedStatsProps {
  stats: ConsumptionStats;
  compact?: boolean;
}

const ImprovedStats = ({ stats, compact = false }: ImprovedStatsProps) => {
  const typeColors = {
    herbe: '#22c55e',
    hash: '#f59e0b', 
    cigarette: '#6b7280',
  };

  const typeLabels = {
    herbe: 'Cannabis',
    hash: 'Hash',
    cigarette: 'Cigarettes',
  };

  // Transformer les données pour les graphiques avec des labels plus clairs
  const chartData = useMemo(() => {
    return stats.recentData.map(day => ({
      date: new Date(day.date).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      fullDate: day.date,
      cannabis: day.herbe,
      hash: day.hash,
      cigarettes: day.cigarette,
      'Cannabis (g)': day.herbeWeight,
      'Hash (g)': day.hashWeight,
      'Coût total (€)': (day.herbeCost + day.hashCost + day.cigaretteCost).toFixed(2),
      totalCount: day.herbe + day.hash + day.cigarette,
      totalWeight: day.herbeWeight + day.hashWeight,
      totalCost: day.herbeCost + day.hashCost + day.cigaretteCost
    }));
  }, [stats.recentData]);

  // Données pour le pie chart avec de meilleures labels
  const pieData = useMemo(() => {
    const monthData = [
      { name: 'Cannabis', value: stats.monthTotal.herbe || 0, fill: typeColors.herbe },
      { name: 'Hash', value: stats.monthTotal.hash || 0, fill: typeColors.hash },
      { name: 'Cigarettes', value: stats.monthTotal.cigarette || 0, fill: typeColors.cigarette },
    ].filter(item => item.value > 0);
    
    return monthData;
  }, [stats.monthTotal]);

  // Totaux et moyennes avec des calculs plus précis
  const totals = useMemo(() => {
    const weekTotal = Object.values(stats.weekTotal).reduce((a, b) => a + b, 0);
    const monthTotal = Object.values(stats.monthTotal).reduce((a, b) => a + b, 0);
    const weekCost = Object.values(stats.weekCost).reduce((a, b) => a + b, 0);
    const monthCost = Object.values(stats.monthCost).reduce((a, b) => a + b, 0);
    const dailyAvgCost = Object.values(stats.dailyCostAverage).reduce((a, b) => a + b, 0);
    
    return {
      week: { count: weekTotal, cost: weekCost },
      month: { count: monthTotal, cost: monthCost },
      dailyAvg: { cost: dailyAvgCost },
      projections: {
        monthly: dailyAvgCost * 30,
        yearly: dailyAvgCost * 365
      }
    };
  }, [stats]);

  // Tooltip personnalisé plus informatif
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.dataKey}</span>
                </div>
                <span className="font-medium text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
          {data.totalCost > 0 && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Coût total</span>
                <span className="font-medium text-foreground">{data.totalCost.toFixed(2)}€</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Indicateurs clés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-900">{totals.week.count}</div>
            <div className="text-xs text-blue-700">Cette semaine</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-900">{totals.month.count}</div>
            <div className="text-xs text-green-700">Ce mois</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <div className="text-lg font-bold text-amber-900">{totals.week.cost.toFixed(0)}€</div>
            <div className="text-xs text-amber-700">Coût semaine</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-lg font-bold text-purple-900">{totals.dailyAvg.cost.toFixed(1)}€</div>
            <div className="text-xs text-purple-700">Moy./jour</div>
          </div>
        </div>

        {/* Graphique compact */}
        {chartData.length > 0 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 10 }}
                />
                <YAxis className="text-xs" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="totalCount" 
                  stroke={typeColors.herbe} 
                  fill={typeColors.herbe}
                  fillOpacity={0.6}
                  name="Total consommations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec indicateurs principaux */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analyse Détaillée
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{totals.week.count}</div>
            <div className="text-sm text-blue-700">Cette semaine</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              {totals.week.cost.toFixed(0)}€
            </Badge>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-2xl font-bold text-green-900">{totals.month.count}</div>
            <div className="text-sm text-green-700">Ce mois</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              {totals.month.cost.toFixed(0)}€
            </Badge>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="text-2xl font-bold text-amber-900">{totals.dailyAvg.cost.toFixed(1)}€</div>
            <div className="text-sm text-amber-700">Moyenne/jour</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              30j
            </Badge>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{totals.projections.yearly.toFixed(0)}€</div>
            <div className="text-sm text-purple-700">Projection/an</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Estimation
            </Badge>
          </Card>
        </div>
      </div>

      {/* Graphiques avec onglets */}
      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evolution" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Évolution
          </TabsTrigger>
          <TabsTrigger value="repartition" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="financier" className="flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Financier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Évolution des 7 derniers jours</CardTitle>
              <p className="text-sm text-muted-foreground">
                Suivi quotidien de vos consommations par type
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      className="text-sm"
                    />
                    <YAxis className="text-sm" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cannabis" fill={typeColors.herbe} name="Cannabis" />
                    <Bar dataKey="hash" fill={typeColors.hash} name="Hash" />
                    <Bar dataKey="cigarettes" fill={typeColors.cigarette} name="Cigarettes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repartition" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition mensuelle</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution par type de consommation
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moyennes détaillées</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Basées sur les 30 derniers jours
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.dailyAverage).map(([type, avg]) => {
                  const Icon = type === 'cigarette' ? Cigarette : Cannabis;
                  const color = type === 'herbe' ? 'text-green-600' : 
                               type === 'hash' ? 'text-orange-600' : 'text-gray-600';
                  
                  return (
                    <div key={type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="font-medium">{typeLabels[type as keyof typeof typeLabels]}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{avg}/jour</div>
                        <div className="text-xs text-muted-foreground">
                          {stats.dailyCostAverage[type]?.toFixed(2)}€/jour
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financier" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                  <Euro className="w-5 h-5" />
                  Impact financier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Moyenne quotidienne</span>
                    <span className="font-bold text-amber-900">{totals.dailyAvg.cost.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Projection mensuelle</span>
                    <span className="font-bold text-amber-900">{totals.projections.monthly.toFixed(0)}€</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-amber-200">
                    <span className="text-sm text-amber-700">Projection annuelle</span>
                    <span className="font-bold text-xl text-amber-900">{totals.projections.yearly.toFixed(0)}€</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 text-center">
                    💰 Basé sur vos habitudes de consommation actuelles
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution des coûts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dépenses quotidiennes des 7 derniers jours
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip 
                        formatter={(value: any) => [`${parseFloat(value).toFixed(2)}€`, 'Coût']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalCost" 
                        stroke="#f59e0b" 
                        fill="#f59e0b"
                        fillOpacity={0.6}
                        name="Coût total"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Message si pas de données */}
      {chartData.length === 0 && (
        <Card>
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