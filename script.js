
/*!
 * ============================================
 * Fruit Puzzle - Game Logic
 * ============================================
 * 
 * Copyright © 2025 DarkDetox. All Rights Reserved.
 * 
 * Author: DarkDetox
 * GitHub: https://github.com/DarkDetox/fruitpuzzle
 * Twitter: @TheDevilxyz
 * Telegram: @DarkDexo
 * Email: darkdetox05@gmail.com
 * 
 * ⚠️ PROPRIETARY AND CONFIDENTIAL
 * This code is the intellectual property of DarkDetox.
 * Unauthorized copying, modification, or distribution
 * is strictly prohibited without written permission.
 * 
 * For licensing inquiries: darkdetox05@gmail.com
 * ============================================
 */
// ===== GAME CONSTANTS =====
const GRID_SIZE = 8;
const MERGE_GRID_SIZE = 4;
const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑'];
const MERGE_FRUITS = ['🍒', '🍓', '🍑', '🍊', '🍋', '🍌', '🍉', '🍇', '🍍', '🥝', '🥭'];

// ===== CUSTOM ASSET PATHS (OPTIONAL) =====
// If these files exist, they will be used. Otherwise, Web Audio API is used as fallback.
const CUSTOM_ASSETS = {
    backgroundMusic: './assets/background-music.mp3',
    matchSound: './assets/match.mp3',
    clickSound: './assets/click.mp3',
    winSound: './assets/win.mp3',
    loseSound: './assets/lose.mp3',
    fruitIcons: {
        apple: './assets/fruits/apple.png',
        orange: './assets/fruits/orange.png',
        lemon: './assets/fruits/lemon.png',
        grape: './assets/fruits/grape.png',
        strawberry: './assets/fruits/strawberry.png',
        cherry: './assets/fruits/cherry.png',
        peach: './assets/fruits/peach.png'
    }
};

// ===== GAME STATE =====
let board = [];
let merge2048Board = [];
let merge2048History = [];
let score = 0;
let merge2048Score = 0;
let moves = 20;
let currentLevel = 1;
let targetScore = 500;
let best2048Tile = 2;
let coins = 0;
let gameMode = 'level';
let isProcessing = false;
let soundEnabled = true;
let musicEnabled = true;
let currentTheme = 'theme-1';

// Inventory System
let inventory = {
    shuffle: 0,
    hint: 0,
    bomb: 0,
    moves: 0
};

let inventory2048 = {
    undo2048: 0,
    remove2048: 0,
    merge2048Power: 0,
    clearSmall2048: 0
};

// Swipe
let touchStartX = 0;
let touchStartY = 0;
let swipeStartTile = null;

// Audio
let audioContext;
let bgMusicElement;
let customAssetsLoaded = false;

