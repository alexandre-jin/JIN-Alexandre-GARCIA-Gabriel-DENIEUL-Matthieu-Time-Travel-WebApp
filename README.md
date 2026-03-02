# JIN-Alexandre-GARCIA-Gabriel-DENIEUL-Matthieu-Time-Travel-WebApp

Webapp moderne et interactive pour une agence de voyages temporels fictive. Le site permet aux visiteurs de découvrir 3 destinations temporelles, d'interagir avec un chatbot IA et de réserver un voyage avec confirmation par email.

Projet réalisé dans le cadre du cursus **Ynov Campus**.

**Site en ligne** : https://effortless-jelly-963633.netlify.app/
**Code source** : https://github.com/alexandre-jin/JIN-Alexandre-GARCIA-Gabriel-DENIEUL-Matthieu-Time-Travel-WebApp/blob/main/README.md



## Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| **HTML5** | Structure de la page |
| **CSS3** | Design futuriste/néon, animations, responsive mobile-first |
| **JavaScript (vanilla)** | Logique applicative, rendu dynamique, API calls |
| **API Groq** (Llama 3.3 70B) | Moteur du chatbot IA (ChronoBot) |
| **EmailJS** | Envoi d'emails de confirmation de réservation |
| **Google Fonts** | Polices Orbitron + Exo 2 |
| **Imgur** | Hébergement des images des destinations |
| **Netlify** | Hébergement et déploiement du site |



## Features implémentées

- **Page d'accueil immersive** : Hero section avec animations CSS (orbes flottantes, grille cyberpunk), présentation de l'agence, boutons CTA
- **Galerie des destinations** : 3 cards interactives avec couleur unique par destination, barre de danger visuelle, icône animée, bouton CTA au hover, modale détaillée au clic
- **Agent conversationnel (ChronoBot)** : Chatbot IA intégré alimenté par l'API Groq (Llama 3.3 70B), conseils personnalisés sur les destinations, personnalité immersive d'agent temporel
- **Formulaire de réservation** : Sélection de destination, nom, email, date, nombre de voyageurs, envoi d'un vrai email de confirmation via EmailJS
- **Témoignages** : Section avec de faux avis de voyageurs temporels, layout en grille responsive
- **Design responsive** : Mobile-first, adapté tablette et desktop
- **Animations au scroll** : Éléments qui apparaissent progressivement (Intersection Observer API)
- **Micro-interactions** : Hover effects avancés sur les cards (bordure gradient néon, zoom image, saturation, CTA glissant), glow pulsant sur le chatbot



## Outils IA utilisés (transparence)

| Outil | Usage |
|-------|-------|
| **Claude (Anthropic)** | Assistance au développement : génération du code HTML/CSS/JS, architecture du projet, debug |
| **API Groq — Llama 3.3 70B** | Modèle IA open source utilisé pour le chatbot ChronoBot intégré dans la webapp (appel API côté client) |



## Instructions d'installation

Aucune installation requise — c'est un site statique (HTML/CSS/JS).

### En local :
```bash
# Cloner le repo
git clone https://github.com/VOTRE-USERNAME/timetravel-agency.git
cd timetravel-agency

# Ouvrir dans le navigateur
open index.html
```

### Configuration requise :
1. **Clé API Groq** (pour le chatbot) : Créer un compte gratuit sur [console.groq.com](https://console.groq.com), générer une clé API, et la coller dans `app.js` à la ligne `GROQ_API_KEY`
2. **EmailJS** (pour les emails de réservation) : Déjà configuré, mais si vous forkez le projet, créez votre propre compte sur [emailjs.com](https://emailjs.com)



## Structure du projet

```
timetravel-agency/
├── index.html      # Structure HTML de la page
├── style.css       # Styles CSS (design néon, animations, responsive)
├── app.js          # Logique JavaScript (destinations, chatbot, réservation, emails)
├── README.md       # Documentation du projet
```



## Crédits

| Ressource | Source |
|-----------|--------|
| **Chatbot IA** | [Groq](https://groq.com) — Llama 3.3 70B (gratuit, open source) |
| **Envoi d'emails** | [EmailJS](https://emailjs.com) (gratuit) |
| **Images destinations** | Hébergées sur [Imgur](https://imgur.com) |
| **Polices** | [Google Fonts](https://fonts.google.com) — Orbitron, Exo 2 |
| **Assistance IA** | [Claude / Anthropic](https://anthropic.com) |
