let score = 0;
let lives = 3;
let timeLeft = 60;
let gameActive = false;
let gameInterval, timerInterval;

function startGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    gameActive = true;

    document.getElementById('game-overlay').style.display = 'none';
    updateUI();

    // Spawn a drop every 800ms
    gameInterval = setInterval(spawnDrop, 800);

    // Countdown timer
    timerInterval = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0 || lives <= 0) endGame();
    }, 1000);
}

function spawnDrop() {
    if (!gameActive) return;

    const playSpace = document.getElementById('play-space');
    const drop = document.createElement('div');
    
    // 70% chance for clean drop [cite: 93]
    const isClean = Math.random() > 0.3;
    drop.className = isClean ? 'drop clean' : 'drop polluted';
    
    // Random position
    drop.style.left = Math.random() * (playSpace.offsetWidth - 40) + 'px';
    
    drop.onclick = function() {
        if (isClean) {
            score += 10; // [cite: 105]
        } else {
            score -= 15; // [cite: 106]
            lives--;     // [cite: 98]
        }
        updateUI();
        drop.remove();
        if (lives <= 0) endGame();
    };

    playSpace.appendChild(drop);

    // Cleanup if not clicked
    setTimeout(() => { if(drop) drop.remove(); }, 3000);
}

function updateUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = timeLeft;
    document.getElementById('lives').innerText = "❤️".repeat(lives);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    alert(`Game Over! Final Score: ${score}\nKeep spreading awareness for clean water! [cite: 124]`);
    document.getElementById('game-overlay').style.display = 'flex';
    document.getElementById('start-btn').innerText = "Play Again";
}

/* BUBBLE INTERACTIVITY: clicking a bubble pops it and grants a small bonus. */
function initBubbles() {
    const playSpace = document.getElementById('play-space');

    // Add click handlers to existing bubbles
    function attachHandlers(b) {
        if (!b) return;
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            if (b.classList.contains('pop')) return;
            b.classList.add('pop');
            // small reward for popping a bubble
            score += 1;
            updateUI();
            // remove after pop animation
            setTimeout(() => b.remove(), 450);
        });
    }

    document.querySelectorAll('.bg-bubble').forEach(attachHandlers);

    // Periodically spawn extra decorative bubbles so background stays lively
    setInterval(() => {
        if (!playSpace) return;
        spawnBubble(playSpace);
    }, 1800);
}

function spawnBubble(container) {
    const playSpace = container || document.getElementById('play-space');
    const b = document.createElement('div');
    b.className = 'bg-bubble';
    // random size class
    const r = Math.random();
    if (r < 0.12) b.classList.add('large');
    else if (r < 0.4) b.classList.add('small');

    // random left position
    const left = Math.floor(Math.random() * 90) + 2;
    b.style.left = left + '%';
    // random animation delay so they don't sync
    b.style.animationDelay = (Math.random() * 1.8) + 's';

    attachBubbleClick(b);
    playSpace.appendChild(b);

    // cleanup after full rise duration (match CSS ~10s max)
    setTimeout(() => { if (b && b.remove) b.remove(); }, 11000);
}

function attachBubbleClick(b) {
    b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (b.classList.contains('pop')) return;
        b.classList.add('pop');
        score += 1;
        updateUI();
        setTimeout(() => b.remove(), 450);
    });
}

// Initialize bubble handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initBubbles();
});