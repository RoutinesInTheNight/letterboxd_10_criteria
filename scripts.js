
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
  hapticFeedback('change')
  scores[category] = value;

  // обновляем цвета кнопок
  const container = document.querySelectorAll(".points")[category - 1];
  const buttons = container.querySelectorAll("div");

  buttons.forEach(btn => btn.classList.remove('select'));
  buttons[value].classList.add('select');

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
  hapticFeedback('success');
  navigator.clipboard.writeText(buildText("en"));
};

document.getElementById("copy-ru").onclick = () => {
  hapticFeedback('success');
  navigator.clipboard.writeText(buildText("ru"));
};

// ====== INIT ======
updateTotals();













































const telegram = window.Telegram.WebApp;
const DEVICE_TYPE = telegram.platform;

telegram.expand();
if (telegram.isVersionAtLeast("7.7")) telegram.disableVerticalSwipes();
if (telegram.isVersionAtLeast("8.0")) {
  telegram.requestFullscreen();
}


function hapticFeedback(type) {
  if (telegram.isVersionAtLeast("6.1") && (DEVICE_TYPE === 'android' || DEVICE_TYPE === 'ios')) {
    switch (type) {
      case 'light':
        telegram.HapticFeedback.impactOccurred('light');
        break;
      case 'medium':
        telegram.HapticFeedback.impactOccurred('medium');
        break;
      case 'heavy':
        telegram.HapticFeedback.impactOccurred('heavy');
        break;
      case 'rigid':
        telegram.HapticFeedback.impactOccurred('rigid');
        break;
      case 'soft':
        telegram.HapticFeedback.impactOccurred('soft');
        break;
      case 'error':
        telegram.HapticFeedback.notificationOccurred('error');
        break;
      case 'success':
        telegram.HapticFeedback.notificationOccurred('success');
        break;
      case 'warning':
        telegram.HapticFeedback.notificationOccurred('warning');
        break;
      case 'change':
        telegram.HapticFeedback.selectionChanged();
        break;
      default:
        console.warn('Unknown haptic feedback type:', type);
    }
  }
}


const SafeAreaManager = (() => {
  let safeAreaTop = 0;
  let safeAreaBottom = 0;
  let contentSafeAreaTop = 0;
  let contentSafeAreaBottom = 0;

  function getTotalSafeAreas() {
    return {
      top: safeAreaTop + contentSafeAreaTop,
      bottom: safeAreaBottom + contentSafeAreaBottom
    };
  }

  function updateFromTelegram() {
    const content = telegram.contentSafeAreaInset || {};
    const system = telegram.safeAreaInset || {};

    contentSafeAreaTop = content.top || 0;
    contentSafeAreaBottom = content.bottom || 0;
    safeAreaTop = system.top || 0;
    safeAreaBottom = system.bottom || 0;
  }

  function init() {
    const updateAndNotify = () => {
      updateFromTelegram();
      if (typeof SafeAreaManager.onChange === 'function') {
        SafeAreaManager.onChange(getTotalSafeAreas());
      }
    };

    telegram.onEvent('safeAreaChanged', updateAndNotify);
    telegram.onEvent('contentSafeAreaChanged', updateAndNotify);
    updateAndNotify();
  }

  return {
    init,
    getTotalSafeAreas,
    onChange: null
  };
})();


document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const bottomEl = document.querySelector('.bottom');
  

  SafeAreaManager.onChange = ({ top, bottom }) => {
    const bottomValue = bottom === 0 ? 'calc(100 / 428 * 16 * var(--vw))' : `${bottom * 2}px`;
    const topValue = top === 0 ? 'calc(100 / 428 * 16 * var(--vw))' : `${top}px`;

    header.style.marginTop = topValue;
    bottomEl.style.marginBottom = bottomValue;
  };
  SafeAreaManager.init();
});