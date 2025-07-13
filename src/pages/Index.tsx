import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, History, Cannabis, Cigarette, Sparkles, Zap, Shield, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useSupabaseConsumption } from '@/hooks/useSupabaseConsumption';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import AddConsumptionForm from '@/components/AddConsumptionForm';
import ConsumptionHistory from '@/components/ConsumptionHistory';
import Stats from '@/components/Stats';
import ImprovedAnalytics from '@/components/ImprovedAnalytics';
import DailyAIRecommendation from '@/components/DailyAIRecommendation';
import AICoach from '@/components/AICoach';
import { useToast } from '@/hooks/use-toast';
import AddHistoricalDataButton from '@/components/AddHistoricalDataButton';

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

  const quickAddButtons = [
    { 
      type: 'herbe' as const, 
      label: 'Cannabis', 
      quantity: getDefaultQuantity('herbe'), 
      icon: Cannabis, 
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      shadow: 'shadow-emerald-500/25'
    },
    { 
      type: 'hash' as const, 
      label: 'Hash', 
      quantity: getDefaultQuantity('hash'), 
      icon: Cannabis, 
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      shadow: 'shadow-amber-500/25'
    },
    { 
      type: 'cigarette' as const, 
      label: 'Cigarette', 
      quantity: getDefaultQuantity('cigarette'), 
      icon: Cigarette, 
      gradient: 'from-slate-500 via-gray-500 to-slate-600',
      shadow: 'shadow-slate-500/25'
    },
  ];

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
        <div className="text-center py-12 relative">
          <div className="absolute top-0 right-0 flex gap-2">
            <AddHistoricalDataButton />
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="glass-button neon-glow"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="glass-button neon-glow"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
          
          <div className="inline-block relative">
            <div className="pulse-ring"></div>
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary relative z-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 hologram-text">
            Agent Quit Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Intelligence artificielle de suivi personnel
          </p>
          <p className="text-sm text-primary/80 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Bienvenue {user?.email?.split('@')[0]} - Vos données sont sécurisées
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 glass-card p-2 h-14">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 h-10 glass-button neon-glow"
            >
              <Plus className="w-4 h-4" />
              Mission
            </TabsTrigger>
            <TabsTrigger 
              value="coach" 
              className="flex items-center gap-2 h-10 glass-button neon-glow"
            >
              <Sparkles className="w-4 h-4" />
              Coach IA
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex items-center gap-2 h-10 glass-button neon-glow"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2 h-10 glass-button neon-glow"
            >
              <History className="w-4 h-4" />
              Archives
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            {/* Recommandation IA du jour */}
            <DailyAIRecommendation />

            {!showForm ? (
              <div className="text-center space-y-8">
                {/* Quick add buttons */}
                <div className="glass-card p-8 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Zap className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Enregistrement Rapide</h2>
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {quickAddButtons.map((button) => {
                      const IconComponent = button.icon;
                      return (
                        <div key={button.type} className="relative group">
                          <Button
                            onClick={() => handleQuickAdd(button.type)}
                            size="lg"
                            className={`h-32 w-full flex flex-col gap-3 bg-gradient-to-br ${button.gradient} text-white shadow-2xl ${button.shadow} hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 neon-glow relative overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <IconComponent className="w-8 h-8 relative z-10" />
                            <div className="text-center relative z-10">
                              <div className="font-bold text-lg">{button.label}</div>
                              <div className="text-sm opacity-90">{button.quantity}</div>
                            </div>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 opacity-75">
                    ⚡ Quantités personnalisées - Modifiables dans les paramètres
                  </p>
                </div>

                {/* Custom entry button */}
                <div className="glass-card p-6 rounded-2xl border-dashed border-2 border-primary/30">
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    size="lg"
                    className="h-16 px-8 glass-button neon-glow text-lg"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Enregistrement Personnalisé
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3 opacity-75">
                    🎯 Pour personnaliser la quantité ou ajouter des détails
                  </p>
                </div>

                {/* Analytics intégrées */}
                {consumptions.length > 0 && (
                  <div className="glass-card p-8 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 text-center hologram-text">Aperçu Analytics</h3>
                    <ImprovedAnalytics stats={stats} compact={true} />
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-8 rounded-2xl">
                <AddConsumptionForm
                  onAdd={handleAddConsumption}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="coach">
            <AICoach />
          </TabsContent>

          <TabsContent value="stats">
            <div className="glass-card p-8 rounded-2xl">
              <ImprovedAnalytics stats={stats} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="glass-card p-8 rounded-2xl">
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
