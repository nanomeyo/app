let INITIAL_TIME = 10.00;
let MAX_CARD_VALUE = 13;
let p1Time, p2Time, currentPlayer, deck, timerInterval;
let isGameRunning = false;

const suits = ['♠', '♥', '♦', '♣'];
const allValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// 難易度選択
function startGameWithDiff(maxValue, seconds) {
    MAX_CARD_VALUE = maxValue;
    INITIAL_TIME = seconds;
    
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-board').style.display = 'flex';
    document.getElementById('ready-overlay').style.display = 'flex';
    
    const diffText = maxValue === 5 ? "簡単" : maxValue === 8 ? "普通" : "難しい";
    document.getElementById('selected-diff-label').textContent = `難易度：${diffText} (1-${maxValue})`;

    prepareBoard();
}

// 盤面の準備
function prepareBoard() {
    clearInterval(timerInterval);
    isGameRunning = false;
    p1Time = INITIAL_TIME;
    p2Time = INITIAL_TIME;
    currentPlayer = 1;
    
    createDeck(MAX_CARD_VALUE);
    shuffle();

    document.getElementById('p1-timer').textContent = p1Time.toFixed(2);
    document.getElementById('p2-timer').textContent = p2Time.toFixed(2);
    document.getElementById('deck-count').textContent = deck.length;
    
    const activeCardEl = document.getElementById('active-card');
    activeCardEl.textContent = "";
    activeCardEl.classList.remove('show');

    document.getElementById('p1-btn').disabled = true;
    document.getElementById('p2-btn').disabled = true;
}

// デッキ作成
function createDeck(limit) {
    deck = [];
    for (let s of suits) {
        for (let i = 0; i < limit; i++) {
            deck.push({ suit: s, value: allValues[i] });
        }
    }
}

function shuffle() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// 真のスタート
function realStart() {
    document.getElementById('ready-overlay').style.display = 'none';
    isGameRunning = true;
    updateUI();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (currentPlayer === 1) {
            p1Time -= 0.01;
            if (p1Time <= 0) endGame(2);
            document.getElementById('p1-timer').textContent = Math.max(0, p1Time).toFixed(2);
        } else {
            p2Time -= 0.01;
            if (p2Time <= 0) endGame(1);
            document.getElementById('p2-timer').textContent = Math.max(0, p2Time).toFixed(2);
        }
    }, 10);
}

function updateUI() {
    const p1Area = document.getElementById('p1-area');
    const p2Area = document.getElementById('p2-area');
    const p1Btn = document.getElementById('p1-btn');
    const p2Btn = document.getElementById('p2-btn');

    if (currentPlayer === 1) {
        p1Area.classList.add('active'); p2Area.classList.remove('active');
        p1Btn.disabled = false; p1Btn.textContent = "DRAW";
        p2Btn.disabled = true; p2Btn.textContent = "WAIT";
    } else {
        p1Area.classList.remove('active'); p2Area.classList.add('active');
        p1Btn.disabled = true; p1Btn.textContent = "WAIT";
        p2Btn.disabled = false; p2Btn.textContent = "DRAW";
    }
}

function drawCard() {
    if (!isGameRunning || deck.length === 0) return;
    const card = deck.pop();
    const el = document.getElementById('active-card');
    
    el.classList.add('show');
    el.textContent = `${card.suit}${card.value}`;
    el.style.color = (card.suit === '♥' || card.suit === '♦') ? '#e74c3c' : '#2c3e50';
    
    document.getElementById('deck-count').textContent = deck.length;

    if (deck.length === 0) {
        clearInterval(timerInterval);
        alert("引き分け！カードを使い切りました。");
        returnToHome();
    } else {
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        updateUI();
    }
}

function endGame(winner) {
    isGameRunning = false;
    clearInterval(timerInterval);
    alert(`PLAYER ${winner} の勝利！`);
    returnToHome();
}

function returnToHome() {
    clearInterval(timerInterval);
    document.getElementById('home-screen').style.display = 'flex';
    document.getElementById('game-board').style.display = 'none';
}

// イベント
document.getElementById('actual-start-btn').addEventListener('click', realStart);
document.getElementById('p1-btn').addEventListener('click', drawCard);
document.getElementById('p2-btn').addEventListener('click', drawCard);
document.getElementById('quit-btn').addEventListener('click', returnToHome);