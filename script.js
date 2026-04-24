// typing effect for green screen
const textArray = [
    "> INITIALIZING CYBER SECURITY PROTOCOLS...",
    "> CONNECTING TO SATELLITE FEED...",
    "> LOADING RADAR MODULES...",
    "> ACTIVATING INTRUSION DETECTION...",
    "> SYSTEM READY. PRESS 'GO' TO LAUNCH RADAR."
];

let textIndex = 0;
let charIndex = 0;
const typedTextElement = document.getElementById('typed-text');

function typeEffect() {
    if (textIndex < textArray.length) {
        if (charIndex < textArray[textIndex].length) {
            typedTextElement.innerHTML += textArray[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, 50);
        } else {
            textIndex++;
            charIndex = 0;
            typedTextElement.innerHTML += '<br>$ ';
            setTimeout(typeEffect, 300);
        }
    }
}

typeEffect();

// threat level random simulation
setInterval(() => {
    const threatSpan = document.getElementById('threat-level');
    if (threatSpan) {
        const levels = ['🟢 LOW', '🟡 MEDIUM', '🟠 HIGH', '🔴 CRITICAL'];
        const randomLevel = levels[Math.floor(Math.random() * levels.length)];
        threatSpan.innerHTML = randomLevel;
        if (randomLevel.includes('CRITICAL')) {
            threatSpan.style.color = '#ff0000';
            threatSpan.style.animation = 'pulse 0.5s infinite';
        } else if (randomLevel.includes('HIGH')) {
            threatSpan.style.color = '#ff6600';
        } else {
            threatSpan.style.color = '#ffaa00';
        }
    }
}, 4000);

// SOUND effect
let clickSound = null;
try {
    clickSound = new Audio('https://www.soundjay.com/misc/sounds/beep-07.mp3');
} catch(e) { console.log("audio not loaded"); }

// GO button event
document.getElementById('goButton').addEventListener('click', () => {
    if (clickSound) clickSound.play().catch(e=>console.log);
    
    // fade out green screen
    document.querySelector('.terminal-container').style.transition = 'opacity 0.4s';
    document.querySelector('.terminal-container').style.opacity = '0';
    
    setTimeout(() => {
        location.href = 'radar.html';
    }, 450);
});