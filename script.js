let highScore;
let startTime;
let elapsedTime;
let running = false;

let cols = 6;
let rows = 3;
let cardWidth, cardHeight, marginX, marginY;

let cards = [];
let firstCard = null;
let secondCard = null;

function getLevelFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('level');
}

function setup() {
    const level = getLevelFromURL();
    document.getElementById('level-display').innerHTML = level;
    document.getElementById('timer-display').innerHTML = '00:00';

    let seconds = Math.floor(highScore / 1000 % 60);
    let minutes = Math.floor(highScore / 60000);
    let highScoreDisplay = nf(minutes, 2) + ":" + nf(seconds, 2);
    document.getElementById('high-score-display').innerHTML = highScore ? highScoreDisplay : '-';

    createCanvas(1200, 600).parent('canvas-container');
    cardWidth = width / cols;
    cardHeight = height / rows;
    marginX = cardWidth / 5;
    marginY = cardHeight / 10;

    let cardValues = [];
    for (let i = 1; i <= (cols * rows) / 2; i++) {
        cardValues.push(i, i);
    }

    cardValues = shuffle(cardValues);

    for (let i = 0; i < cols; i++) {
        cards[i] = [];
        for (let j = 0; j < rows; j++) {
            cards[i][j] = {
                value: cardValues.pop(),
                isFlipped: false,
                pos: { x: i * cardWidth, y: j * cardHeight }
            };
        }
    }
}

function draw() {
    background(255);
    flippedCardCount = 0;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let card = cards[i][j];

            if (card.isFlipped) {
                flippedCardCount++;
                fill(200);
                rect(card.pos.x + marginX, card.pos.y + marginY, cardWidth - marginX, cardHeight - marginY);
                fill(0);
                textSize(32);
                textAlign(CENTER, CENTER);
                text(card.value, card.pos.x + cardWidth / 2, card.pos.y + cardHeight / 2);
            } else {
                fill(150);
                rect(card.pos.x + marginX, card.pos.y + marginY, cardWidth - marginX, cardHeight - marginY);
                fill(255);
                textSize(64);
                textAlign(CENTER, CENTER);
                text('?', card.pos.x + marginX + (cardWidth - marginX) / 2, card.pos.y + marginY + (cardHeight - marginY) / 2);
            }
        }
    }

    if (running) {
        elapsedTime = millis() - startTime;
        let seconds = Math.floor(elapsedTime / 1000 % 60);
        let minutes = Math.floor(elapsedTime / 60000);
        let timerDisplay = nf(minutes, 2) + ":" + nf(seconds, 2);
        document.getElementById('timer-display').innerHTML = timerDisplay;
    }

    // if game ends
    if (flippedCardCount === cols * rows) {
        if (!highScore) {
            highScore = elapsedTime;
        } else if (elapsedTime < highScore) {
            highScore = elapsedTime;
        }

        let seconds = Math.floor(highScore / 1000 % 60);
        let minutes = Math.floor(highScore / 60000);
        let highScoreDisplay = nf(minutes, 2) + ":" + nf(seconds, 2);
        document.getElementById('high-score-display').innerHTML = highScoreDisplay;
        running = false;

        const winPopup = document.getElementById('win-popup');
        winPopup.classList.remove('d-none');
    }
}

function startPauseResumeGame() {
    const status = document.getElementById('start-pause-resume').innerHTML;
    const button = document.getElementById('start-pause-resume-button');

    if (status === 'Start') {
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        startGame();
        document.getElementById('start-pause-resume').innerHTML = 'Pause';
    } else if (status === 'Pause') {
        button.classList.remove('btn-primary');
        button.classList.add('btn-warning');
        pauseGame();
        document.getElementById('start-pause-resume').innerHTML = 'Resume';
    } else {
        button.classList.remove('btn-warning');
        button.classList.add('btn-primary');
        resumeGame();
        document.getElementById('start-pause-resume').innerHTML = 'Pause';
    }
}

function startGame() {
    if (!running) {
        running = true;
        startTime = millis();
    }
}

function pauseGame() {
    if (running) {
        running = false;
    }
}

function resumeGame() {
    if (!running) {
        running = true;
        startTime = millis() - elapsedTime;
    }
}

function restartGame() {
    const button = document.getElementById('start-pause-resume-button');
    button.classList.add('btn-success');
    button.classList.remove('btn-primary');
    document.getElementById('start-pause-resume').innerHTML = 'Start';

    document.getElementById('win-popup').classList.add('d-none');

    setup();
}

function mousePressed() {
    if (running && !(firstCard && secondCard)) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let card = cards[i][j];
                if (!card.isFlipped && mouseX > card.pos.x + marginX && mouseX < card.pos.x + cardWidth && mouseY > card.pos.y + marginY && mouseY < card.pos.y + marginY + cardHeight) {
                    card.isFlipped = true;
                    flipCard(card);
                    return;
                }
            }
        }
    }
}

function flipCard(card) {
    console.log('flipped: ' + card.value);
    if (firstCard == null) {
        firstCard = card;
    } else if (secondCard == null) {
        secondCard = card;
        if (firstCard.value !== secondCard.value) {
            setTimeout(() => {
                firstCard.isFlipped = false;
                secondCard.isFlipped = false;
                firstCard = null;
                secondCard = null;
            }, 1000);
        } else {
            firstCard = null;
            secondCard = null;
        }
    }
}

window.onload = setup;