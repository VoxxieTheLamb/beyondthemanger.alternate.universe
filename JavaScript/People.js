//#region People stuff
function createPeople() {
    const MISSING_MEDIA = new Set([
        'recca.jpg', 'prince.jpg', 'jordan.jpg', 'roberto.jpg', 'caleb_i.jpg',
        'eldrige.jpg', 'aleb.jpg', 'ezekiel.jpg', 'ethan.jpg', 'izabelle.jpg',
        'johanna.jpg', 'carlaine.jpg', 'althea.jpg', 'alyana.jpg', 'shekinah.jpg',
        'sophie.jpg', 'giechelle.jpg', 'charlyn.jpg', 'janaya.jpg', 'rashinna.jpg',
        'trailer.mp4'
    ]);
    getCards().forEach(card => {
        const fullName = card.querySelector('.overlay-text').textContent.toLowerCase();
        
        for (const [lastName, officerTitle] of Object.entries(CONFIG.classOfficers)) {
            if (fullName.includes(lastName)) {
                card.dataset.role = officerTitle;
                card.dataset.filter = 'officer';
                break;
            }
        }
        
        for (const [lastName, info] of Object.entries(CONFIG.playRoster)) {
            if (fullName.includes(lastName)) {
                if (!card.dataset.role || card.dataset.role === 'Student') {
                    card.dataset.role = info.team;
                    if (info.displayTeam) card.dataset.displayRole = info.displayTeam;
                } else {
                    card.dataset.team = info.displayTeam || info.team;
                    card.dataset.teamCategory = info.team;
                }
                if (info.character) card.dataset.character = info.character;
                const currentBio = (card.dataset.bio || '').trim();
                if (!currentBio || currentBio.toLowerCase() === 'add here' || lastName === 'eulogio') {
                    card.dataset.bio = info.bio;
                }
                break;
            }
        }
        
        for (const [factionKey, lastNames] of Object.entries(CONFIG.factionMap)) {
            if (lastNames.some(ln => fullName.includes(ln))) {
                card.dataset.faction = factionKey;
                break;
            }
        }
    });
} // how does one CREATE a person
function bdayParty() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    getCards().forEach(card => {
        const rawBday = (card.dataset.birthday || '').trim().toLowerCase();
        if (!rawBday || rawBday === 'n/a') return;
        
        const parts = rawBday.split(/[\/\-\s,]+/).filter(Boolean);
        if (parts.length < 2) return;
        
        const monthPart = parts.at(0);
        const bdayDay = parseInt(parts.at(1), 10);
        let bdayMonth = !isNaN(parseInt(monthPart, 10))
        ? parseInt(monthPart, 10) - 1
        : monthNames.indexOf(monthPart);
        
        if (bdayMonth === -1) bdayMonth = shortMonths.indexOf(monthPart);
        
        if (bdayMonth === currentMonth && bdayDay === currentDay) {
            card.classList.add('is-birthday');
            if (card.parentElement && card.parentElement.classList.contains('PersonWrapper')) {
                card.parentElement.classList.add('is-birthday');
            }
        }
    });
} // custom bday stuff
function startPortraitBadges() {
    const teacherCard = document.querySelector('.PeoplePics[data-role="Teacher"]') ||
    getCards().find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('eulogio'));
    
    if (teacherCard) {
        teacherCard.dataset.role = 'Teacher';
        if (teacherCard.parentElement) {
            teacherCard.parentElement.dataset.hasSun = 'true';
            const sirObserver = new MutationObserver(() => {
                teacherCard.parentElement.classList.toggle('sir-sun-active', teacherCard.classList.contains('active'));
            });
            sirObserver.observe(teacherCard, { attributes: true, attributeFilter: ['class'] });
        }
    }
    
    getCards().forEach(card => {
        const wrapper = card.parentElement;
        if (!wrapper) return;
        
        if (card.dataset.filter === 'officer') {
            const pip = document.createElement('span');
            pip.className = 'portrait-role-pip pip-officer';
            pip.textContent = '👑';
            pip.title = card.dataset.role;
            wrapper.appendChild(pip);
        }
        if (card.dataset.character) {
            const pip = document.createElement('span');
            pip.className = 'portrait-role-pip pip-actor';
            pip.textContent = '🎭';
            pip.title = card.dataset.character;
            wrapper.appendChild(pip);
        }
        const crewRole = card.dataset.team || (card.dataset.filter !== 'officer' && card.dataset.role !== 'Student' && card.dataset.role !== 'Teacher' ? (card.dataset.displayRole || card.dataset.role) : '');
        if (crewRole) {
            const pip = document.createElement('span');
            pip.className = 'portrait-role-pip pip-crew';
            pip.textContent = '🎥';
            pip.title = crewRole;
            wrapper.appendChild(pip);
        }
        if (card.dataset.role === 'Teacher') {
            const pip = document.createElement('span');
            pip.className = 'portrait-role-pip';
            pip.style.cssText = 'top:2px;left:2px;border:1.5px solid #e11d48;';
            pip.textContent = '🍎';
            pip.title = 'Class Adviser';
            wrapper.appendChild(pip);
        }
    });
} // the little pips and stuff that look fun
function startBadgeLegend() {
    if (!DOM.container) return;
    const legend = document.createElement('div');
    legend.className = 'badge-legend-strip';
    legend.innerHTML = `
                <span class="legend-item"> Class Adviser</span>
                <span class="legend-item"> Class Officer</span>
                <span class="legend-item"> Speaking Cast</span>
                <span class="legend-item"> Production Crew</span>
                <span class="legend-item"> Birthday Today</span>
            `;
    DOM.container.insertAdjacentElement('beforebegin', legend);
} // it's a legend gng
function alphaBetaThing(){
    if (!DOM.container) return;
    const bar = document.createElement('div');
    bar.className = 'alpha-jump-bar';
    bar.innerHTML = `
                <span class="alpha-jump-label">Quick Jump:</span>
                <button type="button" class="alpha-pill" data-start="A" data-end="G">A – G</button>
                <button type="button" class="alpha-pill" data-start="H" data-end="P">H – P</button>
                <button type="button" class="alpha-pill" data-start="Q" data-end="Z">Q – Z</button>
            `;
    DOM.container.insertAdjacentElement('beforebegin', bar);
    
    bar.querySelectorAll('.alpha-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const startChar = pill.dataset.start;
            const endChar = pill.dataset.end;
            const target = getVisibleCards().find(card => {
                const firstLetter = card.querySelector('.overlay-text').textContent.trim().charAt(0).toUpperCase();
                return firstLetter >= startChar && firstLetter <= endChar;
            });
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                playBeep(560, 0.05, 'sine', 0.03);
            }
        });
    });
} // alphabet search (not done)
function startImageFallback() {
    function getInitials(rawName) {
        const parts = rawName.replace(/,/g, '').split(/\s+/).filter(Boolean);
        return parts.length >= 2
        ? (parts.at(0).charAt(0) + parts.at(1).charAt(0)).toUpperCase()
        : rawName.slice(0, 2).toUpperCase();
    } // gets the initials of first and last (last name priority)
    
    function convertBrokenImg(img) {
        if (!img || img.tagName !== 'IMG' || !img.isConnected) return;
        const card = img.closest('.PeoplePics');
        const isDrawer = img.closest('#panelImageContainer');
        if (img && img.dataset.src) {
            const rawName = card.querySelector('.overlay-text').textContent.trim();
            const parts = rawName.split(' ');
            const initials = ((parts.at(0)?.[0] || '') + (parts.at(-1)?.[0] || '')).toUpperCase();
            card.classList.add('is-missing-photo');
            img.style.display = 'none';
            const mono = document.createElement('div');
            mono.className = 'monogram-avatar';
            mono.textContent = initials;
            card.appendChild(mono);
        } else if (isDrawer) {
            const rawName = img.alt || 'AF';
            const mono = document.createElement('div');
            mono.className = `${img.className} monogram-avatar`;
            mono.style.cssText = 'width:100%;height:100%;font-size:58px;';
            mono.textContent = getInitials(rawName);
            img.replaceWith(mono);
        } else {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'padding:24px 20px;border-radius:16px;background:rgba(5,10,35,0.85);border:1px dashed rgba(56,189,248,0.5);color:#93c5fd;font-size:14px;font-weight:bold;letter-spacing:0.5px;text-align:center;max-width:460px;margin:12px auto;';
            placeholder.textContent = ' Official Teaser Trailer & Poster Coming Nov 26, 2026';
            img.replaceWith(placeholder);
        }
    } // converts it to funny thing
    
    document.addEventListener('error', (e) => {
        if (e.target && e.target.tagName === 'IMG') convertBrokenImg(e.target);
    }, true); // returns error if happen
    
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth === 0) convertBrokenImg(img);
    });
    
    const videoBox = document.querySelector('.video');
    const videoEl = videoBox ? videoBox.querySelector('video') : null;
    if (videoBox && videoEl) {
        function showVideoPlaceholder() {
            if (videoBox.querySelector('.video-coming-soon')) return;
            videoEl.style.display = 'none';
            videoBox.style.borderColor = 'rgba(56, 189, 248, 0.5)';
            videoBox.style.borderRadius = '16px';
            videoBox.style.background = 'rgba(5, 10, 35, 0.85)';
            
            const card = document.createElement('div');
            card.className = 'video-coming-soon';
            card.style.cssText = 'padding:44px 20px;text-align:center;color:#e0f2fe;';
            card.innerHTML = [
                '<div style="font-size:32px;margin-bottom:8px;"></div>',
                '<div style="font-size:15px;font-weight:bold;color:#38bdf8;letter-spacing:0.4px;">Official Teaser Trailer !  Nov 26, 2026</div>',
                '<div style="font-size:12.5px;color:rgba(255,255,255,0.65);margin-top:6px;">Filming &amp; Editing in Progress • Grade 7 – Psalms</div>'
            ].join('');
            videoBox.appendChild(card);
        }
        
        const sourceEl = videoEl.querySelector('source');
        if (sourceEl) sourceEl.addEventListener('error', showVideoPlaceholder, { once: true });
        videoEl.addEventListener('error', showVideoPlaceholder, { once: true });
        setTimeout(() => {
            if (videoEl.networkState === 3 || videoEl.readyState === 0) showVideoPlaceholder();
        }, 400);
    } // video converter
} // just in case it's not ready
//#endregion 
