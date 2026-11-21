//#region Quirks
        /*
        The Names SHOULD be self explanatory, so just read it, should be easy
        from there.
        */
        function startWeatherWidget() {
            const eventBar = document.querySelector('.event-details-bar');
            if (!eventBar) return;
            const weatherCard = document.createElement('div');
            weatherCard.className = 'event-detail-item weather-flip-card';
            weatherCard.title = 'Click to switch between Antipolo & Dubai';
            weatherCard.innerHTML = [
                '<span class="detail-icon" id="weatherIcon"></span>',
                '<div>',
                '<span class="detail-label" id="weatherLabel">Antipolo Live Weather ⇄</span>',
                '<span class="detail-value" id="weatherValue">Checking local sky...</span>',
                '</div>'
            ].join('');
            eventBar.appendChild(weatherCard);
            const iconEl = weatherCard.querySelector('#weatherIcon');
            const labelEl = weatherCard.querySelector('#weatherLabel');
            const valueEl = weatherCard.querySelector('#weatherValue');
            const cache = { Antipolo: null, Dubai: null };
            let activeCity = 'Antipolo';
            function getCityHour(city) {
                const tz = city === 'Dubai' ? 'Asia/Dubai' : 'Asia/Manila';
                const hourStr = new Intl.DateTimeFormat('en-US', {
                    timeZone: tz,
                    hour: 'numeric',
                    hour12: false
                }).format(new Date());
                return parseInt(hourStr, 10) % 24;
            }
            function getCityClock(city) {
                const tz = city === 'Dubai' ? 'Asia/Dubai' : 'Asia/Manila';
                return new Intl.DateTimeFormat('en-US', {
                    timeZone: tz,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).format(new Date());
            }
            function pickWeatherIcon(desc, city) {
                const lower = (desc || '').toLowerCase();
                const hour = getCityHour(city);
                const isNight = hour >= 18 || hour < 6;

                if (lower.includes('thunder')) return '';
                if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) return '';
                if (lower.includes('fog') || lower.includes('mist') || lower.includes('haze')) return '';
                if (lower.includes('overcast') || lower.includes('cloudy')) return '';
                if (lower.includes('partly')) return isNight ? '' : '';
                return isNight ? '' : '';
            }
            function decodeWmoCode(code) {
                if (code === 0) return 'Clear Sky';
                if (code <= 3) return 'Partly Cloudy';
                if (code <= 48) return 'Foggy';
                if (code <= 67) return 'Rainy';
                if (code <= 77) return 'Snow';
                if (code <= 82) return 'Rain Showers';
                return 'Thunderstorm';
            }
            function renderCity(city) {
                const info = cache[city];
                if (!info) {
                    iconEl.textContent = city === 'Dubai' ? '' : '';
                    labelEl.textContent = `${city} Live Weather ⇄`;
                    valueEl.textContent = 'Checking sky...';
                    return;
                }
                if (info.fallback) {
                    iconEl.textContent = city === 'Dubai' ? '' : '';
                    labelEl.textContent = city === 'Dubai' ? 'Dubai (Burj Khalifa) ⇄' : 'Venue Status ⇄';
                    valueEl.textContent = city === 'Dubai'
                        ? `${getCityClock('Dubai')} • Clear Desert Sky`
                        : 'Covered Court (Rain or Shine)';
                    return;
                }
                iconEl.textContent = pickWeatherIcon(info.desc, city);
                labelEl.textContent = `${city} (${getCityClock(city)}) ⇄`;
                valueEl.textContent = `${info.temp}°C • ${info.desc}`;
            }

            function fetchCityWeather(city) {
                const coords = city === 'Dubai'
                    ? 'latitude=25.1972&longitude=55.2744'
                    : 'latitude=14.5864&longitude=121.1753';

                const domain = ['api', 'open-meteo', 'com'].join('.');
                const url = 'https:' + '//' + domain + '/v1/forecast?' + coords + '&current_weather=true';

                fetch(url)
                    .then(res => {
                        if (!res.ok) throw new Error('HTTP ' + res.status);
                        return res.json();
                    })
                    .then(data => {
                        if (!data.current_weather) throw new Error('Missing current_weather');
                        cache[city] = {
                            temp: Math.round(data.current_weather.temperature),
                            desc: decodeWmoCode(data.current_weather.weathercode),
                            fallback: false
                        };
                        if (activeCity === city) renderCity(city);
                    })
                    .catch(err => {
                        console.warn('Weather fallback:', err);
                        cache[city] = { fallback: true };
                        if (activeCity === city) renderCity(city);
                    });
            }

            weatherCard.addEventListener('click', () => {
                activeCity = activeCity === 'Antipolo' ? 'Dubai' : 'Antipolo';
                weatherCard.classList.remove('is-flipping');
                void weatherCard.offsetWidth;
                weatherCard.classList.add('is-flipping');
                playBeep(activeCity === 'Dubai' ? 660 : 520, 0.06, 'sine', 0.035);

                if (!cache[activeCity]) {
                    renderCity(activeCity);
                    fetchCityWeather(activeCity);
                } else {
                    renderCity(activeCity);
                }
            });

            fetchCityWeather('Antipolo');
            fetchCityWeather('Dubai');
        }
        function startTimeOfDayTheme() {
            function applySkyPhase() {
                const hour = new Date().getHours();
                document.body.classList.remove('sky-morning', 'sky-afternoon', 'sky-sunset', 'sky-night');

                if (hour >= 6 && hour < 12) document.body.classList.add('sky-morning');
                else if (hour >= 12 && hour < 17) document.body.classList.add('sky-afternoon');
                else if (hour >= 17 && hour < 19) document.body.classList.add('sky-sunset');
                else document.body.classList.add('sky-night');
            }

            applySkyPhase();
            setInterval(applySkyPhase, 60000);
            if (typeof window.wakeStarCanvas === 'function') {
                window.wakeStarCanvas();
            }
        }
        function startCalendarExport() {
            const eventBar = document.querySelector('.event-details-bar');
            if (!eventBar) return;

            const btnWrap = document.createElement('div');
            btnWrap.style.textAlign = 'center';

            const calBtn = document.createElement('button');
            calBtn.type = 'button';
            calBtn.className = 'calendar-save-btn';
            calBtn.textContent = ' Save Dec 17 Showtime to Calendar';
            btnWrap.appendChild(calBtn);
            eventBar.insertAdjacentElement('afterend', btnWrap);

            calBtn.addEventListener('click', () => {
                const icsLines = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//AFCS Grade 7 Psalms//Paskong AFCS 2026//EN',
                    'BEGIN:VEVENT',
                    'UID:beyond-the-manger-afcs-2026@afcs.edu.ph',
                    'DTSTAMP:20261114T110000Z',
                    'DTSTART:20261215T100000Z',
                    'DTEND:20261215T110000Z',
                    'SUMMARY:Beyond The Manger: When Faith Becomes the Key (Paskong AFCS 2026)',
                    'DESCRIPTION:Grade 7 - Psalms Stage Play Presentation. Core Theme: We rise because Jesus Christ is our Cornerstone.',
                    'LOCATION:AFCS Stage in the Covered Court, Antipolo Faith Christian School Inc.',
                    'END:VEVENT',
                    'END:VCALENDAR'
                ].join('\r\n');

                const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Beyond_The_Manger_Paskong_AFCS_2026.ics';
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);

                calBtn.textContent = ' Calendar Invite Downloaded!';
                setTimeout(() => {
                    calBtn.textContent = ' Save Dec 17 Showtime to Calendar';
                }, 2500);
            });
        }
        function startVenueFloorPlan() {
            const synopsisCard = document.querySelector('.synopsis-card');
            if (!synopsisCard) return;

            const existingCalBtn = synopsisCard.querySelector('.calendar-save-btn');
            const targetWrap = existingCalBtn ? existingCalBtn.parentElement : synopsisCard;

            const mapBtn = document.createElement('button');
            mapBtn.type = 'button';
            mapBtn.className = 'calendar-save-btn floorplan-toggle-btn';
            mapBtn.style.marginLeft = '8px';
            mapBtn.textContent = ' AFCS Venue Floor Plan';
            targetWrap.appendChild(mapBtn);

            const drawer = document.createElement('div');
            drawer.className = 'venue-floorplan-drawer';
            drawer.innerHTML = [
                '<div class="fp-header">',
                '<span class="fp-title">PASKONG AFCS 2026 • COVERED COURT LAYOUT</span>',
                '<button type="button" class="fp-reader-btn" id="fpReaderToggle"> Reader View</button>',
                '</div>',
                '<div class="fp-mobile-tip"> Tip: Tap <strong>Reader View</strong> (or your browser\'s Reading Mode) for a full-screen layout.</div>',
                '<div class="fp-hint" id="fpZoneInfo" style="margin-bottom:10px;">Tap any zone for venue info</div>',
                '<div class="fp-blueprint"><div class="fp-main-area"><div class="fp-top-strip">',
                '<div class="fp-zone fp-room" data-info="Gate Pass Room & Clinic !  Upper-left check-in & medical station.">Gate Pass / Clinic</div>',
                '<div class="fp-zone fp-room" data-info="Restrooms & Janitor Room !  Girls\' CR, Boys\' CR, and Janitor Room.">CRs &amp; Janitor</div>',
                '<div class="fp-zone fp-room fp-exit" data-info="EXIT & Black Panther Hallway !  Leads to Students Waiting Area.">EXIT / Black Panther</div>',
                '<div class="fp-zone fp-room fp-waiting" data-info="Students Waiting Area !  Performers hold here before going backstage.">Students Waiting Area</div>',
                '<div class="fp-zone fp-room" data-info="Conference Area !  Faculty & coordinator briefing zone.">Conference Area</div></div>',
                '<div class="fp-court-grid"><div class="fp-zone fp-seating" data-info="Left Audience Seating !  Angled seating sections near Entrance (Left 1)."> Left Seating</div>',
                '<div class="fp-center-column"><div class="fp-zone fp-multimedia" data-info="Multimedia Room !  Directly behind the main stage backdrop."> Multimedia Room</div>',
                '<div class="fp-zone fp-stage" data-info="Main Stage (Zones 1–10) !  Where Grade 7 – Psalms performs Beyond The Manger!"><span class="fp-stage-title"> STAGE</span>',
                '<div class="fp-stage-grid"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span></div></div>',
                '<div class="fp-zone fp-seating fp-center-seating" data-info="Center Audience Seating !  Front VIP & main audience rows facing the stage."> Center Audience Seating</div></div>',
                '<div class="fp-zone fp-seating" data-info="Right Audience Seating !  Seating sections along the right walkway."> Right Seating</div></div>',
                '<div class="fp-bottom-strip"><div class="fp-zone fp-entrance" data-info="Entrances (Left 1) !  Main guest & audience entrance at the bottom-left."> Entrance (Left 1)</div>',
                '<div class="fp-zone fp-tech" data-info="Tech Booth (Left) !  Audio, mics, and stage cue control."> Tech Booth</div>',
                '<div class="fp-zone fp-tech" data-info="Tech Booth (Center) !  Lighting & projection control."> Tech Booth</div></div></div>',
                '<div class="fp-right-sidebar"><div class="fp-zone fp-room" data-info="Knights Credit Room !  Upper-right wing.">Knights Credit</div>',
                '<div class="fp-zone fp-room" data-info="Smile Room !  Cast & student prep room.">Smile Room</div>',
                '<div class="fp-zone fp-room" data-info="Pamper Room !  Costume & makeup touch-ups.">Pamper Room</div>',
                '<div class="fp-zone fp-room fp-plant" data-info="Tom\'s Plant !  Courtyard garden & numbered stations 1–4."> Tom\'s Plant</div>',
                '<div class="fp-zone fp-room" data-info="PDT Room !  Right-wing holding room.">PDT Room</div>',
                '<div class="fp-zone fp-room" data-info="Daisy Room !  Right-wing holding room.">Daisy Room</div>',
                '<div class="fp-zone fp-room fp-chapel" data-info="AFCS Chapel !  Located at the bottom-right corner."> CHAPEL</div></div></div>'
            ].join('');
            targetWrap.insertAdjacentElement('afterend', drawer);

            const infoEl = drawer.querySelector('#fpZoneInfo');
            const readerBtn = drawer.querySelector('#fpReaderToggle');

            function setReaderMode(enable) {
                drawer.classList.toggle('is-reader-view', enable);
                readerBtn.textContent = enable ? '✕ Exit Reader View' : ' Reader View';
                document.body.style.overflow = enable ? 'hidden' : '';
                if (enable) {
                    document.body.appendChild(drawer);
                } else {
                    targetWrap.insertAdjacentElement('afterend', drawer);
                }
            }

            readerBtn.addEventListener('click', () => {
                const nextState = !drawer.classList.contains('is-reader-view');
                setReaderMode(nextState);
                playBeep(nextState ? 660 : 480, 0.06, 'sine', 0.035);
            });

            mapBtn.addEventListener('click', () => {
                const isOpen = drawer.classList.toggle('is-open');
                if (!isOpen && drawer.classList.contains('is-reader-view')) {
                    setReaderMode(false);
                }
                mapBtn.textContent = isOpen ? ' Hide Venue Floor Plan' : ' AFCS Venue Floor Plan';
                playBeep(isOpen ? 620 : 460, 0.06, 'sine', 0.035);
            });

            drawer.querySelectorAll('.fp-zone').forEach(zone => {
                zone.addEventListener('click', () => {
                    drawer.querySelectorAll('.fp-zone').forEach(z => z.classList.remove('is-selected'));
                    zone.classList.add('is-selected');
                    infoEl.textContent = zone.dataset.info;
                    playBeep(580, 0.045, 'triangle', 0.03);
                });
            });
        }
        function startVenueFacts() {
            const settingStat = Array.from(document.querySelectorAll('.story-stat')).find(s =>
                (s.querySelector('.stat-label')?.textContent || '').toLowerCase().includes('setting')
            );
            if (!settingStat) return;

            const valEl = settingStat.querySelector('.stat-value');
            const labelEl = settingStat.querySelector('.stat-label');
            if (!valEl || !labelEl) return;

            let idx = 0;
            settingStat.classList.add('burj-fact-card');
            settingStat.title = 'Click for Burj Khalifa research facts';
            labelEl.textContent = 'Setting (Click for Facts) ↻';

            settingStat.addEventListener('click', () => {
                idx = (idx + 1) % CONFIG.venueFacts.length;
                valEl.classList.remove('fact-pop');
                void valEl.offsetWidth;
                valEl.textContent = CONFIG.venueFacts.at(idx);
                valEl.classList.add('fact-pop');
                playBeep(540 + idx * 35, 0.05, 'sine', 0.03);
            });
        }
        function startTimeline() {
            const section = document.querySelector('.timeline-section');
            const fillEl = document.getElementById('timelineFill');
            const nodesEl = document.getElementById('timelineNodes');
            if (!fillEl || !nodesEl) return;

            const startMs = new Date('2026-11-03T00:00:00').getTime();
            const endMs = new Date('2026-12-17T18:00:00').getTime();
            const nowMs = Date.now();

            const rawPercent = ((nowMs - startMs) / (endMs - startMs)) * 100;
            fillEl.style.width = `${Math.max(0, Math.min(100, rawPercent))}%`;

            let activeIndex = 0;
            CONFIG.milestones.forEach((m, idx) => {
                if (nowMs >= new Date(`${m.date}T00:00:00`).getTime()) activeIndex = idx;
            });

            let detailBox = null;
            if (section) {
                detailBox = document.createElement('div');
                detailBox.className = 'timeline-detail-box';
                section.appendChild(detailBox);
            }
            let activeNodeIdx = -1;

            CONFIG.milestones.forEach((m, idx) => {
                const mMs = new Date(`${m.date}T00:00:00`).getTime();
                const leftPct = Math.max(0, Math.min(100, ((mMs - startMs) / (endMs - startMs)) * 100));

                const node = document.createElement('div');
                node.className = `tl-node pos-${m.pos}`;
                node.style.left = `${leftPct}%`;

                if (idx < activeIndex) node.classList.add('is-past');
                else if ((idx === activeIndex && nowMs < endMs) || (nowMs >= endMs && idx === CONFIG.milestones.length - 1)) {
                    node.classList.add('is-now');
                }

                const dateLabel = node.classList.contains('is-now') ? `NOW (${m.shortDate})` : m.shortDate;
                node.innerHTML = `<div class="tl-label"><span class="tl-date">${dateLabel}</span><span>${m.title}</span></div>`;

                if (detailBox) {
                    node.addEventListener('click', () => {
                        if (activeNodeIdx === idx) {
                            detailBox.classList.remove('visible');
                            activeNodeIdx = -1;
                            return;
                        }
                        activeNodeIdx = idx;
                        detailBox.textContent = m.detail;
                        detailBox.classList.add('visible');
                        playBeep(640, 0.06, 'sine', 0.035);
                    });
                }

                nodesEl.appendChild(node);
            });
        }
        function startCountdown() {
            const wrapper = document.getElementById('showtimeCountdown');
            const daysEl = document.getElementById('cd-days');
            const hoursEl = document.getElementById('cd-hours');
            const minsEl = document.getElementById('cd-mins');
            const secsEl = document.getElementById('cd-secs');
            if (!wrapper || !daysEl) return;

            const targetDate = new Date('2026-12-15T18:00:00').getTime();

            function updateTimer() {
                const diff = targetDate - Date.now();
                if (diff <= 0) {
                    wrapper.classList.remove('is-urgent');
                    wrapper.innerHTML = `<div class="countdown-live-banner"> IT'S SHOWTIME! !  PASKONG AFCS 2026 </div>`;
                    return;
                }
                if (diff < 86400000) wrapper.classList.add('is-urgent');

                daysEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
                hoursEl.textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
                minsEl.textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
                secsEl.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
            }

            updateTimer();
            setInterval(updateTimer, 1000);
        }
        function startScriptureCard() {
            const synopsisCard = document.querySelector('.synopsis-card');
            const themeBanner = synopsisCard ? synopsisCard.querySelector('.theme-banner') : null;
            if (!synopsisCard || !CONFIG.scriptures || !CONFIG.scriptures.length) return;

            let idx = Math.floor(Math.random() * CONFIG.scriptures.length);
            const box = document.createElement('div');
            box.className = 'scripture-card';
            box.innerHTML = [
                '<div class="scripture-header">',
                '<span id="scriptureTag"> Our Cornerstone</span>',
                '<span id="scriptureCounter">1 / ' + CONFIG.scriptures.length + '</span>',
                '</div>',
                '<p class="scripture-text" id="scriptureText"></p>',
                '<span class="scripture-ref" id="scriptureRef"></span>',
                '<div class="scripture-actions">',
                '<button type="button" class="scripture-btn" id="nextScriptureBtn"> Next Verse ↻</button>',
                '<button type="button" class="scripture-btn" id="copyScriptureBtn"> Copy Verse</button>',
                '</div>'
            ].join('');

            if (themeBanner) themeBanner.insertAdjacentElement('afterend', box);
            else synopsisCard.appendChild(box);

            const tagEl = box.querySelector('#scriptureTag');
            const counterEl = box.querySelector('#scriptureCounter');
            const textEl = box.querySelector('#scriptureText');
            const refEl = box.querySelector('#scriptureRef');
            const nextBtn = box.querySelector('#nextScriptureBtn');
            const copyBtn = box.querySelector('#copyScriptureBtn');

            function renderVerse() {
                const item = CONFIG.scriptures.at(idx);
                tagEl.textContent = ' ' + item.tag;
                counterEl.textContent = (idx + 1) + ' / ' + CONFIG.scriptures.length;
                textEl.textContent = item.text;
                refEl.textContent = '!  ' + item.ref;
            }

            nextBtn.addEventListener('click', () => {
                idx = (idx + 1) % CONFIG.scriptures.length;
                textEl.classList.remove('fact-pop');
                void textEl.offsetWidth;
                renderVerse();
                textEl.classList.add('fact-pop');
                playBeep(587.33, 0.06, 'sine', 0.035);
            });

            copyBtn.addEventListener('click', () => {
                const item = CONFIG.scriptures.at(idx);
                const fullQuote = item.text + ' !  ' + item.ref + ' (Beyond The Manger • Paskong AFCS 2026)';
                navigator.clipboard.writeText(fullQuote).then(() => {
                    copyBtn.textContent = ' Verse Copied!';
                    playBeep(783.99, 0.08, 'sine', 0.035);
                    setTimeout(() => { copyBtn.textContent = ' Copy Verse'; }, 2000);
                });
            });

            renderVerse();
        }
    //#endregion
