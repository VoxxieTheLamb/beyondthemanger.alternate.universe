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
                    <img src="${card.img}" alt="${card.name}" onerror="this.src='mainPics/AFCS.jpg'">
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
        s.src = 'https://jsdelivr.net';
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
        { id: 'hikaru', name: 'Hikaru Nakamura', rating: 2820, reward: 100, depth: 2, blunderChance: 0.04, avatar: '⚡', taunt: 'Chat, takes, takes, takes—I literally do not care.' },
        { id: 'magnus', name: 'Magnus Carlsen', rating: 2882, reward: 200, depth: 3, blunderChance: 0.02, avatar: '👑', taunt: 'I will squeeze water from a stone in this endgame.' },
        { id: 'deepblue', name: 'IBM Deep Blue', rating: 3000, reward: 250, depth: 3, blunderChance: 0.0, avatar: '🖥️', taunt: 'EVALUATING 200,000,000 POSITIONS PER SECOND...' },
        { id: 'stockfish', name: 'Stockfish v16', rating: 3630, reward: 1000, depth: 4, blunderChance: 0.0, avatar: '🐟', taunt: 'MATE IN 14 DETECTED. RESISTANCE IS SUBOPTIMAL.' }
    ];

    const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

     function getSquareBonus(r, c) {
        const distCenter = Math.abs(3.5 - r) + Math.abs(3.5 - c);
        return Math.round((7 - distCenter) * 4);
    }

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
                const pos = getSquareBonus(r, c);
                total += sq.color === 'w' ? (val + pos) : -(val + pos);
            }
        }
        return total;
    }

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
                const pos = sq.color === 'w' ? CENTER_BONUS[7 - r][c] : CENTER_BONUS[r][c];
                total += sq.color === 'w' ? (val + pos) : -(val + pos);
            }
        }
        return total;
    }

    function orderMoves(moves) {
        return moves.sort((a, b) => {
            const scoreA = (a.captured ? 10 : 0) + (a.promotion ? 8 : 0);
            const scoreB = (b.captured ? 10 : 0) + (b.promotion ? 8 : 0);
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

    function chooseBotMove(game, bot) {
        const moves = orderMoves(game.moves({ verbose: true }));
        if (!moves.length) return null;

        if (bot.depth === 0 || Math.random() < bot.blunderChance) {
            return moves.at(Math.floor(Math.random() * moves.length));
        }

        let bestMove = moves.at(0);
        let bestValue = Infinity;

        for (const m of moves) {
            game.move(m);
            const boardVal = minimax(game, bot.depth - 1, -Infinity, Infinity, true);
            game.undo();
            if (boardVal < bestValue) {
                bestValue = boardVal;
                bestMove = m;
            }
        }
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

    const UNICODE_PIECES = {
        wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
        bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
    };

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
        s.src = 'https://cloudflare.com';
        s.onload = () => cb();
        document.head.appendChild(s);
    }

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
        rivalBanner.innerHTML = `
            <div class="cc-rival-avatar">${bot.avatar}</div>
            <div class="cc-rival-info">
                <div class="cc-rival-name">${bot.name} <span class="cc-elo">(${bot.rating})</span> • Prize: <strong style="color:#fde047;">+${bot.reward} 🪙</strong></div>
                <div class="cc-rival-taunt">"${bot.taunt}"</div>
            </div>
        `;
    }

    function renderBoard() {
        if (!game) return;
        const b = game.board();
        const inCheck = game.in_check();
        const turnColor = game.turn();
        let html = '';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = sqName(r, c);
                const piece = b[r][c];
                const isDark = (r + c) % 2 === 1;
                const isSel = selectedSq === sq;
                const isTarget = legalTargets.includes(sq);
                const isKingCheck = inCheck && piece && piece.type === 'k' && piece.color === turnColor;

                const glyph = piece ? UNICODE_PIECES[piece.color + piece.type.toUpperCase()] : '';
                const pieceCls = piece ? (piece.color === 'w' ? 'cc-w-piece' : 'cc-b-piece') : '';

                html += `
                    <button type="button" class="cc-sq ${isDark ? 'is-dark' : 'is-light'} ${isSel ? 'is-selected' : ''} ${isTarget ? 'is-legal' : ''} ${isKingCheck ? 'is-check' : ''}" data-sq="${sq}">
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
            const whiteWon = game.turn() === 'b';
            if (whiteWon) {
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
        if (!game || game.game_over() || game.turn() !== 'b') return;
        const bot = chessData.bots.at(selectedBotIdx);
        botThinking = true;
        statusEl.style.color = '#bae6fd';
        statusEl.textContent = `${bot.avatar} ${bot.name} is thinking...`;

        setTimeout(() => {
            if (!game || game.game_over()) {
                botThinking = false;
                return;
            }
            const moveObj = chessData.chooseBotMove(game, bot);
            if (moveObj) {
                game.move(moveObj);
                playBeep(moveObj.captured ? 320 : 480, 0.06, 'triangle', 0.04);
            }
            botThinking = false;
            renderBoard();
            if (!checkMatchEnd()) {
                statusEl.style.color = game.in_check() ? '#fca5a5' : '#e2e8f0';
                statusEl.textContent = game.in_check() ? '⚠️ CHECK! Defend your King!' : 'Your turn (White)';
            }
        }, bot.id === 'stockfish' ? 280 : 180);
    }

    function handleSquareClick(sq) {
        if (!game || botThinking || game.game_over() || game.turn() !== 'w') return;

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
        if (piece && piece.color === 'w') {
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

    function startNewMatch() {
        ensureChessEngine(() => {
            game = new window.Chess();
            selectedSq = null;
            legalTargets = [];
            botThinking = false;
            syncRivalBanner();
            renderBoard();
            statusEl.style.color = '#e2e8f0';
            statusEl.textContent = 'Your turn (White) — Click a piece to move!';
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

    modal.querySelector('#ccResignBtn').addEventListener('click', () => {
        if (!game || game.game_over()) return;
        const bot = chessData.bots.at(selectedBotIdx);
        statusEl.style.color = '#fca5a5';
        statusEl.textContent = `🏳️ You resigned. ${bot.name} wins!`;
        game.load('8/8/8/8/8/8/8/8 w - - 0 1');
        playBeep(180, 0.2, 'sawtooth', 0.045);
    });

    function openChessComModal() {
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