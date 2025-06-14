
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, Heart, Users, Activity } from 'lucide-react';

interface DetailedGoalsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const DetailedGoalsSection = ({ formData, setFormData }: DetailedGoalsSectionProps) => {
  const triggerMoments = [
    'Matin au réveil',
    'Après les repas',
    'En soirée après le travail',
    'Avant de dormir',
    'Pendant les pauses',
    'En cas de stress',
    'Quand je m\'ennuie',
    'Avec des amis'
  ];

  const triggerSpecific = [
    'Solitude',
    'Dispute/conflit',
    'Fatigue',
    'Ennui',
    'Anxiété',
    'Pression sociale',
    'Habitude automatique',
    'Célébration'
  ];

  const motivationReasons = [
    'Améliorer ma santé',
    'Avoir plus d\'énergie',
    'Mieux me concentrer',
    'Améliorer mon sommeil',
    'Économiser de l\'argent',
    'Être plus productif',
    'Retrouver le contrôle',
    'Donner l\'exemple'
  ];

  const alternativeActivities = [
    'Musique',
    'Marche/course',
    'Sport',
    'Lecture',
    'Méditation',
    'Cuisine',
    'Jardinage',
    'Jeux vidéo',
    'Arts créatifs',
    'Appels à des proches'
  ];

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev: any) => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter((item: string) => item !== value) };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Objectif détaillé */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Objectif détaillé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="goal_description">Explique ton objectif avec tes mots</Label>
            <Textarea
              id="goal_description"
              placeholder="Ex: Je veux réduire ma consommation pour avoir plus d'énergie au quotidien..."
              value={formData.goal_description || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, goal_description: e.target.value }))}
              className="glass-button"
            />
          </div>
          
          <div>
            <Label htmlFor="goal_timeline">En combien de temps veux-tu l'atteindre ?</Label>
            <Select onValueChange={(value) => setFormData((prev: any) => ({ ...prev, goal_timeline: value }))}>
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Sélectionne un délai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_semaine">1 semaine</SelectItem>
                <SelectItem value="2_semaines">2 semaines</SelectItem>
                <SelectItem value="1_mois">1 mois</SelectItem>
                <SelectItem value="3_mois">3 mois</SelectItem>
                <SelectItem value="6_mois">6 mois</SelectItem>
                <SelectItem value="1_an">1 an</SelectItem>
                <SelectItem value="progressif">Progressivement, sans limite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Déclencheurs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Déclencheurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>À quel moment as-tu le plus envie de consommer ?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {triggerMoments.map((moment) => (
                <div key={moment} className="flex items-center space-x-2">
                  <Checkbox
                    id={`moment-${moment}`}
                    checked={formData.triggers_moments?.includes(moment) || false}
                    onCheckedChange={(checked) => handleArrayChange('triggers_moments', moment, checked as boolean)}
                  />
                  <Label htmlFor={`moment-${moment}`} className="text-sm">{moment}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>As-tu repéré des déclencheurs spécifiques ?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {triggerSpecific.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-2">
                  <Checkbox
                    id={`trigger-${trigger}`}
                    checked={formData.triggers_specific?.includes(trigger) || false}
                    onCheckedChange={(checked) => handleArrayChange('triggers_specific', trigger, checked as boolean)}
                  />
                  <Label htmlFor={`trigger-${trigger}`} className="text-sm">{trigger}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Motivations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Pourquoi veux-tu changer ?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {motivationReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reason-${reason}`}
                    checked={formData.motivation_reasons?.includes(reason) || false}
                    onCheckedChange={(checked) => handleArrayChange('motivation_reasons', reason, checked as boolean)}
                  />
                  <Label htmlFor={`reason-${reason}`} className="text-sm">{reason}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="motivation_personal">Raison personnelle (optionnel)</Label>
            <Textarea
              id="motivation_personal"
              placeholder="Y a-t-il une raison personnelle que tu veux ajouter ?"
              value={formData.motivation_personal || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, motivation_personal: e.target.value }))}
              className="glass-button"
            />
          </div>
        </CardContent>
      </Card>

      {/* Soutien */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Soutien
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>As-tu du soutien dans ton entourage ?</Label>
            <Select onValueChange={(value) => setFormData((prev: any) => ({ ...prev, support_entourage: value === 'true' }))}>
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Sélectionne une réponse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Oui, j'ai du soutien</SelectItem>
                <SelectItem value="false">Non, je suis seul(e)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type de conseils préféré</Label>
            <Select onValueChange={(value) => setFormData((prev: any) => ({ ...prev, support_preference: value }))}>
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Sélectionne ton style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="autonomie">Conseils pour l'autonomie</SelectItem>
                <SelectItem value="accompagnement">Accompagnement externe</SelectItem>
                <SelectItem value="mixte">Les deux selon la situation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activités alternatives */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activités alternatives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>As-tu déjà une activité qui t'aide à ne pas consommer ?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {alternativeActivities.map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`activity-${activity}`}
                    checked={formData.alternative_activities?.includes(activity) || false}
                    onCheckedChange={(checked) => handleArrayChange('alternative_activities', activity, checked as boolean)}
                  />
                  <Label htmlFor={`activity-${activity}`} className="text-sm">{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Suggestions quotidiennes</Label>
            <Select onValueChange={(value) => setFormData((prev: any) => ({ ...prev, wants_daily_suggestions: value === 'true' }))}>
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Veux-tu des suggestions d'activités ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Oui, suggère-moi des activités</SelectItem>
                <SelectItem value="false">Non, je préfère mes propres activités</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedGoalsSection;
