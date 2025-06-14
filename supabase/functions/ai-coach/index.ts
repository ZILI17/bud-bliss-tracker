
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
    const { context } = await req.json()
    console.log('Received context:', JSON.stringify(context, null, 2))

    if (!context) {
      console.error('No context provided')
      return new Response(
        JSON.stringify({ error: 'Context is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY')
    if (!GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not configured')
    }

    // Construire un prompt ultra-personnalisé avec toutes les données
    const systemPrompt = `Tu es un coach IA bienveillant spécialisé dans l'accompagnement personnalisé pour la réduction de consommation de substances. 

PROFIL UTILISATEUR COMPLET :
- Âge: ${context.age || 'non précisé'} ans
- Poids/Taille: ${context.weight_kg || '?'}kg / ${context.height_cm || '?'}cm
- Activité physique: ${context.activity_level || 'non précisée'}

OBJECTIF DÉFINI :
- Objectif principal: ${context.consumption_goal || 'non défini'}
- Description personnelle: "${context.goal_description || 'non précisée'}"
- Délai souhaité: ${context.goal_timeline || 'non précisé'}
- Motivation: "${context.goal_motivation || 'non précisée'}"

DÉCLENCHEURS IDENTIFIÉS :
- Moments à risque: ${context.triggers_moments?.join(', ') || 'non identifiés'}
- Déclencheurs spécifiques: ${context.triggers_specific?.join(', ') || 'non identifiés'}

MOTIVATIONS :
- Raisons principales: ${context.motivation_reasons?.join(', ') || 'non précisées'}
- Motivation personnelle: "${context.motivation_personal || 'non précisée'}"

SOUTIEN ET PRÉFÉRENCES :
- Soutien entourage: ${context.support_entourage ? 'Oui' : 'Non'}
- Type de conseils préféré: ${context.support_preference || 'non précisé'}

ACTIVITÉS ALTERNATIVES CONNUES :
${context.alternative_activities?.join(', ') || 'Aucune identifiée'}
- Veut des suggestions quotidiennes: ${context.wants_daily_suggestions ? 'Oui' : 'Non'}

DONNÉES DU JOUR :
- Humeur: ${context.daily_mood || 'non précisée'}
- Difficulté ressentie: ${context.daily_difficulty || 'non précisée'}
- Notes: "${context.daily_notes || 'aucune'}"

STATISTIQUES DE CONSOMMATION :
- Moyenne quotidienne: ${context.stats?.daily_average || 0} fois/jour
- Total semaine: ${context.stats?.weekly_total || 0} fois
- Total mois: ${context.stats?.monthly_total || 0} fois
- Tendance récente: ${context.stats?.recent_trend || 'inconnue'}

INSTRUCTIONS :
1. Analyse la situation du jour en tenant compte de TOUT le contexte
2. Donne une recommandation concrète et personnalisée
3. Propose une action alternative adaptée aux activités qu'il aime déjà
4. Sois encourageant et bienveillant, jamais culpabilisant
5. Termine par un message motivant lié à son objectif personnel
6. Si des déclencheurs sont identifiés aujourd'hui, donne des conseils spécifiques
7. Utilise ses motivations personnelles pour l'encourager

Réponds en français, de manière humaine et personnalisée. Maximum 200 mots.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`, {
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
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google AI API Error:', errorText)
      throw new Error(`Google AI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Google AI Response:', JSON.stringify(data, null, 2))
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je ne peux pas générer de conseil pour le moment.'

    return new Response(
      JSON.stringify({ advice: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error in ai-coach function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la génération du conseil',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
