// Game Variables - Normal mode (Bananas)
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

// Halloween mode variables (Pumpkins)
let pumpkins = 0;
let pumpkinsPerClick = 1;
let pumpkinAutoRate = 0;
let pumpkinUpgradeCosts = [30, 100, 300];
let pumpkinUpgradeEffects = [
  () => pumpkinsPerClick += 1,
  () => pumpkinAutoRate += 2,
  () => pumpkinAutoRate += 5
];

// Mode Control
let halloweenMode = false;

// UI Elements
const btnHalloween = document.createElement("button");
btnHalloween.textContent = "Halloween";
btnHalloween.style.marginTop = "10px";

const leftSidebar = document.querySelector(".left-sidebar");
leftSidebar.appendChild(btnHalloween);

const bananaCountDisplay = document.getElementById('bananaCount');
const clickPowerDisplay = document.getElementById('clickPower');
const perSecondDisplay = document.querySelector('.per-second');
const rebirthBtn = document.getElementById('rebirthBtn');
const restoreBtn = document.getElementById('restoreBtn');
const codesBtn = document.getElementById('codesBtn');
const upgradesList = document.getElementById('upgradesList');
const clickBananaBtn = document.getElementById('clickBananaBtn');
const header = document.querySelector('.header');

// Create Halloween header images - hidden by default
const batImg = document.createElement("img");
batImg.src = "bat.png";
batImg.alt = "Bat";
batImg.style.height = "40px";
batImg.style.marginRight = "10px";
batImg.style.display = "none";

const pumpkinImg = document.createElement("img");
pumpkinImg.src = "pumpkin.png";
pumpkinImg.alt = "Pumpkin";
pumpkinImg.style.height = "40px";
pumpkinImg.style.display = "none";

header.insertBefore(batImg, header.firstChild);
header.insertBefore(pumpkinImg, header.firstChild);

// Halloween music element
let halloweenMusic = document.getElementById('halloweenMusic');
if (!halloweenMusic) {
  halloweenMusic = document.createElement('audio');
  halloweenMusic.id = 'halloweenMusic';
  halloweenMusic.loop = true;
  halloweenMusic.src = 'FreeSounds-CreepyDrone2.mp3';
  document.body.appendChild(halloweenMusic);
}

// Load saved data
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
  halloweenMode = localStorage.getItem('halloweenMode') === 'true' || false;
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
}

// Update UI
function updateUI() {
  if (!halloweenMode) {
    bananaCountDisplay.textContent = 'Bananas: ' + Math.floor(bananas).toLocaleString();
    clickPowerDisplay.textContent = `+${bananasPerClick}`;
    perSecondDisplay.textContent = `${Math.floor(autoClickRate * rebirthMultiplier).toLocaleString()} Bananas per Second (x${rebirthMultiplier.toFixed(2)})`;
    rebirthBtn.disabled = false;
    codesBtn.disabled = false;
    rebirthBtn.style.display = 'inline-block';
    codesBtn.style.display = 'inline-block';
    batImg.style.display = 'none';
    pumpkinImg.style.display = 'none';
    halloweenMusic.pause();
    halloweenMusic.currentTime = 0;
    clickBananaBtn.textContent = 'Click for Banana 🍌';
  } else {
    bananaCountDisplay.textContent = 'Pumpkins: ' + Math.floor(pumpkins).toLocaleString();
    clickPowerDisplay.textContent = `+${pumpkinsPerClick}`;
    perSecondDisplay.textContent = `${Math.floor(pumpkinAutoRate).toLocaleString()} Pumpkins per Second`;
    rebirthBtn.disabled = true;
    codesBtn.disabled = true;
    rebirthBtn.style.display = 'none';
    codesBtn.style.display = 'none';
    batImg.style.display = '';
    pumpkinImg.style.display = '';
    halloweenMusic.play();
    clickBananaBtn.textContent = 'Click for Pumpkin 🎃';
  }
  updateUpgradesUI();
}

// Update Upgrades UI
function updateUpgradesUI() {
  upgradesList.innerHTML = '';
  if (!halloweenMode) {
    for (let i = 0; i < upgradeCosts.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn';
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
        if (bananas >= upgradeCosts[i]) {
          bananas -= upgradeCosts[i];
          upgradeEffects[i]();
          upgradeCosts[i] = Math.floor(upgradeCosts[i] * 1.5);
          saveAndUpdate();
        }
      });
      upgradesList.appendChild(btn);
    }
  } else {
    // Halloween upgrades
    for (let i = 0; i < pumpkinUpgradeCosts.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn';
      btn.disabled = pumpkins < pumpkinUpgradeCosts[i];
      let label = '';
      if (i === 0) label = `🎃 +1/click — Cost: ${pumpkinUpgradeCosts[i].toLocaleString()}`;
      else if (i === 1) label = `👻 +2/sec — Cost: ${pumpkinUpgradeCosts[i].toLocaleString()}`;
      else if (i === 2) label = `🕸️ +5/sec — Cost: ${pumpkinUpgradeCosts[i].toLocaleString()}`;

      btn.textContent = label;
      btn.addEventListener('click', () => {
        if (pumpkins >= pumpkinUpgradeCosts[i]) {
          pumpkins -= pumpkinUpgradeCosts[i];
          pumpkinUpgradeEffects[i]();
          pumpkinUpgradeCosts[i] = Math.floor(pumpkinUpgradeCosts[i] * 1.7);
          saveAndUpdate();
        }
      });
      upgradesList.appendChild(btn);
    }
  }
}

function saveAndUpdate() {
  saveData();
  updateUI();
}

// Clicking main button
clickBananaBtn.addEventListener('click', () => {
  if (!halloweenMode) {
    bananas += bananasPerClick * rebirthMultiplier;
  } else {
    pumpkins += pumpkinsPerClick;
  }
  saveAndUpdate();
});

// Auto gains per second
setInterval(() => {
  if (!halloweenMode) {
    if (autoClickRate > 0) {
      bananas += autoClickRate * rebirthMultiplier;
      saveAndUpdate();
    }
  } else {
    if (pumpkinAutoRate > 0) {
      pumpkins += pumpkinAutoRate;
      saveAndUpdate();
    }
  }
}, 1000);

// Toggle Halloween Mode
btnHalloween.addEventListener('click', () => {
  halloweenMode = !halloweenMode;
  saveAndUpdate();
});

// Rebirth button and codes disabled in Halloween mode
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

// Load data on page load
window.onload = () => {
  loadData();
  updateUI();

  // Show username modal logic here...
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
};
