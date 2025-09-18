import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_API_KEY) {
      console.error('GOOGLE_AI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestData = await req.json();
    console.log('Received analysis request:', JSON.stringify(requestData, null, 2));

    // Construire le prompt structuré pour l'analyse en 4 parties
    const systemPrompt = `Tu es un coach IA spécialisé dans l'accompagnement pour la réduction/arrêt de consommation de cannabis et cigarettes.

DONNÉES UTILISATEUR:
${JSON.stringify(requestData, null, 2)}

Tu dois fournir une analyse structurée en 4 parties distinctes. Chaque partie doit être claire, personnalisée et basée sur les vraies données fournies.

**IMPORTANT**: Réponds UNIQUEMENT en JSON avec cette structure exacte:
{
  "summary": "...",
  "personal_analysis": "...", 
  "practical_advice": "...",
  "goal_progress": "..."
}

PARTIE 1 - RÉSUMÉ (summary):
- Stats clés aujourd'hui vs hier
- Stats cette semaine vs semaine passée  
- Coût total et comparaisons
- Utilise les VRAIS chiffres des données

PARTIE 2 - ANALYSE PERSONNALISÉE (personal_analysis):
- Identifie les habitudes basées sur les patterns
- Croise avec les déclencheurs définis par l'utilisateur
- Prends en compte l'âge, l'activité physique, etc.
- Sois précis et personnalisé

PARTIE 3 - CONSEIL PRATIQUE + ALTERNATIVE (practical_advice):
- Un conseil concret applicable aujourd'hui
- Une activité alternative basée sur ses préférences définies
- Lié à son profil (activité physique, soutien, etc.)

PARTIE 4 - PROGRESSION OBJECTIF (goal_progress):
- Rappelle son objectif précis (réduction/arrêt/etc.)
- Évalue s'il est en avance/retard/dans les temps
- Motivation personnalisée basée sur ses motivations définies

Ton ton est bienveillant, encourageant et factuel. Utilise les données réelles, pas d'inventions.`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response structure from Gemini');
      throw new Error('Invalid response from AI');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    console.log('AI response text:', aiResponse);

    // Extraire le JSON de la réponse
    let analysisJson;
    try {
      // Chercher le JSON dans la réponse
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
      console.error('AI response was:', aiResponse);
      
      // Fallback: créer une structure basique si le parsing échoue
      analysisJson = {
        summary: "Analyse disponible - données en cours de traitement",
        personal_analysis: "Continue ton suivi, les patterns se précisent avec plus de données",
        practical_advice: "Focus sur tes activités alternatives définies dans ton profil",
        goal_progress: `Tu progresses vers ton objectif: ${requestData.profile?.consumption_goal || 'défini dans tes paramètres'}`
      };
    }

    console.log('Parsed analysis:', analysisJson);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisJson 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-consumption-analysis:', error);
    return new Response(JSON.stringify({ 
      error: 'Analysis generation failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});