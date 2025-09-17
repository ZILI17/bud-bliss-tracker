
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Settings as SettingsIcon, Database, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/ui/use-toast';
import { migratePastConsumptions } from '@/utils/migrateConsumptions';
import UserProfile from './UserProfile';

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleMigratePastData = async () => {
    if (!user?.id || !profile) {
      toast({
        title: "Erreur",
        description: "Profil non trouvé",
        variant: "destructive",
      });
      return;
    }

    setIsMigrating(true);

    try {
      const result = await migratePastConsumptions(user.id, profile);
      
      if (result.success) {
        toast({
          title: "Migration réussie",
          description: `${result.addedCigarettes} cigarettes ajoutées automatiquement`,
        });
      } else {
        toast({
          title: "Erreur de migration",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de migrer les données",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <div className="container max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="glass-button neon-glow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold hologram-text">Paramètres</h1>
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <UserProfile />

          {/* Data Migration */}
          {profile?.smokes_with_cannabis && profile?.cigarettes_per_joint && (
            <Card className="glass-card border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Adapter les anciennes données
                    </h3>
                    <p className="text-sm text-blue-600 mt-1">
                      Ajouter automatiquement les cigarettes pour vos anciennes consommations de cannabis/hash
                    </p>
                  </div>
                  <Button
                    onClick={handleMigratePastData}
                    disabled={isMigrating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isMigrating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Migration...
                      </>
                    ) : (
                      'Migrer'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sign Out */}
          <Card className="glass-card border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-700">Déconnexion</h3>
                  <p className="text-sm text-red-600">Se déconnecter de votre compte</p>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Se déconnecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
