
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, User, Activity, Target, Beaker, Save } from 'lucide-react';

interface UserProfile {
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  consumption_goal?: string;
  medical_conditions?: string[];
  medications?: string[];
  default_herbe_quantity?: number;
  default_hash_quantity?: number;
  default_cigarette_quantity?: number;
}

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<UserProfile>({});

  const medicalConditions = [
    'Anxiété', 'Dépression', 'Insomnie', 'Douleurs chroniques', 
    'Épilepsie', 'Cancer', 'Glaucome', 'Autre'
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfileData({
          age: data.age || undefined,
          weight_kg: data.weight_kg || undefined,
          height_cm: data.height_cm || undefined,
          activity_level: data.activity_level || undefined,
          consumption_goal: data.consumption_goal || undefined,
          medical_conditions: data.medical_conditions || [],
          medications: data.medications || [],
          default_herbe_quantity: data.default_herbe_quantity || 0.5,
          default_hash_quantity: data.default_hash_quantity || 0.3,
          default_cigarette_quantity: data.default_cigarette_quantity || 1,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMedicalConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = profileData.medical_conditions || [];
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        medical_conditions: [...currentConditions, condition]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        medical_conditions: currentConditions.filter(c => c !== condition)
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          age: profileData.age || null,
          weight_kg: profileData.weight_kg || null,
          height_cm: profileData.height_cm || null,
          activity_level: profileData.activity_level || null,
          consumption_goal: profileData.consumption_goal || null,
          medical_conditions: profileData.medical_conditions?.length ? profileData.medical_conditions : null,
          medications: profileData.medications?.length ? profileData.medications : null,
          default_herbe_quantity: profileData.default_herbe_quantity || 0.5,
          default_hash_quantity: profileData.default_hash_quantity || 0.3,
          default_cigarette_quantity: profileData.default_cigarette_quantity || 1,
          profile_completed: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "✅ Profil mis à jour",
        description: "Vos paramètres ont été sauvegardés avec succès.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="pulse-ring mb-4"></div>
          <p className="text-primary">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <div className="inline-block relative mb-4">
            <div className="pulse-ring"></div>
            <SettingsIcon className="w-12 h-12 mx-auto text-primary relative z-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2 hologram-text">Paramètres</h1>
          <p className="text-muted-foreground">Personnalisez votre expérience Agent Quit Pro</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profileData.age || ''}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      age: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
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
                    value={profileData.weight_kg || ''}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      weight_kg: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    className="glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={profileData.height_cm || ''}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      height_cm: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    className="glass-button"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activité physique */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activité & Santé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Niveau d'activité physique</Label>
                <Select 
                  value={profileData.activity_level || ''}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, activity_level: value }))}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder="Sélectionnez votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentaire">Sédentaire</SelectItem>
                    <SelectItem value="leger">Léger</SelectItem>
                    <SelectItem value="modere">Modéré</SelectItem>
                    <SelectItem value="intense">Intense</SelectItem>
                    <SelectItem value="tres_intense">Très intense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Conditions médicales</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {medicalConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={profileData.medical_conditions?.includes(condition) || false}
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
                Objectifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Objectif principal</Label>
                <Select 
                  value={profileData.consumption_goal || ''}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, consumption_goal: value }))}
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
              </div>
            </CardContent>
          </Card>

          {/* Quantités personnalisées */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="w-5 h-5" />
                Quantités Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="herbe_qty">Cannabis (grammes)</Label>
                  <Input
                    id="herbe_qty"
                    type="number"
                    step="0.1"
                    value={profileData.default_herbe_quantity || ''}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      default_herbe_quantity: e.target.value ? parseFloat(e.target.value) : 0.5 
                    }))}
                    className="glass-button"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Par joint/session</p>
                </div>
                <div>
                  <Label htmlFor="hash_qty">Hash (grammes)</Label>
                  <Input
                    id="hash_qty"
                    type="number"
                    step="0.1"
                    value={profileData.default_hash_quantity || ''}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      default_hash_quantity: e.target.value ? parseFloat(e.target.value) : 0.3 
                    }))}
                    className="glass-button"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Par dose/session</p>
                </div>
                <div>
                  <Label htmlFor="cig_qty">Cigarettes (nombre)</Label>
                  <Input
                    id="cig_qty"
                    type="number"
                    value={profileData.default_cigarette_quantity || ''}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      default_cigarette_quantity: e.target.value ? parseInt(e.target.value) : 1 
                    }))}
                    className="glass-button"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Par session</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="glass-button neon-glow px-8"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
