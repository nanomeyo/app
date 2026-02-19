let scores = [1, 1];
let turnCount = [0, 0]; 
let currentPlayer = 0; // 0: P1, 1: P2
let currentCard = 0;

const scoreEls = [document.getElementById('score0'), document.getElementById('score1')];
const cardValEl = document.getElementById('card-val');
const drawBtn = document.getElementById('draw-btn');
const controlsEl = document.getElementById('controls');
const messageEl = document.getElementById('message');
const turnEl = document.getElementById('turn-display');
const roundEl = document.getElementById('round-num');

// 1. カードを引く
function drawCard() {
    currentCard = Math.floor(Math.random() * 13) + 1;
    cardValEl.innerText = currentCard;
    
    drawBtn.style.display = 'none';
    controlsEl.style.display = 'grid';
    messageEl.innerText = "どう計算する？";
}

// 2. 計算する
function calculate(op) {
    let score = scores[currentPlayer];

    if (op === '+') score += currentCard;
    else if (op === '-') score -= currentCard;
    else if (op === '*') score *= currentCard;
    else if (op === '/') score = Math.floor(score / currentCard);

    scores[currentPlayer] = score;
    scoreEls[currentPlayer].innerText = score;
    turnCount[currentPlayer]++;

    checkGameState();
}

// 3. ゲームの状態を確認
function checkGameState() {
    // 両方のプレイヤーが4回ずつ終わったか判定
    if (turnCount[0] === 4 && turnCount[1] === 4) {
        determineWinner();
    } else {
        // 次のプレイヤーに交代
        document.getElementById(`p${currentPlayer}-ui`).classList.remove('active');
        currentPlayer = (currentPlayer === 0) ? 1 : 0;
        document.getElementById(`p${currentPlayer}-ui`).classList.add('active');

        // ラウンド表示の修正
        // 両プレイヤーの合計ターン数から、今のラウンドを計算
        // (0+0)/2 + 1 = 1, (1+0)/2 + 1 = 1.5(切捨で1), (1+1)/2 + 1 = 2...
        let currentRound = Math.floor((turnCount[0] + turnCount[1]) / 2) + 1;
        if (currentRound > 4) currentRound = 4;
        roundEl.innerText = currentRound;

        turnEl.innerText = `プレイヤー${currentPlayer + 1}の番です`;
        
        // UIリセット
        cardValEl.innerText = '?';
        drawBtn.style.display = 'block';
        controlsEl.style.display = 'none';
        messageEl.innerText = "";
    }
}

// 4. 勝敗判定
function determineWinner() {
    const diff1 = Math.abs(200 - scores[0]);
    const diff2 = Math.abs(200 - scores[1]);

    let resultMsg = "";
    if (diff1 < diff2) {
        resultMsg = `Player 1 の勝利！ (200まであと ${diff1})`;
    } else if (diff2 < diff1) {
        resultMsg = `Player 2 の勝利！ (200まであと ${diff2})`;
    } else {
        resultMsg = "まさかの引き分け！";
    }

    messageEl.innerHTML = `GAME OVER<br>${resultMsg}`;
    drawBtn.style.display = 'none';
    controlsEl.style.display = 'none';
    turnEl.innerText = "結果発表！";
}

// リセット
function resetGame() {
    scores = [1, 1];
    turnCount = [0, 0];
    currentPlayer = 0;
    scoreEls[0].innerText = '1';
    scoreEls[1].innerText = '1';
    roundEl.innerText = '1';
    cardValEl.innerText = '?';
    turnEl.innerText = `プレイヤー1の番です`;
    document.getElementById('p0-ui').classList.add('active');
    document.getElementById('p1-ui').classList.remove('active');
    drawBtn.style.display = 'block';
    controlsEl.style.display = 'none';
    messageEl.innerText = "";
}