// ===== THEMES =====
const THEMES = [
    { name: 'Purple Dream', class: 'theme-1', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Pink Sunset', class: 'theme-2', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Ocean Blue', class: 'theme-3', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Fresh Mint', class: 'theme-4', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Sunny Day', class: 'theme-5', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Deep Ocean', class: 'theme-6', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { name: 'Soft Pink', class: 'theme-7', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Sky Blue', class: 'theme-8', gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
    { name: 'Lavender', class: 'theme-9', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { name: 'Rose Gold', class: 'theme-10', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { name: 'Peach', class: 'theme-11', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { name: 'Cotton Candy', class: 'theme-12', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { name: 'Baby Blue', class: 'theme-13', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { name: 'Purple Pink', class: 'theme-14', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { name: 'Pastel Dream', class: 'theme-15', gradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)' },
    { name: 'Coral', class: 'theme-16', gradient: 'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)' },
    { name: 'Golden Hour', class: 'theme-17', gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' },
    { name: 'Violet', class: 'theme-18', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { name: 'Magenta', class: 'theme-19', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Cyan', class: 'theme-20', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Teal', class: 'theme-21', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Lemon', class: 'theme-22', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Navy', class: 'theme-23', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { name: 'Mint Cream', class: 'theme-24', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Royal Purple', class: 'theme-25', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Fuchsia', class: 'theme-26', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Ice Blue', class: 'theme-27', gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
    { name: 'Warm Peach', class: 'theme-28', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { name: 'Sky Fade', class: 'theme-29', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { name: 'Lilac', class: 'theme-30', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { name: 'Blush', class: 'theme-31', gradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)' },
    { name: 'Sunset Pink', class: 'theme-32', gradient: 'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)' },
    { name: 'Mango', class: 'theme-33', gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' },
    { name: 'Arctic Blue', class: 'theme-34', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    { name: 'Champagne', class: 'theme-35', gradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)' },
    { name: 'AMOLED Dark', class: 'theme-dark', gradient: '#000000' }
];

const LEVEL_CONFIG = [
    { level: 1, moves: 20, target: 500 },
    { level: 2, moves: 20, target: 700 },
    { level: 3, moves: 18, target: 900 },
    { level: 4, moves: 18, target: 1100 },
    { level: 5, moves: 16, target: 1300 },
    { level: 6, moves: 16, target: 1500 },
    { level: 7, moves: 15, target: 1700 },
    { level: 8, moves: 15, target: 2000 },
    { level: 9, moves: 14, target: 2300 },
    { level: 10, moves: 14, target: 2600 }
];

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
});

function showLoadingScreen() {
    const progress = document.getElementById('loadingProgress');
    if (progress) {
        setTimeout(() => {
            progress.style.width = '100%';
        }, 100);
    }
    
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        initializeGame();
    }, 2000);
}

function initializeGame() {
    loadGameData();
    updateModeSelection();
    setupMenuAudioControls();
    setupRippleEffect();
    loadTheme();
    generateThemeGrid();
    checkCustomAssets();
    initBackgroundMusic();
    
    const modeSelection = document.getElementById('modeSelection');
    if (modeSelection) {
        modeSelection.style.display = 'block';
    }
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(e => console.log('SW:', e.message));
    }
}

// ===== CUSTOM ASSET CHECKER =====
function checkCustomAssets() {
    // Check if custom background music exists
    const testAudio = new Audio();
    testAudio.src = CUSTOM_ASSETS.backgroundMusic;
    
    testAudio.addEventListener('canplaythrough', () => {
        customAssetsLoaded = true;
        console.log('Custom assets detected!');
    }, { once: true });
    
    testAudio.addEventListener('error', () => {
        customAssetsLoaded = false;
        console.log('Using Web Audio API fallback');
    }, { once: true });
}

// ===== BACKGROUND MUSIC (CUSTOM OR WEB AUDIO API) =====
function initBackgroundMusic() {
    document.addEventListener('click', startBackgroundMusic, { once: true });
}

function startBackgroundMusic() {
    if (!musicEnabled) return;
    
    if (customAssetsLoaded) {
        // Use custom music file
        if (!bgMusicElement) {
            bgMusicElement = new Audio(CUSTOM_ASSETS.backgroundMusic);
            bgMusicElement.loop = true;
            bgMusicElement.volume = 0.4;
        }
        bgMusicElement.play().catch(e => console.log('Music play failed:', e.message));
    } else {
        // Use Web Audio API fallback
        startWebAudioMusic();
    }
}

function startWebAudioMusic() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create a simple ambient background music using oscillators
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContext.destination);
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 220;
        osc2.frequency.value = 330;
        gain.gain.value = 0.03;
        
        // Create a melody pattern
        const notes = [220, 247, 262, 294, 330, 349, 392];
        let noteIndex = 0;
        
        function playNote() {
            if (!musicEnabled) return;
            osc1.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
            osc2.frequency.setValueAtTime(notes[(noteIndex + 2) % notes.length], audioContext.currentTime);
            noteIndex = (noteIndex + 1) % notes.length;
            setTimeout(playNote, 600);
        }
        
        osc1.start();
        osc2.start();
        playNote();
        
    } catch (e) {
        console.log('Web Audio API failed:', e.message);
    }
}

function toggleBackgroundMusic(enable) {
    musicEnabled = enable;
    
    if (bgMusicElement) {
        if (enable) {
            bgMusicElement.play().catch(() => {});
        } else {
            bgMusicElement.pause();
        }
    }
}

// ===== SOUND EFFECTS (CUSTOM OR WEB AUDIO API) =====
function playSound(soundType) {
    if (!soundEnabled) return;
    
    const soundMap = {
        click: CUSTOM_ASSETS.clickSound,
        match: CUSTOM_ASSETS.matchSound,
        win: CUSTOM_ASSETS.winSound,
        lose: CUSTOM_ASSETS.loseSound
    };
    
    if (customAssetsLoaded && soundMap[soundType]) {
        const audio = new Audio(soundMap[soundType]);
        audio.volume = 0.5;
        audio.play().catch(() => playWebAudioSound(soundType));
    } else {
        playWebAudioSound(soundType);
    }
}

function playWebAudioSound(soundType) {
    if (!soundEnabled) return;
    
    try {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        // Different sounds based on type
        switch(soundType) {
            case 'click':
                osc.frequency.value = 1200;
                gain.gain.setValueAtTime(0.04, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                osc.stop(audioContext.currentTime + 0.05);
                break;
            case 'match':
                osc.frequency.value = 800;
                osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.12);
                gain.gain.setValueAtTime(0.15, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
                osc.stop(audioContext.currentTime + 0.12);
                break;
            case 'win':
                osc.frequency.value = 523;
                osc.frequency.exponentialRampToValueAtTime(1047, audioContext.currentTime + 0.3);
                gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc.stop(audioContext.currentTime + 0.3);
                break;
            case 'lose':
                osc.frequency.value = 400;
                osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                gain.gain.setValueAtTime(0.15, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                osc.stop(audioContext.currentTime + 0.2);
                break;
        }
        
        osc.start();
    } catch (e) {}
}

// ===== RIPPLE EFFECT (NO BLUE HIGHLIGHT) =====
function setupRippleEffect() {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.ripple');
        if (!target) return;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        target.appendChild(ripple);
        playSound('click');

        setTimeout(() => ripple.remove(), 700);
    });
}

// ===== THEME SYSTEM =====
function generateThemeGrid() {
    const grid = document.getElementById('themeGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    THEMES.forEach(theme => {
        const div = document.createElement('div');
        div.className = 'theme-option ripple';
        div.style.background = theme.gradient;
        div.title = theme.name;
        if (theme.class === currentTheme) div.classList.add('active');
        div.onclick = () => selectTheme(theme.class);
        grid.appendChild(div);
    });
}

function selectTheme(themeClass) {
    currentTheme = themeClass;
    document.body.className = themeClass;
    localStorage.setItem('fruitMatchTheme', themeClass);
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');
}

function loadTheme() {
    const saved = localStorage.getItem('fruitMatchTheme');
    if (saved) {
        currentTheme = saved;
        document.body.className = saved;
    }
}

function openThemeSettings() {
    document.getElementById('themeModal').classList.add('active');
}

function closeThemeSettings() {
    document.getElementById('themeModal').classList.remove('active');
}

// ===== SHOP & INVENTORY SYSTEM =====
function openShop() {
    const modal = document.getElementById('shopModal');
    const coinsEl = document.getElementById('shopCoins');
    if (modal && coinsEl) {
        coinsEl.textContent = coins;
        modal.classList.add('active');
    }
}

function closeShop() {
    document.getElementById('shopModal').classList.remove('active');
}

function buyPowerUp(type) {
    const costs = { 
        shuffle: 10, 
        hint: 15, 
        bomb: 25, 
        moves: 20,
        undo2048: 15,
        remove2048: 20,
        merge2048Power: 30,
        clearSmall2048: 25
    };
    
    const cost = costs[type];
    
    if (coins < cost) {
        showMessage('❌ Not enough coins!');
        playSound('lose');
        return;
    }
    
    coins -= cost;
    
    // Add to appropriate inventory
    if (['shuffle', 'hint', 'bomb', 'moves'].includes(type)) {
        inventory[type]++;
    } else {
        inventory2048[type]++;
    }
    
    saveGameData();
    updateAllCoins();
    updateInventoryBadges();
    
    showMessage(`✨ ${type.toUpperCase()} added to inventory! -${cost} 🪙`);
    playSound('click');
}

function updateInventoryBadges() {
    const totalMatch3 = Object.values(inventory).reduce((a, b) => a + b, 0);
    const total2048 = Object.values(inventory2048).reduce((a, b) => a + b, 0);
    
    const badge1 = document.getElementById('inventoryBadge');
    const badge2 = document.getElementById('inventory2048Badge');
    
    if (badge1) badge1.textContent = totalMatch3;
    if (badge2) badge2.textContent = total2048;
}

// ===== INVENTORY MODALS =====
function openInventory() {
    const modal = document.getElementById('inventoryModal');
    const grid = document.getElementById('inventoryGrid');
    
    if (!modal || !grid) return;
    
    grid.innerHTML = '';
    
    const powerUps = [
        { key: 'shuffle', icon: '🔀', name: 'Shuffle Board' },
        { key: 'hint', icon: '💡', name: 'Hint' },
        { key: 'bomb', icon: '💣', name: 'Color Bomb' },
        { key: 'moves', icon: '➕', name: 'Extra Moves' }
    ];
    
    powerUps.forEach(powerUp => {
        const count = inventory[powerUp.key];
        const item = document.createElement('div');
        item.className = 'inventory-item ripple';
        item.innerHTML = `
            <div class="inventory-icon">${powerUp.icon}</div>
            <div class="inventory-name">${powerUp.name}</div>
            <div class="inventory-count">x${count}</div>
        `;
        
        if (count > 0) {
            item.onclick = () => usePowerUp(powerUp.key);
        } else {
            item.style.opacity = '0.5';
            item.style.cursor = 'not-allowed';
        }
        
        grid.appendChild(item);
    });
    
    modal.classList.add('active');
}

function closeInventory() {
    document.getElementById('inventoryModal').classList.remove('active');
}

function open2048Inventory() {
    const modal = document.getElementById('inventory2048Modal');
    const grid = document.getElementById('inventory2048Grid');
    
    if (!modal || !grid) return;
    
    grid.innerHTML = '';
    
    const powerUps = [
        { key: 'undo2048', icon: '↩️', name: 'Undo Move' },
        { key: 'remove2048', icon: '🗑️', name: 'Remove Tile' },
        { key: 'merge2048Power', icon: '⚡', name: 'Auto Merge' },
        { key: 'clearSmall2048', icon: '🧹', name: 'Clear Small' }
    ];
    
    powerUps.forEach(powerUp => {
        const count = inventory2048[powerUp.key];
        const item = document.createElement('div');
        item.className = 'inventory-item ripple';
        item.innerHTML = `
            <div class="inventory-icon">${powerUp.icon}</div>
            <div class="inventory-name">${powerUp.name}</div>
            <div class="inventory-count">x${count}</div>
        `;
        
        if (count > 0) {
            item.onclick = () => use2048PowerUp(powerUp.key);
        } else {
            item.style.opacity = '0.5';
            item.style.cursor = 'not-allowed';
        }
        
        grid.appendChild(item);
    });
    
    modal.classList.add('active');
}

function close2048Inventory() {
    document.getElementById('inventory2048Modal').classList.remove('active');
}

// ===== USE POWER-UPS (FROM INVENTORY) =====
function usePowerUp(type) {
    if (inventory[type] <= 0) {
        showMessage('❌ No power-ups left!');
        return;
    }
    
    inventory[type]--;
    updateInventoryBadges();
    saveGameData();
    closeInventory();
    
    if (type === 'shuffle') shuffle();
    else if (type === 'hint') showHint();
    else if (type === 'bomb') activateColorBomb();
    else if (type === 'moves') { 
        moves += 5; 
        updateScore(); 
        showMessage('✨ +5 moves added!');
    }
}

function use2048PowerUp(type) {
    if (inventory2048[type] <= 0) {
        showMessage('❌ No power-ups left!');
        return;
    }
    
    inventory2048[type]--;
    updateInventoryBadges();
    saveGameData();
    close2048Inventory();
    
    if (type === 'undo2048') undo2048Move();
    else if (type === 'remove2048') removeLowestTile();
    else if (type === 'merge2048Power') autoMergeTiles();
    else if (type === 'clearSmall2048') clearSmallTiles();
}

// ===== LOAD/SAVE =====
function loadGameData() {
    currentLevel = parseInt(localStorage.getItem('fruitMatchLevel')) || 1;
    coins = parseInt(localStorage.getItem('fruitMatchCoins')) || 0;
    best2048Tile = parseInt(localStorage.getItem('fruitMatch2048Best')) || 2;
    soundEnabled = localStorage.getItem('fruitMatchSoundEnabled') !== 'false';
    musicEnabled = localStorage.getItem('fruitMatchMusicEnabled') !== 'false';
    
    const savedInventory = localStorage.getItem('fruitMatchInventory');
    const savedInventory2048 = localStorage.getItem('fruitMatchInventory2048');
    
    if (savedInventory) inventory = JSON.parse(savedInventory);
    if (savedInventory2048) inventory2048 = JSON.parse(savedInventory2048);
}

function saveGameData() {
    localStorage.setItem('fruitMatchLevel', currentLevel);
    localStorage.setItem('fruitMatchCoins', coins);
    localStorage.setItem('fruitMatch2048Best', best2048Tile);
    localStorage.setItem('fruitMatchSoundEnabled', soundEnabled);
    localStorage.setItem('fruitMatchMusicEnabled', musicEnabled);
    localStorage.setItem('fruitMatchInventory', JSON.stringify(inventory));
    localStorage.setItem('fruitMatchInventory2048', JSON.stringify(inventory2048));
}

// ===== MODE SELECTION =====
function updateModeSelection() {
    const levelEl = document.getElementById('currentLevelDisplay');
    const best2048El = document.getElementById('best2048Display');
    const coinsEl = document.getElementById('menuCoins');
    
    if (levelEl) levelEl.textContent = currentLevel;
    if (best2048El) best2048El.textContent = best2048Tile;
    if (coinsEl) coinsEl.textContent = coins;
    
    updateInventoryBadges();
}

function updateAllCoins() {
    const ids = ['coins', 'menuCoins', 'shopCoins', 'merge2048Coins'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = coins;
    });
}

// ===== AUDIO CONTROLS =====
function setupMenuAudioControls() {
    const musicBtn = document.getElementById('musicToggleMenu');
    const sfxBtn = document.getElementById('sfxToggleMenu');
    
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            musicEnabled = !musicEnabled;
            toggleBackgroundMusic(musicEnabled);
            updateMenuButtons();
            saveGameData();
        });
    }
    
    if (sfxBtn) {
        sfxBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            updateMenuButtons();
            saveGameData();
        });
    }
    
    updateMenuButtons();
}

function updateMenuButtons() {
    const musicBtn = document.getElementById('musicToggleMenu');
    const sfxBtn = document.getElementById('sfxToggleMenu');
    
    if (musicBtn) {
        const icon = musicBtn.querySelector('.material-icons-outlined');
        if (icon) icon.textContent = musicEnabled ? 'music_note' : 'music_off';
        musicBtn.classList.toggle('muted', !musicEnabled);
    }
    
    if (sfxBtn) {
        const icon = sfxBtn.querySelector('.material-icons-outlined');
        if (icon) icon.textContent = soundEnabled ? 'volume_up' : 'volume_off';
        sfxBtn.classList.toggle('muted', !soundEnabled);
    }
}

// ===== GAME MODE SELECTION =====
function selectMode(mode) {
    gameMode = mode;
    document.getElementById('modeSelection').style.display = 'none';

    if (mode === 'level') {
        document.getElementById('gameContainer').style.display = 'block';
        initLevelMode();
    } else if (mode === 'merge2048') {
        document.getElementById('merge2048Container').style.display = 'block';
        initMerge2048();
    }
}

function initLevelMode() {
    const config = LEVEL_CONFIG[Math.min(currentLevel - 1, LEVEL_CONFIG.length - 1)] || LEVEL_CONFIG[0];
    moves = config.moves;
    targetScore = config.target;
    document.getElementById('gameTitle').textContent = `Level ${currentLevel}`;
    document.getElementById('target').textContent = targetScore;
    initGame();
}

function backToMenu() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('merge2048Container').style.display = 'none';
    document.getElementById('gameOverModal').classList.remove('active');
    document.getElementById('levelCompleteModal').classList.remove('active');
    document.getElementById('merge2048GameOverModal').classList.remove('active');
    document.getElementById('modeSelection').style.display = 'block';
    updateModeSelection();
}

