// ===== GLOBAL TIMER SYSTEM =====
class GlobalTimer {
  constructor() {
    this.gameStartTime = this.getGameStartTime();
    this.gameDuration = 45 * 60 * 1000; // 45 minutes in milliseconds
    this.timerInterval = null;
    this.warningShown = false;
    this.timerElement = null;
    
    this.init();
  }

  getGameStartTime() {
    // Get game start time from localStorage
    let startTime = localStorage.getItem('promptweaver_start_time');
    if (!startTime) {
      // If no start time, set it now (fallback)
      startTime = Date.now();
      localStorage.setItem('promptweaver_start_time', startTime);
    }
    return parseInt(startTime);
  }

  init() {
    // Only initialize if quest has started
    const gameState = JSON.parse(localStorage.getItem('promptweaver_gamestate') || '{}');
    if (gameState.questStarted || localStorage.getItem('promptweaver_start_time')) {
      this.createTimerElement();
      this.startTimer();
    }
  }

  createTimerElement() {
    // Don't create if already exists
    if (document.getElementById('globalGameTimer')) return;

    const timerContainer = document.createElement('div');
    timerContainer.id = 'globalGameTimer';
    timerContainer.className = 'global-game-timer';
    timerContainer.innerHTML = `
      <div class="timer-icon">⏳</div>
      <div class="timer-text">
        <div class="timer-label">Quest Timer</div>
        <div class="timer-display" id="globalTimerDisplay">45:00</div>
      </div>
    `;
    
    document.body.appendChild(timerContainer);
    this.timerElement = timerContainer;
    this.addGlobalTimerStyles();
  }

  addGlobalTimerStyles() {
    // Don't add styles if already added
    if (document.getElementById('global-timer-styles')) return;

    const style = document.createElement('style');
    style.id = 'global-timer-styles';
    style.textContent = `
      .global-game-timer {
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, rgba(15, 5, 30, 0.95) 0%, rgba(25, 10, 45, 0.95) 100%);
        border: 2px solid #f7b801;
        border-radius: 15px;
        padding: 15px 20px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 0 30px rgba(247, 184, 1, 0.4);
        backdrop-filter: blur(10px);
        font-family: 'Montserrat', sans-serif;
      }

      .global-game-timer .timer-icon {
        font-size: 1.5rem;
        animation: globalTimerPulse 2s ease-in-out infinite;
      }

      .global-game-timer .timer-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .global-game-timer .timer-label {
        font-family: 'UnifrakturCook', cursive;
        font-size: 0.9rem;
        color: #f7b801;
        text-shadow: 0 0 5px #f7b801;
      }

      .global-game-timer .timer-display {
        font-family: 'Orbitron', monospace;
        font-size: 1.4rem;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 0 10px #00ffff;
      }

      .global-game-timer .timer-display.warning {
        color: #ff4757;
        text-shadow: 0 0 10px #ff4757;
        animation: globalTimerWarning 1s ease-in-out infinite alternate;
      }

      @keyframes globalTimerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      @keyframes globalTimerWarning {
        0% { opacity: 1; }
        100% { opacity: 0.5; }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .global-game-timer {
          top: 10px;
          left: 10px;
          padding: 10px 15px;
        }
        
        .global-game-timer .timer-display {
          font-size: 1.2rem;
        }
      }

      /* Adjust positioning if fragment inventory exists */
      .fragment-inventory + .global-game-timer {
        top: 120px;
      }

      @media (max-width: 768px) {
        .fragment-inventory + .global-game-timer {
          top: 100px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);
  }

  updateTimerDisplay() {
    const now = Date.now();
    const elapsed = now - this.gameStartTime;
    const remaining = Math.max(0, this.gameDuration - elapsed);
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    const timerDisplay = document.getElementById('globalTimerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Add warning class if less than 5 minutes
      if (remaining <= 5 * 60 * 1000) {
        timerDisplay.classList.add('warning');
        
        // Show warning modal once
        if (!this.warningShown && remaining <= 5 * 60 * 1000) {
          this.showTimeWarning();
          this.warningShown = true;
        }
      }
      
      // Game over if time runs out
      if (remaining <= 0) {
        this.gameOver();
      }
    }
  }

  showTimeWarning() {
    // Don't show warning if already exists
    if (document.getElementById('globalTimeWarning')) return;

    const warningModal = document.createElement('div');
    warningModal.id = 'globalTimeWarning';
    warningModal.className = 'global-time-warning-modal';
    warningModal.innerHTML = `
      <div class="warning-container">
        <div class="warning-icon">⚠️</div>
        <div class="warning-title">Time Running Out!</div>
        <div class="warning-text">You have less than 5 minutes remaining to complete your quest!</div>
        <button class="warning-close-btn" onclick="this.parentElement.parentElement.remove()">Continue Quest</button>
      </div>
    `;
    
    // Add warning modal styles
    const warningStyle = document.createElement('style');
    warningStyle.textContent = `
      .global-time-warning-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1500;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .global-time-warning-modal .warning-container {
        background: linear-gradient(135deg, rgba(255, 71, 87, 0.95) 0%, rgba(138, 43, 226, 0.95) 100%);
        border: 3px solid #ff4757;
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        max-width: 400px;
        animation: warningPulse 1s ease-in-out infinite alternate;
      }

      .global-time-warning-modal .warning-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: warningShake 0.5s ease-in-out infinite alternate;
      }

