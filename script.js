// BOARD

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// BIRD

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

// console.log(birdX);

let bird = {

    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}
// pipes

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX  = -2;// pipes moving left speed
let velocityY  = 0; // bird jump speed
let gravity = 0.4;// stops bird from going off the board

let gameOver = false;
let score = 0;

window.onload = function (){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");// used for drawing on the board

    // draw flappy bird

    context.fillstyle = "green";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // load images

    birdImg = new Image();
    birdImg.src = './flappybird.png';
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}
topPipeImg = new Image();
topPipeImg.src = './toppipe.png';

bottomPipeImg = new Image();
bottomPipeImg.src = './bottompipe.png';

requestAnimationFrame(update);

setInterval(placePipes, 1500);

document.addEventListener("keydown", moveBird);
}

function update(){
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // applies gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

if (bird.y > board.height) {
    gameOver = true;
}

    // pipes

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

if (!pipe.passed && bird.x > pipe.x + pipe.width ) {
    score += 0.5; // 0.5 because there are 2 pipes! so 0.5*2 = 1 for ecah set of pipes
    pipe.passed = true;
}

        if (collision(bird, pipe)) {
            gameOver = true;

        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();// removes first element from array
    }

    // score
    context.fillstyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90)
    }
}

function placePipes() {
if (gameOver) {
    return;
}
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2 );// changes the size of topPip
    let openingSpace = board.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // jump
        velocityY = -6;

        // reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }

    }
}

function collision (a,b){

    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}