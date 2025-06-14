
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Target, Activity, Beaker, ChevronRight, Sparkles } from 'lucide-react';
import DetailedGoalsSection from '@/components/profile/DetailedGoalsSection';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Données du profil
  const [profileData, setProfileData] = useState({
    age: '',
    weight_kg: '',
    height_cm: '',
    activity_level: '',
    consumption_goal: '',
    goal_timeline: '',
    goal_motivation: '',
    goal_description: '',
    medical_conditions: [] as string[],
    medications: [] as string[],
    default_herbe_quantity: '0.5',
    default_hash_quantity: '0.3',
    default_cigarette_quantity: '1'
  });

  const medicalConditions = [
    'Anxiété', 'Dépression', 'Insomnie', 'Douleurs chroniques', 
    'Épilepsie', 'Cancer', 'Glaucome', 'Autre'
  ];

  const handleMedicalConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, condition]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        medical_conditions: prev.medical_conditions.filter(c => c !== condition)
      }));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          age: profileData.age ? parseInt(profileData.age) : null,
          weight_kg: profileData.weight_kg ? parseFloat(profileData.weight_kg) : null,
          height_cm: profileData.height_cm ? parseInt(profileData.height_cm) : null,
          activity_level: profileData.activity_level || null,
          consumption_goal: profileData.consumption_goal || null,
          goal_timeline: profileData.goal_timeline || null,
          goal_motivation: profileData.goal_motivation || null,
          goal_description: profileData.goal_description || null,
          medical_conditions: profileData.medical_conditions.length > 0 ? profileData.medical_conditions : null,
          medications: profileData.medications.length > 0 ? profileData.medications : null,
          default_herbe_quantity: parseFloat(profileData.default_herbe_quantity),
          default_hash_quantity: parseFloat(profileData.default_hash_quantity),
          default_cigarette_quantity: parseInt(profileData.default_cigarette_quantity),
          profile_completed: true,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "🎉 Profil créé avec succès !",
        description: "Bienvenue dans Agent Quit Pro ! Tes recommandations IA sont maintenant personnalisées.",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <div className="pulse-ring"></div>
            <Sparkles className="w-16 h-16 mx-auto text-primary relative z-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2 hologram-text">
            Configuration Initiale
          </h1>
          <p className="text-muted-foreground">
            Personnalise Agent Quit Pro selon tes besoins
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step >= num ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <User className="w-5 h-5" />}
              {step === 2 && <Activity className="w-5 h-5" />}
              {step === 3 && <Target className="w-5 h-5" />}
              {step === 4 && <Beaker className="w-5 h-5" />}
              {step === 5 && <Sparkles className="w-5 h-5" />}
              {step === 1 && "Informations Personnelles"}
              {step === 2 && "Santé & Activité"}
              {step === 3 && "Ton Objectif Personnel"}
              {step === 4 && "Quantités Personnalisées"}
              {step === 5 && "Récapitulatif"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Âge (ans)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={profileData.age}
                      onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
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
                      value={profileData.weight_kg}
                      onChange={(e) => setProfileData(prev => ({ ...prev, weight_kg: e.target.value }))}
                      className="glass-button"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Taille (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={profileData.height_cm}
                      onChange={(e) => setProfileData(prev => ({ ...prev, height_cm: e.target.value }))}
                      className="glass-button"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  ℹ️ Ces informations nous aident à calculer votre IMC et personnaliser les recommandations
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Niveau d'activité physique</Label>
                  <Select onValueChange={(value) => setProfileData(prev => ({ ...prev, activity_level: value }))}>
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
                          checked={profileData.medical_conditions.includes(condition)}
                          onCheckedChange={(checked) => handleMedicalConditionChange(condition, checked as boolean)}
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <DetailedGoalsSection formData={profileData} setFormData={setProfileData} />
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  ⚖️ Définissez vos quantités moyennes pour des enregistrements rapides plus précis
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="herbe_qty">Cannabis (grammes)</Label>
                    <Input
                      id="herbe_qty"
                      type="number"
                      step="0.1"
                      value={profileData.default_herbe_quantity}
                      onChange={(e) => setProfileData(prev => ({ ...prev, default_herbe_quantity: e.target.value }))}
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
                      value={profileData.default_hash_quantity}
                      onChange={(e) => setProfileData(prev => ({ ...prev, default_hash_quantity: e.target.value }))}
                      className="glass-button"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Par dose/session</p>
                  </div>
                  <div>
                    <Label htmlFor="cig_qty">Cigarettes (nombre)</Label>
                    <Input
                      id="cig_qty"
                      type="number"
                      value={profileData.default_cigarette_quantity}
                      onChange={(e) => setProfileData(prev => ({ ...prev, default_cigarette_quantity: e.target.value }))}
                      className="glass-button"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Par session</p>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-center">🎯 Récapitulatif de ton profil</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Objectif :</strong> {profileData.consumption_goal || 'Non défini'}</p>
                    <p><strong>Délai :</strong> {profileData.goal_timeline || 'Non défini'}</p>
                    <p><strong>Motivation :</strong> {profileData.goal_motivation || 'Non définie'}</p>
                    {profileData.goal_description && (
                      <p><strong>Description :</strong> {profileData.goal_description}</p>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    🤖 Ton IA coach va maintenant pouvoir te donner des conseils personnalisés chaque jour !
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={step === 1}
                className="glass-button"
              >
                Précédent
              </Button>
              {step < 5 ? (
                <Button onClick={nextStep} className="glass-button neon-glow">
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="glass-button neon-glow"
                >
                  {loading ? "Finalisation..." : "🚀 Commencer l'aventure !"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
