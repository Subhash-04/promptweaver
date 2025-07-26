// ===== ROOM SEARCH VIDEO MODAL =====
class RoomVideoModal {
  constructor() {
    this.roomVideoModal = document.getElementById('roomVideoModal');
    this.roomVideo = document.getElementById('roomVideo');
    this.proceedBtn = document.getElementById('proceedBtn');
    this.pageContent = document.getElementById('pageContent');
    this.videoCompleted = false;
    
    this.init();
  }
  
  init() {
    // Auto-start video when page loads
    this.startVideo();
    
    // Listen for video end
    this.roomVideo.addEventListener('ended', () => {
      this.onVideoComplete();
    });
    
    // Prevent video seeking/skipping
    this.roomVideo.addEventListener('seeking', (e) => {
      if (!this.videoCompleted && this.roomVideo.currentTime > this.roomVideo.played.end(this.roomVideo.played.length - 1)) {
        this.roomVideo.currentTime = this.roomVideo.played.end(this.roomVideo.played.length - 1);
      }
    });
    
    // Proceed button functionality
    this.proceedBtn.addEventListener('click', () => {
      this.proceedToNextStage();
    });
    
    // Disable all closing methods
    this.disableClosing();
  }
  
  startVideo() {
    // Ensure video starts playing
    this.roomVideo.currentTime = 0;
    this.roomVideo.play().catch(error => {
      console.log('Video autoplay failed:', error);
      // Show play button if autoplay fails
      this.showPlayButton();
    });
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }
  
  showPlayButton() {
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Start Room Search';
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
    this.proceedBtn.style.display = 'block';
    
    // Add completion animation
    this.proceedBtn.style.animation = 'fadeInUp 1s ease forwards';
    
    // Add magical completion effect
    this.createCompletionEffect();
  }
  
  createCompletionEffect() {
    // Create magical particles around the proceed button
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const rect = this.proceedBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
        Utils.createMagicalEffect(x, y);
      }, i * 200);
    }
  }
  
  proceedToNextStage() {
    // Fade out video modal
    this.roomVideoModal.style.transition = 'opacity 1s ease';
    this.roomVideoModal.style.opacity = '0';
    
    setTimeout(() => {
      this.roomVideoModal.style.display = 'none';
      this.pageContent.style.display = 'block';
      document.body.style.overflow = 'auto';
      
      // Trigger page content animation
      Utils.fadeIn(this.pageContent, 1500);
    }, 1000);
  }
  
  disableClosing() {
    // Disable escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.roomVideoModal.classList.contains('active')) {
        e.preventDefault();
        return false;
      }
    });
    
    // Disable clicking outside
    this.roomVideoModal.addEventListener('click', (e) => {
      if (e.target === this.roomVideoModal) {
        e.stopPropagation();
        return false;
      }
    });
    
    // Disable right-click context menu on video
    this.roomVideo.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Remove video controls
    this.roomVideo.removeAttribute('controls');
  }
}

// ===== TEMPORAL CHAMBER AMBIENT EFFECTS =====
class RoomAmbientEffects {
  constructor() {
    this.init();
  }
  
  init() {
    // Create floating temporal orbs
    this.createTemporalOrbs();
    
    // Create time distortion effects
    this.createTimeDistortions();
    
    // Add floating runes
    this.createFloatingRunes();
    
    // Add mouse interaction effects
    this.addMouseEffects();
    
    // Create temporal energy streams
    this.createTemporalStreams();
  }
  
