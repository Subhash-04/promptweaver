// ===== ROOM 4 - SOUL NEXUS LOGIC =====
class Room4VideoModal {
  constructor() {
    this.roomVideoModal = document.getElementById('roomVideoModal');
    this.roomVideo = document.getElementById('roomVideo');
    this.proceedBtn = document.getElementById('proceedBtn');
    this.pageContent = document.getElementById('pageContent');
    this.videoCompleted = false;
    
    this.init();
  }

  init() {
    // Auto start video when page loads
    this.startVideo();
    
    // Listen for video end
    if (this.roomVideo) {
      this.roomVideo.addEventListener('ended', () => this.onVideoComplete());
      this.roomVideo.addEventListener('timeupdate', () => this.preventSeeking());
    }
    
    // Proceed button functionality
    if (this.proceedBtn) {
      this.proceedBtn.addEventListener('click', () => this.proceedToNextStage());
    }
    
    // Disable closing methods
    this.disableClosing();
  }

  startVideo() {
    if (this.roomVideo && !this.roomVideo.hasStarted) {
      // Mark video as started to prevent double play
      this.roomVideo.hasStarted = true;
      
      // Ensure audio is enabled
      this.roomVideo.muted = false;
      this.roomVideo.volume = 0.8;
      
      // Try to play with audio
      this.roomVideo.play().catch((error) => {
        console.log('Autoplay failed, trying muted:', error);
        // If autoplay with audio fails, try muted first
        this.roomVideo.muted = true;
        this.roomVideo.play().then(() => {
          // Add click handler to unmute
          this.addUnmuteHandler();
        }).catch(() => {
          // If all fails, show play button
          this.showPlayButton();
        });
      });
    }
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }

  showPlayButton() {
    // Fallback if autoplay is blocked
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Enter the Nexus';
    playBtn.className = 'proceed-btn';
    playBtn.style.display = 'block';
    playBtn.onclick = () => {
      this.roomVideo.play();
      playBtn.remove();
    };
    
    this.roomVideoModal.querySelector('.video-container').appendChild(playBtn);
  }

  onVideoComplete() {
    this.videoCompleted = true;
    
    // Show proceed button with animation
    if (this.proceedBtn) {
      this.proceedBtn.style.display = 'block';
      Utils.fadeIn(this.proceedBtn);
      
      // Create soul completion effects
      this.createSoulEffects();
    }
  }

  // Add click handler to unmute video if it was muted for autoplay
  addUnmuteHandler() {
    if (this.roomVideo && this.roomVideo.muted) {
      const unmuteHandler = () => {
        this.roomVideo.muted = false;
        this.roomVideo.volume = 0.8;
        document.removeEventListener('click', unmuteHandler);
        
        // Show unmute notification
        this.showUnmuteNotification();
      };
      document.addEventListener('click', unmuteHandler, { once: true });
    }
  }

  showUnmuteNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
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
    notification.textContent = '🔊 Audio Enabled';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  createSoulEffects() {
    const container = this.roomVideoModal.querySelector('.video-container');
    const rect = container.getBoundingClientRect();
    
    // Create divine energy bursts around the video
    for (let i = 0; i < 16; i++) {
      setTimeout(() => {
        const energy = document.createElement('div');
        energy.style.position = 'fixed';
        energy.style.left = (rect.left + rect.width / 2) + 'px';
        energy.style.top = (rect.top + rect.height / 2) + 'px';
        energy.style.width = '8px';
        energy.style.height = '8px';
        energy.style.background = 'radial-gradient(circle, #f7b801, rgba(247, 184, 1, 0.3))';
        energy.style.borderRadius = '50%';
        energy.style.pointerEvents = 'none';
        energy.style.zIndex = '1001';
        energy.style.boxShadow = '0 0 15px #f7b801';
        energy.style.animation = 'soulBurst 3s ease-out forwards';
        
        // Spread in circle pattern
        const angle = (i / 16) * Math.PI * 2;
        const distance = 150;
        energy.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        
        document.body.appendChild(energy);
        setTimeout(() => energy.remove(), 3000);
      }, i * 100);
    }
  }

  proceedToNextStage() {
    // Fade out video modal
    this.roomVideoModal.style.transition = 'opacity 1s ease';
    this.roomVideoModal.style.opacity = '0';
    
    setTimeout(() => {
      this.roomVideoModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Show page content
      this.pageContent.style.display = 'block';
      Utils.fadeIn(this.pageContent);
      
      // Create soul entry effects
      this.createSoulEntry();
    }, 1000);
  }

  createSoulEntry() {
    // Create sacred symbols appearing effect
    const symbols = ['✦', '◊', '△', '◯', '⬟'];
    
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const symbol = document.createElement('div');
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.position = 'fixed';
        symbol.style.left = Math.random() * window.innerWidth + 'px';
        symbol.style.top = Math.random() * window.innerHeight + 'px';
        symbol.style.fontSize = (Math.random() * 3 + 1.5) + 'rem';
        symbol.style.color = '#f7b801';
        symbol.style.textShadow = '0 0 20px #f7b801';
        symbol.style.pointerEvents = 'none';
        symbol.style.zIndex = '1000';
        symbol.style.animation = 'soulAppear 5s ease-out forwards';
        
        document.body.appendChild(symbol);
        setTimeout(() => symbol.remove(), 5000);
      }, i * 180);
    }
  }

  preventSeeking() {
    if (!this.videoCompleted && this.roomVideo) {
      const currentTime = this.roomVideo.currentTime;
      const lastTime = this.roomVideo.dataset.lastTime || 0;
      
      if (currentTime < lastTime) {
        this.roomVideo.currentTime = lastTime;
      }
      
      this.roomVideo.dataset.lastTime = currentTime;
    }
  }

  disableClosing() {
    // Disable escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.roomVideoModal && this.roomVideoModal.style.display !== 'none') {
        e.preventDefault();
      }
    });

    // Disable clicking outside
    if (this.roomVideoModal) {
      this.roomVideoModal.addEventListener('click', (e) => {
        if (e.target === this.roomVideoModal && !this.videoCompleted) {
          e.preventDefault();
        }
      });
    }

    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      if (this.roomVideoModal && this.roomVideoModal.style.display !== 'none') {
        e.preventDefault();
      }
    });

    // Remove video controls
    if (this.roomVideo) {
      this.roomVideo.controls = false;
    }
  }
}

