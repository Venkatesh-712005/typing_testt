const textsEasy = [
    "The cat sat on the mat and looked at me with big eyes.",
    "I like to eat pizza on Friday nights with my family.",
    "The sun is bright and the sky is blue today.",
    "Dogs are fun to play with in the park.",
    "She likes to read books before going to bed."
];

const textsMedium = [
    "The quick brown fox jumps over the lazy dog near the riverbank where the sun shines bright.",
    "Programming is not just about writing code but also about solving problems creatively and efficiently.",
    "In the midst of chaos there is also opportunity to learn and grow stronger than ever before.",
    "Success is not final failure is not fatal it is the courage to continue that counts.",
    "The beautiful thing about learning is that nobody can take it away from you once acquired."
];

const textsHard = [
    "Extraordinarily sophisticated algorithms revolutionize technological implementations through unprecedented computational methodologies.",
    "Phenomenological epistemology necessitates comprehensive understanding of multidimensional philosophical frameworks and abstract conceptualizations.",
    "Cryptographic authentication mechanisms utilize asymmetric encryption protocols to ensure confidentiality and integrity.",
    "Quantum entanglement demonstrates counterintuitive phenomena challenging conventional interpretations of physical reality.",
    "Neuroplasticity facilitates synaptic reorganization enabling cognitive adaptability through experiential learning paradigms."
];

let currentText = '';
let currentIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let startTime = 0;
let timerInterval = null;
let timeLeft = 60;
let maxTime = 60;
let isTestActive = false;
let currentDifficulty = 'easy';

const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress');
const modal = document.getElementById('result-modal');

// Setting buttons event listeners
document.querySelectorAll('.setting-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (isTestActive) return;

        const group = this.parentElement;
        group.querySelectorAll('.setting-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        if (this.dataset.difficulty) {
            currentDifficulty = this.dataset.difficulty;
            initTest();
        }

        if (this.dataset.time) {
            maxTime = parseInt(this.dataset.time);
            timeLeft = maxTime;
            timerDisplay.textContent = timeLeft + 's';
        }
    });
});

function getTextsForDifficulty() {
    switch(currentDifficulty) {
        case 'easy': return textsEasy;
        case 'medium': return textsMedium;
        case 'hard': return textsHard;
        default: return textsEasy;
    }
}

function initTest() {
    const texts = getTextsForDifficulty();
    currentText = texts[Math.floor(Math.random() * texts.length)];
    textDisplay.innerHTML = currentText.split('').map((char, idx) => 
        `<span class="char" data-index="${idx}">${char}</span>`
    ).join('');
    currentIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    timeLeft = maxTime;
    updateStats();
    highlightCurrentChar();
}

function startTest() {
    if (isTestActive) return;
    
    isTestActive = true;
    startTime = Date.now();
    inputField.disabled = false;
    inputField.focus();
    inputField.value = '';
    startBtn.textContent = 'Testing...';
    startBtn.disabled = true;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft + 's';
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    inputField.disabled = true;
    startBtn.textContent = 'Start Test';
    startBtn.disabled = false;
    showResults();
    createFireworks();
}

function highlightCurrentChar() {
    document.querySelectorAll('.char').forEach(char => {
        char.classList.remove('current');
    });
    
    if (currentIndex < currentText.length) {
        const currentChar = document.querySelector(`[data-index="${currentIndex}"]`);
        if (currentChar) {
            currentChar.classList.add('current');
        }
    }
}

function updateStats() {
    const timeElapsed = (maxTime - timeLeft) || 1;
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const progress = (currentIndex / currentText.length) * 100;

    wpmDisplay.textContent = wpm > 0 ? wpm : 0;
    accuracyDisplay.textContent = accuracy + '%';
    progressBar.style.width = progress + '%';
}

inputField.addEventListener('input', (e) => {
    if (!isTestActive) return;

    const typedChar = e.data;
    const currentChar = currentText[currentIndex];
    const charElement = document.querySelector(`[data-index="${currentIndex}"]`);

    if (typedChar === currentChar) {
        charElement.classList.add('correct');
        charElement.classList.remove('incorrect');
        correctChars++;
        currentIndex++;
    } else if (typedChar !== null) {
        charElement.classList.add('incorrect');
        charElement.classList.remove('correct');
        incorrectChars++;
        currentIndex++;
    }

    highlightCurrentChar();
    updateStats();

    if (currentIndex >= currentText.length) {
        endTest();
    }
});

startBtn.addEventListener('click', () => {
    initTest();
    startTest();
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTestActive = false;
    inputField.disabled = true;
    inputField.value = '';
    startBtn.textContent = 'Start Test';
    startBtn.disabled = false;
    initTest();
});

function showResults() {
    const timeElapsed = maxTime - timeLeft;
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    const difficultyBadges = {
        easy: '<span class="difficulty-badge difficulty-easy">EASY</span>',
        medium: '<span class="difficulty-badge difficulty-medium">MEDIUM</span>',
        hard: '<span class="difficulty-badge difficulty-hard">HARD</span>'
    };

    document.getElementById('final-wpm').innerHTML = wpm + difficultyBadges[currentDifficulty];
    document.getElementById('final-accuracy').textContent = accuracy + '%';
    document.getElementById('final-correct').textContent = correctChars;
    document.getElementById('final-incorrect').textContent = incorrectChars;

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
    resetBtn.click();
}

function createFireworks() {
    const colors = ['#667eea', '#764ba2', '#28a745', '#ffc107', '#dc3545'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            firework.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
            firework.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
            document.body.appendChild(firework);

            setTimeout(() => firework.remove(), 1000);
        }, i * 50);
    }
}

// Initialize on load
initTest();

// Theme toggle: read preference, apply theme, and persist changes
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-pressed', theme === 'dark');
    }
}

// Initialize theme on page load
(function initTheme() {
    try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        applyTheme(theme);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
            });
        }
    } catch (e) {
        // ignore storage errors
        console.error(e);
    }
})();