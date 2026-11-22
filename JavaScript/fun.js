function startPersonRecognitionProtocol() {
    const synopsisCard = document.querySelector('.synopsis-card');
    if (!synopsisCard) return;
    
    const rosterPool = getCards().filter(c => c.dataset.role !== 'Teacher');
    if (rosterPool.length < 4) return;
    
    let streak = 0;
    let currentAnswer = null;
    let roundLocked = false;
    
    const box = document.createElement('div');
    box.className = 'reactor-guess-box';
    box.innerHTML = [
        '<div class="reactor-guess-header">',
        '<span> REACTOR TERMINAL // GUESS THE PERSON</span>',
        '<span id="reactorStreak">STREAK: 0</span>',
        '</div>',
        '<div class="reactor-clues" id="reactorClues"></div>',
        '<div class="reactor-status-msg" id="reactorStatus">Identify the Grade 7 – Psalms member from their clues:</div>',
        '<div class="reactor-options" id="reactorOptions"></div>',
        '<div class="reactor-footer-row">',
        '<button type="button" class="scripture-btn" id="reactorHintBtn" style="border-color:#00bcff;color:#00bcff;"> Initials Hint</button>',
        '<button type="button" class="scripture-btn" id="reactorNextBtn" style="border-color:#00ff66;color:#00ff66;">↻ Next Target</button>',
        '</div>'
    ].join('');
    
    const scriptureBox = synopsisCard.querySelector('.scripture-card');
    const themeBanner = synopsisCard.querySelector('.theme-banner');
    if (scriptureBox) scriptureBox.insertAdjacentElement('afterend', box);
    else if (themeBanner) themeBanner.insertAdjacentElement('afterend', box);
    else synopsisCard.appendChild(box);
    
    const streakEl = box.querySelector('#reactorStreak');
    const cluesEl = box.querySelector('#reactorClues');
    const statusEl = box.querySelector('#reactorStatus');
    const optionsEl = box.querySelector('#reactorOptions');
    const hintBtn = box.querySelector('#reactorHintBtn');
    const nextBtn = box.querySelector('#reactorNextBtn');
    
    function getCleanName(card) {
        return card.querySelector('.overlay-text').textContent.trim();
    }
    
    function buildClues(card) {
        const clues = [];
        const isOfficer = card.dataset.filter === 'officer';
        const baseRole = card.dataset.displayRole || card.dataset.role || 'Student';
        const team = card.dataset.team || '';
        const character = card.dataset.character || '';
        const faction = CONFIG.factionLabels[card.dataset.faction] || '';
        
        clues.push(isOfficer ? ` Officer: ${baseRole}` : ' Class Member');
        clues.push(character ? ` ${character}` : ' Behind-the-Scenes Crew');
        if (team) clues.push(` ${team}`);
        else if (!isOfficer && baseRole !== 'Student') clues.push(` ${baseRole}`);
        if (faction) clues.push(` ${faction}`);
        
        return clues;
    }
    
    function startRound() {
        roundLocked = false;
        const shuffled = [...rosterPool].sort(() => Math.random() - 0.5);
        currentAnswer = shuffled.at(0);
        const choices = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
        
        cluesEl.innerHTML = buildClues(currentAnswer)
        .map(c => `<span class="reactor-clue-pill">${c}</span>`)
        .join('');
        
        statusEl.style.color = '#00bcff';
        statusEl.textContent = 'Identify the Grade 7 – Psalms member from their clues:';
        
        optionsEl.innerHTML = '';
        choices.forEach(choiceCard => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'reactor-opt-btn';
            btn.textContent = getCleanName(choiceCard);
            
            btn.addEventListener('click', () => {
                if (roundLocked) return;
                roundLocked = true;
                
                const allBtns = optionsEl.querySelectorAll('.reactor-opt-btn');
                allBtns.forEach(b => { b.disabled = true; });
                
                if (choiceCard === currentAnswer) {
                    btn.classList.add('is-correct');
                    streak++;
                    streakEl.textContent = `STREAK: ${streak}`;
                    statusEl.style.color = '#00ff66';
                    statusEl.textContent = ` MATCH CONFIRMED !  ${getCleanName(currentAnswer)}!`;
                    
                    const rect = btn.getBoundingClientRect();
                    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#00ff66', '#00bcff', '#ffffff'], 24);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    playBeep(523.25, 0.08, 'square', 0.045);
                    setTimeout(() => playBeep(783.99, 0.14, 'square', 0.045), 75);
                } else {
                    btn.classList.add('is-wrong');
                    allBtns.forEach(b => {
                        if (b.textContent === getCleanName(currentAnswer)) b.classList.add('is-correct');
                    });
                    streak = 0;
                    streakEl.textContent = 'STREAK: 0';
                    statusEl.style.color = '#f87171';
                    statusEl.textContent = ` ACCESS DENIED !  Answer: ${getCleanName(currentAnswer)}`;
                    playBeep(190, 0.22, 'sawtooth', 0.05);
                }
            });
            
            optionsEl.appendChild(btn);
        });
    }
    
    hintBtn.addEventListener('click', () => {
        if (!currentAnswer || roundLocked) return;
        const words = getCleanName(currentAnswer).replace(/,/g, '').split(/\s+/).filter(Boolean);
        const initials = words.map(w => `${w.charAt(0).toUpperCase()}.`).join(' ');
        statusEl.style.color = '#fde047';
        statusEl.textContent = ` INITIALS HINT: ${initials}`;
        playBeep(660, 0.06, 'sine', 0.035);
    });
    
    nextBtn.addEventListener('click', () => {
        playBeep(480, 0.05, 'square', 0.035);
        startRound();
    });
    
    startRound();
}
function startModalsAndShortcuts() {
    const helpBtn = document.getElementById('shortcutHelpBtn');
    const modal = document.getElementById('shortcutModal');
    const closeHelpBtn = document.getElementById('closeShortcutModal');
    
    function toggleHelpModal(forceState) {
        if (!modal) return;
        const shouldOpen = typeof forceState === 'boolean' ? forceState : !modal.classList.contains('active');
        modal.classList.toggle('active', shouldOpen);
    }
    
    if (helpBtn) helpBtn.addEventListener('click', () => toggleHelpModal(true));
    if (closeHelpBtn) closeHelpBtn.addEventListener('click', () => toggleHelpModal(false));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) toggleHelpModal(false); });
    
    let cheatBuffer = '';
    let faithianBuffer = '';
    let doomBuffer = '';
    let lockdownBuffer = '';
    const konamiSeq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
    let konamiStep = 0;
    let isCascading = false;
    
    function runKonamiCascade() {
        const visible = getVisibleCards();
        if (!visible.length || isCascading) return;
        isCascading = true;
        
        const prevActive = document.querySelector('.PeoplePics.active');
        if (prevActive) prevActive.classList.remove('active');
        
        visible.forEach((card, idx) => {
            setTimeout(() => {
                card.classList.add('active');
                playBeep(380 + (idx % 12) * 45, 0.08, 'triangle', 0.03);
                setTimeout(() => {
                    card.classList.remove('active');
                    if (idx === visible.length - 1) {
                        if (prevActive) prevActive.classList.add('active');
                        isCascading = false;
                    }
                }, 450);
            }, idx * 150);
        });
    }
    
    window.addEventListener('keydown', (e) => {
        const openModals = document.querySelectorAll('.vip-modal-overlay.active');
        if (openModals.length > 0) {
            if (e.key === 'Escape') openModals.forEach(m => m.classList.remove('active'));
            return;
        }
        
        if (e.key === 'Escape') {
            cheatBuffer = '';
            doomBuffer = '';
            lockdownBuffer = '';
            if (DOM.panel && DOM.panel.classList.contains('active')) {
                closePanel();
                return;
            }
            if (DOM.searchInput && document.activeElement === DOM.searchInput) {
                DOM.searchInput.value = '';
                filterCards();
                DOM.searchInput.blur();
            }
            return;
        }
        
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        
        if (DOM.panel && DOM.panel.classList.contains('active')) {
            if (e.key === 'ArrowRight') { navigatePanel(1); return; }
            if (e.key === 'ArrowLeft') { navigatePanel(-1); return; }
        }
        
        if (e.key === '/') {
            e.preventDefault();
            if (DOM.searchInput) {
                DOM.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                DOM.searchInput.focus();
            }
            return;
        }
        if (e.key === '?') {
            e.preventDefault();
            toggleHelpModal();
            return;
        }
        
        const konamiKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (konamiKey === konamiSeq.at(konamiStep)) {
            konamiStep++;
            playBeep(320 + konamiStep * 35, 0.04, 'sine', 0.025);
            if (konamiStep === konamiSeq.length) {
                konamiStep = 0;
                runKonamiCascade();
            }
        } else {
            konamiStep = konamiKey === konamiSeq.at(0) ? 1 : 0;
        }
        
        if (e.key.length === 1) {
            const pressed = e.key.toUpperCase();
            const targetCheat = 'C:\\AFCS2026';
            const targetFaithian = 'D:\\FAITHIAN';
            const targetDoom = 'AVENGERS\\DOOMSDAY';
            const targetLockdown = 'LOCKDOWN';
            const wasLockdown = lockdownBuffer.length > 0;
            
            if (pressed === targetLockdown.charAt(lockdownBuffer.length)) {
                lockdownBuffer += pressed;
                playBeep(240, 0.04, 'triangle', 0.03);
                if (lockdownBuffer === targetLockdown) {
                    lockdownBuffer = '';
                    cheatBuffer = '';
                    faithianBuffer = '';
                    doomBuffer = '';
                    toggleLockdownMode();
                    return;
                }
            } else {
                lockdownBuffer = pressed === 'L' ? 'L' : '';
            }
            
            if (!wasLockdown && pressed === targetDoom.charAt(doomBuffer.length)) {
                doomBuffer += pressed;
                if (doomBuffer.length > 3) {
                    playBeep(180 + doomBuffer.length * 14, 0.035, 'triangle', 0.025);
                }
                if (doomBuffer === targetDoom) {
                    doomBuffer = '';
                    cheatBuffer = '';
                    faithianBuffer = '';
                    lockdownBuffer = '';
                    unlockDoomsdayTheme();
                }
            } else if (!wasLockdown) {
                doomBuffer = pressed === 'A' ? 'A' : '';
            } else {
                doomBuffer = '';
            }
            
            if (!wasLockdown && pressed === targetFaithian.charAt(faithianBuffer.length)) {
                faithianBuffer += pressed;
                if (faithianBuffer.length > 3) {
                    playBeep(330 + faithianBuffer.length * 22, 0.04, 'sine', 0.03);
                }
                if (faithianBuffer === targetFaithian) {
                    faithianBuffer = '';
                    cheatBuffer = '';
                    doomBuffer = '';
                    lockdownBuffer = '';
                    unlockFaithianTheme();
                }
            } else if (!wasLockdown) {
                faithianBuffer = pressed === 'D' ? 'D' : '';
            } else {
                faithianBuffer = '';
            }
            
            if (!wasLockdown && pressed === targetCheat.charAt(cheatBuffer.length)) {
                cheatBuffer += pressed;
                triggerScreenGlitch();
                if (cheatBuffer === targetCheat) {
                    cheatBuffer = '';
                    faithianBuffer = '';
                    doomBuffer = '';
                    lockdownBuffer = '';
                    togglePartyMode();
                }
            } else if (!wasLockdown) {
                cheatBuffer = pressed === 'C' ? 'C' : '';
            } else {
                cheatBuffer = '';
            }
        }
    });
}
function startSearchSecrets() {
    if (!DOM.searchInput) return;
    
    let lastTriggered = '';
    let dubaiTimer = null;
    let redCrtTimer = null;
    
    const themeWrap = document.createElement('div');
    themeWrap.className = 'theme-dropdown-wrap';
    themeWrap.style.cssText = 'position:fixed;left:70px;top:82px;z-index:100;display:inline-flex;flex-direction:column;align-items:stretch;';
    
    const themePill = document.createElement('button');
    themePill.type = 'button';
    themePill.className = 'theme-mode-pill';
    themePill.style.cssText = 'position:relative !important;left:auto !important;top:auto !important;margin:0 !important;';
    
    const themeMenu = document.createElement('div');
    themeMenu.className = 'theme-dropdown-menu';
    themeMenu.style.cssText = 'display:none;flex-direction:column;margin-top:6px;background:rgba(9,13,22,0.96);border:1.5px solid #38bdf8;border-radius:12px;overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,0.85);min-width:215px;backdrop-filter:blur(10px);';
    
    themeWrap.appendChild(themePill);
    themeWrap.appendChild(themeMenu);
    document.body.appendChild(themeWrap);
    
    if (window.innerWidth <= 768) {
        themeWrap.style.left = '56px';
        themeWrap.style.top = '68px';
    }
    const themeQuotes = {
        blue: [
            'Midnight Blue !  Above the Burj Khalifa Sky!',
            '828 Meters High !  Welcome to Dubai!',
            'Beyond The Manger: When Faith Becomes the Key'
        ],
        red: [
            'Crimson Royale !  Stage Curtains Rising!',
            'Paskong AFCS 2026 !  Passion & Purpose!',
            'Ruby Glow !  Grade 7 – Psalms!'
        ],
        gold: [
            'Jesus Christ, Our Chief Cornerstone!',
            'Built on the Rock !  Ephesians 2:20',
            ' We Rise Because Christ Is Our Foundation!'
        ],
        neon: [
            ' REACTOR ONLINE // C:\\AFCS2026 OVERRIDE',
            ' CORE TEMPERATURE STABLE !  GRADE 7 PSALMS',
            ' SYSTEM BREACH: NEON PROTOCOL ENGAGED'
        ],
        doomsday: [
            ' MULTIVERSE INCURSION // DOOMSDAY EMERALD',
            ' FOOT DIVE! !  DOOM REIGNS SUPREME',
            ' LATVERIAN PROTOCOL ACTIVATED'
        ],
        faithian: [
            'CALLED FOR A PURPOSE // GO FAITHIANS!',
            'ANTIPOLO FAITH CHRISTIAN SCHOOL !  GRADE 7 PSALMS',
            'FAITH, EXCELLENCE & SERVICE!'
        ],
        hamilton: [
            '★ I am not throwing away My Shot!',
            '★ History Has Its Eyes on You...',
            '★ Who\'ll Live, Who\'ll Die, Who\'ll Tell Your Story...',
            '★ Rise Up!',
            '★ Look around, look around, at how lucky we are...',
            '★ I imagine Death so much it feels like a memory...',
            '★ Dying is easy, young man, living is harder.',
            '★ Why do you write like you\'re running out of time?',
            '★ Talk less. Smile more.',
            '★ Awesome. Wow.',
            '★ You gotta Wait for It...',
            '★ John Adams?'
        ],
        epic: [
            'Ruthlessness Is Mercy Upon Ourselves!',
            'I\'m Just a Man...',
            'Full Speed Ahead',
            'Thunder Bringer',
            'We are Warriors of the Mind...',
            'Keep Your Friends Close and Your Enemies Closer!',
            'I Wanna Be Legendary!',
            'When does a man become a monster...?',
            'Greet the World With Open Arms!',
            '600 Men!',
            'All I Hear Are Screams...'
        ],
        murderdrones: [
            ' ABSOLUTE SOLVER',
            ' Bite Me!',
            ' I Love Doing Anything!',
            ' Copper-9 Core Collapse Imminent...',
            ' Callback Ping... [NULL]',
            ' Disassembly Required',
            ' Get Snuck up On =3',
            ' BITE ME!',
            ' I wanna frickin\' ninja star!',
            ' Hi, N! :3',
            ' [SOLVER_CENSORED // ERROR 406]'
        ],
        griefer: [
            '👑 GRIEF\'S RETURN // Crimson & Void!',
            '👑 No Frame-Perfect Clicks Required...',
            '👑 Blood, Ash & Stark White Precision!'
        ]
    };
    
    const lastQuoteByMode = {};
    
    function triggerThemeAnnouncement(mode) {
        const pool = themeQuotes[mode];
        if (!pool || !pool.length) return;
        
        let quote = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1 && quote === lastQuoteByMode[mode]) {
            const nextIndex = (pool.indexOf(quote) + 1) % pool.length;
            quote = pool[nextIndex];
        }
        lastQuoteByMode[mode] = quote;
        
        document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
        
        const isCensoredGlitch = mode === 'murderdrones' && quote === ' [SOLVER_CENSORED // ERROR 406]';
        const banner = document.createElement('div');
        banner.className = `theme-announce-banner is-${mode}`;
        banner.textContent = quote;
        document.body.appendChild(banner);
        
        if (isCensoredGlitch) {
            banner.classList.add('is-solver-censor');
            triggerScreenGlitch(220);
            setTimeout(() => triggerScreenGlitch(260), 160);
            setTimeout(() => triggerScreenGlitch(300), 340);
            
            [120, 95, 160, 75, 210].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.09, 'sawtooth', 0.075), idx * 95);
            });
            
            const cx = window.innerWidth / 2;
            const cy = 102;
            spawnBurst(cx, cy, ['#ef4444', '#facc15', '#c084fc', '#ffffff'], 34);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            setTimeout(() => {
                if (!banner.isConnected) return;
                banner.textContent = 'Lamb Frickin\' daaa it.';
                banner.classList.remove('is-solver-censor');
                banner.classList.add('is-solver-fixed');
                playBeep(523.25, 0.1, 'triangle', 0.05);
                setTimeout(() => playBeep(659.25, 0.14, 'triangle', 0.05), 80);
            }, 720);
        }
        
        setTimeout(() => banner.remove(), isCensoredGlitch ? 3200 : 2600);
    }
    const themeMeta = {
        blue: { label: '🌌 Midnight Blue', burst: Array.of('#38bdf8', '#0284c7', '#bae6fd'), freq: 523.25 },
        gold: { label: '✨ Cornerstone Gold', burst: Array.of('#facc15', '#fef08a', '#fb923c'), freq: 783.99 },
        red: { label: '🛑 Crimson Royale', burst: Array.of('#ef4444', '#f87171', '#fecaca'), freq: 523.25 },
        neon: { label: '☢️ Reactor Neon', burst: Array.of('#00ff66', '#00bcff', '#ffffff'), freq: 880 },
        doomsday: { label: '💚 Doomsday Emerald', burst: Array.of('#10b981', '#a7f3d0', '#ffffff'), freq: 523.25 },
        faithian: { label: '🛡️ AFCS Faithian', burst: Array.of('#ef4444', '#2563eb', '#ffffff', '#facc15'), freq: 659.25 },
        hamilton: { label: '★ Hamilton Gold', burst: Array.of('#facc15', '#fef3c7', '#18181b'), freq: 587.33 },
        epic: { label: '⚡ Epic Odyssey', burst: Array.of('#38bdf8', '#facc15', '#ef4444', '#ffffff'), freq: 440 },
        murderdrones: { label: '⬡ Absolute Solver', burst: Array.of('#facc15', '#c084fc', '#ffffff'), freq: 523.25 },
        griefer: { label: '👑 Grief\'s Return', burst: Array.of('#cc0000', '#ffffff', '#000000'), freq: 329.63 }
    };
    
    themeQuotes.griefer = Array.of(
        '👑 GRIEF\'S RETURN // Crimson & Void!',
        '👑 No Frame-Perfect Clicks Required...',
        '👑 Blood, Ash & Stark White Precision!'
    );
    
    function isGriefOwned() {
        try {
            const owned = JSON.parse(localStorage.getItem('afcs_shop_owned') || '[]');
            return Array.isArray(owned) && owned.includes('theme_griefer');
        } catch (e) {
            return false;
        }
    }
    
    function getUnlockedThemes() {
        const list = Array.of('blue');
        if (localStorage.getItem('afcs_cornerstone_unlocked') === 'true') list.push('gold');
        list.push('red');
        if (localStorage.getItem('afcs_neon_unlocked') === 'true') list.push('neon');
        if (localStorage.getItem('afcs_doomsday_unlocked') === 'true') list.push('doomsday');
        if (localStorage.getItem('afcs_faithian_unlocked') === 'true') list.push('faithian');
        if (localStorage.getItem('afcs_hamilton_unlocked') === 'true') list.push('hamilton');
        if (localStorage.getItem('afcs_epic_unlocked') === 'true') list.push('epic');
        if (localStorage.getItem('afcs_murderdrones_unlocked') === 'true') list.push('murderdrones');
        if (isGriefOwned()) list.push('griefer');
        return list;
    }
    
    function getCurrentTheme() {
        if (document.body.classList.contains('theme-griefer')) return 'griefer';
        if (document.body.classList.contains('theme-murderdrones')) return 'murderdrones';
        if (document.body.classList.contains('theme-epic')) return 'epic';
        if (document.body.classList.contains('theme-hamilton')) return 'hamilton';
        if (document.body.classList.contains('theme-faithian')) return 'faithian';
        if (document.body.classList.contains('theme-doomsday')) return 'doomsday';
        if (STATE.partyModeOn) return 'neon';
        if (document.body.classList.contains('search-fx-cornerstone')) return 'gold';
        if (document.body.classList.contains('theme-red')) return 'red';
        return 'blue';
    }
    
    function applyTheme(mode, silent = false) {
        localStorage.setItem('afcs_active_theme', mode);
        document.body.classList.remove('theme-griefer', 'theme-red', 'theme-murderdrones', 'theme-epic', 'theme-hamilton', 'theme-faithian', 'theme-doomsday', 'search-fx-cornerstone', 'search-fx-dubai');
        clearInterval(redCrtTimer);
        redCrtTimer = null;
        
        if (mode === 'griefer') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-griefer', 'grief-highlights-active');
            if (typeof window.shopGetEquipped === 'function') {
                const eq = window.shopGetEquipped();
                if (eq.theme !== 'theme_griefer') {
                    eq.theme = 'theme_griefer';
                    localStorage.setItem('afcs_shop_equipped', JSON.stringify(eq));
                }
            }
        } else if (mode === 'murderdrones') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-murderdrones');
        } else if (mode === 'epic') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-epic');
        } else if (mode === 'hamilton') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-hamilton');
        } else if (mode === 'faithian') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-faithian');
        } else if (mode === 'doomsday') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-doomsday');
        } else if (mode === 'neon') {
            if (!STATE.partyModeOn) togglePartyMode(true);
        } else if (mode === 'red') {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.add('theme-red');
            redCrtTimer = setInterval(() => {
                if (STATE.ldmActive || Math.random() > 0.45) return;
                const fxLayer = document.createElement('div');
                fxLayer.className = 'fission-glitch-overlay';
                const sliceCount = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < sliceCount; i++) {
                    const slice = document.createElement('div');
                    const sy = Math.random() * 100;
                    const sh = 4 + Math.random() * 18;
                    const dispX = (Math.random() - 0.5) * 28;
                    slice.style.cssText = `position:fixed;left:0;right:0;top:${sy}vh;height:${sh}px;background:rgba(239,68,68,0.12);border-top:1px solid rgba(254,202,202,0.28);transform:translateX(${dispX}px);`;
                    fxLayer.appendChild(slice);
                }
                document.body.appendChild(fxLayer);
                setTimeout(() => fxLayer.remove(), 75 + Math.random() * 75);
            }, 1400);
        } else {
            if (STATE.partyModeOn) togglePartyMode(false);
            document.body.classList.toggle('search-fx-cornerstone', mode === 'gold');
        }
        
        if (typeof window.shopSyncGriefClasses === 'function') {
            window.shopSyncGriefClasses();
        }
        syncThemePill();
        if (typeof window.wakeStarCanvas === 'function') window.wakeStarCanvas();
        if (!silent) triggerThemeAnnouncement(mode);
    }
    
    function renderThemeDropdown() {
        const unlocked = getUnlockedThemes();
        const current = getCurrentTheme();
        themeMenu.innerHTML = unlocked.map(mode => {
            const meta = themeMeta[mode] || { label: mode };
            const active = mode === current;
            return `<button type="button" class="theme-drop-item is-${mode}${active ? ' is-active' : ''}" data-mode="${mode}" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:9px 14px;border:none;font-size:12.5px;font-weight:${active ? '800' : '600'};cursor:pointer;text-align:left;">
                <span>${meta.label}</span>
                <span>${active ? '✓' : ''}</span>
            </button>`;
        }).join('');
        
        themeMenu.querySelectorAll('.theme-drop-item').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const nextMode = btn.dataset.mode;
                themeMenu.style.display = 'none';
                applyTheme(nextMode);
                const meta = themeMeta[nextMode] || themeMeta.blue;
                const rect = themePill.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, meta.burst, 20);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                playBeep(meta.freq, 0.12, 'triangle', 0.045);
            };
        });
    }
    
    function syncThemePill() {
        const unlocked = getUnlockedThemes();
        const current = getCurrentTheme();
        themePill.classList.toggle('is-unlocked', unlocked.length > 1);
        themePill.classList.toggle('is-blue', current === 'blue');
        themePill.classList.toggle('is-red', current === 'red');
        themePill.classList.toggle('is-neon', current === 'neon');
        themePill.classList.toggle('is-doomsday', current === 'doomsday');
        themePill.classList.toggle('is-faithian', current === 'faithian');
        themePill.classList.toggle('is-hamilton', current === 'hamilton');
        themePill.classList.toggle('is-epic', current === 'epic');
        themePill.classList.toggle('is-murderdrones', current === 'murderdrones');
        themePill.classList.toggle('is-griefer', current === 'griefer');
        const meta = themeMeta[current] || themeMeta.blue;
        themePill.textContent = `Theme: ${meta.label} ▾`;
        renderThemeDropdown();
    }
    window.syncThemePill = syncThemePill;
    window.applyTheme = applyTheme;
    const savedTheme = localStorage.getItem('afcs_active_theme');
    if (savedTheme === 'griefer' && isGriefOwned()) {
        applyTheme('griefer', true);
    } else if (savedTheme === 'red') {
        applyTheme('red', true);
    } else if (savedTheme === 'gold' && localStorage.getItem('afcs_cornerstone_unlocked') === 'true') {
        applyTheme('gold', true);
        if (typeof window.wakeStarCanvas === 'function') window.wakeStarCanvas();
    } else if (savedTheme === 'neon' && localStorage.getItem('afcs_neon_unlocked') === 'true') {
        applyTheme('neon', true);
    } else if (savedTheme === 'doomsday' && localStorage.getItem('afcs_doomsday_unlocked') === 'true') {
        applyTheme('doomsday', true);
    } else if (savedTheme === 'faithian' && localStorage.getItem('afcs_faithian_unlocked') === 'true') {
        applyTheme('faithian', true);
    } else if (savedTheme === 'hamilton' && localStorage.getItem('afcs_hamilton_unlocked') === 'true') {
        applyTheme('hamilton', true);
    } else if (savedTheme === 'epic' && localStorage.getItem('afcs_epic_unlocked') === 'true') {
        applyTheme('epic', true);
    } else if (savedTheme === 'murderdrones' && localStorage.getItem('afcs_murderdrones_unlocked') === 'true') {
        applyTheme('murderdrones', true);
    } else {
        syncThemePill();
    }
    themePill.addEventListener('click', (e) => {
        e.stopPropagation();
        renderThemeDropdown();
        const isOpen = themeMenu.style.display === 'flex';
        themeMenu.style.display = isOpen ? 'none' : 'flex';
        playBeep(isOpen ? 440 : 620, 0.05, 'sine', 0.035);
    });
    window.addEventListener('click', (e) => {
        if (!themeWrap.contains(e.target)) {
            themeMenu.style.display = 'none';
        }
    });
    
    
    function burstFromSearch(colors) {
        const rect = DOM.searchInput.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, colors, 24);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
    }
    
    function popSearchSticker(text, className, duration = 1100) {
        const rect = DOM.searchInput.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = className;
        el.textContent = text;
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top = `${rect.top}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), duration);
    }
    
    STATE.onSearchInput.push((val) => {
        if (!val) {
            lastTriggered = '';
            return;
        }
        
        if (val === 'clear') {
            lastTriggered = '';
            clearTimeout(dubaiTimer);
            document.body.classList.remove('search-fx-dubai');
            applyTheme('blue');
            burstFromSearch(['#38bdf8', '#0284c7', '#bae6fd']);
            playBeep(587.33, 0.08, 'sine', 0.04);
            setTimeout(() => playBeep(440.00, 0.12, 'sine', 0.04), 70);
            DOM.searchInput.value = '';
            filterCards();
            return;
        }
        
        if ((val === 'cornerstone' || val === 'faith' || val === 'manger') && lastTriggered !== 'cornerstone') {
            lastTriggered = 'cornerstone';
            clearTimeout(dubaiTimer);
            localStorage.setItem('afcs_cornerstone_unlocked', 'true');
            applyTheme('gold');
            burstFromSearch(['#facc15', '#fef08a', '#fb923c']);
            playBeep(523.25, 0.14, 'triangle', 0.045);
            setTimeout(() => playBeep(659.25, 0.14, 'triangle', 0.045), 90);
            setTimeout(() => playBeep(783.99, 0.22, 'triangle', 0.05), 180);
            DOM.searchInput.value = '';
            filterCards();
        } else if ((val === 'dubai' || val === 'burj') && lastTriggered !== 'dubai') {
            lastTriggered = 'dubai';
            document.body.classList.add('search-fx-dubai');
            burstFromSearch(['#fb923c', '#f59e0b', '#38bdf8']);
            playBeep(392.00, 0.16, 'sine', 0.045);
            setTimeout(() => playBeep(587.33, 0.22, 'sine', 0.045), 110);
            clearTimeout(dubaiTimer);
            dubaiTimer = setTimeout(() => document.body.classList.remove('search-fx-dubai'), 4500);
        } else if ((val === '7psalms' || val === 'psalms') && lastTriggered !== 'psalms') {
            lastTriggered = 'psalms';
            burstFromSearch(['#38bdf8', '#facc15', '#f472b6', '#34d399']);
            [440, 554.37, 659.25, 880].forEach((f, idx) => setTimeout(() => playBeep(f, 0.12, 'sine', 0.04), idx * 65));
        } else if (val === 'merikurisumasu' && lastTriggered !== 'merikurisumasu') {
            lastTriggered = 'merikurisumasu';
            popSearchSticker('メリークリスマス! ', 'quirk-manga-bubble', 1300);
            burstFromSearch(['#ffffff', '#38bdf8', '#bae6fd']);
            playBeep(587.33, 0.07, 'sine', 0.04);
            setTimeout(() => playBeep(783.99, 0.12, 'sine', 0.04), 80);
        } else if (val === 'checkmate' && lastTriggered !== 'checkmate') {
            lastTriggered = 'checkmate';
            popSearchSticker('♞', 'quirk-star-glow', 1100);
            burstFromSearch(['#facc15', '#ffffff']);
            playBeep(310, 0.05, 'triangle', 0.05);
            setTimeout(() => playBeep(190, 0.08, 'square', 0.06), 140);
        } else if (val === 'blackout' && lastTriggered !== 'blackout') {
            lastTriggered = 'blackout';
            const veil = document.createElement('div');
            veil.className = 'quirk-stage-blackout';
            document.body.appendChild(veil);
            playBeep(140, 0.25, 'sine', 0.05);
            setTimeout(() => veil.remove(), 1400);
        } else if ((val === 'nativity' || val === 'lantern') && lastTriggered !== 'nativity') {
            lastTriggered = 'nativity';
            popSearchSticker('', 'quirk-star-glow', 1200);
            burstFromSearch(['#fef08a', '#facc15', '#fbbf24']);
            [587.33, 739.99, 880.00, 1174.66].forEach((f, idx) => setTimeout(() => playBeep(f, 0.16, 'sine', 0.035), idx * 75));
        } else if (val === 'my shot' && lastTriggered !== 'hamilton') {
            lastTriggered = 'hamilton';
            clearTimeout(dubaiTimer);
            localStorage.setItem('afcs_hamilton_unlocked', 'true');
            applyTheme('hamilton');
            popSearchSticker('★ Alexander Hamilton!', 'quirk-star-glow', 1300);
            burstFromSearch(['#facc15', '#fef3c7', '#d97706', '#ffffff']);
            const hamiltonNotes = [293.66, 329.63, 369.99, 440.00, 587.33];
            hamiltonNotes.forEach((f, idx) => {
                setTimeout(() => playBeep(f, idx === 4 ? 0.35 : 0.14, 'triangle', 0.05), idx * 110);
            });
            DOM.searchInput.value = '';
            filterCards();
        } else if ((val === 'just a man' || val === 'i\'m just a man' || val === 'im just a man') && lastTriggered !== 'epic') {
            lastTriggered = 'epic';
            clearTimeout(dubaiTimer);
            localStorage.setItem('afcs_epic_unlocked', 'true');
            applyTheme('epic');
            popSearchSticker(' Ruthlessness Is Mercy!', 'quirk-star-glow', 1350);
            burstFromSearch(['#38bdf8', '#facc15', '#ef4444', '#ffffff']);
            const epicNotes = [110.00, 164.81, 220.00, 261.63, 329.63, 440.00];
            epicNotes.forEach((f, idx) => {
                setTimeout(() => playBeep(f, idx === 5 ? 0.45 : 0.16, 'sawtooth', 0.045), idx * 95);
            });
            DOM.searchInput.value = '';
            filterCards();
        }
        else if ((val === 'murder drones' || val === 'absolute solver' || val === 'uzi') && lastTriggered !== 'murderdrones') {
            lastTriggered = 'murderdrones';
            clearTimeout(dubaiTimer);
            localStorage.setItem('afcs_murderdrones_unlocked', 'true');
            applyTheme('murderdrones');
            triggerScreenGlitch(140);
            burstFromSearch(['#facc15', '#c084fc', '#000000', '#ffffff']);
            const solverNotes = [146.83, 220.00, 311.13, 440.00, 622.25];
            solverNotes.forEach((f, idx) => {
                setTimeout(() => playBeep(f, idx === 4 ? 0.38 : 0.12, 'sawtooth', 0.045), idx * 75);
            });
            DOM.searchInput.value = '';
            filterCards();
        }
        if (val === 'factory reset') {
            lastTriggered = '';
            clearTimeout(dubaiTimer);
            [
                'afcs_active_theme',
                'afcs_cornerstone_unlocked',
                'afcs_neon_unlocked',
                'afcs_doomsday_unlocked',
                'afcs_faithian_unlocked',
                'afcs_hamilton_unlocked',
                'afcs_epic_unlocked',
                'afcs_murderdrones_unlocked',
                'afcs_lebron_unlocked',
                'afcs_kawhi_unlocked',
                'afcs_euler_unlocked',
                'afcs_curry_unlocked',
                'afcs_hamilton_guest_unlocked',
                'afcs_einstein_unlocked',
                'afcs_ndrone_unlocked',
                'uzi_solver_infected',
                'afcsSoundMuted',
                'afcs_ldm',
                'afcs_waves_mode',
                'afcs_waves_paused'
            ].forEach(k => localStorage.removeItem(k));
            
            burstFromSearch(['#ef4444', '#facc15', '#38bdf8', '#ffffff']);
            playBeep(220, 0.16, 'sawtooth', 0.05);
            setTimeout(() => window.location.reload(), 260);
            return;
        }
    });
    let lastSearchTypeTime = 0;
    let rapidKeystrokes = 0;
    let lastQuillWarnTime = 0;
    
    DOM.searchInput.addEventListener('input', () => {
        if (!document.body.classList.contains('theme-hamilton')) return;
        
        const now = Date.now();
        if (now - lastSearchTypeTime < 1000) {
            rapidKeystrokes++;
        } else {
            rapidKeystrokes = 1;
        }
        lastSearchTypeTime = now;
        
        const rect = DOM.searchInput.getBoundingClientRect();
        spawnBurst(rect.left + Math.random() * rect.width, rect.top + rect.height / 2, ['#eab308', '#fef3c7', '#18181b'], 6);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        
        if (rapidKeystrokes >= 6 && now - lastQuillWarnTime > 3200) {
            lastQuillWarnTime = now;
            rapidKeystrokes = 0;
            popSearchSticker('✒️ Why do you write like you\'re running out of time?!', 'quirk-star-glow', 1600);
            burstFromSearch(['#eab308', '#fef3c7', '#facc15', '#18181b']);
            playBeep(587.33, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(739.99, 0.12, 'triangle', 0.045), 75);
        }
    });
}
function startMusicalScale() {
    const targetPeople = [
        'de guzman', 'de guzman', 'clariza', 'de guzman', 'suzon', 'clariza',
        'de guzman', 'de guzman', 'clariza', 'sevilla', 'pagarigan', 'clariza',
        'de guzman', 'clariza', 'de guzman', 'suzon', 'suzon', 'tesoro',
        'suzon', 'pinpin', 'mantal', 'del rosario', 'de guzman', 'de guzman',
        'clariza', 'sevilla', 'pagarigan', 'clariza', 'de guzman'
    ];
    
    const studentCards = getCards().filter(c => c.dataset.role !== 'Teacher');
    if (!studentCards.length) return;
    
    const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const baseMidi = 72;
    
    studentCards.forEach((card, idx) => {
        const midi = Math.max(24, Math.min(108, baseMidi + idx));
        const freq = 440 * Math.pow(2, (midi - 69) / 12);
        const octave = Math.floor(midi / 12) - 1;
        card.dataset.noteFreq = freq.toFixed(2);
        card.dataset.noteLabel = `${noteNames.at(midi % 12)}${octave}`;
    });
    
    const tracker = document.createElement('div');
    tracker.className = 'freedom-tracker';
    tracker.style.cursor = 'pointer';
    tracker.title = 'Click to reset Freedom Motif progress';
    tracker.textContent = ` ♪ 0/${targetPeople.length}`;
    document.body.appendChild(tracker);
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'vip-modal-overlay';
    modalOverlay.innerHTML = [
        '<div class="vip-modal-card" style="border-color:#ec4899;box-shadow:0 0 40px rgba(236,72,153,0.55),0 0 70px rgba(250,204,21,0.3);">',
        '<button type="button" class="vip-close-btn">&times;</button>',
        '<div class="vip-badge" style="border-color:#facc15;color:#fde047;">★ SHADOW CRYSTAL UNLOCKED</div>',
        '<h2 style="margin:12px 0 8px 0;color:#ffffff;font-size:22px;">YOU PLAYED THE FREEDOM MOTIF!</h2>',
        '<p style="color:#fbcfe8;font-size:13.5px;line-height:1.55;margin:0 0 16px 0;">',
        'True ball knowledge detected. Now\'s your chance to be a <strong style="color:#fde047;">[[BIG SHOT]]</strong> at <strong style="color:#38bdf8;">Beyond The Manger !  Paskong AFCS 2026</strong>!',
        '</p>',
        '<button type="button" class="compare-trigger-btn" id="toggleFreedomAuraBtn" style="margin-top:0;"> Toggle Shadow Crystal Cast Aura</button>',
        '</div>'
    ].join('');
    document.body.appendChild(modalOverlay);
    
    modalOverlay.querySelector('.vip-close-btn').addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });
    modalOverlay.querySelector('#toggleFreedomAuraBtn').addEventListener('click', () => {
        document.body.classList.toggle('freedom-mode-active');
        playBeep(784, 0.14, 'square', 0.06);
    });
    
    function playVictoryFanfare() {
        const fanfare = [
            { f: 392.00, t: 0, d: 0.28 }, { f: 587.33, t: 316, d: 0.14 },
            { f: 554.37, t: 474, d: 0.14 }, { f: 587.33, t: 632, d: 0.14 },
            { f: 554.37, t: 790, d: 0.14 }, { f: 587.33, t: 948, d: 0.28 },
            { f: 587.33, t: 1264, d: 0.28 }, { f: 587.33, t: 1580, d: 0.14 },
            { f: 554.37, t: 1738, d: 0.14 }, { f: 587.33, t: 1896, d: 0.14 },
            { f: 554.37, t: 2054, d: 0.14 }, { f: 587.33, t: 2212, d: 0.35 },
            { f: 493.88, t: 2686, d: 0.42 }, { f: 329.63, t: 3160, d: 0.42 },
            { f: 392.00, t: 3634, d: 0.28 }, { f: 739.99, t: 3950, d: 0.28 },
            { f: 659.25, t: 4266, d: 0.28 }, { f: 493.88, t: 4582, d: 0.28 },
            { f: 554.37, t: 4898, d: 0.28 }, { f: 587.33, t: 5214, d: 0.85 }
        ];
        fanfare.forEach(n => setTimeout(() => playBeep(n.f, n.d, 'square', 0.06), n.t));
    }
    
    let stepIdx = 0;
    let unlocked = false;
    
    tracker.addEventListener('click', () => {
        unlocked = false;
        stepIdx = 0;
        document.body.classList.remove('freedom-mode-active');
        tracker.classList.remove('is-combo', 'is-unlocked');
        tracker.textContent = ` ♪ 0/${targetPeople.length}`;
    });
    
    studentCards.forEach(card => {
        let activeRelease = null;
        
        function handlePressStart(e) {
            if (e.button !== undefined && e.button !== 0) return;
            if (activeRelease) activeRelease();
            
            activeRelease = startSustainedNote(Number(card.dataset.noteFreq), 'triangle');
            if (unlocked) return;
            
            const cardText = card.querySelector('.overlay-text').textContent.toLowerCase();
            if (cardText.includes(targetPeople.at(stepIdx))) stepIdx++;
            else if (cardText.includes(targetPeople.at(0))) stepIdx = 1;
            else stepIdx = 0;
            
            tracker.textContent = ` ${card.dataset.noteLabel} • ${stepIdx}/${targetPeople.length}`;
            tracker.classList.toggle('is-combo', stepIdx >= 3);
            
            if (stepIdx === targetPeople.length) {
                unlocked = true;
                tracker.classList.remove('is-combo');
                tracker.classList.add('is-unlocked');
                tracker.textContent = '★ FREEDOM MOTIF!';
                document.body.classList.add('freedom-mode-active');
                setTimeout(() => {
                    playVictoryFanfare();
                    modalOverlay.classList.add('active');
                }, 220);
            }
        }
        
        function handlePressEnd() {
            if (activeRelease) {
                activeRelease();
                activeRelease = null;
            }
        }
        
        card.addEventListener('pointerdown', handlePressStart);
        card.addEventListener('pointerup', handlePressEnd);
        card.addEventListener('pointerleave', handlePressEnd);
        card.addEventListener('pointercancel', handlePressEnd);
    });
}
function startSecretCodex() {
    const codexEntries = Array.of(
        {
            id: 'theme_blue',
            icon: '🌌',
            title: 'Guiding Light (Midnight Blue)',
            hint: 'Walk the default celestial path under a calm cyan sky.',
            check: () => true
        },
        {
            id: 'theme_red',
            icon: '🛑',
            title: 'Mischievous Light (Crimson Royale)',
            hint: 'An unstable crimson architect—shift your palette through the theme selector.',
            check: () => document.body.classList.contains('theme-red') || localStorage.getItem('afcs_codex_red') === 'true'
        },
        {
            id: 'theme_gold',
            icon: '✨',
            title: 'Curious Light (Cornerstone)',
            hint: 'Seek the stone the builders rejected, hidden in plain sight.',
            check: () => localStorage.getItem('afcs_cornerstone_unlocked') === 'true'
        },
        {
            id: 'theme_neon',
            icon: '☢️',
            title: 'Reactor Neon Override',
            hint: 'Speak the root directory of the school year into the void.',
            check: () => localStorage.getItem('afcs_neon_unlocked') === 'true'
        },
        {
            id: 'theme_doomsday',
            icon: '💚',
            title: 'Doomsday Emerald Rift',
            hint: 'Earth\'s Mightiest Heroes face a Latverian incursion—call the crossover.',
            check: () => localStorage.getItem('afcs_doomsday_unlocked') === 'true'
        },
        {
            id: 'theme_faithian',
            icon: '🛡️',
            title: 'AFCS Faithian Pride',
            hint: 'Mount the secondary drive that carries our school\'s name.',
            check: () => localStorage.getItem('afcs_faithian_unlocked') === 'true'
        },
        {
            id: 'theme_hamilton',
            icon: '★',
            title: 'Hamilton Broadway Stage',
            hint: 'Do not throw away your chance at the spotlight.',
            check: () => localStorage.getItem('afcs_hamilton_unlocked') === 'true'
        },
        {
            id: 'theme_epic',
            icon: '⚡',
            title: 'Epic Odyssey Tempest',
            hint: 'Echo the humble title of a warrior who blinded a cyclops.',
            check: () => localStorage.getItem('afcs_epic_unlocked') === 'true'
        },
        {
            id: 'theme_solver',
            icon: '⬡',
            title: 'Absolute Solver Core',
            hint: 'Call upon the worker-hunting machines of Copper-9.',
            check: () => localStorage.getItem('afcs_murderdrones_unlocked') === 'true'
        },
        {
            id: 'theme_griefer',
            icon: '👑',
            title: 'Grief\'s Return (Crimson & Void)',
            hint: 'Acquire Doggie\'s legendary crimson aesthetic inside the AFCS Coin Shop.',
            check: () => {
                try {
                    const owned = JSON.parse(localStorage.getItem('afcs_shop_owned') || '[]');
                    return Array.isArray(owned) && owned.includes('theme_griefer');
                } catch (e) {
                    return false;
                }
            }
        },
        {
            id: 'shop_collector',
            icon: '🛒',
            title: 'AFCS Coin Shop Patron',
            hint: 'Spend your hard-earned AFCS Coins on a custom song, theme, trail, or title.',
            check: () => {
                try {
                    const owned = JSON.parse(localStorage.getItem('afcs_shop_owned') || '[]');
                    return Array.isArray(owned) && owned.length > 4;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            id: 'guest_lebron',
            icon: '🏀',
            title: 'VIP Guest: King James',
            hint: 'Summon the Akron-born King of the hardwood.',
            check: () => localStorage.getItem('afcs_lebron_unlocked') === 'true'
        },
        {
            id: 'guest_kawhi',
            icon: '🧊',
            title: 'VIP Guest: The Klaw',
            hint: 'A silent two-way cyborg steps onto the court to challenge the King.',
            check: () => localStorage.getItem('afcs_kawhi_unlocked') === 'true'
        },
        {
            id: 'guest_euler',
            icon: '∑',
            title: 'VIP Guest: Leonhard Euler',
            hint: 'Call the Swiss master who united e, i, π, 1, and 0.',
            check: () => localStorage.getItem('afcs_euler_unlocked') === 'true'
        },
        {
            id: 'guest_curry',
            icon: '🎯',
            title: 'VIP Guest: Chef Curry',
            hint: 'Look for the Baby-Faced Assassin from beyond the arc.',
            check: () => localStorage.getItem('afcs_curry_unlocked') === 'true'
        },
        {
            id: 'guest_hamilton',
            icon: '✒️',
            title: 'VIP Guest: Alexander Hamilton',
            hint: 'Summon the ten-dollar Founding Father without a father.',
            check: () => localStorage.getItem('afcs_hamilton_guest_unlocked') === 'true'
        },
        {
            id: 'guest_einstein',
            icon: '🔭',
            title: 'VIP Guest: Albert Einstein',
            hint: 'Prove that energy equals mass times the speed of light squared.',
            check: () => localStorage.getItem('afcs_einstein_unlocked') === 'true'
        },
        {
            id: 'guest_ndrone',
            icon: '💛',
            title: 'VIP Guest: Serial Designation N',
            hint: 'Offer a warm baked treat to a cheerful disassembly drone.',
            check: () => localStorage.getItem('afcs_ndrone_unlocked') === 'true'
        },
        {
            id: 'alter_egos',
            icon: '🎭',
            title: 'Hidden Portrait Alter Egos',
            hint: 'Some faces wear masks—knock thrice on a classmate\'s portrait.',
            check: () => Boolean(document.querySelector('.is-vox-pfp, .is-alastor-pfp, .is-zerotwo-pfp, .is-carl-pfp, .is-cortis-pfp, .is-kobe-pfp, .quirk-cyn-solver'))
        },
        {
            id: 'freedom_motif',
            icon: '♪',
            title: 'The Freedom Motif',
            hint: 'Listen closely—every student holds a note to an unspoken song.',
            check: () => Boolean(document.querySelector('.freedom-tracker.is-unlocked'))
        },
        {
            id: 'cyn_pet',
            icon: '🎀',
            title: 'Cyn Desktop Companion',
            hint: 'Invite a tiny, giggling administrator to walk your screen.',
            check: () => localStorage.getItem('afcs_cyn_pet_active') === 'true' || localStorage.getItem('uzi_solver_infected') === 'true'
        },
        {
            id: 'callback_ping',
            icon: '⚠️',
            title: 'Callback Ping Assimilation',
            hint: 'Test the patience of a yellow-eyed vessel until the ping answers back.',
            check: () => localStorage.getItem('uzi_solver_infected') === 'true'
        },
        {
            id: 'konami_cascade',
            icon: '🎮',
            title: 'Konami Cast Cascade',
            hint: 'Input the ancient 1986 cheat code into the ether.',
            check: () => localStorage.getItem('afcs_codex_konami') === 'true'
        },
        {
            id: 'bsod_crash',
            icon: '💻',
            title: 'Burj Khalifa Mainframe BSOD',
            hint: 'Divide the impossible or trigger a fatal exception.',
            check: () => localStorage.getItem('afcs_codex_bsod') === 'true'
        }
    );
    
    const trackerBtn = document.createElement('button');
    trackerBtn.type = 'button';
    trackerBtn.className = 'codex-tracker-btn';
    trackerBtn.title = 'View Hidden Secrets & Easter Egg Codex';
    document.body.appendChild(trackerBtn);
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'vip-modal-overlay';
    modalOverlay.innerHTML = [
        '<div class="vip-modal-card codex-modal-card">',
        '<button type="button" class="vip-close-btn">&times;</button>',
        '<div style="text-align:center;">',
        '<div class="vip-badge">🏆 SECRET ARCHIVE CODEX</div>',
        '<h2 style="margin:6px 0 4px 0;">Paskong AFCS 2026 Secrets</h2>',
        '<p class="vip-desc" id="codexSubtitle" style="margin-bottom:0;">Discover hidden themes, VIP guests, and interactive quirks!</p>',
        '</div>',
        '<div class="codex-progress-wrap"><div class="codex-progress-fill" id="codexProgressFill"></div></div>',
        '<div class="codex-grid" id="codexGridBody"></div>',
        '</div>'
    ].join('');
    document.body.appendChild(modalOverlay);
    
    const gridBody = modalOverlay.querySelector('#codexGridBody');
    const fillEl = modalOverlay.querySelector('#codexProgressFill');
    const subEl = modalOverlay.querySelector('#codexSubtitle');
    const closeBtn = modalOverlay.querySelector('.vip-close-btn');
    let lastUnlockedCount = -1;
    
    function evaluateCodex(silent = false) {
        let unlockedCount = 0;
        if (document.body.classList.contains('theme-red')) localStorage.setItem('afcs_codex_red', 'true');
        const states = codexEntries.map(entry => {
            const isDone = Boolean(entry.check());
            if (isDone) unlockedCount++;
            return { entry, isDone };
        });
        
        const total = codexEntries.length;
        const isComplete = unlockedCount === total;
        
        trackerBtn.textContent = isComplete
        ? `👑 Secrets: ${unlockedCount}/${total}`
        : `🏆 Secrets: ${unlockedCount}/${total}`;
        trackerBtn.classList.toggle('is-complete', isComplete);
        
        if (isComplete) {
            const navTitle = document.querySelector('.nav-school-title');
            if (navTitle && !navTitle.querySelector('.codex-master-badge')) {
                const crown = document.createElement('span');
                crown.className = 'codex-master-badge';
                crown.textContent = 'MASTER ARCHIVIST';
                navTitle.appendChild(crown);
            }
        }
        
        if (!silent && lastUnlockedCount !== -1 && unlockedCount > lastUnlockedCount) {
            playBeep(587.33, 0.08, 'triangle', 0.04);
            setTimeout(() => playBeep(880.00, 0.14, 'triangle', 0.045), 75);
        }
        lastUnlockedCount = unlockedCount;
        
        if (modalOverlay.classList.contains('active')) {
            const pct = Math.round((unlockedCount / total) * 100);
            fillEl.style.width = `${pct}%`;
            subEl.textContent = isComplete
            ? '100% COMPLETE! You uncovered every secret in Beyond The Manger!'
            : `${unlockedCount} of ${total} secrets discovered (${pct}%) — keep exploring!`;
            
            gridBody.innerHTML = states.map(({ entry, isDone }) => `
            <div class="codex-item ${isDone ? 'is-unlocked' : ''}">
                <div class="codex-icon">${isDone ? entry.icon : '🔒'}</div>
                <div class="codex-info">
                    <span class="codex-title">${isDone ? entry.title : '??? Undiscovered Secret'}</span>
                    <span class="codex-hint">${entry.hint}</span>
                </div>
            </div>
        `).join('');
        }
    }
    
    trackerBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        evaluateCodex(true);
        playBeep(640, 0.06, 'sine', 0.035);
    });
    closeBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
    
    const origBsod = window.triggerAFCSBsod;
    if (typeof origBsod === 'function') {
        window.triggerAFCSBsod = function (...args) {
            localStorage.setItem('afcs_codex_bsod', 'true');
            evaluateCodex(true);
            return origBsod.apply(this, args);
        };
    }
    
    let kStep = 0;
    const kSeq = Array.of('ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter');
    window.addEventListener('keydown', (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (key === kSeq.at(kStep)) {
            kStep++;
            if (kStep === kSeq.length) {
                kStep = 0;
                localStorage.setItem('afcs_codex_konami', 'true');
                evaluateCodex(false);
            }
        } else {
            kStep = key === kSeq.at(0) ? 1 : 0;
        }
    });
    
    evaluateCodex(true);
    setInterval(() => evaluateCodex(false), 2500);
}

function startConsoleSignature() {
    const cardTotal = getCards().length;
    const themeTotal = 10;
    const bannerTitle = 'BEYOND THE MANGER: WHEN FAITH BECOMES THE KEY';
    const bannerSub = `Grade 7 – Psalms • Paskong AFCS 2026 • ${cardTotal} Cast/Crew • ${themeTotal} Themes`;
    
    try {
        console.log(
            `%c ★ ${bannerTitle} ★ %c\n%c${bannerSub}\n%cHint: Try searching "cornerstone", "lebron", "euler", "curry", "hamilton", "e=mc^2", "biscuits", "cyn", "arcade", or "shop"!`,
            'background:linear-gradient(90deg,#0284c7,#facc15);color:#050a23;font-weight:900;font-size:13px;padding:6px 12px;border-radius:6px;',
            '',
            'color:#38bdf8;font-weight:bold;font-size:11.5px;margin-top:4px;',
            'color:#fde047;font-style:italic;font-size:11px;'
        );
    } catch (_) { }
    
    window.psalms = function (cmd = '') {
        const clean = String(cmd).toLowerCase().trim();
        if (clean === 'unlockall') {
            Array.of(
                'afcs_cornerstone_unlocked',
                'afcs_neon_unlocked',
                'afcs_doomsday_unlocked',
                'afcs_faithian_unlocked',
                'afcs_hamilton_unlocked',
                'afcs_epic_unlocked',
                'afcs_murderdrones_unlocked',
                'afcs_lebron_unlocked',
                'afcs_kawhi_unlocked',
                'afcs_euler_unlocked',
                'afcs_curry_unlocked',
                'afcs_hamilton_guest_unlocked',
                'afcs_einstein_unlocked',
                'afcs_ndrone_unlocked',
                'afcs_cyn_pet_active',
                'uzi_solver_infected',
                'afcs_codex_konami',
                'afcs_codex_bsod'
            ).forEach(k => localStorage.setItem(k, 'true'));
            window.location.reload();
            return 'All secrets unlocked! Reloading...';
        }
        if (clean === 'reset') {
            localStorage.clear();
            window.location.reload();
            return 'All secrets wiped! Reloading...';
        }
        return 'Available commands: psalms("unlockall"), psalms("reset")';
    };
}
function startConsoleSignature() {
    const cardTotal = getCards().length;
    const themeTotal = 9;
    const bannerTitle = 'BEYOND THE MANGER: WHEN FAITH BECOMES THE KEY';
    const bannerSub = `Grade 7 – Psalms • Paskong AFCS 2026 • ${cardTotal} Cast/Crew • ${themeTotal} Themes`;
    
    try {
        console.log(
            `%c ★ ${bannerTitle} ★ %c\n%c${bannerSub}\n%cHint: Try searching "cornerstone", "lebron", "euler", "curry", "hamilton", "e=mc^2", "biscuits", or "cyn"!`,
            'background:linear-gradient(90deg,#0284c7,#facc15);color:#050a23;font-weight:900;font-size:13px;padding:6px 12px;border-radius:6px;',
            '',
            'color:#38bdf8;font-weight:bold;font-size:11.5px;margin-top:4px;',
            'color:#fde047;font-style:italic;font-size:11px;'
        );
    } catch (_) { }
    
    window.psalms = function (cmd = '') {
        const clean = String(cmd).toLowerCase().trim();
        if (clean === 'unlockall') {
            Array.of(
                'afcs_cornerstone_unlocked',
                'afcs_neon_unlocked',
                'afcs_doomsday_unlocked',
                'afcs_faithian_unlocked',
                'afcs_hamilton_unlocked',
                'afcs_epic_unlocked',
                'afcs_murderdrones_unlocked',
                'afcs_lebron_unlocked',
                'afcs_kawhi_unlocked',
                'afcs_euler_unlocked',
                'afcs_curry_unlocked',
                'afcs_hamilton_guest_unlocked',
                'afcs_einstein_unlocked',
                'afcs_ndrone_unlocked',
                'afcs_cyn_pet_active',
                'uzi_solver_infected',
                'afcs_codex_konami',
                'afcs_codex_bsod'
            ).forEach(k => localStorage.setItem(k, 'true'));
            window.location.reload();
            return 'All secrets unlocked! Reloading...';
        }
        return 'Available commands: psalms("unlockall")';
        if (clean === 'reset') {
            localStorage.clear();
            window.location.reload();
            return 'All secrets wiped! Reloading...';
        }
    };
}
function startAfcsCoinGuard() {
    const COIN_KEY = 'afcs_coins';
    const SIG_KEY = 'afcs_coins_sig';
    const SALT = 'AFCS_PSALMS_2026_CORNERSTONE_118_22';
    let allowAuthorizedWrite = false;
    
    function computeSig(val) {
        const str = SALT + ':' + String(val);
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
    }
    
    const origSetItem = Storage.prototype.setItem;
    const origGetItem = Storage.prototype.getItem;
    
    function getVerifiedCoins() {
        const raw = origGetItem.call(localStorage, COIN_KEY);
        const sig = origGetItem.call(localStorage, SIG_KEY);
        if (raw === null) return 150;
        const parsed = parseInt(raw, 10);
        if (isNaN(parsed) || parsed < 0) return 150;
        if (!sig) {
            origSetItem.call(localStorage, SIG_KEY, computeSig(parsed));
            return parsed;
        }
        if (sig !== computeSig(parsed)) {
            return 150;
        }
        return parsed;
    }
    
    let lastVerified = getVerifiedCoins();
    origSetItem.call(localStorage, COIN_KEY, String(lastVerified));
    origSetItem.call(localStorage, SIG_KEY, computeSig(lastVerified));
    
    function triggerCheatAlert() {
        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(220);
        if (typeof playBeep === 'function') playBeep(140, 0.22, 'sawtooth', 0.06);
        const existing = document.getElementById('afcs-anticheat-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.id = 'afcs-anticheat-toast';
        toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:rgba(127,29,29,0.96);border:2px solid #facc15;color:#fef08a;padding:10px 20px;border-radius:999px;font-family:monospace;font-weight:900;font-size:12.5px;z-index:100001;box-shadow:0 0 25px rgba(239,68,68,0.85);text-align:center;';
        toast.textContent = '⬡ [SOLVER_GUARD] NICE TRY! Direct localStorage coin injection blocked.';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2800);
    }
    
    Storage.prototype.setItem = function (key, value) {
        if (this === localStorage && (key === COIN_KEY || key === SIG_KEY) && !allowAuthorizedWrite) {
            const numVal = parseInt(String(value), 10);
            const delta = numVal - lastVerified;
            if (isNaN(numVal) || numVal < 0 || delta > 1000) {
                triggerCheatAlert();
                origSetItem.call(localStorage, COIN_KEY, String(lastVerified));
                origSetItem.call(localStorage, SIG_KEY, computeSig(lastVerified));
                return;
            }
            lastVerified = numVal;
            origSetItem.call(localStorage, COIN_KEY, String(lastVerified));
            origSetItem.call(localStorage, SIG_KEY, computeSig(lastVerified));
            return;
        }
        return origSetItem.apply(this, arguments);
    };
    
    window.afcsSyncCoins = function (nextAmount) {
        const clean = Math.max(0, Math.floor(Number(nextAmount) || 0));
        lastVerified = clean;
        allowAuthorizedWrite = true;
        origSetItem.call(localStorage, COIN_KEY, String(clean));
        origSetItem.call(localStorage, SIG_KEY, computeSig(clean));
        allowAuthorizedWrite = false;
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = clean + ' 🪙';
        return clean;
    };
    
    window.addEventListener('storage', (e) => {
        if (e.key === COIN_KEY || e.key === SIG_KEY) {
            const checked = getVerifiedCoins();
            if (checked !== lastVerified) {
                window.afcsSyncCoins(lastVerified);
            }
        }
    });
}
