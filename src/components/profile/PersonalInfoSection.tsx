
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface PersonalInfoSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PersonalInfoSection = ({ formData, setFormData }: PersonalInfoSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="username">Nom d'utilisateur (optionnel)</Label>
          <Input
            id="username"
            type="text"
            placeholder="Votre nom d'utilisateur"
            value={formData.username || ''}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, username: e.target.value }))}
            className="glass-button"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age">Âge (ans)</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={formData.age || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, age: e.target.value }))}
              className="glass-button"
            />
          </div>
          
          <div>
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70"
              value={formData.weight_kg || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, weight_kg: e.target.value }))}
              className="glass-button"
            />
          </div>
          
          <div>
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="175"
              value={formData.height_cm || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, height_cm: e.target.value }))}
              className="glass-button"
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          ℹ️ Ces informations nous aident à personnaliser les recommandations
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
