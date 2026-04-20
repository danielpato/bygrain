(function () {
  function createDinoRunner(hostEl, options) {
    if (!hostEl) {
      throw new Error("createDinoRunner: host element is required.");
    }

    var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwv9VaeMU6T4wl1rBe6dzdlYHWGnkAZWptIIsMnSJZkHer9HL8r2vEERKzfmvu9Mr8_/exec";

    var opts = options || {};
    var defaultSprites = {
      playerIdleSpriteSrc: "./sprites/player-idle.png",
      playerRun1SpriteSrc: "./sprites/player-run-1.png",
      playerRun2SpriteSrc: "./sprites/player-run-2.png",
      obstacleSpriteSrc: "./sprites/obstacle.png",
      obstacle2SpriteSrc: "./sprites/obstacle2.png",
      obstacle3SpriteSrc: "./sprites/obstacle3.png",
      obstacle4SpriteSrc: "./sprites/obstacle4.png",
      backgroundSrc: "./sprites/background.png",
      skySrc: "./sprites/sky.png",
      planeSrc: "./sprites/plane.png",
      plane2Src: "./sprites/plane2.png",
      routerSrc: "./sprites/router.png",
      fibraSrc: "./sprites/fibra.png",
      fibradoIdleSpriteSrc: "./sprites/fibrado-idle.png",
      fibradoRun1SpriteSrc: "./sprites/fibrado-run-1.png",
      fibradoRun2SpriteSrc: "./sprites/fibrado-run-2.png",
      background0Src: "./sprites/BACKGROUND0.png"
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
      '        <div><img src="./sprites/router.png" width="14" height="14" style="vertical-align:middle;image-rendering:pixelated"> Routers WTF: <span data-role="heartsText">0</span> &nbsp;|&nbsp; <img src="./sprites/fibra.png" height="14" style="vertical-align:middle;image-rendering:pixelated;width:auto"> Fibra: <span data-role="vidasText">0</span></div>',
      '        <div>Pontos: <span data-role="scoreText">0</span> &nbsp;|&nbsp; Recorde: <span data-role="bestText">0</span></div>',
      '      </div>',
      '      <canvas class="dino-canvas" width="960" height="360" aria-label="Dino runner game"></canvas>',
      '      <div class="dino-overlay" data-role="overlay">',
      '        <div class="dino-card">',
      '          <img src="./sprites/splogo.png" class="dino-title" style="max-width:95%;max-height:35%;height:auto;object-fit:contain;display:block;margin:0 auto">',
      '          <p class="dino-subtitle">Faz o teu caminho evitando os Pressinhas.<br>Os Routers WTF dar-te-\u00e3o fibra para continuar!<br>Consegues chegar ao fim?</p>',
      '          <button class="dino-start-btn" type="button" data-role="startBtn">Come\u00e7ar</button>',
      '          <div class="dino-hint">Controlos: Espa\u00e7o / Seta para Cima / Toca / Clica</div>',
      "        </div>",
      "      </div>",
      '      <div class="dino-overlay hidden" data-role="winOverlay">',
      '        <div class="dino-win-layout">',
      '          <div class="dino-win-prizes-col">',
      '            <img class="dino-win-prize dino-float-1" src="./premios/poster.png" alt="Poster">',
      '            <img class="dino-win-prize dino-float-2" src="./premios/chapeu.png" alt="Chapeu">',
      '          </div>',
      '          <div class="dino-card dino-win-card">',
      '            <div class="dino-win-title-row"><span class="dino-win-trophy">\uD83C\uDFC6</span><p class="dino-win-title">WOW! 1000?</p><span class="dino-win-trophy">\uD83C\uDFC6</span></div>',
      '            <p class="dino-win-subtitle">Ganda Maluc@!! Preenche os teus dados e habilita-te a ganhar 1 dos pr\u00e9mios!</p>',
      '            <div class="dino-win-form" data-role="winForm">',
      '              <div class="dino-win-form-cols">',
      '                <div class="dino-win-form-col">',
      '                  <input class="dino-win-input" type="text" data-role="winName" placeholder="Nome" maxlength="200" autocomplete="off">',
      '                  <input class="dino-win-input" type="tel" data-role="winPhone" placeholder="Telefone" maxlength="50" autocomplete="off" inputmode="numeric" pattern="[0-9]*">',
      '                  <input class="dino-win-input" type="email" data-role="winEmail" placeholder="E-mail" maxlength="200" autocomplete="off">',
      '                </div>',
      '                <div class="dino-win-form-col">',
      '                  <input class="dino-win-input" type="text" data-role="winStreet" placeholder="Rua e N\u00famero" maxlength="200" autocomplete="off">',
      '                  <input class="dino-win-input" type="text" data-role="winDoor" placeholder="Porta" maxlength="50" autocomplete="off">',
      '                  <input class="dino-win-input" type="text" data-role="winPostal" placeholder="C\u00f3digo Postal" maxlength="20" autocomplete="off">',
      '                </div>',
      '              </div>',
      '              <button class="dino-start-btn dino-win-submit" type="button" data-role="winSubmitBtn">Enviar</button>',
      '            </div>',
      '            <p class="dino-win-status" data-role="winStatus"></p>',
      '            <button class="dino-start-btn dino-win-restart-link" type="button" data-role="winRestartBtn">Jogar outra vez</button>',
      '          </div>',
      '          <div class="dino-win-prizes-col">',
      '            <img class="dino-win-prize dino-float-3" src="./premios/boxers.png" alt="Boxers">',
      '            <img class="dino-win-prize dino-float-4" src="./premios/merch.png" alt="Merch">',
      '          </div>',
      '        </div>',
      '      </div>',
      '      <button class="dino-mute-btn" type="button" data-role="muteBtn">\uD83D\uDD0A</button>',
      '      <button class="dino-fullscreen-btn" type="button" data-role="fullscreenBtn">\u26F6</button>',
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
    const vidasText = root.querySelector('[data-role="vidasText"]');
    const bestText = root.querySelector('[data-role="bestText"]');
    const winOverlay = root.querySelector('[data-role="winOverlay"]');
    const winForm = root.querySelector('[data-role="winForm"]');
    const winNameInput = root.querySelector('[data-role="winName"]');
    const winPhoneInput = root.querySelector('[data-role="winPhone"]');
    const winEmailInput = root.querySelector('[data-role="winEmail"]');
    const winStreetInput = root.querySelector('[data-role="winStreet"]');
    const winDoorInput = root.querySelector('[data-role="winDoor"]');
    const winPostalInput = root.querySelector('[data-role="winPostal"]');
    const winSubmitBtn = root.querySelector('[data-role="winSubmitBtn"]');
    const winStatus = root.querySelector('[data-role="winStatus"]');
    const winRestartBtn = root.querySelector('[data-role="winRestartBtn"]');
    const muteBtn = root.querySelector('[data-role="muteBtn"]');
    const fullscreenBtn = root.querySelector('[data-role="fullscreenBtn"]');
    if (opts.title) { var titleEl = root.querySelector(".dino-title"); if (titleEl && titleEl.tagName !== "IMG") titleEl.textContent = title; }

    var canvasWrap = root.querySelector(".dino-canvas-wrap");
    var isPseudoFullscreen = false;

    function lockLandscape() {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(function () {});
      }
    }

    function unlockOrientation() {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }

    function isPortrait() {
      return window.innerHeight > window.innerWidth;
    }

    function enterPseudoFullscreen() {
      isPseudoFullscreen = true;
      canvasWrap.classList.add("dino-pseudo-fullscreen");
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);

      if (isPortrait()) {
        canvasWrap.classList.add("dino-fs-rotated");
        canvasWrap.classList.remove("dino-fs-landscape");
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        canvasWrap.style.width = vh + "px";
        canvasWrap.style.height = vw + "px";
        canvasWrap.style.transform = "rotate(90deg) translateY(-" + vw + "px)";
        canvasWrap.style.transformOrigin = "top left";
      } else {
        canvasWrap.classList.add("dino-fs-landscape");
        canvasWrap.classList.remove("dino-fs-rotated");
        canvasWrap.style.width = "";
        canvasWrap.style.height = "";
        canvasWrap.style.transform = "";
        canvasWrap.style.transformOrigin = "";
      }
      lockLandscape();
    }

    function exitPseudoFullscreen() {
      isPseudoFullscreen = false;
      canvasWrap.classList.remove("dino-pseudo-fullscreen", "dino-fs-rotated", "dino-fs-landscape");
      canvasWrap.style.width = "";
      canvasWrap.style.height = "";
      canvasWrap.style.transform = "";
      canvasWrap.style.transformOrigin = "";
      document.body.style.overflow = "";
      unlockOrientation();
    }

    function isNativeFullscreen() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    }

    function canNativeFullscreen() {
      return !!(canvasWrap.requestFullscreen || canvasWrap.webkitRequestFullscreen || canvasWrap.msRequestFullscreen);
    }

    function toggleFullscreen() {
      if (isNativeFullscreen()) {
        unlockOrientation();
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        return;
      }

      if (isPseudoFullscreen) {
        exitPseudoFullscreen();
        return;
      }

      if (canNativeFullscreen()) {
        var p;
        if (canvasWrap.requestFullscreen) p = canvasWrap.requestFullscreen();
        else if (canvasWrap.webkitRequestFullscreen) canvasWrap.webkitRequestFullscreen();
        else if (canvasWrap.msRequestFullscreen) canvasWrap.msRequestFullscreen();

        if (p && p.then) {
          p.then(lockLandscape).catch(function () {
            enterPseudoFullscreen();
          });
        } else {
          lockLandscape();
        }
      } else {
        enterPseudoFullscreen();
      }
    }

    var fsBtnTouched = false;
    fullscreenBtn.addEventListener("touchend", function (e) {
      e.preventDefault();
      e.stopPropagation();
      fsBtnTouched = true;
      toggleFullscreen();
    }, { passive: false });

    fullscreenBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (fsBtnTouched) { fsBtnTouched = false; return; }
      toggleFullscreen();
    });

    document.addEventListener("fullscreenchange", function () {
      if (!isNativeFullscreen()) unlockOrientation();
    });
    document.addEventListener("webkitfullscreenchange", function () {
      if (!isNativeFullscreen()) unlockOrientation();
    });

    var audioCtx = null;
    var musicGain = null;
    var sfxGain = null;

    function getAudioCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        musicGain = audioCtx.createGain();
        musicGain.gain.value = 0.15;
        musicGain.connect(audioCtx.destination);
        sfxGain = audioCtx.createGain();
        sfxGain.gain.value = 1.0;
        sfxGain.connect(audioCtx.destination);
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    }

    var music = new Audio("./music.mp3");
    music.loop = true;
    var musicSourceCreated = false;
    var isMuted = false;

    function connectMusic() {
      if (musicSourceCreated) return;
      var ctx = getAudioCtx();
      var source = ctx.createMediaElementSource(music);
      source.connect(musicGain);
      musicSourceCreated = true;
    }

    function makeSfxGroup(paths) {
      var group = { sounds: [], index: 0, connected: [] };
      group.sounds = paths.map(function (p) { return new Audio(p); });
      group.connected = paths.map(function () { return false; });
      return group;
    }
    var sfx = {
      carro: makeSfxGroup(["./audio/carro.mp3", "./audio/carro2.mp3"]),
      morte: makeSfxGroup(["./audio/morte.mp3", "./audio/morte2.mp3"]),
      router: makeSfxGroup(["./audio/router.mp3", "./audio/router2.mp3", "./audio/router3.mp3"]),
      fibra: makeSfxGroup(["./audio/fibra.mp3", "./audio/fibra2.mp3", "./audio/fibra3.mp3"])
    };

    function playSfx(group) {
      if (isMuted) return;
      var idx = group.index;
      var sound = group.sounds[idx];
      group.index = (idx + 1) % group.sounds.length;
      if (!group.connected[idx]) {
        var ctx = getAudioCtx();
        var src = ctx.createMediaElementSource(sound);
        src.connect(sfxGain);
        group.connected[idx] = true;
      }
      sound.currentTime = 0;
      sound.play().catch(function () {});
    }

    muteBtn.addEventListener("click", function () {
      isMuted = !isMuted;
      if (musicGain) musicGain.gain.value = isMuted ? 0 : 0.15;
      if (sfxGain) sfxGain.gain.value = isMuted ? 0 : 1.0;
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
    let vidas = 0;
    let heartSpawnTimer = 0;
    let heartSpawnNextAt = 180 + Math.random() * 200;
    let hitFlash = 0;
    let vidaPopup = null;
    let heartParticles = [];
    let score = 0;
    let best = Number(localStorage.getItem(bestKey) || 0);
    let speed = 7.5;
    let spawnTimer = 0;
    let spawnNextAt = randomSpawnInterval();
    let isPlaying = false;
    let isGameOver = false;
    let rafId = null;
    let idleRafId = null;
    let idleLastTs = 0;
    let idleObstacles = [];
    let idleSpawnTimer = 0;
    let idleSpawnNextAt = 80 + Math.random() * 120;
    let idleLastCarType = -1;
    let idleSpeed = 2.5;
    let lastTs = 0;
    const playerSprites = {
      idle: null,
      run1: null,
      run2: null
    };
    const fibradoSprites = {
      idle: null,
      run1: null,
      run2: null
    };
    let obstacleSprites = [null, null, null, null];
    let background0Sprite = null;
    let backgroundSprite = null;
    let skySprite = null;
    let planeSprite = null;
    let plane2Sprite = null;
    let routerSprite = null;
    let fibraSprite = null;
    let bgScrollX = 0;
    let skyScrollX = 0;
    let plane = null;
    let planeTimer = 0;
    let planeNextAt = 400 + Math.random() * 600;
    let plane2 = null;
    let plane2Timer = 0;
    let plane2NextAt = 700 + Math.random() * 800;
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
      loadSprite(defaultSprites.fibradoIdleSpriteSrc, function (img) {
        fibradoSprites.idle = img;
      });
      loadSprite(defaultSprites.fibradoRun1SpriteSrc, function (img) {
        fibradoSprites.run1 = img;
      });
      loadSprite(defaultSprites.fibradoRun2SpriteSrc, function (img) {
        fibradoSprites.run2 = img;
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
      var nextSkySrc = newSprites && newSprites.skySrc ? newSprites.skySrc : defaultSprites.skySrc;
      loadSprite(nextSkySrc, function (img) {
        skySprite = img;
      });
      var nextPlaneSrc = newSprites && newSprites.planeSrc ? newSprites.planeSrc : defaultSprites.planeSrc;
      loadSprite(nextPlaneSrc, function (img) {
        planeSprite = img;
      });
      var nextPlane2Src = newSprites && newSprites.plane2Src ? newSprites.plane2Src : defaultSprites.plane2Src;
      loadSprite(nextPlane2Src, function (img) {
        plane2Sprite = img;
      });
      var nextRouterSrc = newSprites && newSprites.routerSrc ? newSprites.routerSrc : defaultSprites.routerSrc;
      loadSprite(nextRouterSrc, function (img) {
        routerSprite = img;
      });
      var nextFibraSrc = newSprites && newSprites.fibraSrc ? newSprites.fibraSrc : defaultSprites.fibraSrc;
      loadSprite(nextFibraSrc, function (img) {
        fibraSprite = img;
      });
      var nextBg0Src = newSprites && newSprites.background0Src ? newSprites.background0Src : defaultSprites.background0Src;
      loadSprite(nextBg0Src, function (img) {
        background0Sprite = img;
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
      vidas = 0;
      heartSpawnTimer = 0;
      heartSpawnNextAt = 180 + Math.random() * 200;
      score = 0;
      speed = 7.5;
      spawnTimer = 0;
      spawnNextAt = randomSpawnInterval();
      dino.y = WORLD.groundY - dino.h;
      dino.velY = 0;
      isGameOver = false;
      hitFlash = 0;
      vidaPopup = null;
      heartParticles = [];
      plane = null;
      planeTimer = 0;
      planeNextAt = 400 + Math.random() * 600;
      plane2 = null;
      plane2Timer = 0;
      plane2NextAt = 700 + Math.random() * 800;
      runFrameElapsedMs = 0;
      runFrameIndex = 0;
      updateHud();
    }

    function updateHud() {
      scoreText.textContent = String(Math.floor(score));
      bestText.textContent = String(best);
      heartsText.textContent = String(heartsCollected);
      vidasText.textContent = String(vidas);
    }

    function startGame() {
      resetRun();
      stopIdleLoop();
      startBtn.blur();
      idleObstacles = [];
      isPlaying = true;
      startOverlay.classList.add("hidden");
      winOverlay.classList.add("hidden");
      lastTs = 0;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
      connectMusic();
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
      idleObstacles = [];
      idleSpawnTimer = 0;
      startIdleLoop();
    }

    function gameWin() {
      isGameOver = true;
      isPlaying = false;
      music.pause();
      if (score > best) {
        best = Math.floor(score);
        localStorage.setItem(bestKey, String(best));
      }
      updateHud();
      var alreadySent = localStorage.getItem("dino_submitted") === "1";
      if (alreadySent) {
        winForm.style.display = "none";
        winStatus.innerHTML = "J\u00e1 enviaste os teus dados!<br>Se foste dos primeiros a vencer receber\u00e1s not\u00edcias em breve!";
        winStatus.style.color = "#2ecc40";
      } else {
        winNameInput.value = "";
        winPhoneInput.value = "";
        winEmailInput.value = "";
        winStreetInput.value = "";
        winDoorInput.value = "";
        winPostalInput.value = "";
        winStatus.textContent = "";
        winForm.style.display = "";
        winSubmitBtn.disabled = false;
      }
      winOverlay.classList.remove("hidden");
      idleObstacles = [];
      idleSpawnTimer = 0;
      startIdleLoop();
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
      if (score >= 1000) {
        score = 1000;
        gameWin();
        return;
      }
      if (backgroundSprite) {
        bgScrollX = (bgScrollX + speed * 0.5 * deltaNorm) % backgroundSprite.naturalWidth;
      }
      if (skySprite) {
        skyScrollX = (skyScrollX + speed * 0.25 * deltaNorm) % skySprite.naturalWidth;
      }

      if (!plane) {
        planeTimer += 1 * deltaNorm;
        if (planeTimer >= planeNextAt && planeSprite && !plane2) {
          var pw = planeSprite.naturalWidth * 0.21;
          var ph = planeSprite.naturalHeight * 0.21;
          var baseY = 30 + Math.random() * (WORLD.groundY * 0.35);
          plane = { x: WORLD.width + 20, baseY: baseY, y: baseY, w: pw, h: ph, age: 0 };
        }
      } else {
        plane.x -= speed * 0.3 * deltaNorm;
        plane.age += deltaNorm;
        plane.y = plane.baseY + Math.sin(plane.age * 0.04) * 6;
        if (plane.x + plane.w < -20) {
          plane = null;
          planeTimer = 0;
          planeNextAt = 400 + Math.random() * 600;
        }
      }

      if (!plane2) {
        plane2Timer += 1 * deltaNorm;
        if (plane2Timer >= plane2NextAt && plane2Sprite && !plane) {
          var p2w = plane2Sprite.naturalWidth * 0.21;
          var p2h = plane2Sprite.naturalHeight * 0.21;
          var base2Y = 30 + Math.random() * (WORLD.groundY * 0.35);
          plane2 = { x: WORLD.width + 20, baseY: base2Y, y: base2Y, w: p2w, h: p2h, age: 0 };
        }
      } else {
        plane2.x -= speed * 0.3 * deltaNorm;
        plane2.age += deltaNorm;
        plane2.y = plane2.baseY + Math.sin(plane2.age * 0.04) * 6;
        if (plane2.x + plane2.w < -20) {
          plane2 = null;
          plane2Timer = 0;
          plane2NextAt = 700 + Math.random() * 800;
        }
      }

      if (hitFlash > 0) {
        hitFlash = Math.max(0, hitFlash - 0.05 * deltaNorm);
      }

      if (vidaPopup) {
        vidaPopup.age += deltaNorm;
        vidaPopup.y -= 0.6 * deltaNorm;
        if (vidaPopup.age > 80) vidaPopup = null;
      }

      for (var pi = heartParticles.length - 1; pi >= 0; pi--) {
        var hp = heartParticles[pi];
        hp.x += hp.vx * deltaNorm;
        hp.y += hp.vy * deltaNorm;
        hp.vy += 0.04 * deltaNorm;
        hp.age += deltaNorm;
        if (hp.age >= hp.maxAge) heartParticles.splice(pi, 1);
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
          var pcx = dino.x + dino.w / 2;
          var pcy = dino.y + dino.h * 0.2;
          for (var p = 0; p < 6; p++) {
            var angle = Math.random() * Math.PI * 2;
            var spd = 1.2 + Math.random() * 2;
            heartParticles.push({
              x: pcx + (Math.random() - 0.5) * 16,
              y: pcy + (Math.random() - 0.5) * 12,
              vx: Math.cos(angle) * spd,
              vy: -Math.abs(Math.sin(angle)) * spd - 0.8,
              size: 9 + Math.random() * 6,
              age: 0,
              maxAge: 35 + Math.random() * 20
            });
          }
          heartsCollected++;
          playSfx(sfx.router);
          if (heartsCollected >= 3) {
            vidas++;
            heartsCollected -= 3;
            vidaPopup = { text: "+1 Fibra", color: "#2ecc40", x: WORLD.width / 2, y: WORLD.height / 2, age: 0 };
            playSfx(sfx.fibra);
          }
          hearts.splice(i, 1);
        }
      }

      for (let i = 0; i < obstacles.length; i += 1) {
        if (collides(dinoBox, obstacles[i])) {
          if (vidas > 0) {
            vidas--;
            hitFlash = 1;
            vidaPopup = { text: "-1 Fibra", color: "#e04040", x: WORLD.width / 2, y: WORLD.height / 2, age: 0 };
            playSfx(sfx.carro);
            obstacles.splice(i, 1);
            break;
          }
          hitFlash = 1;
          playSfx(sfx.morte);
          gameOver();
          return;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, WORLD.width, WORLD.height);

      if (background0Sprite) {
        ctx.drawImage(background0Sprite, 0, 0, WORLD.width, WORLD.height);
      }

      if (skySprite) {
        var skyW = skySprite.naturalWidth;
        var skyH = skySprite.naturalHeight;
        var skyScaleH = WORLD.height / skyH;
        var skyDrawW = skyW * skyScaleH;
        var skyStartX = -(skyScrollX * skyScaleH) % skyDrawW;
        if (skyStartX > 0) skyStartX -= skyDrawW;
        for (var sx = skyStartX; sx < WORLD.width; sx += skyDrawW) {
          ctx.drawImage(skySprite, sx, 0, skyDrawW, WORLD.height);
        }
      }

      if (backgroundSprite) {
        var bgW = backgroundSprite.naturalWidth;
        var bgH = backgroundSprite.naturalHeight;
        var scaleH = WORLD.height / bgH;
        var drawW = bgW * scaleH;
        var startX = -(bgScrollX * scaleH) % drawW;
        if (startX > 0) startX -= drawW;
        for (var bx = startX; bx < WORLD.width; bx += drawW) {
          ctx.drawImage(backgroundSprite, bx, 0, drawW, WORLD.height);
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

      if (plane && planeSprite) {
        ctx.drawImage(planeSprite, plane.x, plane.y, plane.w, plane.h);
      }
      if (plane2 && plane2Sprite) {
        ctx.drawImage(plane2Sprite, plane2.x, plane2.y, plane2.w, plane2.h);
      }

      ctx.strokeStyle = "#c8cfdf";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, WORLD.groundY + 0.5);
      ctx.lineTo(WORLD.width, WORLD.groundY + 0.5);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let x = -((score * 2) % 34); x < WORLD.width; x += 34) {
        ctx.fillRect(x, WORLD.groundY + 18, 18, 3);
      }

      if (isPlaying) {
        var sprites = (vidas >= 1 && fibradoSprites.idle) ? fibradoSprites : playerSprites;
        const animatedSprite =
          runFrameIndex === 0 ? (sprites.run1 || sprites.idle) : (sprites.run2 || sprites.idle);
        const activePlayerSprite = !isGameOver ? animatedSprite : sprites.idle;

        if (activePlayerSprite) {
          if (vidas >= 1 && fibradoSprites.idle) {
            ctx.save();
            ctx.shadowColor = "#ffd4fa";
            ctx.shadowBlur = 12;
            ctx.drawImage(activePlayerSprite, dino.x, dino.y, dino.w, dino.h);
            ctx.restore();
          } else {
            ctx.drawImage(activePlayerSprite, dino.x, dino.y, dino.w, dino.h);
          }
        } else {
          ctx.fillStyle = getComputedStyle(root).getPropertyValue("--dino").trim();
          ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
          ctx.fillStyle = "#f6f7fb";
          ctx.fillRect(dino.x + dino.w - 11, dino.y + 10, 7, 7);
        }

        for (var pi = 0; pi < heartParticles.length; pi++) {
          var hp = heartParticles[pi];
          var hAlpha = Math.max(0, 1 - hp.age / hp.maxAge);
          var hs = hp.size * (0.6 + 0.4 * (1 - hp.age / hp.maxAge));
          ctx.save();
          ctx.globalAlpha = hAlpha;
          ctx.strokeStyle = "#e8344e";
          ctx.lineWidth = 2;
          for (var arc = 0; arc < 3; arc++) {
            var r = hs * 0.2 * (arc + 1);
            ctx.beginPath();
            ctx.arc(hp.x, hp.y, r, -Math.PI * 0.75, -Math.PI * 0.25);
            ctx.stroke();
          }
          ctx.fillStyle = "#e8344e";
          ctx.fillRect(hp.x - 1.5, hp.y - 1.5, 3, 3);
          ctx.restore();
        }
      }

      for (let i = 0; i < hearts.length; i += 1) {
        var h = hearts[i];
        if (routerSprite) {
          ctx.save();
          ctx.shadowColor = "rgba(255,255,255,0.95)";
          ctx.shadowBlur = 8;
          ctx.drawImage(routerSprite, h.x, h.y, h.w, h.h);
          ctx.restore();
        } else {
          ctx.fillStyle = "#3498db";
          ctx.fillRect(h.x, h.y, h.w, h.h);
        }
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

      if (vidaPopup) {
        var alpha = Math.max(0, 1 - vidaPopup.age / 80);
        ctx.save();
        ctx.font = "bold 22px 'Press Start 2P', cursive";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000";
        ctx.strokeText(vidaPopup.text, vidaPopup.x, vidaPopup.y);
        ctx.fillStyle = vidaPopup.color;
        ctx.fillText(vidaPopup.text, vidaPopup.x, vidaPopup.y);
        if (fibraSprite && vidaPopup.text === "+1 Fibra") {
          var fibraH = 48;
          var fibraW = fibraH * (fibraSprite.naturalWidth / fibraSprite.naturalHeight);
          ctx.drawImage(fibraSprite, vidaPopup.x - fibraW / 2, vidaPopup.y + 18, fibraW, fibraH);
        }
        ctx.restore();
      }

      if (hitFlash > 0) {
        ctx.fillStyle = "rgba(180, 20, 20, " + (hitFlash * 0.5) + ")";
        ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      }
    }

    function idleLoop(ts) {
      if (isPlaying) return;
      if (!idleLastTs) idleLastTs = ts;
      var dt = ts - idleLastTs;
      idleLastTs = ts;
      var dn = Math.min(2.1, dt / 16.6667);

      if (hitFlash > 0) {
        hitFlash = Math.max(0, hitFlash - 0.05 * dn);
      }

      if (backgroundSprite) {
        bgScrollX = (bgScrollX + idleSpeed * 0.5 * dn) % backgroundSprite.naturalWidth;
      }
      if (skySprite) {
        skyScrollX = (skyScrollX + idleSpeed * 0.25 * dn) % skySprite.naturalWidth;
      }

      if (!plane) {
        planeTimer += 1 * dn;
        if (planeTimer >= planeNextAt && planeSprite && !plane2) {
          var pw = planeSprite.naturalWidth * 0.21;
          var ph = planeSprite.naturalHeight * 0.21;
          var baseY = 30 + Math.random() * (WORLD.groundY * 0.35);
          plane = { x: WORLD.width + 20, baseY: baseY, y: baseY, w: pw, h: ph, age: 0 };
        }
      } else {
        plane.x -= idleSpeed * 0.9 * dn;
        plane.age += dn;
        plane.y = plane.baseY + Math.sin(plane.age * 0.04) * 6;
        if (plane.x + plane.w < -20) {
          plane = null;
          planeTimer = 0;
          planeNextAt = 400 + Math.random() * 600;
        }
      }

      if (!plane2) {
        plane2Timer += 1 * dn;
        if (plane2Timer >= plane2NextAt && plane2Sprite && !plane) {
          var p2w = plane2Sprite.naturalWidth * 0.21;
          var p2h = plane2Sprite.naturalHeight * 0.21;
          var base2Y = 30 + Math.random() * (WORLD.groundY * 0.35);
          plane2 = { x: WORLD.width + 20, baseY: base2Y, y: base2Y, w: p2w, h: p2h, age: 0 };
        }
      } else {
        plane2.x -= idleSpeed * 0.9 * dn;
        plane2.age += dn;
        plane2.y = plane2.baseY + Math.sin(plane2.age * 0.04) * 6;
        if (plane2.x + plane2.w < -20) {
          plane2 = null;
          plane2Timer = 0;
          plane2NextAt = 700 + Math.random() * 800;
        }
      }

      idleSpawnTimer += 1 * dn;
      if (idleSpawnTimer >= idleSpawnNextAt) {
        var type = pickObstacleType();
        while (type === idleLastCarType) { type = pickObstacleType(); }
        idleLastCarType = type;
        var sprite = obstacleSprites[type];
        var obstacleScale = 0.6;
        var fallbackW = [190, 190, 240, 190];
        var fallbackH = [56, 56, 56, 56];
        var w = (sprite ? sprite.naturalWidth : fallbackW[type]) * obstacleScale;
        var h = (sprite ? sprite.naturalHeight : fallbackH[type]) * obstacleScale;
        idleObstacles.push({
          x: WORLD.width + 20, y: WORLD.groundY - h, w: w, h: h, type: type,
          bodyColor: ["#d54e4e", "#4e76d5", "#3a9e5c", "#e8b630"][type]
        });
        idleSpawnTimer = 0;
        idleSpawnNextAt = 80 + Math.random() * 120;
      }

      for (var i = idleObstacles.length - 1; i >= 0; i--) {
        idleObstacles[i].x -= idleSpeed * dn;
        if (idleObstacles[i].x + idleObstacles[i].w < -10) {
          idleObstacles.splice(i, 1);
        }
      }

      var savedObstacles = obstacles;
      obstacles = idleObstacles;
      draw();
      obstacles = savedObstacles;

      idleRafId = requestAnimationFrame(idleLoop);
    }

    function startIdleLoop() {
      idleLastTs = 0;
      cancelAnimationFrame(idleRafId);
      idleRafId = requestAnimationFrame(idleLoop);
    }

    function stopIdleLoop() {
      cancelAnimationFrame(idleRafId);
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
      var t = event.target;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (t === fullscreenBtn || t === muteBtn || t === startBtn || t === winRestartBtn || t === winSubmitBtn) return;
      if (event.type === "keydown") {
        const key = event.key;
        if (key !== " " && key !== "ArrowUp" && key !== "Up" && key !== "w" && key !== "W") {
          return;
        }
        event.preventDefault();
      }
      jump();
    }

    function submitWinForm() {
      var name = winNameInput.value.trim();
      var phone = winPhoneInput.value.trim();
      var email = winEmailInput.value.trim();
      var street = winStreetInput.value.trim();
      var door = winDoorInput.value.trim();
      var postal = winPostalInput.value.trim();
      if (!name || !phone || !email || !street || !door || !postal) {
        winStatus.textContent = "Preenche todos os campos!";
        winStatus.style.color = "#e04040";
        return;
      }
      winSubmitBtn.disabled = true;
      winStatus.textContent = "A enviar...";
      winStatus.style.color = "#646773";

      function sendViaForm(fields) {
        var iframe = document.createElement("iframe");
        iframe.name = "dino_submit_frame";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        var form = document.createElement("form");
        form.method = "POST";
        form.action = GOOGLE_SCRIPT_URL;
        form.target = "dino_submit_frame";
        Object.keys(fields).forEach(function (key) {
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        setTimeout(function () {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
        }, 5000);
      }

      fetch("https://api.ipify.org?format=json").then(function (r) {
        return r.json();
      }).then(function (ipData) {
        return ipData.ip || "";
      }).catch(function () {
        return "";
      }).then(function (ip) {
        sendViaForm({ name: name, phone: phone, email: email, street: street, door: door, postal: postal, ip: ip });
        localStorage.setItem("dino_submitted", "1");
        winStatus.innerHTML = "Parab\u00e9ns!<br>Se foste dos primeiros a vencer receber\u00e1s not\u00edcias em breve!";
        winStatus.style.color = "#2ecc40";
        winForm.style.display = "none";
      });
    }

    winPhoneInput.addEventListener("input", function () {
      winPhoneInput.value = winPhoneInput.value.replace(/[^0-9]/g, "");
    });

    startBtn.addEventListener("click", startGame);
    winRestartBtn.addEventListener("click", startGame);
    winSubmitBtn.addEventListener("click", submitWinForm);
    window.addEventListener("keydown", handleJumpInput, { passive: false });
    canvas.addEventListener("pointerdown", handleJumpInput);
    canvas.addEventListener("touchstart", handleJumpInput, { passive: true });

    draw();
    updateHud();
    applySprites(spriteOptions);
    startIdleLoop();

    return {
      start: startGame,
      setSprites: function setSprites(newSprites) {
        applySprites(newSprites || {});
      },
      destroy: function destroy() {
        cancelAnimationFrame(rafId);
        cancelAnimationFrame(idleRafId);
        music.pause();
        music.src = "";
        window.removeEventListener("keydown", handleJumpInput);
        startBtn.removeEventListener("click", startGame);
        winRestartBtn.removeEventListener("click", startGame);
        winSubmitBtn.removeEventListener("click", submitWinForm);
        canvas.removeEventListener("pointerdown", handleJumpInput);
        canvas.removeEventListener("touchstart", handleJumpInput);
        hostEl.innerHTML = "";
      }
    };
  }

  window.createDinoRunner = createDinoRunner;
})();
