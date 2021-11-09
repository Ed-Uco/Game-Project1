//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
gameOver = false;
//Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      click: false,
}
canvas.addEventListener('mousedown', function (event) {
      mouse.click = true;
      mouse.x = event.x - canvasPosition.left;
      mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function (event) {
      mouse.click = false;
      
})
//Player
class Player {
      constructor() {
            this.x = canvas.width;
            this.y = canvas.height / 2;
            this.radius = 50;
            this.angle = 0;
            this.frameX = 0;
            this.frameY = 0;
            this.spriteWidth = 498;
            this.spriteHeight = 327;
      }
      update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            if (mouse.x != this.x) {
                  this.x -= dx / 10;
            }
            if (mouse.y != this.y) {
                  this.y -= dy / 10;
            }
      }
      draw() {
            if (mouse.click) {
                  ctx.lineWidth = 0.2;
                  ctx.beginPath();
                  ctx.moveTo(this.x, this.y);
                  ctx.lineTo(mouse.x, mouse.y);
                  ctx.stroke();
            }
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
      }
}
/* const enemyImage = new Image();
enemyImage = 'enemy1.png';  */

class Enemy {
      constructor() {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.radius = 60;
            this.speed = Math.random() * 2 + 2;
            this.frame = 0;
            this.frameX = 0;
            this.frameY = 0
            this.img1 = new Image();
            this.imag2 = new Image();
            this.img3 = new Image();
            this.img4 = new Image();
            this.animation = 0;
            this.vy = 0;

      }
      draw() {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            /* ctx.drawImage(enemyImage); */
      }
      update() {
            this.x -= this.speed;
            if (this.x < 0 - this.radius * 2) {
                  this.x = canvas.width + 200;
                  this.y = Math.random() * (canvas.height - 150) + 90;
                  this.speed = Math.random() * 2 + 2;
            }
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            //Para detectar la colision entre los circulos
            distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.radius + player.radius) {
                  GameOver();
            }
      }
}
const player = new Player();

//Bubbles
const bubbles = [];


class Bubble {
      constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * canvas.height;
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
            //Se dibujan los circulos objetivo.
            /* ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.stroke(); */
            this.image = new Image();
            this.image.src = '/images/bubble_pop.png';
            ctx.drawImage(this.image, this.x - 50, this.y - 50, this.radius * 2, this.radius * 2);
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
const enemy = new Enemy();
function handleEnemies() {
      enemy.draw();
      enemy.update();

}

function GameOver() {
      ctx.fillStyle = 'black';
      ctx.fillText('GAME OVER, your score is ' + score, 130, 250);
      gameOver = true;
}
const background = new Image();
background.src = 'images/background.png';

function handbackground() {
      ctx.drawImage(background,0,0,canvas.width,100);
}
//Animation Loop
function animation() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handbackground();
      handbubbles();
      player.update();
      player.draw();
      handleEnemies();
      gameFrame++;
      ctx.fillText('Score: ' + score, 10, 50);
      if (score === 2) {
          ctx.fillText('Wow!! You are awesome!!', 80, 80);
      }
      if(!gameOver)requestAnimationFrame(animation);
}
animation();