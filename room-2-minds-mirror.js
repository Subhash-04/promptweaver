/* ===== ROOM 2: MIND'S MIRROR - 0/1 KNAPSACK CHALLENGE ===== */

// Game state management
let memoryItems = [];
let selectedMemories = [];
let maxCapacity = 100;
let currentWeight = 0;
let currentValue = 0;
let optimalSolution = null;
let gameCompleted = false;

// Single predefined knapsack scenario with optimal solution
const KNAPSACK_SCENARIO = {
  name: "Celestial Memory Chamber",
  items: [
    { name: "Crystal Orb", symbol: "🔮", weight: 20, value: 35 },
    { name: "Thunder Stone", symbol: "⚡", weight: 22, value: 38 },
    { name: "Moon Fragment", symbol: "🌙", weight: 16, value: 28 },
    { name: "Ancient Scroll", symbol: "📜", weight: 15, value: 25 },
    { name: "Celestial Map", symbol: "🗺️", weight: 10, value: 22 },
    { name: "Dragon Scale", symbol: "🐉", weight: 8, value: 18 },
    { name: "Star Essence", symbol: "⭐", weight: 9, value: 19 },
    { name: "Phoenix Feather", symbol: "🪶", weight: 5, value: 15 },
    { name: "Mystic Sword", symbol: "⚔️", weight: 25, value: 40 },
    { name: "Water Pearl", symbol: "🔵", weight: 6, value: 16 }
  ],
  // Optimal solution: Crystal Orb(20) + Thunder Stone(22) + Moon Fragment(16) + Ancient Scroll(15) + Celestial Map(10) + Dragon Scale(8) + Star Essence(9) = 100 EXACTLY
  optimalSolution: [0, 1, 2, 3, 4, 5, 6] // indices that sum to exactly 100
};

// Generate memory items for this puzzle instance
function generateMemoryItems() {
  memoryItems = [];
  
  // Use the single predefined scenario
  const selectedScenario = KNAPSACK_SCENARIO;
  
  // Create memory items from the scenario
  selectedScenario.items.forEach((template, index) => {
    const memory = {
      id: index + 1,
      name: template.name,
      symbol: template.symbol,
      weight: template.weight,
      value: template.value,
      selected: false
    };
    
    memoryItems.push(memory);
  });
  
  console.log(`Memory Items Generated: ${selectedScenario.name}`, memoryItems);
  console.log('This scenario guarantees a solution that fills exactly 100 capacity.');
}

// Calculate optimal solution using the predefined scenario
function calculateOptimalSolution() {
  if (!KNAPSACK_SCENARIO || !KNAPSACK_SCENARIO.optimalSolution) {
    console.error('No scenario available for optimal solution');
    return;
  }
  
  // Get optimal items based on scenario indices
  const optimalItems = KNAPSACK_SCENARIO.optimalSolution.map(index => memoryItems[index]);
  const totalWeight = optimalItems.reduce((sum, item) => sum + item.weight, 0);
  const totalValue = optimalItems.reduce((sum, item) => sum + item.value, 0);
  
  optimalSolution = {
    items: optimalItems,
    totalWeight: totalWeight,
    totalValue: totalValue,
    efficiency: 100 // Perfect efficiency since it's designed to be exactly 100
  };
  
  console.log('Optimal Solution (Pre-designed):', optimalSolution);
  console.log('Total Weight:', totalWeight, 'Total Value:', totalValue);
}

// Render memory items in the grid
function renderMemories() {
  const memoriesGrid = document.getElementById('memoriesGrid');
  memoriesGrid.innerHTML = '';
  
  memoryItems.forEach(memory => {
    const memoryElement = createMemoryElement(memory);
    memoriesGrid.appendChild(memoryElement);
  });
}

// Create individual memory item element
function createMemoryElement(memory) {
  const memoryDiv = document.createElement('div');
  memoryDiv.className = `memory-item ${memory.selected ? 'selected' : ''}`;
  memoryDiv.dataset.memoryId = memory.id;
  memoryDiv.draggable = true;
  
  memoryDiv.innerHTML = `
    <div class="memory-name">${memory.symbol} ${memory.name}</div>
    <div class="memory-stats">
      <span class="memory-weight">Weight: ${memory.weight}</span>
      <span class="memory-value">Value: ${memory.value}</span>
    </div>
  `;
  
  // Add event listeners
  memoryDiv.addEventListener('click', () => toggleMemorySelection(memory.id));
  memoryDiv.addEventListener('dragstart', (e) => handleDragStart(e, memory));
  memoryDiv.addEventListener('dragend', handleDragEnd);
  
  return memoryDiv;
}

// Handle memory selection toggle (click)
function toggleMemorySelection(memoryId) {
  const memory = memoryItems.find(m => m.id === memoryId);
  if (!memory) return;
  
  if (memory.selected) {
    deselectMemory(memoryId);
  } else {
    selectMemory(memoryId);
  }
}

// Select a memory (check capacity first)
function selectMemory(memoryId) {
  const memory = memoryItems.find(m => m.id === memoryId);
  if (!memory || memory.selected) return;
  
  // Check if adding this memory would exceed capacity
  if (currentWeight + memory.weight > maxCapacity) {
    showFailureModal();
    return;
  }
  
  memory.selected = true;
  selectedMemories.push(memory);
  currentWeight += memory.weight;
  currentValue += memory.value;
  
  updateDisplays();
  checkVictoryCondition();
}

