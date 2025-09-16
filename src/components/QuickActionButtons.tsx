import React from 'react';
import { Button } from '@/components/ui/button';
import { Cannabis, Cigarette, Zap, Plus } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface QuickActionButtonsProps {
  onQuickAdd: (type: 'herbe' | 'hash' | 'cigarette') => void;
  onShowForm: () => void;
}

const QuickActionButtons = ({ onQuickAdd, onShowForm }: QuickActionButtonsProps) => {
  const { profile, getDefaultQuantity } = useProfile();

  const quickAddButtons = [
    { 
      type: 'herbe' as const, 
      label: 'Cannabis', 
      quantity: getDefaultQuantity('herbe'), 
      icon: Cannabis, 
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      shadow: 'shadow-emerald-500/25',
      description: profile?.smokes_with_cannabis ? `+${profile.cigarettes_per_joint} cig auto` : ''
    },
    { 
      type: 'hash' as const, 
      label: 'Hash', 
      quantity: getDefaultQuantity('hash'), 
      icon: Cannabis, 
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      shadow: 'shadow-amber-500/25',
      description: profile?.smokes_with_cannabis ? `+${profile.cigarettes_per_joint} cig auto` : ''
    },
    { 
      type: 'cigarette' as const, 
      label: 'Cigarette', 
      quantity: getDefaultQuantity('cigarette'), 
      icon: Cigarette, 
      gradient: 'from-slate-500 via-gray-500 to-slate-600',
      shadow: 'shadow-slate-500/25',
      description: ''
    },
  ];

  return (
    <div className="text-center space-y-6 md:space-y-8">
      {/* Quick add buttons */}
      <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl">
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Enregistrement Rapide</h2>
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {quickAddButtons.map((button) => {
            const IconComponent = button.icon;
            return (
              <div key={button.type} className="relative group">
                <Button
                  onClick={() => onQuickAdd(button.type)}
                  size="lg"
                  className={`h-28 sm:h-32 md:h-36 w-full flex flex-col gap-2 sm:gap-3 bg-gradient-to-br ${button.gradient} text-white shadow-2xl ${button.shadow} hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 neon-glow relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 relative z-10" />
                  <div className="text-center relative z-10">
                    <div className="font-bold text-sm sm:text-base md:text-lg">{button.label}</div>
                    <div className="text-xs sm:text-sm opacity-90">{button.quantity}</div>
                    {button.description && (
                      <div className="text-xs opacity-75 mt-1 bg-black/20 rounded px-2 py-1">
                        {button.description}
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 opacity-75">
          ⚡ Quantités personnalisées - Modifiables dans les paramètres
          {profile?.smokes_with_cannabis && (
            <br />
            <span className="text-blue-300">🚬 Auto-ajout de cigarettes activé</span>
          )}
        </p>
      </div>

      {/* Custom entry button */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border-dashed border-2 border-primary/30">
        <Button
          onClick={onShowForm}
          variant="outline"
          size="lg"
          className="h-12 sm:h-14 md:h-16 px-4 sm:px-6 md:px-8 glass-button neon-glow text-sm sm:text-base md:text-lg w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
          <span className="hidden sm:inline">Enregistrement Personnalisé</span>
          <span className="sm:hidden">Personnalisé</span>
        </Button>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 opacity-75">
          🎯 Pour personnaliser la quantité ou ajouter des détails
        </p>
      </div>
    </div>
  );
};

export default QuickActionButtons;