// ===== ROOM 1: VAULT OF ECHOES - MEMORY MATCHING GAME =====

// Game state variables
let gameGrid = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 10;
let canClick = true;

// Memory fragments - 4 unique symbols, each appearing twice (8 cards total)
const memoryFragments = [
  { id: 1, symbol: '🗡️', type: 'sword', name: 'Sword' },
  { id: 2, symbol: '🗡️', type: 'sword', name: 'Sword' },
  { id: 3, symbol: '🔮', type: 'crystal', name: 'Crystal' },
  { id: 4, symbol: '🔮', type: 'crystal', name: 'Crystal' },
  { id: 5, symbol: '📖', type: 'tome', name: 'Tome' },
  { id: 6, symbol: '📖', type: 'tome', name: 'Tome' },
  { id: 7, symbol: '🌟', type: 'star', name: 'Star' },
  { id: 8, symbol: '🌟', type: 'star', name: 'Star' },
  { id: 9, symbol: '🏺', type: 'relic', name: 'Ancient Relic' },
  { id: 10, symbol: '🏺', type: 'relic', name: 'Ancient Relic' },
  { id: 11, symbol: '💎', type: 'gem', name: 'Mystical Gem' },
  { id: 12, symbol: '💎', type: 'gem', name: 'Mystical Gem' },
  { id: 13, symbol: '🔑', type: 'key', name: 'Ethereal Key' },
  { id: 14, symbol: '🔑', type: 'key', name: 'Ethereal Key' },
  { id: 15, symbol: '🌙', type: 'moon', name: 'Lunar Essence' },
  { id: 16, symbol: '🌙', type: 'moon', name: 'Lunar Essence' },
  { id: 17, symbol: '⚡', type: 'lightning', name: 'Storm Fragment' },
  { id: 18, symbol: '⚡', type: 'lightning', name: 'Storm Fragment' },
  { id: 19, symbol: '🔥', type: 'flame', name: 'Phoenix Fire' },
  { id: 20, symbol: '🔥', type: 'flame', name: 'Phoenix Fire' }
];

// Initialize the game
function initializeMemoryGame() {
  createFloatingEffects();
  shuffleCards();
  createMemoryGrid();
  updateProgress();
}

// Create floating runes and echo particles
function createFloatingEffects() {
  const floatingRunes = document.getElementById('floatingRunes');
  const echoParticles = document.getElementById('echoParticles');
  
  // Create floating runes
  const runeSymbols = ['◈', '⟐', '✦', '◊', '⬟', '◈', '⟡', '◉'];
  for (let i = 0; i < 15; i++) {
    const rune = document.createElement('div');
    rune.className = 'floating-rune';
    rune.textContent = runeSymbols[Math.floor(Math.random() * runeSymbols.length)];
    rune.style.left = Math.random() * 100 + '%';
    rune.style.top = Math.random() * 100 + '%';
    rune.style.animationDelay = Math.random() * 8 + 's';
    rune.style.animationDuration = (6 + Math.random() * 4) + 's';
    floatingRunes.appendChild(rune);
  }
  
  // Create echo particles
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'echo-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    echoParticles.appendChild(particle);
  }
}

// Shuffle the memory fragments
function shuffleCards() {
  gameGrid = [...memoryFragments];
  
  // Fisher-Yates shuffle algorithm
  for (let i = gameGrid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameGrid[i], gameGrid[j]] = [gameGrid[j], gameGrid[i]];
  }
}

// Create the memory card grid
function createMemoryGrid() {
  const memoryGrid = document.getElementById('memoryGrid');
  memoryGrid.innerHTML = '';
  
  gameGrid.forEach((fragment, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.id = fragment.id;
    card.dataset.pair = fragment.pair;
    card.dataset.index = index;
    
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="fragment-icon">✨</div>
        </div>
        <div class="card-back">
          ${fragment.symbol}
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => flipCard(card, fragment));
    memoryGrid.appendChild(card);
  });
}

// Handle card flip
function flipCard(cardElement, fragment) {
  if (!canClick || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
    return;
  }
  
  // Flip the card
  cardElement.classList.add('flipped');
  flippedCards.push({ element: cardElement, fragment: fragment });
  
  // Play whisper sound effect (if available)
  playSound('whisper');
  
  // Check if two cards are flipped
  if (flippedCards.length === 2) {
    canClick = false;
    setTimeout(checkMatch, 800);
  }
}

