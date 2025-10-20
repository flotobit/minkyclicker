// ----- Variables and Game Data -----

let bananas = 0;
let bananasPerClick = 1;
let autoClickRate = 0;
let rebirthMultiplier = 1;
let upgradeCosts = [
  50, 500, 750, 1500, 5000, 20000, 100000, 250000,
  500000, 750000, 900000, 1000000, 2000000, 3000000,
  4000000, 5000000
];
let upgradeEffects = [
  () => bananasPerClick += 1,
  () => autoClickRate += 5,
  () => autoClickRate += 5,
  () => autoClickRate += 10,
  () => autoClickRate += 25,
  () => bananasPerClick = 20,
  () => autoClickRate += 100,
  () => autoClickRate += 200,
  () => bananasPerClick += 50,
  () => autoClickRate += 500,
  () => bananasPerClick += 100,
  () => autoClickRate += 1000,
  () => bananasPerClick += 300,
  () => autoClickRate += 2000,
  () => bananasPerClick += 500,
  () => autoClickRate += 5000
];
let codesUsed = new Set();

let pumpkins = 0;
let pumpkinsPerClick = 1;
let pumpkinAutoRate = 0;
let pumpkinUpgradeCosts = [30, 100, 300];
let pumpkinUpgradeEffects = [
  () => pumpkinsPerClick += 1,
  () => pumpkinAutoRate += 2,
  () => pumpkinAutoRate += 5
];

let halloweenMode = false;
let halloweenMultiplierActive = false;

// --- UI Elements ---
const bananaCountDisplay = document.getElementById('bananaCount');
const clickPowerDisplay = document.getElementById('clickPower');
const perSecondDisplay = document.querySelector('.per-second');
const rebirthBtn = document.getElementById('rebirthBtn');
const restoreBtn = document.getElementById('restoreBtn');
const codesBtn = document.getElementById('codesBtn');
const upgradesList = document.getElementById('upgradesList');
const clickBananaBtn = document.getElementById('clickBananaBtn');
const btnHalloween = document.getElementById('btnHalloween');
const btnSettings = document.getElementById('btnSettings');
const settingsModal = document.getElementById('settingsModal');
const halloweenMultiplierToggle = document.getElementById('halloweenMultiplierToggle');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const halloweenMusic = document.getElementById('halloweenMusic');
const adminPanel = document.getElementById('adminPanel');
const bananaAddInput = document.getElementById('bananaAddInput');
const addBananasBtn = document.getElementById('addBananasBtn');
const adminToggleBtn = document.getElementById('adminToggleBtn');

// ----- Helper Functions For Animation -----

// Add .button-animated class to all relevant button elements
function buttonAnimationSetup() {
  document.querySelectorAll('button').forEach(btn => btn.classList.add('button-animated'));
}

// Bat or banana burst animation on main click
function flyBurst(icon, x, y) {
  const e = document.createElement('div');
  e.className = 'burst-effect';
  e.style.left = x + 'px';
  e.style.top = y + 'px';
  e.textContent = icon;
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 900);
}

// Rain pumpkins animation
function rainPumpkins() {
  for (let i = 0; i < 5; i++) {
    const e = document.createElement('div');
    e.className = 'pumpkin-rain';
    e.textContent = '🎃';
    // Random horizontal spread
    e.style.left = `${Math.random()*88+6}vw`;
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 1300 + Math.random()*100);
  }
}

// ----- Load & Save -----
function loadData() {
  bananas = Number(localStorage.getItem('bananas')) || 0;
  bananasPerClick = Number(localStorage.getItem('bananasPerClick')) || 1;
  autoClickRate = Number(localStorage.getItem('autoClickRate')) || 0;
  rebirthMultiplier = Number(localStorage.getItem('rebirthMultiplier')) || 1;
  const savedCosts = JSON.parse(localStorage.getItem('upgradeCosts'));
  if (Array.isArray(savedCosts) && savedCosts.length === upgradeCosts.length) {
    upgradeCosts = savedCosts.map(Number);
  }
  const savedCodesUsed = localStorage.getItem("codesUsed");
  if (savedCodesUsed) {
    codesUsed = new Set(JSON.parse(savedCodesUsed));
  }
  pumpkins = Number(localStorage.getItem('pumpkins')) || 0;
  pumpkinsPerClick = Number(localStorage.getItem('pumpkinsPerClick')) || 1;
  pumpkinAutoRate = Number(localStorage.getItem('pumpkinAutoRate')) || 0;
  const phCosts = JSON.parse(localStorage.getItem('pumpkinUpgradeCosts'));
  if (Array.isArray(phCosts) && phCosts.length === pumpkinUpgradeCosts.length) {
    pumpkinUpgradeCosts = phCosts.map(Number);
  }
  halloweenMode = localStorage.getItem('halloweenMode') === 'true';
  halloweenMultiplierActive = localStorage.getItem('hallowMultiplier') === 'true';
  halloweenMultiplierToggle.checked = halloweenMultiplierActive;
}

function saveData() {
  localStorage.setItem('bananas', bananas);
  localStorage.setItem('bananasPerClick', bananasPerClick);
  localStorage.setItem('autoClickRate', autoClickRate);
  localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
  localStorage.setItem('codesUsed', JSON.stringify(Array.from(codesUsed)));
  localStorage.setItem('rebirthMultiplier', rebirthMultiplier);
  localStorage.setItem('pumpkins', pumpkins);
  localStorage.setItem('pumpkinsPerClick', pumpkinsPerClick);
  localStorage.setItem('pumpkinAutoRate', pumpkinAutoRate);
  localStorage.setItem('pumpkinUpgradeCosts', JSON.stringify(pumpkinUpgradeCosts));
  localStorage.setItem('halloweenMode', halloweenMode);
  localStorage.setItem('hallowMultiplier', halloweenMultiplierActive);
}

// ----- UI Updates -----
function updateUI() {
  if (!halloweenMode) {
    bananaCountDisplay.textContent = 'Bananas: ' + Math.floor(bananas).toLocaleString();
    clickPowerDisplay.textContent = `+${bananasPerClick}`;
    perSecondDisplay.textContent = `${Math.floor(autoClickRate * rebirthMultiplier).toLocaleString()} Bananas per Second (x${rebirthMultiplier.toFixed(2)})`;
    rebirthBtn.disabled = false;
    codesBtn.disabled = false;
    rebirthBtn.style.display = 'inline-block';
    codesBtn.style.display = 'inline-block';
    restoreBtn.style.display = 'inline-block';
    btnHalloween.textContent = '🦇🎃 Halloween Mode OFF';
    halloweenMusic.pause();
    halloweenMusic.currentTime = 0;
  } else {
    const multiplier = halloweenMultiplierActive ? 1.5 : 1;
    bananaCountDisplay.textContent = 'Pumpkins: ' + Math.floor(pumpkins).toLocaleString();
    clickPowerDisplay.textContent = `+${pumpkinsPerClick}`;
    perSecondDisplay.textContent = `${Math.floor(pumpkinAutoRate * multiplier).toLocaleString()} Pumpkins per Second${halloweenMultiplierActive ? ' (x1.5)' : ''}`;
    rebirthBtn.disabled = true;
    codesBtn.disabled = true;
    rebirthBtn.style.display = 'none';
    codesBtn.style.display = 'none';
    restoreBtn.style.display = 'none';
    btnHalloween.textContent = '🦇🎃 Halloween Mode ON';
    if(!halloweenMusic.paused) return; // avoid replay spam
    halloweenMusic.play().catch(() => {});
  }
  updateUpgradesUI();
}

