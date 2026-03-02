/* ============================================
   TimeTravel Agency — Application JS
   ============================================ */

// ============ DONNÉES DES DESTINATIONS ============
const DESTINATIONS = [
  {
    id: "paris-1889",
    name: "Paris 1889",
    epoch: "La Belle Époque",
    year: "1889",
    tagline: "L'Exposition Universelle & la naissance de la Tour Eiffel",
    description: "Plongez au cœur de Paris pendant l'Exposition Universelle de 1889. Assistez à l'inauguration de la Tour Eiffel, déambulez sur le Champ-de-Mars parmi les pavillons du monde entier, et vivez l'effervescence d'une époque où tout semblait possible. Rencontrez les plus grands esprits de la Belle Époque dans les cafés de Montmartre.",
    highlights: ["Inauguration de la Tour Eiffel", "Exposition Universelle", "Cafés de Montmartre", "Galerie des Machines"],
    image: "https://i.imgur.com/ZMlqFD3.jpeg",
    heroImage: "https://i.imgur.com/ZMlqFD3.jpeg",
    price: "2 450",
    duration: "3 jours",
    danger: "Faible",
    dangerLevel: 1,
    accentColor: "#00f0ff",
    accentGlow: "rgba(0,240,255,0.3)",
    icon: "🗼"
  },
  {
    id: "cretace",
    name: "Crétacé",
    epoch: "Ère Mésozoïque",
    year: "-68M",
    tagline: "Face aux derniers dinosaures avant l'extinction",
    description: "Voyagez 68 millions d'années dans le passé, au cœur du Crétacé supérieur. Observez les derniers Tyrannosaures Rex dans leur habitat naturel, survolez des forêts primitives peuplées de Ptéranodons, et explorez un monde où la nature règne en maîtresse absolue. Une aventure pour les plus courageux.",
    highlights: ["Observation de T-Rex", "Survol en nacelle protégée", "Forêts primitives", "Volcans actifs"],
    image: "https://i.imgur.com/HULRcQG.jpeg",
    heroImage: "https://i.imgur.com/HULRcQG.jpeg",
    price: "5 800",
    duration: "2 jours",
    danger: "Élevé",
    dangerLevel: 3,
    accentColor: "#ff00e5",
    accentGlow: "rgba(255,0,229,0.3)",
    icon: "🦖"
  },
  {
    id: "florence-1504",
    name: "Florence 1504",
    epoch: "Renaissance Italienne",
    year: "1504",
    tagline: "Dans l'atelier de Léonard de Vinci & Michel-Ange",
    description: "Découvrez Florence à l'apogée de la Renaissance. Visitez l'atelier de Léonard de Vinci, assistez au dévoilement du David de Michel-Ange, et perdez-vous dans les ruelles où Botticelli, Raphaël et Machiavel façonnent le monde moderne. Savourez un banquet chez les Médicis.",
    highlights: ["Atelier de Léonard de Vinci", "Dévoilement du David", "Banquet des Médicis", "Ponte Vecchio médiéval"],
    image: "https://i.imgur.com/bIDyI4x.jpeg",
    heroImage: "https://i.imgur.com/bIDyI4x.jpeg",
    price: "3 200",
    duration: "4 jours",
    danger: "Modéré",
    dangerLevel: 2,
    accentColor: "#b44aff",
    accentGlow: "rgba(180,74,255,0.3)",
    icon: "🎨"
  }
];

// ============ CONFIG CHATBOT ============
const CHATBOT_SYSTEM = `Tu es ChronoBot, l'assistant virtuel de TimeTravel Agency, une agence de voyages temporels fictive. Tu es enthousiaste, mystérieux et un peu dramatique. Tu utilises parfois des emojis.

Nos 3 destinations:
1. Paris 1889 - L'Exposition Universelle, Tour Eiffel, Belle Époque. 3 jours, 2450€. Danger: Faible.
2. Crétacé (-68M d'années) - Dinosaures, T-Rex, forêts primitives. 2 jours, 5800€. Danger: Élevé.
3. Florence 1504 - Renaissance, Léonard de Vinci, Michel-Ange, Médicis. 4 jours, 3200€. Danger: Modéré.

Règles:
- Réponds TOUJOURS en français
- Reste dans le personnage d'un agent de voyage temporel
- Sois concis (max 3-4 phrases)
- Aide les visiteurs à choisir leur destination et réponds à leurs questions
- Tu peux inventer des détails amusants sur les voyages temporels
- Si on te demande des infos hors sujet, ramène la conversation aux voyages temporels avec humour`;

