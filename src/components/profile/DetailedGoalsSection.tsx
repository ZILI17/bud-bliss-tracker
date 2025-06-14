
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Calendar, Heart } from 'lucide-react';

interface DetailedGoalsSectionProps {
  formData: {
    consumption_goal: string;
    goal_timeline: string;
    goal_motivation: string;
    goal_description: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const DetailedGoalsSection = ({ formData, setFormData }: DetailedGoalsSectionProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Ton Objectif Personnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Objectif principal</Label>
          <Select 
            value={formData.consumption_goal} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, consumption_goal: value }))}
          >
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Quel est ton objectif ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reduction_progressive">Réduction progressive</SelectItem>
              <SelectItem value="arret_complet">Arrêt complet</SelectItem>
              <SelectItem value="pause_temporaire">Pause temporaire</SelectItem>
              <SelectItem value="usage_medical">Usage médical contrôlé</SelectItem>
              <SelectItem value="usage_recreatif">Usage récréatif responsable</SelectItem>
              <SelectItem value="stabilisation">Stabiliser ma consommation actuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeline">
            <Calendar className="w-4 h-4 inline mr-2" />
            Dans quel délai ?
          </Label>
          <Select 
            value={formData.goal_timeline} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, goal_timeline: value }))}
          >
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Ton échéance souhaitée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1_semaine">1 semaine</SelectItem>
              <SelectItem value="1_mois">1 mois</SelectItem>
              <SelectItem value="3_mois">3 mois</SelectItem>
              <SelectItem value="6_mois">6 mois</SelectItem>
              <SelectItem value="1_an">1 an</SelectItem>
              <SelectItem value="pas_de_limite">Pas de limite de temps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="motivation">
            <Heart className="w-4 h-4 inline mr-2" />
            Quelle est ta motivation principale ?
          </Label>
          <Select 
            value={formData.goal_motivation} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, goal_motivation: value }))}
          >
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Pourquoi ce changement ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sante">Améliorer ma santé</SelectItem>
              <SelectItem value="finances">Économiser de l'argent</SelectItem>
              <SelectItem value="famille">Pour ma famille</SelectItem>
              <SelectItem value="sport">Performance sportive</SelectItem>
              <SelectItem value="travail">Concentration au travail</SelectItem>
              <SelectItem value="social">Pression sociale</SelectItem>
              <SelectItem value="personnel">Développement personnel</SelectItem>
              <SelectItem value="medical">Recommandation médicale</SelectItem>
              <SelectItem value="autre">Autre raison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goal_description">Décris ton objectif avec tes mots (optionnel)</Label>
          <Textarea
            id="goal_description"
            placeholder="Ex: Je veux réduire ma consommation de cannabis de moitié d'ici 3 mois pour améliorer ma concentration au travail et économiser de l'argent..."
            value={formData.goal_description}
            onChange={(e) => setFormData(prev => ({ ...prev, goal_description: e.target.value }))}
            className="glass-button min-h-[80px]"
            rows={3}
          />
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            🤖 <strong>Ces informations permettront à l'IA de te donner des conseils personnalisés</strong> adaptés à ton objectif et ta situation unique.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedGoalsSection;
