function startWhackACyn() {
    let gameActive = false;
    let gameTimer = null;
    let spawnTimer = null;
    let score = 0;
    let timeLeft = 20;
    let corruption = 0;
    
    const modal = document.createElement('div');
    modal.className = 'whack-cyn-overlay';
    modal.innerHTML = `
        <div class="whack-cyn-card">
            <div class="whack-cyn-header">
                <span class="whack-cyn-title">⬡ SOLVER_DEFENSE // [NULL] CONTAINMENT</span>
                <button type="button" class="whack-cyn-close" id="whackCynClose">&times;</button>
            </div>
            <div class="whack-cyn-hud">
                <div class="whack-stat-pill">PURGED: <strong id="wcScore">0</strong></div>
                <div class="whack-stat-pill">TIME: <strong id="wcTime">20s</strong></div>
                <div class="whack-stat-pill is-danger">CORRUPTION: <strong id="wcCorrupt">0%</strong></div>
            </div>
            <div class="whack-corrupt-bar-wrap">
                <div class="whack-corrupt-bar-fill" id="wcCorruptFill"></div>
            </div>
            <p class="whack-cyn-sub" id="wcStatus">Smash the ⬡ Cyn nodes before corruption hits 100%! Avoid 💜 Uzi cores!</p>
            <div class="whack-cyn-grid" id="wcGrid">
                ${Array.from({ length: 9 }, (_, i) => `<button type="button" class="whack-node" data-idx="${i}"><span class="whack-node-icon">·</span></button>`).join('')}
            </div>
            <div class="whack-cyn-footer">
                <button type="button" class="whack-start-btn" id="wcStartBtn">⚡ INITIATE CONTAINMENT</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const scoreEl = modal.querySelector('#wcScore');
    const timeEl = modal.querySelector('#wcTime');
    const corruptEl = modal.querySelector('#wcCorrupt');
    const corruptFill = modal.querySelector('#wcCorruptFill');
    const statusEl = modal.querySelector('#wcStatus');
    const startBtn = modal.querySelector('#wcStartBtn');
    const closeBtn = modal.querySelector('#whackCynClose');
    const nodes = Array.from(modal.querySelectorAll('.whack-node'));
    
    function clearAllNodes() {
        nodes.forEach(n => {
            n.dataset.type = '';
            n.className = 'whack-node';
            n.querySelector('.whack-node-icon').textContent = '·';
        });
    }
    
    function syncHud() {
        scoreEl.textContent = String(score);
        timeEl.textContent = `${timeLeft}s`;
        corruptEl.textContent = `${Math.min(100, corruption)}%`;
        corruptFill.style.width = `${Math.min(100, corruption)}%`;
    }
    
    function endRound(won) {
        gameActive = false;
        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        clearAllNodes();
        startBtn.disabled = false;
        startBtn.textContent = '↻ REBOOT CONTAINMENT';
        
        const best = Number(localStorage.getItem('afcs_whack_cyn_best') || '0');
        if (score > best) {
            localStorage.setItem('afcs_whack_cyn_best', String(score));
        }
        
        if (won) {
            localStorage.setItem('afcs_whack_cyn_cleared', 'true');
            const prevCoins = Number(localStorage.getItem('afcs_coins') || '0');
            const earned = score * 5 + 25;
            localStorage.setItem('afcs_coins', String(prevCoins + earned));
            
            statusEl.style.color = '#a7f3d0';
            statusEl.textContent = `✓ CONTAINMENT SUCCESS! Purged ${score} nodes (+${earned} AFCS Coins • Best: ${Math.max(score, best)})`;
            
            const rect = modal.querySelector('.whack-cyn-card').getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#34d399', '#ffffff'], 42);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 75);
            });
        } else {
            statusEl.style.color = '#fca5a5';
            statusEl.textContent = `✕ CORE ASSIMILATED! Score: ${score} (Best: ${Math.max(score, best)}) — Try again!`;
            triggerScreenGlitch(180);
            [220, 185, 146.83, 110].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.2, 'sawtooth', 0.05), idx * 80);
            });
        }
    }
    
    function spawnWave() {
        if (!gameActive) return;
        const emptyNodes = nodes.filter(n => !n.dataset.type);
        if (!emptyNodes.length) return;
        
        const target = emptyNodes.at(Math.floor(Math.random() * emptyNodes.length));
        const roll = Math.random();
        let kind = 'cyn';
        let icon = '⬡';
        
        if (roll < 0.18) {
            kind = 'uzi';
            icon = '💜';
        } else if (roll < 0.34) {
            kind = 'gold';
            icon = '⚠️';
        }
        
        target.dataset.type = kind;
        target.classList.add(`is-${kind}`);
        target.querySelector('.whack-node-icon').textContent = icon;
        
        const stayMs = Math.max(520, 1050 - score * 14);
        setTimeout(() => {
            if (!gameActive || target.dataset.type !== kind) return;
            if (kind === 'cyn' || kind === 'gold') {
                corruption += kind === 'gold' ? 16 : 10;
                syncHud();
                if (corruption >= 100) {
                    endRound(false);
                    return;
                }
            }
            target.dataset.type = '';
            target.className = 'whack-node';
            target.querySelector('.whack-node-icon').textContent = '·';
        }, stayMs);
    }
    
    function startRound() {
        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        clearAllNodes();
        
        score = 0;
        timeLeft = 20;
        corruption = 0;
        gameActive = true;
        startBtn.disabled = true;
        startBtn.textContent = '⬡ DEFENDING CORE...';
        statusEl.style.color = '#fef08a';
        statusEl.textContent = 'Click ⬡ (+1) & ⚠️ (+3)! Do NOT hit 💜 Uzi!';
        syncHud();
        
        playBeep(659.25, 0.1, 'square', 0.045);
        
        gameTimer = setInterval(() => {
            if (!gameActive) return;
            timeLeft--;
            syncHud();
            if (timeLeft <= 0) {
                endRound(true);
            }
        }, 1000);
        
        spawnWave();
        spawnTimer = setInterval(spawnWave, 460);
    }
    
    nodes.forEach(node => {
        node.addEventListener('pointerdown', () => {
            if (!gameActive) return;
            const kind = node.dataset.type;
            if (!kind) return;
            
            node.dataset.type = '';
            node.className = 'whack-node is-hit';
            node.querySelector('.whack-node-icon').textContent = '·';
            setTimeout(() => node.classList.remove('is-hit'), 140);
            
            const rect = node.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            if (kind === 'cyn') {
                score += 1;
                corruption = Math.max(0, corruption - 3);
                spawnBurst(cx, cy, ['#facc15', '#ffffff'], 12);
                playBeep(783.99, 0.06, 'square', 0.04);
            } else if (kind === 'gold') {
                score += 3;
                corruption = Math.max(0, corruption - 8);
                spawnBurst(cx, cy, ['#facc15', '#ef4444', '#ffffff'], 22);
                playBeep(1046.50, 0.09, 'triangle', 0.05);
            } else if (kind === 'uzi') {
                score = Math.max(0, score - 2);
                corruption += 15;
                triggerScreenGlitch(90);
                spawnBurst(cx, cy, ['#c084fc', '#ef4444'], 16);
                playBeep(185, 0.14, 'sawtooth', 0.05);
                if (corruption >= 100) {
                    syncHud();
                    endRound(false);
                    return;
                }
            }
            
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            syncHud();
        });
    });
    
    function openWhackModal() {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('whack');
        modal.classList.add('active');
        clearAllNodes();
        score = 0;
        timeLeft = 20;
        corruption = 0;
        syncHud();
        startBtn.disabled = false;
        startBtn.textContent = '⚡ INITIATE CONTAINMENT';
        statusEl.style.color = '#fef08a';
        statusEl.textContent = 'Smash ⬡ (+1) & ⚠️ (+3) before corruption hits 100%! Avoid 💜 Uzi (-2)!';
        triggerScreenGlitch(130);
        playBeep(880, 0.1, 'sawtooth', 0.045);
    }
    
    function closeWhackModal() {
        gameActive = false;
        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        clearAllNodes();
        modal.classList.remove('active');
    }
    
    startBtn.addEventListener('click', startRound);
    closeBtn.addEventListener('click', closeWhackModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeWhackModal();
    });
    
    window.openWhackACynGame = openWhackModal;
    
    if (DOM.searchInput) {
        STATE.onSearchInput.push((val) => {
            if (val === '[null]' || val === 'whack a cyn') {
                DOM.searchInput.value = '';
                filterCards();
                openWhackModal();
                return true;
            }
            return false;
        });
    }
}
function startTradingCardData() {
    const CARD_CATALOG = [
        { id: 'c01', num: '001', name: 'Jenn V. Batumbakal', rarity: 'Mythic', role: 'Lead • Costume Head', img: 'mainPics/Arles.jpg', quote: 'We rise because Jesus Christ is our Cornerstone.' },
        { id: 'c02', num: '002', name: 'Sir Mark Christian Eulogio', rarity: 'Mythic', role: 'Class Adviser • Co-Director', img: 'mainPics/Eulogio.jpg', quote: 'Grade 7 – Psalms, shine bright on stage!' },
        { id: 'c03', num: '003', name: 'Cosmos Baterbonia (Caceb)', rarity: 'Epic', role: 'Vlogger 3 • Research Head', img: 'mainPics/Uzi.jfif', quote: 'Live from Floor 163 of the Burj Khalifa!' },
        { id: 'c04', num: '004', name: 'Mics Batumbakal (Recca)', rarity: 'Rare', role: 'Father of Jenn • Asst. Tech', img: 'mainPics/Amadora.jpg', quote: 'Steady and calm through every lockdown.' },
        { id: 'c05', num: '005', name: 'Nakano Hazumake (Prince)', rarity: 'Epic', role: 'Artist 4 • Manga Artist', img: 'mainPics/Angeles.jpg', quote: 'Sketching the whole skyline from Japan!' },
        { id: 'c06', num: '006', name: 'Kei Boberx (Kief)', rarity: 'Epic', role: 'Artist 5 • 2823 Grandmaster', img: 'mainPics/DelaCruz.jpg', quote: 'Checkmate in four moves.' },
        { id: 'c07', num: '007', name: 'Zach Xander (Xander)', rarity: 'Rare', role: 'Artist 1 • Speedcuber', img: 'mainPics/Ibarra.jpg', quote: 'Solved under 8 seconds!' },
        { id: 'c08', num: '008', name: 'Ella Brooks (Janaya)', rarity: 'Rare', role: 'Artist 2 • Stage Director', img: 'mainPics/Tulaylay.jpg', quote: 'Places everyone, curtain up!' },
        { id: 'c09', num: '009', name: 'Virelle Valdez (Rosh)', rarity: 'Rare', role: 'Artist 3 • Head Lighting', img: 'mainPics/Uba.jpg', quote: 'Spotlights locked and loaded.' },
        { id: 'c10', num: '010', name: 'Jolianne Batumbakal (Giechelle)', rarity: 'Epic', role: 'Class President • Floor Dir.', img: 'mainPics/Tan.jpg', quote: 'Leading Grade 7 – Psalms with heart.' },
        { id: 'c11', num: '011', name: 'Scarlet Hernandez (Jennah)', rarity: 'Epic', role: 'Research Head • VIP Cast', img: 'mainPics/Mantal.jpg', quote: 'Only the best for the Burj Khalifa VIP lounge!' },
        { id: 'c12', num: '012', name: 'Hazel Sallow (Veronica)', rarity: 'Common', role: 'Vlogger 1 • Prop Head', img: 'mainPics/DelRosario.jpg', quote: 'Welcome back to another Dubai mukbang!' },
        { id: 'c13', num: '013', name: 'Lloyd Barell (Jordan)', rarity: 'Common', role: 'Vlogger 2 • Shadow Head', img: 'mainPics/Barcenas.jpg', quote: 'Rolling camera on Floor 148!' },
        { id: 'c14', num: '014', name: 'Kyle Tucker (Aleb)', rarity: 'Common', role: 'Vlogger 4 • Shadow Head', img: 'mainPics/Pagarigan.jpg', quote: 'Exploring every corner of the tower.' },
        { id: 'c15', num: '015', name: 'Lydia Phileo (Charlyn)', rarity: 'Common', role: 'Host 1 • Prop Head', img: 'mainPics/Tesoro.jpg', quote: 'Welcome to the Christmas Meet & Greet!' },
        { id: 'c16', num: '016', name: 'Ace Rosehearts (Alyana)', rarity: 'Common', role: 'Host 2 • Research Head', img: 'mainPics/Pinpin.jpg', quote: 'Give it up for our celebrity guests!' },
        { id: 'c17', num: '017', name: 'Bobby Dridger (Eldrige)', rarity: 'Common', role: 'Security Guard 1 • Tech Head', img: 'mainPics/Operana.jpg', quote: 'Perimeter secure, all clear.' },
        { id: 'c18', num: '018', name: 'Vollow (Ethan)', rarity: 'Common', role: 'Security Guard 2 • Shadow', img: 'mainPics/Sevilla.jpg', quote: 'Watching every exit.' },
        { id: 'c19', num: '019', name: 'Officer Ryo (Ezekiel)', rarity: 'Common', role: 'Police Officer 1 • Shadow', img: 'mainPics/SanAndres.jpg', quote: 'Lockdown protocol initiated.' },
        { id: 'c20', num: '020', name: 'Officer Theo (Roberto)', rarity: 'Common', role: 'Police Officer 2 • Choreo', img: 'mainPics/Gapasin.jpg', quote: 'Keep the crowd moving safely!' },
        { id: 'c21', num: '021', name: 'Absolute Solver: Cyn', rarity: 'Mythic', role: 'Secret Anomaly • [NULL]', img: 'otherPics/Cyn.jpg', quote: 'Giggle. Did you think you could collect me?' },
        { id: 'c22', num: '022', name: 'Leonhard Euler', rarity: 'Mythic', role: 'VIP Math Legend • e^(iπ)+1=0', img: 'otherPics/euler.jpg', quote: 'Mathematics is the queen of the sciences.' }
    ];
    
    const RARITY_CONFIG = {
        Common: { weight: 50, color: '#94a3b8', dupCoins: 10 },
        Rare:   { weight: 30, color: '#38bdf8', dupCoins: 20 },
        Epic:   { weight: 15, color: '#c084fc', dupCoins: 35 },
        Mythic: { weight: 5,  color: '#facc15', dupCoins: 60 }
    };
    
    const PACK_COST = 50;
    
    if (localStorage.getItem('afcs_coins') === null) {
        localStorage.setItem('afcs_coins', '150');
    }
    
    function getCoins() {
        return Number(localStorage.getItem('afcs_coins') || '0');
    }
    
    function setCoins(val) {
        localStorage.setItem('afcs_coins', String(Math.max(0, val)));
    }
    
    function getOwnedMap() {
        try {
            return JSON.parse(localStorage.getItem('afcs_tcg_owned') || '{}');
        } catch (_) {
            return {};
        }
    }
    
    function saveOwnedMap(map) {
        localStorage.setItem('afcs_tcg_owned', JSON.stringify(map));
    }
    
    function pickRandomCard() {
        const totalW = CARD_CATALOG.reduce((sum, c) => sum + (RARITY_CONFIG[c.rarity]?.weight || 10), 0);
        let roll = Math.random() * totalW;
        for (const card of CARD_CATALOG) {
            roll -= (RARITY_CONFIG[card.rarity]?.weight || 10);
            if (roll <= 0) return card;
        }
        return CARD_CATALOG[0];
    }
    
    window.AFCS_TCG = {
        catalog: CARD_CATALOG,
        rarities: RARITY_CONFIG,
        packCost: PACK_COST,
        getCoins,
        setCoins,
        getOwnedMap,
        saveOwnedMap,
        pickRandomCard
    };
}
function startTradingCardBinderUI() {
    const tcg = window.AFCS_TCG;
    if (!tcg) return;
    function resolveCardVisual(card) {
        const rosterMatchKeys = {
            c01: 'arles',
            c02: 'eulogio',
            c03: 'abrena',
            c04: 'amadora',
            c05: 'angeles',
            c06: 'dela cruz',
            c07: 'ibarra',
            c08: 'tulaylay',
            c09: 'uba',
            c10: 'tan',
            c11: 'mantal',
            c12: 'del rosario',
            c13: 'barcenas',
            c14: 'pagarigan',
            c15: 'tesoro',
            c16: 'pinpin',
            c17: 'opera',
            c18: 'sevilla',
            c19: 'san andres',
            c20: 'gapasin'
        };

        const clean = card.name.replace(/\(.*?\)/g, '').trim().split(/\s+/);
        const initials = ((clean.at(0)?.charAt(0) || '') + (clean.at(-1)?.charAt(0) || '')).toUpperCase();
        const fallbackHtml = `<div class="monogram-avatar" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;">${initials}</div>`;

        const key = rosterMatchKeys[card.id];
        if (key) {
            const match = Array.from(document.querySelectorAll('.PeoplePics')).find(el => {
                const txt = (el.querySelector('.overlay-text')?.textContent || '').toLowerCase();
                return txt.includes(key);
            });

            if (match) {
                const domImg = match.querySelector('img');
                const isMissing = match.classList.contains('is-missing-photo') || !domImg || domImg.style.display === 'none';
                if (!isMissing) {
                    const liveSrc = domImg.getAttribute('src') || domImg.dataset.src;
                    if (liveSrc) {
                        return `<img src="${liveSrc}" alt="${card.name}" onerror="this.outerHTML='${fallbackHtml.replace(/"/g, '&quot;')}'">`;
                    }
                }
            }
            return fallbackHtml;
        }

        return `<img src="${card.img}" alt="${card.name}" onerror="this.outerHTML='${fallbackHtml.replace(/"/g, '&quot;')}'">`;
    }
    const modal = document.createElement('div');
    modal.className = 'tcg-modal-overlay';
    modal.innerHTML = `
        <div class="tcg-modal-card">
            <div class="tcg-header">
                <div>
                    <span class="tcg-badge">🃏 PSALMS 2026 COLLECTIBLE BINDER</span>
                    <h2 class="tcg-title">Beyond The Manger TCG</h2>
                </div>
                <div class="tcg-header-right">
                    <span class="tcg-coin-pill">🪙 <strong id="tcgCoinCount">0</strong> AFCS Coins</span>
                    <button type="button" class="tcg-close-btn" id="tcgCloseBtn">&times;</button>
                </div>
            </div>
    
            <div class="tcg-pack-bar">
                <div class="tcg-progress-text" id="tcgProgressText">Collected: 0 / ${tcg.catalog.length}</div>
                <button type="button" class="tcg-open-pack-btn" id="tcgBuyPackBtn">✨ Open Booster Pack (${tcg.packCost} 🪙)</button>
            </div>
    
            <div class="tcg-pack-reveal" id="tcgPackReveal"></div>
            <div class="tcg-binder-grid" id="tcgBinderGrid"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const inspectOverlay = document.createElement('div');
    inspectOverlay.className = 'tcg-inspect-overlay';
    inspectOverlay.innerHTML = `<div class="tcg-inspect-stage" id="tcgInspectStage"></div>`;
    document.body.appendChild(inspectOverlay);
    
    const coinEl = modal.querySelector('#tcgCoinCount');
    const progressEl = modal.querySelector('#tcgProgressText');
    const buyBtn = modal.querySelector('#tcgBuyPackBtn');
    const revealEl = modal.querySelector('#tcgPackReveal');
    const gridEl = modal.querySelector('#tcgBinderGrid');
    const closeBtn = modal.querySelector('#tcgCloseBtn');
    const inspectStage = inspectOverlay.querySelector('#tcgInspectStage');
    
    function buildCardHTML(card, count = 1, isNew = false) {
        const rarityLower = card.rarity.toLowerCase();
        return `
            <div class="tcg-card rarity-${rarityLower}" data-card-id="${card.id}">
                <div class="tcg-card-holo"></div>
                <div class="tcg-card-top">
                    <span class="tcg-card-num">#${card.num}</span>
                    <span class="tcg-card-rarity">${card.rarity}</span>
                </div>
                 <div class="tcg-card-art">
                    ${resolveCardVisual(card)}
                </div>
                <div class="tcg-card-name">${card.name}</div>
                <div class="tcg-card-role">${card.role}</div>
                <div class="tcg-card-quote">"${card.quote}"</div>
                <div class="tcg-card-foot">
                    ${isNew ? '<span class="tcg-new-tag">NEW!</span>' : `<span>Owned: ×${count}</span>`}
                </div>
            </div>
        `;
    }
    
    function openCardInspector(card, count) {
        inspectStage.innerHTML = buildCardHTML(card, count, false);
        const bigCard = inspectStage.querySelector('.tcg-card');
        bigCard.classList.add('is-inspected');
        inspectOverlay.classList.add('active');
        
        bigCard.addEventListener('pointermove', (e) => {
            const rect = bigCard.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;
            const rx = (0.5 - ny) * 26;
            const ry = (nx - 0.5) * 26;
            bigCard.style.transform = `perspective(700px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale(1.04)`;
            bigCard.style.setProperty('--holo-x', `${(nx * 100).toFixed(1)}%`);
            bigCard.style.setProperty('--holo-y', `${(ny * 100).toFixed(1)}%`);
        });
        
        bigCard.addEventListener('pointerleave', () => {
            bigCard.style.transform = '';
        });
        
        playBeep(659.25, 0.08, 'triangle', 0.045);
    }
    
    inspectOverlay.addEventListener('click', (e) => {
        if (e.target === inspectOverlay) inspectOverlay.classList.remove('active');
    });
    
    function renderBinder() {
        const coins = tcg.getCoins();
        const owned = tcg.getOwnedMap();
        const unlockedCount = tcg.catalog.filter(c => (owned[c.id] || 0) > 0).length;
        
        coinEl.textContent = String(coins);
        progressEl.textContent = `Collected: ${unlockedCount} / ${tcg.catalog.length} (${Math.round((unlockedCount / tcg.catalog.length) * 100)}%)`;
        buyBtn.disabled = coins < tcg.packCost;
        buyBtn.textContent = coins < tcg.packCost
        ? `Need ${tcg.packCost} 🪙 (Play [NULL] for Coins!)`
        : `✨ Open Booster Pack (${tcg.packCost} 🪙)`;
        
        gridEl.innerHTML = tcg.catalog.map(card => {
            const count = owned[card.id] || 0;
            if (count > 0) {
                return buildCardHTML(card, count, false);
            }
            return `
                <div class="tcg-card is-locked">
                    <div class="tcg-card-top">
                        <span class="tcg-card-num">#${card.num}</span>
                        <span class="tcg-card-rarity">${card.rarity}</span>
                    </div>
                    <div class="tcg-locked-art">?</div>
                    <div class="tcg-card-name">Undiscovered</div>
                    <div class="tcg-card-role">Open packs to unlock</div>
                </div>
            `;
        }).join('');
        
        gridEl.querySelectorAll('.tcg-card:not(.is-locked)').forEach(el => {
            el.addEventListener('click', () => {
                const c = tcg.catalog.find(item => item.id === el.dataset.cardId);
                if (c) openCardInspector(c, owned[c.id] || 1);
            });
        });
    }
    
    buyBtn.addEventListener('click', () => {
        const currentCoins = tcg.getCoins();
        if (currentCoins < tcg.packCost) return;
        
        tcg.setCoins(currentCoins - tcg.packCost);
        const owned = tcg.getOwnedMap();
        const pulls = Array.of(tcg.pickRandomCard(), tcg.pickRandomCard(), tcg.pickRandomCard());
        let refundCoins = 0;
        
        const pullHTML = pulls.map(card => {
            const prevCount = owned[card.id] || 0;
            const isNew = prevCount === 0;
            owned[card.id] = prevCount + 1;
            if (!isNew) {
                refundCoins += tcg.rarities[card.rarity]?.dupCoins || 10;
            }
            return buildCardHTML(card, owned[card.id], isNew);
        }).join('');
        
        tcg.saveOwnedMap(owned);
        if (refundCoins > 0) {
            tcg.setCoins(tcg.getCoins() + refundCoins);
        }
        
        const hasMythic = pulls.some(p => p.rarity === 'Mythic');
        const hasEpic = pulls.some(p => p.rarity === 'Epic');
        
        revealEl.innerHTML = `
            <div class="tcg-reveal-banner">
                <span>🎉 PACK OPENED! ${refundCoins > 0 ? `(+${refundCoins} 🪙 duplicate bonus)` : ''}</span>
                <button type="button" class="tcg-hide-reveal-btn" id="tcgHideReveal">Hide</button>
            </div>
            <div class="tcg-reveal-row">${pullHTML}</div>
        `;
        revealEl.classList.add('is-visible');
        
        revealEl.querySelector('#tcgHideReveal').addEventListener('click', () => {
            revealEl.classList.remove('is-visible');
        });
        
        const rect = buyBtn.getBoundingClientRect();
        const burstColors = hasMythic
        ? ['#facc15', '#fef08a', '#c084fc', '#ffffff']
        : hasEpic
        ? ['#c084fc', '#38bdf8', '#ffffff']
        : ['#38bdf8', '#bae6fd', '#ffffff'];
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, burstColors, hasMythic ? 48 : 26);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        
        const notes = hasMythic ? Array.of(523.25, 659.25, 783.99, 1046.50, 1318.51) : Array.of(440, 554.37, 659.25);
        notes.forEach((f, idx) => {
            setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 75);
        });
        
        renderBinder();
    });
    
    function openBinderModal() {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('cards');
        revealEl.classList.remove('is-visible');
        renderBinder();
        modal.classList.add('active');
        playBeep(587.33, 0.08, 'triangle', 0.04);
    }
    
    function closeBinderModal() {
        modal.classList.remove('active');
        inspectOverlay.classList.remove('active');
    }
    
    closeBtn.addEventListener('click', closeBinderModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBinderModal();
    });
    
    window.openTradingCardBinder = openBinderModal;
    
    if (DOM.searchInput) {
        STATE.onSearchInput.push((val) => {
            if (val === 'cards' || val === 'binder' || val === 'tcg') {
                DOM.searchInput.value = '';
                filterCards();
                openBinderModal();
                return true;
            }
            return false;
        });
    }
}
function startCompareBattleData() {
    function getFighterProfile(card) {
        const rawName = card.querySelector('.overlay-text').textContent.trim();
        const shortName = (rawName.split(',').at(0) || rawName).trim();
        const role = (card.dataset.displayRole || card.dataset.role || 'Student').toLowerCase();
        const team = (card.dataset.team || '').toLowerCase();
        const character = card.dataset.character || '';
        const isOfficer = card.dataset.filter === 'officer';
        
        let maxHp = 110;
        let atk = 20;
        let def = 10;
        let ultName = 'Cornerstone Strike';
        let ultDesc = 'Deals heavy faith-boosted damage (34 DMG)';
        let ultPower = 34;
        
        if (card.classList.contains('quirk-cyn-solver') || card.classList.contains('is-uzi-drone-card')) {
            maxHp = 135;
            atk = 26;
            def = 12;
            ultName = '⬡ [NULL] Singularity';
            ultDesc = 'Rips reality apart for massive damage (46 DMG)';
            ultPower = 46;
        } else if (card.classList.contains('is-lebron-card') || card.classList.contains('is-kawhi-card') || card.classList.contains('is-curry-card') || card.classList.contains('is-jordan-card')) {
            maxHp = 140;
            atk = 25;
            def = 14;
            ultName = '🏀 Championship Buzzer-Beater';
            ultDesc = 'Unstoppable clutch slam (44 DMG)';
            ultPower = 44;
        } else if (card.classList.contains('is-euler-card') || card.classList.contains('is-newton-card') || card.classList.contains('is-einstein-card') || card.classList.contains('is-galileo-card')) {
            maxHp = 125;
            atk = 27;
            def = 11;
            ultName = '∑ Theorem Overdrive';
            ultDesc = 'Calculates a critical weak point (45 DMG)';
            ultPower = 45;
        } else if (role.includes('teacher')) {
            maxHp = 150;
            atk = 24;
            def = 16;
            ultName = '🍎 Adviser’s Command';
            ultDesc = 'Restores 20 HP and strikes for 36 DMG';
            ultPower = 36;
        } else if (isOfficer || role.includes('president') || role.includes('director')) {
            maxHp = 130;
            atk = 23;
            def = 14;
            ultName = '👑 Executive Order';
            ultDesc = 'High-authority strike (40 DMG)';
            ultPower = 40;
        } else if (role.includes('tech') || team.includes('tech') || role.includes('shadow') || team.includes('shadow')) {
            maxHp = 115;
            atk = 25;
            def = 10;
            ultName = '⚡ System Overclock';
            ultDesc = 'High-voltage stage surge (42 DMG)';
            ultPower = 42;
        } else if (character) {
            maxHp = 120;
            atk = 24;
            def = 11;
            ultName = '🎭 Spotlight Finale';
            ultDesc = 'Dramatic center-stage finisher (39 DMG)';
            ultPower = 39;
        }
        
        return {
            name: rawName,
            shortName,
            maxHp,
            hp: maxHp,
            atk,
            def,
            ultName,
            ultDesc,
            ultPower,
            ultUsed: false,
            shielded: false
        };
    }
    
    window.AFCS_BATTLE_ENGINE = {
        getFighterProfile
    };
}
function startCompareBattleUI() {
    function mountBattleArena(container, cardA, cardB) {
        const engine = window.AFCS_BATTLE_ENGINE;
        if (!engine) return;
        
        const p1 = engine.getFighterProfile(cardA);
        const p2 = engine.getFighterProfile(cardB);
        let turn = 1;
        let battleOver = false;
        
        function getAvatarHTML(card) {
            const imgSrc = card.querySelector('img').src;
            const monoEl = card.querySelector('.monogram-avatar');
            return monoEl
            ? `<div class="battle-avatar monogram-avatar">${monoEl.textContent}</div>`
            : `<img class="battle-avatar" src="${imgSrc}" alt="">`;
        }
        
        container.innerHTML = `
            <div class="battle-arena-wrap">
                <div class="battle-fighters-row">
                    <div class="battle-fighter-card" id="bFighter1">
                        ${getAvatarHTML(cardA)}
                        <div class="battle-fname">${p1.shortName}</div>
                        <div class="battle-hp-bar"><div class="battle-hp-fill" id="bHpFill1" style="width:100%"></div></div>
                        <div class="battle-hp-text" id="bHpText1">${p1.hp} / ${p1.maxHp} HP</div>
                    </div>
        
                    <div class="battle-mid-vs">
                        <span class="battle-turn-tag" id="bTurnTag">P1 TURN</span>
                        <span class="battle-vs-text">⚔️</span>
                    </div>
        
                    <div class="battle-fighter-card" id="bFighter2">
                        ${getAvatarHTML(cardB)}
                        <div class="battle-fname">${p2.shortName}</div>
                        <div class="battle-hp-bar"><div class="battle-hp-fill" id="bHpFill2" style="width:100%"></div></div>
                        <div class="battle-hp-text" id="bHpText2">${p2.hp} / ${p2.maxHp} HP</div>
                    </div>
                </div>
        
                <div class="battle-log-box" id="bLogBox">⚔️ ${p1.shortName} vs ${p2.shortName}! Choose ${p1.shortName}'s move!</div>
        
                <div class="battle-controls" id="bControls">
                    <button type="button" class="battle-move-btn" data-move="strike">👊 Basic Strike</button>
                    <button type="button" class="battle-move-btn" data-move="guard">🛡️ Guard & Heal (+14 HP)</button>
                    <button type="button" class="battle-move-btn is-ult" id="bUltBtn" data-move="ult">✨ ${p1.ultName}</button>
                </div>
            </div>
        `;
        
        const fill1 = container.querySelector('#bHpFill1');
        const fill2 = container.querySelector('#bHpFill2');
        const text1 = container.querySelector('#bHpText1');
        const text2 = container.querySelector('#bHpText2');
        const cardEl1 = container.querySelector('#bFighter1');
        const cardEl2 = container.querySelector('#bFighter2');
        const turnTag = container.querySelector('#bTurnTag');
        const logBox = container.querySelector('#bLogBox');
        const controls = container.querySelector('#bControls');
        const ultBtn = container.querySelector('#bUltBtn');
        
        function syncBattleUI() {
            const pct1 = Math.max(0, (p1.hp / p1.maxHp) * 100);
            const pct2 = Math.max(0, (p2.hp / p2.maxHp) * 100);
            fill1.style.width = `${pct1}%`;
            fill2.style.width = `${pct2}%`;
            fill1.classList.toggle('is-low', pct1 <= 30);
            fill2.classList.toggle('is-low', pct2 <= 30);
            text1.textContent = `${Math.max(0, p1.hp)} / ${p1.maxHp} HP`;
            text2.textContent = `${Math.max(0, p2.hp)} / ${p2.maxHp} HP`;
            
            if (!battleOver) {
                const active = turn === 1 ? p1 : p2;
                turnTag.textContent = turn === 1 ? 'P1 TURN' : 'P2 TURN';
                ultBtn.textContent = active.ultUsed ? '✨ Ultimate Used' : `✨ ${active.ultName}`;
                ultBtn.disabled = active.ultUsed;
            }
        }
        
        function finishMatch(winner, loser) {
            battleOver = true;
            turnTag.textContent = 'K.O.!';
            const prevCoins = Number(localStorage.getItem('afcs_coins') || '0');
            localStorage.setItem('afcs_coins', String(prevCoins + 40));
            
            logBox.innerHTML = `🏆 <strong>${winner.shortName}</strong> defeated ${loser.shortName}! (+40 🪙 AFCS Coins)`;
            controls.innerHTML = `<button type="button" class="battle-move-btn is-ult" id="bRematchBtn">↻ Rematch</button>`;
            
            const rect = container.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#38bdf8', '#f472b6', '#ffffff'], 42);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 75);
            });
            
            controls.querySelector('#bRematchBtn').addEventListener('click', () => {
                mountBattleArena(container, cardA, cardB);
            });
        }
        
        controls.querySelectorAll('.battle-move-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (battleOver) return;
                const move = btn.dataset.move;
                const attacker = turn === 1 ? p1 : p2;
                const defender = turn === 1 ? p2 : p1;
                const defenderCard = turn === 1 ? cardEl2 : cardEl1;
                
                if (move === 'strike') {
                    const variance = Math.floor(Math.random() * 7) - 2;
                    let dmg = Math.max(8, attacker.atk + variance - Math.floor(defender.def * 0.4));
                    if (defender.shielded) {
                        dmg = Math.max(4, Math.floor(dmg * 0.5));
                        defender.shielded = false;
                    }
                    defender.hp = Math.max(0, defender.hp - dmg);
                    logBox.textContent = `👊 ${attacker.shortName} landed a Basic Strike on ${defender.shortName} for ${dmg} DMG!`;
                    defenderCard.classList.remove('is-hit');
                    void defenderCard.offsetWidth;
                    defenderCard.classList.add('is-hit');
                    playBeep(440, 0.08, 'square', 0.045);
                } else if (move === 'guard') {
                    const heal = 14;
                    attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
                    attacker.shielded = true;
                    logBox.textContent = `🛡️ ${attacker.shortName} raised a Guard (+${heal} HP & 50% next damage reduction)!`;
                    playBeep(659.25, 0.1, 'sine', 0.04);
                } else if (move === 'ult' && !attacker.ultUsed) {
                    attacker.ultUsed = true;
                    let dmg = attacker.ultPower;
                    if (defender.shielded) {
                        dmg = Math.floor(dmg * 0.65);
                        defender.shielded = false;
                    }
                    if (attacker.ultName.includes('Adviser')) {
                        attacker.hp = Math.min(attacker.maxHp, attacker.hp + 20);
                    }
                    defender.hp = Math.max(0, defender.hp - dmg);
                    logBox.textContent = `✨ ${attacker.shortName} unleashed ${attacker.ultName} for ${dmg} MASSIVE DMG!`;
                    defenderCard.classList.remove('is-hit');
                    void defenderCard.offsetWidth;
                    defenderCard.classList.add('is-hit');
                    
                    const rect = defenderCard.getBoundingClientRect();
                    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#ef4444', '#ffffff'], 28);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    [587.33, 880, 1174.66].forEach((f, idx) => {
                        setTimeout(() => playBeep(f, 0.12, 'sawtooth', 0.05), idx * 55);
                    });
                }
                
                if (defender.hp <= 0) {
                    syncBattleUI();
                    finishMatch(attacker, defender);
                    return;
                }
                
                turn = turn === 1 ? 2 : 1;
                syncBattleUI();
            });
        });
        
        syncBattleUI();
    }
    
    window.initCompareBattleArena = mountBattleArena;
}
function startOnlineBattleNet() {
    let peer = null;
    let conn = null;
    let isHost = false;
    let roomCode = '';
    let handlers = {
        onStatus: () => {},
        onMatchStart: () => {},
        onRemoteMove: () => {},
        onRematch: () => {}
    };
    
    function ensurePeerLibrary(callback) {
        if (typeof window.Peer !== 'undefined') {
            callback();
            return;
        }
        const existing = document.getElementById('afcsPeerJsScript');
        if (existing) {
            existing.addEventListener('load', callback, { once: true });
            return;
        }
        const s = document.createElement('script');
        s.id = 'afcsPeerJsScript';
        s.src = 'https://unpkg.com';
        s.onload = () => callback();
        s.onerror = () => handlers.onStatus('Failed to load PeerJS. Check internet connection.');
        document.head.appendChild(s);
    }
    
    function cleanup() {
        if (conn) {
            try { conn.close(); } catch (_) {}
            conn = null;
        }
        if (peer) {
            try { peer.destroy(); } catch (_) {}
            peer = null;
        }
    }
    
    function bindConnection(connection, localFighter, hostFlag) {
        conn = connection;
        isHost = hostFlag;
        
        conn.on('open', () => {
            handlers.onStatus('Connected! Syncing fighters...');
            conn.send({ type: 'HELLO', fighter: localFighter });
        });
        
        conn.on('data', (msg) => {
            if (!msg || typeof msg !== 'object') return;
            if (msg.type === 'HELLO') {
                handlers.onMatchStart(localFighter, msg.fighter, isHost);
            } else if (msg.type === 'MOVE') {
                if (window.AFCS_ONLINE_NET_HOOK && typeof window.AFCS_ONLINE_NET_HOOK.onRemoteMove === 'function') {
                    window.AFCS_ONLINE_NET_HOOK.onRemoteMove(msg.move, msg.roll);
                }
            } else if (msg.type === 'REMATCH') {
                if (window.AFCS_ONLINE_NET_HOOK && typeof window.AFCS_ONLINE_NET_HOOK.onRematch === 'function') {
                    window.AFCS_ONLINE_NET_HOOK.onRematch();
                }
            }
        });
        
        conn.on('close', () => {
            handlers.onStatus('Opponent disconnected.');
        });
        
        conn.on('error', () => {
            handlers.onStatus('Connection error. Try again.');
        });
    }
    
    function hostRoom(localFighter, customHandlers) {
        cleanup();
        handlers = { ...handlers, ...customHandlers };
        handlers.onStatus('Loading PeerJS & creating room...');
        
        ensurePeerLibrary(() => {
            const pin = String(1000 + Math.floor(Math.random() * 9000));
            roomCode = `AFCS-${pin}`;
            const fullId = `btm-psalms-2026-${pin}`;
            
            peer = new window.Peer(fullId);
            
            peer.on('open', () => {
                handlers.onStatus(`Room Ready! Share code: ${roomCode}`, roomCode);
            });
            
            peer.on('connection', (incoming) => {
                bindConnection(incoming, localFighter, true);
            });
            
            peer.on('error', () => {
                handlers.onStatus('Room creation failed. Retry.');
            });
        });
    }
    
    function joinRoom(rawCode, localFighter, customHandlers) {
        cleanup();
        handlers = { ...handlers, ...customHandlers };
        
        const digits = String(rawCode || '').replace(/\D/g, '').slice(-4);
        if (digits.length !== 4) {
            handlers.onStatus('Enter a valid 4-digit code (e.g. AFCS-1234).');
            return;
        }
        
        handlers.onStatus(`Connecting to AFCS-${digits}...`);
        
        ensurePeerLibrary(() => {
            const targetId = `btm-psalms-2026-${digits}`;
            peer = new window.Peer();
            
            peer.on('open', () => {
                const outgoing = peer.connect(targetId, { reliable: true });
                bindConnection(outgoing, localFighter, false);
            });
            
            peer.on('error', () => {
                handlers.onStatus('Room not found. Check the code!');
            });
        });
    }
    
    function sendMove(move, roll) {
        if (conn && conn.open) {
            conn.send({ type: 'MOVE', move, roll });
        }
    }
    
    function sendRematch() {
        if (conn && conn.open) {
            conn.send({ type: 'REMATCH' });
        }
    }
    
    window.AFCS_ONLINE_NET = {
        hostRoom,
        joinRoom,
        sendMove,
        sendRematch,
        cleanup
    };
}
function startOnlineBattleUI() {
    function serializeCardFighter(card) {
        const engine = window.AFCS_BATTLE_ENGINE;
        const base = engine ? engine.getFighterProfile(card) : {
            name: card.querySelector('.overlay-text').textContent.trim(),
            shortName: card.querySelector('.overlay-text').textContent.trim(),
            maxHp: 110,
            hp: 110,
            atk: 20,
            def: 10,
            ultName: 'Cornerstone Strike',
            ultPower: 34,
            ultUsed: false,
            shielded: false
        };
        const imgEl = card.querySelector('img');
        const imgSrc = imgEl ? imgEl.getAttribute('src') : 'mainPics/AFCS.jpg';
        return { ...base, imgSrc };
    }
    
    function openOnlineLobby(container, myCard) {
        const net = window.AFCS_ONLINE_NET;
        if (!net) return;
        
        const myFighter = serializeCardFighter(myCard);
        
        container.innerHTML = `
            <div class="online-lobby-wrap">
                <div class="online-lobby-header">🌐 ONLINE 1v1 MULTIPLAYER</div>
                <div class="online-selected-fighter">
                    <img src="${myFighter.imgSrc}" alt="${myFighter.shortName}" onerror="this.src='mainPics/AFCS.jpg'">
                    <div>
                        <div class="online-f-label">YOUR CHOSEN FIGHTER</div>
                        <div class="online-f-name">${myFighter.name}</div>
                        <div class="online-f-ult">✨ ${myFighter.ultName} (${myFighter.ultPower} DMG)</div>
                    </div>
                </div>
        
                <div class="online-lobby-cols">
                    <div class="online-box">
                        <h4>Host a Match</h4>
                        <button type="button" class="battle-move-btn is-ult" id="onlineHostBtn">📡 Create Room Code</button>
                        <div class="online-code-display" id="onlineCodeBox">----</div>
                    </div>
        
                    <div class="online-box">
                        <h4>Join a Match</h4>
                        <input type="text" class="online-code-input" id="onlineJoinInput" placeholder="AFCS-1234" maxlength="9">
                        <button type="button" class="battle-move-btn" id="onlineJoinBtn">⚡ Join Room</button>
                    </div>
                </div>
        
                <div class="online-status-bar" id="onlineStatusBar">Pick Host or enter your friend's Room Code!</div>
            </div>
        `;
        
        const hostBtn = container.querySelector('#onlineHostBtn');
        const codeBox = container.querySelector('#onlineCodeBox');
        const joinInput = container.querySelector('#onlineJoinInput');
        const joinBtn = container.querySelector('#onlineJoinBtn');
        const statusBar = container.querySelector('#onlineStatusBar');
        
        const callbacks = {
            onStatus: (text, code) => {
                statusBar.textContent = text;
                if (code) {
                    codeBox.textContent = code;
                    codeBox.classList.add('is-ready');
                }
            },
            onMatchStart: (localF, remoteF, amHost) => {
                launchOnlineArena(container, localF, remoteF, amHost);
            }
        };
        
        hostBtn.addEventListener('click', () => {
            hostBtn.disabled = true;
            net.hostRoom(myFighter, callbacks);
            playBeep(659.25, 0.08, 'triangle', 0.045);
        });
        
        joinBtn.addEventListener('click', () => {
            net.joinRoom(joinInput.value, myFighter, callbacks);
            playBeep(587.33, 0.08, 'triangle', 0.045);
        });
    }
    
    function launchOnlineArena(container, localInit, remoteInit, amHost) {
        const net = window.AFCS_ONLINE_NET;
        const me = { ...localInit, hp: localInit.maxHp, ultUsed: false, shielded: false };
        const opp = { ...remoteInit, hp: remoteInit.maxHp, ultUsed: false, shielded: false };
        let myTurn = amHost;
        let battleOver = false;
        
        container.innerHTML = `
            <div class="battle-arena-wrap">
                <div class="battle-fighters-row">
                    <div class="battle-fighter-card" id="onMeCard">
                        <img class="battle-avatar" src="${me.imgSrc}" alt="" onerror="this.src='mainPics/AFCS.jpg'">
                        <div class="battle-fname">${me.shortName} (YOU)</div>
                        <div class="battle-hp-bar"><div class="battle-hp-fill" id="onMeFill" style="width:100%"></div></div>
                        <div class="battle-hp-text" id="onMeText">${me.hp} / ${me.maxHp} HP</div>
                    </div>
        
                    <div class="battle-mid-vs">
                        <span class="battle-turn-tag" id="onTurnTag">${myTurn ? 'YOUR TURN' : 'OPPONENT TURN'}</span>
                        <span class="battle-vs-text">🌐</span>
                    </div>
        
                    <div class="battle-fighter-card" id="onOppCard">
                        <img class="battle-avatar" src="${opp.imgSrc}" alt="" onerror="this.src='mainPics/AFCS.jpg'">
                        <div class="battle-fname">${opp.shortName} (RIVAL)</div>
                        <div class="battle-hp-bar"><div class="battle-hp-fill" id="onOppFill" style="width:100%"></div></div>
                        <div class="battle-hp-text" id="onOppText">${opp.hp} / ${opp.maxHp} HP</div>
                    </div>
                </div>
        
                <div class="battle-log-box" id="onLogBox">${myTurn ? '⚡ Your move first!' : `⏳ Waiting for ${opp.shortName}...`}</div>
        
                <div class="battle-controls" id="onControls">
                    <button type="button" class="battle-move-btn" data-move="strike">👊 Basic Strike</button>
                    <button type="button" class="battle-move-btn" data-move="guard">🛡️ Guard & Heal (+14 HP)</button>
                    <button type="button" class="battle-move-btn is-ult" id="onUltBtn" data-move="ult">✨ ${me.ultName}</button>
                </div>
            </div>
        `;
        
        const meFill = container.querySelector('#onMeFill');
        const oppFill = container.querySelector('#onOppFill');
        const meText = container.querySelector('#onMeText');
        const oppText = container.querySelector('#onOppText');
        const meCardEl = container.querySelector('#onMeCard');
        const oppCardEl = container.querySelector('#onOppCard');
        const turnTag = container.querySelector('#onTurnTag');
        const logBox = container.querySelector('#onLogBox');
        const controls = container.querySelector('#onControls');
        const ultBtn = container.querySelector('#onUltBtn');
        
        function syncArena() {
            const pMe = Math.max(0, (me.hp / me.maxHp) * 100);
            const pOpp = Math.max(0, (opp.hp / opp.maxHp) * 100);
            meFill.style.width = `${pMe}%`;
            oppFill.style.width = `${pOpp}%`;
            meFill.classList.toggle('is-low', pMe <= 30);
            oppFill.classList.toggle('is-low', pOpp <= 30);
            meText.textContent = `${Math.max(0, me.hp)} / ${me.maxHp} HP`;
            oppText.textContent = `${Math.max(0, opp.hp)} / ${opp.maxHp} HP`;
            
            if (!battleOver) {
                turnTag.textContent = myTurn ? 'YOUR TURN' : 'RIVAL TURN';
                controls.querySelectorAll('.battle-move-btn').forEach(b => {
                    if (b.id === 'onUltBtn') b.disabled = !myTurn || me.ultUsed;
                    else b.disabled = !myTurn;
                });
                ultBtn.textContent = me.ultUsed ? '✨ Ultimate Used' : `✨ ${me.ultName}`;
            }
        }
        
        function endOnlineMatch(iWon) {
            battleOver = true;
            turnTag.textContent = iWon ? 'VICTORY!' : 'DEFEAT';
            
            if (iWon) {
                const prevCoins = Number(localStorage.getItem('afcs_coins') || '0');
                localStorage.setItem('afcs_coins', String(prevCoins + 75));
                logBox.innerHTML = `🏆 <strong>${me.shortName}</strong> won the Online Match! (+75 🪙 AFCS Coins)`;
                const rect = container.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#38bdf8', '#ffffff'], 46);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                    setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 75);
                });
            } else {
                logBox.innerHTML = `💀 <strong>${opp.shortName}</strong> won the Online Match!`;
                playBeep(190, 0.25, 'sawtooth', 0.05);
            }
            
            controls.innerHTML = `<button type="button" class="battle-move-btn is-ult" id="onRematchBtn">↻ Online Rematch</button>`;
            controls.querySelector('#onRematchBtn').addEventListener('click', () => {
                net.sendRematch();
                launchOnlineArena(container, localInit, remoteInit, amHost);
            });
        }
        
        function applyTurn(isLocalAction, move, roll) {
            if (battleOver) return;
            const attacker = isLocalAction ? me : opp;
            const defender = isLocalAction ? opp : me;
            const defenderCard = isLocalAction ? oppCardEl : meCardEl;
            
            if (move === 'strike') {
                let dmg = Math.max(8, attacker.atk + roll - Math.floor(defender.def * 0.4));
                if (defender.shielded) {
                    dmg = Math.max(4, Math.floor(dmg * 0.5));
                    defender.shielded = false;
                }
                defender.hp = Math.max(0, defender.hp - dmg);
                logBox.textContent = `👊 ${attacker.shortName} struck ${defender.shortName} for ${dmg} DMG!`;
                defenderCard.classList.remove('is-hit');
                void defenderCard.offsetWidth;
                defenderCard.classList.add('is-hit');
                playBeep(440, 0.08, 'square', 0.045);
            } else if (move === 'guard') {
                attacker.hp = Math.min(attacker.maxHp, attacker.hp + 14);
                attacker.shielded = true;
                logBox.textContent = `🛡️ ${attacker.shortName} guarded (+14 HP & 50% next damage reduction)!`;
                playBeep(659.25, 0.1, 'sine', 0.04);
            } else if (move === 'ult' && !attacker.ultUsed) {
                attacker.ultUsed = true;
                let dmg = attacker.ultPower;
                if (defender.shielded) {
                    dmg = Math.floor(dmg * 0.65);
                    defender.shielded = false;
                }
                if (attacker.ultName.includes('Adviser')) {
                    attacker.hp = Math.min(attacker.maxHp, attacker.hp + 20);
                }
                defender.hp = Math.max(0, defender.hp - dmg);
                logBox.textContent = `✨ ${attacker.shortName} unleashed ${attacker.ultName} for ${dmg} DMG!`;
                defenderCard.classList.remove('is-hit');
                void defenderCard.offsetWidth;
                defenderCard.classList.add('is-hit');
                const rect = defenderCard.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#ef4444', '#ffffff'], 28);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                [587.33, 880, 1174.66].forEach((f, idx) => {
                    setTimeout(() => playBeep(f, 0.12, 'sawtooth', 0.05), idx * 55);
                });
            }
            if (defender.hp <= 0) {
                syncArena();
                endOnlineMatch(isLocalAction);
                return;
            }
            myTurn = !isLocalAction;
            syncArena();
        }
        net.hostRoom && (window.AFCS_ONLINE_NET_HOOK = {
            onRemoteMove: (move, roll) => applyTurn(false, move, roll),
            onRematch: () => launchOnlineArena(container, localInit, remoteInit, amHost)
        });
        controls.querySelectorAll('.battle-move-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!myTurn || battleOver) return;
                const move = btn.dataset.move;
                const roll = Math.floor(Math.random() * 7) - 2;
                net.sendMove(move, roll);
                applyTurn(true, move, roll);
            });
        });
        syncArena();
    }
    window.openOnlineBattleLobby = openOnlineLobby;
}
function startPjskData() {
    const PJSK_SONGS = [
        {
            id: 'cornerstone_overdrive',
            title: 'Cornerstone Overdrive (Psalms Mix)',
            difficulty: 'EXPERT • LV. 27',
            bpm: 136,
            durationSec: 26,
            notes: [
                { t: 1.0, lane: 0, type: 'tap', f: 523.25 },
                { t: 1.4, lane: 1, type: 'tap', f: 587.33 },
                { t: 1.8, lane: 2, type: 'tap', f: 659.25 },
                { t: 2.2, lane: 3, type: 'flick', f: 880.00 },
                { t: 2.8, lane: 1, type: 'tap', f: 659.25 },
                { t: 3.1, lane: 2, type: 'tap', f: 587.33 },
                { t: 3.4, lane: 0, type: 'tap', f: 523.25 },
                { t: 3.7, lane: 3, type: 'tap', f: 659.25 },
                { t: 4.2, lane: 0, type: 'flick', f: 1046.50 },
                { t: 4.2, lane: 3, type: 'flick', f: 1046.50 },
                { t: 4.9, lane: 1, type: 'tap', f: 587.33 },
                { t: 5.2, lane: 2, type: 'tap', f: 659.25 },
                { t: 5.5, lane: 1, type: 'tap', f: 783.99 },
                { t: 5.8, lane: 2, type: 'flick', f: 987.77 },
                { t: 6.3, lane: 0, type: 'tap', f: 659.25 },
                { t: 6.6, lane: 1, type: 'tap', f: 587.33 },
                { t: 6.9, lane: 2, type: 'tap', f: 523.25 },
                { t: 7.2, lane: 3, type: 'gold', f: 783.99 },
                { t: 7.8, lane: 2, type: 'tap', f: 880.00 },
                { t: 8.1, lane: 1, type: 'tap', f: 783.99 },
                { t: 8.4, lane: 0, type: 'tap', f: 659.25 },
                { t: 8.7, lane: 3, type: 'flick', f: 880.00 },
                { t: 9.2, lane: 1, type: 'flick', f: 1174.66 },
                { t: 9.2, lane: 2, type: 'flick', f: 1174.66 },
                { t: 9.9, lane: 0, type: 'tap', f: 523.25 },
                { t: 10.15, lane: 1, type: 'tap', f: 587.33 },
                { t: 10.4, lane: 2, type: 'tap', f: 659.25 },
                { t: 10.65, lane: 3, type: 'tap', f: 783.99 },
                { t: 11.1, lane: 3, type: 'tap', f: 880.00 },
                { t: 11.35, lane: 2, type: 'tap', f: 783.99 },
                { t: 11.6, lane: 1, type: 'tap', f: 659.25 },
                { t: 11.85, lane: 0, type: 'flick', f: 1046.50 },
                { t: 12.5, lane: 0, type: 'tap', f: 523.25 },
                { t: 12.5, lane: 2, type: 'tap', f: 659.25 },
                { t: 13.0, lane: 1, type: 'tap', f: 587.33 },
                { t: 13.0, lane: 3, type: 'tap', f: 783.99 },
                { t: 13.5, lane: 0, type: 'flick', f: 1174.66 },
                { t: 13.5, lane: 3, type: 'flick', f: 1174.66 },
                { t: 14.2, lane: 1, type: 'tap', f: 659.25 },
                { t: 14.45, lane: 2, type: 'tap', f: 783.99 },
                { t: 14.7, lane: 1, type: 'tap', f: 880.00 },
                { t: 14.95, lane: 2, type: 'gold', f: 1046.50 },
                { t: 15.5, lane: 0, type: 'tap', f: 783.99 },
                { t: 15.8, lane: 3, type: 'tap', f: 880.00 },
                { t: 16.1, lane: 1, type: 'tap', f: 783.99 },
                { t: 16.4, lane: 2, type: 'flick', f: 1174.66 },
                { t: 17.0, lane: 3, type: 'tap', f: 659.25 },
                { t: 17.25, lane: 2, type: 'tap', f: 587.33 },
                { t: 17.5, lane: 1, type: 'tap', f: 523.25 },
                { t: 17.75, lane: 0, type: 'tap', f: 659.25 },
                { t: 18.2, lane: 1, type: 'gold', f: 880.00 },
                { t: 18.2, lane: 2, type: 'gold', f: 880.00 },
                { t: 18.8, lane: 0, type: 'tap', f: 523.25 },
                { t: 19.05, lane: 3, type: 'tap', f: 783.99 },
                { t: 19.3, lane: 1, type: 'tap', f: 659.25 },
                { t: 19.55, lane: 2, type: 'tap', f: 880.00 },
                { t: 20.0, lane: 0, type: 'flick', f: 1174.66 },
                { t: 20.0, lane: 1, type: 'flick', f: 1174.66 },
                { t: 20.5, lane: 2, type: 'flick', f: 1174.66 },
                { t: 20.5, lane: 3, type: 'flick', f: 1174.66 },
                { t: 21.1, lane: 0, type: 'tap', f: 523.25 },
                { t: 21.3, lane: 1, type: 'tap', f: 587.33 },
                { t: 21.5, lane: 2, type: 'tap', f: 659.25 },
                { t: 21.7, lane: 3, type: 'tap', f: 783.99 },
                { t: 21.9, lane: 2, type: 'tap', f: 880.00 },
                { t: 22.1, lane: 1, type: 'tap', f: 1046.50 },
                { t: 22.5, lane: 0, type: 'flick', f: 1318.51 },
                { t: 22.5, lane: 3, type: 'flick', f: 1318.51 },
                { t: 23.2, lane: 1, type: 'gold', f: 1046.50 },
                { t: 23.2, lane: 2, type: 'gold', f: 1046.50 },
                { t: 24.0, lane: 0, type: 'flick', f: 1396.91 },
                { t: 24.0, lane: 1, type: 'flick', f: 1396.91 },
                { t: 24.0, lane: 2, type: 'flick', f: 1396.91 },
                { t: 24.0, lane: 3, type: 'flick', f: 1396.91 }
            ]
        },
        {
            id: 'wonderhoi_parade',
            title: 'WONDERHOI☆Stage Rush!',
            difficulty: 'MASTER • LV. 30',
            bpm: 152,
            durationSec: 24,
            notes: [
                { t: 0.9, lane: 0, type: 'flick', f: 880.00 },
                { t: 1.15, lane: 3, type: 'flick', f: 1046.50 },
                { t: 1.4, lane: 1, type: 'tap', f: 659.25 },
                { t: 1.65, lane: 2, type: 'tap', f: 783.99 },
                { t: 1.9, lane: 0, type: 'tap', f: 880.00 },
                { t: 2.15, lane: 3, type: 'tap', f: 1046.50 },
                { t: 2.5, lane: 1, type: 'flick', f: 1174.66 },
                { t: 2.5, lane: 2, type: 'flick', f: 1174.66 },
                { t: 3.1, lane: 0, type: 'tap', f: 523.25 },
                { t: 3.3, lane: 1, type: 'tap', f: 587.33 },
                { t: 3.5, lane: 2, type: 'tap', f: 659.25 },
                { t: 3.7, lane: 3, type: 'tap', f: 783.99 },
                { t: 3.9, lane: 2, type: 'tap', f: 659.25 },
                { t: 4.1, lane: 1, type: 'tap', f: 587.33 },
                { t: 4.3, lane: 0, type: 'flick', f: 1046.50 },
                { t: 4.8, lane: 0, type: 'tap', f: 659.25 },
                { t: 4.8, lane: 2, type: 'tap', f: 880.00 },
                { t: 5.2, lane: 1, type: 'tap', f: 783.99 },
                { t: 5.2, lane: 3, type: 'tap', f: 1046.50 },
                { t: 5.6, lane: 0, type: 'tap', f: 659.25 },
                { t: 5.6, lane: 2, type: 'tap', f: 880.00 },
                { t: 6.0, lane: 1, type: 'flick', f: 1174.66 },
                { t: 6.0, lane: 3, type: 'flick', f: 1174.66 },
                { t: 6.6, lane: 3, type: 'tap', f: 1046.50 },
                { t: 6.8, lane: 2, type: 'tap', f: 880.00 },
                { t: 7.0, lane: 1, type: 'tap', f: 783.99 },
                { t: 7.2, lane: 0, type: 'tap', f: 659.25 },
                { t: 7.4, lane: 1, type: 'tap', f: 783.99 },
                { t: 7.6, lane: 2, type: 'tap', f: 880.00 },
                { t: 7.8, lane: 3, type: 'flick', f: 1318.51 },
                { t: 8.4, lane: 0, type: 'gold', f: 783.99 },
                { t: 8.7, lane: 1, type: 'gold', f: 880.00 },
                { t: 9.0, lane: 2, type: 'gold', f: 1046.50 },
                { t: 9.3, lane: 3, type: 'flick', f: 1174.66 },
                { t: 9.8, lane: 0, type: 'tap', f: 523.25 },
                { t: 10.0, lane: 2, type: 'tap', f: 659.25 },
                { t: 10.2, lane: 1, type: 'tap', f: 587.33 },
                { t: 10.4, lane: 3, type: 'tap', f: 783.99 },
                { t: 10.6, lane: 0, type: 'tap', f: 659.25 },
                { t: 10.8, lane: 2, type: 'tap', f: 880.00 },
                { t: 11.1, lane: 1, type: 'flick', f: 1174.66 },
                { t: 11.1, lane: 3, type: 'flick', f: 1174.66 },
                { t: 11.7, lane: 0, type: 'tap', f: 783.99 },
                { t: 11.7, lane: 1, type: 'tap', f: 783.99 },
                { t: 12.1, lane: 2, type: 'tap', f: 880.00 },
                { t: 12.1, lane: 3, type: 'tap', f: 880.00 },
                { t: 12.5, lane: 0, type: 'tap', f: 1046.50 },
                { t: 12.5, lane: 3, type: 'tap', f: 1046.50 },
                { t: 12.9, lane: 1, type: 'flick', f: 1318.51 },
                { t: 12.9, lane: 2, type: 'flick', f: 1318.51 },
                { t: 13.6, lane: 0, type: 'tap', f: 523.25 },
                { t: 13.78, lane: 1, type: 'tap', f: 587.33 },
                { t: 13.96, lane: 2, type: 'tap', f: 659.25 },
                { t: 14.14, lane: 3, type: 'tap', f: 783.99 },
                { t: 14.32, lane: 2, type: 'tap', f: 880.00 },
                { t: 14.5, lane: 1, type: 'tap', f: 1046.50 },
                { t: 14.68, lane: 0, type: 'flick', f: 1174.66 },
                { t: 15.3, lane: 1, type: 'tap', f: 659.25 },
                { t: 15.55, lane: 2, type: 'tap', f: 783.99 },
                { t: 15.8, lane: 0, type: 'tap', f: 880.00 },
                { t: 16.05, lane: 3, type: 'tap', f: 1046.50 },
                { t: 16.4, lane: 0, type: 'flick', f: 1174.66 },
                { t: 16.4, lane: 2, type: 'flick', f: 1174.66 },
                { t: 16.8, lane: 1, type: 'flick', f: 1318.51 },
                { t: 16.8, lane: 3, type: 'flick', f: 1318.51 },
                { t: 17.5, lane: 0, type: 'tap', f: 523.25 },
                { t: 17.7, lane: 1, type: 'tap', f: 659.25 },
                { t: 17.9, lane: 2, type: 'tap', f: 783.99 },
                { t: 18.1, lane: 3, type: 'tap', f: 1046.50 },
                { t: 18.5, lane: 0, type: 'tap', f: 1046.50 },
                { t: 18.7, lane: 1, type: 'tap', f: 783.99 },
                { t: 18.9, lane: 2, type: 'tap', f: 659.25 },
                { t: 19.1, lane: 3, type: 'tap', f: 523.25 },
                { t: 19.6, lane: 0, type: 'flick', f: 1046.50 },
                { t: 19.6, lane: 1, type: 'flick', f: 1046.50 },
                { t: 20.0, lane: 2, type: 'flick', f: 1174.66 },
                { t: 20.0, lane: 3, type: 'flick', f: 1174.66 },
                { t: 20.5, lane: 0, type: 'tap', f: 783.99 },
                { t: 20.68, lane: 1, type: 'tap', f: 880.00 },
                { t: 20.86, lane: 2, type: 'tap', f: 1046.50 },
                { t: 21.04, lane: 3, type: 'tap', f: 1174.66 },
                { t: 21.4, lane: 0, type: 'flick', f: 1396.91 },
                { t: 21.4, lane: 1, type: 'flick', f: 1396.91 },
                { t: 21.4, lane: 2, type: 'flick', f: 1396.91 },
                { t: 21.4, lane: 3, type: 'flick', f: 1396.91 }
            ]
        }
    ];
    window.AFCS_PJSK_DATA = {
        songs: PJSK_SONGS
    };
}
function startPjskUI() {
    const pjskData = window.AFCS_PJSK_DATA;
    if (!pjskData) return;
    
    let selectedIdx = 0;
    let playing = false;
    let tasEnabled = false;
    let rafId = null;
    let startTime = 0;
    let activeNotes = [];
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let counts = { perfect: 0, great: 0, good: 0, miss: 0 };
    
    const modal = document.createElement('div');
    modal.className = 'pjsk-modal-overlay';
    modal.innerHTML = `
        <div class="pjsk-stage-card">
            <div class="pjsk-topbar">
                <div>
                    <span class="pjsk-tag">🎵 COLORFUL STAGE // 3D LIVE</span>
                    <div class="pjsk-song-select-row">
                        <button type="button" class="pjsk-song-nav" id="pjskPrevSong">◀</button>
                        <div class="pjsk-song-meta">
                            <div class="pjsk-song-title" id="pjskSongTitle"></div>
                            <div class="pjsk-song-diff" id="pjskSongDiff"></div>
                        </div>
                        <button type="button" class="pjsk-song-nav" id="pjskNextSong">▶</button>
                    </div>
                </div>
                <div class="pjsk-top-actions">
                    <button type="button" class="pjsk-tas-btn" id="pjskTasBtn" title="Toggle Tool-Assisted Auto-Play">🤖 TAS: OFF</button>
                    <button type="button" class="pjsk-close-btn" id="pjskCloseBtn">&times;</button>
                </div>
            </div>
    
            <div class="pjsk-score-strip">
                <div>SCORE: <strong id="pjskScore">000000</strong></div>
                <div>COMBO: <strong id="pjskMaxCombo">0</strong></div>
                <div>BEST: <strong id="pjskBest">0</strong></div>
            </div>
    
            <div class="pjsk-3d-viewport" id="pjskViewport">
                <div class="pjsk-combo-display" id="pjskComboBox">
                    <div class="pjsk-combo-num" id="pjskComboNum">0</div>
                    <div class="pjsk-combo-lbl">COMBO</div>
                </div>
                <div class="pjsk-judge-pop" id="pjskJudgePop"></div>
    
                <div class="pjsk-3d-highway" id="pjskHighway">
                    <div class="pjsk-lanes-grid" id="pjskLanes">
                        <div class="pjsk-lane" data-lane="0"><div class="pjsk-lane-beam"></div></div>
                        <div class="pjsk-lane" data-lane="1"><div class="pjsk-lane-beam"></div></div>
                        <div class="pjsk-lane" data-lane="2"><div class="pjsk-lane-beam"></div></div>
                        <div class="pjsk-lane" data-lane="3"><div class="pjsk-lane-beam"></div></div>
                    </div>
                    <div class="pjsk-hit-line"></div>
                </div>
    
                <div class="pjsk-pads-row">
                    <button type="button" class="pjsk-pad" data-lane="0"><span class="pad-flick-key">▲ E</span><span class="pad-tap-key">D</span></button>
                    <button type="button" class="pjsk-pad" data-lane="1"><span class="pad-flick-key">▲ R</span><span class="pad-tap-key">F</span></button>
                    <button type="button" class="pjsk-pad" data-lane="2"><span class="pad-flick-key">▲ I</span><span class="pad-tap-key">J</span></button>
                    <button type="button" class="pjsk-pad" data-lane="3"><span class="pad-flick-key">▲ O</span><span class="pad-tap-key">K</span></button>
                </div>
            </div>
    
            <div class="pjsk-result-banner" id="pjskResultBanner"></div>
    
            <div class="pjsk-footer">
                <button type="button" class="pjsk-start-btn" id="pjskStartBtn">▶ START 3D LIVE SHOW</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const titleEl = modal.querySelector('#pjskSongTitle');
    const diffEl = modal.querySelector('#pjskSongDiff');
    const scoreEl = modal.querySelector('#pjskScore');
    const maxComboEl = modal.querySelector('#pjskMaxCombo');
    const bestEl = modal.querySelector('#pjskBest');
    const tasBtn = modal.querySelector('#pjskTasBtn');
    const highwayEl = modal.querySelector('#pjskHighway');
    const comboBox = modal.querySelector('#pjskComboBox');
    const comboNum = modal.querySelector('#pjskComboNum');
    const judgePop = modal.querySelector('#pjskJudgePop');
    const laneEls = Array.from(modal.querySelectorAll('.pjsk-lane'));
    const padEls = Array.from(modal.querySelectorAll('.pjsk-pad'));
    const resultBanner = modal.querySelector('#pjskResultBanner');
    const startBtn = modal.querySelector('#pjskStartBtn');
    const closeBtn = modal.querySelector('#pjskCloseBtn');
    
    function syncSongMeta() {
        const song = pjskData.songs.at(selectedIdx);
        titleEl.textContent = song.title;
        diffEl.textContent = song.difficulty;
        const best = Number(localStorage.getItem(`afcs_pjsk_best_${song.id}`) || '0');
        bestEl.textContent = String(best);
    }
    
    function showJudgment(label, cls) {
        judgePop.textContent = label;
        judgePop.className = `pjsk-judge-pop is-pop ${cls}`;
        clearTimeout(judgePop._t);
        judgePop._t = setTimeout(() => {
            judgePop.classList.remove('is-pop');
        }, 380);
    }
    
    function syncScoreHud() {
        scoreEl.textContent = String(score).padStart(6, '0');
        maxComboEl.textContent = String(maxCombo);
        comboNum.textContent = String(combo);
        comboBox.classList.toggle('is-active', combo >= 2);
    }
    
    function clearNotesDOM() {
        highwayEl.querySelectorAll('.pjsk-note').forEach(el => el.remove());
        activeNotes = [];
    }
    
    function finishLiveShow() {
        playing = false;
        cancelAnimationFrame(rafId);
        clearNotesDOM();
        startBtn.disabled = false;
        startBtn.textContent = '↻ PLAY AGAIN';
        
        const song = pjskData.songs.at(selectedIdx);
        if (!tasEnabled) {
            const prevBest = Number(localStorage.getItem(`afcs_pjsk_best_${song.id}`) || '0');
            if (score > prevBest) {
                localStorage.setItem(`afcs_pjsk_best_${song.id}`, String(score));
            }
        }
        syncSongMeta();
        
        const isAP = counts.miss === 0 && counts.good === 0 && counts.great === 0 && counts.perfect > 0;
        const isFC = counts.miss === 0 && (counts.perfect + counts.great + counts.good) > 0;
        const badgeText = tasEnabled
        ? '🤖 TAS DEMO COMPLETE (0 🪙)'
        : isAP
        ? '🌈 ALL PERFECT!!'
        : isFC
        ? '💎 FULL COMBO!'
        : '✨ SHOW CLEAR!';
        
        let coinTag = '';
        if (!tasEnabled) {
            const coinsEarned = Math.max(15, Math.round(score / 450) + (isAP ? 50 : isFC ? 30 : 0));
            const prevCoins = Number(localStorage.getItem('afcs_coins') || '0');
            localStorage.setItem('afcs_coins', String(prevCoins + coinsEarned));
            coinTag = ` (+${coinsEarned} 🪙 AFCS Coins)`;
        }
        
        resultBanner.innerHTML = `
            <div class="pjsk-res-badge">${badgeText}${coinTag}</div>
            <div class="pjsk-res-breakdown">
                <span style="color:#f0abfc;">PERFECT: ${counts.perfect}</span> •
                <span style="color:#f472b6;">GREAT: ${counts.great}</span> •
                <span style="color:#38bdf8;">GOOD: ${counts.good}</span> •
                <span style="color:#94a3b8;">MISS: ${counts.miss}</span>
            </div>
        `;
        resultBanner.classList.add('is-visible');
        
        const rect = highwayEl.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#38bdf8', '#f472b6', '#facc15', '#ffffff'], isFC ? 52 : 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, idx) => {
            setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 70);
        });
    }
    
    function triggerLaneHit(laneIdx, isFlickInput = false, forcePerfect = false) {
        const laneEl = laneEls.at(laneIdx);
        const padEl = padEls.at(laneIdx);
        if (laneEl) {
            laneEl.classList.add('is-lit');
            setTimeout(() => laneEl.classList.remove('is-lit'), 120);
        }
        if (padEl) {
            padEl.classList.add(isFlickInput ? 'is-flicked' : 'is-pressed');
            setTimeout(() => padEl.classList.remove('is-pressed', 'is-flicked'), 130);
        }
        
        if (!playing) {
            const baseNotes = Array.of(523.25, 587.33, 659.25, 783.99);
            playBeep(baseNotes.at(laneIdx) * (isFlickInput ? 1.5 : 1), 0.08, isFlickInput ? 'sawtooth' : 'triangle', 0.04);
            return;
        }
        
        const elapsed = (performance.now() - startTime) / 1000;
        const candidates = activeNotes.filter(n => !n.hit && n.lane === laneIdx && Math.abs(n.t - elapsed) <= 0.24);
        if (!candidates.length) return;
        
        candidates.sort((a, b) => Math.abs(a.t - elapsed) - Math.abs(b.t - elapsed));
        const target = candidates.at(0);
        const diff = forcePerfect ? 0 : Math.abs(target.t - elapsed);
        
        if (target.type === 'flick' && !isFlickInput && !forcePerfect) {
            target.hit = true;
            if (target.el) target.el.remove();
            counts.good++;
            combo++;
            if (combo > maxCombo) maxCombo = combo;
            score += 450;
            showJudgment('TAP (FLICK ▲!)', 'is-good');
            playBeep(target.f * 0.85, 0.08, 'sine', 0.035);
            syncScoreHud();
            return;
        }
        
        target.hit = true;
        if (target.el) target.el.remove();
        
        const mult = (target.type === 'gold' || target.type === 'flick') ? 2 : 1;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        if (diff <= 0.08) {
            counts.perfect++;
            score += 1000 * mult + combo * 15;
            const label = target.type === 'flick' ? 'FLICK PERFECT! ▲' : target.type === 'gold' ? 'CRITICAL PERFECT!' : 'PERFECT!';
            showJudgment(label, 'is-perfect');
            playBeep(target.f, 0.11, target.type === 'flick' ? 'sawtooth' : 'triangle', 0.055);
        } else if (diff <= 0.15) {
            counts.great++;
            score += 700 * mult + combo * 10;
            showJudgment(target.type === 'flick' ? 'FLICK GREAT! ▲' : 'GREAT!', 'is-great');
            playBeep(target.f, 0.1, 'sine', 0.045);
        } else {
            counts.good++;
            score += 400 * mult;
            showJudgment('GOOD', 'is-good');
            playBeep(target.f * 0.95, 0.08, 'sine', 0.035);
        }
        const padRect = padEl.getBoundingClientRect();
        const burstColors = target.type === 'flick'
        ? ['#f472b6', '#fda4af', '#ffffff']
        : target.type === 'gold'
        ? ['#facc15', '#fef08a', '#ffffff']
        : ['#38bdf8', '#bae6fd', '#ffffff'];
        spawnBurst(padRect.left + padRect.width / 2, padRect.top, burstColors, mult === 2 ? 18 : 10);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        syncScoreHud();
    }
    function startLiveShow() {
        cancelAnimationFrame(rafId);
        clearNotesDOM();
        resultBanner.classList.remove('is-visible');
        const song = pjskData.songs.at(selectedIdx);
        score = 0;
        combo = 0;
        maxCombo = 0;
        counts = { perfect: 0, great: 0, good: 0, miss: 0 };
        syncScoreHud();
        playing = true;
        startBtn.disabled = true;
        startBtn.textContent = tasEnabled ? '🤖 TAS AUTO-PLAYING...' : '🎵 3D LIVE IN PROGRESS...';
        activeNotes = song.notes.map(n => {
            const el = document.createElement('div');
            el.className = `pjsk-note is-${n.type}`;
            if (n.type === 'flick') el.textContent = '▲';
            el.style.left = `calc(${n.lane * 25}% + 6px)`;
            el.style.width = 'calc(25% - 12px)';
            el.style.display = 'none';
            highwayEl.appendChild(el);
            return { ...n, hit: false, el };
        });
        startTime = performance.now();
        const fallDuration = 0.44;
        
        function loop(now) {
            if (!playing) return;
            const elapsed = (now - startTime) / 1000;
            const hitLineY = highwayEl.clientHeight - 18;
            
            for (const n of activeNotes) {
                if (n.hit) continue;
                const timeUntilHit = n.t - elapsed;
                
                if (tasEnabled && timeUntilHit <= 0.012 && timeUntilHit >= -0.05) {
                    triggerLaneHit(n.lane, n.type === 'flick', true);
                    continue;
                }
                
                if (timeUntilHit < -0.22) {
                    n.hit = true;
                    if (n.el) n.el.remove();
                    counts.miss++;
                    combo = 0;
                    showJudgment('MISS', 'is-miss');
                    syncScoreHud();
                    continue;
                }
                
                if (timeUntilHit <= fallDuration) {
                    const linearProgress = 1 - (timeUntilHit / fallDuration);
                    const curvedProgress = Math.pow(linearProgress, 1.38);
                    const topPx = curvedProgress * hitLineY;
                    const scaleX = 0.45 + curvedProgress * 0.62;
                    const scaleY = 0.45 + curvedProgress * 0.65;
                    n.el.style.display = 'flex';
                    n.el.style.opacity = String(Math.min(1, 0.25 + linearProgress * 1.4));
                    n.el.style.transform = `translate3d(0, ${topPx.toFixed(1)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
                }
            }
            
            if (elapsed >= song.durationSec) {
                finishLiveShow();
                return;
            }
            
            rafId = requestAnimationFrame(loop);
        }
        rafId = requestAnimationFrame(loop);
    }
    padEls.forEach(pad => {
        let startY = 0;
        let fired = false;
        pad.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (tasEnabled && playing) return;
            startY = e.clientY;
            fired = false;
            pad.setPointerCapture(e.pointerId);
        });
        pad.addEventListener('pointermove', (e) => {
            if (fired || startY === 0) return;
            if (startY - e.clientY >= 18) {
                fired = true;
                startY = 0;
                triggerLaneHit(Number(pad.dataset.lane), true);
            }
        });
        pad.addEventListener('pointerup', () => {
            if (!fired && startY !== 0) {
                triggerLaneHit(Number(pad.dataset.lane), false);
            }
            startY = 0;
            fired = false;
        });
    });
    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active') || e.repeat) return;
        if (tasEnabled && playing) return;
        const k = e.key.toLowerCase();
        if (k === 'd') triggerLaneHit(0, false);
        else if (k === 'f') triggerLaneHit(1, false);
        else if (k === 'j') triggerLaneHit(2, false);
        else if (k === 'k') triggerLaneHit(3, false);
        else if (k === 'e') triggerLaneHit(0, true);
        else if (k === 'r') triggerLaneHit(1, true);
        else if (k === 'i') triggerLaneHit(2, true);
        else if (k === 'o') triggerLaneHit(3, true);
        
    });
    
    tasBtn.addEventListener('click', () => {
        tasEnabled = !tasEnabled;
        tasBtn.textContent = tasEnabled ? '🤖 TAS: ON' : '🤖 TAS: OFF';
        tasBtn.classList.toggle('is-active', tasEnabled);
        playBeep(tasEnabled ? 880 : 440, 0.08, 'square', 0.04);
    });
    modal.querySelector('#pjskPrevSong').addEventListener('click', () => {
        if (playing) return;
        selectedIdx = (selectedIdx - 1 + pjskData.songs.length) % pjskData.songs.length;
        syncSongMeta();
        playBeep(523.25, 0.06, 'triangle', 0.04);
    });
    modal.querySelector('#pjskNextSong').addEventListener('click', () => {
        if (playing) return;
        selectedIdx = (selectedIdx + 1) % pjskData.songs.length;
        syncSongMeta();
        playBeep(659.25, 0.06, 'triangle', 0.04);
    });
    function openPjskModal() {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('pjsk');
        resultBanner.classList.remove('is-visible');
        syncSongMeta();
        clearNotesDOM();
        score = 0;
        combo = 0;
        maxCombo = 0;
        syncScoreHud();
        startBtn.disabled = false;
        startBtn.textContent = '▶ START 3D LIVE SHOW';
        modal.classList.add('active');
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            setTimeout(() => playBeep(f, 0.1, 'triangle', 0.045), idx * 55);
        });
    }
    function closePjskModal() {
        playing = false;
        cancelAnimationFrame(rafId);
        clearNotesDOM();
        modal.classList.remove('active');
    }
    startBtn.addEventListener('click', startLiveShow);
    closeBtn.addEventListener('click', closePjskModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePjskModal();
    });
    window.openPjskLiveGame = openPjskModal;
    if (DOM.searchInput) {
        STATE.onSearchInput.push((val) => {
            if (val === 'pjsk' || val === 'sekai' || val === 'wonderhoi') {
                DOM.searchInput.value = '';
                filterCards();
                openPjskModal();
                return true;
            }
            return false;
        });
    }
}
function startSimonLightboardGame() {
    const PADS = [
        { id: 0, label: 'STAGE L', color: '#38bdf8', freq: 329.63 },
        { id: 1, label: 'CENTER', color: '#facc15', freq: 392.00 },
        { id: 2, label: 'STAGE R', color: '#f472b6', freq: 440.00 },
        { id: 3, label: 'SPOT 1', color: '#34d399', freq: 523.25 },
        { id: 4, label: 'SPOT 2', color: '#c084fc', freq: 587.33 },
        { id: 5, label: 'STROBE', color: '#ef4444', freq: 659.25 }
    ];
    
    let sequence = [];
    let playerStep = 0;
    let locked = true;
    let round = 0;
    
    const modal = document.createElement('div');
    modal.className = 'mini-arcade-overlay';
    modal.innerHTML = `
        <div class="mini-arcade-card">
            <div class="mini-arcade-head">
                <span>💡 TECH BOOTH // STAGE LIGHTBOARD</span>
                <button type="button" class="mini-arcade-x" id="simonCloseBtn">&times;</button>
            </div>
            <div class="mini-arcade-stats">
                <span>ROUND: <strong id="simonRound">0</strong></span>
                <span>BEST: <strong id="simonBest">0</strong></span>
            </div>
            <div class="mini-arcade-sub" id="simonStatus">Watch the stage cue sequence, then repeat it!</div>
            <div class="simon-pads-grid" id="simonGrid">
                ${PADS.map(p => `<button type="button" class="simon-pad-btn" data-id="${p.id}" style="--pad-clr:${p.color};">${p.label}</button>`).join('')}
            </div>
            <button type="button" class="simon-start-btn" id="simonStartBtn">▶ START LIGHT SEQUENCE</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    const roundEl = modal.querySelector('#simonRound');
    const bestEl = modal.querySelector('#simonBest');
    const statusEl = modal.querySelector('#simonStatus');
    const startBtn = modal.querySelector('#simonStartBtn');
    const padBtns = Array.from(modal.querySelectorAll('.simon-pad-btn'));
    
    function flashPad(id) {
        const pad = PADS.at(id);
        const btn = padBtns.at(id);
        if (!pad || !btn) return;
        btn.classList.add('is-lit');
        playBeep(pad.freq, 0.22, 'triangle', 0.055);
        setTimeout(() => btn.classList.remove('is-lit'), 260);
    }
    
    function playNextRound() {
        locked = true;
        playerStep = 0;
        round++;
        roundEl.textContent = String(round);
        sequence.push(Math.floor(Math.random() * PADS.length));
        statusEl.style.color = '#fde047';
        statusEl.textContent = `Watch carefully... (${sequence.length} cues)`;
        
        sequence.forEach((padId, idx) => {
            setTimeout(() => {
                flashPad(padId);
                if (idx === sequence.length - 1) {
                    setTimeout(() => {
                        locked = false;
                        statusEl.style.color = '#bae6fd';
                        statusEl.textContent = 'Your turn! Repeat the stage cues!';
                    }, 340);
                }
            }, 480 * (idx + 1));
        });
    }
    
    padBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            if (locked) {
                flashPad(id);
                return;
            }
            
            flashPad(id);
            
            if (id === sequence.at(playerStep)) {
                playerStep++;
                if (playerStep >= sequence.length) {
                    locked = true;
                    const best = Number(localStorage.getItem('afcs_simon_best') || '0');
                    if (round > best) {
                        localStorage.setItem('afcs_simon_best', String(round));
                        bestEl.textContent = String(round);
                    }
                    const prevCoins = Number(localStorage.getItem('afcs_coins') || '0');
                    localStorage.setItem('afcs_coins', String(prevCoins + 15));
                    statusEl.style.color = '#4ade80';
                    statusEl.textContent = `✓ Cue Cleared! (+15 🪙 AFCS Coins)`;
                    setTimeout(playNextRound, 800);
                }
            } else {
                locked = true;
                startBtn.disabled = false;
                startBtn.textContent = '↻ RETRY SEQUENCE';
                statusEl.style.color = '#fca5a5';
                statusEl.textContent = `✕ Missed cue on Round ${round}!`;
                playBeep(160, 0.25, 'sawtooth', 0.055);
            }
        });
    });
    
    startBtn.addEventListener('click', () => {
        sequence = [];
        round = 0;
        startBtn.disabled = true;
        startBtn.textContent = '💡 SEQUENCE RUNNING...';
        playNextRound();
    });
    
    function openSimonModal() {
        locked = true;
        sequence = [];
        round = 0;
        roundEl.textContent = '0';
        bestEl.textContent = localStorage.getItem('afcs_simon_best') || '0';
        statusEl.style.color = '#bae6fd';
        statusEl.textContent = 'Watch the stage cue sequence, then repeat it!';
        startBtn.disabled = false;
        startBtn.textContent = '▶ START LIGHT SEQUENCE';
        modal.classList.add('active');
    }
    
    modal.querySelector('#simonCloseBtn').addEventListener('click', () => {
        locked = true;
        modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            locked = true;
            modal.classList.remove('active');
        }
    });
    
    window.openSimonLightboardGame = openSimonModal;
    
    if (DOM.searchInput) {
        STATE.onSearchInput.push((val) => {
            if (val === 'simon' || val === 'lights') {
                DOM.searchInput.value = '';
                filterCards();
                openSimonModal();
                return true;
            }
            return false;
        });
    }
}
function startChessBotsData() {
    const CHESS_BOTS = [
        { id: 'martin', name: 'Martin', rating: 250, reward: 10, depth: 0, blunderChance: 0.78, avatar: '🧔', taunt: 'I just learned how the horsey moves!' },
        { id: 'wendy', name: 'Wendy', rating: 1500, reward: 30, depth: 1, blunderChance: 0.35, avatar: '👩', taunt: 'Ready for a solid club match?' },
        { id: 'nora', name: 'Nora', rating: 2200, reward: 50, depth: 2, blunderChance: 0.14, avatar: '👩‍🎓', taunt: 'Every pawn structure tells a story.' },
        { id: 'levy', name: 'GothamChess', rating: 2350, reward: 75, depth: 2, blunderChance: 0.08, avatar: '🎙️', taunt: 'AND HE SACRIFICES... THE ROOOOOOK!!' },
        { id: 'hikaru', name: 'Hikaru Nakamura', rating: 2820, reward: 100, depth: 2, blunderChance: 0.04, avatar: '⚡', taunt: 'Chat, takes, takes, takes—I literally do not care.' },
        { id: 'magnus', name: 'Magnus Carlsen', rating: 2882, reward: 200, depth: 3, blunderChance: 0.02, avatar: '👑', taunt: 'I will squeeze water from a stone in this endgame.' },
        { id: 'deepblue', name: 'IBM Deep Blue', rating: 3000, reward: 250, depth: 3, blunderChance: 0.0, avatar: '🖥️', taunt: 'EVALUATING 200,000,000 POSITIONS PER SECOND...' },
        { id: 'stockfish', name: 'Stockfish v19', rating: 3630, reward: 1000, depth: 15, blunderChance: 0.0, avatar: '🐟', taunt: 'MATE IN 14 DETECTED. RESISTANCE IS SUBOPTIMAL.', note: '// Send a outside recorded video (via phone) of you and your surroundings (at least 3 feet away), playing as Black and beating Stockfish with NO help from any source online or offline, (proof by showing Chrome tabs), and I will personally reward P100 to you. Good luck!' }
    ];
    
    const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    const PST = {
        p: [
            [  0,  0,  0,  0,  0,  0,  0,  0],
            [ 50, 50, 50, 50, 50, 50, 50, 50],
            [ 10, 10, 20, 30, 30, 20, 10, 10],
            [  5,  5, 10, 27, 27, 10,  5,  5],
            [  0,  0,  0, 25, 25,  0,  0,  0],
            [  5, -5,-10,  0,  0,-10, -5,  5],
            [  5, 10, 10,-25,-25, 10, 10,  5],
            [  0,  0,  0,  0,  0,  0,  0,  0]
        ],
        n: [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 20, 25, 25, 20,  5,-30],
            [-30,  0, 20, 25, 25, 20,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ],
        b: [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0, 10, 15, 15, 10,  0,-10],
            [-10,  5,  5, 15, 15,  5,  5,-10],
            [-10,  0, 15, 15, 15, 15,  0,-10],
            [-10, 15, 15, 15, 15, 15, 15,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ],
        r: [
            [  0,  0,  0,  0,  0,  0,  0,  0],
            [  5, 10, 10, 10, 10, 10, 10,  5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [ -5,  0,  0,  0,  0,  0,  0, -5],
            [  0, -5,  0, 10, 10,  5, -5,  0]
        ],
        q: [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [ -5,  0,  5,  5,  5,  5,  0, -5],
            [  0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ],
        k: [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [ 20, 20, -5, -5, -5, -5, 20, 20],
            [ 20, 30, 10,  0,  0, 10, 30, 20]
        ]
    };
    
    function evaluateBoard(game) {
        if (game.in_checkmate()) {
            return game.turn() === 'w' ? -99999 : 99999;
        }
        if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
            return 0;
        }
        const board = game.board();
        let total = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = board[r][c];
                if (!sq) continue;
                const val = PIECE_VALUES[sq.type] || 0;
                const tableRow = sq.color === 'w' ? r : (7 - r);
                const pos = (PST[sq.type] && PST[sq.type][tableRow] && PST[sq.type][tableRow][c]) || 0;
                total += sq.color === 'w' ? (val + pos) : -(val + pos);
            }
        }
        return total;
    }
    
    function orderMoves(moves) {
        return moves.sort((a, b) => {
            const capA = a.captured ? (PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece]) : 0;
            const capB = b.captured ? (PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece]) : 0;
            const scoreA = capA + (a.promotion ? 800 : 0) + (a.san.includes('+') ? 60 : 0) + (a.flags.includes('k') || a.flags.includes('q') ? 50 : 0);
            const scoreB = capB + (b.promotion ? 800 : 0) + (b.san.includes('+') ? 60 : 0) + (b.flags.includes('k') || b.flags.includes('q') ? 50 : 0);
            return scoreB - scoreA;
        });
    }
    
    function minimax(game, depth, alpha, beta, maximizing) {
        if (depth === 0 || game.game_over()) {
            return evaluateBoard(game);
        }
        const moves = orderMoves(game.moves({ verbose: true }));
        if (maximizing) {
            let maxEval = -Infinity;
            for (const m of moves) {
                game.move(m);
                const ev = minimax(game, depth - 1, alpha, beta, false);
                game.undo();
                if (ev > maxEval) maxEval = ev;
                if (ev > alpha) alpha = ev;
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const m of moves) {
                game.move(m);
                const ev = minimax(game, depth - 1, alpha, beta, true);
                game.undo();
                if (ev < minEval) minEval = ev;
                if (ev < beta) beta = ev;
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }
    
    let sfWorker = null;
    let sfReadyPromise = null;
    
    function getStockfishWorker() {
        if (sfReadyPromise) return sfReadyPromise;
        sfReadyPromise = (async () => {
            try {
                const sfUrl = 'https://u' + 'npkg.com' + '/stock' + 'fish@19.0.1/bin/stockfish-19-asm.js';
                const res = await fetch(sfUrl, { referrerPolicy: 'no-referrer' });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const scriptText = await res.text();
                
                const blob = new Blob([scriptText], { type: 'application/javascript' });
                const worker = new Worker(URL.createObjectURL(blob));
                
                return await new Promise((resolve) => {
                    const bootTimeout = setTimeout(() => {
                        try { worker.terminate(); } catch (_) {}
                        sfReadyPromise = null;
                        resolve(null);
                    }, 15000);
                    
                    worker.onerror = () => {
                        clearTimeout(bootTimeout);
                        sfReadyPromise = null;
                        resolve(null);
                    };
                    
                    const onBootMsg = (e) => {
                        const msg = typeof e.data === 'string' ? e.data : JSON.stringify(e.data || '');
                        if (msg.includes('uciok') || msg.includes('readyok')) {
                            clearTimeout(bootTimeout);
                            worker.removeEventListener('message', onBootMsg);
                            worker.postMessage('setoption name Skill Level value 20');
                            sfWorker = worker;
                            resolve(worker);
                        }
                    };
                    
                    worker.addEventListener('message', onBootMsg);
                    worker.postMessage('uci');
                    worker.postMessage('isready');
                });
            } catch (e) {
                sfReadyPromise = null;
                return null;
            }
        })();
        return sfReadyPromise;
    }
    
    
    async function chooseBotMove(game, bot, onMidTaunt) {
        const moves = orderMoves(game.moves({ verbose: true }));
        if (!moves.length) return null;
        
        if (bot.depth === 0 || Math.random() < bot.blunderChance) {
            return moves.at(Math.floor(Math.random() * moves.length));
        }
        
        const isFish = bot.id === 'stockfish';
        
        if (isFish) {
            const worker = await getStockfishWorker();
            if (!worker) {
                return { offlineError: true };
            }
            
            const fen = game.fen();
            const uciMove = await new Promise((resolve) => {
                let resolved = false;
                const tauntTimer = setTimeout(() => {
                    if (!resolved && typeof onMidTaunt === 'function') onMidTaunt();
                }, 2500);
                
                const hardCap = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        worker.postMessage('stop');
                        resolve(null);
                    }
                }, 5500);
                
                const onMsg = (e) => {
                    const line = String(e.data || '');
                    if (line.startsWith('bestmove')) {
                        clearTimeout(tauntTimer);
                        clearTimeout(hardCap);
                        worker.removeEventListener('message', onMsg);
                        if (!resolved) {
                            resolved = true;
                            const moveStr = line.split(' ').at(1);
                            resolve(moveStr && moveStr !== '(none)' ? moveStr : null);
                        }
                    }
                };
                
                worker.addEventListener('message', onMsg);
                worker.postMessage('position fen ' + fen);
                worker.postMessage('go movetime 5000');
            });
            
            if (uciMove && uciMove.length >= 4) {
                const from = uciMove.slice(0, 2);
                const to = uciMove.slice(2, 4);
                const promotion = uciMove.length > 4 ? uciMove.charAt(4) : 'q';
                const matched = moves.find(m => m.from === from && m.to === to && (!m.promotion || m.promotion === promotion));
                if (matched) return matched;
            }
            return { offlineError: true };
        }
        
        const maxDepth = isFish ? 5 : bot.depth;
        const start = performance.now();
        const tauntMark = start + 2500;
        const deadline = start + (isFish ? 5000 : 400);
        const isBotWhite = game.turn() === 'w';
        let bestMove = moves.at(0);
        
        for (let d = 1; d <= maxDepth; d++) {
            if (d > 1 && performance.now() > deadline) break;
            let iterBest = moves.at(0);
            let iterVal = isBotWhite ? -Infinity : Infinity;
            let completed = true;
            
            for (const m of moves) {
                if (d > 1 && performance.now() > deadline) {
                    completed = false;
                    break;
                }
                
                game.move(m);
                const boardVal = minimax(game, d - 1, -Infinity, Infinity, !isBotWhite);
                game.undo();
                if (isBotWhite ? (boardVal > iterVal) : (boardVal < iterVal)) {
                    iterVal = boardVal;
                    iterBest = m;
                }
            }
            if (completed) bestMove = iterBest;
        }
        return bestMove;
        return bestMove;
    }
    
    window.AFCS_CHESS_DATA = {
        bots: CHESS_BOTS,
        chooseBotMove
    };
}
function startChessBotsUI() {
    const chessData = window.AFCS_CHESS_DATA;
    if (!chessData) return;
    
    let selectedBotIdx = 0;
    let game = null;
    let selectedSq = null;
    let legalTargets = [];
    let botThinking = false;
    let playerColor = 'w';
    
    const UNICODE_PIECES = {
        wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
        bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
    };
    
    const modal = document.createElement('div');
    modal.className = 'chesscom-modal-overlay';
    modal.innerHTML = `
        <div class="chesscom-card">
            <div class="chesscom-topbar">
                <span class="chesscom-brand">♟️ CHESS.COM // BOT GAUNTLET</span>
                <button type="button" class="chesscom-close" id="ccCloseBtn">&times;</button>
            </div>
    
            <div class="chesscom-bot-bar" id="ccBotBar">
                ${chessData.bots.map((b, i) => `
                    <button type="button" class="cc-bot-chip ${i === 0 ? 'is-selected' : ''}" data-idx="${i}">
                        <span>${b.avatar} ${b.name.split(' ').at(0)}</span>
                        <small>${b.rating} • +${b.reward}🪙</small>
                    </button>
                `).join('')}
            </div>
    
            <div class="cc-rival-banner" id="ccRivalBanner"></div>
    
            <div class="cc-board" id="ccBoard"></div>
    
            <div class="cc-status-bar" id="ccStatus">Loading Chess Engine...</div>
    
             <div class="cc-footer">
                <button type="button" class="cc-btn is-active-side" id="ccSideWhiteBtn" style="border-color:#fde047;color:#fde047;">♔ White</button>
                <button type="button" class="cc-btn" id="ccSideBlackBtn">♚ Black</button>
                <button type="button" class="cc-btn" id="ccNewGameBtn">↻ New Match</button>
                <button type="button" class="cc-btn is-danger" id="ccResignBtn">🏳️ Resign</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const botBar = modal.querySelector('#ccBotBar');
    const rivalBanner = modal.querySelector('#ccRivalBanner');
    const boardEl = modal.querySelector('#ccBoard');
    const statusEl = modal.querySelector('#ccStatus');
    
    function sqName(r, c) {
        return 'abcdefgh'[c] + String(8 - r);
    }
    
    function syncRivalBanner() {
        const bot = chessData.bots.at(selectedBotIdx);
        const noteHtml = bot.note
        ? `<div style="margin-top:6px;padding-top:6px;border-top:1px dashed rgba(250,204,21,0.35);font-size:0.78rem;color:#fde047;font-style:normal;">${bot.note}</div>`
        : '';
        rivalBanner.innerHTML = `
            <div class="cc-rival-avatar">${bot.avatar}</div>
            <div class="cc-rival-info">
                <div class="cc-rival-name">${bot.name} <span class="cc-elo">(${bot.rating})</span> • Prize: <strong style="color:#fde047;">+${bot.reward} 🪙</strong></div>
                <div class="cc-rival-taunt">"${bot.taunt}"</div>
                ${noteHtml}
            </div>
        `;
    }
    
    function renderBoard() {
        if (!game) return;
        const b = game.board();
        const inCheck = game.in_check();
        const turnColor = game.turn();
        let html = '';
        
        for (let viewR = 0; viewR < 8; viewR++) {
            for (let viewC = 0; viewC < 8; viewC++) {
                const r = playerColor === 'w' ? viewR : (7 - viewR);
                const c = playerColor === 'w' ? viewC : (7 - viewC);
                const sq = sqName(r, c);
                const piece = b[r][c];
                const isDark = (r + c) % 2 === 1;
                const isSel = selectedSq === sq;
                const isTarget = legalTargets.includes(sq);
                const isKingCheck = inCheck && piece && piece.type === 'k' && piece.color === turnColor;
                const bg = isKingCheck ? '#ef4444' : isSel ? '#f6f669' : (isDark ? '#b58863' : '#f0d9b5');
                
                const glyph = piece ? UNICODE_PIECES[piece.color + piece.type.toUpperCase()] : '';
                const pieceCls = piece ? (piece.color === 'w' ? 'cc-w-piece' : 'cc-b-piece') : '';
                
                html += `
                    <button type="button" class="cc-sq ${isDark ? 'is-dark' : 'is-light'} ${isSel ? 'is-selected' : ''} ${isTarget ? 'is-legal' : ''} ${isKingCheck ? 'is-check' : ''}" data-sq="${sq}" style="background:${bg} !important; aspect-ratio:1/1; line-height:1; border:none; padding:0; display:flex; align-items:center; justify-content:center; font-size:clamp(22px,5vw,34px);">
                        <span class="${pieceCls}">${glyph}</span>
                        ${isTarget && !piece ? '<span class="cc-dot"></span>' : ''}
                    </button>
                `;
            }
        }
        boardEl.innerHTML = html;
        boardEl.querySelectorAll('.cc-sq').forEach(btn => {
            btn.addEventListener('click', () => handleSquareClick(btn.dataset.sq));
        });
    }
    function checkMatchEnd() {
        if (!game || !game.game_over()) return false;
        const bot = chessData.bots.at(selectedBotIdx);
        
        if (game.in_checkmate()) {
            const playerWon = game.turn() !== playerColor;
            if (playerWon) {
                const prevCoins = Number(localStorage.getItem('afcs_coins') || '0');
                localStorage.setItem('afcs_coins', String(prevCoins + bot.reward));
                statusEl.style.color = '#4ade80';
                statusEl.textContent = `🏆 CHECKMATE! You defeated ${bot.name}! (+${bot.reward} 🪙 AFCS Coins!)`;
                const rect = boardEl.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#4ade80', '#ffffff'], 46);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 75));
            } else {
                statusEl.style.color = '#fca5a5';
                statusEl.textContent = `💀 CHECKMATE! ${bot.name} (${bot.rating}) wins!`;
                playBeep(175, 0.28, 'sawtooth', 0.055);
            }
        } else {
            statusEl.style.color = '#fde047';
            statusEl.textContent = '🤝 Draw! Match ended in a stalemate / repetition.';
            playBeep(440, 0.14, 'sine', 0.04);
        }
        return true;
    }
    function triggerBotTurn() {
        if (!game || game.game_over() || game.turn() === playerColor) return;
        const bot = chessData.bots.at(selectedBotIdx);
        botThinking = true;
        statusEl.style.color = '#bae6fd';
        statusEl.textContent = `${bot.avatar} ${bot.name} is thinking...`;
        
        setTimeout(async () => {
            if (!game || game.game_over()) {
                botThinking = false;
                return;
            }
            const moveObj = await chessData.chooseBotMove(game, bot, () => {
                const cynLine = 'Giggle. The [FISH] has crashed your CPU. How delightful.';
                statusEl.style.color = '#facc15';
                statusEl.textContent = `⬡ ${cynLine}`;
                
                const petBubble = document.querySelector('#cyn-pet-bubble, .cyn-speech-bubble, [data-cyn-bubble]');
                if (petBubble) {
                    petBubble.textContent = cynLine;
                    petBubble.style.opacity = '1';
                    petBubble.classList.add('is-visible', 'active');
                }
                if (typeof window.cynSpeak === 'function') {
                    window.cynSpeak(cynLine);
                }
                if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(140);
                playBeep(880, 0.12, 'sawtooth', 0.05);
            });
            
            if (moveObj && moveObj.offlineError) {
                botThinking = false;
                statusEl.style.color = '#f87171';
                statusEl.textContent = '❌ Stockfish v19 requires an active internet connection! Match voided.';
                game.load('8/8/8/8/8/8/8/8 w - - 0 1');
                renderBoard();
                return;
            }
            
            if (moveObj) {
                game.move(moveObj);
                playBeep(moveObj.captured ? 320 : 480, 0.06, 'triangle', 0.04);
            }
            botThinking = false;
            renderBoard();
            if (!checkMatchEnd()) {
                const sideLabel = playerColor === 'w' ? 'White' : 'Black';
                statusEl.style.color = game.in_check() ? '#fca5a5' : '#e2e8f0';
                statusEl.textContent = game.in_check() ? '⚠️ CHECK! Defend your King!' : `Your turn (${sideLabel})`;
            }
        }, bot.id === 'stockfish' ? 120 : 180);
    }
    function handleSquareClick(sq) {
        if (!game || botThinking || game.game_over() || game.turn() !== playerColor) return;
        
        if (selectedSq && legalTargets.includes(sq)) {
            const moveResult = game.move({ from: selectedSq, to: sq, promotion: 'q' });
            selectedSq = null;
            legalTargets = [];
            renderBoard();
            if (moveResult) {
                playBeep(moveResult.captured ? 360 : 540, 0.06, 'triangle', 0.04);
                if (!checkMatchEnd()) {
                    triggerBotTurn();
                }
            }
            return;
        }
        
        const piece = game.get(sq);
        if (piece && piece.color === playerColor) {
            selectedSq = sq;
            const moves = game.moves({ square: sq, verbose: true });
            legalTargets = moves.map(m => m.to);
            playBeep(620, 0.04, 'sine', 0.03);
        } else {
            selectedSq = null;
            legalTargets = [];
        }
        renderBoard();
    }
    function syncSideButtons() {
        const wBtn = modal.querySelector('#ccSideWhiteBtn');
        const bBtn = modal.querySelector('#ccSideBlackBtn');
        if (wBtn) {
            wBtn.style.borderColor = playerColor === 'w' ? '#fde047' : '';
            wBtn.style.color = playerColor === 'w' ? '#fde047' : '';
        }
        if (bBtn) {
            bBtn.style.borderColor = playerColor === 'b' ? '#fde047' : '';
            bBtn.style.color = playerColor === 'b' ? '#fde047' : '';
        }
    }
    function startNewMatch() {
        ensureChessEngine(() => {
            game = new window.Chess();
            selectedSq = null;
            legalTargets = [];
            botThinking = false;
            syncSideButtons();
            syncRivalBanner();
            renderBoard();
            if (playerColor === 'b') {
                triggerBotTurn();
            } else {
                statusEl.style.color = '#e2e8f0';
                statusEl.textContent = 'Your turn (White) — Click a piece to move!';
            }
        });
    }
    botBar.querySelectorAll('.cc-bot-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            selectedBotIdx = Number(chip.dataset.idx);
            botBar.querySelectorAll('.cc-bot-chip').forEach(c => c.classList.remove('is-selected'));
            chip.classList.add('is-selected');
            startNewMatch();
            playBeep(659.25, 0.07, 'triangle', 0.04);
        });
    });
    
    modal.querySelector('#ccNewGameBtn').addEventListener('click', () => {
        startNewMatch();
        playBeep(587.33, 0.07, 'triangle', 0.04);
    });
    
    modal.querySelector('#ccSideWhiteBtn').addEventListener('click', () => {
        if (playerColor === 'w') return;
        playerColor = 'w';
        startNewMatch();
        playBeep(659.25, 0.07, 'triangle', 0.04);
    });
    
    modal.querySelector('#ccSideBlackBtn').addEventListener('click', () => {
        if (playerColor === 'b') return;
        playerColor = 'b';
        startNewMatch();
        playBeep(523.25, 0.07, 'triangle', 0.04);
    });
    
    modal.querySelector('#ccResignBtn').addEventListener('click', () => {
        if (!game || game.game_over()) return;
        const bot = chessData.bots.at(selectedBotIdx);
        statusEl.style.color = '#fca5a5';
        statusEl.textContent = `🏳️ You resigned. ${bot.name} wins!`;
        game.load('8/8/8/8/8/8/8/8 w - - 0 1');
        playBeep(180, 0.2, 'sawtooth', 0.045);
    });
    
    function openChessComModal() {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('chess');
        modal.classList.add('active');
        startNewMatch();
    }
    
    modal.querySelector('#ccCloseBtn').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    window.openChessComBots = openChessComModal;
    
    if (DOM.searchInput) {
        STATE.onSearchInput.push((val) => {
            if (val === 'chess' || val === 'chess.com' || val === 'stockfish' || val === '2823') {
                DOM.searchInput.value = '';
                filterCards();
                openChessComModal();
                return true;
            }
            return false;
        });
    }
}
function ensureChessEngine(cb) {
    if (typeof window.Chess !== 'undefined') {
        cb();
        return;
    }
    const existing = document.getElementById('afcsChessJsLib');
    if (existing) {
        existing.addEventListener('load', cb, { once: true });
        return;
    }
    const s = document.createElement('script');
    s.id = 'afcsChessJsLib';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js';
    s.onload = () => cb();
    s.onerror = () => {
        statusEl.style.color = '#fca5a5';
        statusEl.textContent = '❌ Failed to load chess.js. Check internet connection.';
    };
    document.head.appendChild(s);
}
function startDoorsGameData() {
    window.DOORS_CFG = {
        startDoor: 0,
        libraryDoor: 50,
        finalDoor: 100,
        maxHp: 100,
        rewardCoins: 250,
        triggers: ['doors', 'rush', 'ambush', 'figure', 'seek', 'eyes', 'guiding light', 'door 100', 'hotel'],
        shapes: [
            { id: 'star', symbol: '★', name: 'Star', color: '#fbbf24' },
            { id: 'square', symbol: '■', name: 'Square', color: '#38bdf8' },
            { id: 'triangle', symbol: '▲', name: 'Triangle', color: '#f43f5e' },
            { id: 'circle', symbol: '●', name: 'Circle', color: '#a855f7' }
        ],
        knobs: [
            { x: 18, y: 28 },
            { x: 78, y: 24 },
            { x: 24, y: 74 },
            { x: 82, y: 72 },
            { x: 50, y: 48 }
        ],
        guidingTips: {
            dupe: 'You fell for Dupe... Pay close attention to the number on the previous door, or wait for my cyan shimmer to show you the real way.',
            rush: 'You died to Rush. Whenever the lights flicker, stop moving forward and press [C] to hide inside a closet until it passes.',
            ambush: 'You died to Ambush. Unlike Rush, Ambush rebounds back through the hall multiple times—stay inside the closet until it is truly quiet.',
            screech: 'You died to Screech. When you hear "PSST!" in the dark, quickly spot and click Screech before it strikes.',
            eyes: 'You died to Eyes. Never look directly at it—keep your mouse cursor away from Eyes while opening the next door.',
            seek: 'You died to Seek. During the chase, react fast and click the glowing cyan Guiding Light path button before Seek catches up.',
            figure: 'You died to Figure. It is blind, so it hunts by sound—hold [SPACE] to hold your breath whenever its footsteps draw close.',
            breaker: 'You died to Figure in The Electrical Room. Flip the 6 breaker switches quietly and hold [SPACE] whenever Figure nears the panel.'
        }
    };
    
    window.DOORS_STATE = {
        active: false,
        door: 0,
        hp: 100,
        hiding: false,
        breath: 100,
        holdingBreath: false,
        hazard: null,
        lastKiller: 'rush',
        screechFound: false,
        booksFound: [],
        codeDigits: [],
        inputDigits: [],
        breakersFlipped: [],
        figureDist: 100,
        timers: [],
        intervals: [],
        listeners: []
    };
    
    window.doorsAddTimer = function (fn, ms) {
        const id = setTimeout(fn, ms);
        window.DOORS_STATE.timers.push(id);
        return id;
    };
    
    window.doorsAddInterval = function (fn, ms) {
        const id = setInterval(fn, ms);
        window.DOORS_STATE.intervals.push(id);
        return id;
    };
    
    window.doorsClearAllAsync = function () {
        const st = window.DOORS_STATE;
        st.timers.forEach(clearTimeout);
        st.intervals.forEach(clearInterval);
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.timers = [];
        st.intervals = [];
        st.listeners = [];
    };
    
    window.doorsAwardCoins = function (amount) {
        const current = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const updated = current + amount;
        localStorage.setItem('afcs_coins', String(updated));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = updated + ' 🪙';
        return updated;
    };
}
function startDoorsCore() {
    window.doorsBuildModal = function () {
        const old = document.getElementById('doors-game-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'doors-game-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at center,#18120e 0%,#050404 100%);color:#f5ebd6;font-family:Georgia,serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:18px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:880px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #4a3723;padding-bottom:10px;">
                <div style="display:flex;gap:14px;align-items:center;">
                    <span id="doors-room-label" style="font-size:1.3rem;font-weight:bold;letter-spacing:2px;color:#e5b96c;">DOOR 0000</span>
                    <div style="width:150px;height:14px;background:#241911;border:1px solid #6b4e31;border-radius:4px;overflow:hidden;">
                        <div id="doors-hp-bar" style="width:100%;height:100%;background:#dc2626;transition:width 0.2s;"></div>
                    </div>
                    <span id="doors-hp-text" style="font-size:0.9rem;color:#fca5a5;">100 HP</span>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button id="doors-guide-btn" style="background:#083344;color:#67e8f9;border:1px solid #06b6d4;padding:7px 12px;border-radius:6px;cursor:pointer;font-weight:bold;">✨ GUIDING LIGHT [G]</button>
                    <button id="doors-closet-btn" style="background:#2d1f14;color:#f5ebd6;border:1px solid #8c663e;padding:7px 14px;border-radius:6px;cursor:pointer;font-weight:bold;">🚪 HIDE IN CLOSET [C]</button>
                    <button id="doors-exit-btn" style="background:#3f1515;color:#fecaca;border:1px solid #991b1b;padding:7px 12px;border-radius:6px;cursor:pointer;">✕ LEAVE</button>
                </div>
            </div>
        
            <div id="doors-banner" style="min-height:28px;font-size:1rem;letter-spacing:1px;color:#fde68a;text-align:center;text-shadow:0 0 10px rgba(251,191,36,0.4);">
                Enter Door 0001 to begin your climb to Door 0100...
            </div>
        
            <div id="doors-stage" style="position:relative;width:100%;max-width:880px;height:420px;background:#0d0907;border:2px solid #3d2b1a;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 80px #000;"></div>
        
            <div style="width:100%;max-width:880px;display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;color:#a89070;">
                <span>Controls: Click Doors • [C] Closet • [G] Guiding Light • [SPACE] Hold Breath</span>
                <span id="doors-breath-wrap" style="display:none;color:#93c5fd;">🫁 Breath: <b id="doors-breath-val">100%</b></span>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('doors-exit-btn').onclick = window.doorsCloseGame;
        document.getElementById('doors-closet-btn').onclick = window.doorsToggleCloset;
        document.getElementById('doors-guide-btn').onclick = window.doorsInvokeGuidingLight;
        
        const keyDownHandler = function (e) {
            if (!window.DOORS_STATE.active) return;
            if (e.code === 'KeyC') window.doorsToggleCloset();
            if (e.code === 'KeyG') window.doorsInvokeGuidingLight();
            if (e.code === 'Space') {
                e.preventDefault();
                window.DOORS_STATE.holdingBreath = true;
            }
            if (e.code === 'Escape') window.doorsCloseGame();
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') window.doorsPan3DRoom(22);
            if (e.code === 'KeyD' || e.code === 'ArrowRight') window.doorsPan3DRoom(-22);
        };
        
        const keyUpHandler = function (e) {
            if (e.code === 'Space') window.DOORS_STATE.holdingBreath = false;
        };
        
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        window.DOORS_STATE.listeners.push([window, 'keydown', keyDownHandler]);
        window.DOORS_STATE.listeners.push([window, 'keyup', keyUpHandler]);
    };
    
    window.doorsSetBanner = function (text, color) {
        const el = document.getElementById('doors-banner');
        if (!el) return;
        el.textContent = text;
        el.style.color = color || '#fde68a';
    };
    
    window.doorsInvokeGuidingLight = function () {
        const st = window.DOORS_STATE;
        if (!st.active) return;
        
        if (st.door === window.DOORS_CFG.libraryDoor) {
            const unfound = st.codeDigits.find(item => !st.booksFound.includes(item.id));
            if (unfound) {
                const btn = document.querySelector(`.lib-book-btn[data-id="${unfound.id}"]`);
                if (btn) {
                    btn.style.boxShadow = '0 0 28px 10px #22d3ee';
                    btn.style.borderColor = '#67e8f9';
                }
                window.doorsSetBanner('✨ Guiding Light illuminates a hidden ' + unfound.name + ' book in cyan!', '#67e8f9');
            } else {
                window.doorsSetBanner('✨ Guiding Light: All 4 books are found! Enter their digits on the padlock.', '#67e8f9');
            }
            return;
        }
        
        if (st.door === window.DOORS_CFG.finalDoor) {
            const nextSwitch = [1, 2, 3, 4, 5, 6].find(n => !st.breakersFlipped.includes(n));
            if (nextSwitch) {
                const swEl = document.querySelector(`.breaker-btn[data-sw="${nextSwitch}"]`);
                if (swEl) swEl.style.boxShadow = '0 0 24px 8px #22d3ee';
                window.doorsSetBanner('✨ Guiding Light highlights Breaker Switch #' + nextSwitch + '!', '#67e8f9');
            }
            return;
        }
        
        const trueDoorCard = document.querySelector(`.hotel-door-card[data-num="${st.door + 1}"]`);
        if (trueDoorCard) {
            trueDoorCard.style.borderColor = '#22d3ee';
            trueDoorCard.style.boxShadow = '0 0 32px rgba(34,211,238,0.85)';
            window.doorsSetBanner('✨ Guiding Light shimmers around Door ' + String(st.door + 1).padStart(4, '0') + '!', '#67e8f9');
        } else if (st.hazard === 'rush' || st.hazard === 'ambush') {
            window.doorsSetBanner('✨ Guiding Light: Get inside a closet immediately ([C])!', '#67e8f9');
        }
        if (st.hazard === 'keyroom' && window.doorsGuideKeyRoom) {
            window.doorsGuideKeyRoom();
            return;
        }
    };
    
    window.doorsDamage = function (amount, reason, killerKey) {
        const st = window.DOORS_STATE;
        if (!st.active) return;
        st.lastKiller = killerKey || st.lastKiller;
        st.hp = Math.max(0, st.hp - amount);
        const bar = document.getElementById('doors-hp-bar');
        const txt = document.getElementById('doors-hp-text');
        if (bar) bar.style.width = st.hp + '%';
        if (txt) txt.textContent = st.hp + ' HP';
        window.doorsSetBanner(reason + ' (-' + amount + ' HP)', '#f87171');
        
        const stage = document.getElementById('doors-stage');
        if (stage) {
            stage.style.boxShadow = 'inset 0 0 90px rgba(220,38,38,0.85)';
            window.doorsAddTimer(() => {
                if (stage) stage.style.boxShadow = 'inset 0 0 80px #000';
            }, 350);
        }
        
        if (st.hp <= 0) {
            window.doorsEndScreen(false, reason);
        }
    };
    
    window.doorsToggleCloset = function () {
        const st = window.DOORS_STATE;
        if (!st.active || st.door === window.DOORS_CFG.libraryDoor || st.door >= window.DOORS_CFG.finalDoor) return;
        st.hiding = !st.hiding;
        const btn = document.getElementById('doors-closet-btn');
        const stage = document.getElementById('doors-stage');
        if (!btn || !stage) return;
        
        if (st.hiding) {
            btn.textContent = '🚪 EXIT CLOSET [C]';
            btn.style.background = '#1e3a2f';
            stage.innerHTML = `
                <div style="width:100%;height:100%;background:#040302;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;">
                    <div style="width:220px;height:280px;border-left:14px solid #291b10;border-right:14px solid #291b10;background:repeating-linear-gradient(0deg,#120c07 0px,#120c07 18px,#050302 18px,#050302 26px);display:flex;align-items:center;justify-content:center;">
                        <span style="color:#a89070;font-size:0.95rem;">Peeking through the louvers...</span>
                    </div>
                </div>
            `;
        } else {
            btn.textContent = '🚪 HIDE IN CLOSET [C]';
            btn.style.background = '#2d1f14';
            window.doorsRenderCorridor();
        }
    };
}
function startDoorsEntities() {
    window.doorsFlickerLights = function (durationMs, callback) {
        const stage = document.getElementById('doors-stage');
        if (!stage) return;
        let ticks = 0;
        const maxTicks = Math.floor(durationMs / 110);
        const flickerId = window.doorsAddInterval(() => {
            ticks++;
            stage.style.opacity = ticks % 2 === 0 ? '0.2' : '1';
            if (ticks >= maxTicks) {
                clearInterval(flickerId);
                stage.style.opacity = '1';
                if (callback) callback();
            }
        }, 110);
    };
    
    window.doorsTriggerRushOrAmbush = function (isAmbush) {
        const st = window.DOORS_STATE;
        st.hazard = isAmbush ? 'ambush' : 'rush';
        window.doorsSetBanner('⚡ The lights flicker violently... HIDE IN A CLOSET NOW!', '#fbbf24');
        
        window.doorsFlickerLights(1500, () => {
            if (!st.active) return;
            const passes = isAmbush ? (st.door > 60 ? 3 : 2) : 1;
            let currentPass = 0;
            
            const runPass = () => {
                if (!st.active) return;
                currentPass++;
                window.doorsSetBanner(isAmbush ? '💀 AMBUSH PASS ' + currentPass + '/' + passes + '!' : '💀 RUSH IS PASSING THROUGH!', '#ef4444');
                
                window.doorsAddTimer(() => {
                    if (!st.active) return;
                    if (!st.hiding) {
                        window.doorsDamage(100, isAmbush ? 'Caught outside by Ambush' : 'Trampled by Rush', isAmbush ? 'ambush' : 'rush');
                        return;
                    }
                    if (currentPass < passes) {
                        window.doorsSetBanner('Ambush is rebounding! Stay hidden!', '#f97316');
                        window.doorsAddTimer(runPass, 1300);
                    } else {
                        st.hazard = null;
                        window.doorsSetBanner('The corridor goes quiet. Safe to exit closet.', '#86efac');
                    }
                }, 1250);
            };
            
            runPass();
        });
    };
    
    window.doorsTriggerScreech = function () {
        const st = window.DOORS_STATE;
        const stage = document.getElementById('doors-stage');
        if (!stage || st.hiding) return;
        
        st.hazard = 'screech';
        st.screechFound = false;
        window.doorsSetBanner('👁️ "PSST!" — Click Screech before it bites!', '#c084fc');
        
        const rx = 15 + Math.floor(Math.random() * 70);
        const ry = 18 + Math.floor(Math.random() * 64);
        
        const screechEl = document.createElement('button');
        screechEl.textContent = '👾 PSST!';
        screechEl.style.cssText = 'position:absolute;left:' + rx + '%;top:' + ry + '%;transform:translate(-50%,-50%);background:#18181b;color:#f3e8ff;border:2px solid #a855f7;border-radius:50%;width:74px;height:74px;font-weight:bold;cursor:pointer;box-shadow:0 0 24px #9333ea;z-index:20;';
        screechEl.onclick = function () {
            st.screechFound = true;
            st.hazard = null;
            screechEl.remove();
            window.doorsSetBanner('You scared Screech away!', '#86efac');
        };
        stage.appendChild(screechEl);
        
        window.doorsAddTimer(() => {
            if (!st.active) return;
            if (!st.screechFound) {
                screechEl.remove();
                st.hazard = null;
                window.doorsDamage(25, 'Bitten in the dark by Screech', 'screech');
            }
        }, 2200);
    };
    
    window.doorsTriggerEyes = function () {
        const st = window.DOORS_STATE;
        const stage = document.getElementById('doors-stage');
        if (!stage || st.hiding) return;
        
        window.doorsSetBanner('👁️‍🗨️ EYES SPAWNED — Do NOT touch or hover over Eyes!', '#a855f7');
        const eyesEl = document.createElement('div');
        eyesEl.innerHTML = '👁️👁️👁️<div style="font-size:0.75rem;color:#e9d5ff;">LOOK AWAY!</div>';
        eyesEl.style.cssText = 'position:absolute;top:16px;left:50%;transform:translateX(-50%);background:rgba(59,7,100,0.9);border:2px solid #c084fc;padding:8px 18px;border-radius:12px;text-align:center;box-shadow:0 0 30px #9333ea;z-index:15;';
        eyesEl.onmouseenter = function () {
            window.doorsDamage(20, 'Looked directly at Eyes', 'eyes');
        };
        stage.appendChild(eyesEl);
    };
    
    window.doorsTriggerSeekDodge = function () {
        const st = window.DOORS_STATE;
        const stage = document.getElementById('doors-stage');
        if (!stage) return;
        
        st.hazard = 'seek';
        let dodged = false;
        window.doorsSetBanner('🏃‍♂️ SEEK CHASE! Follow the cyan Guiding Light path immediately!', '#22d3ee');
        
        const dirs = ['⬅️ DUCK LEFT', '⬆️ JUMP BEAM', '➡️ SLIDE RIGHT'];
        const label = dirs[Math.floor(Math.random() * dirs.length)];
        const rx = 22 + Math.floor(Math.random() * 56);
        const ry = 25 + Math.floor(Math.random() * 50);
        
        const pathBtn = document.createElement('button');
        pathBtn.textContent = '✨ ' + label;
        pathBtn.style.cssText = 'position:absolute;left:' + rx + '%;top:' + ry + '%;transform:translate(-50%,-50%);background:#083344;color:#cffafe;border:3px solid #22d3ee;padding:12px 18px;border-radius:10px;font-weight:bold;cursor:pointer;box-shadow:0 0 28px #06b6d4;z-index:25;';
        pathBtn.onclick = function () {
            dodged = true;
            st.hazard = null;
            pathBtn.remove();
            window.doorsSetBanner('✨ Guiding Light guided you past Seek!', '#67e8f9');
        };
        stage.appendChild(pathBtn);
        
        window.doorsAddTimer(() => {
            if (!st.active) return;
            if (!dodged) {
                pathBtn.remove();
                st.hazard = null;
                window.doorsDamage(45, 'Tripped while running from Seek', 'seek');
            }
        }, 1900);
    };
}
function startDoorsCorridor() {
    window.doorsRenderCorridor = function () {
        const st = window.DOORS_STATE;
        const stage = document.getElementById('doors-stage');
        const roomLabel = document.getElementById('doors-room-label');
        const closetBtn = document.getElementById('doors-closet-btn');
        const breathWrap = document.getElementById('doors-breath-wrap');
        if (!stage || !roomLabel) return;
        
        roomLabel.textContent = 'DOOR ' + String(st.door).padStart(4, '0');
        if (closetBtn) closetBtn.style.display = 'inline-block';
        if (breathWrap) breathWrap.style.display = 'none';
        
        if (st.door === window.DOORS_CFG.libraryDoor) {
            window.doorsStartLibrary();
            return;
        }
        if (st.door >= window.DOORS_CFG.finalDoor) {
            window.doorsStartElectricalRoom();
            return;
        }
        
        const nextNum = st.door + 1;
        const isGreenhouse = st.door >= 90;
        const hasDupe = !isGreenhouse && st.door >= 8 && Math.random() < (st.door > 50 ? 0.55 : 0.4);
        const fakeNum = Math.random() < 0.5 ? nextNum + 1 : nextNum + 2;
        const doorsList = hasDupe
        ? (Math.random() < 0.5 ? [nextNum, fakeNum] : [fakeNum, nextNum])
        : [nextNum];
        
        const bgTone = isGreenhouse
        ? 'radial-gradient(circle at center,#0b1c12 0%,#030805 100%)'
        : (st.door > 50 ? 'radial-gradient(circle at center,#12101c 0%,#040308 100%)' : 'transparent');
        
        stage.innerHTML = `
            <div id="doors-corridor-wrap" style="background:${bgTone};display:flex;gap:48px;align-items:center;justify-content:center;width:100%;height:100%;transition:filter 0.1s;">
                ${doorsList.map(num => `
                    <div class="hotel-door-card" data-num="${num}" style="width:170px;height:300px;background:linear-gradient(180deg,#4a3019 0%,#2b1a0c 100%);border:4px solid #6b4726;border-radius:8px 8px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 12px;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,0.8);transition:transform 0.15s,border-color 0.3s,box-shadow 0.3s;">
                        <div style="background:#1c1208;border:2px solid #b88946;padding:6px 16px;border-radius:4px;font-weight:bold;font-size:1.25rem;color:#f5d08a;letter-spacing:2px;">
                            ${String(num).padStart(4, '0')}
                        </div>
                        <div style="width:110px;height:140px;border:2px solid #5c3b1e;border-radius:4px;"></div>
                        <div style="width:100%;display:flex;justify-content:flex-end;padding-right:10px;">
                            <div style="width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#fde047,#92400e);"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        if (hasDupe) {
            window.doorsAddTimer(() => {
                if (st.active && st.door === nextNum - 1 && !st.hiding) {
                    window.doorsInvokeGuidingLight();
                }
            }, 4200);
        }
        
        stage.querySelectorAll('.hotel-door-card').forEach(card => {
            card.onmouseenter = () => { card.style.transform = 'scale(1.04)'; };
            card.onmouseleave = () => { card.style.transform = 'scale(1)'; };
            card.onclick = () => {
                const isSpecialDoor = nextNum === window.DOORS_CFG.libraryDoor || nextNum >= window.DOORS_CFG.finalDoor || nextNum >= 90 || (nextNum >= 35 && nextNum <= 38) || (nextNum >= 75 && nextNum <= 78);
                if (!isSpecialDoor && nextNum >= 4 && st.hazard !== 'keyroom' && Math.random() < 0.28) {
                    window.doorsStartKeyRoom(nextNum);
                    return;
                }
                if (st.hazard === 'rush' || st.hazard === 'ambush' || st.hazard === 'seek') {
                    window.doorsSetBanner('You cannot open doors while an entity is attacking!', '#f87171');
                    return;
                }
                const picked = parseInt(card.getAttribute('data-num'), 10);
                if (picked === nextNum) {
                    st.door = nextNum;
                    if (st.door % 10 === 0 && st.hp < 100) {
                        st.hp = Math.min(100, st.hp + 15);
                        const bar = document.getElementById('doors-hp-bar');
                        const txt = document.getElementById('doors-hp-text');
                        if (bar) bar.style.width = st.hp + '%';
                        if (txt) txt.textContent = st.hp + ' HP';
                    }
                    const isSpecialDoor = nextNum === window.DOORS_CFG.libraryDoor || nextNum >= window.DOORS_CFG.finalDoor || nextNum >= 90 || (nextNum >= 35 && nextNum <= 38) || (nextNum >= 75 && nextNum <= 78);
                    if (!isSpecialDoor && nextNum >= 4 && st.hazard !== 'keyroom' && Math.random() < 0.28) {
                        window.doorsStartKeyRoom(nextNum);
                        return;
                    }
                    window.doorsOnDoorEntered();
                } else {
                    card.style.background = '#450a0a';
                    card.innerHTML = '<div style="margin:auto;font-size:2.4rem;">👁️</div><div style="color:#fca5a5;font-weight:bold;">DUPE!</div>';
                    window.doorsDamage(35, 'Attacked by Dupe behind Door ' + String(picked).padStart(4, '0'), 'dupe');
                }
            };
        });
    };
}
function startDoorsLibrary() {
    window.doorsStartLibrary = function () {
        const st = window.DOORS_STATE;
        const cfg = window.DOORS_CFG;
        st.hazard = 'figure';
        st.hiding = false;
        st.booksFound = [];
        st.inputDigits = [];
        st.figureDist = 95;
        
        const closetBtn = document.getElementById('doors-closet-btn');
        const breathWrap = document.getElementById('doors-breath-wrap');
        if (closetBtn) closetBtn.style.display = 'none';
        if (breathWrap) breathWrap.style.display = 'inline';
        
        st.codeDigits = cfg.shapes.map(s => ({
            ...s,
            digit: Math.floor(Math.random() * 10)
        }));
        
        window.doorsSetBanner('DOOR 0050: THE LIBRARY — Collect 4 books, enter the padlock code, and hold [SPACE] when Figure nears!', '#fbbf24');
        window.doorsRenderLibraryScene();
        
        window.doorsAddInterval(() => {
            if (!st.active || st.door !== cfg.libraryDoor) return;
            const breathVal = document.getElementById('doors-breath-val');
            const dangerEl = document.getElementById('figure-proximity');
            
            if (st.holdingBreath && st.breath > 0) {
                st.breath = Math.max(0, st.breath - 4);
            } else {
                st.holdingBreath = false;
                st.breath = Math.min(100, st.breath + 3);
            }
            if (breathVal) breathVal.textContent = st.breath + '%';
            
            st.figureDist -= st.holdingBreath ? 2 : 7;
            if (st.figureDist <= 0) {
                if (!st.holdingBreath) {
                    window.doorsDamage(50, 'Figure heard your heartbeat in The Library', 'figure');
                } else {
                    window.doorsSetBanner('Figure walked right past you... Quiet!', '#93c5fd');
                }
                st.figureDist = 90;
            }
            
            if (dangerEl) {
                if (st.figureDist <= 30) {
                    dangerEl.textContent = '⚠️ FIGURE IS RIGHT NEXT TO YOU — HOLD [SPACE]!';
                    dangerEl.style.color = '#ef4444';
                } else {
                    dangerEl.textContent = '👣 Figure Footsteps Distance: ' + st.figureDist + 'm';
                    dangerEl.style.color = '#d6d3d1';
                }
            }
        }, 250);
    };
    
    window.doorsRenderLibraryScene = function () {
        const st = window.DOORS_STATE;
        const cfg = window.DOORS_CFG;
        const stage = document.getElementById('doors-stage');
        if (!stage) return;
        
        const allBooksFound = st.booksFound.length === 4;
        const padNumbers = Array.from({ length: 10 }, (_, n) => n);
        
        stage.innerHTML = `
            <div style="width:100%;height:100%;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
                <div style="display:flex;justify-content:space-between;align-items:center;background:#1c130b;padding:8px 14px;border-radius:8px;border:1px solid #4a3520;">
                    <span id="figure-proximity" style="font-weight:bold;color:#d6d3d1;">👣 Figure Footsteps Distance: ${st.figureDist}m</span>
                    <span style="color:#fde68a;">Books Found: ${st.booksFound.length} / 4</span>
                </div>
        
                <div style="position:relative;flex:1;margin:10px 0;background:repeating-linear-gradient(90deg,#1f140b 0px,#1f140b 60px,#120b06 60px,#120b06 90px);border:1px solid #3f2a17;border-radius:8px;">
                    ${st.codeDigits.map((item, idx) => {
        const found = st.booksFound.includes(item.id);
        const pos = cfg.knobs[idx];
        if (found) return '';
        return `<button class="lib-book-btn" data-id="${item.id}" style="position:absolute;left:${pos.x}%;top:${pos.y}%;transform:translate(-50%,-50%);background:#291a0e;color:${item.color};border:2px solid ${item.color};border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;box-shadow:0 0 14px ${item.color};">📕 ${item.symbol}</button>`;
    }).join('')}
    
                    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#140e09;border:2px solid #9a6b32;border-radius:10px;padding:14px 18px;text-align:center;min-width:290px;">
                        <div style="font-size:0.85rem;color:#d6b88d;margin-bottom:8px;">DOOR 0050 PADLOCK</div>
                        <div style="display:flex;justify-content:center;gap:10px;margin-bottom:10px;">
                            ${st.codeDigits.map(item => {
    const unlocked = st.booksFound.includes(item.id);
    return `<div style="background:#26190e;border:1px solid #785226;padding:4px 10px;border-radius:4px;">
                                    <div style="color:${item.color};font-size:1rem;">${item.symbol}</div>
                                    <div style="font-weight:bold;font-size:1.1rem;">${unlocked ? item.digit : '?'}</div>
                                </div>`;
}).join('')}
                        </div>
                        <div style="font-size:0.9rem;color:#fde68a;margin-bottom:8px;">
                            Entered: <b>${st.inputDigits.join(' - ') || '_ - _ - _ - _'}</b>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;">
                            ${padNumbers.map(n => `<button class="padlock-digit" data-digit="${n}" style="background:#2d1e12;color:#f5ebd6;border:1px solid #6b4c2a;padding:5px;border-radius:4px;cursor:pointer;font-weight:bold;">${n}</button>`).join('')}
                        </div>
                        ${allBooksFound ? '<div style="margin-top:6px;font-size:0.75rem;color:#86efac;">All clues found! Enter the 4 digits in order.</div>' : ''}
                    </div>
                </div>
            </div>
        `;

stage.querySelectorAll('.lib-book-btn').forEach(btn => {
    btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        if (!st.booksFound.includes(id)) {
            st.booksFound.push(id);
            window.doorsRenderLibraryScene();
        }
    };
});

stage.querySelectorAll('.padlock-digit').forEach(btn => {
    btn.onclick = () => {
        const d = parseInt(btn.getAttribute('data-digit'), 10);
        st.inputDigits.push(d);
        if (st.inputDigits.length === 4) {
            const correct = st.codeDigits.every((item, i) => item.digit === st.inputDigits[i]);
            if (correct) {
                st.door = 51;
                st.hazard = null;
                window.doorsSetBanner('✨ Door 0050 unlocked! Continue up to Door 0100!', '#67e8f9');
                window.doorsRenderCorridor();
                return;
            } else {
                st.inputDigits = [];
                st.figureDist = Math.max(15, st.figureDist - 25);
                window.doorsSetBanner('❌ Wrong code! The padlock clanked and alerted Figure!', '#f87171');
            }
        }
        window.doorsRenderLibraryScene();
    };
});
};
}
function startDoorsFinaleAndRun() {
    window.doorsStartElectricalRoom = function () {
        const st = window.DOORS_STATE;
        st.hazard = 'breaker';
        st.breakersFlipped = [];
        st.figureDist = 85;
        
        const closetBtn = document.getElementById('doors-closet-btn');
        const breathWrap = document.getElementById('doors-breath-wrap');
        if (closetBtn) closetBtn.style.display = 'none';
        if (breathWrap) breathWrap.style.display = 'inline';
        
        window.doorsSetBanner('⚡ DOOR 0100: THE ELECTRICAL ROOM — Flip all 6 elevator breakers while avoiding Figure!', '#38bdf8');
        window.doorsRenderElectricalScene();
        
        window.doorsAddInterval(() => {
            if (!st.active || st.door < window.DOORS_CFG.finalDoor) return;
            const breathVal = document.getElementById('doors-breath-val');
            const dangerEl = document.getElementById('breaker-proximity');
            
            if (st.holdingBreath && st.breath > 0) {
                st.breath = Math.max(0, st.breath - 4);
            } else {
                st.holdingBreath = false;
                st.breath = Math.min(100, st.breath + 3);
            }
            if (breathVal) breathVal.textContent = st.breath + '%';
            
            st.figureDist -= st.holdingBreath ? 2 : 8;
            if (st.figureDist <= 0) {
                if (!st.holdingBreath) {
                    window.doorsDamage(55, 'Figure caught you at the Elevator Breaker', 'breaker');
                } else {
                    window.doorsSetBanner('Figure stomped past the breaker panel... Quiet!', '#93c5fd');
                }
                st.figureDist = 80;
            }
            
            if (dangerEl) {
                if (st.figureDist <= 28) {
                    dangerEl.textContent = '⚠️ FIGURE IS AT THE BREAKER PANEL — HOLD [SPACE]!';
                    dangerEl.style.color = '#ef4444';
                } else {
                    dangerEl.textContent = '👣 Figure Distance: ' + st.figureDist + 'm';
                    dangerEl.style.color = '#d6d3d1';
                }
            }
        }, 250);
    };
    
    window.doorsRenderElectricalScene = function () {
        const st = window.DOORS_STATE;
        const stage = document.getElementById('doors-stage');
        if (!stage) return;
        
        const switches = Array.from({ length: 6 }, (_, i) => i + 1);
        
        stage.innerHTML = `
            <div style="width:100%;height:100%;padding:20px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at center,#0f172a 0%,#020617 100%);">
                <div style="display:flex;justify-content:space-between;align-items:center;background:#1e293b;padding:10px 16px;border-radius:8px;border:1px solid #334155;">
                    <span id="breaker-proximity" style="font-weight:bold;color:#d6d3d1;">👣 Figure Distance: ${st.figureDist}m</span>
                    <span style="color:#38bdf8;font-weight:bold;">Elevator Power: ${st.breakersFlipped.length} / 6</span>
                </div>
        
                <div style="margin:auto;background:#0f172a;border:2px solid #475569;border-radius:12px;padding:20px 28px;text-align:center;box-shadow:0 0 40px rgba(0,0,0,0.9);">
                    <div style="font-size:1rem;color:#94a3b8;letter-spacing:2px;margin-bottom:14px;">ELEVATOR CIRCUIT BREAKER</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                        ${switches.map(n => {
        const on = st.breakersFlipped.includes(n);
        return `<button class="breaker-btn" data-sw="${n}" style="padding:14px 18px;border-radius:8px;font-weight:bold;cursor:pointer;border:2px solid ${on ? '#22d3ee' : '#475569'};background:${on ? '#083344' : '#1e293b'};color:${on ? '#67e8f9' : '#cbd5e1'};">
                                SWITCH #${n}<br><span style="font-size:0.8rem;">${on ? '⚡ ON' : 'OFF'}</span>
                            </button>`;
    }).join('')}
                    </div>
                </div>
            </div>
        `;
    
    stage.querySelectorAll('.breaker-btn').forEach(btn => {
        btn.onclick = () => {
            const sw = parseInt(btn.getAttribute('data-sw'), 10);
            if (!st.breakersFlipped.includes(sw)) {
                st.breakersFlipped.push(sw);
                if (st.breakersFlipped.length === 6) {
                    window.doorsEndScreen(true, 'You restored elevator power at Door 0100 and escaped The Hotel!');
                    return;
                }
                window.doorsRenderElectricalScene();
            }
        };
    });
};

window.doorsOnDoorEntered = function () {
    const st = window.DOORS_STATE;
    st.hiding = false;
    const btn = document.getElementById('doors-closet-btn');
    if (btn) {
        btn.textContent = '🚪 HIDE IN CLOSET [C]';
        btn.style.background = '#2d1f14';
    }
    
    window.doorsRenderCorridor();
    
    if (st.door === window.DOORS_CFG.libraryDoor || st.door >= window.DOORS_CFG.finalDoor) return;
    
    if ((st.door >= 35 && st.door <= 38) || (st.door >= 75 && st.door <= 78)) {
        window.doorsAddTimer(() => window.doorsTriggerSeekDodge(), 350);
        return;
    }
    
    const roll = Math.random();
    if (st.door >= 90) {
        if (roll < 0.45) {
            window.doorsAddTimer(() => window.doorsTriggerRushOrAmbush(false), 450);
        } else if (roll < 0.8) {
            window.doorsAddTimer(() => window.doorsTriggerScreech(), 600);
        } else {
            window.doorsSetBanner('🌿 The Greenhouse is pitch dark... Watch your step.', '#86efac');
        }
        return;
    }
    
    if (roll < 0.26) {
        window.doorsAddTimer(() => window.doorsTriggerRushOrAmbush(false), 450);
    } else if (roll < 0.40 && st.door > 15) {
        window.doorsAddTimer(() => window.doorsTriggerRushOrAmbush(true), 450);
    } else if (roll < 0.62) {
        window.doorsAddTimer(() => window.doorsTriggerScreech(), 650);
    } else if (roll < 0.78 && st.door > 10) {
        window.doorsTriggerEyes();
    } else {
        window.doorsSetBanner('The hallway is quiet... Keep moving toward Door 0100.', '#a89070');
    }
};

window.doorsEndScreen = function (won, summary) {
    const st = window.DOORS_STATE;
    st.active = false;
    window.doorsClearAllAsync();
    
    const stage = document.getElementById('doors-stage');
    const closetBtn = document.getElementById('doors-closet-btn');
    const guideBtn = document.getElementById('doors-guide-btn');
    if (closetBtn) closetBtn.style.display = 'none';
    if (guideBtn) guideBtn.style.display = 'none';
    if (!stage) return;
    
    let newBalance = null;
    if (won) {
        newBalance = window.doorsAwardCoins(window.DOORS_CFG.rewardCoins);
    }
    
    const guidingAdvice = window.DOORS_CFG.guidingTips[st.lastKiller] || window.DOORS_CFG.guidingTips.rush;
    
    stage.innerHTML = `
            <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;background:${won ? 'radial-gradient(circle,#14532d 0%,#052e16 100%)' : 'radial-gradient(circle,#083344 0%,#020617 100%)'};">
                <div style="font-size:2.2rem;margin-bottom:8px;color:${won ? '#fde047' : '#67e8f9'};text-shadow:0 0 20px ${won ? '#eab308' : '#06b6d4'};">
                    ${won ? '🏆 DOOR 0100 ELEVATOR ESCAPE!' : '✨ GUIDING LIGHT'}
                </div>
                <p style="color:${won ? '#dcfce7' : '#cffafe'};font-size:1.05rem;max-width:540px;line-height:1.5;margin-bottom:16px;">
                    ${won ? summary : guidingAdvice}
                </p>
                ${won ? `<div style="background:#052e16;border:1px solid #4ade80;color:#bbf7d0;padding:10px 18px;border-radius:8px;margin-bottom:18px;font-weight:bold;">+${window.DOORS_CFG.rewardCoins} AFCS COINS (Balance: ${newBalance} 🪙)</div>` : `<div style="font-size:0.85rem;color:#7dd3fc;margin-bottom:16px;">Reached Door ${String(st.door).padStart(4, '0')} / 0100</div>`}
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="doors-retry-btn" style="background:${won ? '#854d0e' : '#0e7490'};color:#fff;border:1px solid ${won ? '#eab308' : '#22d3ee'};padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;">↻ PLAY AGAIN</button>
                    <button id="doors-done-btn" style="background:#1e293b;color:#e2e8f0;border:1px solid #475569;padding:10px 20px;border-radius:6px;cursor:pointer;">EXIT</button>
                </div>
            </div>
        `;
    
    document.getElementById('doors-retry-btn').onclick = window.launchDoorsGame;
    document.getElementById('doors-done-btn').onclick = window.doorsCloseGame;
};

window.doorsCloseGame = function () {
    window.DOORS_STATE.active = false;
    window.doorsClearAllAsync();
    const modal = document.getElementById('doors-game-modal');
    if (modal) modal.remove();
};

window.launchDoorsGame = function () {
    if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('doors');
    if (!window.doorsBuildModal) startDoorsCore();
    if (!window.doorsRenderCorridor) startDoorsCorridor();
    if (!window.doorsFlickerLights) startDoorsEntities();
    if (!window.doorsStartLibrary) startDoorsLibrary();
    window.doorsClearAllAsync();
    const st = window.DOORS_STATE;
    st.active = true;
    st.door = window.DOORS_CFG.startDoor;
    st.hp = window.DOORS_CFG.maxHp;
    st.hiding = false;
    st.breath = 100;
    st.holdingBreath = false;
    st.hazard = null;
    window.doorsBuildModal();
    window.doorsRenderCorridor();
};
if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
    STATE.onSearchInput.push(function (query) {
        const clean = String(query || '').trim().toLowerCase();
        if (window.DOORS_CFG.triggers.includes(clean)) {
            window.launchDoorsGame();
        }
    });
}
}
function startDoorsKeyRoom() {
    if (window.DOORS_CFG && window.DOORS_CFG.guidingTips) {
        window.DOORS_CFG.guidingTips.timothy = 'You got startled by Timothy hiding inside a drawer. Keep your health up and search carefully for the glowing Room Key.';
    }
    
    window.doorsStartKeyRoom = function (targetDoor) {
        const st = window.DOORS_STATE;
        st.hazard = 'keyroom';
        st.hasKey = false;
        st.keyTargetDoor = targetDoor;
        st.roomYaw = 0;
        
        const keyIdx = Math.floor(Math.random() * 5);
        const timothyIdx = (keyIdx + 1 + Math.floor(Math.random() * 3)) % 5;
        
        st.roomSpots = [
            { id: 0, label: 'Left Dresser Top', wall: 'left', x: 16, y: 46, opened: false, loot: 'empty' },
            { id: 1, label: 'Left Nightstand', wall: 'left', x: 24, y: 68, opened: false, loot: 'empty' },
            { id: 2, label: 'Center Reception Desk', wall: 'center', x: 50, y: 66, opened: false, loot: 'empty' },
            { id: 3, label: 'Right Wardrobe Drawer', wall: 'right', x: 76, y: 68, opened: false, loot: 'empty' },
            { id: 4, label: 'Right Bookshelf Box', wall: 'right', x: 84, y: 44, opened: false, loot: 'empty' }
        ];
        
        st.roomSpots[keyIdx].loot = 'key';
        st.roomSpots[timothyIdx].loot = 'timothy';
        st.roomSpots.forEach((spot, i) => {
            if (spot.loot === 'empty' && i % 2 === 0) spot.loot = 'coins';
        });
        
        window.doorsSetBanner('🔒 Door ' + String(targetDoor).padStart(4, '0') + ' is LOCKED! Pan the 3D room ([A]/[D]) and search drawers for the Key!', '#fbbf24');
        window.doorsRender3DKeyRoom();
        
        window.doorsAddTimer(() => {
            if (st.active && st.hazard === 'keyroom' && !st.hasKey) {
                window.doorsGuideKeyRoom();
            }
        }, 6500);
    };
    
    window.doorsGuideKeyRoom = function () {
        const st = window.DOORS_STATE;
        if (!st.active || st.hazard !== 'keyroom') return;
        if (st.hasKey) {
            st.roomYaw = 0;
            window.doorsRender3DKeyRoom();
            window.doorsSetBanner('✨ Guiding Light: You have the key! Click the locked door in the center!', '#67e8f9');
            return;
        }
        const keySpot = st.roomSpots.find(s => s.loot === 'key');
        if (!keySpot) return;
        st.roomYaw = keySpot.wall === 'left' ? 24 : (keySpot.wall === 'right' ? -24 : 0);
        window.doorsRender3DKeyRoom();
        const el = document.querySelector(`.doors-3d-drawer[data-spot="${keySpot.id}"]`);
        if (el) {
            el.style.borderColor = '#22d3ee';
            el.style.boxShadow = '0 0 28px 8px rgba(34,211,238,0.9)';
        }
        window.doorsSetBanner('✨ Guiding Light shimmers toward the ' + keySpot.label + '!', '#67e8f9');
    };
    
    window.doorsPan3DRoom = function (deltaYaw) {
        const st = window.DOORS_STATE;
        if (!st.active || st.hazard !== 'keyroom') return;
        st.roomYaw = Math.max(-28, Math.min(28, (st.roomYaw || 0) + deltaYaw));
        const world = document.getElementById('doors-3d-world');
        if (world) {
            world.style.transform = 'translateZ(60px) rotateY(' + st.roomYaw + 'deg)';
        }
    };
    
    window.doorsRender3DKeyRoom = function () {
        const st = window.DOORS_STATE;
        const stage = document.getElementById('doors-stage');
        if (!stage) return;
        
        const targetStr = String(st.keyTargetDoor).padStart(4, '0');
        
        stage.innerHTML = `
            <div style="position:relative;width:100%;height:100%;perspective:880px;overflow:hidden;background:#070504;">
                <div style="position:absolute;top:10px;left:12px;right:12px;z-index:50;display:flex;justify-content:space-between;align-items:center;pointer-events:none;">
                    <div style="background:rgba(20,14,9,0.92);border:1px solid #785226;padding:6px 12px;border-radius:6px;font-size:0.85rem;color:${st.hasKey ? '#fde047' : '#a89070'};">
                        ${st.hasKey ? '🗝️ KEY ' + targetStr + ' ACQUIRED' : '🔍 KEY ' + targetStr + ': MISSING'}
                    </div>
                    <div style="display:flex;gap:8px;pointer-events:auto;">
                        <button id="doors-pan-left" style="background:#291a0e;color:#f5ebd6;border:1px solid #8c663e;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:bold;">◀ LOOK LEFT [A]</button>
                        <button id="doors-pan-center" style="background:#291a0e;color:#f5ebd6;border:1px solid #8c663e;padding:6px 10px;border-radius:6px;cursor:pointer;">●</button>
                        <button id="doors-pan-right" style="background:#291a0e;color:#f5ebd6;border:1px solid #8c663e;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:bold;">LOOK RIGHT [D] ▶</button>
                    </div>
                </div>
        
                <div id="doors-3d-world" style="position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:translateZ(60px) rotateY(${st.roomYaw || 0}deg);transition:transform 0.35s cubic-bezier(0.22,1,0.36,1);">
                    <div style="pointer-events:none;position:absolute;inset:-40px -120px;background:linear-gradient(180deg,#120b07 0%,#26180d 55%,#140c06 100%);transform:translateZ(-180px);"></div>
        
                    <div style="pointer-events:none;position:absolute;left:-140px;right:-140px;bottom:-60px;height:220px;background:repeating-linear-gradient(90deg,#1f130a 0px,#1f130a 48px,#140c06 48px,#140c06 52px);transform:rotateX(76deg) translateZ(-90px);border-top:2px solid #3d2817;"></div>
        
                    <div style="pointer-events:none;position:absolute;left:-140px;right:-140px;top:-60px;height:200px;background:radial-gradient(circle,#2e1d10 0%,#0a0604 100%);transform:rotateX(-76deg) translateZ(-90px);"></div>
        
                    <div style="pointer-events:none;position:absolute;left:-90px;top:10px;bottom:10px;width:240px;background:linear-gradient(90deg,#1a1008,#2e1d10);border-right:3px solid #4a3019;transform:rotateY(62deg) translateZ(-80px);"></div>
        
                    <div style="pointer-events:none;position:absolute;right:-90px;top:10px;bottom:10px;width:240px;background:linear-gradient(-90deg,#1a1008,#2e1d10);border-left:3px solid #4a3019;transform:rotateY(-62deg) translateZ(-80px);"></div>
        
                    <div id="doors-3d-locked-door" style="pointer-events:auto;position:absolute;left:50%;top:52%;width:154px;height:265px;transform:translate(-50%,-50%) translateZ(0px);background:linear-gradient(180deg,#4a3019 0%,#26160a 100%);border:4px solid ${st.hasKey ? '#eab308' : '#6b4726'};border-radius:8px 8px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:18px 10px;cursor:pointer;z-index:10;box-shadow:0 0 ${st.hasKey ? '32px rgba(234,179,8,0.6)' : '24px #000'};">
                        <div style="background:#1c1208;border:2px solid #b88946;padding:4px 14px;border-radius:4px;font-weight:bold;font-size:1.1rem;color:#f5d08a;letter-spacing:2px;">
                            ${targetStr}
                        </div>
                        <div style="font-size:2rem;">${st.hasKey ? '🔓' : '🔒'}</div>
                        <div style="font-size:0.75rem;color:${st.hasKey ? '#fde047' : '#a89070'};font-weight:bold;">
                            ${st.hasKey ? 'CLICK TO UNLOCK' : 'LOCKED'}
                        </div>
                    </div>
        
                    ${st.roomSpots.map(spot => {
        const wallRot = spot.wall === 'left' ? 'rotateY(28deg)' : (spot.wall === 'right' ? 'rotateY(-28deg)' : 'rotateY(0deg)');
        const bg = spot.opened ? '#140d08' : '#3b2412';
        const border = spot.opened ? '#4a3520' : '#8c6239';
        let icon = '🗄️';
        if (spot.opened) {
            icon = spot.loot === 'key' ? '🗝️' : (spot.loot === 'coins' ? '🪙' : (spot.loot === 'timothy' ? '🕷️' : '💨'));
        }
        return `
                            <button class="doors-3d-drawer" data-spot="${spot.id}" style="pointer-events:auto;position:absolute;left:${spot.x}%;top:${spot.y}%;transform:translate(-50%,-50%) translateZ(25px) ${wallRot};width:118px;height:68px;background:${bg};border:2px solid ${border};border-radius:6px;color:#f5ebd6;cursor:pointer;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 10px 22px rgba(0,0,0,0.85);transition:transform 0.15s,box-shadow 0.25s;">
                                <span style="font-size:1.25rem;">${icon}</span>
                                <span style="font-size:0.68rem;color:#d6b88d;">${spot.opened ? 'OPENED' : spot.label}</span>
                            </button>
                        `;
    }).join('')}
                </div>
            </div>
        `;
    
    document.getElementById('doors-pan-left').onclick = () => window.doorsPan3DRoom(22);
    document.getElementById('doors-pan-center').onclick = () => {
        st.roomYaw = 0;
        window.doorsPan3DRoom(0);
    };
    document.getElementById('doors-pan-right').onclick = () => window.doorsPan3DRoom(-22);
    
    document.getElementById('doors-3d-locked-door').onclick = () => {
        if (!st.hasKey) {
            window.doorsSetBanner('🔒 It is locked! Search the 3D drawers on the left and right walls for Key ' + targetStr + '.', '#f87171');
            return;
        }
        st.door = st.keyTargetDoor;
        st.hazard = null;
        st.hasKey = false;
        window.doorsSetBanner('🗝️ Unlocked Door ' + targetStr + '!', '#86efac');
        window.doorsOnDoorEntered();
    };
    
    stage.querySelectorAll('.doors-3d-drawer').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-spot'), 10);
            const spot = st.roomSpots[idx];
            if (!spot || spot.opened) return;
            spot.opened = true;
            
            if (spot.loot === 'key') {
                st.hasKey = true;
                window.doorsSetBanner('🗝️ You found the Room Key! Pan back to the center and unlock Door ' + targetStr + '!', '#fde047');
            } else if (spot.loot === 'coins') {
                const bal = window.doorsAwardCoins(5);
                window.doorsSetBanner('🪙 Found +5 AFCS Coins inside the drawer! (Balance: ' + bal + ' 🪙)', '#fde68a');
            } else if (spot.loot === 'timothy') {
                window.doorsDamage(5, '🕷️ Timothy jumped out of the drawer!', 'timothy');
            } else {
                window.doorsSetBanner('Nothing inside that drawer... Keep searching!', '#a89070');
            }
            window.doorsRender3DKeyRoom();
        };
    });
};
}
function startBurjElevatorData() {
    window.ELEV_CFG = {
        triggers: Array.of('burj', 'burj khalifa', 'elevator', '163', 'lockdown', 'dubai'),
        rewardCoins: 300,
        startTime: 180,
        totalClassmates: 26,
        floors: Array.of(
            { floor: 15, type: 'circuit', rescued: 3, title: 'FLOOR 015 — LOWER ATRIUM RELAY', lore: 'Picked up 3 classmates near the fountain lobby! Reroute the relay grid.' },
            { floor: 32, type: 'keypad', rescued: 3, title: 'FLOOR 032 — SECURITY CHECKPOINT ALPHA', lore: '6 classmates aboard. Memorize the 5-digit security passkey!' },
            { floor: 54, type: 'mirrors', rescued: 2, title: 'FLOOR 054 — SKYBRIDGE OPTICS', lore: '8 classmates aboard. Align all 4 infrared prisms to clear the shaft.' },
            { floor: 71, type: 'breakers', rescued: 3, title: 'FLOOR 071 — AUXILIARY POWER SUBSTATION', lore: '11 classmates aboard. Energize all 6 elevator circuit breakers!' },
            { floor: 88, type: 'brake', rescued: 3, title: 'FLOOR 088 — MID-TOWER TRANSFER BRAKE', lore: '14 classmates aboard. Lock the magnetic brake inside the green zone!' },
            { floor: 108, type: 'circuit', rescued: 3, title: 'FLOOR 108 — HIGH-ZONE RELAY JUNCTION', lore: '17 classmates aboard. Match all 5 high-voltage relay nodes!' },
            { floor: 124, type: 'keypad', rescued: 3, title: 'FLOOR 124 — AT THE TOP OBSERVATION GATE', lore: '20 classmates aboard. Bypass the 6-digit observation deck keypad!' },
            { floor: 140, type: 'mirrors', rescued: 3, title: 'FLOOR 140 — LASER CONTAINMENT SHAFT', lore: '23 classmates aboard. Rotate all 5 optical prisms to 0 degrees!' },
            { floor: 155, type: 'breakers', rescued: 2, title: 'FLOOR 155 — SPIRE GENERATOR CORE', lore: '25 classmates aboard. Restore main spire power across all 6 switches!' },
            { floor: 163, type: 'brake', rescued: 1, title: 'FLOOR 163 — CORNERSTONE SUMMIT OVERRIDE', lore: 'All 26 classmates aboard! Engage the Psalms 118:22 Cornerstone Brake!' }
        )
    };
    
    window.ELEV_STATE = {
        active: false,
        stageIdx: 0,
        currentFloor: 1,
        rescuedCount: 1,
        timeLeft: 180,
        heat: 0,
        circuitNodes: Array.of(),
        mirrorAngles: Array.of(),
        pinCode: Array.of(),
        pinInput: Array.of(),
        pinShowing: false,
        breakers: Array.of(),
        brakePos: 0,
        brakeDir: 1,
        brakeTargetStart: 42,
        brakeTargetWidth: 16,
        timers: Array.of(),
        intervals: Array.of(),
        listeners: Array.of()
    };
    
    window.elevAddTimer = function (fn, ms) {
        const id = setTimeout(fn, ms);
        window.ELEV_STATE.timers.push(id);
        return id;
    };
    
    window.elevAddInterval = function (fn, ms) {
        const id = setInterval(fn, ms);
        window.ELEV_STATE.intervals.push(id);
        return id;
    };
    
    window.elevClearAsync = function () {
        const st = window.ELEV_STATE;
        st.timers.forEach(clearTimeout);
        st.intervals.forEach(clearInterval);
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.timers = Array.of();
        st.intervals = Array.of();
        st.listeners = Array.of();
    };
    
    window.elevAwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
}
function startBurjElevatorPuzzlesA() {
    window.elevRenderCircuit = function () {
        const st = window.ELEV_STATE;
        const arena = document.getElementById('elev-arena');
        if (!arena) return;
        
        const count = st.stageIdx >= 5 ? 5 : 4;
        if (st.circuitNodes.length === 0) {
            st.circuitNodes = Array.from({ length: count }, (_, i) => ({
                id: i,
                target: (i * 2 + 1) % 4,
                val: Math.floor(Math.random() * 4)
            }));
            if (st.circuitNodes.every(n => n.val === n.target)) {
                st.circuitNodes.at(0).val = (st.circuitNodes.at(0).val + 1) % 4;
            }
        }
        
        const symbols = Array.of('⚡', '🔷', '🔶', '💠');
        
        arena.innerHTML = `
            <div style="text-align:center;max-width:580px;width:100%;">
                <div style="font-size:0.85rem;color:#38bdf8;letter-spacing:2px;margin-bottom:6px;">MATCH EACH RELAY NODE TO ITS TARGET SYMBOL</div>
                <div style="display:grid;grid-template-columns:repeat(${count},1fr);gap:10px;margin:16px 0;">
                    ${st.circuitNodes.map(node => {
        const matched = node.val === node.target;
        return `
                            <div style="background:#0f172a;border:2px solid ${matched ? '#22c55e' : '#334155'};border-radius:10px;padding:10px 6px;">
                                <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:4px;">TARGET: ${symbols.at(node.target)}</div>
                                <button class="elev-node-btn" data-id="${node.id}" style="width:100%;padding:12px 0;font-size:1.5rem;background:${matched ? '#14532d' : '#1e293b'};border:1px solid ${matched ? '#4ade80' : '#475569'};border-radius:8px;cursor:pointer;">
                                    ${symbols.at(node.val)}
                                </button>
                                <div style="font-size:0.68rem;color:${matched ? '#86efac' : '#f87171'};margin-top:6px;font-weight:bold;">
                                    ${matched ? 'LOCKED' : 'CYCLE'}
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
        `;
    
    arena.querySelectorAll('.elev-node-btn').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            const node = st.circuitNodes.at(id);
            if (!node) return;
            node.val = (node.val + 1) % 4;
            window.elevAddHeat(3);
            if (st.circuitNodes.every(n => n.val === n.target)) {
                st.circuitNodes = Array.of();
                window.elevAdvanceStage();
                return;
            }
            window.elevRenderCircuit();
        };
    });
};

window.elevRenderMirrors = function () {
    const st = window.ELEV_STATE;
    const arena = document.getElementById('elev-arena');
    if (!arena) return;
    
    if (st.mirrorAngles.length === 0) {
        st.mirrorAngles = st.stageIdx >= 5
        ? Array.of(90, 180, 270, 90, 180)
        : Array.of(90, 180, 270, 90);
    }
    
    arena.innerHTML = `
            <div style="text-align:center;max-width:580px;width:100%;">
                <div style="font-size:0.85rem;color:#38bdf8;letter-spacing:2px;margin-bottom:6px;">ROTATE ALL OPTICAL PRISMS TO 0° (ALIGN LASER BEAM)</div>
                <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0;">
                    <span style="font-size:1.4rem;">🔦</span>
                    ${st.mirrorAngles.map((deg, idx) => {
    const aligned = deg % 360 === 0;
    return `
                            <button class="elev-prism-btn" data-idx="${idx}" style="width:76px;height:76px;background:${aligned ? '#083344' : '#1e293b'};border:2px solid ${aligned ? '#22d3ee' : '#475569'};border-radius:12px;color:${aligned ? '#67e8f9' : '#cbd5e1'};cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:${aligned ? '0 0 20px rgba(34,211,238,0.45)' : 'none'};">
                                <span style="font-size:1.5rem;display:inline-block;transform:rotate(${deg}deg);transition:transform 0.2s;">💠</span>
                                <span style="font-size:0.72rem;margin-top:6px;font-weight:bold;">${deg % 360}°</span>
                            </button>
                        `;
}).join('')}
                    <span style="font-size:1.4rem;">🎯</span>
                </div>
            </div>
        `;

arena.querySelectorAll('.elev-prism-btn').forEach(btn => {
    btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        st.mirrorAngles[idx] = (st.mirrorAngles.at(idx) + 90) % 360;
        window.elevAddHeat(3);
        if (st.mirrorAngles.every(deg => deg % 360 === 0)) {
            st.mirrorAngles = Array.of();
            window.elevAdvanceStage();
            return;
        }
        window.elevRenderMirrors();
    };
});
};
}
function startBurjElevatorPuzzlesB() {
    window.elevStartKeypad = function () {
        const st = window.ELEV_STATE;
        const len = st.stageIdx >= 5 ? 6 : 5;
        st.pinCode = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
        st.pinInput = Array.of();
        st.pinShowing = true;
        window.elevRenderKeypad();
        
        window.elevAddTimer(() => {
            if (!st.active) return;
            st.pinShowing = false;
            window.elevRenderKeypad();
        }, 2400);
    };
    
    window.elevRenderKeypad = function () {
        const st = window.ELEV_STATE;
        const arena = document.getElementById('elev-arena');
        if (!arena) return;
        
        const digits = Array.from({ length: 9 }, (_, i) => i + 1);
        const displayCode = st.pinShowing
        ? st.pinCode.join(' - ')
        : (st.pinInput.join(' - ') || Array.from({ length: st.pinCode.length }, () => '_').join(' - '));
        
        arena.innerHTML = `
            <div style="text-align:center;max-width:340px;width:100%;">
                <div style="font-size:0.82rem;color:${st.pinShowing ? '#fde047' : '#38bdf8'};letter-spacing:1.5px;margin-bottom:8px;">
                    ${st.pinShowing ? 'MEMORIZE THIS SECURITY CODE!' : 'ENTER THE ' + st.pinCode.length + '-DIGIT CODE'}
                </div>
                <div style="background:#0f172a;border:2px solid #38bdf8;border-radius:10px;padding:10px;font-size:1.35rem;font-weight:bold;letter-spacing:3px;color:#f8fafc;margin-bottom:14px;">
                    ${displayCode}
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${digits.map(n => `
                        <button class="elev-pin-btn" data-num="${n}" style="padding:12px;font-size:1.15rem;font-weight:bold;background:#1e293b;color:#f8fafc;border:1px solid #475569;border-radius:8px;cursor:pointer;">
                            ${n}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        arena.querySelectorAll('.elev-pin-btn').forEach(btn => {
            btn.onclick = () => {
                if (st.pinShowing) return;
                const num = parseInt(btn.getAttribute('data-num'), 10);
                st.pinInput.push(num);
                const idx = st.pinInput.length - 1;
                if (st.pinInput.at(idx) !== st.pinCode.at(idx)) {
                    window.elevAddHeat(8);
                    window.elevSetBanner('❌ Wrong digit! Generating new security code (+8% Heat)...', '#f87171');
                    window.elevStartKeypad();
                    return;
                }
                if (st.pinInput.length === st.pinCode.length) {
                    st.pinCode = Array.of();
                    st.pinInput = Array.of();
                    window.elevAdvanceStage();
                    return;
                }
                window.elevRenderKeypad();
            };
        });
    };
    
    window.elevRenderBreakers = function () {
        const st = window.ELEV_STATE;
        const arena = document.getElementById('elev-arena');
        if (!arena) return;
        
        if (st.breakers.length === 0) {
            st.breakers = Array.from({ length: 6 }, (_, i) => ({
                id: i + 1,
                on: false
            }));
        }
        
        arena.innerHTML = `
            <div style="text-align:center;max-width:460px;width:100%;">
                <div style="font-size:0.85rem;color:#38bdf8;letter-spacing:2px;margin-bottom:12px;">ACTIVATE ALL 6 HIGH-VOLTAGE BREAKERS</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                    ${st.breakers.map(b => `
                        <button class="elev-brk-btn" data-id="${b.id}" style="padding:16px 10px;border-radius:10px;font-weight:bold;cursor:pointer;border:2px solid ${b.on ? '#22d3ee' : '#475569'};background:${b.on ? '#083344' : '#1e293b'};color:${b.on ? '#67e8f9' : '#cbd5e1'};">
                            BREAKER #${b.id}<br>
                            <span style="font-size:0.8rem;">${b.on ? '⚡ ONLINE' : 'OFFLINE'}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        arena.querySelectorAll('.elev-brk-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const item = st.breakers.find(b => b.id === id);
                if (!item || item.on) return;
                item.on = true;
                window.elevAddHeat(3);
                if (st.breakers.every(b => b.on)) {
                    st.breakers = Array.of();
                    window.elevAdvanceStage();
                    return;
                }
                window.elevRenderBreakers();
            };
        });
    };
    
    window.elevStartBrake = function () {
        const st = window.ELEV_STATE;
        const isFinale = st.stageIdx === window.ELEV_CFG.floors.length - 1;
        st.brakePos = 0;
        st.brakeDir = 1;
        st.brakeTargetWidth = isFinale ? 14 : 20;
        st.brakeTargetStart = 35 + Math.floor(Math.random() * 20);
        window.elevRenderBrake();
        
        const speed = isFinale ? 3.5 : 2.6;
        const brakeLoop = window.elevAddInterval(() => {
            const curType = window.ELEV_CFG.floors.at(st.stageIdx)?.type;
            if (!st.active || curType !== 'brake') {
                clearInterval(brakeLoop);
                return;
            }
            st.brakePos += st.brakeDir * speed;
            if (st.brakePos >= 100) {
                st.brakePos = 100;
                st.brakeDir = -1;
            } else if (st.brakePos <= 0) {
                st.brakePos = 0;
                st.brakeDir = 1;
            }
            const needle = document.getElementById('elev-brake-needle');
            if (needle) needle.style.left = st.brakePos + '%';
        }, 28);
    };
    
    window.elevTriggerBrake = function () {
        const st = window.ELEV_STATE;
        const curType = window.ELEV_CFG.floors.at(st.stageIdx)?.type;
        if (curType !== 'brake') return;
        const hit = st.brakePos >= st.brakeTargetStart && st.brakePos <= (st.brakeTargetStart + st.brakeTargetWidth);
        if (hit) {
            window.elevAdvanceStage();
        } else {
            window.elevAddHeat(14);
            window.elevSetBanner('⚠️ Missed the magnetic brake zone! Heat spiked (+14%) — try again!', '#f87171');
        }
    };
    
    window.elevRenderBrake = function () {
        const st = window.ELEV_STATE;
        const arena = document.getElementById('elev-arena');
        if (!arena) return;
        
        arena.innerHTML = `
            <div style="text-align:center;max-width:520px;width:100%;">
                <div style="font-size:0.9rem;color:#fde047;letter-spacing:2px;margin-bottom:14px;">MAGNETIC LIFT BRAKE LOCK</div>
                <div style="position:relative;width:100%;height:34px;background:#1e293b;border:2px solid #475569;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                    <div style="position:absolute;left:${st.brakeTargetStart}%;width:${st.brakeTargetWidth}%;top:0;bottom:0;background:rgba(34,197,94,0.38);border-left:2px solid #4ade80;border-right:2px solid #4ade80;"></div>
                    <div id="elev-brake-needle" style="position:absolute;left:${st.brakePos}%;top:0;bottom:0;width:6px;background:#38bdf8;box-shadow:0 0 12px #38bdf8;transform:translateX(-50%);"></div>
                </div>
                <button id="elev-brake-btn" style="background:#0284c7;color:#fff;border:2px solid #7dd3fc;padding:14px 30px;border-radius:10px;font-size:1.1rem;font-weight:800;cursor:pointer;box-shadow:0 0 24px rgba(56,189,248,0.45);">
                    🛑 ENGAGE BRAKE [SPACE]
                </button>
            </div>
        `;
        
        document.getElementById('elev-brake-btn').onclick = window.elevTriggerBrake;
    };
}
function startBurjElevatorModal() {
    window.elevBuildModal = function () {
        const old = document.getElementById('burj-elevator-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'burj-elevator-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at top,#0f172a 0%,#020617 100%);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:18px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:880px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                    <span style="font-size:1.15rem;font-weight:800;color:#38bdf8;">🏙️ BURJ KHALIFA EXPEDITION</span>
                    <span id="elev-floor-display" style="background:#1e293b;border:1px solid #38bdf8;color:#7dd3fc;padding:4px 10px;border-radius:6px;font-size:0.82rem;font-weight:bold;">FLOOR 001 / 163</span>
                    <span id="elev-squad-display" style="background:#172554;border:1px solid #60a5fa;color:#bfdbfe;padding:4px 10px;border-radius:6px;font-size:0.82rem;font-weight:bold;">🧑‍🎓 1 / 26 RESCUED</span>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <span id="elev-heat-txt" style="font-size:0.9rem;font-weight:bold;color:#4ade80;">🌡️ Heat: 0%</span>
                    <span id="elev-timer-txt" style="font-size:1rem;font-weight:bold;color:#fbbf24;">⏱️ 180s</span>
                    <button id="elev-vent-btn" style="background:#083344;color:#67e8f9;border:1px solid #06b6d4;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.82rem;">❄️ VENT [V]</button>
                    <button id="elev-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.82rem;">✕ EXIT</button>
                </div>
            </div>
        
            <div id="elev-banner" style="font-size:0.96rem;color:#e2e8f0;text-align:center;min-height:26px;">
                Ascend all 10 lockdown checkpoints to rescue all 26 classmates!
            </div>
        
            <div style="width:100%;max-width:880px;display:flex;gap:16px;align-items:stretch;">
                <div style="width:68px;background:#090d16;border:2px solid #1e293b;border-radius:12px;padding:10px 6px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;font-size:0.72rem;color:#64748b;">
                    <span>163</span>
                    <div style="position:relative;width:14px;flex:1;margin:8px 0;background:#1e293b;border-radius:7px;overflow:hidden;">
                        <div id="elev-shaft-fill" style="position:absolute;bottom:0;left:0;right:0;height:2%;background:linear-gradient(0deg,#0284c7,#38bdf8);transition:height 0.45s;"></div>
                    </div>
                    <span>001</span>
                </div>
        
                <div id="elev-arena" style="flex:1;height:390px;background:#090d16;border:2px solid #1e293b;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-shadow:inset 0 0 60px rgba(0,0,0,0.85);"></div>
            </div>
        
            <div style="width:100%;max-width:880px;display:flex;justify-content:space-between;font-size:0.82rem;color:#94a3b8;">
                <span>"We rise because Jesus Christ is our Cornerstone" — Psalms 118:22</span>
                <span>Stage: <b id="elev-stage-num" style="color:#38bdf8;">1 / 10</b> • +12s Bonus per Floor</span>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('elev-exit-btn').onclick = window.elevCloseGame;
        document.getElementById('elev-vent-btn').onclick = window.elevVentHeat;
        
        const keyHandler = function (e) {
            if (!window.ELEV_STATE.active) return;
            if (e.code === 'Escape') window.elevCloseGame();
            if (e.code === 'KeyV') window.elevVentHeat();
            const curType = window.ELEV_CFG.floors.at(window.ELEV_STATE.stageIdx)?.type;
            if (e.code === 'Space' && curType === 'brake') {
                e.preventDefault();
                window.elevTriggerBrake();
            }
        };
        
        window.addEventListener('keydown', keyHandler);
        window.ELEV_STATE.listeners.push(Array.of(window, 'keydown', keyHandler));
    };
    
    window.elevSetBanner = function (text, color) {
        const el = document.getElementById('elev-banner');
        if (!el) return;
        el.textContent = text;
        el.style.color = color || '#e2e8f0';
    };
    
    window.elevAddHeat = function (delta) {
        const st = window.ELEV_STATE;
        if (!st.active) return;
        st.heat = Math.max(0, Math.min(100, st.heat + delta));
        const heatEl = document.getElementById('elev-heat-txt');
        if (heatEl) {
            heatEl.textContent = '🌡️ Heat: ' + st.heat + '%';
            heatEl.style.color = st.heat >= 75 ? '#ef4444' : (st.heat >= 45 ? '#fbbf24' : '#4ade80');
        }
        if (st.heat >= 100) {
            window.elevFinishGame(false, 'The elevator cables overheated at Floor ' + String(st.currentFloor).padStart(3, '0') + '! Press [V] regularly to vent coolant.');
        }
    };
    
    window.elevVentHeat = function () {
        const st = window.ELEV_STATE;
        if (!st.active) return;
        window.elevAddHeat(-25);
        window.elevSetBanner('❄️ Coolant vented! Cable temperature dropped (-25%).', '#67e8f9');
    };
    
    window.elevLoadCurrentStage = function () {
        const st = window.ELEV_STATE;
        const cfg = window.ELEV_CFG.floors.at(st.stageIdx);
        if (!cfg) return;
        
        st.currentFloor = cfg.floor;
        const floorEl = document.getElementById('elev-floor-display');
        const fillEl = document.getElementById('elev-shaft-fill');
        const squadEl = document.getElementById('elev-squad-display');
        const stageEl = document.getElementById('elev-stage-num');
        
        if (floorEl) floorEl.textContent = 'FLOOR ' + String(cfg.floor).padStart(3, '0') + ' / 163';
        if (fillEl) fillEl.style.height = Math.round((cfg.floor / 163) * 100) + '%';
        if (squadEl) squadEl.textContent = '🧑‍🎓 ' + st.rescuedCount + ' / 26 RESCUED';
        if (stageEl) stageEl.textContent = (st.stageIdx + 1) + ' / ' + window.ELEV_CFG.floors.length;
        
        window.elevSetBanner(cfg.title + ' — ' + cfg.lore, '#7dd3fc');
        
        if (cfg.type === 'circuit') window.elevRenderCircuit();
        if (cfg.type === 'mirrors') window.elevRenderMirrors();
        if (cfg.type === 'keypad') window.elevStartKeypad();
        if (cfg.type === 'breakers') window.elevRenderBreakers();
        if (cfg.type === 'brake') window.elevStartBrake();
    };
}
function startBurjElevatorController() {
    window.elevAdvanceStage = function () {
        const st = window.ELEV_STATE;
        const cleared = window.ELEV_CFG.floors.at(st.stageIdx);
        if (cleared) {
            st.rescuedCount = Math.min(26, st.rescuedCount + cleared.rescued);
        }
        
        st.stageIdx++;
        if (st.stageIdx >= window.ELEV_CFG.floors.length) {
            window.elevFinishGame(true, 'Cornerstone Override complete! All 26 Grade 7 – Psalms classmates reached Floor 163 safely!');
            return;
        }
        
        st.timeLeft += 12;
        window.elevAddHeat(-15);
        window.elevLoadCurrentStage();
    };
    
    window.elevFinishGame = function (won, summary) {
        const st = window.ELEV_STATE;
        st.active = false;
        window.elevClearAsync();
        
        const arena = document.getElementById('elev-arena');
        if (!arena) return;
        
        let bal = null;
        if (won) {
            bal = window.elevAwardCoins(window.ELEV_CFG.rewardCoins);
        }
        
        arena.innerHTML = `
            <div style="text-align:center;max-width:480px;">
                <div style="font-size:2.2rem;margin-bottom:8px;">${won ? '🏆 ALL 26 CLASSMATES SAFE!' : '🚨 LOCKDOWN STALLED'}</div>
                <p style="color:#cbd5e1;line-height:1.5;margin-bottom:14px;">${summary}</p>
                <div style="font-size:0.9rem;color:#93c5fd;margin-bottom:14px;">
                    Reached Floor ${String(st.currentFloor).padStart(3, '0')} • Rescued ${st.rescuedCount} / 26 Classmates
                </div>
                ${won ? `<div style="background:#052e16;border:1px solid #4ade80;color:#bbf7d0;padding:10px;border-radius:8px;margin-bottom:16px;font-weight:bold;">+${window.ELEV_CFG.rewardCoins} AFCS COINS (Balance: ${bal} 🪙)</div>` : ''}
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="elev-retry-btn" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;">↻ PLAY AGAIN</button>
                    <button id="elev-done-btn" style="background:#1e293b;color:#e2e8f0;border:1px solid #475569;padding:10px 20px;border-radius:8px;cursor:pointer;">EXIT</button>
                </div>
            </div>
        `;
        
        document.getElementById('elev-retry-btn').onclick = window.launchBurjElevator;
        document.getElementById('elev-done-btn').onclick = window.elevCloseGame;
    };
    
    window.elevCloseGame = function () {
        window.ELEV_STATE.active = false;
        window.elevClearAsync();
        const modal = document.getElementById('burj-elevator-modal');
        if (modal) modal.remove();
    };
    
    window.launchBurjElevator = function () {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('elevator');
        if (!window.ELEV_CFG) startBurjElevatorData();
        if (!window.elevRenderCircuit) startBurjElevatorPuzzlesA();
        if (!window.elevStartKeypad) startBurjElevatorPuzzlesB();
        if (!window.elevBuildModal) startBurjElevatorModal();
        window.elevClearAsync();
        const st = window.ELEV_STATE;
        st.active = true;
        st.stageIdx = 0;
        st.currentFloor = 1;
        st.rescuedCount = 1;
        st.timeLeft = window.ELEV_CFG.startTime;
        st.heat = 0;
        st.circuitNodes = Array.of();
        st.mirrorAngles = Array.of();
        st.pinCode = Array.of();
        st.pinInput = Array.of();
        st.breakers = Array.of();
        window.elevBuildModal();
        window.elevLoadCurrentStage();
        
        window.elevAddInterval(() => {
            if (!st.active) return;
            st.timeLeft--;
            const timerEl = document.getElementById('elev-timer-txt');
            if (timerEl) {
                timerEl.textContent = '⏱️ ' + st.timeLeft + 's';
                if (st.timeLeft <= 15) timerEl.style.color = '#ef4444';
            }
            if (st.timeLeft <= 0) {
                window.elevFinishGame(false, 'Lockdown timer expired at Floor ' + String(st.currentFloor).padStart(3, '0') + '.');
            }
        }, 1000);
    };
    
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (window.ELEV_CFG.triggers.includes(clean)) {
                window.launchBurjElevator();
            }
        });
    }
}
function startGdDeadlockedData() {
    window.GD_CFG = {
        triggers: Array.of('gd', 'geometry dash', 'deadlocked', 'wave', 'dash', 'robtop'),
        rewardCoins: 500,
        levelLength: 16500,
        groundY: 330,
        ceilingY: 40,
        storageBestKey: 'afcs_gd_deadlocked_best',
        storageBoardKey: 'afcs_gd_deadlocked_board',
        defaultRivals: Array.of(
            { name: 'Zoink', pct: 94, attempts: 42 },
            { name: 'Riot', pct: 86, attempts: 67 },
            { name: 'Viprin', pct: 73, attempts: 89 },
            { name: 'RobTop', pct: 61, attempts: 110 }
        )
    };
    
    window.GD_STATE = {
        active: false,
        rafId: null,
        lastTime: 0,
        practiceMode: false,
        muted: false,
        attempts: 1,
        bestPct: parseInt(localStorage.getItem('afcs_gd_deadlocked_best') || '0', 10),
        x: 0,
        y: 300,
        vy: 0,
        rot: 0,
        mode: 'cube',
        mini: false,
        gravity: 1,
        speedMult: 1.0,
        holding: false,
        justPressed: false,
        onGround: true,
        dead: false,
        won: false,
        trail: Array.of(),
        checkpoints: Array.of(),
        obstacles: Array.of(),
        portals: Array.of(),
        orbs: Array.of(),
        particles: Array.of(),
        audioCtx: null,
        musicStep: 0,
        musicTimer: 0,
        listeners: Array.of()
    };
    
    window.gdPlayTone = function (freq, dur, type, vol) {
        const st = window.GD_STATE;
        if (st.muted) return;
        try {
            if (!st.audioCtx) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) st.audioCtx = new Ctx();
            }
            if (!st.audioCtx) return;
            if (st.audioCtx.state === 'suspended') st.audioCtx.resume();
            const osc = st.audioCtx.createOscillator();
            const gain = st.audioCtx.createGain();
            osc.type = type || 'sawtooth';
            osc.frequency.setValueAtTime(freq, st.audioCtx.currentTime);
            gain.gain.setValueAtTime(vol || 0.04, st.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, st.audioCtx.currentTime + dur);
            osc.connect(gain);
            gain.connect(st.audioCtx.destination);
            osc.start();
            osc.stop(st.audioCtx.currentTime + dur);
        } catch (e) {}
    };
    
    window.gdStepMusic = function (dt) {
        const st = window.GD_STATE;
        if (st.muted || st.dead || st.won) return;
        st.musicTimer += dt;
        if (st.musicTimer < 0.145) return;
        st.musicTimer = 0;
        const bassNotes = Array.of(87.31, 87.31, 103.83, 87.31, 130.81, 116.54, 103.83, 98.0);
        const leadNotes = Array.of(349.23, 0, 415.3, 523.25, 466.16, 415.3, 349.23, 311.13);
        const idx = st.musicStep % bassNotes.length;
        window.gdPlayTone(bassNotes.at(idx), 0.13, 'sawtooth', 0.032);
        const lead = leadNotes.at(idx);
        if (lead > 0 && st.musicStep % 2 === 0) {
            window.gdPlayTone(lead, 0.16, 'square', 0.022);
        }
        st.musicStep++;
    };
    
    window.gdAwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
    
    window.gdUpdateLeaderboard = function (pct) {
        const st = window.GD_STATE;
        if (st.practiceMode) return;
        if (pct > st.bestPct) {
            const gain = Math.floor((pct - st.bestPct) * 2);
            if (gain > 0) window.gdAwardCoins(gain);
            st.bestPct = pct;
            localStorage.setItem(window.GD_CFG.storageBestKey, String(pct));
        }
        const board = Array.of(
            { name: '👑 Caceb (You)', pct: st.bestPct, attempts: st.attempts, isUser: true },
            ...window.GD_CFG.defaultRivals
        ).sort((a, b) => b.pct - a.pct);
        localStorage.setItem(window.GD_CFG.storageBoardKey, JSON.stringify(board));
        return board;
    };
}
function startGdDeadlockedLevel() {
    window.gdBuildDeadlockedMap = function () {
        const st = window.GD_STATE;
        const gY = window.GD_CFG.groundY;
        const cY = window.GD_CFG.ceilingY;
        st.obstacles = Array.of();
        st.portals = Array.of();
        st.orbs = Array.of();
        
        const addSpike = (x, y, up, w, h) => {
            st.obstacles.push({ type: 'spike', x: x, y: y, w: w || 26, h: h || 28, up: up !== false });
        };
        const addSpikeRow = (startX, y, count, up = true, step = 28) => {
            for (let i = 0; i < count; i++) {
                addSpike(startX + i * step, y, up);
            }
        };
        const addBlock = (x, y, w, h) => {
            st.obstacles.push({ type: 'block', x: x, y: y, w: w, h: h });
        };
        const addBlockRow = (startX, y, count, w = 28, h = 28, step = 28) => {
            for (let i = 0; i < count; i++) {
                addBlock(startX + i * step, y, w, h);
            }
        };
        
        const addBlockBlock = (startX, startY, cols, rows, w = 28, h = 28) => {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    addBlock(startX + c * w, startY + r * h, w, h);
                }
            }
        };
        const addSlope = (x, y, w, h, dir) => {
            st.obstacles.push({ type: 'slope', x: x, y: y, w: w || 28, h: h || 28, dir: dir || 'tl' });
        };
        
        const addSlopeRow = (startX, startY, count, dir, w = 28, h = 28) => {
            const dy = (dir === 'tr' || dir === 'br') ? h : -h;
            for (let i = 0; i < count; i++) {
                addSlope(startX + i * w, startY + i * dy, w, h, dir);
            }
        };
        
        const addTopPyramid = (startX, steps, flatCols = 2, extraH = 0) => {
            for (let i = 0; i < steps; i++) {
                if (i > 0) addBlockBlock(startX + i * 28, cY, 1, i, 28, 28);
                if (extraH > 0) addBlock(startX + i * 28, cY + i * 28, 28, extraH);
                addSlope(startX + i * 28, cY + i * 28 + extraH, 28, 28, 'tr');
            }
            const peakX = startX + steps * 28;
            addBlockBlock(peakX, cY, flatCols, steps, 28, 28);
            if (extraH > 0) addBlockRow(peakX, cY + steps * 28, flatCols, 28, extraH, 28);
            const rightStart = peakX + flatCols * 28;
            for (let i = 0; i < steps; i++) {
                const rowCount = steps - 1 - i;
                if (rowCount > 0) addBlockBlock(rightStart + i * 28, cY, 1, rowCount, 28, 28);
                if (extraH > 0) addBlock(rightStart + i * 28, cY + rowCount * 28, 28, extraH);
                addSlope(rightStart + i * 28, cY + rowCount * 28 + extraH, 28, 28, 'tl');
            }
        };
        
        const addBottomPyramid = (startX, steps, flatCols = 2, extraH = 0) => {
            for (let i = 0; i < steps; i++) {
                if (i > 0) addBlockBlock(startX + i * 28, gY - i * 28, 1, i, 28, 28);
                if (extraH > 0) addBlock(startX + i * 28, gY - i * 28 - extraH, 28, extraH);
                addSlope(startX + i * 28, gY - (i + 1) * 28 - extraH, 28, 28, 'bl');
            }
            const peakX = startX + steps * 28;
            addBlockBlock(peakX, gY - steps * 28, flatCols, steps, 28, 28);
            if (extraH > 0) addBlockRow(peakX, gY - steps * 28 - extraH, flatCols, 28, extraH, 28);
            const rightStart = peakX + flatCols * 28;
            for (let i = 0; i < steps; i++) {
                const rowCount = steps - 1 - i;
                if (rowCount > 0) addBlockBlock(rightStart + i * 28, gY - rowCount * 28, 1, rowCount, 28, 28);
                if (extraH > 0) addBlock(rightStart + i * 28, gY - rowCount * 28 - extraH, 28, extraH);
                addSlope(rightStart + i * 28, gY - (rowCount + 1) * 28 - extraH, 28, 28, 'br');
            }
        };
        const addSaw = (x, y, r) => {
            st.obstacles.push({ type: 'saw', x: x, y: y, r: r || 24 });
        };
        const addPortal = (x, kind, value, color, label) => {
            st.portals.push({ x: x, kind: kind, value: value, color: color, label: label, hit: false });
        };
        const addOrb = (x, y, kind) => {
            st.orbs.push({ x: x, y: y, kind: kind, hit: false });
        };
        
        addSpike(520, gY, true);
        addSpike(548, gY, true);
        addBlock(720, gY - 36, 90, 36);
        addSpike(880, gY, true);
        addSpike(908, gY, true);
        addSpike(936, gY, true);
        addOrb(1080, gY - 75, 'yellow');
        addBlock(1180, gY - 70, 130, 70);
        addSpike(1360, gY, true);
        addOrb(1400, gY - 85, 'blue');
        addSpike(1440, cY + 28, false);
        addSpike(1620, cY + 28, false);
        addSpikeRow(1388, gY, 12, true);
        addOrb(1860, cY + 95, 'blue');
        addSpikeRow(2020, gY, 3, true);
        addSpikeRow(2020, cY + 28, 5, false);
        
        addPortal(2200, 'mode', 'wave', '#38bdf8', 'WAVE');
        addPortal(2260, 'speed', 1.28, '#f43f5e', '2.5X NC WAVE');
        
        for (let wx = 2440; wx <= 3940; wx += 520) {
            addTopPyramid(wx, 4, 2, 14);
            addBottomPyramid(wx + 140, 3, 2, 14);
            
            addSaw(wx + 355, cY + 145, 20);
            
            addSlope(wx + 395, cY + 66, 28, 28, 'bl');
            addSlope(wx + 423, cY + 66, 28, 28, 'br');
            addSlope(wx + 395, cY + 94, 28, 28, 'tl');
            addSlope(wx + 423, cY + 94, 28, 28, 'tr');
            
            addSlope(wx + 395, gY - 122, 28, 28, 'bl');
            addSlope(wx + 423, gY - 122, 28, 28, 'br');
            addSlope(wx + 395, gY - 94, 28, 28, 'tl');
            addSlope(wx + 423, gY - 94, 28, 28, 'tr');
            
            addSaw(wx + 485, cY + 145, 20);
        }
        
        addPortal(4380, 'mini', true, '#a855f7', 'MINI WAVE');
        for (let mx = 4560; mx <= 5440; mx += 220) {
            addBlock(mx, gY - 125, 28, 125);
            addSpike(mx + 1, gY - 125, true, 26, 26);
            
            addBlock(mx + 110, cY, 28, 125);
            addSpike(mx + 111, cY + 151, false, 26, 26);
        }
        
        addPortal(5600, 'mini', false, '#22c55e', 'NORMAL');
        addPortal(5660, 'mode', 'ship', '#ec4899', 'SHIP');
        addPortal(5720, 'speed', 1.15, '#fbbf24', '2X SPEED');
        
        addBlockBlock(5940, cY, 78, 4, 28, 28);
        addBlockBlock(5940, gY - 112, 78, 4, 28, 28);
        
        for (let sx = 6100; sx <= 7950; sx += 310) {
            if ((sx / 310) % 2 === 0) {
                addPortal(sx, 'gravity', -1, '#3b82f6', 'GRAVITY FLIP');
            } else {
                addPortal(sx, 'gravity', 1, '#eab308', 'GRAVITY NORMAL');
            }
        }
        
        addPortal(8350, 'gravity', 1, '#eab308', 'NORMAL GRAV');
        addPortal(8410, 'mode', 'ufo', '#f97316', 'UFO');
        addPortal(8470, 'speed', 1.2, '#fbbf24', '2X UFO');
        
        for (let ux = 8650; ux <= 10150; ux += 380) {
            addBlockBlock(ux, cY, 2, 3, 28, 28);
            addSpike(ux + 1, cY + 112, false, 26, 28);
            addSpike(ux + 29, cY + 112, false, 26, 28);
            
            addBlockBlock(ux, gY - 84, 2, 3, 28, 28);
            addSpike(ux + 1, gY - 84, true, 26, 28);
            addSpike(ux + 29, gY - 84, true, 26, 28);
            
            addOrb(ux + 115, cY + 145, 'yellow');
            
            addBlockBlock(ux + 190, cY, 2, 5, 28, 28);
            addSpike(ux + 191, cY + 168, false, 26, 28);
            addSpike(ux + 219, cY + 168, false, 26, 28);
            
            addBlockBlock(ux + 190, gY - 28, 2, 1, 28, 28);
            addSpike(ux + 191, gY - 28, true, 26, 28);
            addSpike(ux + 219, gY - 28, true, 26, 28);
            
            addSaw(ux + 305, cY + 85, 20);
            addOrb(ux + 305, gY - 85, 'blue');
            addPortal(ux + 355, 'gravity', 1, '#eab308', 'NORM');
        }
        
        addPortal(10620, 'mode', 'robot', '#ef4444', 'ROBOT');
        for (let rx = 10850; rx <= 12200; rx += 340) {
            addBlock(rx, gY - 52, 85, 52);
            addSpike(rx + 140, gY, true);
            addSpike(rx + 168, gY, true);
            addSpike(rx + 196, gY, true);
        }
        
        addPortal(12450, 'mode', 'wave', '#38bdf8', 'FINAL NC WAVE');
        addPortal(12510, 'speed', 1.34, '#f43f5e', '3X BOSS NC');
        
        for (let bx = 12720; bx <= 14520; bx += 600) {
            addBottomPyramid(bx, 4, 1, 14);
            addTopPyramid(bx + 130, 4, 1, 14);
            
            addSaw(bx + 295, cY + 145, 22);
            
            addSlope(bx + 340, cY + 52, 28, 28, 'bl');
            addSlope(bx + 368, cY + 52, 28, 28, 'br');
            addSlope(bx + 340, cY + 80, 28, 28, 'tl');
            addSlope(bx + 368, cY + 80, 28, 28, 'tr');
            
            addSlope(bx + 340, cY + 118, 28, 28, 'bl');
            addSlope(bx + 368, cY + 118, 28, 28, 'br');
            addSlope(bx + 340, cY + 146, 28, 28, 'tl');
            addSlope(bx + 368, cY + 146, 28, 28, 'tr');
            
            addSlope(bx + 340, gY - 108, 28, 28, 'bl');
            addSlope(bx + 368, gY - 108, 28, 28, 'br');
            addSlope(bx + 340, gY - 80, 28, 28, 'tl');
            addSlope(bx + 368, gY - 80, 28, 28, 'tr');
            
            addPortal(bx + 440, 'gravity', ((bx / 600) % 2 === 0) ? -1 : 1, '#3b82f6', 'GRAV WAVE');
            
            addTopPyramid(bx + 475, 3, 1, 20);
            addBottomPyramid(bx + 475, 3, 1, 20);
        }
        
        addPortal(14940, 'gravity', 1, '#eab308', 'NORMAL GRAV');
        
        addPortal(15020, 'mode', 'ship', '#ec4899', 'FINAL SHIP');
        for (let fx = 15240; fx <= 16150; fx += 290) {
            addSaw(fx, cY + 48, 25);
            addSaw(fx + 145, gY - 48, 25);
        }
    };
}
function startGdDeadlockedEngine() {
    window.gdSpawnBurst = function (px, py, color, count) {
        const st = window.GD_STATE;
        for (let i = 0; i < (count || 18); i++) {
            const ang = (Math.PI * 2 * i) / (count || 18);
            const spd = 90 + Math.random() * 240;
            st.particles.push({
                x: px,
                y: py,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                life: 0.45 + Math.random() * 0.25,
                color: color
            });
        }
    };
    
    window.gdSaveCheckpoint = function () {
        const st = window.GD_STATE;
        if (!st.practiceMode || st.dead || st.won) return;
        st.checkpoints.push({
            x: st.x,
            y: st.y,
            vy: st.vy,
            mode: st.mode,
            mini: st.mini,
            gravity: st.gravity,
            speedMult: st.speedMult
        });
        window.gdPlayTone(660, 0.12, 'triangle', 0.05);
    };
    
    window.gdDeleteCheckpoint = function () {
        const st = window.GD_STATE;
        if (st.practiceMode && st.checkpoints.length > 0) {
            st.checkpoints.pop();
            window.gdPlayTone(330, 0.1, 'triangle', 0.04);
        }
    };
    
    window.gdResetRun = function (useCheckpoint) {
        const st = window.GD_STATE;
        st.dead = false;
        st.won = false;
        st.trail = Array.of();
        st.portals.forEach(p => { p.hit = false; });
        st.orbs.forEach(o => { o.hit = false; });
        
        if (useCheckpoint && st.practiceMode && st.checkpoints.length > 0) {
            const cp = st.checkpoints.at(-1);
            st.x = cp.x;
            st.y = cp.y;
            st.vy = cp.vy;
            st.mode = cp.mode;
            st.mini = cp.mini;
            st.gravity = cp.gravity;
            st.speedMult = cp.speedMult;
        } else {
            st.x = 0;
            st.y = window.GD_CFG.groundY - 26;
            st.vy = 0;
            st.rot = 0;
            st.mode = 'cube';
            st.mini = false;
            st.gravity = 1;
            st.speedMult = 1.0;
            st.onGround = true;
            st.checkpoints = Array.of();
        }
    };
    
    window.gdCrashPlayer = function () {
        const st = window.GD_STATE;
        if (st.dead || st.won) return;
        st.dead = true;
        window.gdPlayTone(110, 0.35, 'sawtooth', 0.08);
        window.gdSpawnBurst(160, st.y + 12, '#f43f5e', 24);
        const pct = Math.min(99, Math.floor((st.x / window.GD_CFG.levelLength) * 100));
        window.gdUpdateLeaderboard(pct);
        window.gdRefreshHud(pct);
        
        setTimeout(() => {
            if (!window.GD_STATE.active) return;
            window.GD_STATE.attempts++;
            window.gdResetRun(true);
        }, 620);
    };
    
    window.gdUpdatePhysics = function (dt) {
        const st = window.GD_STATE;
        const cfg = window.GD_CFG;
        if (st.dead || st.won) return;
        
        window.gdStepMusic(dt);
        
        const baseSpeed = 345 * st.speedMult;
        st.x += baseSpeed * dt;
        
        const size = st.mini ? 16 : 24;
        const floorLimit = cfg.groundY - size;
        const ceilLimit = cfg.ceilingY;
        
        if (st.mode === 'wave') {
            const slope = (st.mini ? 1.15 : 0.82) * baseSpeed;
            const dir = st.holding ? -1 : 1;
            st.vy = dir * slope * st.gravity;
            st.y += st.vy * dt;
            st.rot = st.vy < 0 ? -34 : 34;
            
            if (st.y <= ceilLimit) {
                st.y = ceilLimit;
                st.rot = 0;
            } else if (st.y >= floorLimit) {
                st.y = floorLimit;
                st.rot = 0;
            }
        } else if (st.mode === 'ship') {
            const thrust = st.holding ? -1250 : 980;
            st.vy += thrust * st.gravity * dt;
            st.vy = Math.max(-440, Math.min(440, st.vy));
            st.y += st.vy * dt;
            st.rot = st.vy * 0.06;
        } else if (st.mode === 'ufo') {
            if (st.justPressed) {
                st.vy = -445 * st.gravity;
                window.gdPlayTone(520, 0.07, 'sine', 0.04);
            }
            st.vy += 1950 * st.gravity * dt;
            st.y += st.vy * dt;
            st.rot = st.vy * 0.045;
        } else if (st.mode === 'robot') {
            if (st.justPressed && st.onGround) {
                st.vy = -560 * st.gravity;
                st.onGround = false;
                window.gdPlayTone(440, 0.08, 'square', 0.04);
            } else if (st.holding && st.vy * st.gravity < 0) {
                st.vy += 1150 * st.gravity * dt;
            } else {
                st.vy += 2950 * st.gravity * dt;
            }
            st.y += st.vy * dt;
            st.rot = st.onGround ? 0 : st.vy * 0.035;
        } else {
            if ((st.justPressed || st.holding) && st.onGround) {
                st.vy = -675 * st.gravity;
                st.onGround = false;
                window.gdPlayTone(480, 0.07, 'triangle', 0.04);
            }
            st.vy += 3150 * st.gravity * dt;
            st.y += st.vy * dt;
            if (!st.onGround) {
                st.rot += 465 * st.gravity * dt;
            } else {
                st.rot = Math.round(st.rot / 90) * 90;
            }
        }
        if (st.justPressed) {
            for (const orb of st.orbs) {
                if (!orb.hit && Math.abs((st.x + 160) - orb.x) < 42 && Math.abs((st.y + size / 2) - orb.y) < 42) {
                    orb.hit = true;
                    window.gdSpawnBurst(160, st.y + size / 2, orb.kind === 'blue' ? '#38bdf8' : '#fde047', 10);
                    if (orb.kind === 'blue') {
                        st.gravity *= -1;
                        st.vy = 260 * st.gravity;
                    } else {
                        st.vy = -540 * st.gravity;
                    }
                    st.onGround = false;
                    window.gdPlayTone(740, 0.09, 'sine', 0.05);
                    break;
                }
            }
        }
        st.justPressed = false;
        
        if (st.mode === 'wave') {
            if (st.y <= ceilLimit || st.y >= floorLimit) {
                window.gdCrashPlayer();
                return;
            }
        } else {
            if (st.gravity === 1 && st.y >= floorLimit) {
                st.y = floorLimit;
                st.vy = 0;
                st.onGround = true;
            } else if (st.gravity === -1 && st.y <= ceilLimit) {
                st.y = ceilLimit;
                st.vy = 0;
                st.onGround = true;
            } else if (st.y < ceilLimit || st.y > floorLimit) {
                window.gdCrashPlayer();
                return;
            }
        }
        
        const worldPlayerX = st.x + 160;
        st.trail.push({ x: worldPlayerX, y: st.y + size / 2 });
        if (st.trail.length > 36) st.trail.shift();
        
        for (const p of st.portals) {
            if (!p.hit && Math.abs(worldPlayerX - p.x) < 24) {
                p.hit = true;
                if (p.kind === 'mode') st.mode = p.value;
                if (p.kind === 'speed') st.speedMult = p.value;
                if (p.kind === 'mini') st.mini = p.value;
                if (p.kind === 'gravity') st.gravity = p.value;
                window.gdSpawnBurst(160, st.y + size / 2, p.color, 14);
                window.gdPlayTone(620, 0.11, 'sine', 0.05);
            }
        }
        
        const pad = 5;
        const pLeft = worldPlayerX + pad;
        const pRight = worldPlayerX + size - pad;
        const pTop = st.y + pad;
        const pBot = st.y + size - pad;
        
        for (const ob of st.obstacles) {
            if (ob.x < worldPlayerX - 120 || ob.x > worldPlayerX + 120) continue;
            if (ob.type === 'spike') {
                const sLeft = ob.x + 6;
                const sRight = ob.x + ob.w - 6;
                const sTop = ob.up ? (ob.y - ob.h + 6) : (ob.y - ob.h);
                const sBot = ob.up ? ob.y : (ob.y - 6);
                if (pRight > sLeft && pLeft < sRight && pBot > sTop && pTop < sBot) {
                    window.gdCrashPlayer();
                    return;
                }
            } else if (ob.type === 'saw') {
                const cx = worldPlayerX + size / 2;
                const cy = st.y + size / 2;
                const dist = Math.hypot(cx - ob.x, cy - ob.y);
                if (dist < ob.r + size * 0.36) {
                    window.gdCrashPlayer();
                    return;
                }
            } else if (ob.type === 'block') {
                if (pRight > ob.x && pLeft < ob.x + ob.w && pBot > ob.y && pTop < ob.y + ob.h) {
                    if (st.mode === 'cube' || st.mode === 'robot') {
                        if (st.gravity === 1 && pBot - st.vy * dt <= ob.y + 10) {
                            st.y = ob.y - size;
                            st.vy = 0;
                            st.onGround = true;
                            continue;
                        }
                    }
                    window.gdCrashPlayer();
                    return;
                }
            } else if (ob.type === 'slope') {
                if (pRight > ob.x && pLeft < ob.x + ob.w && pBot > ob.y && pTop < ob.y + ob.h) {
                    const cx = (pLeft + pRight) / 2;
                    const cy = (pTop + pBot) / 2;
                    const nx = Math.max(0, Math.min(1, (cx - ob.x) / ob.w));
                    const ny = Math.max(0, Math.min(1, (cy - ob.y) / ob.h));
                    let hitSlope = false;
                    if (ob.dir === 'tl') hitSlope = (nx + ny <= 1.05);
                    else if (ob.dir === 'tr') hitSlope = ((1 - nx) + ny <= 1.05);
                    else if (ob.dir === 'bl') hitSlope = ((1 - nx) + (1 - ny) <= 1.05);
                    else if (ob.dir === 'br') hitSlope = (nx + (1 - ny) <= 1.05);
                    if (hitSlope) {
                        window.gdCrashPlayer();
                        return;
                    }
                }
            }
        }
        
        const pct = Math.min(100, Math.floor((st.x / cfg.levelLength) * 100));
        window.gdRefreshHud(pct);
        
        if (st.x >= cfg.levelLength) {
            st.won = true;
            window.gdPlayTone(880, 0.4, 'triangle', 0.08);
            const board = window.gdUpdateLeaderboard(100);
            const coinsAdded = st.practiceMode ? 50 : cfg.rewardCoins;
            const bal = window.gdAwardCoins(coinsAdded);
            window.gdShowVictoryOverlay(bal, coinsAdded, board);
        }
    };
    
    window.gdRenderCanvas = function (ctx, canvas) {
        const st = window.GD_STATE;
        const cfg = window.GD_CFG;
        const w = canvas.width;
        const h = canvas.height;
        const pct = Math.min(100, (st.x / cfg.levelLength) * 100);
        
        const isBoss = pct >= 62;
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, isBoss ? '#2a0818' : '#09192f');
        grad.addColorStop(1, '#04070d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = isBoss ? 'rgba(244,63,94,0.14)' : 'rgba(56,189,248,0.12)';
        ctx.lineWidth = 1;
        const gridOffset = -(st.x * 0.45) % 48;
        for (let gx = gridOffset; gx < w; gx += 48) {
            ctx.beginPath();
            ctx.moveTo(gx, cfg.ceilingY);
            ctx.lineTo(gx, cfg.groundY);
            ctx.stroke();
        }
        ctx.fillStyle = isBoss ? '#4c0519' : '#0f172a';
        ctx.fillRect(0, 0, w, cfg.ceilingY);
        ctx.fillRect(0, cfg.groundY, w, h - cfg.groundY);
        ctx.strokeStyle = isBoss ? '#fb7185' : '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, cfg.ceilingY);
        ctx.lineTo(w, cfg.ceilingY);
        ctx.moveTo(0, cfg.groundY);
        ctx.lineTo(w, cfg.groundY);
        ctx.stroke();
        const camX = st.x;
        if (st.trail.length > 1) {
            ctx.strokeStyle = st.mode === 'wave' ? '#22d3ee' : 'rgba(56,189,248,0.55)';
            ctx.lineWidth = st.mode === 'wave' ? 5 : 3;
            ctx.beginPath();
            st.trail.forEach((pt, idx) => {
                const sx = pt.x - camX;
                if (idx === 0) ctx.moveTo(sx, pt.y);
                else ctx.lineTo(sx, pt.y);
            });
            ctx.stroke();
        }
        for (const p of st.portals) {
            const sx = p.x - camX;
            if (sx < -60 || sx > w + 60) continue;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 4;
            ctx.strokeRect(sx - 10, cfg.ceilingY + 12, 20, cfg.groundY - cfg.ceilingY - 24);
            ctx.fillStyle = p.color;
            ctx.font = 'bold 10px monospace';
            ctx.fillText(p.label, sx - 24, cfg.ceilingY + 26);
        }
        for (const orb of st.orbs) {
            const sx = orb.x - camX;
            if (sx < -40 || sx > w + 40) continue;
            ctx.fillStyle = orb.kind === 'blue' ? '#38bdf8' : '#fde047';
            ctx.beginPath();
            ctx.arc(sx, orb.y, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        for (const ob of st.obstacles) {
            const sx = ob.x - camX;
            if (sx < -160 || sx > w + 160) continue;
            if (ob.type === 'block') {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(sx, ob.y, ob.w, ob.h);
                ctx.strokeStyle = isBoss ? '#f43f5e' : '#38bdf8';
                ctx.lineWidth = 2;
                ctx.strokeRect(sx, ob.y, ob.w, ob.h);
            } else if (ob.type === 'spike') {
                ctx.fillStyle = '#090d16';
                ctx.strokeStyle = '#f43f5e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                if (ob.up) {
                    ctx.moveTo(sx, ob.y);
                    ctx.lineTo(sx + ob.w / 2, ob.y - ob.h);
                    ctx.lineTo(sx + ob.w, ob.y);
                } else {
                    ctx.moveTo(sx, ob.y - ob.h);
                    ctx.lineTo(sx + ob.w / 2, ob.y);
                    ctx.lineTo(sx + ob.w, ob.y - ob.h);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else if (ob.type === 'saw') {
                ctx.save();
                ctx.translate(sx, ob.y);
                ctx.rotate(performance.now() * 0.008);
                ctx.fillStyle = '#18181b';
                ctx.strokeStyle = '#fb7185';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                for (let t = 0; t < 16; t++) {
                    const rad = t % 2 === 0 ? ob.r : ob.r * 0.65;
                    const a = (Math.PI * 2 * t) / 16;
                    if (t === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            } else if (ob.type === 'slope') {
                const ncPulse = st.mode === 'wave' && Math.floor(performance.now() / 85) % 2 === 0;
                ctx.fillStyle = ncPulse ? '#450a0a' : '#18181b';
                ctx.strokeStyle = ncPulse ? '#fde047' : '#f43f5e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                if (ob.dir === 'tl') {
                    ctx.moveTo(sx, ob.y);
                    ctx.lineTo(sx + ob.w, ob.y);
                    ctx.lineTo(sx, ob.y + ob.h);
                } else if (ob.dir === 'tr') {
                    ctx.moveTo(sx, ob.y);
                    ctx.lineTo(sx + ob.w, ob.y);
                    ctx.lineTo(sx + ob.w, ob.y + ob.h);
                } else if (ob.dir === 'bl') {
                    ctx.moveTo(sx + ob.w, ob.y);
                    ctx.lineTo(sx + ob.w, ob.y + ob.h);
                    ctx.lineTo(sx, ob.y + ob.h);
                } else {
                    ctx.moveTo(sx, ob.y);
                    ctx.lineTo(sx + ob.w, ob.y + ob.h);
                    ctx.lineTo(sx, ob.y + ob.h);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
        for (const cp of st.checkpoints) {
            const sx = cp.x + 160 - camX;
            if (sx < -20 || sx > w + 20) continue;
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(sx, cp.y - 10);
            ctx.lineTo(sx + 10, cp.y);
            ctx.lineTo(sx, cp.y + 10);
            ctx.lineTo(sx - 10, cp.y);
            ctx.closePath();
            ctx.fill();
        }
        if (!st.dead) {
            const size = st.mini ? 16 : 24;
            ctx.save();
            ctx.translate(160 + size / 2, st.y + size / 2);
            ctx.rotate((st.rot * Math.PI) / 180);
            ctx.fillStyle = '#22d3ee';
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2.5;
            if (st.mode === 'wave') {
                ctx.beginPath();
                ctx.moveTo(-size / 2, -size / 2);
                ctx.lineTo(size / 2 + 4, 0);
                ctx.lineTo(-size / 2, size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.fillRect(-size / 2, -size / 2, size, size);
                ctx.strokeRect(-size / 2, -size / 2, size, size);
            }
            ctx.restore();
        }
        for (let i = st.particles.length - 1; i >= 0; i--) {
            const pt = st.particles.at(i);
            pt.x += pt.vx * 0.016;
            pt.y += pt.vy * 0.016;
            pt.life -= 0.016;
            if (pt.life <= 0) {
                st.particles.splice(i, 1);
                continue;
            }
            ctx.fillStyle = pt.color;
            ctx.fillRect(pt.x, pt.y, 5, 5);
        }
    };
};
function startGdDeadlockedUI() {
    window.gdBuildModal = function () {
        const old = document.getElementById('gd-deadlocked-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'gd-deadlocked-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at top,#111827 0%,#030712 100%);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:920px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
                <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                    <span style="font-size:1.2rem;font-weight:900;color:#22d3ee;letter-spacing:1px;">⚡ GEOMETRY DASH: DEADLOCKED</span>
                    <span id="gd-attempt-badge" style="background:#1e293b;border:1px solid #38bdf8;color:#7dd3fc;padding:4px 10px;border-radius:6px;font-size:0.82rem;font-weight:bold;">ATTEMPT 1</span>
                    <span id="gd-mode-badge" style="background:#172554;border:1px solid #60a5fa;color:#bfdbfe;padding:4px 10px;border-radius:6px;font-size:0.82rem;font-weight:bold;">CUBE • 1X</span>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button id="gd-practice-btn" style="background:#1e293b;color:#86efac;border:1px solid #22c55e;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.8rem;">💎 PRACTICE: OFF [P]</button>
                    <button id="gd-mute-btn" style="background:#1e293b;color:#fde047;border:1px solid #eab308;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.8rem;">🔊 SFX</button>
                    <button id="gd-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.8rem;">✕ EXIT</button>
                </div>
            </div>
        
            <div style="width:100%;max-width:920px;display:flex;align-items:center;gap:12px;">
                <div style="flex:1;height:14px;background:#1e293b;border:1px solid #334155;border-radius:7px;overflow:hidden;">
                    <div id="gd-pct-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#06b6d4,#f43f5e);transition:width 0.08s;"></div>
                </div>
                <span id="gd-pct-text" style="font-weight:800;color:#22d3ee;min-width:48px;text-align:right;">0%</span>
            </div>
        
            <div style="width:100%;max-width:920px;display:flex;gap:14px;align-items:stretch;">
                <div id="gd-canvas-wrap" style="position:relative;flex:1;height:370px;border:2px solid #334155;border-radius:12px;overflow:hidden;background:#04070d;">
                    <canvas id="gd-canvas" width="660" height="370" style="width:100%;height:100%;display:block;cursor:pointer;"></canvas>
                    <div id="gd-overlay-msg" style="display:none;position:absolute;inset:0;background:rgba(2,6,23,0.88);flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;"></div>
                </div>
        
                <div style="width:230px;background:#090d16;border:2px solid #1e293b;border-radius:12px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="font-size:0.82rem;font-weight:800;color:#fde047;letter-spacing:1px;border-bottom:1px solid #1e293b;padding-bottom:6px;margin-bottom:8px;">
                            🏆 DEADLOCKED TOP 5
                        </div>
                        <div id="gd-leaderboard-list" style="display:flex;flex-direction:column;gap:6px;font-size:0.8rem;"></div>
                    </div>
                    <div style="font-size:0.74rem;color:#94a3b8;border-top:1px solid #1e293b;padding-top:8px;">
                        Normal 100% Clear: <b style="color:#4ade80;">+500 🪙</b>
                    </div>
                </div>
            </div>
        
            <div style="width:100%;max-width:920px;display:flex;justify-content:space-between;font-size:0.8rem;color:#94a3b8;">
                <span>Controls: Hold [SPACE / Click / Up] Jump & Wave • [P] Practice • [Z] Checkpoint • [X] Del</span>
                <span>Best Normal: <b id="gd-best-label" style="color:#fde047;">0%</b></span>
            </div>
        `;
        
        document.body.appendChild(modal);
        window.gdRenderLeaderboard();
        
        const canvas = document.getElementById('gd-canvas');
        const setHold = val => {
            const st = window.GD_STATE;
            if (val && !st.holding) st.justPressed = true;
            st.holding = val;
        };
        
        canvas.onmousedown = () => setHold(true);
        canvas.onmouseup = () => setHold(false);
        canvas.ontouchstart = e => {
            e.preventDefault();
            setHold(true);
        };
        canvas.ontouchend = () => setHold(false);
        
        document.getElementById('gd-exit-btn').onclick = window.gdCloseGame;
        document.getElementById('gd-mute-btn').onclick = () => {
            window.GD_STATE.muted = !window.GD_STATE.muted;
            document.getElementById('gd-mute-btn').textContent = window.GD_STATE.muted ? '🔇 MUTED' : '🔊 SFX';
        };
        document.getElementById('gd-practice-btn').onclick = window.gdTogglePractice;
        
        const keyDown = e => {
            if (!window.GD_STATE.active) return;
            if (e.code === 'Escape') window.gdCloseGame();
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                setHold(true);
            }
            if (e.code === 'KeyP') window.gdTogglePractice();
            if (e.code === 'KeyZ') window.gdSaveCheckpoint();
            if (e.code === 'KeyX') window.gdDeleteCheckpoint();
        };
        const keyUp = e => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') setHold(false);
        };
        
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        window.GD_STATE.listeners.push(Array.of(window, 'keydown', keyDown));
        window.GD_STATE.listeners.push(Array.of(window, 'keyup', keyUp));
    };
    
    window.gdTogglePractice = function () {
        const st = window.GD_STATE;
        st.practiceMode = !st.practiceMode;
        const btn = document.getElementById('gd-practice-btn');
        if (btn) btn.textContent = st.practiceMode ? '💎 PRACTICE: ON [P]' : '💎 PRACTICE: OFF [P]';
        st.attempts = 1;
        window.gdResetRun(false);
    };
    
    window.gdRefreshHud = function (pct) {
        const st = window.GD_STATE;
        const bar = document.getElementById('gd-pct-bar');
        const txt = document.getElementById('gd-pct-text');
        const att = document.getElementById('gd-attempt-badge');
        const mode = document.getElementById('gd-mode-badge');
        const best = document.getElementById('gd-best-label');
        if (bar) bar.style.width = pct + '%';
        if (txt) txt.textContent = pct + '%';
        if (att) att.textContent = 'ATTEMPT ' + st.attempts;
        if (mode) mode.textContent = (st.mini ? 'MINI ' : '') + st.mode.toUpperCase() + ' • ' + st.speedMult.toFixed(1) + 'X';
        if (best) best.textContent = st.bestPct + '%';
    };
    
    window.gdRenderLeaderboard = function () {
        const listEl = document.getElementById('gd-leaderboard-list');
        if (!listEl) return;
        const board = window.gdUpdateLeaderboard(window.GD_STATE.bestPct) || Array.of();
        listEl.innerHTML = board.map((row, i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-radius:6px;background:${row.isUser ? '#083344' : '#1e293b'};border:1px solid ${row.isUser ? '#22d3ee' : '#334155'};">
                <span style="font-weight:${row.isUser ? 'bold' : 'normal'};color:${row.isUser ? '#67e8f9' : '#e2e8f0'};">#${i + 1} ${row.name}</span>
                <span style="font-weight:bold;color:#fde047;">${row.pct}%</span>
            </div>
        `).join('');
    };
    
    window.gdShowVictoryOverlay = function (bal, coinsAdded, board) {
        window.gdRenderLeaderboard();
        const ov = document.getElementById('gd-overlay-msg');
        if (!ov) return;
        ov.style.display = 'flex';
        ov.innerHTML = `
            <div style="font-size:2.1rem;font-weight:900;color:#fde047;margin-bottom:8px;">🏆 DEADLOCKED 100% COMPLETE!</div>
            <p style="color:#cbd5e1;margin-bottom:14px;">Undisputed King of the Leaderboard in ${window.GD_STATE.attempts} attempt(s)!</p>
            <div style="background:#052e16;border:1px solid #4ade80;color:#bbf7d0;padding:10px 16px;border-radius:8px;margin-bottom:16px;font-weight:bold;">
                +${coinsAdded} AFCS COINS (Balance: ${bal} 🪙)
            </div>
            <button id="gd-replay-btn" style="background:#06b6d4;color:#042f2e;border:none;padding:10px 22px;border-radius:8px;font-weight:900;cursor:pointer;">↻ PLAY AGAIN</button>
        `;
        document.getElementById('gd-replay-btn').onclick = () => {
            ov.style.display = 'none';
            window.GD_STATE.attempts = 1;
            window.gdResetRun(false);
        };
    };
    
    window.gdStartLoop = function () {
        const st = window.GD_STATE;
        const canvas = document.getElementById('gd-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        st.lastTime = performance.now();
        
        const tick = now => {
            if (!st.active) return;
            const dt = Math.min(0.033, (now - st.lastTime) / 1000);
            st.lastTime = now;
            window.gdUpdatePhysics(dt);
            window.gdRenderCanvas(ctx, canvas);
            st.rafId = requestAnimationFrame(tick);
        };
        st.rafId = requestAnimationFrame(tick);
    };
    window.gdCloseGame = function () {
        const st = window.GD_STATE;
        st.active = false;
        if (st.rafId) cancelAnimationFrame(st.rafId);
        st.rafId = null;
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.listeners = Array.of();
        const modal = document.getElementById('gd-deadlocked-modal');
        if (modal) modal.remove();
    };
    window.launchGdDeadlocked = function () {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('gd');
        if (!window.GD_CFG) startGdDeadlockedData();
        if (!window.gdBuildDeadlockedMap) startGdDeadlockedLevel();
        if (!window.gdUpdatePhysics) startGdDeadlockedEngine();
        window.gdCloseGame();
        const st = window.GD_STATE;
        st.active = true;
        st.attempts = 1;
        window.gdBuildDeadlockedMap();
        window.gdBuildModal();
        window.gdResetRun(false);
        window.gdStartLoop();
    };
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (window.GD_CFG.triggers.includes(clean)) {
                window.launchGdDeadlocked();
            }
        });
    }
}
function startBuckshotData() {
    window.BUCK_CFG = {
        triggers: Array.of('buckshot', 'roulette', 'dealer', 'shotgun', 'solver roulette'),
        rewardCoins: 250,
        maxRounds: 3,
        roundHp: Array.of(2, 3, 4),
        items: Array.of(
            { id: 'glass', icon: '🔍', name: 'Magnifying Glass', desc: 'Inspect the current shell in the chamber.' },
            { id: 'saw', icon: '🪚', name: 'Hand Saw', desc: 'Double damage (2 DMG) on your next shot.' },
            { id: 'soda', icon: '🥤', name: 'Solver Soda', desc: 'Eject the current shell without firing.' },
            { id: 'cuffs', icon: '⛓️', name: 'Handcuffs', desc: 'Cyn skips her next turn.' },
            { id: 'battery', icon: '🔋', name: 'Battery Core', desc: 'Restore +1 Charge (up to round max).' }
        )
    };
    
    window.BUCK_STATE = {
        active: false,
        round: 1,
        maxHp: 2,
        playerHp: 2,
        cynHp: 2,
        shells: Array.of(),
        playerItems: Array.of(),
        cynItems: Array.of(),
        sawed: false,
        cynCuffed: false,
        playerCuffed: false,
        turn: 'player',
        busy: false,
        knownShell: null,
        logs: Array.of(),
        audioCtx: null,
        timers: Array.of(),
        listeners: Array.of()
    };
    
    window.buckAddTimer = function (fn, ms) {
        const id = setTimeout(fn, ms);
        window.BUCK_STATE.timers.push(id);
        return id;
    };
    
    window.buckClearAsync = function () {
        const st = window.BUCK_STATE;
        st.timers.forEach(clearTimeout);
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.timers = Array.of();
        st.listeners = Array.of();
    };
    
    window.buckSfx = function (kind) {
        const st = window.BUCK_STATE;
        try {
            if (!st.audioCtx) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) st.audioCtx = new Ctx();
            }
            if (!st.audioCtx) return;
            if (st.audioCtx.state === 'suspended') st.audioCtx.resume();
            const now = st.audioCtx.currentTime;
            const osc = st.audioCtx.createOscillator();
            const gain = st.audioCtx.createGain();
            if (kind === 'live') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
                gain.gain.setValueAtTime(0.16, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
            } else if (kind === 'blank') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(640, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
            }
            osc.connect(gain);
            gain.connect(st.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.38);
        } catch (e) {}
    };
    
    window.buckAwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
}
function startBuckshotAI() {
    window.buckPushLog = function (msg) {
        const st = window.BUCK_STATE;
        st.logs.unshift(msg);
        if (st.logs.length > 5) st.logs.pop();
    };
    
    window.buckDealItems = function (arr, count) {
        const pool = window.BUCK_CFG.items;
        for (let i = 0; i < count; i++) {
            if (arr.length >= 4) break;
            const pick = pool.at(Math.floor(Math.random() * pool.length));
            arr.push(pick.id);
        }
    };
    
    window.buckLoadChamber = function () {
        const st = window.BUCK_STATE;
        const total = Math.min(8, 3 + st.round + Math.floor(Math.random() * 2));
        const liveCount = Math.max(1, Math.min(total - 1, Math.floor(total / 2) + (Math.random() < 0.5 ? 1 : 0)));
        const blankCount = total - liveCount;
        
        const chamber = Array.of();
        for (let i = 0; i < liveCount; i++) chamber.push('live');
        for (let i = 0; i < blankCount; i++) chamber.push('blank');
        
        for (let i = chamber.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = chamber.at(i);
            chamber[i] = chamber.at(j);
            chamber[j] = tmp;
        }
        
        st.shells = chamber;
        st.sawed = false;
        st.knownShell = null;
        
        const dealQty = st.round === 1 ? 2 : 3;
        window.buckDealItems(st.playerItems, dealQty);
        window.buckDealItems(st.cynItems, dealQty);
        
        window.buckSfx('item');
        window.buckPushLog('🔄 Chamber loaded: ' + liveCount + ' LIVE (🔴) • ' + blankCount + ' BLANK (🔵)');
        window.buckRenderTable('🔄 NEW LOAD: ' + liveCount + ' LIVE 🔴  |  ' + blankCount + ' BLANK 🔵', '#fde047');
    };
    
    window.buckStartRound = function (roundNum) {
        const st = window.BUCK_STATE;
        st.round = roundNum;
        const hp = window.BUCK_CFG.roundHp.at(roundNum - 1) || 3;
        st.maxHp = hp;
        st.playerHp = hp;
        st.cynHp = hp;
        st.playerItems = Array.of();
        st.cynItems = Array.of();
        st.cynCuffed = false;
        st.playerCuffed = false;
        st.turn = 'player';
        st.busy = false;
        window.buckLoadChamber();
    };
    
    window.buckUseItem = function (who, itemIdx) {
        const st = window.BUCK_STATE;
        if (!st.active || st.busy) return;
        const inv = who === 'player' ? st.playerItems : st.cynItems;
        const itemId = inv.at(itemIdx);
        if (!itemId) return;
        
        inv.splice(itemIdx, 1);
        window.buckSfx('item');
        const label = who === 'player' ? 'You' : 'Cyn';
        
        if (itemId === 'glass') {
            const top = st.shells.at(0);
            if (who === 'player') {
                st.knownShell = top;
                window.buckPushLog('🔍 Magnifying Glass: Current shell is ' + (top === 'live' ? 'LIVE 🔴' : 'BLANK 🔵') + '!');
                window.buckRenderTable('🔍 THE CURRENT SHELL IS ' + (top === 'live' ? 'LIVE 🔴' : 'BLANK 🔵'), top === 'live' ? '#f87171' : '#60a5fa');
            } else {
                st.knownShell = top;
                window.buckPushLog('🔍 Cyn peered through a Magnifying Glass...');
                window.buckRenderTable('🔍 Cyn inspected the chamber...', '#c084fc');
            }
        } else if (itemId === 'saw') {
            st.sawed = true;
            window.buckPushLog('🪚 ' + label + ' sawed off the barrel! (Next shot: 2 DMG)');
            window.buckRenderTable('🪚 BARREL SAWED OFF — NEXT SHOT DEALS 2 DAMAGE!', '#fb923c');
        } else if (itemId === 'soda') {
            const ejected = st.shells.shift();
            st.knownShell = null;
            window.buckPushLog('🥤 ' + label + ' racked out a ' + (ejected === 'live' ? 'LIVE 🔴' : 'BLANK 🔵') + ' shell.');
            window.buckRenderTable('🥤 EJECTED: ' + (ejected === 'live' ? 'LIVE 🔴' : 'BLANK 🔵'), '#38bdf8');
            if (st.shells.length === 0) {
                st.busy = true;
                window.buckAddTimer(() => {
                    if (!st.active) return;
                    st.busy = false;
                    window.buckLoadChamber();
                }, 900);
            }
        } else if (itemId === 'cuffs') {
            if (who === 'player') {
                st.cynCuffed = true;
                window.buckPushLog('⛓️ You cuffed Cyn! She will skip her next turn.');
                window.buckRenderTable('⛓️ CYN HANDCUFFED — SHE SKIPS HER NEXT TURN!', '#fde047');
            } else {
                st.playerCuffed = true;
                window.buckPushLog('⛓️ Cyn cuffed your wrists! You will skip your next turn.');
                window.buckRenderTable('⛓️ YOU ARE HANDCUFFED — NEXT TURN SKIPPED!', '#f87171');
            }
        } else if (itemId === 'battery') {
            if (who === 'player') {
                st.playerHp = Math.min(st.maxHp, st.playerHp + 1);
            } else {
                st.cynHp = Math.min(st.maxHp, st.cynHp + 1);
            }
            window.buckPushLog('🔋 ' + label + ' absorbed a Battery Core (+1 Charge).');
            window.buckRenderTable('🔋 ' + label.toUpperCase() + ' RESTORED +1 CHARGE!', '#4ade80');
        }
    };
    
    window.buckFireShot = function (shooter, target) {
        const st = window.BUCK_STATE;
        if (!st.active || st.busy || st.shells.length === 0) return;
        st.busy = true;
        
        const shell = st.shells.shift();
        const dmg = st.sawed ? 2 : 1;
        st.sawed = false;
        st.knownShell = null;
        
        if (shell === 'live') {
            window.buckSfx('live');
            if (target === 'cyn') {
                st.cynHp = Math.max(0, st.cynHp - dmg);
                window.buckPushLog('💥 LIVE SHELL! ' + (shooter === 'player' ? 'You' : 'Cyn') + ' blasted Cyn for ' + dmg + ' DMG!');
                window.buckRenderTable('💥 BOOM! LIVE SHELL HIT CYN (-' + dmg + ' CHARGE)', '#ef4444');
            } else {
                st.playerHp = Math.max(0, st.playerHp - dmg);
                window.buckPushLog('💥 LIVE SHELL! ' + (shooter === 'player' ? 'You' : 'Cyn') + ' took ' + dmg + ' DMG!');
                window.buckRenderTable('💥 BOOM! LIVE SHELL HIT YOU (-' + dmg + ' CHARGE)', '#ef4444');
            }
        } else {
            window.buckSfx('blank');
            window.buckPushLog('💨 *CLICK* — Blank shell at ' + (target === 'cyn' ? 'Cyn' : 'You') + '.');
            window.buckRenderTable('💨 *CLICK* — IT WAS A BLANK SHELL!', '#60a5fa');
        }
        
        window.buckAddTimer(() => {
            if (!st.active) return;
            
            if (st.playerHp <= 0) {
                window.buckEndMatch(false);
                return;
            }
            if (st.cynHp <= 0) {
                if (st.round < window.BUCK_CFG.maxRounds) {
                    window.buckPushLog('⚡ Cyn rebooting... Advancing to Round ' + (st.round + 1) + '!');
                    window.buckStartRound(st.round + 1);
                } else {
                    window.buckEndMatch(true);
                }
                return;
            }
            
            const keepTurn = (shell === 'blank' && shooter === target);
            let nextTurn = keepTurn ? shooter : (shooter === 'player' ? 'cyn' : 'player');
            
            if (nextTurn === 'cyn' && st.cynCuffed) {
                st.cynCuffed = false;
                nextTurn = 'player';
                window.buckPushLog('⛓️ Cyn struggled against the cuffs — still your turn!');
            } else if (nextTurn === 'player' && st.playerCuffed) {
                st.playerCuffed = false;
                nextTurn = 'cyn';
                window.buckPushLog('⛓️ You were cuffed — Cyn takes another turn!');
            }
            
            st.turn = nextTurn;
            st.busy = false;
            
            if (st.shells.length === 0) {
                window.buckLoadChamber();
            } else {
                window.buckRenderTable(
                    st.turn === 'player' ? '🎯 YOUR TURN — Choose your move!' : '⚠️ CYN IS CALCULATING...',
                    st.turn === 'player' ? '#fde047' : '#f43f5e'
                );
            }
            
            if (st.turn === 'cyn') {
                window.buckAddTimer(window.buckRunCynTurn, 1050);
            }
        }, 950);
    };
    
    window.buckRunCynTurn = function () {
        const st = window.BUCK_STATE;
        if (!st.active || st.turn !== 'cyn' || st.busy) return;
        
        if (st.cynHp < st.maxHp && st.cynItems.includes('battery')) {
            window.buckUseItem('cyn', st.cynItems.indexOf('battery'));
            window.buckAddTimer(window.buckRunCynTurn, 850);
            return;
        }
        
        if (!st.knownShell && st.shells.length > 1 && st.cynItems.includes('glass')) {
            window.buckUseItem('cyn', st.cynItems.indexOf('glass'));
            window.buckAddTimer(window.buckRunCynTurn, 850);
            return;
        }
        
        const liveLeft = st.shells.filter(s => s === 'live').length;
        const blankLeft = st.shells.length - liveLeft;
        
        if (st.knownShell === 'blank' && st.shells.length > 1 && st.cynItems.includes('soda')) {
            window.buckUseItem('cyn', st.cynItems.indexOf('soda'));
            window.buckAddTimer(window.buckRunCynTurn, 850);
            return;
        }
        
        const highLiveOdds = st.knownShell === 'live' || (st.knownShell !== 'blank' && liveLeft >= blankLeft);
        
        if (highLiveOdds && !st.cynCuffed && st.cynItems.includes('cuffs') && !st.playerCuffed) {
            window.buckUseItem('cyn', st.cynItems.indexOf('cuffs'));
            window.buckAddTimer(window.buckRunCynTurn, 850);
            return;
        }
        
        if (highLiveOdds && !st.sawed && st.cynItems.includes('saw')) {
            window.buckUseItem('cyn', st.cynItems.indexOf('saw'));
            window.buckAddTimer(window.buckRunCynTurn, 850);
            return;
        }
        
        if (highLiveOdds) {
            window.buckFireShot('cyn', 'player');
        } else {
            window.buckFireShot('cyn', 'cyn');
        }
    };
}
function startBuckshotModal() {
    window.buckBuildModal = function () {
        const old = document.getElementById('buckshot-solver-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'buckshot-solver-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at center,#1c1917 0%,#09090b 100%);color:#f5f5f4;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:880px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #292524;padding-bottom:10px;">
                <div style="display:flex;gap:12px;align-items:center;">
                    <span style="font-size:1.2rem;font-weight:900;color:#fbbf24;letter-spacing:1px;">🎲 BUCKSHOT ROULETTE: SOLVER EDITION</span>
                    <span id="buck-round-badge" style="background:#292524;border:1px solid #eab308;color:#fde047;padding:4px 10px;border-radius:6px;font-size:0.82rem;font-weight:bold;">ROUND 1 / 3</span>
                </div>
                <button id="buck-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:bold;">✕ LEAVE TABLE</button>
            </div>
        
            <div id="buck-banner" style="font-size:1.05rem;font-weight:bold;color:#fde047;text-align:center;min-height:28px;">
                Loading chamber...
            </div>
        
            <div id="buck-table" style="width:100%;max-width:880px;flex:1;margin:10px 0;background:#141210;border:2px solid #44403c;border-radius:14px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:inset 0 0 70px #000;"></div>
        
            <div style="width:100%;max-width:880px;display:flex;justify-content:space-between;font-size:0.82rem;color:#a8a29e;">
                <span>Tip: Shooting YOURSELF with a BLANK (🔵) gives you an extra turn!</span>
                <span>Round 3 Clear Reward: <b style="color:#4ade80;">+250 🪙</b></span>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('buck-exit-btn').onclick = window.buckCloseGame;
        
        const keyHandler = function (e) {
            if (!window.BUCK_STATE.active) return;
            if (e.code === 'Escape') window.buckCloseGame();
        };
        window.addEventListener('keydown', keyHandler);
        window.BUCK_STATE.listeners.push(Array.of(window, 'keydown', keyHandler));
    };
    
    window.buckRenderHp = function (cur, max, color) {
        return Array.from({ length: max }, (_, i) => {
            const on = i < cur;
            return `<span style="display:inline-block;width:22px;height:14px;border-radius:3px;background:${on ? color : '#292524'};border:1px solid ${on ? '#fff' : '#57534e'};margin-right:4px;"></span>`;
        }).join('');
    };
    
    window.buckRenderTable = function (bannerText, bannerColor) {
        const st = window.BUCK_STATE;
        const table = document.getElementById('buck-table');
        const roundBadge = document.getElementById('buck-round-badge');
        const banner = document.getElementById('buck-banner');
        if (!table) return;
        
        if (roundBadge) roundBadge.textContent = 'ROUND ' + st.round + ' / ' + window.BUCK_CFG.maxRounds;
        if (banner && bannerText) {
            banner.textContent = bannerText;
            banner.style.color = bannerColor || '#fde047';
        }
        
        const isPlayerTurn = st.turn === 'player' && !st.busy;
        const itemMap = new Map(window.BUCK_CFG.items.map(it => Array.of(it.id, it)));
        
        table.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;background:#1c1917;border:1px solid #44403c;padding:12px 16px;border-radius:10px;">
                <div>
                    <div style="font-weight:900;color:#f43f5e;font-size:1rem;margin-bottom:4px;">
                        ⬡ CYN (ABSOLUTE SOLVER) ${st.cynCuffed ? '⛓️ [CUFFED]' : ''}
                    </div>
                    <div>${window.buckRenderHp(st.cynHp, st.maxHp, '#f43f5e')}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
                    ${st.cynItems.map(id => {
        const it = itemMap.get(id);
        return `<span title="${it?.name || ''}" style="background:#292524;border:1px solid #57534e;padding:6px 10px;border-radius:8px;font-size:1.1rem;">${it?.icon || '📦'}</span>`;
    }).join('') || '<span style="font-size:0.78rem;color:#78716c;">No items</span>'}
                </div>
            </div>
    
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin:10px 0;">
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="background:#292524;border:2px solid ${st.sawed ? '#fb923c' : '#78716c'};padding:10px 20px;border-radius:10px;text-align:center;">
                        <div style="font-size:1.8rem;">🔫 ${st.sawed ? '🪚 (2 DMG)' : ''}</div>
                        <div style="font-size:0.78rem;color:#d6d3d1;margin-top:4px;">Shells Left: <b>${st.shells.length}</b></div>
                    </div>
                    ${st.knownShell ? `<div style="background:#083344;border:2px solid #22d3ee;padding:10px 14px;border-radius:10px;color:#67e8f9;font-weight:bold;font-size:0.85rem;">🔍 NEXT: ${st.knownShell === 'live' ? 'LIVE 🔴' : 'BLANK 🔵'}</div>` : ''}
                </div>
    
                <div style="display:flex;gap:14px;">
                    <button id="buck-shoot-cyn" ${isPlayerTurn ? '' : 'disabled'} style="background:${isPlayerTurn ? '#991b1b' : '#292524'};color:${isPlayerTurn ? '#fecaca' : '#78716c'};border:2px solid ${isPlayerTurn ? '#ef4444' : '#44403c'};padding:12px 22px;border-radius:10px;font-weight:900;cursor:${isPlayerTurn ? 'pointer' : 'not-allowed'};font-size:0.95rem;">
                        🎯 SHOOT CYN
                    </button>
                    <button id="buck-shoot-self" ${isPlayerTurn ? '' : 'disabled'} style="background:${isPlayerTurn ? '#1e3a8a' : '#292524'};color:${isPlayerTurn ? '#bfdbfe' : '#78716c'};border:2px solid ${isPlayerTurn ? '#3b82f6' : '#44403c'};padding:12px 22px;border-radius:10px;font-weight:900;cursor:${isPlayerTurn ? 'pointer' : 'not-allowed'};font-size:0.95rem;">
                        🔄 SHOOT SELF
                    </button>
                </div>
    
                <div style="width:100%;max-width:560px;background:#0c0a09;border:1px solid #292524;border-radius:8px;padding:8px 12px;font-size:0.78rem;color:#a8a29e;min-height:54px;">
                    ${st.logs.slice(0, 3).map((line, i) => `<div style="opacity:${1 - i * 0.25};">${line}</div>`).join('')}
                </div>
            </div>
    
            <div style="display:flex;justify-content:space-between;align-items:center;background:#1c1917;border:1px solid #44403c;padding:12px 16px;border-radius:10px;">
                <div>
                    <div style="font-weight:900;color:#38bdf8;font-size:1rem;margin-bottom:4px;">
                        🧑‍🎓 YOU ${st.playerCuffed ? '⛓️ [CUFFED]' : ''}
                    </div>
                    <div>${window.buckRenderHp(st.playerHp, st.maxHp, '#38bdf8')}</div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
                    ${st.playerItems.map((id, idx) => {
    const it = itemMap.get(id);
    return `<button class="buck-item-btn" data-idx="${idx}" ${isPlayerTurn ? '' : 'disabled'} title="${it?.desc || ''}" style="background:#292524;color:#fde047;border:1px solid ${isPlayerTurn ? '#eab308' : '#44403c'};padding:8px 12px;border-radius:8px;cursor:${isPlayerTurn ? 'pointer' : 'not-allowed'};font-size:0.82rem;font-weight:bold;">
                            ${it?.icon || '📦'} ${it?.name || id}
                        </button>`;
}).join('') || '<span style="font-size:0.78rem;color:#78716c;">No items remaining</span>'}
                </div>
            </div>
        `;

const shootCynBtn = document.getElementById('buck-shoot-cyn');
const shootSelfBtn = document.getElementById('buck-shoot-self');
if (shootCynBtn) shootCynBtn.onclick = () => window.buckFireShot('player', 'cyn');
if (shootSelfBtn) shootSelfBtn.onclick = () => window.buckFireShot('player', 'player');

table.querySelectorAll('.buck-item-btn').forEach(btn => {
    btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        window.buckUseItem('player', idx);
    };
});
};
}
function startBuckshotController() {
    window.buckEndMatch = function (won) {
        const st = window.BUCK_STATE;
        st.active = false;
        window.buckClearAsync();
        
        const table = document.getElementById('buck-table');
        if (!table) return;
        
        let bal = null;
        if (won) {
            bal = window.buckAwardCoins(window.BUCK_CFG.rewardCoins);
        }
        
        table.innerHTML = `
            <div style="margin:auto;text-align:center;max-width:460px;">
                <div style="font-size:2.3rem;margin-bottom:8px;">${won ? '🏆 YOU OUTSMARTED CYN!' : '💀 SOLVER ELIMINATED YOU'}</div>
                <p style="color:#d6d3d1;line-height:1.5;margin-bottom:16px;">
                    ${won ? 'All 3 rounds survived! You walked away from the table with the AFCS jackpot.' : 'Cyn read the chamber odds and drained your charges in Round ' + st.round + '.'}
                </p>
                ${won ? `<div style="background:#052e16;border:1px solid #4ade80;color:#bbf7d0;padding:10px;border-radius:8px;margin-bottom:16px;font-weight:bold;">+${window.BUCK_CFG.rewardCoins} AFCS COINS (Balance: ${bal} 🪙)</div>` : ''}
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="buck-retry-btn" style="background:#eab308;color:#09090b;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:900;">↻ PLAY AGAIN</button>
                    <button id="buck-done-btn" style="background:#292524;color:#e7e5e4;border:1px solid #57534e;padding:10px 20px;border-radius:8px;cursor:pointer;">EXIT</button>
                </div>
            </div>
        `;
        
        document.getElementById('buck-retry-btn').onclick = window.launchBuckshotSolver;
        document.getElementById('buck-done-btn').onclick = window.buckCloseGame;
    };
    
    window.buckCloseGame = function () {
        window.BUCK_STATE.active = false;
        window.buckClearAsync();
        const modal = document.getElementById('buckshot-solver-modal');
        if (modal) modal.remove();
    };
    
    window.launchBuckshotSolver = function () {
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('buckshot');
        if (!window.BUCK_CFG) startBuckshotData();
        if (!window.buckStartRound) startBuckshotAI();
        if (!window.buckBuildModal) startBuckshotModal();
        window.buckClearAsync();
        const st = window.BUCK_STATE;
        st.active = true;
        st.logs = Array.of();
        window.buckBuildModal();
        window.buckStartRound(1);
    };
    
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (window.BUCK_CFG.triggers.includes(clean)) {
                window.launchBuckshotSolver();
            }
        });
    }
}
function startArcadeHubData() {
    window.ARCADE_STORAGE_KEY = 'afcs_unlocked_games';
    
    window.ARCADE_REGISTRY = Array.of(
        {
            id: 'cards',
            title: 'Holographic Card Binder',
            icon: '🃏',
            reward: '50 🪙 / Pack',
            hint: 'Search what you collect in a TCG...',
            triggers: Array.of('cards', 'binder', 'tcg'),
            launch: () => {
                if (typeof window.openTradingCardBinder === 'function') window.openTradingCardBinder();
            }
        },
        {
            id: 'whack',
            title: 'Solver Core Defense',
            icon: '⬡',
            reward: '+25–150 🪙',
            hint: 'Type the Solver error symbol [null]...',
            triggers: Array.of('[null]', 'whack a cyn', 'cyn'),
            launch: () => {
                if (typeof window.openWhackACynGame === 'function') window.openWhackACynGame();
            }
        },
        {
            id: 'pjsk',
            title: '3D PJSK Live Stage',
            icon: '🎵',
            reward: '+15–110 🪙',
            hint: 'Say the signature Wonderhoi catchphrase...',
            triggers: Array.of('pjsk', 'sekai', 'wonderhoi'),
            launch: () => {
                if (typeof window.openPjskLiveGame === 'function') window.openPjskLiveGame();
            }
        },
        {
            id: 'fission',
            title: 'Fission Man1a! OS',
            icon: '☢️',
            reward: '+120 🪙',
            hint: 'Search the 50,000-line nuclear reactor simulator...',
            triggers: Array.of('fission', 'fission mania'),
            launch: () => {
                if (typeof window.openFissionMania === 'function') window.openFissionMania();
                else if (typeof window.openFissionManiaGame === 'function') window.openFissionManiaGame();
            }
        },
        {
            id: 'chess',
            title: 'Chess.com Bot Gauntlet',
            icon: '♟️',
            reward: '+10–1000 🪙',
            hint: 'Challenge Martin, Magnus, or the dreaded Fish...',
            triggers: Array.of('chess', 'chess.com', 'stockfish', '2823'),
            launch: () => {
                if (typeof window.openChessComBots === 'function') window.openChessComBots();
            }
        },
        {
            id: 'doors',
            title: 'DOORS: The Hotel (0000–0100)',
            icon: '🚪',
            reward: '+250 🪙',
            hint: 'Enter the hotel where Guiding Light watches...',
            triggers: Array.of('doors', 'rush', 'ambush', 'figure', 'seek', 'eyes', 'guiding light', 'door 100', 'hotel'),
            launch: () => {
                if (typeof window.launchDoorsGame === 'function') window.launchDoorsGame();
            }
        },
        {
            id: 'elevator',
            title: 'Burj Khalifa Expedition (163F)',
            icon: '🏙️',
            reward: '+300 🪙',
            hint: 'Search the Dubai skyscraper in lockdown...',
            triggers: Array.of('burj', 'burj khalifa', 'elevator', '163', 'lockdown', 'dubai'),
            launch: () => {
                if (typeof window.launchBurjElevator === 'function') window.launchBurjElevator();
            }
        },
        {
            id: 'gd',
            title: 'Geometry Dash: Deadlocked',
            icon: '⚡',
            reward: '+500 🪙',
            hint: 'Search RobTop’s iconic 3x wave demon level...',
            triggers: Array.of('gd', 'geometry dash', 'deadlocked', 'wave', 'dash', 'robtop'),
            launch: () => {
                if (typeof window.launchGdDeadlocked === 'function') window.launchGdDeadlocked();
            }
        },
        {
            id: 'buckshot',
            title: 'Buckshot Roulette: Solver',
            icon: '🎲',
            reward: '+250 🪙',
            hint: 'Challenge the Dealer to live & blank shells...',
            triggers: Array.of('buckshot', 'roulette', 'dealer', 'shotgun', 'solver roulette'),
            launch: () => {
                if (typeof window.launchBuckshotSolver === 'function') window.launchBuckshotSolver();
            }
        }
    );
    
    window.arcadeGetUnlocked = function () {
        try {
            const raw = JSON.parse(localStorage.getItem(window.ARCADE_STORAGE_KEY) || '[]');
            return Array.isArray(raw) ? raw : Array.of();
        } catch (e) {
            return Array.of();
        }
    };
    
    window.arcadeUnlockGame = function (gameId) {
        const unlocked = window.arcadeGetUnlocked();
        if (!unlocked.includes(gameId)) {
            unlocked.push(gameId);
            localStorage.setItem(window.ARCADE_STORAGE_KEY, JSON.stringify(unlocked));
            if (typeof window.arcadeUpdateBadge === 'function') window.arcadeUpdateBadge();
        }
    };
    
    window.arcadeRegisterGame = function (entry) {
        if (!entry || !entry.id) return;
        const idx = window.ARCADE_REGISTRY.findIndex(g => g.id === entry.id);
        if (idx >= 0) window.ARCADE_REGISTRY[idx] = entry;
        else window.ARCADE_REGISTRY.push(entry);
        if (typeof window.arcadeUpdateBadge === 'function') window.arcadeUpdateBadge();
    };
}
function startArcadeHubUI() {
    window.openArcadeHub = function () {
        const old = document.getElementById('afcs-arcade-modal');
        if (old) old.remove();
        
        const unlocked = window.arcadeGetUnlocked();
        const totalCount = window.ARCADE_REGISTRY.length;
        const foundCount = window.ARCADE_REGISTRY.filter(g => unlocked.includes(g.id)).length;
        const coins = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        
        const modal = document.createElement('div');
        modal.id = 'afcs-arcade-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(2,6,23,0.92);backdrop-filter:blur(8px);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:18px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:860px;max-height:88vh;background:#0f172a;border:2px solid #334155;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
                <div style="padding:16px 20px;background:#090d16;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:1.3rem;font-weight:900;color:#38bdf8;letter-spacing:1px;">🕹️ AFCS ARCADE CODEX</span>
                        <span style="background:#1e293b;border:1px solid #38bdf8;color:#7dd3fc;padding:4px 10px;border-radius:999px;font-size:0.8rem;font-weight:bold;">
                            ${foundCount} / ${totalCount} UNLOCKED
                        </span>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="background:#172554;border:1px solid #eab308;color:#fde047;padding:4px 12px;border-radius:8px;font-size:0.85rem;font-weight:bold;">
                            Balance: ${coins} 🪙
                        </span>
                        <button id="arcade-close-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✕ CLOSE</button>
                    </div>
                </div>
        
                <div style="padding:18px 20px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;">
                    ${window.ARCADE_REGISTRY.map(game => {
        const isUnlocked = unlocked.includes(game.id);
        if (!isUnlocked) {
            return `
                                <div style="background:#090d16;border:1px dashed #334155;border-radius:12px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;opacity:0.78;">
                                    <div>
                                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                            <span style="font-size:1.6rem;filter:grayscale(1) brightness(0.4);">🔒</span>
                                            <span style="font-size:0.72rem;background:#1e293b;color:#64748b;padding:3px 8px;border-radius:6px;font-weight:bold;">LOCKED</span>
                                        </div>
                                        <div style="font-weight:800;font-size:1rem;color:#64748b;margin-bottom:6px;">??? UNDISCOVERED</div>
                                        <p style="font-size:0.8rem;color:#94a3b8;line-height:1.4;margin:0;">
                                            💡 <i>${game.hint}</i>
                                        </p>
                                    </div>
                                    <div style="margin-top:12px;font-size:0.74rem;color:#475569;border-top:1px solid #1e293b;padding-top:8px;">
                                        Find via search bar to unlock
                                    </div>
                                </div>
                            `;
        }
        return `
                            <div style="background:linear-gradient(180deg,#1e293b 0%,#0f172a 100%);border:1px solid #38bdf8;border-radius:12px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 20px rgba(2,132,199,0.18);">
                                <div>
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                        <span style="font-size:1.8rem;">${game.icon}</span>
                                        <span style="font-size:0.75rem;background:#083344;border:1px solid #06b6d4;color:#67e8f9;padding:3px 8px;border-radius:6px;font-weight:bold;">${game.reward}</span>
                                    </div>
                                    <div style="font-weight:800;font-size:1.02rem;color:#f8fafc;margin-bottom:4px;">${game.title}</div>
                                    <div style="font-size:0.75rem;color:#94a3b8;">Code: <code style="color:#fde047;">${game.triggers.at(0)}</code></div>
                                </div>
                                <button class="arcade-play-btn" data-id="${game.id}" style="margin-top:14px;width:100%;background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:9px 12px;border-radius:8px;font-weight:800;cursor:pointer;font-size:0.88rem;">
                                    ▶ LAUNCH GAME
                                </button>
                            </div>
                        `;
    }).join('')}
                </div>
    
                <div style="padding:10px 20px;background:#090d16;border-top:1px solid #1e293b;font-size:0.78rem;color:#94a3b8;display:flex;justify-content:space-between;">
                    <span>Discover hidden mini-games via the search bar to permanently add them to your Arcade Codex.</span>
                    <span>Shortcut: type <b style="color:#38bdf8;">arcade</b></span>
                </div>
            </div>
        `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => {
        modal.remove();
        window.removeEventListener('keydown', escHandler);
    };
    const escHandler = e => {
        if (e.code === 'Escape') closeModal();
    };
    
    document.getElementById('arcade-close-btn').onclick = closeModal;
    modal.onclick = e => {
        if (e.target === modal) closeModal();
    };
    window.addEventListener('keydown', escHandler);
    
    modal.querySelectorAll('.arcade-play-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const target = window.ARCADE_REGISTRY.find(g => g.id === id);
            closeModal();
            if (target && typeof target.launch === 'function') {
                target.launch();
            }
        };
    });
};
}
function startArcadeHubHook() {
    window.arcadeUpdateBadge = function () {
        const btn = document.getElementById('afcs-arcade-dock-btn');
        if (!btn) return;
        const unlocked = window.arcadeGetUnlocked();
        const count = window.ARCADE_REGISTRY.filter(g => unlocked.includes(g.id)).length;
        btn.innerHTML = '🕹️ Arcade <span style="background:#083344;color:#67e8f9;padding:1px 6px;border-radius:999px;font-size:0.72rem;margin-left:4px;">' + count + '/' + window.ARCADE_REGISTRY.length + '</span>';
    };
    
    window.arcadeGetOrCreateDock = function () {
        let dock = document.getElementById('afcs-quick-dock');
        if (dock) return dock;
        
        dock = document.createElement('div');
        dock.id = 'afcs-quick-dock';
        dock.style.cssText = 'position:fixed;left:24px;top:176px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;z-index:90;max-width:calc(100vw - 48px);';
        if (window.innerWidth <= 768) {
            dock.style.left = '12px';
            dock.style.top = '152px';
        }
        document.body.appendChild(dock);
        return dock;
    };
    
    window.arcadeMountButton = function () {
        const dock = window.arcadeGetOrCreateDock();
        if (document.getElementById('afcs-arcade-dock-btn')) {
            window.arcadeUpdateBadge();
            return;
        }
        
        const btn = document.createElement('button');
        btn.id = 'afcs-arcade-dock-btn';
        btn.title = 'Open AFCS Arcade Codex (Unlocked Mini-Games)';
        btn.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;gap:4px;background:rgba(15,23,42,0.92);color:#e2e8f0;border:1px solid #38bdf8;border-radius:10px;padding:7px 12px;font-size:0.84rem;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.45);transition:transform 0.15s,background 0.15s;';
        btn.onmouseenter = () => { btn.style.background = '#083344'; };
        btn.onmouseleave = () => { btn.style.background = 'rgba(15,23,42,0.92)'; };
        btn.onclick = window.openArcadeHub;
        
        dock.prepend(btn);
        window.arcadeUpdateBadge();
    };
    
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (!clean) return;
            if (clean === 'arcade' || clean === 'games' || clean === 'game codex') {
                window.openArcadeHub();
                return;
            }
            for (const game of window.ARCADE_REGISTRY) {
                if (game.triggers.includes(clean)) {
                    window.arcadeUnlockGame(game.id);
                }
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.arcadeMountButton);
    } else {
        window.arcadeMountButton();
    }
}
function startArcadeCompareEntry() {
    window.arcadeRegisterGame({
        id: 'compare',
        title: '1v1 Classmate RPG Battle',
        icon: '⚔️',
        reward: '+40–75 🪙',
        hint: 'Click "Compare With Another..." on any classmate card or search battle...',
        triggers: Array.of('compare', 'battle', '1v1', 'pvp', 'fight'),
        launch: () => window.openQuickComparePicker()
    });
    
    window.arcadeGetRoster = function () {
        if (typeof PEOPLE !== 'undefined' && Array.isArray(PEOPLE) && PEOPLE.length > 0) return PEOPLE;
        if (typeof window.PEOPLE !== 'undefined' && Array.isArray(window.PEOPLE) && window.PEOPLE.length > 0) return window.PEOPLE;
        if (typeof STATE !== 'undefined' && Array.isArray(STATE.people) && STATE.people.length > 0) return STATE.people;
        return Array.from({ length: 26 }, (_, i) => ({
            name: 'Classmate #' + (i + 1),
            role: 'Grade 7 – Psalms'
        }));
    };
    
    window.arcadeLaunchBattlePair = function (fighterA, fighterB, isOnline) {
        window.arcadeUnlockGame('compare');
        if (isOnline) {
            if (typeof window.startOnlineBattleUI === 'function') {
                window.startOnlineBattleUI(fighterA, fighterB);
                return;
            }
            if (typeof startOnlineBattleUI === 'function') {
                startOnlineBattleUI(fighterA, fighterB);
                return;
            }
        }
        if (typeof window.launchCompareBattle === 'function') {
            window.launchCompareBattle(fighterA, fighterB);
            return;
        }
        if (typeof window.startCompareBattleUI === 'function') {
            window.startCompareBattleUI(fighterA, fighterB);
            return;
        }
        if (typeof startCompareBattleUI === 'function') {
            startCompareBattleUI(fighterA, fighterB);
            return;
        }
        const compareBtns = Array.from(document.querySelectorAll('button, a')).filter(el =>
            (el.textContent || '').toLowerCase().includes('compare with another')
        );
        if (compareBtns.length > 0) compareBtns.at(0).click();
    };
    
    window.openQuickComparePicker = function () {
        const old = document.getElementById('arcade-compare-picker');
        if (old) old.remove();
        
        const roster = window.arcadeGetRoster();
        let idxA = 0;
        let idxB = roster.length > 1 ? 1 : 0;
        
        const modal = document.createElement('div');
        modal.id = 'arcade-compare-picker';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,0.92);backdrop-filter:blur(8px);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:18px;user-select:none;';
        
        const optionsHtml = roster.map((p, i) => {
            const label = typeof p === 'string' ? p : (p.name || p.fullName || ('Fighter #' + (i + 1)));
            return `<option value="${i}">${label}</option>`;
        }).join('');
        
        modal.innerHTML = `
            <div style="width:100%;max-width:520px;background:#0f172a;border:2px solid #38bdf8;border-radius:16px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;">
                    <span style="font-size:1.2rem;font-weight:900;color:#38bdf8;">⚔️ QUICK 1V1 RPG MATCHUP</span>
                    <button id="cmp-pick-close" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:bold;">✕</button>
                </div>
        
                <p style="font-size:0.85rem;color:#94a3b8;margin-bottom:16px;">
                    Pick any two fighters directly without leaving the Arcade Hub (+40 🪙 Local / +75 🪙 Online).
                </p>
        
                <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-bottom:16px;">
                    <div>
                        <label style="display:block;font-size:0.75rem;color:#38bdf8;font-weight:bold;margin-bottom:4px;">PLAYER 1 (YOU)</label>
                        <select id="cmp-select-a" style="width:100%;background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:9px;border-radius:8px;font-weight:bold;">
                            ${optionsHtml}
                        </select>
                    </div>
                    <div style="font-weight:900;color:#f43f5e;font-size:1.1rem;padding-top:16px;">VS</div>
                    <div>
                        <label style="display:block;font-size:0.75rem;color:#f43f5e;font-weight:bold;margin-bottom:4px;">OPPONENT</label>
                        <select id="cmp-select-b" style="width:100%;background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:9px;border-radius:8px;font-weight:bold;">
                            ${optionsHtml}
                        </select>
                    </div>
                </div>
        
                <div style="display:flex;gap:8px;margin-bottom:14px;">
                    <button id="cmp-rand-btn" style="flex:1;background:#1e293b;color:#fde047;border:1px solid #eab308;padding:8px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:0.82rem;">
                        🎲 RANDOMIZE FIGHTERS
                    </button>
                </div>
        
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <button id="cmp-start-local" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:11px;border-radius:8px;font-weight:900;cursor:pointer;">
                        🤖 LOCAL 1V1 (+40 🪙)
                    </button>
                    <button id="cmp-start-online" style="background:#7e22ce;color:#fff;border:1px solid #c084fc;padding:11px;border-radius:8px;font-weight:900;cursor:pointer;">
                        🌐 PEERJS ONLINE (+75 🪙)
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const selA = document.getElementById('cmp-select-a');
        const selB = document.getElementById('cmp-select-b');
        selA.value = String(idxA);
        selB.value = String(idxB);
        
        const closePicker = () => modal.remove();
        document.getElementById('cmp-pick-close').onclick = closePicker;
        modal.onclick = e => {
            if (e.target === modal) closePicker();
        };
        
        document.getElementById('cmp-rand-btn').onclick = () => {
            if (roster.length < 2) return;
            const a = Math.floor(Math.random() * roster.length);
            let b = Math.floor(Math.random() * roster.length);
            if (b === a) b = (a + 1) % roster.length;
            selA.value = String(a);
            selB.value = String(b);
        };
        
        document.getElementById('cmp-start-local').onclick = () => {
            const pA = roster.at(parseInt(selA.value, 10));
            const pB = roster.at(parseInt(selB.value, 10));
            closePicker();
            window.arcadeLaunchBattlePair(pA, pB, false);
        };
        
        document.getElementById('cmp-start-online').onclick = () => {
            const pA = roster.at(parseInt(selA.value, 10));
            const pB = roster.at(parseInt(selB.value, 10));
            closePicker();
            window.arcadeLaunchBattlePair(pA, pB, true);
        };
    };
    
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('button, a');
        if (!btn) return;
        const txt = (btn.textContent || '').toLowerCase();
        if (txt.includes('compare with another')) {
            window.arcadeUnlockGame('compare');
        }
    });
    
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (Array.of('compare', 'battle', '1v1', 'pvp', 'fight').includes(clean)) {
                window.arcadeUnlockGame('compare');
                window.openQuickComparePicker();
            }
        });
    }
}
function startWordleData() {
    const rawWords = 'PSALM DUBAI RISEN STONE LIGHT STAGE CROWN FAITH GRACE ANGEL STARS PEACE TOWER CHESS DOORS SOLVE SPARK HEART GLORY CHOIR ABOUT APPLE BEACH BLOCK CLOUD DANCE DREAM EARTH FLAME GHOST GLASS GREEN HAPPY HOUSE JUICE LEMON MAGIC MONEY MUSIC NIGHT OCEAN PARTY PHONE PLANT QUICK RIVER SHAPE SMILE SPACE STORM TABLE TIGER TRAIN WATER WORLD ALIVE ANGRY AWARD BADGE BASIC BRAIN BREAD BRICK BROWN BRUSH CHAIR CHALK CHASE CHILD CLOCK CLOWN COACH COAST CORAL COUNT CRAFT CRANE DAILY DOUBT DRAFT DRINK DRIVE EAGLE EARLY EMPTY ENEMY ENJOY ENTER EQUAL EVENT EXACT EXTRA FALSE FANCY FIELD FINAL FLOOR FOCUS FORCE FRAME FRESH FRONT FRUIT GIANT GLOBE GRADE GRAND GRAPE GRASS GREAT GROUP GUARD GUESS GUIDE HABIT HEAVY HONEY HORSE HOTEL HUMAN IDEAL IMAGE INDEX INNER ISSUE JOINT JUDGE KNIFE KNOCK LABEL LARGE LASER LAUGH LAYER LEARN LEVEL LIMIT LOCAL LOGIC LOOSE LUCKY LUNCH MAJOR MARCH MATCH METAL MODEL MONTH MOTOR MOUSE MOUTH MOVIE NEVER NOISE NORTH NOVEL NURSE OFFER OLIVE ORDER OTHER OUTER PAINT PANEL PAPER PHASE PIANO PIECE PILOT PITCH PLACE PLAIN PLANE PLATE POINT POUND POWER PRESS PRICE PRIDE PRIME PRINT PRIZE PROOF PROUD QUEEN RADIO RAISE RANGE REACH READY RIGHT ROBOT ROUGH ROUND ROUTE ROYAL RULER SCALE SCENE SCOPE SCORE SENSE SERVE SHADE SHAKE SHALL SHARE SHARP SHEET SHELF SHELL SHIFT SHINE SHIRT SHOCK SHOOT SHORT SIGHT SINCE SKILL SLEEP SLIDE SMALL SMART SMOKE SOLID SOUND SOUTH SPEAK SPEED SPEND SPLIT SPORT STAND START STATE STEAM STEEL STICK STILL STOCK STORE STORY STUDY STYLE SUGAR SUPER SWEET SWING TASTE TEACH THANK THEME THERE THICK THING THINK THIRD THROW TIGHT TITLE TODAY TOPIC TOTAL TOUCH TOUGH TRACK TRADE TRAIL TREAT TRUCK TRUST TRUTH UNDER UNION UNITY UNTIL UPPER URBAN USUAL VALID VALUE VIDEO VISIT VOICE WASTE WATCH WHEEL WHITE WHOLE WOMAN YOUTH ZEBRA';
    
    
    window.WORDLE_CFG = {
        triggers: Array.of('wordle', 'word', '5 letters', 'afcs wordle'),
        rewardCoins: 60,
        maxRows: 6,
        wordLen: 5,
        words: rawWords.trim().toUpperCase().split(/\s+/).filter(w => w.length === 5)
    };
    
    window.addWordleWords = function (...newWords) {
        newWords.forEach(item => {
            String(item || '').trim().toUpperCase().split(/\s+/).forEach(w => {
                if (w.length === 5 && !window.WORDLE_CFG.words.includes(w)) {
                    window.WORDLE_CFG.words.push(w);
                }
            });
        });
    };
    
    window.WORDLE_STATE = {
        active: false,
        secret: 'PSALM',
        grid: Array.of(),
        row: 0,
        col: 0,
        keyColors: {},
        over: false,
        listeners: Array.of()
    };
    
    window.wordleAwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
    
    if (typeof window.arcadeRegisterGame === 'function') {
        window.arcadeRegisterGame({
            id: 'wordle',
            title: 'AFCS 5-Letter Wordle',
            icon: '🟩',
            reward: '+60 🪙',
            hint: 'Guess the secret 5-letter play or game word...',
            triggers: window.WORDLE_CFG.triggers,
            launch: () => window.launchWordleGame()
        });
    }
}
function startWordleUI() {
    window.wordleBuildModal = function () {
        const old = document.getElementById('afcs-wordle-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'afcs-wordle-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at top,#0f172a 0%,#020617 100%);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:540px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
                <span style="font-size:1.2rem;font-weight:900;color:#4ade80;letter-spacing:1px;">🟩 AFCS WORDLE</span>
                <button id="wordle-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✕ EXIT</button>
            </div>
        
            <div id="wordle-banner" style="min-height:24px;font-size:0.95rem;font-weight:bold;color:#fde047;text-align:center;">
                Guess the 5-letter Beyond The Manger / AFCS word in 6 tries!
            </div>
        
            <div id="wordle-board" style="display:grid;grid-template-rows:repeat(6,50px);gap:6px;"></div>
        
            <div id="wordle-kb" style="display:flex;flex-direction:column;gap:6px;width:100%;max-width:500px;"></div>
        
            <div id="wordle-footer" style="min-height:36px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:0.82rem;color:#94a3b8;">
                <span>Type on your keyboard or tap keys below (+60 🪙 on solve)</span>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('wordle-exit-btn').onclick = window.wordleCloseGame;
        
        const keyHandler = function (e) {
            const st = window.WORDLE_STATE;
            if (!st.active) return;
            if (e.code === 'Escape') {
                window.wordleCloseGame();
                return;
            }
            if (st.over) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                window.wordleSubmitRow();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                window.wordleBackspace();
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                window.wordleTypeLetter(e.key.toUpperCase());
            }
        };
        
        window.addEventListener('keydown', keyHandler);
        window.WORDLE_STATE.listeners.push(Array.of(window, 'keydown', keyHandler));
    };
    
    window.wordleSetBanner = function (txt, color) {
        const el = document.getElementById('wordle-banner');
        if (!el) return;
        el.textContent = txt;
        el.style.color = color || '#fde047';
    };
    
    window.wordleTypeLetter = function (ch) {
        const st = window.WORDLE_STATE;
        if (st.over || st.col >= 5) return;
        st.grid.at(st.row)[st.col] = { ch: ch, state: 'filled' };
        st.col++;
        window.wordleRender();
    };
    
    window.wordleBackspace = function () {
        const st = window.WORDLE_STATE;
        if (st.over || st.col <= 0) return;
        st.col--;
        st.grid.at(st.row)[st.col] = { ch: '', state: 'empty' };
        window.wordleRender();
    };
    
    window.wordleSubmitRow = function () {
        const st = window.WORDLE_STATE;
        if (st.over) return;
        if (st.col < 5) {
            window.wordleSetBanner('Not enough letters — enter 5 letters!', '#f87171');
            return;
        }
        
        const rowCells = st.grid.at(st.row);
        const guess = rowCells.map(c => c.ch).join('');
        const secretArr = st.secret.split('');
        const states = Array.from({ length: 5 }, () => 'absent');
        
        for (let i = 0; i < 5; i++) {
            if (guess.charAt(i) === secretArr.at(i)) {
                states[i] = 'correct';
                secretArr[i] = null;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (states.at(i) === 'correct') continue;
            const foundIdx = secretArr.indexOf(guess.charAt(i));
            if (foundIdx !== -1) {
                states[i] = 'present';
                secretArr[foundIdx] = null;
            }
        }
        
        const rank = { correct: 3, present: 2, absent: 1 };
        for (let i = 0; i < 5; i++) {
            const ch = guess.charAt(i);
            const nextState = states.at(i);
            rowCells[i].state = nextState;
            const prevState = st.keyColors[ch];
            if (!prevState || rank[nextState] > rank[prevState]) {
                st.keyColors[ch] = nextState;
            }
        }
        
        if (guess === st.secret) {
            st.over = true;
            const bal = window.wordleAwardCoins(window.WORDLE_CFG.rewardCoins);
            window.wordleSetBanner('🏆 SOLVED "' + st.secret + '"! +' + window.WORDLE_CFG.rewardCoins + ' 🪙 (Balance: ' + bal + ' 🪙)', '#4ade80');
            window.wordleRender();
            window.wordleShowReplay();
            return;
        }
        
        st.row++;
        st.col = 0;
        
        if (st.row >= 6) {
            st.over = true;
            window.wordleSetBanner('💀 Out of tries! The secret word was "' + st.secret + '".', '#f87171');
            window.wordleRender();
            window.wordleShowReplay();
            return;
        }
        
        window.wordleSetBanner('Try ' + (st.row + 1) + ' of 6...', '#94a3b8');
        window.wordleRender();
    };
    
    window.wordleShowReplay = function () {
        const footer = document.getElementById('wordle-footer');
        if (!footer) return;
        footer.innerHTML = `
            <button id="wordle-again-btn" style="background:#16a34a;color:#fff;border:1px solid #4ade80;padding:8px 18px;border-radius:8px;font-weight:bold;cursor:pointer;">↻ NEW WORD</button>
        `;
        document.getElementById('wordle-again-btn').onclick = window.launchWordleGame;
    };
    
    window.wordleRender = function () {
        const st = window.WORDLE_STATE;
        const board = document.getElementById('wordle-board');
        const kb = document.getElementById('wordle-kb');
        if (!board || !kb) return;
        
        const colorMap = {
            empty: { bg: '#090d16', border: '#334155' },
            filled: { bg: '#1e293b', border: '#64748b' },
            correct: { bg: '#15803d', border: '#4ade80' },
            present: { bg: '#a16207', border: '#facc15' },
            absent: { bg: '#1e293b', border: '#1e293b' }
        };
        
        board.innerHTML = st.grid.map(row => `
            <div style="display:grid;grid-template-columns:repeat(5,50px);gap:6px;">
                ${row.map(cell => {
            const style = colorMap[cell.state] || colorMap.empty;
            return `<div style="width:50px;height:50px;background:${style.bg};border:2px solid ${style.border};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.45rem;font-weight:900;color:${cell.state === 'absent' ? '#64748b' : '#f8fafc'};">
                        ${cell.ch}
                    </div>`;
        }).join('')}
            </div>
        `).join('');
        
        const rows = Array.of(
            Array.of('Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'),
            Array.of('A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'),
            Array.of('ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫')
        );
        
        kb.innerHTML = rows.map(keys => `
            <div style="display:flex;justify-content:center;gap:5px;">
                ${keys.map(k => {
            const ks = st.keyColors[k];
            const bg = ks === 'correct' ? '#15803d' : (ks === 'present' ? '#a16207' : (ks === 'absent' ? '#0f172a' : '#334155'));
            const wide = k.length > 1;
            return `<button class="wordle-key-btn" data-key="${k}" style="min-width:${wide ? '62px' : '38px'};height:42px;background:${bg};color:${ks === 'absent' ? '#475569' : '#f8fafc'};border:1px solid #475569;border-radius:6px;font-weight:bold;font-size:${wide ? '0.75rem' : '0.9rem'};cursor:pointer;">
                        ${k}
                    </button>`;
        }).join('')}
            </div>
        `).join('');
        
        kb.querySelectorAll('.wordle-key-btn').forEach(btn => {
            btn.onclick = () => {
                const k = btn.getAttribute('data-key');
                if (k === 'ENTER') window.wordleSubmitRow();
                else if (k === '⌫') window.wordleBackspace();
                else window.wordleTypeLetter(k);
            };
        });
    };
    
    window.wordleCloseGame = function () {
        const st = window.WORDLE_STATE;
        st.active = false;
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.listeners = Array.of();
        const modal = document.getElementById('afcs-wordle-modal');
        if (modal) modal.remove();
    };
    
    window.launchWordleGame = function () {
        if (!window.WORDLE_CFG) startWordleData();
        window.wordleCloseGame();
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('wordle');
        
        const st = window.WORDLE_STATE;
        const pool = window.WORDLE_CFG.words;
        st.active = true;
        st.secret = pool.at(Math.floor(Math.random() * pool.length));
        st.grid = Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ({ ch: '', state: 'empty' })));
        st.row = 0;
        st.col = 0;
        st.keyColors = {};
        st.over = false;
        
        window.wordleBuildModal();
        window.wordleRender();
    };
    
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (window.WORDLE_CFG.triggers.includes(clean)) {
                window.launchWordleGame();
            }
        });
    }
}
function startHangmanData() {
    const rawPuzzles = Array.of(
        'Among Us',
        'Antipolo Faith Christian School',
        'Armor Of God',
        'Banaue Rice Terraces',
        'Beyond The Manger',
        'Buckshot Roulette',
        'Burj Khalifa',
        'Chocolate Hills',
        'Colosseum',
        'David And Goliath',
        'Deadlocked',
        'Eiffel Tower',
        'Elden Ring',
        'Fruit Of The Spirit',
        'Garden Of Eden',
        'Geometry Dash',
        'Golden Ratio',
        'Grade Seven Psalms',
        'Great Wall Of China',
        'Hinulugang Taktak',
        'Hollow Knight',
        'Jesus Christ',
        'Legend Of Zelda',
        'Lethal Company',
        'Mayon Volcano',
        'Milky Way Galaxy',
        'Minecraft',
        'Mount Everest',
        'Noah And The Ark',
        'Northern Lights',
        'Pacific Ocean',
        'Periodic Table',
        'Pinto Art Museum',
        'Pythagorean Theorem',
        'Rizal Province',
        'Rocket League',
        'Sermon On The Mount',
        'Sierra Madre',
        'Solar System',
        'Stardew Valley',
        'Starry Night',
        'Statue Of Liberty',
        'Super Mario Odyssey',
        'Terraria',
        'Three Architects',
        'Tower Of Babel'
    );
    
    const parsePuzzle = entry => {
        const text = String(entry || '').trim().toUpperCase();
        const splitIdx = text.indexOf(':');
        if (splitIdx === -1) return { cat: 'AFCS CLUE', phrase: text };
        return {
            cat: text.slice(0, splitIdx).trim(),
            phrase: text.slice(splitIdx + 1).trim()
        };
    };
    
    window.HANG_CFG = {
        triggers: Array.of('hangman', 'hang', 'guess word', 'phrase'),
        rewardCoins: 70,
        maxWrong: 6,
        puzzles: rawPuzzles.map(parsePuzzle).filter(p => p.phrase.length > 0)
    };
    
    window.addHangmanPuzzles = function (...newEntries) {
        newEntries.forEach(entry => {
            const parsed = parsePuzzle(entry);
            if (parsed.phrase && !window.HANG_CFG.puzzles.some(p => p.phrase === parsed.phrase)) {
                window.HANG_CFG.puzzles.push(parsed);
            }
        });
    };
    
    window.HANG_STATE = {
        active: false,
        category: '',
        phrase: '',
        guessed: Array.of(),
        wrong: 0,
        over: false,
        listeners: Array.of()
    };
    
    window.hangAwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
    
    if (typeof window.arcadeRegisterGame === 'function') {
        window.arcadeRegisterGame({
            id: 'hangman',
            title: 'Beyond The Manger Hangman',
            icon: '🪢',
            reward: '+70 🪙',
            hint: 'Guess hidden phrases from the Christmas play...',
            triggers: window.HANG_CFG.triggers,
            launch: () => window.launchHangmanGame()
        });
    }
}
function startHangmanUI() {
    window.hangBuildModal = function () {
        const old = document.getElementById('afcs-hangman-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'afcs-hangman-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at top,#1c1917 0%,#09090b 100%);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:18px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:760px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #292524;padding-bottom:10px;">
                <div style="display:flex;gap:12px;align-items:center;">
                    <span style="font-size:1.2rem;font-weight:900;color:#fbbf24;letter-spacing:1px;">🪢 BEYOND THE MANGER HANGMAN</span>
                    <span id="hang-cat-badge" style="background:#292524;border:1px solid #eab308;color:#fde047;padding:4px 10px;border-radius:6px;font-size:0.8rem;font-weight:bold;">CATEGORY</span>
                </div>
                <button id="hang-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✕ EXIT</button>
            </div>
        
            <div id="hang-banner" style="min-height:24px;font-size:0.98rem;font-weight:bold;color:#e2e8f0;text-align:center;">
                Guess letters using your keyboard or click below!
            </div>
        
            <div style="width:100%;max-width:760px;display:flex;flex-direction:column;align-items:center;gap:18px;background:#141210;border:2px solid #292524;border-radius:14px;padding:20px;">
                <div id="hang-svg-wrap"></div>
                <div id="hang-phrase-wrap" style="display:flex;flex-wrap:wrap;justify-content:center;gap:18px;padding:8px;"></div>
            </div>
        
            <div id="hang-kb" style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:660px;width:100%;"></div>
        
            <div id="hang-footer" style="min-height:36px;display:flex;align-items:center;justify-content:center;font-size:0.82rem;color:#a8a29e;">
                <span>6 Mistakes Allowed • Solve Phrase Reward: <b style="color:#4ade80;">+70 🪙</b></span>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('hang-exit-btn').onclick = window.hangCloseGame;
        
        const keyHandler = function (e) {
            const st = window.HANG_STATE;
            if (!st.active) return;
            if (e.code === 'Escape') {
                window.hangCloseGame();
                return;
            }
            if (!st.over && /^[a-zA-Z]$/.test(e.key)) {
                window.hangGuessLetter(e.key.toUpperCase());
            }
        };
        
        window.addEventListener('keydown', keyHandler);
        window.HANG_STATE.listeners.push(Array.of(window, 'keydown', keyHandler));
    };
    
    window.hangRenderSvg = function (wrong) {
        return `
            <svg width="160" height="145" viewBox="0 0 160 145" style="stroke:#fde047;stroke-width:3.5;fill:none;stroke-linecap:round;">
                <line x1="20" y1="135" x2="110" y2="135" />
                <line x1="45" y1="135" x2="45" y2="15" />
                <line x1="45" y1="15" x2="105" y2="15" />
                <line x1="105" y1="15" x2="105" y2="32" />
                ${wrong >= 1 ? '<circle cx="105" cy="46" r="14" stroke="#f43f5e" />' : ''}
                ${wrong >= 2 ? '<line x1="105" y1="60" x2="105" y2="96" stroke="#f43f5e" />' : ''}
                ${wrong >= 3 ? '<line x1="105" y1="70" x2="84" y2="86" stroke="#f43f5e" />' : ''}
                ${wrong >= 4 ? '<line x1="105" y1="70" x2="126" y2="86" stroke="#f43f5e" />' : ''}
                ${wrong >= 5 ? '<line x1="105" y1="96" x2="88" y2="122" stroke="#f43f5e" />' : ''}
                ${wrong >= 6 ? '<line x1="105" y1="96" x2="122" y2="122" stroke="#f43f5e" />' : ''}
            </svg>
        `;
    };
    
    window.hangGuessLetter = function (ch) {
        const st = window.HANG_STATE;
        if (st.over || st.guessed.includes(ch)) return;
        
        st.guessed.push(ch);
        if (!st.phrase.includes(ch)) {
            st.wrong++;
        }
        
        const allSolved = st.phrase.split('').every(c => c === ' ' || st.guessed.includes(c));
        const banner = document.getElementById('hang-banner');
        
        if (allSolved) {
            st.over = true;
            const bal = window.hangAwardCoins(window.HANG_CFG.rewardCoins);
            if (banner) {
                banner.textContent = '🏆 PHRASE SOLVED! +' + window.HANG_CFG.rewardCoins + ' 🪙 (Balance: ' + bal + ' 🪙)';
                banner.style.color = '#4ade80';
            }
            window.hangShowReplay();
        } else if (st.wrong >= window.HANG_CFG.maxWrong) {
            st.over = true;
            if (banner) {
                banner.textContent = '💀 OUT OF TRIES! The phrase was: "' + st.phrase + '"';
                banner.style.color = '#f87171';
            }
            window.hangShowReplay();
        } else if (banner) {
            const left = window.HANG_CFG.maxWrong - st.wrong;
            banner.textContent = 'Lives Remaining: ' + left + ' / ' + window.HANG_CFG.maxWrong;
            banner.style.color = left <= 2 ? '#fbbf24' : '#e2e8f0';
        }
        
        window.hangRender();
    };
    
    window.hangShowReplay = function () {
        const footer = document.getElementById('hang-footer');
        if (!footer) return;
        footer.innerHTML = `
            <button id="hang-again-btn" style="background:#eab308;color:#09090b;border:none;padding:8px 20px;border-radius:8px;font-weight:900;cursor:pointer;">↻ NEXT PHRASE</button>
        `;
        document.getElementById('hang-again-btn').onclick = window.launchHangmanGame;
    };
    
    window.hangRender = function () {
        const st = window.HANG_STATE;
        const catEl = document.getElementById('hang-cat-badge');
        const svgWrap = document.getElementById('hang-svg-wrap');
        const phraseWrap = document.getElementById('hang-phrase-wrap');
        const kb = document.getElementById('hang-kb');
        if (!svgWrap || !phraseWrap || !kb) return;
        
        if (catEl) catEl.textContent = 'CATEGORY: ' + st.category;
        svgWrap.innerHTML = window.hangRenderSvg(st.wrong);
        
        const words = st.phrase.split(' ');
        phraseWrap.innerHTML = words.map(word => `
            <div style="display:flex;gap:6px;">
                ${word.split('').map(ch => {
            const revealed = st.guessed.includes(ch) || st.over;
            const missed = st.over && !st.guessed.includes(ch);
            return `<span style="width:32px;height:40px;border-bottom:3px solid ${missed ? '#ef4444' : '#eab308'};display:flex;align-items:center;justify-content:center;font-size:1.35rem;font-weight:900;color:${missed ? '#fca5a5' : '#f8fafc'};">
                        ${revealed ? ch : ''}
                    </span>`;
        }).join('')}
            </div>
        `).join('');
        
        const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        kb.innerHTML = alphabet.map(ch => {
            const used = st.guessed.includes(ch);
            const hit = used && st.phrase.includes(ch);
            const bg = hit ? '#15803d' : (used ? '#1c1917' : '#292524');
            const border = hit ? '#4ade80' : (used ? '#292524' : '#57534e');
            return `<button class="hang-key-btn" data-ch="${ch}" ${used || st.over ? 'disabled' : ''} style="width:40px;height:40px;background:${bg};color:${used && !hit ? '#57534e' : '#f8fafc'};border:1px solid ${border};border-radius:8px;font-weight:bold;cursor:${used || st.over ? 'not-allowed' : 'pointer'};">
                ${ch}
            </button>`;
        }).join('');
        
        kb.querySelectorAll('.hang-key-btn').forEach(btn => {
            btn.onclick = () => window.hangGuessLetter(btn.getAttribute('data-ch'));
        });
    };
    
    window.hangCloseGame = function () {
        const st = window.HANG_STATE;
        st.active = false;
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.listeners = Array.of();
        const modal = document.getElementById('afcs-hangman-modal');
        if (modal) modal.remove();
    };
    
    window.launchHangmanGame = function () {
        if (!window.HANG_CFG) startHangmanData();
        window.hangCloseGame();
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('hangman');
        
        const st = window.HANG_STATE;
        const pick = window.HANG_CFG.puzzles.at(Math.floor(Math.random() * window.HANG_CFG.puzzles.length));
        st.active = true;
        st.category = pick.cat;
        st.phrase = pick.phrase;
        st.guessed = Array.of();
        st.wrong = 0;
        st.over = false;
        
        window.hangBuildModal();
        window.hangRender();
    };
    
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (window.HANG_CFG.triggers.includes(clean)) {
                window.launchHangmanGame();
            }
        });
    }
}
function startMinesweeperData() {
    window.MINE_CFG = {
        triggers: Array.of('minesweeper', 'mines', 'sweeper', 'solver grid'),
        levels: {
            easy: { label: 'EASY (9×9)', rows: 9, cols: 9, mines: 10, reward: 50 },
            medium: { label: 'MEDIUM (12×12)', rows: 12, cols: 12, mines: 22, reward: 100 },
            hard: { label: 'HARD (16×16)', rows: 16, cols: 16, mines: 40, reward: 180 }
        },
        numColors: Array.of('', '#38bdf8', '#4ade80', '#f43f5e', '#a855f7', '#fb923c', '#22d3ee', '#e2e8f0', '#94a3b8')
    };
    
    window.MINE_STATE = {
        active: false,
        diffKey: 'easy',
        rows: 9,
        cols: 9,
        mineCount: 10,
        board: Array.of(),
        firstClick: true,
        flagMode: false,
        flagsPlaced: 0,
        seconds: 0,
        over: false,
        timerId: null,
        listeners: Array.of()
    };
    
    window.mineAwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
    
    if (typeof window.arcadeRegisterGame === 'function') {
        window.arcadeRegisterGame({
            id: 'minesweeper',
            title: 'Minesweeper: Solver Grid',
            icon: '💣',
            reward: '+50–180 🪙',
            hint: 'Sweep hidden Solver Cores on a classic logic grid...',
            triggers: window.MINE_CFG.triggers,
            launch: () => window.launchMinesweeper()
        });
    }
}
function startMinesweeperEngine() {
    window.mineInitBoard = function () {
        const st = window.MINE_STATE;
        st.board = Array.from({ length: st.rows }, (_, r) =>
            Array.from({ length: st.cols }, (_, c) => ({
            r: r,
            c: c,
            mine: false,
            revealed: false,
            flagged: false,
            adj: 0,
            tripped: false
        }))
    );
    st.firstClick = true;
    st.flagsPlaced = 0;
    st.seconds = 0;
    st.over = false;
};

window.mineGetNeighbors = function (r, c) {
    const st = window.MINE_STATE;
    const list = Array.of();
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < st.rows && nc >= 0 && nc < st.cols) {
                list.push(st.board.at(nr).at(nc));
            }
        }
    }
    return list;
};

window.minePopulateMines = function (safeR, safeC) {
    const st = window.MINE_STATE;
    let placed = 0;
    while (placed < st.mineCount) {
        const rr = Math.floor(Math.random() * st.rows);
        const cc = Math.floor(Math.random() * st.cols);
        if (Math.abs(rr - safeR) <= 1 && Math.abs(cc - safeC) <= 1) continue;
        const cell = st.board.at(rr).at(cc);
        if (!cell.mine) {
            cell.mine = true;
            placed++;
        }
    }
    
    for (let r = 0; r < st.rows; r++) {
        for (let c = 0; c < st.cols; c++) {
            const cell = st.board.at(r).at(c);
            if (cell.mine) continue;
            cell.adj = window.mineGetNeighbors(r, c).filter(n => n.mine).length;
        }
    }
};

window.mineToggleFlag = function (r, c) {
    const st = window.MINE_STATE;
    if (st.over) return;
    const cell = st.board.at(r)?.at(c);
    if (!cell || cell.revealed) return;
    cell.flagged = !cell.flagged;
    st.flagsPlaced += cell.flagged ? 1 : -1;
    window.mineRender();
};

window.mineRevealCell = function (r, c) {
    const st = window.MINE_STATE;
    if (st.over) return;
    const cell = st.board.at(r)?.at(c);
    if (!cell || cell.flagged) return;
    
    if (st.firstClick) {
        st.firstClick = false;
        window.minePopulateMines(r, c);
        window.mineStartTimer();
    }
    
    if (cell.revealed) {
        if (cell.adj > 0) {
            const neighbors = window.mineGetNeighbors(r, c);
            const flaggedCount = neighbors.filter(n => n.flagged).length;
            if (flaggedCount === cell.adj) {
                neighbors.forEach(n => {
                    if (!n.revealed && !n.flagged) window.mineRevealCell(n.r, n.c);
                });
            }
        }
        return;
    }
    
    if (cell.mine) {
        cell.revealed = true;
        cell.tripped = true;
        st.over = true;
        window.mineStopTimer();
        for (let rr = 0; rr < st.rows; rr++) {
            for (let cc = 0; cc < st.cols; cc++) {
                const item = st.board.at(rr).at(cc);
                if (item.mine) item.revealed = true;
            }
        }
        window.mineSetBanner('💥 DETONATED A SOLVER CORE! Click Restart to try again.', '#f87171');
        window.mineRender();
        return;
    }
    
    const queue = Array.of(cell);
    while (queue.length > 0) {
        const cur = queue.shift();
        if (cur.revealed || cur.flagged) continue;
        cur.revealed = true;
        if (cur.adj === 0) {
            window.mineGetNeighbors(cur.r, cur.c).forEach(n => {
                if (!n.revealed && !n.flagged && !n.mine) queue.push(n);
            });
        }
    }
    
    window.mineCheckVictory();
    window.mineRender();
};

window.mineCheckVictory = function () {
    const st = window.MINE_STATE;
    let unrevealedSafe = 0;
    for (let r = 0; r < st.rows; r++) {
        for (let c = 0; c < st.cols; c++) {
            const cell = st.board.at(r).at(c);
            if (!cell.mine && !cell.revealed) unrevealedSafe++;
        }
    }
    
    if (unrevealedSafe === 0) {
        st.over = true;
        window.mineStopTimer();
        const lvl = window.MINE_CFG.levels[st.diffKey];
        const reward = lvl ? lvl.reward : 50;
        const bal = window.mineAwardCoins(reward);
        window.mineSetBanner('🏆 GRID CLEARED IN ' + st.seconds + 's! +' + reward + ' 🪙 (Balance: ' + bal + ' 🪙)', '#4ade80');
    }
};
}
function startMinesweeperUI() {
    window.mineStartTimer = function () {
        const st = window.MINE_STATE;
        window.mineStopTimer();
        st.timerId = setInterval(() => {
            if (!st.active || st.over) return;
            st.seconds++;
            const el = document.getElementById('mine-time-txt');
            if (el) el.textContent = '⏱️ ' + st.seconds + 's';
        }, 1000);
    };
    
    window.mineStopTimer = function () {
        const st = window.MINE_STATE;
        if (st.timerId) clearInterval(st.timerId);
        st.timerId = null;
    };
    
    window.mineSetBanner = function (txt, color) {
        const el = document.getElementById('mine-banner');
        if (!el) return;
        el.textContent = txt;
        el.style.color = color || '#fde047';
    };
    
    window.mineBuildModal = function () {
        const old = document.getElementById('afcs-minesweeper-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'afcs-minesweeper-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at top,#0f172a 0%,#020617 100%);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:760px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;flex-wrap:wrap;gap:8px;">
                <span style="font-size:1.2rem;font-weight:900;color:#38bdf8;letter-spacing:1px;">💣 MINESWEEPER: SOLVER GRID</span>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="mine-diff-btn" data-diff="easy" style="background:#1e293b;color:#7dd3fc;border:1px solid #38bdf8;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:bold;">EASY (+50 🪙)</button>
                    <button class="mine-diff-btn" data-diff="medium" style="background:#1e293b;color:#7dd3fc;border:1px solid #38bdf8;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:bold;">MED (+100 🪙)</button>
                    <button class="mine-diff-btn" data-diff="hard" style="background:#1e293b;color:#7dd3fc;border:1px solid #38bdf8;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:bold;">HARD (+180 🪙)</button>
                    <button id="mine-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:5px 11px;border-radius:6px;cursor:pointer;font-weight:bold;">✕ EXIT</button>
                </div>
            </div>
        
            <div style="width:100%;max-width:760px;display:flex;justify-content:space-between;align-items:center;background:#090d16;border:1px solid #1e293b;padding:8px 14px;border-radius:10px;">
                <span id="mine-left-txt" style="font-weight:bold;color:#f43f5e;">⬡ Cores Left: 10</span>
                <div style="display:flex;gap:8px;">
                    <button id="mine-flag-toggle" style="background:#1e293b;color:#fde047;border:1px solid #eab308;padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.82rem;">🚩 FLAG MODE: OFF [F]</button>
                    <button id="mine-restart-btn" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:0.82rem;">↻ RESTART</button>
                </div>
                <span id="mine-time-txt" style="font-weight:bold;color:#38bdf8;">⏱️ 0s</span>
            </div>
        
            <div id="mine-banner" style="min-height:22px;font-size:0.92rem;font-weight:bold;color:#fde047;text-align:center;">
                First click is always safe! Right-click or press [F] to place flags.
            </div>
        
            <div style="flex:1;display:flex;align-items:center;justify-content:center;overflow:auto;max-width:100%;">
                <div id="mine-grid-wrap" style="background:#090d16;border:2px solid #334155;border-radius:10px;padding:8px;box-shadow:0 16px 40px rgba(0,0,0,0.8);"></div>
            </div>
        
            <div style="width:100%;max-width:760px;display:flex;justify-content:space-between;font-size:0.8rem;color:#94a3b8;">
                <span>Controls: Left-Click Reveal • Right-Click / [F] Flag • Click Number to Chord</span>
                <span>Zero idle background timers when closed</span>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('mine-exit-btn').onclick = window.mineCloseGame;
        document.getElementById('mine-restart-btn').onclick = () => window.mineSelectDifficulty(window.MINE_STATE.diffKey);
        document.getElementById('mine-flag-toggle').onclick = window.mineToggleFlagMode;
        
        modal.querySelectorAll('.mine-diff-btn').forEach(btn => {
            btn.onclick = () => window.mineSelectDifficulty(btn.getAttribute('data-diff'));
        });
        
        const keyHandler = function (e) {
            if (!window.MINE_STATE.active) return;
            if (e.code === 'Escape') window.mineCloseGame();
            if (e.code === 'KeyF') window.mineToggleFlagMode();
        };
        window.addEventListener('keydown', keyHandler);
        window.MINE_STATE.listeners.push(Array.of(window, 'keydown', keyHandler));
    };
    
    window.mineToggleFlagMode = function () {
        const st = window.MINE_STATE;
        st.flagMode = !st.flagMode;
        const btn = document.getElementById('mine-flag-toggle');
        if (btn) {
            btn.textContent = st.flagMode ? '🚩 FLAG MODE: ON [F]' : '🚩 FLAG MODE: OFF [F]';
            btn.style.background = st.flagMode ? '#854d0e' : '#1e293b';
        }
    };
    
    window.mineSelectDifficulty = function (diffKey) {
        const st = window.MINE_STATE;
        const cfg = window.MINE_CFG.levels[diffKey] || window.MINE_CFG.levels.easy;
        window.mineStopTimer();
        st.diffKey = diffKey;
        st.rows = cfg.rows;
        st.cols = cfg.cols;
        st.mineCount = cfg.mines;
        window.mineInitBoard();
        window.mineSetBanner(cfg.label + ' — Clear all safe tiles for +' + cfg.reward + ' 🪙!', '#fde047');
        const timeEl = document.getElementById('mine-time-txt');
        if (timeEl) timeEl.textContent = '⏱️ 0s';
        window.mineRender();
    };
    
    window.mineRender = function () {
        const st = window.MINE_STATE;
        const wrap = document.getElementById('mine-grid-wrap');
        const leftEl = document.getElementById('mine-left-txt');
        if (!wrap) return;
        
        if (leftEl) leftEl.textContent = '⬡ Cores Left: ' + Math.max(0, st.mineCount - st.flagsPlaced);
        
        const cellPx = st.cols >= 16 ? 25 : (st.cols >= 12 ? 30 : 35);
        
        wrap.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(${st.cols},${cellPx}px);gap:2px;">
                ${st.board.map(row =>
        row.map(cell => {
            let bg = '#1e293b';
            let border = '#334155';
            let content = '';
            let color = '#f8fafc';
            
            if (cell.revealed) {
                if (cell.mine) {
                    bg = cell.tripped ? '#991b1b' : '#3f1515';
                    border = '#ef4444';
                    content = '⬡';
                    color = '#fca5a5';
                } else {
                    bg = '#0f172a';
                    border = '#1e293b';
                    if (cell.adj > 0) {
                        content = String(cell.adj);
                        color = window.MINE_CFG.numColors.at(cell.adj) || '#38bdf8';
                    }
                }
            } else if (cell.flagged) {
                bg = '#172554';
                border = '#eab308';
                content = '🚩';
            }
            
            return `<button class="mine-cell-btn" data-r="${cell.r}" data-c="${cell.c}" style="width:${cellPx}px;height:${cellPx}px;background:${bg};border:1px solid ${border};border-radius:4px;color:${color};font-weight:900;font-size:${cellPx >= 32 ? '0.95rem' : '0.8rem'};cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">
                            ${content}
                        </button>`;
        }).join('')
    ).join('')}
            </div>
        `;
    
    wrap.querySelectorAll('.mine-cell-btn').forEach(btn => {
        const r = parseInt(btn.getAttribute('data-r'), 10);
        const c = parseInt(btn.getAttribute('data-c'), 10);
        btn.onclick = () => {
            if (st.flagMode) window.mineToggleFlag(r, c);
            else window.mineRevealCell(r, c);
        };
        btn.oncontextmenu = e => {
            e.preventDefault();
            window.mineToggleFlag(r, c);
        };
    });
};

window.mineCloseGame = function () {
    const st = window.MINE_STATE;
    st.active = false;
    window.mineStopTimer();
    st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
    st.listeners = Array.of();
    const modal = document.getElementById('afcs-minesweeper-modal');
    if (modal) modal.remove();
};

window.launchMinesweeper = function () {
    if (!window.MINE_CFG) startMinesweeperData();
    if (!window.mineInitBoard) startMinesweeperEngine();
    window.mineCloseGame();
    if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('minesweeper');
    const st = window.MINE_STATE;
    st.active = true;
    st.flagMode = false;
    window.mineBuildModal();
    window.mineSelectDifficulty('easy');
};
if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
    STATE.onSearchInput.push(function (query) {
        const clean = String(query || '').trim().toLowerCase();
        if (window.MINE_CFG.triggers.includes(clean)) {
            window.launchMinesweeper();
        }
    });
}
}
function startAfcsShopData() { 
    window.SHOP_STORAGE_OWNED = 'afcs_shop_owned';
    window.SHOP_STORAGE_EQUIPPED = 'afcs_shop_equipped';
    
    window.SHOP_CATALOG = Array.of(
        {
            id: 'music_default',
            category: 'music',
            icon: '🎶',
            name: 'Song - Default Audio',
            price: 0,
            desc: 'Original site audio configuration.',
            synthNotes: null
        },
        {
            id: 'music_lofi',
            category: 'music',
            icon: '🎹',
            name: 'Song - Lofi Browsing',
            price: 80,
            desc: 'A chill ambient track, for when you don\'t want anything harsh in your music, but prefer some ambience to your browsing experience.',
            src: "music/lofi.mp3"
        },
        {
            id: 'music_dubai',
            category: 'music',
            icon: '🌃',
            name: 'Song - Dubai Midnight',
            price: 140,
            desc: 'Sleek futuristic arpeggio inspired by Dubai at night.',
            src: "music/dubaiLofi.mp3"
        },
        {
            id: 'music_undertale',
            category: 'music',
            icon: '🦴',
            name: 'Song - Save the World (Undertale)',
            price: 180,
            desc: 'The theme that plays when the God of Hyperdeath is at their final form. A song of hope and determination.',
            src: "music/StW.mp3"
        },
        {
            id: 'music_grief',
            category: 'music',
            icon: '👑',
            name: 'Song - Grief\'s Return',
            price: 140,
            desc: 'Listen to the song that once plagued a streamer for over 2 years. A song that caused grief, but now returns to bring peace.',
            src: "music/grief.mp3"
        },
        {
            id: 'music_CMMM',
            category: 'music',
            icon: '👑',
            name: 'Song - Cutie Mew Mew Magic',
            price: 190,
            desc: 'Mew! This the song that Mad Mew Mew listens to whenever she\'s happy or joyful. It\'s also Japanese, Mew!',
            src: "music/CMMM.mp3"
        },
        {
            id: 'music_Nullscapes',
            category: 'music',
            icon: '👑',
            name: 'Song - Flow by Creo',
            price: 190,
            desc: 'Listen to the song that accompanies the unholy Robot timings of the level Nullscapes. A song that brings chill vibes, even if it\'s accompanied by unholy timings.',
            src: "music/Nullscapes.mp3"
        },
        {
            id: 'music_solver',
            category: 'music',
            icon: '⬡',
            name: 'Song - Absolute Solver',
            price: 200,
            desc: 'The Music that the Absolute Solver uses to bring power and [NULL] to the world. A song that brings power and peace to [NULL].',
            src: "music/solver.mp3"
        },
        
        
        {
            id: 'theme_default',
            category: 'theme',
            icon: '🖥️',
            name: 'Default Theme',
            price: 0,
            desc: 'Standard Beyond The Manger styling.',
            cssVars: ''
        },
        {
            id: 'theme_gold',
            category: 'theme',
            icon: '👑',
            name: 'Theme - Royal Gold',
            price: 120,
            desc: 'Luxurious obsidian & gold accent glow across modals and borders.',
            cssVars: 'body { background-color: #090704 !important; color: #fef3c7 !important; } button, input { border-color: #eab308 !important; }'
        },
        {
            id: 'theme_cyan',
            category: 'theme',
            icon: '✨',
            name: 'Guiding Light Aura',
            price: 150,
            desc: 'Ethereal midnight-cyan theme inspired by Guiding Light.',
            cssVars: 'body { background-color: #030b14 !important; color: #cffafe !important; } button, input { border-color: #22d3ee !important; }'
        },
        {
            id: 'theme_crimson',
            category: 'theme',
            icon: '🩸',
            name: 'Solver Crimson Override',
            price: 220,
            desc: 'High-contrast crimson & void black Solver aesthetic.',
            cssVars: 'body { background-color: #0c0306 !important; color: #ffe4e6 !important; } button, input { border-color: #f43f5e !important; }'
        },
        {
            id: 'theme_griefer',
            category: 'theme',
            icon: '👑',
            name: 'Grief\'s Return',
            price: 250,
            desc: 'A red, black, and white theme to showcase GRIEF\'s aesthetic, without the frame perfect clicks..',
            cssVars: ''
        },
        {
            id: 'theme_midnight_purple',
            category: 'theme',
            icon: '🌌',
            name: 'Theme - Copper-9 Void',
            price: 220,
            desc: 'Deep violet glow inspired by Copper-9.',
            cssVars: 'body { background-color: #0b0514 !important; color: #f3e8ff !important; } button, input { border-color: #a855f7 !important; }'
        },
        
        
        
        {
            id: 'trail_none',
            category: 'trail',
            icon: '🚫',
            name: 'No Cursor Trail',
            price: 0,
            desc: 'Clean standard pointer with zero particles.',
            trailColor: null
        },
        {
            id: 'trail_cyan',
            category: 'trail',
            icon: '💠',
            name: 'Guiding Light Sparkles',
            price: 100,
            desc: 'Leaves glowing cyan dust wherever your mouse moves.',
            trailColor: '#22d3ee'
        },
        {
            id: 'trail_gold',
            category: 'trail',
            icon: '⭐',
            name: 'Cornerstone Gold Stars',
            price: 160,
            desc: 'Leaves golden starlight particles behind your cursor.',
            trailColor: '#fde047'
        },
        {
            id: 'trail_Red',
            category: 'trail',
            icon: '🩸',
            name: 'Crimson Trail',
            price: 200,
            desc: 'Leaves glowing crimson dust wherever your mouse moves.',
            trailColor: '#f43f5e'
        },
        {
            id: 'trail_Cyn',
            category: 'trail',
            icon: '⬡',
            name: 'Cyn\'s Trail',
            price: 250,
            desc: 'Leaves the blood of innocent Worker Drones wherever your mouse moves..',
            trailColor: '#000000'
        },
        
        
        
        {
            id: 'badge_none',
            category: 'badge',
            icon: '🏷️',
            name: 'No Equipped Title',
            price: 0,
            desc: 'Hide equipped title tag.',
            badgeText: ''
        },
        {
            id: 'badge_cornerstone',
            category: 'badge',
            icon: '⛪',
            name: 'Psalms 118:22 Cornerstone',
            price: 90,
            desc: 'Displays [⛪ Cornerstone] beside your HUD.',
            badgeText: '⛪ Cornerstone'
        },
        {
            id: 'badge_king',
            category: 'badge',
            icon: '🏆',
            name: 'Undisputed GD King',
            price: 350,
            desc: 'Prestigious badge for leaderboard champions.',
            badgeText: '🏆 Undisputed King'
        }
    );
    
    window.shopGetOwned = function () {
        try {
            const raw = JSON.parse(localStorage.getItem(window.SHOP_STORAGE_OWNED) || '[]');
            const defaults = Array.of('music_default', 'theme_default', 'trail_none', 'badge_none');
            const merged = Array.isArray(raw) ? raw.slice() : Array.of();
            defaults.forEach(d => {
                if (!merged.includes(d)) merged.push(d);
            });
            return merged;
        } catch (e) {
            return Array.of('music_default', 'theme_default', 'trail_none', 'badge_none');
        }
    };
    
    window.shopGetEquipped = function () {
        try {
            const raw = JSON.parse(localStorage.getItem(window.SHOP_STORAGE_EQUIPPED) || '{}');
            return {
                music: raw.music || 'music_default',
                theme: raw.theme || 'theme_default',
                trail: raw.trail || 'trail_none',
                badge: raw.badge || 'badge_none'
            };
        } catch (e) {
            return { music: 'music_default', theme: 'theme_default', trail: 'trail_none', badge: 'badge_none' };
        }
    };
    
    window.registerShopItem = function (item) {
        if (!item || !item.id || !item.category) return;
        const idx = window.SHOP_CATALOG.findIndex(x => x.id === item.id);
        if (idx >= 0) window.SHOP_CATALOG[idx] = item;
        else window.SHOP_CATALOG.push(item);
    };
}
function startAfcsShopEffects() {
    window.SHOP_RUNTIME = {
        musicTimer: null,
        audioCtx: null,
        htmlAudio: null,
        defaultBgmRef: null,
        playHooked: false,
        noteIdx: 0,
        trailBound: false,
        trailColor: null,
        lastSpark: 0
    };
    
    window.SHOP_RUNTIME.trackedAudios = new Set();
    
     window.shopHookAudioPlay = function () {
        const rt = window.SHOP_RUNTIME;
        if (rt.playHooked) return;
        rt.playHooked = true;

        const origPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function (...args) {
            const src = String(this.currentSrc || this.src || '').toLowerCase();
            const isShopTrack = (this === window.SHOP_RUNTIME.htmlAudio);
            if (!isShopTrack && src.includes('praise')) {
                window.SHOP_RUNTIME.defaultBgmRef = this;
                const eq = window.shopGetEquipped();
                if (eq.music !== 'music_default') {
                    this.pause();
                    this.muted = true;
                    this.currentTime = 0;
                    return Promise.resolve();
                }
            }
            return origPlay.apply(this, args);
        };

        document.addEventListener('play', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLAudioElement)) return;
            const src = String(target.currentSrc || target.src || '').toLowerCase();
            if (target !== window.SHOP_RUNTIME.htmlAudio && src.includes('praise')) {
                window.SHOP_RUNTIME.defaultBgmRef = target;
                const eq = window.shopGetEquipped();
                if (eq.music !== 'music_default') {
                    target.pause();
                    target.muted = true;
                }
            }
        }, true);
    };

    window.shopToggleDefaultBgm = function (shouldPlay) {
        const candidates = Array.from(document.querySelectorAll('audio'));
        if (window.SHOP_RUNTIME.defaultBgmRef && !candidates.includes(window.SHOP_RUNTIME.defaultBgmRef)) {
            candidates.push(window.SHOP_RUNTIME.defaultBgmRef);
        }
        if (typeof STATE !== 'undefined') {
            const stateAudio = STATE.bgm || STATE.musicAudio || STATE.audio || STATE.praiseAudio;
            if (stateAudio && !candidates.includes(stateAudio)) candidates.push(stateAudio);
        }

        candidates.forEach(a => {
            if (!a || a === window.SHOP_RUNTIME.htmlAudio) return;
            if (shouldPlay) {
                a.muted = false;
                a.volume = window.shopGetMusicVolume();
                a.play().catch(() => {});
            } else {
                a.pause();
                a.muted = true;
            }
        });
    };
    window.shopHookAudioPlay();
    
    window.shopToggleDefaultBgm = function (shouldPlay) {
        const rt = window.SHOP_RUNTIME;
        const candidates = new Set([
            ...document.querySelectorAll('audio'),
            ...(rt.trackedAudios || [])
        ]);
        if (rt.defaultBgmRef) candidates.add(rt.defaultBgmRef);
        if (typeof STATE !== 'undefined') {
            [STATE.bgm, STATE.musicAudio, STATE.audio].forEach(a => { if (a) candidates.add(a); });
        }
        
        candidates.forEach(a => {
            if (!a || a === rt.htmlAudio || a === rt.previewAudio) return;
            if (shouldPlay) {
                a.muted = false;
                a.volume = window.shopGetMusicVolume();
                a.play().catch(() => {});
            } else {
                a.pause();
                a.muted = true;
            }
        });
    };
    
    window.shopGetMusicVolume = function () {
        if (typeof STATE !== 'undefined') {
            const master = typeof STATE.masterVol === 'number' ? STATE.masterVol : (typeof STATE.masterVolume === 'number' ? STATE.masterVolume : 1);
            const music = typeof STATE.musicVol === 'number' ? STATE.musicVol : (typeof STATE.musicVolume === 'number' ? STATE.musicVolume : 0.5);
            return Math.max(0, Math.min(1, master * music));
        }
        const mSlider = document.querySelector('input[id*="master" i][type="range"]');
        const bSlider = document.querySelector('input[id*="music" i][type="range"]');
        const mVal = mSlider ? parseFloat(mSlider.value) / (parseFloat(mSlider.max) || 1) : 1;
        const bVal = bSlider ? parseFloat(bSlider.value) / (parseFloat(bSlider.max) || 1) : 0.5;
        return Math.max(0, Math.min(1, mVal * bVal));
    };
    
    window.shopRefreshMusicVolume = function () {
        const rt = window.SHOP_RUNTIME;
        if (rt.htmlAudio) {
            rt.htmlAudio.volume = window.shopGetMusicVolume();
        }
    };
    
    window.shopStopMusic = function () {
        const rt = window.SHOP_RUNTIME;
        if (rt.musicTimer) clearInterval(rt.musicTimer);
        rt.musicTimer = null;
        if (rt.htmlAudio) {
            rt.htmlAudio.pause();
            rt.htmlAudio.src = '';
            rt.htmlAudio = null;
        }
    };
    window.SHOP_RUNTIME.previewAudio = null;
    window.SHOP_RUNTIME.previewTimer = null;
    window.SHOP_RUNTIME.previewId = null;
    
    window.shopStopPreview = function (resumeEquipped = true) {
        const rt = window.SHOP_RUNTIME;
        if (rt.previewTimer) clearTimeout(rt.previewTimer);
        rt.previewTimer = null;
        if (rt.previewAudio) {
            rt.previewAudio.pause();
            rt.previewAudio.src = '';
            rt.previewAudio = null;
        }
        const wasPreviewing = rt.previewId !== null;
        rt.previewId = null;
        
        if (wasPreviewing && resumeEquipped) {
            const eq = window.shopGetEquipped();
            const item = window.SHOP_CATALOG.find(x => x.id === eq.music);
            window.shopApplyMusic(item);
        }
    };
    
    window.shopPreviewMusic = function (itemId) {
        const rt = window.SHOP_RUNTIME;
        if (rt.previewId === itemId) {
            window.shopStopPreview(true);
            if (document.getElementById('afcs-shop-modal')) window.openAfcsShop(window.SHOP_ACTIVE_TAB);
            return;
        }
        
        window.shopStopPreview(false);
        const item = window.SHOP_CATALOG.find(x => x.id === itemId);
        if (!item || !item.src) return;
        
        window.shopStopMusic();
        window.shopToggleDefaultBgm(false);
        
        const audio = new Audio(item.src);
        audio.volume = window.shopGetMusicVolume();
        rt.previewAudio = audio;
        rt.previewId = itemId;
        
        audio.play().catch(() => {});
        
        rt.previewTimer = setTimeout(() => {
            window.shopStopPreview(true);
            if (document.getElementById('afcs-shop-modal')) window.openAfcsShop(window.SHOP_ACTIVE_TAB);
        }, 5000);
        
        if (document.getElementById('afcs-shop-modal')) window.openAfcsShop(window.SHOP_ACTIVE_TAB);
    };
    window.shopSyncThemePill = function () {
        const pill = document.querySelector('.theme-mode-pill');
        if (!pill) return;
        
        const isGriefActive = document.body.classList.contains('theme-griefer');
        if (isGriefActive) {
            pill.classList.remove('is-blue', 'is-red', 'is-neon', 'is-doomsday', 'is-faithian', 'is-hamilton', 'is-epic', 'is-murderdrones');
            pill.classList.add('is-griefer', 'is-unlocked');
            pill.style.display = 'inline-flex';
            pill.textContent = '👑 Theme: Grief\'s Return ⇄';
        } else {
            pill.classList.remove('is-griefer');
        }
    };
    window.shopApplyMusic = function (item) {
        window.shopHookAudioPlay();
        window.shopStopMusic();
        if (!item || item.id === 'music_default') {
            window.shopToggleDefaultBgm(true);
            return;
        }
        
        window.shopToggleDefaultBgm(false);
        
        if (item.src) {
            const audio = new Audio(item.src);
            audio.loop = true;
            audio.volume = window.shopGetMusicVolume();
            window.SHOP_RUNTIME.htmlAudio = audio;
            const tryPlay = () => {
                if (window.SHOP_RUNTIME.htmlAudio === audio) {
                    window.shopToggleDefaultBgm(false);
                    audio.play().catch(() => {});
                }
            };
            tryPlay();
            window.addEventListener('pointerdown', tryPlay, { once: true });
            return;
        }
        
        if (!Array.isArray(item.synthNotes) || item.synthNotes.length === 0) return;
        
        const rt = window.SHOP_RUNTIME;
        rt.noteIdx = 0;
        rt.musicTimer = setInterval(() => {
            if (document.hidden) return;
            window.shopToggleDefaultBgm(false);
            const vol = window.shopGetMusicVolume() * 0.06;
            if (vol <= 0.0002) return;
            try {
                if (!rt.audioCtx) {
                    const Ctx = window.AudioContext || window.webkitAudioContext;
                    if (Ctx) rt.audioCtx = new Ctx();
                }
                if (!rt.audioCtx) return;
                if (rt.audioCtx.state === 'suspended') rt.audioCtx.resume();
                const freq = item.synthNotes.at(rt.noteIdx % item.synthNotes.length);
                rt.noteIdx++;
                const osc = rt.audioCtx.createOscillator();
                const gain = rt.audioCtx.createGain();
                osc.type = item.wave || 'sine';
                osc.frequency.setValueAtTime(freq, rt.audioCtx.currentTime);
                gain.gain.setValueAtTime(vol, rt.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, rt.audioCtx.currentTime + (item.tempoMs || 400) / 1000);
                osc.connect(gain);
                gain.connect(rt.audioCtx.destination);
                osc.start();
                osc.stop(rt.audioCtx.currentTime + (item.tempoMs || 400) / 1000);
            } catch (e) {}
        }, item.tempoMs || 420);
    };
    
    window.shopSyncGriefClasses = function () {
        const eq = window.shopGetEquipped();
        const isGriefEquipped = eq.theme === 'theme_griefer';
        
        document.body.classList.toggle('grief-highlights-active', isGriefEquipped);
        
        if (!isGriefEquipped && document.body.classList.contains('theme-griefer')) {
            document.body.classList.remove('theme-griefer');
            if (typeof window.applyTheme === 'function') {
                window.applyTheme('blue', true);
            }
        }
        if (typeof window.syncThemePill === 'function') window.syncThemePill();
    };
    
    window.shopApplyTheme = function (item) {
        if (item && item.id === 'theme_griefer') {
            if (typeof window.applyTheme === 'function') {
                window.applyTheme('griefer');
            }
        } else if (item && item.id !== 'theme_griefer') {
            if (document.body.classList.contains('theme-griefer') && typeof window.applyTheme === 'function') {
                window.applyTheme('blue');
            }
        }
        window.shopSyncGriefClasses();
        
        let styleEl = document.getElementById('afcs-shop-theme-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'afcs-shop-theme-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = (item && item.cssVars) ? item.cssVars : '';
        
        if (!window.SHOP_RUNTIME.themeObserver) {
            const obs = new MutationObserver(() => {
                const eq = window.shopGetEquipped();
                document.body.classList.toggle('grief-highlights-active', eq.theme === 'theme_griefer');
            });
            obs.observe(document.body, { attributes: true, attributeFilter: Array.of('class') });
            window.SHOP_RUNTIME.themeObserver = obs;
        }
    };
    
    
    window.shopApplyTheme = function (item) {
        if (item && item.id === 'theme_griefer' && typeof window.applyTheme === 'function') {
            window.applyTheme('griefer');
        }
        window.shopSyncGriefClasses();
        
        let styleEl = document.getElementById('afcs-shop-theme-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'afcs-shop-theme-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = (item && item.cssVars) ? item.cssVars : '';
        
        if (!window.SHOP_RUNTIME.themeObserver) {
            const obs = new MutationObserver(() => window.shopSyncGriefClasses());
            obs.observe(document.body, { attributes: true, attributeFilter: Array.of('class') });
            window.SHOP_RUNTIME.themeObserver = obs;
        }
    };
    
    window.shopApplyTheme = function (item) {
        if (item && item.id === 'theme_griefer') {
            const otherThemes = Array.of(
                'theme-hamilton', 'theme-epic', 'theme-doomsday',
                'theme-faithian', 'theme-murderdrones', 'theme-red',
                'party-mode', 'search-fx-cornerstone'
            );
            otherThemes.forEach(cls => document.body.classList.remove(cls));
        }
        window.shopSyncGriefClasses();
        
        let styleEl = document.getElementById('afcs-shop-theme-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'afcs-shop-theme-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = (item && item.cssVars) ? item.cssVars : '';
        
        if (!window.SHOP_RUNTIME.themeObserver) {
            const obs = new MutationObserver(() => window.shopSyncGriefClasses());
            obs.observe(document.body, { attributes: true, attributeFilter: Array.of('class') });
            window.SHOP_RUNTIME.themeObserver = obs;
        }
    };
    
    window.shopApplyTrail = function (item) {
        const rt = window.SHOP_RUNTIME;
        rt.trailColor = item ? item.trailColor : null;
        if (rt.trailBound) return;
        rt.trailBound = true;
        
        window.addEventListener('mousemove', e => {
            if (!rt.trailColor) return;
            const now = performance.now();
            if (now - rt.lastSpark < 45) return;
            rt.lastSpark = now;
            
            const dot = document.createElement('div');
            dot.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:7px;height:7px;border-radius:50%;background:' + rt.trailColor + ';box-shadow:0 0 8px ' + rt.trailColor + ';pointer-events:none;z-index:99997;transform:translate(-50%,-50%);transition:opacity 0.45s,transform 0.45s;';
            document.body.appendChild(dot);
            requestAnimationFrame(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'translate(-50%,-18px) scale(0.3)';
            });
            setTimeout(() => dot.remove(), 460);
        });
    };
    
    window.shopApplyBadge = function (item) {
        let badgeEl = document.getElementById('afcs-equipped-title-pill');
        if (!item || !item.badgeText) {
            if (badgeEl) badgeEl.remove();
            return;
        }
        if (!badgeEl) {
            badgeEl = document.createElement('div');
            badgeEl.id = 'afcs-equipped-title-pill';
            badgeEl.style.cssText = 'position:fixed;left:14px;top:218px;background:rgba(15,23,42,0.92);color:#fde047;border:1px solid #eab308;border-radius:999px;padding:4px 10px;font-size:0.75rem;font-weight:800;z-index:1;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.4);';
            document.body.appendChild(badgeEl);
        }
        badgeEl.textContent = item.badgeText;
    };
    
    window.shopSyncAllEquipped = function () {
        window.shopHookAudioPlay();
        const eq = window.shopGetEquipped();
        const findItem = id => window.SHOP_CATALOG.find(x => x.id === id);
        window.shopApplyMusic(findItem(eq.music));
        window.shopApplyTheme(findItem(eq.theme));
        window.shopApplyTrail(findItem(eq.trail));
        window.shopApplyBadge(findItem(eq.badge));
    };
    
    document.addEventListener('input', e => {
        if (e.target && e.target.type === 'range') {
            const eq = window.shopGetEquipped();
            if (eq.music !== 'music_default') {
                window.shopToggleDefaultBgm(false);
                window.shopRefreshMusicVolume();
            }
        }
    });
}
function startAfcsShopUI() {
    window.SHOP_ACTIVE_TAB = 'all';
    
    window.shopBuyOrEquip = function (itemId) {
        window.shopStopPreview(false); 
        const item = window.SHOP_CATALOG.find(x => x.id === itemId);
        if (!item) return;
        
        const owned = window.shopGetOwned();
        const equipped = window.shopGetEquipped();
        
        if (!owned.includes(item.id)) {
            const coins = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
            if (coins < item.price) {
                const msg = document.getElementById('shop-status-msg');
                if (msg) {
                    msg.textContent = '❌ Not enough AFCS Coins! Play Arcade mini-games to earn more.';
                    msg.style.color = '#f87171';
                }
                return;
            }
            const nextBal = coins - item.price;
            localStorage.setItem('afcs_coins', String(nextBal));
            const hudCoins = document.getElementById('afcs-coin-display');
            if (hudCoins) hudCoins.textContent = nextBal + ' 🪙';
            
            owned.push(item.id);
            localStorage.setItem(window.SHOP_STORAGE_OWNED, JSON.stringify(owned));
        }
        
        equipped[item.category] = item.id;
        localStorage.setItem(window.SHOP_STORAGE_EQUIPPED, JSON.stringify(equipped));
        window.shopSyncAllEquipped();
        window.openAfcsShop(window.SHOP_ACTIVE_TAB);
    };
    
    window.openAfcsShop = function (tab) {
        window.SHOP_ACTIVE_TAB = tab || 'all';
        const old = document.getElementById('afcs-shop-modal');
        if (old) old.remove();
        
        const owned = window.shopGetOwned();
        const equipped = window.shopGetEquipped();
        const coins = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        
        const itemsToShow = window.SHOP_ACTIVE_TAB === 'all'
        ? window.SHOP_CATALOG
        : window.SHOP_CATALOG.filter(x => x.category === window.SHOP_ACTIVE_TAB);
        
        const tabs = Array.of(
            { id: 'all', label: '🛍️ ALL' },
            { id: 'music', label: '🎵 MUSIC' },
            { id: 'theme', label: '🎨 THEMES' },
            { id: 'trail', label: '✨ TRAILS' },
            { id: 'badge', label: '🏅 BADGES' }
        );
        
        const modal = document.createElement('div');
        modal.id = 'afcs-shop-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(2,6,23,0.92);backdrop-filter:blur(8px);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:18px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:880px;max-height:88vh;background:#0f172a;border:2px solid #eab308;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
                <div style="padding:16px 20px;background:#090d16;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:1.3rem;font-weight:900;color:#fde047;letter-spacing:1px;">🛒 AFCS COIN SHOP</span>
                        <span style="background:#172554;border:1px solid #eab308;color:#fde047;padding:4px 12px;border-radius:8px;font-size:0.88rem;font-weight:bold;">
                            Balance: ${coins} 🪙
                        </span>
                    </div>
                    <button id="shop-close-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✕ CLOSE</button>
                </div>
        
                <div style="padding:10px 20px;background:#090d16;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${tabs.map(t => {
        const active = window.SHOP_ACTIVE_TAB === t.id;
        return `<button class="shop-tab-btn" data-tab="${t.id}" style="background:${active ? '#854d0e' : '#1e293b'};color:${active ? '#fef08a' : '#cbd5e1'};border:1px solid ${active ? '#eab308' : '#334155'};padding:6px 12px;border-radius:8px;font-weight:bold;font-size:0.8rem;cursor:pointer;">
                                ${t.label}
                            </button>`;
    }).join('')}
                    </div>
                    <span id="shop-status-msg" style="font-size:0.8rem;color:#94a3b8;">Customize music, themes, trails & titles</span>
                </div>
    
                <div style="padding:18px 20px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(245px,1fr));gap:14px;">
                    ${itemsToShow.map(item => {
    const isOwned = owned.includes(item.id);
    const isEquipped = equipped[item.category] === item.id;
    let btnText = '🛒 BUY (' + item.price + ' 🪙)';
    let btnBg = '#0284c7';
    let btnBorder = '#38bdf8';
    
    if (isEquipped) {
        btnText = '✅ EQUIPPED';
        btnBg = '#14532d';
        btnBorder = '#4ade80';
    } else if (isOwned) {
        btnText = '⚡ EQUIP';
        btnBg = '#1e293b';
        btnBorder = '#eab308';
    }
    
    const isPreviewing = window.SHOP_RUNTIME && window.SHOP_RUNTIME.previewId === item.id;
    const previewBtnHtml = (item.category === 'music' && item.src)
    ? `<button class="shop-preview-btn" data-id="${item.id}" style="margin-top:8px;width:100%;background:${isPreviewing ? '#7f1d1d' : '#1e293b'};color:${isPreviewing ? '#fca5a5' : '#7dd3fc'};border:1px solid ${isPreviewing ? '#ef4444' : '#38bdf8'};padding:7px 10px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:0.8rem;">
            ${isPreviewing ? '⏹️ STOP PREVIEW' : '🔊 PREVIEW (5s)'}
           </button>`
    : '';
    
    return `
        <div style="background:linear-gradient(180deg,#1e293b 0%,#0f172a 100%);border:1px solid ${isEquipped ? '#4ade80' : '#334155'};border-radius:12px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-size:1.8rem;">${item.icon}</span>
                    <span style="font-size:0.72rem;background:#090d16;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:6px;text-transform:uppercase;font-weight:bold;">
                        ${item.category}
                    </span>
                </div>
                <div style="font-weight:800;font-size:1rem;color:#f8fafc;margin-bottom:4px;">${item.name}</div>
                <p style="font-size:0.8rem;color:#94a3b8;line-height:1.4;margin:0;">${item.desc}</p>
            </div>
            <div>
                ${previewBtnHtml}
                <button class="shop-action-btn" data-id="${item.id}" style="margin-top:8px;width:100%;background:${btnBg};color:#fff;border:1px solid ${btnBorder};padding:9px 12px;border-radius:8px;font-weight:800;cursor:pointer;font-size:0.85rem;">
                    ${btnText}
                </button>
            </div>
        </div>
    `;
}).join('')}

                </div>
            </div>
        `;

document.body.appendChild(modal);

const closeShop = () => {
    window.shopStopPreview(true);
    modal.remove();
    window.removeEventListener('keydown', escHandler);
};
const escHandler = e => {
    if (e.code === 'Escape') closeShop();
};

document.getElementById('shop-close-btn').onclick = closeShop;
modal.onclick = e => {
    if (e.target === modal) closeShop();
};
window.addEventListener('keydown', escHandler);

modal.querySelectorAll('.shop-tab-btn').forEach(btn => {
    btn.onclick = () => window.openAfcsShop(btn.getAttribute('data-tab'));
});

modal.querySelectorAll('.shop-action-btn').forEach(btn => {
    btn.onclick = () => window.shopBuyOrEquip(btn.getAttribute('data-id'));
});
modal.querySelectorAll('.shop-preview-btn').forEach(btn => {
    btn.onclick = () => window.shopPreviewMusic(btn.getAttribute('data-id'));
});
};

window.shopMountDockButton = function () {
    if (document.getElementById('afcs-shop-dock-btn')) return;
    
    const dock = typeof window.arcadeGetOrCreateDock === 'function'
    ? window.arcadeGetOrCreateDock()
    : document.body;
    
    const btn = document.createElement('button');
    btn.id = 'afcs-shop-dock-btn';
    btn.title = 'Open AFCS Coin Shop (Custom Music, Themes & Trails)';
    btn.innerHTML = '🛒 Shop';
    btn.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;gap:5px;background:rgba(15,23,42,0.92);color:#fde047;border:1px solid #eab308;border-radius:10px;padding:7px 12px;font-size:0.84rem;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.45);transition:background 0.15s;';
    btn.onmouseenter = () => { btn.style.background = '#422006'; };
    btn.onmouseleave = () => { btn.style.background = 'rgba(15,23,42,0.92)'; };
    btn.onclick = () => window.openAfcsShop('all');
    
    dock.appendChild(btn);
};

if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
    STATE.onSearchInput.push(function (query) {
        const clean = String(query || '').trim().toLowerCase();
        if (Array.of('shop', 'store', 'buy', 'market', 'music').includes(clean)) {
            window.openAfcsShop('all');
        }
    });
}

const initShop = () => {
    window.shopMountDockButton();
    window.shopSyncAllEquipped();
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShop);
} else {
    initShop();
}
}
function start2048Data() {
    window.M2048_CFG = {
        triggers: Array.of('2048', 'merge', 'tiles', 'cornerstone 2048'),
        storageBestKey: 'afcs_2048_best',
        milestones: {
            512: 40,
            1024: 90,
            2048: 200
        },
        tileThemes: {
            2: { bg: '#1e293b', fg: '#e2e8f0', tag: 'BRICK' },
            4: { bg: '#1e3a5f', fg: '#bae6fd', tag: 'STONE' },
            8: { bg: '#0f766e', fg: '#ccfbf1', tag: 'PILLAR' },
            16: { bg: '#0369a1', fg: '#e0f2fe', tag: 'ARCH' },
            32: { bg: '#4338ca', fg: '#e0e7ff', tag: 'TOWER' },
            64: { bg: '#6d28d9', fg: '#ede9fe', tag: 'DUBAI' },
            128: { bg: '#a21caf', fg: '#fae8ff', tag: 'SKYLINE' },
            256: { bg: '#be123c', fg: '#ffe4e6', tag: 'SOLVER' },
            512: { bg: '#b45309', fg: '#fef3c7', tag: 'PSALMS' },
            1024: { bg: '#047857', fg: '#d1fae5', tag: 'BURJ 163' },
            2048: { bg: '#ca8a04', fg: '#fef9c3', tag: '⛪ CORNERSTONE' },
            4096: { bg: '#dc2626', fg: '#fee2e2', tag: '👑 LEGEND' }
        }
    };
    
    window.M2048_STATE = {
        active: false,
        grid: Array.of(),
        score: 0,
        best: parseInt(localStorage.getItem('afcs_2048_best') || '0', 10),
        claimedMilestones: Array.of(),
        won2048: false,
        keepPlaying: false,
        over: false,
        touchStartX: 0,
        touchStartY: 0,
        listeners: Array.of()
    };
    
    window.m2048AwardCoins = function (amount) {
        const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
        const next = cur + amount;
        localStorage.setItem('afcs_coins', String(next));
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = next + ' 🪙';
        return next;
    };
    
    if (typeof window.arcadeRegisterGame === 'function') {
        window.arcadeRegisterGame({
            id: 'game2048',
            title: '2048: Cornerstone Merge',
            icon: '🔢',
            reward: '+40–330 🪙',
            hint: 'Slide and merge tiles to build the 2048 Cornerstone...',
            triggers: window.M2048_CFG.triggers,
            launch: () => window.launch2048Game()
        });
    }
}
function start2048Engine() {
    window.m2048SpawnTile = function () {
        const st = window.M2048_STATE;
        const empty = Array.of();
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (st.grid.at(r).at(c) === 0) {
                    empty.push({ r: r, c: c });
                }
            }
        }
        if (empty.length === 0) return;
        const spot = empty.at(Math.floor(Math.random() * empty.length));
        st.grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
    };
    
    window.m2048SlideLine = function (line) {
        const st = window.M2048_STATE;
        const filtered = line.filter(v => v !== 0);
        const merged = Array.of();
        let gained = 0;
        
        for (let i = 0; i < filtered.length; i++) {
            if (i + 1 < filtered.length && filtered.at(i) === filtered.at(i + 1)) {
                const nextVal = filtered.at(i) * 2;
                merged.push(nextVal);
                gained += nextVal;
                
                const milestoneReward = window.M2048_CFG.milestones[nextVal];
                if (milestoneReward && !st.claimedMilestones.includes(nextVal)) {
                    st.claimedMilestones.push(nextVal);
                    const bal = window.m2048AwardCoins(milestoneReward);
                    window.m2048SetBanner('🎉 Reached ' + nextVal + '! +' + milestoneReward + ' 🪙 (Balance: ' + bal + ' 🪙)', '#4ade80');
                }
                if (nextVal === 2048 && !st.won2048) {
                    st.won2048 = true;
                }
                i++;
            } else {
                merged.push(filtered.at(i));
            }
        }
        
        while (merged.length < 4) merged.push(0);
        return { line: merged, gained: gained };
    };
    
    window.m2048Move = function (dir) {
        const st = window.M2048_STATE;
        if (!st.active || st.over) return;
        if (st.won2048 && !st.keepPlaying) return;
        
        const before = JSON.stringify(st.grid);
        let totalGain = 0;
        
        if (dir === 'left' || dir === 'right') {
            for (let r = 0; r < 4; r++) {
                const row = st.grid.at(r).slice();
                if (dir === 'right') row.reverse();
                const res = window.m2048SlideLine(row);
                if (dir === 'right') res.line.reverse();
                st.grid[r] = res.line;
                totalGain += res.gained;
            }
        } else {
            for (let c = 0; c < 4; c++) {
                const col = Array.from({ length: 4 }, (_, r) => st.grid.at(r).at(c));
                if (dir === 'down') col.reverse();
                const res = window.m2048SlideLine(col);
                if (dir === 'down') res.line.reverse();
                for (let r = 0; r < 4; r++) {
                    st.grid[r][c] = res.line.at(r);
                }
                totalGain += res.gained;
            }
        }
        
        if (JSON.stringify(st.grid) === before) return;
        
        st.score += totalGain;
        if (st.score > st.best) {
            st.best = st.score;
            localStorage.setItem(window.M2048_CFG.storageBestKey, String(st.best));
        }
        
        window.m2048SpawnTile();
        window.m2048CheckOver();
        window.m2048Render();
    };
    
    window.m2048CheckOver = function () {
        const st = window.M2048_STATE;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const val = st.grid.at(r).at(c);
                if (val === 0) return;
                if (c + 1 < 4 && st.grid.at(r).at(c + 1) === val) return;
                if (r + 1 < 4 && st.grid.at(r + 1).at(c) === val) return;
            }
        }
        st.over = true;
        window.m2048SetBanner('💀 NO MOVES LEFT! Final Score: ' + st.score, '#f87171');
    };
}
function start2048UI() {
    window.m2048SetBanner = function (txt, color) {
        const el = document.getElementById('m2048-banner');
        if (!el) return;
        el.textContent = txt;
        el.style.color = color || '#fde047';
    };
    
    window.m2048BuildModal = function () {
        const old = document.getElementById('afcs-2048-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'afcs-2048-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at top,#0f172a 0%,#020617 100%);color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px;user-select:none;';
        
        modal.innerHTML = `
            <div style="width:100%;max-width:520px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
                <span style="font-size:1.2rem;font-weight:900;color:#fde047;letter-spacing:1px;">🔢 2048: CORNERSTONE</span>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button id="m2048-new-btn" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:0.82rem;">↻ NEW</button>
                    <button id="m2048-exit-btn" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:0.82rem;">✕ EXIT</button>
                </div>
            </div>
        
            <div style="width:100%;max-width:520px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="background:#090d16;border:1px solid #1e293b;border-radius:10px;padding:8px 14px;text-align:center;">
                    <div style="font-size:0.72rem;color:#94a3b8;font-weight:bold;">SCORE</div>
                    <div id="m2048-score-val" style="font-size:1.3rem;font-weight:900;color:#38bdf8;">0</div>
                </div>
                <div style="background:#090d16;border:1px solid #1e293b;border-radius:10px;padding:8px 14px;text-align:center;">
                    <div style="font-size:0.72rem;color:#94a3b8;font-weight:bold;">BEST SCORE</div>
                    <div id="m2048-best-val" style="font-size:1.3rem;font-weight:900;color:#fde047;">0</div>
                </div>
            </div>
        
            <div id="m2048-banner" style="min-height:22px;font-size:0.92rem;font-weight:bold;color:#fde047;text-align:center;">
                Merge tiles to build 2048 (⛪ CORNERSTONE)! Rewards at 512, 1024 & 2048.
            </div>
        
            <div style="position:relative;">
                <div id="m2048-board" style="display:grid;grid-template-columns:repeat(4,82px);grid-template-rows:repeat(4,82px);gap:8px;background:#090d16;border:2px solid #334155;border-radius:14px;padding:10px;box-shadow:0 18px 45px rgba(0,0,0,0.85);"></div>
                <div id="m2048-overlay" style="display:none;position:absolute;inset:0;background:rgba(2,6,23,0.9);border-radius:14px;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;"></div>
            </div>
        
            <div style="display:flex;gap:8px;">
                <button id="m2048-btn-left" style="background:#1e293b;color:#fff;border:1px solid #475569;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;">◀</button>
                <button id="m2048-btn-up" style="background:#1e293b;color:#fff;border:1px solid #475569;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;">▲</button>
                <button id="m2048-btn-down" style="background:#1e293b;color:#fff;border:1px solid #475569;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;">▼</button>
                <button id="m2048-btn-right" style="background:#1e293b;color:#fff;border:1px solid #475569;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;">▶</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('m2048-exit-btn').onclick = window.m2048CloseGame;
        document.getElementById('m2048-new-btn').onclick = window.launch2048Game;
        document.getElementById('m2048-btn-left').onclick = () => window.m2048Move('left');
        document.getElementById('m2048-btn-up').onclick = () => window.m2048Move('up');
        document.getElementById('m2048-btn-down').onclick = () => window.m2048Move('down');
        document.getElementById('m2048-btn-right').onclick = () => window.m2048Move('right');
        
        const boardEl = document.getElementById('m2048-board');
        boardEl.ontouchstart = e => {
            const t = e.touches.item(0);
            if (!t) return;
            window.M2048_STATE.touchStartX = t.clientX;
            window.M2048_STATE.touchStartY = t.clientY;
        };
        boardEl.ontouchend = e => {
            const t = e.changedTouches.item(0);
            if (!t) return;
            const dx = t.clientX - window.M2048_STATE.touchStartX;
            const dy = t.clientY - window.M2048_STATE.touchStartY;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
            if (Math.abs(dx) > Math.abs(dy)) window.m2048Move(dx > 0 ? 'right' : 'left');
            else window.m2048Move(dy > 0 ? 'down' : 'up');
        };
        
        const keyHandler = function (e) {
            if (!window.M2048_STATE.active) return;
            if (e.code === 'Escape') {
                window.m2048CloseGame();
                return;
            }
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                e.preventDefault();
                window.m2048Move('left');
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                e.preventDefault();
                window.m2048Move('right');
            } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                window.m2048Move('up');
            } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                window.m2048Move('down');
            }
        };
        
        window.addEventListener('keydown', keyHandler);
        window.M2048_STATE.listeners.push(Array.of(window, 'keydown', keyHandler));
    };
    
    window.m2048Render = function () {
        const st = window.M2048_STATE;
        const board = document.getElementById('m2048-board');
        const scoreEl = document.getElementById('m2048-score-val');
        const bestEl = document.getElementById('m2048-best-val');
        const ov = document.getElementById('m2048-overlay');
        if (!board) return;
        
        if (scoreEl) scoreEl.textContent = String(st.score);
        if (bestEl) bestEl.textContent = String(st.best);
        
        board.innerHTML = st.grid.map(row =>
            row.map(val => {
                if (val === 0) {
                    return '<div style="width:82px;height:82px;background:#1e293b;border-radius:10px;opacity:0.45;"></div>';
                }
                const theme = window.M2048_CFG.tileThemes[val] || { bg: '#dc2626', fg: '#fff', tag: 'ULTRA' };
                const fontSize = val >= 1024 ? '1.3rem' : (val >= 128 ? '1.5rem' : '1.75rem');
                return `
                    <div style="width:82px;height:82px;background:${theme.bg};color:${theme.fg};border:2px solid rgba(255,255,255,0.22);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.45);">
                        <div style="font-size:${fontSize};font-weight:900;line-height:1.1;">${val}</div>
                        <div style="font-size:0.56rem;font-weight:800;letter-spacing:0.5px;margin-top:3px;opacity:0.9;">${theme.tag}</div>
                    </div>
                `;
            }).join('')
        ).join('');
        
        if (!ov) return;
        if (st.won2048 && !st.keepPlaying) {
            ov.style.display = 'flex';
            ov.innerHTML = `
                <div style="font-size:1.8rem;font-weight:900;color:#fde047;margin-bottom:8px;">⛪ 2048 CORNERSTONE!</div>
                <p style="color:#cbd5e1;font-size:0.9rem;margin-bottom:16px;">You built the Psalms 118:22 Cornerstone tile!</p>
                <div style="display:flex;gap:10px;">
                    <button id="m2048-endless-btn" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:9px 16px;border-radius:8px;font-weight:bold;cursor:pointer;">▶ KEEP GOING</button>
                    <button id="m2048-reset-ov-btn" style="background:#1e293b;color:#e2e8f0;border:1px solid #475569;padding:9px 16px;border-radius:8px;font-weight:bold;cursor:pointer;">↻ NEW GAME</button>
                </div>
            `;
            document.getElementById('m2048-endless-btn').onclick = () => {
                st.keepPlaying = true;
                ov.style.display = 'none';
            };
            document.getElementById('m2048-reset-ov-btn').onclick = window.launch2048Game;
        } else if (st.over) {
            ov.style.display = 'flex';
            ov.innerHTML = `
                <div style="font-size:1.8rem;font-weight:900;color:#f87171;margin-bottom:8px;">GRID LOCKED!</div>
                <p style="color:#cbd5e1;font-size:0.95rem;margin-bottom:16px;">Final Score: <b>${st.score}</b></p>
                <button id="m2048-over-btn" style="background:#eab308;color:#09090b;border:none;padding:10px 20px;border-radius:8px;font-weight:900;cursor:pointer;">↻ PLAY AGAIN</button>
            `;
            document.getElementById('m2048-over-btn').onclick = window.launch2048Game;
        } else {
            ov.style.display = 'none';
        }
    };
    
    window.m2048CloseGame = function () {
        const st = window.M2048_STATE;
        st.active = false;
        st.listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
        st.listeners = Array.of();
        const modal = document.getElementById('afcs-2048-modal');
        if (modal) modal.remove();
    };
    window.launch2048Game = function () {
        if (!window.M2048_CFG) start2048Data();
        if (!window.m2048SpawnTile) start2048Engine();
        window.m2048CloseGame();
        if (typeof window.arcadeUnlockGame === 'function') window.arcadeUnlockGame('game2048');
        const st = window.M2048_STATE;
        st.active = true;
        st.grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
        st.score = 0;
        st.claimedMilestones = Array.of();
        st.won2048 = false;
        st.keepPlaying = false;
        st.over = false;
        window.m2048SpawnTile();
        window.m2048SpawnTile();
        window.m2048BuildModal();
        window.m2048Render();
    };
    if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
        STATE.onSearchInput.push(function (query) {
            const clean = String(query || '').trim().toLowerCase();
            if (window.M2048_CFG.triggers.includes(clean)) {
                window.launch2048Game();
            }
        });
    }
}
