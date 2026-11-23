//#region Core stuff
function getCards() {
    return Array.from(document.querySelectorAll('.PeoplePics'));
} // all it does it GET the CARDS and stf
function getVisibleCards() {
    return getCards().filter(card => !card.classList.contains('is-filtered-out'));
} // the same but ONLY visible
function spawnBurst(x, y, colors, count = 20) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 5;
        STATE.particles.push({
            type: 'FRAGMENT',
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2.5 + Math.random() * 3.5,
            alpha: 1.0,
            decay: 0.02 + Math.random() * 0.015,
            color: colors[i % colors.length]
        });
    }
} // mouse click
function updateSplitGridLayout() {
    const dock = document.body.dataset.panelDock;
    const wrappers = Array.from(document.querySelectorAll('.People > .PersonWrapper'));
    if (!wrappers.length) return;
    
    if (!document.body.classList.contains('panel-is-open') || (dock !== 'center' && dock !== 'bottom') || window.innerWidth <= 768) {
        document.body.classList.remove('has-custom-drop');
        document.documentElement.style.removeProperty('--split-cols');
        document.documentElement.style.removeProperty('--split-gap');
        document.documentElement.style.removeProperty('--drop-grid-template');
        wrappers.forEach(w => { w.style.gridColumn = ''; });
        return;
    }
    
    if (dock === 'center' && DOM.panel && DOM.panel.classList.contains('is-custom-pos')) {
        const rect = DOM.panel.getBoundingClientRect();
        const pad = 20;
        const leftSpace = Math.max(0, rect.left - pad);
        const rightSpace = Math.max(0, window.innerWidth - rect.right - pad);
        const minColWidth = 135;
        
        const leftCols = Math.floor(leftSpace / minColWidth);
        const rightCols = Math.floor(rightSpace / minColWidth);
        
        if (leftCols === 0 && rightCols === 0) {
            document.body.classList.remove('has-custom-drop');
            wrappers.forEach(w => { w.style.gridColumn = ''; });
            return;
        }
        
        const gapWidth = Math.round(rect.width + 32);
        const leftPart = leftCols > 0 ? `repeat(${leftCols}, minmax(115px, 1fr)) ` : '';
        const rightPart = rightCols > 0 ? ` repeat(${rightCols}, minmax(115px, 1fr))` : '';
        const template = `${leftPart}${gapWidth}px${rightPart}`.trim();
        
        document.body.classList.add('has-custom-drop');
        document.documentElement.style.setProperty('--drop-grid-template', template);
        
        const totalPerRow = leftCols + rightCols;
        const gapColIndex = leftCols + 1;
        
        wrappers.forEach((w, idx) => {
            const posInRow = idx % totalPerRow;
            const col = posInRow < leftCols ? posInRow + 1 : posInRow + 2;
            w.style.gridColumn = String(col === gapColIndex ? col + 1 : col);
        });
        return;
    }
    
    document.body.classList.remove('has-custom-drop');
    document.documentElement.style.removeProperty('--drop-grid-template');
    
    const panelWidth = dock === 'bottom'
    ? Math.min(560, window.innerWidth - 24)
    : Math.min(520, window.innerWidth - 28);
    const gapWidth = panelWidth + 36;
    const availableSideSpace = Math.max(260, window.innerWidth - gapWidth - 48);
    const colsPerSide = Math.max(1, Math.min(4, Math.floor(availableSideSpace / 2 / 145)));
    const totalPerRow = colsPerSide * 2;
    
    document.documentElement.style.setProperty('--split-cols', String(colsPerSide));
    document.documentElement.style.setProperty('--split-gap', `${gapWidth}px`);
    
    wrappers.forEach((w, idx) => {
        const posInRow = idx % totalPerRow;
        const col = posInRow < colsPerSide ? posInRow + 1 : posInRow + 2;
        w.style.gridColumn = String(col);
    });
}
function startDynamicTabPanel() {
    if (!DOM.panel) return;
    const snapPreview = document.createElement('div');
    snapPreview.className = 'dock-snap-preview';
    snapPreview.innerHTML = '<span class="dock-snap-label" id="dockSnapLabel">Hold 2s to Dock</span><div class="dock-snap-fill"></div>';
    document.body.appendChild(snapPreview);
    const snapLabelEl = snapPreview.querySelector('#dockSnapLabel');  
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let hoveredEdge = null;
    let edgeHoldTimer = null;
    let edgeLocked = false;
    
    function clearInlineGeometry() {
        DOM.panel.classList.remove('is-custom-pos', 'is-dragging');
        DOM.panel.style.left = '';
        DOM.panel.style.top = '';
        DOM.panel.style.right = '';
        DOM.panel.style.bottom = '';
        DOM.panel.style.width = '';
        DOM.panel.style.height = '';
    }
    
    function resetEdgeHold() {
        clearTimeout(edgeHoldTimer);
        edgeHoldTimer = null;
        hoveredEdge = null;
        edgeLocked = false;
        snapPreview.classList.remove('is-visible', 'is-charging', 'is-ready');
        delete snapPreview.dataset.edge;
    }
    
    function commitEdgeDock(edge) {
        isDragging = false;
        resetEdgeHold();
        clearInlineGeometry();
        DOM.panel.dataset.dock = edge;
        document.body.dataset.panelDock = edge;
        updateSplitGridLayout();
        playBeep(587.33, 0.08, 'triangle', 0.045);
        setTimeout(() => playBeep(880.00, 0.12, 'triangle', 0.045), 75);
    }
    
    function updateEdgeHover(clientX, clientY) {
        const threshold = 48;
        let detected = null;
        
        if (clientX <= threshold) detected = 'left';
        else if (clientX >= window.innerWidth - threshold) detected = 'right';
        else if (clientY >= window.innerHeight - threshold) detected = 'bottom';
        
        if (!detected) {
            if (hoveredEdge) resetEdgeHold();
            return;
        }
        
        if (detected === hoveredEdge) return;
        
        resetEdgeHold();
        hoveredEdge = detected;
        snapPreview.dataset.edge = detected;
        snapLabelEl.textContent = `Hold 2s to Snap ${detected.toUpperCase()}...`;
        snapPreview.classList.add('is-visible');
        void snapPreview.offsetWidth;
        snapPreview.classList.add('is-charging');
        
        playBeep(440, 0.05, 'sine', 0.03);
        
        edgeHoldTimer = setTimeout(() => {
            if (!isDragging || hoveredEdge !== detected) return;
            edgeLocked = true;
            snapPreview.classList.add('is-ready');
            snapLabelEl.textContent = `✓ Snapping ${detected.toUpperCase()}!`;
            commitEdgeDock(detected);
        }, 2000);
    }
    
    STATE.onClosePanel.push(() => {
        resetEdgeHold();
        clearInlineGeometry();
    });
    
    DOM.panel.addEventListener('pointerdown', (e) => {
        if (window.innerWidth <= 768) return;
        if (e.target.closest('button, a, input, textarea, img, .connection-pill, .cyn-voice-caption')) return;
        
        const rect = DOM.panel.getBoundingClientRect();
        const floatWidth = Math.min(520, window.innerWidth - 28);
        const floatHeight = Math.min(rect.height, window.innerHeight * 0.84);
        
        isDragging = true;
        offsetX = Math.min(floatWidth - 40, Math.max(40, e.clientX - rect.left));
        offsetY = Math.min(60, Math.max(16, e.clientY - rect.top));
        
        DOM.panel.dataset.dock = 'center';
        document.body.dataset.panelDock = 'center';
        DOM.panel.classList.add('is-dragging', 'is-custom-pos');
        DOM.panel.style.left = `${Math.max(8, Math.min(window.innerWidth - floatWidth - 8, e.clientX - offsetX))}px`;
        DOM.panel.style.top = `${Math.max(8, Math.min(window.innerHeight - floatHeight - 8, e.clientY - offsetY))}px`;
        DOM.panel.style.right = 'auto';
        DOM.panel.style.bottom = 'auto';
        DOM.panel.style.width = `${floatWidth}px`;
        DOM.panel.style.height = `${floatHeight}px`;
        
        DOM.panel.setPointerCapture(e.pointerId);
        updateSplitGridLayout();
    });
    
    DOM.panel.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const maxLeft = Math.max(8, window.innerWidth - DOM.panel.offsetWidth - 8);
        const maxTop = Math.max(8, window.innerHeight - DOM.panel.offsetHeight - 8);
        const nextLeft = Math.max(8, Math.min(maxLeft, e.clientX - offsetX));
        const nextTop = Math.max(8, Math.min(maxTop, e.clientY - offsetY));
        
        DOM.panel.style.left = `${nextLeft}px`;
        DOM.panel.style.top = `${nextTop}px`;
        
        updateEdgeHover(e.clientX, e.clientY);
    });
    
    function finishDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        DOM.panel.classList.remove('is-dragging');
        if (e && e.pointerId !== undefined && DOM.panel.hasPointerCapture(e.pointerId)) {
            DOM.panel.releasePointerCapture(e.pointerId);
        }
        
        if (edgeLocked && hoveredEdge) {
            commitEdgeDock(hoveredEdge);
            return;
        }
        
        resetEdgeHold();
        updateSplitGridLayout();
        playBeep(520, 0.05, 'sine', 0.03);
    }
    
    DOM.panel.addEventListener('pointerup', finishDrag);
    DOM.panel.addEventListener('pointercancel', finishDrag);
}
//#endregion 
