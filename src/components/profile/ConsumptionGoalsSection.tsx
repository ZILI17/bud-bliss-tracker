
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface ConsumptionGoalsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const ConsumptionGoalsSection = ({ formData, setFormData }: ConsumptionGoalsSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objectif de consommation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Objectif principal</Label>
          <Select onValueChange={(value) => setFormData((prev: any) => ({ ...prev, consumption_goal: value }))}>
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Sélectionnez votre objectif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reduction">Réduction progressive</SelectItem>
              <SelectItem value="stabilisation">Stabiliser ma consommation</SelectItem>
              <SelectItem value="arret">Arrêt complet</SelectItem>
              <SelectItem value="controle">Meilleur contrôle</SelectItem>
              <SelectItem value="substitution">Substitution (ex: CBD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumptionGoalsSection;
