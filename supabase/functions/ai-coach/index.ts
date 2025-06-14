
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
          advice: 'Aucune donnée fournie pour générer le conseil.'
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

    // Construire un prompt adapté aux données reçues
    const systemPrompt = `Tu es un coach IA bienveillant spécialisé dans l'accompagnement personnalisé pour la réduction de consommation de substances.

DONNÉES UTILISATEUR :
- Âge: ${data.age || 'non précisé'} ans
- Objectif: ${data.consumption_goal || data.objectif || 'non défini'}
- Description objectif: "${data.goal_description || data.objectif_description || 'non précisée'}"
- Timeline: ${data.goal_timeline || data.timeline || 'non précisé'}
- Motivation: "${data.goal_motivation || data.motivation || 'non précisée'}"

CONSOMMATION ACTUELLE :
- Aujourd'hui: ${data.consommation_du_jour || 0} fois
- Cette semaine: ${data.consommation_semaine || 0} fois  
- Ce mois: ${data.consommation_mois || 0} fois
- Progression: ${data.progression || 'début du suivi'}

DÉCLENCHEURS IDENTIFIÉS :
- Moments à risque: ${Array.isArray(data.triggers_moments) ? data.triggers_moments.join(', ') : 'non identifiés'}
- Déclencheurs spécifiques: ${Array.isArray(data.triggers_specific) ? data.triggers_specific.join(', ') : 'non identifiés'}

MOTIVATIONS :
- Raisons principales: ${Array.isArray(data.motivation_reasons) ? data.motivation_reasons.join(', ') : 'non précisées'}
- Motivation personnelle: "${data.motivation_personal || 'non précisée'}"

HUMEUR ET NOTES DU JOUR :
- Humeur: ${data.daily_mood || 'non précisée'}
- Difficulté: ${data.daily_difficulty || 'non précisée'}
- Notes: "${data.daily_notes || 'aucune'}"

INSTRUCTIONS :
1. Analyse la situation du jour en tenant compte du contexte personnel
2. Donne une recommandation concrète et personnalisée 
3. Propose une action alternative adaptée
4. Sois encourageant et bienveillant, jamais culpabilisant
5. Termine par un message motivant lié à l'objectif personnel
6. Si des déclencheurs sont identifiés, donne des conseils spécifiques
7. Utilise les motivations personnelles pour encourager

Réponds en français, de manière humaine et personnalisée. Maximum 200 mots.`

    console.log('Calling Google AI with prompt length:', systemPrompt.length)

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
          temperature: 0.7,
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
          advice: 'Désolé, je rencontre des difficultés techniques pour générer ton conseil personnalisé. Réessaie dans quelques instants ou contacte le support si le problème persiste.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const data_response = await response.json()
    console.log('Google AI Response received successfully')
    
    const aiResponse = data_response.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je ne peux pas générer de conseil pour le moment.'

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
