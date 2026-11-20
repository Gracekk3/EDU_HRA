
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const results = document.getElementById("results");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const levelText = document.getElementById("level");
const questionText = document.getElementById("question");
const finalScore = document.getElementById("finalScore");

let questions = [];
let questionIndex = 0;
let score = 0;
let lives = 3;
let correctCount = 0;
let playing = false;
let paused = false;
let lastTime = 0;
let animationId = null;
let questionToken = 0;

const keys = {
    left: false,
    right: false
};

const player = {
    x: 420,
    y: 440,
    width: 60,
    height: 30,
    speed: 430
};

let answers = [];

const stars = Array.from({ length: 45 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1
}));

// Načtení otázek z JSON
async function loadQuestions() {
    const response = await fetch("questions.json");

    if (!response.ok) {
        throw new Error("Nepodařilo se načíst questions.json");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Soubor neobsahuje otázky.");
    }

    return data;
}

// Spuštění hry
async function startGame() {
    startBtn.disabled = true;

    try {
        questions = await loadQuestions();
    } catch (error) {
        alert(
            "Nepodařilo se načíst otázky. " +
            "Spusť projekt přes Live Server ve VS Code."
        );
        startBtn.disabled = false;
        return;
    }

    cancelAnimationFrame(animationId);
    questionToken++;

    score = 0;
    lives = 3;
    correctCount = 0;
    questionIndex = 0;
    playing = true;
    paused = false;
    lastTime = 0;

    player.x = 420;

    menu.style.display = "none";
    results.style.display = "none";
    game.style.display = "block";

    updateStats();
    nextQuestion();

    animationId = requestAnimationFrame(gameLoop);
    startBtn.disabled = false;
}

// Aktualizace skóre
function updateStats() {
    scoreText.textContent = "Body: " + score;
    livesText.textContent = "Životy: " + lives;
    levelText.textContent =
        "Otázka: " + (questionIndex + 1) + "/" + questions.length;
}

// Nová otázka
function nextQuestion() {
    if (!playing) return;

    if (questionIndex >= questions.length || lives <= 0) {
        endGame();
        return;
    }

    paused = false;

    const question = questions[questionIndex];

    questionText.textContent = question.question;

    answers = question.answers.map((text, index) => ({
        text: text,
        x: 14 + index * 222,
        y: -95,
        width: 205,
        height: 65,
        correct: index === question.correct
    }));

    updateStats();
}

// Vykreslení pozadí
function drawBackground() {
    ctx.fillStyle = "#090e22";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#344b88";

    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    ctx.strokeStyle = "#162c59";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Vykreslení dronu
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00e5ff";

    ctx.fillStyle = "#00e5ff";
    ctx.beginPath();
    ctx.moveTo(player.width / 2, 0);
    ctx.lineTo(player.width, player.height);
    ctx.lineTo(0, player.height);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(25, 15, 10, 8);

    ctx.fillStyle = "#8454ff";
    ctx.fillRect(10, 29, 10, 8);
    ctx.fillRect(40, 29, 10, 8);

    ctx.restore();
}

// Zalamování textu
function drawWrappedText(text, centerX, centerY, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    words.forEach(word => {
        const test = line ? line + " " + word : word;

        if (
            ctx.measureText(test).width > maxWidth &&
            line !== ""
        ) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    });

    if (line) lines.push(line);

    const lineHeight = 17;
    const startY =
        centerY - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((textLine, index) => {
        ctx.fillText(
            textLine,
            centerX,
            startY + index * lineHeight
        );
    });
}

// Vykreslení odpovědí
function drawAnswers() {
    answers.forEach(answer => {
        ctx.fillStyle = "#24376b";
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(
            answer.x,
            answer.y,
            answer.width,
            answer.height,
            12
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        drawWrappedText(
            answer.text,
            answer.x + answer.width / 2,
            answer.y + answer.height / 2,
            answer.width - 16
        );
    });
}

// Detekce kolize
function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Vyhodnocení odpovědi
function checkAnswer(answer) {
    if (paused || !playing) return;

    paused = true;

    const question = questions[questionIndex];

    if (answer.correct) {
        score += 100;
        correctCount++;
        questionText.textContent =
            "✅ Správně! " + question.explanation;
    } else {
        lives--;

        questionText.textContent =
            "❌ Špatně! Správná odpověď: " +
            question.answers[question.correct] +
            ". " + question.explanation;
    }

    updateStats();

    const token = ++questionToken;

    setTimeout(() => {
        if (!playing || token !== questionToken) return;

        questionIndex++;
        nextQuestion();
    }, 1800);
}

// Hlavní herní smyčka
function gameLoop(timestamp) {
    if (!playing) return;

    if (!lastTime) lastTime = timestamp;

    const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    drawBackground();

    if (!paused) {
        if (keys.left) {
            player.x -= player.speed * delta;
        }

        if (keys.right) {
            player.x += player.speed * delta;
        }

        player.x = Math.max(
            0,
            Math.min(canvas.width - player.width, player.x)
        );

        const fallingSpeed = 85 + questionIndex * 8;

        answers.forEach(answer => {
            answer.y += fallingSpeed * delta;
        });

        const hit = answers.find(answer =>
            isColliding(player, answer)
        );

        if (hit) {
            checkAnswer(hit);
        } else if (
            answers.length > 0 &&
            answers.every(answer => answer.y > canvas.height)
        ) {
            paused = true;
            lives--;
            questionText.textContent =
                "⌛ Nestihl jsi žádnou odpověď!";

            updateStats();

            const token = ++questionToken;

            setTimeout(() => {
                if (!playing || token !== questionToken) return;

                questionIndex++;
                nextQuestion();
            }, 1200);
        }
    }

    drawAnswers();
    drawPlayer();

    if (playing) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Konec hry
function endGame() {
    playing = false;
    paused = false;
    questionToken++;

    cancelAnimationFrame(animationId);

    game.style.display = "none";
    results.style.display = "block";

    const percentage = Math.round(
        (correctCount / questions.length) * 100
    );

    const previousBest = Number(
        localStorage.getItem("webQuestBest") || 0
    );

    const best = Math.max(score, previousBest);

    localStorage.setItem("webQuestBest", best);

    finalScore.innerHTML =
        "Získané body: " + score +
        "<br>Správné odpovědi: " +
        correctCount + "/" + questions.length +
        "<br>Úspěšnost: " + percentage + "%" +
        "<br>Osobní rekord: " + best;
}

// Ovládání klávesnicí
document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (["arrowleft", "arrowright", "a", "d"].includes(key)) {
        event.preventDefault();
    }

    if (key === "arrowleft" || key === "a") {
        keys.left = true;
    }

    if (key === "arrowright" || key === "d") {
        keys.right = true;
    }
});

document.addEventListener("keyup", event => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
        keys.left = false;
    }

    if (key === "arrowright" || key === "d") {
        keys.right = false;
    }
});

// Tlačítka
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