      .global-time-warning-modal .warning-title {
        font-family: 'UnifrakturCook', cursive;
        font-size: 2rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 15px;
        text-shadow: 0 0 10px #ff4757;
      }

      .global-time-warning-modal .warning-text {
        font-family: 'Montserrat', sans-serif;
        color: #ffffff;
        margin-bottom: 25px;
        font-size: 1.1rem;
      }

      .global-time-warning-modal .warning-close-btn {
        background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
        color: #ffffff;
        font-family: 'UnifrakturCook', cursive;
        font-size: 1.1rem;
        font-weight: 700;
        padding: 12px 30px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        letter-spacing: 1px;
        transition: all 0.3s ease;
      }

      .global-time-warning-modal .warning-close-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 71, 87, 0.6);
      }

      @keyframes warningPulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.02); }
      }

      @keyframes warningShake {
        0% { transform: translateX(0); }
        100% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(warningStyle);
    
    document.body.appendChild(warningModal);
  }

  gameOver() {
    clearInterval(this.timerInterval);
    
    // Create game over modal
    const gameOverModal = document.createElement('div');
    gameOverModal.className = 'global-game-over-modal';
    gameOverModal.innerHTML = `
      <div class="game-over-container">
        <div class="game-over-icon">⏰</div>
        <div class="game-over-title">Time's Up!</div>
        <div class="game-over-text">The academy remains vulnerable. The Guardian's Portrait fades back into the shadows...</div>
        <button class="restart-quest-btn" onclick="globalTimer.resetGame()">Try Again</button>
      </div>
    `;
    
    // Add game over styles
    const gameOverStyle = document.createElement('style');
    gameOverStyle.textContent = `
      .global-game-over-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(ellipse at center, rgba(20, 10, 40, 0.98) 0%, rgba(0, 0, 0, 0.99) 70%);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .global-game-over-modal .game-over-container {
        background: linear-gradient(135deg, rgba(15, 5, 30, 0.95) 0%, rgba(25, 10, 45, 0.95) 100%);
        border: 3px solid #ff4757;
        border-radius: 25px;
        padding: 40px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 0 50px rgba(255, 71, 87, 0.6);
      }

      .global-game-over-modal .game-over-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: gameOverPulse 2s ease-in-out infinite;
      }

      .global-game-over-modal .game-over-title {
        font-family: 'UnifrakturCook', cursive;
        font-size: 3rem;
        color: #ff4757;
        margin-bottom: 20px;
        text-shadow: 0 0 15px #ff4757;
      }

      .global-game-over-modal .game-over-text {
        font-family: 'Montserrat', sans-serif;
        color: #ffffff;
        margin-bottom: 30px;
        font-size: 1.1rem;
        line-height: 1.5;
      }

      .global-game-over-modal .restart-quest-btn {
        background: linear-gradient(135deg, #8a2be2 0%, #ff0080 100%);
        color: #ffffff;
        font-family: 'UnifrakturCook', cursive;
        font-size: 1.2rem;
        font-weight: 700;
        padding: 15px 40px;
        border: 2px solid rgba(138, 43, 226, 0.5);
        border-radius: 25px;
        cursor: pointer;
        letter-spacing: 2px;
        transition: all 0.3s ease;
        box-shadow: 0 0 25px rgba(138, 43, 226, 0.4);
      }

      .global-game-over-modal .restart-quest-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 35px rgba(138, 43, 226, 0.6);
      }

      @keyframes gameOverPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
      }
    `;
    document.head.appendChild(gameOverStyle);
    
    document.body.appendChild(gameOverModal);
  }

  resetGame() {
    // Clear all game data
    localStorage.removeItem('promptweaver_gamestate');
    localStorage.removeItem('promptweaver_start_time');
    
    // Redirect to start
    window.location.href = 'index.html';
  }

  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.timerElement) {
      this.timerElement.remove();
    }
  }
}

// Auto-initialize global timer (except on index page)
document.addEventListener('DOMContentLoaded', () => {
  // Don't initialize on index page
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'index.html' && currentPage !== '') {
    window.globalTimer = new GlobalTimer();
  }
}); 