// ===== MATCH-3 GAME =====
function initGame() {
    board = [];
    score = 0;
    isProcessing = false;
    createBoard();
    while (findMatches().length > 0) {
        removeMatches();
        applyGravity();
    }
    renderBoard();
    setupSwipe();
    setupGameAudio();
    updateScore();
    showMessage('🎯 Match 3 or more fruits!');
}

function setupGameAudio() {
    ['musicToggle', 'sfxToggle'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                if (id === 'musicToggle') {
                    musicEnabled = !musicEnabled;
                    toggleBackgroundMusic(musicEnabled);
                } else {
                    soundEnabled = !soundEnabled;
                }
                updateGameButtons();
                saveGameData();
            });
        }
    });
    updateGameButtons();
}

function updateGameButtons() {
    const musicBtn = document.getElementById('musicToggle');
    const sfxBtn = document.getElementById('sfxToggle');
    
    if (musicBtn) {
        const icon = musicBtn.querySelector('.material-icons-outlined');
        if (icon) icon.textContent = musicEnabled ? 'music_note' : 'music_off';
        musicBtn.classList.toggle('muted', !musicEnabled);
    }
    
    if (sfxBtn) {
        const icon = sfxBtn.querySelector('.material-icons-outlined');
        if (icon) icon.textContent = soundEnabled ? 'volume_up' : 'volume_off';
        sfxBtn.classList.toggle('muted', !soundEnabled);
    }
}

