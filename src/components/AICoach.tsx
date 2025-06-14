
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, Heart, Lightbulb } from 'lucide-react';

interface CoachFormData {
  age: string;
  sexe: string;
  poids: string;
  taille: string;
  activite_physique: string;
  objectif: string;
  consommation_du_jour: string;
  humeur: string;
  difficulte: string;
  progression: string;
}

const AICoach = () => {
  const [formData, setFormData] = useState<CoachFormData>({
    age: '',
    sexe: '',
    poids: '',
    taille: '',
    activite_physique: '',
    objectif: '',
    consommation_du_jour: '',
    humeur: '',
    difficulte: '',
    progression: ''
  });
  
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof CoachFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          age: formData.age ? parseInt(formData.age) : undefined,
          sexe: formData.sexe || undefined,
          poids: formData.poids ? parseFloat(formData.poids) : undefined,
          taille: formData.taille ? parseInt(formData.taille) : undefined,
          activite_physique: formData.activite_physique || undefined,
          objectif: formData.objectif || undefined,
          consommation_du_jour: formData.consommation_du_jour ? parseInt(formData.consommation_du_jour) : undefined,
          humeur: formData.humeur || undefined,
          difficulte: formData.difficulte || undefined,
          progression: formData.progression || undefined,
        }
      });

      if (error) throw error;

      if (data?.success && data?.advice) {
        setAdvice(data.advice);
        toast({
          title: "✨ Conseil généré",
          description: "Votre coach IA a analysé vos données et vous propose un conseil personnalisé.",
        });
      } else {
        throw new Error('Pas de conseil reçu');
      }
    } catch (error) {
      console.error('Erreur coach IA:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer un conseil pour le moment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAdvice = (text: string) => {
    // Simple formatting pour rendre la réponse plus lisible
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="relative">
            <Brain className="w-12 h-12 text-purple-500" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 hologram-text">Coach IA Personnel</h1>
        <p className="text-muted-foreground">
          Partagez vos données du jour et recevez un conseil personnalisé pour votre parcours
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Mes données du jour
            </CardTitle>
            <CardDescription>
              Remplissez les informations que vous souhaitez partager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sexe">Sexe</Label>
                <Select value={formData.sexe} onValueChange={(value) => handleInputChange('sexe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poids">Poids (kg)</Label>
                <Input
                  id="poids"
                  type="number"
                  placeholder="70"
                  value={formData.poids}
                  onChange={(e) => handleInputChange('poids', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="taille">Taille (cm)</Label>
                <Input
                  id="taille"
                  type="number"
                  placeholder="175"
                  value={formData.taille}
                  onChange={(e) => handleInputChange('taille', e.target.value)}
                />
              </div>
            </div>

            {/* Activité et objectif */}
            <div>
              <Label htmlFor="activite">Activité physique</Label>
              <Select value={formData.activite_physique} onValueChange={(value) => handleInputChange('activite_physique', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentaire">Sédentaire</SelectItem>
                  <SelectItem value="leger">Activité légère</SelectItem>
                  <SelectItem value="modere">Activité modérée</SelectItem>
                  <SelectItem value="intense">Activité intense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="objectif">Mon objectif</Label>
              <Textarea
                id="objectif"
                placeholder="Ex: Réduire ma consommation de moitié d'ici 3 mois..."
                value={formData.objectif}
                onChange={(e) => handleInputChange('objectif', e.target.value)}
                rows={2}
              />
            </div>

            {/* Données du jour */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-primary">Aujourd'hui</h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="consommation">Consommation du jour</Label>
                  <Input
                    id="consommation"
                    type="number"
                    placeholder="0"
                    value={formData.consommation_du_jour}
                    onChange={(e) => handleInputChange('consommation_du_jour', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="humeur">Comment je me sens</Label>
                  <Select value={formData.humeur} onValueChange={(value) => handleInputChange('humeur', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mon état d'esprit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motive">Motivé(e)</SelectItem>
                      <SelectItem value="stresse">Stressé(e)</SelectItem>
                      <SelectItem value="fatigue">Fatigué(e)</SelectItem>
                      <SelectItem value="anxieux">Anxieux/se</SelectItem>
                      <SelectItem value="heureux">Heureux/se</SelectItem>
                      <SelectItem value="triste">Triste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulte">Difficulté ressentie</Label>
                  <Select value={formData.difficulte} onValueChange={(value) => handleInputChange('difficulte', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau de difficulté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucune">Aucune difficulté</SelectItem>
                      <SelectItem value="envie_legere">Envie légère</SelectItem>
                      <SelectItem value="envie_forte">Envie forte</SelectItem>
                      <SelectItem value="manque_motivation">Manque de motivation</SelectItem>
                      <SelectItem value="pression_sociale">Pression sociale</SelectItem>
                      <SelectItem value="habitude">Force de l'habitude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="progression">Ma progression</Label>
                  <Select value={formData.progression} onValueChange={(value) => handleInputChange('progression', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Évolution récente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reduction">En réduction</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="augmentation">En augmentation</SelectItem>
                      <SelectItem value="arret">En phase d'arrêt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGetAdvice}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Recevoir un conseil
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Réponse IA */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Votre conseil personnalisé
            </CardTitle>
            <CardDescription>
              Conseils adaptés à votre situation et vos objectifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
                  <Brain className="w-6 h-6 text-purple-500 absolute top-3 left-3" />
                </div>
                <p className="text-muted-foreground animate-pulse">
                  Votre coach IA analyse vos données...
                </p>
              </div>
            )}
            
            {advice && !loading && (
              <div className="prose prose-sm max-w-none">
                <div 
                  className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-6 rounded-lg border border-purple-200/30"
                  dangerouslySetInnerHTML={{ 
                    __html: formatAdvice(advice) 
                  }}
                />
              </div>
            )}
            
            {!advice && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Remplissez le formulaire et cliquez sur "Recevoir un conseil" pour obtenir des recommandations personnalisées.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
