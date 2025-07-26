/* ===== ROOM 3: CHAMBER OF NESTED WARDS - GRAPH COLORING CHALLENGE ===== */

// Game state management
let wardGraph = {
  nodes: [],
  edges: [],
  adjacencyList: {}
};
let selectedColor = null;
let nodeColors = {};
let conflicts = [];
let optimalColoring = null;
let chromaticNumber = 0;
let gameCompleted = false;
let currentGraphIndex = 0;

// Available colors for ward coloring
const WARD_COLORS = [
  { id: 'red', name: 'Crimson Ward', class: 'color-red', hex: '#ff5252' },
  { id: 'blue', name: 'Azure Ward', class: 'color-blue', hex: '#2196f3' },
  { id: 'green', name: 'Emerald Ward', class: 'color-green', hex: '#4caf50' },
  { id: 'yellow', name: 'Golden Ward', class: 'color-yellow', hex: '#ffc107' },
  { id: 'purple', name: 'Violet Ward', class: 'color-purple', hex: '#9c27b0' },
  { id: 'orange', name: 'Amber Ward', class: 'color-orange', hex: '#f57c00' }
];

// 4 Predefined complex graphs that rotate on page reload
const COMPLEX_GRAPHS = [
  {
    name: "Pentagonal Star Ward",
    nodes: [
      { id: 0, label: 'A', x: 400, y: 120 },
      { id: 1, label: 'B', x: 480, y: 160 },
      { id: 2, label: 'C', x: 460, y: 250 },
      { id: 3, label: 'D', x: 380, y: 280 },
      { id: 4, label: 'E', x: 320, y: 250 },
      { id: 5, label: 'F', x: 300, y: 160 },
      { id: 6, label: 'G', x: 400, y: 200 }
    ],
    edges: [
      // Pentagon outer ring
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, 
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 0 },
      // Star connections through center
      { from: 0, to: 6 }, { from: 2, to: 6 }, { from: 4, to: 6 },
      // Additional complex connections
      { from: 1, to: 4 }, { from: 2, to: 5 }, { from: 0, to: 3 }
    ],
    chromaticNumber: 4
  },
  {
    name: "Hexagonal Web Ward",
    nodes: [
      { id: 0, label: 'A', x: 400, y: 120 },
      { id: 1, label: 'B', x: 480, y: 150 },
      { id: 2, label: 'C', x: 500, y: 220 },
      { id: 3, label: 'D', x: 460, y: 280 },
      { id: 4, label: 'E', x: 380, y: 300 },
      { id: 5, label: 'F', x: 320, y: 280 },
      { id: 6, label: 'G', x: 300, y: 220 },
      { id: 7, label: 'H', x: 320, y: 150 },
      { id: 8, label: 'I', x: 400, y: 210 }
    ],
    edges: [
      // Hexagon outer ring
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 },
      { from: 6, to: 7 }, { from: 7, to: 0 },
      // Inner connections to center
      { from: 0, to: 8 }, { from: 2, to: 8 }, { from: 4, to: 8 }, { from: 6, to: 8 },
      // Complex web connections
      { from: 1, to: 5 }, { from: 3, to: 7 }, { from: 1, to: 8 }, 
      { from: 3, to: 8 }, { from: 5, to: 8 }, { from: 7, to: 8 }
    ],
    chromaticNumber: 4
  },
  {
    name: "Diamond Cluster Ward",
    nodes: [
      { id: 0, label: 'A', x: 400, y: 130 },
      { id: 1, label: 'B', x: 450, y: 160 },
      { id: 2, label: 'C', x: 480, y: 210 },
      { id: 3, label: 'D', x: 450, y: 260 },
      { id: 4, label: 'E', x: 400, y: 290 },
      { id: 5, label: 'F', x: 350, y: 260 },
      { id: 6, label: 'G', x: 320, y: 210 },
      { id: 7, label: 'H', x: 350, y: 160 },
      { id: 8, label: 'I', x: 400, y: 210 },
      { id: 9, label: 'J', x: 370, y: 190 }
    ],
    edges: [
      // Diamond shape
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 0 },
      // Inner diamond connections
      { from: 1, to: 8 }, { from: 3, to: 8 }, { from: 5, to: 8 }, { from: 7, to: 8 },
      { from: 0, to: 9 }, { from: 2, to: 9 }, { from: 4, to: 9 }, { from: 6, to: 9 },
      // Cross connections
      { from: 8, to: 9 }, { from: 0, to: 4 }, { from: 2, to: 6 }, { from: 1, to: 5 }, { from: 3, to: 7 }
    ],
    chromaticNumber: 4
  },
  {
    name: "Spiral Tower Ward",
    nodes: [
      { id: 0, label: 'A', x: 400, y: 140 },
      { id: 1, label: 'B', x: 460, y: 170 },
      { id: 2, label: 'C', x: 470, y: 220 },
      { id: 3, label: 'D', x: 430, y: 270 },
      { id: 4, label: 'E', x: 380, y: 280 },
      { id: 5, label: 'F', x: 330, y: 250 },
      { id: 6, label: 'G', x: 320, y: 200 },
      { id: 7, label: 'H', x: 360, y: 150 },
      { id: 8, label: 'I', x: 400, y: 200 },
      { id: 9, label: 'J', x: 420, y: 180 },
      { id: 10, label: 'K', x: 380, y: 220 }
    ],
    edges: [
      // Spiral connections
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 0 },
      // Inner tower connections
      { from: 8, to: 9 }, { from: 9, to: 10 }, { from: 10, to: 8 },
      // Tower to spiral connections
      { from: 0, to: 8 }, { from: 2, to: 9 }, { from: 4, to: 10 }, { from: 6, to: 8 },
      // Complex interconnections
      { from: 1, to: 9 }, { from: 3, to: 10 }, { from: 5, to: 8 }, { from: 7, to: 9 },
      { from: 1, to: 7 }, { from: 2, to: 6 }, { from: 3, to: 5 }
    ],
    chromaticNumber: 4
  }
];

