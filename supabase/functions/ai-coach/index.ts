
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json()
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2))
    
    // Accepter les données soit sous forme de 'context' (AICoach) soit directement (DailyAIRecommendation)
    const data = requestBody.context || requestBody
    console.log('Processed data:', JSON.stringify(data, null, 2))

    if (!data) {
      console.error('No data provided')
      return new Response(
        JSON.stringify({ 
          success: true,
          advice: 'Je pourrai mieux t\'aider dès que tu auras défini ton objectif et enregistré quelques jours de consommation.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY')
    if (!GOOGLE_AI_API_KEY) {
      console.error('Google AI API key not configured')
      return new Response(
        JSON.stringify({ 
          success: true,
          advice: 'Je ne peux pas générer de conseil pour le moment car la clé API n\'est pas configurée. Veuillez contacter l\'administrateur.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Calculer correctement les données par type de substance
    const today = new Date().toISOString().split('T')[0];
    const consommationsAujourdhui = data.consommations_du_jour || [];
    
    // Compter les vraies consommations d'aujourd'hui
    const cannabis_aujourdhui = consommationsAujourdhui.filter((c: any) => 
      c.type === 'herbe' || c.type === 'hash'
    ).length;
    const cigarettes_aujourdhui = consommationsAujourdhui.filter((c: any) => 
      c.type === 'cigarette'
    ).length;
    
    // Utiliser les vraies données de la semaine
    const cannabis_semaine = (data.consommation_semaine_herbe || 0) + (data.consommation_semaine_hash || 0);
    const cigarettes_semaine = data.consommation_semaine_cigarette || 0;

    // Calculer les vraies moyennes journalières sur 7 jours
    const cannabis_moyenne_jour = Math.round((cannabis_semaine / 7) * 10) / 10;
    const cigarettes_moyenne_jour = Math.round((cigarettes_semaine / 7) * 10) / 10;

    // Construire un prompt système enrichi et personnalisé
    const systemPrompt = `Tu es un coach personnel bienveillant, spécialisé dans la réduction ou la maîtrise de la consommation de cannabis, tabac ou nicotine.
Tu aides l'utilisateur à progresser à son rythme, sans jugement.

PROFIL UTILISATEUR :
- Âge: ${data.age || 'non précisé'} ans
- Objectif principal: ${data.consumption_goal || data.objectif || 'non défini'}
- Description de l'objectif: "${data.goal_description || data.objectif_description || 'non précisée'}"
- Timeline souhaitée: ${data.goal_timeline || data.timeline || 'non précisé'}
- Motivation personnelle: "${data.goal_motivation || data.motivation || 'non précisée'}"

CONSOMMATION RÉELLE CANNABIS (herbe + hash) :
- Aujourd'hui: ${cannabis_aujourdhui} fois (VRAIES DONNÉES)
- Cette semaine: ${cannabis_semaine} fois (VRAIES DONNÉES)
- Moyenne par jour: ${cannabis_moyenne_jour} fois/jour

CONSOMMATION RÉELLE CIGARETTES :
- Aujourd'hui: ${cigarettes_aujourdhui} fois (VRAIES DONNÉES)
- Cette semaine: ${cigarettes_semaine} fois (VRAIES DONNÉES)
- Moyenne par jour: ${cigarettes_moyenne_jour} fois/jour

CONTEXTE PERSONNEL :
- Déclencheurs moments: ${Array.isArray(data.triggers_moments) ? data.triggers_moments.join(', ') : 'non identifiés'}
- Déclencheurs spécifiques: ${Array.isArray(data.triggers_specific) ? data.triggers_specific.join(', ') : 'non identifiés'}
- Raisons de motivation: ${Array.isArray(data.motivation_reasons) ? data.motivation_reasons.join(', ') : 'non précisées'}
- État d'esprit du jour: ${data.daily_mood || 'non précisé'}
- Niveau de difficulté ressenti: ${data.daily_difficulty || 'non précisé'}
- Notes personnelles: "${data.daily_notes || 'aucune'}"

CONSIGNES STRICTES :
1. Structure OBLIGATOIREMENT ta réponse avec ces 4 sections clairement séparées :
   **🔍 ANALYSE** - Contexte personnalisé selon les VRAIES données actuelles
   **💡 CONSEIL** - Une idée concrète à appliquer aujourd'hui  
   **🔥 MOTIVATION** - Encouragement personnalisé selon son objectif
   **🎯 ALTERNATIVE** - Une activité pour remplacer l'envie de consommer

2. Utilise UNIQUEMENT les vraies données fournies (pas de moyennes fantaisistes)
3. Différencie TOUJOURS cannabis et cigarettes dans tes conseils
4. Sois bienveillant, motivant et informel (tutoiement)
5. Ne propose JAMAIS de consulter un médecin ou demander de l'aide extérieure
6. L'outil doit être autonome et autosuffisant
7. Maximum 180 mots au total
8. Base-toi sur les VRAIES consommations pour donner des conseils pertinents

Réponds maintenant selon cette structure obligatoire en utilisant les VRAIES données.`

    console.log('Calling Google AI with enhanced prompt')

    // Utiliser l'API Gemini 1.5 Flash avec la bonne configuration
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    })

    console.log('Google AI Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google AI API Error:', response.status, errorText)
      return new Response(
        JSON.stringify({ 
          success: true,
          advice: 'Désolé, je rencontre des difficultés techniques pour générer ton conseil personnalisé. Réessaie dans quelques instants.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const data_response = await response.json()
    console.log('Google AI Response received successfully')
    
    const aiResponse = data_response.candidates?.[0]?.content?.parts?.[0]?.text || 'Je pourrai mieux t\'aider dès que tu auras défini ton objectif et enregistré quelques jours de consommation.'

    return new Response(
      JSON.stringify({ 
        success: true,
        advice: aiResponse 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error in ai-coach function:', error)
    return new Response(
      JSON.stringify({ 
        success: true,
        advice: 'Désolé, une erreur technique est survenue. Veuillez réessayer dans quelques instants.'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
