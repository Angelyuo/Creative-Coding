// Title screen
let mode = "title";
// Ammo for the pingPong
let ammo;
// Movable rectangular shape at the bottom to bounce the ball around
let paddle;
// Position for the paddle
let paddleX;
let paddleY;
// Array to hold all bricks
let bricks = [];
// Life and Score data
let life;
let score;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ammo = new pingPong();
  paddle = new Paddle();
  paddleX = width / 2 - 75;
  paddleY = height / 1.1;

  // For loop to make 50 bricks
  for (let i = 0; i < 50; i++) {
    let brick = new Brick();
    bricks.push(brick);
  }

  // Life and Score data
  life = 7;
  score = 0;
}

// Redirection to different screens
function draw() {
  if (mode === "title") {
    titleScreen();
  }
  if (mode === "game") {
    gameScreen();
  }
  if (mode === "gameOver") {
    gameoverScreen();
  }
  if (mode === "gameWin") {
    gamewinScreen();
  }
}

// Title screen
function titleScreen() {
  background(248, 244, 236);
  textSize(100);
  textAlign(CENTER, CENTER);
  // Title text
  fill(64, 43, 58);
  text("PinBall Breakers", width / 2, height / 4);
  textSize(35);
  textAlign(CENTER, CENTER);
  // Description text
  fill(255, 155, 210);
  text("A simple PinBall game :)", width / 2, height / 2.7);
  // Instruction text
  fill(214, 52, 132);
  text("Press SPACE to play", width / 2, height / 1.3);

  // Pressing the Space button will move you from the Home screen to the Game screen
  if (keyCode === 32) {
    mode = "game";
  }
}

// Game screen
function gameScreen() {
  background(142, 62, 99);

  // Balls and Scores text costumization
  textSize(35);
  textAlign(CENTER, CENTER);
  fill(248, 249, 215);

  // Balls and Scores text position
  text("balls =" + life, width / 10, height / 1.05);
  text("score =" + score, width / 1.15, height / 1.05);

  ammo.draw();
  ammo.move();
  ammo.collision();

  for (let brick of bricks) {
    brick.draw();
  }

  paddle.draw();
  paddle.move();

  if (ammo.location()) {
    life -= 1;
    ammo.reset();
    if (life === 0) {
      mode = "gameOver";
    }
  }

  if (score === 500) {
    mode = "gameWin";
  }
}

// pingPong properties
class pingPong {
  constructor() {
    // pingPong dimensions
    this.ballX = width / 2;
    this.ballY = height / 2;
    // Initial spawning location
    this.dirX = 2;
    this.dirY = 10;
    this.radius = 25;
    // Colour of the pingPong
    (this.color = 248), 249, 215;
  }

  draw() {
    fill(this.color);
    ellipse(this.ballX, this.ballY, this.radius);
  }

  move() {
    this.ballX = this.ballX + this.dirX;
    this.ballY = this.ballY + this.dirY;
  }

  collision() {
    // Collision for the edge of the screen
    if (this.ballX > width || this.ballX < 0) {
      this.dirX = this.dirX * -1;
    }

    if (this.ballY < 0) {
      this.dirY = this.dirY * -1;
      this.ballY = this.ballY + this.dirY;
    }

    // Colliion for the moving paddle
    if (
      this.ballY > paddleY - 20 &&
      this.ballY < paddleY &&
      this.ballX > paddleX - 5 &&
      this.ballX < paddleX + 150
    ) {
      this.dirY = this.dirY * -1;
      this.ballY = this.ballY + this.dirY;
    }

    // Collision with the bricks
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (
        brick.active &&
        this.ballY > brick.brickY - 25 &&
        this.ballY < brick.brickY &&
        this.ballX > brick.brickX - 5 &&
        this.ballX < brick.brickX + 55
      ) {
        score += 10;
        this.dirX += 0.5;
        this.dirY += 0.5;
        this.dirY = this.dirY * -1;
        this.ballY = this.ballY + this.dirY;
        brick.active = false; // Disable the brick upon collision
      }
    }
  }

  location() {
    return this.ballY - this.radius > height;
  }

  reset() {
    this.ballX = width / 2;
    this.ballY = height / 2;
    // Ball spawn location when previous one is gone
    this.dirX = 2;
    this.dirY = 10;
  }
}

// Brick properties
class Brick {
  constructor() {
    this.active = true; // Flag to indicate if the brick is active
    // Brick dimensions
    this.brickWidth = 50;
    this.brickHeight = 25;
    this.brickX = random(width - this.brickWidth);
    this.brickY = random(100, height / 2);
    this.red = random(0, 255);
    this.green = random(0, 255);
    this.blue = random(0, 255);
  }

  draw() {
    if (this.active) {
      fill(this.red, this.green, this.blue);
      rect(this.brickX, this.brickY, this.brickWidth, this.brickHeight);
    }
  }
}

// Paddle properties
class Paddle {
  constructor() {
    // Paddle properties
    this.paddleWidth = 150;
    this.paddleHeight = 20;
    this.color = color(202, 230, 178);
  }

  draw() {
    fill(this.color);
    rect(paddleX, paddleY - 15, this.paddleWidth, this.paddleHeight, 20);
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      if (keyIsDown(SHIFT)) {
        paddleX -= 20;
      } else {
        paddleX -= 13;
      }
    }

    if (keyIsDown(RIGHT_ARROW)) {
      if (keyIsDown(SHIFT)) {
        paddleX += 20;
      } else {
        paddleX += 13;
      }
    }

    if (paddleX < 0) {
      paddleX = 0;
    }

    if (paddleX + 150 > width) {
      paddleX = width - 150;
    }
  }

  reset() {
    paddleX = width / 2 - 75;
    paddleY = height / 1.1;
  }
}

function gameoverScreen() {
  background(255, 253, 215);
  textSize(100);
  textAlign(CENTER, CENTER);
  fill(231, 41, 41);
  // Title text
  text("Game Over :(", width / 2, height / 4);
  textSize(35);
  textAlign(CENTER, CENTER);
  // Instruction text
  fill(255, 91, 174);
  text("Press BACKSPACE to go back to the menu", width / 2, height / 1.3);

  if (keyCode === BACKSPACE) {
    ammo.reset();
    paddle.reset();
    life = 5;
    score = 0;
    for (let i = 0; i < bricks.length; i++) {
      bricks[i].active = true; // Re-enable all bricks
    }
    mode = "title";
  }
}

function gamewinScreen() {
  background(202, 230, 178);
  textSize(100);
  textAlign(CENTER, CENTER);
  fill(142, 62, 99);
  // Title text
  text("You won! :D", width / 2, height / 4);
  textSize(35);
  textAlign(CENTER, CENTER);
  // Instruction text
  fill(210, 100, 154);
  text("Press BACKSPACE to go back to the menu", width / 2, height / 1.3);

  if (keyCode === BACKSPACE) {
    ammo.reset();
    paddle.reset();
    life = 5;
    score = 0;
    for (let i = 0; i < bricks.length; i++) {
      bricks[i].active = true; // Re-enable all bricks
    }
    mode = "title";
  }
}
