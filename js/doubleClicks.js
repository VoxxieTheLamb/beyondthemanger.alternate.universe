function handleDoubleClick() {
    const cards = Array.from(document.querySelectorAll('.PeoplePics'));
    const dblClickTimers = new WeakMap();
    const DBL_QUOTES = {
        uba: 'Virelle: "I was supposed to be the one who will defuse it..."',
        tulaylay: 'Ella: "Christmas is a story where every character matters."',
        tridanio: 'Precious: "Every cue and scene locked in for Grade 7 – Psalms!"',
        tesoro: 'Lydia: "Welcome to the biggest Christmas meet-and-greet at the Burj Khalifa!"',
        tan: 'Jolianne: "Si Jesus ang Cornerstone natin. Kapag Siya ang pundasyon, hindi tayo matitinag."',
        suzon: 'Sophie: "Props crafted, painted, and stage-ready!"',
        sevilla: 'Vollow: "Walang lalabas. Walang papasok."',
        sanagustin: 'Shekinah (Director): "Places everyone—let’s shine for Christ!"',
        sanandres: 'Officer Ryo: "Police on duty—lockdown perimeter secured!"',
        pinpin: 'Ace: "Good evening Dubai! Welcome to this Masiglang Event!"',
        pagarigan: 'Kyle: "Guys, live tayo from the tallest building in the world! Smile!"',
        operana: 'Bobby: "Attention po. Security lockdown. Please stay calm."',
        olores: 'Althea: "All props and lantern details ready before showtime!"',
        mantal: 'Scarlet: "Ay! Si Ella Brooks! Hindi ako makahinga!"',
        mallari: 'Carlaine: "Curtain call choreography locked and synchronized!"',
        ibarra: 'Zach: "Solved under 8 seconds—watch the cube!"',
        gapasin: 'Officer Theo: "We’ll take it from now—case closed!"',
        delacruz: 'Kei (2823): "Every piece matters, even the smallest pawn. Checkmate."',
        delrosario: 'Hazel: "Wait, food muna—mukbang with the stars later!"',
        deguzman: 'Johanna: "Every character’s outfit sketched and finalized!"',
        clariza: 'Izabelle: "Dialogue cues sharp and ready for the spotlight!"',
        barcenas: 'Lloyd: "May HD vlog footage tayo! Zoom in on the Nativity!"',
        angeles: 'Nakano: "Chill lang tayo. メリークリスマス (Merīkurisumasu)!"',
        amadora: 'Mics: "Ang Star ang gabay—alalahanin mo kung Sino ang nasa gitna."',
        abrena: 'Cosmos: "Shepherd muna... tapos Star... Wise Men... at ang Manger sa gitna!"',
        arles: 'Jenn: "We rise because Jesus Christ is our Cornerstone!"'
    };
    
    const DUO_COMBOS = [
        { pair: ['sanandres', 'gapasin'], title: '🚓 POLICE DUO COMBO', line: 'Ryo & Theo teamed up—Virelle is in custody!' },
        { pair: ['operana', 'sevilla'], title: '📻 SECURITY DUO COMBO', line: 'Bobby & Vollow sealed every Burj Khalifa exit!' },
        { pair: ['tesoro', 'pinpin'], title: '🎤 HOST DUO COMBO', line: 'Lydia & Ace hyped the entire Dubai crowd!' },
        { pair: ['uba', 'tulaylay'], title: '🔍 PLOT TWIST COMBO', line: 'Ella caught Virelle’s lockdown notification red-handed!' },
        { pair: ['arles', 'tan'], title: '⛪ CORNERSTONE DUO', line: 'Jolianne & Jenn remembered: Jesus is always in the center!' },
        { pair: ['arles', 'amadora'], title: '🌟 GUIDING STAR DUO', line: 'Mics & Jenn solved the 4-dial Nativity lantern!' },
        { pair: ['barcenas', 'pagarigan'], title: '📹 VLOGGER CREW COMBO', line: 'Lloyd & Kyle captured the HD Nativity clue!' },
        { pair: ['delacruz', 'ibarra'], title: '🧠 PRODIGY DUO COMBO', line: '2823 Chess GM + Sub-8s Speedcuber!' }
    ];
      const MAIN_CAST_PROPS = {
        arles:      { main: '🏮', subs: ['⭐', '✨', '⛪'], glow: '#fde047' },
        mantal:     { main: '👑', subs: ['📸', '✨', '💖'], glow: '#f472b6' },
        delrosario: { main: '🍱', subs: ['🧋', '🌯', '🍟'], glow: '#fb923c' },
        barcenas:   { main: '🎥', subs: ['🔴', '🎞️', '✨'], glow: '#22d3ee' },
        abrena:     { main: '🏙️', subs: ['📐', '🔍', '⭐'], glow: '#38bdf8' },
        pagarigan:  { main: '📹', subs: ['🛸', '🌍', '✨'], glow: '#38bdf8' },
        ibarra:     { main: '🧊', subs: ['🟥', '🟦', '🟨'], glow: '#22c55e' },
        tulaylay:   { main: '🎭', subs: ['🌹', '🇬🇧', '✨'], glow: '#fde047' },
        uba:        { main: '📱', subs: ['⚡', '🔌', '🚨'], glow: '#ef4444' },
        angeles:    { main: '🖋️', subs: ['🌸', '🇯🇵', '💥'], glow: '#f472b6' },
        delacruz:   { main: '♜',  subs: ['♟️', '👑', '⚡'], glow: '#fde047' },
        tan:        { main: '⭐', subs: ['⛪', '🤍', '✨'], glow: '#fde047' },
        amadora:    { main: '🧭', subs: ['🌟', '✨', '🛡️'], glow: '#38bdf8' },
        operana:    { main: '📻', subs: ['♟️', '🚨', '🔊'], glow: '#f59e0b' },
        sevilla:    { special: 'gate' },
        sanandres:  { special: 'siren', main: '🚓', subs: ['🚨', '🔦'], glow: '#3b82f6' },
        gapasin:    { main: '⛓️', subs: ['🚓', '🚨', '✨'], glow: '#3b82f6' },
        tesoro:     { main: '🎤', subs: ['🎶', '✨', '🇦🇪'], glow: '#fde047' },
        pinpin:     { main: '🎙️', subs: ['🎉', '⭐', '💖'], glow: '#f472b6' }
    };

    function playMainCastPropAnim(card, key) {
        const cfg = MAIN_CAST_PROPS[key];
        if (!cfg) return;

        const old = card.querySelector('.dbl-prop-stage');
        if (old) old.remove();

        const stage = document.createElement('div');
        stage.className = 'dbl-prop-stage';
        stage.style.setProperty('--prop-glow', cfg.glow || '#fde047');

        if (cfg.special === 'gate') {
            stage.innerHTML = `<div class="dbl-prop-gate-left"></div><div class="dbl-prop-gate-right"></div>`;
        } else {
            const offsets = [
                { ox: '-42px', oy: '-28px' },
                { ox: '42px', oy: '-28px' },
                { ox: '0px', oy: '-46px' }
            ];
            const subsHtml = (cfg.subs || []).map((em, i) => {
                const o = offsets[i % offsets.length];
                return `<span class="dbl-prop-sub" style="--ox:${o.ox};--oy:${o.oy};">${em}</span>`;
            }).join('');

            stage.innerHTML = `
                ${cfg.special === 'siren' ? '<div class="dbl-prop-siren-bar"></div>' : ''}
                <span class="dbl-prop-main">${cfg.main}</span>
                ${subsHtml}
            `;
        }

        card.appendChild(stage);
        setTimeout(() => stage.remove(), 1100);
    }
    let lastDblKey = '';
    let lastDblAt = 0;
    let toastTimer = null;
    
    function showDblToast(tag, text) {
        let el = document.getElementById('dblStageToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'dblStageToast';
            el.className = 'dbl-stage-toast';
            el.innerHTML = `<span class="dbl-stage-toast-tag"></span><span class="dbl-stage-toast-text"></span>`;
            document.body.appendChild(el);
        }
        el.querySelector('.dbl-stage-toast-tag').textContent = tag;
        el.querySelector('.dbl-stage-toast-text').textContent = text;
        el.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
    }
    
    function triggerDblShowcase(card, key) {
        card.classList.remove('is-dbl-pretty');
        void card.offsetWidth;
        card.classList.add('is-dbl-pretty');
        setTimeout(() => card.classList.remove('is-dbl-pretty'), 800);
        
        let discovered = [];
        try {
            discovered = JSON.parse(localStorage.getItem('afcs_dbl_discovered') || '[]');
            if (!Array.isArray(discovered)) discovered = [];
        } catch (_) {
            discovered = [];
        }
        
        let coinNote = '';
        if (key && !discovered.includes(key)) {
            discovered.push(key);
            localStorage.setItem('afcs_dbl_discovered', JSON.stringify(discovered));
            const curCoins = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
            const bonus = discovered.length === 26 ? 265 : 15;
            const nextCoins = curCoins + bonus;
            localStorage.setItem('afcs_coins', String(nextCoins));
            const badge = document.getElementById('afcs-coin-display');
            if (badge) badge.textContent = nextCoins + ' 🪙';
            coinNote = discovered.length === 26
            ? ` • 🏆 26/26 CAST MASTERED! (+${bonus} 🪙)`
            : ` • 🆕 ${discovered.length}/26 (+15 🪙)`;
        }
        
        const now = Date.now();
        const combo = (lastDblKey && lastDblKey !== key && now - lastDblAt < 6500)
        ? DUO_COMBOS.find(c => c.pair.includes(key) && c.pair.includes(lastDblKey))
        : null;
        
        lastDblKey = key;
        lastDblAt = now;
        
        if (combo) {
            showDblToast(combo.title, combo.line + coinNote);
            const r = card.getBoundingClientRect();
            if (typeof spawnBurst === 'function') {
                spawnBurst(r.left + r.width / 2, r.top + r.height / 2, ['#fde047', '#38bdf8', '#f472b6', '#ffffff'], 42);
            }
            if (typeof playBeep === 'function') {
                [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                    setTimeout(() => playBeep(f, 0.14, 'triangle', 0.05), idx * 65);
                });
            }
        } else {
            const quote = DBL_QUOTES[key] || 'Grade 7 – Psalms • Beyond The Manger';
            showDblToast(`CAST SPOTLIGHT (${discovered.length}/26)`, quote + coinNote);
        }
    }
     function resolveDblKey(card) {
        const raw = (card.querySelector('.overlay-text')?.textContent || '').toLowerCase();
        const normalized = raw.replace(/ñ/g, 'n').replace(/[^a-z]/g, '');
        return Object.keys(DBL_QUOTES).find(k => normalized.includes(k)) || '';
    }

    function bindCardDoubleClick(card, onDoubleClick, delayMs = 1000) {
        if (!card) return;
        let lastTap = 0;
        let tapCount = 0;

        card.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTap < 350 && now - lastTap > 40) {
                tapCount++;
            } else {
                tapCount = 1;
            }
            lastTap = now;
            if (tapCount === 2) e._isDoubleTap = true;
            if (tapCount >= 3) {
                e._isTripleTap = true;
                tapCount = 0;
            }
        }, { passive: true });

        card.addEventListener('click', (e) => {
            const isTriple = Boolean(e._isTripleTap) || e.detail >= 3;
            if (isTriple) {
                const pending = dblClickTimers.get(card);
                if (pending) {
                    clearTimeout(pending);
                    dblClickTimers.delete(card);
                }
                return;
            }

            const isDouble = Boolean(e._isDoubleTap) || e.detail === 2;
            if (!isDouble) return;

            const existing = dblClickTimers.get(card);
            if (existing) clearTimeout(existing);

            const timerId = setTimeout(() => {
                dblClickTimers.delete(card);
                const key = resolveDblKey(card);
                triggerDblShowcase(card, key);
                onDoubleClick(e);
            }, delayMs);

            dblClickTimers.set(card, timerId);
        });
    }
    const ubaCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('uba'));
    bindCardDoubleClick(ubaCard, () => {
        ubaCard.classList.remove('quirk-virelle-dbl');
        void ubaCard.offsetWidth;
        ubaCard.classList.add('quirk-virelle-dbl');
        setTimeout(() => ubaCard.classList.remove('quirk-virelle-dbl'), 750);
        
        spawnBadge(ubaCard, '📱 LOCKDOWN DEVICE ⚡', 'quirk-star-glow', 1100);
        const rect = ubaCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ef4444', '#facc15', '#ffffff', '#38bdf8'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(110);
        if (typeof playBeep === 'function') {
            playBeep(180, 0.08, 'sawtooth', 0.05);
            setTimeout(() => playBeep(180, 0.08, 'sawtooth', 0.05), 110);
            setTimeout(() => playBeep(622.25, 0.16, 'square', 0.045), 230);
        }
    });
    const tulaylayCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('tulaylay'));
    bindCardDoubleClick(tulaylayCard, () => {
        tulaylayCard.classList.remove('quirk-ella-dbl');
        void tulaylayCard.offsetWidth;
        tulaylayCard.classList.add('quirk-ella-dbl');
        setTimeout(() => tulaylayCard.classList.remove('quirk-ella-dbl'), 750);
        
        spawnBadge(tulaylayCard, '🎭 SPOTLIGHT EXPOSED!', 'quirk-star-glow', 1100);
        const rect = tulaylayCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fde047', '#fb7185', '#ffffff', '#f59e0b'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(523.25, 0.09, 'triangle', 0.045);
            setTimeout(() => playBeep(659.25, 0.09, 'triangle', 0.045), 70);
            setTimeout(() => playBeep(783.99, 0.16, 'sine', 0.05), 140);
        }
    });
    const tridanioCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('tridanio'));
    bindCardDoubleClick(tridanioCard, () => {
        tridanioCard.classList.remove('quirk-tridanio-dbl');
        void tridanioCard.offsetWidth;
        tridanioCard.classList.add('quirk-tridanio-dbl');
        setTimeout(() => tridanioCard.classList.remove('quirk-tridanio-dbl'), 700);
        
        spawnBadge(tridanioCard, '📜 SCRIPT LOCKED!', 'quirk-star-glow', 1100);
        const rect = tridanioCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fde047', '#fef08a', '#38bdf8', '#ffffff'], 26);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(587.33, 0.06, 'triangle', 0.045);
            setTimeout(() => playBeep(783.99, 0.06, 'triangle', 0.045), 65);
            setTimeout(() => playBeep(1046.50, 0.14, 'sine', 0.05), 130);
        }
    });
    
    const tesoroCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('tesoro'));
    bindCardDoubleClick(tesoroCard, () => {
        tesoroCard.classList.remove('quirk-tesoro-dbl');
        void tesoroCard.offsetWidth;
        tesoroCard.classList.add('quirk-tesoro-dbl');
        setTimeout(() => tesoroCard.classList.remove('quirk-tesoro-dbl'), 700);
        
        spawnBadge(tesoroCard, '🎤 WELCOME TO DUBAI!', 'quirk-star-glow', 1100);
        const rect = tesoroCard.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (typeof STATE !== 'undefined' && Array.isArray(STATE.particles)) {
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 8,
                maxRadius: 150,
                alpha: 0.95,
                color: '#38bdf8'
            });
        }
        spawnBurst(cx, cy, ['#fde047', '#38bdf8', '#f472b6', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(659.25, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(880, 0.08, 'triangle', 0.045), 75);
            setTimeout(() => playBeep(1174.66, 0.15, 'sine', 0.05), 150);
        }
    });
    const tanCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('tan,'));
    bindCardDoubleClick(tanCard, () => {
        tanCard.classList.remove('quirk-tan-dbl');
        void tanCard.offsetWidth;
        tanCard.classList.add('quirk-tan-dbl');
        setTimeout(() => tanCard.classList.remove('quirk-tan-dbl'), 760);
        
        spawnBadge(tanCard, '⛪ JESUS IN THE CENTER', 'quirk-star-glow', 1150);
        const rect = tanCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fde047', '#fef08a', '#ffffff', '#38bdf8'], 30);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(523.25, 0.12, 'sine', 0.045);
            setTimeout(() => playBeep(659.25, 0.12, 'sine', 0.045), 95);
            setTimeout(() => playBeep(1046.50, 0.2, 'sine', 0.05), 190);
        }
    });
    const suzonCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('suzon'));
    bindCardDoubleClick(suzonCard, () => {
        suzonCard.classList.remove('quirk-suzon-dbl');
        void suzonCard.offsetWidth;
        suzonCard.classList.add('quirk-suzon-dbl');
        setTimeout(() => suzonCard.classList.remove('quirk-suzon-dbl'), 700);
        
        spawnBadge(suzonCard, '🛠️ PROPS READY!', 'quirk-star-glow', 1100);
        const rect = suzonCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f59e0b', '#fde047', '#38bdf8', '#ffffff'], 26);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(440, 0.06, 'triangle', 0.045);
            setTimeout(() => playBeep(659.25, 0.06, 'triangle', 0.045), 75);
            setTimeout(() => playBeep(880, 0.14, 'sine', 0.05), 150);
        }
    });
    const sevillaCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('sevilla'));
    bindCardDoubleClick(sevillaCard, () => {
        sevillaCard.classList.remove('quirk-sevilla-dbl');
        void sevillaCard.offsetWidth;
        sevillaCard.classList.add('quirk-sevilla-dbl');
        setTimeout(() => sevillaCard.classList.remove('quirk-sevilla-dbl'), 700);
        
        spawnBadge(sevillaCard, '🚪 WALANG LALABAS!', 'quirk-star-glow', 1100);
        const rect = sevillaCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ef4444', '#3b82f6', '#ffffff', '#94a3b8'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(130.81, 0.1, 'sawtooth', 0.055);
            setTimeout(() => playBeep(98.00, 0.16, 'square', 0.055), 110);
        }
    });
    const sanAndresCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('san andres'));
    bindCardDoubleClick(sanAndresCard, () => {
        sanAndresCard.classList.remove('quirk-sanandres-dbl');
        void sanAndresCard.offsetWidth;
        sanAndresCard.classList.add('quirk-sanandres-dbl');
        setTimeout(() => sanAndresCard.classList.remove('quirk-sanandres-dbl'), 740);
        
        spawnBadge(sanAndresCard, '🚓 RYO ON DUTY!', 'quirk-star-glow', 1100);
        const rect = sanAndresCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ef4444', '#3b82f6', '#ffffff', '#60a5fa'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(659.25, 0.14, 'sawtooth', 0.045);
            setTimeout(() => playBeep(523.25, 0.16, 'sawtooth', 0.045), 145);
        }
    });
    const pinpinCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('pinpin'));
    bindCardDoubleClick(pinpinCard, () => {
        pinpinCard.classList.remove('quirk-pinpin-dbl');
        void pinpinCard.offsetWidth;
        pinpinCard.classList.add('quirk-pinpin-dbl');
        setTimeout(() => pinpinCard.classList.remove('quirk-pinpin-dbl'), 700);
        
        spawnBadge(pinpinCard, '🎙️ MASIGLANG EVENT!', 'quirk-star-glow', 1100);
        const rect = pinpinCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f472b6', '#fde047', '#38bdf8', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(1567.98, 0.06, 'sine', 0.045);
            setTimeout(() => playBeep(783.99, 0.09, 'triangle', 0.045), 75);
            setTimeout(() => playBeep(1046.50, 0.14, 'triangle', 0.05), 150);
        }
    });
    const pagariganCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('pagarigan'));
    bindCardDoubleClick(pagariganCard, () => {
        pagariganCard.classList.remove('quirk-pagarigan-dbl');
        void pagariganCard.offsetWidth;
        pagariganCard.classList.add('quirk-pagarigan-dbl');
        setTimeout(() => pagariganCard.classList.remove('quirk-pagarigan-dbl'), 700);
        
        spawnBadge(pagariganCard, '📹 LIVE FROM BURJ KHALIFA!', 'quirk-star-glow', 1150);
        const rect = pagariganCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#38bdf8', '#fde047', '#ffffff', '#0ea5e9'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(1318.51, 0.05, 'square', 0.045);
            setTimeout(() => playBeep(987.77, 0.05, 'square', 0.045), 65);
            setTimeout(() => playBeep(1567.98, 0.12, 'sine', 0.05), 130);
        }
    });
    const operanaCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('opera'));
    bindCardDoubleClick(operanaCard, () => {
        operanaCard.classList.remove('quirk-operana-dbl');
        void operanaCard.offsetWidth;
        operanaCard.classList.add('quirk-operana-dbl');
        setTimeout(() => operanaCard.classList.remove('quirk-operana-dbl'), 720);
        
        spawnBadge(operanaCard, '📻 SECURITY LOCKDOWN!', 'quirk-star-glow', 1100);
        const rect = operanaCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f59e0b', '#ef4444', '#38bdf8', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(659.25, 0.09, 'triangle', 0.05);
            setTimeout(() => playBeep(523.25, 0.09, 'triangle', 0.05), 90);
            setTimeout(() => playBeep(392.00, 0.16, 'triangle', 0.05), 180);
        }
    });
    const oloresCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('olores'));
    bindCardDoubleClick(oloresCard, () => {
        oloresCard.classList.remove('quirk-olores-dbl');
        void oloresCard.offsetWidth;
        oloresCard.classList.add('quirk-olores-dbl');
        setTimeout(() => oloresCard.classList.remove('quirk-olores-dbl'), 740);
        
        spawnBadge(oloresCard, '🏮 PROPS COMPLETE!', 'quirk-star-glow', 1100);
        const rect = oloresCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f59e0b', '#fde047', '#22d3ee', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(659.25, 0.08, 'sine', 0.045);
            setTimeout(() => playBeep(987.77, 0.08, 'sine', 0.045), 75);
            setTimeout(() => playBeep(1318.51, 0.16, 'triangle', 0.05), 150);
        }
    });
    const mantalCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('mantal'));
    bindCardDoubleClick(mantalCard, () => {
        mantalCard.classList.remove('quirk-mantal-dbl');
        void mantalCard.offsetWidth;
        mantalCard.classList.add('quirk-mantal-dbl');
        setTimeout(() => mantalCard.classList.remove('quirk-mantal-dbl'), 740);
        
        spawnBadge(mantalCard, '✨ OMG ELLA BROOKS!!', 'quirk-star-glow', 1150);
        const rect = mantalCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f472b6', '#fde047', '#ffffff', '#e879f9'], 30);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(783.99, 0.07, 'triangle', 0.045);
            setTimeout(() => playBeep(987.77, 0.07, 'triangle', 0.045), 65);
            setTimeout(() => playBeep(1318.51, 0.15, 'sine', 0.05), 130);
        }
    });
    const mallariCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('mallari'));
    bindCardDoubleClick(mallariCard, () => {
        mallariCard.classList.remove('quirk-mallari-dbl');
        void mallariCard.offsetWidth;
        mallariCard.classList.add('quirk-mallari-dbl');
        setTimeout(() => mallariCard.classList.remove('quirk-mallari-dbl'), 760);
        
        spawnBadge(mallariCard, '💃 CURTAIN CALL!', 'quirk-star-glow', 1100);
        const rect = mallariCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f472b6', '#fde047', '#38bdf8', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(523.25, 0.07, 'triangle', 0.045);
            setTimeout(() => playBeep(659.25, 0.07, 'triangle', 0.045), 65);
            setTimeout(() => playBeep(783.99, 0.07, 'triangle', 0.045), 130);
            setTimeout(() => playBeep(1046.50, 0.14, 'sine', 0.05), 195);
        }
    });
    const ibarraCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('ibarra'));
    bindCardDoubleClick(ibarraCard, () => {
        ibarraCard.classList.remove('quirk-ibarra-dbl');
        void ibarraCard.offsetWidth;
        ibarraCard.classList.add('quirk-ibarra-dbl');
        setTimeout(() => ibarraCard.classList.remove('quirk-ibarra-dbl'), 740);
        
        spawnBadge(ibarraCard, '🧊 SOLVED IN 7.8s!', 'quirk-star-glow', 1100);
        const rect = ibarraCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ef4444', '#3b82f6', '#facc15', '#22c55e', '#f97316'], 30);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(783.99, 0.05, 'square', 0.04);
            setTimeout(() => playBeep(987.77, 0.05, 'square', 0.04), 55);
            setTimeout(() => playBeep(1174.66, 0.05, 'square', 0.04), 110);
            setTimeout(() => playBeep(1567.98, 0.14, 'triangle', 0.05), 165);
        }
    });
    const gapasinCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('gapasin'));
    bindCardDoubleClick(gapasinCard, () => {
        gapasinCard.classList.remove('quirk-gapasin-dbl');
        void gapasinCard.offsetWidth;
        gapasinCard.classList.add('quirk-gapasin-dbl');
        setTimeout(() => gapasinCard.classList.remove('quirk-gapasin-dbl'), 720);
        
        spawnBadge(gapasinCard, '⛓️ CASE CLOSED!', 'quirk-star-glow', 1100);
        const rect = gapasinCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ef4444', '#3b82f6', '#e2e8f0', '#fde047'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(1318.51, 0.04, 'triangle', 0.05);
            setTimeout(() => playBeep(1567.98, 0.04, 'triangle', 0.05), 85);
            setTimeout(() => playBeep(523.25, 0.14, 'sawtooth', 0.045), 170);
        }
    });
    const delaCruzCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('dela cruz'));
    bindCardDoubleClick(delaCruzCard, () => {
        delaCruzCard.classList.remove('quirk-delacruz-dbl');
        void delaCruzCard.offsetWidth;
        delaCruzCard.classList.add('quirk-delacruz-dbl');
        setTimeout(() => delaCruzCard.classList.remove('quirk-delacruz-dbl'), 720);
        
        spawnBadge(delaCruzCard, '♟️ CHECKMATE! (2823)', 'quirk-star-glow', 1150);
        const rect = delaCruzCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fde047', '#34d399', '#ffffff', '#f59e0b'], 30);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(196.00, 0.08, 'sawtooth', 0.05);
            setTimeout(() => playBeep(523.25, 0.09, 'triangle', 0.045), 80);
            setTimeout(() => playBeep(783.99, 0.16, 'triangle', 0.05), 160);
        }
    });
    const delRosarioCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('del rosario'));
    bindCardDoubleClick(delRosarioCard, () => {
        delRosarioCard.classList.remove('quirk-delrosario-dbl');
        void delRosarioCard.offsetWidth;
        delRosarioCard.classList.add('quirk-delrosario-dbl');
        setTimeout(() => delRosarioCard.classList.remove('quirk-delrosario-dbl'), 720);
        
        spawnBadge(delRosarioCard, '🍱 MUKBANG TIME!', 'quirk-star-glow', 1100);
        const rect = delRosarioCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fb923c', '#fde047', '#f472b6', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(587.33, 0.06, 'sine', 0.045);
            setTimeout(() => playBeep(783.99, 0.06, 'sine', 0.045), 65);
            setTimeout(() => playBeep(1046.50, 0.14, 'triangle', 0.05), 130);
        }
    });
    const deGuzmanCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('de guzman'));
    bindCardDoubleClick(deGuzmanCard, () => {
        deGuzmanCard.classList.remove('quirk-deguzman-dbl');
        void deGuzmanCard.offsetWidth;
        deGuzmanCard.classList.add('quirk-deguzman-dbl');
        setTimeout(() => deGuzmanCard.classList.remove('quirk-deguzman-dbl'), 740);
        
        spawnBadge(deGuzmanCard, '👗 COSTUME FINALIZED!', 'quirk-star-glow', 1100);
        const rect = deGuzmanCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#c084fc', '#fde047', '#f472b6', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(659.25, 0.08, 'sine', 0.045);
            setTimeout(() => playBeep(830.61, 0.08, 'sine', 0.045), 70);
            setTimeout(() => playBeep(987.77, 0.16, 'triangle', 0.05), 140);
        }
    });
    const clarizaCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('clariza'));
    bindCardDoubleClick(clarizaCard, () => {
        clarizaCard.classList.remove('quirk-clariza-dbl');
        void clarizaCard.offsetWidth;
        clarizaCard.classList.add('quirk-clariza-dbl');
        setTimeout(() => clarizaCard.classList.remove('quirk-clariza-dbl'), 720);
        
        spawnBadge(clarizaCard, '✍️ LINE CUE READY!', 'quirk-star-glow', 1100);
        const rect = clarizaCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#fde047', '#38bdf8', '#ffffff', '#f59e0b'], 26);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(880, 0.04, 'square', 0.04);
            setTimeout(() => playBeep(987.77, 0.04, 'square', 0.04), 65);
            setTimeout(() => playBeep(1318.51, 0.14, 'sine', 0.05), 130);
        }
    });
    const barcenasCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('barcenas'));
    bindCardDoubleClick(barcenasCard, () => {
        barcenasCard.classList.remove('quirk-barcenas-dbl');
        void barcenasCard.offsetWidth;
        barcenasCard.classList.add('quirk-barcenas-dbl');
        setTimeout(() => barcenasCard.classList.remove('quirk-barcenas-dbl'), 740);
        
        spawnBadge(barcenasCard, '📱 HD VLOG FOOTAGE!', 'quirk-star-glow', 1150);
        const rect = barcenasCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#22d3ee', '#38bdf8', '#fde047', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(1046.50, 0.06, 'sine', 0.045);
            setTimeout(() => playBeep(1318.51, 0.06, 'sine', 0.045), 75);
            setTimeout(() => playBeep(1046.50, 0.12, 'sine', 0.05), 150);
        }
    });
    const angelesCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('angeles'));
    bindCardDoubleClick(angelesCard, () => {
        angelesCard.classList.remove('quirk-angeles-dbl');
        void angelesCard.offsetWidth;
        angelesCard.classList.add('quirk-angeles-dbl');
        setTimeout(() => angelesCard.classList.remove('quirk-angeles-dbl'), 720);
        
        spawnBadge(angelesCard, '🇯🇵 メリークリスマス!', 'quirk-star-glow', 1150);
        const rect = angelesCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f472b6', '#38bdf8', '#ffffff', '#fde047'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(1174.66, 0.06, 'sawtooth', 0.045);
            setTimeout(() => playBeep(880, 0.08, 'triangle', 0.045), 65);
            setTimeout(() => playBeep(1318.51, 0.14, 'sine', 0.05), 130);
        }
    });
    const amadoraCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('amadora'));
    bindCardDoubleClick(amadoraCard, () => {
        amadoraCard.classList.remove('quirk-amadora-dbl');
        void amadoraCard.offsetWidth;
        amadoraCard.classList.add('quirk-amadora-dbl');
        setTimeout(() => amadoraCard.classList.remove('quirk-amadora-dbl'), 740);
        
        spawnBadge(amadoraCard, '🌟 FOLLOW THE STAR', 'quirk-star-glow', 1150);
        const rect = amadoraCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#38bdf8', '#fde047', '#ffffff', '#60a5fa'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(440, 0.09, 'sine', 0.045);
            setTimeout(() => playBeep(659.25, 0.09, 'sine', 0.045), 80);
            setTimeout(() => playBeep(880, 0.16, 'triangle', 0.05), 160);
        }
    });
    const uziCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('abrena'));
    bindCardDoubleClick(uziCard, () => {
        uziCard.classList.remove('quirk-uzi-dbl');
        void uziCard.offsetWidth;
        uziCard.classList.add('quirk-uzi-dbl');
        setTimeout(() => uziCard.classList.remove('quirk-uzi-dbl'), 740);
        
        spawnBadge(uziCard, '🔍 SHEPHERD → STAR → MANGER!', 'quirk-star-glow', 1200);
        const rect = uziCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#22d3ee', '#fde047', '#c084fc', '#ffffff'], 30);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(587.33, 0.07, 'triangle', 0.045);
            setTimeout(() => playBeep(880, 0.07, 'triangle', 0.045), 65);
            setTimeout(() => playBeep(1174.66, 0.14, 'sine', 0.05), 130);
        }
    });
    const arlesCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('arles'));
    bindCardDoubleClick(arlesCard, () => {
        arlesCard.classList.remove('quirk-arles-dbl');
        void arlesCard.offsetWidth;
        arlesCard.classList.add('quirk-arles-dbl');
        setTimeout(() => arlesCard.classList.remove('quirk-arles-dbl'), 880);
        
        spawnBadge(arlesCard, '⭐ 00:03 DEFUSED • CORNERSTONE!', 'quirk-star-glow', 1350);
        const rect = arlesCard.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        if (typeof playBeep === 'function') {
            playBeep(220, 0.08, 'sawtooth', 0.05);
            setTimeout(() => playBeep(220, 0.08, 'sawtooth', 0.05), 110);
        }
        
        setTimeout(() => {
            if (typeof STATE !== 'undefined' && Array.isArray(STATE.particles)) {
                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: cx,
                    y: cy,
                    radius: 10,
                    maxRadius: 190,
                    alpha: 1,
                    color: '#fde047'
                });
            }
            spawnBurst(cx, cy, ['#fde047', '#fef08a', '#ffffff', '#38bdf8', '#f59e0b'], 42);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof playBeep === 'function') {
                [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                    setTimeout(() => playBeep(f, 0.16, 'triangle', 0.055), idx * 70);
                });
            }
        }, 320);
    });
}
