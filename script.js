// ======================================================
// MYTHRALE — COMPLETE GAME ENGINE WITH FADE + MUSIC
// ======================================================

// ------------------------
// PLAYER DATA
// ------------------------
const player = {
  name: "",
  gender: "",
  courage: 0,
  kindness: 0,
};

let currentSceneId = "choose_character";

// ------------------------
// SCENES
// ------------------------
const scenes = {

  choose_character: {
    id: "choose_character",
    text: (name) => `${name}, før reisen begynner må du velge hvem du vil være.`,
    choices: [
      {
        text: "Jente",
        next: "intro",
        effects: { gender: "female" },
      },
      {
        text: "Gutt",
        next: "intro",
        effects: { gender: "male" },
      },
    ],
  },

  intro: {
    id: "intro",
    text: (name) => `${name} tar sitt første steg inn i Mythrale…`,
    choices: [
      { text: "Gå nærmere portalen", next: "portal", effects: { courage: +1 } },
      { text: "Observer lyset", next: "intro_reflect", effects: { kindness: +1 } }
    ],
  },

  intro_reflect: {
    id: "intro_reflect",
    text: (name) => `${name} lar tankene vandre mens portalen pulserer svakt.`,
    choices: [
      { text: "Gå mot portalen", next: "portal", effects: { courage: +1 } }
    ]
  },

  portal: {
    id: "portal",
    text: () => `Portalen venter. En svak dirring fyller luften.`,
    choices: [
      { text: "Gå inn", next: "hall", effects: { courage: +1 } }
    ]
  },

  hall: {
    id: "hall",
    text: () => `En elev vinker forsiktig — "Unnskyld… kan du hjelpe meg?"`,
    choices: [
      { text: "Hjelp henne", next: "help", effects: { kindness: +1 } },
      { text: "Gå videre", next: "ignore" }
    ]
  },

  help: {
    id: "help",
    text: () => `Hun smiler varmt — "Takk! Jeg håper vi møtes igjen."`,
    choices: [
      { text: "Fortsett", next: "crystals" }
    ]
  },

  ignore: {
    id: "ignore",
    text: () => `Hallen blir kaldere rundt deg…`,
    choices: [
      { text: "Fortsett", next: "crystals" }
    ]
  },

  crystals: {
    id: "crystals",
    text: () => `Tre krystaller svever foran deg — hvilken velger du?`,
    choices: [
      { text: "Blå (empati)", next: "end_emp", effects: { kindness: +1 } },
      { text: "Gylden (mot)", next: "end_cour", effects: { courage: +1 } },
      { text: "Klar (balanse)", next: "end_bal", effects: { kindness: +1, courage: +1 } }
    ]
  },

  end_emp: {
    id: "end_emp",
    text: () => `Den blå krystallen fyller deg med ro og varme.`,
    choices: [
      { text: "Start på nytt", next: "choose_character" }
    ]
  },

  end_cour: {
    id: "end_cour",
    text: () => `Den gylne krystallen pulserer som et hjerte.`,
    choices: [
      { text: "Start på nytt", next: "choose_character" }
    ]
  },

  end_bal: {
    id: "end_bal",
    text: () => `Den klare krystallen vibrerer — balanse er din styrke.`,
    choices: [
      { text: "Start på nytt", next: "choose_character" }
    ]
  },

};

// ------------------------
// APPLY EFFECTS
// ------------------------
function applyEffects(effects) {
  if (!effects) return;
  if (effects.gender) player.gender = effects.gender;
  if (typeof effects.courage === "number") player.courage += effects.courage;
  if (typeof effects.kindness === "number") player.kindness += effects.kindness;
}

// ------------------------
// RENDER SCENE
// ------------------------
function renderScene() {
  const scene = scenes[currentSceneId];

  document.getElementById("scene-id").textContent = "Scene: " + scene.id;
  document.getElementById("scene-description").textContent =
    typeof scene.text === "function" ? scene.text(player.name) : scene.text;

  document.getElementById("courage").textContent = "Courage: " + player.courage;
  document.getElementById("kindness").textContent = "Kindness: " + player.kindness;

  const choicesBox = document.getElementById("choices");
  choicesBox.innerHTML = "";

  // Character select? → Render portraits
  if (scene.id === "choose_character") {
    choicesBox.classList.add("character-grid");

    scene.choices.forEach(choice => {
      const card = document.createElement("div");
      card.className = "char-card";

      const isFemale = choice.effects.gender === "female";

      card.innerHTML = `
        <img class="char-portrait" src="img/${isFemale ? "Select_Character_female.png" : "Select_Character_Male.png"}" />
        <div class="char-main">${choice.text}</div>
        <div class="char-sub">${isFemale ? "Rolig og modig." : "Stille eller sterk."}</div>
      `;

      card.addEventListener("click", () => {
        applyEffects(choice.effects);
        fadeScene(() => {
          currentSceneId = choice.next;
          renderScene();
        });
      });

      choicesBox.appendChild(card);
    });

    return;
  }

  // Normal choices
  choicesBox.classList.remove("character-grid");

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;

    btn.addEventListener("click", () => {
      applyEffects(choice.effects);
      fadeScene(() => {
        currentSceneId = choice.next;
        renderScene();
      });
    });

    choicesBox.appendChild(btn);
  });
}

// ------------------------
// FADE TRANSITION
// ------------------------
function fadeScene(callback) {
  const panel = document.querySelector(".hero-panel");
  panel.classList.add("fade-box-out");

  setTimeout(() => {
    callback();
    panel.classList.remove("fade-box-out");
    panel.classList.add("fade-box");
  }, 300);
}

/* Fade-out style */
const fadeOutStyle = document.createElement("style");
fadeOutStyle.innerHTML = `
.fade-box-out {
  opacity: 0;
  transform: translateY(15px);
  transition: 0.3s ease;
}
`;
document.head.appendChild(fadeOutStyle);

// ------------------------
// MUSIC CONTROL
// ------------------------
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");

musicBtn.classList.remove("hidden");
musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "🔊 Musikk av/på";
  } else {
    music.pause();
    musicBtn.textContent = "🔇 Musikk av/på";
  }
});

// ------------------------
// START / RESTART
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");

  startBtn.addEventListener("click", () => {
    player.name = document.getElementById("player-name").value || "Reisende";
    document.getElementById("player-name-display").textContent = player.name;

    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game-root").classList.remove("hidden");

    renderScene();
  });

  restartBtn.addEventListener("click", () => {
    currentSceneId = "choose_character";
    player.courage = 0;
    player.kindness = 0;
    renderScene();
  });
});