  createTemporalOrbs() {
    const orbCount = 12;
    
    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div');
      orb.className = 'temporal-orb';
      orb.style.position = 'fixed';
      orb.style.width = (Math.random() * 12 + 6) + 'px';
      orb.style.height = orb.style.width;
      orb.style.borderRadius = '50%';
      orb.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.8), rgba(67, 231, 173, 0.5), transparent)';
      orb.style.left = Math.random() * 100 + '%';
      orb.style.top = Math.random() * 100 + '%';
      orb.style.zIndex = '3';
      orb.style.pointerEvents = 'none';
      orb.style.animation = `temporalFloat ${6 + Math.random() * 6}s ease-in-out infinite`;
      orb.style.animationDelay = Math.random() * 4 + 's';
      orb.style.filter = 'blur(0.5px)';
      orb.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
      
      document.body.appendChild(orb);
    }
  }

  createTimeDistortions() {
    // Create ripple effects that simulate time distortions
    setInterval(() => {
      if (Math.random() > 0.8) {
        const ripple = document.createElement('div');
        ripple.className = 'time-ripple';
        ripple.style.position = 'fixed';
        ripple.style.left = Math.random() * window.innerWidth + 'px';
        ripple.style.top = Math.random() * window.innerHeight + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.border = '2px solid rgba(0, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.zIndex = '2';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'timeRipple 3s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 3000);
      }
    }, 2000);
  }

  createFloatingRunes() {
    const runes = ['⧖', '⧗', '⧘', '⧙', '⧚', '⧛', '⧜', '⧝'];
    
    for (let i = 0; i < 6; i++) {
      const rune = document.createElement('div');
      rune.className = 'floating-rune';
      rune.textContent = runes[Math.floor(Math.random() * runes.length)];
      rune.style.position = 'fixed';
      rune.style.left = Math.random() * 100 + '%';
      rune.style.top = Math.random() * 100 + '%';
      rune.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
      rune.style.color = 'rgba(0, 255, 255, 0.7)';
      rune.style.textShadow = '0 0 15px rgba(0, 255, 255, 0.8)';
      rune.style.zIndex = '2';
      rune.style.pointerEvents = 'none';
      rune.style.animation = `runeFloat ${8 + Math.random() * 6}s ease-in-out infinite`;
      rune.style.animationDelay = Math.random() * 5 + 's';
      
      document.body.appendChild(rune);
    }
  }

  createTemporalStreams() {
    // Create flowing temporal energy streams
    for (let i = 0; i < 4; i++) {
      const stream = document.createElement('div');
      stream.className = 'temporal-stream';
      stream.style.position = 'fixed';
      stream.style.width = '2px';
      stream.style.height = '150px';
      stream.style.background = 'linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.8), transparent)';
      stream.style.left = Math.random() * 100 + '%';
      stream.style.top = Math.random() * 100 + '%';
      stream.style.zIndex = '1';
      stream.style.pointerEvents = 'none';
      stream.style.animation = `temporalStream ${3 + Math.random() * 3}s ease-in-out infinite`;
      stream.style.animationDelay = Math.random() * 2 + 's';
      stream.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      document.body.appendChild(stream);
    }
  }
  
  addMouseEffects() {
    document.addEventListener('mousemove', (e) => {
      // Create temporal distortion on mouse movement
      if (Math.random() > 0.92) {
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.left = e.clientX + 'px';
        effect.style.top = e.clientY + 'px';
        effect.style.width = '8px';
        effect.style.height = '8px';
        effect.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.8), transparent)';
        effect.style.borderRadius = '50%';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.style.animation = 'temporalTrace 2s ease-out forwards';
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 2000);
      }
    });
  }
}

// Add dynamic styles for Room 1 temporal effects
function addRoom1Styles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes temporalFloat {
      0%, 100% { 
        transform: translateY(0px) scale(1) rotate(0deg);
        opacity: 0.6;
        filter: blur(0.5px) hue-rotate(0deg);
      }
      25% {
        transform: translateY(-20px) scale(1.1) rotate(90deg);
        opacity: 0.8;
        filter: blur(0.3px) hue-rotate(90deg);
      }
      50% { 
        transform: translateY(-40px) scale(1.2) rotate(180deg);
        opacity: 1;
        filter: blur(0px) hue-rotate(180deg);
      }
      75% {
        transform: translateY(-20px) scale(1.1) rotate(270deg);
        opacity: 0.8;
        filter: blur(0.3px) hue-rotate(270deg);
      }
    }

    @keyframes timeRipple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
      100% {
        transform: scale(20);
        opacity: 0;
      }
    }

    @keyframes runeFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.5;
        text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
      }
      33% {
        transform: translateY(-30px) rotate(120deg);
        opacity: 0.8;
        text-shadow: 0 0 25px rgba(0, 255, 255, 1);
      }
      66% {
        transform: translateY(-15px) rotate(240deg);
        opacity: 0.7;
        text-shadow: 0 0 20px rgba(67, 231, 173, 0.9);
      }
    }

    @keyframes temporalStream {
      0% {
        opacity: 0;
        transform: translateY(0px) scale(1);
      }
      50% {
        opacity: 1;
        transform: translateY(-50px) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.8);
      }
    }

    @keyframes temporalTrace {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(3);
      }
    }

    /* Temporal chamber specific effects */
    .temporal-orb {
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }

    .time-ripple {
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .floating-rune {
      font-family: 'UnifrakturCook', cursive;
      animation-timing-function: ease-in-out;
    }

    .temporal-stream {
      animation-timing-function: ease-in-out;
      border-radius: 2px;
    }

    /* Enhanced visual effects for temporal chamber */
    .temporal-orb:hover {
      animation-duration: 2s !important;
    }

    .floating-rune:nth-child(odd) {
      animation-direction: reverse;
    }

    .temporal-stream:nth-child(even) {
      animation-direction: alternate;
    }
  `;
  document.head.appendChild(style);
}

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Prevent multiple initializations
  if (!window.room1Initialized) {
    window.room1Initialized = true;
    addRoom1Styles();
    new RoomVideoModal();
    new RoomAmbientEffects();
    
    console.log('Room Search - Initialized');
  }
}); 