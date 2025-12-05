// ======================================================
// MYTHRALE — GAME ENGINE WITH PORTRAIT + FADE + MUSIC
// ======================================================

// ------------------------
// PLAYER DATA
// ------------------------
const player = {
  name: "",
  gender: "",      // "female" eller "male"
  courage: 0,
  kindness: 0,
};

let currentSceneId = "choose_character";

// ------------------------
// SCENES
// ------------------------
// NB: Du kan legge til "portrait: 'img/annet_bilde.png'"
// på en scene hvis du vil bruke et annet bilde der.
const scenes = {

  // Først: velg karakter
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
    text: (name) => `${name} tar sitt første steg inn i Mythrale. Nattehimmelen gløder svakt over fjellene.`,
    choices: [
      { text: "Gå nærmere portalen", next: "portal", effects: { courage: +1 } },
      { text: "Stå stille og observer lyset", next: "intro_reflect", effects: { kindness: +1 } }
    ],
  },

  intro_reflect: {
    id: "intro_reflect",
    text: (name) => `${name} lar tankene vandre mens lyset danser som stille nordlys.`,
    choices: [
      { text: "Gå mot portalen", next: "portal", effects: { courage: +1 } }
    ]
  },

  portal: {
    id: "portal",
    text: () => `Portalen flimrer svakt, som om den venter på deg.`,
    choices: [
      { text: "Gå inn", next: "hall", effects: { courage: +1 } }
    ]
  },

  hall: {
    id: "hall",
    text: () => `En yngre elev står alene ved en søyle. "Unnskyld… kan du hjelpe meg?"`,
    choices: [
      { text: "Hjelp henne", next: "help", effects: { kindness: +1 } },
      { text: "Gå videre", next: "ignore" }
    ]
  },

  help: {
    id: "help",
    text: () => `Hun smiler varmt. "Takk! Jeg håper vi møtes igjen," sier hun stille.`,
    choices: [
      { text: "Fortsett", next: "crystals" }
    ]
  },

  ignore: {
    id: "ignore",
    text: () => `Du går videre. Hallen føles plutselig litt kaldere.`,
    choices: [
      { text: "Fortsett", next: "crystals" }
    ]
  },

  crystals: {
    id: "crystals",
    text: () => `Tre krystaller svever foran deg. Hvilken tiltrekker deg mest?`,
    choices: [
      { text: "Blå (empati)",  next: "end_emp",  effects: { kindness: +1 } },
      { text: "Gylden (mot)",  next: "end_cour", effects: { courage: +1 } },
      { text: "Klar (balanse)", next: "end_bal", effects: { courage: +1, kindness: +1 } },
    ]
  },

  end_emp: {
    id: "end_emp",
    text: () => `Den blå krystallen fyller deg med ro. Du forstår at styrken din ligger i hvordan du møter andre.`,
    choices: [
      { text: "Start på nytt", next: "choose_character" }
    ]
  },

  end_cour: {
    id: "end_cour",
    text: () => `Den gylne krystallen pulserer som et hjerte. Mot betyr ikke å være uten frykt, men å gå videre likevel.`,
    choices: [
      { text: "Start på nytt", next: "choose_character" }
    ]
  },

  end_bal: {
    id: "end_bal",
    text: () => `Den klare krystallen speiler både lys og skygge. Du trenger ikke velge én side for alltid.`,
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
// PORTRETT-LOGIKK
// ------------------------
function getPortraitForScene(scene) {
  // Hvis scenen har sitt eget bilde, bruk det:
  if (scene.portrait) {
    return scene.portrait;
  }

  // Ellers standard basert på kjønn:
  if (player.gender === "female") {
    return "img/Select_Character_female.png";
  } else if (player.gender === "male") {
    return "img/Select_Character_Male.png";
  }

  // Hvis ingen kjønn er valgt (f.eks. før start) → ikke vis noe
  return "";
}

// ------------------------
// RENDER SCENE
// ------------------------
function renderScene() {
  const scene = scenes[currentSceneId];

  const sceneIdEl = document.getElementById("scene-id");
  const sceneDescriptionEl = document.getElementById("scene-description");
  const courageEl = document.getElementById("courage");
  const kindnessEl = document.getElementById("kindness");
  const choicesEl = document.getElementById("choices");
  const portraitEl = document.getElementById("portrait-image");

  sceneIdEl.textContent = "Scene: " + scene.id;

  const text = typeof scene.text === "function"
    ? scene.text(player.name)
    : scene.text;

  // Fade inn tekst
  sceneDescriptionEl.classList.remove("dialogue-fade");
  void sceneDescriptionEl.offsetWidth; // tving reflow
  sceneDescriptionEl.textContent = text;
  sceneDescriptionEl.classList.add("dialogue-fade");

  // Stats
  courageEl.textContent = "Courage: " + player.courage;
  kindnessEl.textContent = "Kindness: " + player.kindness;

  // Portrett
  if (scene.id === "choose_character") {
    // Ingen portrett før man har valgt
    portraitEl.style.opacity = 0;
  } else {
    const portraitSrc = getPortraitForScene(scene);
    if (portraitSrc) {
      portraitEl.src = portraitSrc;
      portraitEl.style.opacity = 1;
    } else {
      portraitEl.style.opacity = 0;
    }
  }

  // Choices
  choicesEl.innerHTML = "";

  // Character select: vis egne kort
  if (scene.id === "choose_character") {
    choicesEl.classList.add("character-grid");

    scene.choices.forEach(choice => {
      const card = document.createElement("div");
      card.className = "char-card";

      const isFemale = choice.effects.gender === "female";

      card.innerHTML = `
        <img class="char-portrait" src="img/${isFemale ? "Select_Character_female.png" : "Select_Character_Male.png"}" />
        <div class="char-main">${choice.text}</div>
        <div class="char-sub">
          ${isFemale ? "Rolig, nysgjerrig, skarp." : "Leken, sta eller stille – du velger."}
        </div>
      `;

      card.addEventListener("click", () => {
        applyEffects(choice.effects);
        fadeScene(() => {
          currentSceneId = choice.next;
          renderScene();
        });
      });

      choicesEl.appendChild(card);
    });

    return;
  }

  // Vanlige valg
  choicesEl.classList.remove("character-grid");

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

    choicesEl.appendChild(btn);
  });
}

// ------------------------
// FADE MELLOM SCENER
// ------------------------
function fadeScene(callback) {
  const panel = document.querySelector(".hero-panel");
  panel.classList.add("fade-box-out");

  setTimeout(() => {
    callback();
    panel.classList.remove("fade-box-out");
    panel.classList.add("fade-box");
  }, 250);
}

// liten stil for fade-out
const fadeOutStyle = document.createElement("style");
fadeOutStyle.innerHTML = `
.fade-box-out {
  opacity: 0;
  transform: translateY(12px);
  transition: 0.25s ease;
}

.dialogue-fade {
  opacity: 1;
  transition: opacity 0.25s ease;
}
`;
document.head.appendChild(fadeOutStyle);

// ------------------------
// MUSIKK-KONTROLL
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
    player.name = document.getElementById("player-name").value.trim() || "Reisende";
    document.getElementById("player-name-display").textContent = player.name;

    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game-root").classList.remove("hidden");

    currentSceneId = "choose_character";
    player.courage = 0;
    player.kindness = 0;
    player.gender = "";

    renderScene();
  });

  restartBtn.addEventListener("click", () => {
    currentSceneId = "choose_character";
    player.courage = 0;
    player.kindness = 0;
    player.gender = "";
    renderScene();
  });
});
