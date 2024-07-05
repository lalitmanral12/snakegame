// script.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = canvas.width / box;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = {
  x: Math.floor(Math.random() * canvasSize),
  y: Math.floor(Math.random() * canvasSize),
};
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 38: // up arrow
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 39: // right arrow
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
    case 40: // down arrow
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
  }
}

function gameLoop() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for wall collisions
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snakeCollision(head)
  ) {
    saveScore();
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * canvasSize),
      y: Math.floor(Math.random() * canvasSize),
    };
  } else {
    snake.pop();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);

  // Draw snake
  ctx.fillStyle = "green";
  for (let segment of snake) {
    ctx.fillRect(segment.x * box, segment.y * box, box, box);
  }

  // Draw score
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 5, canvas.height - 5);
}

function snakeCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
}

function saveScore() {
  const playerName = prompt("Game over! Enter your name:");
  if (playerName) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
  }
}

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const leaderboardElement = document.getElementById("leaderboard");
  leaderboardElement.innerHTML = "";
  leaderboard.sort((a, b) => b.score - a.score);
  for (let entry of leaderboard.slice(0, 5)) {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  }
}

updateLeaderboard();
setInterval(gameLoop, 100);
