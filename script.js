// --- 获取 HTML 元素 ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const instructionsElement = document.getElementById("instructions");

// --- 游戏常量和变量 ---
const GRID_SIZE = 20; // 每个格子的大小（像素）
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let snake; // 蛇的身体，一个坐标数组
let food; // 食物的坐标
let dx; // x 轴方向速度
let dy; // y 轴方向速度
let score; // 当前分数
let changingDirection; // 防止在一次渲染中多次改变方向
let gameLoopTimeout; // 用于控制游戏循环的定时器

// --- 游戏主函数 ---

/**
 * 初始化游戏状态
 */
function initializeGame() {
  // 初始时蛇在中间，长度为 1
  snake = [{
    x: Math.floor(CANVAS_WIDTH / GRID_SIZE / 2),
    y: Math.floor(CANVAS_HEIGHT / GRID_SIZE / 2),
  }];
  // 初始方向不移动
  dx = 0;
  dy = 0;
  // 分数清零
  score = 0;
  scoreElement.textContent = score;
  // 隐藏游戏结束画面
  gameOverElement.classList.add("hidden");
  instructionsElement.classList.remove("hidden");
  // 生成第一个食物
  generateFood();
  // 开始游戏循环
  main();
}

/**
 * 游戏主循环
 */
function main() {
  // 设置一个定时器，以固定的速度重复执行
  gameLoopTimeout = setTimeout(() => {
    changingDirection = false; // 重置方向改变锁
    clearCanvas();
    moveSnake();

    if (checkGameOver()) {
      showGameOver();
      return; // 游戏结束，停止循环
    }

    drawFood();
    drawSnake();

    // 继续下一次循环
    main();
  }, 120); // 数字越小，蛇移动越快
}

// --- 绘制函数 ---

/**
 * 清空画布
 */
function clearCanvas() {
  ctx.fillStyle = "#e8f5e9";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * 绘制蛇的每一部分
 */
function drawSnake() {
  snake.forEach((part, index) => {
    // 蛇头使用深绿色，身体使用稍浅的绿色
    ctx.fillStyle = index === 0 ? "#388e3c" : "#81c784";
    ctx.strokeStyle = "#2e7d32"; // 边框颜色
    ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(
      part.x * GRID_SIZE,
      part.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE,
    );
  });
}

/**
 * 绘制食物
 */
function drawFood() {
  ctx.fillStyle = "#d32f2f"; // 红色
  ctx.strokeStyle = "#c62828"; // 深红色边框
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  ctx.strokeRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// --- 逻辑函数 ---

/**
 * 移动蛇
 */
function moveSnake() {
  // 如果没有设置方向，则不移动
  if (dx === 0 && dy === 0) return;

  // 创建新的蛇头，位置是旧蛇头根据方向移动一格
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head); // 将新蛇头添加到数组开头

  // 检查是否吃到食物
  const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
  if (hasEatenFood) {
    // 增加分数
    score += 10;
    scoreElement.textContent = score;
    // 生成新食物
    generateFood();
  } else {
    // 如果没吃到食物，则移除蛇尾，保持长度不变
    snake.pop();
  }
}

/**
 * 在随机位置生成食物
 */
function generateFood() {
  const maxX = CANVAS_WIDTH / GRID_SIZE;
  const maxY = CANVAS_HEIGHT / GRID_SIZE;

  // 随机生成食物坐标
  food = {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };

  // 确保食物不会生成在蛇的身体上
  snake.forEach((part) => {
    if (part.x === food.x && part.y === food.y) {
      generateFood(); // 如果位置重合，重新生成
    }
  });
}

/**
 * 检查游戏是否结束
 * @returns {boolean} 如果游戏结束则返回 true
 */
function checkGameOver() {
  // 检查是否撞到自己
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // 检查是否撞墙
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x >= CANVAS_WIDTH / GRID_SIZE;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y >= CANVAS_HEIGHT / GRID_SIZE;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/**
 * 显示游戏结束画面
 */
function showGameOver() {
  clearTimeout(gameLoopTimeout); // 停止游戏循环
  gameOverElement.classList.remove("hidden");
  instructionsElement.classList.add("hidden");
}

// --- 事件处理 ---

/**
 * 处理键盘按键事件，改变蛇的方向
 * @param {KeyboardEvent} event
 */
function changeDirection(event) {
  // 如果在一次渲染中已经改变过方向，则忽略
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.key;

  // 判断当前方向，防止蛇直接掉头
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

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

// 监听键盘事件
document.addEventListener("keydown", changeDirection);
// 监听重新开始按钮的点击事件
restartButton.addEventListener("click", initializeGame);

// --- 启动游戏 ---
initializeGame();
