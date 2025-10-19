// --- Variables ---

// Normal mode (Bananas)
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

// Halloween mode (Pumpkins)
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

// Monkey Equip (Normal or Halloween)
let equippedMonkey = localStorage.getItem('equippedMonkey') || "normal"; // 'normal' or 'halloween'

// --- UI Elements ---
const bananaCountDisplay = document.getElementById('bananaCount');
const clickPowerDisplay = document.getElementById('clickPower');
const perSecondDisplay = document.querySelector('.per-second');
const rebirthBtn = document.getElementById('rebirthBtn');
const restoreBtn = document.getElementById('restoreBtn');
const codesBtn = document.getElementById('codesBtn');
const upgradesList = document.getElementById('upgradesList');
const clickBananaBtn = document.getElementById('clickBananaBtn');
const header = document.querySelector('.header');
const leftSidebar = document.querySelector(".left-sidebar");

// --- Halloween UI Setup ---
const btnHalloween = document.createElement("button");
btnHalloween.textContent = "Halloween";
btnHalloween.style.marginTop = "10px";
leftSidebar.appendChild(btnHalloween);

// Batman and pumpkin images in header
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

// Halloween music element setup
let halloweenMusic = document.getElementById('halloweenMusic');
if (!halloweenMusic) {
  halloweenMusic = document.createElement('audio');
  halloweenMusic.id = 'halloweenMusic';
  halloweenMusic.loop = true;
  halloweenMusic.src = 'FreeSounds-CreepyDrone2.mp3';
  document.body.appendChild(halloweenMusic);
}

// Monkey images for equip feature
const monkeyImages = {
  normal: "Adobe-Express-file.jpg",       // Normal monkey image
  halloween: "halloween-monkey.png"       // Halloween monkey image
};

// Gear icon settings button
const gearButton = document.createElement('button');
gearButton.id = "settingsBtn";
gearButton.title = "Settings";
gearButton.style.background = "transparent";
gearButton.style.border = "none";
gearButton.style.marginTop = "15px";
gearButton.style.cursor = "pointer";

const gearIcon = document.createElement('img');
gearIcon.src = "gear-icon.png"; // Replace with actual gear icon path
gearIcon.alt = "Settings";
gearIcon.style.width = "28px";
gearIcon.style.height = "28px";
gearIcon.style.display = "block";
gearButton.appendChild(gearIcon);

leftSidebar.appendChild(gearButton);

// Settings Modal Setup
const settingsModal = document.createElement('div');
settingsModal.id = "settingsModal";
settingsModal.style.position = "fixed";
settingsModal.style.top = "0";
settingsModal.style.left = "0";
settingsModal.style.width = "100%";
settingsModal.style.height = "100%";
settingsModal.style.background = "rgba(0,0,0,0.4)";
settingsModal.style.display = "none";
settingsModal.style.justifyContent = "center";
settingsModal.style.alignItems = "center";
settingsModal.style.zIndex = "15000";

const modalContent = document.createElement('div');
modalContent.style.background = "#fff";
modalContent.style.borderRadius = "8px";
modalContent.style.padding = "20px";
modalContent.style.width = "320px";
modalContent.style.textAlign = "center";

const modalTitle = document.createElement('h2');
modalTitle.textContent = "Choose Monkey Icon";
modalContent.appendChild(modalTitle);

const form = document.createElement('form');
form.id = 'monkeySelectForm';

for (const [key, imgSrc] of Object.entries(monkeyImages)) {
  const label = document.createElement('label');
  label.style.display = 'block';
  label.style.margin = '10px 0';
  label.style.cursor = "pointer";

  const radio = document.createElement('input');
  radio.type = "radio";
  radio.name = "monkeyChoice";
  radio.value = key;
  if (key === equippedMonkey) radio.checked = true;

  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = key + " monkey";
  img.style.width = "60px";
  img.style.height = "60px";
  img.style.marginLeft = "10px";
  img.style.verticalAlign = "middle";

  label.appendChild(radio);
  label.appendChild(img);
  form.appendChild(label);
}

