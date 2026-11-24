function lebronJames() {
    if (!DOM.container) return;
    
    let dunkInProgress = false;
    let homeScore = 0;
    let awayScore = 0;
    let timerSeconds = 300;
    let timerInterval = null;
    let rivalTimeout = null;
    let scoreboardEl = null;
    
    function ensureScoreboard() {
        if (!scoreboardEl) {
            scoreboardEl = document.createElement('div');
            scoreboardEl.className = 'lebron-led-scoreboard';
            scoreboardEl.innerHTML = [
                '<div class="sb-top-row">',
                '<span class="sb-arrow active" id="sbHomeArrow"></span>',
                '<div class="sb-clock" id="lbClock">05:00</div>',
                '<span class="sb-arrow" id="sbAwayArrow"></span>',
                '</div>',
                '<div class="sb-mid-row">',
                '<span class="sb-period-dot active"></span>',
                '<span class="sb-period-dot"></span>',
                '<span class="sb-period-dot"></span>',
                '<span class="sb-period-dot"></span>',
                '</div>',
                '<div class="sb-scores-row">',
                '<div class="sb-team-box"><span class="sb-label">LEBRON (HOME)</span><span class="sb-digits" id="lbHomeScore">00</span></div>',
                '<div class="sb-shot-box"><span class="sb-label">SHOT</span><span class="sb-shot-digits" id="lbShotClock">24</span></div>',
                '<div class="sb-team-box"><span class="sb-label">KAWHI (AWAY)</span><span class="sb-digits is-away" id="lbAwayScore">00</span></div>',
                '</div>'
            ].join('');
            document.body.appendChild(scoreboardEl);
        }
        requestAnimationFrame(() => scoreboardEl.classList.add('is-dropped'));
        return scoreboardEl;
    }
    function updateScoreboardDisplay(lastScorer = null) {
        if (!scoreboardEl) return;
        const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        const clockEl = scoreboardEl.querySelector('#lbClock');
        const homeEl = scoreboardEl.querySelector('#lbHomeScore');
        const awayEl = scoreboardEl.querySelector('#lbAwayScore');
        const homeArrow = scoreboardEl.querySelector('#sbHomeArrow');
        const awayArrow = scoreboardEl.querySelector('#sbAwayArrow');
        
        if (clockEl) clockEl.textContent = `${mins}:${secs}`;
        if (homeEl) homeEl.textContent = String(homeScore).padStart(2, '0');
        if (awayEl) awayEl.textContent = String(awayScore).padStart(2, '0');
        
        if (lastScorer === 'home') {
            if (homeArrow) homeArrow.classList.add('active');
            if (awayArrow) awayArrow.classList.remove('active');
        } else if (lastScorer === 'away') {
            if (awayArrow) awayArrow.classList.add('active');
            if (homeArrow) homeArrow.classList.remove('active');
        }
    }
    
    function stopRivalLoop() {
        clearTimeout(rivalTimeout);
        rivalTimeout = null;
    }
    
    function triggerRivalAutoScore(side) {
        if (!timerInterval) return;
        
        const targetSelector = side === 'away' ? '#lbAwayScore' : '#lbHomeScore';
        const digitEl = scoreboardEl ? scoreboardEl.querySelector(targetSelector) : null;
        
        if (side === 'away') {
            awayScore = Math.min(199, awayScore + 2);
            updateScoreboardDisplay('away');
        } else {
            homeScore = Math.min(199, homeScore + 2);
            updateScoreboardDisplay('home');
        }
        
        if (digitEl) {
            digitEl.classList.remove('score-pop');
            void digitEl.offsetWidth;
            digitEl.classList.add('score-pop');
            
            const rect = digitEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const popTag = document.createElement('div');
            popTag.className = 'quirk-float-pop';
            popTag.textContent = side === 'away' ? '🧊 KAWHI +2!' : '🔥 LEBRON +2!';
            popTag.style.cssText = `left:${cx}px;top:${cy + 28}px;font-size:14px;font-weight:900;color:${side === 'away' ? '#38bdf8' : '#facc15'};text-shadow:0 2px 10px #000;`;
            document.body.appendChild(popTag);
            setTimeout(() => popTag.remove(), 900);
            
            spawnBurst(cx, cy, side === 'away' ? ['#38bdf8', '#ffffff'] : ['#facc15', '#a855f7'], 14);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        }
        
        playBeep(side === 'away' ? 493.88 : 587.33, 0.09, 'triangle', 0.04);
        setTimeout(() => playBeep(side === 'away' ? 659.25 : 783.99, 0.14, 'triangle', 0.045), 75);
    }
    
    function scheduleRivalScore(rivalSide) {
        stopRivalLoop();
        if (!timerInterval) return;
        const delayMs = 2000 + Math.floor(Math.random() * 5000);
        rivalTimeout = setTimeout(() => {
            if (!timerInterval) return;
            triggerRivalAutoScore(rivalSide);
            scheduleRivalScore(rivalSide);
        }, delayMs);
    }
    
    function startMatchClock(activeUserSide) {
        const rivalSide = activeUserSide === 'home' ? 'away' : 'home';
        if (!timerInterval) {
            timerSeconds = 300;
            updateScoreboardDisplay(activeUserSide);
            
            timerInterval = setInterval(() => {
                timerSeconds--;
                updateScoreboardDisplay();
                
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    stopRivalLoop();
                    
                    playBeep(146.83, 0.45, 'sawtooth', 0.08);
                    setTimeout(() => playBeep(110.00, 0.75, 'sawtooth', 0.09), 220);
                    
                    if (scoreboardEl) {
                        scoreboardEl.classList.add('is-buzzer');
                        setTimeout(() => {
                            homeScore = 0;
                            awayScore = 0;
                            timerSeconds = 300;
                            updateScoreboardDisplay('home');
                            scoreboardEl.classList.remove('is-buzzer', 'is-dropped');
                        }, 2200);
                    } else {
                        homeScore = 0;
                        awayScore = 0;
                        timerSeconds = 300;
                    }
                }
            }, 1000);
        }
        scheduleRivalScore(rivalSide);
    }
    function triggerHeroSlamDunk(startX, startY, side = 'home') {
        if (dunkInProgress) return;
        dunkInProgress = true;
        
        setTimeout(() => closePanel(), 10);
        
        const ball = document.createElement('div');
        ball.className = 'lebron-dunk-ball';
        ball.textContent = '🏀';
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        document.body.appendChild(ball);
        
        const floorY = window.innerHeight - 44;
        const endX = Math.min(window.innerWidth - 70, Math.max(90, window.innerWidth * 0.82));
        const stepX = (endX - startX) / 4;
        
        const dribbleAnim = ball.animate([
            { left: `${startX}px`, top: `${startY}px`, transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' },
            { left: `${startX + stepX * 0.5}px`, top: `${floorY}px`, transform: 'translate(-50%, -50%) scale(1.18, 0.82) rotate(90deg)', offset: 0.12 },
            { left: `${startX + stepX}px`, top: `${floorY - 125}px`, transform: 'translate(-50%, -50%) scale(0.96, 1.05) rotate(180deg)', offset: 0.25 },
            { left: `${startX + stepX * 1.5}px`, top: `${floorY}px`, transform: 'translate(-50%, -50%) scale(1.18, 0.82) rotate(270deg)', offset: 0.37 },
            { left: `${startX + stepX * 2}px`, top: `${floorY - 130}px`, transform: 'translate(-50%, -50%) scale(0.96, 1.05) rotate(360deg)', offset: 0.50 },
            { left: `${startX + stepX * 2.5}px`, top: `${floorY}px`, transform: 'translate(-50%, -50%) scale(1.18, 0.82) rotate(450deg)', offset: 0.62 },
            { left: `${startX + stepX * 3}px`, top: `${floorY - 135}px`, transform: 'translate(-50%, -50%) scale(0.96, 1.05) rotate(540deg)', offset: 0.75 },
            { left: `${startX + stepX * 3.5}px`, top: `${floorY}px`, transform: 'translate(-50%, -50%) scale(1.22, 0.78) rotate(630deg)', offset: 0.88 },
            { left: `${endX}px`, top: `${floorY - 90}px`, transform: 'translate(-50%, -50%) scale(1.1) rotate(720deg)', offset: 1 }
        ], {
            duration: 2000,
            easing: 'linear',
            fill: 'forwards'
        });
        
        const bounceTimes = [240, 740, 1240, 1760];
        bounceTimes.forEach((ms, i) => {
            setTimeout(() => {
                const bx = startX + stepX * (i + 0.5);
                playBeep(115 + i * 8, 0.08, 'sine', 0.08);
                spawnBurst(bx, floorY + 12, side === 'away' ? ['#38bdf8', '#94a3b8'] : ['#fb923c', '#facc15'], 8);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            }, ms);
        });
        
        dribbleAnim.onfinish = () => {
            ball.remove();
            
            const launchBall = document.createElement('div');
            launchBall.className = 'lebron-dunk-ball';
            launchBall.textContent = '🏀';
            launchBall.style.left = `${endX}px`;
            launchBall.style.top = `${floorY - 90}px`;
            document.body.appendChild(launchBall);
            
            requestAnimationFrame(() => {
                launchBall.style.transition = 'top 0.65s cubic-bezier(0.22, 1, 0.36, 1), left 0.65s ease-out, transform 0.65s ease-out';
                launchBall.style.top = '-70px';
                launchBall.style.left = `${Math.max(140, endX - 90)}px`;
                launchBall.style.transform = 'translate(-50%, -50%) scale(1.25) rotate(-540deg)';
            });
            
            playBeep(320, 0.14, 'triangle', 0.055);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            const hoop = document.createElement('div');
            hoop.className = 'lebron-hero-hoop';
            hoop.innerHTML = '<div class="hoop-pole"></div><div class="hoop-arm"></div><div class="hoop-backboard"></div><div class="hoop-rim"></div><div class="hoop-net"></div>';
            document.body.appendChild(hoop);
            
            requestAnimationFrame(() => hoop.classList.add('is-visible'));
            
            setTimeout(() => {
                launchBall.remove();
                
                const incomingBall = document.createElement('div');
                incomingBall.className = 'lebron-dunk-ball';
                incomingBall.textContent = '🏀';
                const startArcX = Math.min(window.innerWidth - 60, window.innerWidth * 0.78);
                const startArcY = window.innerHeight + 50;
                incomingBall.style.left = `${startArcX}px`;
                incomingBall.style.top = `${startArcY}px`;
                document.body.appendChild(incomingBall);
                
                const rimEl = hoop.querySelector('.hoop-rim');
                const rimRect = rimEl.getBoundingClientRect();
                const rimX = rimRect.left + rimRect.width / 2;
                const rimY = rimRect.top + rimRect.height / 2;
                
                const arcAnim = incomingBall.animate([
                    {
                        left: `${startArcX}px`,
                        top: `${startArcY}px`,
                        transform: 'translate(-50%, -50%) scale(1.3) rotate(0deg)'
                    },
                    {
                        left: `${rimX + 140}px`,
                        top: `${Math.max(55, rimY - 115)}px`,
                        transform: 'translate(-50%, -50%) scale(1.45) rotate(-260deg)',
                        offset: 0.62
                    },
                    {
                        left: `${rimX}px`,
                        top: `${rimY - 6}px`,
                        transform: 'translate(-50%, -50%) scale(1.15) rotate(-420deg)',
                        offset: 0.85
                    },
                    {
                        left: `${rimX}px`,
                        top: `${rimY + 62}px`,
                        transform: 'translate(-50%, -50%) scale(0.95) rotate(-520deg)',
                        opacity: 0
                    }
                ], {
                    duration: 850,
                    easing: 'cubic-bezier(0.25, 0.9, 0.35, 1)',
                    fill: 'forwards'
                });
                
                setTimeout(() => {
                    hoop.classList.add('is-dunked');
                    document.body.classList.add('quirk-bomb-shake');
                    
                    const fire = document.createElement('div');
                    fire.className = 'lebron-dunk-fire';
                    fire.textContent = side === 'away' ? '❄️❄️' : '🔥🔥';
                    fire.style.left = `${rimX}px`;
                    fire.style.top = `${rimY}px`;
                    document.body.appendChild(fire);
                    setTimeout(() => fire.remove(), 1100);
                    
                    ensureScoreboard();
                    if (side === 'away') {
                        awayScore = Math.min(199, awayScore + 2);
                    } else {
                        homeScore = Math.min(199, homeScore + 2);
                    }
                    updateScoreboardDisplay(side);
                    startMatchClock(side);
                    
                    const targetDigitSelector = side === 'away' ? '#lbAwayScore' : '#lbHomeScore';
                    const activeDigits = scoreboardEl.querySelector(targetDigitSelector);
                    if (activeDigits) {
                        activeDigits.classList.remove('score-pop');
                        void activeDigits.offsetWidth;
                        activeDigits.classList.add('score-pop');
                    }
                    
                    spawnBurst(rimX, rimY, side === 'away' ? ['#38bdf8', '#ef4444', '#ffffff'] : ['#fb923c', '#facc15', '#ef4444', '#ffffff'], 36);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    
                    playBeep(110, 0.22, 'sawtooth', 0.08);
                    setTimeout(() => playBeep(65, 0.3, 'square', 0.07), 50);
                    setTimeout(() => playBeep(783.99, 0.16, 'triangle', 0.05), 140);
                    setTimeout(() => playBeep(1046.50, 0.24, 'triangle', 0.055), 220);
                    
                    setTimeout(() => {
                        document.body.classList.remove('quirk-bomb-shake');
                    }, 480);
                }, 710);
                
                arcAnim.onfinish = () => {
                    incomingBall.remove();
                    setTimeout(() => {
                        hoop.classList.remove('is-visible');
                        setTimeout(() => {
                            hoop.remove();
                            dunkInProgress = false;
                        }, 380);
                    }, 650);
                };
            }, 680);
        };
    }
    function spawnLegendCard(config, animate = false) {
        if (document.getElementById(config.wrapperId)) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = config.wrapperId;
        wrapper.className = 'PersonWrapper';
        
        const card = document.createElement('div');
        card.className = `PeoplePics ${config.cardClass}`;
        card.dataset.role = 'Guest Legend';
        card.dataset.displayRole = 'VIP Guest Star';
        card.dataset.character = config.character;
        card.dataset.birthday = config.birthday;
        card.dataset.bio = config.bio;
        
        const img = document.createElement('img');
        img.src = config.imgSrc;
        img.alt = config.fullName;
        
        const label = document.createElement('p');
        label.className = 'overlay-text';
        label.textContent = config.fullName;
        
        const pip = document.createElement('span');
        pip.className = `portrait-role-pip ${config.pipClass}`;
        pip.textContent = config.pipEmoji;
        pip.title = config.pipTitle;
        
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        wrapper.appendChild(pip);
        DOM.container.appendChild(wrapper);
        
        card.addEventListener('click', (e) => {
            if (!e._isTripleTap && e.detail !== 3) return;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            card.classList.remove('quirk-lebron-dribble');
            void card.offsetWidth;
            card.classList.add('quirk-lebron-dribble');
            
            triggerHeroSlamDunk(cx, cy, config.side);
        });
        
        if (animate) {
            card.classList.add('quirk-lebron-dribble');
            setTimeout(() => card.classList.remove('quirk-lebron-dribble'), 650);
        }
        
        filterCards();
    }
    
    const lebronConfig = {
        wrapperId: 'lebronSecretWrapper',
        cardClass: 'is-lebron-card',
        pipClass: 'pip-lebron',
        pipEmoji: '🏀',
        pipTitle: 'Basketball Legend',
        fullName: 'James, LeBron',
        imgSrc: 'otherPics/Lebron.jpg',
        character: 'Artist 6 - Basketball Legend',
        birthday: 'December 30, 1984',
        side: 'home',
        bio: 'widely regarded as one of the greatest basketball players of all time, LeBron "King" James is a 4× NBA Champion, 4× NBA MVP, 3× Olympic Gold Medalist, and the first player in NBA history to surpass 40,000 career points. Taking a break from rewriting the record books, he is making a surprise VIP guest appearance high above Dubai at the Burj Khalifa Christmas Meet & Greet for Paskong AFCS 2026 — bringing championship energy and festive cheer to Grade 7 – Psalms and guests!',
    };
    
    const kawhiConfig = {
        wrapperId: 'kawhiSecretWrapper',
        cardClass: 'is-kawhi-card',
        pipClass: 'pip-kawhi',
        pipEmoji: '🏀',
        pipTitle: 'The Klaw',
        fullName: 'Leonard, Kawhi',
        imgSrc: 'otherPics/kawhi.jpg',
        character: 'Artist 7 - Two-Way Superstar',
        birthday: 'June 29, 1991',
        bio: 'One of the most dominant two-way superstars in basketball history, Kawhi "The Klaw" Leonard is a 2× NBA Champion, 2× Finals MVP, and 2× Defensive Player of the Year famous for his four-bounce buzzer-beater and stoic intensity. Trading the hardwood for Dubai\'s skyline, he is stepping onto the Burj Khalifa stage to go head-to-head with LeBron James in an epic Paskong AFCS 2026 Christmas showdown for Grade 7 – Psalms and guests!',
        side: 'away'
    };
    
    if (localStorage.getItem('afcs_lebron_unlocked') === 'true') {
        spawnLegendCard(lebronConfig, false);
    }
    if (localStorage.getItem('afcs_kawhi_unlocked') === 'true') {
        spawnLegendCard(kawhiConfig, false);
    }
    STATE.onSearchInput.push((val) => {
        if (val === 'lebron' && localStorage.getItem('afcs_lebron_unlocked') !== 'true') {
            localStorage.setItem('afcs_lebron_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fb923c', '#facc15', '#a855f7'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [392.00, 493.88, 587.33, 783.99].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnLegendCard(lebronConfig, true);
            
            const addedCard = document.querySelector('#lebronSecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        } else if (val === 'kawhi' && localStorage.getItem('afcs_kawhi_unlocked') !== 'true') {
            localStorage.setItem('afcs_kawhi_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#38bdf8', '#ef4444', '#ffffff'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [329.63, 440.00, 523.25, 659.25].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnLegendCard(kawhiConfig, true);
            
            const addedCard = document.querySelector('#kawhiSecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        }
    });
    
}
function startLeonhardEuler() {
    if (!DOM.container) return;
    
    const eulerFormulas = [
        'e^(iπ) + 1 = 0 ',
        'e ≈ 2.718281828459... ',
        'V − E + F = 2 ',
        'ζ(2) = ∑ 1/n² = π² / 6 ',
        'e^(ix) = cos(x) + i·sin(x)',
        'f(x), Function Notation! ',
        'γ ≈ 0.577215664901... ',
        'ζ(s) = ∑ 1/nˢ = ∏ (1 - p⁻ˢ)⁻¹ ',
        'a^φ(n) ≡ 1 (mod n) ',
        '∂u/∂t + (u·∇)u = -∇p/ρ + g ',
        'x·∂f/∂x + y·∂f/∂y = n·f(x,y) ',
        'P_cr = π²EI / (KL)² ',
        'e = ∑ 1/n! ',
        'i^i = e^(-π/2) ≈ 0.207879576... ',
        'x(d²y/dx²) + dy/dx + xy = 0 ',
        '∑ (from n=1 to ∞) (-1)^(n-1) / n = ln(2) ',
        'Euler Line: H, G, and O are collinear ',
        '∫₀^∞ e^(-x²) dx = √π / 2 ',
        'Γ(n) = (n − 1)! ',
        'Γ(z) = ∫₀^∞ t^(z−1) e^(-t) dt ',
        'B(x, y) = Γ(x)Γ(y) / Γ(x + y) ',
        'π / 4 = 1 − 1/3 + 1/5 − 1/7 + ... ',
        'π / 4 = 4·arctan(1/5) − arctan(1/239) ',
        'sin(x) = x · ∏ (1 − x² / (n²π²)) ',
        'cos(x) = ∏ (1 − 4x² / ((2n−1)²π²)) ',
        'sin(x) = (e^(ix) − e^(-ix)) / (2i) ',
        'cos(x) = (e^(ix) + e^(-ix)) / 2 ',
        'ln(−1) = iπ ',
        'ζ(4) = ∑ 1/n⁴ = π⁴ / 90 ',
        'ζ(6) = ∑ 1/n⁶ = π⁶ / 945 ',
        '1 − 2 + 3 − 4 + ... = 1/4 ',
        '1 − 1 + 1 − 1 + ... = 1/2 ',
        'φ(n) = n · ∏ (1 − 1/p) ',
        'a^(p−1) ≡ 1 (mod p) ',
        'M_p = 2^p − 1 (Mersenne Primes) ',
        '2^(p−1)(2^p − 1) = Even Perfect Numbers ',
        '641 divides 2³² + 1 ',
        'R² = d(d − 2r) (Euler Triangle Theorem) ',
        'Area = √(s(s−a)(s−b)(s−c)) ',
        '9-Point Circle: Euler\'s Circle! ',
        'χ = V − E + F = 2 − 2g ',
        'Seven Bridges of Königsberg: No Eulerian Path! ',
        'd/dt (I·ω) + ω × (I·ω) = τ ',
        'dL/dt = τ (Euler\'s Second Law) ',
        'L = T − V (Euler-Lagrange: ∂L/∂q − d/dt(∂L/∂q̇) = 0) ',
        'κ_n = κ₁·cos²(θ) + κ₂·sin²(θ) ',
        'T₂ = T₁ · e^(μβ) (Capstan Equation) ',
        'f(x + h) ≈ f(x) + h·f\'(x) (Euler\'s Method) ',
        '∏ (1 − xⁿ)⁻¹ = ∑ p(n)xⁿ (Partition Function) ',
        '∑ (from k=1 to ∞) 1 / k² = 3 · ∑ 1 / (k²·C(2k,k)) ',
        'i = √(−1), Imaginary Unit Notation! ',
        '∑, Sigma Summation Notation! ',
        'Δy, Finite Difference Notation! '
    ];
    let formulaIdx = -1;
    
    function spawnEulerCard(animate = false) {
        if (document.getElementById('eulerSecretWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'eulerSecretWrapper';
        wrapper.className = 'PersonWrapper';
        
        const card = document.createElement('div');
        card.className = 'PeoplePics is-euler-card';
        card.dataset.role = 'Guest Legend';
        card.dataset.displayRole = 'VIP Math Legend';
        card.dataset.character = 'Artist 8 - Grandmaster of Mathematics';
        card.dataset.birthday = 'April 15, 1707';
        card.dataset.bio = '18th-century Swiss mathematician, physicist, and creator of e^(iπ) + 1 = 0, stopping by the Burj Khalifa Christmas Meet & Greet for Paskong AFCS 2026!';
        
        const img = document.createElement('img');
        img.src = 'otherPics/euler.jpg';
        img.alt = 'Euler, Leonhard';
        
        const label = document.createElement('p');
        label.className = 'overlay-text';
        label.textContent = 'Euler, Leonhard';
        
        const pip = document.createElement('span');
        pip.className = 'portrait-role-pip pip-euler';
        pip.textContent = '∑';
        pip.title = 'Leonhard Euler (e ≈ 2.71828)';
        
        const orbitRingBack = document.createElement('div');
        orbitRingBack.className = 'euler-orbit-ring is-back';
        
        const orbitRingFront = document.createElement('div');
        orbitRingFront.className = 'euler-orbit-ring is-front';
        
        const orbitSatellite = document.createElement('div');
        orbitSatellite.className = 'euler-unit-circle';
        orbitSatellite.title = 'Unit Circle (x² + y² = 1)';
        orbitSatellite.innerHTML = [
            '<svg viewBox="0 0 36 36" width="34" height="34">',
            '<line x1="2" y1="18" x2="33" y2="18" stroke="#050a23" stroke-width="1.3" stroke-linecap="round"/>',
            '<line x1="18" y1="34" x2="18" y2="3" stroke="#050a23" stroke-width="1.3" stroke-linecap="round"/>',
            '<polygon points="34,18 30.5,16.2 30.5,19.8" fill="#050a23"/>',
            '<polygon points="18,2 16.2,5.5 19.8,5.5" fill="#050a23"/>',
            '<circle cx="18" cy="18" r="10" fill="none" stroke="#1d4ed8" stroke-width="1.8"/>',
            '<polyline points="18,14.5 21.5,14.5 21.5,18" fill="none" stroke="#16a34a" stroke-width="1.2"/>',
            '<line x1="18" y1="18" x2="18" y2="8" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round"/>',
            '<line x1="18" y1="18" x2="28" y2="18" stroke="#f97316" stroke-width="1.8" stroke-linecap="round"/>',
            '</svg>'
        ].join('');
        
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(orbitRingBack);
        wrapper.appendChild(card);
        wrapper.appendChild(orbitRingFront);
        wrapper.appendChild(orbitSatellite);
        wrapper.appendChild(pip);
        DOM.container.appendChild(wrapper);
        
        
        card.addEventListener('click', () => {
            let nextIdx = Math.floor(Math.random() * eulerFormulas.length);
            if (eulerFormulas.length > 1 && nextIdx === formulaIdx) {
                nextIdx = (nextIdx + 1) % eulerFormulas.length;
            }
            formulaIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            card.animate([
                { transform: 'rotate(0deg) scale(1)' },
                { transform: 'rotate(-10deg) scale(1.12)', offset: 0.35 },
                { transform: 'rotate(10deg) scale(1.12)', offset: 0.7 },
                { transform: 'rotate(0deg) scale(1)' }
            ], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            
            const badge = document.createElement('div');
            badge.className = 'quirk-euler-bubble';
            badge.textContent = eulerFormulas[formulaIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 8,
                maxRadius: 95,
                alpha: 1.0,
                color: '#facc15'
            });
            spawnBurst(cx, cy, ['#facc15', '#38bdf8', '#fef08a', '#ffffff'], 24);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [271.83, 314.16, 440.00, 543.66].forEach((freq, i) => {
                setTimeout(() => playBeep(freq, 0.1, 'triangle', 0.04), i * 60);
            });
        });
        
        if (animate) {
            card.animate([
                { transform: 'scale(0.8)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
            ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
        
        filterCards();
    }
    
    if (localStorage.getItem('afcs_euler_unlocked') === 'true') {
        spawnEulerCard(false);
    }
    STATE.onSearchInput.push((val) => {
        if ((val === 'euler' || val === '2.71828') && localStorage.getItem('afcs_euler_unlocked') !== 'true') {
            localStorage.setItem('afcs_euler_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#38bdf8', '#ffffff'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [271.83, 314.16, 440.00, 628.32].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.15, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnEulerCard(true);
            
            const addedCard = document.querySelector('#eulerSecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        }
    });
    
}
function startCurryGuest() {
    if (!DOM.container) return;
    
    const curryQuotes = [
        'BANG! From way downtown! ',
        'Night, night! ',
        'Chef Curry with the shot! ',
        'I can do all things! — Philippians 4:13 ',
        'You don\'t want to see us next year. ',
        'Success is not an accident, success is actually a choice. ',
        'Be the best version of yourself in anything that you do. You don\'t have to live anybody else\'s story. ',
        'I\'ve never been afraid of big moments. I get butterflies. I get nervous and anxious, but I think those are all good signs that I\'m ready for the moment. ',
        'What are they gonna say now?! ',
        'Make sure you live in the moment and work your butt off every single day, and I hope I inspire people all around the world to just be themselves, be humble, and be grateful for all the blessings in your life. ',
        'There\'s more to life than basketball. The most important thing is your family and taking care of each other and loving each other no matter what. ',
        'If you don\'t fall, how are you going to know what getting up is like? ',
        'Every time I rise up, I have confidence that I\'m going to make it. ',
        'Play like you\'re in first, train like you\'re in second. ',
        'I try to make it look easy, but the behind-the-scenes stuff is the challenge. ',
        'People are going to doubt you. People are going to hate on you. Just let your game do the talking. ',
        'You have to be able to accept failure to get better. ',
        'No matter where you come from, what you have or don\'t have, what you lack or what you have too much of... all you need to have is faith in God, an undying passion for what you do, what you choose to do in this life, and a relentless drive and the will to do whatever it takes to be successful in whatever you put your mind to. ',
        'I\'m not the guy who\'s afraid of failure. I like to take risks, take the big shot and all that. ',
        'If you take time to realize what your dream is and what you really want in life — no matter what it is, whether it\'s sports or in other fields — you have to realize that there is always work to do, and you want to be the hardest working person in whatever you do. ',
        'When you step on the floor, you have to have the mindset that nobody can guard you. ',
        'The joy of the game is what keeps me going every single day. ',
        'I want to be known as someone who changed the way the game was played. ',
        'Greatness is a lot of small things done well, day after day. ',
        'Keep shooting. Eventually, the rim gets as big as the ocean. ',
        'Shimmy on \'em! ',
        'Look away before it even drops! ',
        '402 three-pointers in a single regular season! ',
        'First unanimous MVP in NBA history! ',
        'Four NBA championships and counting! ',
        'Golden State\'s finest — Splash Brothers forever! ',
        'From Davidson College to the top of the basketball world! ',
        'Logo three from thirty-five feet — nothing but net! ',
        'Ruining the game? No, just rewriting the playbook. ',
        'Gravity on the court pulls the whole defense out to half-court. ',
        'Keep moving off the ball until the defense breaks. ',
        'Faith, family, and basketball — in that order. ',
        'My faith is tested every day, on and off the court, and that\'s what grounds me. ',
        'I\'m blessed to play a game I love at the highest level. ',
        'Stay hungry, stay humble, and trust your preparation. ',
        'You can\'t skip steps if you want to reach the mountaintop. ',
        'Every shot I take in a game is a shot I\'ve practiced a thousand times in the dark. ',
        'Confidence comes from preparation, not from wishful thinking. ',
        'When you\'re locked in, the noise in the arena completely disappears. ',
        'We thrive in the chaos when everyone counts us out. ',
        'Ring me! ',
        '50 points in a Game 7 — clutch gene activated! ',
        'Double bang! From way downtown! ',
        'One motion, pure release, splash! ',
        'Don\'t let anybody tell you that you\'re too small to dominate. ',
        'Underrated? Never again. ',
        'Work in silence, let the scoreboard make the noise. ',
        'Every championship has its own story and its own battle scars. ',
        'The journey is always better than the destination when you share it with the right teammates. ',
        'You earn respect in June, not in October. ',
        'Respect the game, and the game will respect you back. ',
        'Never settle for good when greatness is within reach. ',
        'Smile through the pressure — that\'s when you know you\'re having fun. ',
        'From the tunnel shot before tip-off to the final buzzer! ',
        'Steph gonna Steph! ',
        'A quick trigger that leaves defenders reaching at air. ',
        'All-time three-point king of the NBA! ',
        'Olympic gold medalist — Nuit, nuit in Paris! ',
        'Four golden daggers to seal the gold! ',
        'Put the defenders to sleep and cue the celebration! '
    ];
    let quoteIdx = -1;
    
    function spawnCurryCard(animate = false) {
        if (document.getElementById('currySecretWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'currySecretWrapper';
        wrapper.className = 'PersonWrapper';
        
        const card = document.createElement('div');
        card.className = 'PeoplePics is-curry-card';
        card.dataset.role = 'Guest Legend';
        card.dataset.displayRole = 'VIP Basketball Legend';
        card.dataset.character = 'Artist 9 - Greatest Shooter Ever';
        card.dataset.birthday = 'March 14, 1988';
        card.dataset.bio = '4× NBA Champion and all-time 3-point king raining deep shots from the Burj Khalifa observation deck!';
        
        const img = document.createElement('img');
        img.src = 'otherPics/Curry.jpg';
        img.alt = 'Curry, Stephen';
        img.className = 'is-guest-alter-pfp';
        
        const label = document.createElement('p');
        label.className = 'overlay-text';
        label.textContent = 'Curry, Stephen';
        
        const pip = document.createElement('span');
        pip.className = 'portrait-role-pip pip-curry';
        pip.textContent = '🏀';
        pip.title = 'Chef Curry (3PT King)';
        
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        wrapper.appendChild(pip);
        DOM.container.appendChild(wrapper);
        
        card.addEventListener('click', () => {
            if (card.classList.contains('is-jordan-card')) return;
            let nextIdx = Math.floor(Math.random() * curryQuotes.length);
            if (curryQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % curryQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = curryQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#38bdf8', '#facc15', '#ffffff'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(523.25, 0.07, 'triangle', 0.04);
        });
        
        if (animate) {
            card.animate([
                { transform: 'scale(0.8)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
            ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
        
        filterCards();
    }
    
    if (localStorage.getItem('afcs_curry_unlocked') === 'true') {
        spawnCurryCard(false);
    }
    STATE.onSearchInput.push((val) => {
        if ((val === 'curry' || val === 'chef') && localStorage.getItem('afcs_curry_unlocked') !== 'true') {
            localStorage.setItem('afcs_curry_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#38bdf8', '#facc15', '#ffffff'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [392.00, 523.25, 659.25, 783.99].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnCurryCard(true);
            
            const addedCard = document.querySelector('#currySecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        }
    });
}
function startHamiltonGuest() {
    if (!DOM.container) return;
    
    const hamiltonQuotes = [
        'I am not throwing away my shot! ★',
        'Why do you write like you’re running out of time? ',
        'Rise up! History has its eyes on Grade 7 – Psalms!',
        'Just you wait! ',
        'My name is Alexander Hamilton, and there\'s a million things I haven\'t done! ',
        'I\'m young, scrappy, and hungry! ',
        'Look around, look around at how lucky we are to be alive right now! ',
        'Legacy. What is a legacy? It\'s planting seeds in a garden you never get to see. ',
        'Immigrants: we get the job done! ',
        'I\'s past patiently waitin\', I\'s passionately smashin\' every expectation! ',
        'Every action\'s an act of creation! ',
        'I\'s laughin\' in the face of casualties and sorrow! ',
        'For the first time, I\'s thinkin\' past tomorrow! ',
        'Dying is easy, young man. Living is harder. ',
        'If you stand for nothing, Burr, what\'ll you fall for? ',
        'I\'s ll write my way out! ',
        'Write everything down far as I can see! ',
        'I\'s ll write my way out, overwhelm them with honesty! ',
        'This is the eye of the hurricane, this is the only way I can protect my legacy! ',
        'Wait for it, wait for it, wait! ',
        'I was chosen for the Constitutional Convention! ',
        'Why do you write like you need it to survive? ',
        'Why do you write every second you\'s re alive? ',
        'Why do you assume you\'s re the smartest in the room? ',
        'Soon that attitude may be your doom! ',
        'Hey yo, I\'s m just like my country, I\'s m young, scrappy and hungry! ',
        'Only nineteen but my mind is older! ',
        'These New York City streets get colder, I shoulder every burden, every disadvantage! ',
        'I have learned to manage, I don\'t have a gun to brandish, I walk these streets famished! ',
        'The plan is to fan this spark into a flame! ',
        'Put a pencil to his temple, connected it to his brain! ',
        'And he wrote his first refrain, a testament to his pain! ',
        'In New York you can be a new man! ',
        'Don\'t be shocked when your history book mentions me! ',
        'I will lay down my life if it sets us free! ',
        'Eventually, you\'s ll see my ascendancy! ',
        'And I am not throwing away my shot! ',
        'Let\'s hatch a plot blacker than the kettle callin\' the pot! ',
        'What are the odds the gods would put us all in one spot? ',
        'Poppin\' a squat on conventional wisdom, like it or not! ',
        'A bunch of revolutionary manumission abolitionists? Give me a position, show me where the ammunition is! ',
        'Oh, am I talkin\' too loud? Sometimes I get over excited, shoot off at the mouth! ',
        'I never had a group of friends before, I promise that I\'s ll make y\'s all proud! ',
        'I imagine death so much it feels more like a memory. ',
        'Is this where it gets me, on my feet, several feet ahead of me? ',
        'See, I never thought I\'s d live past twenty. ',
        'Where I come from some get half as many. ',
        'Ask anybody why we livin\' fast and we laugh, reach for a flask, we have to make this moment last, that\'s plenty! ',
        'Scratch that, this is not a moment, it\'s the movement! ',
        'Where all the hungriest brothers with something to prove went? ',
        'Foes oppose us, we take an honest stand, we roll like Moses, claimin\' our promised land! ',
        'And? If we win our independence? Is that a guarantee of freedom for our descendants? ',
        'Or will the blood we shed begin an endless cycle of vengeance and death with no defendants? ',
        'I know the action in the street is excitin\', but Jesus, between all the bleedin\' \'n fightin\' I\'s ve been readin\' \'n writin\'! ',
        'We need to handle our financial situation! ',
        'Are we a nation of states? What\'s the state of our nation? ',
        'I\'s m past patiently waitin\', I\'s m passionately smashin\' every expectation! ',
        'Who lives, who dies, who tells your story? ',
        'You have no control who lives, who dies, who tells your story. ',
        'Alexander Hamilton, troops are waiting in the field for you! ',
        'If you join us right now, together we can turn the tide! ',
        'Oh, Alexander Hamilton, we have soldiers that will yield for you! ',
        'If we manage to get this right, they\'s ll surrender by early light! ',
        'The world will never be the same, Alexander! ',
        'Those who stand for nothing fall for anything. '
    ];
    let quoteIdx = -1;
    
    function spawnHamiltonCard(animate = false) {
        if (document.getElementById('hamiltonSecretWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'hamiltonSecretWrapper';
        wrapper.className = 'PersonWrapper';
        
        const card = document.createElement('div');
        card.className = 'PeoplePics is-hamilton-card';
        card.dataset.role = 'Guest Legend';
        card.dataset.displayRole = 'VIP Broadway Legend';
        card.dataset.character = 'Artist 10 - Founding Father';
        card.dataset.birthday = 'January 11, 1757';
        card.dataset.bio = 'Non-stop writer and Founding Father bringing Broadway energy to the Burj Khalifa stage!';
        
        const img = document.createElement('img');
        img.src = 'otherPics/Hamilton.jpg';
        img.alt = 'Hamilton, Alexander';
        img.className = 'is-guest-alter-pfp';
        
        const label = document.createElement('p');
        label.className = 'overlay-text';
        label.textContent = 'Hamilton, Alexander';
        
        const pip = document.createElement('span');
        pip.className = 'portrait-role-pip pip-hamilton';
        pip.textContent = '★';
        pip.title = 'Alexander Hamilton';
        
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        wrapper.appendChild(pip);
        DOM.container.appendChild(wrapper);
        
        card.addEventListener('click', () => {
            if (card.classList.contains('is-burr-card')) return;
            let nextIdx = Math.floor(Math.random() * hamiltonQuotes.length);
            if (hamiltonQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % hamiltonQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = hamiltonQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#eab308', '#fef3c7', '#ffffff'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(587.33, 0.07, 'triangle', 0.04);
        });
        
        if (animate) {
            card.animate([
                { transform: 'scale(0.8)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
            ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
        
        filterCards();
    }
    
    if (localStorage.getItem('afcs_hamilton_guest_unlocked') === 'true') {
        spawnHamiltonCard(false);
    }
    STATE.onSearchInput.push((val) => {
        if ((val === 'hamilton' || val === 'burr') && localStorage.getItem('afcs_hamilton_guest_unlocked') !== 'true') {
            localStorage.setItem('afcs_hamilton_guest_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#eab308', '#fef3c7', '#ffffff'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [293.66, 369.99, 440.00, 587.33].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnHamiltonCard(true);
            
            const addedCard = document.querySelector('#hamiltonSecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        }
    });
}
function startEinsteinGuest() {
    if (!DOM.container) return;
    
    const einsteinQuotes = [
        'E = mc² — Energy equals mass times the speed of light squared! ',
        'Imagination is more important than knowledge. ',
        'Time is relative — especially during Burj Khalifa lockdowns! ',
        'Everything should be made as simple as possible, but not simpler.',
        'Life is like riding a bicycle. To keep your balance, you must keep moving. ',
        'A person who never made a mistake never tried anything new. ',
        'Try not to become a man of success, but rather try to become a man of value. ',
        'In the middle of difficulty lies opportunity. ',
        'Logic will get you from A to B. Imagination will take you everywhere. ',
        'The important thing is not to stop questioning. Curiosity has its own reason for existing. ',
        'Anyone who has never made a mistake has never tried anything new. ',
        'Look deep into nature, and then you will understand everything better. ',
        'Peace cannot be kept by force; it can only be achieved by understanding. ',
        'Strive not to be a success, but rather to be of value. ',
        'The true sign of intelligence is not knowledge but imagination. ',
        'We cannot solve our problems with the same thinking we used when we created them. ',
        'If you can\'t explain it simply, you don\'t understand it well enough. ',
        'I have no special talent. I am only passionately curious. ',
        'Once you stop learning, you start dying. ',
        'Coincidence is God\'s way of remaining anonymous. ',
        'Education is what remains after one has forgotten what one has learned in school. ',
        'The measure of intelligence is the ability to change. ',
        'It is not that I\'m so smart. But I stay with the questions much longer. ',
        'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe. ',
        'Creativity is intelligence having fun. ',
        'A clever person solves a problem. A wise person avoids it. ',
        'Insanity is doing the same thing over and over again and expecting different results. ',
        'Great spirits have always encountered violent opposition from mediocre minds. ',
        'Learn from yesterday, live for today, hope for tomorrow. ',
        'Weakness of attitude becomes weakness of character. ',
        'Only a life lived for others is a life worthwhile. ',
        'The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking. ',
        'Science without religion is lame, religion without science is blind. ',
        'The only source of knowledge is experience. ',
        'Gravitation is not responsible for people falling in love. ',
        'Never memorize something that you can look up. ',
        'Reality is merely an illusion, albeit a very persistent one. ',
        'When you are courting a nice girl an hour seems like a second. When you sit on a red-hot cinder a second seems like an hour. That\'s relativity. ',
        'The difference between stupidity and genius is that genius has its limits. ',
        'A table, a chair, a bowl of fruit and a violin; what else does a man need to be happy? ',
        'Intellectual growth should commence at birth and cease only at death. ',
        'Out of clutter, find simplicity. From discord, find harmony. In the middle of difficulty lies opportunity. ',
        'The most beautiful experience we can have is the mysterious. ',
        'If A is a success in life, then A equals x plus y plus z. Work is x; y is play; and z is keeping your mouth shut. ',
        'Joy in looking and comprehending is nature\'s most beautiful gift. ',
        'Few are those who see with their own eyes and feel with their own hearts. ',
        'Common sense is the collection of prejudices acquired by age eighteen. ',
        'It is a miracle that curiosity survives formal education. ',
        'The pursuit of truth and beauty is a sphere of activity in which we are permitted to remain children all our lives. ',
        'Black holes are where God divided by zero. ',
        'God does not play dice with the universe. ',
        'Subtle is the Lord, but malicious He is not. ',
        'Information is not knowledge. ',
        'Any fool can know. The point is to understand. ',
        'You never fail until you stop trying. ',
        'What is right is not always popular and what is popular is not always right. ',
        'The value of a man should be seen in what he gives and not in what he is able to receive. ',
        'Blind belief in authority is the greatest enemy of truth. ',
        'Small is the number of people who see with their eyes and think with their minds. ',
        'Nothing happens until something moves. ',
        'The monotony and solitude of a quiet life stimulates the creative mind. ',
        'Time and space are modes by which we think and not conditions in which we live. ',
        'To raise new questions, new possibilities, to regard old problems from a new angle, requires creative imagination and marks real advance in science. ',
        'If we knew what it was we were doing, it would not be called research, would it? ',
        'At the top of the Burj Khalifa, clocks tick just a tiny fraction faster than at street level — general relativity in action! '
    ];
    let quoteIdx = -1;
    
    function spawnEinsteinCard(animate = false) {
        if (document.getElementById('einsteinSecretWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'einsteinSecretWrapper';
        wrapper.className = 'PersonWrapper';
        
        const card = document.createElement('div');
        card.className = 'PeoplePics is-einstein-card';
        card.dataset.role = 'Guest Legend';
        card.dataset.displayRole = 'VIP Physics Legend';
        card.dataset.character = 'Artist 11 - Master of Relativity';
        card.dataset.birthday = 'March 14, 1879';
        card.dataset.bio = 'Theoretical physicist who unlocked E = mc² and space-time relativity, visiting Dubai for Paskong AFCS 2026!';
        
        const img = document.createElement('img');
        img.src = 'otherPics/Einstein.jpg';
        img.alt = 'Einstein, Albert';
        img.className = 'is-guest-alter-pfp';
        
        const label = document.createElement('p');
        label.className = 'overlay-text';
        label.textContent = 'Einstein, Albert';
        
        const pip = document.createElement('span');
        pip.className = 'portrait-role-pip pip-einstein';
        pip.textContent = '⚛️';
        pip.title = 'Albert Einstein (E = mc²)';
        
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        wrapper.appendChild(pip);
        DOM.container.appendChild(wrapper);
        
        card.addEventListener('click', (e) => {
            if (e.detail !== 1 || card.classList.contains('is-galileo-card')) return;
            
            let nextIdx = Math.floor(Math.random() * einsteinQuotes.length);
            if (einsteinQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % einsteinQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = einsteinQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#a855f7', '#38bdf8', '#ffffff'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(523.25, 0.07, 'triangle', 0.04);
        });
        
        if (animate) {
            card.animate([
                { transform: 'scale(0.8)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
            ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
        
        filterCards();
    }
    
    if (localStorage.getItem('afcs_einstein_unlocked') === 'true') {
        spawnEinsteinCard(false);
    }
    STATE.onSearchInput.push((val) => {
        if ((val === 'e=mc^2' || val === 'relativity' || val === 'galileo') && localStorage.getItem('afcs_einstein_unlocked') !== 'true') {
            localStorage.setItem('afcs_einstein_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#a855f7', '#38bdf8', '#ffffff'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [392.00, 493.88, 659.25, 880.00].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnEinsteinCard(true);
            
            const addedCard = document.querySelector('#einsteinSecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        }
    });
    
}
function startNGuest() {
    if (!DOM.container) return;
    
    const nQuotes = [
        'I love doing anything! =3 ',
        'Hi! Nice to meet you! ',
        'Biscuits! Did someone say biscuits?! ',
        'Golden Retriever energy reporting for duty at the Burj Khalifa! ',
        'Whatever happens on December 17, we’re gonna crush it together! ',
        'I am Serial Designation N! Nice to meet you! I’m kind of the leader of the squad in this city—that’s not true, everyone tells me I’m useless and terrible! ',
        'Oh, sweet! A new friend! ',
        'Uzi, you’re so cool! Like, seriously, the coolest! ',
        'I’m sorry! I didn’t mean to—wait, what did I do? Still sorry! ',
        'Did you know Golden Retrievers have gentle mouths? Wait, why do I know that? ',
        'High five! Oh, wait, let me retract the claws first! ',
        'V, please don’t decapitate the guests at Paskong AFCS 2026! ',
        'Can I pet the dog? Are there dogs on Floor 163?! ',
        'I drew a picture of us hanging out! Look, I gave everyone smiling faces! ',
        'Cyn, please stop trying to assimilate the Christmas tree! ',
        'Aww, biscuits! I dropped my wrench again! ',
        'You guys are doing awesome! Keep clicking! ',
        'Wait, are we locked in the Burj Khalifa? Awesome! More time to hang out! ',
        'I’m super helpful! Just tell me what to do and I’ll do it with maximum enthusiasm! ',
        'Uzi said "Bite me!" That means she likes me, right? ',
        'Oh, man, LeBron James is so tall! Do you think he plays fetch? ',
        'I brought extra biscuits for everyone in Grade 7 – Psalms! ',
        'Don’t worry, I’ll protect everybody! That’s what big brothers are for! ',
        'Oops, my tail is wagging again! I can’t help it when I’m happy! ',
        'Wait a second... am I actually good at my job? No, wait, let’s not get ahead of ourselves! ',
        'Hey, V! Look! I’m waving! Wave back! ',
        'Oh, golly, that railgun looks super dangerous and also super neat! ',
        'I’m a disassembly drone, yeah, but I’m really more of a hugger! ',
        'Did someone say team building?! I love team building! ',
        'Sir Isaac Newton seems really smart! Do you think he likes apples or biscuits better? ',
        'Sorry if my visor looks a little glitchy, I’m just really excited! ',
        'You’re doing great! Ten out of ten clicking technique! ',
        'Let’s go, team! Nobody gets left behind on my watch! ',
        'Oh, man, I hope I didn’t leave my pilot hat in the elevator! ',
        'Is it weird that I want to be best friends with everyone in this array? ',
        'Calm down, Cyn! Deep breaths! Wait, do drones breathe? Let’s try anyway! ',
        'I’m totally fearless! Except when V looks at me like that. Then I’m a little scared. ',
        'Secret handshake time! Ready? Boop! ',
        'Whatever happens on December 17, we’ve got this! Together! ',
        'I’m always happy to help! Even if it’s just sitting here waiting for you to click! ',
        'Aw, shucks, you’re making my visor blush! ',
        'Biscuits are honestly the greatest human invention ever. Way better than doors! ',
        'Look at how shiny the Burj Khalifa windows are! I can see my reflection! ',
        'Uzi, wait up! You walk really fast for someone so—uh, normal-sized! ',
        'I promise I won’t accidentally slice anything with my wings today! ',
        'Thank you so much for stopping by my panel! You made my whole day! ',
        'I’m basically a giant metal puppy with laser hands! ',
        'Wait, Galileo found four moons? That’s four times as many places to explore! ',
        'If anyone needs moral support, I’m right here! Cheerleader N reporting in! ',
        'Hold on, let me salute! How was that? Pretty crisp, right? ',
        'I’m learning so much about Earth history today! Alexander Hamilton had a lot of feelings! ',
        'No bad vibes allowed on Floor 163! Only smiles and biscuits! ',
        'Gosh, Steph Curry can shoot from really far away! Almost as far as Uzi’s railgun! ',
        'I’m not useless! Uzi told me so! ',
        'Every day is a great day when you get to hang out with your friends! ',
        'Wait, did I just hear a callback ping? Cyn, behave yourself! ',
        'You can click my panel as many times as you want, I don’t mind at all! ',
        'Let’s make this the best Paskong AFCS 2026 ever! ',
        'I’m ready for anything! Well, almost anything. Probably anything! ',
        'Keep smiling! Everything’s gonna turn out okay in the end! ',
        'Do you think Santa visits the Burj Khalifa? I left out a plate of biscuits just in case! ',
        'I’m super proud of you for making it this far! ',
        'Best friends forever! No take-backs! ',
        'Merry Christmas from your friendly neighborhood Disassembly Drone! ',
        'I still love doing anything! =3 '
    ];
    let quoteIdx = -1;
    
    function spawnNCard(animate = false) {
        if (document.getElementById('nDroneSecretWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'nDroneSecretWrapper';
        wrapper.dataset.noReveal = 'true';
        wrapper.style.position = 'relative';
        wrapper.style.zIndex = '25';
        wrapper.style.opacity = '1';
        wrapper.className = 'PersonWrapper';
        
        const card = document.createElement('div');
        card.className = 'PeoplePics is-n-drone-card';
        card.dataset.role = 'Guest Legend';
        card.dataset.displayRole = 'VIP Disassembly Drone';
        card.dataset.character = 'Artist 12 - Serial Designation N';
        card.dataset.birthday = 'November 18, 3071';
        card.dataset.bio = 'Cheerful, loyal Disassembly Drone from Copper-9 visiting Dubai with maximum Golden Retriever energy!';
        
        const img = document.createElement('img');
        img.src = 'otherPics/NDrone.jpg';
        img.alt = 'Designation N, Serial';
        img.className = 'is-guest-alter-pfp';
        img.loading = 'eager';
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        
        const label = document.createElement('p');
        label.className = 'overlay-text';
        label.textContent = 'Designation N, Serial';
        
        const pip = document.createElement('span');
        pip.className = 'portrait-role-pip pip-n-drone';
        pip.textContent = '💛';
        pip.title = 'Serial Designation N';
        
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        wrapper.appendChild(pip);
        DOM.container.appendChild(wrapper);
        
        card.addEventListener('click', (e) => {
            if (e.detail !== 1 || card.classList.contains('is-uzi-drone-card')) return;
            
            let nextIdx = Math.floor(Math.random() * nQuotes.length);
            if (nQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % nQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = nQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#facc15', '#fef08a', '#ffffff'], 22);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(587.33, 0.07, 'triangle', 0.04);
            setTimeout(() => playBeep(880.00, 0.1, 'triangle', 0.04), 65);
        });
        
        if (animate) {
            card.animate([
                { transform: 'scale(0.8)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
            ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
        
        filterCards();
    }
    
    if (localStorage.getItem('afcs_ndrone_unlocked') === 'true') {
        spawnNCard(false);
    }
    STATE.onSearchInput.push((val) => {
        if ((val === 'serial designation n' || val === 'nuzi' || val === 'biscuits') && localStorage.getItem('afcs_ndrone_unlocked') !== 'true') {
            localStorage.setItem('afcs_ndrone_unlocked', 'true');
            const rect = DOM.searchInput.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#c084fc', '#ffffff'], 36);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [440.00, 554.37, 659.25, 880.00].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 75);
            });
            
            DOM.searchInput.value = '';
            spawnNCard(true);
            
            const addedCard = document.querySelector('#nDroneSecretWrapper .PeoplePics');
            if (addedCard) {
                setTimeout(() => {
                    addedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openCard(addedCard);
                }, 300);
            }
        }
    });
}
function startDoggieGuest() {
    const peopleContainer = document.querySelector('.People');
    if (!peopleContainer) return;
    
    const doggieProfile = {
        name: 'Doggie',
        imgSrc: 'otherPics/doggie.jpg',
        role: 'Guest Legend',
        character: 'Verifier of Grief • Wave Legend',
        bio: 'Legendary Geometry Dash top player, streamer, and the relentless verifier of the Top 1 Extreme Demon "Grief" (reaching 80%+ progress).',
        funFact: 'Famous for his razor-sharp 4× speed wave control and over 100,000+ attempts poured into verifying Grief!',
        quotes: [
            '80% on Grief?! We are SO close—lock in, Grade 7 – Psalms!',
            '4× speed wave corridor incoming—keep your clicks steady!',
            'Never give up on a hard level—whether it’s Grief or December 17 showtime!',
            'GG! New best! The Burj Khalifa stage is officially verified!',
            'Triple-click my portrait if you want to summon the #1 Demonlist king...'
        ]
    };
    
    const zoinkProfile = {
        name: 'Zoink',
        imgSrc: 'otherPics/zoink.jpg',
        role: 'Guest Legend',
        character: '#1 Demonlist Conqueror • Tidal Wave Verifier',
        bio: 'Widely regarded as the greatest Geometry Dash player of all time, verifier of Tidal Wave, Avernus, Nullscapes, and countless Top 1 Extreme Demons.',
        funFact: 'Verified Tidal Wave—one of the hardest levels in Geometry Dash history—and held #1 on the Demonlist simultaneously across dozens of extremes!',
        quotes: [
            '>>> TIDAL WAVE >>> 100% VERIFIED! Easy GG, Grade 7 – Psalms!',
            '16 CPS wave spam activated! Nobody beats Psalms on December 17!',
            'Beat Avernus, beat Tidal Wave, now conquering Beyond The Manger!',
            'Just another warm-up run in the Burj Khalifa—GG!',
            'Triple-click again to tag Doggie back in for Grief!'
        ]
    };
    
    let isZoink = false;
    const wrapper = document.createElement('div');
    wrapper.className = 'PersonWrapper is-vip-revealed';
    wrapper.id = 'doggieSecretWrapper';
    wrapper.style.display = localStorage.getItem('afcs_doggie_unlocked') === 'true' ? '' : 'none';
    
    wrapper.innerHTML = `
        <div class="PeoplePics doggie-secret-card"
             data-role="${doggieProfile.role}"
             data-character="${doggieProfile.character}"
             data-bio="${doggieProfile.bio}"
             data-funfact="${doggieProfile.funFact}">
            <img src="${doggieProfile.imgSrc}" alt="${doggieProfile.name}">
            <div class="overlay-text">${doggieProfile.name}</div>
        </div>
        <span class="portrait-role-pip pip-doggie" title="Verifier of Grief">🔥</span>
    `;
    peopleContainer.appendChild(wrapper);
    
    const card = wrapper.querySelector('.PeoplePics');
    const pip = wrapper.querySelector('.portrait-role-pip');
    
    window.unlockDoggieGuest = function () {
        localStorage.setItem('afcs_doggie_unlocked', 'true');
        wrapper.style.display = '';
        card.classList.remove('is-filtered-out');
        if (typeof filterCards === 'function') filterCards();
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const r = card.getBoundingClientRect();
        spawnBurst(r.left + r.width / 2, r.top + r.height / 2, ['#ff00dd', '#ffae42', '#fff04d'], 36);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        playBeep(523.25, 0.12, 'sawtooth', 0.05);
        setTimeout(() => playBeep(783.99, 0.18, 'triangle', 0.05), 80);
    };
    
    card.addEventListener('click', (e) => {
        if (e._isTripleTap || e.detail === 3) {
            isZoink = !isZoink;
            const active = isZoink ? zoinkProfile : doggieProfile;
            card.classList.toggle('is-zoink-mode', isZoink);
            card.dataset.character = active.character;
            card.dataset.bio = active.bio;
            card.dataset.funfact = active.funFact;
            card.querySelector('.overlay-text').textContent = active.name;
            const img = card.querySelector('img');
            if (img) { img.src = active.imgSrc; img.alt = active.name; }
            if (pip) {
                pip.className = `portrait-role-pip ${isZoink ? 'pip-zoink' : 'pip-doggie'}`;
                pip.textContent = isZoink ? '🌊' : '🔥';
                pip.title = isZoink ? '#1 Demonlist King (Zoink)' : 'Verifier of Grief (Doggie)';
            }
            spawnBurst(e.clientX, e.clientY, isZoink ? ['#38bdf8', '#0284c7', '#ffffff'] : ['#ff00dd', '#fff04d', '#cc0000'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isZoink ? 659.25 : 440, 0.12, 'triangle', 0.05);
            if (DOM.panel?.classList.contains('active') && card.classList.contains('active')) openCard(card);
            return;
        }
        const pool = isZoink ? zoinkProfile.quotes : doggieProfile.quotes;
        const line = pool[Math.floor(Math.random() * pool.length)];
        const banner = document.createElement('div');
        banner.className = 'theme-announce-banner';
        banner.style.borderColor = isZoink ? '#38bdf8' : '#ff00dd';
        banner.textContent = `${isZoink ? '🌊 ZOINK' : '🔥 DOGGIE'}: "${line}"`;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2600);
    });
}

function startTeslaGuest() {
    const peopleContainer = document.querySelector('.People');
    if (!peopleContainer) return;
    
    const teslaProfile = {
        name: 'Nikola Tesla',
        imgSrc: 'otherPics/tesla.jpg',
        role: 'Guest Legend',
        character: 'Master of Alternating Current • Inventor',
        bio: 'Serbian-American inventor and electrical engineer who pioneered alternating-current (AC) electricity, the Tesla coil, and wireless power transmission.',
        funFact: 'Held around 300 patents worldwide and envisioned wireless global energy transmission from Wardenclyffe Tower!',
        quotes: [
            'The present is theirs; the future, for which I really worked, is mine!',
            'If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration!',
            '3, 6, 9 — the key to the universe and Grade 7 – Psalms’ December 17 showcase!',
            'Alternating current is lighting up the entire Burj Khalifa tonight!',
            'Triple-click my portrait to summon the Prince of Mathematicians...'
        ]
    };
    
    const gaussProfile = {
        name: 'Carl Friedrich Gauss',
        imgSrc: 'otherPics/gauss.jpg',
        role: 'Guest Legend',
        character: 'Prince of Mathematicians • Number Theorist',
        bio: 'German mathematician and physicist who made foundational breakthroughs in number theory, statistics, modular arithmetic, magnetism, and astronomy.',
        funFact: 'At age 7, he stunned his schoolteacher by instantly summing 1 + 2 + ... + 100 = 5,050 using n(n + 1)/2!',
        quotes: [
            'Mathematics is the queen of the sciences—and number theory is the queen of mathematics!',
            '1 + 2 + 3 + ... + 100 = 5,050! Even a Burj Khalifa countdown is trivial arithmetic!',
            'Pauca sed matura — Few, but ripe! Make every scene on December 17 count!',
            'From Gaussian distributions to magnetic flux—everything follows pure symmetry!',
            'Triple-click again to return to Nikola Tesla’s alternating current!'
        ]
    };
    
    let isGauss = false;
    const wrapper = document.createElement('div');
    wrapper.className = 'PersonWrapper is-vip-revealed';
    wrapper.id = 'teslaSecretWrapper';
    wrapper.style.display = localStorage.getItem('afcs_tesla_unlocked') === 'true' ? '' : 'none';
    
    wrapper.innerHTML = `
        <div class="PeoplePics tesla-secret-card"
             data-role="${teslaProfile.role}"
             data-character="${teslaProfile.character}"
             data-bio="${teslaProfile.bio}"
             data-funfact="${teslaProfile.funFact}">
            <img src="${teslaProfile.imgSrc}" alt="${teslaProfile.name}">
            <div class="overlay-text">${teslaProfile.name}</div>
        </div>
        <span class="portrait-role-pip pip-tesla" title="Master of AC Electricity">⚡</span>
    `;
    peopleContainer.appendChild(wrapper);
    
    const card = wrapper.querySelector('.PeoplePics');
    const pip = wrapper.querySelector('.portrait-role-pip');
    
    window.unlockTeslaGuest = function () {
        localStorage.setItem('afcs_tesla_unlocked', 'true');
        wrapper.style.display = '';
        card.classList.remove('is-filtered-out');
        if (typeof filterCards === 'function') filterCards();
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const r = card.getBoundingClientRect();
        spawnBurst(r.left + r.width / 2, r.top + r.height / 2, ['#38bdf8', '#a855f7', '#ffffff'], 36);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        playBeep(587.33, 0.12, 'sawtooth', 0.05);
        setTimeout(() => playBeep(880, 0.18, 'triangle', 0.05), 80);
    };
    
    card.addEventListener('click', (e) => {
        if (e._isTripleTap || e.detail === 3) {
            isGauss = !isGauss;
            const active = isGauss ? gaussProfile : teslaProfile;
            card.classList.toggle('is-gauss-mode', isGauss);
            card.dataset.character = active.character;
            card.dataset.bio = active.bio;
            card.dataset.funfact = active.funFact;
            card.querySelector('.overlay-text').textContent = active.name;
            const img = card.querySelector('img');
            if (img) { img.src = active.imgSrc; img.alt = active.name; }
            if (pip) {
                pip.className = `portrait-role-pip ${isGauss ? 'pip-gauss' : 'pip-tesla'}`;
                pip.textContent = isGauss ? '📐' : '⚡';
                pip.title = isGauss ? 'Prince of Mathematicians (Gauss)' : 'Master of AC Electricity (Tesla)';
            }
            spawnBurst(e.clientX, e.clientY, isGauss ? ['#facc15', '#10b981', '#ffffff'] : ['#38bdf8', '#a855f7', '#ffffff'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isGauss ? 523.25 : 659.25, 0.12, 'triangle', 0.05);
            if (DOM.panel?.classList.contains('active') && card.classList.contains('active')) openCard(card);
            return;
        }
        const pool = isGauss ? gaussProfile.quotes : teslaProfile.quotes;
        const line = pool[Math.floor(Math.random() * pool.length)];
        const banner = document.createElement('div');
        banner.className = 'theme-announce-banner';
        banner.style.borderColor = isGauss ? '#facc15' : '#38bdf8';
        banner.textContent = `${isGauss ? '📐 GAUSS' : '⚡ TESLA'}: "${line}"`;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2600);
    });
}