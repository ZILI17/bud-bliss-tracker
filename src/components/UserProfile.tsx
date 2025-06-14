
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

const UserProfile = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    age: profile?.age || '',
    weight_kg: profile?.weight_kg || '',
    height_cm: profile?.height_cm || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        username: formData.username || undefined,
        age: formData.age ? parseInt(formData.age.toString()) : undefined,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg.toString()) : undefined,
        height_cm: formData.height_cm ? parseInt(formData.height_cm.toString()) : undefined,
      });
      
      toast({
        title: "👤 Profil mis à jour",
        description: "Vos informations ont été sauvegardées.",
      });
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder le profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Votre nom d'utilisateur"
          />
        </div>
        
        <div>
          <Label htmlFor="age">Âge</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            placeholder="Votre âge"
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
          />
        </div>
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Sauvegarder le profil
      </Button>
    </div>
  );
};

export default UserProfile;
