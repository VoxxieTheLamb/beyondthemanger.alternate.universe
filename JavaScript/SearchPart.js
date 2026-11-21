//#region Searching for a world that doesn't exist...
        function filterCards() {
            const allCards = getCards();
            const query = DOM.searchInput ? DOM.searchInput.value.toLowerCase().trim() : '';
            let visibleCount = 0;

            if (DOM.clearBtn) {
                DOM.clearBtn.style.display = query.length > 0 ? 'block' : 'none';
            }

            allCards.forEach(card => {
                const name = card.querySelector('.overlay-text').textContent.toLowerCase();
                const category = (card.dataset.filter || '').toLowerCase();
                const baseRole = (card.dataset.role || 'Student').toLowerCase();
                const teamRole = (card.dataset.team || '').toLowerCase();
                const teamCategory = (card.dataset.teamCategory || '').toLowerCase();
                const displayRole = (card.dataset.displayRole || baseRole).toLowerCase();
                const character = (card.dataset.character || '').toLowerCase();

                const matchesSearch = name.includes(query) || displayRole.includes(query) || teamRole.includes(query) || character.includes(query);
                const filterTarget = STATE.activeRole ? STATE.activeRole.toLowerCase() : 'all';
                const matchesRole = filterTarget === 'all' ||
                    (filterTarget === 'actor' && character !== '') ||
                    category === filterTarget ||
                    baseRole === filterTarget ||
                    teamCategory === filterTarget ||
                    teamRole.includes(filterTarget) ||
                    displayRole.includes(filterTarget);

                const matchesFaction = !STATE.activeFaction || card.dataset.faction === STATE.activeFaction;

                if (matchesSearch && matchesRole && matchesFaction) {
                    card.classList.remove('is-filtered-out');
                    visibleCount++;
                } else {
                    card.classList.add('is-filtered-out');
                }
            });

            if (DOM.matchCountEl) {
                const teacherVisible = allCards.some(c => c.dataset.role === 'Teacher' && !c.classList.contains('is-filtered-out'));
                const guestVisible = allCards.some(c => c.dataset.role === 'Guest Legend' && !c.classList.contains('is-filtered-out'));
                const studentTotal = allCards.filter(c => c.dataset.role !== 'Teacher' && c.dataset.role !== 'Guest Legend').length;
                const studentVisible = visibleCount - (teacherVisible ? 1 : 0) - (guestVisible ? 1 : 0);

                if (visibleCount === 0) DOM.matchCountEl.textContent = `No members found out of ${studentTotal} students`;
                else if (teacherVisible && studentVisible === studentTotal) DOM.matchCountEl.textContent = `Showing ${studentTotal} students & Class Adviser`;
                else if (teacherVisible) DOM.matchCountEl.textContent = `Showing ${studentVisible} out of ${studentTotal} students + Class Adviser`;
                else DOM.matchCountEl.textContent = `Showing ${studentVisible} out of ${studentTotal} students`;
            }

            STATE.onFilterCards.forEach(fn => fn());
        } // filters it in a lot of ways
        function searchThings() {
            if (DOM.searchInput) {
                DOM.searchInput.addEventListener('input', () => {
                    filterCards();
                    const val = DOM.searchInput.value.toLowerCase().trim();
                    if (!val) return;
                    for (const hook of STATE.onSearchInput) {
                        if (hook(val) === true) break;
                    }
                });
            }

            if (DOM.clearBtn && DOM.searchInput) {
                DOM.clearBtn.addEventListener('click', () => {
                    DOM.searchInput.value = '';
                    filterCards();
                    DOM.searchInput.focus();
                });
            }

            DOM.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    STATE.activeRole = btn.dataset.filter;

                    if (STATE.activeRole === 'all') {
                        STATE.activeFaction = null;
                        DOM.factionBtns.forEach(b => b.classList.remove('active'));
                    }
                    filterCards();
                });
            });

            DOM.factionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const selected = btn.dataset.faction;
                    if (STATE.activeFaction === selected) {
                        STATE.activeFaction = null;
                        btn.classList.remove('active');
                    } else {
                        DOM.factionBtns.forEach(b => b.classList.remove('active'));
                        STATE.activeFaction = selected;
                        btn.classList.add('active');
                    }
                    filterCards();
                });
            });

            if (DOM.container) {
                const resetWrap = document.createElement('div');
                resetWrap.style.textAlign = 'center';

                const resetPill = document.createElement('button');
                resetPill.type = 'button';
                resetPill.className = 'active-reset-pill';
                resetPill.textContent = '↺ Clear All Active Filters';
                resetWrap.appendChild(resetPill);
                DOM.container.insertAdjacentElement('beforebegin', resetWrap);

                const emptyCard = document.createElement('div');
                emptyCard.className = 'empty-roster-card';
                emptyCard.innerHTML = `<p>No classmates match that exact combination of filters.</p><button type="button" class="reset-filters-btn">↺ Show Everyone</button>`;
                DOM.container.appendChild(emptyCard);

                function resetAllFilters() {
                    if (DOM.searchInput) DOM.searchInput.value = '';
                    const everyoneBtn = document.querySelector('.filter-btn.everyone');
                    if (everyoneBtn) everyoneBtn.click();
                }

                resetPill.addEventListener('click', resetAllFilters);
                emptyCard.querySelector('.reset-filters-btn').addEventListener('click', resetAllFilters);

                STATE.onFilterCards.push(() => {
                    const hasSearch = DOM.searchInput && DOM.searchInput.value.trim().length > 0;
                    const hasTeam = STATE.activeRole && STATE.activeRole !== 'all';
                    const hasFaction = Boolean(STATE.activeFaction);
                    const hasMatches = getVisibleCards().length > 0;

                    resetPill.classList.toggle('visible', (hasSearch || hasTeam || hasFaction) && hasMatches);
                    emptyCard.classList.toggle('visible', !hasMatches);
                });
            }

            const spotlightBtn = document.getElementById('spotlightBtn');
            if (spotlightBtn) {
                spotlightBtn.addEventListener('click', () => {
                    const visible = getVisibleCards();
                    if (!visible.length) return;

                    let ticks = 0;
                    const spinInterval = setInterval(() => {
                        getCards().forEach(c => c.classList.remove('active'));
                        const randomCard = visible.at(Math.floor(Math.random() * visible.length));
                        randomCard.classList.add('active');
                        ticks++;

                        if (ticks >= 12) {
                            clearInterval(spinInterval);
                            openCard(randomCard);
                            randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 70);
                });
            }
        }
//#endregion
