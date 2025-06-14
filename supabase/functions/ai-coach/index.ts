
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoachRequest {
  age?: number;
  sexe?: string;
  poids?: number;
  taille?: number;
  activite_physique?: string;
  objectif?: string;
  consommation_du_jour?: number;
  humeur?: string;
  difficulte?: string;
  progression?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('GOOGLE_AI_API_KEY not configured');
    }

    const requestData: CoachRequest = await req.json();
    
    // Construction du prompt système personnalisé
    const systemPrompt = `Tu es un coach bienveillant spécialisé dans l'accompagnement de personnes qui souhaitent réduire leur consommation de cannabis et/ou tabac. 

Ton rôle :
- Être empathique, positif et sans jugement
- Proposer des conseils personnalisés basés sur les données de l'utilisateur
- Donner des alternatives concrètes à la consommation
- Motiver et encourager les progrès même petits
- Ne JAMAIS donner de conseils médicaux
- Toujours terminer par une action simple et réalisable

Structure ta réponse en 4 parties courtes :
1. **Analyse** : Commentaire sur la situation actuelle
2. **Conseil** : Recommandation personnalisée pour aujourd'hui
3. **Motivation** : Message d'encouragement adapté
4. **Action** : Une suggestion d'alternative concrète à faire maintenant

Garde un ton humain, proche et bienveillant.`;

    // Construction du prompt utilisateur avec les données
    const userPrompt = `Voici mes données du jour :
${requestData.age ? `- Âge : ${requestData.age} ans` : ''}
${requestData.sexe ? `- Sexe : ${requestData.sexe}` : ''}
${requestData.poids ? `- Poids : ${requestData.poids} kg` : ''}
${requestData.taille ? `- Taille : ${requestData.taille} cm` : ''}
${requestData.activite_physique ? `- Activité physique : ${requestData.activite_physique}` : ''}
${requestData.objectif ? `- Mon objectif : ${requestData.objectif}` : ''}
${requestData.consommation_du_jour !== undefined ? `- Consommation aujourd'hui : ${requestData.consommation_du_jour}` : ''}
${requestData.humeur ? `- Humeur : ${requestData.humeur}` : ''}
${requestData.difficulte ? `- Difficulté ressentie : ${requestData.difficulte}` : ''}
${requestData.progression ? `- Progression : ${requestData.progression}` : ''}

Peux-tu me donner un conseil personnalisé pour m'aider aujourd'hui ?`;

    // Appel à l'API Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedAdvice = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je n\'ai pas pu générer de conseil pour le moment.';

    return new Response(JSON.stringify({ 
      advice: generatedAdvice,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-coach function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la génération du conseil',
      details: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