function createBoard() {
    for (let r = 0; r < GRID_SIZE; r++) {
        board[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            board[r][c] = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        }
    }
}

function renderBoard() {
    const gb = document.getElementById('gameBoard');
    if (!gb) return;
    gb.innerHTML = '';
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile ripple';
            tile.textContent = board[r][c];
            tile.dataset.row = r;
            tile.dataset.col = c;
            gb.appendChild(tile);
        }
    }
}

// ===== SWIPE =====
function setupSwipe() {
    const gb = document.getElementById('gameBoard');
    if (!gb) return;
    gb.addEventListener('touchstart', handleTouchStart, { passive: false });
    gb.addEventListener('touchend', handleTouchEnd, { passive: false });
    gb.addEventListener('mousedown', handleMouseDown);
    gb.addEventListener('mouseup', handleMouseUp);
}

function handleTouchStart(e) {
    if (isProcessing || moves <= 0) return;
    e.preventDefault();
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    if (el && el.classList.contains('tile')) {
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        swipeStartTile = { row: +el.dataset.row, col: +el.dataset.col, el };
        el.classList.add('swiping');
    }
}

function handleTouchEnd(e) {
    if (!swipeStartTile) return;
    e.preventDefault();
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    swipeStartTile.el.classList.remove('swiping');
    
    let target = null;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && swipeStartTile.col < GRID_SIZE - 1) target = { row: swipeStartTile.row, col: swipeStartTile.col + 1 };
            else if (dx < 0 && swipeStartTile.col > 0) target = { row: swipeStartTile.row, col: swipeStartTile.col - 1 };
        } else {
            if (dy > 0 && swipeStartTile.row < GRID_SIZE - 1) target = { row: swipeStartTile.row + 1, col: swipeStartTile.col };
            else if (dy < 0 && swipeStartTile.row > 0) target = { row: swipeStartTile.row - 1, col: swipeStartTile.col };
        }
        if (target) swapTiles(swipeStartTile, target);
    }
    swipeStartTile = null;
}

