import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Cannabis, Cigarette, Euro, TrendingUp, TrendingDown } from 'lucide-react';
import { Consumption } from '@/types/consumption';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TodayConsumptionProps {
  consumptions: Consumption[];
}

const TodayConsumption = ({ consumptions }: TodayConsumptionProps) => {
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  
  // Filtrer les consommations d'aujourd'hui
  const todayConsumptions = consumptions.filter(consumption => {
    const consumptionDate = format(new Date(consumption.date), 'yyyy-MM-dd');
    return consumptionDate === todayString;
  });

  // Calculer les totaux d'aujourd'hui
  const todayStats = todayConsumptions.reduce((acc, consumption) => {
    acc[consumption.type] = (acc[consumption.type] || 0) + 1;
    if (consumption.price) {
      acc.totalCost += consumption.price;
    }
    return acc;
  }, { herbe: 0, hash: 0, cigarette: 0, totalCost: 0 } as any);

  // Calculer les totaux d'hier pour comparaison
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = format(yesterday, 'yyyy-MM-dd');
  
  const yesterdayConsumptions = consumptions.filter(consumption => {
    const consumptionDate = format(new Date(consumption.date), 'yyyy-MM-dd');
    return consumptionDate === yesterdayString;
  });

  const yesterdayTotal = yesterdayConsumptions.length;
  const todayTotal = todayConsumptions.length;
  const difference = todayTotal - yesterdayTotal;

  const typeIcons = {
    herbe: { icon: Cannabis, color: 'text-green-500', bg: 'bg-green-100' },
    hash: { icon: Cannabis, color: 'text-orange-500', bg: 'bg-orange-100' },
    cigarette: { icon: Cigarette, color: 'text-gray-500', bg: 'bg-gray-100' },
  };

  const typeLabels = {
    herbe: 'Cannabis',
    hash: 'Hash',
    cigarette: 'Cigarettes',
  };

  return (
    <Card className="glass-card border-2 border-primary/20 relative overflow-hidden">
      {/* Effet visuel pour mettre en avant */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold">Aujourd'hui</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(today, 'EEEE d MMMM', { locale: fr })}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        {/* Total du jour avec comparaison */}
        <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border">
          <div>
            <div className="text-2xl font-bold text-primary">
              {todayTotal}
            </div>
            <div className="text-sm text-muted-foreground">
              consommation{todayTotal > 1 ? 's' : ''} aujourd'hui
            </div>
          </div>
          
          {yesterdayTotal > 0 && (
            <div className="flex items-center gap-1">
              {difference > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : difference < 0 ? (
                <TrendingDown className="w-4 h-4 text-green-500" />
              ) : null}
              <span className={`text-sm font-medium ${
                difference > 0 ? 'text-red-500' : 
                difference < 0 ? 'text-green-500' : 
                'text-muted-foreground'
              }`}>
                {difference > 0 ? '+' : ''}{difference}
              </span>
              <span className="text-xs text-muted-foreground">vs hier</span>
            </div>
          )}
        </div>

        {/* Détail par type */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(typeStats).map(([type, count]) => {
            if (type === 'totalCost') return null;
            const config = typeIcons[type as keyof typeof typeIcons];
            const Icon = config.icon;
            
            return (
              <div key={type} className={`p-3 rounded-lg ${config.bg} border`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {typeLabels[type as keyof typeof typeLabels]}
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coût du jour */}
        {todayStats.totalCost > 0 && (
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Coût aujourd'hui</span>
            </div>
            <span className="font-bold text-amber-900">
              {todayStats.totalCost.toFixed(2)}€
            </span>
          </div>
        )}

        {/* Message si aucune consommation */}
        {todayTotal === 0 && (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🌟</div>
            <p className="text-sm text-muted-foreground">
              Aucune consommation enregistrée aujourd'hui
            </p>
            <p className="text-xs text-primary mt-1">
              Continuez comme ça !
            </p>
          </div>
        )}

        {/* Dernière consommation */}
        {todayConsumptions.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Dernière activité</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(todayConsumptions[todayConsumptions.length - 1].date), 'HH:mm')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayConsumption;