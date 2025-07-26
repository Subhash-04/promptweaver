// ===== ROOM 2 - DIMENSIONAL CHAMBER LOGIC =====
class Room2VideoModal {
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
    playBtn.textContent = 'Enter Chamber';
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
      
      // Create magical completion effects
      this.createDimensionalEffects();
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
      background: rgba(0, 255, 255, 0.9);
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

  createDimensionalEffects() {
    const container = this.roomVideoModal.querySelector('.video-container');
    const rect = container.getBoundingClientRect();
    
    // Create dimensional rifts around the video
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const rift = document.createElement('div');
        rift.style.position = 'fixed';
        rift.style.left = (rect.left + Math.random() * rect.width) + 'px';
        rift.style.top = (rect.top + Math.random() * rect.height) + 'px';
        rift.style.width = (Math.random() * 60 + 40) + 'px';
        rift.style.height = (Math.random() * 20 + 10) + 'px';
        rift.style.background = 'linear-gradient(45deg, transparent, rgba(255, 0, 255, 0.8), transparent)';
        rift.style.borderRadius = '50%';
        rift.style.transform = `rotate(${Math.random() * 360}deg)`;
        rift.style.pointerEvents = 'none';
        rift.style.zIndex = '1001';
        rift.style.animation = 'dimensionalRift 2s ease-out forwards';
        
        document.body.appendChild(rift);
        setTimeout(() => rift.remove(), 2000);
      }, i * 200);
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
      
      // Create dimensional entry effects
      this.createDimensionalEntry();
    }, 1000);
  }

  createDimensionalEntry() {
    // Create geometric shapes appearing effect
    const shapes = ['◊', '△', '◈', '⬟', '◯'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const shape = document.createElement('div');
        shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.position = 'fixed';
        shape.style.left = Math.random() * window.innerWidth + 'px';
        shape.style.top = Math.random() * window.innerHeight + 'px';
        shape.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        shape.style.color = '#ff00ff';
        shape.style.textShadow = '0 0 10px #ff00ff';
        shape.style.pointerEvents = 'none';
        shape.style.zIndex = '1000';
        shape.style.animation = 'geometricAppear 3s ease-out forwards';
        
        document.body.appendChild(shape);
        setTimeout(() => shape.remove(), 3000);
      }, i * 150);
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

// ===== DIMENSIONAL AMBIENT EFFECTS =====
class DimensionalAmbientEffects {
  constructor() {
    this.createFloatingGeometry();
    this.createDimensionalRifts();
    this.addMouseInteraction();
  }

  createFloatingGeometry() {
    // Add extra floating geometric shapes
    const container = document.querySelector('.geometric-shapes');
    if (!container) return;
    
    const extraShapes = ['◆', '▲', '●', '■', '★'];
    
    for (let i = 0; i < 8; i++) {
      const shape = document.createElement('div');
      shape.className = 'shape extra-shape';
      shape.textContent = extraShapes[Math.floor(Math.random() * extraShapes.length)];
      shape.style.position = 'absolute';
      shape.style.left = Math.random() * 100 + '%';
      shape.style.top = Math.random() * 100 + '%';
      shape.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
      shape.style.color = `hsl(${280 + Math.random() * 40}, 100%, 70%)`;
      shape.style.textShadow = `0 0 10px hsl(${280 + Math.random() * 40}, 100%, 70%)`;
      shape.style.animation = `geometricFloat ${4 + Math.random() * 4}s ease-in-out infinite`;
      shape.style.animationDelay = Math.random() * 5 + 's';
      shape.style.opacity = '0.5';
      
      container.appendChild(shape);
    }
  }

  createDimensionalRifts() {
    // Add dynamic rifts that appear and disappear
    setInterval(() => {
      if (Math.random() > 0.7) {
        const rift = document.createElement('div');
        rift.className = 'dynamic-rift';
        rift.style.position = 'fixed';
        rift.style.left = Math.random() * window.innerWidth + 'px';
        rift.style.top = Math.random() * window.innerHeight + 'px';
        rift.style.width = (Math.random() * 100 + 50) + 'px';
        rift.style.height = (Math.random() * 30 + 20) + 'px';
        rift.style.background = 'linear-gradient(45deg, transparent, rgba(255, 0, 255, 0.6), transparent)';
        rift.style.borderRadius = '50%';
        rift.style.transform = `rotate(${Math.random() * 360}deg)`;
        rift.style.pointerEvents = 'none';
        rift.style.zIndex = '1';
        rift.style.animation = 'riftAppear 4s ease-in-out forwards';
        
        document.body.appendChild(rift);
        setTimeout(() => rift.remove(), 4000);
      }
    }, 3000);
  }

  addMouseInteraction() {
    let mouseTrail = [];
    
    document.addEventListener('mousemove', (e) => {
      // Create dimensional particle trail
      if (Math.random() > 0.8) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#ff00ff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = '0 0 6px #ff00ff';
        particle.style.animation = 'mouseParticle 1.5s ease-out forwards';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
      }
    });
  }
}

// Add dynamic styles for Room 2 effects
function addRoom2Styles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes dimensionalRift {
      0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.2) rotate(180deg);
      }
      100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
      }
    }

    @keyframes geometricAppear {
      0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
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

    @keyframes riftAppear {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      25% {
        opacity: 0.8;
        transform: scale(1.2);
      }
      75% {
        opacity: 0.6;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.8);
      }
    }

    @keyframes mouseParticle {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(3) translateY(-20px);
      }
    }

    .extra-shape {
      animation-direction: alternate;
    }

    .dynamic-rift {
      filter: blur(1px);
    }
  `;
  document.head.appendChild(style);
}

// Initialize Room 2 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Prevent multiple initializations
  if (!window.room2Initialized) {
    window.room2Initialized = true;
    addRoom2Styles();
    new Room2VideoModal();
    new DimensionalAmbientEffects();
  }
}); 