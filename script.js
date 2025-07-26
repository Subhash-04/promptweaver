// ===== STARS CREATION =====
function createStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;
  
  const starCount = 150;
  starsContainer.innerHTML = '';
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    
    // Add variety to star types
    if (Math.random() > 0.7) {
      star.classList.add('bright');
    }
    if (Math.random() > 0.85) {
      star.classList.add('colorful');
    }
    
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.animationDelay = delay + 's';
    
    starsContainer.appendChild(star);
  }
}

// ===== VIDEO MODAL FUNCTIONALITY =====
class VideoModal {
  constructor() {
    this.videoModal = document.getElementById('videoModal');
    this.beginQuestBtn = document.getElementById('beginQuestBtn');
    this.closeBtn = document.querySelector('.close-btn');
    this.questVideo = document.getElementById('questVideo');
    this.searchRoomBtn = document.getElementById('searchRoomBtn');
    this.videoCompleted = false;
    
    this.init();
  }
  
  init() {
    if (this.beginQuestBtn) {
      this.beginQuestBtn.addEventListener('click', () => this.openModal());
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    if (this.questVideo) {
      this.questVideo.addEventListener('ended', () => this.onVideoComplete());
      this.questVideo.addEventListener('timeupdate', () => this.preventSeeking());
      this.questVideo.addEventListener('pause', () => this.handleVideoPause());
      this.questVideo.addEventListener('canplay', () => this.ensureVideoPlays());
    }
    
    if (this.searchRoomBtn) {
      this.searchRoomBtn.addEventListener('click', () => {
        Navigation.goToPage('puzzle-interface.html');
      });
    }

    this.disableClosing();
  }
  
  openModal() {
    if (this.videoModal) {
      this.videoModal.classList.add('active');
      if (this.questVideo) {
        this.questVideo.currentTime = 0; // Reset to beginning
        this.questVideo.play().catch(error => {
          console.log('Video autoplay blocked:', error);
          // Show play button or manual play prompt if needed
        });
      }
      
      // Initialize game timer
      if (!localStorage.getItem('promptweaver_start_time')) {
        localStorage.setItem('promptweaver_start_time', Date.now());
      }
    }
  }

  closeModal() {
    if (this.videoCompleted && this.videoModal) {
      this.videoModal.classList.remove('active');
    }
  }

  onVideoComplete() {
    this.videoCompleted = true;
    if (this.searchRoomBtn) {
      this.searchRoomBtn.classList.add('show');
      Utils.fadeIn(this.searchRoomBtn);
    }
  }

  handleVideoPause() {
    // Auto-resume if video is paused and modal is active (unless it's ended)
    if (this.videoModal && this.videoModal.classList.contains('active') && 
        !this.videoCompleted && !this.questVideo.ended) {
      setTimeout(() => {
        if (this.questVideo.paused && !this.videoCompleted) {
          this.questVideo.play().catch(error => {
            console.log('Could not resume video:', error);
          });
        }
      }, 100); // Small delay to avoid conflicts
    }
  }

  ensureVideoPlays() {
    // Ensure video starts playing when it's ready and modal is active
    if (this.videoModal && this.videoModal.classList.contains('active') && 
        this.questVideo.paused && !this.videoCompleted) {
      this.questVideo.play().catch(error => {
        console.log('Could not start video:', error);
      });
    }
  }

  preventSeeking() {
    if (!this.videoCompleted && this.questVideo) {
      const currentTime = this.questVideo.currentTime;
      const lastTime = this.questVideo.dataset.lastTime || 0;
      
      if (currentTime < lastTime) {
        this.questVideo.currentTime = lastTime;
      }
      
      this.questVideo.dataset.lastTime = currentTime;
    }
  }

  disableClosing() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.videoModal && this.videoModal.classList.contains('active')) {
        e.preventDefault();
      }
    });

    if (this.videoModal) {
      this.videoModal.addEventListener('click', (e) => {
        if (e.target === this.videoModal && !this.videoCompleted) {
          e.preventDefault();
        }
      });
    }

    document.addEventListener('contextmenu', (e) => {
      if (this.videoModal && this.videoModal.classList.contains('active')) {
        e.preventDefault();
      }
    });

    if (this.questVideo) {
      this.questVideo.controls = false;
    }
  }
}

// ===== NAVIGATION SYSTEM =====
class Navigation {
  static goToPage(page) {
    window.location.href = page;
  }
  
  static getCurrentPage() {
    return window.location.pathname.split('/').pop();
  }
}

// ===== RESIZE HANDLER =====
function handleResize() {
  createStars();
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Prevent multiple initializations
  if (!window.mainPageInitialized) {
    window.mainPageInitialized = true;
    createStars();
    new VideoModal();
    
    window.addEventListener('resize', handleResize);
    
    console.log('Promptweaver: Rise of the Sigil - Initialized');
  }
});

// ===== UTILITY FUNCTIONS =====
const Utils = {
  fadeIn: (element, duration = 1000) => {
    element.style.opacity = '0';
    // Don't override display if element already has the 'show' class
    if (!element.classList.contains('show')) {
      element.style.display = 'block';
    }
    
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  },
  
  createMagicalEffect: (x, y) => {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '4px';
    effect.style.height = '4px';
    effect.style.background = '#00ffff';
    effect.style.borderRadius = '50%';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '1000';
    effect.style.boxShadow = '0 0 10px #00ffff';
    
    document.body.appendChild(effect);
    
    const animation = effect.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(3)', opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    });
    
    animation.onfinish = () => effect.remove();
  }
};

// Add magical particle effects on mouse clicks
document.addEventListener('click', (e) => {
  if (Math.random() > 0.7) { // 30% chance
    Utils.createMagicalEffect(e.clientX, e.clientY);
  }
});

// Add fadeOut animation for particles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
  }
`;
document.head.appendChild(style); 