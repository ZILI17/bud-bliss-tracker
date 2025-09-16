
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Cannabis } from 'lucide-react';

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
        
        {/* Nouvelle section pour les habitudes de consommation */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Cannabis className="w-4 h-4" />
            Habitudes de consommation
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-800">
                Fumez-vous des cigarettes avec le cannabis/hash ?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, smokes_with_cannabis: true }))}
                  className={`px-3 py-1 text-xs rounded ${
                    formData.smokes_with_cannabis === true 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-blue-300 text-blue-600'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, smokes_with_cannabis: false }))}
                  className={`px-3 py-1 text-xs rounded ${
                    formData.smokes_with_cannabis === false 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-blue-300 text-blue-600'
                  }`}
                >
                  Non
                </button>
              </div>
            </div>
            
            {formData.smokes_with_cannabis && (
              <div className="flex items-center justify-between">
                <label className="text-sm text-blue-800">
                  Combien de cigarettes par joint en moyenne ?
                </label>
                <div className="flex gap-1">
                  {[0.5, 1, 1.5, 2, 2.5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((prev: any) => ({ 
                        ...prev, 
                        cigarettes_per_joint: value 
                      }))}
                      className={`px-2 py-1 text-xs rounded ${
                        formData.cigarettes_per_joint === value 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-blue-300 text-blue-600'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <p className="text-xs text-blue-600 mt-3">
            💡 Cette information permet d'ajuster automatiquement votre suivi de cigarettes
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          ℹ️ Ces informations nous aident à personnaliser les recommandations
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
