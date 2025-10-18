// Game state variables
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

function loadData() {
  bananas = Number(localStorage.getItem('bananas')) || 0;
  bananasPerClick = Number(localStorage.getItem('bananasPerClick')) || 1;
  autoClickRate = Number(localStorage.getItem('autoClickRate')) || 0;
  rebirthMultiplier = Number(localStorage.getItem('rebirthMultiplier')) || 1;
  const savedCosts = JSON.parse(localStorage.getItem('upgradeCosts'));
  if(Array.isArray(savedCosts) && savedCosts.length === upgradeCosts.length){
    upgradeCosts = savedCosts.map(Number);
  }
  const savedCodesUsed = localStorage.getItem("codesUsed");
  if(savedCodesUsed){
    codesUsed = new Set(JSON.parse(savedCodesUsed));
  }
}

function saveData() {
  localStorage.setItem('bananas', bananas);
  localStorage.setItem('bananasPerClick', bananasPerClick);
  localStorage.setItem('autoClickRate', autoClickRate);
  localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
  localStorage.setItem('codesUsed', JSON.stringify(Array.from(codesUsed)));
  localStorage.setItem('rebirthMultiplier', rebirthMultiplier);
}

function updateUI() {
  document.getElementById('bananaCount').textContent = 'Bananas: ' + Math.floor(bananas).toLocaleString();
  document.getElementById('clickPower').textContent = `+${bananasPerClick}`;
  document.querySelector('.per-second').textContent = `${Math.floor(autoClickRate * rebirthMultiplier).toLocaleString()} Bananas per Second (x${rebirthMultiplier.toFixed(2)})`;
  document.getElementById('rebirthBtn').textContent = `Rebirth (x${(rebirthMultiplier + 0.5).toFixed(2)})`;
  updateUpgradesUI();
}

function updateUpgradesUI() {
  const upgradesList = document.getElementById('upgradesList');
  upgradesList.innerHTML = '';
  for(let i=0; i < upgradeCosts.length; i++){
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
      if(bananas >= upgradeCosts[i]){
        bananas -= upgradeCosts[i];
        upgradeEffects[i]();
        upgradeCosts[i] = Math.floor(upgradeCosts[i]*1.5);
        saveAndUpdate();
      }
    });
    upgradesList.appendChild(btn);
  }
}

function saveAndUpdate(){
  saveData();
  updateUI();
}

// DOM elements
const modal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const submitBtn = document.getElementById("usernameSubmit");
const usernameDisplay = document.getElementById("usernameDisplay");
const usernameText = document.getElementById("usernameText");
const tradeButton = document.getElementById("tradeButton");
const adminPanel = document.getElementById("adminPanel");
const bananaAddInput = document.getElementById("bananaAddInput");
const addBananasBtn = document.getElementById("addBananasBtn");
const adminToggleBtn = document.getElementById("adminToggleBtn");
const rebirthBtn = document.getElementById("rebirthBtn");
const restoreBtn = document.getElementById("restoreBtn");
const codesBtn = document.getElementById("codesBtn");

// Show username
function showUsername(username){
  usernameText.textContent = username;
  usernameDisplay.style.display = "flex";
  modal.style.display = "none";
}

// Save username
function saveUsername(username){
  localStorage.setItem("username", username);
}

// Admin panel banana adding
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

// Trade button stub
tradeButton.addEventListener("click", () => {
  alert("Trade UI coming soon! (Local network trading not yet implemented)");
});

// Username modal submit
submitBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if(username.length > 0){
    saveUsername(username);
    showUsername(username);
  } else {
    alert("Please enter a username.");
  }
});
usernameInput.addEventListener("keyup", (e) => {
  if(e.key === "Enter"){
    submitBtn.click();
  }
});

// Admin panel toggle with password prompt
adminToggleBtn.addEventListener("click", () => {
  const pass = prompt("Enter admin password:");
  if(pass === "admin123"){
    if(adminPanel.style.display === "block"){
      adminPanel.style.display = "none";
    } else {
      adminPanel.style.display = "block";
    }
  } else {
    alert("Incorrect password.");
  }
});

// Rebirth button logic
rebirthBtn.addEventListener("click", () => {
  if(confirm("Rebirth resets bananas and upgrades but increases multiplier by 0.5x. Continue?")){
    bananas = 0;
    bananasPerClick = 1;
    autoClickRate = 0;
    upgradeCosts = [
      50, 500, 750, 1500, 5000, 20000, 100000, 250000,
      500000, 750000, 900000, 1000000, 2000000, 3000000, 4000000, 5000000
    ];
    rebirthMultiplier += 0.5;
    saveAndUpdate();
    alert(`Rebirth complete! Multiplier is now x${rebirthMultiplier.toFixed(2)}`);
  }
});

// Restore button logic prompts amount and password "hello"
restoreBtn.addEventListener("click", () => {
  const amountStr = prompt("Enter amount of bananas to restore:");
  if(!amountStr) return;
  const amount = parseInt(amountStr);
  if(isNaN(amount) || amount < 1){
    alert("Invalid amount.");
    return;
  }
  const pass = prompt("Enter password:");
  if(pass !== "hello"){
    alert("Incorrect password.");
    return;
  }
  bananas += amount;
  saveAndUpdate();
  alert(`Restored ${amount.toLocaleString()} bananas.`);
});

// Codes redeem button logic
codesBtn.addEventListener("click", () => {
  const codeInput = prompt("Enter your code:");
  if(!codeInput) return;
  const code = codeInput.trim().toUpperCase();
  if(codesUsed.has(code)){
    alert("You already used this code.");
    return;
  }
  if(code === "SORRY"){
    bananas += 1000000;
    codesUsed.add(code);
    alert("Code accepted! Added 1,000,000 bananas.");
    saveAndUpdate();
  } else {
    alert("Invalid code.");
  }
});

// Load on page start
window.onload = () => {
  loadData();
  updateUI();

  const savedUsername = localStorage.getItem("username");
  if(savedUsername && savedUsername.trim() !== ""){
    showUsername(savedUsername);
  } else {
    modal.style.display = "block";
    usernameInput.focus();
  }

  const loadingScreen = document.getElementById("loadingScreen");
  if(loadingScreen){
    loadingScreen.style.display = "none";
  }
};

// Click banana button - add bananas with multiplier
document.getElementById('clickBananaBtn').addEventListener('click', () => {
  bananas += bananasPerClick * rebirthMultiplier;
  saveAndUpdate();
});

// Autoclick bananas per second loop including multiplier
setInterval(() => {
  if(autoClickRate > 0){
    bananas += autoClickRate * rebirthMultiplier;
    saveAndUpdate();
  }
}, 1000);
