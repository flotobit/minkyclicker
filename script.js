let bananas = 0;
let bananasPerClick = 1;
let upgradeCost1 = 50;
let upgradeCost2 = 500;
let upgradeCost3 = 750;
let upgradeCost4 = 1500;
let upgradeCost5 = 5000;
let upgradeCost6 = 20000;
let upgradeCost7 = 100000;
let autoClickRate = 0;

// Load saved values from localStorage
function loadData() {
  bananas = Number(localStorage.getItem('bananas')) || 0;
  bananasPerClick = Number(localStorage.getItem('bananasPerClick')) || 1;
  upgradeCost1 = Number(localStorage.getItem('upgradeCost1')) || 50;
  upgradeCost2 = Number(localStorage.getItem('upgradeCost2')) || 500;
  upgradeCost3 = Number(localStorage.getItem('upgradeCost3')) || 750;
  upgradeCost4 = Number(localStorage.getItem('upgradeCost4')) || 1500;
  upgradeCost5 = Number(localStorage.getItem('upgradeCost5')) || 5000;
  upgradeCost6 = Number(localStorage.getItem('upgradeCost6')) || 20000;
  upgradeCost7 = Number(localStorage.getItem('upgradeCost7')) || 100000;
  autoClickRate = Number(localStorage.getItem('autoClickRate')) || 0;
}

// Save current values to localStorage
function saveData() {
  localStorage.setItem('bananas', bananas);
  localStorage.setItem('bananasPerClick', bananasPerClick);
  localStorage.setItem('upgradeCost1', upgradeCost1);
  localStorage.setItem('upgradeCost2', upgradeCost2);
  localStorage.setItem('upgradeCost3', upgradeCost3);
  localStorage.setItem('upgradeCost4', upgradeCost4);
  localStorage.setItem('upgradeCost5', upgradeCost5);
  localStorage.setItem('upgradeCost6', upgradeCost6);
  localStorage.setItem('upgradeCost7', upgradeCost7);
  localStorage.setItem('autoClickRate', autoClickRate);
}

// Update UI elements
function updateUI() {
  document.getElementById('bananaCount').textContent = 'Bananas: ' + bananas;
  document.getElementById('cost1').textContent = upgradeCost1;
  document.getElementById('cost2').textContent = upgradeCost2;
  document.getElementById('cost3').textContent = upgradeCost3;
  document.getElementById('cost4').textContent = upgradeCost4;
  document.getElementById('cost5').textContent = upgradeCost5;
  document.getElementById('cost6').textContent = upgradeCost6;
  document.getElementById('cost7').textContent = upgradeCost7;
}

function saveAndUpdate() {
  saveData();
  updateUI();
}

window.onload = () => {
  loadData();
  updateUI();

  // Monkey click - increase bananas
  document.getElementById('monkeyImage').addEventListener('click', () => {
    bananas += bananasPerClick;
    saveAndUpdate();
  });

  // Upgrades
  document.getElementById('upgrade1').addEventListener('click', () => {
    if (bananas >= upgradeCost1) {
      bananas -= upgradeCost1;
      bananasPerClick += 1;
      upgradeCost1 += 25;
      saveAndUpdate();
    }
  });

  document.getElementById('upgrade2').addEventListener('click', () => {
    if (bananas >= upgradeCost2) {
      bananas -= upgradeCost2;
      autoClickRate += 5;
      upgradeCost2 += 25;
      saveAndUpdate();
    }
  });

  document.getElementById('upgrade3').addEventListener('click', () => {
    if (bananas >= upgradeCost3) {
      bananas -= upgradeCost3;
      autoClickRate += 5;
      upgradeCost3 += 25;
      saveAndUpdate();
    }
  });

  document.getElementById('upgrade4').addEventListener('click', () => {
    if (bananas >= upgradeCost4) {
      bananas -= upgradeCost4;
      autoClickRate += 10;
      upgradeCost4 += 100;
      saveAndUpdate();
    }
  });

  document.getElementById('upgrade5').addEventListener('click', () => {
    if (bananas >= upgradeCost5) {
      bananas -= upgradeCost5;
      autoClickRate += 25;
      upgradeCost5 += 250;
      saveAndUpdate();
    }
  });

  document.getElementById('upgrade6').addEventListener('click', () => {
    if (bananas >= upgradeCost6) {
      bananas -= upgradeCost6;
      bananasPerClick = 20;
      upgradeCost6 += 1000;
      saveAndUpdate();
    }
  });

  document.getElementById('upgrade7').addEventListener('click', () => {
    if (bananas >= upgradeCost7) {
      bananas -= upgradeCost7;
      autoClickRate += 100;
      upgradeCost7 += 5000;
      saveAndUpdate();
    }
  });

  // Auto bananas per second
  setInterval(() => {
    if(autoClickRate > 0) {
      bananas += autoClickRate;
      saveAndUpdate();
    }
  }, 1000);
};
document.getElementById('clickPower').textContent = `+${bananasPerClick}`;
