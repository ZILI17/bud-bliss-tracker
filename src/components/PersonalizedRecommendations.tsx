
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, Target, Lightbulb, Heart, X, Sparkles } from 'lucide-react';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  content: string;
  priority: number;
  is_read: boolean;
}

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user) return;

    try {
      // Générer les recommandations personnalisées
      const { data: generatedRecs, error: genError } = await supabase
        .rpc('calculate_personalized_recommendations', { user_uuid: user.id });

      if (genError) throw genError;

      if (generatedRecs && generatedRecs.length > 0) {
        // Insérer les nouvelles recommandations
        const recsToInsert = generatedRecs.map((rec: any) => ({
          user_id: user.id,
          type: rec.rec_type,
          title: rec.rec_title,
          content: rec.rec_content,
          priority: rec.rec_priority,
        }));

        await supabase.from('recommendations').upsert(recsToInsert, {
          onConflict: 'user_id,type,title'
        });
      }

      // Récupérer toutes les recommandations
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('priority', { ascending: false });

      if (error) throw error;

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setRecommendations(prev => prev.filter(rec => rec.id !== id));
    } catch (error) {
      console.error('Error marking recommendation as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'daily_limit':
      case 'health_warning':
        return AlertTriangle;
      case 'reduction_tip':
        return Lightbulb;
      case 'motivation':
        return Heart;
      default:
        return Target;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'daily_limit':
        return 'border-red-500/50 bg-red-500/10';
      case 'health_warning':
        return 'border-orange-500/50 bg-orange-500/10';
      case 'reduction_tip':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'motivation':
        return 'border-green-500/50 bg-green-500/10';
      default:
        return 'border-purple-500/50 bg-purple-500/10';
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-center">
          <div className="pulse-ring mr-4"></div>
          <p className="text-primary">Génération des recommandations...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-bold mb-2">Excellent travail !</h3>
        <p className="text-muted-foreground">
          Aucune recommandation urgente pour le moment. Continuez ainsi !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold hologram-text">Recommandations Personnalisées</h3>
      </div>
      
      {recommendations.map((rec) => {
        const IconComponent = getIcon(rec.type);
        return (
          <Card
            key={rec.id}
            className={`${getColor(rec.type)} border-2 transition-all duration-300 hover:scale-[1.02]`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  {rec.title}
                </div>
                <Button
                  onClick={() => markAsRead(rec.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{rec.content}</p>
              <div className="mt-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority >= 4 ? 'bg-red-500/20 text-red-400' :
                  rec.priority >= 3 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  Priorité {rec.priority}/5
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PersonalizedRecommendations;