function handleMouseDown(e) {
    if (isProcessing || moves <= 0) return;
    const el = e.target;
    if (el && el.classList.contains('tile')) {
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        swipeStartTile = { row: +el.dataset.row, col: +el.dataset.col, el };
        el.classList.add('swiping');
    }
}

function handleMouseUp(e) {
    if (!swipeStartTile) return;
    const dx = e.clientX - touchStartX;
    const dy = e.clientY - touchStartY;
    swipeStartTile.el.classList.remove('swiping');
    
    let target = null;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && swipeStartTile.col < GRID_SIZE - 1) target = { row: swipeStartTile.row, col: swipeStartTile.col + 1 };
            else if (dx < 0 && swipeStartTile.col > 0) target = { row: swipeStartTile.row, col: swipeStartTile.col - 1 };
        } else {
            if (dy > 0 && swipeStartTile.row < GRID_SIZE - 1) target = { row: swipeStartTile.row + 1, col: swipeStartTile.col };
            else if (dy < 0 && swipeStartTile.row > 0) target = { row: swipeStartTile.row - 1, col: swipeStartTile.col };
        }
        if (target) swapTiles(swipeStartTile, target);
    }
    swipeStartTile = null;
}

// ===== MATCH LOGIC =====
function swapTiles(t1, t2) {
    isProcessing = true;
    [board[t1.row][t1.col], board[t2.row][t2.col]] = [board[t2.row][t2.col], board[t1.row][t1.col]];
    renderBoard();
    
    setTimeout(() => {
        const matches = findMatches();
        if (matches.length > 0) {
            moves--;
            updateScore();
            processMatches();
        } else {
            [board[t1.row][t1.col], board[t2.row][t2.col]] = [board[t2.row][t2.col], board[t1.row][t1.col]];
            renderBoard();
            showMessage('❌ No matches!');
            isProcessing = false;
        }
        checkGameStatus();
    }, 300);
}

function findMatches() {
    const matches = [];
    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - 2; c++) {
            const f = board[r][c];
            if (f && board[r][c+1] === f && board[r][c+2] === f) {
                let len = 3;
                while (c + len < GRID_SIZE && board[r][c+len] === f) len++;
                for (let i = 0; i < len; i++) matches.push({ row: r, col: c+i });
                c += len - 1;
            }
        }
    }
    
    for (let c = 0; c < GRID_SIZE; c++) {
        for (let r = 0; r < GRID_SIZE - 2; r++) {
            const f = board[r][c];
            if (f && board[r+1][c] === f && board[r+2][c] === f) {
                let len = 3;
                while (r + len < GRID_SIZE && board[r+len][c] === f) len++;
                for (let i = 0; i < len; i++) matches.push({ row: r+i, col: c });
                r += len - 1;
            }
        }
    }
    
    return matches.filter((m, i, a) => i === a.findIndex(t => t.row === m.row && t.col === m.col));
}

