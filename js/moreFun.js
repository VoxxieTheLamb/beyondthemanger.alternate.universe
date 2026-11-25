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
function startTcgBattleData() {
    window.TCG_RARITY_BASE = {
        Common: { hp: 100, atk: 22, def: 8, skillName: 'Stage Cue', skillPower: 32, skillDesc: 'Deals 32 DMG' },
        Rare: { hp: 130, atk: 28, def: 12, skillName: 'Spotlight Surge', skillPower: 38, skillDesc: 'Deals 38 DMG & heals 15 HP' },
        Epic: { hp: 165, atk: 35, def: 16, skillName: 'Overclock Finale', skillPower: 48, skillDesc: 'Deals 48 DMG' },
        Mythic: { hp: 210, atk: 44, def: 20, skillName: 'Cornerstone Override', skillPower: 62, skillDesc: 'Deals 62 DMG & grants 50% Shield' }
    };
    
    window.TCG_BATTLE_STATS = {};
    
    window.TCG_BOSS_TIERS = Array.of(
        { id: 'tier1', name: 'Burj Security Squad', reward: 80, badge: 'TIER 1 • EASY', deckIds: Array.of('c17', 'c18', 'c19') },
        { id: 'tier2', name: 'VIP Legends All-Stars', reward: 160, badge: 'TIER 2 • HARD', deckIds: Array.of('c29', 'c31', 'c33') },
        { id: 'tier3', name: 'Absolute Solver Overdrive', reward: 300, badge: 'TIER 3 • BOSS', deckIds: Array.of('c21', 'c22', 'c40') }
    );
    
    window.addCardToTCG = function (card, rarity, atk, def, extra = {}) {
        const tcg = window.AFCS_TCG;
        const cleanRarity = String(rarity || (card && card.rarity) || 'Rare').trim();
        const normRarity = cleanRarity.charAt(0).toUpperCase() + cleanRarity.slice(1).toLowerCase();
        const validRarity = window.TCG_RARITY_BASE[normRarity] ? normRarity : 'Rare';
        
        let entryObj = null;
        if (typeof card === 'string') {
            entryObj = {
                name: card,
                rarity: validRarity,
                role: extra.role || 'Grade 7 – Psalms • Battle Edition',
                img: extra.img || 'mainpics/AFCS.jpg',
                quote: extra.quote || 'We rise because Jesus Christ is our Cornerstone.'
            };
        } else if (card && typeof card === 'object') {
            entryObj = { ...card, rarity: validRarity };
        }
        
        if (entryObj && entryObj.name) {
            if (tcg && typeof tcg.addCards === 'function') {
                tcg.addCards(entryObj);
            }
            const found = tcg && Array.isArray(tcg.catalog)
            ? tcg.catalog.find(c => c.name.toLowerCase() === entryObj.name.toLowerCase() || (entryObj.id && c.id === entryObj.id))
            : null;
            const key = found ? found.id : (entryObj.id || entryObj.name.toLowerCase());
            const base = window.TCG_RARITY_BASE[validRarity];
            
            window.TCG_BATTLE_STATS[key] = {
                hp: Number(extra.hp) || base.hp,
                atk: Number(atk) || base.atk,
                def: Number(def) || base.def,
                skillName: extra.skillName || base.skillName,
                skillPower: Number(extra.skillPower) || Math.round((Number(atk) || base.atk) * 1.45),
                skillDesc: extra.skillDesc || base.skillDesc
            };
        }
    };
}
function startTcgBattleHelpers() {
    window.tcgGetCombatProfile = function (card) {
        const base = window.TCG_RARITY_BASE[card.rarity] || window.TCG_RARITY_BASE.Common;
        const override = window.TCG_BATTLE_STATS[card.id] || window.TCG_BATTLE_STATS[card.name.toLowerCase()] || {};
        const maxHp = override.hp || base.hp;
        return {
            ...card,
            maxHp,
            hp: maxHp,
            atk: override.atk || base.atk,
            def: override.def || base.def,
            skillName: override.skillName || base.skillName,
            skillPower: override.skillPower || base.skillPower,
            skillDesc: override.skillDesc || base.skillDesc,
            shielded: false
        };
    };
    
    window.tcgGetPlayableCatalog = function () {
        const tcg = window.AFCS_TCG;
        if (tcg && Array.isArray(tcg.catalog) && tcg.catalog.length > 0) return tcg.catalog;
        return Array.of(
            { id: 'c12', num: '012', name: 'Hazel Sallow', rarity: 'Common', role: 'Vlogger 1', img: 'mainpics/DelRosario.jpg', quote: 'Rolling!' },
            { id: 'c13', num: '013', name: 'Lloyd Barell', rarity: 'Common', role: 'Vlogger 2', img: 'mainpics/Barcenas.jpg', quote: 'Floor 148!' },
            { id: 'c14', num: '014', name: 'Kyle Tucker', rarity: 'Common', role: 'Vlogger 4', img: 'mainpics/Pagarigan.jpg', quote: 'Exploring!' }
        );
    };
    
    window.tcgGetOwnedDeckPool = function () {
        const catalog = window.tcgGetPlayableCatalog();
        const tcg = window.AFCS_TCG;
        const ownedMap = tcg && typeof tcg.getOwnedMap === 'function' ? tcg.getOwnedMap() : {};
        const owned = catalog.filter(c => (ownedMap[c.id] || 0) > 0);
        if (owned.length >= 3) return { cards: owned, rented: false };
        const starters = catalog.slice(0, 3);
        const merged = Array.from(new Map([...owned, ...starters].map(c => [c.id, c])).values());
        return { cards: merged, rented: true };
    };
    
    window.tcgAwardBattleCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10) || 0;
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        const tcgCoin = document.getElementById('tcgCoinCount');
        if (tcgCoin) tcgCoin.textContent = String(next);
        return next;
    };
}
function startTcgDuelArena() {
    window.runTcgDuelArena = function (modal, playerTeam, enemyTeam, tier, onRematch, onClose) {
        let pActive = 0;
        let eActive = 0;
        let energy = 3;
        let turn = 'player';
        let battleLog = `⚔️ ${tier.name} challenges your squad! You have 3 ⚡ Energy.`;
        
        function firstAliveIndex(team) {
            return team.findIndex(c => c.hp > 0);
        }
        
        function renderArena(finishedWon = null) {
            const pCard = playerTeam.at(pActive);
            const eCard = enemyTeam.at(eActive);
            
            modal.innerHTML = `
                <div style="width:100%;max-width:860px;background:#0f172a;border:2px solid #eab308;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:14px;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
                        <span style="font-weight:900;color:#fde047;">⚔️ ${tier.name.toUpperCase()} (${tier.badge})</span>
                        <div style="display:flex;gap:10px;align-items:center;">
                            <span style="background:#172554;border:1px solid #38bdf8;color:#7dd3fc;padding:4px 10px;border-radius:8px;font-weight:bold;font-size:0.82rem;">⚡ ENERGY: ${energy} / 3</span>
                            <button type="button" id="tcgArenaExit" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:5px 11px;border-radius:8px;cursor:pointer;font-weight:bold;">✕ FORFEIT</button>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;">
                        <div style="background:#1e293b;border:2px solid #38bdf8;border-radius:12px;padding:14px;">
                            <div style="font-size:0.72rem;color:#38bdf8;font-weight:800;">YOUR ACTIVE CARD ${pCard.shielded ? '🛡️ [SHIELDED]' : ''}</div>
                            <div style="font-size:1.05rem;font-weight:900;margin:4px 0;">${pCard.name}</div>
                            <div style="width:100%;height:12px;background:#090d16;border-radius:6px;overflow:hidden;margin:6px 0;">
                                <div style="width:${Math.max(0, (pCard.hp / pCard.maxHp) * 100)}%;height:100%;background:#22c55e;"></div>
                            </div>
                            <div style="font-size:0.8rem;color:#cbd5e1;">❤️ ${pCard.hp}/${pCard.maxHp} • ⚔️ ${pCard.atk} • 🛡️ ${pCard.def}</div>
                            <div style="display:flex;gap:6px;margin-top:10px;">
                                ${playerTeam.map((m, idx) => `
                                    <button type="button" class="tcg-swap-btn" data-idx="${idx}" ${idx === pActive || m.hp <= 0 || turn !== 'player' || energy < 1 || finishedWon !== null ? 'disabled' : ''} style="flex:1;padding:5px;border-radius:6px;font-size:0.72rem;font-weight:bold;cursor:pointer;border:1px solid ${idx === pActive ? '#38bdf8' : '#475569'};background:${m.hp <= 0 ? '#450a0a' : idx === pActive ? '#0c4a6e' : '#0f172a'};color:${m.hp <= 0 ? '#fca5a5' : '#e2e8f0'};">
                                        ${m.name.split(' ').at(0)} (${m.hp}HP)
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div style="font-size:1.5rem;font-weight:900;color:#f43f5e;">VS</div>

                        <div style="background:#1e293b;border:2px solid #f43f5e;border-radius:12px;padding:14px;">
                            <div style="font-size:0.72rem;color:#f43f5e;font-weight:800;">ENEMY ACTIVE CARD ${eCard.shielded ? '🛡️ [SHIELDED]' : ''}</div>
                            <div style="font-size:1.05rem;font-weight:900;margin:4px 0;">${eCard.name}</div>
                            <div style="width:100%;height:12px;background:#090d16;border-radius:6px;overflow:hidden;margin:6px 0;">
                                <div style="width:${Math.max(0, (eCard.hp / eCard.maxHp) * 100)}%;height:100%;background:#ef4444;"></div>
                            </div>
                            <div style="font-size:0.8rem;color:#cbd5e1;">❤️ ${eCard.hp}/${eCard.maxHp} • ⚔️ ${eCard.atk} • 🛡️ ${eCard.def}</div>
                            <div style="display:flex;gap:6px;margin-top:10px;">
                                ${enemyTeam.map((m, idx) => `
                                    <div style="flex:1;padding:5px;border-radius:6px;font-size:0.72rem;font-weight:bold;text-align:center;border:1px solid ${idx === eActive ? '#f43f5e' : '#334155'};background:${m.hp <= 0 ? '#450a0a' : '#0f172a'};color:${m.hp <= 0 ? '#fca5a5' : '#cbd5e1'};">
                                        ${m.name.split(' ').at(0)} (${m.hp}HP)
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="background:#090d16;border:1px solid #334155;border-radius:10px;padding:10px 14px;font-size:0.88rem;color:#fde047;min-height:42px;display:flex;align-items:center;">
                        ${battleLog}
                    </div>

                    ${finishedWon !== null ? `
                        <div style="display:flex;justify-content:center;gap:12px;">
                            <button type="button" id="tcgRematchBtn" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:10px 20px;border-radius:10px;font-weight:900;cursor:pointer;">↻ CHANGE SQUAD / REMATCH</button>
                            <button type="button" id="tcgDoneBtn" style="background:#1e293b;color:#e2e8f0;border:1px solid #475569;padding:10px 20px;border-radius:10px;font-weight:bold;cursor:pointer;">CLOSE</button>
                        </div>
                    ` : `
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
                            <button type="button" id="tcgBasicBtn" ${turn !== 'player' || energy < 1 ? 'disabled' : ''} style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:11px;border-radius:10px;font-weight:800;cursor:pointer;">
                                👊 Strike (1 ⚡)
                            </button>
                            <button type="button" id="tcgSkillBtn" ${turn !== 'player' || energy < 2 ? 'disabled' : ''} style="background:#7e22ce;color:#fff;border:1px solid #c084fc;padding:11px;border-radius:10px;font-weight:800;cursor:pointer;">
                                ✨ ${pCard.skillName} (2 ⚡)
                            </button>
                            <button type="button" id="tcgEndTurnBtn" ${turn !== 'player' ? 'disabled' : ''} style="background:#1e293b;color:#fde047;border:1px solid #eab308;padding:11px;border-radius:10px;font-weight:800;cursor:pointer;">
                                ⏭️ End Turn
                            </button>
                        </div>
                    `}
                </div>
            `;
            
            modal.querySelector('#tcgArenaExit').onclick = onClose;
            
            if (finishedWon !== null) {
                modal.querySelector('#tcgRematchBtn').onclick = onRematch;
                modal.querySelector('#tcgDoneBtn').onclick = onClose;
                return;
            }
            
            modal.querySelectorAll('.tcg-swap-btn').forEach(btn => {
                btn.onclick = () => {
                    if (turn !== 'player' || energy < 1) return;
                    pActive = Number(btn.dataset.idx);
                    energy -= 1;
                    battleLog = `🔄 Swapped in ${playerTeam.at(pActive).name}! (${energy} ⚡ left)`;
                    if (typeof playBeep === 'function') playBeep(587.33, 0.06, 'triangle', 0.04);
                    renderArena(null);
                };
            });
            
            modal.querySelector('#tcgBasicBtn').onclick = () => {
                if (turn !== 'player' || energy < 1) return;
                energy -= 1;
                let dmg = Math.max(8, pCard.atk - Math.floor(eCard.def * 0.4));
                if (eCard.shielded) {
                    dmg = Math.max(4, Math.floor(dmg * 0.5));
                    eCard.shielded = false;
                }
                eCard.hp = Math.max(0, eCard.hp - dmg);
                battleLog = `👊 ${pCard.name} struck ${eCard.name} for ${dmg} DMG!`;
                if (typeof playBeep === 'function') playBeep(440, 0.07, 'square', 0.04);
                handleAfterPlayerAction();
            };
            
            modal.querySelector('#tcgSkillBtn').onclick = () => {
                if (turn !== 'player' || energy < 2) return;
                energy -= 2;
                let dmg = Math.max(12, pCard.skillPower - Math.floor(eCard.def * 0.3));
                if (eCard.shielded) {
                    dmg = Math.max(6, Math.floor(dmg * 0.5));
                    eCard.shielded = false;
                }
                eCard.hp = Math.max(0, eCard.hp - dmg);
                if (pCard.rarity === 'Rare') {
                    pCard.hp = Math.min(pCard.maxHp, pCard.hp + 15);
                } else if (pCard.rarity === 'Mythic') {
                    pCard.shielded = true;
                }
                battleLog = `✨ ${pCard.name} used ${pCard.skillName} for ${dmg} DMG!`;
                if (typeof playBeep === 'function') playBeep(783.99, 0.1, 'triangle', 0.05);
                handleAfterPlayerAction();
            };
            
            modal.querySelector('#tcgEndTurnBtn').onclick = () => {
                if (turn !== 'player') return;
                runEnemyTurn();
            };
        }
        
        function handleAfterPlayerAction() {
            const eCard = enemyTeam.at(eActive);
            if (eCard.hp <= 0) {
                const nextE = firstAliveIndex(enemyTeam);
                if (nextE === -1) {
                    const bal = window.tcgAwardBattleCoins(tier.reward);
                    battleLog = `🏆 VICTORY! Defeated ${tier.name} (+${tier.reward} 🪙 • Balance: ${bal} 🪙)`;
                    if (typeof spawnBurst === 'function') {
                        spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#facc15', '#4ade80', '#38bdf8', '#ffffff'], 46);
                    }
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    renderArena(true);
                    return;
                }
                eActive = nextE;
                battleLog +=  `Enemy sent out ${enemyTeam.at(eActive).name}!`;
            }
            if (energy <= 0) {
                runEnemyTurn();
            } else {
                renderArena(null);
            }
        }
        function runEnemyTurn() {
            turn = 'enemy';
            renderArena(null);
            setTimeout(() => {
                if (!document.getElementById('afcs-tcg-battle-modal')) return;
                const pCard = playerTeam.at(pActive);
                const eCard = enemyTeam.at(eActive);
                const useSkill = Math.random() < 0.45;
                let dmg = useSkill ? eCard.skillPower : eCard.atk;
                dmg = Math.max(6, dmg - Math.floor(pCard.def * 0.4));
                if (pCard.shielded) {
                    dmg = Math.max(3, Math.floor(dmg * 0.5));
                    pCard.shielded = false;
                }
                pCard.hp = Math.max(0, pCard.hp - dmg);
                battleLog = `💥 Enemy ${eCard.name} used ${useSkill ? eCard.skillName : 'Strike'} for ${dmg} DMG!`;
                if (typeof playBeep === 'function') playBeep(220, 0.09, 'sawtooth', 0.045);
                if (pCard.hp <= 0) {
                    const nextP = firstAliveIndex(playerTeam);
                    if (nextP === -1) {
                        battleLog = `💀 DEFEAT! ${tier.name} wiped out your 3-card squad.`;
                        renderArena(false);
                        return;
                    }
                    pActive = nextP;
                    battleLog +=  `${playerTeam.at(pActive).name} stepped in!`;
                }
                turn = 'player';
                energy = 3;
                renderArena(null);
            }, 650);
        }
        renderArena(null);
    };
}
function startTcgBattleUI() {
    window.openTcgCardBattle = function () {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('tcg_battle');
        const old = document.getElementById('afcs-tcg-battle-modal');
        if (old) old.remove();

        const { cards: availableCards, rented } = window.tcgGetOwnedDeckPool();
        let selectedIds = availableCards.slice(0, 3).map(c => c.id);
        let selectedTierIdx = 0;

        const modal = document.createElement('div');
        modal.id = 'afcs-tcg-battle-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,0.94);backdrop-filter:blur(8px);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:16px;user-select:none;';
        document.body.appendChild(modal);

        function closeModal() {
            modal.remove();
            window.removeEventListener('keydown', escHandler);
        }
        function escHandler(e) {
            if (e.code === 'Escape') closeModal();
        }
        window.addEventListener('keydown', escHandler);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        function renderDeckBuilder() {
            const tier = window.TCG_BOSS_TIERS.at(selectedTierIdx);
            modal.innerHTML = `
                <div style="width:100%;max-width:860px;max-height:90vh;background:#0f172a;border:2px solid #38bdf8;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
                    <div style="padding:14px 20px;background:#090d16;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <span style="font-size:0.75rem;color:#38bdf8;font-weight:800;letter-spacing:1px;">⚔️ PSALMS TCG ARENA</span>
                            <h2 style="margin:2px 0 0 0;font-size:1.2rem;color:#f8fafc;">Build Your 3-Card Squad</h2>
                        </div>
                        <button type="button" id="tcgBtlClose" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✕ EXIT</button>
                    </div>

                    <div style="padding:12px 20px;background:#090d16;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                        <div style="display:flex;gap:8px;flex-wrap:wrap;">
                            ${window.TCG_BOSS_TIERS.map((t, i) => `
                                <button type="button" class="tcg-tier-btn" data-idx="${i}" style="padding:7px 12px;border-radius:8px;font-size:0.78rem;font-weight:800;cursor:pointer;border:1.5px solid ${i === selectedTierIdx ? '#facc15' : '#334155'};background:${i === selectedTierIdx ? '#713f12' : '#1e293b'};color:${i === selectedTierIdx ? '#fef08a' : '#cbd5e1'};">
                                    ${t.badge} (+${t.reward} 🪙)
                                </button>
                            `).join('')}
                        </div>
                        <div style="font-size:0.82rem;color:#94a3b8;">
                            Selected: <strong style="color:${selectedIds.length === 3 ? '#4ade80' : '#facc15'};">${selectedIds.length} / 3</strong>
                        </div>
                    </div>

                    ${rented ? '<div style="padding:8px 20px;background:#172554;color:#93c5fd;font-size:0.78rem;border-bottom:1px solid #1e3a8a;">Starter loan cards active because you own fewer than 3 cards in your Binder!</div>' : ''}

                    <div style="padding:16px 20px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:10px;flex:1;">
                        ${availableCards.map(c => {
                            const stats = window.tcgGetCombatProfile(c);
                            const isPicked = selectedIds.includes(c.id);
                            const rarityColor = c.rarity === 'Mythic' ? '#facc15' : c.rarity === 'Epic' ? '#c084fc' : c.rarity === 'Rare' ? '#38bdf8' : '#94a3b8';
                            return `
                                <button type="button" class="tcg-pick-card" data-id="${c.id}" style="text-align:left;background:${isPicked ? '#1e3a5f' : '#1e293b'};border:2px solid ${isPicked ? '#4ade80' : '#334155'};border-radius:10px;padding:10px;cursor:pointer;color:#f8fafc;display:flex;flex-direction:column;gap:4px;">
                                    <div style="display:flex;justify-content:space-between;font-size:0.72rem;font-weight:800;">
                                        <span style="color:${rarityColor};">${c.rarity.toUpperCase()}</span>
                                        <span style="color:${isPicked ? '#4ade80' : '#64748b'};">${isPicked ? '✓ IN SQUAD' : '+ PICK'}</span>
                                    </div>
                                    <div style="font-weight:800;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
                                    <div style="font-size:0.74rem;color:#cbd5e1;">❤️ ${stats.maxHp} • ⚔️ ${stats.atk} • 🛡️ ${stats.def}</div>
                                    <div style="font-size:0.7rem;color:#94a3b8;">✨ ${stats.skillName}</div>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div style="padding:14px 20px;background:#090d16;border-top:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:0.8rem;color:#94a3b8;">Opponent: <strong style="color:#f43f5e;">${tier.name}</strong></span>
                        <button type="button" id="tcgStartDuelBtn" ${selectedIds.length === 3 ? '' : 'disabled'} style="background:${selectedIds.length === 3 ? '#16a34a' : '#334155'};color:#fff;border:1px solid ${selectedIds.length === 3 ? '#4ade80' : '#475569'};padding:10px 22px;border-radius:10px;font-weight:900;cursor:${selectedIds.length === 3 ? 'pointer' : 'not-allowed'};">
                            ⚔️ START 3V3 DUEL
                        </button>
                    </div>
                </div>
            `;

            modal.querySelector('#tcgBtlClose').onclick = closeModal;
            modal.querySelectorAll('.tcg-tier-btn').forEach(btn => {
                btn.onclick = () => {
                    selectedTierIdx = Number(btn.dataset.idx);
                    renderDeckBuilder();
                };
            });
            modal.querySelectorAll('.tcg-pick-card').forEach(btn => {
                btn.onclick = () => {
                    const id = btn.dataset.id;
                    if (selectedIds.includes(id)) {
                        selectedIds = selectedIds.filter(x => x !== id);
                    } else if (selectedIds.length < 3) {
                        selectedIds.push(id);
                    }
                    renderDeckBuilder();
                };
            });
            modal.querySelector('#tcgStartDuelBtn').onclick = () => {
                if (selectedIds.length !== 3) return;
                const catalog = window.tcgGetPlayableCatalog();
                const playerTeam = selectedIds.map(id => window.tcgGetCombatProfile(catalog.find(c => c.id === id) || availableCards.at(0)));
                const enemyTeam = tier.deckIds.map((id, i) => {
                    const found = catalog.find(c => c.id === id) || catalog.at(i % catalog.length);
                    return window.tcgGetCombatProfile(found);
                });
                window.runTcgDuelArena(modal, playerTeam, enemyTeam, tier, renderDeckBuilder, closeModal);
            };
        }

        renderDeckBuilder();
    };

    const packBar = document.querySelector('.tcg-pack-bar');
    if (packBar && !document.getElementById('tcgLaunchBattleBtn')) {
        const btlBtn = document.createElement('button');
        btlBtn.type = 'button';
        btlBtn.id = 'tcgLaunchBattleBtn';
        btlBtn.className = 'tcg-open-pack-btn';
        btlBtn.style.marginLeft = '8px';
        btlBtn.textContent = '⚔️ 3v3 Deck Battle';
        btlBtn.onclick = window.openTcgCardBattle;
        packBar.appendChild(btlBtn);
    }

    if (typeof window.arcadeRegisterGame === 'function') {
        window.arcadeRegisterGame({
            id: 'tcg_battle',
            title: '3v3 Psalms TCG Duel',
            icon: '⚔️',
            reward: '+80–300 🪙',
            hint: 'Battle with your collected TCG Binder cards...',
            triggers: Array.of('tcg battle', 'deck', 'duel', 'card battle'),
            launch: () => window.openTcgCardBattle()
        });
    }

    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push((val) => {
            if (Array.of('tcg battle', 'deck', 'duel', 'card battle').includes(val)) {
                if (DOM.searchInput) {
                    DOM.searchInput.value = '';
                    filterCards();
                }
                window.openTcgCardBattle();
                return true;
            }
            return false;
        });
    }
}