// Initialize the game
function initializeGame() {
  loadSingleGraph();
  calculateOptimalColoring();
  setupColorPalette();
  renderGraph();
  updateColoringInfo();
  createWardParticles();
}

// Load a single predefined graph
function loadSingleGraph() {
  // Use the most balanced complex graph - Diamond Cluster Ward
  const selectedGraph = {
    name: "Diamond Cluster Ward",
    nodes: [
      { id: 0, label: 'A', x: 400, y: 100 },
      { id: 1, label: 'B', x: 500, y: 150 },
      { id: 2, label: 'C', x: 550, y: 250 },
      { id: 3, label: 'D', x: 500, y: 350 },
      { id: 4, label: 'E', x: 400, y: 400 },
      { id: 5, label: 'F', x: 300, y: 350 },
      { id: 6, label: 'G', x: 250, y: 250 },
      { id: 7, label: 'H', x: 300, y: 150 },
      { id: 8, label: 'I', x: 400, y: 250 },
      { id: 9, label: 'J', x: 350, y: 200 }
    ],
    edges: [
      // Diamond shape
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 0 },
      // Inner diamond connections
      { from: 1, to: 8 }, { from: 3, to: 8 }, { from: 5, to: 8 }, { from: 7, to: 8 },
      { from: 0, to: 9 }, { from: 2, to: 9 }, { from: 4, to: 9 }, { from: 6, to: 9 },
      // Cross connections
      { from: 8, to: 9 }, { from: 0, to: 4 }, { from: 2, to: 6 }, { from: 1, to: 5 }, { from: 3, to: 7 }
    ],
    chromaticNumber: 3
  };
  
  // Load the selected complex graph
  wardGraph = {
    nodes: [...selectedGraph.nodes],
    edges: [...selectedGraph.edges],
    adjacencyList: {}
  };
  
  chromaticNumber = 4; // Updated to use 4 colors
  nodeColors = {};
  conflicts = [];
  
  // Initialize node colors
  wardGraph.nodes.forEach(node => {
    nodeColors[node.id] = null;
  });
  
  // Build adjacency list
  buildAdjacencyList();
  
  console.log(`Loaded Graph: ${selectedGraph.name}`);
  console.log('Chromatic Number:', chromaticNumber);
}

