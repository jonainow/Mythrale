// En enkel "engine" for Mythrale-historien

// ---------------- SPILLERDATA ----------------
const player = {
  name: "",
  courage: 0,
  kindness: 0,
};

let currentSceneId = "intro";

// ---------------- SCENER ----------------
const scenes = {
  intro: {
    id: "intro",
    image: "", // legg til f.eks. "img/portal.jpg" senere
    text: (name) =>
      `En svak blå glød fyller nattehimmelen over Mythrale. Du står alene på kanten av en fjellhylle, med vinden som suser forbi. 
${name ? name + "," : "Du"} har ventet på dette øyeblikket lenge – i kveld åpner portalen til Akademiet for Lys og Skygger.`,
    choices: [
      {
        text: "Gå nærmere portalen.",
        next: "at_portal",
        effects: { courage: +1 },
      },
      {
        text: "Stå stille et øyeblikk og bare se på lyset.",
        next: "intro_reflect",
        effects: { kindness: +1 },
      },
    ],
  },

  intro_reflect: {
    id: "intro_reflect",
    image: "",
    text: (name) =>
      `Du blir stående og se, og kjenner at noe i deg roer seg. Lyset danser som nordlys, men dypere, nesten som om fjellet selv puster. 
${name ? name : "Du"} tenker på alle som har gått her før deg – og på hvem du vil være når du går gjennom porten.`,
    choices: [
      {
        text: "Samle motet ditt og gå mot portalen.",
        next: "at_portal",
        effects: { courage: +1 },
      },
    ],
  },

  at_portal: {
    id: "at_portal",
    image: "",
    text: (name) =>
      `Portalen er nærmere enn du trodde. Den er ikke en dør, men en sirkel av lys som henger i luften. 
Når ${name ? name : "du"} løfter hånden, flimrer lyset svakt – som om det venter på ditt valg.`,
    choices: [
      {
        text: "Gå rett gjennom portalen uten å nøle.",
        next: "hall",
        effects: { courage: +1 },
      },
      {
        text: "Puste dypt og hviske et stille løfte om å hjelpe andre.",
        next: "hall",
        effects: { kindness: +1 },
      },
    ],
  },

  hall: {
    id: "hall",
    image: "",
    text: (name) =>
      `Du trer inn i en stor hall opplyst av svevende krystaller. Elever i ulike kapper går i små grupper. 
En svak stemme bak deg sier: "Eh... unnskyld, jeg tror jeg har gått meg bort." 
En yngre elev ser opp på ${name ? name : "deg"} med store øyne.`,
    choices: [
      {
        text: "Hjelp eleven å finne veien.",
        next: "help_student",
        effects: { kindness: +1 },
      },
      {
        text: "Du er usikker selv – later som du ikke hører og går videre.",
        next: "ignore_student",
        effects: { courage: 0 },
      },
    ],
  },

  help_student: {
    id: "help_student",
    image: "",
    text: (name) =>
      `Du smiler og spør hvor eleven skal. Sammen finner dere en liten dør med et symbol som matcher armbåndet hennes. 
"Tak– takk," sier hun stille. "Jeg håper vi møtes igjen." ${name ? name : "Du"} kjenner en varm følelse i brystet.`,
    choices: [
      {
        text: "Fortsett innover i hallen.",
        next: "crystal_choice",
        effects: { kindness: +1 },
      },
    ],
  },

  ignore_student: {
    id: "ignore_student",
    image: "",
    text: (name) =>
      `${name ? name : "Du"} går videre, men det gnager litt i magen. Stemmer fyller hallen, men lyden føles plutselig fjern. 
I taket over deg flimrer en av krystallene svakt.`,
    choices: [
      {
        text: "Se opp på krystallen og stoppe.",
        next: "crystal_choice",
        effects: { courage: 0 },
      },
    ],
  },

  crystal_choice: {
    id: "crystal_choice",
    image: "",
    text: (name) =>
      `Midt i hallen svever tre krystaller i sakte sirkel. En med mykt blått lys, en med gyllent skjær, og en som nesten er helt gjennomsiktig. 
En stemme fyller hallen: "Velkommen til Mythrale. Velg den stien som passer ditt hjerte."`,
    choices: [
      {
        text: "Rør ved den blå krystallen (empati og ro).",
        next: "ending_empathy",
        effects: { kindness: +1 },
      },
      {
        text: "Rør ved den gylne krystallen (mot og handling).",
        next: "ending_courage",
        effects: { courage: +1 },
      },
      {
        text: "Rør ved den klare krystallen (balanse og nysgjerrighet).",
        next: "ending_balance",
        effects: { courage: +1, kindness: +1 },
      },
    ],
  },

  ending_empathy: {
    id: "ending_empathy",
    image: "",
    text: (name) =>
      `Den blå krystallen blir varm under fingrene dine. Bilder flimrer forbi – mennesker som ler, gråter, deler hemmeligheter. 
${name ? name : "Du"} kjenner at styrken din ikke først og fremst handler om hva du gjør, men hvordan du er for andre.`,
    choices: [
      {
        text: "Slutt – spill på nytt?",
        next: "intro",
        effects: {},
      },
    ],
  },

  ending_courage: {
    id: "ending_courage",
    image: "",
    text: (name) =>
      `Den gylne krystallen pulserer som et hjerte. Du ser deg selv stå i tunge valg – ikke fordi du må, men fordi du velger det. 
Mot er ikke å aldri være redd, tenker ${name ? name : "du"}, men å gå videre likevel.`,
    choices: [
      {
        text: "Slutt – spill på nytt?",
        next: "intro",
        effects: {},
      },
    ],
  },

  ending_balance: {
    id: "ending_balance",
    image: "",
    text: (name) =>
      `Den klare krystallen fylles med både blått og gyllent lys. 
Det er som om noen hvisker: "Du må ikke velge én ting for alltid. Du får lov til å være mer enn én versjon av deg selv." 
${name ? name : "Du"} smiler – og Mythrale smiler tilbake.`,
    choices: [
      {
        text: "Slutt – spill på nytt?",
        next: "intro",
        effects: {},
      },
    ],
  },
};

