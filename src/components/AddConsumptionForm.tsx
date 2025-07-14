
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Cannabis, Cigarette, Euro } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface AddConsumptionFormProps {
  onAdd: (consumption: {
    type: 'herbe' | 'hash' | 'cigarette';
    quantity: string;
    date: string;
    note?: string;
    price?: number;
  }) => void;
  onCancel: () => void;
}

const AddConsumptionForm: React.FC<AddConsumptionFormProps> = ({ onAdd, onCancel }) => {
  const { profile } = useProfile();
  const [type, setType] = useState<'herbe' | 'hash' | 'cigarette'>('herbe');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [note, setNote] = useState('');
  const [price, setPrice] = useState<number | undefined>();

  // Obtenir le prix par défaut selon le type
  const getDefaultPrice = (selectedType: 'herbe' | 'hash' | 'cigarette') => {
    switch (selectedType) {
      case 'herbe':
        return profile?.default_herbe_price || 10;
      case 'hash':
        return profile?.default_hash_price || 15;
      case 'cigarette':
        return profile?.default_cigarette_price || 0.5;
      default:
        return 0;
    }
  };

  // Mettre à jour le prix par défaut quand le type change
  React.useEffect(() => {
    setPrice(getDefaultPrice(type));
  }, [type, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity.trim()) return;
    
    onAdd({
      type,
      quantity: quantity.trim(),
      date,
      note: note.trim() || undefined,
      price: price && price > 0 ? price : undefined,
    });
  };

  const typeOptions = [
    { value: 'herbe' as const, label: 'Herbe', icon: Cannabis, color: 'bg-green-100 border-green-300 text-green-800' },
    { value: 'hash' as const, label: 'Hash', icon: Cannabis, color: 'bg-amber-100 border-amber-300 text-amber-800' },
    { value: 'cigarette' as const, label: 'Cigarette', icon: Cigarette, color: 'bg-gray-100 border-gray-300 text-gray-800' },
  ];

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Type de produit</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              {typeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-lg border-2 transition-all ${
                      type === option.value
                        ? option.color
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={18} className="sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantité
            </Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 1 joint, 2g, etc."
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Prix (€) - optionnel
            </Label>
            <Input
              id="price"
              type="number"
              step="0.1"
              min="0"
              value={price || ''}
              onChange={(e) => setPrice(parseFloat(e.target.value) || undefined)}
              placeholder="Prix de cette consommation"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Par défaut: {getDefaultPrice(type)}€ 
              {type !== 'cigarette' ? '/g' : '/unité'}
            </p>
          </div>

          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Date et heure
            </Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="note" className="text-sm font-medium">
              Note (optionnel)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Comment vous sentez-vous ?"
              className="mt-1 resize-none"
              rows={2}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 order-2 sm:order-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 order-1 sm:order-2">
              Valider
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddConsumptionForm;