// Deselect a memory
function deselectMemory(memoryId) {
  const memory = memoryItems.find(m => m.id === memoryId);
  if (!memory || !memory.selected) return;
  
  memory.selected = false;
  selectedMemories = selectedMemories.filter(m => m.id !== memoryId);
  currentWeight -= memory.weight;
  currentValue -= memory.value;
  
  updateDisplays();
}

// Update all display elements
function updateDisplays() {
  updateCapacityDisplay();
  updatePortalStats();
  updateSelectedMemoriesDisplay();
  renderMemories(); // Re-render to update selected states
}

// Update capacity bar display
function updateCapacityDisplay() {
  const capacityFill = document.getElementById('capacityFill');
  const capacityText = document.getElementById('capacityText');
  
  const percentage = (currentWeight / maxCapacity) * 100;
  capacityFill.style.width = `${percentage}%`;
  capacityText.textContent = `${currentWeight} / ${maxCapacity}`;
  
  // Change color based on capacity usage
  if (percentage > 90) {
    capacityFill.style.background = 'linear-gradient(90deg, #ff6347, #ff0000)';
  } else if (percentage > 70) {
    capacityFill.style.background = 'linear-gradient(90deg, #ffd700, #ff6347)';
  } else {
    capacityFill.style.background = 'linear-gradient(90deg, #32cd32, #ffd700)';
  }
}

// Update portal statistics
function updatePortalStats() {
  document.getElementById('totalWeight').textContent = currentWeight;
  document.getElementById('totalValue').textContent = currentValue;
}

// Update selected memories display in portal
function updateSelectedMemoriesDisplay() {
  const selectedMemoriesContainer = document.getElementById('selectedMemories');
  
  if (selectedMemories.length === 0) {
    selectedMemoriesContainer.innerHTML = '<div class="empty-state">Drop memories here to carry them through the portal...</div>';
    return;
  }
  
  selectedMemoriesContainer.innerHTML = '';
  selectedMemories.forEach(memory => {
    const memoryDiv = document.createElement('div');
    memoryDiv.className = 'selected-memory';
    memoryDiv.innerHTML = `${memory.symbol} ${memory.name} (${memory.weight}/${memory.value})`;
    memoryDiv.addEventListener('click', () => deselectMemory(memory.id));
    selectedMemoriesContainer.appendChild(memoryDiv);
  });
}

// Check if current selection matches optimal solution
function checkVictoryCondition() {
  if (gameCompleted || selectedMemories.length === 0) return;
  
  // Check if current solution is optimal (within 95% of optimal value)
  const efficiencyThreshold = 0.95;
  const currentEfficiency = currentValue / optimalSolution.totalValue;
  
  if (currentEfficiency >= efficiencyThreshold && currentWeight <= maxCapacity) {
    showOptimalHint();
    
    // If it's very close to optimal or exact, trigger victory
    if (currentEfficiency >= 0.98) {
      setTimeout(() => {
        gameCompleted = true;
        showVictoryModal();
      }, 1500);
    }
  }
}

// Show optimal solution hint
function showOptimalHint() {
  const optimalHint = document.getElementById('optimalHint');
  const optimalText = document.getElementById('optimalText');
  
  optimalText.textContent = `Excellent! You've found a near-optimal solution with ${currentValue} power!`;
  optimalHint.style.display = 'block';
}

// Drag and drop functionality
function handleDragStart(e, memory) {
  e.dataTransfer.setData('text/plain', memory.id);
  e.target.classList.add('dragging');
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

// Setup drag and drop event listeners
function setupEventListeners() {
  const selectedMemoriesContainer = document.getElementById('selectedMemories');
  
  selectedMemoriesContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    selectedMemoriesContainer.classList.add('drag-over');
  });
  
  selectedMemoriesContainer.addEventListener('dragleave', () => {
    selectedMemoriesContainer.classList.remove('drag-over');
  });
  
  selectedMemoriesContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    selectedMemoriesContainer.classList.remove('drag-over');
    
    const memoryId = parseInt(e.dataTransfer.getData('text/plain'));
    selectMemory(memoryId);
  });
}

// Create floating light particles
function createLightParticles() {
  const lightParticles = document.getElementById('lightParticles');
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'light-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    lightParticles.appendChild(particle);
  }
}

// Show victory modal
function showVictoryModal() {
  const victoryModal = document.getElementById('victoryModal');
  
  // Update victory statistics
  document.getElementById('finalMemoryCount').textContent = selectedMemories.length;
  document.getElementById('finalPower').textContent = currentValue;
  document.getElementById('efficiency').textContent = Math.round((currentValue / optimalSolution.totalValue) * 100) + '%';
  
  victoryModal.classList.add('active');
}

// Show failure modal (capacity exceeded)
function showFailureModal() {
  const failureModal = document.getElementById('failureModal');
  failureModal.classList.add('active');
}

// Reset puzzle
function resetPuzzle() {
  // Hide modals
  document.getElementById('failureModal').classList.remove('active');
  document.getElementById('victoryModal').classList.remove('active');
  document.getElementById('optimalHint').style.display = 'none';
  
  // Reset game state
  selectedMemories = [];
  currentWeight = 0;
  currentValue = 0;
  gameCompleted = false;
  
  // Reset memory selections
  memoryItems.forEach(memory => {
    memory.selected = false;
  });
  
  // Update displays
  updateDisplays();
}

// Proceed to next room
function proceedToNextRoom() {
  window.location.href = 'room-3-nested-wards.html'; 
}

// Initialize game function
function initializeGame() {
  generateMemoryItems();
  calculateOptimalSolution();
  renderMemories();
  updateDisplays();
  setupEventListeners();
  createLightParticles();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initializeGame); 