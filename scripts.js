
// ====== DATA ======

const categoriesEN = [
  "Screenplay / Concept",
  "Structure & Pacing",
  "Characters",
  "Acting",
  "Directing",
  "Editing & Rhythm",
  "Visuals",
  "Music & Sound",
  "Atmosphere",
  "Emotional Impact"
];

const categoriesRU = [
  "Сценарий / Идея",
  "Структура и ритм",
  "Персонажи",
  "Актёрская игра",
  "Режиссура",
  "Монтаж и темп",
  "Визуал",
  "Музыка и звук",
  "Атмосфера",
  "Эмоциональный след"
];

// храним баллы (1–10 категории)
const scores = {
  1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  6: 0, 7: 0, 8: 0, 9: 0, 10: 0
};

// ====== CORE ======

function points(category, value) {
  scores[category] = value;

  // обновляем цвета кнопок
  const container = document.querySelectorAll(".points")[category - 1];
  const buttons = container.querySelectorAll("div");

  buttons.forEach(btn => btn.style.background = "none");

  const colors = ["#e74c3c", "#f1c40f", "#2ecc71"];
  buttons[value].style.background = colors[value];

  updateTotals();
}

// ====== TOTALS ======

function updateTotals() {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  document.getElementById("points").innerText = `${total} / 20`;
  document.getElementById("stars").innerText = `${pointsToStars(total)} / 5`
}

function pointsToStars(points) {
  if (points >= 19) return "5";
  if (points >= 17) return "4.5";
  if (points >= 15) return "4";
  if (points >= 13) return "3.5";
  if (points >= 11) return "3";
  if (points >= 9)  return "2.5";
  if (points >= 7)  return "2";
  if (points >= 5)  return "1.5";
  if (points >= 3)  return "1";
  return "0.5";
}

// ====== COPY ======

function buildText(lang) {
  const names = lang === "en" ? categoriesEN : categoriesRU;
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const stars = pointsToStars(total);

  let text = "";

  names.forEach((name, i) => {
    const value = scores[i + 1];
    text += `${i + 1}. ${name}: ${value}/2\n`
  });

  text += `\nOverall: ${total}/20 points = ${stars}/5 stars`

  return text;
}

document.getElementById("copy-en").onclick = () => {
  navigator.clipboard.writeText(buildText("en"));
};

document.getElementById("copy-ru").onclick = () => {
  navigator.clipboard.writeText(buildText("ru"));
};

// ====== INIT ======
updateTotals();