// Build adjacency list for efficient neighbor lookup
function buildAdjacencyList() {
  wardGraph.adjacencyList = {};
  
  wardGraph.nodes.forEach(node => {
    wardGraph.adjacencyList[node.id] = [];
  });
  
  wardGraph.edges.forEach(edge => {
    wardGraph.adjacencyList[edge.from].push(edge.to);
    wardGraph.adjacencyList[edge.to].push(edge.from);
  });
}

// Calculate optimal coloring using advanced greedy algorithm
function calculateOptimalColoring() {
  // Use Welsh-Powell algorithm for better coloring
  const sortedNodes = [...wardGraph.nodes].sort((a, b) => {
    const degreeA = wardGraph.adjacencyList[a.id] ? wardGraph.adjacencyList[a.id].length : 0;
    const degreeB = wardGraph.adjacencyList[b.id] ? wardGraph.adjacencyList[b.id].length : 0;
    return degreeB - degreeA; // Sort by degree (highest first)
  });
  
  const coloring = {};
  const usedColors = [];
  
  sortedNodes.forEach(node => {
    const neighbors = wardGraph.adjacencyList[node.id] || [];
    const neighborColors = neighbors.map(neighborId => coloring[neighborId]).filter(color => color !== undefined);
    
    // Find the lowest color number not used by neighbors
    let color = 0;
    while (neighborColors.includes(color)) {
      color++;
    }
    
    coloring[node.id] = color;
    if (!usedColors.includes(color)) {
      usedColors.push(color);
    }
  });
  
  optimalColoring = {
    coloring: coloring,
    colorCount: usedColors.length,
    colors: usedColors
  };
  
  console.log('Optimal Coloring calculated:', optimalColoring);
}

// Setup color palette interface - only show minimum required colors
function setupColorPalette() {
  const colorPalette = document.getElementById('colorPalette');
  colorPalette.innerHTML = '';
  
  // Only show the minimum number of colors needed (chromatic number)
  WARD_COLORS.slice(0, chromaticNumber).forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.style.background = `linear-gradient(135deg, ${color.hex}, ${color.hex}aa)`;
    colorOption.dataset.colorId = color.id;
    colorOption.title = color.name;
    
    colorOption.addEventListener('click', () => selectColor(color.id));
    
    colorPalette.appendChild(colorOption);
  });
}

// Select a color from the palette
function selectColor(colorId) {
  // Remove active class from all color options
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Add active class to selected color
  document.querySelector(`[data-color-id="${colorId}"]`).classList.add('active');
  
  selectedColor = colorId;
  
  document.getElementById('currentStep').textContent = 
    `Selected ${WARD_COLORS.find(c => c.id === colorId).name}. Click a ward to color it.`;
}

// Render the graph visualization
function renderGraph() {
  renderConnections();
  renderNodes();
  updateConflictDisplay();
}

// Render SVG connections
function renderConnections() {
  const svg = document.getElementById('connectionsSvg');
  svg.innerHTML = '';
  
  wardGraph.edges.forEach(edge => {
    const fromNode = wardGraph.nodes[edge.from];
    const toNode = wardGraph.nodes[edge.to];
    
    // Create line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromNode.x);
    line.setAttribute('y1', fromNode.y);
    line.setAttribute('x2', toNode.x);
    line.setAttribute('y2', toNode.y);
    line.classList.add('connection-line');
    
    // Check if this edge has a conflict
    if (hasConflict(edge.from, edge.to)) {
      line.classList.add('conflict');
    }
    
    svg.appendChild(line);
  });
}

