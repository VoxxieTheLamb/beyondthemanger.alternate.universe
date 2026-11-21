//#region Physics
        function startDecorativeWaves() {
            function generateWaveSvg(isVertical = false) {
                let path = isVertical ? 'M 10 0 ' : 'M 0 10 ';
                for (let i = 0; i < 20; i++) {
                    const height = (i % 2 === 0) ? 10 - (Math.random() * 10) : 10 + (Math.random() * 10);
                    const mid = i * 20 + 10;
                    const end = (i + 1) * 20;
                    path += isVertical ? `Q ${height} ${mid}, 10 ${end} ` : `Q ${mid} ${height}, ${end} 10 `;
                }
                path += isVertical ? 'L 0 400 L 0 0 Z' : 'L 400 20 L 0 20 Z';
                const viewBox = isVertical ? '0 0 20 400' : '0 0 400 20';
                return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="%230099ff" d="${path}"/></svg>')`;
            }

            document.documentElement.style.setProperty('--wave-img', generateWaveSvg(false));
            document.documentElement.style.setProperty('--wave-do', generateWaveSvg(true));
            document.documentElement.style.setProperty('--wave-dir', Math.random() < 0.5 ? 'reverse' : 'normal');

            const waveBtn = document.createElement('button');
            waveBtn.type = 'button';
            waveBtn.className = 'scripture-btn wave-toggle-btn';
            waveBtn.style.backdropFilter = 'blur(10px)';

            function syncWaveState(mode) {
                document.body.classList.toggle('waves-paused', mode === 1);
                document.body.classList.toggle('waves-hidden', mode === 2);

                if (mode === 0) {
                    waveBtn.textContent = ' Stop Wave Motion';
                    waveBtn.title = 'Pause background wave motion';
                } else if (mode === 1) {
                    waveBtn.textContent = ' Hide Waves';
                    waveBtn.title = 'Remove background waves completely';
                } else {
                    waveBtn.textContent = ' Show Waves';
                    waveBtn.title = 'Restore animated background waves';
                }
            }

            let savedMode = localStorage.getItem('afcs_waves_mode');
            if (savedMode === null) {
                savedMode = localStorage.getItem('afcs_waves_paused') === 'true' ? '1' : '0';
            }
            let waveMode = Number(savedMode) || 0;
            syncWaveState(waveMode);
        }
        function startParticleCanvas() {
            const hamiltonClickTags = ['★', 'My Shot!', 'Rise Up!', 'Non-Stop!', 'Wait For It!', '★ 1776'];

            window.addEventListener('pointerdown', (e) => {
                const isHamilton = document.body.classList.contains('theme-hamilton');
                const ringColor = isHamilton ? '#eab308' : STATE.partyModeOn ? '#00FF66' : '#38bdf8';
                const colors = isHamilton
                    ? ['#eab308', '#fef3c7', '#18181b', '#facc15']
                    : STATE.partyModeOn
                        ? ['#00FF66', '#00BCFF']
                        : ['#38bdf8', '#facc15'];

                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: e.clientX,
                    y: e.clientY,
                    radius: 4,
                    maxRadius: isHamilton ? 36 : 28,
                    alpha: 1.0,
                    color: ringColor
                });

                spawnBurst(e.clientX, e.clientY, colors, isHamilton ? 22 : 16);
                window.wakeParticleCanvas();

                if (isHamilton && !e.target.closest('button, input, .PeoplePics')) {
                    const notes = [293.66, 369.99, 440.00, 587.33];
                    playBeep(notes[Math.floor(Math.random() * notes.length)], 0.08, 'triangle', 0.03);

                    if (Math.random() < 0.35) {
                        const tag = document.createElement('div');
                        tag.className = 'quirk-star-glow';
                        tag.textContent = hamiltonClickTags[Math.floor(Math.random() * hamiltonClickTags.length)];
                        tag.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-family:Georgia,serif;font-size:14px;font-weight:900;color:#fef3c7;text-shadow:0 2px 10px #000,0 0 12px #eab308;`;
                        document.body.appendChild(tag);
                        setTimeout(() => tag.remove(), 950);
                    }
                }
            }, { passive: true });
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000;';
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            let animRunning = false;

            function syncSize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            syncSize();
            window.addEventListener('resize', syncSize, { passive: true });

            function renderLoop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = STATE.particles.length - 1; i >= 0; i--) {
                    const p = STATE.particles.at(i);

                    if (p.type === 'SHOCKWAVE') {
                        p.radius += 1.8;
                        p.alpha -= 0.04;
                        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
                            STATE.particles.splice(i, 1);
                            continue;
                        }
                        ctx.save();
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = p.alpha;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.restore();
                    } else {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.08;
                        p.alpha -= p.decay;
                        if (p.alpha <= 0) {
                            STATE.particles.splice(i, 1);
                            continue;
                        }
                        ctx.save();
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = p.alpha;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                }

                if (STATE.particles.length > 0) {
                    requestAnimationFrame(renderLoop);
                } else {
                    animRunning = false;
                }
            }

            window.wakeParticleCanvas = function () {
                if (!animRunning) {
                    animRunning = true;
                    requestAnimationFrame(renderLoop);
                }
            };

            window.addEventListener('pointerdown', (e) => {
                const ringColor = STATE.partyModeOn ? '#00FF66' : '#38bdf8';
                const colors = STATE.partyModeOn ? ['#00FF66', '#00BCFF'] : ['#38bdf8', '#facc15'];

                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: e.clientX,
                    y: e.clientY,
                    radius: 4,
                    maxRadius: 28,
                    alpha: 1.0,
                    color: ringColor
                });

                spawnBurst(e.clientX, e.clientY, colors, 16);
                window.wakeParticleCanvas();
            }, { passive: true });
        }
        function startCursorGlow() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const glow = document.createElement('div');
            glow.style.cssText = 'position:fixed;left:0;top:0;width:440px;height:440px;border-radius:50%;pointer-events:none;z-index:2;transform:translate(-50%,-50%);opacity:0;transition:opacity 0.65s ease-out;';
            document.body.appendChild(glow);

            let targetX = window.innerWidth / 2;
            let targetY = window.innerHeight / 2;
            let currentX = targetX;
            let currentY = targetY;
            let prevTrailX = targetX;
            let prevTrailY = targetY;
            let running = false;
            let touchFadeTimer = null;

            function getThemePalette() {
                const b = document.body.classList;
                if (STATE.lockdownOn) {
                    return {
                        bg: 'radial-gradient(circle, rgba(225,29,72,0.3) 0%, rgba(225,29,72,0.08) 40%, transparent 70%)',
                        sparks: Array.of('#f87171', '#ef4444')
                    };
                }
                if (b.contains('theme-murderdrones')) {
                    const isUzi = b.contains('solver-uzi-mode');
                    return {
                        bg: isUzi
                            ? 'radial-gradient(circle, rgba(192,132,252,0.3) 0%, rgba(168,85,247,0.09) 40%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(250,204,21,0.28) 0%, rgba(168,85,247,0.09) 40%, transparent 70%)',
                        sparks: isUzi ? Array.of('#c084fc', '#a855f7', '#ffffff') : Array.of('#facc15', '#c084fc', '#ffffff')
                    };
                }
                if (b.contains('theme-epic')) {
                    return {
                        bg: 'radial-gradient(circle, rgba(56,189,248,0.32) 0%, rgba(250,204,21,0.1) 42%, transparent 70%)',
                        sparks: Array.of('#38bdf8', '#facc15', '#bae6fd')
                    };
                }
                if (b.contains('theme-hamilton')) {
                    return {
                        bg: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(254,243,199,0.09) 40%, transparent 70%)',
                        sparks: Array.of('#eab308', '#fef3c7', '#facc15')
                    };
                }
                if (b.contains('theme-faithian')) {
                    return {
                        bg: 'radial-gradient(circle, rgba(239,68,68,0.26) 0%, rgba(37,99,235,0.14) 42%, transparent 70%)',
                        sparks: Array.of('#ef4444', '#3b82f6', '#facc15', '#ffffff')
                    };
                }
                if (b.contains('theme-doomsday')) {
                    return {
                        bg: 'radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(52,211,153,0.09) 40%, transparent 70%)',
                        sparks: Array.of('#10b981', '#a7f3d0', '#e2e8f0')
                    };
                }
                if (b.contains('search-fx-cornerstone')) {
                    return {
                        bg: 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, rgba(251,146,60,0.09) 40%, transparent 70%)',
                        sparks: Array.of('#facc15', '#fef08a', '#fb923c')
                    };
                }
                if (b.contains('theme-red')) {
                    return {
                        bg: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(220,38,38,0.09) 40%, transparent 70%)',
                        sparks: Array.of('#ef4444', '#f87171', '#fecaca')
                    };
                }
                if (STATE.partyModeOn) {
                    return {
                        bg: 'radial-gradient(circle, rgba(0,255,102,0.28) 0%, rgba(0,188,255,0.09) 40%, transparent 70%)',
                        sparks: Array.of('#00ff66', '#00bcff', '#ffffff')
                    };
                }
                return {
                    bg: 'radial-gradient(circle, rgba(56,189,248,0.28) 0%, rgba(0,153,255,0.08) 40%, transparent 70%)',
                    sparks: Array.of('#38bdf8', '#bae6fd', '#facc15')
                };
            }

            function animateGlow() {
                currentX += (targetX - currentX) * 0.14;
                currentY += (targetY - currentY) * 0.14;
                glow.style.left = `${currentX}px`;
                glow.style.top = `${currentY}px`;
                glow.style.background = getThemePalette().bg;

                const dist = Math.hypot(targetX - currentX, targetY - currentY);
                if (glow.style.opacity !== '0' || dist > 0.5) {
                    requestAnimationFrame(animateGlow);
                } else {
                    running = false;
                }
            }

            function moveSpotlight(x, y, isTouch) {
                if (STATE.ldmActive) {
                    glow.style.opacity = '0';
                    return;
                }
                const speed = Math.hypot(x - prevTrailX, y - prevTrailY);
                if (speed > 26 && Math.random() < 0.45) {
                    const palette = getThemePalette();
                    spawnBurst(x, y, palette.sparks, 2);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                }
                prevTrailX = x;
                prevTrailY = y;

                targetX = x;
                targetY = y;
                clearTimeout(touchFadeTimer);

                if (glow.style.opacity === '0' && !running) {
                    currentX = targetX;
                    currentY = targetY;
                }
                glow.style.opacity = '1';

                if (!running) {
                    running = true;
                    requestAnimationFrame(animateGlow);
                }
                if (isTouch) {
                    touchFadeTimer = setTimeout(() => { glow.style.opacity = '0'; }, 950);
                }
            }

            window.addEventListener('pointermove', (e) => {
                if (e.pointerType !== 'touch') moveSpotlight(e.clientX, e.clientY, false);
            }, { passive: true });

            window.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) moveSpotlight(e.touches.item(0).clientX, e.touches.item(0).clientY, true);
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) moveSpotlight(e.touches.item(0).clientX, e.touches.item(0).clientY, true);
            }, { passive: true });

            document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
        }
        function startPortraitPhysics() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const motionPaused = document.body.classList.contains('waves-paused');
            const maxGravityDist = 290;
            const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
            let pointerX = -9999;
            let pointerY = -9999;
            let lastScrollY = window.scrollY;
            let loopRunning = false;

            let bodies = [];

            function rebuildPhysicsCache() {
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;
                const existingMap = new Map(bodies.map(b => [b.card, b]));

                bodies = getCards().map(card => {
                    const wrapper = card.parentElement || card;
                    const prevTransform = wrapper.style.transform;
                    wrapper.style.transition = 'none';
                    wrapper.style.transform = '';

                    const rect = wrapper.getBoundingClientRect();
                    const radius = rect.width / 2;
                    const docHomeX = rect.left + scrollX + radius;
                    const docHomeY = rect.top + scrollY + radius;

                    wrapper.style.transform = prevTransform;

                    const existing = existingMap.get(card);
                    if (existing) {
                        existing.radius = radius;
                        existing.docHomeX = docHomeX;
                        existing.docHomeY = docHomeY;
                        return existing;
                    }

                    return {
                        card, wrapper, radius, docHomeX, docHomeY,
                        x: 0, y: 0, vx: 0, vy: 0,
                        rx: 0, ry: 0, vrx: 0, vry: 0,
                        scale: 1, vScale: 0, grav: 0, tilting: false
                    };
                });
            }

            window.refreshPortraitPhysicsCache = rebuildPhysicsCache;
            rebuildPhysicsCache();

            window.addEventListener('resize', rebuildPhysicsCache, { passive: true });
            STATE.onFilterCards.push(() => requestAnimationFrame(rebuildPhysicsCache));

            function stepPhysics() {
                if (STATE.ldmActive) {
                    loopRunning = false;
                    return;
                }
                let anyActive = false;
                const stiffness = 0.24;
                const damping = 0.05;
                const viewH = window.innerHeight;
                const focalY = viewH * 0.48;
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;

                bodies.forEach(b => {
                    if (b.card.classList.contains('is-filtered-out')) {
                        if (b.tilting || b.grav > 0 || Math.abs(b.x) > 0.05 || Math.abs(b.y) > 0.05) {
                            b.tilting = false;
                            b.grav = 0;
                            b.x = b.y = b.vx = b.vy = b.rx = b.ry = 0;
                            b.scale = 1;
                            b.wrapper.classList.remove('is-tilting');
                            b.card.style.setProperty('--grav', '0');
                            b.wrapper.style.transform = '';
                        }
                        return;
                    }

                    const radius = b.radius;
                    const homeX = b.docHomeX - scrollX;
                    const homeY = b.docHomeY - scrollY;
                    const dx = pointerX - homeX;
                    const dy = pointerY - homeY;
                    const dist = Math.hypot(dx, dy);

                    b.tilting = !motionPaused && !isTouchPrimary && (b.tilting ? dist <= radius * 1.08 : dist <= radius * 0.95);

                    let targetX = 0, targetY = 0, targetRx = 0, targetRy = 0, targetScale = 1, targetGrav = 0;

                    if (b.tilting) {
                        const normX = Math.min(1, Math.max(0, (dx + radius) / (radius * 2)));
                        const normY = Math.min(1, Math.max(0, (dy + radius) / (radius * 2)));
                        targetRx = (0.5 - normY) * 30;
                        targetRy = (normX - 0.5) * 30;
                        targetScale = 1.08;
                        targetGrav = 1;

                        b.wrapper.classList.add('is-tilting');
                        b.card.style.setProperty('--glare-x', `${(normX * 100).toFixed(1)}%`);
                        b.card.style.setProperty('--glare-y', `${(normY * 100).toFixed(1)}%`);
                    } else {
                        b.wrapper.classList.remove('is-tilting');
                        if (!isTouchPrimary && dist < maxGravityDist) {
                            const strength = Math.pow(1 - dist / maxGravityDist, 1.05);
                            targetX = dx * strength * 0.24;
                            targetY = dy * strength * 0.24;
                            targetScale = 1 + strength * 0.09;
                            targetGrav = strength;
                        } else if (isTouchPrimary && (homeY + radius) > 0 && (homeY - radius) < viewH) {
                            const bandDist = Math.abs(homeY - focalY);
                            if (bandDist < 170) {
                                const bandStrength = Math.pow(1 - bandDist / 170, 1.3);
                                targetScale = 1 + bandStrength * 0.05;
                                targetGrav = bandStrength * 0.85;
                            }
                        }
                    }

                    b.vx = (b.vx + (targetX - b.x) * stiffness) * damping;
                    b.vy = (b.vy + (targetY - b.y) * stiffness) * damping;
                    b.vrx = (b.vrx + (targetRx - b.rx) * stiffness) * damping;
                    b.vry = (b.vry + (targetRy - b.ry) * stiffness) * damping;
                    b.vScale = (b.vScale + (targetScale - b.scale) * stiffness) * damping;

                    b.x += b.vx;
                    b.y += b.vy;
                    b.vrx = Math.max(-14, Math.min(14, b.vrx));
                    b.vry = Math.max(-14, Math.min(14, b.vry));
                    b.rx = Math.max(-60, Math.min(60, b.rx + b.vrx));
                    b.ry = Math.max(-60, Math.min(60, b.ry + b.vry));
                    b.scale += b.vScale;
                    b.grav += (targetGrav - b.grav) * 0.2;

                    const isMoving = Math.abs(b.vx) > 0.01 || Math.abs(b.vy) > 0.01 ||
                        Math.abs(b.vrx) > 0.01 || Math.abs(b.vry) > 0.01 ||
                        Math.abs(targetX - b.x) > 0.05 || Math.abs(targetY - b.y) > 0.05 ||
                        Math.abs(targetRx - b.rx) > 0.05 || Math.abs(targetRy - b.ry) > 0.05 ||
                        Math.abs(targetScale - b.scale) > 0.002 || b.tilting || b.grav > 0.005;

                    if (isMoving) {
                        anyActive = true;
                        b.card.style.setProperty('--grav', b.grav.toFixed(3));
                        b.wrapper.style.transform = `translate3d(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px, 0) perspective(420px) rotateX(${b.rx.toFixed(2)}deg) rotateY(${b.ry.toFixed(2)}deg) scale(${b.scale.toFixed(4)})`;
                    } else if (b.wrapper.style.transform !== '') {
                        b.card.style.setProperty('--grav', '0');
                        b.wrapper.style.transform = '';
                    }
                });

                if (anyActive) requestAnimationFrame(stepPhysics);
                else loopRunning = false;
            }

            function wakePhysics() {
                if (!loopRunning) {
                    loopRunning = true;
                    requestAnimationFrame(stepPhysics);
                }
            }

            window.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                pointerX = e.clientX;
                pointerY = e.clientY;
                wakePhysics();
            }, { passive: true });

            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const deltaY = currentScrollY - lastScrollY;
                lastScrollY = currentScrollY;

                if (isTouchPrimary || pointerX === -9999) {
                    const viewH = window.innerHeight;
                    const impulseY = Math.max(-4.5, Math.min(4.5, -deltaY * 0.045));
                    const impulseRx = Math.max(-6, Math.min(6, deltaY * 0.075));

                    bodies.forEach(b => {
                        if (b.card.classList.contains('is-filtered-out')) return;
                        const homeY = b.docHomeY - currentScrollY;
                        if ((homeY + b.radius) > -60 && (homeY - b.radius) < viewH + 60) {
                            b.vy = Math.max(-6, Math.min(6, b.vy + impulseY));
                            b.vrx = Math.max(-10, Math.min(10, b.vrx + impulseRx));
                        }
                    });
                    wakePhysics();
                }
            }, { passive: true });

            document.addEventListener('mouseleave', () => {
                pointerX = -9999;
                pointerY = -9999;
                wakePhysics();
            });
        }
        function startScrollEffects() {
            const revealTargets = document.querySelectorAll('.synopsis-card, .search-wrapper, .filter-bar, .faction-bar, .PersonWrapper, .teaser-footer');
            if (revealTargets.length) {
                revealTargets.forEach(el => el.classList.add('reveal-on-scroll'));

                const observer = new IntersectionObserver((entries) => {
                    const intersectingWrappers = [];

                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (entry.target.classList.contains('PersonWrapper')) {
                                intersectingWrappers.push(entry.target);
                            } else if (!entry.target.classList.contains('is-visible')) {
                                entry.target.style.setProperty('--reveal-delay', '0ms');
                                entry.target.classList.add('is-visible');
                            }
                        } else if (entry.boundingClientRect.top > window.innerHeight * 0.6) {
                            entry.target.style.removeProperty('--reveal-delay');
                            entry.target.classList.remove('is-visible');
                        }
                    });

                    if (intersectingWrappers.length) {
                        const rows = new Map();
                        intersectingWrappers.forEach(el => {
                            const rowKey = Math.round(el.offsetTop / 24);
                            if (!rows.has(rowKey)) rows.set(rowKey, []);
                            rows.get(rowKey).push(el);
                        });

                        const sortedRowKeys = Array.from(rows.keys()).sort((a, b) => a - b);
                        sortedRowKeys.forEach((key, rowIdx) => {
                            const rowCards = rows.get(key).sort((a, b) => a.offsetLeft - b.offsetLeft);
                            rowCards.forEach((cardEl, colIdx) => {
                                if (cardEl.classList.contains('is-visible')) return;
                                const delay = rowIdx * 150 + colIdx * 55;
                                cardEl.style.setProperty('--reveal-delay', `${delay}ms`);
                                cardEl.classList.add('is-visible');
                            });
                        });
                    }
                }, { threshold: 0.02, rootMargin: '0px 0px -33% 0px' });

                requestAnimationFrame(() => {
                    revealTargets.forEach(el => observer.observe(el));
                });

                window.addEventListener('scroll', () => {
                    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
                        const remaining = Array.from(revealTargets).filter(el => !el.classList.contains('is-visible'));
                        remaining.sort((a, b) => (a.offsetTop - b.offsetTop) || (a.offsetLeft - b.offsetLeft));
                        remaining.forEach((el, idx) => {
                            el.style.setProperty('--reveal-delay', `${idx * 45}ms`);
                            el.classList.add('is-visible');
                        });
                    }
                }, { passive: true });
            }

            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            document.body.appendChild(progressBar);

            const topBtn = document.createElement('button');
            topBtn.type = 'button';
            topBtn.className = 'back-to-top-btn';
            topBtn.textContent = '↑ Top';
            topBtn.title = 'Scroll Back to Top';
            document.body.appendChild(topBtn);

            topBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                playBeep(520, 0.05, 'sine', 0.03);
                setTimeout(() => playBeep(680, 0.07, 'sine', 0.03), 50);
            });

            const hud = document.createElement('div');
            hud.className = 'burj-elevator-hud';
            hud.innerHTML = `<span class="elevator-arrow" id="elevArrow">◆</span><span class="elevator-floor" id="elevFloor">FL 163</span><span class="elevator-zone" id="elevZone">• Spire</span>`;
            document.body.appendChild(hud);

            const arrowEl = hud.querySelector('#elevArrow');
            const floorEl = hud.querySelector('#elevFloor');
            const zoneEl = hud.querySelector('#elevZone');
            let lastScrollY = window.scrollY;
            let hideTimer = null;
            let scrollTicking = false;

            function getZoneName(floor) {
                if (floor >= 148) return 'At The Top SKY';
                if (floor >= 122) return 'Observation Deck';
                if (floor >= 76) return 'Sky Lobby';
                if (floor >= 38) return 'VIP Meet & Greet';
                if (floor >= 10) return 'Security Control';
                return 'Main Lobby';
            }

            function onScrollUpdate() {
                scrollTicking = false;
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                let ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

                document.documentElement.style.setProperty('--scroll-dim', (1 - ratio * 0.1).toFixed(3));
                progressBar.style.width = ratio >= 0.99 ? 'calc(100vw + 20px)' : `calc(${ratio * 100}vw)`;
                topBtn.classList.toggle('visible', scrollTop > 520);
                const floor = Math.max(1, Math.round(163 - ratio * 162));
                floorEl.textContent = `FL ${String(floor).padStart(3, '0')}`;
                zoneEl.textContent = `${getZoneName(floor)}`;
                if (scrollTop > lastScrollY + 2) arrowEl.textContent = '▼';
                else if (scrollTop < lastScrollY - 2) arrowEl.textContent = '▲';
                lastScrollY = scrollTop;
                hud.classList.toggle('is-lockdown', STATE.lockdownOn);
                hud.classList.add('is-active');
                clearTimeout(hideTimer);
                hideTimer = setTimeout(() => {
                    arrowEl.textContent = '◆';
                    hud.classList.remove('is-active');
                }, 1200);
            }

            window.addEventListener('scroll', () => {
                if (!scrollTicking) {
                    scrollTicking = true;
                    requestAnimationFrame(onScrollUpdate);
                }
            }, { passive: true });
            onScrollUpdate();
        }
        function startNightSkyStars() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const canvas = document.createElement('canvas');
            canvas.className = 'night-sky-canvas';
            document.body.prepend(canvas);

            const ctx = canvas.getContext('2d');
            const stars = [];
            const starCount = 75;
            const hexChars = '0123456789ABCDEF⬡';
            let matrixCols = [];

            function rebuildMatrix() {
                const colWidth = 26;
                const count = Math.ceil(canvas.width / colWidth);
                matrixCols = Array.from({ length: count }, (_, i) => ({
                    x: i * colWidth + 8,
                    y: Math.random() * canvas.height,
                    speed: 1.4 + Math.random() * 2.2,
                    char: hexChars[Math.floor(Math.random() * hexChars.length)],
                    cyan: Math.random() < 0.25,
                    alpha: 0.14 + Math.random() * 0.24
                }));
            }

            function resizeStars() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                rebuildMatrix();
            }
            resizeStars();
            window.addEventListener('resize', resizeStars, { passive: true });

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: 0.7 + Math.random() * 1.6,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.015 + Math.random() * 0.025,
                    gold: Math.random() < 0.2
                });
            }

            let starLoopRunning = false;

            function drawStars() {
                if (STATE.ldmActive) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    starLoopRunning = false;
                    return;
                }

                const b = document.body.classList;
                const isReactor = STATE.partyModeOn;
                const isDoomsday = b.contains('theme-doomsday');
                const isHamilton = b.contains('theme-hamilton');
                const isEpic = b.contains('theme-epic');
                const isMurderDrones = b.contains('theme-murderdrones');
                const isFaithian = b.contains('theme-faithian');
                const isCornerstone = b.contains('search-fx-cornerstone');
                const isMischievousRed = b.contains('theme-red');
                const isGuidingBlue = !isCornerstone && !isMischievousRed && !isReactor && !isDoomsday && !isHamilton && !isEpic && !isMurderDrones && !isFaithian;
                const isNight = b.contains('sky-night') && !isCornerstone;

                if (!isReactor && !isDoomsday && !isHamilton && !isEpic && !isMurderDrones && !isFaithian && !isNight && !isCornerstone && !isGuidingBlue && !isMischievousRed) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    starLoopRunning = false;
                    return;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (isReactor) {
                    ctx.font = 'bold 13px monospace';
                    ctx.textAlign = 'center';
                    for (const col of matrixCols) {
                        col.y += col.speed;
                        if (Math.random() < 0.08) {
                            col.char = hexChars[Math.floor(Math.random() * hexChars.length)];
                        }
                        if (col.y > canvas.height + 24) {
                            col.y = -20;
                        }

                        ctx.fillStyle = col.cyan
                            ? `rgba(0, 188, 255, ${(col.alpha * 0.45).toFixed(3)})`
                            : `rgba(0, 255, 102, ${(col.alpha * 0.45).toFixed(3)})`;
                        ctx.fillText(col.char, col.x, col.y - 16);

                        ctx.fillStyle = col.cyan
                            ? `rgba(186, 230, 253, ${col.alpha.toFixed(3)})`
                            : `rgba(0, 255, 102, ${col.alpha.toFixed(3)})`;
                        ctx.fillText(col.char, col.x, col.y);
                    }
                    requestAnimationFrame(drawStars);
                    return;
                }
                if (isEpic) {
                    ctx.lineCap = 'round';
                    for (const s of stars) {
                        s.x -= 3.6 + s.r * 1.4;
                        s.y += 11 + s.r * 3.5;
                        if (s.y > canvas.height + 20) {
                            s.y = -20;
                            s.x = Math.random() * (canvas.width + 200);
                        }
                        if (s.x < -40) {
                            s.x = canvas.width + 20;
                        }
                        ctx.strokeStyle = s.gold
                            ? 'rgba(254, 240, 138, 0.32)'
                            : 'rgba(125, 211, 252, 0.34)';
                        ctx.lineWidth = s.r * 0.9;
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(s.x - 6, s.y + 18);
                        ctx.stroke();
                    }
                    requestAnimationFrame(drawStars);
                    return;
                }
                if (isMurderDrones) {
                    const isUziPalette = b.contains('solver-uzi-mode');
                    const glyphs = Array.of('⬡', '△', '⌖', '✕');
                    for (let idx = 0; idx < stars.length; idx++) {
                        const s = stars.at(idx);
                        s.phase += s.speed;
                        s.y -= 0.32 + s.r * 0.14;
                        if (s.y < -20) {
                            s.y = canvas.height + 20;
                            s.x = Math.random() * canvas.width;
                        }
                        const drawX = s.x + Math.sin(s.phase) * 8;
                        const alpha = 0.22 + ((Math.sin(s.phase) + 1) / 2) * 0.65;

                        if (idx % 5 === 0) {
                            ctx.font = `bold ${Math.round(11 + s.r * 4)}px monospace`;
                            ctx.textAlign = 'center';
                            ctx.fillStyle = (s.gold && !isUziPalette)
                                ? `rgba(250, 204, 21, ${(alpha * 0.85).toFixed(3)})`
                                : `rgba(192, 132, 252, ${(alpha * 0.85).toFixed(3)})`;
                            ctx.fillText(glyphs.at(idx % glyphs.length), drawX, s.y);
                        } else {
                            ctx.beginPath();
                            ctx.arc(drawX, s.y, s.r * 1.15, 0, Math.PI * 2);
                            ctx.fillStyle = (s.gold && !isUziPalette)
                                ? `rgba(254, 240, 138, ${(alpha * 0.55).toFixed(3)})`
                                : `rgba(233, 213, 255, ${(alpha * 0.5).toFixed(3)})`;
                            ctx.fill();
                        }
                    }
                    requestAnimationFrame(drawStars);
                    return;
                }
                if (isFaithian) {
                    const auraCols = Array.of('rgba(239, 68, 68, ', 'rgba(59, 130, 246, ', 'rgba(250, 204, 21, ', 'rgba(255, 255, 255, ');
                    const coreCols = Array.of('rgba(254, 202, 202, ', 'rgba(191, 219, 254, ', 'rgba(254, 240, 138, ', 'rgba(255, 255, 255, ');
                    for (let idx = 0; idx < stars.length; idx++) {
                        const s = stars.at(idx);
                        s.phase += s.speed;
                        s.y -= 0.34 + s.r * 0.12;
                        if (s.y < -12) {
                            s.y = canvas.height + 12;
                            s.x = Math.random() * canvas.width;
                        }
                        const drawX = s.x + Math.sin(s.phase) * 7;
                        const alpha = 0.28 + ((Math.sin(s.phase) + 1) / 2) * 0.68;
                        const cIdx = idx % 4;

                        ctx.beginPath();
                        ctx.arc(drawX, s.y, s.r * 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = `${auraCols.at(cIdx)}${(alpha * 0.25).toFixed(3)})`;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(drawX, s.y, s.r * 1.2, 0, Math.PI * 2);
                        ctx.fillStyle = `${coreCols.at(cIdx)}${alpha.toFixed(3)})`;
                        ctx.fill();
                    }
                    requestAnimationFrame(drawStars);
                    return;
                }
                for (const s of stars) {
                    s.phase += s.speed;
                    if (isCornerstone || isGuidingBlue || isMischievousRed || isDoomsday || isHamilton || s.gold) {
                        s.y -= isDoomsday ? 0.5 : isMischievousRed ? 0.45 : isHamilton ? 0.32 : isCornerstone ? 0.35 : 0.24;
                        if (s.y < -5) s.y = canvas.height + 5;
                    }
                    const swayX = isDoomsday ? Math.sin(s.phase * 1.4) * 10 : isHamilton ? Math.sin(s.phase) * 5 : 0;
                    const jitterX = isMischievousRed && Math.random() < 0.04 ? (Math.random() - 0.5) * 14 : 0;
                    const drawX = s.x + swayX + jitterX;
                    const alpha = 0.25 + ((Math.sin(s.phase) + 1) / 2) * 0.7;

                    if (isHamilton && s.gold) {
                        ctx.font = `${Math.round(10 + s.r * 4)}px Georgia, serif`;
                        ctx.textAlign = 'center';
                        ctx.fillStyle = `rgba(250, 204, 21, ${(alpha * 0.95).toFixed(3)})`;
                        ctx.fillText('★', drawX, s.y);
                        continue;
                    }

                    ctx.beginPath();
                    ctx.arc(drawX, s.y, (isCornerstone || isGuidingBlue || isMischievousRed || isDoomsday || isHamilton ? s.r * 2.5 : s.r * 2.1), 0, Math.PI * 2);
                    ctx.fillStyle = isDoomsday
                        ? `rgba(16, 185, 129, ${(alpha * 0.28).toFixed(3)})`
                        : isMischievousRed
                            ? `rgba(239, 68, 68, ${(alpha * 0.26).toFixed(3)})`
                            : (isCornerstone || isHamilton)
                                ? `rgba(250, 204, 21, ${(alpha * 0.24).toFixed(3)})`
                                : `rgba(56, 189, 248, ${(alpha * 0.22).toFixed(3)})`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(drawX, s.y, isCornerstone || isGuidingBlue || isMischievousRed || isDoomsday || isHamilton ? s.r * 1.2 : s.r, 0, Math.PI * 2);
                    ctx.fillStyle = isDoomsday
                        ? (s.gold ? `rgba(226, 232, 240, ${alpha.toFixed(3)})` : `rgba(167, 243, 208, ${alpha.toFixed(3)})`)
                        : isMischievousRed
                            ? `rgba(254, 202, 202, ${alpha.toFixed(3)})`
                            : (isCornerstone || isHamilton)
                                ? `rgba(254, 249, 195, ${alpha.toFixed(3)})`
                                : `rgba(224, 242, 254, ${alpha.toFixed(3)})`;
                    ctx.fill();
                }

                requestAnimationFrame(drawStars);
            }

            window.wakeStarCanvas = function () {
                if (!starLoopRunning && !STATE.ldmActive) {
                    starLoopRunning = true;
                    requestAnimationFrame(drawStars);
                }
            };
            window.wakeStarCanvas();
        }
    //#endregion
