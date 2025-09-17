import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, History, Cannabis, Cigarette, Sparkles, Zap, Shield, LogOut, Settings as SettingsIcon, Trophy } from 'lucide-react';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import AddConsumptionForm from '@/components/AddConsumptionForm';
import ConsumptionHistory from '@/components/ConsumptionHistory';
import Stats from '@/components/Stats';
import ImprovedStats from '@/components/ImprovedStats';
import DailyAIRecommendation from '@/components/DailyAIRecommendation';
import TodayConsumption from '@/components/TodayConsumption';
import AICoach from '@/components/AICoach';
import StreakDisplay from '@/components/StreakDisplay';
import AchievementSystem from '@/components/AchievementSystem';
import InteractiveGoalTracker from '@/components/InteractiveGoalTracker';
import QuickActionButtons from '@/components/QuickActionButtons';
import { useToast } from '@/hooks/use-toast';
import DeleteAllDataButton from '@/components/DeleteAllDataButton';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { consumptions, addConsumption, deleteConsumption, getStats, loading } = useSupabaseConsumption();
  const { signOut, user } = useAuth();
  const { profile, getDefaultQuantity } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddConsumption = (consumption: Parameters<typeof addConsumption>[0]) => {
    addConsumption(consumption);
    setShowForm(false);
    setActiveTab('home');
    toast({
      title: "✨ Entrée enregistrée",
      description: "Votre consommation a été ajoutée avec succès.",
    });
  };

  const handleQuickAdd = (type: 'herbe' | 'hash' | 'cigarette') => {
    const now = new Date();
    const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    const quantity = getDefaultQuantity(type);
    
    addConsumption({
      type,
      quantity,
      date,
    });
    
    const typeLabels = {
      herbe: 'Cannabis',
      hash: 'Hash',
      cigarette: 'Cigarette'
    };
    
    toast({
      title: `⚡ ${typeLabels[type]} ajouté`,
      description: `${quantity} enregistré dans votre suivi.`,
    });

    // Si c'est du cannabis/hash et que l'utilisateur fume avec des cigarettes
    if ((type === 'herbe' || type === 'hash') && 
        profile?.smokes_with_cannabis && 
        profile?.cigarettes_per_joint > 0) {
      
      // Calculer le nombre de cigarettes à ajouter
      const quantityNum = parseFloat(quantity) || 1;
      const cigarettesToAdd = Math.ceil(quantityNum * profile.cigarettes_per_joint);
      
      // Ajouter automatiquement les cigarettes après un court délai
      setTimeout(() => {
        addConsumption({
          type: 'cigarette',
          quantity: cigarettesToAdd.toString(),
          date,
          note: `Auto-ajouté (${cigarettesToAdd} avec ${type})`,
          price: (profile?.default_cigarette_price || 0.5) * cigarettesToAdd,
        });
        
        toast({
          title: `🚬 Cigarettes ajoutées`,
          description: `${cigarettesToAdd} cigarettes auto-ajoutées avec votre ${typeLabels[type]}.`,
        });
      }, 1000);
    }
  };

  const handleDeleteConsumption = (id: string) => {
    deleteConsumption(id);
    toast({
      title: "🗑️ Entrée supprimée",
      description: "La consommation a été retirée de votre historique.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "👋 Déconnexion",
      description: "À bientôt sur Agent Quit Pro !",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="pulse-ring mb-4"></div>
          <p className="text-primary">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen cyber-grid">
      <div className="container max-w-4xl mx-auto p-4 relative">
        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 floating" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full opacity-40 floating" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full opacity-50 floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-30 floating" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Header with logout and settings */}
        <div className="text-center py-8 md:py-12 relative">
          <div className="absolute top-0 right-0 flex flex-col gap-1 w-20 sm:w-auto sm:flex-row sm:gap-2">
            <DeleteAllDataButton />
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="glass-button neon-glow text-xs sm:text-sm"
            >
              <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Paramètres</span>
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="glass-button neon-glow text-xs sm:text-sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
          
          <div className="inline-block relative">
            <div className="pulse-ring"></div>
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary relative z-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hologram-text">
            Agent Quit Pro
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-2">
            Intelligence artificielle de suivi personnel
          </p>
          <p className="text-xs sm:text-sm text-primary/80 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-center">Bienvenue {user?.email?.split('@')[0]} - Vos données sont sécurisées</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-5 glass-card p-1 sm:p-2 h-12 sm:h-14">
            <TabsTrigger 
              value="home" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-10 glass-button neon-glow text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Mission</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coach" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-10 glass-button neon-glow text-xs sm:text-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-10 glass-button neon-glow text-xs sm:text-sm"
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Succès</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-10 glass-button neon-glow text-xs sm:text-sm"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-10 glass-button neon-glow text-xs sm:text-sm"
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Archives</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 md:space-y-8">
            {/* Consommation du jour - Widget principal */}
            <TodayConsumption consumptions={consumptions} />
            
            {/* Gamification - Série de suivi */}
            <StreakDisplay />
            
            {/* Suivi d'objectif interactif */}
            <InteractiveGoalTracker />

            {!showForm ? (
              <div>
                <QuickActionButtons 
                  onQuickAdd={handleQuickAdd}
                  onShowForm={() => setShowForm(true)}
                />

                {/* Analytics intégrées */}
                {consumptions.length > 0 && (
                  <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center hologram-text">Aperçu Analytics</h3>
                    <ImprovedStats stats={stats} compact={true} />
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl">
                <AddConsumptionForm
                  onAdd={handleAddConsumption}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="coach">
            <div className="space-y-6 md:space-y-8">
              {/* Recommandation IA du jour */}
              <DailyAIRecommendation />
              <AICoach />
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl">
              <AchievementSystem />
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl">
              <ImprovedStats stats={stats} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl">
              <ConsumptionHistory
                consumptions={consumptions}
                onDelete={handleDeleteConsumption}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
