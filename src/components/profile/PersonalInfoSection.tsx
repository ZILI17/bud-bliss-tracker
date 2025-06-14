
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface PersonalInfoSectionProps {
  formData: {
    username: string;
    age: string;
    weight_kg: string;
    height_cm: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PersonalInfoSection = ({ formData, setFormData }: PersonalInfoSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations Personnelles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Votre nom d'utilisateur"
              className="glass-button"
            />
          </div>
          
          <div>
            <Label htmlFor="age">Âge (ans)</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Votre âge"
              className="glass-button"
            />
          </div>
          
          <div>
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
              placeholder="Votre poids"
              className="glass-button"
            />
          </div>
          
          <div>
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height_cm}
              onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
              placeholder="Votre taille"
              className="glass-button"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
