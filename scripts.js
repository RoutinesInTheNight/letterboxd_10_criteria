
// ====== DATA ======

const categoriesEN = [
  "Screenplay, concept",
  "Structure, pacing",
  "Characters",
  "Acting",
  "Directing",
  "Editing, rhythm",
  "Visuals",
  "Music, sound",
  "Atmosphere",
  "Emotional impact"
];

const categoriesRU = [
  "Сценарий, идея",
  "Структура, ритм",
  "Персонажи",
  "Актёрская игра",
  "Режиссура",
  "Монтаж, темп",
  "Визуал",
  "Музыка, звук",
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

function buildText() {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const stars = pointsToStars(total);

  let textEN = "";
  let textRU = "";

  categoriesEN.forEach((name, i) => {
    const value = scores[i + 1];
    textEN += `${i + 1}. ${name}: ${value}/2\n`;
  });

  categoriesRU.forEach((name, i) => {
    const value = scores[i + 1];
    textRU += `${i + 1}. ${name}: ${value}/2\n`;
  });

  textEN += `\nOverall: ${total}/20 points = ${stars}/5 stars`;
  textRU += `\nИтог: ${total}/20 баллов = ${stars}/5 звёзд`;

  return `${textEN}\n\n----------\n\n${textRU}`;
}

document.getElementById("copy").onclick = () => {
  hapticFeedback('success');
  navigator.clipboard.writeText(buildText());
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
  SafeAreaManager.onChange = ({ top, bottom }) => {
    const bottomValue = bottom === 0 ? 'calc(100 / 428 * 16 * var(--vw))' : `${bottom}px`;
    const topValue = top === 0 ? 'calc(100 / 428 * 8 * var(--vw))' : `${top}px`;

    document.querySelector('.header').style.paddingTop = topValue;
    document.querySelector('.bottom').style.marginBottom = bottomValue;
    document.querySelector('.categories').style.marginTop = top === 0 ? 'calc(100 / 428 * (37 + 8 + 32) * var(--vw))' : `calc(100 / 428 * (37 + 32) * var(--vw) + ${top}px)`;
    document.querySelector('.categories').style.marginBottom = top === 0 ? 'calc(100 / 428 * (37 + 16 + 32) * var(--vw))' : `calc(100 / 428 * (37 + 32) * var(--vw) + ${bottom}px)`;
  };
  SafeAreaManager.init();
});