modalContent.appendChild(form);

const saveBtn = document.createElement('button');
saveBtn.textContent = "Save";
saveBtn.style.marginTop = "15px";
saveBtn.style.padding = "10px 20px";
saveBtn.style.fontWeight = "bold";
saveBtn.style.cursor = "pointer";
modalContent.appendChild(saveBtn);

const cancelBtn = document.createElement('button');
cancelBtn.textContent = "Cancel";
cancelBtn.style.marginTop = "10px";
cancelBtn.style.marginLeft = "10px";
cancelBtn.style.padding = "10px 20px";
cancelBtn.style.cursor = "pointer";
modalContent.appendChild(cancelBtn);

settingsModal.appendChild(modalContent);

document.body.appendChild(settingsModal);

// --- Load/Save System ---

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
  equippedMonkey = localStorage.getItem('equippedMonkey') || "normal";
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
  localStorage.setItem('equippedMonkey', equippedMonkey);
}

// --- UI Updates ---

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
    restoreBtn.style.display = 'none';
    batImg.style.display = '';
    pumpkinImg.style.display = '';
    halloweenMusic.play();
    clickBananaBtn.textContent = 'Click for Pumpkin 🎃';
  }
  updateUpgradesUI();
  updateClickButtonIcon();
}

// Update upgrade buttons UI
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

// Save and update UI
function saveAndUpdate() {
  saveData();
  updateUI();
}

// Update main click button icon based on equipped monkey and mode
function updateClickButtonIcon() {
  let iconSrc = monkeyImages.normal;
  if (halloweenMode) {
    iconSrc = equippedMonkey === "halloween" ? monkeyImages.halloween : monkeyImages.normal;
  } else {
    iconSrc = equippedMonkey === "normal" ? monkeyImages.normal : monkeyImages.halloween;
  }

  // Clear old icons first
  clickBananaBtn.querySelectorAll('img').forEach(img => img.remove());

  const iconImg = document.createElement('img');
  iconImg.src = iconSrc;
  iconImg.alt = "Monkey Icon";
  iconImg.style.width = "32px";
  iconImg.style.height = "32px";
  iconImg.style.marginRight = "8px";
  iconImg.style.verticalAlign = "middle";

  clickBananaBtn.prepend(iconImg);
}

// --- Event Listeners ---

// Main click button
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

// Halloween toggle
btnHalloween.addEventListener('click', () => {
  halloweenMode = !halloweenMode;
  saveAndUpdate();
});

// Rebirth button
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

// Codes button
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

// Restore button - fixed to properly work with inputs and password
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

// Admin panel toggle with password check
const adminPanel = document.getElementById("adminPanel");
const bananaAddInput = document.getElementById("bananaAddInput");
const addBananasBtn = document.getElementById("addBananasBtn");
const adminToggleBtn = document.getElementById("adminToggleBtn");

adminToggleBtn.addEventListener('click', () => {
  const pass = prompt("Enter admin password:");
  if (pass === "admin123") {
    adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
  } else {
    alert("Incorrect password.");
  }
});

// Admin add bananas button
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

// Settings modal event handlers
gearButton.addEventListener('click', () => {
  settingsModal.style.display = "flex";
});

cancelBtn.addEventListener('click', (e) => {
  e.preventDefault();
  settingsModal.style.display = "none";
});

saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const chosenRadio = document.querySelector('input[name="monkeyChoice"]:checked');
  if (chosenRadio) {
    equippedMonkey = chosenRadio.value;
    localStorage.setItem('equippedMonkey', equippedMonkey);
    updateClickButtonIcon();
    settingsModal.style.display = "none";
  }
});

// --- Initialization ---

window.onload = () => {
  loadData();
  updateUI();
  updateClickButtonIcon();

  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
};
