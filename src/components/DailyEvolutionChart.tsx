import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Cannabis, Cigarette, Scale, Euro, TrendingUp } from 'lucide-react';
import { ConsumptionStats } from '@/types/consumption';

interface DailyEvolutionChartProps {
  stats: ConsumptionStats;
}

const DailyEvolutionChart = ({ stats }: DailyEvolutionChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Préparer les données pour les graphiques
  const chartData = stats.recentData.map(day => ({
    date: day.date.split(' ')[1] || day.date, // Juste le jour
    fullDate: day.date,
    
    // Quantités
    Cannabis: day.herbe,
    Hash: day.hash,
    Cigarettes: day.cigarette,
    
    // Poids (grammes)
    'Cannabis (g)': Number(day.herbeWeight.toFixed(1)),
    'Hash (g)': Number(day.hashWeight.toFixed(1)),
    
    // Coûts
    'Cannabis (€)': Number(day.herbeCost.toFixed(2)),
    'Hash (€)': Number(day.hashCost.toFixed(2)),
    'Cigarettes (€)': Number(day.cigaretteCost.toFixed(2)),
    
    // Totaux
    'Total unités': day.herbe + day.hash + day.cigarette,
    'Total grammes': Number((day.herbeWeight + day.hashWeight).toFixed(1)),
    'Total coût': Number((day.herbeCost + day.hashCost + day.cigaretteCost).toFixed(2))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm p-4 border rounded-lg shadow-lg border-border/50">
          <p className="font-semibold text-foreground mb-2">{data.fullDate}</p>
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
                <span className="font-medium text-foreground">
                  {typeof entry.value === 'number' ? 
                    (entry.dataKey.includes('€') ? `${entry.value}€` : 
                     entry.dataKey.includes('g') ? `${entry.value}g` : 
                     entry.value) : 
                    entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Évolution quotidienne (7 jours)
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded text-xs transition-all ${
                chartType === 'line' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Courbes
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded text-xs transition-all ${
                chartType === 'bar' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Barres
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="count" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="count" className="flex items-center gap-2">
              <Cannabis className="w-4 h-4" />
              Unités
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Poids
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Coût
            </TabsTrigger>
          </TabsList>

          <TabsContent value="count" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-sm"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis className="text-sm" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {chartType === 'line' ? (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="Cannabis" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        name="Cannabis"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Hash" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        name="Hash"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Cigarettes" 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
                        name="Cigarettes"
                      />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Cannabis" fill="hsl(var(--primary))" name="Cannabis" />
                      <Bar dataKey="Hash" fill="#f59e0b" name="Hash" />
                      <Bar dataKey="Cigarettes" fill="#6b7280" name="Cigarettes" />
                    </>
                  )}
                </ChartComponent>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="weight" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-sm"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-sm" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Grammes', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {chartType === 'line' ? (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="Cannabis (g)" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        name="Cannabis (g)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Hash (g)" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        name="Hash (g)"
                      />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Cannabis (g)" fill="hsl(var(--primary))" name="Cannabis (g)" />
                      <Bar dataKey="Hash (g)" fill="#f59e0b" name="Hash (g)" />
                    </>
                  )}
                </ChartComponent>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="cost" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-sm"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-sm" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Euros', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {chartType === 'line' ? (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="Cannabis (€)" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        name="Cannabis (€)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Hash (€)" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        name="Hash (€)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Cigarettes (€)" 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
                        name="Cigarettes (€)"
                      />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Cannabis (€)" fill="hsl(var(--primary))" name="Cannabis (€)" />
                      <Bar dataKey="Hash (€)" fill="#f59e0b" name="Hash (€)" />
                      <Bar dataKey="Cigarettes (€)" fill="#6b7280" name="Cigarettes (€)" />
                    </>
                  )}
                </ChartComponent>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DailyEvolutionChart;