// ⚠️ CLÉ API GROQ (gratuite sur console.groq.com)
const GROQ_API_KEY = "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";

// ============ ÉTAT DE L'APPLICATION ============
let chatMessages = [
  { role: "bot", text: "Bienvenue chez TimeTravel Agency ! 🕰️ Je suis ChronoBot, votre guide temporel. Quelle époque vous attire ? Paris 1889, le Crétacé ou Florence 1504 ?" }
];
let chatLoading = false;
let bookingDone = false;
let selectedBookingDest = "";

// ============ UTILITAIRES ============
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============ DESTINATIONS ============
function renderDestinations() {
  const grid = document.getElementById("dest-grid");
  grid.innerHTML = DESTINATIONS.map((d, i) => `
    <div class="dest-card reveal reveal-delay-${i + 1}" onclick="openModal('${d.id}')" style="--card-accent: ${d.accentColor}; --card-glow: ${d.accentGlow};">
      <div class="dest-card-img-wrap">
        <img class="dest-card-img" src="${d.image}" alt="${d.name}" loading="lazy" />
        <span class="dest-card-year">${d.year}</span>
        <span class="dest-card-icon">${d.icon}</span>
      </div>
      <div class="dest-card-body">
        <div class="dest-card-epoch" style="color: ${d.accentColor}; text-shadow: 0 0 8px ${d.accentGlow};">${d.epoch}</div>
        <h3 class="dest-card-name">${d.name}</h3>
        <p class="dest-card-tagline">${d.tagline}</p>
        <div class="dest-card-danger">
          <span class="danger-label">Danger</span>
          <div class="danger-bar">
            <div class="danger-fill" style="width: ${d.dangerLevel * 33.3}%; background: ${d.dangerLevel === 1 ? '#00ff9d' : d.dangerLevel === 2 ? '#ffaa00' : '#ff3366'};"></div>
          </div>
          <span class="danger-text">${d.danger}</span>
        </div>
        <div class="dest-card-footer">
          <div class="dest-card-detail"><span>📅</span> ${d.duration}</div>
          <div class="dest-card-price" style="color: ${d.accentColor}; text-shadow: 0 0 8px ${d.accentGlow};">${d.price}€</div>
        </div>
        <div class="dest-card-cta" style="background: ${d.accentColor}; box-shadow: 0 0 15px ${d.accentGlow};">
          Explorer cette époque →
        </div>
      </div>
    </div>
  `).join("");
  initScrollReveal();
}

