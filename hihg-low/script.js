let deck = [];
let dealerValue = 0;
let playersData = [];
let totalPlayers = 0;
let choicesMade = 0;

// 山札作成
function createDeck() {
    let newDeck = [];
    for (let i = 0; i < 4; i++) {
        for (let n = 1; n <= 13; n++) newDeck.push(n);
    }
    return newDeck.sort(() => Math.random() - 0.5);
}

// ユーティリティ：待ち時間
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function initGame(playerCount) {
    totalPlayers = playerCount;
    deck = createDeck();
    playersData = [];
    choicesMade = 0;

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    const area = document.getElementById('players-area');
    area.innerHTML = '';

    // 1. ディーラーに配る
    dealerValue = deck.pop();
    const dCard = document.getElementById('dealer-card');
    dCard.innerText = "🂠";
    dCard.style.backgroundColor = "white";

    document.getElementById('message-area').innerText = "カードを配っています...";

    // 2. プレイヤーに順番に配る
    for (let i = 0; i < playerCount; i++) {
        await sleep(500); // 配る間隔

        const angle = calculateAngle(i, playerCount);
        const x = 425 + 280 * Math.cos(angle); // 中心X + 半径 * cos
        const y = 140 + 280 * Math.sin(angle); // 中心Y + 半径 * sin

        const pVal = deck.pop();
        playersData.push({ val: pVal, choice: null });

        // カード要素
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${i}`;
        card.innerText = pVal;
        // 最初はディーラーの位置
        card.style.left = '50%';
        card.style.top = '40px';
        card.style.transform = 'translateX(-50%) scale(0.2)';
        card.style.opacity = '0';

        // プレイヤー情報
        const box = document.createElement('div');
        box.className = 'player-box';
        box.style.left = `${x}px`;
        box.style.top = `${y}px`;
        box.innerHTML = `
            <div class="player-info">
                <p>Player ${i+1}</p>
                <div id="btns-${i}" class="action-btns">
                    <button onclick="makeChoice(${i}, 'High')">High</button>
                    <button onclick="makeChoice(${i}, 'Low')">Low</button>
                </div>
                <div id="res-${i}" class="result-text"></div>
            </div>
        `;

        area.appendChild(card);
        area.appendChild(box);

        // 目的地へ飛ばすアニメーション
        requestAnimationFrame(() => {
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
            card.style.transform = 'translate(-50%, -50%) scale(1)';
            card.style.opacity = '1';
        });
    }
    document.getElementById('message-area').innerText = "予想を選んでください";
}

function calculateAngle(i, count) {
    if (count === 1) return Math.PI / 2;
    const start = Math.PI * 0.8;
    const end = Math.PI * 0.2;
    return start - ((start - end) / (count - 1)) * i;
}

function makeChoice(idx, type) {
    playersData[idx].choice = type;
    document.getElementById(`btns-${idx}`).innerHTML = `<span style="color:#ffd700">${type}</span>`;
    choicesMade++;

    if (choicesMade === totalPlayers) {
        showResults();
    }
}

async function showResults() {
    document.getElementById('message-area').innerText = "ディーラーがカードをめくります...";
    await sleep(1000);

    const dCard = document.getElementById('dealer-card');
    dCard.innerText = dealerValue;
    dCard.style.backgroundColor = "#ffcccc";

    for (let i = 0; i < totalPlayers; i++) {
        const p = playersData[i];
        const resEl = document.getElementById(`res-${i}`);
        let result = "";

        if (dealerValue === p.val) result = "DRAW";
        else if ((p.choice === 'High' && dealerValue > p.val) || 
                 (p.choice === 'Low' && dealerValue < p.val)) {
            result = "WIN!";
            resEl.className = "result-text win";
        } else {
            result = "LOSE";
            resEl.className = "result-text lose";
        }
        resEl.innerText = result;
    }

    document.getElementById('message-area').innerHTML = 
        `判定終了！ <button onclick="location.reload()">リスタート</button>`;
}