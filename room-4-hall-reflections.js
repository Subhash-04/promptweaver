/* ===== ROOM 4: HALL OF REFLECTIONS - CELESTIAL SUDOKU CHALLENGE ===== */

// Game state management
let sudokuGrid = [];
let solutionGrid = [];
let initialGrid = [];
let selectedNumber = null;
let gameCompleted = false;
let startTime = null;
let conflicts = [];

// Single Sudoku puzzle (moderate difficulty)
const SUDOKU_PUZZLE = {
  name: "Celestial Harmony Challenge",
  puzzle: [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ]
};

// Initialize the game
function initializeGame() {
  loadSudokuPuzzle();
  setupNumberPalette();
  renderSudokuGrid();
  updateGameStatus();
  createReflectionParticles();
  startTimer();
}

// Load the single Sudoku puzzle
function loadSudokuPuzzle() {
  const selectedPuzzle = SUDOKU_PUZZLE;
  
  // Deep copy the puzzle
  initialGrid = selectedPuzzle.puzzle.map(row => [...row]);
  sudokuGrid = selectedPuzzle.puzzle.map(row => [...row]);
  
  // Generate the solution
  solutionGrid = sudokuGrid.map(row => [...row]);
  solveSudokuGrid(solutionGrid);
  
  console.log(`Loaded puzzle: ${selectedPuzzle.name}`);
}

// Setup number selection palette
function setupNumberPalette() {
  const numberPalette = document.getElementById('numberPalette');
  numberPalette.innerHTML = '';
  
  for (let i = 1; i <= 9; i++) {
    const numberBtn = document.createElement('button');
    numberBtn.className = 'number-btn';
    numberBtn.textContent = i;
    numberBtn.dataset.number = i;
    numberBtn.addEventListener('click', () => selectNumber(i));
    numberPalette.appendChild(numberBtn);
  }
}