// ============ MODAL ============
function openModal(id) {
  const d = DESTINATIONS.find(x => x.id === id);
  if (!d) return;
  const modal = document.getElementById("modal-content");
  modal.innerHTML = `
    <div class="modal-hero">
      <img src="${d.heroImage}" alt="${d.name}" />
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-epoch">${d.epoch}</div>
      <h2 class="modal-title">${d.name}</h2>
      <p class="modal-desc">${d.description}</p>
      <div class="modal-info-row">
        <div class="modal-info-item">
          <div class="modal-info-label">Durée</div>
          <div class="modal-info-value">${d.duration}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Prix</div>
          <div class="modal-info-value" style="color:var(--gold)">${d.price}€</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Danger</div>
          <div class="modal-info-value">${d.danger}</div>
        </div>
      </div>
      <div class="highlights-label">Points forts</div>
      <div class="modal-highlights">
        ${d.highlights.map(h => `<div class="modal-highlight">⭐ ${h}</div>`).join("")}
      </div>
      <a href="#booking" class="btn-primary" style="width:100%;justify-content:center;text-align:center" onclick="selectDestAndClose('${d.id}')">
        Réserver ce voyage →
      </a>
    </div>
  `;
  document.getElementById("modal-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

function selectDestAndClose(id) {
  selectedBookingDest = id;
  closeModal();
  renderBooking();
}

// ============ RÉSERVATION & EMAIL ============
function renderBooking() {
  const area = document.getElementById("booking-area");
  if (bookingDone) {
    const dest = DESTINATIONS.find(d => d.id === selectedBookingDest);
    area.innerHTML = `
      <div class="booking-success">
        <div style="font-size:3rem;margin-bottom:0.5rem">🕰️</div>
        <h3>Votre voyage vers ${dest ? dest.name : "l'inconnu"} est réservé !</h3>
        <p style="color:var(--text-muted);margin-top:0.5rem">
          📧 Un email de confirmation a été envoyé à votre adresse.
        </p>
        <button class="btn-secondary" style="margin-top:1rem" onclick="resetBooking()">Nouvelle réservation</button>
      </div>
    `;
    return;
  }
  area.innerHTML = `
    <div class="booking-form">
      <div class="form-group">
        <label class="form-label">Destination</label>
        <select class="form-select" id="book-dest">
          <option value="">Choisir une époque...</option>
          ${DESTINATIONS.map(d => `<option value="${d.id}" ${selectedBookingDest === d.id ? 'selected' : ''}>${d.name} — ${d.price}€</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nom complet</label>
        <input class="form-input" type="text" placeholder="Votre nom" id="book-name" />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" placeholder="votre@email.com" id="book-email" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date de départ</label>
          <input class="form-input" type="date" id="book-date" />
        </div>
        <div class="form-group">
          <label class="form-label">Voyageurs</label>
          <select class="form-select" id="book-travelers">
            <option value="1">1 voyageur</option>
            <option value="2">2 voyageurs</option>
            <option value="3">3 voyageurs</option>
            <option value="4">4 voyageurs</option>
          </select>
        </div>
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center" onclick="submitBooking()">
        Confirmer la réservation →
      </button>
    </div>
  `;
}

function submitBooking() {
  const dest = document.getElementById("book-dest").value;
  const name = document.getElementById("book-name").value;
  const email = document.getElementById("book-email").value;
  const date = document.getElementById("book-date").value;
  const travelers = document.getElementById("book-travelers").value;
  if (!dest || !name || !email || !date) return;

  const destInfo = DESTINATIONS.find(d => d.id === dest);
  selectedBookingDest = dest;

  // Désactiver le bouton pendant l'envoi
  const btn = document.querySelector(".booking-form .btn-primary");
  if (btn) { btn.textContent = "Envoi en cours..."; btn.disabled = true; }

  emailjs.send("service_q2qbscn", "template_qk3pcks", {
    to_name: name,
    email: email,
    name: name,
    title: "Confirmation de voyage — " + (destInfo ? destInfo.name : dest),
    destination: destInfo ? destInfo.name : dest,
    date: date,
    travelers: travelers + " voyageur" + (parseInt(travelers) > 1 ? "s" : ""),
    price: destInfo ? destInfo.price + "€" : "N/A"
  }).then(function() {
    bookingDone = true;
    renderBooking();
  }).catch(function(err) {
    console.error("EmailJS error:", err);
    bookingDone = true;
    renderBooking();
  });
}

function resetBooking() {
  bookingDone = false;
  selectedBookingDest = "";
  renderBooking();
}

// ============ CHATBOT ============
function renderChat() {
  const container = document.getElementById("chat-messages");
  container.innerHTML = chatMessages.map(m => `
    <div class="chat-msg ${m.role === 'bot' ? 'chat-msg-bot' : 'chat-msg-user'}">${escapeHtml(m.text)}</div>
  `).join("") + (chatLoading ? `
    <div class="chat-msg chat-msg-bot chat-msg-typing">
      <span></span><span></span><span></span>
    </div>
  ` : "");
  container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg || chatLoading) return;

  // Vérifier que la clé API a été configurée
  if (GROQ_API_KEY === "COLLE_TA_CLE_GROQ_ICI") {
    chatMessages.push({ role: "user", text: msg });
    chatMessages.push({ role: "bot", text: "⚠️ La clé API Groq n'est pas encore configurée. Ouvre le fichier app.js et remplace COLLE_TA_CLE_GROQ_ICI par ta clé API Groq (gratuite sur console.groq.com)." });
    input.value = "";
    renderChat();
    return;
  }

  input.value = "";
  chatMessages.push({ role: "user", text: msg });
  chatLoading = true;
  renderChat();

  try {
    const history = chatMessages.map(m => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text
    }));
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: CHATBOT_SYSTEM },
          ...history
        ],
        max_tokens: 500,
        temperature: 0.8
      })
    });
    const data = await response.json();
    const botText = data.choices?.[0]?.message?.content || "Hmm, perturbation temporelle... Réessayez ! 🌀";
    chatMessages.push({ role: "bot", text: botText });
  } catch (err) {
    chatMessages.push({ role: "bot", text: "Oups, une anomalie temporelle ! 🌀 Réessayez dans un instant." });
  }
  chatLoading = false;
  renderChat();
}

function openChat() {
  document.getElementById("chat-panel").classList.remove("hidden");
  document.getElementById("chat-toggle").classList.add("hidden");
  renderChat();
}

function closeChat() {
  document.getElementById("chat-panel").classList.add("hidden");
  document.getElementById("chat-toggle").classList.remove("hidden");
}

// ============ ÉVÉNEMENTS ============
document.getElementById("modal-overlay").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});
document.getElementById("chat-toggle").addEventListener("click", openChat);
document.getElementById("chat-close").addEventListener("click", closeChat);
document.getElementById("chat-send").addEventListener("click", sendChatMessage);
document.getElementById("chat-input").addEventListener("keydown", e => {
  if (e.key === "Enter") sendChatMessage();
});
document.getElementById("hero-chat-btn").addEventListener("click", openChat);
document.getElementById("nav-chat-btn").addEventListener("click", e => { e.preventDefault(); openChat(); });

// Navbar scroll effect
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
});

// ============ TÉMOIGNAGES ============
const TESTIMONIALS = [
  {
    name: "Marie Dupont",
    dest: "Paris 1889",
    avatar: "👩‍🔬",
    rating: 5,
    text: "J'ai serré la main de Gustave Eiffel en personne ! Le guide chrononaute était impeccable, et la vue depuis le premier étage de la Tour… irréelle. Littéralement, puisqu'elle venait d'être construite.",
    date: "Retour le 12 mars 2025"
  },
  {
    name: "Lucas Bertrand",
    dest: "Crétacé",
    avatar: "🧑‍🚀",
    rating: 5,
    text: "Je ne pensais pas avoir aussi peur de ma vie. Le T-Rex était à 50 mètres de notre nacelle. Mon cœur battait à 200 bpm. 10/10, je recommande à tous les amateurs de sensations fortes.",
    date: "Retour le 28 février 2025"
  },
  {
    name: "Sofia Rossi",
    dest: "Florence 1504",
    avatar: "👩‍🎨",
    rating: 5,
    text: "Voir Michel-Ange travailler sur le David en vrai… j'en ai pleuré. Le banquet chez les Médicis était incroyable, même si j'ai failli créer un paradoxe en renversant du vin sur Machiavel.",
    date: "Retour le 5 mars 2025"
  },
  {
    name: "Thomas Chen",
    dest: "Paris 1889",
    avatar: "🧑‍💼",
    rating: 4,
    text: "L'Exposition Universelle est un spectacle à couper le souffle. Seul bémol : la combinaison temporelle gratte un peu. Mais l'expérience vaut chaque centime des 2 450€.",
    date: "Retour le 20 février 2025"
  }
];

function renderTestimonials() {
  const container = document.getElementById("testimonials-grid");
  container.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testimonial-card reveal reveal-delay-${(i % 3) + 1}">
      <div class="testimonial-header">
        <div class="testimonial-avatar">${t.avatar}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-dest">${t.dest}</div>
        </div>
        <div class="testimonial-rating">${'⭐'.repeat(t.rating)}</div>
      </div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-date">${t.date}</div>
    </div>
  `).join("");
}

// ============ SCROLL REVEAL ============
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// ============ INITIALISATION ============
renderDestinations();
renderTestimonials();
renderBooking();
renderChat();
initScrollReveal();
