//#region Stuff
function startCompareModal() {
    let firstCard = null;
    let waitingForSecond = false;
    
    const toast = document.createElement('div');
    toast.className = 'compare-toast';
    toast.innerHTML = `<span id="compareToastText"> Click any 2nd classmate to compare</span><button type="button" class="compare-cancel-btn">Cancel</button>`;
    document.body.appendChild(toast);
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'vip-modal-overlay';
    modalOverlay.innerHTML = `
                <div class="vip-modal-card compare-modal-card">
                    <button type="button" class="vip-close-btn">&times;</button>
                    <div class="vip-badge"> CAST & CREW COMPARISON</div>
                    <div class="compare-grid" id="compareGridBody"></div>
                </div>
            `;
    document.body.appendChild(modalOverlay);
    
    const gridBody = modalOverlay.querySelector('#compareGridBody');
    const closeModalBtn = modalOverlay.querySelector('.vip-close-btn');
    
    function cancelComparePick() {
        waitingForSecond = false;
        firstCard = null;
        toast.classList.remove('active');
    }
    
    toast.querySelector('.compare-cancel-btn').addEventListener('click', cancelComparePick);
    closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
    
    function buildColumnHTML(card) {
        const name = card.querySelector('.overlay-text').textContent.trim();
        const imgSrc = card.querySelector('img').src;
        const monoEl = card.querySelector('.monogram-avatar');
        const avatarHTML = monoEl
        ? `<div class="compare-avatar monogram-avatar" style="font-size:34px;">${monoEl.textContent}</div>`
        : `<img class="compare-avatar" src="${imgSrc}" alt="${name}">`;
        
        const role = card.dataset.displayRole || card.dataset.role || 'Student';
        const team = card.dataset.team ? ` • ${card.dataset.team}` : '';
        const character = card.dataset.character || 'Behind-the-Scenes Crew';
        const faction = CONFIG.factionLabels[card.dataset.faction] || 'Production & Faculty';
        const bio = card.dataset.bio || 'No description provided.';
        
        return `
                    <div class="compare-col">
                        ${avatarHTML}
                        <h3 class="compare-name">${name}</h3>
                        <span class="panel-badge">${role}${team}</span>
                        <div class="compare-detail"><strong>Play Character</strong><span> ${character}</span></div>
                        <div class="compare-detail"><strong>Story Faction</strong><span>${faction}</span></div>
                        <div class="compare-detail"><strong>About</strong><span>${bio}</span></div>
                    </div>
                `;
    }
    
    function renderComparison(cardA, cardB) {
        gridBody.innerHTML = `
                ${buildColumnHTML(cardA)}
                <div class="compare-vs-wrap">
                    <div class="compare-vs-badge">VS</div>
                    <button type="button" class="compare-swap-btn" title="Swap Sides">⇄ Swap</button>
                    <button type="button" class="compare-battle-launch-btn" id="launchCompareBattleBtn">⚔️ 1v1 Battle</button>
                    <button type="button" class="compare-online-launch-btn" id="launchOnlineBattleBtn">🌐 Online 1v1</button>
                </div>
                ${buildColumnHTML(cardB)}
            `;
        
        gridBody.querySelector('.compare-swap-btn').addEventListener('click', () => {
            renderComparison(cardB, cardA);
            playBeep(640, 0.06, 'sine', 0.035);
        });
        
        const battleBtn = gridBody.querySelector('#launchCompareBattleBtn');
        if (battleBtn) {
            battleBtn.addEventListener('click', () => {
                if (typeof window.initCompareBattleArena === 'function') {
                    window.initCompareBattleArena(gridBody, cardA, cardB);
                    playBeep(783.99, 0.09, 'triangle', 0.045);
                }
            });
        }
        
        const onlineBtn = gridBody.querySelector('#launchOnlineBattleBtn');
        if (onlineBtn) {
            onlineBtn.addEventListener('click', () => {
                if (typeof window.openOnlineBattleLobby === 'function') {
                    window.openOnlineBattleLobby(gridBody, cardA);
                    playBeep(659.25, 0.09, 'triangle', 0.045);
                }
            });
        }
        
        modalOverlay.classList.add('active');
        playBeep(520, 0.08, 'sine', 0.04);
        setTimeout(() => playBeep(740, 0.12, 'sine', 0.04), 80);
    }
    
    STATE.onOpenCard.push((card) => {
        if (waitingForSecond && card && card !== firstCard) {
            const savedFirst = firstCard;
            cancelComparePick();
            closePanel();
            renderComparison(savedFirst, card);
            return true;
        }
        
        requestAnimationFrame(() => {
            if (!DOM.panelBody || DOM.panelBody.querySelector('.compare-trigger-btn')) return;
            const cmpBtn = document.createElement('button');
            cmpBtn.type = 'button';
            cmpBtn.className = 'compare-trigger-btn';
            cmpBtn.textContent = ' Compare With Another...';
            cmpBtn.addEventListener('click', () => {
                firstCard = card;
                waitingForSecond = true;
                const firstName = card.querySelector('.overlay-text').textContent.trim();
                toast.querySelector('#compareToastText').textContent = ` Comparing ${firstName} !  click any 2nd classmate!`;
                toast.classList.add('active');
                closePanel();
                playBeep(600, 0.07, 'sine', 0.04);
            });
            DOM.panelBody.appendChild(cmpBtn);
        });
        return false;
    });
} // comparison
function startPlaybillModal() {
    const openBtn = document.getElementById('openPlaybillBtn');
    if (!openBtn) return;
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'vip-modal-overlay';
    modalOverlay.innerHTML = `
                <div class="vip-modal-card credits-modal-card">
                    <button type="button" class="vip-close-btn">&times;</button>
                    <div class="credits-modal-header">
                        <div class="vip-badge"> PASKONG AFCS 2026 PLAYBILL</div>
                        <h2>Beyond The Manger</h2>
                        <p class="vip-desc" style="margin-bottom:0;">Grade 7 – Psalms • S.Y. 2026–2027</p>
                    </div>
                    <div id="creditsRollBody"></div>
                </div>
            `;
    document.body.appendChild(modalOverlay);
    
    const bodyEl = modalOverlay.querySelector('#creditsRollBody');
    const closeModalBtn = modalOverlay.querySelector('.vip-close-btn');
    
    function buildCredits() {
        const cards = getCards();
        const groups = {
            ' Cast & Characters': [],
            ' Class Officers': [],
            ' Production & Technical Crew': []
        };
        
        cards.forEach(card => {
            const name = card.querySelector('.overlay-text').textContent.trim();
            if (card.dataset.character) groups[' Cast & Characters'].push({ name, role: card.dataset.character });
            if (card.dataset.filter === 'officer') groups[' Class Officers'].push({ name, role: card.dataset.role });
            const crew = card.dataset.team || (card.dataset.filter !== 'officer' && card.dataset.role !== 'Student' ? (card.dataset.displayRole || card.dataset.role) : '');
            if (crew) groups[' Production & Technical Crew'].push({ name, role: crew });
        });
        
        const statsHTML = `
                    <div class="playbill-stats-grid">
                        <div class="playbill-stat-box"><span class="playbill-stat-num">${cards.length}</span><span class="playbill-stat-lbl">Roster</span></div>
                        <div class="playbill-stat-box"><span class="playbill-stat-num">${groups[' Cast & Characters'].length}</span><span class="playbill-stat-lbl">Speaking Cast</span></div>
                        <div class="playbill-stat-box"><span class="playbill-stat-num">${groups[' Class Officers'].length}</span><span class="playbill-stat-lbl">Officers</span></div>
                        <div class="playbill-stat-box"><span class="playbill-stat-num">${groups[' Production & Technical Crew'].length}</span><span class="playbill-stat-lbl">Crew Leads</span></div>
                    </div>
                `;
        
        const groupsHTML = Object.entries(groups).map(([title, list]) => `
                    <div class="credits-group">
                        <h4>${title} (${list.length})</h4>
                        ${list.map(item => `<div class="credits-entry"><span class="credits-person">${item.name}</span><span class="credits-role-label">${item.role}</span></div>`).join('')}
                    </div>
                `).join('');
        
        bodyEl.innerHTML = `${statsHTML}${groupsHTML}<button type="button" class="playbill-print-btn" id="playbillPrintTrigger"> Print / Save PDF Program</button>`;
        
        const printBtn = bodyEl.querySelector('#playbillPrintTrigger');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
                setTimeout(() => window.print(), 150);
            });
        }
    }
    
    openBtn.addEventListener('click', () => {
        buildCredits();
        modalOverlay.classList.add('active');
    });
    closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
} // playbill
function startTourGuide() {
    const pitchBar = document.createElement('div');
    pitchBar.className = 'pitch-bar';
    pitchBar.innerHTML = `
                <button type="button" class="pitch-step-btn" data-step="0">1. Hero</button>
                <button type="button" class="pitch-step-btn" data-step="1">2. Synopsis</button>
                <button type="button" class="pitch-step-btn" data-step="2">3. Roadmap</button>
                <button type="button" class="pitch-step-btn" data-step="3">4. Cast & Crew</button>
                <button type="button" class="pitch-step-btn" data-step="4">5. Playbill</button>
                <button type="button" class="pitch-close-btn" title="Exit Tour Guide (P)">&times;</button>
            `;
    document.body.appendChild(pitchBar);
    
    const stepBtns = pitchBar.querySelectorAll('.pitch-step-btn');
    let currentStep = -1;
    
    function goToStep(idx) {
        currentStep = idx;
        stepBtns.forEach((b, i) => b.classList.toggle('current', i === idx));
        
        if (idx === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
        else if (idx === 1) document.querySelector('.synopsis-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (idx === 2) document.querySelector('.timeline-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (idx === 3) document.querySelector('.filter-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (idx === 4) document.getElementById('openPlaybillBtn')?.click();
        
        playBeep(580, 0.05, 'sine', 0.03);
    }
    
    stepBtns.forEach(btn => btn.addEventListener('click', () => goToStep(Number(btn.dataset.step))));
    pitchBar.querySelector('.pitch-close-btn').addEventListener('click', () => pitchBar.classList.remove('active'));
    
    window.addEventListener('keydown', (e) => {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
        if (document.querySelectorAll('.vip-modal-overlay.active').length > 0 && e.key.toLowerCase() !== 'p') return;
        
        if (e.key.toLowerCase() === 'p') {
            e.preventDefault();
            const isOpening = !pitchBar.classList.contains('active');
            pitchBar.classList.toggle('active', isOpening);
            if (isOpening && currentStep === -1) goToStep(0);
        } else if (pitchBar.classList.contains('active') && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            goToStep((currentStep + 1) % stepBtns.length);
        }
    });
} // guide
//#endregion