// Select a number for placement
function selectNumber(number) {
  selectedNumber = number;
  
  // Update visual selection
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-number="${number}"]`).classList.add('active');
  
  // Clear eraser selection
  document.getElementById('eraseBtn').classList.remove('active');
  
  document.getElementById('currentStep').textContent = 
    `Selected celestial number ${number}. Click an empty cell to place it.`;
}

// Select eraser tool
function selectEraser() {
  selectedNumber = 0;
  
  // Update visual selection
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('eraseBtn').classList.add('active');
  
  document.getElementById('currentStep').textContent = 
    'Eraser selected. Click a filled cell to clear it.';
}

// Render the Sudoku grid
function renderSudokuGrid() {
  const gridContainer = document.getElementById('sudokuGrid');
  gridContainer.innerHTML = '';
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('div');
      cell.className = 'sudoku-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      
      // Add box classes for visual separation
      if (row % 3 === 0) cell.classList.add('top-border');
      if (col % 3 === 0) cell.classList.add('left-border');
      
      // Determine if cell is initial (given) or user-filled
      const isInitial = initialGrid[row][col] !== 0;
      if (isInitial) {
        cell.classList.add('initial-cell');
      }
      
      // Set cell value
      const value = sudokuGrid[row][col];
      cell.textContent = value === 0 ? '' : value;
      
      // Add click handler
      cell.addEventListener('click', () => handleCellClick(row, col));
      
      gridContainer.appendChild(cell);
    }
  }
  
  // Update conflict highlighting
  highlightConflicts();
}

// Handle cell click
function handleCellClick(row, col) {
  if (gameCompleted) return;
  
  const isInitialCell = initialGrid[row][col] !== 0;
  
  if (selectedNumber === null) {
    document.getElementById('currentStep').textContent = 
      'Please select a number first.';
    return;
  }
  
  if (selectedNumber === 0) {
    // Eraser mode
    if (!isInitialCell) {
      sudokuGrid[row][col] = 0;
      renderSudokuGrid();
      updateGameStatus();
      document.getElementById('currentStep').textContent = 
        'Cell cleared. Select another number to continue.';
    }
  } else {
    // Number placement mode
    if (!isInitialCell) {
      sudokuGrid[row][col] = selectedNumber;
      renderSudokuGrid();
      updateGameStatus();
      
      // Check if puzzle is complete
      if (isPuzzleComplete()) {
        gameCompleted = true;
        setTimeout(() => {
          showVictoryModal();
        }, 500);
      }
    } else {
      document.getElementById('currentStep').textContent = 
        'Cannot modify initial cells. Choose an empty cell.';
    }
  }
}

// Update game status displays
function updateGameStatus() {
  const filledCells = countFilledCells();
  const totalCells = 81;
  const progress = (filledCells / totalCells) * 100;
  
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressText').textContent = Math.round(progress) + '%';
  document.getElementById('cellsFilled').textContent = `${filledCells} / ${totalCells}`;
  
  // Count conflicts
  conflicts = findConflicts();
  document.getElementById('conflictsCount').textContent = conflicts.length;
  
  // Update harmony level
  if (conflicts.length === 0) {
    document.getElementById('harmonyLevel').textContent = 'Perfect';
  } else if (conflicts.length <= 3) {
    document.getElementById('harmonyLevel').textContent = 'Good';
  } else {
    document.getElementById('harmonyLevel').textContent = 'Disrupted';
  }
  
  // Update current phase
  if (filledCells < 20) {
    document.getElementById('currentPhase').textContent = 'Early Placement';
  } else if (filledCells < 60) {
    document.getElementById('currentPhase').textContent = 'Middle Game';
  } else if (filledCells < 80) {
    document.getElementById('currentPhase').textContent = 'Final Stages';
  } else {
    document.getElementById('currentPhase').textContent = 'Near Completion';
  }
}

// Count filled cells
function countFilledCells() {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (sudokuGrid[row][col] !== 0) count++;
    }
  }
  return count;
}

// Find conflicts in the current grid
function findConflicts() {
  const conflicts = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = sudokuGrid[row][col];
      if (value !== 0) {
        // Check for conflicts
        if (hasConflictAt(row, col, value)) {
          conflicts.push({ row, col, value });
        }
      }
    }
  }
  
  return conflicts;
}

// Check if placing a value at position causes conflicts
function hasConflictAt(row, col, value) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && sudokuGrid[row][c] === value) return true;
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && sudokuGrid[r][col] === value) return true;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && sudokuGrid[r][c] === value) return true;
    }
  }
  
  return false;
}

// Highlight conflicted cells
function highlightConflicts() {
  document.querySelectorAll('.sudoku-cell').forEach(cell => {
    cell.classList.remove('conflict');
  });
  
  conflicts.forEach(conflict => {
    const cell = document.querySelector(`[data-row="${conflict.row}"][data-col="${conflict.col}"]`);
    if (cell) cell.classList.add('conflict');
  });
}

// Check if puzzle is complete and correct
function isPuzzleComplete() {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (sudokuGrid[row][col] === 0) return false;
    }
  }
  
  // Check if there are no conflicts
  return conflicts.length === 0;
}

// Validate current Sudoku state
function validateSudoku() {
  updateGameStatus();
  
  if (conflicts.length === 0) {
    if (isPuzzleComplete()) {
      document.getElementById('currentStep').textContent = 
        '🎉 Perfect celestial harmony achieved!';
      setTimeout(() => {
        gameCompleted = true;
        showVictoryModal();
      }, 1000);
    } else {
      document.getElementById('currentStep').textContent = 
        '✅ No conflicts detected. Continue placing numbers!';
    }
  } else {
    document.getElementById('currentStep').textContent = 
      `⚠️ ${conflicts.length} conflicts detected. Resolve them to continue.`;
    showConflictModal();
  }
}





// Sudoku solving algorithm (backtracking)
function solveSudokuGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudokuGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if number placement is valid
function isValidPlacement(grid, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num && c !== col) return false;
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num && r !== row) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num && (r !== row || c !== col)) return false;
    }
  }
  
  return true;
}

// Reset the Sudoku puzzle
function resetSudoku() {
  sudokuGrid = initialGrid.map(row => [...row]);
  selectedNumber = null;
  gameCompleted = false;
  startTimer();
  
  // Clear number selection
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('eraseBtn').classList.remove('active');
  
  document.getElementById('currentStep').textContent = 
    'Puzzle reset. Select a celestial number and place it in the grid.';
  
  renderSudokuGrid();
  updateGameStatus();
}

// Start game timer
function startTimer() {
  startTime = Date.now();
}

// Get elapsed time formatted
function getElapsedTime() {
  if (!startTime) return '0:00';
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Show victory modal
function showVictoryModal() {
  const victoryModal = document.getElementById('victoryModal');
  
  // Calculate mastery rating based on completion time
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  let masteryRating = 'Novice';
  if (elapsedSeconds < 300) masteryRating = 'Master';        // Under 5 minutes
  else if (elapsedSeconds < 600) masteryRating = 'Expert';   // Under 10 minutes
  else if (elapsedSeconds < 900) masteryRating = 'Advanced'; // Under 15 minutes
  else if (elapsedSeconds < 1200) masteryRating = 'Intermediate'; // Under 20 minutes
  
  // Update victory statistics
  document.getElementById('completionTime').textContent = getElapsedTime();
  document.getElementById('finalHarmony').textContent = 'Perfect';
  document.getElementById('masteryRating').textContent = masteryRating;
  
  victoryModal.classList.add('active');
}

// Show conflict modal
function showConflictModal() {
  if (conflicts.length === 0) return;
  
  const conflictModal = document.getElementById('conflictModal');
  const conflictList = document.getElementById('conflictList');
  
  conflictList.innerHTML = '';
  conflicts.forEach(conflict => {
    const conflictItem = document.createElement('div');
    conflictItem.className = 'conflict-item';
    conflictItem.textContent = 
      `Number ${conflict.value} conflicts at row ${conflict.row + 1}, column ${conflict.col + 1}`;
    conflictList.appendChild(conflictItem);
  });
  
  conflictModal.classList.add('active');
}

// Close conflict modal
function closeConflictModal() {
  document.getElementById('conflictModal').classList.remove('active');
}



// Create reflection particles
function createReflectionParticles() {
  const reflectionParticles = document.getElementById('reflectionParticles');
  
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'reflection-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 7 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
    reflectionParticles.appendChild(particle);
  }
}

// Complete final quest
function completeFinalQuest() {
  window.location.href = 'final-quest.html';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initializeGame); 