// ---------------- HJELPEFUNKSJONER ----------------
function applyEffects(effects) {
  if (!effects) return;
  if (typeof effects.courage === "number") {
    player.courage += effects.courage;
  }
  if (typeof effects.kindness === "number") {
    player.kindness += effects.kindness;
  }
}

function renderScene() {
  const scene = scenes[currentSceneId];
  if (!scene) {
    console.error("Scene not found:", currentSceneId);
    return;
  }

  const sceneIdEl = document.getElementById("scene-id");
  const sceneDescriptionEl = document.getElementById("scene-description");
  const sceneImageEl = document.getElementById("scene-image");
  const choicesEl = document.getElementById("choices");
  const courageEl = document.getElementById("courage");
  const kindnessEl = document.getElementById("kindness");

  if (sceneIdEl) sceneIdEl.textContent = "Scene: " + scene.id;

  const name = player.name || "";
  const text =
    typeof scene.text === "function" ? scene.text(name) : scene.text;
  if (sceneDescriptionEl) sceneDescriptionEl.textContent = text;

  if (sceneImageEl) {
    if (scene.image) {
      sceneImageEl.src = scene.image;
      sceneImageEl.style.opacity = "1";
    } else {
      sceneImageEl.src = "";
      sceneImageEl.style.opacity = "0";
    }
  }

  if (courageEl) courageEl.textContent = "Courage: " + player.courage;
  if (kindnessEl) kindnessEl.textContent = "Kindness: " + player.kindness;

  if (!choicesEl) return;
  choicesEl.innerHTML = "";
  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      applyEffects(choice.effects);
      currentSceneId = choice.next;
      renderScene();
    });
    choicesEl.appendChild(btn);
  });
}

// ---------------- KOBLING TIL FORSIDEN / START ----------------
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-btn");     // Start reisen
  const nameInput = document.getElementById("player-name");     // Navnefelt på forsiden
  const landing = document.getElementById("landing");           // Hele forsiden
  const gameRoot = document.getElementById("game-root");        // Selve spillet
  const restartBtn = document.getElementById("restart-btn");    // Restart-knapp i spillet
  const nameDisplay = document.getElementById("player-name-display");

  function startGame() {
    player.name = (nameInput?.value || "").trim() || "Reisende";
    player.courage = 0;
    player.kindness = 0;
    currentSceneId = "intro";

    if (landing) landing.classList.add("hidden");
    if (gameRoot) gameRoot.classList.remove("hidden");
    if (nameDisplay) nameDisplay.textContent = player.name;

    renderScene();
  }

  if (startButton) {
    startButton.addEventListener("click", startGame);
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      player.courage = 0;
      player.kindness = 0;
      currentSceneId = "intro";
      renderScene();
    });
  }
});
