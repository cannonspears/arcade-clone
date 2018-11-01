// Enemy constructor function
var Enemy = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = "images/enemy-bug.png";
};

// Enemy position
Enemy.prototype.update = function(dt) {
  // Multiply dt parameter to make sure game runs at same speed across all computers
  this.x += this.speed * dt;

  // Reset enemy position when off canvas to cross again
  if (this.x > 550) {
    this.x = -100;
    this.speed = 100 * speedMult + Math.floor(Math.random() * 512);
  }

  // Check for player and enemy collision
  if (
    player.x < this.x + 60 &&
    player.x + 37 > this.x &&
    player.y < this.y + 25 &&
    30 + player.y > this.y
  ) {
    player.x = 200;
    player.y = 380;
    score.updateMiss();
    checkGameOver();
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player constructor function
var Player = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = "images/char-boy.png";
};

// Player position
Player.prototype.update = function() {
  // Keep player within canvas boundaries
  if (this.y > 380) {
    this.y = 380;
  }

  if (this.x > 400) {
    this.x = 400;
  }

  if (this.x < 0) {
    this.x = 0;
  }

  // Check for player winning game by reaching top
  if (this.y < 0) {
    score.updateSuccess();
    this.x = 200;
    this.y = 380;
    speedMult += 0.2;
    checkGameOver();
  }
};

// Draw the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Direction of player by key input
Player.prototype.handleInput = function(keyPress) {
  switch (keyPress) {
    case "left":
      this.x -= this.speed + 50;
      break;
    case "up":
      this.y -= this.speed + 30;
      break;
    case "right":
      this.x += this.speed + 50;
      break;
    case "down":
      this.y += this.speed + 30;
      break;
  }
};

// Score constructor function
var Score = function() {
  this.success = 0;
  this.miss = 0;
};

Score.prototype.updateSuccess = function() {
  this.success += 1;
  document.getElementById("score-success").innerHTML = this.success;
};

Score.prototype.updateMiss = function() {
  this.miss += 1;
  document.getElementById("score-miss").innerHTML = this.miss;
};

// Instantiate player and enemy objects; create score and speed multiplier variables
var allEnemies = [];
var enemyPosition = [60, 140, 220];
var player = new Player(200, 380, 50);
var enemy;
var score = new Score();
var speedMult = 1;

enemyPosition.forEach(function(y) {
  enemy = new Enemy(0, y, 100 + Math.floor(Math.random() * 512));
  allEnemies.push(enemy);
});

// Listen for player keystroke input
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

// Checks for game over after every success and miss
function checkGameOver() {
  if (score.success + score.miss === 20) {
    document.getElementById("overlay").style.display = "grid";
    overlayScreen();
  }
}

// Edits HTML on overlay depending on score
function overlayScreen() {
  if (score.success === 20) {
    document.getElementById("overlayIntro").innerHTML = "Perfect!";
    document.getElementById("overlaySaved").innerHTML = score.success;
    document.getElementById("overlayKilled").innerHTML = "no";
    document.getElementById("overlayText").innerHTML =
      "With each Frogboy alive and well, the Frogbrothers celebrated with song and dance. Each married a Froggirl and had Frogchildren of their own, and those Frogchildren had Frogchildren. The Grand Frogchildren would often gather around their Grand Frogfather who would tell them of the extraordinary journey he and his Frogbrothers once took across the sea as well as the mysterious Hand who had guided them.";
  } else if (score.success < 20 && score.success > 10) {
    document.getElementById("overlayIntro").innerHTML = "Good Job!";
    document.getElementById("overlaySaved").innerHTML = score.success;
    document.getElementById("overlayKilled").innerHTML = score.miss;
    document.getElementById("overlayText").innerHTML =
      "With over half of the Frogboys alive, many went out in search for their life's true calling. Some chose to be scientists and developed groundbreaking discoveries; others chose to be doctors and healed many in the world. Once a year, the Frogboys gathered at the edge of the sea and held a memorial in honor of their lost Frogbrothers.";
  } else if (score.success < 10 && score.success > 0) {
    document.getElementById("overlayIntro").innerHTML = "Good Effort!";
    document.getElementById("overlaySaved").innerHTML = score.success;
    document.getElementById("overlayKilled").innerHTML = score.miss;
    document.getElementById("overlayText").innerHTML =
      "Overcome by grief at the loss of over half of their Frogbrothers, some Frogboys chose counseling while others turned to the bottle. Those who were counseled never found happiness; every waking thought was of their lost Frogbrothers' watery grave, every dream of the snarling waterbugs' gnashing teeth. None ever found love, and one by one the Frogboy species died out, lost to memories.";
  } else if (score.success === 0) {
    document.getElementById("overlayIntro").innerHTML = "You Monster!";
    document.getElementById("overlaySaved").innerHTML = "no";
    document.getElementById("overlayKilled").innerHTML = score.miss;
    document.getElementById("overlayText").innerHTML =
      "You have fed every Frogboy to the waterbugs, and in doing so have completely wiped out the Frogboy species. The world will no longer hear their joyous croaking during a summer's night but will instead forget the existence of the once proud Frogboy species. If only there was a way to try again...";
  }
}

// Restarts game at overlay onclick
function restartGame() {
  document.getElementById("overlay").style.display = "none";
  location.reload();
}
