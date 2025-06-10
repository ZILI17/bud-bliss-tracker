
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, History, Cannabis, Cigarette } from 'lucide-react';
import { useConsumption } from '@/hooks/useConsumption';
import AddConsumptionForm from '@/components/AddConsumptionForm';
import ConsumptionHistory from '@/components/ConsumptionHistory';
import Stats from '@/components/Stats';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { consumptions, addConsumption, deleteConsumption, getStats } = useConsumption();
  const { toast } = useToast();

  const handleAddConsumption = (consumption: Parameters<typeof addConsumption>[0]) => {
    addConsumption(consumption);
    setShowForm(false);
    setActiveTab('home');
    toast({
      title: "✅ Consommation ajoutée",
      description: "Votre entrée a été enregistrée avec succès.",
    });
  };

  const handleQuickAdd = (type: 'herbe' | 'hash' | 'cigarette', quantity: string) => {
    const now = new Date();
    const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    addConsumption({
      type,
      quantity,
      date,
    });
    
    const typeLabels = {
      herbe: 'Herbe',
      hash: 'Hash',
      cigarette: 'Cigarette'
    };
    
    toast({
      title: `✅ ${typeLabels[type]} ajouté`,
      description: `${quantity} enregistré rapidement.`,
    });
  };

  const handleDeleteConsumption = (id: string) => {
    deleteConsumption(id);
    toast({
      title: "🗑️ Entrée supprimée",
      description: "La consommation a été retirée de votre historique.",
    });
  };

  const stats = getStats();

  const quickAddButtons = [
    { type: 'herbe' as const, label: 'Herbe', quantity: '1 joint', icon: Cannabis, color: 'bg-green-600 hover:bg-green-700' },
    { type: 'hash' as const, label: 'Hash', quantity: '1 dose', icon: Cannabis, color: 'bg-amber-600 hover:bg-amber-700' },
    { type: 'cigarette' as const, label: 'Cigarette', quantity: '1 cig', icon: Cigarette, color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Suivi Consommation
          </h1>
          <p className="text-muted-foreground">
            Suivez votre consommation personnelle en toute simplicité
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Accueil
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {!showForm ? (
              <div className="text-center space-y-6">
                {/* Boutons rapides d'ajout */}
                <div className="py-8">
                  <h2 className="text-lg font-semibold mb-6">Ajout rapide</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {quickAddButtons.map((button) => {
                      const IconComponent = button.icon;
                      return (
                        <Button
                          key={button.type}
                          onClick={() => handleQuickAdd(button.type, button.quantity)}
                          size="lg"
                          className={`h-20 flex flex-col gap-2 ${button.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                        >
                          <IconComponent className="w-6 h-6" />
                          <div className="text-center">
                            <div className="font-semibold">{button.label}</div>
                            <div className="text-xs opacity-90">{button.quantity}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Cliquez pour ajouter instantanément avec les quantités par défaut
                  </p>
                </div>

                {/* Bouton personnalisé */}
                <div className="border-t pt-6">
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    size="lg"
                    className="h-16 px-8"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajout personnalisé
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pour personnaliser la quantité ou ajouter une note
                  </p>
                </div>

                {/* Aperçu rapide */}
                {consumptions.length > 0 && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border">
                    <h3 className="font-semibold mb-4">Aperçu rapide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {Object.values(stats.weekTotal).reduce((a, b) => a + b, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Cette semaine</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {Object.values(stats.monthTotal).reduce((a, b) => a + b, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Ce mois</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{consumptions.length}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <AddConsumptionForm
                onAdd={handleAddConsumption}
                onCancel={() => setShowForm(false)}
              />
            )}
          </TabsContent>

          <TabsContent value="stats">
            <Stats stats={stats} />
          </TabsContent>

          <TabsContent value="history">
            <ConsumptionHistory
              consumptions={consumptions}
              onDelete={handleDeleteConsumption}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
