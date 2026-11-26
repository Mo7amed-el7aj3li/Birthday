/**
 * FOR MY PRINCESS MANMONY - INTERACTIVE ROMANTIC ENGINE
 * Multi-Stage Personalized Love Letter & Birthday Experience
 * Aesthetic: Apple-Native Polish, Fluid Spring Physics, Lana Del Rey Soundtrack
 */

(function () {
  'use strict';

  // ---------------- Configuration & State ----------------
  const CORRECT_PASSWORDS = [
    '5/12/2006',
    '05/12/2006',
    '5-12-2006',
    '05-12-2006',
    '5.12.2006',
    '05.12.2006'
  ];

  let currentStage = 1;
  let isEnvelopeOpened = false;
  let isTyping = false;
  let activeTypeTimeout = null;
  let isAudioStarted = false;

  // DOM Elements - Loading & Cinematic Overlays
  const loadingScreen = document.getElementById('loading-screen');
  const cinematicOverlay = document.getElementById('cinematic-overlay');

  // DOM Elements - Stages
  const stage1 = document.getElementById('stage-1');
  const stage3 = document.getElementById('stage-3');
  const stage4 = document.getElementById('stage-4');
  const stageMemories = document.getElementById('stage-memories');
  const stageHacker = document.getElementById('stage-hacker');
  const stage5 = document.getElementById('stage-5');

  // Stage 1 & 2 Elements
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const passwordInput = document.getElementById('password-input');
  const passwordForm = document.getElementById('password-form');
  const togglePwdBtn = document.getElementById('toggle-pwd-btn');
  const errorMessage = document.getElementById('error-message');
  const passwordCard = document.getElementById('password-card');

  // Stage 3 Elements (The Birthday Letter)
  const letterCard = document.getElementById('romantic-letter-card');
  const typewriterLine1 = document.getElementById('typewriter-line-1');
  const typewriterLine2 = document.getElementById('typewriter-line-2');
  const typewriterLine3 = document.getElementById('typewriter-line-3');
  const typewriterCursor1 = document.getElementById('typewriter-cursor-1');
  const letterSignature = document.getElementById('letter-signature');

  // Stage 4 Elements (One More Surprise)
  const surpriseLoveCard = document.getElementById('surprise-love-card');
  const surpriseLine1 = document.getElementById('surprise-line-1');
  const surpriseLine2 = document.getElementById('surprise-line-2');
  const surpriseLine3 = document.getElementById('surprise-line-3');
  const typewriterCursor2 = document.getElementById('typewriter-cursor-2');
  const stage4Action = document.getElementById('stage-4-action');
  const toMemoriesBtn = document.getElementById('to-memories-btn');

  // Stage Memories Elements (Our Little Memories)
  const toHackerBtn = document.getElementById('to-hacker-btn');
  const memoryCards = document.querySelectorAll('.memory-card');

  // Stage Hacker Elements
  const hackerCanvas = document.getElementById('hacker-canvas');
  const matrixText = document.getElementById('matrix-text');

  // Music Widget & Canvas
  const musicBtn = document.getElementById('music-btn');
  const musicLabel = document.getElementById('music-label');
  const birthdayAudio = document.getElementById('birthdayAudio');
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  // ---------------- 1. LOADING SCREEN TRANSITION ----------------
  function initLoadingScreen() {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 850);
      }
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
  } else {
    initLoadingScreen();
  }

  // ---------------- 2. MUSIC SYSTEM (Cinnamon Girl by Lana Del Rey) ----------------
  function startSoundtrack() {
    if (!birthdayAudio) return;

    // Gentle romantic volume level by default (0.6)
    birthdayAudio.volume = 0.6;
    birthdayAudio.muted = false;

    const playPromise = birthdayAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioStarted = true;
          musicBtn.classList.add('playing');
          musicBtn.classList.remove('muted');
          musicBtn.setAttribute('aria-pressed', 'true');
          musicBtn.setAttribute('title', 'Mute music');
          if (musicLabel) musicLabel.textContent = 'Cinnamon Girl 🎵';
        })
        .catch((err) => {
          console.warn('Audio play waiting for interaction:', err);
        });
    }
  }

  // Floating music control: Mute or Unmute the music
  function toggleMute() {
    if (!birthdayAudio) return;

    if (birthdayAudio.paused) {
      birthdayAudio.muted = false;
      birthdayAudio.play().then(() => {
        isAudioStarted = true;
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('muted');
        musicBtn.setAttribute('aria-pressed', 'true');
        musicBtn.setAttribute('title', 'Mute music');
      }).catch(err => console.warn(err));
      return;
    }

    if (birthdayAudio.muted) {
      birthdayAudio.muted = false;
      musicBtn.classList.remove('muted');
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-pressed', 'true');
      musicBtn.setAttribute('title', 'Mute music');
    } else {
      birthdayAudio.muted = true;
      musicBtn.classList.add('muted');
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-pressed', 'false');
      musicBtn.setAttribute('title', 'Unmute music');
    }
  }

  musicBtn.addEventListener('click', toggleMute);

  // ---------------- 3. iOS SF-Style Eye Peek Password Toggle ----------------
  togglePwdBtn.addEventListener('click', () => {
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      if (eyeIcon) {
        eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      }
    } else {
      passwordInput.type = 'password';
      if (eyeIcon) {
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      }
    }
  });

  // ---------------- 4. Ambient Particle System ----------------
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientParticles = [];
  const TOTAL_AMBIENT = 40;
  let isStage5Celebration = false;

  class AmbientParticle {
    constructor(isBurst = false, x = null, y = null) {
      this.reset(isBurst, x, y);
    }

    reset(isBurst = false, x = null, y = null) {
      this.type = Math.random() < 0.5 ? 'heart' : Math.random() < 0.8 ? 'petal' : 'sparkle';
      this.x = x !== null ? x : Math.random() * width;
      this.y = y !== null ? y : (isBurst ? y : height + Math.random() * 80);

      this.size = Math.random() * 14 + 10;
      const speedMultiplier = isStage5Celebration ? 1.4 : 1.0;
      this.speedY = isBurst ? (Math.random() - 0.5) * 6 : -(Math.random() * 0.9 + 0.4) * speedMultiplier;
      this.speedX = isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.8;

      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.035;
      this.opacity = isBurst ? 1 : Math.random() * 0.45 + 0.35;
      this.fadeSpeed = isBurst ? Math.random() * 0.02 + 0.015 : 0;
      this.color = Math.random() < 0.55 ? 'rgba(255, 117, 143,' : 'rgba(232, 180, 184,';
      this.isBurst = isBurst;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.6;
      this.angle += this.angleSpeed;

      if (this.isBurst) {
        this.opacity -= this.fadeSpeed;
        return this.opacity > 0;
      } else {
        if (this.y < -40) {
          this.reset(false);
        }
        return true;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.type === 'heart') {
        ctx.fillStyle = `${this.color} ${this.opacity})`;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 'petal') {
        ctx.fillStyle = `rgba(255, 143, 163, ${this.opacity * 0.85})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.45, this.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(245, 208, 160, ${this.opacity * 0.9})`;
        const spikes = 4;
        const outerRadius = this.size * 0.6;
        const innerRadius = this.size * 0.2;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const a = (i * Math.PI) / spikes;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_AMBIENT; i++) {
    const p = new AmbientParticle();
    p.y = Math.random() * height;
    ambientParticles.push(p);
  }

  function spawnBurstAt(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      ambientParticles.push(new AmbientParticle(true, x, y));
    }
  }

  function animateAmbient() {
    ctx.clearRect(0, 0, width, height);

    for (let i = ambientParticles.length - 1; i >= 0; i--) {
      const p = ambientParticles[i];
      const isAlive = p.update();
      if (isAlive) {
        p.draw();
      } else {
        ambientParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateAmbient);
  }
  requestAnimationFrame(animateAmbient);

  // Soft touch heart sparkles
  window.addEventListener('pointerdown', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
      spawnBurstAt(e.clientX, e.clientY, 8);
    }
  });

  // ---------------- Stage Transition Helper ----------------
  function transitionStage(hideEl, showEl, callback) {
    hideEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    hideEl.style.opacity = '0';
    hideEl.style.transform = 'scale(0.96) translateY(-10px)';

    setTimeout(() => {
      hideEl.classList.remove('active');
      hideEl.classList.add('hidden');
      hideEl.style.opacity = '';
      hideEl.style.transform = '';

      showEl.classList.remove('hidden');
      showEl.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (callback) callback();
    }, 600);
  }

  // ---------------- STAGE 1 & 2: Password Validation & Cinematic Envelope ----------------
  function validatePassword() {
    const entered = (passwordInput.value || '').trim();
    if (!entered) return;

    if (CORRECT_PASSWORDS.includes(entered)) {
      handleSuccessUnlock();
    } else {
      handleIncorrectPassword();
    }
  }

  function handleIncorrectPassword() {
    errorMessage.classList.add('visible');
    passwordCard.classList.remove('shake');
    void passwordCard.offsetWidth;
    passwordCard.classList.add('shake');
    passwordInput.focus();

    const rect = passwordCard.getBoundingClientRect();
    spawnBurstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
  }

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validatePassword();
  });

  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validatePassword();
    } else {
      if (errorMessage.classList.contains('visible')) {
        errorMessage.classList.remove('visible');
      }
    }
  });

  // Clicking wax seal prompts input or validates
  waxSeal.addEventListener('click', () => {
    if (!isEnvelopeOpened) {
      if (passwordInput.value) {
        validatePassword();
      } else {
        passwordInput.focus();
        spawnBurstAt(window.innerWidth / 2, window.innerHeight * 0.38, 8);
      }
    }
  });

  // 3. CINEMATIC ENVELOPE OPENING
  function handleSuccessUnlock() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;
    currentStage = 2;

    errorMessage.classList.remove('visible');
    passwordInput.blur();

    // 1. Gently blur and dim the background
    if (cinematicOverlay) {
      cinematicOverlay.classList.add('active');
    }

    // 2. Start Cinnamon Girl by Lana Del Rey immediately at this moment
    startSoundtrack();

    // 3. Make the envelope glow softly & gently shake
    envelope.classList.add('cinematic-glow', 'gentle-shake');

    // 4. Animate the heart seal
    waxSeal.classList.add('glowing');

    const envRect = envelope.getBoundingClientRect();
    const centerX = envRect.left + envRect.width / 2;
    const centerY = envRect.top + envRect.height / 2;
    spawnBurstAt(centerX, centerY, 20);

    // Fade out password card
    passwordCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    passwordCard.style.opacity = '0';
    passwordCard.style.transform = 'scale(0.9) translateY(20px)';

    // 5. Open the envelope slowly and realistically
    setTimeout(() => {
      envelope.classList.remove('gentle-shake');
      envelope.classList.add('opening');
      spawnBurstAt(centerX, centerY, 35);

      // 6. Transition smoothly into the birthday letter
      setTimeout(() => {
        if (cinematicOverlay) {
          cinematicOverlay.classList.remove('active');
        }
        transitionStage(stage1, stage3, () => {
          currentStage = 3;
          spawnBurstAt(window.innerWidth * 0.5, window.innerHeight * 0.3, 22);
          startStage3Typewriter();
        });
      }, 1400);

    }, 700);
  }

  // ---------------- 4. BIRTHDAY LETTER & ROSE GOLD NAME ----------------
  const STAGE_3_TOKENS_LINE_1 = [
    { text: "Happy birthday " },
    { text: "Manmony", className: "rose-gold-name" },
    { text: " ❤️" }
  ];
  const STAGE_3_LINE_2 = "I wish you a long life with me in happiness.";
  const STAGE_3_LINE_3 = "I love you so much, my princess. 💗";

  function startStage3Typewriter() {
    if (isTyping) return;
    isTyping = true;

    typewriterLine1.innerHTML = '';
    typewriterLine2.innerHTML = '';
    typewriterLine3.innerHTML = '';
    typewriterCursor1.classList.remove('finished');
    letterSignature.classList.remove('visible');

    // Type Line 1 with Rose Gold "Manmony"
    typeTokens(STAGE_3_TOKENS_LINE_1, typewriterLine1, typewriterCursor1, 65, () => {
      activeTypeTimeout = setTimeout(() => {
        // Type Line 2
        typeText(STAGE_3_LINE_2, typewriterLine2, typewriterCursor1, 45, () => {
          activeTypeTimeout = setTimeout(() => {
            // Type Line 3
            typeText(STAGE_3_LINE_3, typewriterLine3, typewriterCursor1, 55, () => {
              activeTypeTimeout = setTimeout(() => {
                typewriterCursor1.classList.add('finished');
                isTyping = false;

                // Reveal elegant signature
                letterSignature.classList.remove('hidden');
                letterSignature.classList.add('visible');
                spawnBurstAt(window.innerWidth / 2, window.innerHeight * 0.72, 16);

                // Auto-transition to Stage 4 after message is read (2.2 seconds pause)
                activeTypeTimeout = setTimeout(() => {
                  transitionStage(stage3, stage4, () => {
                    currentStage = 4;
                    spawnBurstAt(window.innerWidth * 0.5, window.innerHeight * 0.35, 20);
                    startStage4Typewriter();
                  });
                }, 2200);
              }, 400);
            });
          }, 450);
        });
      }, 400);
    });
  }

  // Tokenized Typewriter for formatted text (Rose Gold Name)
  function typeTokens(tokens, targetElement, cursorElement, speed, onComplete) {
    let tokenIdx = 0;
    let charIdx = 0;
    let currentSpan = null;

    targetElement.appendChild(cursorElement);

    function nextTokenChar() {
      if (!isTyping) return;
      if (tokenIdx >= tokens.length) {
        if (onComplete) onComplete();
        return;
      }

      const token = tokens[tokenIdx];
      if (charIdx === 0) {
        if (token.className) {
          currentSpan = document.createElement('span');
          currentSpan.className = token.className;
          targetElement.insertBefore(currentSpan, cursorElement);
        } else {
          currentSpan = null;
        }
      }

      const chars = Array.from(token.text);
      if (charIdx < chars.length) {
        const textNode = document.createTextNode(chars[charIdx]);
        if (currentSpan) {
          currentSpan.appendChild(textNode);
        } else {
          targetElement.insertBefore(textNode, cursorElement);
        }
        charIdx++;
        const c = chars[charIdx - 1];
        const extraDelay = (c === ',' || c === '.') ? 200 : 0;
        activeTypeTimeout = setTimeout(nextTokenChar, speed + extraDelay);
      } else {
        tokenIdx++;
        charIdx = 0;
        activeTypeTimeout = setTimeout(nextTokenChar, 80);
      }
    }

    nextTokenChar();
  }

  // Plain Text Typewriter
  function typeText(text, targetElement, cursorElement, speed, onComplete) {
    let index = 0;
    const chars = Array.from(text);

    targetElement.appendChild(cursorElement);

    function nextChar() {
      if (!isTyping) return;

      if (index < chars.length) {
        const textNode = document.createTextNode(chars[index]);
        targetElement.insertBefore(textNode, cursorElement);
        index++;

        const currentChar = chars[index - 1];
        const extraDelay = (currentChar === ',' || currentChar === '.') ? 220 : 0;

        activeTypeTimeout = setTimeout(nextChar, speed + extraDelay);
      } else {
        if (onComplete) onComplete();
      }
    }

    nextChar();
  }

  // Allow clicking letter to instant complete typing
  letterCard.addEventListener('click', () => {
    if (isTyping && currentStage === 3) {
      isTyping = false;
      if (activeTypeTimeout) {
        clearTimeout(activeTypeTimeout);
        activeTypeTimeout = null;
      }
      typewriterLine1.innerHTML = 'Happy birthday <span class="rose-gold-name">Manmony</span> ❤️';
      typewriterLine2.textContent = STAGE_3_LINE_2;
      typewriterLine3.textContent = STAGE_3_LINE_3;
      typewriterCursor1.classList.add('finished');
      letterSignature.classList.remove('hidden');
      letterSignature.classList.add('visible');
      spawnBurstAt(window.innerWidth / 2, window.innerHeight * 0.5, 15);

      // Auto-transition to Stage 4 after reading pause
      setTimeout(() => {
        transitionStage(stage3, stage4, () => {
          currentStage = 4;
          spawnBurstAt(window.innerWidth * 0.5, window.innerHeight * 0.35, 20);
          startStage4Typewriter();
        });
      }, 2200);
    }
  });

  // ---------------- 5. ONE MORE SURPRISE TYPEWRITER ----------------
  const STAGE_4_LINE_1 = "You are my favorite person, my sweetest blessing, and the most beautiful part of my life.";
  const STAGE_4_LINE_2 = "I hope every birthday of yours is as special as you are to me.";
  const STAGE_4_LINE_3 = "I wish I could make every moment of your life as beautiful as you make mine. ❤️";

  function startStage4Typewriter() {
    if (isTyping) return;
    isTyping = true;

    surpriseLine1.innerHTML = '';
    surpriseLine2.innerHTML = '';
    surpriseLine3.innerHTML = '';
    typewriterCursor2.classList.remove('finished');
    stage4Action.classList.remove('visible');
    stage4Action.classList.add('hidden');

    typeText(STAGE_4_LINE_1, surpriseLine1, typewriterCursor2, 45, () => {
      activeTypeTimeout = setTimeout(() => {
        typeText(STAGE_4_LINE_2, surpriseLine2, typewriterCursor2, 45, () => {
          activeTypeTimeout = setTimeout(() => {
            typeText(STAGE_4_LINE_3, surpriseLine3, typewriterCursor2, 50, () => {
              activeTypeTimeout = setTimeout(() => {
                typewriterCursor2.classList.add('finished');
                isTyping = false;

                // Reveal Action Button to Memories Scene: "Open your gift 🎁"
                stage4Action.classList.remove('hidden');
                void stage4Action.offsetWidth;
                stage4Action.classList.add('visible');
                spawnBurstAt(window.innerWidth / 2, window.innerHeight * 0.75, 20);
              }, 400);
            });
          }, 450);
        });
      }, 400);
    });
  }

  // Allow clicking surprise card to instant complete typing
  surpriseLoveCard.addEventListener('click', () => {
    if (isTyping && currentStage === 4) {
      isTyping = false;
      if (activeTypeTimeout) {
        clearTimeout(activeTypeTimeout);
        activeTypeTimeout = null;
      }
      surpriseLine1.textContent = STAGE_4_LINE_1;
      surpriseLine2.textContent = STAGE_4_LINE_2;
      surpriseLine3.textContent = STAGE_4_LINE_3;
      typewriterCursor2.classList.add('finished');
      stage4Action.classList.remove('hidden');
      stage4Action.classList.add('visible');
      spawnBurstAt(window.innerWidth / 2, window.innerHeight * 0.5, 15);
    }
  });

  // ---------------- 6. ADVANCE TO PHOTO MEMORIES SECTION ----------------
  toMemoriesBtn.addEventListener('click', () => {
    transitionStage(stage4, stageMemories, () => {
      currentStage = 'memories';
      spawnBurstAt(window.innerWidth * 0.5, window.innerHeight * 0.3, 25);
      initMemoriesReveal();
    });
  });

  function initMemoriesReveal() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      memoryCards.forEach((card) => observer.observe(card));
    }

    // Gentle stagger reveal for visible cards upon entering
    setTimeout(() => {
      memoryCards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('revealed');
        }, idx * 260);
      });
    }, 200);
  }

  // ---------------- 7. ADVANCE TO ROMANTIC HACKER MATRIX SCENE ----------------
  toHackerBtn.addEventListener('click', () => {
    transitionStage(stageMemories, stageHacker, () => {
      currentStage = 'hacker';
      spawnBurstAt(window.innerWidth * 0.5, window.innerHeight * 0.35, 25);
      initRomanticHackerExperience();
    });
  });

  // =========================================================================
  // 8. FULL-SCREEN ROMANTIC FALLING MATRIX RAIN & SEQUENTIAL TEXT ANIMATION
  // =========================================================================
  let matrixRainAnimId = null;
  let isMatrixRainActive = false;
  let matrixWordTimeout = null;
  let currentWordIdx = 0;

  // Exact word sequence specified by user:
  // "I" (1.5s) -> "LOVE" (1.5s) -> "YOU" (1.5s) -> "BABY" (3.0s, bigger & brighter glow) -> loop
  const ROMANTIC_WORDS = [
    { text: 'I', size: 'clamp(5.5rem, 20vw, 12rem)', duration: 1500, isBaby: false },
    { text: 'LOVE', size: 'clamp(4.6rem, 18vw, 11rem)', duration: 1500, isBaby: false },
    { text: 'YOU', size: 'clamp(4.6rem, 18vw, 11rem)', duration: 1500, isBaby: false },
    { text: 'BABY', size: 'clamp(5.5rem, 21vw, 13rem)', duration: 3000, isBaby: true }
  ];

  function initRomanticHackerExperience() {
    isMatrixRainActive = true;
    currentWordIdx = 0;

    // Start 60fps Vertical Falling Matrix Canvas
    startMatrixRain();

    // Start Sequential Text Animation: I -> LOVE -> YOU -> BABY -> Loop
    playWordSequence();
  }

  // ---------------- Canvas Vertical Falling Matrix Code ----------------
  function startMatrixRain() {
    if (!hackerCanvas) return;
    const ctx = hackerCanvas.getContext('2d');

    function resizeCanvas() {
      hackerCanvas.width = window.innerWidth;
      hackerCanvas.height = window.innerHeight;
    }
    resizeCanvas();

    const charList = 'ILOVEYOUBABYMANMONYHAPPYBIRTHDAY5122006♥❤✦✧'.split('');
    const fontSize = window.innerWidth < 600 ? 14 : 17;
    let cols = Math.floor(hackerCanvas.width / fontSize);

    // Each column has independent vertical position and speed for rich depth
    let drops = [];
    function resetDrops() {
      cols = Math.floor(hackerCanvas.width / fontSize);
      drops = [];
      for (let i = 0; i < cols; i++) {
        drops.push({
          y: Math.random() * -100,
          speed: Math.random() * 0.8 + 0.8, // Smooth, graceful falling speed
          length: Math.floor(Math.random() * 14) + 10,
          headChar: charList[Math.floor(Math.random() * charList.length)]
        });
      }
    }
    resetDrops();

    window.addEventListener('resize', () => {
      if (isMatrixRainActive) {
        resizeCanvas();
        resetDrops();
      }
    });

    function drawRain() {
      if (!isMatrixRainActive) return;

      // Dark translucent trail overlay (#070108 with 0.14 opacity)
      ctx.fillStyle = 'rgba(7, 1, 8, 0.14)';
      ctx.fillRect(0, 0, hackerCanvas.width, hackerCanvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;
        const currentY = Math.floor(drop.y) * fontSize;

        // Randomly mutate character occasionally
        if (Math.random() > 0.92) {
          drop.headChar = charList[Math.floor(Math.random() * charList.length)];
        }

        // Draw lead character (glowing white / luminous pink)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ff2a75';
        ctx.shadowBlur = 10;
        ctx.fillText(drop.headChar, x, currentY);

        // Draw body of the trail (vibrant neon pink & magenta)
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 6;
        for (let t = 1; t <= drop.length; t++) {
          const trailY = currentY - t * fontSize;
          if (trailY > 0 && trailY < hackerCanvas.height) {
            const alpha = 1 - t / drop.length;
            if (t <= 3) {
              ctx.fillStyle = `rgba(255, 42, 117, ${alpha})`;
            } else if (t <= 8) {
              ctx.fillStyle = `rgba(255, 117, 143, ${alpha * 0.9})`;
            } else {
              ctx.fillStyle = `rgba(180, 15, 65, ${alpha * 0.7})`;
            }
            const trailChar = charList[(i + t) % charList.length];
            ctx.fillText(trailChar, x, trailY);
          }
        }
        ctx.shadowBlur = 0; // Reset blur for performance

        // Move drop vertically
        drop.y += drop.speed;

        // Reset drop when past bottom
        if (drop.y * fontSize - drop.length * fontSize > hackerCanvas.height) {
          drop.y = Math.random() * -30;
          drop.speed = Math.random() * 0.8 + 0.8;
          drop.length = Math.floor(Math.random() * 14) + 10;
        }
      }

      matrixRainAnimId = requestAnimationFrame(drawRain);
    }

    if (matrixRainAnimId) cancelAnimationFrame(matrixRainAnimId);
    drawRain();
  }

  // ---------------- Sequential Text Animation Engine ----------------
  function playWordSequence() {
    if (!isMatrixRainActive || !matrixText) return;

    const currentWord = ROMANTIC_WORDS[currentWordIdx];

    // Configure text and styling
    matrixText.textContent = currentWord.text;
    matrixText.style.fontSize = currentWord.size;

    if (currentWord.isBaby) {
      matrixText.classList.add('word-baby');
    } else {
      matrixText.classList.remove('word-baby');
    }

    // Trigger Scale-up and Fade-in
    matrixText.classList.remove('fade-out');
    void matrixText.offsetWidth; // Force reflow
    matrixText.classList.add('visible');

    // Subtle romantic particle burst on word reveal
    spawnBurstAt(window.innerWidth / 2, window.innerHeight / 2, currentWord.isBaby ? 24 : 14);

    // Keep word visible for its specified duration (1.5s for I/LOVE/YOU, 3.0s for BABY)
    matrixWordTimeout = setTimeout(() => {
      // Trigger Smooth Fade-out with slight zoom
      matrixText.classList.remove('visible');
      matrixText.classList.add('fade-out');

      // After 380ms fade-out completes, trigger next word
      setTimeout(() => {
        matrixText.classList.remove('fade-out');
        currentWordIdx = (currentWordIdx + 1) % ROMANTIC_WORDS.length; // Infinite restart from "I"
        playWordSequence();
      }, 380);

    }, currentWord.duration);
  }

  // Allow double-click or tap on hacker screen to transition to final scene if desired
  stageHacker.addEventListener('dblclick', () => {
    isMatrixRainActive = false;
    if (matrixRainAnimId) cancelAnimationFrame(matrixRainAnimId);
    if (matrixWordTimeout) clearTimeout(matrixWordTimeout);

    transitionStage(stageHacker, stage5, () => {
      currentStage = 5;
      isStage5Celebration = true;
      document.body.classList.add('stage-5-active');
      spawnBurstAt(window.innerWidth * 0.3, window.innerHeight * 0.35, 25);
      spawnBurstAt(window.innerWidth * 0.7, window.innerHeight * 0.35, 25);
      spawnBurstAt(window.innerWidth * 0.5, window.innerHeight * 0.5, 30);
    });
  });

  // ---------------- Prevent Accidental Reloads during Surprise ----------------
  window.addEventListener('beforeunload', (e) => {
    if (currentStage >= 2) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();
