
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface DefaultQuantitiesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const DefaultQuantitiesSection = ({ formData, setFormData }: DefaultQuantitiesSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Quantités & Prix par Défaut
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          ⚖️ Ces valeurs seront utilisées par défaut lors de l'ajout rapide de consommations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="herbe_qty">Cannabis (grammes)</Label>
            <Input
              id="herbe_qty"
              type="number"
              step="0.1"
              value={formData.default_herbe_quantity || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, default_herbe_quantity: parseFloat(e.target.value) || 0 }))}
              className="glass-button"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="herbe_price">Prix Cannabis (€/g)</Label>
            <Input
              id="herbe_price"
              type="number"
              step="0.1"
              value={formData.default_herbe_price || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, default_herbe_price: parseFloat(e.target.value) || 0 }))}
              className="glass-button"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hash_qty">Hash (grammes)</Label>
            <Input
              id="hash_qty"
              type="number"
              step="0.1"
              value={formData.default_hash_quantity || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, default_hash_quantity: parseFloat(e.target.value) || 0 }))}
              className="glass-button"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hash_price">Prix Hash (€/g)</Label>
            <Input
              id="hash_price"
              type="number"
              step="0.1"
              value={formData.default_hash_price || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, default_hash_price: parseFloat(e.target.value) || 0 }))}
              className="glass-button"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cig_qty">Cigarettes (nombre)</Label>
            <Input
              id="cig_qty"
              type="number"
              value={formData.default_cigarette_quantity || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, default_cigarette_quantity: parseInt(e.target.value) || 0 }))}
              className="glass-button"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cig_price">Prix Cigarette (€/unité)</Label>
            <Input
              id="cig_price"
              type="number"
              step="0.01"
              value={formData.default_cigarette_price || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, default_cigarette_price: parseFloat(e.target.value) || 0 }))}
              className="glass-button"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultQuantitiesSection;
