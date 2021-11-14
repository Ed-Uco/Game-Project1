const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');
const $button = document.querySelector('button');
let score = 0;
let intervalId;
let gameFrame = 0;
let gameOver = false;
let gameWin = false;


//Mouse interactivity
let $canvasPosition = $canvas.getBoundingClientRect();
const mouse = {
      x: $canvas.width / 2,
      y: $canvas.height / 2,
      click: false,
}
$canvas.addEventListener('mousedown', function (event) {
      mouse.click = true;
      mouse.x = event.x - $canvasPosition.left;
      mouse.y = event.y - $canvasPosition.top;
});

$canvas.addEventListener('mouseup', function (event) {
      mouse.click = false;
      
})


//Player
class Player {
      constructor() {
            /* this.x = $canvas.width; */
            this.x = 0
            this.y = $canvas.height / 2;
            this.radius = 50;
            this.angle = 0;
            this.frameX = 0;
            this.frameY = 0;
            this.spriteWidth = 498;
            this.spriteHeight = 327;
            this.health = 2;
      }
      draw() {
            const playerLeft = new Image();
            playerLeft.src = '/images/fish-normal.png';
            const playerRight = new Image();
            playerRight.src = '/images/fish down.png';
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            // formula para calcular el angulo a la que debe de estar ubicado el frente del jugador viendo hacia el puntero del raton.
            let theta = Math.atan2(dy, dx);
            this.angle = theta;
            if (mouse.x != this.x) {
                 this.x -= dx / 10;
             }
            if (mouse.y != this.y) {
                 this.y -= dy / 10;
             }

           ctx.save();
          // metodos para rotar e invertir la imagen del pez y poder darle vuelta si voltea a la derecha o a la izquierda. Es necesario invertir verticalmente la imagen original del pez. Se usan las dos imagenes, la normal(playerRight) y la invertida(playerLeft) verticalmente.
            
            
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);
          if (this.x >= mouse.x) {
              ctx.drawImage(
                  playerLeft,
                  this.frameX * this.spriteWidth,
                  this.frameY * this.spriteHeight,
                  this.spriteWidth,
                  this.spriteHeight,
                  0 - 60,
                  0 - 45,
                  this.spriteWidth / 4,
                  this.spriteHeight / 4,
              );
          } else {
              ctx.drawImage(
                  playerRight,
                  this.frameX * this.spriteWidth,
                  this.frameY * this.spriteHeight,
                  this.spriteWidth,
                  this.spriteHeight,
                  0 - 60,
                  0 - 45,
                  this.spriteWidth / 4,
                  this.spriteHeight / 4,
              );
          }
          ctx.restore();
      }
      touching(obj) {
            const dx = obj.x - this.x;
            const dy = obj.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            //Para detectar la colision entre los circulos
            distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.radius + player.radius) {
                  return true;
            }
      }
      getHealt(){
            return this.health;
            }
      liveLose(){
                  this.health--;
      }

}

class Live {
      constructor() {
            this.x = 700;
            this.y = 25;
            this.width = 30;
            this.height = 30;
            this.image = new Image();
            this.image.src = "/images/red.png";
      }
      draw() {
            if (player.health === 2) {
                  ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
            ctx.drawImage(this.image,this.x+35,this.y,this.width,this.height) 
        } else if (player.health === 1){ 
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
        }
      }
      Text() {
            ctx.font = "30px Luckiest Guy"
            ctx.fillText("Lives :", 600, 50);
            ctx.fillStyle = "black";
      }
      }

class Enemy {
      constructor() {
            this.x = $canvas.width + 200;
            this.y = Math.random() * ($canvas.height - 150) + 90;
            this.radius = 60;
            this.speed = Math.random() * 2 + 2;
            this.frame = 0;
            this.frameX = 0;
            this.frameY = 0;
            this.spriteWidth = 418;
            this.spriteHeight = 397;

      }    
      draw() {
            this.image = new Image();
            this.image.src = '/images/blue.png';
            ctx.drawImage(this.image, this.x - 50, this.y - 50, this.radius * 2, this.radius * 2);
            this.x -= this.speed;
            if (this.x < 0 - this.radius * 2) {
                  this.x = $canvas.width + 200;
                  this.y = Math.random() * ($canvas.height - 150) + 90;
                  this.speed = Math.random() * 2 + 2;
            }
      }
      speed1() {
            this.speed = Math.random() * 2 + 5;
      }
      speed2() {
            this.speed = Math.random() * 2 + 7;
      }
}


