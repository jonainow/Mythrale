// ======================================================
// MYTHRALE – HISTORIEMOTOR MED KARAKTERVALG
// ======================================================

// ------------------------
// 1) SPILLERDATA
// ------------------------
const player = {
  name: "",
  gender: "",
  courage: 0,
  kindness: 0,
};

let currentSceneId = "choose_character";


// ------------------------
// 2) SCENER
// ------------------------
const scenes = {

  // --------------------------------------------------
  // KARAKTERVALG
  // --------------------------------------------------
  choose_character: {
    id: "choose_character",
    image: "",
    text: (name) =>
      `${name}, før reisen begynner må du velge hvem du vil være i Mythrale.`,

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
      }
    ],
  },

  // --------------------------------------------------
  // HISTORIE STARTER HER
  // --------------------------------------------------
  intro: {
    id: "intro",
    image: "",
    text: (name) =>
      `En svak blå glød fyller nattehimmelen over Mythrale. Du står alene på kanten av en fjellhylle og puster dypt inn.`,
    choices: [
      {
        text: "Gå nærmere portalen.",
        next: "at_portal",
        effects: { courage: +1 },
      },
      {
        text: "Stå stille og observer lyset.",
        next: "intro_reflect",
        effects: { kindness: +1 },
      },
    ],
  },

  intro_reflect: {
    id: "intro_reflect",
    image: "",
    text: (name) =>
      `${name} står stille og kjenner at noe i luften roer seg. Lyset danser som nordlys.`,
    choices: [
      {
        text: "Gå mot portalen.",
        next: "at_portal",
        effects: { courage: +1 },
      },
    ],
  },

  at_portal: {
    id: "at_portal",
    image: "",
    text: (name) =>
      `Portalen flimrer svakt som om den venter på deg.`,
    choices: [
      {
        text: "Gå gjennom portalen.",
        next: "hall",
        effects: { courage: +1 },
      }
    ],
  },

  hall: {
    id: "hall",
    image: "",
    text: (name) =>
      `Du trer inn i en stor hall badet i krystallskinn. En yngre elev ser opp på deg: "Unnskyld... kan du hjelpe meg?"`,
    choices: [
      {
        text: "Hjelp eleven.",
        next: "help_student",
        effects: { kindness: +1 },
      },
      {
        text: "Gå videre alene.",
        next: "ignore_student",
      }
    ],
  },

  help_student: {
    id: "help_student",
    text: (name) => `${name} viser eleven riktig dør, og hun smiler takknemlig.`,
    choices: [
      { text: "Fortsett", next: "crystal_choice" },
    ],
  },

  ignore_student: {
    id: "ignore_student",
    text: () => `Du går videre, men hallen føles plutselig kaldere.`,
    choices: [
      { text: "Se deg rundt", next: "crystal_choice" },
    ],
  },

  crystal_choice: {
    id: "crystal_choice",
    text: () => `Tre krystaller svever foran deg. Hvilken velger du?`,
    choices: [
      {
        text: "Blå (Empati)",
        next: "ending_empathy",
        effects: { kindness: +1 },
      },
      {
        text: "Gylden (Mot)",
        next: "ending_courage",
        effects: { courage: +1 },
      },
      {
        text: "Klar (Balanse)",
        next: "ending_balance",
        effects: { courage: +1, kindness: +1 },
      },
    ],
  },

  ending_empathy: {
    id: "ending_empathy",
    text: () => `Den blå krystallen fyller deg med ro og styrke.`,
    choices: [{ text: "Spill på nytt", next: "choose_character" }],
  },

  ending_courage: {
    id: "ending_courage",
    text: () => `Den gylne krystallen pulserer som et hjerte.`,
    choices: [{ text: "Spill på nytt", next: "choose_character" }],
  },

  ending_balance: {
    id: "ending_balance",
    text: () => `Den klare krystallen gløder i alle farger samtidig.`,
    choices: [{ text: "Spill på nytt", next: "choose_character" }],
  },
};


// ------------------------
// 3) APPLY EFFECTS
// ------------------------
function applyEffects(effects) {
  if (!effects) return;

  if (effects.gender) player.gender = effects.gender;
  if (typeof effects.courage === "number") player.courage += effects.courage;
  if (typeof effects.kindness === "number") player.kindness += effects.kindness;
}


// ------------------------
// 4) RENDER SCENE
// ------------------------
function renderScene() {
  const scene = scenes[currentSceneId];

  const sceneIdEl = document.getElementById("scene-id");
  const sceneDescriptionEl = document.getElementById("scene-description");
  const choicesEl = document.getElementById("choices");
  const sceneImageEl = document.getElementById("scene-image");
  const courageEl = document.getElementById("courage");
  const kindnessEl = document.getElementById("kindness");

  // ID
  if (sceneIdEl) sceneIdEl.textContent = "Scene: " + scene.id;

  // Tekst
  sceneDescriptionEl.textContent =
    typeof scene.text === "function"
      ? scene.text(player.name)
      : scene.text;

  // Bilde (vi bruker det senere)
  if (scene.image) {
    sceneImageEl.src = scene.image;
    sceneImageEl.style.opacity = "1";
  } else {
    sceneImageEl.style.opacity = "0";
  }

  // Stats
  courageEl.textContent = "Courage: " + player.courage;
  kindnessEl.textContent = "Kindness: " + player.kindness;

  // VALG
  choicesEl.innerHTML = "";

  // Hvis dette er karaktervalg → bruk portrettbilder
  if (scene.id === "choose_character") {
    choicesEl.classList.add("character-grid");
  } else {
    choicesEl.classList.remove("character-grid");
  }

  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");

    // CHARACTER SELECT
    if (scene.id === "choose_character") {
      const isFemale = choice.effects.gender === "female";

      btn.className = "char-card";
      btn.innerHTML = `
        <img class="char-portrait" src="img/${isFemale ? "Select_Character_female.png" : "Select_Character_Male.png"}" />
        <div class="char-main">${choice.text}</div>
        <div class="char-sub">${isFemale ? "Rolig, modig, nysgjerrig." : "Leken, sta eller stille."}</div>
      `;
    } else {
      // VANLIGE VALG
      btn.className = "choice-btn";
      btn.textContent = choice.text;
    }

    btn.addEventListener("click", () => {
      applyEffects(choice.effects);
      currentSceneId = choice.next;
      renderScene();
    });

    choicesEl.appendChild(btn);
  });
}


// ------------------------
// 5) START OG RESTART
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-btn");
  const nameInput = document.getElementById("player-name");
  const landing = document.getElementById("landing");
  const gameRoot = document.getElementById("game-root");
  const nameDisplay = document.getElementById("player-name-display");
  const restartBtn = document.getElementById("restart-btn");

  function startGame() {
    player.name = nameInput.value.trim() || "Reisende";
    player.gender = "";
    player.courage = 0;
    player.kindness = 0;

    currentSceneId = "choose_character";

    landing.classList.add("hidden");
    gameRoot.classList.remove("hidden");

    nameDisplay.textContent = player.name;

    renderScene();
  }

  startButton.addEventListener("click", startGame);

  restartBtn.addEventListener("click", () => {
    currentSceneId = "choose_character";
    player.courage = 0;
    player.kindness = 0;
    renderScene();
  });
});