function processMatches() {
    const matches = findMatches();
    if (matches.length === 0) {
        isProcessing = false;
        return;
    }
    
    playSound('match');
    matches.forEach((m, i) => {
        const tile = document.querySelector(`[data-row="${m.row}"][data-col="${m.col}"]`);
        if (tile && typeof gsap !== 'undefined') {
            gsap.to(tile, { scale: 0, rotation: 360, duration: 0.4, delay: i * 0.02 });
        }
    });
    
    const pts = matches.length * 20;
    score += pts;
    coins += Math.max(1, Math.floor(pts / 30));
    updateScore();
    showMessage(`+${pts} | +${Math.max(1, Math.floor(pts / 30))} 🪙`);
    
    setTimeout(() => {
        removeMatches();
        applyGravity();
        renderBoard();
        setTimeout(() => processMatches(), 300);
    }, 500);
}

function removeMatches() {
    findMatches().forEach(m => board[m.row][m.col] = null);
}

function applyGravity() {
    for (let c = 0; c < GRID_SIZE; c++) {
        let empty = GRID_SIZE - 1;
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
            if (board[r][c] !== null) {
                if (r !== empty) {
                    board[empty][c] = board[r][c];
                    board[r][c] = null;
                }
                empty--;
            }
        }
    }
    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === null) {
                board[r][c] = FRUITS[Math.floor(Math.random() * FRUITS.length)];
            }
        }
    }
}

function updateScore() {
    ['score', 'moves', 'coins'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = id === 'score' ? score : id === 'moves' ? moves : coins;
    });
    updateAllCoins();
    saveGameData();
}

function showMessage(txt) {
    const el = document.getElementById('message');
    if (el) {
        el.innerHTML = txt;
        setTimeout(() => { if (el.innerHTML === txt) el.innerHTML = ''; }, 2500);
    }
}

// ===== POWER-UPS (WORKING WITH HINTS) =====
function shuffle() {
    const fruits = board.flat().filter(f => f);
    for (let i = fruits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fruits[i], fruits[j]] = [fruits[j], fruits[i]];
    }
    let idx = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c]) board[r][c] = fruits[idx++];
        }
    }
    while (findMatches().length > 0) { 
        removeMatches(); 
        applyGravity(); 
    }
    renderBoard();
    showMessage('🔀 Board shuffled!');
    playSound('click');
}

function showHint() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (c < GRID_SIZE - 1) {
                [board[r][c], board[r][c+1]] = [board[r][c+1], board[r][c]];
                if (findMatches().length > 0) {
                    [board[r][c], board[r][c+1]] = [board[r][c+1], board[r][c]];
                    highlightHint(r, c, r, c+1);
                    return;
                }
                [board[r][c], board[r][c+1]] = [board[r][c+1], board[r][c]];
            }
            if (r < GRID_SIZE - 1) {
                [board[r][c], board[r+1][c]] = [board[r+1][c], board[r][c]];
                if (findMatches().length > 0) {
                    [board[r][c], board[r+1][c]] = [board[r+1][c], board[r][c]];
                    highlightHint(r, c, r+1, c);
                    return;
                }
                [board[r][c], board[r+1][c]] = [board[r+1][c], board[r][c]];
            }
        }
    }
    showMessage('💡 No hints available!');
}

function highlightHint(r1, c1, r2, c2) {
    const tile1 = document.querySelector(`[data-row="${r1}"][data-col="${c1}"]`);
    const tile2 = document.querySelector(`[data-row="${r2}"][data-col="${c2}"]`);
    
    if (tile1 && tile2) {
        tile1.classList.add('hint-glow');
        tile2.classList.add('hint-glow');
        
        setTimeout(() => {
            tile1.classList.remove('hint-glow');
            tile2.classList.remove('hint-glow');
        }, 3000);
        
        showMessage('💡 Try swapping these fruits!');
        playSound('click');
    }
}

function activateColorBomb() {
    const counts = {};
    board.flat().filter(f => f).forEach(f => counts[f] = (counts[f] || 0) + 1);
    const most = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    let cleared = 0;
    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === most) { 
                board[r][c] = null; 
                cleared++; 
            }
        }
    }
    
    score += cleared * 20;
    coins += Math.floor(cleared / 3);
    renderBoard();
    playSound('match');
    
    setTimeout(() => { 
        applyGravity(); 
        renderBoard(); 
        processMatches(); 
    }, 400);
    
    showMessage(`💥 Cleared ${cleared} ${most}!`);
}

// ===== GAME STATUS =====
function checkGameStatus() {
    if (score >= targetScore) {
        setTimeout(() => levelComplete(), 500);
    } else if (moves <= 0) {
        setTimeout(() => gameOver(), 500);
    }
}

function levelComplete() {
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    playSound('win');
    const earned = Math.floor(score / 60) + 20;
    coins += earned;
    saveGameData();
    document.getElementById('modalScore').textContent = score;
    document.getElementById('modalCoins').textContent = earned;
    document.getElementById('levelCompleteModal').classList.add('active');
}

function nextLevel() {
    document.getElementById('levelCompleteModal').classList.remove('active');
    currentLevel++;
    saveGameData();
    selectMode('level');
}

function gameOver() {
    playSound('lose');
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverMessage').textContent = `You needed ${targetScore - score} more points!`;
    document.getElementById('gameOverModal').classList.add('active');
}

