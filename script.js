let xp = 0;
let tokens = 0;

const xpSpan = document.getElementById('xp');
const tokensSpan = document.getElementById('tokens');

const menu = document.getElementById('menu');
const game = document.getElementById('game');
const questImage = document.getElementById('quest-image');
const questText = document.getElementById('quest-text');
const answersDiv = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');

const sndCorrect = document.getElementById('snd-correct');
const sndReward = document.getElementById('snd-reward');
const sndQuest = document.getElementById('snd-questmaster');

let currentQuest = null;
let step = 0;

// --- Utility ---
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateStatus() {
  xpSpan.textContent = "XP: " + xp;
  tokensSpan.textContent = "Tokens: " + tokens;
}

// --- Quest defs ---
const quests = {
  math: () => {
    const energy = rand(6, 20);
    const mult = rand(2, 4);
    const need = energy * mult;
    return {
      world: "math",
      image: "assets/obby_math.png",
      steps: [
        {
          text: `Upgrade stojí ${mult}× víc energie. Máš ${energy}. Kolik potřebuješ?`,
          answers: [need, need+2, need-3],
          correct: need,
          rewardXP: 30
        },
        {
          text: `Soupeř má ${need+rand(1,5)} energie. Kdo má víc?`,
          answers: ["Ty", "Soupeř"],
          correct: "Soupeř",
          rewardXP: 20
        }
      ],
      finalReward: { xp: 50, token: 1 }
    }
  },

  science: () => ({
    world: "science",
    image: "assets/prism_science.png",
    steps: [
      {
        text: `PrismBeam ohýbá světlo. Co se stane, když světlo narazí na vodu?`,
        answers: ["Zmizí", "Ohne se", "Exploduje"],
        correct: "Ohne se",
        rewardXP: 30
      },
      {
        text: `Tento jev se jmenuje…`,
        answers: ["Refrakce", "Rotace", "Vibrace"],
        correct: "Refrakce",
        rewardXP: 20
      }
    ],
    finalReward: { xp: 60, token: 1 }
  }),

  reading: () => {
    const fruit = ["oranžové bobule", "sladké listy", "lesní plody"][rand(0,2)];
    return {
      world: "reading",
      image: "assets/creature_forest.png",
      steps: [
        {
          text: `Flamepup hledal v lese ${fruit}. Když je konečně našel, usmál se.`,
          answers: [
            "Našel co hledal",
            "Bál se lesa",
            "Ztratil se"
          ],
          correct: "Našel co hledal",
          rewardXP: 30
        }
      ],
      finalReward: { xp: 40, token: 1 }
    }
  }
}

// --- Game logic ---
document.querySelectorAll('.quest-btn').forEach(btn => {
  btn.onclick = () => {
    sndQuest.play();
    startQuest(btn.dataset.quest);
  };
});

function startQuest(type) {
  currentQuest = quests[type]();
  step = 0;
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  renderStep();
}

function renderStep() {
  const s = currentQuest.steps[step];
  questImage.innerHTML = `<img src="${currentQuest.image}">`;
  questText.textContent = s.text;

  answersDiv.innerHTML = "";
  s.answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(ans);
    answersDiv.appendChild(btn);
  });

  nextBtn.classList.add('hidden');
}

function checkAnswer(ans) {
  const s = currentQuest.steps[step];
  if (ans == s.correct) {
    sndCorrect.play();
    xp += s.rewardXP;
    updateStatus();
    nextBtn.classList.remove('hidden');
    answersDiv.innerHTML = "";
  } else {
    alert("Zkus znovu!");
  }
}

nextBtn.onclick = () => {
  step++;
  if (step >= currentQuest.steps.length) finalReward();
  else renderStep();
}

function finalReward() {
  sndReward.play();
  xp += currentQuest.finalReward.xp;
  tokens += currentQuest.finalReward.token;
  updateStatus();
  questText.textContent = `Quest splněn!`;
  answersDiv.innerHTML = "";
  nextBtn.textContent = "Zpět do menu";
  nextBtn.onclick = () => {
    nextBtn.textContent = "Další";
    menu.classList.remove('hidden');
    game.classList.add('hidden');
  }
}
