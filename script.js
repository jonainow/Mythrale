// ======================================================
// MYTHRALE – SCRIPT ENGINE (FULLY UPDATED)
// ======================================================

// ------------------------
// 1) PLAYER DATA
// ------------------------
const player = {
  name: "",
  gender: "",
  courage: 0,
  kindness: 0,
};

let currentSceneId = "choose_character";


// ------------------------
// 2) ALL SCENES
// ------------------------
const scenes = {

  choose_character: {
    id: "choose_character",
    image: "",
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
    text: (name) =>
      `En svak blå glød fyller nattehimmelen over Mythrale. Du står alene på en fjellhylle.`,
    choices: [
      { text: "Gå nærmere portalen.", next: "at_portal", effects: { courage: +1 } },
      { text: "Stå stille og observer lyset.", next: "intro_reflect", effects: { kindness: +1 } }
    ],
  },

  intro_reflect: {
    id: "intro_reflect",
    text: (name) => `${name} står stille og kjenner roen i luften.`,
    choices: [
      { text: "Gå mot portalen.", next: "at_portal", effects: { courage: +1 } }
    ],
  },

  at_portal: {
    id: "at_portal",
    text: () => `Portalen flimrer som om den venter på deg.`,
    choices: [
      { text: "Gå gjennom portalen.", next: "hall", effects: { courage: +1 } }
    ],
  },

  hall: {
    id: "hall",
    text: () =>
      `Du trer inn i en krystallbelyst hall. En elev ber stille om hjelp.`,
    choices: [
      { text: "Hjelp eleven.", next: "help_student", effects: { kindness: +1 } },
      { text: "Gå videre alene.", next: "ignore_student" }
    ],
  },

  help_student: {
    id: "help_student",
    text: (name) => `${name} viser eleven riktig dør.`,
    choices: [{ text: "Fortsett", next: "crystal_choice" }],
  },

  ignore_student: {
    id: "ignore_student",
    text: () => `Hallen føles plutselig kaldere.`,
    choices: [{ text: "Se deg rundt", next: "crystal_choice" }],
  },

  crystal_choice: {
    id: "crystal_choice",
    text: () => `Tre krystaller svever foran deg.`,
    choices: [
      { text: "Blå (empati)", next: "ending_empathy", effects: { kindness: +1 } },
      { text: "Gylden (mot)", next: "ending_courage", effects: { courage: +1 } },
      { text: "Klar (balanse)", next: "ending_balance", effects: { courage: +1, kindness: +1 } },
    ],
  },

  ending_empathy: {
    id: "ending_empathy",
    text: () => `Den blå krystallen fyller deg med ro.`,
    choices: [{ text: "Start på nytt", next: "choose_character" }],
  },

  ending_courage: {
    id: "ending_courage",
    text: () => `Den gylne krystallen pulserer varmt.`,
    choices: [{ text: "Start på nytt", next: "choose_character" }],
  },

  ending_balance: {
    id: "ending_balance",
    text: () => `Den klare krystallen lyser i alle farger.`,
    choices: [{ text: "Start på nytt", next: "choose_character" }],
  },

};


// ---------------------------
// 3) APPLY EFFECTS
// ---------------------------
function applyEffects(effects) {
  if (!effects) return;

  if (effects.gender) player.gender = effects.gender;
  if (typeof effects.courage === "number") player.courage += effects.courage;
  if (typeof effects.kindness === "number") player.kindness += effects.kindness;
}


// ---------------------------
// 4) RENDER SCENE
// ---------------------------
function renderScene() {
  const scene = scenes[currentSceneId];

  // Elements
  const sceneIdEl = document.getElementById("scene-id");
  const sceneDescriptionEl = document.getElementById("scene-description");
  const choicesEl = document.getElementById("choices");
  const courageEl = document.getElementById("courage");
  const kindnessEl = document.getElementById("kindness");
  const sceneImageEl = document.getElementById("scene-image");

  // Scene ID
  sceneIdEl.textContent = "Scene: " + scene.id;

  // Description
  sceneDescriptionEl.textContent =
    typeof scene.text === "function" ? scene.text(player.name) : scene.text;

  // Hide scene image for character select
  if (scene.id === "choose_character") {
    sceneImageEl.style.display = "none";
  } else {
    sceneImageEl.style.display = "block";
  }

  // Stats
  courageEl.textContent = "Courage: " + player.courage;
  kindnessEl.textContent = "Kindness: " + player.kindness;

  // Choices
  choicesEl.innerHTML = "";

  // Character select grid
  if (scene.id === "choose_character") {
    choicesEl.classList.add("character-grid");
  } else {
    choicesEl.classList.remove("character-grid");
  }

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");

    if (scene.id === "choose_character") {
      const isFemale = choice.effects.gender === "female";

      btn.className = "char-card";
      btn.innerHTML = `
        <img class="char-portrait" src="img/${isFemale ? "Select_Character_female.png" : "Select_Character_Male.png"}" />
        <div class="char-main">${choice.text}</div>
        <div class="char-sub">${isFemale ? "Rolig, modig, nysgjerrig." : "Leken, sta eller stille."}</div>
      `;
    } else {
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


// ---------------------------
// 5) START / RESTART
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const nameInput = document.getElementById("player-name");
  const landing = document.getElementById("landing");
  const gameRoot = document.getElementById("game-root");
  const nameDisplay = document.getElementById("player-name-display");

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
// ======================================================
// END OF SCRIPT
// ====================================================== 