//Bubbles
class Bubble {
      constructor() {
            this.x = Math.random() * $canvas.width;
            this.y = $canvas.height + Math.random() * $canvas.height;
            this.radius = 50;
            this.speed = Math.random() * 5 + 1;
            this.distance = 0;
            this.counters =false;
      }
      update() {
            this.y -= this.speed;
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            //Para detectar la colision entre los circulos
            this.distance = Math.sqrt(dx*dx + dy*dy);
      }
      draw() {
            this.image = new Image();
            this.image.src = '/images/bubble_pop.png';
            ctx.drawImage(this.image, this.x - 50, this.y - 50, this.radius * 2, this.radius * 2);
      }
}



const player = new Player();
const bubbles = [];
const enemy = new Enemy();
const background = new Image();
background.src = 'images/background.png';
const bg = {
      x: 0,
      y: 0,
      width: $canvas.width,
      height: 100,
}
let lives = new Live();

function startGame() {
      if (intervalId) return;
      intervalId = setInterval(() => {
            animation();
      }, 1000 / 60);
}


function touching() {
      if (player.touching(enemy)) {
          if (player.getHealt() > 0) {
                player.liveLose();
                player.x = 0;
                player.y = 0;
               
          } else {
                clearInterval(intervalId);
                gameOver = true;
                //GameOver();
          }
      }
     
}

function GameOver() {
      if (gameOver) {
            ctx.fillStyle = 'white';
            ctx.fillText('GAME OVER, your score is ' + score, 210, 250);
      }
}

function GameWin() {
      if (gameWin) {
            clearInterval(intervalId);
            ctx.fillStyle = 'white';
            ctx.fillText('YOU WIN !!!!!, your score is ' + score, 220, 250);
      }
      
} 


function handbubbles() {
    //Llenamos el array de bubbles cada 50 frames
    if (gameFrame % 50 == 0) {
        bubbles.push(new Bubble());
    }
    //Actualizamos y dibujamos cada elemento del array de bubbles.
    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
        bubbles[i].draw();
    }
    // para mantener vaciar el array de burbujas
    for (let j = 0; j < bubbles.length; j++) {
        if (bubbles[j].y < 0) {
            bubbles.splice(j, 1);
        }
        //para verificar si hubo choque entre el jugador y las bubbles del array y si es así aumentar el score.
        if (bubbles[j].distance < bubbles[j].radius + player.radius) {
            // Mientras la condicion es falsa aumentamos el score para no contabilizar de más por cada burbuja que se tocó. Despues de contabilizarla se cambia el valor counters a true para indicar que ya fue contabilizada.
            if (!bubbles[j].counters) {
                score++;
                bubbles[j].counters = true;
                bubbles.splice(j, 1);
            }
        }
    }
}

function speedGame() {
      if (score ===5) {
            enemy.speed1()
      } else if (score === 10) {
            enemy.speed2()
      } else if (score === 15) {
            gameWin = true;
      }
      
}
// Funcion para el efecto del agua infinita
function handbackground() {
      bg.x--;
      if (bg.x< - bg.width) bg.x = 0;
      ctx.drawImage(background, bg.x, bg.y, bg.width, bg.height);
      ctx.drawImage(background, bg.x + bg.width, bg.y, bg.width, bg.height);
}
//Animation Loop
function animation() {
      //speedGame();
      ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      handbackground();
      handbubbles();
      player.draw();
      lives.draw();
      lives.Text();
      enemy.draw();
      gameFrame++;
      touching();
      ctx.fillStyle = "black";
      ctx.fillText('Score: ' + score, 10, 50);
      speedGame();
      GameOver();
      GameWin();
}

$button.addEventListener('click', event => {
      startGame();
}); 
