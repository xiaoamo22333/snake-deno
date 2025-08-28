// --- DOM Element Selection ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const instructionsElement = document.getElementById("instructions");
const difficultySelect = document.getElementById("difficulty");
// 更新：获取新的 checkbox 元素
const themeSwitch = document.getElementById("theme-checkbox");

// --- Game Constants & Variables ---
const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let snake, food, dx, dy, score, changingDirection, gameLoopTimeout, gameSpeed;

// --- Core Game Functions ---

/**
 * Initializes or resets the game state.
 */
function initializeGame() {
  gameSpeed = parseInt(difficultySelect.value, 10);
  snake = [{
    x: Math.floor(CANVAS_WIDTH / GRID_SIZE / 2),
    y: Math.floor(CANVAS_HEIGHT / GRID_SIZE / 2),
  }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  gameOverElement.classList.add("hidden");
  instructionsElement.classList.remove("hidden");

  generateFood();

  if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
  main();
}

/**
 * The main game loop, running at a speed determined by `gameSpeed`.
 */
function main() {
  gameLoopTimeout = setTimeout(() => {
    changingDirection = false;
    clearCanvas();
    moveSnake();

    if (checkGameOver()) {
      showGameOver();
      return;
    }

    drawFood();
    drawSnake();

    main();
  }, gameSpeed);
}

// --- Drawing Functions ---

function clearCanvas() {
  const canvasBgColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--canvas-bg-color");
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#388e3c" : "#81c784";
    ctx.strokeStyle = "#2e7d32";
    ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(
      part.x * GRID_SIZE,
      part.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE,
    );
  });
}

function drawFood() {
  ctx.fillStyle = "#d32f2f";
  ctx.strokeStyle = "#c62828";
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  ctx.strokeRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// --- Game Logic Functions ---

function moveSnake() {
  if (dx === 0 && dy === 0) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (snake[0].x === food.x && snake[0].y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  const maxX = CANVAS_WIDTH / GRID_SIZE;
  const maxY = CANVAS_HEIGHT / GRID_SIZE;

  food = {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };

  if (snake.some((part) => part.x === food.x && part.y === food.y)) {
    generateFood();
  }
}

function checkGameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  return snake[0].x < 0 || snake[0].x >= CANVAS_WIDTH / GRID_SIZE ||
    snake[0].y < 0 || snake[0].y >= CANVAS_HEIGHT / GRID_SIZE;
}

function showGameOver() {
  clearTimeout(gameLoopTimeout);
  gameOverElement.classList.remove("hidden");
  instructionsElement.classList.add("hidden");
}

// --- Event Handlers ---

function handleKeyDown(event) {
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.key;
  const goingUp = dy === -1,
    goingDown = dy === 1,
    goingRight = dx === 1,
    goingLeft = dx === -1;

  if (keyPressed === "ArrowLeft" && !goingRight) {
    dx = -1;
    dy = 0;
  } else if (keyPressed === "ArrowUp" && !goingDown) {
    dx = 0;
    dy = -1;
  } else if (keyPressed === "ArrowRight" && !goingLeft) {
    dx = 1;
    dy = 0;
  } else if (keyPressed === "ArrowDown" && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

/**
 * 更新：根据 checkbox 的状态切换主题
 */
function handleThemeChange() {
  const newTheme = themeSwitch.checked ? "dark" : "light";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("snake-theme", newTheme);
}

// --- Initialization & Event Listeners ---

/**
 * 更新：应用初始主题，并设置开关的初始状态
 */
function applyInitialTheme() {
  const savedTheme = localStorage.getItem("snake-theme");
  const prefersDark = globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.body.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    themeSwitch.checked = true;
  }
}

document.addEventListener("keydown", handleKeyDown);
restartButton.addEventListener("click", initializeGame);
difficultySelect.addEventListener("change", initializeGame);
// 更新：监听 checkbox 的 'change' 事件
themeSwitch.addEventListener("change", handleThemeChange);

// --- Start Game ---
applyInitialTheme();
initializeGame();
