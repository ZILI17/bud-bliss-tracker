
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Beaker } from 'lucide-react';

interface DefaultQuantitiesSectionProps {
  formData: {
    default_herbe_quantity: number;
    default_hash_quantity: number;
    default_cigarette_quantity: number;
    default_herbe_price: number;
    default_hash_price: number;
    default_cigarette_price: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const DefaultQuantitiesSection = ({ formData, setFormData }: DefaultQuantitiesSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="w-5 h-5" />
          Quantités & Prix par Défaut
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ⚖️ Ces valeurs sont utilisées pour les enregistrements rapides et le calcul des coûts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Cannabis (Herbe)</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="herbe_qty" className="text-sm">Quantité (g)</Label>
                  <Input
                    id="herbe_qty"
                    type="number"
                    step="0.1"
                    value={formData.default_herbe_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_herbe_quantity: parseFloat(e.target.value) || 0.5 }))}
                    className="glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="herbe_price" className="text-sm">Prix (€/g)</Label>
                  <Input
                    id="herbe_price"
                    type="number"
                    step="0.1"
                    value={formData.default_herbe_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_herbe_price: parseFloat(e.target.value) || 10 }))}
                    className="glass-button"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Hash</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="hash_qty" className="text-sm">Quantité (g)</Label>
                  <Input
                    id="hash_qty"
                    type="number"
                    step="0.1"
                    value={formData.default_hash_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_hash_quantity: parseFloat(e.target.value) || 0.3 }))}
                    className="glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="hash_price" className="text-sm">Prix (€/g)</Label>
                  <Input
                    id="hash_price"
                    type="number"
                    step="0.1"
                    value={formData.default_hash_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_hash_price: parseFloat(e.target.value) || 15 }))}
                    className="glass-button"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Cigarettes</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="cig_qty" className="text-sm">Quantité (nb)</Label>
                  <Input
                    id="cig_qty"
                    type="number"
                    value={formData.default_cigarette_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_cigarette_quantity: parseInt(e.target.value) || 1 }))}
                    className="glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="cig_price" className="text-sm">Prix (€/cig)</Label>
                  <Input
                    id="cig_price"
                    type="number"
                    step="0.01"
                    value={formData.default_cigarette_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_cigarette_price: parseFloat(e.target.value) || 0.5 }))}
                    className="glass-button"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultQuantitiesSection;
