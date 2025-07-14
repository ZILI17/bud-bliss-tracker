
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Cannabis, Cigarette } from 'lucide-react';
import { Consumption } from '@/types/consumption';

interface ConsumptionHistoryProps {
  consumptions: Consumption[];
  onDelete: (id: string) => void;
}

const ConsumptionHistory: React.FC<ConsumptionHistoryProps> = ({ consumptions, onDelete }) => {
  const getIcon = (type: Consumption['type']) => {
    switch (type) {
      case 'herbe':
        return <Cannabis className="w-4 h-4 text-green-600" />;
      case 'hash':
        return <Cannabis className="w-4 h-4 text-amber-600" />;
      case 'cigarette':
        return <Cigarette className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: Consumption['type']) => {
    switch (type) {
      case 'herbe':
        return 'Herbe';
      case 'hash':
        return 'Hash';
      case 'cigarette':
        return 'Cigarette';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (consumptions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Aucune consommation enregistrée. Commencez par ajouter votre première entrée !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Historique ({consumptions.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {consumptions.map((consumption) => (
          <div
            key={consumption.id}
            className="flex items-start justify-between p-2 sm:p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(consumption.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <span className="font-medium text-sm">{getTypeLabel(consumption.type)}</span>
                  <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
                  <span className="text-sm font-medium text-muted-foreground sm:text-foreground">{consumption.quantity}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {formatDate(consumption.date)}
                </p>
                {consumption.note && (
                  <p className="text-xs sm:text-sm text-muted-foreground italic break-words">
                    "{consumption.note}"
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(consumption.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 p-1 sm:p-2"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConsumptionHistory;
