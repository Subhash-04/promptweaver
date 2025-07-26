// ===== ROOM 3 - CONSCIOUSNESS LABYRINTH LOGIC =====
class Room3VideoModal {
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
    playBtn.textContent = 'Enter Consciousness';
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
      
      // Create consciousness completion effects
      this.createConsciousnessEffects();
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
      background: rgba(67, 231, 173, 0.9);
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

  createConsciousnessEffects() {
    const container = this.roomVideoModal.querySelector('.video-container');
    const rect = container.getBoundingClientRect();
    
    // Create neural network pulses around the video
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const pulse = document.createElement('div');
        pulse.style.position = 'fixed';
        pulse.style.left = (rect.left + Math.random() * rect.width) + 'px';
        pulse.style.top = (rect.top + Math.random() * rect.height) + 'px';
        pulse.style.width = (Math.random() * 40 + 20) + 'px';
        pulse.style.height = '3px';
        pulse.style.background = 'linear-gradient(90deg, transparent, rgba(67, 231, 173, 0.8), transparent)';
        pulse.style.borderRadius = '2px';
        pulse.style.transform = `rotate(${Math.random() * 360}deg)`;
        pulse.style.pointerEvents = 'none';
        pulse.style.zIndex = '1001';
        pulse.style.animation = 'consciousnessPulse 2.5s ease-out forwards';
        
        document.body.appendChild(pulse);
        setTimeout(() => pulse.remove(), 2500);
      }, i * 150);
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
      
      // Create consciousness entry effects
      this.createConsciousnessEntry();
    }, 1000);
  }

  createConsciousnessEntry() {
    // Create thought patterns appearing effect
    const patterns = ['◈', '⟐', '◯', '◊', '✦'];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const pattern = document.createElement('div');
        pattern.textContent = patterns[Math.floor(Math.random() * patterns.length)];
        pattern.style.position = 'fixed';
        pattern.style.left = Math.random() * window.innerWidth + 'px';
        pattern.style.top = Math.random() * window.innerHeight + 'px';
        pattern.style.fontSize = (Math.random() * 2.5 + 1) + 'rem';
        pattern.style.color = '#43e7ad';
        pattern.style.textShadow = '0 0 15px #43e7ad';
        pattern.style.pointerEvents = 'none';
        pattern.style.zIndex = '1000';
        pattern.style.animation = 'consciousnessAppear 4s ease-out forwards';
        
        document.body.appendChild(pattern);
        setTimeout(() => pattern.remove(), 4000);
      }, i * 200);
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

// ===== CONSCIOUSNESS AMBIENT EFFECTS =====
class ConsciousnessAmbientEffects {
  constructor() {
    this.createNeuralConnections();
    this.createThoughtWaves();
    this.addMindInteraction();
  }

  createNeuralConnections() {
    // Add dynamic neural connections
    const container = document.querySelector('.neural-network');
    if (!container) return;
    
    for (let i = 0; i < 6; i++) {
      const connection = document.createElement('div');
      connection.className = 'neural-connection';
      connection.style.position = 'absolute';
      connection.style.left = Math.random() * 100 + '%';
      connection.style.top = Math.random() * 100 + '%';
      connection.style.width = (Math.random() * 80 + 40) + 'px';
      connection.style.height = '2px';
      connection.style.background = 'linear-gradient(90deg, transparent, rgba(67, 231, 173, 0.6), transparent)';
      connection.style.transform = `rotate(${Math.random() * 360}deg)`;
      connection.style.animation = `neuralFlow ${3 + Math.random() * 4}s ease-in-out infinite`;
      connection.style.animationDelay = Math.random() * 3 + 's';
      connection.style.opacity = '0.7';
      
      container.appendChild(connection);
    }
  }

  createThoughtWaves() {
    // Add periodic thought waves
    setInterval(() => {
      if (Math.random() > 0.6) {
        const wave = document.createElement('div');
        wave.className = 'thought-wave';
        wave.style.position = 'fixed';
        wave.style.left = Math.random() * window.innerWidth + 'px';
        wave.style.top = Math.random() * window.innerHeight + 'px';
        wave.style.width = '100px';
        wave.style.height = '100px';
        wave.style.border = '2px solid rgba(67, 231, 173, 0.4)';
        wave.style.borderRadius = '50%';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '1';
        wave.style.animation = 'thoughtWave 5s ease-out forwards';
        
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 5000);
      }
    }, 4000);
  }

  addMindInteraction() {
    let mindTrail = [];
    
    document.addEventListener('mousemove', (e) => {
      // Create consciousness particle trail
      if (Math.random() > 0.85) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#43e7ad';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = '0 0 8px #43e7ad';
        particle.style.animation = 'mindParticle 2s ease-out forwards';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
      }
    });

    // Add click consciousness burst
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const burst = document.createElement('div');
          burst.style.position = 'fixed';
          burst.style.left = e.clientX + 'px';
          burst.style.top = e.clientY + 'px';
          burst.style.width = '4px';
          burst.style.height = '4px';
          burst.style.background = '#43e7ad';
          burst.style.borderRadius = '50%';
          burst.style.pointerEvents = 'none';
          burst.style.zIndex = '1000';
          burst.style.animation = 'consciousnessBurst 1.5s ease-out forwards';
          
          const angle = (i / 8) * Math.PI * 2;
          const distance = 50;
          burst.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
          
          document.body.appendChild(burst);
          setTimeout(() => burst.remove(), 1500);
        }, i * 50);
      }
    });
  }
}

// Add dynamic styles for Room 3 effects
function addRoom3Styles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes consciousnessPulse {
      0% {
        opacity: 0;
        transform: scale(1) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.5) rotate(180deg);
      }
      100% {
        opacity: 0;
        transform: scale(0.5) rotate(360deg);
      }
    }

    @keyframes consciousnessAppear {
      0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
        filter: blur(5px);
      }
      50% {
        opacity: 1;
        transform: scale(1.3) rotate(180deg);
        filter: blur(0px);
      }
      100% {
        opacity: 0;
        transform: scale(0.8) rotate(360deg);
        filter: blur(2px);
      }
    }

    @keyframes neuralFlow {
      0% {
        opacity: 0.3;
        transform: scale(1) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.2) rotate(180deg);
      }
      100% {
        opacity: 0.3;
        transform: scale(1) rotate(360deg);
      }
    }

    @keyframes thoughtWave {
      0% {
        opacity: 0.6;
        transform: scale(0.5);
      }
      50% {
        opacity: 1;
        transform: scale(2);
      }
      100% {
        opacity: 0;
        transform: scale(4);
      }
    }

    @keyframes mindParticle {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(4) translateY(-30px);
      }
    }

    @keyframes consciousnessBurst {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(3) translateY(-20px);
      }
    }

    .neural-connection {
      filter: blur(0.5px);
    }

    .thought-wave {
      filter: blur(1px);
    }
  `;
  document.head.appendChild(style);
}

// Initialize Room 3 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Prevent multiple initializations
  if (!window.room3Initialized) {
    window.room3Initialized = true;
    addRoom3Styles();
    new Room3VideoModal();
    new ConsciousnessAmbientEffects();
  }
}); 