function updateUpgradesUI() {
  upgradesList.innerHTML = '';
  if (!halloweenMode) {
    for (let i = 0; i < upgradeCosts.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn button-animated';
      btn.disabled = bananas < upgradeCosts[i];
      let label = '';
      if (i === 0) label = `🍌 +1/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 1 || i === 2) label = `💨 +5/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 3) label = `⚡ +10/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 4) label = `🌟 +25/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 5) label = `🔥 Click=20 — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 6) label = `💥 +100/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 7) label = `💨 +200/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 8) label = `🍌 +50/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 9) label = `💨 +500/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 10) label = `🔥 +100/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 11) label = `💨 +1000/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 12) label = `🍌 +300/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 13) label = `💨 +2000/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 14) label = `🔥 +500/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
      else if (i === 15) label = `💨 +5000/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;

      btn.textContent = label;
      btn.addEventListener('click', () => {
        bananas -= upgradeCosts[i];
        upgradeEffects[i]();
        upgradeCosts[i] = Math.floor(upgradeCosts[i] * 1.5);
        saveAndUpdate();
      });
      upgradesList.appendChild(btn);
    }
  } else {
    for (let i = 0; i < pumpkinUpgradeCosts.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn button-animated';
      btn.disabled = pumpkins < pumpkinUpgradeCosts[i];
      let label = '';
      if (i === 0) label = `🎃 +1/click — Cost: ${pumpkinUpgradeCosts[i].toLocaleString()}`;
      else if (i === 1) label = `👻 +2/sec — Cost: ${pumpkinUpgradeCosts[i].toLocaleString()}`;
      else if (i === 2) label = `🕸️ +5/sec — Cost: ${pumpkinUpgradeCosts[i].toLocaleString()}`;

      btn.textContent = label;
      btn.addEventListener('click', () => {
        pumpkins -= pumpkinUpgradeCosts[i];
        pumpkinUpgradeEffects[i]();
        pumpkinUpgradeCosts[i] = Math.floor(pumpkinUpgradeCosts[i] * 1.7);
        saveAndUpdate();
      });
      upgradesList.appendChild(btn);
    }
  }
}

function saveAndUpdate() {
  saveData();
  updateUI();
}

// ----- Game Event Listeners -----

clickBananaBtn.addEventListener('click', (event) => {
  // Button shrink handled by CSS :active
  // Burst and rain animation
  const { left, top, width, height } = clickBananaBtn.getBoundingClientRect();
  const burstX = left + width / 2;
  const burstY = top + window.scrollY + height / 2;
  
  if (halloweenMode) {
    flyBurst('🦇', burstX - 24, burstY);
    flyBurst('🦇', burstX + 18, burstY - 20);
    flyBurst('🦇', burstX + 32, burstY + 6);
    rainPumpkins();
    const multiplier = halloweenMultiplierActive ? 1.5 : 1;
    pumpkins += pumpkinsPerClick * multiplier;
  } else {
    flyBurst('🍌', burstX - 16, burstY - 12);
    flyBurst('🍌', burstX + 21, burstY + 7);
    flyBurst('🍌', burstX + 10, burstY + 23);
    bananas += bananasPerClick * rebirthMultiplier;
  }
  saveAndUpdate();
});

setInterval(() => {
  if (halloweenMode) {
    const multiplier = halloweenMultiplierActive ? 1.5 : 1;
    pumpkins += pumpkinAutoRate * multiplier;
  } else {
    bananas += autoClickRate * rebirthMultiplier;
  }
  saveAndUpdate();
}, 1000);

btnHalloween.addEventListener('click', () => {
  halloweenMode = !halloweenMode;
  saveAndUpdate();
});

btnSettings.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
  halloweenMultiplierToggle.checked = halloweenMultiplierActive;
});

saveSettingsBtn.addEventListener('click', () => {
  halloweenMultiplierActive = halloweenMultiplierToggle.checked;
  localStorage.setItem('hallowMultiplier', halloweenMultiplierActive.toString());
  settingsModal.style.display = 'none';
  saveAndUpdate();
});

cancelSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

rebirthBtn.addEventListener('click', () => {
  if (halloweenMode) {
    alert("Rebirth is disabled during Halloween mode.");
    return;
  }
  if (confirm("Rebirth resets bananas and upgrades but increases multiplier by 0.5x. Continue?")) {
    bananas = 0;
    bananasPerClick = 1;
    autoClickRate = 0;
    upgradeCosts = [
      50, 500, 750, 1500, 5000, 20000, 100000, 250000,
      500000, 750000, 900000, 1000000, 2000000, 3000000, 4000000, 5000000
    ];
    rebirthMultiplier += 0.5;
    saveAndUpdate();
    alert(`Rebirth complete! Multiplier now x${rebirthMultiplier.toFixed(2)}`);
  }
});

codesBtn.addEventListener('click', () => {
  if (halloweenMode) {
    alert("Codes are disabled during Halloween mode.");
    return;
  }
  const inputCode = prompt("Enter your code:");
  if (!inputCode) return;
  const code = inputCode.trim().toUpperCase();
  if (codesUsed.has(code)) {
    alert("You already used this code.");
    return;
  }
  if (code === "SORRY") {
    bananas += 1000000;
    codesUsed.add(code);
    alert("Code accepted! Added 1,000,000 bananas.");
    saveAndUpdate();
  } else {
    alert("Invalid code.");
  }
});

restoreBtn.addEventListener('click', () => {
  const amountStr = prompt("Enter amount of bananas to restore:");
  if (!amountStr) return;
  const amount = parseInt(amountStr);
  if (isNaN(amount) || amount < 1) {
    alert("Invalid amount.");
    return;
  }
  const password = prompt("Enter password:");
  if (password !== "hello") {
    alert("Incorrect password.");
    return;
  }
  bananas += amount;
  saveAndUpdate();
  alert(`Restored ${amount.toLocaleString()} bananas.`);
});

adminToggleBtn.addEventListener('click', () => {
  const pass = prompt("Enter admin password:");
  if (pass === "admin123") {
    adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
  } else {
    alert("Incorrect password.");
  }
});

addBananasBtn.addEventListener('click', () => {
  const addAmount = parseInt(bananaAddInput.value);
  if (isNaN(addAmount) || addAmount < 1) {
    alert("Please enter a valid positive number of bananas.");
    return;
  }
  bananas += addAmount;
  saveAndUpdate();
  bananaAddInput.value = "";
});

// ----- Initialization -----
window.onload = () => {
  loadData();
  updateUI();
  buttonAnimationSetup();
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
};
