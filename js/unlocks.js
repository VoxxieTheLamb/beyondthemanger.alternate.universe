//#region Extra Glue For Code
    function startCornerstoneShimmer() {
        [document.querySelector('.center-text'), document.querySelector('.theme-banner')]
        .filter(Boolean)
        .forEach(el => {
            el.style.cursor = 'pointer';
            el.style.userSelect = 'none';
            
            el.addEventListener('click', (e) => {
                if (!e._isTripleTap && e.detail !== 3) return;
                const banner = document.querySelector('.theme-banner');
                if (banner) {
                    banner.classList.remove('cornerstone-shimmer');
                    void banner.offsetWidth;
                    banner.classList.add('cornerstone-shimmer');
                }
                playBeep(523.25, 0.14, 'triangle', 0.045);
                setTimeout(() => playBeep(659.25, 0.14, 'triangle', 0.045), 90);
                setTimeout(() => playBeep(783.99, 0.24, 'triangle', 0.05), 180);
                spawnBurst(e.clientX, e.clientY, ['#facc15', '#fef08a'], 24);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            });
        });
    }
    function unlockDoomsdayTheme() {
        localStorage.setItem('afcs_doomsday_unlocked', 'true');
        if (typeof window.applySecretTheme === 'function') {
            window.applySecretTheme('doomsday');
        } else {
            document.body.classList.remove('search-fx-cornerstone', 'search-fx-dubai', 'party-mode');
            document.body.classList.add('theme-doomsday');
        }
        
        const banner = document.createElement('div');
        banner.className = 'doomsday-unlock-banner';
        banner.textContent = ' MULTIVERSE INCURSION UNLOCKED // DOOMSDAY EMERALD';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2800);
        
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        STATE.particles.push({
            type: 'SHOCKWAVE',
            x: cx,
            y: cy,
            radius: 10,
            maxRadius: Math.max(cx, cy) * 0.85,
            alpha: 1.0,
            color: '#10b981'
        });
        spawnBurst(cx, cy, ['#10b981', '#a7f3d0', '#e2e8f0', '#facc15'], 48);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        
        const doomChord = [73.42, 110.00, 146.83, 174.61, 293.66];
        doomChord.forEach((freq, idx) => {
            setTimeout(() => playBeep(freq, 0.65, 'sawtooth', 0.045), idx * 95);
        });
    }
    function unlockFaithianTheme() {
        localStorage.setItem('afcs_faithian_unlocked', 'true');
        if (typeof window.applySecretTheme === 'function') {
            window.applySecretTheme('faithian');
        } else {
            document.body.classList.remove('search-fx-cornerstone', 'search-fx-dubai', 'party-mode', 'theme-doomsday');
            document.body.classList.add('theme-faithian');
        }
        
        const banner = document.createElement('div');
        banner.className = 'faithian-unlock-banner';
        banner.textContent = ' CALLED FOR A PURPOSE // AFCS FAITHIAN THEME UNLOCKED';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2800);
        
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        STATE.particles.push({
            type: 'SHOCKWAVE',
            x: cx,
            y: cy,
            radius: 10,
            maxRadius: Math.max(cx, cy) * 0.85,
            alpha: 1.0,
            color: '#ef4444'
        });
        spawnBurst(cx, cy, ['#ef4444', '#2563eb', '#ffffff', '#facc15'], 48);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        
        const faithianChord = [261.63, 329.63, 392.00, 523.25, 659.25];
        faithianChord.forEach((freq, idx) => {
            setTimeout(() => playBeep(freq, 0.55, 'triangle', 0.045), idx * 85);
        });
    }
    function startHiddenBugBSOD() {
        let bsodActive = false;
        
        function playPowerDownAudio() {
            if (STATE.soundMuted) return;
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                
                const now = ctx.currentTime;
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const filter = ctx.createBiquadFilter();
                const gain = ctx.createGain();
                
                osc1.type = 'square';
                osc1.frequency.setValueAtTime(90, now);
                osc1.frequency.linearRampToValueAtTime(30, now + 1.8);
                
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(93, now);
                osc2.frequency.linearRampToValueAtTime(31, now + 1.8);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, now);
                
                gain.gain.setValueAtTime(0.32, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
                
                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 1.8);
                osc2.stop(now + 1.8);
            } catch (_) { }
        }
        
        function enterTrueFullscreen(el) {
            try {
                const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (req) {
                    const promise = req.call(el);
                    if (promise && typeof promise.catch === 'function') {
                        promise.catch(() => { });
                    }
                }
            } catch (_) { }
        }
        
        function exitTrueFullscreen() {
            try {
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
                    if (exit) {
                        const promise = exit.call(document);
                        if (promise && typeof promise.catch === 'function') {
                            promise.catch(() => { });
                        }
                    }
                }
            } catch (_) { }
        }
        
        function createQrMatrix(size = 21) {
            const grid = Array.from({ length: size }, () => Array(size).fill(false));
            function placeFinder(ox, oy) {
                for (let y = 0; y < 7; y++) {
                    for (let x = 0; x < 7; x++) {
                        const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
                        const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                        grid[oy + y][ox + x] = isBorder || isCenter;
                    }
                }
            }
            placeFinder(0, 0);
            placeFinder(size - 7, 0);
            placeFinder(0, size - 7);
            
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const inTopLeft = x < 8 && y < 8;
                    const inTopRight = x >= size - 8 && y < 8;
                    const inBottomLeft = x < 8 && y >= size - 8;
                    if (!inTopLeft && !inTopRight && !inBottomLeft) {
                        grid[y][x] = Math.random() < 0.48;
                    }
                }
            }
            return grid;
        }
        
        function drawQrCode(ctx, x, y, boxSize, matrix) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y, boxSize, boxSize);
            
            const pad = boxSize * 0.08;
            const inner = boxSize - pad * 2;
            const cell = inner / matrix.length;
            
            ctx.fillStyle = '#0078D7';
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix.length; c++) {
                    if (matrix[r][c]) {
                        ctx.fillRect(
                            x + pad + c * cell,
                            y + pad + r * cell,
                            Math.ceil(cell),
                            Math.ceil(cell)
                        );
                    }
                }
            }
        }
        function triggerAFCSBsod(rareStopCode = 'BURJ_KHALIFA_MAINFRAME_FAULT', rareFailedWhat = 'BEYOND_THE_MANGER_0x00F155104', forceRare = false) {
            if (bsodActive) return;
            bsodActive = true;
            localStorage.setItem('afcs_codex_bsod', 'true');
            
            const isRareBurj = forceRare || Math.random() < 0.01;
            const realCodes = [
                { stop: 'CRITICAL_PROCESS_DIED', failed: 'ntoskrnl.exe' },
                { stop: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED', failed: 'win32kfull.sys' },
                { stop: 'IRQL_NOT_LESS_OR_EQUAL', failed: 'dxgkrnl.sys' },
                { stop: 'MEMORY_MANAGEMENT', failed: 'ntoskrnl.exe' },
                { stop: 'PAGE_FAULT_IN_NONPAGED_AREA', failed: 'nvlddmkm.sys' }
            ];
            const pickedReal = realCodes[Math.floor(Math.random() * realCodes.length)];
            
            const headline1 = isRareBurj
            ? 'Your Burj Khalifa showcase ran into a problem and needs to restart. We\'re'
            : 'Your device ran into a problem and needs to restart. We\'re';
            const headline2 = 'just collecting some error info, and then we\'ll restart for you.';
            const infoUrl = isRareBurj
            ? 'For more information about this issue and possible fixes, visit https://afcs.edu.ph'
            : 'For more information about this issue and possible fixes, visit https://windows.com';
            const supportPrompt = isRareBurj
            ? 'If you call Grade 7 – Psalms Tech Team, give them this info:'
            : 'If you call a support person, give them this info:';
            const finalStopCode = isRareBurj ? rareStopCode : pickedReal.stop;
            const finalFailedWhat = isRareBurj ? rareFailedWhat : pickedReal.failed;
            
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            
            enterTrueFullscreen(document.documentElement);
            
            triggerScreenGlitch(140);
            const meltdownInterval = setInterval(() => {
                triggerScreenGlitch(70 + Math.random() * 110);
                if (Math.random() < 0.45) {
                    document.body.classList.add('quirk-bomb-shake');
                    setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 220);
                }
            }, 240);
            
            setTimeout(() => {
                clearInterval(meltdownInterval);
                document.body.classList.remove('quirk-bomb-shake');
                
                const canvas = document.createElement('canvas');
                canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;cursor:none;';
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                document.body.appendChild(canvas);
                
                const ctx = canvas.getContext('2d');
                const qrMatrix = createQrMatrix(21);
                let bsodCounter = 0;
                let lastTime = performance.now();
                let pauseRemaining = 0;
                let stallCooldown = 1.2;
                
                playPowerDownAudio();
                
                function handleResize() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
                window.addEventListener('resize', handleResize);
                
                function renderBsod(now) {
                    const dt = Math.min((now - lastTime) / 1000, 0.1);
                    lastTime = now;
                    
                    if (pauseRemaining > 0) {
                        pauseRemaining -= dt;
                    } else {
                        stallCooldown -= dt;
                        if (bsodCounter > 15 && bsodCounter < 95 && stallCooldown <= 0 && Math.random() < 0.025) {
                            pauseRemaining = 0.35 + Math.random() * 0.45;
                            stallCooldown = 1.6;
                        } else if (bsodCounter < 100) {
                            bsodCounter += 26 * dt;
                        }
                    }
                    
                    const displayPercent = Math.min(100, Math.floor(bsodCounter));
                    
                    ctx.fillStyle = '#0078D7';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    
                    const scale = Math.max(canvas.width / 1320, 0.55);
                    const marginX = canvas.width * 0.12;
                    let currentY = canvas.height * 0.17;
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = `${120 * scale}px "Segoe UI", sans-serif`;
                    ctx.fillText(':(', marginX, currentY);
                    
                    currentY += 150 * scale;
                    ctx.font = `${22 * scale}px "Segoe UI", sans-serif`;
                    ctx.fillText(headline1, marginX, currentY);
                    
                    currentY += 35 * scale;
                    ctx.fillText(headline2, marginX, currentY);
                    
                    currentY += 55 * scale;
                    ctx.fillText(`${displayPercent}% complete`, marginX, currentY);
                    
                    currentY += 65 * scale;
                    const qrSize = 108 * scale;
                    drawQrCode(ctx, marginX, currentY, qrSize, qrMatrix);
                    
                    const textX = marginX + qrSize + 22 * scale;
                    let detailsY = currentY;
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = `${13 * scale}px "Segoe UI", sans-serif`;
                    ctx.fillText(infoUrl, textX, detailsY);
                    
                    detailsY += 32 * scale;
                    ctx.fillText(supportPrompt, textX, detailsY);
                    
                    detailsY += 24 * scale;
                    ctx.fillText(`Stop code: ${finalStopCode}`, textX, detailsY);
                    
                    detailsY += 20 * scale;
                    ctx.fillText(`What failed: ${finalFailedWhat}`, textX, detailsY);
                    
                    if (displayPercent >= 100) {
                        setTimeout(() => {
                            exitTrueFullscreen();
                            window.removeEventListener('resize', handleResize);
                            canvas.remove();
                            document.body.style.overflow = prevOverflow;
                            bsodActive = false;
                            playBeep(523.25, 0.12, 'sine', 0.05);
                            setTimeout(() => playBeep(659.25, 0.18, 'sine', 0.05), 90);
                        }, 850);
                        return;
                    }
                    
                    requestAnimationFrame(renderBsod);
                }
                
                requestAnimationFrame(renderBsod);
            }, 6000);
        }
        
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                const val = DOM.searchInput.value.toLowerCase().trim();
                if (val === 'bug' || val === 'crash' || val === '0/0') {
                    e.preventDefault();
                    DOM.searchInput.value = '';
                    filterCards();
                    
                    try {
                        const reactorCore = null;
                        reactorCore.igniteFissionMania();
                    } catch (err) {
                        const code = val === '0/0' ? 'CRITICAL_DIVISION_BY_ZERO' : 'UNCAUGHT_FISSION_EXCEPTION';
                        triggerAFCSBsod(code, `${err.name.toUpperCase()}_0x00F155104`, false);
                    }
                }
            });
        }
        
        const footerCredits = document.querySelector('.footer-credits');
        if (footerCredits) {
            footerCredits.style.cursor = 'pointer';
            footerCredits.addEventListener('click', (e) => {
                if (e.detail === 5) {
                    try {
                        JSON.parse('{ broken_stage_cue: true ');
                    } catch (err) {
                        triggerAFCSBsod('STAGE_SCRIPT_SYNTAX_OVERFLOW', 'PLAYBILL_PARSER_0x007PSALMS', false);
                    }
                }
            });
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                try {
                    const burjReactor = null;
                    burjReactor.forceEasterEgg();
                } catch (err) {
                    triggerAFCSBsod('BURJ_KHALIFA_MAINFRAME_FAULT', 'BEYOND_THE_MANGER_0x00F155104', true);
                }
            }
        });
        window.triggerAFCSBsod = triggerAFCSBsod;
    }
    function startDoomsdayRift() {
        const crackLayer = document.createElement('div');
        crackLayer.className = 'doomsday-crack-layer stage-0';
        const svgNS = 'http://www.w3.org/2000/svg';
        const svgEl = document.createElementNS(svgNS, 'svg');
        svgEl.setAttribute('viewBox', '0 0 1000 1000');
        svgEl.setAttribute('preserveAspectRatio', 'none');
        crackLayer.appendChild(svgEl);
        document.body.prepend(crackLayer);
        
        let crackStage = 0;
        let stageGroups = [];
        
        function buildProceduralFracture() {
            svgEl.innerHTML = '';
            stageGroups = Array.of();
            for (let i = 0; i < 9; i++) {
                const g = document.createElementNS(svgNS, 'g');
                g.style.display = 'none';
                svgEl.appendChild(g);
                stageGroups.push(g);
            }
            
            const originX = 180 + Math.random() * 640;
            const originY = 160 + Math.random() * 680;
            const rayCount = 14;
            const ringRadii = Array.of(75, 165, 270, 390, 525, 680, 860, 1080, 1360);
            const rayNodes = Array.of();
            
            for (let r = 0; r < rayCount; r++) {
                const baseAngle = (r / rayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.24;
                let curX = originX;
                let curY = originY;
                const nodes = Array.of({ x: originX, y: originY });
                
                for (let s = 0; s <= 8; s++) {
                    const targetDist = ringRadii.at(s) + (Math.random() - 0.5) * 28;
                    const jitterAngle = baseAngle + (Math.random() - 0.5) * 0.22;
                    const nextX = originX + Math.cos(jitterAngle) * targetDist;
                    const nextY = originY + Math.sin(jitterAngle) * targetDist;
                    
                    const d = `M ${curX.toFixed(1)} ${curY.toFixed(1)} L ${nextX.toFixed(1)} ${nextY.toFixed(1)}`;
                    const outer = document.createElementNS(svgNS, 'path');
                    outer.setAttribute('class', 'doomsday-crack-path');
                    outer.setAttribute('stroke-width', (2 + s * 0.65).toFixed(1));
                    outer.setAttribute('d', d);
                    
                    const core = document.createElementNS(svgNS, 'path');
                    core.setAttribute('class', 'doomsday-crack-core');
                    core.setAttribute('stroke-width', (0.7 + s * 0.25).toFixed(1));
                    core.setAttribute('d', d);
                    
                    stageGroups.at(s).appendChild(outer);
                    stageGroups.at(s).appendChild(core);
                    
                    if (s >= 2 && Math.random() < 0.65) {
                        const subAngle = jitterAngle + (Math.random() < 0.5 ? 0.55 : -0.55);
                        const subLen = 45 + s * 18;
                        const subX = nextX + Math.cos(subAngle) * subLen;
                        const subY = nextY + Math.sin(subAngle) * subLen;
                        const subD = `M ${nextX.toFixed(1)} ${nextY.toFixed(1)} L ${subX.toFixed(1)} ${subY.toFixed(1)}`;
                        
                        const subOuter = document.createElementNS(svgNS, 'path');
                        subOuter.setAttribute('class', 'doomsday-crack-path');
                        subOuter.setAttribute('stroke-width', (1.4 + s * 0.35).toFixed(1));
                        subOuter.setAttribute('d', subD);
                        stageGroups.at(s).appendChild(subOuter);
                    }
                    
                    curX = nextX;
                    curY = nextY;
                    nodes.push({ x: curX, y: curY });
                }
                rayNodes.push(nodes);
            }
            
            for (let s = 1; s <= 8; s++) {
                for (let r = 0; r < rayCount; r++) {
                    if (s < 7 && Math.random() > 0.72) continue;
                    const p1 = rayNodes.at(r).at(s);
                    const p2 = rayNodes.at((r + 1) % rayCount).at(s);
                    const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 18;
                    const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 18;
                    const webD = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${midX.toFixed(1)} ${midY.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
                    
                    const webOuter = document.createElementNS(svgNS, 'path');
                    webOuter.setAttribute('class', 'doomsday-crack-path');
                    webOuter.setAttribute('stroke-width', (1.2 + s * 0.4).toFixed(1));
                    webOuter.setAttribute('d', webD);
                    
                    const webCore = document.createElementNS(svgNS, 'path');
                    webCore.setAttribute('class', 'doomsday-crack-core');
                    webCore.setAttribute('stroke-width', (0.4 + s * 0.16).toFixed(1));
                    webCore.setAttribute('d', webD);
                    
                    stageGroups.at(s).appendChild(webOuter);
                    stageGroups.at(s).appendChild(webCore);
                }
            }
            
            for (let k = 0; k < 18; k++) {
                const ang = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * 520;
                const sx = originX + Math.cos(ang) * dist;
                const sy = originY + Math.sin(ang) * dist;
                const sz = 14 + Math.random() * 26;
                const shard = document.createElementNS(svgNS, 'polygon');
                shard.setAttribute('points', `${sx.toFixed(1)},${(sy - sz).toFixed(1)} ${(sx + sz * 0.85).toFixed(1)},${(sy + sz * 0.6).toFixed(1)} ${(sx - sz * 0.75).toFixed(1)},${(sy + sz * 0.4).toFixed(1)}`);
                shard.setAttribute('fill', 'rgba(167, 243, 208, 0.14)');
                shard.setAttribute('stroke', '#ecfdf5');
                shard.setAttribute('stroke-width', '1.2');
                stageGroups.at(8).appendChild(shard);
            }
        }
        
        function syncCrackVisuals() {
            crackLayer.className = `doomsday-crack-layer stage-${crackStage}`;
            Array.from(svgEl.children).forEach((g, idx) => {
                if (g && g.style) {
                    g.style.display = idx <= crackStage ? 'block' : 'none';
                }
            });
        }
        
        buildProceduralFracture();
        syncCrackVisuals();
        
        function escalateCrack() {
            if (!document.body.classList.contains('theme-doomsday')) return;
            
            if (crackStage < 8) {
                crackStage++;
                syncCrackVisuals();
                triggerScreenGlitch(110 + crackStage * 18);
                playBeep(85 + crackStage * 18, 0.28, 'sawtooth', 0.055);
                spawnBurst(window.innerWidth * (0.25 + Math.random() * 0.5), window.innerHeight * (0.25 + Math.random() * 0.5), ['#10b981', '#a7f3d0', '#ffffff'], 18 + crackStage * 3);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            } else {
                crackStage = 0;
                buildProceduralFracture();
                syncCrackVisuals();
                if (typeof window.applyTheme === 'function') {
                    window.applyTheme('blue', true);
                } else {
                    document.body.classList.remove('theme-doomsday');
                }
                if (typeof window.triggerAFCSBsod === 'function') {
                    window.triggerAFCSBsod('MULTIVERSE_INCURSION_COLLAPSE', 'EARTH_616_REALITY_RIFT_0xD00M', true);
                }
            }
        }
        
        setInterval(() => {
            if (!document.body.classList.contains('theme-doomsday')) {
                if (crackStage !== 0) {
                    crackStage = 0;
                    buildProceduralFracture();
                    syncCrackVisuals();
                }
                return;
            }
            if (Math.random() < 0.05) {
                escalateCrack();
            }
        }, 60000);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (val === 'foot dive' && document.body.classList.contains('theme-doomsday')) {
                    DOM.searchInput.value = '';
                    filterCards();
                    escalateCrack();
                }
            });
        }
    }
    function startEpicStorm() {
        const svgNS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
        function strikeLightning(targetX, targetY, big = false) {
            if (STATE.ldmActive) return;
            
            const flash = document.createElement('div');
            flash.className = 'epic-lightning-flash';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 450);
            
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('class', 'epic-lightning-svg');
            svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            
            let curX = targetX + (Math.random() - 0.5) * 180;
            let curY = 0;
            const steps = big ? 12 : 8;
            let pts = `${curX.toFixed(1)},0`;
            
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                curX = curX + (targetX - curX) * 0.45 + (Math.random() - 0.5) * (big ? 95 : 55);
                curY = targetY * progress;
                pts += ` ${curX.toFixed(1)},${curY.toFixed(1)}`;
            }
            
            const outerBolt = document.createElementNS(svgNS, 'polyline');
            outerBolt.setAttribute('points', pts);
            outerBolt.setAttribute('fill', 'none');
            outerBolt.setAttribute('stroke', '#38bdf8');
            outerBolt.setAttribute('stroke-width', big ? '7' : '4');
            outerBolt.setAttribute('stroke-linecap', 'round');
            outerBolt.setAttribute('stroke-linejoin', 'round');
            
            const coreBolt = document.createElementNS(svgNS, 'polyline');
            coreBolt.setAttribute('points', pts);
            coreBolt.setAttribute('fill', 'none');
            coreBolt.setAttribute('stroke', '#fef9c3');
            coreBolt.setAttribute('stroke-width', big ? '3' : '1.8');
            coreBolt.setAttribute('stroke-linecap', 'round');
            coreBolt.setAttribute('stroke-linejoin', 'round');
            
            svg.appendChild(outerBolt);
            svg.appendChild(coreBolt);
            document.body.appendChild(svg);
            setTimeout(() => svg.remove(), 520);
            
            if (big) {
                document.body.classList.add('quirk-bomb-shake');
                setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 450);
                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: targetX,
                    y: targetY,
                    radius: 10,
                    maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.55,
                    alpha: 1.0,
                    color: '#38bdf8'
                });
            }
            
            spawnBurst(targetX, targetY, ['#facc15', '#38bdf8', '#ffffff'], big ? 36 : 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            playBeep(big ? 95 : 150, big ? 0.35 : 0.14, 'sawtooth', big ? 0.07 : 0.04);
            if (big) {
                setTimeout(() => playBeep(62, 0.45, 'square', 0.065), 80);
            }
        }
        
        setInterval(() => {
            if (!document.body.classList.contains('theme-epic') || STATE.ldmActive) return;
            if (Math.random() < 0.38) {
                const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
                const ry = window.innerHeight * (0.25 + Math.random() * 0.55);
                strikeLightning(rx, ry, Math.random() < 0.35);
            }
        }, 4200);
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-epic')) return;
            if (e.target.closest('button, input, .PeoplePics')) return;
            strikeLightning(e.clientX, e.clientY, false);
        }, { passive: true });
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-epic')) return;
                
                if (val === 'ruthlessness' || val === 'poseidon') {
                    DOM.searchInput.value = '';
                    filterCards();
                    strikeLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    const banner = document.createElement('div');
                    banner.className = 'theme-announce-banner is-epic';
                    banner.textContent = '🌊 RUTHLESSNESS IS MERCY UPON OURSELVES!';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 2600);
                } else if (val === 'thunder bringer' || val === 'zeus') {
                    DOM.searchInput.value = '';
                    filterCards();
                    strikeLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    [220.00, 196.00, 164.81, 146.83].forEach((f, idx) => {
                        setTimeout(() => playBeep(f, 0.24, 'sawtooth', 0.055), idx * 140);
                    });
                } else if (val === '600 men') {
                    DOM.searchInput.value = '';
                    filterCards();
                    document.body.classList.toggle('epic-600-aura');
                    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#38bdf8', '#facc15', '#ffffff'], 34);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    playBeep(440, 0.16, 'triangle', 0.05);
                }
            });
        }
    }
    function startSolverOverhaul() {
        let ctxMenu = null;
        function closeSolverMenu() {
            if (ctxMenu) {
                ctxMenu.remove();
                ctxMenu = null;
            }
        }
        function spawnNullSphere(x, y, mega = false) {
            const sphere = document.createElement('div');
            sphere.className = mega ? 'solver-null-sphere is-mega' : 'solver-null-sphere';
            sphere.textContent = '[NULL]';
            sphere.style.left = `${x}px`;
            sphere.style.top = `${y}px`;
            document.body.appendChild(sphere);
            setTimeout(() => sphere.remove(), 750);
            
            const isUzi = document.body.classList.contains('solver-uzi-mode');
            const colors = isUzi ? ['#c084fc', '#a855f7', '#ffffff'] : ['#facc15', '#c084fc', '#ffffff'];
            spawnBurst(x, y, colors, mega ? 42 : 18);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            if (mega) {
                triggerScreenGlitch(180);
                playBeep(110, 0.32, 'sawtooth', 0.065);
                setTimeout(() => playBeep(65, 0.4, 'square', 0.06), 70);
            } else {
                playBeep(622.25, 0.06, 'sawtooth', 0.035);
            }
        }
        window.addEventListener('pointerdown', (e) => {
            if (ctxMenu && !e.target.closest('.solver-context-menu')) {
                closeSolverMenu();
            }
            if (!document.body.classList.contains('theme-murderdrones')) return;
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .solver-context-menu')) return;
            spawnNullSphere(e.clientX, e.clientY, false);
        }, { passive: true });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSolverMenu();
        });
        window.addEventListener('scroll', closeSolverMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-murderdrones')) return;
            e.preventDefault();
            closeSolverMenu();
            
            const menu = document.createElement('div');
            menu.className = 'solver-context-menu';
            menu.innerHTML = [
                '<div class="solver-ctx-header"><span>⬡ ABSOLUTE_SOLVER.EXE</span><span>[ROOT]</span></div>',
                '<div class="solver-ctx-item" data-act="back"><span class="solver-ctx-left"><span class="solver-ctx-glyph">◄</span><span>Revert Timeline</span></span><span class="solver-ctx-key">Alt+←</span></div>',
                '<div class="solver-ctx-item" data-act="reload"><span class="solver-ctx-left"><span class="solver-ctx-glyph">↻</span><span>Reboot Core</span></span><span class="solver-ctx-key">Ctrl+R</span></div>',
                '<div class="solver-ctx-sep"></div>',
                '<div class="solver-ctx-item" data-act="null"><span class="solver-ctx-left"><span class="solver-ctx-glyph">◉</span><span>Execute [NULL]</span></span><span class="solver-ctx-key">Void</span></div>',
                '<div class="solver-ctx-item" data-act="palette"><span class="solver-ctx-left"><span class="solver-ctx-glyph">△</span><span>Toggle Cyn / Uzi Core</span></span><span class="solver-ctx-key">Shift</span></div>',
                '<div class="solver-ctx-item" data-act="summon"><span class="solver-ctx-left"><span class="solver-ctx-glyph">⬡</span><span>Summon Cyn.exe</span></span><span class="solver-ctx-key">Pet</span></div>',
                '<div class="solver-ctx-sep"></div>',
                '<div class="solver-ctx-item" data-act="print"><span class="solver-ctx-left"><span class="solver-ctx-glyph">▤</span><span>Export Playbill</span></span><span class="solver-ctx-key">Ctrl+P</span></div>',
                '<div class="solver-ctx-item" data-act="translate"><span class="solver-ctx-left"><span class="solver-ctx-glyph">文</span><span>Translate: Solver</span></span><span class="solver-ctx-key">Giggle</span></div>',
                '<div class="solver-ctx-item" data-act="inspect"><span class="solver-ctx-left"><span class="solver-ctx-glyph">⌘</span><span>Inspect Vessel</span></span><span class="solver-ctx-key">F12</span></div>'
            ].join('');
            
            document.body.appendChild(menu);
            ctxMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 10, Math.max(10, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 10, Math.max(10, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(740, 0.05, 'sawtooth', 0.035);
            
            menu.querySelectorAll('.solver-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeSolverMenu();
                    
                    if (act === 'back') {
                        window.history.back();
                    } else if (act === 'reload') {
                        window.location.reload();
                    } else if (act === 'null') {
                        spawnNullSphere(safeX + 80, safeY + 60, true);
                    } else if (act === 'palette') {
                        document.body.classList.toggle('solver-uzi-mode');
                        triggerScreenGlitch(110);
                        playBeep(523.25, 0.09, 'sawtooth', 0.045);
                    } else if (act === 'summon') {
                        localStorage.setItem('afcs_cyn_pet_active', 'true');
                        if (DOM.searchInput) {
                            DOM.searchInput.value = 'cyn';
                            DOM.searchInput.dispatchEvent(new Event('input'));
                        }
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'translate') {
                        triggerScreenGlitch(140);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-murderdrones';
                        banner.textContent = '⬡ [TRANSLATED]: GIGGLE. ASSIMILATION READY =3';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2600);
                        playBeep(880, 0.1, 'sawtooth', 0.045);
                    } else if (act === 'inspect') {
                        triggerScreenGlitch(140);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-murderdrones';
                        banner.textContent = '⬡ [ACCESS DENIED]: NICE TRY, LITTLE ADMINISTRATOR.';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2600);
                        playBeep(180, 0.18, 'sawtooth', 0.05);
                    }
                });
            });
        });
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-murderdrones')) return;
                
                if (val === 'null' || val === '[null]') {
                    DOM.searchInput.value = '';
                    filterCards();
                    spawnNullSphere(window.innerWidth / 2, window.innerHeight * 0.45, true);
                } else if (val === 'bite me') {
                    DOM.searchInput.value = '';
                    filterCards();
                    const isUzi = document.body.classList.toggle('solver-uzi-mode');
                    triggerScreenGlitch(130);
                    const banner = document.createElement('div');
                    banner.className = 'theme-announce-banner is-murderdrones';
                    banner.textContent = isUzi ? '💜 BITE ME! // UZI SOLVER CORE ENGAGED' : '💛 GIGGLE. // CYN SOLVER CORE RESTORED';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 2400);
                    playBeep(isUzi ? 622.25 : 440, 0.12, 'sawtooth', 0.045);
                } else if (val === 'callback ping') {
                    DOM.searchInput.value = '';
                    filterCards();
                    spawnNullSphere(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    localStorage.setItem('afcs_cyn_pet_active', 'true');
                    setTimeout(() => {
                        if (DOM.searchInput) {
                            DOM.searchInput.value = 'cyn';
                            DOM.searchInput.dispatchEvent(new Event('input'));
                        }
                    }, 120);
                }
            });
        }
    }
    function startHamiltonOverhaul() {
        const quillEl = document.createElement('div');
        quillEl.className = 'hamilton-quill-cursor';
        quillEl.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 2C25 4 15 13 9 24L3 35l2.5 1 5-7.5c6.5-1.5 14-6.5 19-14C32 10.5 34 5.5 35 2z" fill="#fef3c7" stroke="#78350f" stroke-width="1.6"/>
            <path d="M4.5 34.5L29 8" stroke="#92400e" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M15 17l-4-1M19 13l-4.5-1M23 9.5l-4-1" stroke="#b45309" stroke-width="1.1" stroke-linecap="round"/>
            <circle cx="3.5" cy="35" r="1.8" fill="#1c1917"/>
        </svg>
    `;
        document.body.appendChild(quillEl);
        
        let lastQuillX = window.innerWidth / 2;
        let quillActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isHam = document.body.classList.contains('theme-hamilton');
            if (!isHam) {
                if (quillActive) {
                    quillEl.classList.remove('is-visible');
                    quillActive = false;
                }
                return;
            }
            
            if (!quillActive) {
                quillEl.classList.add('is-visible');
                quillActive = true;
            }
            
            const dx = Math.max(-18, Math.min(18, e.clientX - lastQuillX));
            lastQuillX = e.clientX;
            const tilt = dx * 0.9;
            
            quillEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY - 36}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            quillEl.classList.remove('is-visible');
            quillActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-hamilton')) return;
            quillEl.classList.add('is-writing');
            setTimeout(() => quillEl.classList.remove('is-writing'), 160);
        }, { passive: true });
        let hamMenu = null;
        
        function closeHamMenu() {
            if (hamMenu) {
                hamMenu.remove();
                hamMenu = null;
            }
        }
        
        function spawnQuillFlourish(x, y, quoteText = 'I am not throwing away my shot!') {
            const inkPalette = ['#78350f', '#d97706', '#fef08a', '#1c1917'];
            spawnBurst(x, y, inkPalette, 22);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            const note = document.createElement('div');
            note.className = 'hamilton-parchment-toast';
            note.textContent = `🪶 "${quoteText}"`;
            note.style.left = `${Math.min(window.innerWidth - 260, Math.max(16, x - 110))}px`;
            note.style.top = `${Math.max(24, y - 36)}px`;
            document.body.appendChild(note);
            setTimeout(() => note.remove(), 1800);
            
            const harpsichord = [440.00, 523.25, 659.25, 880.00];
            harpsichord.forEach((freq, i) => {
                setTimeout(() => playBeep(freq, 0.08, 'triangle', 0.038), i * 45);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (hamMenu && !e.target.closest('.hamilton-context-menu')) {
                closeHamMenu();
            }
            if (!document.body.classList.contains('theme-hamilton')) return;
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .hamilton-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#92400e', '#f59e0b', '#fef3c7'], 10);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(587.33, 0.045, 'triangle', 0.025);
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeHamMenu();
        });
        window.addEventListener('scroll', closeHamMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-hamilton')) return;
            e.preventDefault();
            closeHamMenu();
            
            const menu = document.createElement('div');
            menu.className = 'hamilton-context-menu';
            menu.innerHTML = `
            <div class="ham-ctx-header">
                <span>📜 NEW YORK, 1776</span>
                <span class="ham-wax-seal" title="Continental Seal">★</span>
            </div>
            <div class="ham-ctx-item" data-act="shot">
                <span>🪶 Take My Shot!</span>
                <span class="ham-ctx-sub">Ink</span>
            </div>
            <div class="ham-ctx-item" data-act="nonstop">
                <span>✍️ Write Like Running Out of Time</span>
                <span class="ham-ctx-sub">Quill</span>
            </div>
            <div class="ham-ctx-item" data-act="room">
                <span>🏛️ The Room Where It Happens</span>
                <span class="ham-ctx-sub">Stage</span>
            </div>
            <div class="ham-ctx-sep"></div>
            <div class="ham-ctx-item" data-act="duel">
                <span>⚔️ Ten Duel Commandments</span>
                <span class="ham-ctx-sub">1–10</span>
            </div>
            <div class="ham-ctx-item" data-act="print">
                <span>📰 Print Continental Playbill</span>
                <span class="ham-ctx-sub">Ctrl+P</span>
            </div>
            <div class="ham-ctx-item" data-act="back">
                <span>↩ Turn Back the Clock</span>
                <span class="ham-ctx-sub">Back</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            hamMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(659.25, 0.06, 'triangle', 0.035);
            
            menu.querySelectorAll('.ham-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeHamMenu();
                    
                    if (act === 'shot') {
                        spawnQuillFlourish(safeX + 90, safeY + 40, 'I am not throwing away my shot!');
                    } else if (act === 'nonstop') {
                        spawnQuillFlourish(safeX + 90, safeY + 40, 'Why do you write like you’re running out of time?!');
                    } else if (act === 'room') {
                        const floorplan = document.querySelector('#floorplan, .floorplan-card');
                        if (floorplan) floorplan.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        spawnQuillFlourish(safeX + 90, safeY + 40, 'Click-boom! Welcome to the room where it happens.');
                    } else if (act === 'duel') {
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-hamilton';
                        banner.textContent = '⚔️ ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE... NUMBER TEN PACES, FIRE!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 3000);
                        [392, 440, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99, 880, 1046.5].forEach((f, i) => {
                            setTimeout(() => playBeep(f, 0.07, 'triangle', 0.04), i * 85);
                        });
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'back') {
                        window.history.back();
                    }
                });
            });
        });
    }
    function startEpicCursorAndStorm() {
        const svgNS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
        let zeusCursorMode = false;
        
        const epicCursor = document.createElement('div');
        epicCursor.className = 'epic-olympus-cursor';
        
        const tridentSVG = `
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5L33 33" stroke="#facc15" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M4 4L14 6L8 10L6 16L4 4Z" fill="#38bdf8" stroke="#fef08a" stroke-width="1.3"/>
        <path d="M13 3C10 7 10 11 13 14" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M13 3L11 7L15 6L13 3Z" fill="#fef08a"/>
        <path d="M3 13C7 10 11 10 14 13" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M3 13L7 11L6 15L3 13Z" fill="#fef08a"/>
        <circle cx="15" cy="15" r="2.2" fill="#facc15"/>
    </svg>
`;
        
        const thunderboltSVG = `
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4L19 15L14 19L33 34L20 21L25 17L4 4Z" fill="#facc15" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M8 7L28 29" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
`;
        
        epicCursor.innerHTML = tridentSVG;
        document.body.appendChild(epicCursor);
        
        function syncEpicCursorWeapon(forceState) {
            if (typeof forceState === 'boolean') zeusCursorMode = forceState;
            epicCursor.innerHTML = zeusCursorMode ? thunderboltSVG : tridentSVG;
            epicCursor.classList.toggle('is-zeus-bolt', zeusCursorMode);
            return zeusCursorMode;
        }
        
        let lastEpicX = window.innerWidth / 2;
        let epicCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isEpic = document.body.classList.contains('theme-epic');
            if (!isEpic) {
                if (epicCursorActive) {
                    epicCursor.classList.remove('is-visible');
                    epicCursorActive = false;
                }
                return;
            }
            
            if (!epicCursorActive) {
                epicCursor.classList.add('is-visible');
                epicCursorActive = true;
            }
            
            const dx = Math.max(-16, Math.min(16, e.clientX - lastEpicX));
            lastEpicX = e.clientX;
            const tilt = dx * 0.75;
            
            epicCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            epicCursor.classList.remove('is-visible');
            epicCursorActive = false;
        });
        
        function strikeLightning(targetX, targetY, big = false) {
            if (STATE.ldmActive) return;
            
            const flash = document.createElement('div');
            flash.className = 'epic-lightning-flash';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 450);
            
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('class', 'epic-lightning-svg');
            svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            
            let curX = targetX + (Math.random() - 0.5) * 180;
            let curY = 0;
            const steps = big ? 12 : 8;
            let pts = `${curX.toFixed(1)},0`;
            
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                curX = curX + (targetX - curX) * 0.45 + (Math.random() - 0.5) * (big ? 95 : 55);
                curY = targetY * progress;
                pts += ` ${curX.toFixed(1)},${curY.toFixed(1)}`;
            }
            
            const outerBolt = document.createElementNS(svgNS, 'polyline');
            outerBolt.setAttribute('points', pts);
            outerBolt.setAttribute('fill', 'none');
            outerBolt.setAttribute('stroke', '#38bdf8');
            outerBolt.setAttribute('stroke-width', big ? '7' : '4');
            outerBolt.setAttribute('stroke-linecap', 'round');
            outerBolt.setAttribute('stroke-linejoin', 'round');
            
            const coreBolt = document.createElementNS(svgNS, 'polyline');
            coreBolt.setAttribute('points', pts);
            coreBolt.setAttribute('fill', 'none');
            coreBolt.setAttribute('stroke', '#fef9c3');
            coreBolt.setAttribute('stroke-width', big ? '3' : '1.8');
            coreBolt.setAttribute('stroke-linecap', 'round');
            coreBolt.setAttribute('stroke-linejoin', 'round');
            
            svg.appendChild(outerBolt);
            svg.appendChild(coreBolt);
            document.body.appendChild(svg);
            setTimeout(() => svg.remove(), 520);
            
            if (big) {
                document.body.classList.add('quirk-bomb-shake');
                setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 450);
                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: targetX,
                    y: targetY,
                    radius: 10,
                    maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.55,
                    alpha: 1.0,
                    color: '#38bdf8'
                });
            }
            
            spawnBurst(targetX, targetY, ['#facc15', '#38bdf8', '#ffffff'], big ? 36 : 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            playBeep(big ? 95 : 150, big ? 0.35 : 0.14, 'sawtooth', big ? 0.07 : 0.04);
            if (big) {
                setTimeout(() => playBeep(62, 0.45, 'square', 0.065), 80);
            }
        }
        
        setInterval(() => {
            if (!document.body.classList.contains('theme-epic') || STATE.ldmActive) return;
            if (Math.random() < 0.38) {
                const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
                const ry = window.innerHeight * (0.25 + Math.random() * 0.55);
                strikeLightning(rx, ry, Math.random() < 0.35);
            }
        }, 4200);
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-epic')) return;
            
            epicCursor.classList.add('is-striking');
            setTimeout(() => epicCursor.classList.remove('is-striking'), 170);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .epic-context-menu')) return;
            strikeLightning(e.clientX, e.clientY, zeusCursorMode);
        }, { passive: true });
        
        window.strikeEpicLightning = strikeLightning;
        window.syncEpicCursorWeapon = syncEpicCursorWeapon;
        window.isEpicZeusMode = () => zeusCursorMode;
    }
    function startEpicContextMenu() {
        let epicMenu = null;
        
        function closeEpicMenu() {
            if (epicMenu) {
                epicMenu.remove();
                epicMenu = null;
            }
        }
        
        function callLightning(x, y, big = false) {
            if (typeof window.strikeEpicLightning === 'function') {
                window.strikeEpicLightning(x, y, big);
            }
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (epicMenu && !e.target.closest('.epic-context-menu')) {
                closeEpicMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeEpicMenu();
        });
        window.addEventListener('scroll', closeEpicMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-epic')) return;
            e.preventDefault();
            e.stopPropagation();
            closeEpicMenu();
            
            const isZeus = typeof window.isEpicZeusMode === 'function' && window.isEpicZeusMode();
            
            const menu = document.createElement('div');
            menu.className = 'epic-context-menu';
            menu.innerHTML = `
            <div class="epic-ctx-header">
                <span>⚡ OLYMPUS STORM // ODYSSEY</span>
                <span class="epic-ctx-crest">🔱</span>
            </div>
            <div class="epic-ctx-item" data-act="thunder">
                <span>⚡ Thunder Bringer</span>
                <span class="epic-ctx-key">Zeus</span>
            </div>
            <div class="epic-ctx-item" data-act="ruthlessness">
                <span>🌊 Ruthlessness Surge</span>
                <span class="epic-ctx-key">Poseidon</span>
            </div>
            <div class="epic-ctx-item" data-act="weapon">
                <span>${isZeus ? '🔱 Wield Poseidon’s Trident' : '⚡ Wield Zeus’s Thunderbolt'}</span>
                <span class="epic-ctx-key">Weapon</span>
            </div>
            <div class="epic-ctx-sep"></div>
            <div class="epic-ctx-item" data-act="men600">
                <span>🛡️ Rally the 600 Men</span>
                <span class="epic-ctx-key">Aura</span>
            </div>
            <div class="epic-ctx-item" data-act="windbag">
                <span>🌪️ Open the Wind Bag</span>
                <span class="epic-ctx-key">Aeolus</span>
            </div>
            <div class="epic-ctx-sep"></div>
            <div class="epic-ctx-item" data-act="ithaca">
                <span>🏛️ Sail Back to Ithaca</span>
                <span class="epic-ctx-key">Top</span>
            </div>
            <div class="epic-ctx-item" data-act="print">
                <span>📜 Inscribe Odyssey Playbill</span>
                <span class="epic-ctx-key">Ctrl+P</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            epicMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(220.00, 0.08, 'sawtooth', 0.04);
            
            menu.querySelectorAll('.epic-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeEpicMenu();
                    
                    if (act === 'thunder') {
                        callLightning(safeX + 60, safeY + 40, true);
                        [220.00, 196.00, 164.81, 146.83].forEach((f, idx) => {
                            setTimeout(() => playBeep(f, 0.22, 'sawtooth', 0.05), idx * 120);
                        });
                    } else if (act === 'ruthlessness') {
                        callLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-epic';
                        banner.textContent = '🌊 RUTHLESSNESS IS MERCY UPON OURSELVES!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2600);
                    } else if (act === 'weapon') {
                        const nextState = typeof window.syncEpicCursorWeapon === 'function'
                        ? window.syncEpicCursorWeapon(!isZeus)
                        : false;
                        spawnBurst(safeX + 80, safeY + 40, ['#facc15', '#38bdf8', '#ffffff'], 24);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        playBeep(nextState ? 880 : 440, 0.1, 'triangle', 0.045);
                    } else if (act === 'men600') {
                        document.body.classList.toggle('epic-600-aura');
                        spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#38bdf8', '#facc15', '#ffffff'], 34);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        playBeep(440, 0.16, 'triangle', 0.05);
                    } else if (act === 'windbag') {
                        for (let i = 0; i < 4; i++) {
                            setTimeout(() => {
                                const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
                                const ry = window.innerHeight * (0.2 + Math.random() * 0.6);
                                callLightning(rx, ry, i === 3);
                            }, i * 160);
                        }
                    } else if (act === 'ithaca') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playBeep(523.25, 0.12, 'triangle', 0.04);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    }
                });
            });
        }, true);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-epic')) return;
                
                if (val === 'ruthlessness' || val === 'poseidon') {
                    DOM.searchInput.value = '';
                    filterCards();
                    if (typeof window.syncEpicCursorWeapon === 'function') window.syncEpicCursorWeapon(false);
                    callLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    const banner = document.createElement('div');
                    banner.className = 'theme-announce-banner is-epic';
                    banner.textContent = '🌊 RUTHLESSNESS IS MERCY UPON OURSELVES!';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 2600);
                } else if (val === 'thunder bringer' || val === 'zeus') {
                    DOM.searchInput.value = '';
                    filterCards();
                    if (typeof window.syncEpicCursorWeapon === 'function') window.syncEpicCursorWeapon(true);
                    callLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    [220.00, 196.00, 164.81, 146.83].forEach((f, idx) => {
                        setTimeout(() => playBeep(f, 0.24, 'sawtooth', 0.055), idx * 140);
                    });
                } else if (val === '600 men') {
                    DOM.searchInput.value = '';
                    filterCards();
                    document.body.classList.toggle('epic-600-aura');
                    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#38bdf8', '#facc15', '#ffffff'], 34);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    playBeep(440, 0.16, 'triangle', 0.05);
                }
            });
        }
    }
    function startDoomsdayCursor() {
        const doomCursor = document.createElement('div');
        doomCursor.className = 'doomsday-gauntlet-cursor';
        doomCursor.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="4,4 22,10 15,16 32,33 27,36 12,19 7,25" fill="#1e293b" stroke="#10b981" stroke-width="1.8" stroke-linejoin="round"/>
            <polygon points="6,6 18,11 13,15" fill="#a7f3d0"/>
            <circle cx="16" cy="17" r="3.2" fill="#10b981" stroke="#ecfdf5" stroke-width="1.2"/>
            <path d="M20 23L29 32" stroke="#34d399" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `;
        document.body.appendChild(doomCursor);
        
        let lastDoomX = window.innerWidth / 2;
        let doomCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isDoom = document.body.classList.contains('theme-doomsday');
            if (!isDoom) {
                if (doomCursorActive) {
                    doomCursor.classList.remove('is-visible');
                    doomCursorActive = false;
                }
                return;
            }
            
            if (!doomCursorActive) {
                doomCursor.classList.add('is-visible');
                doomCursorActive = true;
            }
            
            const dx = Math.max(-14, Math.min(14, e.clientX - lastDoomX));
            lastDoomX = e.clientX;
            const tilt = dx * 0.65;
            
            doomCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            doomCursor.classList.remove('is-visible');
            doomCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-doomsday')) return;
            
            doomCursor.classList.add('is-blasting');
            setTimeout(() => doomCursor.classList.remove('is-blasting'), 170);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .doomsday-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#10b981', '#a7f3d0', '#ffffff'], 14);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(110, 0.08, 'sawtooth', 0.032);
        }, { passive: true });
    }
    function startDoomsdayContextMenu() {
        let doomMenu = null;
        
        function closeDoomMenu() {
            if (doomMenu) {
                doomMenu.remove();
                doomMenu = null;
            }
        }
        
        function spawnIncursionWave(x, y) {
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.65,
                alpha: 1.0,
                color: '#10b981'
            });
            spawnBurst(x, y, ['#10b981', '#a7f3d0', '#facc15', '#ffffff'], 42);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            triggerScreenGlitch(130);
            
            [73.42, 110.00, 146.83, 220.00].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.35, 'sawtooth', 0.045), idx * 75);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (doomMenu && !e.target.closest('.doomsday-context-menu')) {
                closeDoomMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDoomMenu();
        });
        window.addEventListener('scroll', closeDoomMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-doomsday')) return;
            e.preventDefault();
            e.stopPropagation();
            closeDoomMenu();
            
            const stage = typeof window.getDoomsdayCrackStage === 'function' ? window.getDoomsdayCrackStage() : 0;
            
            const menu = document.createElement('div');
            menu.className = 'doomsday-context-menu';
            menu.innerHTML = `
            <div class="doom-ctx-header">
                <span>🟢 LATVERIA_OS // DOOM.EXE</span>
                <span class="doom-ctx-stage">RIFT ${stage}/8</span>
            </div>
            <div class="doom-ctx-item" data-act="footdive">
                <span>⚡ Execute FOOT DIVE</span>
                <span class="doom-ctx-key">Fracture</span>
            </div>
            <div class="doom-ctx-item" data-act="incursion">
                <span>🌀 Multiverse Shockwave</span>
                <span class="doom-ctx-key">616</span>
            </div>
            <div class="doom-ctx-item" data-act="seal">
                <span>🛡️ Seal Reality Rift</span>
                <span class="doom-ctx-key">Reset</span>
            </div>
            <div class="doom-ctx-sep"></div>
            <div class="doom-ctx-item" data-act="decree">
                <span>👑 Latverian Proclamation</span>
                <span class="doom-ctx-key">Doom</span>
            </div>
            <div class="doom-ctx-item" data-act="print">
                <span>📄 Export Dossier</span>
                <span class="doom-ctx-key">Ctrl+P</span>
            </div>
            <div class="doom-ctx-item" data-act="reload">
                <span>↻ Reboot Timeline</span>
                <span class="doom-ctx-key">Ctrl+R</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            doomMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(110.00, 0.09, 'sawtooth', 0.04);
            
            menu.querySelectorAll('.doom-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeDoomMenu();
                    
                    if (act === 'footdive') {
                        window.escalateDoomsdayCrack();
                    } else if (act === 'incursion') {
                        spawnIncursionWave(safeX + 80, safeY + 40);
                    } else if (act === 'seal') {
                        if (typeof window.repairDoomsdayCrack === 'function') {
                            window.repairDoomsdayCrack();
                        }
                    } else if (act === 'decree') {
                        spawnIncursionWave(window.innerWidth / 2, window.innerHeight * 0.45);
                        const banner = document.createElement('div');
                        banner.className = 'doomsday-unlock-banner';
                        banner.textContent = '🟢 ALL HOPE LIES IN DOOM — GRADE 7 PSALMS KNEELS TO NO MULTIVERSE!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2800);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'reload') {
                        window.location.reload();
                    }
                });
            });
        }, true);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (val === 'foot dive' && document.body.classList.contains('theme-doomsday')) {
                    DOM.searchInput.value = '';
                    filterCards();
                    if (typeof window.escalateDoomsdayCrack === 'function') {
                        window.escalateDoomsdayCrack();
                    }
                }
            });
        }
    }
    function startFaithianCursorAndRally() {
        const faithCursor = document.createElement('div');
        faithCursor.className = 'faithian-emblem-cursor';
        faithCursor.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="4,4 28,13 17,18 13,29" fill="#2563eb" stroke="#facc15" stroke-width="1.8" stroke-linejoin="round"/>
            <polygon points="4,4 17,18 13,29" fill="#ef4444"/>
            <polygon points="24,20 26,25 31,25 27,28 28.5,33 24,30 19.5,33 21,28 17,25 22,25" fill="#facc15" stroke="#ffffff" stroke-width="0.9"/>
        </svg>
    `;
        document.body.appendChild(faithCursor);
        
        let lastFaithX = window.innerWidth / 2;
        let faithCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isFaith = document.body.classList.contains('theme-faithian');
            if (!isFaith) {
                if (faithCursorActive) {
                    faithCursor.classList.remove('is-visible');
                    faithCursorActive = false;
                }
                return;
            }
            
            if (!faithCursorActive) {
                faithCursor.classList.add('is-visible');
                faithCursorActive = true;
            }
            
            const dx = Math.max(-15, Math.min(15, e.clientX - lastFaithX));
            lastFaithX = e.clientX;
            const tilt = dx * 0.7;
            
            faithCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            faithCursor.classList.remove('is-visible');
            faithCursorActive = false;
        });
        
        const rallyPhrases = Array.of(
            'GO FAITHIANS!',
            'CALLED FOR A PURPOSE!',
            'GRADE 7 – PSALMS!',
            '★ AFCS 2026',
            'FAITH • EXCELLENCE • SERVICE'
        );
        
        function triggerFaithianRally(cx, cy, big = false) {
            const palette = Array.of('#ef4444', '#2563eb', '#facc15', '#ffffff');
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 8,
                maxRadius: big ? Math.max(window.innerWidth, window.innerHeight) * 0.5 : 42,
                alpha: 1.0,
                color: big ? '#facc15' : '#ef4444'
            });
            spawnBurst(cx, cy, palette, big ? 48 : 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            if (big) {
                const chord = Array.of(261.63, 329.63, 392.00, 523.25, 659.25);
                chord.forEach((f, idx) => {
                    setTimeout(() => playBeep(f, 0.22, 'triangle', 0.05), idx * 75);
                });
            } else {
                const notes = Array.of(523.25, 659.25, 783.99);
                playBeep(notes.at(Math.floor(Math.random() * notes.length)), 0.08, 'triangle', 0.032);
            }
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-faithian')) return;
            
            faithCursor.classList.add('is-cheering');
            setTimeout(() => faithCursor.classList.remove('is-cheering'), 160);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .faithian-context-menu')) return;
            triggerFaithianRally(e.clientX, e.clientY, false);
            
            if (Math.random() < 0.35) {
                const tag = document.createElement('div');
                tag.className = 'quirk-star-glow';
                tag.textContent = rallyPhrases.at(Math.floor(Math.random() * rallyPhrases.length));
                tag.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-size:13px;font-weight:900;letter-spacing:0.6px;color:#ffffff;text-shadow:0 2px 10px #000,0 0 12px #ef4444,0 0 18px #2563eb;`;
                document.body.appendChild(tag);
                setTimeout(() => tag.remove(), 1000);
            }
        }, { passive: true });
        
        window.triggerFaithianRallyBurst = triggerFaithianRally;
    }
    function startFaithianContextMenu() {
        let faithMenu = null;
        
        function closeFaithMenu() {
            if (faithMenu) {
                faithMenu.remove();
                faithMenu = null;
            }
        }
        
        function runRally(cx, cy, big = true) {
            if (typeof window.triggerFaithianRallyBurst === 'function') {
                window.triggerFaithianRallyBurst(cx, cy, big);
            }
        }
        
        function showFaithianVerseBanner(title, text) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner is-faithian';
            banner.innerHTML = `<strong>${title}</strong><br><span style="font-size:12.5px;font-weight:600;opacity:0.95;">${text}</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4200);
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (faithMenu && !e.target.closest('.faithian-context-menu')) {
                closeFaithMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeFaithMenu();
        });
        window.addEventListener('scroll', closeFaithMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-faithian')) return;
            e.preventDefault();
            e.stopPropagation();
            closeFaithMenu();
            
            const isPsalmsActive = document.body.classList.contains('faithian-psalms-rally');
            
            const menu = document.createElement('div');
            menu.className = 'faithian-context-menu';
            menu.innerHTML = `
            <div class="faith-ctx-header">
                <span>★ AFCS // CALLED FOR A PURPOSE</span>
                <span class="faith-ctx-badge">G7</span>
            </div>
            <div class="faith-ctx-item" data-act="rally">
                <span>📣 Go Faithians! Rally</span>
                <span class="faith-ctx-key">Cheer</span>
            </div>
            <div class="faith-ctx-item" data-act="psalms">
                <span>👑 ${isPsalmsActive ? 'Reset Psalms Aura' : 'Grade 7 – Psalms Aura'}</span>
                <span class="faith-ctx-key">Aura</span>
            </div>
            <div class="faith-ctx-sep"></div>
            <div class="faith-ctx-item" data-act="schoolverse">
                <span>💡 School Verse</span>
                <span class="faith-ctx-key">Matt 5:16</span>
            </div>
            <div class="faith-ctx-item" data-act="yearlyverse">
                <span>🦅 Yearly Verse</span>
                <span class="faith-ctx-key">Isa 40:31</span>
            </div>
            <div class="faith-ctx-sep"></div>
            <div class="faith-ctx-item" data-act="floorplan">
                <span>🗺️ Venue Floorplan</span>
                <span class="faith-ctx-key">Stage</span>
            </div>
            <div class="faith-ctx-item" data-act="print">
                <span>🎟️ Export AFCS Playbill</span>
                <span class="faith-ctx-key">Ctrl+P</span>
            </div>
            <div class="faith-ctx-item" data-act="top">
                <span>⬆️ Back to Top</span>
                <span class="faith-ctx-key">Home</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            faithMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(523.25, 0.08, 'triangle', 0.04);
            
            menu.querySelectorAll('.faith-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeFaithMenu();
                    
                    if (act === 'rally') {
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner('★ ANTIPOLO FAITH CHRISTIAN SCHOOL', 'CALLED FOR A PURPOSE — GO FAITHIANS!');
                    } else if (act === 'psalms') {
                        const active = document.body.classList.toggle('faithian-psalms-rally');
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner('★ GRADE 7 – PSALMS', active ? 'CHAMPIONSHIP AURA ACTIVATED!' : 'CHAMPIONSHIP AURA RESET');
                    } else if (act === 'schoolverse') {
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner(
                            '💡 AFCS SCHOOL VERSE — MATTHEW 5:16',
                            '"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."'
                        );
                    } else if (act === 'yearlyverse') {
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner(
                            '🦅 AFCS YEARLY VERSE — ISAIAH 40:31',
                            '"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."'
                        );
                    } else if (act === 'floorplan') {
                        const fp = document.querySelector('#floorplan, .floorplan-card');
                        if (fp) fp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        runRally(safeX + 80, safeY + 40, false);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'top') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playBeep(659.25, 0.1, 'triangle', 0.04);
                    }
                });
            });
        }, true);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-faithian')) return;
                
                if (val === 'go faithians' || val === 'afcs') {
                    DOM.searchInput.value = '';
                    filterCards();
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner('★ ANTIPOLO FAITH CHRISTIAN SCHOOL', 'CALLED FOR A PURPOSE — GO FAITHIANS!');
                } else if (val === 'psalms') {
                    DOM.searchInput.value = '';
                    filterCards();
                    const active = document.body.classList.toggle('faithian-psalms-rally');
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner('★ GRADE 7 – PSALMS', active ? 'CHAMPIONSHIP AURA ACTIVATED!' : 'CHAMPIONSHIP AURA RESET');
                } else if (val === 'matthew 5:16' || val === 'matt 5:16') {
                    DOM.searchInput.value = '';
                    filterCards();
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner(
                        '💡 AFCS SCHOOL VERSE — MATTHEW 5:16',
                        '"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."'
                    );
                } else if (val === 'isaiah 40:31' || val === 'isa 40:31') {
                    DOM.searchInput.value = '';
                    filterCards();
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner(
                        '🦅 AFCS YEARLY VERSE — ISAIAH 40:31',
                        '"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."'
                    );
                }
            });
        }
    }
    function startMischievousLightCursor() {
        function isMischievousActive() {
            return document.body.classList.contains('theme-red')
            || document.body.classList.contains('theme-reactor')
            || document.body.classList.contains('theme-mischievous');
        }
        
        const redCursor = document.createElement('div');
        redCursor.className = 'mischievous-light-cursor';
        redCursor.innerHTML = `
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://w3.org">
            <defs>
                <linearGradient id="mischDiamondGrad" x1="29" y1="17" x2="29" y2="39" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#ffe4e6"/>
                    <stop offset="35%" stop-color="#ff8080"/>
                    <stop offset="100%" stop-color="#f43f5e"/>
                </linearGradient>
            </defs>
            <polygon points="4,4 25,12.5 15.5,16.5 11.5,26" fill="#450a0a" stroke="#ff6b6b" stroke-width="1.7" stroke-linejoin="round"/>
            <g class="mischievous-vortex-spin">
                <polygon points="29,17 39,27 31,35 24,28 29,23 32,26 30,28 28.5,26.5 27,28 31,32 36,27 29,20 21,28 30,37 28.5,38.5 18,28" fill="url(#mischDiamondGrad)" stroke="#ff4d4d" stroke-width="0.7" stroke-linejoin="round"/>
            </g>
        </svg>
    `;
        document.body.appendChild(redCursor);
        
        let lastRedX = window.innerWidth / 2;
        let redCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            if (!isMischievousActive()) {
                if (redCursorActive) {
                    redCursor.classList.remove('is-visible');
                    redCursorActive = false;
                }
                return;
            }
            
            if (!redCursorActive) {
                redCursor.classList.add('is-visible');
                redCursorActive = true;
            }
            
            const dx = Math.max(-15, Math.min(15, e.clientX - lastRedX));
            lastRedX = e.clientX;
            const tilt = dx * 0.7;
            
            redCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            redCursor.classList.remove('is-visible');
            redCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!isMischievousActive()) return;
            
            redCursor.classList.add('is-mocking');
            setTimeout(() => redCursor.classList.remove('is-mocking'), 180);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .mischievous-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#ff6b6b', '#ef4444', '#ffe4e6', '#991b1b'], 18);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(146.83, 0.09, 'sawtooth', 0.035);
        }, { passive: true });
    }
    function startMischievousLightContextMenu() {
        let redMenu = null;
        
        function isMischievousActive() {
            return document.body.classList.contains('theme-red')
            || document.body.classList.contains('theme-reactor')
            || document.body.classList.contains('theme-mischievous');
        }
        
        function closeRedMenu() {
            if (redMenu) {
                redMenu.remove();
                redMenu = null;
            }
        }
        
        function showRedMockery(title, line) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner';
            banner.style.borderColor = '#ef4444';
            banner.style.background = 'rgba(28, 5, 8, 0.96)';
            banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.9), 0 0 28px rgba(239, 68, 68, 0.75)';
            banner.innerHTML = `<strong style="color:#fca5a5;">🌀 ${title}</strong><br><span style="font-size:12.5px;font-weight:600;color:#ffffff;">"${line}"</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4200);
        }
        
        function triggerCrimsonMalice(x, y, fullRoom = false) {
            if (fullRoom) {
                const flash = document.createElement('div');
                flash.className = 'mischievous-crimson-flash';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 850);
                triggerScreenGlitch(180);
                document.body.classList.add('quirk-bomb-shake');
                setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 360);
            }
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * (fullRoom ? 0.85 : 0.45),
                alpha: 1.0,
                color: '#ef4444'
            });
            
            spawnBurst(x, y, ['#ef4444', '#dc2626', '#fca5a5', '#09090b'], fullRoom ? 58 : 30);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [220.00, 196.00, 155.56, 130.81, 110.00].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.24, 'sawtooth', 0.048), idx * 65);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (redMenu && !e.target.closest('.mischievous-context-menu')) {
                closeRedMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeRedMenu();
        });
        window.addEventListener('scroll', closeRedMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!isMischievousActive()) return;
            e.preventDefault();
            e.stopPropagation();
            closeRedMenu();
            
            const menu = document.createElement('div');
            menu.className = 'mischievous-context-menu';
            menu.innerHTML = `
            <div class="red-ctx-header">
                <span>🌀 MISCHIEVOUS LIGHT // MODIFIER</span>
                <span class="red-ctx-badge">∅</span>
            </div>
            <div class="red-ctx-item" data-act="taunt">
                <span>🩸 Hear Its Whisper</span>
                <span class="red-ctx-key">Mock</span>
            </div>
            <div class="red-ctx-item" data-act="barricade">
                <span>🚫 Seal the Door</span>
                <span class="red-ctx-key">Pulse</span>
            </div>
            <div class="red-ctx-item" data-act="modifier">
                <span>🎲 Activate Random Modifier</span>
                <span class="red-ctx-key">+150%</span>
            </div>
            <div class="red-ctx-sep"></div>
            <div class="red-ctx-item" data-act="codex">
                <span>📕 Peek Into the Codex</span>
                <span class="red-ctx-key">Vault</span>
            </div>
            <div class="red-ctx-item" data-act="crucifix">
                <span>💥 Shatter the Run</span>
                <span class="red-ctx-key">BSOD</span>
            </div>
            <div class="red-ctx-item" data-act="restart">
                <span>↻ Enter the Elevator Again</span>
                <span class="red-ctx-key">Ctrl+R</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            redMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(155.56, 0.11, 'sawtooth', 0.042);
            
            menu.querySelectorAll('.red-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeRedMenu();
                    
                    if (act === 'taunt') {
                        const taunts = Array.of(
                            'Did you really think Guiding Light was going to help you with this one? How adorable.',
                            'You keep clicking around Grade 7 – Psalms like you expect mercy. Let’s turn up the modifiers!',
                            'Oh, look who wandered into the crimson light. Careful—not every door in this tower leads out.',
                            'Curious Light is too friendly, and Guiding Light is too soft. I prefer making things... interesting.',
                            'Why don’t you triple-click Abrena’s portrait again? I promise nothing bad will happen. Probably.'
                        );
                        const picked = taunts.at(Math.floor(Math.random() * taunts.length));
                        triggerCrimsonMalice(safeX + 80, safeY + 40, false);
                        showRedMockery('MISCHIEVOUS LIGHT', picked);
                    } else if (act === 'barricade') {
                        triggerCrimsonMalice(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    } else if (act === 'modifier') {
                        const modifiers = Array.of(
                            'MODIFIER ACTIVE: MAXIMUM OVERDRIVE (+150% CHAOS)',
                            'MODIFIER ACTIVE: LIGHTS OUT IN THE BURJ KHALIFA',
                            'MODIFIER ACTIVE: TRICKSTER’S GAMBIT — WATCH YOUR STEP',
                            'MODIFIER ACTIVE: NO GUIDANCE — YOU’RE ON YOUR OWN'
                        );
                        const modText = modifiers.at(Math.floor(Math.random() * modifiers.length));
                        triggerCrimsonMalice(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showRedMockery('MODIFIER APPLIED', modText);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                        triggerCrimsonMalice(safeX + 80, safeY + 40, false);
                    } else if (act === 'crucifix') {
                        if (typeof window.triggerAFCSBsod === 'function') {
                            window.triggerAFCSBsod('MISCHIEVOUS_LIGHT_MODIFIER_FATAL', 'CRIMSON_SPIRAL_0xR3D', false);
                        }
                    } else if (act === 'restart') {
                        window.location.reload();
                    }
                });
            });
        }, true);
    }
    function startCuriousLightCursor() {
        function isCuriousLightActive() {
            return document.body.classList.contains('theme-yellow')
            || document.body.classList.contains('theme-curious')
            || document.body.classList.contains('search-fx-cornerstone');
        }
        
        const lightCursor = document.createElement('div');
        lightCursor.className = 'curious-light-cursor';
        lightCursor.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://w3.org">
            <polygon points="4,4 26,13 16,17 12,27" fill="#fef08a" stroke="#facc15" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M27 17L29.2 24.8L37 27L29.2 29.2L27 37L24.8 29.2L17 27L24.8 24.8L27 17Z" fill="#ffffff" stroke="#fde047" stroke-width="1.2"/>
            <circle cx="27" cy="27" r="3" fill="#fef08a"/>
        </svg>
    `;
        document.body.appendChild(lightCursor);
        
        let lastLightX = window.innerWidth / 2;
        let lightCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            if (!isCuriousLightActive()) {
                if (lightCursorActive) {
                    lightCursor.classList.remove('is-visible');
                    lightCursorActive = false;
                }
                return;
            }
            
            if (!lightCursorActive) {
                lightCursor.classList.add('is-visible');
                lightCursorActive = true;
            }
            
            const dx = Math.max(-14, Math.min(14, e.clientX - lastLightX));
            lastLightX = e.clientX;
            const tilt = dx * 0.6;
            
            lightCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            lightCursor.classList.remove('is-visible');
            lightCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!isCuriousLightActive()) return;
            
            lightCursor.classList.add('is-shining');
            setTimeout(() => lightCursor.classList.remove('is-shining'), 180);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .curious-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#fef08a', '#facc15', '#ffffff'], 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(880, 0.09, 'sine', 0.03);
        }, { passive: true });
    }
    function startCuriousLightContextMenu() {
        let curiousMenu = null;
        
        function isCuriousLightActive() {
            return document.body.classList.contains('theme-yellow')
            || document.body.classList.contains('theme-curious')
            || document.body.classList.contains('search-fx-cornerstone');
        }
        
        function closeCuriousMenu() {
            if (curiousMenu) {
                curiousMenu.remove();
                curiousMenu = null;
            }
        }
        
        function showCuriousWhisper(title, line) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner';
            banner.style.borderColor = '#fde047';
            banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.85), 0 0 28px rgba(250, 204, 21, 0.65)';
            banner.innerHTML = `<strong style="color:#fef08a;">✦ ${title}</strong><br><span style="font-size:12.5px;font-weight:600;color:#ffffff;">"${line}"</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4000);
        }
        
        function triggerStarlightBurst(x, y, fullRoom = false) {
            if (fullRoom) {
                const flash = document.createElement('div');
                flash.className = 'curious-illuminate-flash';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 850);
            }
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * (fullRoom ? 0.85 : 0.45),
                alpha: 1.0,
                color: '#fef08a'
            });
            
            spawnBurst(x, y, ['#fef08a', '#facc15', '#ffffff', '#fde68a'], fullRoom ? 60 : 32);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.24, 'sine', 0.045), idx * 65);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (curiousMenu && !e.target.closest('.curious-context-menu')) {
                closeCuriousMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCuriousMenu();
        });
        window.addEventListener('scroll', closeCuriousMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!isCuriousLightActive()) return;
            e.preventDefault();
            e.stopPropagation();
            closeCuriousMenu();
            
            const menu = document.createElement('div');
            menu.className = 'curious-context-menu';
            menu.innerHTML = `
            <div class="curious-ctx-header">
                <span>✦ CURIOUS LIGHT // THE ROOMS</span>
                <span class="curious-ctx-badge">A-000</span>
            </div>
            <div class="curious-ctx-item" data-act="whisper">
                <span>✨ Seek Guidance</span>
                <span class="curious-ctx-key">Hint</span>
            </div>
            <div class="curious-ctx-item" data-act="starlight">
                <span>🌟 Illuminate Room</span>
                <span class="curious-ctx-key">Pulse</span>
            </div>
            <div class="curious-ctx-item" data-act="codex">
                <span>📖 Inspect Secret Codex</span>
                <span class="curious-ctx-key">Vault</span>
            </div>
            <div class="curious-ctx-sep"></div>
            <div class="curious-ctx-item" data-act="nextdoor">
                <span>🚪 Advance to Next Room</span>
                <span class="curious-ctx-key">Roster</span>
            </div>
            <div class="curious-ctx-item" data-act="print">
                <span>📜 Preserve Playbill</span>
                <span class="curious-ctx-key">Ctrl+P</span>
            </div>
            <div class="curious-ctx-item" data-act="top">
                <span>⬆️ Return to A-000</span>
                <span class="curious-ctx-key">Top</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            curiousMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(1046.50, 0.1, 'sine', 0.038);
            
            menu.querySelectorAll('.curious-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeCuriousMenu();
                    
                    if (act === 'whisper') {
                        const whispers = Array.of(
                            'Oh, hello... I didn’t expect to see anyone wandering this far into Grade 7 – Psalms.',
                            'Hmm? You’re looking for secrets? Try triple-clicking the portraits... or typing familiar names.',
                            'Be careful around Abrena’s portrait. Once the yellow eye wakes up, it doesn’t like letting go.',
                            'December 17 is approaching fast. Make sure you’ve checked the floorplan before the doors open!',
                            'You seem determined. Keep shining—even in the darkest rooms of the Burj Khalifa.'
                        );
                        const picked = whispers.at(Math.floor(Math.random() * whispers.length));
                        triggerStarlightBurst(safeX + 80, safeY + 40, false);
                        showCuriousWhisper('CURIOUS LIGHT', picked);
                    } else if (act === 'starlight') {
                        triggerStarlightBurst(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) {
                            codexTrigger.click();
                        }
                        triggerStarlightBurst(safeX + 80, safeY + 40, false);
                    } else if (act === 'nextdoor') {
                        const roster = document.querySelector('.People');
                        if (roster) roster.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        playBeep(783.99, 0.12, 'sine', 0.04);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'top') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playBeep(1046.50, 0.12, 'sine', 0.04);
                    }
                });
            });
        }, true);
    }
    function startSolverCursor() {
        const solverCursor = document.createElement('div');
        solverCursor.className = 'solver-hex-cursor';
        solverCursor.innerHTML = `
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://w3.org">
            <g class="solver-cursor-core" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
                <polygon points="25,16 32.5,29 17.5,29" fill="none"/>
                <line x1="25" y1="16" x2="25" y2="5.5"/>
                <polygon points="25,2.5 21.8,7.5 28.2,7.5" fill="currentColor"/>
                <line x1="32.5" y1="29" x2="41.8" y2="34.4"/>
                <polygon points="44.8,36.2 39.2,36.2 42.2,31" fill="currentColor"/>
                <line x1="17.5" y1="29" x2="8.2" y2="34.4"/>
                <polygon points="5.2,36.2 10.8,36.2 7.8,31" fill="currentColor"/>
            </g>
            <circle cx="25" cy="24.5" r="2.6" fill="#ffffff"/>
        </svg>
    `;
        document.body.appendChild(solverCursor);
        
        let solverCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isSolver = document.body.classList.contains('theme-murderdrones');
            if (!isSolver) {
                if (solverCursorActive) {
                    solverCursor.classList.remove('is-visible');
                    solverCursorActive = false;
                }
                return;
            }
            
            if (!solverCursorActive) {
                solverCursor.classList.add('is-visible');
                solverCursorActive = true;
            }
            
            const isUzi = document.body.classList.contains('solver-uzi-mode');
            solverCursor.classList.toggle('is-uzi', isUzi);
            
            solverCursor.style.transform = `translate3d(${e.clientX - 25}px, ${e.clientY - 25}px, 0)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            solverCursor.classList.remove('is-visible');
            solverCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-murderdrones')) return;
            solverCursor.classList.add('is-executing');
            setTimeout(() => solverCursor.classList.remove('is-executing'), 180);
        }, { passive: true });
    }
    function startPartyHackerCursor() {
        const hackCursor = document.createElement('div');
        hackCursor.className = 'party-hacker-cursor';
        hackCursor.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://w3.org">
            <polygon points="4,4 27,13 17,17 13,27" fill="#050814" stroke="#00ff88" stroke-width="1.9" stroke-linejoin="round"/>
            <polygon points="6,6 22,12.5 15.5,15.5" fill="#00f0ff"/>
            <path d="M24 22H34M29 17V27" stroke="#ff0055" stroke-width="1.6" stroke-linecap="round"/>
            <rect x="25.5" y="18.5" width="7" height="7" stroke="#00ff88" stroke-width="1.2"/>
        </svg>
    `;
        document.body.appendChild(hackCursor);
        
        let lastHackX = window.innerWidth / 2;
        let hackCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isParty = document.body.classList.contains('party-mode');
            if (!isParty) {
                if (hackCursorActive) {
                    hackCursor.classList.remove('is-visible');
                    hackCursorActive = false;
                }
                return;
            }
            
            if (!hackCursorActive) {
                hackCursor.classList.add('is-visible');
                hackCursorActive = true;
            }
            
            const dx = Math.max(-16, Math.min(16, e.clientX - lastHackX));
            lastHackX = e.clientX;
            const tilt = dx * 0.7;
            
            hackCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            hackCursor.classList.remove('is-visible');
            hackCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('party-mode')) return;
            
            hackCursor.classList.add('is-injecting');
            setTimeout(() => hackCursor.classList.remove('is-injecting'), 170);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .party-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#00ff88', '#00f0ff', '#ff0055', '#ffffff'], 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(920, 0.05, 'square', 0.03);
        }, { passive: true });
    }
    function startPartyHackerContextMenu() {
        let partyMenu = null;
        
        function closePartyMenu() {
            if (partyMenu) {
                partyMenu.remove();
                partyMenu = null;
            }
        }
        
        function runMatrixRainBurst(cx, cy) {
            const glyphs = Array.of('0', '1', '0x7F', 'ROOT', 'NULL', 'ACK', 'SYN', 'HEX');
            for (let i = 0; i < 16; i++) {
                setTimeout(() => {
                    const tag = document.createElement('div');
                    tag.className = 'quirk-star-glow';
                    tag.textContent = glyphs.at(Math.floor(Math.random() * glyphs.length));
                    const rx = cx + (Math.random() - 0.5) * 320;
                    const ry = cy + (Math.random() - 0.5) * 180;
                    tag.style.cssText = `left:${rx}px;top:${ry}px;font-family:Consolas,monospace;font-size:13px;font-weight:900;color:#00ff88;text-shadow:0 0 10px #00ff88,0 0 18px #00f0ff;`;
                    document.body.appendChild(tag);
                    setTimeout(() => tag.remove(), 1100);
                }, i * 35);
            }
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.6,
                alpha: 1.0,
                color: '#00ff88'
            });
            spawnBurst(cx, cy, ['#00ff88', '#00f0ff', '#ff0055', '#ffffff'], 45);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (partyMenu && !e.target.closest('.party-context-menu')) {
                closePartyMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePartyMenu();
        });
        window.addEventListener('scroll', closePartyMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('party-mode')) return;
            e.preventDefault();
            e.stopPropagation();
            closePartyMenu();
            
            const menu = document.createElement('div');
            menu.className = 'party-context-menu';
            menu.innerHTML = `
            <div class="party-ctx-header">
                <span>💻 ROOT@AFCS // OVERCLOCK</span>
                <span class="party-ctx-badge">SUDO</span>
            </div>
            <div class="party-ctx-item" data-act="inject">
                <span>⚡ ./inject_payload.sh</span>
                <span class="party-ctx-key">0xFF</span>
            </div>
            <div class="party-ctx-item" data-act="glitch">
                <span>📡 Force CRT Desync</span>
                <span class="party-ctx-key">Glitch</span>
            </div>
            <div class="party-ctx-item" data-act="unlock">
                <span>🔓 Dump Secret Codex</span>
                <span class="party-ctx-key">Vault</span>
            </div>
            <div class="party-ctx-sep"></div>
            <div class="party-ctx-item" data-act="exitparty">
                <span>🛑 kill -9 party_mode</span>
                <span class="party-ctx-key">Exit</span>
            </div>
            <div class="party-ctx-item" data-act="bsod">
                <span>💀 Trigger Kernel Panic</span>
                <span class="party-ctx-key">0x00</span>
            </div>
            <div class="party-ctx-item" data-act="reload">
                <span>↻ sudo reboot --now</span>
                <span class="party-ctx-key">Ctrl+R</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            partyMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(1180, 0.06, 'square', 0.038);
            
            menu.querySelectorAll('.party-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closePartyMenu();
                    
                    if (act === 'inject') {
                        runMatrixRainBurst(safeX + 80, safeY + 40);
                        triggerScreenGlitch(160);
                        [440, 554.37, 659.25, 880, 1108.73].forEach((f, idx) => {
                            setTimeout(() => playBeep(f, 0.08, 'square', 0.045), idx * 55);
                        });
                    } else if (act === 'glitch') {
                        triggerScreenGlitch(320);
                        document.body.classList.add('quirk-bomb-shake');
                        setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 320);
                        playBeep(180, 0.22, 'sawtooth', 0.05);
                    } else if (act === 'unlock') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                        playBeep(880, 0.09, 'square', 0.04);
                    } else if (act === 'exitparty') {
                        if (typeof togglePartyMode === 'function') {
                            togglePartyMode();
                        } else {
                            document.body.classList.remove('party-mode');
                        }
                        playBeep(320, 0.12, 'sawtooth', 0.045);
                    } else if (act === 'bsod') {
                        if (typeof window.triggerAFCSBsod === 'function') {
                            window.triggerAFCSBsod('ROOT_SHELL_KERNEL_PANIC', 'OVERCLOCK_DAEMON_0x1337', false);
                        }
                    } else if (act === 'reload') {
                        window.location.reload();
                    }
                });
            });
        }, true);
    }
    function startGuidingLightCursor() {
        function isGuidingLightActive() {
            const b = document.body.classList;
            return !b.contains('theme-griefer')
            && !b.contains('theme-hamilton')
            && !b.contains('theme-epic')
            && !b.contains('theme-doomsday')
            && !b.contains('theme-faithian')
            && !b.contains('theme-red')
            && !b.contains('theme-reactor')
            && !b.contains('theme-yellow')
            && !b.contains('theme-curious')
            && !b.contains('search-fx-cornerstone')
            && !b.contains('theme-murderdrones')
            && !b.contains('party-mode');
        }
        
        
        const guideCursor = document.createElement('div');
        guideCursor.className = 'guiding-light-cursor';
        guideCursor.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="4,4 26,13 16,17 12,27" fill="#bae6fd" stroke="#38bdf8" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M29 19C24.5 19 21 22.5 21 27C21 31.5 24.5 35 29 35C31.5 35 33.7 33.9 35.1 32.1C33.8 32.6 32.3 32.8 30.8 32.4C26.9 31.4 24.6 27.4 25.6 23.5C26.1 21.6 27.4 20 29 19Z" fill="#ffffff" stroke="#7dd3fc" stroke-width="1.1"/>
            <path d="M33 17L34.1 20.9L38 22L34.1 23.1L33 27L31.9 23.1L28 22L31.9 20.9L33 17Z" fill="#e0f2fe"/>
        </svg>
    `;
        document.body.appendChild(guideCursor);
        
        let lastGuideX = window.innerWidth / 2;
        let guideCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            if (!isGuidingLightActive()) {
                if (guideCursorActive) {
                    guideCursor.classList.remove('is-visible');
                    guideCursorActive = false;
                }
                return;
            }
            
            if (!guideCursorActive) {
                guideCursor.classList.add('is-visible');
                guideCursorActive = true;
            }
            
            const dx = Math.max(-14, Math.min(14, e.clientX - lastGuideX));
            lastGuideX = e.clientX;
            const tilt = dx * 0.6;
            
            guideCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            guideCursor.classList.remove('is-visible');
            guideCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!isGuidingLightActive()) return;
            
            guideCursor.classList.add('is-guiding');
            setTimeout(() => guideCursor.classList.remove('is-guiding'), 180);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .guiding-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#38bdf8', '#bae6fd', '#ffffff'], 14);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(659.25, 0.08, 'sine', 0.028);
        }, { passive: true });
    }
    function startGuidingLightContextMenu() {
        let guidingMenu = null;
        
        function isGuidingLightActive() {
            const b = document.body.classList;
            return !b.contains('theme-griefer') &&
            !b.contains('theme-hamilton')
            && !b.contains('theme-epic')
            && !b.contains('theme-doomsday')
            && !b.contains('theme-faithian')
            && !b.contains('theme-red')
            && !b.contains('theme-reactor')
            && !b.contains('theme-yellow')
            && !b.contains('theme-curious')
            && !b.contains('search-fx-cornerstone')
            && !b.contains('theme-murderdrones')
            && !b.contains('party-mode');
        }
        
        function closeGuidingMenu() {
            if (guidingMenu) {
                guidingMenu.remove();
                guidingMenu = null;
            }
        }
        
        function showGuidingMessage(title, text) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner';
            banner.style.borderColor = '#38bdf8';
            banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.85), 0 0 28px rgba(56, 189, 248, 0.65)';
            banner.innerHTML = `<strong style="color:#bae6fd;">☾ ${title}</strong><br><span style="font-size:12.5px;font-weight:600;color:#ffffff;">"${text}"</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4200);
        }
        
        function triggerBlueGuidance(x, y, fullFlash = false) {
            if (fullFlash) {
                const flash = document.createElement('div');
                flash.className = 'guiding-illuminate-flash';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 850);
            }
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * (fullFlash ? 0.85 : 0.45),
                alpha: 1.0,
                color: '#38bdf8'
            });
            
            spawnBurst(x, y, ['#38bdf8', '#7dd3fc', '#bae6fd', '#ffffff'], fullFlash ? 56 : 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [392.00, 493.88, 587.33, 783.99, 987.77].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.24, 'sine', 0.042), idx * 65);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (guidingMenu && !e.target.closest('.guiding-context-menu')) {
                closeGuidingMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGuidingMenu();
        });
        window.addEventListener('scroll', closeGuidingMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!isGuidingLightActive()) return;
            e.preventDefault();
            e.stopPropagation();
            closeGuidingMenu();
            
            const menu = document.createElement('div');
            menu.className = 'guiding-context-menu';
            menu.innerHTML = `
            <div class="guide-ctx-header">
                <span>☾ GUIDING LIGHT // DOOR 001</span>
                <span class="guide-ctx-badge">AFCS</span>
            </div>
            <div class="guide-ctx-item" data-act="guidance">
                <span>🕯️ Illuminate the Path</span>
                <span class="guide-ctx-key">Guide</span>
            </div>
            <div class="guide-ctx-item" data-act="whisper">
                <span>💙 Listen to Guiding Light</span>
                <span class="guide-ctx-key">Hint</span>
            </div>
            <div class="guide-ctx-item" data-act="codex">
                <span>📖 Open Secret Codex</span>
                <span class="guide-ctx-key">Vault</span>
            </div>
            <div class="guide-ctx-sep"></div>
            <div class="guide-ctx-item" data-act="cast">
                <span>🎭 Guide to Cast & Crew</span>
                <span class="guide-ctx-key">Roster</span>
            </div>
            <div class="guide-ctx-item" data-act="floorplan">
                <span>🗺️ Burj Khalifa Floorplan</span>
                <span class="guide-ctx-key">Map</span>
            </div>
            <div class="guide-ctx-item" data-act="print">
                <span>🎟️ Export Official Playbill</span>
                <span class="guide-ctx-key">Ctrl+P</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            guidingMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(783.99, 0.1, 'sine', 0.038);
            
            menu.querySelectorAll('.guide-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeGuidingMenu();
                    
                    if (act === 'guidance') {
                        triggerBlueGuidance(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    } else if (act === 'whisper') {
                        const hints = Array.of(
                            'It seems you have found Beyond The Manger. Take your time exploring every student’s story.',
                            'Whenever you feel lost in the tower, follow the blue light—it will always guide you back.',
                            'Try triple-clicking on certain classmates’ portraits... each one hides a soul of its own.',
                            'You can switch between Curious Light, Olympus, Latveria, and more using the search bar.',
                            'December 17 is fast approaching. Grade 7 – Psalms is ready to shine on stage!'
                        );
                        const picked = hints.at(Math.floor(Math.random() * hints.length));
                        triggerBlueGuidance(safeX + 80, safeY + 40, false);
                        showGuidingMessage('GUIDING LIGHT', picked);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                        triggerBlueGuidance(safeX + 80, safeY + 40, false);
                    } else if (act === 'cast') {
                        const roster = document.querySelector('.People');
                        if (roster) roster.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        playBeep(587.33, 0.12, 'sine', 0.04);
                    } else if (act === 'floorplan') {
                        const fp = document.querySelector('#floorplan, .floorplan-card');
                        if (fp) fp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        playBeep(659.25, 0.12, 'sine', 0.04);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    }
                });
            });
        }, true);
    }
    function startDoggieWaveCursor() {
        if (document.getElementById('doggieWaveCursor')) return;
        
        const trailCanvas = document.createElement('canvas');
        trailCanvas.id = 'doggieWaveTrailCanvas';
        trailCanvas.className = 'doggie-wave-trail-canvas';
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
        document.body.appendChild(trailCanvas);
        const tCtx = trailCanvas.getContext('2d');
        
        window.addEventListener('resize', () => {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }, { passive: true });
        
        const cursorEl = document.createElement('div');
        cursorEl.id = 'doggieWaveCursor';
        cursorEl.className = 'doggie-wave-cursor';
        cursorEl.innerHTML = `<svg viewBox="0 0 56 44" width="44" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="doggieWaveGrad" x1="4" y1="22" x2="50" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#ff00dd"/>
                    <stop offset="52%" stop-color="#ff4db8"/>
                    <stop offset="78%" stop-color="#ffae42"/>
                    <stop offset="100%" stop-color="#fff04d"/>
                </linearGradient>
            </defs>
            <path d="M51 22 C51 11 40 7 29 8 L17 5 L22 12 L9 11 L18 17 L4 22 L18 27 L9 33 L22 32 L17 39 L29 36 C40 37 51 33 51 22 Z"
                  fill="url(#doggieWaveGrad)" stroke="#09090b" stroke-width="3.2" stroke-linejoin="round"/>
        </svg>`;
        document.body.appendChild(cursorEl);
        if (typeof startGriefContextMenu === 'function') startGriefContextMenu();
        if (typeof startDoggieUfoJumper === 'function') startDoggieUfoJumper();
        if (typeof startDoggieCubeJumper === 'function') startDoggieCubeJumper();
        if (typeof startDoggieSpiderToggle === 'function') startDoggieSpiderToggle();
        if (typeof startDoggieShipScrollRider === 'function') startDoggieShipScrollRider();
        if (typeof startDoggieRobotSpotlight === 'function') startDoggieRobotSpotlight();
        if (typeof startDoggieSwingViewToggle === 'function') startDoggieSwingViewToggle();
        
        let lastX = null;
        let lastY = null;
        let currentAngle = 0;
        const trailPoints = [];
        let trailLoopActive = false;
        
        const isGrieferActive = () => document.body.classList.contains('theme-griefer');
        
        function renderTrail() {
            tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            const now = performance.now();
            
            while (trailPoints.length && now - trailPoints[0].t > 380) {
                trailPoints.shift();
            }
            
            if (trailPoints.length > 1 && isGrieferActive() && !STATE.ldmActive && !isHoldingBall) {
                for (let i = 1; i < trailPoints.length; i++) {
                    const p0 = trailPoints[i - 1];
                    const p1 = trailPoints[i];
                    const life = 1 - (now - p1.t) / 380;
                    if (life <= 0) continue;
                    
                    tCtx.save();
                    tCtx.lineCap = 'round';
                    tCtx.lineJoin = 'round';
                    
                    tCtx.strokeStyle = `rgba(255, 0, 221, ${life * 0.45})`;
                    tCtx.lineWidth = Math.max(2, life * 16);
                    tCtx.beginPath();
                    tCtx.moveTo(p0.x, p0.y);
                    tCtx.lineTo(p1.x, p1.y);
                    tCtx.stroke();
                    
                    tCtx.strokeStyle = `rgba(255, 240, 77, ${life * 0.92})`;
                    tCtx.lineWidth = Math.max(1.5, life * 7);
                    tCtx.beginPath();
                    tCtx.moveTo(p0.x, p0.y);
                    tCtx.lineTo(p1.x, p1.y);
                    tCtx.stroke();
                    tCtx.restore();
                }
            }
            
            if (trailPoints.length > 0) {
                requestAnimationFrame(renderTrail);
            } else {
                trailLoopActive = false;
            }
        }
        
        document.addEventListener('pointermove', (e) => {
            if (!isGrieferActive()) {
                cursorEl.classList.remove('is-visible');
                lastX = null;
                lastY = null;
                return;
            }
            
            if (lastX !== null && lastY !== null) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                if (Math.hypot(dx, dy) > 1.5) {
                    currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                }
            }
            lastX = e.clientX;
            lastY = e.clientY;
            
            cursorEl.classList.add('is-visible');
            cursorEl.style.transform = `translate3d(${e.clientX - 40}px, ${e.clientY - 18}px, 0) rotate(${currentAngle.toFixed(1)}deg)`;
            
            trailPoints.push({ x: e.clientX, y: e.clientY, t: performance.now() });
            if (trailPoints.length > 45) trailPoints.shift();
            if (!trailLoopActive) {
                trailLoopActive = true;
                requestAnimationFrame(renderTrail);
            }
        }, { passive: true });
        
        let isHoldingBall = false;
        
        document.addEventListener('pointerdown', (e) => {
            if (!isGrieferActive()) return;
            if (e.target && e.target.matches('input[type="range"]')) {
                isHoldingBall = true;
                cursorEl.classList.add('is-holding-ball');
                spawnBurst(e.clientX, e.clientY, ['#ff00dd', '#fff04d', '#ffffff'], 14);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                if (typeof playBeep === 'function') playBeep(523.25, 0.06, 'triangle', 0.04);
            }
        }, true);
        
        const releaseBallHold = (e) => {
            if (!isHoldingBall) return;
            isHoldingBall = false;
            cursorEl.classList.remove('is-holding-ball');
            if (isGrieferActive() && e && typeof e.clientX === 'number') {
                spawnBurst(e.clientX, e.clientY, ['#ff00dd', '#ffae42', '#fff04d'], 14);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                if (typeof playBeep === 'function') playBeep(659.25, 0.06, 'triangle', 0.04);
            }
        };
        
        window.addEventListener('pointerup', releaseBallHold, true);
        window.addEventListener('pointercancel', releaseBallHold, true);
        
        document.addEventListener('pointerleave', () => {
            cursorEl.classList.remove('is-visible');
            lastX = null;
            lastY = null;
        });
        
        new MutationObserver(() => {
            if (!isGrieferActive()) {
                cursorEl.classList.remove('is-visible');
                trailPoints.length = 0;
                tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            }
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('input', (e) => {
            if (!isGrieferActive()) return;
            const slider = e.target;
            if (slider && slider.matches('input[type="range"]')) {
                const val = parseFloat(slider.value) || 0;
                slider.style.setProperty('--doggie-ball-rot', `${(val * 7.2).toFixed(1)}deg`);
            }
        }, { passive: true });
        
    }
    function startDoggieUfoJumper() {
        if (document.getElementById('doggieUfoJumper')) return;
        
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'doggieUfoJumper';
        btn.className = 'doggie-ufo-jumper';
        btn.title = 'Click to UFO-hop to the next section!';
        btn.innerHTML = `
        <span class="doggie-ufo-icon-wrap"></span>
        <span class="doggie-ufo-label">Jump to Cast &amp; Crew</span>
    `;
        document.body.appendChild(btn);
        
        const labelEl = btn.querySelector('.doggie-ufo-label');
        
        function getSections() {
            const list = [
                { label: 'Top (Title)', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
            ];
            const synopsis = document.querySelector('#synopsis, .synopsis-card, .about-section');
            if (synopsis) list.push({ label: 'Synopsis', action: () => synopsis.scrollIntoView({ behavior: 'smooth', block: 'center' }) });
            
            const cast = document.querySelector('.People');
            if (cast) list.push({ label: 'Cast & Crew', action: () => cast.scrollIntoView({ behavior: 'smooth', block: 'start' }) });
            
            const floorplan = document.querySelector('#floorplan, .floorplan-card');
            if (floorplan) list.push({ label: 'Venue Floorplan', action: () => floorplan.scrollIntoView({ behavior: 'smooth', block: 'center' }) });
            
            const scripture = document.querySelector('.scripture-card, #scripture');
            if (scripture) list.push({ label: 'Scripture & FAQ', action: () => scripture.scrollIntoView({ behavior: 'smooth', block: 'center' }) });
            
            return list;
        }
        
        let stepIdx = 1;
        function syncNextLabel() {
            const sections = getSections();
            const next = sections[stepIdx % sections.length];
            labelEl.textContent = `Jump to ${next.label}`;
        }
        
        syncNextLabel();
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sections = getSections();
            const target = sections[stepIdx % sections.length];
            stepIdx = (stepIdx + 1) % sections.length;
            btn.classList.remove('is-hopping');
            void btn.offsetWidth;
            btn.classList.add('is-hopping');
            
            const rect = btn.getBoundingClientRect();
            if (typeof spawnBurst === 'function') {
                spawnBurst(rect.left + 25, rect.top + 20, ['#ff00dd', '#fff04d', '#ffae42', '#ffffff'], 18);
            }
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof playBeep === 'function') {
                playBeep(392.00, 0.06, 'sawtooth', 0.045);
                setTimeout(() => playBeep(587.33, 0.09, 'triangle', 0.045), 45);
            }
            
            target.action();
            syncNextLabel();
        });
    }
    let griefMenuInitialized = false;
    function startGriefContextMenu() {
        if (griefMenuInitialized) return;
        griefMenuInitialized = true;
        
        let griefMenu = null;
        function closeGriefMenu() {
            if (griefMenu) {
                griefMenu.remove();
                griefMenu = null;
            }
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (griefMenu && !e.target.closest('.griefer-context-menu')) closeGriefMenu();
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGriefMenu();
        });
        window.addEventListener('scroll', closeGriefMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-griefer')) return;
            e.preventDefault();
            e.stopPropagation();
            closeGriefMenu();
            
            const isBordersOn = document.body.classList.contains('grief-highlights-active');
            
            const menu = document.createElement('div');
            menu.className = 'griefer-context-menu';
            menu.innerHTML = `
            <div class="grief-ctx-header">
                <span>🔥 GRIEF.EXE // DOGGIE WAVE</span>
                <span class="grief-ctx-badge">80%</span>
            </div>
            <div class="grief-ctx-item" data-act="roster">
                <span>🎭 Jump to Cast & Crew</span>
                <span class="grief-ctx-key">Roster</span>
            </div>
            <div class="grief-ctx-item" data-act="codex">
                <span>📖 Open Secret Codex</span>
                <span class="grief-ctx-key">Vault</span>
            </div>
            <div class="grief-ctx-item" data-act="print">
                <span>🎟️ Export Playbill</span>
                <span class="grief-ctx-key">Ctrl+P</span>
            </div>
            <div class="grief-ctx-sep"></div>
            <div class="grief-ctx-item" data-act="pulse">
                <span>⚡ Trigger Wave Pulse</span>
                <span class="grief-ctx-key">4×</span>
            </div>
            <div class="grief-ctx-item" data-act="verify">
                <span>🏆 Verify Grief (100%)</span>
                <span class="grief-ctx-key">GG</span>
            </div>
            <div class="grief-ctx-item" data-act="highlights">
                <span>⬜ ${isBordersOn ? 'Disable' : 'Enable'} Grief Borders</span>
                <span class="grief-ctx-key">UI</span>
            </div>
            <div class="grief-ctx-item" data-act="deadlocked">
                <span>🟦 Launch Deadlocked</span>
                <span class="grief-ctx-key">GD</span>
            </div>
            <div class="grief-ctx-sep"></div>
            <div class="grief-ctx-item" data-act="guiding">
                <span>🌙 Return to Guiding Light</span>
                <span class="grief-ctx-key">Reset</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            griefMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, e.clientX));
            const safeY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            if (typeof playBeep === 'function') playBeep(110, 0.09, 'sawtooth', 0.042);
            
            menu.querySelectorAll('.grief-ctx-item').forEach(item => {
                item.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const act = item.dataset.act;
                    closeGriefMenu();
                    
                    if (act === 'roster') {
                        document.querySelector('.People')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        if (typeof playBeep === 'function') playBeep(440, 0.1, 'triangle', 0.04);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'pulse') {
                        const flash = document.createElement('div');
                        flash.className = 'griefer-wave-flash';
                        document.body.appendChild(flash);
                        setTimeout(() => flash.remove(), 850);
                        if (typeof STATE !== 'undefined' && Array.isArray(STATE.particles)) {
                            STATE.particles.push({
                                type: 'SHOCKWAVE',
                                x: safeX + 80,
                                y: safeY + 60,
                                radius: 10,
                                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.85,
                                alpha: 1.0,
                                color: '#ff00dd'
                            });
                        }
                        if (typeof spawnBurst === 'function') {
                            spawnBurst(safeX + 80, safeY + 60, ['#ff00dd', '#ffae42', '#fff04d', '#cc0000'], 48);
                        }
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        if (typeof playBeep === 'function') {
                            playBeep(110, 0.25, 'sawtooth', 0.14);
                            setTimeout(() => playBeep(82.41, 0.45, 'sawtooth', 0.16), 90);
                        }
                    } else if (act === 'verify') {
                        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(160);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner';
                        banner.style.borderColor = '#fff04d';
                        banner.style.background = 'linear-gradient(135deg, rgba(20, 0, 0, 0.97), rgba(75, 0, 45, 0.95))';
                        banner.style.color = '#fff04d';
                        banner.style.boxShadow = '0 0 32px rgba(255, 0, 221, 0.85), 0 0 48px rgba(255, 240, 77, 0.55)';
                        banner.textContent = '🔥 NEW BEST! 80% ➔ 100% // GRIEF VERIFIED BY DOGGIE!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 3000);
                        
                        if (typeof spawnBurst === 'function') {
                            spawnBurst(window.innerWidth / 2, window.innerHeight * 0.45, ['#ff00dd', '#fff04d', '#ffffff', '#cc0000'], 60);
                        }
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        if (typeof playBeep === 'function') {
                            [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                                setTimeout(() => playBeep(f, 0.18, 'triangle', 0.055), i * 80);
                            });
                        }
                    } else if (act === 'highlights') {
                        document.body.classList.toggle('grief-highlights-active');
                    } else if (act === 'deadlocked') {
                        const input = document.getElementById('searchInput');
                        if (input) {
                            input.value = 'deadlocked';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } else if (act === 'guiding') {
                        if (typeof window.applyTheme === 'function') window.applyTheme('blue');
                    }
                });
            });
        }, true);
    }
    function startDoggieCubeJumper() {
        if (document.getElementById('doggieCubeJumper')) return;
        
        const cards = Array.from(document.querySelectorAll('.PeoplePics'));
        if (!cards.length) return;
        
        const homeCard = cards.find(c => {
            const txt = c.querySelector('.overlay-text')?.textContent.toLowerCase() || '';
            return txt.includes('abrena') || txt.includes('caleb');
        }) || cards[0];
        
        const homeWrapper = homeCard.closest('.PersonWrapper') || homeCard;
        if (getComputedStyle(homeWrapper).position === 'static') {
            homeWrapper.style.position = 'relative';
        }
        
        const cubeEl = document.createElement('div');
        cubeEl.id = 'doggieCubeJumper';
        cubeEl.className = 'doggie-cube-jumper';
        homeWrapper.appendChild(cubeEl);
        
        let currentHost = homeWrapper;
        
        document.addEventListener('click', (e) => {
            if (!document.body.classList.contains('theme-griefer')) return;
            const clickedCard = e.target.closest('.PeoplePics');
            if (!clickedCard) return;
            
            const targetWrapper = clickedCard.closest('.PersonWrapper') || clickedCard;
            if (targetWrapper === currentHost) return;
            
            if (getComputedStyle(targetWrapper).position === 'static') {
                targetWrapper.style.position = 'relative';
            }
            
            currentHost = targetWrapper;
            targetWrapper.appendChild(cubeEl);
            
            cubeEl.classList.remove('is-jumping');
            void cubeEl.offsetWidth;
            cubeEl.classList.add('is-jumping');
            
            const rect = targetWrapper.getBoundingClientRect();
            if (typeof spawnBurst === 'function') {
                spawnBurst(rect.left + rect.width / 2, rect.top, ['#ff00dd', '#fff04d', '#ffae42', '#ffffff'], 16);
            }
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof playBeep === 'function') {
                playBeep(330, 0.05, 'square', 0.04);
                setTimeout(() => playBeep(523.25, 0.08, 'triangle', 0.04), 45);
            }
        }, true);
    }
    function startDoggieSpiderToggle() {
        if (document.getElementById('doggieSpiderToggle')) return;
        
        const track = document.createElement('button');
        track.type = 'button';
        track.id = 'doggieSpiderToggle';
        track.className = 'doggie-spider-track';
        track.title = 'Spider Teleport: Warp to flip ALL Alter-Egos!';
        track.innerHTML = `
        <span class="doggie-spider-pad"></span>
        <span class="doggie-spider-track-laser"></span>
        <span class="doggie-spider-icon"></span>
        <span class="doggie-spider-pad"></span>
    `;
        document.body.appendChild(track);
        
        let allAltersActive = false;
        
        const alterRoster = [
            { match: 'sevilla',      altClass: 'is-vox-pfp',      altSrc: 'otherpics/Vox.jpg' },
            { match: 'angeles',      altClass: 'is-zerotwo-pfp',  altSrc: 'otherpics/ZeroTwo.jpg' },
            { match: 'del rosario',  altClass: 'is-carl-pfp',     altSrc: 'otherpics/CarlGrimes.jfif' },
            { match: 'suzon',        altClass: 'is-cortis-pfp',   altSrc: 'otherpics/CortisGroup.jpg' },
            { match: 'dela cruz',    altClass: 'is-kobe-pfp',     altSrc: 'otherpics/Kobe.jpg' },
            { match: 'mantal',       altClass: 'is-crowbar-pfp',  altSrc: 'otherpics/crowbar.jpg' },
            { match: 'abrena',       altCardClass: 'quirk-cyn-solver', altSrc: 'otherpics/Cyn.jpg' },

            { match: 'euler',        altCardClass: 'is-newton-mode', altSrc: 'otherpics/Newton.jpg',  origName: 'Leonhard Euler',    altName: 'Sir Isaac Newton' },
            { match: 'curry',        altCardClass: 'is-jordan-mode', altSrc: 'otherpics/Jordan.jpg',  origName: 'Stephen Curry',     altName: 'Michael Jordan' },
            { match: 'einstein',     altCardClass: 'is-galileo-mode', altSrc: 'otherpics/Galileo.jpg', origName: 'Albert Einstein',   altName: 'Galileo Galilei' },
            { match: 'doggie',       altCardClass: 'is-zoink-mode',  altSrc: 'otherpics/zoink.jpg',   origName: 'Doggie',            altName: 'Zoink' },
            { match: 'tesla',        altCardClass: 'is-gauss-mode',  altSrc: 'otherpics/gauss.jpg',   origName: 'Nikola Tesla',      altName: 'Carl Friedrich Gauss' }
        ];
        
        track.addEventListener('click', (e) => {
            e.stopPropagation();
            allAltersActive = !allAltersActive;
            
            track.classList.toggle('is-active', allAltersActive);
            track.classList.remove('is-warping');
            void track.offsetWidth;
            track.classList.add('is-warping');
            
            const cards = Array.from(document.querySelectorAll('.PeoplePics'));
            cards.forEach((card, idx) => {
                const nameEl = card.querySelector('.overlay-text');
                if (!nameEl) return;
                const raw = nameEl.textContent.toLowerCase();
                
                const entry = alterRoster.find(item =>
                    raw.includes(item.match) ||
                    (item.origName && raw === item.origName.toLowerCase()) ||
                    (item.altName && raw === item.altName.toLowerCase())
                );
                if (!entry) return;
                
                const img = card.querySelector('img');
                const mono = card.querySelector('.monogram-avatar');
                
                if (allAltersActive) {
                    if (img) {
                        if (!img.dataset.spiderOrigSrc) img.dataset.spiderOrigSrc = img.getAttribute('src') || '';
                        img.style.display = 'block';
                        img.src = entry.altSrc;
                        if (entry.altClass) img.classList.add(entry.altClass);
                    }
                    if (mono) mono.style.display = 'none';
                    if (entry.altCardClass) card.classList.add(entry.altCardClass);
                    if (entry.altName) nameEl.textContent = entry.altName;
                } else {
                    if (img) {
                        if (entry.altClass) img.classList.remove(entry.altClass);
                        if (mono) {
                            img.style.display = 'none';
                            mono.style.display = 'flex';
                        } else if (img.dataset.spiderOrigSrc) {
                            img.src = img.dataset.spiderOrigSrc;
                        }
                    }
                    if (entry.altCardClass) card.classList.remove(entry.altCardClass);
                    if (entry.origName) nameEl.textContent = entry.origName;
                }
                
                if (idx % 3 === 0) {
                    const r = card.getBoundingClientRect();
                    if (r.top >= 0 && r.bottom <= window.innerHeight) {
                        const beam = document.createElement('div');
                        beam.className = 'doggie-spider-beam';
                        beam.style.left = `${r.left + r.width / 2}px`;
                        document.body.appendChild(beam);
                        setTimeout(() => beam.remove(), 450);
                    }
                }
            });
            
            const tRect = track.getBoundingClientRect();
            const burstY = allAltersActive ? tRect.top + 26 : tRect.bottom - 26;
            if (typeof spawnBurst === 'function') {
                spawnBurst(tRect.left + tRect.width / 2, burstY, ['#ff00dd', '#fff04d', '#ffae42', '#ffffff'], 24);
            }
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(120);
            if (typeof playBeep === 'function') {
                playBeep(allAltersActive ? 220 : 660, 0.05, 'sawtooth', 0.05);
                setTimeout(() => playBeep(allAltersActive ? 880 : 293.66, 0.1, 'square', 0.05), 35);
            }
        });
    }   
    function startDoggieShipScrollRider() {
        if (document.getElementById('doggieShipScrollRider')) return;
        
        const shipEl = document.createElement('div');
        shipEl.id = 'doggieShipScrollRider';
        shipEl.className = 'doggie-ship-scroll-rider';
        document.body.appendChild(shipEl);
        
        let lastScrollY = window.scrollY;
        let tiltTimer = null;
        
        function syncShipPosition() {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const pct = Math.max(0, Math.min(1, window.scrollY / maxScroll));
            const x = Math.max(4, Math.min(window.innerWidth - 58, pct * window.innerWidth - 27));
            
            
            const dy = window.scrollY - lastScrollY;
            lastScrollY = window.scrollY;
            const pitch = dy > 1 ? -16 : (dy < -1 ? 16 : 0);
            
            shipEl.style.left = `${x.toFixed(1)}px`;
            shipEl.style.transform = `rotate(${pitch}deg)`;
            
            clearTimeout(tiltTimer);
            tiltTimer = setTimeout(() => {
                shipEl.style.transform = 'rotate(0deg)';
            }, 140);
        }
        
        window.addEventListener('scroll', syncShipPosition, { passive: true });
        window.addEventListener('resize', syncShipPosition, { passive: true });
        syncShipPosition();
    }
    function startDoggieRobotSpotlight() {
        if (document.getElementById('doggieRobotLauncher')) return;
        
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'doggieRobotLauncher';
        btn.className = 'doggie-robot-launcher';
        btn.title = 'Hold to charge Robot jetpack, release to land on a random student!';
        btn.innerHTML = `
        <span class="doggie-robot-icon"></span>
        <span class="doggie-robot-label">Hold Robot to Launch</span>
    `;
        document.body.appendChild(btn);
        
        const labelEl = btn.querySelector('.doggie-robot-label');
        let charging = false;
        let chargeVal = 0;
        let chargeRaf = null;
        let launchLock = false;
        
        function updateChargeLoop() {
            if (!charging) return;
            chargeVal = Math.min(1, chargeVal + 0.022);
            btn.style.setProperty('--robot-charge', chargeVal.toFixed(3));
            const pct = Math.round(chargeVal * 100);
            labelEl.textContent = pct >= 100 ? 'MAX BOOST! Release!' : `Boosting... ${pct}%`;
            
            if (Math.random() < 0.35 && typeof spawnBurst === 'function') {
                const r = btn.getBoundingClientRect();
                spawnBurst(r.left + 24, r.top + 28 - chargeVal * 26, ['#ff00dd', '#fff04d', '#ffffff'], 4);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            }
            
            chargeRaf = requestAnimationFrame(updateChargeLoop);
        }
        
        function releaseAndLaunch() {
            if (!charging) return;
            charging = false;
            cancelAnimationFrame(chargeRaf);
            btn.classList.remove('is-charging');
            
            const startRect = btn.getBoundingClientRect();
            const startX = startRect.left + 8;
            const startY = startRect.top - chargeVal * 28;
            const power = Math.max(0.25, chargeVal);
            
            chargeVal = 0;
            btn.style.setProperty('--robot-charge', '0');
            labelEl.textContent = 'Hold Robot to Launch';
            
            if (launchLock) return;
            
            const visibleCards = Array.from(document.querySelectorAll('.PeoplePics')).filter(c => {
                const w = c.closest('.PersonWrapper');
                return !c.classList.contains('is-filtered-out') && (!w || w.style.display !== 'none');
            });
            if (!visibleCards.length) return;
            
            launchLock = true;
            const targetCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            if (typeof playBeep === 'function') {
                playBeep(261.63, 0.08, 'sawtooth', 0.05);
                setTimeout(() => playBeep(523.25 + power * 260, 0.14, 'square', 0.05), 60);
            }
            
            setTimeout(() => {
                const endRect = targetCard.getBoundingClientRect();
                const endX = endRect.left + endRect.width / 2 - 23;
                const endY = endRect.top + endRect.height / 2 - 23;
                
                const flyer = document.createElement('div');
                flyer.className = 'doggie-robot-flyer';
                flyer.style.left = `${startX}px`;
                flyer.style.top = `${startY}px`;
                document.body.appendChild(flyer);
                
                const arcHeight = 140 + power * 180;
                const duration = 680;
                const t0 = performance.now();
                
                function animateFlight(now) {
                    const p = Math.min(1, (now - t0) / duration);
                    const ease = 1 - Math.pow(1 - p, 2.2);
                    const curX = startX + (endX - startX) * ease;
                    const linearY = startY + (endY - startY) * ease;
                    const arcOffset = Math.sin(p * Math.PI) * arcHeight;
                    const curY = linearY - arcOffset;
                    const rot = p * 720;
                    
                    flyer.style.left = `${curX.toFixed(1)}px`;
                    flyer.style.top = `${curY.toFixed(1)}px`;
                    flyer.style.transform = `rotate(${rot.toFixed(1)}deg) scale(${(1 + Math.sin(p * Math.PI) * 0.35).toFixed(2)})`;
                    
                    if (Math.random() < 0.45 && typeof spawnBurst === 'function') {
                        spawnBurst(curX + 23, curY + 23, ['#ff00dd', '#fff04d', '#ffae42'], 4);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    }
                    
                    if (p < 1) {
                        requestAnimationFrame(animateFlight);
                    } else {
                        flyer.remove();
                        if (typeof spawnBurst === 'function') {
                            spawnBurst(endX + 23, endY + 23, ['#ff00dd', '#fff04d', '#ffffff', '#cc0000'], 36);
                            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        }
                        if (typeof playBeep === 'function') {
                            playBeep(196, 0.08, 'sawtooth', 0.06);
                            setTimeout(() => playBeep(659.25, 0.16, 'triangle', 0.06), 60);
                        }
                        targetCard.classList.add('spotlight-winner');
                        setTimeout(() => targetCard.classList.remove('spotlight-winner'), 2200);
                        if (typeof openCard === 'function') openCard(targetCard);
                        launchLock = false;
                    }
                }
                
                requestAnimationFrame(animateFlight);
            }, 320);
        }
        
        btn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            if (launchLock) return;
            charging = true;
            chargeVal = 0.08;
            btn.classList.add('is-charging');
            if (typeof playBeep === 'function') playBeep(220, 0.07, 'sawtooth', 0.04);
            chargeRaf = requestAnimationFrame(updateChargeLoop);
        });
        
        window.addEventListener('pointerup', releaseAndLaunch);
        window.addEventListener('pointercancel', releaseAndLaunch);
    }
    function startDoggieSwingViewToggle() {
        if (document.getElementById('doggieSwingToggle')) return;
        
        const track = document.createElement('button');
        track.type = 'button';
        track.id = 'doggieSwingToggle';
        track.className = 'doggie-swing-track';
        track.title = 'Swing Gravity Flip: Fly up to toggle Grid View vs Compact View!';
        track.innerHTML = `
        <span class="doggie-swing-pad"></span>
        <span class="doggie-swing-track-trail"></span>
        <span class="doggie-swing-icon"></span>
        <span class="doggie-swing-pad"></span>
    `;
        document.body.appendChild(track);
        
        function syncCompactState(isCompact) {
            document.body.classList.toggle('is-compact-view', isCompact);
            track.classList.toggle('is-compact', isCompact);
            localStorage.setItem('afcs_compact_view', isCompact ? 'true' : 'false');
        }
        
        if (localStorage.getItem('afcs_compact_view') === 'true') {
            syncCompactState(true);
        }
        
        track.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextCompact = !document.body.classList.contains('is-compact-view');
            syncCompactState(nextCompact);
            
            track.classList.remove('is-flying');
            void track.offsetWidth;
            track.classList.add('is-flying');
            
            const rect = track.getBoundingClientRect();
            const burstY = nextCompact ? rect.top + 26 : rect.bottom - 26;
            if (typeof spawnBurst === 'function') {
                spawnBurst(rect.left + rect.width / 2, burstY, ['#ff00dd', '#fff04d', '#ffae42', '#ffffff'], 20);
            }
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof playBeep === 'function') {
                playBeep(nextCompact ? 392 : 587.33, 0.08, 'triangle', 0.045);
                setTimeout(() => playBeep(nextCompact ? 659.25 : 392, 0.12, 'sine', 0.045), 65);
            }
        });
    }
    
    let cynHistoryTrapped = false;
    function lockCynHistory() {
        if (cynHistoryTrapped) return;
        cynHistoryTrapped = true;
        history.pushState({ cynSolverTrap: true }, '', window.location.href);
    }
    
    window.addEventListener('popstate', () => {
        if (!cacebCard || !cacebCard.classList.contains('quirk-cyn-solver')) {
            cynHistoryTrapped = false;
            return;
        }
        history.pushState({ cynSolverTrap: true }, '', window.location.href);
        
        const trapLine = 'Giggle. Did you really think the Back button would save you?';
        lastCynSpeech = trapLine;
        spawnBadge(cacebCard, `⬡ [NAVIGATION DENIED] ${trapLine}`, 'quirk-cyn-badge', 1800);
        speakCynLine(trapLine);
        triggerScreenGlitch(160);
        syncCynSidePanel(trapLine);
        
        const rect = cacebCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#ef4444', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
    });
    //#endregion
    