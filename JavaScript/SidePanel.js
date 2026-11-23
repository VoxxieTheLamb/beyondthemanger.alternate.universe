//#region 2nd option- I mean Side Panel
function openCard(card) {
    if (!card) return;
    
    for (const hook of STATE.onOpenCard) {
        if (hook(card) === true) return;
    }
    
    const name = card.querySelector('.overlay-text').textContent;
    const imgEl = card.querySelector('img');
    const imgSrc = imgEl ? imgEl.src : '';
    
    const bday = card.dataset.birthday || 'N/A';
    const baseRole = card.dataset.role || 'Student';
    const displayRole = card.dataset.displayRole || baseRole;
    const badgeClass = baseRole.toLowerCase().replace(/\s+/g, '-');
    const bio = card.dataset.bio || 'No description provided.';
    
    const teamRole = card.dataset.team || '';
    const teamCategory = card.dataset.teamCategory || teamRole;
    const teamClass = teamCategory.toLowerCase().replace(/\s+/g, '-');
    const teamBadgeHTML = teamRole ? `<span class="panel-badge ${teamClass}">${teamRole}</span>` : '';
    
    const character = card.dataset.character || '';
    const characterHTML = character
    ? `<div class="meta-item" style="margin-bottom:8px;"><span class="meta-label">Play Character</span><span class="meta-value" style="color:#f472b6;font-weight:bold;"> ${character}</span></div>`
    : '';
    
    const birthdayBanner = card.classList.contains('is-birthday')
    ? `<div style="margin-top:12px;padding:8px 12px;background:rgba(255,215,0,0.15);border:1px solid #ffd700;border-radius:8px;color:#ffd700;font-weight:bold;text-align:center;"> Happy Birthday Today! </div>`
    : '';
    
    let birthdayMetaHTML = '';
    if (bday && bday !== 'N/A' && bday.toLowerCase() !== 'month dd, yyyy') {
        const parsed = new Date(bday);
        if (isNaN(parsed.getTime())) {
            birthdayMetaHTML = `<div class="meta-item"><span class="meta-label">Birthday</span><span class="meta-value">${bday}</span></div>`;
        } else {
            const now = new Date();
            const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let nextBday = new Date(now.getFullYear(), parsed.getMonth(), parsed.getDate());
            if (nextBday < todayMidnight) nextBday.setFullYear(now.getFullYear() + 1);
            const diffDays = Math.round((nextBday - todayMidnight) / 86400000);
            const tag = diffDays === 0 ? '  Today!' : diffDays === 1 ? ' ( Tomorrow!)' : ` (Their Birthday is in ${diffDays} days!)`;
            birthdayMetaHTML = `<div class="meta-item"><span class="meta-label">Birthday</span><span class="meta-value">${bday}<span style="color:#fde047;font-weight:bold;">${tag}</span></span></div>`;
        }
    }
    
    if (DOM.verity) {
        if (baseRole === 'Teacher') DOM.verity.textContent = 'Teacher Information';
        else if (baseRole === 'Guest Legend') DOM.verity.textContent = 'VIP Guest Information';
        else DOM.verity.textContent = 'Student Information';
    }
    
    const monoEl = card.querySelector('.monogram-avatar');
    const isCustomPfpActive = card.querySelector('img.is-zerotwo-pfp, img.is-carl-pfp, img.is-cortis-pfp, img.is-kobe-pfp, img.is-vox-pfp, img.is-alastor-pfp, img.is-newton-pfp, img.is-guest-alter-pfp');
    if (isCustomPfpActive) {
        DOM.panelImageContainer.innerHTML = `<img src="${imgSrc}" alt="${name}" class="${isCustomPfpActive.className}">`;
    } else if (monoEl) {
        DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
    } else {
        DOM.panelImageContainer.innerHTML = `<img src="${imgSrc}" alt="${name}">`;
    }
    DOM.panelBody.innerHTML = `
                <div class="panel-card-header">
                    <h2 class="panel-name">${name}</h2>
                    <div class="panel-badges-wrap">
                        <span class="panel-badge ${badgeClass}">${displayRole}</span>
                        ${teamBadgeHTML}
                    </div>
                    ${birthdayBanner}
                </div>
                <div class="panel-meta-section">
                    ${characterHTML}
                    ${birthdayMetaHTML}
                </div>
                <div class="panel-bio-section">
                    <h4 class="section-title">About Me</h4>
                    <p class="bio-text">${bio}</p>
                </div>
            `;
    
    renderPanelConnections(card);
    renderShareButton(card);
    
    requestAnimationFrame(() => {
        const glowStyles = window.getComputedStyle(card);
        DOM.panelImageContainer.style.borderColor = glowStyles.borderColor;
        DOM.panelImageContainer.style.boxShadow = glowStyles.boxShadow;
    });
    
    getCards().forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    
    if (!STATE.panelHidden) {
        const wasAlreadyOpen = DOM.panel.classList.contains('active');
        if (!wasAlreadyOpen) {
            const docks = new Array('right', 'left', 'bottom', 'center');
            const chosenDock = docks[Math.floor(Math.random() * docks.length)];
            DOM.panel.style.transition = 'none';
            DOM.panel.dataset.dock = chosenDock;
            document.body.dataset.panelDock = chosenDock;
            void DOM.panel.offsetWidth;
            DOM.panel.style.transition = '';
        }
        
        DOM.panel.classList.add('active');
        if (DOM.overlay) DOM.overlay.classList.add('active');
        document.body.classList.add('panel-is-open');
        updateSplitGridLayout();
    }
    
    if (baseRole === 'Teacher') {
        if (card.parentElement) card.parentElement.classList.add('sir-sun-active');
        playTeacherChord();
    }
}
function closePanel() {
    const wasOpen = DOM.panel && DOM.panel.classList.contains('active');
    if (DOM.panel) DOM.panel.classList.remove('active');
    if (DOM.overlay) DOM.overlay.classList.remove('active');
    getCards().forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.PersonWrapper.sir-sun-active').forEach(w => w.classList.remove('sir-sun-active'));
    document.body.classList.remove('panel-is-open');
    delete document.body.dataset.panelDock;
    updateSplitGridLayout();
    if (wasOpen) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        STATE.onClosePanel.forEach(fn => fn());
    }
}
function navigatePanel(step) {
    const visibleCards = getVisibleCards();
    if (!visibleCards.length) return;
    
    const activeCard = document.querySelector('.PeoplePics.active');
    let nextIndex = visibleCards.indexOf(activeCard) + step;
    if (nextIndex >= visibleCards.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = visibleCards.length - 1;
    
    openCard(visibleCards.at(nextIndex));
}
function renderPanelConnections(activeCard) {
    const allCards = getCards();
    const faction = activeCard.dataset.faction || '';
    const team = activeCard.dataset.team || activeCard.dataset.role || '';
    
    let label = '';
    let matches = [];
    
    if (faction && faction !== 'None') {
        label = `In ${CONFIG.factionLabels[faction] || faction}`;
        matches = allCards.filter(c => c !== activeCard && c.dataset.faction === faction);
    } else if (team && team !== 'Student') {
        label = `Also in ${team}`;
        matches = allCards.filter(c => c !== activeCard && (c.dataset.team === team || c.dataset.role === team));
    }
    
    if (!matches.length) return;
    
    const box = document.createElement('div');
    box.className = 'panel-connections';
    box.innerHTML = `<span class="connections-title"> ${label}</span><div class="connections-pills"></div>`;
    
    const pillWrap = box.querySelector('.connections-pills');
    matches.forEach(targetCard => {
        const raw = (targetCard.querySelector('.overlay-text')?.textContent || '').trim();
        const lastName = (raw.split(',').at(0) || raw).trim();
        
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'connection-pill';
        btn.textContent = lastName;
        btn.addEventListener('click', () => {
            playBeep(560, 0.05, 'sine', 0.03);
            openCard(targetCard);
        });
        pillWrap.appendChild(btn);
    });
    
    DOM.panelBody.appendChild(box);
}
function renderShareButton(card) {
    const fullName = card.querySelector('.overlay-text').textContent.trim();
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    history.replaceState(null, '', `#${slug}`);
    
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'share-profile-btn';
    shareBtn.textContent = ' Copy Direct Link to Profile';
    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            shareBtn.textContent = ' Link Copied!';
            setTimeout(() => { shareBtn.textContent = ' Copy Direct Link to Profile'; }, 2000);
        });
    });
    
    DOM.panelBody.appendChild(shareBtn);
}
function startSidePanel() {
    let lockedCard = null;
    
    const showPanelBtn = document.createElement('button');
    showPanelBtn.type = 'button';
    showPanelBtn.className = 'show-panel-pill';
    showPanelBtn.textContent = 'Show Side Panel';
    document.body.appendChild(showPanelBtn);
    
    if (DOM.panel) {
        const hidePanelBtn = document.createElement('button');
        hidePanelBtn.type = 'button';
        hidePanelBtn.className = 'hide-panel-btn';
        hidePanelBtn.textContent = 'Hide Panel';
        DOM.panel.prepend(hidePanelBtn);
        
        hidePanelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            STATE.panelHidden = true;
            DOM.panel.classList.remove('active');
            if (DOM.overlay) DOM.overlay.classList.remove('active');
            document.body.classList.remove('panel-is-open');
            delete document.body.dataset.panelDock;
            updateSplitGridLayout();
            showPanelBtn.classList.add('visible');
            playBeep(360, 0.06, 'sine', 0.03);
        });
    }
    
    showPanelBtn.addEventListener('click', () => {
        STATE.panelHidden = false;
        showPanelBtn.classList.remove('visible');
        playBeep(620, 0.06, 'sine', 0.035);
        
        const activeCard = document.querySelector('.PeoplePics.active') || getVisibleCards()[0];
        if (activeCard) {
            openCard(activeCard);
        }
    });
    
    if (DOM.container) {
        DOM.container.addEventListener('click', (e) => {
            const card = e.target.closest('.PeoplePics');
            if (!card) return;
            
            if (e.detail > 1 || e._isTripleTap) return;
            
            if (STATE.panelHidden) {
                openCard(card);
                return;
            }
            
            if (lockedCard === card) return;
            
            if (DOM.panel && DOM.panel.classList.contains('active') && card.classList.contains('active')) {
                lockedCard = card;
                closePanel();
                return;
            }
            
            lockedCard = null;
            openCard(card);
        });
    }
    
    if (DOM.closeBtn) DOM.closeBtn.addEventListener('click', closePanel);
    if (DOM.overlay) DOM.overlay.addEventListener('click', closePanel);
    if (DOM.prevCardBtn) DOM.prevCardBtn.addEventListener('click', () => navigatePanel(-1));
    if (DOM.nextCardBtn) DOM.nextCardBtn.addEventListener('click', () => navigatePanel(1));
    
    window.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.PeoplePics');
        if (!clickedCard || clickedCard !== lockedCard) {
            lockedCard = null;
        }
        if (!STATE.panelHidden && DOM.panel && !DOM.panel.contains(e.target) && !clickedCard && (!DOM.overlay || !DOM.overlay.contains(e.target))) {
            closePanel();
        }
    });
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    if (DOM.panel) {
        DOM.panel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        DOM.panel.addEventListener('touchend', (e) => {
            if (e.target.closest('button')) return;
            const diffX = e.changedTouches[0].screenX - touchStartX;
            const diffY = e.changedTouches[0].screenY - touchStartY;
            
            if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY)) {
                navigatePanel(diffX < 0 ? 1 : -1);
            } else if (diffY > 75 && DOM.panel.scrollTop <= 0) {
                closePanel();
            }
        }, { passive: true });
    }
    
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    if (initialHash) {
        const match = getCards().find(card => {
            const slug = card.querySelector('.overlay-text').textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return slug === initialHash || slug.includes(initialHash);
        });
        if (match) {
            setTimeout(() => {
                openCard(match);
                match.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        }
    }
}
window.addEventListener('resize', updateSplitGridLayout, { passive: true });
//#endregion
