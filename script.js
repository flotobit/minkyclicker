// Existing banana clicker game code
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

function updateUI() {
  document.getElementById('bananaCount').textContent = 'Bananas: ' + bananas;
  document.getElementById('cost1').textContent = upgradeCost1;
  document.getElementById('cost2').textContent = upgradeCost2;
  document.getElementById('cost3').textContent = upgradeCost3;
  document.getElementById('cost4').textContent = upgradeCost4;
  document.getElementById('cost5').textContent = upgradeCost5;
  document.getElementById('cost6').textContent = upgradeCost6;
  document.getElementById('cost7').textContent = upgradeCost7;
  document.getElementById('clickPower').textContent = `+${bananasPerClick}`;
}

function saveAndUpdate() {
  saveData();
  updateUI();
}

window.onload = () => {
  loadData();
  updateUI();

  document.getElementById('monkeyImage').addEventListener('click', () => {
    bananas += bananasPerClick;
    saveAndUpdate();
  });

  document.getElementById('upgrade1').addEventListener('click', () => {
    if (bananas >= upgradeCost1) {
      bananas -= upgradeCost1;
      bananasPerClick += 1;
      upgradeCost1 += 25;
      saveAndUpdate();
    }
  });
  // Similar handlers for other upgrades (upgrade2 to upgrade7) as in your original script ...

  // Auto bananas per second
  setInterval(() => {
    if(autoClickRate > 0) {
      bananas += autoClickRate;
      saveAndUpdate();
    }
  }, 1000);

  // User sign-up and trade button logic
  (async () => {
    let username = localStorage.getItem('username');
    let role = localStorage.getItem('role');

    if (!username) {
      username = prompt("Enter your username (no password needed):");
      if (!username) {
        alert("Username is required.");
        return;
      }

      try {
        const response = await fetch('/.netlify/functions/register', {
          method: 'POST',
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          alert(await response.text());
          location.reload();
          return;
        }

        const data = await response.json();
        username = data.username;
        role = data.role;

        localStorage.setItem('username', username);
        localStorage.setItem('role', role);

      } catch (error) {
        alert('Network error. Please try again later.');
        return;
      }
    }

    if (role === 'admin') {
      const tradeButton = document.createElement('button');
      tradeButton.id = 'tradeButton';
      tradeButton.textContent = 'Trade';
      tradeButton.style.position = 'fixed';
      tradeButton.style.left = '10px';
      tradeButton.style.top = '50%';
      tradeButton.style.zIndex = 1000;
      tradeButton.onclick = () => alert('Trade UI coming soon!');
      document.body.appendChild(tradeButton);
    }
  })();
};
