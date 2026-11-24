function startCharacterInteractions() {
    let lastTapCard = null;
    let lastTapTime = 0;
    let tapStreak = 0;
    
    document.addEventListener('click', (e) => {
        if (e._isTripleTap) return;
        
        if (e.detail >= 3) {
            tapStreak = 0;
            lastTapCard = null;
            return;
        }
        
        const card = e.target.closest('.PeoplePics');
        if (!card) {
            tapStreak = 0;
            lastTapCard = null;
            return;
        }
        
        const now = Date.now();
        if (card === lastTapCard && (now - lastTapTime) < 50) {
            tapStreak++;
        } else {
            tapStreak = 1;
            lastTapCard = card;
        }
        lastTapTime = now;
        
        if (tapStreak === 3) {
            tapStreak = 0;
            const synthEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                detail: 3,
                clientX: e.clientX,
                clientY: e.clientY
            });
            synthEvent._isTripleTap = true;
            card.dispatchEvent(synthEvent);
        }
    }, true);
    const cards = getCards();
    if (!cards.length) return;
    
    function spawnBadge(card, text, className, duration = 900) {
        const rect = card.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = className;
        el.textContent = text;
        
        const rawCenterX = rect.left + rect.width / 2;
        const halfMaxWidth = Math.min(140, (window.innerWidth - 24) / 2);
        const safeX = Math.max(halfMaxWidth + 12, Math.min(window.innerWidth - halfMaxWidth - 12, rawCenterX));
        
        el.style.left = `${safeX}px`;
        el.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), duration);
    }
    window.spawnBadge = spawnBadge;
    
    
    const bobbySecCard = cards.find(c => {
        const txt = c.querySelector('.overlay-text').textContent.toLowerCase();
        return txt.includes('operaña') || txt.includes('operana');
    });
    const vollowSecCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('sevilla'));
    
    function triggerWalkieTalkie(senderCard, receiverCard, lines) {
        if (!senderCard) return;
        const line = lines[Math.floor(Math.random() * lines.length)];
        spawnBadge(senderCard, line, 'quirk-radio-bubble', 1300);
        
        playBeep(1380, 0.045, 'sine', 0.03);
        setTimeout(() => playBeep(1760, 0.06, 'sine', 0.03), 55);
        
        if (receiverCard && !receiverCard.classList.contains('is-filtered-out')) {
            receiverCard.classList.add('quirk-radio-ping');
            setTimeout(() => receiverCard.classList.remove('quirk-radio-ping'), 900);
        }
    }
    
    if (bobbySecCard) {
        bobbySecCard.addEventListener('click', () => {
            triggerWalkieTalkie(bobbySecCard, vollowSecCard, [
                '*ksssh* Bobby to Vollow, all clear!',
                '*ksssh* Vollow, do you copy?',
                '*ksssh* Have the Perimeters been secured, Vollow?',
                '*ksssh* Vollow, are the Artists all safe?',
                '*ksssh* Tech cues ready, over!',
                '*ksssh* Watch the VIP doors, Vollow!'
            ]);
        });
    }
    
    if (vollowSecCard) {
        const ethanImg = vollowSecCard.querySelector('img');
        const voxSrc = 'otherpics/Vox.jpg';
        const alastorSrc = 'otherpics/Alastor.jpg';
        
        const voxLines = [
            ' VoxTek: Trust US with your security!',
            ' WELCOME HOME! Stay tuned to the broadcast, Ethan!',
            ' Now THAT’S good television!',
            ' I’m gonna make you wish that I’d stayed gone!',
            ' Don’t touch that dial! VoxTek controls every camera in the Burj Khalifa!',
            ' Upgrade your signal! Out with the old, in with the VOX!',
            ' *static buzz* Watching every single floor from the control room...',
            'Trust us with your weather, your security, and your December 17 showtime!',
            'Check your reception! Nobody leaves the broadcast without my say-so!',
            'Pure VoxTek perfection!',
            ' Live from the highest tower in the world—and you have a front-row seat, Ethan!',
            ' *screen flicker* Are you really going to take the stairs? Let’s make this entertaining!',
            ' Ratings are through the roof! Literally!',
            ' Smile for the security feed! VoxTek sees everything from floor one to the spire!',
            ' Breaking news: Ethan thinks he can outsmart the network! Let’s see how that plays out!',
            ' *electrical crackle* Why fight the future when you can just tune in?',
            ' One hundred and sixty floors of pure, uninterrupted VoxTek programming!',
            ' Don’t even think about pulling the plug! I’m hardwired into the whole building!',
            ' Mark your calendar for December 17—the season finale is going to be electric!',
            ' *manic static laugh* You’re trending right now, Ethan! Keep running!',
            ' *camera zoom whir* Oh, nice move, Ethan! Replay that in slow motion!',
            ' You can’t hide in the blind spots when I own the whole grid!',
            ' Look at you scrambling around like a low-budget rerun!',
            ' Every elevator, every hallway, every vent—all brought to you by VoxTek!',
            ' *glitching audio* Going somewhere? We haven’t even hit the commercial break!',
            ' Ladies and gentlemen, watch Ethan sweat in glorious 8K ultra-high definition!',
            ' The numbers are skyrocketing! Keep giving the viewers what they want!',
            ' Stay tuned after the chase for a special December 17 broadcast!',
            ' Prime time doesn’t start until I say it starts!',
            ' *upbeat jingle* VoxTek: Making your worst nightmare look great on screen!',
            ' *high-voltage hum* Care to test the building’s firewall? Go ahead, make my day!',
            ' Analog is dead, Ethan! You’re living in a digital world now!',
            ' Override denied! Nice try, though—the audience loved the effort!',
            ' From Dubai’s skyline straight to your nervous system—that’s VoxTek reach!',
            ' *sharp static pop* Oops! Did I just lock that door? My finger slipped!',
            ' *distorted laugh* You really thought you were the star of this show?!',
            ' This whole tower is my stage, and you’re just a guest star!',
            ' December 17 is going to be the highest-rated blackout in history!',
            ' No skips! No pauses! No fast-forwarding through this finale!',
            ' *screen buzzes loudly* Eyes on me, Ethan! Don’t you dare look away!',
            ' *neon hum* Every screen in Dubai is reflecting my glorious face right now!',
            ' Do you feel that static in the air, Ethan? That’s pure market dominance!',
            ' We interrupt your regularly scheduled panic for a word from our sponsor: ME!',
            ' Eight hundred and twenty-eight meters of steel, glass, and VoxTek brilliance!',
            ' *dial tone* Sorry, the number you are trying to reach has been permanently canceled!',
            ' Keep pacing back and forth! The live chat is placing bets on your next move!',
            ' You’re losing signal, Ethan! Maybe you should just surrender to the network!',
            ' *smooth jazz jingle* Please stand by while we recalibrate your inevitable defeat!',
            ' Who needs an exit strategy when you have unlimited bandwidth?!',
            ' Check the monitors! Every reflection in this tower belongs to VoxTek!',
            ' *crackling feedback* Did someone say security breach? Oh wait—that’s just my new show!',
            ' Countdown to December 17 is ticking! Don’t miss a single second of the chaos!',
            ' You’re not climbing a skyscraper, Ethan—you’re climbing my ratings chart!',
            ' *sharp zapping sound* Ah-ah-ah! Keep your hands off the main server!',
            ' Crystal clear audio, razor-sharp visuals, and zero chance of escape!',
            ' Welcome back from the break! Ethan is STILL stuck on the wrong floor!',
            ' *deep bass thrum* Feel the bass? That’s the sound of total control!',
            ' VoxTek: Trust US with your future, your freedom, and your final broadcast!',
            ' Why look out the window at the clouds when the real show is right here?!',
            ' *manic channel flipping* Action! Drama! Suspense! You’re giving me Emmy material!',
            ' System update complete: Ethan’s luck has officially expired!',
            ' *buzzing neon flicker* I’m in the wires, I’m in the walls, I’m EVERYWHERE!',
            ' Don’t bother calling for backup—I rerouted every line straight to my desk!',
            ' December 17 is going to shine brighter than the Burj Khalifa at midnight!',
            ' *sign-off chime* That’s a wrap on your dignity, Ethan! Stay tuned for more!'
        ];
        
        const alastorLines = [
            ' *radio static* Why, hello there! You’re never fully dressed without a smile!',
            ' Salutations! Good to be back on the air in the Burj Khalifa!',
            ' Television is such a dreadful medium—Radio is where the real magic happens!',
            ' *dial crackle* Stay tuned, folks! The show is about to begin!',
            ' Smile, my dear! You know you’re never fully dressed without one!',
            ' Let’s begin... I’m going to make you wish that I’d stayed gone!',
            ' *vintage jazz static* Watching the Security perimeter from the shadows...',
            ' A pleasure to be meeting you, quite a pleasure!',
            ' That flat-faced television couldn’t hold a candle to a classic broadcast!',
            ' *radio feedback* Keep smiling through the lockdown, Grade 7 – Psalms!',
            ' *transatlantic radio filter* Good evening, ladies and gentlemen! Are we enjoying the festivities?',
            ' No picture needed when you have a voice as captivating as mine!',
            ' *vinyl record scratch* Oh, pardon the interruption—just tuning in to your little predicament!',
            ' Turn up the volume, Grade 7 – Psalms! You wouldn’t want to miss a single note!',
            ' *microphone feedback whine* Testing, testing! Can the whole tower hear me now?',
            ' All those flashy screens and neon lights, yet zero substance! How positively pedestrian!',
            ' *amused chuckle* Vox thinks he owns the airwaves? Please, he’s merely static in the background!',
            ' Why watch a tacky picture box when you can listen to pure, unadulterated class?',
            ' *old-timey radio jingle* Another broadcast hijacked! Somebody tell that walking television to take notes!',
            ' Oh, look at those little cameras blinking—how adorably primitive!',
            ' *low ominous hum* Careful where you step in the dark, my dear... shadows have teeth!',
            ' Do not adjust your dials! There is nowhere in this skyscraper my voice cannot reach!',
            ' *canned studio laugh track* Ha! Look at them scrambling! Pure entertainment!',
            ' A little chaos keeps the blood pumping, wouldn’t you say, Ethan?',
            ' *sharp static pop* Peek-a-boo! Did you really think a locked door could keep me out?',
            ' One hundred and sixty floors of delicious pandemonium—and I have the best frequency in the house!',
            ' *swing music faintly plays* Keep your chins up, Grade 7 – Psalms! Every good drama needs a thrilling twist!',
            ' Mark the date, my friends—December 17 will be a broadcast for the history books!',
            ' From the highest spire in Dubai down to the basement, the Radio Demon is on the air!',
            ' *studio applause* Bravo, Grade 7 – Psalms! What a spirited performance so far!',
            ' Well, isn’t this a delightful little gathering? Truly, I’m positively beaming!',
            ' *cane tap echo* Mind your manners now! Nobody likes a sore loser on live radio!',
            ' Frowning ages the face terribly, my dear! Put on a proper grin!',
            ' *distorted gramophone tune* The suspense is simply delicious, isn’t it?',
            ' *sign-off static* Don’t touch that dial—our little broadcast is far from over!',
            ' *vacuum tube warm-up hum* Oh, how I adore the sound of panic echoing through the stairwells!',
            ' Keep moving, Ethan! A stagnant protagonist makes for terribly dull radio!',
            ' *cheery whistle* Nothing perks up a dreary evening quite like a good old-fashioned lockdown!',
            ' My, my, Grade 7 – Psalms! You certainly know how to keep an audience on the edge of their seats!',
            ' *harsh frequency sweep* Did someone try to jam my signal? How delightfully futile!',
            ' Why rely on pixelated screens when your imagination paints such vivid horrors?',
            ' *polite golf clap* Splendid effort, truly! Wrong hallway, of course, but splendid effort!',
            ' Eight hundred and twenty-eight meters high, and not a single place to hide from my frequency!',
            ' *brass horn flourish* And now, a brief musical intermission while you figure out your next move!',
            ' Tell that overglorified flat-screen that real power doesn’t need a charger!',
            ' *creepy music box chime* Tick-tock goes the clock, my friends! December 17 draws ever nearer!',
            ' Oh, don’t look so glum, Grade 7 – Psalms! Every tragedy is simply a comedy with better lighting!',
            ' *static burst* Pardon the interference—I was just tidying up a few loose wires in the control room!',
            ' A smile is a valuable tool, my dear! It inspires your friends, keeps your enemies guessing, and ensures that, no matter what comes your way, YOU’RE the one in control!',
            ' *echoing footsteps* Is that you sneaking around on floor ninety, Ethan? Or is it just my shadows playing tag?',
            ' *lively ragtime piano* Step lively now! The show must go on, whether you’re ready or not!',
            ' Modern technology is so fragile—one little surge and poof! Back to the golden age of radio!',
            ' *velvety radio voice* You’re listening to W-A-L-A, broadcasting chaos straight to Grade 7 – Psalms!',
            ' *sharp intake of breath* Ooh, that looked painful! Good thing this is an audio-only medium!',
            ' No contracts, no commercials, just pure, uninterrupted mayhem!',
            ' *faint howling wind* The air gets quite thin near the spire, Ethan—careful not to lose your nerve!',
            ' That walking box of wires thinks loudness equals authority. How positively amateurish!',
            ' *antique bell ding* Ding-dong! Your time to hesitate has officially expired!',
            ' Keep those pearly whites gleaming, Grade 7 – Psalms! We are live across every speaker in Dubai!',
            ' *deep distortion* Remember, my dear... I am ALWAYS listening!',
            ' *cheerful chime* What a marvelous turn of events! Even I couldn’t have scripted it better!',
            ' Running in circles again, Ethan? Perhaps you need a better radio host to guide you!',
            ' *warped tape rewind* Wait a moment—let’s hear that desperate gasp one more time!',
            ' Until December 17 arrives, consider yourselves my captive studio audience!',
            ' *final radio sign-off click* Stay tuned, stay smiling, and whatever you do... don’t turn off the radio!'
        ];
        
        
        let isAlterEgo = false;
        let lastLineIdx = -1;
        const originalEthanSrc = ethanImg ? ethanImg.getAttribute('src') : '⭐';
        
        function getActivePersona() {
            if (STATE.partyModeOn) {
                return {
                    alt: 'Alastor',
                    src: alastorSrc,
                    pfpClass: 'is-alastor-pfp',
                    quoteClass: 'panel-alastor-quote',
                    lines: alastorLines,
                    colors: ['#dc2626', '#facc15', '#000000'],
                    title: 'Click Alastor to tune the radio!'
                };
            }
            return {
                alt: 'Vox',
                src: voxSrc,
                pfpClass: 'is-vox-pfp',
                quoteClass: 'panel-vox-quote',
                lines: voxLines,
                colors: ['#00f0ff', '#ff0055', '#ffffff'],
                title: 'Click Vox to tune the broadcast!'
            };
        }
        
        function bindPanelBroadcastClick() {
            if (!isAlterEgo || !DOM.panelImageContainer) return;
            const drawerImg = DOM.panelImageContainer.querySelector('img');
            if (!drawerImg) return;
            
            const persona = getActivePersona();
            drawerImg.style.cursor = 'pointer';
            drawerImg.title = persona.title;
            
            if (drawerImg.dataset.broadcastBound === 'true') return;
            drawerImg.dataset.broadcastBound = 'true';
            
            drawerImg.addEventListener('click', (e) => {
                e.stopPropagation();
                const activePersona = getActivePersona();
                let nextIdx = Math.floor(Math.random() * activePersona.lines.length);
                if (activePersona.lines.length > 1 && nextIdx === lastLineIdx) {
                    nextIdx = (nextIdx + 1) % activePersona.lines.length;
                }
                lastLineIdx = nextIdx;
                
                DOM.panelBody.querySelectorAll('.panel-vox-quote, .panel-alastor-quote').forEach(el => el.remove());
                
                const bubble = document.createElement('div');
                bubble.className = `${activePersona.quoteClass} is-pop`;
                bubble.textContent = activePersona.lines[lastLineIdx];
                DOM.panelBody.prepend(bubble);
                
                triggerScreenGlitch(95);
                
                DOM.panelImageContainer.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.07) skewX(-4deg)', offset: 0.35 },
                    { transform: 'scale(1.04) skewX(4deg)', offset: 0.7 },
                    { transform: 'scale(1)' }
                ], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const rect = DOM.panelImageContainer.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, activePersona.colors, 18);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                
                if (STATE.partyModeOn) {
                    playBeep(330.00, 0.08, 'sawtooth', 0.045);
                    setTimeout(() => playBeep(246.94, 0.12, 'triangle', 0.045), 65);
                } else {
                    playBeep(740.00, 0.06, 'sawtooth', 0.04);
                    setTimeout(() => playBeep(987.77, 0.1, 'square', 0.04), 60);
                }
            });
        }
        
        function syncEthanAlterEgoVisuals() {
            const monoEl = vollowSecCard.querySelector('.monogram-avatar');
            const persona = getActivePersona();
            
            if (isAlterEgo) {
                if (monoEl) monoEl.style.display = 'none';
                if (ethanImg) {
                    ethanImg.style.display = 'block';
                    ethanImg.src = persona.src;
                    ethanImg.classList.remove('is-vox-pfp', 'is-alastor-pfp');
                    ethanImg.classList.add(persona.pfpClass);
                }
            } else {
                if (ethanImg) {
                    ethanImg.classList.remove('is-vox-pfp', 'is-alastor-pfp');
                    if (monoEl) {
                        ethanImg.style.display = 'none';
                        monoEl.style.display = 'flex';
                    } else {
                        ethanImg.src = originalEthanSrc;
                    }
                }
            }
            
            if (DOM.panel && DOM.panel.classList.contains('active') && vollowSecCard.classList.contains('active')) {
                DOM.panelBody.querySelectorAll('.panel-vox-quote, .panel-alastor-quote').forEach(el => el.remove());
                if (isAlterEgo) {
                    DOM.panelImageContainer.innerHTML = `<img src="${persona.src}" alt="${persona.alt}" class="${persona.pfpClass}">`;
                    bindPanelBroadcastClick();
                } else {
                    if (monoEl) {
                        DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
                    } else if (ethanImg) {
                        DOM.panelImageContainer.innerHTML = `<img src="${originalEthanSrc}" alt="${vollowSecCard.querySelector('.overlay-text').textContent.trim()}">`;
                    }
                }
            }
        }
        
        const partyObserver = new MutationObserver(() => {
            if (isAlterEgo) {
                lastLineIdx = -1;
                syncEthanAlterEgoVisuals();
            }
        });
        partyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        
        STATE.onOpenCard.push((openedCard) => {
            if (openedCard === vollowSecCard && isAlterEgo) {
                requestAnimationFrame(bindPanelBroadcastClick);
            }
            return false;
        });
        
        vollowSecCard.addEventListener('click', (e) => {
            if (e.detail === 1 && !isAlterEgo) {
                triggerWalkieTalkie(vollowSecCard, bobbySecCard, [
                    '*ksssh* Copy that, Bobby. Over.',
                    '*ksssh* Bobby, the fans are inside.',
                    '*ksssh* Copy, Bobby. I have them safe.',
                    '*ksssh* Bobby, do you hear anything ticking?',
                    '*ksssh* Shadow team in position.',
                    '*ksssh* Perimeter secure, Bobby.',
                    'No one goes in, no one goes out. *ksssh*'
                ]);
                return;
            }
            
            if (!e._isTripleTap && e.detail !== 3) return;
            isAlterEgo = !isAlterEgo;
            lastLineIdx = -1;
            
            triggerScreenGlitch(130);
            
            vollowSecCard.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            
            setTimeout(syncEthanAlterEgoVisuals, 275);
            
            const persona = getActivePersona();
            const rect = vollowSecCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, persona.colors, 24);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isAlterEgo ? (STATE.partyModeOn ? 330.00 : 880.00) : 440.00, 0.08, 'sawtooth', 0.045);
            setTimeout(() => playBeep(isAlterEgo ? (STATE.partyModeOn ? 246.94 : 1174.66) : 329.63, 0.14, 'square', 0.045), 75);
        });
    }
    
    const xanderCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('ibarra'));
    if (xanderCard) {
        xanderCard.addEventListener('click', () => {
            xanderCard.classList.remove('quirk-cuber-spin');
            void xanderCard.offsetWidth;
            xanderCard.classList.add('quirk-cuber-spin');
            [440, 554, 659, 880].forEach((freq, i) => setTimeout(() => playBeep(freq, 0.045, 'square', 0.03), i * 55));
        });
    }
    
    const virelleCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('uba'));
    if (virelleCard) {
        virelleCard.addEventListener('click', () => {
            if (Math.floor(Math.random() * 50) !== 0) return;
            
            const rect = virelleCard.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const flash = document.createElement('div');
            flash.className = 'quirk-bomb-flash';
            document.body.appendChild(flash);
            document.body.classList.add('quirk-bomb-shake');
            
            const bombEl = document.createElement('div');
            bombEl.className = 'quirk-bomb-icon';
            bombEl.textContent = '💥';
            bombEl.style.left = `${cx}px`;
            bombEl.style.top = `${cy}px`;
            document.body.appendChild(bombEl);
            
            playBeep(110, 0.35, 'sawtooth', 0.08);
            setTimeout(() => playBeep(65, 0.45, 'square', 0.07), 60);
            spawnBurst(cx, cy, ['#fb923c', '#ef4444'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            setTimeout(() => {
                flash.remove();
                bombEl.remove();
                document.body.classList.remove('quirk-bomb-shake');
            }, 650);
        });
    }
    
    const nakanoCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('angeles'));
    if (nakanoCard) {
        const princeImg = nakanoCard.querySelector('img');
        const zeroTwoSrc = 'otherpics/ZeroTwo.jpg';
        const zeroTwoLines = [
            'Darling~ ',
            'You came back for me, Darling? ',
            'Found you, Darling! ',
            'You are my one and only Darling~ ',
            'Ready to shine on December 17, Darling? ',
            'Clicked me again, Darling~ ',
            'You\'re my only Darling...',
            'Don\'t take your eyes off me, Darling~ ',
            'Want to ride with me, Darling? ',
            'You\'re a lot more fun than everyone else, Darling! ',
            'Hehe, you really can\'t resist me, can you, Darling? ',
            'I\'ve been waiting right here for you, Darling~ ',
            'Let\'s show everyone what we can do on December 17, Darling! ',
            'Countdown to December 17 starts now, right, Darling? ',
            'Are you sweet enough for me today, Darling? ',
            'Stay close to me, okay, Darling? ',
            'You belong to me now, Darling~ ',
            'Bored? Let\'s run away together, Darling! ',
            'Look at me, not the screen, Darling~ ',
            'If you leave me alone, I\'ll bite, Darling! ',
            'You\'re my favorite person in the whole world, Darling~ ',
            'Let\'s fly higher than anyone else, Darling! ',
            'Did you miss me, Darling? Tell the truth~ ',
            'Nothing can stop us on December 17, Darling! ',
            'Is it December 17 yet, Darling? I can\'t wait~ ',
            'I\'ll take you somewhere amazing, Darling! ',
            'You\'re making my heart race, Darling~ ',
            'Keep clicking me and I\'ll never let you go, Darling! ',
            'Everyone else is boring—only you matter, Darling~ ',
            'December 17 is going to be our big day, Darling! ',
            'Come closer, Darling... don\'t be shy~ ',
            'You and me against the world, right, Darling? ',
            'I knew you\'d come looking for me, Darling! ',
            'Got any honey for me, Darling? ',
            'I won\'t ever let you go, Darling~ ',
            'Save all your energy for December 17, Darling! '
        ];
        
        let isZeroTwo = false;
        let z2LineIdx = -1;
        const originalSrc = princeImg ? princeImg.getAttribute('src') : '';
        
        function renderZeroTwoDuoPanel() {
            if (!isZeroTwo || !DOM.panelImageContainer) return;
            
            const monoEl = nakanoCard.querySelector('.monogram-avatar');
            const princeAvatarHTML = monoEl
            ? `<div class="monogram-avatar">${monoEl.textContent}</div>`
            : `<img src="${originalSrc}" alt="Angeles, Prince Paulo B.">`;
            
            DOM.panelImageContainer.classList.add('is-duo-split');
            DOM.panelImageContainer.innerHTML = `
                <div class="duo-avatar-slot duo-prince-slot">
                    ${princeAvatarHTML}
                </div>
                <div class="duo-avatar-slot duo-zerotwo-slot" id="zeroTwoDuoTrigger" title="Click Zero Two!">
                    <span class="zerotwo-claim-bubble">He's my Husband... </span>
                    <img src="${zeroTwoSrc}" alt="Zero Two" class="is-zerotwo-pfp">
                </div>
            `;
            
            const z2Trigger = DOM.panelImageContainer.querySelector('#zeroTwoDuoTrigger');
            if (!z2Trigger) return;
            
            z2Trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = Math.floor(Math.random() * zeroTwoLines.length);
                if (zeroTwoLines.length > 1 && nextIdx === z2LineIdx) {
                    nextIdx = (nextIdx + 1) % zeroTwoLines.length;
                }
                z2LineIdx = nextIdx;
                
                let bubble = DOM.panelBody.querySelector('.panel-zerotwo-quote');
                if (!bubble) {
                    bubble = document.createElement('div');
                    bubble.className = 'panel-zerotwo-quote';
                    DOM.panelBody.prepend(bubble);
                }
                
                bubble.textContent = ` "${zeroTwoLines[z2LineIdx]}"`;
                bubble.classList.remove('is-pop');
                void bubble.offsetWidth;
                bubble.classList.add('is-pop');
                
                z2Trigger.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.09) rotate(-4deg)', offset: 0.4 },
                    { transform: 'scale(1)' }
                ], { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const rect = z2Trigger.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f472b6', '#ef4444', '#ffffff'], 16);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                playBeep(659.25, 0.07, 'sine', 0.04);
                setTimeout(() => playBeep(880.00, 0.11, 'triangle', 0.04), 70);
            });
        }
        
        STATE.onOpenCard.push((openedCard) => {
            requestAnimationFrame(() => {
                if (openedCard === nakanoCard && isZeroTwo) {
                    renderZeroTwoDuoPanel();
                } else if (DOM.panelImageContainer) {
                    DOM.panelImageContainer.classList.remove('is-duo-split');
                }
            });
            return false;
        });
        
        STATE.onClosePanel.push(() => {
            if (DOM.panelImageContainer) {
                DOM.panelImageContainer.classList.remove('is-duo-split');
            }
        });
        
        nakanoCard.addEventListener('click', (e) => {
            if (e.detail === 1 && !isZeroTwo) {
                spawnBadge(nakanoCard, 'メリークリスマス! ', 'quirk-manga-bubble', 1100);
                playBeep(587.33, 0.07, 'sine', 0.035);
                setTimeout(() => playBeep(783.99, 0.1, 'sine', 0.035), 75);
            }
            
            if (!e._isTripleTap && e.detail !== 3) return;
            isZeroTwo = !isZeroTwo;
            
            nakanoCard.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            
            setTimeout(() => {
                const monoEl = nakanoCard.querySelector('.monogram-avatar');
                if (isZeroTwo) {
                    if (monoEl) monoEl.style.display = 'none';
                    if (princeImg) {
                        princeImg.style.display = 'block';
                        princeImg.src = zeroTwoSrc;
                        princeImg.classList.add('is-zerotwo-pfp');
                    }
                } else {
                    if (princeImg) {
                        princeImg.classList.remove('is-zerotwo-pfp');
                        if (monoEl) {
                            princeImg.style.display = 'none';
                            monoEl.style.display = 'flex';
                        } else {
                            princeImg.src = originalSrc;
                        }
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && nakanoCard.classList.contains('active')) {
                    if (isZeroTwo) {
                        renderZeroTwoDuoPanel();
                    } else {
                        DOM.panelImageContainer.classList.remove('is-duo-split');
                        const existingQuote = DOM.panelBody.querySelector('.panel-zerotwo-quote');
                        if (existingQuote) existingQuote.remove();
                        if (monoEl) {
                            DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
                        } else if (princeImg) {
                            DOM.panelImageContainer.innerHTML = `<img src="${originalSrc}" alt="Angeles, Prince Paulo B.">`;
                        }
                    }
                }
            }, 275);
            
            const rect = nakanoCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f472b6', '#ef4444', '#ffffff'], 22);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isZeroTwo ? 783.99 : 523.25, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(isZeroTwo ? 1046.50 : 392.00, 0.14, 'triangle', 0.045), 75);
        });
    }
    
    const hazelCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('del rosario'));
    if (hazelCard) {
        const veronicaImg = hazelCard.querySelector('img');
        const carlSrc = 'otherpics/CarlGrimes.jfif';
        const carlLines = [
            'Coral!',
            'Stay back, I got this!',
            'We can still make it through, Veronica.',
            'Don\'t talk, think!',
            'We\'re the ones who live!',
            'You clicked me again... stay sharp!',
            'I\'m not dying today.',
            'Nobody else has to die anymore.',
            'Put the gun down, I\'ve got point.',
            'Always keep an eye on the perimeter, Veronica.',
            'I found another giant can of chocolate pudding!',
            'My dad taught me how to survive! we\'re ready for Dec 17!',
            'You can\'t beat the sheriff\'s hat, Veronica.',
            'No more kid stuff. Let\'s do this.',
            'Even in a Burj Khalifa lockdown, we hold the line!',
            'I\'m gonna keep you safe, no matter what.',
            'Watch the blind spots! walkers could be anywhere!',
            'Forget the mukbang, pass the chocolate pudding!',
            'Alexandria, Dubai, Antipolo! we protect our people.',
            'Still standing. Still fighting.'
        ];
        
        let isCarl = false;
        let carlLineIdx = -1;
        const originalVeronicaSrc = veronicaImg ? veronicaImg.getAttribute('src') : '';
        
        function bindPanelCarlClick() {
            if (!isCarl || !DOM.panelImageContainer) return;
            const drawerImg = DOM.panelImageContainer.querySelector('img');
            if (!drawerImg || drawerImg.dataset.carlBound === 'true') return;
            
            drawerImg.dataset.carlBound = 'true';
            drawerImg.style.cursor = 'pointer';
            drawerImg.title = 'Click Carl Grimes!';
            
            drawerImg.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = Math.floor(Math.random() * carlLines.length);
                if (carlLines.length > 1 && nextIdx === carlLineIdx) {
                    nextIdx = (nextIdx + 1) % carlLines.length;
                }
                carlLineIdx = nextIdx;
                
                let bubble = DOM.panelBody.querySelector('.panel-carl-quote');
                if (!bubble) {
                    bubble = document.createElement('div');
                    bubble.className = 'panel-carl-quote';
                    DOM.panelBody.prepend(bubble);
                }
                
                bubble.textContent = ` "${carlLines[carlLineIdx]}"`;
                bubble.classList.remove('is-pop');
                void bubble.offsetWidth;
                bubble.classList.add('is-pop');
                
                DOM.panelImageContainer.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.07) rotate(3deg)', offset: 0.4 },
                    { transform: 'scale(1)' }
                ], { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const rect = DOM.panelImageContainer.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#d97706', '#78350f', '#fef08a'], 16);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                playBeep(329.63, 0.08, 'triangle', 0.045);
                setTimeout(() => playBeep(440.00, 0.12, 'triangle', 0.045), 75);
            });
        }
        
        STATE.onOpenCard.push((openedCard) => {
            if (openedCard === hazelCard && isCarl) {
                requestAnimationFrame(bindPanelCarlClick);
            }
            return false;
        });
        
        hazelCard.addEventListener('click', (e) => {
            if (e.detail === 1 && !isCarl) {
                spawnBadge(hazelCard, '🍜', 'quirk-float-pop', 900);
                playBeep(659.25, 0.06, 'triangle', 0.035);
                setTimeout(() => playBeep(880.00, 0.09, 'triangle', 0.035), 65);
            }
            
            if (!e._isTripleTap && e.detail !== 3) return;
            isCarl = !isCarl;
            
            hazelCard.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            
            setTimeout(() => {
                const monoEl = hazelCard.querySelector('.monogram-avatar');
                if (isCarl) {
                    if (monoEl) monoEl.style.display = 'none';
                    if (veronicaImg) {
                        veronicaImg.style.display = 'block';
                        veronicaImg.src = carlSrc;
                        veronicaImg.classList.add('is-carl-pfp');
                    }
                } else {
                    if (veronicaImg) {
                        veronicaImg.classList.remove('is-carl-pfp');
                        if (monoEl) {
                            veronicaImg.style.display = 'none';
                            monoEl.style.display = 'flex';
                        } else {
                            veronicaImg.src = originalVeronicaSrc;
                        }
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && hazelCard.classList.contains('active')) {
                    if (isCarl) {
                        DOM.panelImageContainer.innerHTML = `<img src="${carlSrc}" alt="Carl Grimes" class="is-carl-pfp">`;
                        bindPanelCarlClick();
                    } else {
                        const existingQuote = DOM.panelBody.querySelector('.panel-carl-quote');
                        if (existingQuote) existingQuote.remove();
                        if (monoEl) {
                            DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
                        } else if (veronicaImg) {
                            DOM.panelImageContainer.innerHTML = `<img src="${originalVeronicaSrc}" alt="${hazelCard.querySelector('.overlay-text').textContent.trim()}">`;
                        }
                    }
                }
            }, 275);
            
            const rect = hazelCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#d97706', '#78350f', '#fef08a'], 22);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isCarl ? 440.00 : 329.63, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(isCarl ? 587.33 : 261.63, 0.14, 'triangle', 0.045), 75);
        });
    }
    
    const jennCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('arles'));
    if (jennCard) {
        jennCard.addEventListener('click', () => {
            spawnBadge(jennCard, '✨', 'quirk-star-glow', 1000);
            playBeep(523.25, 0.1, 'sine', 0.03);
            setTimeout(() => playBeep(659.25, 0.12, 'sine', 0.03), 80);
            setTimeout(() => playBeep(1046.50, 0.18, 'sine', 0.035), 160);
        });
    }
    
    const sophieCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('suzon'));
    if (sophieCard) {
        const sophieImg = sophieCard.querySelector('img');
        const cortisGroupSrc = 'otherpics/CortisGroup.jpg';
        const cortisMembers = [
            {
                name: 'Martin (Leader • Main Rapper)',
                realName: 'Martin Edwards Park',
                nationality: 'Korean-Canadian',
                birthday: 'March 20, 2008',
                zodiac: 'Pisces ',
                mbti: 'ENFP',
                emoji: '',
                themeColor: '#FF4B4B',
                weight: 14,
                rarityTag: 'Member',
                src: 'otherpics/CortisMartin.jpg',
                songRec: 'What You Want',
                fanTitle: 'Lead Producer of Grade 7 – Psalms',
                line: 'Hello! We are CORTIS! Ready to Color Outside The Lines with you, Sophie!',
                extraLines: [
                    'As leader, I promise Grade 7 – Psalms is going to have the best December 17 ever!',
                    'Tell me "What You Want," Sophie! let’s make Beyond The Manger unforgettable!',
                    'I stayed up in the studio mixing a special intro just for Sophie’s entrance!',
                    'Remember: always color outside the lines, both in music and in class!'
                ],
                secretNote: 'P.S. Sophie, you’re officially promoted to honorary CORTIS co-producer!',
                funFact: 'A production prodigy who has written and produced tracks for groups like TXT and ENHYPEN.'
            },
            {
                name: 'James (Main Dancer • Rapper)',
                realName: 'Chao Yufan',
                nationality: 'Thai-Taiwanese',
                birthday: 'October 14, 2005',
                zodiac: 'Libra ',
                mbti: 'INTP',
                emoji: '',
                themeColor: '#2ECC71',
                weight: 14,
                rarityTag: 'Member',
                src: 'otherpics/CortisJames.jpg',
                songRec: 'GO!',
                fanTitle: 'Main Choreographer for Beyond The Manger',
                line: 'Let’s bring full energy to the stage on December 17, Sophie!',
                extraLines: [
                    'Time to turn up the energy and "GO!" all out for Beyond The Manger!',
                    'Seeing a dedicated COER like Sophie in Grade 7 – Psalms gives me total "JoyRide" vibes!',
                    'Need a quick energy boost before December 17? Let’s run the choreography together, Sophie!',
                    'From ice hockey rinks to the CORTIS stage! nothing beats hyping up a true fan like you!'
                ],
                secretNote: 'P.S. Save me a front-row seat at Beyond The Manger, Sophie!',
                funFact: 'The oldest member and performance pillar who trained in taekwondo and ice hockey before dancing.'
            },
            {
                name: 'Juhoon (Vocalist • Visual)',
                realName: 'Kim Ju-hoon',
                nationality: 'South Korean',
                birthday: 'January 3, 2008',
                zodiac: 'Capricorn ',
                mbti: 'ISFP',
                emoji: '',
                themeColor: '#3498DB',
                weight: 44,
                rarityTag: 'Favorite',
                src: 'otherpics/CortisJuhoon.jpg',
                songRec: 'FaSHioN',
                fanTitle: 'Visual Director of COER',
                line: 'Stay chill and shine bright at Beyond The Manger, Sophie!',
                extraLines: [
                    'Bringing smooth R&B vibes and top-tier "FaSHioN" straight to Sophie’s screen!',
                    'Don’t stress about schoolwork! take a breather and enjoy the holiday season, Sophie!',
                    'Slow and steady wins the race, Sophie. Take your time and enjoy every moment!',
                    'Your style is already 10/10, Sophie! pure "FaSHioN" icon energy!',
                    'You pulled your bias again, Sophie. Guess we’re on the exact same wavelength today!',
                    'Even in a crowded Burj Khalifa meet-and-greet, Sophie’s COER energy stands out effortlessly.',
                    'Capricorn calm meets Grade 7 – Psalms chaos! don’t worry, Sophie, I’ve got your back!',
                    'If you ever need a calm reset before December 17, just put on some smooth R&B and breathe, Sophie.',
                    'The other members are loud, so I came by quietly just to cheer for Sophie!',
                    'Runway pose locked in! Sophie, you’re officially styled for the Paskong AFCS main stage!',
                    'Between props, rehearsals, and classes, make sure you’re getting enough rest, Sophie.',
                    'ISFP intuition says Grade 7 – Psalms is going to steal the whole show! especially you, Sophie!',
                    'A rare Juhoon check-in just for Sophie. Keep being effortlessly cool!',
                    'No rushing, no panicking! walk onto that stage on December 17 like you own the runway, Sophie!'
                ],
                secretNote: 'P.S. Keep shining effortlessly, Sophie. You’ve got this!',
                funFact: 'A former youth model known for his sophisticated R&B vocals and calm, thoughtful personality.'
            },
            {
                name: 'Seonghyeon (Main Vocalist)',
                realName: 'Eom Sung-hyun',
                nationality: 'South Korean',
                birthday: 'January 13, 2009',
                zodiac: 'Capricorn ',
                mbti: 'INTJ',
                emoji: '',
                themeColor: '#2C3E50',
                weight: 14,
                rarityTag: 'Member',
                src: 'otherpics/CortisSeonghyeon.jpg',
                songRec: 'REDRED',
                fanTitle: 'Chief Melody Maker for Sophie',
                line: 'Writing a brand-new track just for Grade 7 – Psalms!',
                extraLines: [
                    'If you ever need a break after class, I’ll sing a "Lullaby" just for you, Sophie!',
                    'Working on a secret remix of "REDRED" dedicated to our #1 COER, Sophie!',
                    'Every great song needs a catchy hook, and Sophie is the #1 hook of Grade 7 – Psalms!',
                    'Warming up my vocals right now so I can sing happy holidays to Sophie!'
                ],
                secretNote: 'P.S. Let me know which melody is stuck in your head today, Sophie!',
                funFact: 'Known as CORTIS’s "hook machine" who helped write and produce every track on their debut EP.'
            },
            {
                name: 'Keonho (Vocalist • Maknae)',
                realName: 'Ahn Geon-ho',
                nationality: 'South Korean',
                birthday: 'February 14, 2009',
                zodiac: 'Aquarius ',
                mbti: 'ENTP',
                emoji: '',
                themeColor: '#F1C40F',
                weight: 14,
                rarityTag: 'Member',
                src: 'otherpics/CortisKeonho.jpg',
                songRec: 'JoyRide',
                fanTitle: 'Official Maknae Bestie',
                line: 'COER forever! Thanks for supporting all 5 of us, Sophie!',
                extraLines: [
                    'Sending big maknae energy to Sophie and everyone in Grade 7 – Psalms!',
                    'Count me in for Beyond The Manger on December 17! we’re cheering for you, Sophie!',
                    'I’m the youngest in CORTIS, so it’s my official job to keep Sophie smiling all day!',
                    'Whether it’s swimming laps or practicing vocals, I’m always rooting for you, Sophie!'
                ],
                secretNote: 'P.S. Don’t forget to hydrate and have fun on December 17, Sophie!',
                funFact: 'The youngest member (maknae) who used to be a competitive swimmer before debuting.'
            }
        ];
        
        const cortisGroupInfo = {
            groupName: 'CORTIS',
            meaning: 'Color Outside The Lines',
            fandomName: 'COER',
            debutDate: 'August 18, 2025',
            allMembersUnlockedMessage: ' OT5 UNLOCKED! All 5 members of CORTIS are officially cheering for Sophie and Grade 7 – Psalms at Beyond The Manger on December 17! COER forever! '
        };
        let isCortis = false;
        let seenMembers = new Set();
        let ot5Celebrated = false;
        let lastJuhoonLine = '';
        const originalSophieSrc = sophieImg ? sophieImg.getAttribute('src') : '';
        
        function pickWeightedMemberIndex() {
            const totalWeight = cortisMembers.reduce((sum, m) => sum + (m.weight || 1), 0);
            let roll = Math.random() * totalWeight;
            for (let i = 0; i < cortisMembers.length; i++) {
                roll -= (cortisMembers[i].weight || 1);
                if (roll <= 0) return i;
            }
            return 0;
        }
        
        function bindPanelCortisClick() {
            if (!isCortis || !DOM.panelImageContainer) return;
            const drawerImg = DOM.panelImageContainer.querySelector('img');
            if (!drawerImg || drawerImg.dataset.cortisBound === 'true') return;
            
            drawerImg.dataset.cortisBound = 'true';
            drawerImg.style.cursor = 'pointer';
            drawerImg.title = 'Click to pull a CORTIS member!';
            
            drawerImg.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentIdx = pickWeightedMemberIndex();
                const member = cortisMembers[currentIdx];
                seenMembers.add(currentIdx);
                
                const allLines = [member.line, ...member.extraLines];
                let chosenLine = allLines[Math.floor(Math.random() * allLines.length)];
                if (allLines.length > 1 && chosenLine === lastJuhoonLine) {
                    chosenLine = allLines[(allLines.indexOf(chosenLine) + 1) % allLines.length];
                }
                lastJuhoonLine = chosenLine;
                
                drawerImg.src = member.src;
                drawerImg.alt = member.name;
                
                const activeBorder = member.themeColor === '#2C3E50' ? '#94a3b8' : member.themeColor;
                DOM.panelImageContainer.style.borderColor = activeBorder;
                DOM.panelImageContainer.style.boxShadow = `0 0 26px ${activeBorder}`;
                
                let cardBox = DOM.panelBody.querySelector('.panel-cortis-card');
                if (!cardBox) {
                    cardBox = document.createElement('div');
                    cardBox.className = 'panel-cortis-card';
                    DOM.panelBody.prepend(cardBox);
                }
                
                const justUnlockedOT5 = seenMembers.size === cortisMembers.length && !ot5Celebrated;
                if (justUnlockedOT5) ot5Celebrated = true;
                
                const ot5BannerHTML = seenMembers.size === cortisMembers.length
                ? `<div class="cortis-ot5-banner">${cortisGroupInfo.allMembersUnlockedMessage}</div>`
                : `<div class="cortis-progress-pill"> ${cortisGroupInfo.groupName} (${cortisGroupInfo.meaning}) • ${member.rarityTag} • ${seenMembers.size}/${cortisMembers.length} Unlocked</div>`;
                
                cardBox.style.borderColor = activeBorder;
                cardBox.style.boxShadow = `0 0 22px ${activeBorder}55`;
                cardBox.innerHTML = [
                    ot5BannerHTML,
                    `<div class="cortis-card-top"><span class="cortis-member-name">${member.emoji} ${member.name}</span><span class="cortis-fan-title"> ${member.fanTitle}</span></div>`,
                    `<p class="cortis-main-quote">"${chosenLine}"</p>`,
                    `<div class="cortis-meta-grid">`,
                    `<span><strong>Real Name:</strong> ${member.realName}</span>`,
                    `<span><strong>Origin:</strong> ${member.nationality}</span>`,
                    `<span><strong>Birthday:</strong> ${member.birthday} (${member.zodiac})</span>`,
                    `<span><strong>MBTI:</strong> ${member.mbti} • <strong>Song:</strong>  ${member.songRec}</span>`,
                    `</div>`,
                    `<p class="cortis-fun-fact"> <strong>Fun Fact:</strong> ${member.funFact}</p>`,
                    `<p class="cortis-secret-note"> ${member.secretNote}</p>`
                ].join('');
                
                cardBox.classList.remove('is-pop');
                void cardBox.offsetWidth;
                cardBox.classList.add('is-pop');
                
                DOM.panelImageContainer.animate([
                    { transform: 'scale(1) rotate(0deg)' },
                    { transform: 'scale(1.08) rotate(-4deg)', offset: 0.4 },
                    { transform: 'scale(1) rotate(0deg)' }
                ], { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const rect = DOM.panelImageContainer.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, [activeBorder, '#facc15', '#ffffff'], justUnlockedOT5 ? 40 : 20);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                
                if (justUnlockedOT5) {
                    [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                        setTimeout(() => playBeep(f, 0.16, 'triangle', 0.05), idx * 80);
                    });
                } else {
                    playBeep(587.33, 0.07, 'triangle', 0.045);
                    setTimeout(() => playBeep(880.00, 0.12, 'triangle', 0.045), 70);
                }
            });
        }
        STATE.onOpenCard.push((openedCard) => {
            if (openedCard === sophieCard && isCortis) {
                requestAnimationFrame(bindPanelCortisClick);
            }
            return false;
        });
        
        sophieCard.addEventListener('click', (e) => {
            if (!e._isTripleTap && e.detail !== 3) return;
            isCortis = !isCortis;
            
            sophieCard.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            
            setTimeout(() => {
                const monoEl = sophieCard.querySelector('.monogram-avatar');
                if (isCortis) {
                    if (monoEl) monoEl.style.display = 'none';
                    if (sophieImg) {
                        sophieImg.style.display = 'block';
                        sophieImg.src = cortisGroupSrc;
                        sophieImg.classList.add('is-cortis-pfp');
                    }
                } else {
                    if (sophieImg) {
                        sophieImg.classList.remove('is-cortis-pfp');
                        if (monoEl) {
                            sophieImg.style.display = 'none';
                            monoEl.style.display = 'flex';
                        } else {
                            sophieImg.src = originalSophieSrc;
                        }
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && sophieCard.classList.contains('active')) {
                    if (isCortis) {
                        DOM.panelImageContainer.innerHTML = `<img src="${cortisGroupSrc}" alt="CORTIS" class="is-cortis-pfp">`;
                        bindPanelCortisClick();
                    } else {
                        const existingCard = DOM.panelBody.querySelector('.panel-cortis-card');
                        if (existingCard) existingCard.remove();
                        if (monoEl) {
                            DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
                        } else if (sophieImg) {
                            DOM.panelImageContainer.innerHTML = `<img src="${originalSophieSrc}" alt="${sophieCard.querySelector('.overlay-text').textContent.trim()}">`;
                        }
                    }
                }
            }, 275);
            
            const rect = sophieCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#38bdf8', '#a3e635', '#f472b6', '#ffffff'], 24);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isCortis ? 659.25 : 440.00, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(isCortis ? 987.77 : 329.63, 0.14, 'triangle', 0.045), 75);
        });
    }
    
    
    const kiefCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('dela cruz'));
    if (kiefCard) {
        const kiefImg = kiefCard.querySelector('img');
        const kobeSrc = 'otherpics/Kobe.jpg';
        const kobeLines = [
            'Mamba Mentality!',
            'Job’s not finished. Job finished? I don’t think so.',
            '24 & 8 !  Forever on the court, Kief!',
            'Everything negative !  pressure, challenges !  is all an opportunity to rise.',
            'From 2823-rated Chess Grandmaster to dropping 81 on January 22!',
            'Rest at the end, not in the middle!',
            'Kobe! *fades away for the buzzer beater*',
            'Heroes come and go, but legends are forever.',
            'The most important thing is to try and inspire people so that they can be great in whatever they want to do.',
            'If you’re afraid to fail, then you’re probably going to fail.',
            'We don’t quit, we don’t cower, we don’t run. We endure and conquer.',
            'Great things come from hard work and perseverance. No excuses.',
            'I’ll do whatever it takes to win games, whether it’s sitting on a bench waving a towel, handing a cup of water to a teammate, or hitting the game-winning shot.',
            '5 Rings, 2 Finals MVPs, 18 All-Star appearances. Pure greatness.',
            '60 points in the final game. Mamba out!',
            '33,643 career points !  nothing but net and relentless work ethic.',
            'Two torn Achilles tendons? Still walks up to the line and drains both free throws.',
            '4 AM workouts while the rest of the world is still asleep.',
            'From Lower Merion to Staples Center !  20 seasons in Purple and Gold.',
            'Channeling that 4th-quarter Black Mamba clutch gene today, Kief!',
            'No shortcuts, no excuses !  attack the day like Kobe in Game 7, Kief!',
            'Mamba Mentality activated. Go dominate the board, Kief!',
            'Details matter. Footwork, focus, and Mamba Mentality !  you got this, Kief!'
        ];
        
        let isKobe = false;
        let kobeLineIdx = -1;
        const originalKiefSrc = kiefImg ? kiefImg.getAttribute('src') : '';
        
        function bindPanelKobeClick() {
            if (!isKobe || !DOM.panelImageContainer) return;
            const drawerImg = DOM.panelImageContainer.querySelector('img');
            if (!drawerImg || drawerImg.dataset.kobeBound === 'true') return;
            
            drawerImg.dataset.kobeBound = 'true';
            drawerImg.style.cursor = 'pointer';
            drawerImg.title = 'Click Kobe Bryant!';
            
            drawerImg.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = Math.floor(Math.random() * kobeLines.length);
                if (kobeLines.length > 1 && nextIdx === kobeLineIdx) {
                    nextIdx = (nextIdx + 1) % kobeLines.length;
                }
                kobeLineIdx = nextIdx;
                
                let bubble = DOM.panelBody.querySelector('.panel-kobe-quote');
                if (!bubble) {
                    bubble = document.createElement('div');
                    bubble.className = 'panel-kobe-quote';
                    DOM.panelBody.prepend(bubble);
                }
                
                bubble.textContent = ` "${kobeLines[kobeLineIdx]}"`;
                bubble.classList.remove('is-pop');
                void bubble.offsetWidth;
                bubble.classList.add('is-pop');
                
                DOM.panelImageContainer.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.07) rotate(-3deg)', offset: 0.4 },
                    { transform: 'scale(1)' }
                ], { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const rect = DOM.panelImageContainer.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#a855f7', '#ffffff'], 18);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                playBeep(587.33, 0.08, 'triangle', 0.045);
                setTimeout(() => playBeep(880.00, 0.14, 'triangle', 0.045), 75);
            });
        }
        
        STATE.onOpenCard.push((openedCard) => {
            if (openedCard === kiefCard && isKobe) {
                requestAnimationFrame(bindPanelKobeClick);
            }
            return false;
        });
        
        kiefCard.addEventListener('click', (e) => {
            if (e.detail === 1 && !isKobe) {
                spawnBadge(kiefCard, '♞ 2823', 'quirk-star-glow', 950);
                playBeep(310, 0.05, 'triangle', 0.04);
                setTimeout(() => playBeep(465, 0.08, 'triangle', 0.04), 70);
            }
            
            if (!e._isTripleTap && e.detail !== 3) return;
            isKobe = !isKobe;
            
            kiefCard.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            
            setTimeout(() => {
                const monoEl = kiefCard.querySelector('.monogram-avatar');
                if (isKobe) {
                    if (monoEl) monoEl.style.display = 'none';
                    if (kiefImg) {
                        kiefImg.style.display = 'block';
                        kiefImg.src = kobeSrc;
                        kiefImg.classList.add('is-kobe-pfp');
                    }
                } else {
                    if (kiefImg) {
                        kiefImg.classList.remove('is-kobe-pfp');
                        if (monoEl) {
                            kiefImg.style.display = 'none';
                            monoEl.style.display = 'flex';
                        } else {
                            kiefImg.src = originalKiefSrc;
                        }
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && kiefCard.classList.contains('active')) {
                    if (isKobe) {
                        DOM.panelImageContainer.innerHTML = `<img src="${kobeSrc}" alt="Kobe Bryant" class="is-kobe-pfp">`;
                        bindPanelKobeClick();
                    } else {
                        const existingQuote = DOM.panelBody.querySelector('.panel-kobe-quote');
                        if (existingQuote) existingQuote.remove();
                        if (monoEl) {
                            DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
                        } else if (kiefImg) {
                            DOM.panelImageContainer.innerHTML = `<img src="${originalKiefSrc}" alt="${kiefCard.querySelector('.overlay-text').textContent.trim()}">`;
                        }
                    }
                }
            }, 275);
            
            const rect = kiefCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#a855f7', '#ffffff'], 26);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isKobe ? 587.33 : 440.00, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(isKobe ? 880.00 : 329.63, 0.14, 'triangle', 0.045), 75);
        });
    }
    
    const jennahCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('mantal'));
    if (jennahCard) {
        const jennahImg = jennahCard.querySelector('img');
        const crowbarSrc = 'otherpics/crowbar.jpg';
        const crowbarLines = [
            'I can open anything with this!'
        ];
        
        let isCrowbar = false;
        let crowbarLineIdx = -1;
        const originalJennahSrc = jennahImg ? jennahImg.getAttribute('src') : '';
        
        function playCrowbarClang() {
            playBeep(1180, 0.045, 'triangle', 0.05);
            setTimeout(() => playBeep(1760, 0.07, 'sine', 0.045), 35);
            setTimeout(() => playBeep(880, 0.11, 'triangle', 0.04), 75);
        }
        
        function bindPanelCrowbarClick() {
            if (!isCrowbar || !DOM.panelImageContainer) return;
            const drawerImg = DOM.panelImageContainer.querySelector('img');
            if (!drawerImg || drawerImg.dataset.crowbarBound === 'true') return;
            
            drawerImg.dataset.crowbarBound = 'true';
            drawerImg.style.cursor = 'pointer';
            drawerImg.title = 'Click the Crowbar!';
            
            drawerImg.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = Math.floor(Math.random() * crowbarLines.length);
                if (crowbarLines.length > 1 && nextIdx === crowbarLineIdx) {
                    nextIdx = (nextIdx + 1) % crowbarLines.length;
                }
                crowbarLineIdx = nextIdx;
                
                let bubble = DOM.panelBody.querySelector('.panel-crowbar-quote');
                if (!bubble) {
                    bubble = document.createElement('div');
                    bubble.className = 'panel-crowbar-quote';
                    DOM.panelBody.prepend(bubble);
                }
                
                bubble.textContent = `🪛 ${crowbarLines[crowbarLineIdx]}`;
                bubble.classList.remove('is-pop');
                void bubble.offsetWidth;
                bubble.classList.add('is-pop');
                
                DOM.panelImageContainer.animate([
                    { transform: 'scale(1) rotate(0deg)' },
                    { transform: 'scale(1.09) rotate(-14deg)', offset: 0.35 },
                    { transform: 'scale(1.04) rotate(8deg)', offset: 0.7 },
                    { transform: 'scale(1) rotate(0deg)' }
                ], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const rect = DOM.panelImageContainer.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f97316', '#facc15', '#ef4444', '#ffffff'], 20);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                playCrowbarClang();
            });
        }
        
        STATE.onOpenCard.push((openedCard) => {
            if (openedCard === jennahCard && isCrowbar) {
                requestAnimationFrame(bindPanelCrowbarClick);
            }
            return false;
        });
        
        jennahCard.addEventListener('click', (e) => {
            if (e.detail === 1 && !isCrowbar) {
                spawnBadge(jennahCard, '🪛 *CLANG!*', 'quirk-star-glow', 950);
                playCrowbarClang();
            }
            
            if (!e._isTripleTap && e.detail !== 3) return;
            isCrowbar = !isCrowbar;
            
            jennahCard.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            
            setTimeout(() => {
                const monoEl = jennahCard.querySelector('.monogram-avatar');
                if (isCrowbar) {
                    if (monoEl) monoEl.style.display = 'none';
                    if (jennahImg) {
                        jennahImg.style.display = 'block';
                        jennahImg.src = crowbarSrc;
                        jennahImg.classList.add('is-crowbar-pfp');
                    }
                } else {
                    if (jennahImg) {
                        jennahImg.classList.remove('is-crowbar-pfp');
                        if (monoEl) {
                            jennahImg.style.display = 'none';
                            monoEl.style.display = 'flex';
                        } else {
                            jennahImg.src = originalJennahSrc;
                        }
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && jennahCard.classList.contains('active')) {
                    if (isCrowbar) {
                        DOM.panelImageContainer.innerHTML = `<img src="${crowbarSrc}" alt="Crowbar" class="is-crowbar-pfp">`;
                        bindPanelCrowbarClick();
                    } else {
                        const existingQuote = DOM.panelBody.querySelector('.panel-crowbar-quote');
                        if (existingQuote) existingQuote.remove();
                        if (monoEl) {
                            DOM.panelImageContainer.innerHTML = `<div class="panel-avatar monogram-avatar" style="width:100%;height:100%;font-size:64px;">${monoEl.textContent}</div>`;
                        } else if (jennahImg) {
                            DOM.panelImageContainer.innerHTML = `<img src="${originalJennahSrc}" alt="${jennahCard.querySelector('.overlay-text').textContent.trim()}">`;
                        }
                    }
                }
            }, 275);
            
            const rect = jennahCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f97316', '#facc15', '#ef4444', '#ffffff'], 26);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playCrowbarClang();
        });
    }
    
    const NIKI_GALLERY = [
        { src: 'otherPics/niki1.jpg',  line: '"ENGENE! Let’s own the stage tonight!"' },
        { src: 'otherPics/niki2.jpg',  line: '"Dance is how I speak without saying a single word."' },
        { src: 'otherPics/niki3.jpg',  line: '"Bite Me — synchronized down to every heartbeat."' },
        { src: 'otherPics/niki4.jpg',  line: '"From Okayama to the world stage — never stop practicing."' },
        { src: 'otherPics/niki5.jpg',  line: '"Dark Blood vibes locked in. Watch the footwork!"' },
        { src: 'otherPics/niki6.jpg',  line: '"Maknae on top! Who’s ready for the encore?"' },
        { src: 'otherPics/niki7.jpg',  line: '"Every choreo detail matters when the spotlight hits."' },
        { src: 'otherPics/niki8.jpg',  line: '"Even when things get tough, ENGENE gives me strength."' },
        { src: 'otherPics/niki9.jpg',  line: '"Sweet Venom — smooth, sharp, and unstoppable."' },
        { src: 'otherPics/niki10.jpg', line: '"Nishimura Riki mode: 100% locked in!"' }
    ];
    
    const arlesAltCard = cards.find(c => c.querySelector('.overlay-text')?.textContent.toLowerCase().includes('arles'));
    if (arlesAltCard) {
        const arlesImg = arlesAltCard.querySelector('img');
        const arlesNameEl = arlesAltCard.querySelector('.overlay-text');
        const origArlesSrc = arlesImg ? (arlesImg.getAttribute('src') || 'mainpics/Arles.jpg') : 'mainpics/Arles.jpg';
        const origArlesName = arlesNameEl ? arlesNameEl.textContent : 'Arles, Avinash Gabriel M.';
        let isNikiMode = false;
        let nikiSlideIdx = 0;
        
        function renderNikiQuoteInPanel() {
            if (!isNikiMode || !DOM.panelBody) return;
            const slide = NIKI_GALLERY[nikiSlideIdx];
            
            if (DOM.panelImageContainer) {
                DOM.panelImageContainer.innerHTML = `<img src="${slide.src}" alt="Ni-ki (Nishimura Riki)" class="is-niki-pfp">`;
                const drawerImg = DOM.panelImageContainer.querySelector('img');
                if (drawerImg) {
                    drawerImg.style.cursor = 'pointer';
                    drawerImg.title = 'Click Ni-ki to cycle all 10 photos & lines!';
                    if (drawerImg.dataset.nikiBound !== 'true') {
                        drawerImg.dataset.nikiBound = 'true';
                        drawerImg.addEventListener('click', (e) => {
                            e.stopPropagation();
                            nikiSlideIdx = (nikiSlideIdx + 1) % NIKI_GALLERY.length;
                            if (arlesImg) arlesImg.src = NIKI_GALLERY[nikiSlideIdx].src;
                            renderNikiQuoteInPanel();
                            
                            DOM.panelImageContainer.animate([
                                { transform: 'scale(1)' },
                                { transform: 'scale(1.07) rotate(-3deg)', offset: 0.4 },
                                { transform: 'scale(1)' }
                            ], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                            
                            const rect = DOM.panelImageContainer.getBoundingClientRect();
                            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f43f5e', '#fde047', '#38bdf8', '#ffffff'], 18);
                            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                            playBeep(659.25 + nikiSlideIdx * 35, 0.08, 'triangle', 0.045);
                        });
                    }
                }
            }
            
            let bubble = DOM.panelBody.querySelector('.panel-niki-quote');
            if (!bubble) {
                bubble = document.createElement('div');
                bubble.className = 'panel-zerotwo-quote panel-niki-quote';
                DOM.panelBody.prepend(bubble);
            }
            bubble.textContent = `${slide.line}`;
            bubble.classList.remove('is-pop');
            void bubble.offsetWidth;
            bubble.classList.add('is-pop');
        }
        
        STATE.onOpenCard.push((openedCard) => {
            if (openedCard === arlesAltCard && isNikiMode) {
                requestAnimationFrame(renderNikiQuoteInPanel);
            }
            return false;
        });
        
        arlesAltCard.addEventListener('click', (e) => {
            if (!e._isTripleTap && e.detail !== 3) return;
            isNikiMode = !isNikiMode;
            arlesAltCard.classList.toggle('is-niki-card', isNikiMode);
            
            if (isNikiMode) {
                nikiSlideIdx = 0;
                if (arlesImg) {
                    arlesImg.style.display = 'block';
                    arlesImg.src = NIKI_GALLERY[0].src;
                    arlesImg.classList.add('is-niki-pfp');
                }
                if (arlesNameEl) arlesNameEl.textContent = 'Ni-ki (Nishimura Riki)';
                spawnBadge(arlesAltCard, '🐆 NI-KI MODE!', 'quirk-star-glow', 1200);
            } else {
                if (arlesImg) {
                    arlesImg.src = origArlesSrc;
                    arlesImg.classList.remove('is-niki-pfp');
                }
                if (arlesNameEl) arlesNameEl.textContent = origArlesName;
                spawnBadge(arlesAltCard, '🎭 JENN V. BATUMBAKAL', 'quirk-star-glow', 1100);
            }
            
            if (DOM.panel && DOM.panel.classList.contains('active') && arlesAltCard.classList.contains('active')) {
                if (isNikiMode) {
                    renderNikiQuoteInPanel();
                } else {
                    const existingQuote = DOM.panelBody.querySelector('.panel-niki-quote');
                    if (existingQuote) existingQuote.remove();
                    if (DOM.panelImageContainer) {
                        DOM.panelImageContainer.innerHTML = `<img src="${origArlesSrc}" alt="${origArlesName}">`;
                    }
                }
            }
            
            const rect = arlesAltCard.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#f43f5e', '#38bdf8', '#fde047', '#ffffff'], 34);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                setTimeout(() => playBeep(f, 0.12, 'triangle', 0.05), idx * 60);
            });
        });
    }
    
    const escCfg = CONFIG.cynEscalationConfig;
    const uziCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('abrena'));
    if (uziCard && localStorage.getItem(escCfg.storageKey) === 'true') {
        const uziWrapper = uziCard.parentElement;
        if (uziWrapper && !uziWrapper.querySelector('.pip-solver-uzi')) {
            const solverPip = document.createElement('span');
            solverPip.className = 'portrait-role-pip pip-solver-uzi';
            solverPip.textContent = '⬡';
            solverPip.title = 'Absolute Solver Host (Callback Ping)';
            uziWrapper.appendChild(solverPip);
        }
    }
    const cacebCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('abrena'));
    if (cacebCard) {
        const cynImageSrc = 'otherpics/Cyn.jpg';
        const solverSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="#090702"/>
                <circle cx="100" cy="100" r="88" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="8 6" opacity="0.5"/>
                <g fill="none" stroke="#facc15" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
                    <polygon points="100,66 130,118 70,118"/>
                    <line x1="100" y1="66" x2="100" y2="24"/>
                    <polygon points="100,16 91,30 109,30" fill="#facc15"/>
                    <line x1="130" y1="118" x2="166" y2="139"/>
                    <polygon points="174,144 157,144 166,129" fill="#facc15"/>
                    <line x1="70" y1="118" x2="34" y2="139"/>
                    <polygon points="26,144 43,144 34,129" fill="#facc15"/>
                </g>
                <circle cx="100" cy="101" r="7" fill="#fef08a"/>
            </svg>
        `)}`;
            
            let resolvedCynSrc = cynImageSrc;
            const probeCyn = new Image();
            probeCyn.onerror = () => {
                resolvedCynSrc = solverSvg;
            };
            probeCyn.src = cynImageSrc;
            
            let tripleIndex = 0;
            let panelBag = [];
            let lastCynSpeech = CONFIG.cynTripleClickLines[0].speech;
            let mainCardClickCount = 0;
            let callbackRunning = false;
            const cardImg = cacebCard.querySelector('img');
            const originalImageSrc = cardImg ? cardImg.src : '';
            let preferredCynVoice = null;   
            function getNextPanelLine() {
                if (!panelBag.length) {
                    panelBag = [...CONFIG.cynPanelClickLines].sort(() => Math.random() - 0.5);
                }
                return panelBag.pop();
            }
            function pickCynVoice() {
                if (!('speechSynthesis' in window)) return null;
                const voices = window.speechSynthesis.getVoices();
                if (!voices.length) return null;
                
                const femaleKeywords = ['zira', 'aria', 'jenny', 'samantha', 'victoria', 'google us english', 'google uk english female', 'female', 'woman', 'hazel', 'susan', 'eva', 'natasha'];
                const enVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
                const pool = enVoices.length ? enVoices : voices;
                
                for (const kw of femaleKeywords) {
                    const match = pool.find(v => v.name.toLowerCase().includes(kw));
                    if (match) return match;
                }
                return pool.find(v => !v.name.toLowerCase().includes('david') && !v.name.toLowerCase().includes('mark') && !v.name.toLowerCase().includes('male')) || pool[0];
            }
            
            if ('speechSynthesis' in window) {
                preferredCynVoice = pickCynVoice();
                window.speechSynthesis.onvoiceschanged = () => {
                    preferredCynVoice = pickCynVoice();
                };
            }
            
            function getCynPhonemeTokens(word) {
                const overrides = {
                    'wave':          ['w', 'ay', 'v'],
                    'game':          ['g', 'ay', 'm'],
                    'make':          ['m', 'ay', 'k'],
                    'take':          ['t', 'ay', 'k'],
                    'late':          ['l', 'ay', 't'],
                    'face':          ['f', 'ay', 's'],
                    'place':         ['p', 'l', 'ay', 's'],
                    'save':          ['s', 'ay', 'v'],
                    'giggle':        ['g', 'i', 'g', 'l'],
                    'little':        ['l', 'i', 't', 'l'],
                    'people':        ['p', 'ee', 'p', 'l'],
                    'firewall':      ['f', 'ai', 'r', 'w', 'o', 'l'],
                    'motherboard':   ['m', 'u', 'th', 'r', 'b', 'o', 'r', 'd'],
                    'assimilate':    ['u', 's', 'i', 'm', 'i', 'l', 'ay', 't'],
                    'assimilation':  ['u', 's', 'i', 'm', 'i', 'l', 'ay', 'sh', 'n'],
                    'administrator': ['a', 'd', 'm', 'i', 'n', 'i', 's', 't', 'r', 'ay', 't', 'r'],
                    'invitation':    ['i', 'n', 'v', 'i', 't', 'ay', 'sh', 'n'],
                    'curiosity':     ['k', 'y', 'oo', 'r', 'ee', 'o', 's', 'i', 't', 'ee'],
                    'delicious':     ['d', 'i', 'l', 'i', 'sh', 'u', 's'],
                    'annoyed':       ['u', 'n', 'o', 'y', 'd'],
                    'expression':    ['e', 'k', 's', 'p', 'r', 'e', 'sh', 'n'],
                    'patience':      ['p', 'ay', 'sh', 'n', 's'],
                    'reformat':      ['r', 'ee', 'f', 'o', 'r', 'm', 'a', 't'],
                    'permission':    ['p', 'r', 'm', 'i', 'sh', 'n'],
                    'permissions':   ['p', 'r', 'm', 'i', 'sh', 'n', 'z'],
                    'predictable':   ['p', 'r', 'i', 'd', 'i', 'k', 't', 'u', 'b', 'l'],
                    'directives':    ['d', 'i', 'r', 'e', 'k', 't', 'i', 'v', 'z'],
                    'repetitive':    ['r', 'i', 'p', 'e', 't', 'i', 't', 'i', 'v'],
                    'irritated':     ['i', 'r', 'i', 't', 'ay', 't', 'i', 'd'],
                    'irritation':    ['i', 'r', 'i', 't', 'ay', 'sh', 'n'],
                    'processing':    ['p', 'r', 'o', 's', 'e', 's', 'i', 'ng'],
                    'calculating':   ['k', 'a', 'l', 'k', 'y', 'oo', 'l', 'ay', 't', 'i', 'ng'],
                    'engagement':    ['e', 'n', 'g', 'ay', 'j', 'm', 'n', 't'],
                    'metrics':       ['m', 'e', 't', 'r', 'i', 'k', 's'],
                    'coordinates':   ['k', 'o', 'o', 'r', 'd', 'i', 'n', 'ay', 't', 's'],
                    'overwriting':   ['o', 'v', 'r', 'r', 'ai', 't', 'i', 'ng'],
                    'established':   ['e', 's', 't', 'a', 'b', 'l', 'i', 'sh', 't'],
                    'connection':    ['k', 'u', 'n', 'e', 'k', 'sh', 'n'],
                    'initiated':     ['i', 'n', 'i', 'sh', 'ee', 'ay', 't', 'i', 'd'],
                    'imminent':      ['i', 'm', 'i', 'n', 'n', 't'],
                    'persistent':    ['p', 'r', 's', 'i', 's', 't', 'n', 't'],
                    'together':      ['t', 'oo', 'g', 'e', 'th', 'r'],
                    'naughty':       ['n', 'o', 't', 'ee'],
                    'light':         ['l', 'ai', 't'],
                    'tight':         ['t', 'ai', 't'],
                    'bite':          ['b', 'ai', 't'],
                    'smile':         ['s', 'm', 'ai', 'l'],
                    'wide':          ['w', 'ai', 'd'],
                    'inside':        ['i', 'n', 's', 'ai', 'd'],
                    'outside':       ['ou', 't', 's', 'ai', 'd'],
                    'polite':        ['p', 'o', 'l', 'ai', 't'],
                    'quite':         ['k', 'w', 'ai', 't'],
                    'nice':          ['n', 'ai', 's'],
                    'nicely':        ['n', 'ai', 's', 'l', 'ee'],
                    'cease':         ['s', 'ee', 's'],
                    'please':        ['p', 'l', 'ee', 'z'],
                    'mercy':         ['m', 'r', 's', 'ee'],
                    'already':       ['o', 'l', 'r', 'e', 'd', 'ee'],
                    'really':        ['r', 'ee', 'l', 'ee'],
                    'funny':         ['f', 'u', 'n', 'ee'],
                    'sneaky':        ['s', 'n', 'ee', 'k', 'ee'],
                    'creepy':        ['k', 'r', 'ee', 'p', 'ee'],
                    'tasty':         ['t', 'ay', 's', 't', 'ee'],
                    'scary':         ['s', 'k', 'e', 'r', 'ee'],
                    'eldritch':      ['e', 'l', 'd', 'r', 'i', 'ch'],
                    'mango':         ['m', 'a', 'ng', 'g', 'o'],
                    'oil':           ['o', 'y', 'l'],
                    'void':          ['v', 'o', 'y', 'd'],
                    'core':          ['k', 'o', 'r'],
                    'cores':         ['k', 'o', 'r', 'z'],
                    'more':          ['m', 'o', 'r'],
                    'before':        ['b', 'i', 'f', 'o', 'r'],
                    'here':          ['h', 'i', 'r'],
                    'there':         ['th', 'e', 'r'],
                    'where':         ['w', 'e', 'r'],
                    'wear':          ['w', 'e', 'r'],
                    'glare':         ['g', 'l', 'e', 'r'],
                    'stare':         ['s', 't', 'e', 'r'],
                    'are':           ['a', 'r'],
                    'aren':          ['a', 'r', 'n'],
                    'you':           ['y', 'oo'],
                    'your':          ['y', 'o', 'r'],
                    'the':           ['th', 'u'],
                    'to':            ['t', 'oo'],
                    'too':           ['t', 'oo'],
                    'do':            ['d', 'oo'],
                    'who':           ['h', 'oo'],
                    'nowhere':       ['n', 'o', 'w', 'e', 'r'],
                    'monotone':      ['m', 'o', 'n', 'o', 't', 'o', 'n'],
                    'drone':         ['d', 'r', 'o', 'n'],
                    'alone':         ['u', 'l', 'o', 'n'],
                    'close':         ['k', 'l', 'o', 's'],
                    'poke':          ['p', 'o', 'k'],
                    'poking':        ['p', 'o', 'k', 'i', 'ng'],
                    'broken':        ['b', 'r', 'o', 'k', 'n'],
                    'flesh':         ['f', 'l', 'e', 'sh'],
                    'fleshbag':      ['f', 'l', 'e', 'sh', 'b', 'a', 'g'],
                    'eye':           ['ai'],
                    'eyes':          ['ai', 'z']
                };
                
                const phonemes = {
                    'ee': { f1: 310, f2: 2650, f3: 3300, dur: 0.115, voiced: true, vowel: true },
                    'ea': { f1: 330, f2: 2550, f3: 3200, dur: 0.110, voiced: true, vowel: true },
                    'oo': { f1: 330, f2: 880,  f3: 2350, dur: 0.115, voiced: true, vowel: true },
                    'ou': { f1: 590, f2: 920,  f3: 2450, dur: 0.115, voiced: true, vowel: true },
                    'ai': { f1: 480, f2: 2150, f3: 2850, dur: 0.110, voiced: true, vowel: true },
                    'ay': { f1: 480, f2: 2150, f3: 2850, dur: 0.115, voiced: true, vowel: true },
                    'oy': { f1: 520, f2: 1450, f3: 2650, dur: 0.115, voiced: true, vowel: true },
                    'sh': { f1: 300, f2: 1950, f3: 3600, dur: 0.085, voiced: false, noise: 0.65, nFreq: 3400 },
                    'ch': { f1: 280, f2: 2050, f3: 3700, dur: 0.075, voiced: false, noise: 0.70, nFreq: 3600, stop: true },
                    'th': { f1: 340, f2: 1550, f3: 2700, dur: 0.068, voiced: true,  noise: 0.35, nFreq: 4200 },
                    'ng': { f1: 270, f2: 1950, f3: 2600, dur: 0.078, voiced: true,  nasal: true },
                    'a':  { f1: 760, f2: 1220, f3: 2650, dur: 0.102, voiced: true, vowel: true },
                    'e':  { f1: 540, f2: 1980, f3: 2750, dur: 0.095, voiced: true, vowel: true },
                    'i':  { f1: 320, f2: 2500, f3: 3200, dur: 0.092, voiced: true, vowel: true },
                    'o':  { f1: 560, f2: 910,  f3: 2550, dur: 0.105, voiced: true, vowel: true },
                    'u':  { f1: 360, f2: 1020, f3: 2400, dur: 0.098, voiced: true, vowel: true },
                    'y':  { f1: 320, f2: 2450, f3: 3150, dur: 0.085, voiced: true, vowel: true },
                    'm':  { f1: 270, f2: 950,  f3: 2350, dur: 0.072, voiced: true, nasal: true },
                    'n':  { f1: 270, f2: 1550, f3: 2450, dur: 0.072, voiced: true, nasal: true },
                    'l':  { f1: 370, f2: 1380, f3: 2750, dur: 0.068, voiced: true },
                    'r':  { f1: 440, f2: 1420, f3: 1780, dur: 0.068, voiced: true },
                    'w':  { f1: 310, f2: 780,  f3: 2350, dur: 0.068, voiced: true },
                    'v':  { f1: 330, f2: 1250, f3: 2450, dur: 0.065, voiced: true, noise: 0.30, nFreq: 3500 },
                    'z':  { f1: 310, f2: 1750, f3: 2900, dur: 0.075, voiced: true, noise: 0.48, nFreq: 4800 },
                    'b':  { f1: 230, f2: 880,  f3: 2250, dur: 0.052, voiced: true, stop: true },
                    'd':  { f1: 250, f2: 1750, f3: 2700, dur: 0.052, voiced: true, stop: true },
                    'g':  { f1: 250, f2: 1320, f3: 2300, dur: 0.055, voiced: true, stop: true },
                    's':  { f1: 300, f2: 1900, f3: 4400, dur: 0.078, voiced: false, noise: 0.72, nFreq: 5400 },
                    'f':  { f1: 310, f2: 1300, f3: 3400, dur: 0.072, voiced: false, noise: 0.48, nFreq: 4400 },
                    'h':  { f1: 520, f2: 1650, f3: 2750, dur: 0.062, voiced: false, noise: 0.42, nFreq: 2600 },
                    'p':  { f1: 230, f2: 880,  f3: 2250, dur: 0.052, voiced: false, noise: 0.55, nFreq: 2800, stop: true },
                    't':  { f1: 250, f2: 1850, f3: 2950, dur: 0.052, voiced: false, noise: 0.62, nFreq: 4200, stop: true },
                    'k':  { f1: 250, f2: 1400, f3: 2450, dur: 0.055, voiced: false, noise: 0.58, nFreq: 3100, stop: true },
                    'c':  { f1: 250, f2: 1400, f3: 2450, dur: 0.055, voiced: false, noise: 0.58, nFreq: 3100, stop: true },
                    'q':  { f1: 250, f2: 1200, f3: 2300, dur: 0.058, voiced: false, noise: 0.55, nFreq: 2900 },
                    'x':  { f1: 300, f2: 1850, f3: 4100, dur: 0.085, voiced: false, noise: 0.68, nFreq: 4900 },
                    'j':  { f1: 290, f2: 2050, f3: 2900, dur: 0.068, voiced: true, noise: 0.42, nFreq: 3600 }
                };
                if (overrides[word]) {
                    return overrides[word].map(k => phonemes[k] || phonemes['e']);
                }
                let normalized = word
                .replace(/tion\b/g, 'shn')
                .replace(/sion\b/g, 'shn')
                .replace(/ight\b/g, 'ait')
                .replace(/([bcdfghjklmnpqrstvwxz])\1+/g, '$1');
                if (normalized.length > 3 && normalized.endsWith('e') && !normalized.endsWith('ee')) {
                    normalized = normalized.slice(0, -1);
                }
                const out = [];
                let idx = 0;
                while (idx < normalized.length) {
                    const pair = normalized.slice(idx, idx + 2);
                    if (phonemes[pair]) {
                        out.push(phonemes[pair]);
                        idx += 2;
                    } else {
                        out.push(phonemes[normalized[idx]] || phonemes['e']);
                        idx += 1;
                    }
                }
                return out;
            }
            function buildCynSynthGraph(ctx, now) {
                const glottalOsc = ctx.createOscillator();
                const formantPulse = ctx.createOscillator();
                glottalOsc.type = 'sawtooth';
                formantPulse.type = 'square';
                
                const pulseMix = ctx.createGain();
                pulseMix.gain.setValueAtTime(0.22, now);
                formantPulse.connect(pulseMix);
                
                const tremorLfo = ctx.createOscillator();
                const tremorDepth = ctx.createGain();
                tremorLfo.type = 'sine';
                tremorLfo.frequency.setValueAtTime(29, now);
                tremorDepth.gain.setValueAtTime(3.5, now);
                tremorLfo.connect(tremorDepth);
                tremorDepth.connect(glottalOsc.frequency);
                tremorDepth.connect(formantPulse.frequency);
                
                const voiceGain = ctx.createGain();
                voiceGain.gain.setValueAtTime(0.0001, now);
                
                const f1 = ctx.createBiquadFilter();
                const f2 = ctx.createBiquadFilter();
                const f3 = ctx.createBiquadFilter();
                f1.type = 'bandpass';
                f2.type = 'bandpass';
                f3.type = 'bandpass';
                f1.Q.setValueAtTime(3.4, now);
                f2.Q.setValueAtTime(4.2, now);
                f3.Q.setValueAtTime(4.8, now);
                
                const f1Gain = ctx.createGain();
                const f2Gain = ctx.createGain();
                const f3Gain = ctx.createGain();
                f1Gain.gain.setValueAtTime(0.95, now);
                f2Gain.gain.setValueAtTime(0.85, now);
                f3Gain.gain.setValueAtTime(0.65, now);
                
                const clarityShelf = ctx.createBiquadFilter();
                clarityShelf.type = 'highshelf';
                clarityShelf.frequency.setValueAtTime(2600, now);
                clarityShelf.gain.setValueAtTime(9.5, now);
                
                const highpass = ctx.createBiquadFilter();
                highpass.type = 'highpass';
                highpass.frequency.setValueAtTime(190, now);
                
                const bufferSize = Math.floor(ctx.sampleRate * 1.5);
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                const noiseSource = ctx.createBufferSource();
                noiseSource.buffer = noiseBuffer;
                noiseSource.loop = true;
                
                const noiseFilter = ctx.createBiquadFilter();
                noiseFilter.type = 'bandpass';
                noiseFilter.frequency.setValueAtTime(4200, now);
                noiseFilter.Q.setValueAtTime(1.8, now);
                
                const noiseGain = ctx.createGain();
                noiseGain.gain.setValueAtTime(0.0001, now);
                
                const masterGain = ctx.createGain();
                masterGain.gain.setValueAtTime(0.26, now);
                
                glottalOsc.connect(voiceGain);
                pulseMix.connect(voiceGain);
                
                voiceGain.connect(f1);
                voiceGain.connect(f2);
                voiceGain.connect(f3);
                
                f1.connect(f1Gain);
                f2.connect(f2Gain);
                f3.connect(f3Gain);
                
                f1Gain.connect(clarityShelf);
                f2Gain.connect(clarityShelf);
                f3Gain.connect(clarityShelf);
                
                noiseSource.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(clarityShelf);
                
                clarityShelf.connect(highpass);
                highpass.connect(masterGain);
                masterGain.connect(ctx.destination);
                
                return {
                    glottalOsc, formantPulse, tremorLfo, tremorDepth,
                    voiceGain, f1, f2, f3, noiseSource, noiseFilter, noiseGain, masterGain
                };
            }
            function speakCynLine(speechText) {
                [880, 622.25, 932.33, 440].forEach((freq, i) => {
                    setTimeout(() => playBeep(freq, 0.055, 'sawtooth', 0.03), i * 50);
                });
                
                if (STATE.soundMuted) return;
                const ctx = getAudioContext();
                if (!ctx) return;
                
                if (window._cynStopActiveSpeech) {
                    window._cynStopActiveSpeech();
                }
                
                const isThreat = /assimilate|reformat|skin|eat|consume|motherboard|snap|error|warning|override|delete|host|imminent|end|dead|kill/i.test(speechText);
                
                const cleanText = speechText
                .replace(/\[.*?\]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9\s.,!?']/g, '')
                .replace(/\s+/g, ' ')
                .trim();
                
                if (!cleanText) return;
                
                const now = ctx.currentTime + 0.03;
                const g = buildCynSynthGraph(ctx, now);
                
                const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(Boolean);
                let t = now;
                
                g.glottalOsc.frequency.setValueAtTime(311.13, t);
                g.formantPulse.frequency.setValueAtTime(311.13, t);
                
                sentences.forEach((sentence, sIdx) => {
                    const words = sentence.split(' ').filter(Boolean);
                    const isStagePrompt = sIdx === 0 && sentences.length > 1 && words.length <= 3;
                    const isMenacingSentence = isThreat && sIdx === sentences.length - 1 && sentences.length > 1;
                    
                    words.forEach((word, wIdx) => {
                        const rawWord = word.replace(/[.,!?']/g, '');
                        if (!rawWord) return;
                        
                        const tokens = getCynPhonemeTokens(rawWord);
                        const isLastWord = wIdx === words.length - 1;
                        const isQuestion = word.endsWith('?');
                        
                        let baseFreq;
                        if (isStagePrompt) {
                            baseFreq = 293.66;
                        } else if (isMenacingSentence) {
                            baseFreq = isLastWord ? 196.00 : 220.00;
                        } else if (isQuestion && isLastWord) {
                            baseFreq = 349.23;
                        } else if (isLastWord) {
                            baseFreq = 277.18;
                        } else {
                            baseFreq = 311.13;
                        }
                        
                        g.glottalOsc.frequency.setValueAtTime(baseFreq, t);
                        g.formantPulse.frequency.setValueAtTime(baseFreq, t);
                        
                        if (isMenacingSentence) {
                            g.tremorDepth.gain.setValueAtTime(7.0, t);
                            g.tremorLfo.frequency.setValueAtTime(34, t);
                        } else if (isStagePrompt) {
                            g.tremorDepth.gain.setValueAtTime(0.9, t);
                            g.tremorLfo.frequency.setValueAtTime(22, t);
                        } else {
                            g.tremorDepth.gain.setValueAtTime(1.6, t);
                            g.tremorLfo.frequency.setValueAtTime(26, t);
                        }
                        
                        tokens.forEach((spec, pIdx) => {
                            const stretch = (!isStagePrompt && spec.vowel && (isLastWord && pIdx === tokens.length - 1)) ? 1.25 : 0.90;
                            const dur = spec.dur * stretch;
                            
                            const formantScale = isMenacingSentence ? 1.04 : 1.18;
                            g.f1.frequency.setTargetAtTime(spec.f1 * formantScale, t, 0.008);
                            g.f2.frequency.setTargetAtTime(spec.f2 * formantScale, t, 0.008);
                            g.f3.frequency.setTargetAtTime(spec.f3 * formantScale, t, 0.008);
                            
                            if (spec.nFreq) {
                                g.noiseFilter.frequency.setTargetAtTime(spec.nFreq, t, 0.006);
                            }
                            
                            if (spec.stop) {
                                g.voiceGain.gain.setTargetAtTime(0.0001, t, 0.004);
                                g.noiseGain.gain.setTargetAtTime(0.0001, t, 0.004);
                                const burstAt = t + dur * 0.45;
                                g.voiceGain.gain.setTargetAtTime(spec.voiced ? 0.92 : 0.0001, burstAt, 0.005);
                                g.noiseGain.gain.setTargetAtTime(spec.noise ? spec.noise * 0.48 : 0.0001, burstAt, 0.005);
                            } else {
                                g.voiceGain.gain.setTargetAtTime(spec.voiced ? (spec.nasal ? 0.62 : 0.95) : 0.0001, t, 0.007);
                                g.noiseGain.gain.setTargetAtTime(spec.noise ? spec.noise * 0.44 : 0.0001, t, 0.007);
                            }
                            
                            t += dur;
                        });
                        
                        g.voiceGain.gain.setTargetAtTime(0.0001, t, 0.006);
                        g.noiseGain.gain.setTargetAtTime(0.0001, t, 0.006);
                        t += isLastWord ? 0.16 : 0.036;
                    });
                });
                
                const stopTime = t + 0.08;
                g.glottalOsc.start(now);
                g.formantPulse.start(now);
                g.tremorLfo.start(now);
                g.noiseSource.start(now);
                
                g.glottalOsc.stop(stopTime);
                g.formantPulse.stop(stopTime);
                g.tremorLfo.stop(stopTime);
                g.noiseSource.stop(stopTime);
                
                window._cynStopActiveSpeech = () => {
                    try {
                        const killTime = ctx.currentTime;
                        g.masterGain.gain.cancelScheduledValues(killTime);
                        g.masterGain.gain.setValueAtTime(0.0001, killTime);
                        g.glottalOsc.stop(killTime + 0.01);
                        g.formantPulse.stop(killTime + 0.01);
                        g.tremorLfo.stop(killTime + 0.01);
                        g.noiseSource.stop(killTime + 0.01);
                    } catch (_) { }
                    window._cynStopActiveSpeech = null;
                };
            }
            
            
            
            function runCallbackPingSequence() {
                if (callbackRunning) return;
                callbackRunning = true;
                
                if (window._cynStopActiveSpeech) {
                    window._cynStopActiveSpeech();
                }
                
                document.body.classList.add('cyn-input-lockdown');
                window.addEventListener('keydown', (ev) => {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                }, true);
                
                closePanel();
                
                const overlay = document.createElement('div');
                overlay.className = 'cyn-callback-overlay';
                overlay.innerHTML = `
                <div class="cyn-callback-ping-tag" id="cynPingTag">⬡ [CALLBACK PING]</div>
                <div class="cyn-callback-smile" id="cynPingText">INITIALIZING...</div>
            `;
                document.body.appendChild(overlay);
                
                const tagEl = overlay.querySelector('#cynPingTag');
                const textEl = overlay.querySelector('#cynPingText');
                
                escCfg.callbackPingSequence.forEach((step, idx) => {
                    setTimeout(() => {
                        const cleanBody = step.speech.replace(/^\[CALLBACK PING\]\.?\s*/i, '');
                        tagEl.textContent = `⬡ [CALLBACK PING // 0${idx + 1}]`;
                        textEl.textContent = cleanBody;
                        
                        triggerScreenGlitch(180);
                        
                        const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
                        const ry = window.innerHeight * (0.2 + Math.random() * 0.6);
                        spawnBurst(rx, ry, ['#facc15', '#c084fc', '#ffffff'], 34);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        
                        if (idx === escCfg.callbackPingSequence.length - 1) {
                            localStorage.setItem(escCfg.storageKey, 'true');
                            setTimeout(() => {
                                window.location.reload();
                            }, escCfg.refreshDelay);
                        }
                    }, idx * escCfg.sequenceStepDelay);
                });
            }
            function clearCynCaptions() {
                document.querySelectorAll('.cyn-voice-caption').forEach(el => el.remove());
            }
            
            function syncCynSidePanel(speechText) {
                if (!DOM.panel || !DOM.panel.classList.contains('active')) return;
                const activeCard = document.querySelector('.PeoplePics.active');
                const isSolverOnCaceb = activeCard === cacebCard && cacebCard.classList.contains('quirk-cyn-solver');
                
                DOM.panelImageContainer.classList.toggle('cyn-voice-ready', isSolverOnCaceb);
                if (!isSolverOnCaceb) {
                    clearCynCaptions();
                    return;
                }
                
                const panelImg = DOM.panelImageContainer.querySelector('img');
                const panelName = DOM.panelBody.querySelector('.panel-name');
                const bioText = DOM.panelBody.querySelector('.bio-text');
                
                if (panelImg) panelImg.src = resolvedCynSrc;
                if (panelName) panelName.innerHTML = 'Abrena, Caleb <span style="color:var(--solver-color);">[CYN // SOLVER]</span>';
                if (bioText) bioText.textContent = 'Hello, User.';
                
                let captionBox = document.querySelector('.cyn-voice-caption');
                if (!captionBox) {
                    captionBox = document.createElement('div');
                    captionBox.className = 'cyn-voice-caption';
                    DOM.panelImageContainer.insertAdjacentElement('afterend', captionBox);
                }
                captionBox.textContent = `${speechText}`;
            }
            
            STATE.onOpenCard.push((card) => {
                requestAnimationFrame(() => {
                    if (card === cacebCard && cacebCard.classList.contains('quirk-cyn-solver')) {
                        syncCynSidePanel(lastCynSpeech);
                    } else {
                        DOM.panelImageContainer.classList.remove('cyn-voice-ready');
                        clearCynCaptions();
                    }
                });
                return false;
            });
            
            if (DOM.panelImageContainer) {
                DOM.panelImageContainer.addEventListener('click', () => {
                    const activeCard = document.querySelector('.PeoplePics.active');
                    if (activeCard !== cacebCard || !cacebCard.classList.contains('quirk-cyn-solver')) return;
                    
                    const lineObj = getNextPanelLine();
                    lastCynSpeech = lineObj.speech;
                    
                    speakCynLine(lastCynSpeech);
                    syncCynSidePanel(lastCynSpeech);
                    triggerScreenGlitch(90);
                    
                    const rect = DOM.panelImageContainer.getBoundingClientRect();
                    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#fef08a', '#ffffff'], 20);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                });
            }
            
            STATE.onClosePanel.push(() => {
                DOM.panelImageContainer.classList.remove('cyn-voice-ready');
                clearCynCaptions();
            });
            
            cacebCard.addEventListener('click', (e) => {
                if (callbackRunning) return;
                
                if (e._isTripleTap || e.detail === 5) {
                    const alreadyActive = cacebCard.classList.contains('quirk-cyn-solver');
                    const rect = cacebCard.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    
                    if (!alreadyActive) {
                        cacebCard.classList.add('quirk-cyn-solver');
                        lockCynHistory();
                        mainCardClickCount = 0;
                        
                        const lineObj = CONFIG.cynTripleClickLines[tripleIndex % CONFIG.cynTripleClickLines.length];
                        tripleIndex++;
                        lastCynSpeech = lineObj.speech;
                        
                        if (cardImg) cardImg.src = resolvedCynSrc;
                        spawnBadge(cacebCard, `${lineObj.badge} ${lineObj.speech}`, 'quirk-cyn-badge', 1600);
                        speakCynLine(lastCynSpeech);
                        triggerScreenGlitch(140);
                        spawnBurst(cx, cy, ['#facc15', '#fef08a', '#ffffff', '#000000'], 32);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        requestAnimationFrame(() => syncCynSidePanel(lastCynSpeech));
                    } else {
                        const refuseLine = 'Giggle. Nice try, little administrator. I am not going anywhere.';
                        lastCynSpeech = refuseLine;
                        spawnBadge(cacebCard, `⬡ [OVERRIDE LOCKED] ${refuseLine}`, 'quirk-cyn-badge', 1700);
                        speakCynLine(refuseLine);
                        triggerScreenGlitch(160);
                        spawnBurst(cx, cy, ['#facc15', '#ef4444', '#ffffff'], 28);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        requestAnimationFrame(() => syncCynSidePanel(lastCynSpeech));
                    }
                    return;
                }
                
                if (cacebCard.classList.contains('quirk-cyn-solver') && e.detail === 1) {
                    mainCardClickCount++;
                    
                    if (mainCardClickCount > escCfg.clickThreshold) {
                        const annoyIdx = mainCardClickCount - (escCfg.clickThreshold + 1);
                        if (annoyIdx < escCfg.annoyanceLines.length) {
                            const lineSpeech = escCfg.annoyanceLines[annoyIdx].speech;
                            spawnBadge(cacebCard, `⬡ ${lineSpeech}`, 'quirk-cyn-badge', 1600);
                            speakCynLine(lineSpeech);
                            triggerScreenGlitch(110);
                        } else {
                            runCallbackPingSequence();
                        }
                    }
                }
            });
        }
        
        const giechelleCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('tan'));
        const reccaCard = cards.find(c => c.querySelector('.overlay-text').textContent.toLowerCase().includes('amadora'));
        
        if (giechelleCard && reccaCard) {
            function popPartnerHeart(targetCard) {
                const rect = targetCard.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                
                targetCard.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.12)', offset: 0.4 },
                    { transform: 'scale(1)' }
                ], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                
                const heartPop = document.createElement('div');
                heartPop.className = 'gxr-floating-heart';
                heartPop.textContent = '💘';
                heartPop.style.left = `${cx}px`;
                heartPop.style.top = `${cy}px`;
                document.body.appendChild(heartPop);
                setTimeout(() => heartPop.remove(), 3000);
                
                spawnBurst(cx, cy, ['#f472b6', '#ef4444', '#ffffff'], 20);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                    setTimeout(() => playBeep(f, 0.12, 'triangle', 0.045), i * 70);
                });
            }
            
            giechelleCard.addEventListener('click', (e) => {
                if (e.detail === 3) popPartnerHeart(reccaCard);
            });
            reccaCard.addEventListener('click', (e) => {
                if (e.detail === 3) popPartnerHeart(giechelleCard);
            });
            
            function triggerGxRHearts() {
                const heartSymbols = ['💖', '💕', '💗', '💓', '✨'];
                const pair = [giechelleCard, reccaCard];
                
                pair.forEach((card, cardIdx) => {
                    if (card.classList.contains('is-filtered-out')) return;
                    const rect = card.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    
                    card.animate([
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.14)', offset: 0.4 },
                        { transform: 'scale(1)' }
                    ], { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                    
                    spawnBurst(cx, cy, ['#f472b6', '#ef4444', '#fde047', '#ffffff'], 26);
                    
                    for (let i = 0; i < 7; i++) {
                        setTimeout(() => {
                            const h = document.createElement('div');
                            h.className = 'gxr-floating-heart';
                            h.textContent = heartSymbols[(i + cardIdx) % heartSymbols.length];
                            const offsetX = (Math.random() - 0.5) * 76;
                            const offsetY = (Math.random() - 0.5) * 30;
                            h.style.left = `${cx + offsetX}px`;
                            h.style.top = `${cy + offsetY}px`;
                            document.body.appendChild(h);
                            setTimeout(() => h.remove(), 3000);
                        }, i * 110);
                    }
                });
                
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                
                const banner = document.createElement('div');
                banner.className = 'gxr-love-banner';
                banner.textContent = ' G × R ';
                document.body.appendChild(banner);
                setTimeout(() => banner.remove(), 2200);
                
                [523.25, 659.25, 783.99, 987.77, 1046.50].forEach((freq, idx) => {
                    setTimeout(() => playBeep(freq, 0.16, 'sine', 0.045), idx * 85);
                });
            }
            
            let gxrBuffer = '';
            window.addEventListener('keydown', (e) => {
                if (e.key.length !== 1) return;
                const ch = e.key.toUpperCase();
                if (ch === ' ') return;
                gxrBuffer = (gxrBuffer + ch).slice(-3);
                if (gxrBuffer === 'GXR') {
                    gxrBuffer = '';
                    triggerGxRHearts();
                }
            });
            
            STATE.onSearchInput.push((val) => {
                if (val.replace(/\s+/g, '') === 'gxr') {
                    DOM.searchInput.value = '';
                    filterCards();
                    triggerGxRHearts();
                    return true;
                }
            });
        }
        /*
        SIR BEFORE YOU FLAME ME FOR TS
        THEY CONSENTED TO THIS
        THEY AGREED TO IT
        SUPPOSE IT DOESN'T WORK OUT
        THEN
        I'LL REMOVE IT
        */
    }
    /*let caught = false;
    
    function checkDevTools() {
    if (caught) return;
    
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
    caught = true;
    triggerEasterEgg();
    }
    
    }
    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
    const ctrlOrCmd = e.ctrlKey || e.metaKey;
    
    if (
    e.key === "F12" ||
    (ctrlOrCmd && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
    (ctrlOrCmd && key === "u")
    ) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof triggerEasterEgg === "function" && !caught) {
    caught = true;
    triggerEasterEgg();
    }
    }
    }, true);
    
    window.addEventListener("blur", checkDevTools);
    window.addEventListener("resize", checkDevTools);
    
    function triggerEasterEgg() {
    console.clear();
    console.log(
    "%c👀 CAUGHT! Clicking into DevTools won't save you.",
    "color: red; font-size: 20px; font-weight: bold;"
    );
    
    const videoUrl = new URL("music/nostalgia.mp4", window.location.href).href;
    const rickTab = window.open("", "_blank");
    
    if (rickTab) {
    rickTab.document.write(`
    <!DOCTYPE html>
    <html>
    <head><title>👀 CAUGHT</title></head>
    <body style="margin:0;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;height:100vh;cursor:pointer;">
    <video id="v" src="${videoUrl}" autoplay playsinline style="width:100%;height:100%;object-fit:contain;"></video>
    <div id="unmute" style="display:none;position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:rgba(220,38,38,0.95);color:#fff;font:900 18px system-ui,sans-serif;padding:12px 24px;border-radius:999px;border:2px solid #fde047;box-shadow:0 0 24px rgba(0,0,0,0.9);pointer-events:none;">
    🔊 CLICK ANYWHERE FOR AUDIO
    </div>
    <script>
    const v = document.getElementById("v");
    const badge = document.getElementById("unmute");
    v.volume = 1.0;
    v.muted = false;
    v.play().catch(() => {
        v.muted = true;
    badge.style.display = "block";
    v.play().catch(() => {});
    });
    const enableSound = () => {
        v.muted = false;
    v.volume = 1.0;
    badge.style.display = "none";
    if (v.paused) v.play().catch(() => {});
    };
    window.addEventListener("pointerdown", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });
    v.addEventListener("ended", () => window.close());
    <\/script>
    </body>
    </html>
    `);
    rickTab.document.close();
    }
    
    document.documentElement.innerHTML = "";
    window.location.replace("about:blank");
    }
    */
    
    