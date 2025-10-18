// Game state variables
let bananas = 0;
let bananasPerClick = 1;
let autoClickRate = 0;

// Expanded upgrade data
let upgradeCosts = [
  50, 500, 750, 1500, 5000, 20000, 100000, 250000, 500000, 750000,
  900000, 1000000, 2000000, 3000000, 4000000, 5000000
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

// Load and save data to localStorage
function loadData() {
  bananas = Number(localStorage.getItem('bananas')) || 0;
  bananasPerClick = Number(localStorage.getItem('bananasPerClick')) || 1;
  autoClickRate = Number(localStorage.getItem('autoClickRate')) || 0;
  const savedCosts = JSON.parse(localStorage.getItem('upgradeCosts'));
  if(Array.isArray(savedCosts) && savedCosts.length === upgradeCosts.length){
    upgradeCosts = savedCosts.map(Number);
  }
  const usedCodes = localStorage.getItem('codesUsed');
  if(usedCodes){
    codesUsed = new Set(JSON.parse(usedCodes));
  }
}

function saveData() {
  localStorage.setItem('bananas', bananas);
  localStorage.setItem('bananasPerClick', bananasPerClick);
  localStorage.setItem('autoClickRate', autoClickRate);
  localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
  localStorage.setItem('codesUsed', JSON.stringify(Array.from(codesUsed)));
}

function updateUI() {
  document.getElementById('bananaCount').textContent = 'Bananas: ' + bananas.toLocaleString();
  document.getElementById('clickPower').textContent = `+${bananasPerClick}`;
  document.querySelector('.per-second').textContent = `${autoClickRate.toLocaleString()} Bananas per Second`;
  updateUpgradesUI();
  checkButtons();
}

function updateUpgradesUI() {
  const upgradesList = document.getElementById('upgradesList');
  upgradesList.innerHTML = '';
  for(let i=0;i<upgradeCosts.length;i++){
    const btn = document.createElement('button');
    btn.className = 'upgrade-btn';
    btn.disabled = bananas < upgradeCosts[i];
    let label = '';
    if(i === 0) label = `🍌 +1/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 1 || i === 2) label = `💨 +5/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 3) label = `⚡ +10/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 4) label = `🌟 +25/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 5) label = `🔥 Click=20 — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 6) label = `💥 +100/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 7) label = `💨 +200/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 8) label = `🍌 +50/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 9) label = `💨 +500/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 10) label = `🔥 +100/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 11) label = `💨 +1000/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 12) label = `🍌 +300/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 13) label = `💨 +2000/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 14) label = `🔥 +500/click — Cost: ${upgradeCosts[i].toLocaleString()}`;
    else if(i === 15) label = `💨 +5000/sec — Cost: ${upgradeCosts[i].toLocaleString()}`;

    btn.textContent = label;
    btn.addEventListener('click', () => {
      if(bananas >= upgradeCosts[i]) {
        bananas -= upgradeCosts[i];
        upgradeEffects[i]();
        upgradeCosts[i] = Math.floor(upgradeCosts[i] * 1.5);
        saveAndUpdate();
      }
    });

    upgradesList.appendChild(btn);
  }
}

function checkButtons(){
  // Optional: enable/disable rebirth button
}

function saveAndUpdate(){
  saveData();
  updateUI();
}

// Interface elements
const modal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const submitBtn = document.getElementById("usernameSubmit");
const usernameDisplay = document.getElementById("usernameDisplay");
const usernameText = document.getElementById("usernameText");
const tradeButton = document.getElementById("tradeButton");
const adminPanel = document.getElementById("adminPanel");
const bananaAddInput = document.getElementById("bananaAddInput");
const addBananasBtn = document.getElementById("addBananasBtn");

function showUsername(username) {
  usernameText.textContent = username;
  usernameDisplay.style.display = "flex";
  modal.style.display = "none";

  if(username.toLowerCase() === "floto") {
    adminPanel.style.display = "block";
  } else {
    adminPanel.style.display = "none";
  }
}

function saveUsername(username) {
  localStorage.setItem("username", username);
}

addBananasBtn.addEventListener("click", () => {
  const addAmount = parseInt(bananaAddInput.value);
  if(isNaN(addAmount) || addAmount < 1){
    alert("Please enter a valid positive number of bananas.");
    return;
  }
  bananas += addAmount;
  saveAndUpdate();
  bananaAddInput.value = "";
});

tradeButton.addEventListener("click", () => {
  alert("Trade UI coming soon! (Local network trading not yet implemented)");
});

submitBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if(username.length > 0) {
    saveUsername(username);
    showUsername(username);
  } else {
    alert("Please enter a username.");
  }
});

usernameInput.addEventListener("keyup", (event) => {
  if(event.key === "Enter") {
    submitBtn.click();
  }
});

window.onload = () => {
  loadData();
  updateUI();

  const savedUsername = localStorage.getItem("username");
  if(savedUsername && savedUsername.trim().length > 0) {
    showUsername(savedUsername);
  } else {
    modal.style.display = "block";
    usernameInput.focus();
  }

  document.getElementById('monkeyImage').addEventListener('click', () => {
    bananas += bananasPerClick;
    saveAndUpdate();
  });
};

// Auto banana generator loop
setInterval(() => {
  if(autoClickRate > 0) {
    bananas += autoClickRate;
    saveAndUpdate();
  }
}, 1000);

// -- Add handlers for rebirth, restore, codes etc. in new script or inline in HTML as needed --
