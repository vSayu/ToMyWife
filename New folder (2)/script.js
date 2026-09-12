/*
  ==========================================
  CONFIGURACIÓN
  ==========================================
*/

const PASSWORD = "020626";
const FALLING_PETALS_PER_CYCLE = 5;

/*
  ==========================================
  ELEMENTOS
  ==========================================
*/

const lockScreen = document.getElementById("lock-screen");
const transitionScreen = document.getElementById("transition-screen");
const letterScreen = document.getElementById("letter-screen");

const passwordInput = document.getElementById("password");
const openButton = document.getElementById("open-button");
const errorMessage = document.getElementById("error-message");

const petalLayer = document.getElementById("petal-layer");
const cursorGlow = document.getElementById("cursor-glow");
const heartCounter = document.getElementById("heart-counter");
const heartCount = document.getElementById("heart-count");

let unlocked = false;
let totalHearts = 0;
let letterPetalTimer = null;
let initialPetalTimer = null;
let initialPetalInterval = null;

/*
  ==========================================
  PÉTALOS DE LA PANTALLA INICIAL
  ==========================================
*/

function createFallingPetal(allowAfterUnlock = false) {
  if (unlocked && !allowAfterUnlock) return;

  const petal = document.createElement("div");
  petal.className = "petal";

  const size = 10 + Math.random() * 14;
  const duration = 5 + Math.random() * 7;
  const left = Math.random() * 100;
  const sway = (Math.random() - .5) * 240;

  const spin = 180 + Math.random() * 360;
  const tone = Math.random();

  petal.style.left = `${left}%`;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.45}px`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.setProperty("--sway", `${sway}px`);
  petal.style.setProperty("--spin", `${spin}deg`);
  petal.style.opacity = `${0.55 + Math.random() * 0.4}`;

  if (tone < .33) {
    petal.style.background = "linear-gradient(135deg, #fff0f7, #ec72a4)";
  } else if (tone < .66) {
    petal.style.background = "linear-gradient(135deg, #ffe1ee, #f68fb3)";
  } else {
    petal.style.background = "linear-gradient(135deg, #fff8f2, #f4a6c6)";
  }

  petal.addEventListener("animationend", () => {
    petal.remove();
  });

  petalLayer.appendChild(petal);
}

function startPetalRain() {
  for (let i = 0; i < 18; i++) {
    initialPetalTimer = setTimeout(createFallingPetal, i * 180);
  }

  initialPetalInterval = setInterval(() => {
    for (let i = 0; i < FALLING_PETALS_PER_CYCLE; i++) {
      setTimeout(createFallingPetal, i * 130);
    }
  }, 1200);
}

function startLetterPetalRain() {
  if (letterPetalTimer) return;

  for (let i = 0; i < 16; i++) {
    setTimeout(() => createFallingPetal(true), i * 170);
  }

  letterPetalTimer = setInterval(() => {
    if (document.querySelectorAll("#petal-layer .petal").length > 32) return;
    const amount = window.innerWidth < 600 ? 2 : 4;
    for (let i = 0; i < amount; i++) {
      setTimeout(() => createFallingPetal(true), i * 150);
    }
  }, 1100);
}

/*
  ==========================================
  INTERACCIÓN CON EL CURSOR
  ==========================================
*/

document.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;

  if (unlocked) return;

  const nearbyPetals = document.querySelectorAll("#petal-layer .petal");

  nearbyPetals.forEach((petal) => {
    const rect = petal.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 90) {
      const push = (90 - distance) / 90;
      petal.style.marginLeft = `${-dx * push * .35}px`;
      petal.style.marginTop = `${-dy * push * .35}px`;
    }
  });
});

/*
  ==========================================
  PEQUEÑOS CORAZONES AL TOCAR/CLICKEAR
  ==========================================
*/

document.addEventListener("click", (event) => {
  createTinyHeart(event.clientX, event.clientY);
});

function createTinyHeart(x, y) {
  const heart = document.createElement("div");
  const shapes = ["♡", "♥", "❤", "❥", "ღ"];
  const colors = ["#d95688", "#bd416e", "#ed77a5", "#c84d82", "#f28ab2"];
  const size = 13 + Math.random() * 24;
  const drift = (Math.random() - .5) * 75;

  heart.textContent = shapes[Math.floor(Math.random() * shapes.length)];
  heart.style.position = "fixed";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.zIndex = "30";
  heart.style.pointerEvents = "none";
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  heart.style.fontSize = `${size}px`;
  heart.style.setProperty("--heart-drift", `${drift}px`);
  heart.style.setProperty("--heart-tilt", `${-25 + Math.random() * 50}deg`);
  heart.style.animation = `tinyHeart ${.9 + Math.random() * .7}s ease-out forwards`;

  totalHearts++;
  heartCount.textContent = totalHearts;
  heartCounter.classList.remove("bump");
  void heartCounter.offsetWidth;
  heartCounter.classList.add("bump");

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 1200);
}

const tinyHeartStyle = document.createElement("style");
tinyHeartStyle.textContent = `
  @keyframes tinyHeart {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(.5);
    }
    to {
      opacity: 0;
      transform: translate(calc(-50% + var(--heart-drift)), -125px) scale(1.45) rotate(var(--heart-tilt));
    }
  }
`;
document.head.appendChild(tinyHeartStyle);

/*
  ==========================================
  CONTRASEÑA
  ==========================================
*/

function checkPassword() {
  const value = passwordInput.value.trim();

  if (value === PASSWORD) {
    unlocked = true;
    clearTimeout(initialPetalTimer);
    clearInterval(initialPetalInterval);
    errorMessage.textContent = "";
    passwordInput.blur();
    beginFlowerTransition();
  } else {
    errorMessage.textContent = "Mmm... esa no es la contraseña ♡";
    passwordInput.classList.remove("shake");
    void passwordInput.offsetWidth;
    passwordInput.classList.add("shake");
  }
}

openButton.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkPassword();
  }
});

/*
  ==========================================
  TRANSICIÓN DE FLORES
  ==========================================
*/

function beginFlowerTransition() {
  lockScreen.classList.remove("active");
  transitionScreen.classList.add("active");

  createSparkles();

  // Un poco después comienza la entrada de la carta.
  setTimeout(() => {
    transitionScreen.classList.remove("active");
    letterScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });

    // Chispas extra alrededor de la entrada de la carta.
    createLetterSparkles();
    startLetterPetalRain();
  }, 3600);
}

function createSparkles() {
  const amount = window.innerWidth < 600 ? 26 : 42;

  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--delay", `${Math.random() * 2.6}s`);
    sparkle.style.setProperty("--dur", `${1.4 + Math.random() * 1.6}s`);
    sparkle.style.fontSize = `${8 + Math.random() * 10}px`;
    sparkle.textContent = Math.random() > .5 ? "✦" : "✧";
    transitionScreen.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 5200);
  }
}

function createLetterSparkles() {
  const layer = document.createElement("div");
  layer.id = "letter-sparkle-layer";
  layer.setAttribute("aria-hidden", "true");
  letterScreen.appendChild(layer);

  const amount = window.innerWidth < 600 ? 16 : 26;

  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "ambient-sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${5 + Math.random() * 90}%`;
    sparkle.style.setProperty("--delay", `${Math.random() * 4}s`);
    sparkle.style.setProperty("--dur", `${2.6 + Math.random() * 2.4}s`);
    sparkle.textContent = Math.random() > .5 ? "✦" : "❀";
    layer.appendChild(sparkle);
  }
}

/*
  ==========================================
  INICIO
  ==========================================
*/

startPetalRain();