// Check if flipped cards match
function checkMatch() {
  const [card1, card2] = flippedCards;
  
  // Check if both cards have the same type (same symbol)
  if (card1.fragment.type === card2.fragment.type && card1.fragment.id !== card2.fragment.id) {
    // Cards match!
    card1.element.classList.add('matched');
    card2.element.classList.add('matched');
    matchedPairs++;
    
    playSound('match');
    updateProgress();
    
    // Check if game is complete
    if (matchedPairs === totalPairs) {
      setTimeout(showVictory, 1000);
    }
  } else {
    // Cards don't match - flip them back
    setTimeout(() => {
      card1.element.classList.remove('flipped');
      card2.element.classList.remove('flipped');
      playSound('mismatch');
    }, 500);
  }
  
  flippedCards = [];
  canClick = true;
}

// Update progress display
function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  const percentage = (matchedPairs / totalPairs) * 100;
  progressFill.style.width = percentage + '%';
  progressText.textContent = `${matchedPairs}/${totalPairs}`;
  
  // Add glow effect when progress increases
  if (matchedPairs > 0) {
    progressFill.style.boxShadow = `0 0 20px rgba(232, 213, 255, ${0.6 + (percentage / 100) * 0.4})`;
  }
}

// Show victory modal
function showVictory() {
  const victoryModal = document.getElementById('victoryModal');
  victoryModal.style.display = 'flex';
  
  // Create ethereal victory animation
  createVictoryEffects();
  
  // Play victory sound
  playSound('victory');
  
  // Start fragment scroll animation
  animateFragmentScroll();
}

// Create victory visual effects
function createVictoryEffects() {
  // Add light spirals and echo effects around the victory modal
  const victoryPanel = document.querySelector('.victory-panel');
  
  // Create spiral light effect
  for (let i = 0; i < 8; i++) {
    const light = document.createElement('div');
    light.className = 'victory-light';
    light.style.position = 'absolute';
    light.style.width = '4px';
    light.style.height = '4px';
    light.style.background = 'rgba(232, 213, 255, 0.8)';
    light.style.borderRadius = '50%';
    light.style.boxShadow = '0 0 10px rgba(232, 213, 255, 1)';
    light.style.animation = `victorySpiral 3s ease-in-out infinite`;
    light.style.animationDelay = (i * 0.2) + 's';
    victoryPanel.appendChild(light);
  }
}

// Animate the fragment scroll
function animateFragmentScroll() {
  const fragmentScroll = document.querySelector('.fragment-scroll');
  
  // Add unfurling effect
  setTimeout(() => {
    fragmentScroll.style.transform = 'scale(1.2) rotateY(180deg)';
    fragmentScroll.style.boxShadow = '0 0 40px rgba(232, 213, 255, 1)';
  }, 1000);
  
    setTimeout(() => {
    fragmentScroll.style.transform = 'scale(1) rotateY(0deg)';
    }, 2000);
  }

// Sound effects (placeholder for actual audio)
function playSound(type) {
  // In a full implementation, you would play actual sound files here
  console.log(`Playing sound: ${type}`);
  
  // For now, we'll add visual feedback
  switch(type) {
    case 'whisper':
      // Add brief glow to the flipped card
      break;
    case 'match':
      // Add success particle burst
      createMatchEffect();
      break;
    case 'mismatch':
      // Add shake effect to mismatched cards
      break;
    case 'victory':
      // Victory fanfare visual effect
      break;
  }
}

// Create match effect
function createMatchEffect() {
  const memoryGrid = document.getElementById('memoryGrid');
  
  for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
    particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
    particle.style.background = 'rgba(200, 255, 200, 0.9)';
        particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 10px rgba(200, 255, 200, 1)';
    particle.style.left = '50%';
    particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
    particle.style.animation = `matchBurst 1s ease-out forwards`;
    particle.style.animationDelay = (i * 0.1) + 's';
    
    memoryGrid.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1200);
  }
}

// Proceed to next room
function proceedToNextRoom() {
  // Navigate directly to Room 2: Mind's Mirror
  window.location.href = 'room-2-minds-mirror.html';
}

// Add CSS keyframes for dynamic animations
const additionalStyles = `
@keyframes victorySpiral {
  0% { 
    transform: rotate(0deg) translateX(50px) rotate(0deg);
        opacity: 0;
      }
  50% { 
        opacity: 1;
      }
      100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
        opacity: 0;
      }
    }

@keyframes matchBurst {
      0% {
    transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
    transform: translate(-50%, -50%) scale(3) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
        opacity: 0;
      }
    }
`;

// Add the additional styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeMemoryGame();
  
  // Initialize existing stars and timer if they exist
  if (typeof createStars === 'function') {
    createStars();
  }
  
  if (typeof startGlobalTimer === 'function') {
    startGlobalTimer();
  }
});

// Export functions for potential use in other scripts
window.VaultOfEchoes = {
  initializeMemoryGame,
  proceedToNextRoom
}; 