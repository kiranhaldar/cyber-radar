const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');

let angle = 0;
let threats = [];
let attackLogs = [];
let threatCount = 0;
let missiles = [];

const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;
const RADIUS = 280;

// generate random threats
function generateThreat() {
    const types = ['DDoS', 'Malware', 'Phishing', 'Ransomware', 'ZeroDay', 'APT Attack', 'SQL Injection', 'XSS', 'MITM', 'Botnet'];
    const severity = ['Low', 'Medium', 'High', 'Critical'];
    
    const rad = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 230;
    const x = CENTER_X + Math.cos(rad) * dist;
    const y = CENTER_Y + Math.sin(rad) * dist;
    
    return {
        x, y,
        rad, dist,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severity[Math.floor(Math.random() * severity.length)],
        id: Date.now() + Math.random(),
        size: 6 + Math.random() * 8,
        blink: 0
    };
}

// add random attack
function addRandomAttack() {
    if (threats.length < 18) {
        const newThreat = generateThreat();
        threats.push(newThreat);
        attackLogs.unshift({
            time: new Date().toLocaleTimeString(),
            type: newThreat.type,
            severity: newThreat.severity,
            status: '⚠️ DETECTED'
        });
        threatCount++;
        document.getElementById('threatCount').innerText = threatCount;
        
        // update last attack
        document.getElementById('lastAttack').innerHTML = `${newThreat.type} (${newThreat.severity})`;
    }
}

// draw radar grid
function drawGrid() {
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    
    // circles
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, RADIUS * (i / 4), 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // center dot
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff41';
    ctx.fill();
    
    // cross lines
    ctx.beginPath();
    ctx.moveTo(CENTER_X - RADIUS, CENTER_Y);
    ctx.lineTo(CENTER_X + RADIUS, CENTER_Y);
    ctx.moveTo(CENTER_X, CENTER_Y - RADIUS);
    ctx.lineTo(CENTER_X, CENTER_Y + RADIUS);
    ctx.stroke();
    
    // angle markers
    for (let a = 0; a < 360; a += 45) {
        let rad = a * Math.PI / 180;
        let x1 = CENTER_X + Math.cos(rad) * (RADIUS - 10);
        let y1 = CENTER_Y + Math.sin(rad) * (RADIUS - 10);
        let x2 = CENTER_X + Math.cos(rad) * RADIUS;
        let y2 = CENTER_Y + Math.sin(rad) * RADIUS;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

// draw threats with glow
function drawThreats() {
    for (let t of threats) {
        let color = '#00ff41';
        if (t.severity === 'High') color = '#ffaa00';
        if (t.severity === 'Critical') color = '#ff0000';
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.fillText(t.type.substring(0,4), t.x-12, t.y-8);
    }
    ctx.shadowBlur = 0;
}

// draw scanning line
function drawScanLine() {
    const rad = angle * Math.PI / 180;
    const x2 = CENTER_X + Math.cos(rad) * RADIUS;
    const y2 = CENTER_Y + Math.sin(rad) * RADIUS;
    
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#88ff88';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x2, y2, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#aaffaa';
    ctx.fill();
}

// collision detection (attack hit)
function detectHits() {
    const hitAngle = angle * Math.PI / 180;
    for (let i = 0; i < threats.length; i++) {
        const t = threats[i];
        const threatAngle = Math.atan2(t.y - CENTER_Y, t.x - CENTER_X);
        const angleDiff = Math.abs(threatAngle - hitAngle);
        
        if (angleDiff < 0.1 && Math.hypot(t.x - CENTER_X, t.y - CENTER_Y) < RADIUS) {
            attackLogs.unshift({
                time: new Date().toLocaleTimeString(),
                type: t.type,
                severity: t.severity,
                status: '💥 NEUTRALIZED'
            });
            threats.splice(i,1);
            break;
        }
    }
}

// update logs UI
function updateLogs() {
    const logDiv = document.getElementById('attackLogs');
    if (logDiv) {
        logDiv.innerHTML = attackLogs.slice(0, 8).map(log => 
            `[${log.time}] ${log.status} → ${log.type} (${log.severity})`
        ).join('<br>');
    }
}

// animate radar
function animateRadar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    
    drawGrid();
    drawThreats();
    drawScanLine();
    detectHits();
    
    angle = (angle + 2.8) % 360;
    
    if (Math.random() < 0.08 && threats.length < 16) {
        addRandomAttack();
    }
    
    updateLogs();
    
    // threat level based on count
    let threatText = '🟢 LOW';
    if (threats.length > 5) threatText = '🟡 MODERATE';
    if (threats.length > 9) threatText = '🟠 HIGH';
    if (threats.length > 13) threatText = '🔴 CRITICAL';
    document.getElementById('threatLevelDynamic').innerHTML = threatText;
    
    requestAnimationFrame(animateRadar);
}

// start animation after page load
window.addEventListener('load', () => {
    for(let i=0;i<4;i++) addRandomAttack();
    animateRadar();
});