(function () {
  function createDinoRunner(hostEl, options) {
    if (!hostEl) {
      throw new Error("createDinoRunner: host element is required.");
    }

    var opts = options || {};
    var defaultSprites = {
      playerIdleSpriteSrc: "./sprites/player-idle.png",
      playerRun1SpriteSrc: "./sprites/player-run-1.png",
      playerRun2SpriteSrc: "./sprites/player-run-2.png",
      obstacleSpriteSrc: "./sprites/obstacle.png",
      obstacle2SpriteSrc: "./sprites/obstacle2.png",
      obstacle3SpriteSrc: "./sprites/obstacle3.png",
      obstacle4SpriteSrc: "./sprites/obstacle4.png",
      backgroundSrc: "./sprites/background.png"
    };

    const title = opts.title || "Dino Runner";
    const bestKey = opts.bestScoreKey || "dino_best_score";
    const spriteOptions = {
      playerIdleSpriteSrc: opts.playerIdleSpriteSrc || defaultSprites.playerIdleSpriteSrc,
      playerRun1SpriteSrc: opts.playerRun1SpriteSrc || defaultSprites.playerRun1SpriteSrc,
      playerRun2SpriteSrc: opts.playerRun2SpriteSrc || defaultSprites.playerRun2SpriteSrc,
      obstacleSpriteSrc: opts.obstacleSpriteSrc || defaultSprites.obstacleSpriteSrc,
      obstacle2SpriteSrc: opts.obstacle2SpriteSrc || defaultSprites.obstacle2SpriteSrc,
      obstacle3SpriteSrc: opts.obstacle3SpriteSrc || defaultSprites.obstacle3SpriteSrc,
      obstacle4SpriteSrc: opts.obstacle4SpriteSrc || defaultSprites.obstacle4SpriteSrc
    };
    if (opts.playerSpriteSrc) {
      spriteOptions.playerIdleSpriteSrc = opts.playerSpriteSrc;
      if (!opts.playerRun1SpriteSrc) spriteOptions.playerRun1SpriteSrc = opts.playerSpriteSrc;
      if (!opts.playerRun2SpriteSrc) spriteOptions.playerRun2SpriteSrc = opts.playerSpriteSrc;
    }

    hostEl.innerHTML = [
      '<section class="dino-runner">',
      '  <div class="dino-game-shell">',
      '    <div class="dino-canvas-wrap">',
      '      <div class="dino-hud">',
      '        <div>\u2764\uFE0F Cora\u00e7\u00f5es: <span data-role="heartsText">0</span></div>',
      '        <div>Score: <span data-role="scoreText">0</span> &nbsp;|&nbsp; Best: <span data-role="bestText">0</span></div>',
      '      </div>',
      '      <canvas class="dino-canvas" width="960" height="360" aria-label="Dino runner game"></canvas>',
      '      <div class="dino-overlay" data-role="overlay">',
      '        <div class="dino-card">',
      '          <h1 class="dino-title">SALTA PRESSINHAS</h1>',
      '          <p class="dino-subtitle">Faz o teu caminho evitando os Pressinhas. Os cora\u00e7\u00f5es de amor dar-te-\u00e3o for\u00e7a para continuar! Consegues chegar ao fim?</p>',
      '          <button class="dino-start-btn" type="button" data-role="startBtn">Come\u00e7ar</button>',
      '          <div class="dino-hint">Controlos: Espa\u00e7o / Seta para Cima / Toca / Clica</div>',
      "        </div>",
      "      </div>",
      '      <button class="dino-mute-btn" type="button" data-role="muteBtn">\uD83D\uDD0A</button>',
      "    </div>",
      "  </div>",
      "</section>"
    ].join("");

    const root = hostEl.querySelector(".dino-runner");
    const canvas = root.querySelector(".dino-canvas");
    const ctx = canvas.getContext("2d");
    const startOverlay = root.querySelector('[data-role="overlay"]');
    const startBtn = root.querySelector('[data-role="startBtn"]');
    const scoreText = root.querySelector('[data-role="scoreText"]');
    const heartsText = root.querySelector('[data-role="heartsText"]');
    const bestText = root.querySelector('[data-role="bestText"]');
    const muteBtn = root.querySelector('[data-role="muteBtn"]');
    if (opts.title) root.querySelector(".dino-title").textContent = title;

    var music = new Audio("./music.mp3");
    music.loop = true;
    var isMuted = false;

    muteBtn.addEventListener("click", function () {
      isMuted = !isMuted;
      music.muted = isMuted;
      muteBtn.textContent = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    });

    const WORLD = {
      width: canvas.width,
      height: canvas.height,
      groundY: 290
    };

    const dino = {
      x: 96,
      y: 0,
      w: 62,
      h: 72,
      velY: 0,
      gravity: 0.9,
      jumpPower: -18
    };
    dino.y = WORLD.groundY - dino.h;

    let obstacles = [];
    let hearts = [];
    let heartsCollected = 0;
    let heartSpawnTimer = 0;
    let heartSpawnNextAt = 180 + Math.random() * 200;
    let score = 0;
    let best = Number(localStorage.getItem(bestKey) || 0);
    let speed = 7.5;
    let spawnTimer = 0;
    let spawnNextAt = randomSpawnInterval();
    let isPlaying = false;
    let isGameOver = false;
    let rafId = null;
    let lastTs = 0;
    const playerSprites = {
      idle: null,
      run1: null,
      run2: null
    };
    let obstacleSprites = [null, null, null, null];
    let backgroundSprite = null;
    let bgScrollX = 0;
    let runFrameElapsedMs = 0;
    let runFrameIndex = 0;

    function loadSprite(src, onReady) {
      if (!src) {
        onReady(null);
        return;
      }
      const img = new Image();
      img.onload = function onLoad() {
        onReady(img);
      };
      img.onerror = function onError() {
        onReady(null);
      };
      img.src = src;
    }

    function applySprites(newSprites) {
      const legacyPlayerSrc = newSprites && newSprites.playerSpriteSrc ? newSprites.playerSpriteSrc : "";
      const nextIdleSrc =
        newSprites && newSprites.playerIdleSpriteSrc ? newSprites.playerIdleSpriteSrc : legacyPlayerSrc;
      const nextRun1Src =
        newSprites && newSprites.playerRun1SpriteSrc ? newSprites.playerRun1SpriteSrc : legacyPlayerSrc;
      const nextRun2Src =
        newSprites && newSprites.playerRun2SpriteSrc ? newSprites.playerRun2SpriteSrc : legacyPlayerSrc;
      const nextObstacleSrc = newSprites && newSprites.obstacleSpriteSrc ? newSprites.obstacleSpriteSrc : "";
      const nextObstacle2Src = newSprites && newSprites.obstacle2SpriteSrc ? newSprites.obstacle2SpriteSrc : "";
      const nextObstacle3Src = newSprites && newSprites.obstacle3SpriteSrc ? newSprites.obstacle3SpriteSrc : "";
      const nextObstacle4Src = newSprites && newSprites.obstacle4SpriteSrc ? newSprites.obstacle4SpriteSrc : "";
      spriteOptions.playerIdleSpriteSrc = nextIdleSrc;
      spriteOptions.playerRun1SpriteSrc = nextRun1Src;
      spriteOptions.playerRun2SpriteSrc = nextRun2Src;
      spriteOptions.obstacleSpriteSrc = nextObstacleSrc;
      spriteOptions.obstacle2SpriteSrc = nextObstacle2Src;
      spriteOptions.obstacle3SpriteSrc = nextObstacle3Src;
      spriteOptions.obstacle4SpriteSrc = nextObstacle4Src;

      loadSprite(nextIdleSrc, function onIdleLoaded(img) {
        playerSprites.idle = img;
      });
      loadSprite(nextRun1Src, function onRun1Loaded(img) {
        playerSprites.run1 = img;
      });
      loadSprite(nextRun2Src, function onRun2Loaded(img) {
        playerSprites.run2 = img;
      });
      loadSprite(nextObstacleSrc, function (img) {
        obstacleSprites[0] = img;
      });
      loadSprite(nextObstacle2Src, function (img) {
        obstacleSprites[1] = img;
      });
      loadSprite(nextObstacle3Src, function (img) {
        obstacleSprites[2] = img;
      });
      loadSprite(nextObstacle4Src, function (img) {
        obstacleSprites[3] = img;
      });
      var nextBgSrc = newSprites && newSprites.backgroundSrc ? newSprites.backgroundSrc : defaultSprites.backgroundSrc;
      loadSprite(nextBgSrc, function (img) {
        backgroundSprite = img;
      });
    }

    bestText.textContent = String(best);

    function randomSpawnInterval() {
      return 58 + Math.random() * 46;
    }

    function resetRun() {
      obstacles = [];
      hearts = [];
      heartsCollected = 0;
      heartSpawnTimer = 0;
      heartSpawnNextAt = 180 + Math.random() * 200;
      score = 0;
      speed = 7.5;
      spawnTimer = 0;
      spawnNextAt = randomSpawnInterval();
      dino.y = WORLD.groundY - dino.h;
      dino.velY = 0;
      isGameOver = false;
      runFrameElapsedMs = 0;
      runFrameIndex = 0;
      updateHud();
    }

    function updateHud() {
      scoreText.textContent = String(Math.floor(score));
      bestText.textContent = String(best);
      heartsText.textContent = String(heartsCollected);
    }

    function startGame() {
      resetRun();
      isPlaying = true;
      startOverlay.classList.add("hidden");
      lastTs = 0;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
      music.currentTime = 0;
      music.play().catch(function () {});
    }

    function gameOver() {
      isGameOver = true;
      isPlaying = false;
      music.pause();
      if (score > best) {
        best = Math.floor(score);
        localStorage.setItem(bestKey, String(best));
      }
      updateHud();
      startBtn.textContent = "Recome\u00e7ar";
      startOverlay.classList.remove("hidden");
    }

    function pickObstacleType() {
      var roll = Math.random();
      if (roll < 0.30) return 0;
      if (roll < 0.60) return 1;
      if (roll < 0.75) return 2;
      return 3;
    }

    function spawnObstacle() {
      var type = pickObstacleType();
      var sprite = obstacleSprites[type];
      var obstacleScale = 0.6;
      var fallbackW = [190, 190, 240, 190];
      var fallbackH = [56, 56, 56, 56];
      var width = (sprite ? sprite.naturalWidth : fallbackW[type]) * obstacleScale;
      var height = (sprite ? sprite.naturalHeight : fallbackH[type]) * obstacleScale;
      obstacles.push({
        x: WORLD.width + 20,
        y: WORLD.groundY - height,
        w: width,
        h: height,
        type: type,
        bodyColor: ["#d54e4e", "#4e76d5", "#3a9e5c", "#e8b630"][type]
      });
    }

    function spawnHeart() {
      var size = 28;
      var yVariant = Math.random();
      var y;
      if (yVariant < 0.5) {
        y = WORLD.groundY - size - 4;
      } else {
        y = WORLD.groundY - size - 50 - Math.random() * 60;
      }
      hearts.push({ x: WORLD.width + 10, y: y, w: size, h: size });
    }

    function jump() {
      if (!isPlaying || isGameOver) {
        return;
      }
      const onGround = dino.y >= WORLD.groundY - dino.h - 0.5;
      if (onGround) {
        dino.velY = dino.jumpPower;
      }
    }

    function collides(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }

    function update(deltaNorm) {
      dino.velY += dino.gravity * deltaNorm;
      dino.y += dino.velY * deltaNorm;

      if (dino.y > WORLD.groundY - dino.h) {
        dino.y = WORLD.groundY - dino.h;
        dino.velY = 0;
      }

      speed += 0.0023 * deltaNorm;
      score += 0.17 * deltaNorm;
      if (backgroundSprite) {
        bgScrollX = (bgScrollX + speed * 0.5 * deltaNorm) % backgroundSprite.naturalWidth;
      }
      runFrameElapsedMs += deltaNorm * 16.6667;
      if (runFrameElapsedMs >= 120) {
        runFrameElapsedMs = 0;
        runFrameIndex = runFrameIndex === 0 ? 1 : 0;
      }
      spawnTimer += 1 * deltaNorm;
      if (spawnTimer >= spawnNextAt) {
        spawnObstacle();
        spawnTimer = 0;
        spawnNextAt = Math.max(36, randomSpawnInterval() - speed * 1.9);
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed * deltaNorm;
        if (obstacles[i].x + obstacles[i].w < -10) {
          obstacles.splice(i, 1);
        }
      }

      heartSpawnTimer += 1 * deltaNorm;
      if (heartSpawnTimer >= heartSpawnNextAt) {
        spawnHeart();
        heartSpawnTimer = 0;
        heartSpawnNextAt = 180 + Math.random() * 200;
      }

      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].x -= speed * deltaNorm;
        if (hearts[i].x + hearts[i].w < -10) {
          hearts.splice(i, 1);
        }
      }

      const dinoBox = {
        x: dino.x + dino.w * 0.18,
        y: dino.y + dino.h * 0.1,
        w: dino.w * 0.64,
        h: dino.h * 0.82
      };

      for (let i = hearts.length - 1; i >= 0; i--) {
        if (collides(dinoBox, hearts[i])) {
          heartsCollected++;
          hearts.splice(i, 1);
        }
      }

      for (let i = 0; i < obstacles.length; i += 1) {
        if (collides(dinoBox, obstacles[i])) {
          gameOver();
          return;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, WORLD.width, WORLD.height);

      if (backgroundSprite) {
        var bgW = backgroundSprite.naturalWidth;
        var bgH = backgroundSprite.naturalHeight;
        var scaleH = WORLD.groundY / bgH;
        var drawW = bgW * scaleH;
        var startX = -(bgScrollX * scaleH) % drawW;
        if (startX > 0) startX -= drawW;
        for (var bx = startX; bx < WORLD.width; bx += drawW) {
          ctx.drawImage(backgroundSprite, bx, 0, drawW, WORLD.groundY);
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      } else {
        var cloudColor = "#d8deef";
        ctx.fillStyle = cloudColor;
        ctx.fillRect(640, 58, 90, 18);
        ctx.fillRect(170, 82, 72, 15);
        ctx.fillRect(780, 122, 64, 14);
      }

      ctx.strokeStyle = "#c8cfdf";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, WORLD.groundY + 0.5);
      ctx.lineTo(WORLD.width, WORLD.groundY + 0.5);
      ctx.stroke();

      ctx.fillStyle = "rgba(68, 75, 90, 0.22)";
      for (let x = -((score * 2) % 34); x < WORLD.width; x += 34) {
        ctx.fillRect(x, WORLD.groundY + 8, 18, 3);
      }

      const animatedSprite =
        runFrameIndex === 0 ? (playerSprites.run1 || playerSprites.idle) : (playerSprites.run2 || playerSprites.idle);
      const activePlayerSprite = isPlaying && !isGameOver ? animatedSprite : playerSprites.idle;

      if (activePlayerSprite) {
        ctx.drawImage(activePlayerSprite, dino.x, dino.y, dino.w, dino.h);
      } else {
        ctx.fillStyle = getComputedStyle(root).getPropertyValue("--dino").trim();
        ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
        ctx.fillStyle = "#f6f7fb";
        ctx.fillRect(dino.x + dino.w - 11, dino.y + 10, 7, 7);
      }

      for (let i = 0; i < hearts.length; i += 1) {
        var h = hearts[i];
        var cx = h.x + h.w / 2;
        var cy = h.y + h.h / 2;
        var s = h.w / 2;
        ctx.fillStyle = "#e8344e";
        ctx.beginPath();
        ctx.moveTo(cx, cy + s * 0.6);
        ctx.bezierCurveTo(cx - s * 0.02, cy + s * 0.3, cx - s * 0.7, cy + s * 0.2, cx - s * 0.9, cy - s * 0.1);
        ctx.bezierCurveTo(cx - s * 1.1, cy - s * 0.6, cx - s * 0.6, cy - s * 1.0, cx, cy - s * 0.5);
        ctx.bezierCurveTo(cx + s * 0.6, cy - s * 1.0, cx + s * 1.1, cy - s * 0.6, cx + s * 0.9, cy - s * 0.1);
        ctx.bezierCurveTo(cx + s * 0.7, cy + s * 0.2, cx + s * 0.02, cy + s * 0.3, cx, cy + s * 0.6);
        ctx.fill();
      }

      for (let i = 0; i < obstacles.length; i += 1) {
        const obs = obstacles[i];
        var obsSprite = obstacleSprites[obs.type != null ? obs.type : 0];
        if (obsSprite) {
          ctx.drawImage(obsSprite, obs.x, obs.y, obs.w, obs.h);
        } else {
          // Fallback obstacle drawing: larger side-view car coming from right.
          const bodyY = obs.y + obs.h * 0.3;
          const cabinY = obs.y + obs.h * 0.08;
          const wheelRadius = Math.max(4, obs.h * 0.16);

          ctx.fillStyle = obs.bodyColor || "#d54e4e";
          ctx.fillRect(obs.x, bodyY, obs.w, obs.h * 0.58);
          ctx.fillRect(obs.x + obs.w * 0.18, cabinY, obs.w * 0.52, obs.h * 0.34);

          ctx.fillStyle = "#b9d6ff";
          ctx.fillRect(obs.x + obs.w * 0.24, cabinY + obs.h * 0.05, obs.w * 0.2, obs.h * 0.18);
          ctx.fillRect(obs.x + obs.w * 0.47, cabinY + obs.h * 0.05, obs.w * 0.18, obs.h * 0.18);

          ctx.fillStyle = "#1d222f";
          ctx.beginPath();
          ctx.arc(obs.x + obs.w * 0.24, obs.y + obs.h * 0.88, wheelRadius, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.w * 0.76, obs.y + obs.h * 0.88, wheelRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#f4f6fc";
          ctx.fillRect(obs.x + obs.w * 0.02, bodyY + obs.h * 0.17, obs.w * 0.06, obs.h * 0.09);
          ctx.fillRect(obs.x + obs.w * 0.92, bodyY + obs.h * 0.17, obs.w * 0.06, obs.h * 0.09);
        }
      }
    }

    function loop(ts) {
      if (!isPlaying) {
        return;
      }
      if (!lastTs) {
        lastTs = ts;
      }

      const dt = ts - lastTs;
      lastTs = ts;
      const deltaNorm = Math.min(2.1, dt / 16.6667);

      update(deltaNorm);
      draw();
      updateHud();

      if (isPlaying) {
        rafId = requestAnimationFrame(loop);
      }
    }

    function handleJumpInput(event) {
      if (event.type === "keydown") {
        const key = event.key;
        if (key !== " " && key !== "ArrowUp" && key !== "Up" && key !== "w" && key !== "W") {
          return;
        }
        event.preventDefault();
      }
      jump();
    }

    startBtn.addEventListener("click", startGame);
    window.addEventListener("keydown", handleJumpInput, { passive: false });
    canvas.addEventListener("pointerdown", handleJumpInput);
    canvas.addEventListener("touchstart", handleJumpInput, { passive: true });

    draw();
    updateHud();
    applySprites(spriteOptions);

    return {
      start: startGame,
      setSprites: function setSprites(newSprites) {
        applySprites(newSprites || {});
      },
      destroy: function destroy() {
        cancelAnimationFrame(rafId);
        music.pause();
        music.src = "";
        window.removeEventListener("keydown", handleJumpInput);
        startBtn.removeEventListener("click", startGame);
        canvas.removeEventListener("pointerdown", handleJumpInput);
        canvas.removeEventListener("touchstart", handleJumpInput);
        hostEl.innerHTML = "";
      }
    };
  }

  window.createDinoRunner = createDinoRunner;
})();