// ===== SOUL AMBIENT EFFECTS =====
class SoulAmbientEffects {
  constructor() {
    this.createDivineGeometry();
    this.createEnergyFlows();
    this.addSpiritualInteraction();
  }

  createDivineGeometry() {
    // Add dynamic sacred geometry patterns
    const container = document.querySelector('.sacred-geometry');
    if (!container) return;
    
    for (let i = 0; i < 8; i++) {
      const pattern = document.createElement('div');
      pattern.className = 'divine-pattern';
      pattern.textContent = ['◊', '△', '◯', '⬟', '✦'][Math.floor(Math.random() * 5)];
      pattern.style.position = 'absolute';
      pattern.style.left = Math.random() * 100 + '%';
      pattern.style.top = Math.random() * 100 + '%';
      pattern.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
      pattern.style.color = '#f7b801';
      pattern.style.textShadow = '0 0 15px #f7b801';
      pattern.style.animation = `divineFloat ${6 + Math.random() * 6}s ease-in-out infinite`;
      pattern.style.animationDelay = Math.random() * 4 + 's';
      pattern.style.opacity = '0.6';
      
      container.appendChild(pattern);
    }
  }

  createEnergyFlows() {
    // Add periodic energy flows
    setInterval(() => {
      if (Math.random() > 0.5) {
        const flow = document.createElement('div');
        flow.className = 'energy-flow';
        flow.style.position = 'fixed';
        flow.style.left = Math.random() * window.innerWidth + 'px';
        flow.style.top = Math.random() * window.innerHeight + 'px';
        flow.style.width = (Math.random() * 150 + 100) + 'px';
        flow.style.height = '3px';
        flow.style.background = 'linear-gradient(90deg, transparent, rgba(247, 184, 1, 0.8), transparent)';
        flow.style.borderRadius = '2px';
        flow.style.transform = `rotate(${Math.random() * 360}deg)`;
        flow.style.pointerEvents = 'none';
        flow.style.zIndex = '1';
        flow.style.animation = 'energyFlow 6s ease-out forwards';
        
        document.body.appendChild(flow);
        setTimeout(() => flow.remove(), 6000);
      }
    }, 3500);
  }

  addSpiritualInteraction() {
    let soulTrail = [];
    
    document.addEventListener('mousemove', (e) => {
      // Create soul particle trail
      if (Math.random() > 0.9) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#f7b801';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = '0 0 10px #f7b801';
        particle.style.animation = 'soulParticle 2.5s ease-out forwards';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2500);
      }
    });

    // Add click divine blessing
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const blessing = document.createElement('div');
          blessing.style.position = 'fixed';
          blessing.style.left = e.clientX + 'px';
          blessing.style.top = e.clientY + 'px';
          blessing.style.width = '6px';
          blessing.style.height = '6px';
          blessing.style.background = 'radial-gradient(circle, #f7b801, rgba(247, 184, 1, 0.3))';
          blessing.style.borderRadius = '50%';
          blessing.style.pointerEvents = 'none';
          blessing.style.zIndex = '1000';
          blessing.style.boxShadow = '0 0 20px #f7b801';
          blessing.style.animation = 'divineBlessing 2s ease-out forwards';
          
          const angle = (i / 12) * Math.PI * 2;
          const distance = 80;
          blessing.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
          
          document.body.appendChild(blessing);
          setTimeout(() => blessing.remove(), 2000);
        }, i * 80);
      }
    });
  }
}

// Add dynamic styles for Room 4 effects
function addRoom4Styles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes soulBurst {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.5);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5) translateY(-50px);
      }
    }

    @keyframes soulAppear {
      0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
        filter: brightness(0.5);
      }
      50% {
        opacity: 1;
        transform: scale(1.4) rotate(180deg);
        filter: brightness(1.5);
      }
      100% {
        opacity: 0;
        transform: scale(0.8) rotate(360deg);
        filter: brightness(1);
      }
    }

    @keyframes divineFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-25px) rotate(180deg);
        opacity: 1;
      }
    }

    @keyframes energyFlow {
      0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      25% {
        opacity: 1;
        transform: scale(1.2) rotate(90deg);
      }
      75% {
        opacity: 0.8;
        transform: scale(1) rotate(270deg);
      }
      100% {
        opacity: 0;
        transform: scale(0.5) rotate(360deg);
      }
    }

    @keyframes soulParticle {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(5) translateY(-40px);
      }
    }

    @keyframes divineBlessing {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(4) translateY(-40px);
      }
    }

    .divine-pattern {
      filter: drop-shadow(0 0 10px rgba(247, 184, 1, 0.5));
    }

    .energy-flow {
      filter: blur(0.5px);
    }
  `;
  document.head.appendChild(style);
}

// Initialize Room 4 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Prevent multiple initializations
  if (!window.room4Initialized) {
    window.room4Initialized = true;
    addRoom4Styles();
    new Room4VideoModal();
    new SoulAmbientEffects();
  }
}); 