// Render ward nodes
function renderNodes() {
  const nodesContainer = document.getElementById('wardNodes');
  nodesContainer.innerHTML = '';
  
  wardGraph.nodes.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'ward-node';
    nodeElement.dataset.nodeId = node.id;
    nodeElement.textContent = node.label;
    nodeElement.style.left = node.x + 'px';
    nodeElement.style.top = node.y + 'px';
    
    // Apply color if node is colored
    const color = nodeColors[node.id];
    if (color) {
      const colorInfo = WARD_COLORS.find(c => c.id === color);
      if (colorInfo) {
        nodeElement.classList.add(colorInfo.class);
      }
    }
    
    // Add click handler
    nodeElement.addEventListener('click', () => colorNode(node.id));
    
    nodesContainer.appendChild(nodeElement);
  });
}

// Color a ward node
function colorNode(nodeId) {
  if (!selectedColor || gameCompleted) return;
  
  // Update node color
  nodeColors[nodeId] = selectedColor;
  wardGraph.nodes[nodeId].color = selectedColor;
  
  // Re-render graph to show changes
  renderGraph();
  
  // Update displays
  updateColoringInfo();
  checkConflicts();
  updateAnalysis();
  
  // Check completion
  if (isGraphFullyColored() && conflicts.length === 0) {
    setTimeout(() => {
      gameCompleted = true;
      showVictoryModal();
    }, 1000);
  }
}

// Check for color conflicts
function checkConflicts() {
  conflicts = [];
  
  wardGraph.edges.forEach(edge => {
    const color1 = nodeColors[edge.from];
    const color2 = nodeColors[edge.to];
    
    if (color1 && color2 && color1 === color2) {
      conflicts.push({
        from: edge.from,
        to: edge.to,
        color: color1
      });
    }
  });
  
  // Update conflict display
  document.getElementById('conflicts').textContent = conflicts.length;
  
  if (conflicts.length > 0) {
    showConflictModal();
  }
}

// Check if an edge has a conflict
function hasConflict(nodeId1, nodeId2) {
  return conflicts.some(conflict => 
    (conflict.from === nodeId1 && conflict.to === nodeId2) || 
    (conflict.from === nodeId2 && conflict.to === nodeId1)
  );
}

// Check if graph is fully colored
function isGraphFullyColored() {
  return wardGraph.nodes.every(node => nodeColors[node.id] !== null);
}

// Update coloring information display
function updateColoringInfo() {
  const usedColors = [...new Set(Object.values(nodeColors).filter(color => color !== null))];
  
  document.getElementById('colorsUsed').textContent = usedColors.length;
  document.getElementById('minColors').textContent = chromaticNumber;
  document.getElementById('wardsColored').textContent = 
    Object.values(nodeColors).filter(color => color !== null).length;
  
  // Calculate efficiency
  if (usedColors.length > 0) {
    const efficiency = Math.round((chromaticNumber / usedColors.length) * 100);
    document.getElementById('efficiency').textContent = efficiency + '%';
  } else {
    document.getElementById('efficiency').textContent = '0%';
  }
  
  // Update current phase
  if (Object.values(nodeColors).every(color => color === null)) {
    document.getElementById('currentPhase').textContent = 'Manual Coloring';
  } else if (!isGraphFullyColored()) {
    document.getElementById('currentPhase').textContent = 'Coloring in Progress';
  } else if (conflicts.length > 0) {
    document.getElementById('currentPhase').textContent = 'Resolving Conflicts';
  } else {
    document.getElementById('currentPhase').textContent = 'Coloring Complete!';
  }
}

// Update analysis display
function updateAnalysis() {
  const analysisInfo = document.getElementById('analysisInfo');
  analysisInfo.innerHTML = '';
  
  // Graph statistics
  const stats = [
    `Graph has ${wardGraph.nodes.length} wards and ${wardGraph.edges.length} connections`,
    `Average degree: ${(wardGraph.edges.length * 2 / wardGraph.nodes.length).toFixed(1)}`,
    `Current conflicts: ${conflicts.length}`,
    `Colors used: ${[...new Set(Object.values(nodeColors).filter(c => c !== null))].length}`
  ];
  
  stats.forEach(stat => {
    const statElement = document.createElement('div');
    statElement.className = 'analysis-item';
    statElement.textContent = stat;
    analysisInfo.appendChild(statElement);
  });
}