function resetGame() {
    document.getElementById('gameOverModal').classList.remove('active');
    initLevelMode();
}

// ===== 2048 MERGE GAME =====
function initMerge2048() {
    merge2048Board = Array(MERGE_GRID_SIZE).fill().map(() => Array(MERGE_GRID_SIZE).fill(0));
    merge2048History = [];
    merge2048Score = 0;
    addRandomTile();
    addRandomTile();
    renderMerge();
    setup2048Audio();
    update2048Score();
    show2048Message('🍇 Use arrows to merge!');
}

function setup2048Audio() {
    ['musicToggleMerge', 'sfxToggleMerge'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                if (id === 'musicToggleMerge') {
                    musicEnabled = !musicEnabled;
                    toggleBackgroundMusic(musicEnabled);
                } else {
                    soundEnabled = !soundEnabled;
                }
                update2048Buttons();
                saveGameData();
            });
        }
    });
    update2048Buttons();
}

function update2048Buttons() {
    const musicBtn = document.getElementById('musicToggleMerge');
    const sfxBtn = document.getElementById('sfxToggleMerge');
    
    if (musicBtn) {
        const icon = musicBtn.querySelector('.material-icons-outlined');
        if (icon) icon.textContent = musicEnabled ? 'music_note' : 'music_off';
        musicBtn.classList.toggle('muted', !musicEnabled);
    }
    
    if (sfxBtn) {
        const icon = sfxBtn.querySelector('.material-icons-outlined');
        if (icon) icon.textContent = soundEnabled ? 'volume_up' : 'volume_off';
        sfxBtn.classList.toggle('muted', !soundEnabled);
    }
}

function addRandomTile() {
    const empty = [];
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            if (merge2048Board[i][j] === 0) empty.push({ r: i, c: j });
        }
    }
    if (empty.length > 0) {
        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        merge2048Board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderMerge() {
    const board = document.getElementById('merge2048Board');
    if (!board) return;
    board.innerHTML = '';
    
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            const tile = document.createElement('div');
            const val = merge2048Board[i][j];
            
            if (val === 0) {
                tile.className = 'merge-tile empty';
            } else {
                tile.className = 'merge-tile';
                tile.dataset.value = val;
                const idx = Math.log2(val) - 1;
                tile.textContent = MERGE_FRUITS[idx] || '🌟';
                
                const span = document.createElement('div');
                span.className = 'merge-tile-value';
                span.textContent = val;
                tile.appendChild(span);
            }
            board.appendChild(tile);
        }
    }
}

function moveMerge(dir) {
    // Save state for undo
    merge2048History.push(JSON.parse(JSON.stringify(merge2048Board)));
    if (merge2048History.length > 10) merge2048History.shift();
    
    let moved = false;
    
    if (dir === 'left') moved = moveLeft();
    else if (dir === 'right') moved = moveRight();
    else if (dir === 'up') moved = moveUp();
    else if (dir === 'down') moved = moveDown();
    
    if (moved) {
        playSound('match');
        renderMerge();
        
        setTimeout(() => {
            addRandomTile();
            renderMerge();
            
            if (isGameOver()) {
                setTimeout(() => showMerge2048GameOver(), 300);
            }
        }, 200);
    } else {
        merge2048History.pop();
    }
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        const row = merge2048Board[i].filter(v => v !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j+1]) {
                row[j] *= 2;
                merge2048Score += row[j];
                coins += Math.floor(row[j] / 8);
                row.splice(j+1, 1);
                playSound('match');
                if (row[j] > best2048Tile) {
                    best2048Tile = row[j];
                    saveGameData();
                }
            }
        }
        while (row.length < MERGE_GRID_SIZE) row.push(0);
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            if (merge2048Board[i][j] !== row[j]) moved = true;
            merge2048Board[i][j] = row[j];
        }
    }
    update2048Score();
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        const row = merge2048Board[i].filter(v => v !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j-1]) {
                row[j] *= 2;
                merge2048Score += row[j];
                coins += Math.floor(row[j] / 8);
                row.splice(j-1, 1);
                playSound('match');
                if (row[j] > best2048Tile) {
                    best2048Tile = row[j];
                    saveGameData();
                }
            }
        }
        while (row.length < MERGE_GRID_SIZE) row.unshift(0);
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            if (merge2048Board[i][j] !== row[j]) moved = true;
            merge2048Board[i][j] = row[j];
        }
    }
    update2048Score();
    return moved;
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < MERGE_GRID_SIZE; j++) {
        const col = [];
        for (let i = 0; i < MERGE_GRID_SIZE; i++) {
            if (merge2048Board[i][j] !== 0) col.push(merge2048Board[i][j]);
        }
        for (let i = 0; i < col.length - 1; i++) {
            if (col[i] === col[i+1]) {
                col[i] *= 2;
                merge2048Score += col[i];
                coins += Math.floor(col[i] / 8);
                col.splice(i+1, 1);
                playSound('match');
                if (col[i] > best2048Tile) {
                    best2048Tile = col[i];
                    saveGameData();
                }
            }
        }
        while (col.length < MERGE_GRID_SIZE) col.push(0);
        for (let i = 0; i < MERGE_GRID_SIZE; i++) {
            if (merge2048Board[i][j] !== col[i]) moved = true;
            merge2048Board[i][j] = col[i];
        }
    }
    update2048Score();
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < MERGE_GRID_SIZE; j++) {
        const col = [];
        for (let i = 0; i < MERGE_GRID_SIZE; i++) {
            if (merge2048Board[i][j] !== 0) col.push(merge2048Board[i][j]);
        }
        for (let i = col.length - 1; i > 0; i--) {
            if (col[i] === col[i-1]) {
                col[i] *= 2;
                merge2048Score += col[i];
                coins += Math.floor(col[i] / 8);
                col.splice(i-1, 1);
                playSound('match');
                if (col[i] > best2048Tile) {
                    best2048Tile = col[i];
                    saveGameData();
                }
            }
        }
        while (col.length < MERGE_GRID_SIZE) col.unshift(0);
        for (let i = 0; i < MERGE_GRID_SIZE; i++) {
            if (merge2048Board[i][j] !== col[i]) moved = true;
            merge2048Board[i][j] = col[i];
        }
    }
    update2048Score();
    return moved;
}

