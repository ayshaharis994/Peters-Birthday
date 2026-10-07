/* ==========================================================================
   A SPECIAL BIRTHDAY WORLD — BURGUNDY & BEIGE JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------------------------
     1. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("show");
      menuToggle.textContent = navMenu.classList.contains("show") ? "✕" : "☰";
    });

    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        menuToggle.textContent = "☰";
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. DANDELIONS BACKGROUND MUSIC PLAYER (Ruth B — Dandelions)
     -------------------------------------------------------------------------- */
  const audioBtn = document.getElementById("audioToggleBtn");
  let bgAudio = document.getElementById("bgAudio");

  if (!bgAudio) {
    bgAudio = document.createElement("audio");
    bgAudio.id = "bgAudio";
    bgAudio.src = "audio/dandelions.mp3";
    bgAudio.loop = true;
    bgAudio.preload = "auto";
    document.body.appendChild(bgAudio);
  }

  // Restore playback state across page transitions
  const savedPlayback = sessionStorage.getItem("dandelions_playing");
  const savedTime = sessionStorage.getItem("dandelions_time");

  if (savedTime && !isNaN(parseFloat(savedTime))) {
    bgAudio.currentTime = parseFloat(savedTime);
  }

  function updateAudioButtonState(isPlaying) {
    if (!audioBtn) return;
    const label = audioBtn.querySelector(".audio-label");
    if (isPlaying) {
      audioBtn.classList.add("playing");
      if (label) label.textContent = "Dandelions Playing 🎵";
    } else {
      audioBtn.classList.remove("playing");
      if (label) label.textContent = "Play Dandelions 🎵";
    }
  }

  if (savedPlayback === "true") {
    // Attempt auto-resume
    bgAudio.play().then(() => {
      updateAudioButtonState(true);
    }).catch(() => {
      // Browser blocked autoplay; wait for first interaction
      updateAudioButtonState(false);
    });
  }

  // Continuously record time to ensure smooth continuation across pages
  bgAudio.addEventListener("timeupdate", function () {
    sessionStorage.setItem("dandelions_time", bgAudio.currentTime);
  });

  if (audioBtn) {
    audioBtn.addEventListener("click", function () {
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          sessionStorage.setItem("dandelions_playing", "true");
          updateAudioButtonState(true);
        }).catch(err => {
          console.log("Audio play error:", err);
        });
      } else {
        bgAudio.pause();
        sessionStorage.setItem("dandelions_playing", "false");
        updateAudioButtonState(false);
      }
    });
  }

  // Also auto-start when clicking "Begin Celebration" or first user action if allowed
  document.addEventListener("click", function autoPlayOnce() {
    if (sessionStorage.getItem("dandelions_playing") === "true" && bgAudio.paused) {
      bgAudio.play().then(() => updateAudioButtonState(true)).catch(() => {});
    }
  }, { once: true });


  /* --------------------------------------------------------------------------
     3. WARM FLOATING DANDELIONS & AMBIENT SOFT BOKEH (Canvas)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById("starsCanvas") || document.getElementById("ambientCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dandelions = [];
    let bokehOrbs = [];

    window.addEventListener("resize", function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initAmbient();
    });

    function initAmbient() {
      // 1. Warm, soft, out-of-focus bokeh orbs (gentle candlelight atmosphere)
      bokehOrbs = [];
      const bokehColors = [
        "rgba(237, 216, 196, 0.045)", // warm beige
        "rgba(158, 42, 61, 0.055)",   // soft wine
        "rgba(223, 197, 173, 0.038)", // cashmere beige
        "rgba(122, 29, 44, 0.045)"    // deep rose burgundy
      ];
      for (let i = 0; i < 7; i++) {
        bokehOrbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 80 + 60,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.2,
          color: bokehColors[i % bokehColors.length]
        });
      }

      // 2. Soft, delicate dandelion seeds floating gently on a warm breeze
      dandelions = [];
      const seedCount = Math.min(22, Math.max(12, Math.floor(width / 75)));
      for (let i = 0; i < seedCount; i++) {
        dandelions.push({
          x: Math.random() * width,
          y: Math.random() * height,
          scale: Math.random() * 0.35 + 0.75,
          speedY: Math.random() * 0.45 + 0.35,
          swayAngle: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.012 + 0.007,
          swayRadius: Math.random() * 1.6 + 0.8,
          alpha: Math.random() * 0.32 + 0.25,
          filaments: Math.floor(Math.random() * 3) + 7
        });
      }
    }

    function renderAmbient() {
      ctx.clearRect(0, 0, width, height);

      // Render warm bokeh orbs first
      for (let b of bokehOrbs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = height + b.radius;
        if (b.y > height + b.radius) b.y = -b.radius;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render delicate floating dandelion seeds
      for (let d of dandelions) {
        d.y -= d.speedY;
        d.swayAngle += d.swaySpeed;
        const currentX = d.x + Math.sin(d.swayAngle) * (d.swayRadius * 12);

        if (d.y < -50) {
          d.y = height + 40;
          d.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, d.y);
        const tilt = Math.cos(d.swayAngle) * 0.15;
        ctx.rotate(tilt);

        const stemLen = 18 * d.scale;
        const filamentLen = 9 * d.scale;
        const tuftY = -stemLen;

        ctx.strokeStyle = `rgba(237, 216, 196, ${d.alpha})`;
        ctx.fillStyle = `rgba(247, 238, 228, ${d.alpha + 0.15})`;

        // Stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, tuftY);
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Seed body
        ctx.beginPath();
        ctx.ellipse(0, 0, 1 * d.scale, 2.2 * d.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Parachute tuft
        const fanSpread = Math.PI * 0.65;
        const startAngle = -Math.PI / 2 - fanSpread / 2;
        for (let f = 0; f < d.filaments; f++) {
          const angle = startAngle + (fanSpread / (d.filaments - 1)) * f;
          const fx = Math.cos(angle) * filamentLen;
          const fy = tuftY + Math.sin(angle) * filamentLen;

          ctx.beginPath();
          ctx.moveTo(0, tuftY);
          ctx.lineTo(fx, fy);
          ctx.lineWidth = 0.55;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(fx, fy, 0.75 * d.scale, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      requestAnimationFrame(renderAmbient);
    }

    initAmbient();
    renderAmbient();
  }

  /* --------------------------------------------------------------------------
     4. CANDLE & CAKE PAGE LOGIC (cake.html)
     -------------------------------------------------------------------------- */
  const candleWrapper = document.getElementById("candleWrapper");
  const candleFlame = document.getElementById("candleFlame");
  const candleSmoke = document.getElementById("candleSmoke");
  const candleCountdown = document.getElementById("candleCountdown");
  const candleCountdownTip = document.getElementById("candleCountdownTip");
  const startTimerBtn = document.getElementById("startTimerBtn");
  const blowCandleBtn = document.getElementById("blowCandleBtn");
  const relightCandleBtn = document.getElementById("relightCandleBtn");
  const candleScene = document.getElementById("candleScene");
  const cakeRevealContainer = document.getElementById("cakeRevealContainer");

  let isCandleLit = true;
  let countdownTimer = null;
  let countdownRunning = false;

  function blowOutCandle() {
    if (!isCandleLit) return;
    isCandleLit = false;
    countdownRunning = false;
    if (countdownTimer) clearInterval(countdownTimer);

    if (candleFlame) candleFlame.classList.add("extinguished");
    if (candleSmoke) {
      candleSmoke.classList.add("puffing");
      setTimeout(() => candleSmoke.classList.remove("puffing"), 2000);
    }

    if (candleCountdown) {
      candleCountdown.textContent = "WISH MADE! ✨";
      candleCountdown.style.fontSize = "1.8rem";
    }
    if (candleCountdownTip) {
      candleCountdownTip.textContent = "The candle is blown... Here comes your celebration!";
    }

    launchConfetti();

    // Smoothly transition from candle scene to Cake reveal
    setTimeout(() => {
      if (candleScene) candleScene.style.display = "none";
      if (cakeRevealContainer) {
        cakeRevealContainer.style.display = "block";
        cakeRevealContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 1200);
  }

  // Countdown timer logic
  if (startTimerBtn) {
    startTimerBtn.addEventListener("click", function () {
      if (countdownRunning || !isCandleLit) return;
      countdownRunning = true;
      let count = 3;

      if (candleCountdown) {
        candleCountdown.textContent = count;
        candleCountdown.classList.add("pulsing");
      }
      if (candleCountdownTip) {
        candleCountdownTip.textContent = "Close your eyes & think of your wish...";
      }

      countdownTimer = setInterval(() => {
        count--;
        if (candleCountdown) {
          candleCountdown.classList.remove("pulsing");
          void candleCountdown.offsetWidth;
          candleCountdown.classList.add("pulsing");
        }

        if (count > 0) {
          if (candleCountdown) candleCountdown.textContent = count;
          if (count === 2 && candleCountdownTip) {
            candleCountdownTip.textContent = "Hold that wish close to your heart...";
          } else if (count === 1 && candleCountdownTip) {
            candleCountdownTip.textContent = "Take a deep breath...";
          }
        } else if (count === 0) {
          if (candleCountdown) candleCountdown.textContent = "BLOW! 💨";
          if (candleCountdownTip) {
            candleCountdownTip.textContent = "Now blow out the candle!";
          }
          if (blowCandleBtn) {
            blowCandleBtn.style.animation = "pulse 0.8s infinite alternate";
          }
          clearInterval(countdownTimer);
        }
      }, 1000);
    });
  }

  if (candleWrapper) {
    candleWrapper.addEventListener("click", blowOutCandle);
  }
  if (blowCandleBtn) {
    blowCandleBtn.addEventListener("click", blowOutCandle);
  }

  if (relightCandleBtn) {
    relightCandleBtn.addEventListener("click", function () {
      isCandleLit = true;
      countdownRunning = false;
      if (candleFlame) candleFlame.classList.remove("extinguished");
      if (candleScene) candleScene.style.display = "block";
      if (cakeRevealContainer) cakeRevealContainer.style.display = "none";
      if (candleCountdown) {
        candleCountdown.textContent = "3";
        candleCountdown.style.fontSize = "3.6rem";
      }
      if (candleCountdownTip) {
        candleCountdownTip.textContent = "Click 'Start Countdown', think of your wish, and blow!";
      }
      candleScene.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Wish form submission
  const submitWishBtn = document.getElementById("submitWishBtn");
  const wishInputField = document.getElementById("wishInputField");
  const wishSentAlert = document.getElementById("wishSentAlert");

  if (submitWishBtn && wishInputField && wishSentAlert) {
    submitWishBtn.addEventListener("click", function () {
      const wishVal = wishInputField.value.trim();
      if (wishVal.length === 0) {
        wishSentAlert.textContent = "Your secret wish is sealed in your heart & the stars! 🤍";
      } else {
        wishSentAlert.textContent = `"${wishVal}" has been sent to the stars! May Allah answer it, Ameen. 🤍✨`;
      }
      wishSentAlert.style.display = "block";
      launchConfetti();
      wishInputField.value = "";
    });
  }

  /* --------------------------------------------------------------------------
     5. WISHES PAGE — RIBBON ACCORDION OPENING (wishes.html)
     -------------------------------------------------------------------------- */
  const wishCards = document.querySelectorAll(".wish-card");
  const toggleAllRibbonsBtn = document.getElementById("toggleAllRibbonsBtn");

  if (wishCards.length > 0) {
    wishCards.forEach(function (card) {
      card.addEventListener("click", function () {
        const isCurrentlyOpen = card.classList.contains("open");
        card.classList.toggle("open");

        const promptText = card.querySelector(".untie-prompt .action-text");
        if (promptText) {
          promptText.textContent = isCurrentlyOpen ? "Untie ribbon & open" : "Fold letter back";
        }
      });
    });

    if (toggleAllRibbonsBtn) {
      let allOpen = false;
      toggleAllRibbonsBtn.addEventListener("click", function () {
        allOpen = !allOpen;
        wishCards.forEach(card => {
          if (allOpen) {
            card.classList.add("open");
            const promptText = card.querySelector(".untie-prompt .action-text");
            if (promptText) promptText.textContent = "Fold letter back";
          } else {
            card.classList.remove("open");
            const promptText = card.querySelector(".untie-prompt .action-text");
            if (promptText) promptText.textContent = "Untie ribbon & open";
          }
        });
        toggleAllRibbonsBtn.textContent = allOpen ? "🎀 Fold All Letters" : "🎀 Untie All Ribbons";
        if (allOpen) launchConfetti();
      });
    }
  }

  /* --------------------------------------------------------------------------
     6. MEMORIES PAGE — POLAROID LIGHTBOX (memories.html)
     -------------------------------------------------------------------------- */
  const polaroidCards = document.querySelectorAll(".polaroid-card");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxText = document.getElementById("lightboxText");
  const lightboxClose = document.getElementById("lightboxClose");

  if (polaroidCards.length > 0 && lightboxModal) {
    polaroidCards.forEach(card => {
      card.addEventListener("click", function () {
        const img = card.querySelector("img");
        const title = card.querySelector(".polaroid-caption h3");
        const subtitle = card.querySelector(".polaroid-caption p");

        if (img && lightboxImage) {
          lightboxImage.src = img.src;
          lightboxImage.alt = img.alt || "Memory photo";
        }
        if (title && lightboxTitle) {
          lightboxTitle.textContent = title.textContent;
        }
        if (subtitle && lightboxText) {
          lightboxText.textContent = subtitle.textContent;
        }

        lightboxModal.classList.add("active");
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", function () {
        lightboxModal.classList.remove("active");
      });
    }

    lightboxModal.addEventListener("click", function (e) {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove("active");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
        lightboxModal.classList.remove("active");
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. CONFETTI BURST (WARM BURGUNDY & BEIGE PALETTE)
     -------------------------------------------------------------------------- */
  function launchConfetti() {
    let confCanvas = document.getElementById("confettiCanvas");
    if (!confCanvas) {
      confCanvas = document.createElement("canvas");
      confCanvas.id = "confettiCanvas";
      document.body.appendChild(confCanvas);
    }

    const cCtx = confCanvas.getContext("2d");
    let cWidth = (confCanvas.width = window.innerWidth);
    let cHeight = (confCanvas.height = window.innerHeight);

    // Warm Burgundy & Beige Confetti Palette
    const colors = ["#7a1d2c", "#9e2a3d", "#be3e54", "#edd8c4", "#fbf7f0", "#caa387"];
    const particles = [];
    const count = 95;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: cWidth / 2 + (Math.random() - 0.5) * 220,
        y: cHeight / 2 + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 1.2) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }

    let animationFrame;
    function updateConfetti() {
      cCtx.clearRect(0, 0, cWidth, cHeight);
      let aliveCount = 0;

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.009;

        if (p.alpha > 0) {
          aliveCount++;
          cCtx.save();
          cCtx.globalAlpha = Math.max(0, p.alpha);
          cCtx.translate(p.x, p.y);
          cCtx.rotate((p.rotation * Math.PI) / 180);
          cCtx.fillStyle = p.color;

          if (p.shape === "rect") {
            cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          } else {
            cCtx.beginPath();
            cCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            cCtx.fill();
          }

          cCtx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrame = requestAnimationFrame(updateConfetti);
      } else {
        cCtx.clearRect(0, 0, cWidth, cHeight);
        cancelAnimationFrame(animationFrame);
      }
    }

    updateConfetti();
  }

});
