//#region Audio and Visuals
        let masterSfxGain = null;

    function getAudioContext() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!sharedAudioCtx) {
            sharedAudioCtx = new AudioCtx();
            masterSfxGain = sharedAudioCtx.createGain();
            masterSfxGain.connect(sharedAudioCtx.destination);
        }
        if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
        syncSfxGain();
        return sharedAudioCtx;
    }

    function getSfxDestination() {
        const ctx = getAudioContext();
        return masterSfxGain || (ctx ? ctx.destination : null);
    }

    function syncSfxGain() {
        if (!masterSfxGain || !sharedAudioCtx) return;
        const effectiveVol = (STATE.masterMuted || STATE.sfxMuted)
            ? 0
            : Math.max(0, Math.min(1, STATE.masterVol * STATE.sfxVol));
        masterSfxGain.gain.setValueAtTime(effectiveVol, sharedAudioCtx.currentTime);
    }

    window.addEventListener('pointerdown', () => {
        try { getAudioContext(); } catch (_) { }
    }, { passive: true });

    function playBeep(freq = 520, duration = 0.08, type = 'square', vol = 0.04) {
        if (STATE.masterMuted || STATE.sfxMuted || STATE.masterVol === 0 || STATE.sfxVol === 0) return;
        try {
            const ctx = getAudioContext();
            const dest = getSfxDestination();
            if (!ctx || !dest) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(vol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain);
            gain.connect(dest);
            osc.start(now);
            osc.stop(now + duration + 0.02);
        } catch (_) { }
    }

    function startSustainedNote(freq, waveType = 'triangle') {
        if (STATE.masterMuted || STATE.sfxMuted || STATE.masterVol === 0 || STATE.sfxVol === 0) return null;
        try {
            const ctx = getAudioContext();
            const dest = getSfxDestination();
            if (!ctx || !dest) return null;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = waveType;
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
            osc.connect(gain);
            gain.connect(dest);
            osc.start(now);

            let released = false;
            return function releaseNote() {
                if (released) return;
                released = true;
                const t = ctx.currentTime;
                gain.gain.cancelScheduledValues(t);
                gain.gain.setValueAtTime(Math.max(0.001, gain.gain.value), t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
                osc.stop(t + 0.28);
            };
        } catch (_) {
            return null;
        }
    }

    function startAudioControls() {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'audio-toggle-btn settings-hub-btn';
    toggleBtn.title = 'Site Settings (Audio, Graphics & Waves)';
    toggleBtn.textContent = '⚙️';

    const mixer = document.createElement('div');
    mixer.className = 'audio-mixer-popover settings-hub-popover';
    mixer.innerHTML = `
        <div class="mixer-header">
            <span>⚙️ SITE SETTINGS</span>
            <button type="button" class="mixer-close-btn" title="Close">&times;</button>
        </div>

        <div class="settings-section-label">AUDIO MIXER</div>
        <div class="mixer-row">
            <div class="mixer-label-row">
                <button type="button" class="mixer-mute-chip" id="muteMasterBtn">🔊 Master</button>
                <span class="mixer-pct" id="masterPct">80%</span>
            </div>
            <input type="range" class="mixer-slider" id="masterSlider" min="0" max="100" step="1">
        </div>

        <div class="mixer-row">
            <div class="mixer-label-row">
                <button type="button" class="mixer-mute-chip" id="muteMusicBtn">🎵 Music</button>
                <span class="mixer-pct" id="musicPct">15%</span>
            </div>
            <input type="range" class="mixer-slider" id="musicSlider" min="0" max="100" step="1">
        </div>

        <div class="mixer-row">
            <div class="mixer-label-row">
                <button type="button" class="mixer-mute-chip" id="muteSfxBtn">⚡ SFX</button>
                <span class="mixer-pct" id="sfxPct">70%</span>
            </div>
            <input type="range" class="mixer-slider" id="sfxSlider" min="0" max="100" step="1">
        </div>

        <div class="settings-divider"></div>
        <div class="settings-section-label">DISPLAY & VISUALS</div>

        <div class="settings-action-row">
            <span>Low Detail Mode (FPS)</span>
            <button type="button" class="mixer-mute-chip" id="settingsLdmBtn">OFF</button>
        </div>

        <div class="settings-action-row">
            <span>Background Waves</span>
            <button type="button" class="mixer-mute-chip" id="settingsWaveBtn">Animated</button>
        </div>
        <div class="settings-divider"></div>
        <div class="settings-action-row">
            <span>Official Showcase</span>
            <button type="button" class="mixer-mute-chip" id="settingsFormalBtn">Return ↗</button>
        </div>
        <div class="settings-action-row">
        <span>Collectible Binder</span>
        <button type="button" class="mixer-mute-chip" id="settingsTcgBtn">🃏 Cards</button>
    </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(mixer);
    const formalBtn = mixer.querySelector('#settingsFormalBtn');
    if (formalBtn) {
        formalBtn.addEventListener('click', () => {
            window.location.href = 'https://voxxiethelamb.github.io/beyondthemanger/';
        });
    }
    const masterSlider = mixer.querySelector('#masterSlider');
    const musicSlider = mixer.querySelector('#musicSlider');
    const sfxSlider = mixer.querySelector('#sfxSlider');

    const masterPct = mixer.querySelector('#masterPct');
    const musicPct = mixer.querySelector('#musicPct');
    const sfxPct = mixer.querySelector('#sfxPct');

    const muteMasterBtn = mixer.querySelector('#muteMasterBtn');
    const muteMusicBtn = mixer.querySelector('#muteMusicBtn');
    const muteSfxBtn = mixer.querySelector('#muteSfxBtn');

    const ldmBtn = mixer.querySelector('#settingsLdmBtn');
    const waveBtn = mixer.querySelector('#settingsWaveBtn');

    function syncAllAudioUI() {
        const mVal = Math.round(STATE.masterVol * 100);
        const bgmVal = Math.round(STATE.musicVol * 100);
        const sfxVal = Math.round(STATE.sfxVol * 100);

        masterSlider.value = mVal;
        musicSlider.value = bgmVal;
        sfxSlider.value = sfxVal;

        masterPct.textContent = STATE.masterMuted ? 'MUTED' : `${mVal}%`;
        musicPct.textContent = (STATE.masterMuted || STATE.musicMuted) ? 'MUTED' : `${bgmVal}%`;
        sfxPct.textContent = (STATE.masterMuted || STATE.sfxMuted) ? 'MUTED' : `${sfxVal}%`;

        muteMasterBtn.classList.toggle('is-muted', STATE.masterMuted);
        muteMusicBtn.classList.toggle('is-muted', STATE.musicMuted);
        muteSfxBtn.classList.toggle('is-muted', STATE.sfxMuted);

        const allSilent = STATE.masterMuted || (STATE.musicMuted && STATE.sfxMuted) || mVal === 0;
        toggleBtn.classList.toggle('is-muted', allSilent);

        syncSfxGain();
        if (typeof window.syncPraiseAudio === 'function') {
            window.syncPraiseAudio();
        }
    }
    const tcgBtn = mixer.querySelector('#settingsTcgBtn');
    if (tcgBtn) {
        tcgBtn.addEventListener('click', () => {
            mixer.classList.remove('is-open');
            toggleBtn.classList.remove('is-open');
            if (typeof window.openTradingCardBinder === 'function') {
                window.openTradingCardBinder();
            }
        });
    }
    masterSlider.addEventListener('input', () => {
        STATE.masterVol = Number(masterSlider.value) / 100;
        if (STATE.masterVol > 0) STATE.masterMuted = false;
        localStorage.setItem('afcsMasterVol', String(STATE.masterVol));
        localStorage.setItem('afcsMasterMuted', String(STATE.masterMuted));
        syncAllAudioUI();
    });

    musicSlider.addEventListener('input', () => {
        STATE.musicVol = Number(musicSlider.value) / 100;
        if (STATE.musicVol > 0) STATE.musicMuted = false;
        localStorage.setItem('afcsMusicVol', String(STATE.musicVol));
        localStorage.setItem('afcsMusicMuted', String(STATE.musicMuted));
        syncAllAudioUI();
    });

    sfxSlider.addEventListener('input', () => {
        STATE.sfxVol = Number(sfxSlider.value) / 100;
        if (STATE.sfxVol > 0) STATE.sfxMuted = false;
        localStorage.setItem('afcsSfxVol', String(STATE.sfxVol));
        localStorage.setItem('afcsSfxMuted', String(STATE.sfxMuted));
        syncAllAudioUI();
    });

    sfxSlider.addEventListener('change', () => {
        playBeep(620, 0.06, 'sine', 0.045);
    });

    muteMasterBtn.addEventListener('click', () => {
        STATE.masterMuted = !STATE.masterMuted;
        localStorage.setItem('afcsMasterMuted', String(STATE.masterMuted));
        syncAllAudioUI();
        if (!STATE.masterMuted) playBeep(580, 0.07, 'sine', 0.045);
    });

    muteMusicBtn.addEventListener('click', () => {
        STATE.musicMuted = !STATE.musicMuted;
        localStorage.setItem('afcsMusicMuted', String(STATE.musicMuted));
        syncAllAudioUI();
        playBeep(520, 0.05, 'sine', 0.035);
    });

    muteSfxBtn.addEventListener('click', () => {
        STATE.sfxMuted = !STATE.sfxMuted;
        localStorage.setItem('afcsSfxMuted', String(STATE.sfxMuted));
        syncAllAudioUI();
        if (!STATE.sfxMuted) playBeep(660, 0.07, 'sine', 0.045);
    });

    // Low Detail Mode (LDM) Sync
    let ldmOn = localStorage.getItem('afcs_ldm') === 'true';
    function syncLDM() {
        STATE.ldmActive = ldmOn;
        document.body.classList.toggle('ldm-active', ldmOn);
        ldmBtn.textContent = ldmOn ? 'ON (Fast)' : 'OFF';
        ldmBtn.classList.toggle('is-active-chip', ldmOn);
        if (!ldmOn && typeof window.wakeStarCanvas === 'function') {
            window.wakeStarCanvas();
        }
    }
    syncLDM();

    ldmBtn.addEventListener('click', () => {
        ldmOn = !ldmOn;
        localStorage.setItem('afcs_ldm', String(ldmOn));
        syncLDM();
        playBeep(ldmOn ? 420 : 680, 0.06, 'sine', 0.035);
    });

    // Background Waves Sync
    let savedMode = localStorage.getItem('afcs_waves_mode');
    if (savedMode === null) {
        savedMode = localStorage.getItem('afcs_waves_paused') === 'true' ? '1' : '0';
    }
    let waveMode = Number(savedMode) || 0;

    function syncWaveState(mode) {
        document.body.classList.toggle('waves-paused', mode === 1);
        document.body.classList.toggle('waves-hidden', mode === 2);
        if (mode === 0) waveBtn.textContent = 'Animated';
        else if (mode === 1) waveBtn.textContent = 'Paused';
        else waveBtn.textContent = 'Hidden';
        waveBtn.classList.toggle('is-muted', mode === 2);
    }
    syncWaveState(waveMode);

    waveBtn.addEventListener('click', () => {
        waveMode = (waveMode + 1) % 3;
        localStorage.setItem('afcs_waves_mode', String(waveMode));
        localStorage.setItem('afcs_waves_paused', String(waveMode === 1));
        syncWaveState(waveMode);
        const tones = Array.of(480, 360, 620);
        playBeep(tones.at(waveMode), 0.06, 'sine', 0.03);
    });
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mixer.classList.toggle('is-open');
        toggleBtn.classList.toggle('is-open', isOpen);
        playBeep(isOpen ? 640 : 440, 0.05, 'sine', 0.035);
    });

    mixer.querySelector('.mixer-close-btn').addEventListener('click', () => {
        mixer.classList.remove('is-open');
        toggleBtn.classList.remove('is-open');
    });

    window.addEventListener('click', (e) => {
        if (mixer.classList.contains('is-open') && !mixer.contains(e.target) && e.target !== toggleBtn) {
            mixer.classList.remove('is-open');
            toggleBtn.classList.remove('is-open');
        }
    });

    syncAllAudioUI();

    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => playBeep(620, 0.045, 'sine', 0.03));
    });

    STATE.onClosePanel.push(() => {
        playBeep(420, 0.06, 'sine', 0.03);
        setTimeout(() => playBeep(320, 0.08, 'sine', 0.03), 55);
    });
}
        function playTeacherChord() {
            if (STATE.soundMuted) return;
            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.8, 'triangle', 0.12), idx * 80);
            });
        }
        function triggerScreenGlitch(duration = 40 + Math.random() * 60) {
            playBeep(180 + Math.random() * 600, 0.05, 'sawtooth', 0.03);
            const glitchType = Math.floor(Math.random() * 3);
            const fxLayer = document.createElement('div');
            fxLayer.className = 'fission-glitch-overlay';

            if (glitchType === 0) {
                const sliceCount = 2 + Math.floor(Math.random() * 4);
                for (let i = 0; i < sliceCount; i++) {
                    const slice = document.createElement('div');
                    const sy = Math.random() * 100;
                    const sh = 10 + Math.random() * 45;
                    const dispX = (Math.random() - 0.5) * 25;
                    slice.style.cssText = `position:fixed;left:0;right:0;top:${sy}vh;height:${sh}px;background:rgba(0,188,255,0.08);border-top:1px solid rgba(255,255,255,0.2);transform:translateX(${dispX}px);`;
                    fxLayer.appendChild(slice);
                }
            } else if (glitchType === 1) {
                const offset = (Math.random() - 0.5) * 8;
                fxLayer.style.background = 'rgba(0, 255, 102, 0.06)';
                if (DOM.container) DOM.container.style.transform = `translateX(${offset}px)`;
            } else {
                fxLayer.style.background = Math.random() < 0.5 ? 'rgba(255, 61, 0, 0.06)' : 'rgba(0, 188, 255, 0.06)';
                const tear = document.createElement('div');
                tear.style.cssText = `position:fixed;left:0;right:0;top:${Math.random() * 100}vh;height:${2 + Math.random() * 6}px;background:rgba(255,255,255,0.15);`;
                fxLayer.appendChild(tear);
            }

            document.body.appendChild(fxLayer);
            setTimeout(() => {
                fxLayer.remove();
                if (DOM.container) DOM.container.style.transform = '';
            }, duration);
        }
        function togglePartyMode(forceState) {
            STATE.partyModeOn = typeof forceState === 'boolean' ? forceState : !STATE.partyModeOn;
            if (typeof window.wakeStarCanvas === 'function') window.wakeStarCanvas();
            document.body.classList.toggle('party-mode', STATE.partyModeOn);

            if (STATE.partyModeOn) {
                localStorage.setItem('afcs_neon_unlocked', 'true');
                localStorage.setItem('afcs_active_theme', 'neon');
                document.body.classList.remove('search-fx-cornerstone', 'search-fx-dubai', 'theme-doomsday');
                playBeep(880, 0.18, 'square', 0.05);
                if (typeof window.wakeStarCanvas === 'function') window.wakeStarCanvas();
                if (!ambientGlitchTimer) {
                    ambientGlitchTimer = setInterval(() => {
                        if (Math.random() < 0.25) triggerScreenGlitch(80 + Math.random() * 140);
                    }, 1000);
                }
            } else {
                if (localStorage.getItem('afcs_active_theme') === 'neon') {
                    localStorage.setItem('afcs_active_theme', 'blue');
                }
                clearInterval(ambientGlitchTimer);
                ambientGlitchTimer = null;
            }

            if (typeof window.syncThemePill === 'function') {
                window.syncThemePill();
                
            }
        }
        function toggleLockdownMode() {
            STATE.lockdownOn = !STATE.lockdownOn;
            let banner = document.getElementById('lockdownBanner');
            let vignette = document.getElementById('lockdownVignette');

            if (STATE.lockdownOn) {
                if (!vignette) {
                    vignette = document.createElement('div');
                    vignette.id = 'lockdownVignette';
                    vignette.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;animation:lockdown-pulse 2s ease-in-out infinite;';
                    document.body.appendChild(vignette);
                }
                if (!banner) {
                    banner = document.createElement('div');
                    banner.id = 'lockdownBanner';
                    banner.style.cssText = 'position:fixed;top:26px;left:50%;transform:translateX(-50%);background:rgba(153,27,27,0.95);border:2px solid #f87171;color:#ffffff;padding:10px 22px;border-radius:999px;font-weight:bold;font-size:13px;letter-spacing:1px;z-index:10000;box-shadow:0 0 25px rgba(225,29,72,0.9);text-align:center;';
                    banner.textContent = " BURJ KHALIFA SECURITY LOCKDOWN !  TYPE 'LOCKDOWN' TO LIFT";
                    document.body.appendChild(banner);
                }
                playBeep(440, 0.2, 'sawtooth', 0.06);
                lockdownTimer = setInterval(() => playBeep(330, 0.12, 'sawtooth', 0.04), 2000);
            } else {
                if (vignette) vignette.remove();
                if (banner) banner.remove();
                clearInterval(lockdownTimer);
                lockdownTimer = null;
                playBeep(660, 0.15, 'sine', 0.05);
            }
        }
        function startTrailerControls() {
            const videoBox = document.querySelector('.video');
            const videoEl = videoBox ? videoBox.querySelector('video') : null;
            if (!videoBox || !videoEl) return;

            const bar = document.createElement('div');
            bar.className = 'yt-video-controls';
            bar.innerHTML = [
                '<button type="button" class="yt-ctrl-btn" id="ytRewindBtn"> -10s</button>',
                '<button type="button" class="yt-ctrl-btn" id="ytPlayPauseBtn"> Play / Pause</button>',
                '<button type="button" class="yt-ctrl-btn" id="ytForwardBtn"> +10s</button>'
            ].join('');
            videoBox.appendChild(bar);

            const rewBtn = bar.querySelector('#ytRewindBtn');
            const playBtn = bar.querySelector('#ytPlayPauseBtn');
            const fwdBtn = bar.querySelector('#ytForwardBtn');

            function togglePlay() {
                if (videoEl.style.display === 'none') return;
                if (videoEl.paused) videoEl.play();
                else videoEl.pause();
                playBeep(560, 0.05, 'sine', 0.03);
            }

            function skipSeconds(delta) {
                if (videoEl.style.display === 'none' || !isFinite(videoEl.duration)) return;
                videoEl.currentTime = Math.max(0, Math.min(videoEl.duration, videoEl.currentTime + delta));
                playBeep(delta > 0 ? 660 : 440, 0.04, 'sine', 0.03);
            }

            rewBtn.addEventListener('click', () => skipSeconds(-10));
            playBtn.addEventListener('click', togglePlay);
            fwdBtn.addEventListener('click', () => skipSeconds(10));

            videoEl.addEventListener('play', () => { playBtn.textContent = ' Pause'; });
            videoEl.addEventListener('pause', () => { playBtn.textContent = ' Play'; });
        }
//#endregion 