function isGameOver() {
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            if (merge2048Board[i][j] === 0) return false;
            if (j < MERGE_GRID_SIZE - 1 && merge2048Board[i][j] === merge2048Board[i][j+1]) return false;
            if (i < MERGE_GRID_SIZE - 1 && merge2048Board[i][j] === merge2048Board[i+1][j]) return false;
        }
    }
    return true;
}

function showMerge2048GameOver() {
    playSound('lose');
    document.getElementById('merge2048FinalScore').textContent = merge2048Score;
    document.getElementById('merge2048FinalBest').textContent = best2048Tile;
    document.getElementById('merge2048GameOverModal').classList.add('active');
}

function closeMerge2048GameOver() {
    document.getElementById('merge2048GameOverModal').classList.remove('active');
}

function update2048Score() {
    ['merge2048Score', 'merge2048Best', 'merge2048Coins'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = id === 'merge2048Score' ? merge2048Score : 
                           id === 'merge2048Best' ? best2048Tile : coins;
        }
    });
    updateAllCoins();
    saveGameData();
}

function show2048Message(txt) {
    const el = document.getElementById('merge2048Message');
    if (el) {
        el.innerHTML = txt;
        setTimeout(() => { 
            if (el.innerHTML === txt) el.innerHTML = ''; 
        }, 2500);
    }
}

function resetMerge2048() {
    initMerge2048();
}

// ===== 2048 POWER-UPS =====
function undo2048Move() {
    if (merge2048History.length === 0) {
        show2048Message('❌ No moves to undo!');
        return;
    }
    merge2048Board = merge2048History.pop();
    renderMerge();
    show2048Message('↩️ Move undone!');
    playSound('click');
}

function removeLowestTile() {
    let minVal = Infinity;
    let minPos = null;
    
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            if (merge2048Board[i][j] > 0 && merge2048Board[i][j] < minVal) {
                minVal = merge2048Board[i][j];
                minPos = { r: i, c: j };
            }
        }
    }
    
    if (minPos) {
        merge2048Board[minPos.r][minPos.c] = 0;
        renderMerge();
        show2048Message(`🗑️ Removed ${minVal}!`);
        playSound('click');
    }
}

function autoMergeTiles() {
    let merged = false;
    
    for (let i = 0; i < MERGE_GRID_SIZE && !merged; i++) {
        for (let j = 0; j < MERGE_GRID_SIZE - 1 && !merged; j++) {
            if (merge2048Board[i][j] > 0 && merge2048Board[i][j] === merge2048Board[i][j+1]) {
                merge2048Board[i][j] *= 2;
                merge2048Score += merge2048Board[i][j];
                coins += Math.floor(merge2048Board[i][j] / 8);
                merge2048Board[i][j+1] = 0;
                merged = true;
            }
        }
    }
    
    if (merged) {
        setTimeout(() => {
            moveMerge('left');
        }, 300);
        renderMerge();
        show2048Message('⚡ Auto merged!');
        playSound('match');
    } else {
        show2048Message('❌ No tiles to merge!');
    }
}

function clearSmallTiles() {
    let cleared = 0;
    
    for (let i = 0; i < MERGE_GRID_SIZE; i++) {
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
            if (merge2048Board[i][j] > 0 && merge2048Board[i][j] < 8) {
                merge2048Board[i][j] = 0;
                cleared++;
            }
        }
    }
    
    if (cleared > 0) {
        renderMerge();
        show2048Message(`🧹 Cleared ${cleared} small tiles!`);
        playSound('click');
    } else {
        show2048Message('❌ No small tiles to clear!');
    }
}

// ===== KEYBOARD SUPPORT FOR 2048 =====
document.addEventListener('keydown', function(e) {
    const container = document.getElementById('merge2048Container');
    if (!container || container.style.display === 'none') return;
    
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        moveMerge('up');
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moveMerge('down');
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveMerge('left');
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveMerge('right');
    }
});


/*!
 * ============================================
 * Fruit Puzzle - Game Logic
 * ============================================
 * 
 * Copyright © 2025 DarkDetox. All Rights Reserved.
 * 
 * Author: DarkDetox
 * GitHub: https://github.com/DarkDetox/fruitpuzzle
 * Twitter: @TheDevilxyz
 * Telegram: @DarkDexo
 * Email: darkdetox05@gmail.com
 * 
 * ⚠️ PROPRIETARY AND CONFIDENTIAL
 * This code is the intellectual property of DarkDetox.
 * Unauthorized copying, modification, or distribution
 * is strictly prohibited without written permission.
 * 
 * For licensing inquiries: darkdetox05@gmail.com
 * ============================================
 */