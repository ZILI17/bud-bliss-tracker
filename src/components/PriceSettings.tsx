
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Cannabis, Cigarette, Euro } from 'lucide-react';

const PriceSettings = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [prices, setPrices] = useState({
    herbe: profile?.default_herbe_price || 10,
    hash: profile?.default_hash_price || 15,
    cigarette: profile?.default_cigarette_price || 0.5,
  });

  const handleSave = async () => {
    await updateProfile({
      default_herbe_price: prices.herbe,
      default_hash_price: prices.hash,
      default_cigarette_price: prices.cigarette,
    });
    
    toast({
      title: "💰 Prix mis à jour",
      description: "Vos prix par défaut ont été sauvegardés.",
    });
  };

  const priceItems = [
    {
      type: 'herbe',
      label: 'Cannabis (€/g)',
      icon: Cannabis,
      color: 'text-green-600',
      value: prices.herbe,
      onChange: (value: number) => setPrices(prev => ({ ...prev, herbe: value }))
    },
    {
      type: 'hash',
      label: 'Hash (€/g)', 
      icon: Cannabis,
      color: 'text-amber-600',
      value: prices.hash,
      onChange: (value: number) => setPrices(prev => ({ ...prev, hash: value }))
    },
    {
      type: 'cigarette',
      label: 'Cigarette (€/unité)',
      icon: Cigarette,
      color: 'text-gray-600',
      value: prices.cigarette,
      onChange: (value: number) => setPrices(prev => ({ ...prev, cigarette: value }))
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="w-5 h-5" />
          Configuration des prix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {priceItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.type} className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[140px]">
                <IconComponent className={`w-4 h-4 ${item.color}`} />
                <Label className="text-sm">{item.label}</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={item.value}
                onChange={(e) => item.onChange(parseFloat(e.target.value) || 0)}
                className="max-w-[100px]"
              />
            </div>
          );
        })}
        
        <Button onClick={handleSave} className="w-full mt-6">
          Sauvegarder les prix
        </Button>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
          💡 Ces prix seront utilisés par défaut pour calculer vos dépenses. 
          Vous pourrez les modifier individuellement lors de chaque ajout.
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSettings;
