/* ============================================================
   MALEFLOW - ANAMNESE DELUXE 2025 (PT / EN / FR)
   Perguntas orientadas ao perfil masculino de treino
============================================================ */

window.FEMFLOW = window.FEMFLOW || {};

FEMFLOW.anamneseLang = {
  pt: {
    nome: "Portugues",
    perguntas: [
      {
        gif: "profile_form.webp",
        texto: "Ha quanto tempo voce treina com regularidade?",
        opcoes: [
          { texto: "Nunca treinei ou menos de 3 meses", v: 1 },
          { texto: "Entre 3 meses e 1 ano", v: 2 },
          { texto: "Mais de 1 ano", v: 3 }
        ]
      },
      {
        gif: "routine_cycle.webp",
        texto: "Quantos dias por semana voce consegue treinar?",
        opcoes: [
          { texto: "1 a 2 dias", v: 1 },
          { texto: "3 a 4 dias", v: 2 },
          { texto: "5 dias ou mais", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "Como esta sua disciplina para seguir o treino ate o fim?",
        opcoes: [
          { texto: "Falho bastante na rotina", v: 1 },
          { texto: "Consigo manter na maior parte das semanas", v: 2 },
          { texto: "Sou consistente e disciplinado", v: 3 }
        ]
      },
      {
        gif: "mobility_flow.webp",
        texto: "Como voce avalia sua tecnica nos exercicios?",
        opcoes: [
          { texto: "Ainda erro bastante a execucao", v: 1 },
          { texto: "Executo bem a maioria dos exercicios", v: 2 },
          { texto: "Tenho otimo controle corporal", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "Como esta sua recuperacao entre os treinos?",
        opcoes: [
          { texto: "Lenta, com dores frequentes", v: 1 },
          { texto: "Depende da intensidade do treino", v: 2 },
          { texto: "Recupero rapido e bem", v: 3 }
        ]
      },
      {
        gif: "mobility_flow.webp",
        texto: "Voce sente dores ou tem alguma lesao hoje?",
        opcoes: [
          { texto: "Sim, tenho dor frequente ou lesao ativa", v: 1 },
          { texto: "As vezes sinto desconforto", v: 2 },
          { texto: "Nao tenho dor nem limitacao", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "Como voce descreve sua forca e resistencia hoje?",
        opcoes: [
          { texto: "Baixa, canso rapido", v: 1 },
          { texto: "Moderada, consigo sustentar o treino", v: 2 },
          { texto: "Alta, treino forte sem perder ritmo", v: 3 }
        ]
      },
      {
        gif: "breath_cycle.webp",
        texto: "Como esta seu sono e nivel de estresse no dia a dia?",
        opcoes: [
          { texto: "Sono ruim e estresse alto", v: 1 },
          { texto: "Oscila durante a semana", v: 2 },
          { texto: "Sono bom e mente controlada", v: 3 }
        ]
      }
    ]
  },
  en: {
    nome: "English",
    perguntas: [
      {
        gif: "profile_form.webp",
        texto: "How long have you trained consistently?",
        opcoes: [
          { texto: "Never or less than 3 months", v: 1 },
          { texto: "Between 3 months and 1 year", v: 2 },
          { texto: "More than 1 year", v: 3 }
        ]
      },
      {
        gif: "routine_cycle.webp",
        texto: "How many days per week can you train?",
        opcoes: [
          { texto: "1 to 2 days", v: 1 },
          { texto: "3 to 4 days", v: 2 },
          { texto: "5 days or more", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "How is your discipline to finish your workouts?",
        opcoes: [
          { texto: "I miss workouts often", v: 1 },
          { texto: "I stay on track most weeks", v: 2 },
          { texto: "I am very disciplined", v: 3 }
        ]
      },
      {
        gif: "mobility_flow.webp",
        texto: "How do you rate your exercise technique?",
        opcoes: [
          { texto: "I still miss many details", v: 1 },
          { texto: "I perform most exercises well", v: 2 },
          { texto: "I have strong control and awareness", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "How is your recovery between workouts?",
        opcoes: [
          { texto: "Slow, with frequent soreness", v: 1 },
          { texto: "It depends on workout intensity", v: 2 },
          { texto: "I recover fast and well", v: 3 }
        ]
      },
      {
        gif: "mobility_flow.webp",
        texto: "Do you feel pain or have any current injury?",
        opcoes: [
          { texto: "Yes, frequent pain or active injury", v: 1 },
          { texto: "Sometimes I feel discomfort", v: 2 },
          { texto: "No pain or limitation", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "How would you describe your strength and endurance today?",
        opcoes: [
          { texto: "Low, I get tired fast", v: 1 },
          { texto: "Moderate, I can sustain training", v: 2 },
          { texto: "High, I handle hard training well", v: 3 }
        ]
      },
      {
        gif: "breath_cycle.webp",
        texto: "How are your sleep and stress levels day to day?",
        opcoes: [
          { texto: "Poor sleep and high stress", v: 1 },
          { texto: "They fluctuate during the week", v: 2 },
          { texto: "Good sleep and controlled mind", v: 3 }
        ]
      }
    ]
  },
  fr: {
    nome: "Francais",
    perguntas: [
      {
        gif: "profile_form.webp",
        texto: "Depuis combien de temps t entraines tu regulierement ?",
        opcoes: [
          { texto: "Jamais ou moins de 3 mois", v: 1 },
          { texto: "Entre 3 mois et 1 an", v: 2 },
          { texto: "Plus de 1 an", v: 3 }
        ]
      },
      {
        gif: "routine_cycle.webp",
        texto: "Combien de jours par semaine peux tu t entrainer ?",
        opcoes: [
          { texto: "1 a 2 jours", v: 1 },
          { texto: "3 a 4 jours", v: 2 },
          { texto: "5 jours ou plus", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "Comment est ta discipline pour terminer tes seances ?",
        opcoes: [
          { texto: "Je manque souvent des seances", v: 1 },
          { texto: "Je tiens bon la plupart des semaines", v: 2 },
          { texto: "Je suis tres discipline", v: 3 }
        ]
      },
      {
        gif: "mobility_flow.webp",
        texto: "Comment evalues tu ta technique sur les exercices ?",
        opcoes: [
          { texto: "Je fais encore beaucoup d erreurs", v: 1 },
          { texto: "J execute bien la plupart des exercices", v: 2 },
          { texto: "J ai un excellent controle corporel", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "Comment est ta recuperation entre les seances ?",
        opcoes: [
          { texto: "Lente, avec douleurs frequentes", v: 1 },
          { texto: "Cela depend de l intensite", v: 2 },
          { texto: "Je recupere vite et bien", v: 3 }
        ]
      },
      {
        gif: "mobility_flow.webp",
        texto: "As tu des douleurs ou une blessure actuellement ?",
        opcoes: [
          { texto: "Oui, douleur frequente ou blessure active", v: 1 },
          { texto: "Parfois une gene", v: 2 },
          { texto: "Aucune douleur ni limitation", v: 3 }
        ]
      },
      {
        gif: "strength_training.webp",
        texto: "Comment decrirais tu ta force et ton endurance aujourd hui ?",
        opcoes: [
          { texto: "Faibles, je fatigue vite", v: 1 },
          { texto: "Moderees, je tiens la seance", v: 2 },
          { texto: "Elevees, je supporte bien le travail intense", v: 3 }
        ]
      },
      {
        gif: "breath_cycle.webp",
        texto: "Comment sont ton sommeil et ton stress au quotidien ?",
        opcoes: [
          { texto: "Mauvais sommeil et stress eleve", v: 1 },
          { texto: "Cela varie pendant la semaine", v: 2 },
          { texto: "Bon sommeil et esprit controle", v: 3 }
        ]
      }
    ]
  }
};