// Reset coloring
function resetColoring() {
  nodeColors = {};
  wardGraph.nodes.forEach(node => {
    node.color = null;
    nodeColors[node.id] = null;
  });
  
  conflicts = [];
  selectedColor = null;
  gameCompleted = false;
  
  // Remove active color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('active');
  });
  
  document.getElementById('currentStep').textContent = 
    'Select ward colors to ensure no adjacent wards share the same color';
  
  renderGraph();
  updateColoringInfo();
  updateAnalysis();
  
}

// Validate current coloring
function validateColoring() {
  checkConflicts();
  
  if (!isGraphFullyColored()) {
    document.getElementById('currentStep').textContent = 
      'Please color all wards before validation.';
    return;
  }
  
  if (conflicts.length > 0) {
    document.getElementById('currentStep').textContent = 
      `Validation failed: ${conflicts.length} conflicts detected!`;
    showConflictModal();
  } else {
    const usedColors = [...new Set(Object.values(nodeColors).filter(color => color !== null))];
    document.getElementById('currentStep').textContent = 
      `Validation successful! Used ${usedColors.length} colors with no conflicts.`;
    
    // Only accept optimal coloring (using minimum colors)
    if (usedColors.length === chromaticNumber) {
      setTimeout(() => {
        gameCompleted = true;
        showVictoryModal();
      }, 1000);
    } else {
      document.getElementById('currentStep').textContent = 
        `Good coloring, but try to use only ${chromaticNumber} colors for optimal solution!`;
    }
  }
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
      `Ward ${wardGraph.nodes[conflict.from].label} and Ward ${wardGraph.nodes[conflict.to].label} both have ${WARD_COLORS.find(c => c.id === conflict.color).name}`;
    conflictList.appendChild(conflictItem);
  });
  
  conflictModal.classList.add('active');
}

// Close conflict modal
function closeConflictModal() {
  document.getElementById('conflictModal').classList.remove('active');
}

// Show victory modal
function showVictoryModal() {
  const victoryModal = document.getElementById('victoryModal');
  const usedColors = [...new Set(Object.values(nodeColors).filter(color => color !== null))];
  
  // Calculate final statistics
  const efficiency = Math.round((chromaticNumber / usedColors.length) * 100);
  let complexity = 'Complex';
  
  // All our graphs are complex by design
  if (wardGraph.nodes.length >= 10) complexity = 'Very Complex';
  else if (wardGraph.nodes.length >= 8) complexity = 'Complex';
  else complexity = 'Advanced';
  
  // Update victory statistics
  document.getElementById('finalColorsUsed').textContent = usedColors.length;
  document.getElementById('finalOptimalColors').textContent = chromaticNumber;
  document.getElementById('finalEfficiency').textContent = efficiency + '%';
  document.getElementById('graphComplexity').textContent = complexity;
  
  victoryModal.classList.add('active');
}

// Show tutorial modal
function showTutorial() {
  const tutorialModal = document.getElementById('tutorialModal');
  tutorialModal.classList.add('active');
}

// Close tutorial modal
function closeTutorial() {
  const tutorialModal = document.getElementById('tutorialModal');
  tutorialModal.classList.remove('active');
}

// Update conflict display on connections
function updateConflictDisplay() {
  // This is handled in renderConnections()
}

// Create ward particles
function createWardParticles() {
  const wardParticles = document.getElementById('wardParticles');
  
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'ward-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    wardParticles.appendChild(particle);
  }
}



// Proceed to next room
function proceedToNextRoom() {
  window.location.href = 'room-4-hall-reflections.html';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initializeGame); 