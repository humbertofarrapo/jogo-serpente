// Seleciona o elemento do canvas e o contexto 2D para desenho
const gameBoard = document.querySelector("#gameboard");
const ctx = gameBoard.getContext("2d");

// Seleciona elementos HTML importantes
const scoreText = document.querySelector("#scoretext");
const resetBtn = document.querySelector("#resetbtn");

// Define as dimensões do jogo e cores dos elementos
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25; // Define o tamanho de cada unidade no jogo

// Variáveis de controle do jogo
let running = false; // Indica se o jogo está em andamento
let xVelocity = unitSize; // Velocidade inicial no eixo X
let yVelocity = 0; // Velocidade inicial no eixo Y
let foodX; // Posição X da comida
let foodY; // Posição Y da comida
let score = 0; // Pontuação do jogador
let snake = [
    { x: unitSize * 4, y: 0 }, // Cria uma cobra inicialmente
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

// Event listener para capturar as teclas pressionadas
window.addEventListener("keydown", changeDirection);

// Event listener para o botão de reset
resetBtn.addEventListener("click", resetGame);

// Inicia o jogo
gameStart();

function gameStart() {
    running = true; // Define que o jogo está em andamento
    scoreText.textContent = score; // Atualiza a pontuação exibida
    createFood(); // Cria comida no jogo
    drawFood(); // Desenha a comida
    nextTick(); // Inicia o loop principal do jogo
};

// Função que controla o loop principal do jogo
function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard(); // Limpa o tabuleiro
            drawFood(); // Desenha a comida
            moveSnake(); // Move a cobra
            drawSnake(); // Desenha a cobra
            checkGameOver(); // Verifica se o jogo acabou
            nextTick(); // Chama recursivamente para continuar o loop
        }, 75); // Define o intervalo entre cada tick do jogo
    } else {
        displayGameOver(); // Exibe a tela de fim de jogo
    }
};

// Limpa o tabuleiro do jogo
function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

// Cria comida em uma posição aleatória no jogo
function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};

// Desenha a comida no tabuleiro
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

// Move a cobra pela tela
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

    snake.unshift(head);
    // Se a comida foi comida
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1; // Aumenta a pontuação
        scoreText.textContent = score; // Atualiza a pontuação exibida
        createFood(); // Cria uma nova comida
    } else {
        snake.pop(); // Remove a cauda da cobra
    }
};

// Desenha a cobra no tabuleiro
function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

// Função para alterar a direção da cobra com base na tecla pressionada
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch (true) {
        case (keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

// Verifica se o jogo acabou
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
};

// Exibe a tela de fim de jogo
function displayGameOver() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("FIM!", gameWidth / 2, gameHeight / 2);
    running = false;
};

// Reseta o jogo
function resetGame() {
    score = 0; // Zera a pontuação
    xVelocity = unitSize; // Reseta a velocidade da cobra
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 }, // Reseta a posição inicial da cobra
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }

    ];
    gameStart(); // Inicia o jogo novamente
};
