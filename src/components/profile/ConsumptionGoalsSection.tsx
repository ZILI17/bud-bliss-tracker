
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface ConsumptionGoalsSectionProps {
  formData: {
    consumption_goal: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ConsumptionGoalsSection = ({ formData, setFormData }: ConsumptionGoalsSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objectifs de Consommation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Objectif principal</Label>
          <Select 
            value={formData.consumption_goal} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, consumption_goal: value }))}
          >
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Quel est votre objectif ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reduction">Réduction progressive</SelectItem>
              <SelectItem value="arret">Arrêt complet</SelectItem>
              <SelectItem value="medical">Usage médical contrôlé</SelectItem>
              <SelectItem value="recreatif">Usage récréatif responsable</SelectItem>
              <SelectItem value="maintenance">Maintien du niveau actuel</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            🎯 Cet objectif aide l'IA à personnaliser vos recommandations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumptionGoalsSection;
