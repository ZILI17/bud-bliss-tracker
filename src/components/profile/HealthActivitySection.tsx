
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart } from 'lucide-react';

interface HealthActivitySectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const HealthActivitySection = ({ formData, setFormData }: HealthActivitySectionProps) => {
  const medicalConditions = [
    'Anxiété', 'Dépression', 'Insomnie', 'Douleurs chroniques', 
    'Épilepsie', 'Cancer', 'Glaucome', 'Autre'
  ];

  const handleMedicalConditionChange = (condition: string, checked: boolean) => {
    setFormData((prev: any) => {
      const currentConditions = prev.medical_conditions || [];
      if (checked) {
        return { ...prev, medical_conditions: [...currentConditions, condition] };
      } else {
        return { ...prev, medical_conditions: currentConditions.filter((c: string) => c !== condition) };
      }
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Santé & Activité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Niveau d'activité physique</Label>
          <Select onValueChange={(value) => setFormData((prev: any) => ({ ...prev, activity_level: value }))}>
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Sélectionnez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentaire">Sédentaire (peu/pas d'exercice)</SelectItem>
              <SelectItem value="leger">Léger (1-3 jours/semaine)</SelectItem>
              <SelectItem value="modere">Modéré (3-5 jours/semaine)</SelectItem>
              <SelectItem value="intense">Intense (6-7 jours/semaine)</SelectItem>
              <SelectItem value="tres_intense">Très intense (2x/jour, entraînements intenses)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Conditions médicales (optionnel)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {medicalConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={`medical-${condition}`}
                  checked={formData.medical_conditions?.includes(condition) || false}
                  onCheckedChange={(checked) => handleMedicalConditionChange(condition, checked as boolean)}
                />
                <Label htmlFor={`medical-${condition}`} className="text-sm">{condition}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthActivitySection;
