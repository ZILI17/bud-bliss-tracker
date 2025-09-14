
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fonction pour créer et connecter un utilisateur de test
  const createTestUser = async () => {
    setLoading(true);
    try {
      // Créer l'utilisateur test avec un email unique
      const testEmail = `test-${Date.now()}@admin.com`;
      const testPassword = 'admin123';
      
      const { error: signUpError } = await signUp(testEmail, testPassword);
      
      if (!signUpError) {
        // Attendre un peu puis se connecter
        setTimeout(async () => {
          const { error: signInError } = await signIn(testEmail, testPassword);
          if (!signInError) {
            toast({
              title: "✅ Utilisateur test créé et connecté",
              description: `Email: ${testEmail} / Mot de passe: ${testPassword}`,
            });
            navigate('/');
          } else {
            toast({
              title: "Erreur de connexion",
              description: "Utilisateur créé mais connexion échouée",
              variant: "destructive",
            });
          }
        }, 1000);
      } else {
        toast({
          title: "Erreur de création",
          description: signUpError.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'utilisateur test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect. Vérifiez vos identifiants.";
        } else if (error.message.includes('email_address_invalid') || error.message.includes('Email address') && error.message.includes('invalid')) {
          errorMessage = "Adresse email invalide. Utilisez un email avec un domaine valide (ex: gmail.com, outlook.com).";
        }
        
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "✨ Compte créé avec succès",
            description: "Vérifiez votre email pour confirmer votre compte avant de vous connecter.",
          });
          setIsSignUp(false); // Basculer vers la connexion
        } else {
          toast({
            title: "⚡ Connexion réussie",
            description: "Bienvenue dans Agent Quit Pro !",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 floating" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full opacity-40 floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full opacity-50 floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-30 floating" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <div className="pulse-ring"></div>
            <Shield className="w-16 h-16 mx-auto text-primary relative z-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2 hologram-text">
            Agent Quit Pro
          </h1>
          <p className="text-muted-foreground mb-4">
            Intelligence artificielle de suivi personnel
          </p>
          <p className="text-sm text-primary/80 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            {isSignUp ? 'Créez votre compte sécurisé' : 'Accédez à votre mission'}
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* Auth Form */}
        <div className="glass-card p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass-button h-12"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 glass-button h-12"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 neon-glow"
              disabled={loading}
            >
              {loading ? (
                "Traitement..."
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Créer un compte
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp 
                ? "Déjà un compte ? Se connecter" 
                : "Pas de compte ? Créer un compte"
              }
            </button>
            
            <div className="border-t pt-4">
              <Button
                type="button"
                onClick={createTestUser}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                🧪 Créer un utilisateur de test
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Créer et se connecter automatiquement avec un compte de test
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
