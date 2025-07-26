// ===== FINAL QUEST LOGIC =====
class FinalQuest {
  constructor() {
    this.gameStateManager = window.gameStateManager;
    this.fragments = [];
    this.decodedFragments = [];
    
    this.init();
  }



  init() {
    this.loadFragments();
    this.displayFragments();
    this.setupEventListeners();
    this.checkFragmentRequirements();
    this.setupVideoAudio();
  }

  loadFragments() {
    if (this.gameStateManager) {
      this.fragments = this.gameStateManager.getAllFragments();
    }
    
    // Ensure all 4 fragments are present for testing
    const requiredFragments = [
      { round: 1, name: "Fragment of Time", symbol: "⧖", color: "#00ffff", hint: "In the realm where time flows backward, seek the mirror of forgotten dreams." },
      { round: 2, name: "Fragment of Space", symbol: "◊", color: "#ff00ff", hint: "Where dimensions fold and reality bends, find the key to infinite paths." },
      { round: 3, name: "Fragment of Mind", symbol: "◈", color: "#43e7ad", hint: "In the labyrinth of consciousness, discover the echo of ancient wisdom." },
      { round: 4, name: "Fragment of Soul", symbol: "✦", color: "#f7b801", hint: "At the nexus of all existence, unite the fragments to restore the Guardian's Portrait." }
    ];
    
    requiredFragments.forEach(required => {
      if (!this.fragments.find(f => f.round === required.round)) {
        this.fragments.push(required);
      }
    });
  }

  displayFragments() {
    const fragmentsGrid = document.getElementById('fragmentsGrid');
    if (!fragmentsGrid) return;

    fragmentsGrid.innerHTML = '';
    
    this.fragments.forEach(fragment => {
      const fragmentElement = document.createElement('div');
      fragmentElement.className = 'fragment-display';
      fragmentElement.setAttribute('data-fragment', this.getFragmentType(fragment.round));
      fragmentElement.innerHTML = `
        <span class="fragment-symbol" style="color: ${fragment.color}; text-shadow: 0 0 15px ${fragment.color};">
          ${fragment.symbol}
        </span>
        <div class="fragment-name" style="color: ${fragment.color};">
          ${fragment.name}
        </div>
        <div class="fragment-status">Collected</div>
      `;
      
      fragmentsGrid.appendChild(fragmentElement);
    });
  }

  getFragmentType(round) {
    const types = { 1: 'time', 2: 'space', 3: 'mind', 4: 'soul' };
    return types[round] || 'unknown';
  }



  checkFragmentRequirements() {
    if (this.fragments.length < 4) {
      // Redirect back if not all fragments collected
      setTimeout(() => {
        alert('You must collect all 4 fragments before attempting the final quest!');
        window.location.href = 'index.html';
      }, 2000);
    }
  }

  setupVideoAudio() {
    // Setup background video audio
    const backgroundVideo = document.getElementById('backgroundVideo');
    if (backgroundVideo) {
      backgroundVideo.volume = 0.6; // Lower volume for background
      
      // Try to play with audio, fallback to muted if needed
      backgroundVideo.play().catch(() => {
        backgroundVideo.muted = true;
        backgroundVideo.play().then(() => {
          this.addBackgroundVideoUnmute(backgroundVideo);
        });
      });
    }
  }

  addBackgroundVideoUnmute(video) {
    const unmuteHandler = () => {
      video.muted = false;
      video.volume = 0.6;
      document.removeEventListener('click', unmuteHandler);
      this.showAudioNotification('Background Audio Enabled');
    };
    document.addEventListener('click', unmuteHandler, { once: true });
  }

  showAudioNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(247, 184, 1, 0.9);
      color: #1a0b2e;
      padding: 10px 20px;
      border-radius: 20px;
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      z-index: 10000;
      animation: fadeInOut 3s ease forwards;
    `;
    notification.textContent = `🔊 ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  setupEventListeners() {
    // Decode button
    const decodeBtn = document.getElementById('decodeBtn');
    if (decodeBtn) {
      decodeBtn.addEventListener('click', () => this.startDecoding());
    }

    // Auto-fill button
    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
      autoFillBtn.addEventListener('click', () => this.autoFillPrompt());
    }

    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateImage());
    }

    // Prompt input
    const promptInput = document.getElementById('promptInput');
    if (promptInput) {
      promptInput.addEventListener('input', () => this.updatePromptCounter());
    }

    // Complete quest button
    const completeQuestBtn = document.getElementById('completeQuestBtn');
    if (completeQuestBtn) {
      completeQuestBtn.addEventListener('click', () => this.completeQuest());
    }

    // Regenerate button
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => this.generateImage());
    }

    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.resetGame());
    }
  }

  startDecoding() {
    const decodeBtn = document.getElementById('decodeBtn');
    const decodeProgress = document.getElementById('decodeProgress');
    const progressFill = document.getElementById('decodeProgressFill');
    
    if (decodeBtn) decodeBtn.style.display = 'none';
    if (decodeProgress) decodeProgress.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progressFill) progressFill.style.width = progress + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        this.revealDecodedHints();
      }
    }, 50);
  }

  revealDecodedHints() {
    const hintCards = document.querySelectorAll('.hint-card');
    let delay = 0;
    
    hintCards.forEach((card, index) => {
      setTimeout(() => {
        const encryptedText = card.querySelector('.encrypted');
        const decodedText = card.querySelector('.decoded-text');
        
        if (encryptedText && decodedText) {
          encryptedText.style.display = 'none';
          decodedText.style.display = 'block';
          
          // Add to decoded fragments
          this.decodedFragments.push({
            type: this.getFragmentType(index + 1),
            text: decodedText.textContent.trim()
          });
        }
        
        // Show prompt section after last fragment
        if (index === hintCards.length - 1) {
          setTimeout(() => {
            this.showPromptSection();
          }, 1000);
        }
      }, delay);
      delay += 800;
    });
  }

  showPromptSection() {
    const promptSection = document.getElementById('promptSection');
    if (promptSection) {
      promptSection.style.display = 'block';
      promptSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  autoFillPrompt() {
    const promptInput = document.getElementById('promptInput');
    if (!promptInput) return;
    
    const combinedPrompt = this.decodedFragments
      .map(fragment => fragment.text)
      .join(', ');
    
    const fullPrompt = `A magnificent fantasy artwork showing: ${combinedPrompt}. Digital art, highly detailed, magical atmosphere, epic composition, masterpiece quality.`;
    
    promptInput.value = fullPrompt;
    this.updatePromptCounter();
    this.enableGenerateButton();
  }

  updatePromptCounter() {
    const promptInput = document.getElementById('promptInput');
    const promptCounter = document.getElementById('promptCounter');
    const generateBtn = document.getElementById('generateBtn');
    
    if (promptInput && promptCounter) {
      const length = promptInput.value.length;
      promptCounter.textContent = length;
      
      // Enable generate button if prompt has content
      if (generateBtn) {
        generateBtn.disabled = length === 0;
      }
    }
  }

  enableGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.disabled = false;
    }
  }

  generateImage() {
    const generationSection = document.getElementById('generationSection');
    const generationPlaceholder = document.getElementById('generationPlaceholder');
    const generatedImageContainer = document.getElementById('generatedImageContainer');
    const generationControls = document.getElementById('generationControls');
    const progressFill = document.getElementById('generationProgressFill');
    
    // Show generation section
    if (generationSection) {
      generationSection.style.display = 'block';
      generationSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Reset states
    if (generationPlaceholder) generationPlaceholder.style.display = 'block';
    if (generatedImageContainer) generatedImageContainer.style.display = 'none';
    if (generationControls) generationControls.style.display = 'none';
    
    // Simulate image generation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progressFill) progressFill.style.width = progress + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        this.showGeneratedImage();
      }
    }, 30);
  }

  showGeneratedImage() {
    const generationPlaceholder = document.getElementById('generationPlaceholder');
    const generatedImageContainer = document.getElementById('generatedImageContainer');
    const generationControls = document.getElementById('generationControls');
    const generatedImage = document.getElementById('generatedImage');
    
    // Hide placeholder
    if (generationPlaceholder) generationPlaceholder.style.display = 'none';
    
    // Create a placeholder image (in real implementation, this would be the generated image)
    if (generatedImage) {
      // For demo purposes, create a canvas with a mystical pattern
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(250, 250, 0, 250, 250, 250);
      gradient.addColorStop(0, '#1a0b2e');
      gradient.addColorStop(0.5, '#8a2be2');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 500, 500);
      
      // Add mystical symbols
      ctx.fillStyle = '#f7b801';
      ctx.font = '48px serif';
      ctx.textAlign = 'center';
      ctx.fillText('⧖', 150, 150);
      ctx.fillText('◊', 350, 150);
      ctx.fillText('◈', 150, 350);
      ctx.fillText('✦', 350, 350);
      
      // Add central portal
      const portalGradient = ctx.createRadialGradient(250, 250, 0, 250, 250, 100);
      portalGradient.addColorStop(0, '#00ffff');
      portalGradient.addColorStop(0.5, '#ff00ff');
      portalGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = portalGradient;
      ctx.fillRect(200, 200, 100, 100);
      
      generatedImage.src = canvas.toDataURL();
    }
    
    // Show generated image and controls
    if (generatedImageContainer) generatedImageContainer.style.display = 'block';
    if (generationControls) generationControls.style.display = 'flex';
  }

  completeQuest() {
    // Calculate final time using global timer
    const gameStartTime = parseInt(localStorage.getItem('promptweaver_start_time'));
    const now = Date.now();
    const elapsed = now - gameStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const finalTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Stop global timer
    if (window.globalTimer) {
      window.globalTimer.destroy();
    }
    
    // Show victory modal
    const victoryModal = document.getElementById('victoryModal');
    const victoryVideo = document.getElementById('victoryVideo');
    const finalTimeElement = document.getElementById('finalTime');
    
    if (victoryModal) {
      victoryModal.style.display = 'flex';
      
      if (finalTimeElement) {
        finalTimeElement.textContent = finalTime;
      }
      
      if (victoryVideo) {
        victoryVideo.volume = 0.8;
        victoryVideo.play().catch(() => {
          // If autoplay fails, try muted
          victoryVideo.muted = true;
          victoryVideo.play().then(() => {
            // Add click to unmute
            const unmuteHandler = () => {
              victoryVideo.muted = false;
              victoryVideo.volume = 0.8;
              document.removeEventListener('click', unmuteHandler);
              this.showAudioNotification('Victory Audio Enabled');
            };
            document.addEventListener('click', unmuteHandler, { once: true });
          });
        });
      }
      
      // Create victory particles
      this.createVictoryEffects();
    }
  }

  createVictoryEffects() {
    const colors = ['#f7b801', '#00ffff', '#ff00ff', '#43e7ad'];
    
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '2001';
        particle.style.animation = 'victoryParticle 3s ease-out forwards';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
      }, i * 50);
    }
  }

  resetGame() {
    // Clear all game data
    localStorage.removeItem('promptweaver_gamestate');
    localStorage.removeItem('promptweaver_start_time');
    
    // Redirect to start
    window.location.href = 'index.html';
  }
}

// Add dynamic styles for final quest effects
function addFinalQuestStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes victoryParticle {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      100% {
        opacity: 0;
        transform: scale(0) translateY(-200px);
      }
    }
    
    @keyframes hintReveal {
      0% {
        opacity: 0;
        transform: translateY(-20px);
        filter: blur(5px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize final quest when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  addFinalQuestStyles();
  new FinalQuest();
}); 