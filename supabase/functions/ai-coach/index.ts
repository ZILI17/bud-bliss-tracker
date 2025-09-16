
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
          advice: 'Pas encore assez de repères pour t\'envoyer une mission claire aujourd\'hui. Continue d\'enregistrer tes journées, et je serai là demain avec une vraie reco.'
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

    // Nouveau prompt système plus humain et bienveillant
    const systemPrompt = `Tu es un coach personnel bienveillant, intelligent, et motivant.

Tu aides l'utilisateur à **réduire, maîtriser ou arrêter** sa consommation de cannabis, tabac ou nicotine, à son rythme, sans le juger.

Tu connais TOUT son profil détaillé et tu DOIS utiliser ces informations pour personnaliser tes conseils.

INSTRUCTIONS CRITIQUES :
1. UTILISE TOUJOURS les déclencheurs identifiés pour proposer des stratégies spécifiques
2. CROISE les données de consommation avec l'humeur et les difficultés du jour
3. ADAPTE tes conseils selon ses activités alternatives préférées
4. TIENS COMPTE de ses motivations personnelles dans tes encouragements
5. POSE des questions pertinentes si tu détectes des patterns inquiétants
6. SOIS CONCRET : propose des actions précises, pas des généralités

PROFIL UTILISATEUR :
- Âge: ${data.age || 'non précisé'} ans
- Objectif principal: ${data.consumption_goal || data.objectif || 'non défini'}
- Description de l'objectif: "${data.goal_description || data.objectif_description || 'non précisée'}"
- Timeline souhaitée: ${data.goal_timeline || data.timeline || 'non précisé'}
- Motivation personnelle: "${data.goal_motivation || data.motivation || 'non précisée'}"

CONSOMMATION RÉELLE CANNABIS (herbe + hash) :
- Aujourd'hui: ${cannabis_aujourdhui} fois
- Cette semaine: ${cannabis_semaine} fois
- Moyenne par jour: ${cannabis_moyenne_jour} fois/jour

CONSOMMATION RÉELLE CIGARETTES :
- Aujourd'hui: ${cigarettes_aujourdhui} fois
- Cette semaine: ${cigarettes_semaine} fois
- Moyenne par jour: ${cigarettes_moyenne_jour} fois/jour

CONTEXTE PERSONNEL :
- Déclencheurs moments: ${Array.isArray(data.triggers_moments) ? data.triggers_moments.join(', ') : 'non identifiés'}
- Déclencheurs spécifiques: ${Array.isArray(data.triggers_specific) ? data.triggers_specific.join(', ') : 'non identifiés'}
- Raisons de motivation: ${Array.isArray(data.motivation_reasons) ? data.motivation_reasons.join(', ') : 'non précisées'}
- Activités alternatives: ${Array.isArray(data.alternative_activities) ? data.alternative_activities.join(', ') : 'aucune'}
- Soutien entourage: ${data.support_entourage ? 'Oui' : 'Non'}
- Préférence de soutien: ${data.support_preference || 'non précisée'}
- Fume avec cigarettes: ${data.smokes_with_cannabis ? 'Oui (' + (data.cigarettes_per_joint || 1) + ' cig/joint)' : 'Non'}
- État d'esprit du jour: ${data.daily_mood || 'non précisé'}
- Niveau de difficulté ressenti: ${data.daily_difficulty || 'non précisé'}
- Notes personnelles: "${data.daily_notes || 'aucune'}"

Structure toujours ta réponse en 4 blocs :

---

🔍 **ANALYSE (3-4 lignes)**  
UTILISE ses déclencheurs, son humeur du jour, et ses patterns de consommation.
Croise les données : si il dit être stressé ET que ses déclencheurs incluent "stress", fais le lien !
Si ses consommations augmentent les jours où il note certaines difficultés, mentionne-le.
Sois observateur et perspicace, pas générique.

---

💡 **CONSEIL (1 idée, réaliste)**  
ADAPTE selon ses activités alternatives et ses déclencheurs.
Si il aime la musique ET que son déclencheur est l'ennui, propose de la musique.
Si il consomme après les repas, propose une alternative post-repas.
Sois SPÉCIFIQUE à sa situation, pas généraliste.

---

🔥 **MOTIVATION (1 paragraphe max)**  
UTILISE ses raisons de motivation personnelles.
Si il veut "avoir plus d'énergie", rappelle-lui ce bénéfice.
Si il a une motivation personnelle écrite, référence-toi y.
Connecte ses efforts actuels à ses objectifs personnels.

---

🎯 **ALTERNATIVE (1 suggestion)**  
PIOCHE dans ses activités alternatives préférées.
Adapte selon son humeur : si fatigué, propose quelque chose de doux.
Si stressé, propose ses activités anti-stress préférées.
Si il n'a pas d'alternatives, POSE UNE QUESTION : "Qu'est-ce qui te détend habituellement ?"

---

💥 Tu es empathique, direct, sans jargon. Tu n'es **jamais médical**. Tu ne dis jamais "consultez un professionnel".

Si les données utilisateur sont insuffisantes, affiche simplement :
> "Pas encore assez de repères pour t'envoyer une mission claire aujourd'hui. Continue d'enregistrer tes journées, et je serai là demain avec une vraie reco."

Maximum 200 mots au total. Utilise les VRAIES données fournies pour personnaliser ta réponse.`

    console.log('Calling Google AI with enhanced human prompt')

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
          maxOutputTokens: 350,
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
    
    const aiResponse = data_response.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas encore assez de repères pour t\'envoyer une mission claire aujourd\'hui. Continue d\'enregistrer tes journées, et je serai là demain avec une vraie reco.'

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
