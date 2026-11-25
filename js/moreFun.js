function startCrowbarShopFx() {
    if (typeof window.registerShopItem === 'function') {
        window.registerShopItem({
            id: 'fx_crowbar_bonk',
            category: 'effect',
            icon: '🪛',
            name: 'Jennah’s Steel Crowbar',
            price: 320,
            desc: 'Equippable click effect: every click unleashes a metallic *CLANG!* and launches a spinning HEV steel crowbar.',
            multiToggle: true
        });
    }

    if (typeof window.shopSyncCustomCosmetics === 'function') {
        window.shopSyncCustomCosmetics();
    }

    function playCrowbarClang() {
        if (typeof STATE !== 'undefined' && (STATE.masterMuted || STATE.sfxMuted)) return;
        const volScale = typeof STATE !== 'undefined'
            ? Math.max(0, Math.min(1, (STATE.masterVol ?? 0.8) * (STATE.sfxVol ?? 0.7)))
            : 0.6;
        if (volScale <= 0.001) return;

        try {
            const ctx = typeof getAudioContext === 'function'
                ? getAudioContext()
                : new (window.AudioContext || window.webkitAudioContext)();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;

            Array.of(1180, 2640).forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = i === 0 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + 0.24);

                gain.gain.setValueAtTime((i === 0 ? 0.14 : 0.08) * volScale, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.26);
            });

            const thud = ctx.createOscillator();
            const thudGain = ctx.createGain();
            thud.type = 'sawtooth';
            thud.frequency.setValueAtTime(165, now);
            thud.frequency.exponentialRampToValueAtTime(48, now + 0.09);

            thudGain.gain.setValueAtTime(0.16 * volScale, now);
            thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

            thud.connect(thudGain);
            thudGain.connect(ctx.destination);
            thud.start(now);
            thud.stop(now + 0.11);
        } catch (_) {
            if (typeof playBeep === 'function') playBeep(1180, 0.09, 'triangle', 0.05);
        }
    }

    function spawnFlyingCrowbar(x, y) {
        const el = document.createElement('div');
        el.style.cssText = [
            'position:fixed',
            `left:${x}px`,
            `top:${y}px`,
            'width:44px',
            'height:44px',
            'pointer-events:none',
            'z-index:100000',
            'transform:translate(-50%,-50%)',
            'filter:drop-shadow(0 0 8px rgba(249,115,22,0.85))'
        ].join(';');

        el.innerHTML = `<img src="otherpics/crowbarThrow.jpg" alt="" style="width:100%;height:100%; onerror="this.outerHTML='<span style=&quot;font-size:30px;line-height:44px;display:block;text-align:center;&quot;>🪛</span>'">`;
        document.body.appendChild(el);

        let px = x;
        let py = y;
        let vx = (Math.random() - 0.5) * 14;
        let vy = -7 - Math.random() * 5;
        let rot = Math.random() * 360;
        const vRot = (vx >= 0 ? 1 : -1) * (16 + Math.random() * 12);
        let alpha = 1;

        function step() {
            vy += 0.65;
            px += vx;
            py += vy;
            rot += vRot;
            alpha -= 0.024;

            if (alpha <= 0 || py > window.innerHeight + 60) {
                el.remove();
                return;
            }

            el.style.left = `${px.toFixed(1)}px`;
            el.style.top = `${py.toFixed(1)}px`;
            el.style.opacity = alpha.toFixed(2);
            el.style.transform = `translate(-50%,-50%) rotate(${rot.toFixed(1)}deg)`;
            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    window.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        const equipped = typeof window.shopGetCustomEquipped === 'function'
            ? window.shopGetCustomEquipped()
            : [];
        if (!equipped.includes('fx_crowbar_bonk')) return;

        playCrowbarClang();
        spawnFlyingCrowbar(e.clientX, e.clientY);

        if (typeof spawnBurst === 'function') {
            spawnBurst(e.clientX, e.clientY, ['#f97316', '#fde047', '#ffffff', '#94a3b8'], 16);
        }
        if (typeof window.wakeParticleCanvas === 'function') {
            window.wakeParticleCanvas();
        }

        const hitCard = e.target.closest('.PeoplePics');
        if (hitCard && (typeof STATE === 'undefined' || !STATE.ldmActive)) {
            hitCard.style.transition = 'transform 0.08s ease';
            hitCard.style.transform = 'scale(0.95) rotate(-2deg)';
            setTimeout(() => {
                hitCard.style.transform = '';
            }, 110);
        }
    }, { passive: true });
}
function startGodKeyShortcut() {
    window.addEventListener('keydown', async (e) => {
        if (e.repeat) return;
        const isGodCombo = e.metaKey && e.altKey && e.shiftKey && e.ctrlKey && e.key === 'Enter';
        if (!isGodCombo) return;

        e.preventDefault();
        e.stopPropagation();

        let nextCoins = (parseInt(localStorage.getItem('afcs_coins') || '150', 10) || 0) + 9999;

        if (typeof window.afcsGodGrantCoins === 'function') {
            nextCoins = await window.afcsGodGrantCoins(9999);
        } else {
            let remaining = 9999;
            while (remaining > 0) {
                const chunk = Math.min(1000, remaining);
                remaining -= chunk;
                const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10) || 0;
                localStorage.setItem('afcs_coins', String(cur + chunk));
            }
            nextCoins = parseInt(localStorage.getItem('afcs_coins') || '150', 10) || 0;
        }

        const bjBadge = document.getElementById('bj-coin-badge');
        if (bjBadge) bjBadge.textContent = 'Balance: ' + nextCoins + ' 🪙';

        const tcgCoin = document.getElementById('tcgCoinCount');
        if (tcgCoin) tcgCoin.textContent = String(nextCoins);

        if (document.getElementById('afcs-shop-modal') && typeof window.openAfcsShop === 'function') {
            window.openAfcsShop(window.SHOP_ACTIVE_TAB || 'all');
        }

        if (typeof triggerScreenGlitch === 'function') {
            triggerScreenGlitch(180);
        }

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        if (typeof STATE !== 'undefined' && Array.isArray(STATE.particles)) {
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 12,
                maxRadius: Math.max(cx, cy) * 0.9,
                alpha: 1.0,
                color: '#facc15'
            });
        }

        if (typeof spawnBurst === 'function') {
            spawnBurst(cx, cy, ['#facc15', '#fef08a', '#38bdf8', '#ffffff'], 56);
        }
        if (typeof window.wakeParticleCanvas === 'function') {
            window.wakeParticleCanvas();
        }

        if (typeof playBeep === 'function') {
            Array.of(523.25, 659.25, 783.99, 1046.50, 1318.51).forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.16, 'triangle', 0.05), idx * 65);
            });
        }

        const existing = document.getElementById('afcs-godkey-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'afcs-godkey-toast';
        toast.style.cssText = 'position:fixed;top:26px;left:50%;transform:translateX(-50%);background:rgba(9,13,22,0.96);border:2px solid #facc15;color:#fef08a;padding:10px 22px;border-radius:999px;font-family:monospace;font-weight:900;font-size:13px;z-index:100002;box-shadow:0 0 28px rgba(250,204,21,0.85);text-align:center;';
        toast.textContent = `👑 [GOD_KEY] +9999 🪙 GRANTED (Balance: ${nextCoins} 🪙)`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2800);
    }, true);
}


