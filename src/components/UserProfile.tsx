
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { User, Activity, Target, Beaker } from 'lucide-react';

const UserProfile = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    age: profile?.age || '',
    weight_kg: profile?.weight_kg || '',
    height_cm: profile?.height_cm || '',
    activity_level: profile?.activity_level || '',
    consumption_goal: profile?.consumption_goal || '',
    medical_conditions: profile?.medical_conditions || [],
    medications: profile?.medications || [],
    default_herbe_quantity: profile?.default_herbe_quantity || 0.5,
    default_hash_quantity: profile?.default_hash_quantity || 0.3,
    default_cigarette_quantity: profile?.default_cigarette_quantity || 1,
    default_herbe_price: profile?.default_herbe_price || 10,
    default_hash_price: profile?.default_hash_price || 15,
    default_cigarette_price: profile?.default_cigarette_price || 0.5,
  });

  const medicalConditions = [
    'Anxiété', 'Dépression', 'Insomnie', 'Douleurs chroniques', 
    'Épilepsie', 'Cancer', 'Glaucome', 'Autre'
  ];

  const handleMedicalConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, condition]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        medical_conditions: prev.medical_conditions.filter(c => c !== condition)
      }));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        username: formData.username || undefined,
        age: formData.age ? parseInt(formData.age.toString()) : undefined,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg.toString()) : undefined,
        height_cm: formData.height_cm ? parseInt(formData.height_cm.toString()) : undefined,
        activity_level: formData.activity_level || undefined,
        consumption_goal: formData.consumption_goal || undefined,
        medical_conditions: formData.medical_conditions.length > 0 ? formData.medical_conditions : undefined,
        medications: formData.medications.length > 0 ? formData.medications : undefined,
        default_herbe_quantity: parseFloat(formData.default_herbe_quantity.toString()),
        default_hash_quantity: parseFloat(formData.default_hash_quantity.toString()),
        default_cigarette_quantity: parseInt(formData.default_cigarette_quantity.toString()),
        default_herbe_price: parseFloat(formData.default_herbe_price.toString()),
        default_hash_price: parseFloat(formData.default_hash_price.toString()),
        default_cigarette_price: parseFloat(formData.default_cigarette_price.toString()),
      });
      
      toast({
        title: "👤 Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
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
    <div className="space-y-6">
      {/* Informations Personnelles */}
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

      {/* Santé & Activité */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Santé & Activité Physique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Niveau d'activité physique</Label>
            <Select 
              value={formData.activity_level} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, activity_level: value }))}
            >
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
                    id={condition}
                    checked={formData.medical_conditions.includes(condition)}
                    onCheckedChange={(checked) => handleMedicalConditionChange(condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm">{condition}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Objectifs de Consommation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Objectif principal</Label>
            <Select 
              value={formData.consumption_goal} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, consumption_goal: value }))}
            >
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Quel est votre objectif ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reduction">Réduction progressive</SelectItem>
                <SelectItem value="arret">Arrêt complet</SelectItem>
                <SelectItem value="medical">Usage médical contrôlé</SelectItem>
                <SelectItem value="recreatif">Usage récréatif responsable</SelectItem>
                <SelectItem value="maintenance">Maintien du niveau actuel</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              🎯 Cet objectif aide l'IA à personnaliser vos recommandations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quantités & Prix par Défaut */}
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

      <Button onClick={handleSave} className="w-full glass-button neon-glow">
        💾 Sauvegarder toutes les modifications
      </Button>
    </div>
  );
};

export default UserProfile;
