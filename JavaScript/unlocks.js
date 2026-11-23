//#region Extra Glue For Code
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
        const voxSrc = 'otherPics/Vox.jpg';
        const alastorSrc = 'otherPics/Alastor.jpg';
        
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
        const zeroTwoSrc = 'otherPics/ZeroTwo.jpg';
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
        const carlSrc = 'otherPics/CarlGrimes.jfif';
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
        const cortisGroupSrc = 'otherPics/CortisGroup.jpg';
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
                src: 'otherPics/CortisMartin.jpg',
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
                src: 'otherPics/CortisJames.jpg',
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
                src: 'otherPics/CortisJuhoon.jpg',
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
                src: 'otherPics/CortisSeonghyeon.jpg',
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
                src: 'otherPics/CortisKeonho.jpg',
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
        const kobeSrc = 'otherPics/Kobe.jpg';
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
        const crowbarSrc = 'otherPics/crowbar.jpg';
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
        const cynImageSrc = 'otherPics/Cyn.jpg';
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
    function startCornerstoneShimmer() {
        [document.querySelector('.center-text'), document.querySelector('.theme-banner')]
        .filter(Boolean)
        .forEach(el => {
            el.style.cursor = 'pointer';
            el.style.userSelect = 'none';
            
            el.addEventListener('click', (e) => {
                if (!e._isTripleTap && e.detail !== 3) return;
                const banner = document.querySelector('.theme-banner');
                if (banner) {
                    banner.classList.remove('cornerstone-shimmer');
                    void banner.offsetWidth;
                    banner.classList.add('cornerstone-shimmer');
                }
                playBeep(523.25, 0.14, 'triangle', 0.045);
                setTimeout(() => playBeep(659.25, 0.14, 'triangle', 0.045), 90);
                setTimeout(() => playBeep(783.99, 0.24, 'triangle', 0.05), 180);
                spawnBurst(e.clientX, e.clientY, ['#facc15', '#fef08a'], 24);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            });
        });
    }
    function unlockDoomsdayTheme() {
        localStorage.setItem('afcs_doomsday_unlocked', 'true');
        if (typeof window.applySecretTheme === 'function') {
            window.applySecretTheme('doomsday');
        } else {
            document.body.classList.remove('search-fx-cornerstone', 'search-fx-dubai', 'party-mode');
            document.body.classList.add('theme-doomsday');
        }
        
        const banner = document.createElement('div');
        banner.className = 'doomsday-unlock-banner';
        banner.textContent = ' MULTIVERSE INCURSION UNLOCKED // DOOMSDAY EMERALD';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2800);
        
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        STATE.particles.push({
            type: 'SHOCKWAVE',
            x: cx,
            y: cy,
            radius: 10,
            maxRadius: Math.max(cx, cy) * 0.85,
            alpha: 1.0,
            color: '#10b981'
        });
        spawnBurst(cx, cy, ['#10b981', '#a7f3d0', '#e2e8f0', '#facc15'], 48);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        
        const doomChord = [73.42, 110.00, 146.83, 174.61, 293.66];
        doomChord.forEach((freq, idx) => {
            setTimeout(() => playBeep(freq, 0.65, 'sawtooth', 0.045), idx * 95);
        });
    }
    function unlockFaithianTheme() {
        localStorage.setItem('afcs_faithian_unlocked', 'true');
        if (typeof window.applySecretTheme === 'function') {
            window.applySecretTheme('faithian');
        } else {
            document.body.classList.remove('search-fx-cornerstone', 'search-fx-dubai', 'party-mode', 'theme-doomsday');
            document.body.classList.add('theme-faithian');
        }
        
        const banner = document.createElement('div');
        banner.className = 'faithian-unlock-banner';
        banner.textContent = ' CALLED FOR A PURPOSE // AFCS FAITHIAN THEME UNLOCKED';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2800);
        
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        STATE.particles.push({
            type: 'SHOCKWAVE',
            x: cx,
            y: cy,
            radius: 10,
            maxRadius: Math.max(cx, cy) * 0.85,
            alpha: 1.0,
            color: '#ef4444'
        });
        spawnBurst(cx, cy, ['#ef4444', '#2563eb', '#ffffff', '#facc15'], 48);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        
        const faithianChord = [261.63, 329.63, 392.00, 523.25, 659.25];
        faithianChord.forEach((freq, idx) => {
            setTimeout(() => playBeep(freq, 0.55, 'triangle', 0.045), idx * 85);
        });
    }
    function startHiddenBugBSOD() {
        let bsodActive = false;
        
        function playPowerDownAudio() {
            if (STATE.soundMuted) return;
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                
                const now = ctx.currentTime;
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const filter = ctx.createBiquadFilter();
                const gain = ctx.createGain();
                
                osc1.type = 'square';
                osc1.frequency.setValueAtTime(90, now);
                osc1.frequency.linearRampToValueAtTime(30, now + 1.8);
                
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(93, now);
                osc2.frequency.linearRampToValueAtTime(31, now + 1.8);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, now);
                
                gain.gain.setValueAtTime(0.32, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
                
                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 1.8);
                osc2.stop(now + 1.8);
            } catch (_) { }
        }
        
        function enterTrueFullscreen(el) {
            try {
                const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (req) {
                    const promise = req.call(el);
                    if (promise && typeof promise.catch === 'function') {
                        promise.catch(() => { });
                    }
                }
            } catch (_) { }
        }
        
        function exitTrueFullscreen() {
            try {
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
                    if (exit) {
                        const promise = exit.call(document);
                        if (promise && typeof promise.catch === 'function') {
                            promise.catch(() => { });
                        }
                    }
                }
            } catch (_) { }
        }
        
        function createQrMatrix(size = 21) {
            const grid = Array.from({ length: size }, () => Array(size).fill(false));
            function placeFinder(ox, oy) {
                for (let y = 0; y < 7; y++) {
                    for (let x = 0; x < 7; x++) {
                        const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
                        const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                        grid[oy + y][ox + x] = isBorder || isCenter;
                    }
                }
            }
            placeFinder(0, 0);
            placeFinder(size - 7, 0);
            placeFinder(0, size - 7);
            
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const inTopLeft = x < 8 && y < 8;
                    const inTopRight = x >= size - 8 && y < 8;
                    const inBottomLeft = x < 8 && y >= size - 8;
                    if (!inTopLeft && !inTopRight && !inBottomLeft) {
                        grid[y][x] = Math.random() < 0.48;
                    }
                }
            }
            return grid;
        }
        
        function drawQrCode(ctx, x, y, boxSize, matrix) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y, boxSize, boxSize);
            
            const pad = boxSize * 0.08;
            const inner = boxSize - pad * 2;
            const cell = inner / matrix.length;
            
            ctx.fillStyle = '#0078D7';
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix.length; c++) {
                    if (matrix[r][c]) {
                        ctx.fillRect(
                            x + pad + c * cell,
                            y + pad + r * cell,
                            Math.ceil(cell),
                            Math.ceil(cell)
                        );
                    }
                }
            }
        }
        function triggerAFCSBsod(rareStopCode = 'BURJ_KHALIFA_MAINFRAME_FAULT', rareFailedWhat = 'BEYOND_THE_MANGER_0x00F155104', forceRare = false) {
            if (bsodActive) return;
            bsodActive = true;
            localStorage.setItem('afcs_codex_bsod', 'true');
            
            const isRareBurj = forceRare || Math.random() < 0.01;
            const realCodes = [
                { stop: 'CRITICAL_PROCESS_DIED', failed: 'ntoskrnl.exe' },
                { stop: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED', failed: 'win32kfull.sys' },
                { stop: 'IRQL_NOT_LESS_OR_EQUAL', failed: 'dxgkrnl.sys' },
                { stop: 'MEMORY_MANAGEMENT', failed: 'ntoskrnl.exe' },
                { stop: 'PAGE_FAULT_IN_NONPAGED_AREA', failed: 'nvlddmkm.sys' }
            ];
            const pickedReal = realCodes[Math.floor(Math.random() * realCodes.length)];
            
            const headline1 = isRareBurj
            ? 'Your Burj Khalifa showcase ran into a problem and needs to restart. We\'re'
            : 'Your device ran into a problem and needs to restart. We\'re';
            const headline2 = 'just collecting some error info, and then we\'ll restart for you.';
            const infoUrl = isRareBurj
            ? 'For more information about this issue and possible fixes, visit https://afcs.edu.ph'
            : 'For more information about this issue and possible fixes, visit https://windows.com';
            const supportPrompt = isRareBurj
            ? 'If you call Grade 7 – Psalms Tech Team, give them this info:'
            : 'If you call a support person, give them this info:';
            const finalStopCode = isRareBurj ? rareStopCode : pickedReal.stop;
            const finalFailedWhat = isRareBurj ? rareFailedWhat : pickedReal.failed;
            
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            
            enterTrueFullscreen(document.documentElement);
            
            triggerScreenGlitch(140);
            const meltdownInterval = setInterval(() => {
                triggerScreenGlitch(70 + Math.random() * 110);
                if (Math.random() < 0.45) {
                    document.body.classList.add('quirk-bomb-shake');
                    setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 220);
                }
            }, 240);
            
            setTimeout(() => {
                clearInterval(meltdownInterval);
                document.body.classList.remove('quirk-bomb-shake');
                
                const canvas = document.createElement('canvas');
                canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;cursor:none;';
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                document.body.appendChild(canvas);
                
                const ctx = canvas.getContext('2d');
                const qrMatrix = createQrMatrix(21);
                let bsodCounter = 0;
                let lastTime = performance.now();
                let pauseRemaining = 0;
                let stallCooldown = 1.2;
                
                playPowerDownAudio();
                
                function handleResize() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
                window.addEventListener('resize', handleResize);
                
                function renderBsod(now) {
                    const dt = Math.min((now - lastTime) / 1000, 0.1);
                    lastTime = now;
                    
                    if (pauseRemaining > 0) {
                        pauseRemaining -= dt;
                    } else {
                        stallCooldown -= dt;
                        if (bsodCounter > 15 && bsodCounter < 95 && stallCooldown <= 0 && Math.random() < 0.025) {
                            pauseRemaining = 0.35 + Math.random() * 0.45;
                            stallCooldown = 1.6;
                        } else if (bsodCounter < 100) {
                            bsodCounter += 26 * dt;
                        }
                    }
                    
                    const displayPercent = Math.min(100, Math.floor(bsodCounter));
                    
                    ctx.fillStyle = '#0078D7';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    
                    const scale = Math.max(canvas.width / 1320, 0.55);
                    const marginX = canvas.width * 0.12;
                    let currentY = canvas.height * 0.17;
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = `${120 * scale}px "Segoe UI", sans-serif`;
                    ctx.fillText(':(', marginX, currentY);
                    
                    currentY += 150 * scale;
                    ctx.font = `${22 * scale}px "Segoe UI", sans-serif`;
                    ctx.fillText(headline1, marginX, currentY);
                    
                    currentY += 35 * scale;
                    ctx.fillText(headline2, marginX, currentY);
                    
                    currentY += 55 * scale;
                    ctx.fillText(`${displayPercent}% complete`, marginX, currentY);
                    
                    currentY += 65 * scale;
                    const qrSize = 108 * scale;
                    drawQrCode(ctx, marginX, currentY, qrSize, qrMatrix);
                    
                    const textX = marginX + qrSize + 22 * scale;
                    let detailsY = currentY;
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = `${13 * scale}px "Segoe UI", sans-serif`;
                    ctx.fillText(infoUrl, textX, detailsY);
                    
                    detailsY += 32 * scale;
                    ctx.fillText(supportPrompt, textX, detailsY);
                    
                    detailsY += 24 * scale;
                    ctx.fillText(`Stop code: ${finalStopCode}`, textX, detailsY);
                    
                    detailsY += 20 * scale;
                    ctx.fillText(`What failed: ${finalFailedWhat}`, textX, detailsY);
                    
                    if (displayPercent >= 100) {
                        setTimeout(() => {
                            exitTrueFullscreen();
                            window.removeEventListener('resize', handleResize);
                            canvas.remove();
                            document.body.style.overflow = prevOverflow;
                            bsodActive = false;
                            playBeep(523.25, 0.12, 'sine', 0.05);
                            setTimeout(() => playBeep(659.25, 0.18, 'sine', 0.05), 90);
                        }, 850);
                        return;
                    }
                    
                    requestAnimationFrame(renderBsod);
                }
                
                requestAnimationFrame(renderBsod);
            }, 6000);
        }
        
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                const val = DOM.searchInput.value.toLowerCase().trim();
                if (val === 'bug' || val === 'crash' || val === '0/0') {
                    e.preventDefault();
                    DOM.searchInput.value = '';
                    filterCards();
                    
                    try {
                        const reactorCore = null;
                        reactorCore.igniteFissionMania();
                    } catch (err) {
                        const code = val === '0/0' ? 'CRITICAL_DIVISION_BY_ZERO' : 'UNCAUGHT_FISSION_EXCEPTION';
                        triggerAFCSBsod(code, `${err.name.toUpperCase()}_0x00F155104`, false);
                    }
                }
            });
        }
        
        const footerCredits = document.querySelector('.footer-credits');
        if (footerCredits) {
            footerCredits.style.cursor = 'pointer';
            footerCredits.addEventListener('click', (e) => {
                if (e.detail === 5) {
                    try {
                        JSON.parse('{ broken_stage_cue: true ');
                    } catch (err) {
                        triggerAFCSBsod('STAGE_SCRIPT_SYNTAX_OVERFLOW', 'PLAYBILL_PARSER_0x007PSALMS', false);
                    }
                }
            });
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                try {
                    const burjReactor = null;
                    burjReactor.forceEasterEgg();
                } catch (err) {
                    triggerAFCSBsod('BURJ_KHALIFA_MAINFRAME_FAULT', 'BEYOND_THE_MANGER_0x00F155104', true);
                }
            }
        });
        window.triggerAFCSBsod = triggerAFCSBsod;
    }
    function startDoomsdayRift() {
        const crackLayer = document.createElement('div');
        crackLayer.className = 'doomsday-crack-layer stage-0';
        const svgNS = 'http://www.w3.org/2000/svg';
        const svgEl = document.createElementNS(svgNS, 'svg');
        svgEl.setAttribute('viewBox', '0 0 1000 1000');
        svgEl.setAttribute('preserveAspectRatio', 'none');
        crackLayer.appendChild(svgEl);
        document.body.prepend(crackLayer);
        
        let crackStage = 0;
        let stageGroups = [];
        
        function buildProceduralFracture() {
            svgEl.innerHTML = '';
            stageGroups = Array.of();
            for (let i = 0; i < 9; i++) {
                const g = document.createElementNS(svgNS, 'g');
                g.style.display = 'none';
                svgEl.appendChild(g);
                stageGroups.push(g);
            }
            
            const originX = 180 + Math.random() * 640;
            const originY = 160 + Math.random() * 680;
            const rayCount = 14;
            const ringRadii = Array.of(75, 165, 270, 390, 525, 680, 860, 1080, 1360);
            const rayNodes = Array.of();
            
            for (let r = 0; r < rayCount; r++) {
                const baseAngle = (r / rayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.24;
                let curX = originX;
                let curY = originY;
                const nodes = Array.of({ x: originX, y: originY });
                
                for (let s = 0; s <= 8; s++) {
                    const targetDist = ringRadii.at(s) + (Math.random() - 0.5) * 28;
                    const jitterAngle = baseAngle + (Math.random() - 0.5) * 0.22;
                    const nextX = originX + Math.cos(jitterAngle) * targetDist;
                    const nextY = originY + Math.sin(jitterAngle) * targetDist;
                    
                    const d = `M ${curX.toFixed(1)} ${curY.toFixed(1)} L ${nextX.toFixed(1)} ${nextY.toFixed(1)}`;
                    const outer = document.createElementNS(svgNS, 'path');
                    outer.setAttribute('class', 'doomsday-crack-path');
                    outer.setAttribute('stroke-width', (2 + s * 0.65).toFixed(1));
                    outer.setAttribute('d', d);
                    
                    const core = document.createElementNS(svgNS, 'path');
                    core.setAttribute('class', 'doomsday-crack-core');
                    core.setAttribute('stroke-width', (0.7 + s * 0.25).toFixed(1));
                    core.setAttribute('d', d);
                    
                    stageGroups.at(s).appendChild(outer);
                    stageGroups.at(s).appendChild(core);
                    
                    if (s >= 2 && Math.random() < 0.65) {
                        const subAngle = jitterAngle + (Math.random() < 0.5 ? 0.55 : -0.55);
                        const subLen = 45 + s * 18;
                        const subX = nextX + Math.cos(subAngle) * subLen;
                        const subY = nextY + Math.sin(subAngle) * subLen;
                        const subD = `M ${nextX.toFixed(1)} ${nextY.toFixed(1)} L ${subX.toFixed(1)} ${subY.toFixed(1)}`;
                        
                        const subOuter = document.createElementNS(svgNS, 'path');
                        subOuter.setAttribute('class', 'doomsday-crack-path');
                        subOuter.setAttribute('stroke-width', (1.4 + s * 0.35).toFixed(1));
                        subOuter.setAttribute('d', subD);
                        stageGroups.at(s).appendChild(subOuter);
                    }
                    
                    curX = nextX;
                    curY = nextY;
                    nodes.push({ x: curX, y: curY });
                }
                rayNodes.push(nodes);
            }
            
            for (let s = 1; s <= 8; s++) {
                for (let r = 0; r < rayCount; r++) {
                    if (s < 7 && Math.random() > 0.72) continue;
                    const p1 = rayNodes.at(r).at(s);
                    const p2 = rayNodes.at((r + 1) % rayCount).at(s);
                    const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 18;
                    const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 18;
                    const webD = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${midX.toFixed(1)} ${midY.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
                    
                    const webOuter = document.createElementNS(svgNS, 'path');
                    webOuter.setAttribute('class', 'doomsday-crack-path');
                    webOuter.setAttribute('stroke-width', (1.2 + s * 0.4).toFixed(1));
                    webOuter.setAttribute('d', webD);
                    
                    const webCore = document.createElementNS(svgNS, 'path');
                    webCore.setAttribute('class', 'doomsday-crack-core');
                    webCore.setAttribute('stroke-width', (0.4 + s * 0.16).toFixed(1));
                    webCore.setAttribute('d', webD);
                    
                    stageGroups.at(s).appendChild(webOuter);
                    stageGroups.at(s).appendChild(webCore);
                }
            }
            
            for (let k = 0; k < 18; k++) {
                const ang = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * 520;
                const sx = originX + Math.cos(ang) * dist;
                const sy = originY + Math.sin(ang) * dist;
                const sz = 14 + Math.random() * 26;
                const shard = document.createElementNS(svgNS, 'polygon');
                shard.setAttribute('points', `${sx.toFixed(1)},${(sy - sz).toFixed(1)} ${(sx + sz * 0.85).toFixed(1)},${(sy + sz * 0.6).toFixed(1)} ${(sx - sz * 0.75).toFixed(1)},${(sy + sz * 0.4).toFixed(1)}`);
                shard.setAttribute('fill', 'rgba(167, 243, 208, 0.14)');
                shard.setAttribute('stroke', '#ecfdf5');
                shard.setAttribute('stroke-width', '1.2');
                stageGroups.at(8).appendChild(shard);
            }
        }
        
        function syncCrackVisuals() {
            crackLayer.className = `doomsday-crack-layer stage-${crackStage}`;
            Array.from(svgEl.children).forEach((g, idx) => {
                if (g && g.style) {
                    g.style.display = idx <= crackStage ? 'block' : 'none';
                }
            });
        }
        
        buildProceduralFracture();
        syncCrackVisuals();
        
        function escalateCrack() {
            if (!document.body.classList.contains('theme-doomsday')) return;
            
            if (crackStage < 8) {
                crackStage++;
                syncCrackVisuals();
                triggerScreenGlitch(110 + crackStage * 18);
                playBeep(85 + crackStage * 18, 0.28, 'sawtooth', 0.055);
                spawnBurst(window.innerWidth * (0.25 + Math.random() * 0.5), window.innerHeight * (0.25 + Math.random() * 0.5), ['#10b981', '#a7f3d0', '#ffffff'], 18 + crackStage * 3);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            } else {
                crackStage = 0;
                buildProceduralFracture();
                syncCrackVisuals();
                if (typeof window.applyTheme === 'function') {
                    window.applyTheme('blue', true);
                } else {
                    document.body.classList.remove('theme-doomsday');
                }
                if (typeof window.triggerAFCSBsod === 'function') {
                    window.triggerAFCSBsod('MULTIVERSE_INCURSION_COLLAPSE', 'EARTH_616_REALITY_RIFT_0xD00M', true);
                }
            }
        }
        
        setInterval(() => {
            if (!document.body.classList.contains('theme-doomsday')) {
                if (crackStage !== 0) {
                    crackStage = 0;
                    buildProceduralFracture();
                    syncCrackVisuals();
                }
                return;
            }
            if (Math.random() < 0.05) {
                escalateCrack();
            }
        }, 60000);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (val === 'foot dive' && document.body.classList.contains('theme-doomsday')) {
                    DOM.searchInput.value = '';
                    filterCards();
                    escalateCrack();
                }
            });
        }
    }
    function startEpicStorm() {
        const svgNS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
        function strikeLightning(targetX, targetY, big = false) {
            if (STATE.ldmActive) return;
            
            const flash = document.createElement('div');
            flash.className = 'epic-lightning-flash';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 450);
            
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('class', 'epic-lightning-svg');
            svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            
            let curX = targetX + (Math.random() - 0.5) * 180;
            let curY = 0;
            const steps = big ? 12 : 8;
            let pts = `${curX.toFixed(1)},0`;
            
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                curX = curX + (targetX - curX) * 0.45 + (Math.random() - 0.5) * (big ? 95 : 55);
                curY = targetY * progress;
                pts += ` ${curX.toFixed(1)},${curY.toFixed(1)}`;
            }
            
            const outerBolt = document.createElementNS(svgNS, 'polyline');
            outerBolt.setAttribute('points', pts);
            outerBolt.setAttribute('fill', 'none');
            outerBolt.setAttribute('stroke', '#38bdf8');
            outerBolt.setAttribute('stroke-width', big ? '7' : '4');
            outerBolt.setAttribute('stroke-linecap', 'round');
            outerBolt.setAttribute('stroke-linejoin', 'round');
            
            const coreBolt = document.createElementNS(svgNS, 'polyline');
            coreBolt.setAttribute('points', pts);
            coreBolt.setAttribute('fill', 'none');
            coreBolt.setAttribute('stroke', '#fef9c3');
            coreBolt.setAttribute('stroke-width', big ? '3' : '1.8');
            coreBolt.setAttribute('stroke-linecap', 'round');
            coreBolt.setAttribute('stroke-linejoin', 'round');
            
            svg.appendChild(outerBolt);
            svg.appendChild(coreBolt);
            document.body.appendChild(svg);
            setTimeout(() => svg.remove(), 520);
            
            if (big) {
                document.body.classList.add('quirk-bomb-shake');
                setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 450);
                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: targetX,
                    y: targetY,
                    radius: 10,
                    maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.55,
                    alpha: 1.0,
                    color: '#38bdf8'
                });
            }
            
            spawnBurst(targetX, targetY, ['#facc15', '#38bdf8', '#ffffff'], big ? 36 : 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            playBeep(big ? 95 : 150, big ? 0.35 : 0.14, 'sawtooth', big ? 0.07 : 0.04);
            if (big) {
                setTimeout(() => playBeep(62, 0.45, 'square', 0.065), 80);
            }
        }
        
        setInterval(() => {
            if (!document.body.classList.contains('theme-epic') || STATE.ldmActive) return;
            if (Math.random() < 0.38) {
                const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
                const ry = window.innerHeight * (0.25 + Math.random() * 0.55);
                strikeLightning(rx, ry, Math.random() < 0.35);
            }
        }, 4200);
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-epic')) return;
            if (e.target.closest('button, input, .PeoplePics')) return;
            strikeLightning(e.clientX, e.clientY, false);
        }, { passive: true });
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-epic')) return;
                
                if (val === 'ruthlessness' || val === 'poseidon') {
                    DOM.searchInput.value = '';
                    filterCards();
                    strikeLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    const banner = document.createElement('div');
                    banner.className = 'theme-announce-banner is-epic';
                    banner.textContent = '🌊 RUTHLESSNESS IS MERCY UPON OURSELVES!';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 2600);
                } else if (val === 'thunder bringer' || val === 'zeus') {
                    DOM.searchInput.value = '';
                    filterCards();
                    strikeLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    [220.00, 196.00, 164.81, 146.83].forEach((f, idx) => {
                        setTimeout(() => playBeep(f, 0.24, 'sawtooth', 0.055), idx * 140);
                    });
                } else if (val === '600 men') {
                    DOM.searchInput.value = '';
                    filterCards();
                    document.body.classList.toggle('epic-600-aura');
                    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#38bdf8', '#facc15', '#ffffff'], 34);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    playBeep(440, 0.16, 'triangle', 0.05);
                }
            });
        }
    }
    function startSolverOverhaul() {
        let ctxMenu = null;
        function closeSolverMenu() {
            if (ctxMenu) {
                ctxMenu.remove();
                ctxMenu = null;
            }
        }
        function spawnNullSphere(x, y, mega = false) {
            const sphere = document.createElement('div');
            sphere.className = mega ? 'solver-null-sphere is-mega' : 'solver-null-sphere';
            sphere.textContent = '[NULL]';
            sphere.style.left = `${x}px`;
            sphere.style.top = `${y}px`;
            document.body.appendChild(sphere);
            setTimeout(() => sphere.remove(), 750);
            
            const isUzi = document.body.classList.contains('solver-uzi-mode');
            const colors = isUzi ? ['#c084fc', '#a855f7', '#ffffff'] : ['#facc15', '#c084fc', '#ffffff'];
            spawnBurst(x, y, colors, mega ? 42 : 18);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            if (mega) {
                triggerScreenGlitch(180);
                playBeep(110, 0.32, 'sawtooth', 0.065);
                setTimeout(() => playBeep(65, 0.4, 'square', 0.06), 70);
            } else {
                playBeep(622.25, 0.06, 'sawtooth', 0.035);
            }
        }
        window.addEventListener('pointerdown', (e) => {
            if (ctxMenu && !e.target.closest('.solver-context-menu')) {
                closeSolverMenu();
            }
            if (!document.body.classList.contains('theme-murderdrones')) return;
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .solver-context-menu')) return;
            spawnNullSphere(e.clientX, e.clientY, false);
        }, { passive: true });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSolverMenu();
        });
        window.addEventListener('scroll', closeSolverMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-murderdrones')) return;
            e.preventDefault();
            closeSolverMenu();
            
            const menu = document.createElement('div');
            menu.className = 'solver-context-menu';
            menu.innerHTML = [
                '<div class="solver-ctx-header"><span>⬡ ABSOLUTE_SOLVER.EXE</span><span>[ROOT]</span></div>',
                '<div class="solver-ctx-item" data-act="back"><span class="solver-ctx-left"><span class="solver-ctx-glyph">◄</span><span>Revert Timeline</span></span><span class="solver-ctx-key">Alt+←</span></div>',
                '<div class="solver-ctx-item" data-act="reload"><span class="solver-ctx-left"><span class="solver-ctx-glyph">↻</span><span>Reboot Core</span></span><span class="solver-ctx-key">Ctrl+R</span></div>',
                '<div class="solver-ctx-sep"></div>',
                '<div class="solver-ctx-item" data-act="null"><span class="solver-ctx-left"><span class="solver-ctx-glyph">◉</span><span>Execute [NULL]</span></span><span class="solver-ctx-key">Void</span></div>',
                '<div class="solver-ctx-item" data-act="palette"><span class="solver-ctx-left"><span class="solver-ctx-glyph">△</span><span>Toggle Cyn / Uzi Core</span></span><span class="solver-ctx-key">Shift</span></div>',
                '<div class="solver-ctx-item" data-act="summon"><span class="solver-ctx-left"><span class="solver-ctx-glyph">⬡</span><span>Summon Cyn.exe</span></span><span class="solver-ctx-key">Pet</span></div>',
                '<div class="solver-ctx-sep"></div>',
                '<div class="solver-ctx-item" data-act="print"><span class="solver-ctx-left"><span class="solver-ctx-glyph">▤</span><span>Export Playbill</span></span><span class="solver-ctx-key">Ctrl+P</span></div>',
                '<div class="solver-ctx-item" data-act="translate"><span class="solver-ctx-left"><span class="solver-ctx-glyph">文</span><span>Translate: Solver</span></span><span class="solver-ctx-key">Giggle</span></div>',
                '<div class="solver-ctx-item" data-act="inspect"><span class="solver-ctx-left"><span class="solver-ctx-glyph">⌘</span><span>Inspect Vessel</span></span><span class="solver-ctx-key">F12</span></div>'
            ].join('');
            
            document.body.appendChild(menu);
            ctxMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 10, Math.max(10, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 10, Math.max(10, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(740, 0.05, 'sawtooth', 0.035);
            
            menu.querySelectorAll('.solver-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeSolverMenu();
                    
                    if (act === 'back') {
                        window.history.back();
                    } else if (act === 'reload') {
                        window.location.reload();
                    } else if (act === 'null') {
                        spawnNullSphere(safeX + 80, safeY + 60, true);
                    } else if (act === 'palette') {
                        document.body.classList.toggle('solver-uzi-mode');
                        triggerScreenGlitch(110);
                        playBeep(523.25, 0.09, 'sawtooth', 0.045);
                    } else if (act === 'summon') {
                        localStorage.setItem('afcs_cyn_pet_active', 'true');
                        if (DOM.searchInput) {
                            DOM.searchInput.value = 'cyn';
                            DOM.searchInput.dispatchEvent(new Event('input'));
                        }
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'translate') {
                        triggerScreenGlitch(140);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-murderdrones';
                        banner.textContent = '⬡ [TRANSLATED]: GIGGLE. ASSIMILATION READY =3';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2600);
                        playBeep(880, 0.1, 'sawtooth', 0.045);
                    } else if (act === 'inspect') {
                        triggerScreenGlitch(140);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-murderdrones';
                        banner.textContent = '⬡ [ACCESS DENIED]: NICE TRY, LITTLE ADMINISTRATOR.';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2600);
                        playBeep(180, 0.18, 'sawtooth', 0.05);
                    }
                });
            });
        });
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-murderdrones')) return;
                
                if (val === 'null' || val === '[null]') {
                    DOM.searchInput.value = '';
                    filterCards();
                    spawnNullSphere(window.innerWidth / 2, window.innerHeight * 0.45, true);
                } else if (val === 'bite me') {
                    DOM.searchInput.value = '';
                    filterCards();
                    const isUzi = document.body.classList.toggle('solver-uzi-mode');
                    triggerScreenGlitch(130);
                    const banner = document.createElement('div');
                    banner.className = 'theme-announce-banner is-murderdrones';
                    banner.textContent = isUzi ? '💜 BITE ME! // UZI SOLVER CORE ENGAGED' : '💛 GIGGLE. // CYN SOLVER CORE RESTORED';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 2400);
                    playBeep(isUzi ? 622.25 : 440, 0.12, 'sawtooth', 0.045);
                } else if (val === 'callback ping') {
                    DOM.searchInput.value = '';
                    filterCards();
                    spawnNullSphere(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    localStorage.setItem('afcs_cyn_pet_active', 'true');
                    setTimeout(() => {
                        if (DOM.searchInput) {
                            DOM.searchInput.value = 'cyn';
                            DOM.searchInput.dispatchEvent(new Event('input'));
                        }
                    }, 120);
                }
            });
        }
    }
    function startHamiltonOverhaul() {
        const quillEl = document.createElement('div');
        quillEl.className = 'hamilton-quill-cursor';
        quillEl.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 2C25 4 15 13 9 24L3 35l2.5 1 5-7.5c6.5-1.5 14-6.5 19-14C32 10.5 34 5.5 35 2z" fill="#fef3c7" stroke="#78350f" stroke-width="1.6"/>
            <path d="M4.5 34.5L29 8" stroke="#92400e" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M15 17l-4-1M19 13l-4.5-1M23 9.5l-4-1" stroke="#b45309" stroke-width="1.1" stroke-linecap="round"/>
            <circle cx="3.5" cy="35" r="1.8" fill="#1c1917"/>
        </svg>
    `;
        document.body.appendChild(quillEl);
        
        let lastQuillX = window.innerWidth / 2;
        let quillActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isHam = document.body.classList.contains('theme-hamilton');
            if (!isHam) {
                if (quillActive) {
                    quillEl.classList.remove('is-visible');
                    quillActive = false;
                }
                return;
            }
            
            if (!quillActive) {
                quillEl.classList.add('is-visible');
                quillActive = true;
            }
            
            const dx = Math.max(-18, Math.min(18, e.clientX - lastQuillX));
            lastQuillX = e.clientX;
            const tilt = dx * 0.9;
            
            quillEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY - 36}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            quillEl.classList.remove('is-visible');
            quillActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-hamilton')) return;
            quillEl.classList.add('is-writing');
            setTimeout(() => quillEl.classList.remove('is-writing'), 160);
        }, { passive: true });
        let hamMenu = null;
        
        function closeHamMenu() {
            if (hamMenu) {
                hamMenu.remove();
                hamMenu = null;
            }
        }
        
        function spawnQuillFlourish(x, y, quoteText = 'I am not throwing away my shot!') {
            const inkPalette = ['#78350f', '#d97706', '#fef08a', '#1c1917'];
            spawnBurst(x, y, inkPalette, 22);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            const note = document.createElement('div');
            note.className = 'hamilton-parchment-toast';
            note.textContent = `🪶 "${quoteText}"`;
            note.style.left = `${Math.min(window.innerWidth - 260, Math.max(16, x - 110))}px`;
            note.style.top = `${Math.max(24, y - 36)}px`;
            document.body.appendChild(note);
            setTimeout(() => note.remove(), 1800);
            
            const harpsichord = [440.00, 523.25, 659.25, 880.00];
            harpsichord.forEach((freq, i) => {
                setTimeout(() => playBeep(freq, 0.08, 'triangle', 0.038), i * 45);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (hamMenu && !e.target.closest('.hamilton-context-menu')) {
                closeHamMenu();
            }
            if (!document.body.classList.contains('theme-hamilton')) return;
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .hamilton-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#92400e', '#f59e0b', '#fef3c7'], 10);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(587.33, 0.045, 'triangle', 0.025);
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeHamMenu();
        });
        window.addEventListener('scroll', closeHamMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-hamilton')) return;
            e.preventDefault();
            closeHamMenu();
            
            const menu = document.createElement('div');
            menu.className = 'hamilton-context-menu';
            menu.innerHTML = `
            <div class="ham-ctx-header">
                <span>📜 NEW YORK, 1776</span>
                <span class="ham-wax-seal" title="Continental Seal">★</span>
            </div>
            <div class="ham-ctx-item" data-act="shot">
                <span>🪶 Take My Shot!</span>
                <span class="ham-ctx-sub">Ink</span>
            </div>
            <div class="ham-ctx-item" data-act="nonstop">
                <span>✍️ Write Like Running Out of Time</span>
                <span class="ham-ctx-sub">Quill</span>
            </div>
            <div class="ham-ctx-item" data-act="room">
                <span>🏛️ The Room Where It Happens</span>
                <span class="ham-ctx-sub">Stage</span>
            </div>
            <div class="ham-ctx-sep"></div>
            <div class="ham-ctx-item" data-act="duel">
                <span>⚔️ Ten Duel Commandments</span>
                <span class="ham-ctx-sub">1–10</span>
            </div>
            <div class="ham-ctx-item" data-act="print">
                <span>📰 Print Continental Playbill</span>
                <span class="ham-ctx-sub">Ctrl+P</span>
            </div>
            <div class="ham-ctx-item" data-act="back">
                <span>↩ Turn Back the Clock</span>
                <span class="ham-ctx-sub">Back</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            hamMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(659.25, 0.06, 'triangle', 0.035);
            
            menu.querySelectorAll('.ham-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeHamMenu();
                    
                    if (act === 'shot') {
                        spawnQuillFlourish(safeX + 90, safeY + 40, 'I am not throwing away my shot!');
                    } else if (act === 'nonstop') {
                        spawnQuillFlourish(safeX + 90, safeY + 40, 'Why do you write like you’re running out of time?!');
                    } else if (act === 'room') {
                        const floorplan = document.querySelector('#floorplan, .floorplan-card');
                        if (floorplan) floorplan.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        spawnQuillFlourish(safeX + 90, safeY + 40, 'Click-boom! Welcome to the room where it happens.');
                    } else if (act === 'duel') {
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-hamilton';
                        banner.textContent = '⚔️ ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE... NUMBER TEN PACES, FIRE!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 3000);
                        [392, 440, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99, 880, 1046.5].forEach((f, i) => {
                            setTimeout(() => playBeep(f, 0.07, 'triangle', 0.04), i * 85);
                        });
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'back') {
                        window.history.back();
                    }
                });
            });
        });
    }
    function startEpicCursorAndStorm() {
        const svgNS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
        let zeusCursorMode = false;
        
        const epicCursor = document.createElement('div');
        epicCursor.className = 'epic-olympus-cursor';
        
        const tridentSVG = `
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5L33 33" stroke="#facc15" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M4 4L14 6L8 10L6 16L4 4Z" fill="#38bdf8" stroke="#fef08a" stroke-width="1.3"/>
        <path d="M13 3C10 7 10 11 13 14" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M13 3L11 7L15 6L13 3Z" fill="#fef08a"/>
        <path d="M3 13C7 10 11 10 14 13" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M3 13L7 11L6 15L3 13Z" fill="#fef08a"/>
        <circle cx="15" cy="15" r="2.2" fill="#facc15"/>
    </svg>
`;
        
        const thunderboltSVG = `
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4L19 15L14 19L33 34L20 21L25 17L4 4Z" fill="#facc15" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M8 7L28 29" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
`;
        
        epicCursor.innerHTML = tridentSVG;
        document.body.appendChild(epicCursor);
        
        function syncEpicCursorWeapon(forceState) {
            if (typeof forceState === 'boolean') zeusCursorMode = forceState;
            epicCursor.innerHTML = zeusCursorMode ? thunderboltSVG : tridentSVG;
            epicCursor.classList.toggle('is-zeus-bolt', zeusCursorMode);
            return zeusCursorMode;
        }
        
        let lastEpicX = window.innerWidth / 2;
        let epicCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isEpic = document.body.classList.contains('theme-epic');
            if (!isEpic) {
                if (epicCursorActive) {
                    epicCursor.classList.remove('is-visible');
                    epicCursorActive = false;
                }
                return;
            }
            
            if (!epicCursorActive) {
                epicCursor.classList.add('is-visible');
                epicCursorActive = true;
            }
            
            const dx = Math.max(-16, Math.min(16, e.clientX - lastEpicX));
            lastEpicX = e.clientX;
            const tilt = dx * 0.75;
            
            epicCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            epicCursor.classList.remove('is-visible');
            epicCursorActive = false;
        });
        
        function strikeLightning(targetX, targetY, big = false) {
            if (STATE.ldmActive) return;
            
            const flash = document.createElement('div');
            flash.className = 'epic-lightning-flash';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 450);
            
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('class', 'epic-lightning-svg');
            svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            
            let curX = targetX + (Math.random() - 0.5) * 180;
            let curY = 0;
            const steps = big ? 12 : 8;
            let pts = `${curX.toFixed(1)},0`;
            
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                curX = curX + (targetX - curX) * 0.45 + (Math.random() - 0.5) * (big ? 95 : 55);
                curY = targetY * progress;
                pts += ` ${curX.toFixed(1)},${curY.toFixed(1)}`;
            }
            
            const outerBolt = document.createElementNS(svgNS, 'polyline');
            outerBolt.setAttribute('points', pts);
            outerBolt.setAttribute('fill', 'none');
            outerBolt.setAttribute('stroke', '#38bdf8');
            outerBolt.setAttribute('stroke-width', big ? '7' : '4');
            outerBolt.setAttribute('stroke-linecap', 'round');
            outerBolt.setAttribute('stroke-linejoin', 'round');
            
            const coreBolt = document.createElementNS(svgNS, 'polyline');
            coreBolt.setAttribute('points', pts);
            coreBolt.setAttribute('fill', 'none');
            coreBolt.setAttribute('stroke', '#fef9c3');
            coreBolt.setAttribute('stroke-width', big ? '3' : '1.8');
            coreBolt.setAttribute('stroke-linecap', 'round');
            coreBolt.setAttribute('stroke-linejoin', 'round');
            
            svg.appendChild(outerBolt);
            svg.appendChild(coreBolt);
            document.body.appendChild(svg);
            setTimeout(() => svg.remove(), 520);
            
            if (big) {
                document.body.classList.add('quirk-bomb-shake');
                setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 450);
                STATE.particles.push({
                    type: 'SHOCKWAVE',
                    x: targetX,
                    y: targetY,
                    radius: 10,
                    maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.55,
                    alpha: 1.0,
                    color: '#38bdf8'
                });
            }
            
            spawnBurst(targetX, targetY, ['#facc15', '#38bdf8', '#ffffff'], big ? 36 : 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            playBeep(big ? 95 : 150, big ? 0.35 : 0.14, 'sawtooth', big ? 0.07 : 0.04);
            if (big) {
                setTimeout(() => playBeep(62, 0.45, 'square', 0.065), 80);
            }
        }
        
        setInterval(() => {
            if (!document.body.classList.contains('theme-epic') || STATE.ldmActive) return;
            if (Math.random() < 0.38) {
                const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
                const ry = window.innerHeight * (0.25 + Math.random() * 0.55);
                strikeLightning(rx, ry, Math.random() < 0.35);
            }
        }, 4200);
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-epic')) return;
            
            epicCursor.classList.add('is-striking');
            setTimeout(() => epicCursor.classList.remove('is-striking'), 170);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .epic-context-menu')) return;
            strikeLightning(e.clientX, e.clientY, zeusCursorMode);
        }, { passive: true });
        
        window.strikeEpicLightning = strikeLightning;
        window.syncEpicCursorWeapon = syncEpicCursorWeapon;
        window.isEpicZeusMode = () => zeusCursorMode;
    }
    function startEpicContextMenu() {
        let epicMenu = null;
        
        function closeEpicMenu() {
            if (epicMenu) {
                epicMenu.remove();
                epicMenu = null;
            }
        }
        
        function callLightning(x, y, big = false) {
            if (typeof window.strikeEpicLightning === 'function') {
                window.strikeEpicLightning(x, y, big);
            }
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (epicMenu && !e.target.closest('.epic-context-menu')) {
                closeEpicMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeEpicMenu();
        });
        window.addEventListener('scroll', closeEpicMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-epic')) return;
            e.preventDefault();
            e.stopPropagation();
            closeEpicMenu();
            
            const isZeus = typeof window.isEpicZeusMode === 'function' && window.isEpicZeusMode();
            
            const menu = document.createElement('div');
            menu.className = 'epic-context-menu';
            menu.innerHTML = `
            <div class="epic-ctx-header">
                <span>⚡ OLYMPUS STORM // ODYSSEY</span>
                <span class="epic-ctx-crest">🔱</span>
            </div>
            <div class="epic-ctx-item" data-act="thunder">
                <span>⚡ Thunder Bringer</span>
                <span class="epic-ctx-key">Zeus</span>
            </div>
            <div class="epic-ctx-item" data-act="ruthlessness">
                <span>🌊 Ruthlessness Surge</span>
                <span class="epic-ctx-key">Poseidon</span>
            </div>
            <div class="epic-ctx-item" data-act="weapon">
                <span>${isZeus ? '🔱 Wield Poseidon’s Trident' : '⚡ Wield Zeus’s Thunderbolt'}</span>
                <span class="epic-ctx-key">Weapon</span>
            </div>
            <div class="epic-ctx-sep"></div>
            <div class="epic-ctx-item" data-act="men600">
                <span>🛡️ Rally the 600 Men</span>
                <span class="epic-ctx-key">Aura</span>
            </div>
            <div class="epic-ctx-item" data-act="windbag">
                <span>🌪️ Open the Wind Bag</span>
                <span class="epic-ctx-key">Aeolus</span>
            </div>
            <div class="epic-ctx-sep"></div>
            <div class="epic-ctx-item" data-act="ithaca">
                <span>🏛️ Sail Back to Ithaca</span>
                <span class="epic-ctx-key">Top</span>
            </div>
            <div class="epic-ctx-item" data-act="print">
                <span>📜 Inscribe Odyssey Playbill</span>
                <span class="epic-ctx-key">Ctrl+P</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            epicMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(220.00, 0.08, 'sawtooth', 0.04);
            
            menu.querySelectorAll('.epic-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeEpicMenu();
                    
                    if (act === 'thunder') {
                        callLightning(safeX + 60, safeY + 40, true);
                        [220.00, 196.00, 164.81, 146.83].forEach((f, idx) => {
                            setTimeout(() => playBeep(f, 0.22, 'sawtooth', 0.05), idx * 120);
                        });
                    } else if (act === 'ruthlessness') {
                        callLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner is-epic';
                        banner.textContent = '🌊 RUTHLESSNESS IS MERCY UPON OURSELVES!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2600);
                    } else if (act === 'weapon') {
                        const nextState = typeof window.syncEpicCursorWeapon === 'function'
                        ? window.syncEpicCursorWeapon(!isZeus)
                        : false;
                        spawnBurst(safeX + 80, safeY + 40, ['#facc15', '#38bdf8', '#ffffff'], 24);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        playBeep(nextState ? 880 : 440, 0.1, 'triangle', 0.045);
                    } else if (act === 'men600') {
                        document.body.classList.toggle('epic-600-aura');
                        spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#38bdf8', '#facc15', '#ffffff'], 34);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        playBeep(440, 0.16, 'triangle', 0.05);
                    } else if (act === 'windbag') {
                        for (let i = 0; i < 4; i++) {
                            setTimeout(() => {
                                const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
                                const ry = window.innerHeight * (0.2 + Math.random() * 0.6);
                                callLightning(rx, ry, i === 3);
                            }, i * 160);
                        }
                    } else if (act === 'ithaca') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playBeep(523.25, 0.12, 'triangle', 0.04);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    }
                });
            });
        }, true);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-epic')) return;
                
                if (val === 'ruthlessness' || val === 'poseidon') {
                    DOM.searchInput.value = '';
                    filterCards();
                    if (typeof window.syncEpicCursorWeapon === 'function') window.syncEpicCursorWeapon(false);
                    callLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    const banner = document.createElement('div');
                    banner.className = 'theme-announce-banner is-epic';
                    banner.textContent = '🌊 RUTHLESSNESS IS MERCY UPON OURSELVES!';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 2600);
                } else if (val === 'thunder bringer' || val === 'zeus') {
                    DOM.searchInput.value = '';
                    filterCards();
                    if (typeof window.syncEpicCursorWeapon === 'function') window.syncEpicCursorWeapon(true);
                    callLightning(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    [220.00, 196.00, 164.81, 146.83].forEach((f, idx) => {
                        setTimeout(() => playBeep(f, 0.24, 'sawtooth', 0.055), idx * 140);
                    });
                } else if (val === '600 men') {
                    DOM.searchInput.value = '';
                    filterCards();
                    document.body.classList.toggle('epic-600-aura');
                    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ['#38bdf8', '#facc15', '#ffffff'], 34);
                    if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                    playBeep(440, 0.16, 'triangle', 0.05);
                }
            });
        }
    }
    function startDoomsdayCursor() {
        const doomCursor = document.createElement('div');
        doomCursor.className = 'doomsday-gauntlet-cursor';
        doomCursor.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://w3.org">
            <polygon points="4,4 22,10 15,16 32,33 27,36 12,19 7,25" fill="#1e293b" stroke="#10b981" stroke-width="1.8" stroke-linejoin="round"/>
            <polygon points="6,6 18,11 13,15" fill="#a7f3d0"/>
            <circle cx="16" cy="17" r="3.2" fill="#10b981" stroke="#ecfdf5" stroke-width="1.2"/>
            <path d="M20 23L29 32" stroke="#34d399" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `;
        document.body.appendChild(doomCursor);
        
        let lastDoomX = window.innerWidth / 2;
        let doomCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isDoom = document.body.classList.contains('theme-doomsday');
            if (!isDoom) {
                if (doomCursorActive) {
                    doomCursor.classList.remove('is-visible');
                    doomCursorActive = false;
                }
                return;
            }
            
            if (!doomCursorActive) {
                doomCursor.classList.add('is-visible');
                doomCursorActive = true;
            }
            
            const dx = Math.max(-14, Math.min(14, e.clientX - lastDoomX));
            lastDoomX = e.clientX;
            const tilt = dx * 0.65;
            
            doomCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            doomCursor.classList.remove('is-visible');
            doomCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-doomsday')) return;
            
            doomCursor.classList.add('is-blasting');
            setTimeout(() => doomCursor.classList.remove('is-blasting'), 170);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .doomsday-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#10b981', '#a7f3d0', '#ffffff'], 14);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(110, 0.08, 'sawtooth', 0.032);
        }, { passive: true });
    }
    function startDoomsdayContextMenu() {
        let doomMenu = null;
        
        function closeDoomMenu() {
            if (doomMenu) {
                doomMenu.remove();
                doomMenu = null;
            }
        }
        
        function spawnIncursionWave(x, y) {
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.65,
                alpha: 1.0,
                color: '#10b981'
            });
            spawnBurst(x, y, ['#10b981', '#a7f3d0', '#facc15', '#ffffff'], 42);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            triggerScreenGlitch(130);
            
            [73.42, 110.00, 146.83, 220.00].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.35, 'sawtooth', 0.045), idx * 75);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (doomMenu && !e.target.closest('.doomsday-context-menu')) {
                closeDoomMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDoomMenu();
        });
        window.addEventListener('scroll', closeDoomMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-doomsday')) return;
            e.preventDefault();
            e.stopPropagation();
            closeDoomMenu();
            
            const stage = typeof window.getDoomsdayCrackStage === 'function' ? window.getDoomsdayCrackStage() : 0;
            
            const menu = document.createElement('div');
            menu.className = 'doomsday-context-menu';
            menu.innerHTML = `
            <div class="doom-ctx-header">
                <span>🟢 LATVERIA_OS // DOOM.EXE</span>
                <span class="doom-ctx-stage">RIFT ${stage}/8</span>
            </div>
            <div class="doom-ctx-item" data-act="footdive">
                <span>⚡ Execute FOOT DIVE</span>
                <span class="doom-ctx-key">Fracture</span>
            </div>
            <div class="doom-ctx-item" data-act="incursion">
                <span>🌀 Multiverse Shockwave</span>
                <span class="doom-ctx-key">616</span>
            </div>
            <div class="doom-ctx-item" data-act="seal">
                <span>🛡️ Seal Reality Rift</span>
                <span class="doom-ctx-key">Reset</span>
            </div>
            <div class="doom-ctx-sep"></div>
            <div class="doom-ctx-item" data-act="decree">
                <span>👑 Latverian Proclamation</span>
                <span class="doom-ctx-key">Doom</span>
            </div>
            <div class="doom-ctx-item" data-act="print">
                <span>📄 Export Dossier</span>
                <span class="doom-ctx-key">Ctrl+P</span>
            </div>
            <div class="doom-ctx-item" data-act="reload">
                <span>↻ Reboot Timeline</span>
                <span class="doom-ctx-key">Ctrl+R</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            doomMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(110.00, 0.09, 'sawtooth', 0.04);
            
            menu.querySelectorAll('.doom-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeDoomMenu();
                    
                    if (act === 'footdive') {
                        window.escalateDoomsdayCrack();
                    } else if (act === 'incursion') {
                        spawnIncursionWave(safeX + 80, safeY + 40);
                    } else if (act === 'seal') {
                        if (typeof window.repairDoomsdayCrack === 'function') {
                            window.repairDoomsdayCrack();
                        }
                    } else if (act === 'decree') {
                        spawnIncursionWave(window.innerWidth / 2, window.innerHeight * 0.45);
                        const banner = document.createElement('div');
                        banner.className = 'doomsday-unlock-banner';
                        banner.textContent = '🟢 ALL HOPE LIES IN DOOM — GRADE 7 PSALMS KNEELS TO NO MULTIVERSE!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 2800);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'reload') {
                        window.location.reload();
                    }
                });
            });
        }, true);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (val === 'foot dive' && document.body.classList.contains('theme-doomsday')) {
                    DOM.searchInput.value = '';
                    filterCards();
                    if (typeof window.escalateDoomsdayCrack === 'function') {
                        window.escalateDoomsdayCrack();
                    }
                }
            });
        }
    }
    function startFaithianCursorAndRally() {
        const faithCursor = document.createElement('div');
        faithCursor.className = 'faithian-emblem-cursor';
        faithCursor.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="4,4 28,13 17,18 13,29" fill="#2563eb" stroke="#facc15" stroke-width="1.8" stroke-linejoin="round"/>
            <polygon points="4,4 17,18 13,29" fill="#ef4444"/>
            <polygon points="24,20 26,25 31,25 27,28 28.5,33 24,30 19.5,33 21,28 17,25 22,25" fill="#facc15" stroke="#ffffff" stroke-width="0.9"/>
        </svg>
    `;
        document.body.appendChild(faithCursor);
        
        let lastFaithX = window.innerWidth / 2;
        let faithCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isFaith = document.body.classList.contains('theme-faithian');
            if (!isFaith) {
                if (faithCursorActive) {
                    faithCursor.classList.remove('is-visible');
                    faithCursorActive = false;
                }
                return;
            }
            
            if (!faithCursorActive) {
                faithCursor.classList.add('is-visible');
                faithCursorActive = true;
            }
            
            const dx = Math.max(-15, Math.min(15, e.clientX - lastFaithX));
            lastFaithX = e.clientX;
            const tilt = dx * 0.7;
            
            faithCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            faithCursor.classList.remove('is-visible');
            faithCursorActive = false;
        });
        
        const rallyPhrases = Array.of(
            'GO FAITHIANS!',
            'CALLED FOR A PURPOSE!',
            'GRADE 7 – PSALMS!',
            '★ AFCS 2026',
            'FAITH • EXCELLENCE • SERVICE'
        );
        
        function triggerFaithianRally(cx, cy, big = false) {
            const palette = Array.of('#ef4444', '#2563eb', '#facc15', '#ffffff');
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 8,
                maxRadius: big ? Math.max(window.innerWidth, window.innerHeight) * 0.5 : 42,
                alpha: 1.0,
                color: big ? '#facc15' : '#ef4444'
            });
            spawnBurst(cx, cy, palette, big ? 48 : 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            if (big) {
                const chord = Array.of(261.63, 329.63, 392.00, 523.25, 659.25);
                chord.forEach((f, idx) => {
                    setTimeout(() => playBeep(f, 0.22, 'triangle', 0.05), idx * 75);
                });
            } else {
                const notes = Array.of(523.25, 659.25, 783.99);
                playBeep(notes.at(Math.floor(Math.random() * notes.length)), 0.08, 'triangle', 0.032);
            }
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-faithian')) return;
            
            faithCursor.classList.add('is-cheering');
            setTimeout(() => faithCursor.classList.remove('is-cheering'), 160);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .faithian-context-menu')) return;
            triggerFaithianRally(e.clientX, e.clientY, false);
            
            if (Math.random() < 0.35) {
                const tag = document.createElement('div');
                tag.className = 'quirk-star-glow';
                tag.textContent = rallyPhrases.at(Math.floor(Math.random() * rallyPhrases.length));
                tag.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-size:13px;font-weight:900;letter-spacing:0.6px;color:#ffffff;text-shadow:0 2px 10px #000,0 0 12px #ef4444,0 0 18px #2563eb;`;
                document.body.appendChild(tag);
                setTimeout(() => tag.remove(), 1000);
            }
        }, { passive: true });
        
        window.triggerFaithianRallyBurst = triggerFaithianRally;
    }
    function startFaithianContextMenu() {
        let faithMenu = null;
        
        function closeFaithMenu() {
            if (faithMenu) {
                faithMenu.remove();
                faithMenu = null;
            }
        }
        
        function runRally(cx, cy, big = true) {
            if (typeof window.triggerFaithianRallyBurst === 'function') {
                window.triggerFaithianRallyBurst(cx, cy, big);
            }
        }
        
        function showFaithianVerseBanner(title, text) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner is-faithian';
            banner.innerHTML = `<strong>${title}</strong><br><span style="font-size:12.5px;font-weight:600;opacity:0.95;">${text}</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4200);
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (faithMenu && !e.target.closest('.faithian-context-menu')) {
                closeFaithMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeFaithMenu();
        });
        window.addEventListener('scroll', closeFaithMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-faithian')) return;
            e.preventDefault();
            e.stopPropagation();
            closeFaithMenu();
            
            const isPsalmsActive = document.body.classList.contains('faithian-psalms-rally');
            
            const menu = document.createElement('div');
            menu.className = 'faithian-context-menu';
            menu.innerHTML = `
            <div class="faith-ctx-header">
                <span>★ AFCS // CALLED FOR A PURPOSE</span>
                <span class="faith-ctx-badge">G7</span>
            </div>
            <div class="faith-ctx-item" data-act="rally">
                <span>📣 Go Faithians! Rally</span>
                <span class="faith-ctx-key">Cheer</span>
            </div>
            <div class="faith-ctx-item" data-act="psalms">
                <span>👑 ${isPsalmsActive ? 'Reset Psalms Aura' : 'Grade 7 – Psalms Aura'}</span>
                <span class="faith-ctx-key">Aura</span>
            </div>
            <div class="faith-ctx-sep"></div>
            <div class="faith-ctx-item" data-act="schoolverse">
                <span>💡 School Verse</span>
                <span class="faith-ctx-key">Matt 5:16</span>
            </div>
            <div class="faith-ctx-item" data-act="yearlyverse">
                <span>🦅 Yearly Verse</span>
                <span class="faith-ctx-key">Isa 40:31</span>
            </div>
            <div class="faith-ctx-sep"></div>
            <div class="faith-ctx-item" data-act="floorplan">
                <span>🗺️ Venue Floorplan</span>
                <span class="faith-ctx-key">Stage</span>
            </div>
            <div class="faith-ctx-item" data-act="print">
                <span>🎟️ Export AFCS Playbill</span>
                <span class="faith-ctx-key">Ctrl+P</span>
            </div>
            <div class="faith-ctx-item" data-act="top">
                <span>⬆️ Back to Top</span>
                <span class="faith-ctx-key">Home</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            faithMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(523.25, 0.08, 'triangle', 0.04);
            
            menu.querySelectorAll('.faith-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeFaithMenu();
                    
                    if (act === 'rally') {
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner('★ ANTIPOLO FAITH CHRISTIAN SCHOOL', 'CALLED FOR A PURPOSE — GO FAITHIANS!');
                    } else if (act === 'psalms') {
                        const active = document.body.classList.toggle('faithian-psalms-rally');
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner('★ GRADE 7 – PSALMS', active ? 'CHAMPIONSHIP AURA ACTIVATED!' : 'CHAMPIONSHIP AURA RESET');
                    } else if (act === 'schoolverse') {
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner(
                            '💡 AFCS SCHOOL VERSE — MATTHEW 5:16',
                            '"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."'
                        );
                    } else if (act === 'yearlyverse') {
                        runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showFaithianVerseBanner(
                            '🦅 AFCS YEARLY VERSE — ISAIAH 40:31',
                            '"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."'
                        );
                    } else if (act === 'floorplan') {
                        const fp = document.querySelector('#floorplan, .floorplan-card');
                        if (fp) fp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        runRally(safeX + 80, safeY + 40, false);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'top') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playBeep(659.25, 0.1, 'triangle', 0.04);
                    }
                });
            });
        }, true);
        
        if (DOM.searchInput) {
            STATE.onSearchInput.push((val) => {
                if (!document.body.classList.contains('theme-faithian')) return;
                
                if (val === 'go faithians' || val === 'afcs') {
                    DOM.searchInput.value = '';
                    filterCards();
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner('★ ANTIPOLO FAITH CHRISTIAN SCHOOL', 'CALLED FOR A PURPOSE — GO FAITHIANS!');
                } else if (val === 'psalms') {
                    DOM.searchInput.value = '';
                    filterCards();
                    const active = document.body.classList.toggle('faithian-psalms-rally');
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner('★ GRADE 7 – PSALMS', active ? 'CHAMPIONSHIP AURA ACTIVATED!' : 'CHAMPIONSHIP AURA RESET');
                } else if (val === 'matthew 5:16' || val === 'matt 5:16') {
                    DOM.searchInput.value = '';
                    filterCards();
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner(
                        '💡 AFCS SCHOOL VERSE — MATTHEW 5:16',
                        '"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."'
                    );
                } else if (val === 'isaiah 40:31' || val === 'isa 40:31') {
                    DOM.searchInput.value = '';
                    filterCards();
                    runRally(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    showFaithianVerseBanner(
                        '🦅 AFCS YEARLY VERSE — ISAIAH 40:31',
                        '"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."'
                    );
                }
            });
        }
    }
    function startMischievousLightCursor() {
        function isMischievousActive() {
            return document.body.classList.contains('theme-red')
            || document.body.classList.contains('theme-reactor')
            || document.body.classList.contains('theme-mischievous');
        }
        
        const redCursor = document.createElement('div');
        redCursor.className = 'mischievous-light-cursor';
        redCursor.innerHTML = `
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://w3.org">
            <defs>
                <linearGradient id="mischDiamondGrad" x1="29" y1="17" x2="29" y2="39" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#ffe4e6"/>
                    <stop offset="35%" stop-color="#ff8080"/>
                    <stop offset="100%" stop-color="#f43f5e"/>
                </linearGradient>
            </defs>
            <polygon points="4,4 25,12.5 15.5,16.5 11.5,26" fill="#450a0a" stroke="#ff6b6b" stroke-width="1.7" stroke-linejoin="round"/>
            <g class="mischievous-vortex-spin">
                <polygon points="29,17 39,27 31,35 24,28 29,23 32,26 30,28 28.5,26.5 27,28 31,32 36,27 29,20 21,28 30,37 28.5,38.5 18,28" fill="url(#mischDiamondGrad)" stroke="#ff4d4d" stroke-width="0.7" stroke-linejoin="round"/>
            </g>
        </svg>
    `;
        document.body.appendChild(redCursor);
        
        let lastRedX = window.innerWidth / 2;
        let redCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            if (!isMischievousActive()) {
                if (redCursorActive) {
                    redCursor.classList.remove('is-visible');
                    redCursorActive = false;
                }
                return;
            }
            
            if (!redCursorActive) {
                redCursor.classList.add('is-visible');
                redCursorActive = true;
            }
            
            const dx = Math.max(-15, Math.min(15, e.clientX - lastRedX));
            lastRedX = e.clientX;
            const tilt = dx * 0.7;
            
            redCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            redCursor.classList.remove('is-visible');
            redCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!isMischievousActive()) return;
            
            redCursor.classList.add('is-mocking');
            setTimeout(() => redCursor.classList.remove('is-mocking'), 180);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .mischievous-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#ff6b6b', '#ef4444', '#ffe4e6', '#991b1b'], 18);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(146.83, 0.09, 'sawtooth', 0.035);
        }, { passive: true });
    }
    function startMischievousLightContextMenu() {
        let redMenu = null;
        
        function isMischievousActive() {
            return document.body.classList.contains('theme-red')
            || document.body.classList.contains('theme-reactor')
            || document.body.classList.contains('theme-mischievous');
        }
        
        function closeRedMenu() {
            if (redMenu) {
                redMenu.remove();
                redMenu = null;
            }
        }
        
        function showRedMockery(title, line) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner';
            banner.style.borderColor = '#ef4444';
            banner.style.background = 'rgba(28, 5, 8, 0.96)';
            banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.9), 0 0 28px rgba(239, 68, 68, 0.75)';
            banner.innerHTML = `<strong style="color:#fca5a5;">🌀 ${title}</strong><br><span style="font-size:12.5px;font-weight:600;color:#ffffff;">"${line}"</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4200);
        }
        
        function triggerCrimsonMalice(x, y, fullRoom = false) {
            if (fullRoom) {
                const flash = document.createElement('div');
                flash.className = 'mischievous-crimson-flash';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 850);
                triggerScreenGlitch(180);
                document.body.classList.add('quirk-bomb-shake');
                setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 360);
            }
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * (fullRoom ? 0.85 : 0.45),
                alpha: 1.0,
                color: '#ef4444'
            });
            
            spawnBurst(x, y, ['#ef4444', '#dc2626', '#fca5a5', '#09090b'], fullRoom ? 58 : 30);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [220.00, 196.00, 155.56, 130.81, 110.00].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.24, 'sawtooth', 0.048), idx * 65);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (redMenu && !e.target.closest('.mischievous-context-menu')) {
                closeRedMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeRedMenu();
        });
        window.addEventListener('scroll', closeRedMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!isMischievousActive()) return;
            e.preventDefault();
            e.stopPropagation();
            closeRedMenu();
            
            const menu = document.createElement('div');
            menu.className = 'mischievous-context-menu';
            menu.innerHTML = `
            <div class="red-ctx-header">
                <span>🌀 MISCHIEVOUS LIGHT // MODIFIER</span>
                <span class="red-ctx-badge">∅</span>
            </div>
            <div class="red-ctx-item" data-act="taunt">
                <span>🩸 Hear Its Whisper</span>
                <span class="red-ctx-key">Mock</span>
            </div>
            <div class="red-ctx-item" data-act="barricade">
                <span>🚫 Seal the Door</span>
                <span class="red-ctx-key">Pulse</span>
            </div>
            <div class="red-ctx-item" data-act="modifier">
                <span>🎲 Activate Random Modifier</span>
                <span class="red-ctx-key">+150%</span>
            </div>
            <div class="red-ctx-sep"></div>
            <div class="red-ctx-item" data-act="codex">
                <span>📕 Peek Into the Codex</span>
                <span class="red-ctx-key">Vault</span>
            </div>
            <div class="red-ctx-item" data-act="crucifix">
                <span>💥 Shatter the Run</span>
                <span class="red-ctx-key">BSOD</span>
            </div>
            <div class="red-ctx-item" data-act="restart">
                <span>↻ Enter the Elevator Again</span>
                <span class="red-ctx-key">Ctrl+R</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            redMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(155.56, 0.11, 'sawtooth', 0.042);
            
            menu.querySelectorAll('.red-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeRedMenu();
                    
                    if (act === 'taunt') {
                        const taunts = Array.of(
                            'Did you really think Guiding Light was going to help you with this one? How adorable.',
                            'You keep clicking around Grade 7 – Psalms like you expect mercy. Let’s turn up the modifiers!',
                            'Oh, look who wandered into the crimson light. Careful—not every door in this tower leads out.',
                            'Curious Light is too friendly, and Guiding Light is too soft. I prefer making things... interesting.',
                            'Why don’t you triple-click Abrena’s portrait again? I promise nothing bad will happen. Probably.'
                        );
                        const picked = taunts.at(Math.floor(Math.random() * taunts.length));
                        triggerCrimsonMalice(safeX + 80, safeY + 40, false);
                        showRedMockery('MISCHIEVOUS LIGHT', picked);
                    } else if (act === 'barricade') {
                        triggerCrimsonMalice(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    } else if (act === 'modifier') {
                        const modifiers = Array.of(
                            'MODIFIER ACTIVE: MAXIMUM OVERDRIVE (+150% CHAOS)',
                            'MODIFIER ACTIVE: LIGHTS OUT IN THE BURJ KHALIFA',
                            'MODIFIER ACTIVE: TRICKSTER’S GAMBIT — WATCH YOUR STEP',
                            'MODIFIER ACTIVE: NO GUIDANCE — YOU’RE ON YOUR OWN'
                        );
                        const modText = modifiers.at(Math.floor(Math.random() * modifiers.length));
                        triggerCrimsonMalice(window.innerWidth / 2, window.innerHeight * 0.45, true);
                        showRedMockery('MODIFIER APPLIED', modText);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                        triggerCrimsonMalice(safeX + 80, safeY + 40, false);
                    } else if (act === 'crucifix') {
                        if (typeof window.triggerAFCSBsod === 'function') {
                            window.triggerAFCSBsod('MISCHIEVOUS_LIGHT_MODIFIER_FATAL', 'CRIMSON_SPIRAL_0xR3D', false);
                        }
                    } else if (act === 'restart') {
                        window.location.reload();
                    }
                });
            });
        }, true);
    }
    function startCuriousLightCursor() {
        function isCuriousLightActive() {
            return document.body.classList.contains('theme-yellow')
            || document.body.classList.contains('theme-curious')
            || document.body.classList.contains('search-fx-cornerstone');
        }
        
        const lightCursor = document.createElement('div');
        lightCursor.className = 'curious-light-cursor';
        lightCursor.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://w3.org">
            <polygon points="4,4 26,13 16,17 12,27" fill="#fef08a" stroke="#facc15" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M27 17L29.2 24.8L37 27L29.2 29.2L27 37L24.8 29.2L17 27L24.8 24.8L27 17Z" fill="#ffffff" stroke="#fde047" stroke-width="1.2"/>
            <circle cx="27" cy="27" r="3" fill="#fef08a"/>
        </svg>
    `;
        document.body.appendChild(lightCursor);
        
        let lastLightX = window.innerWidth / 2;
        let lightCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            if (!isCuriousLightActive()) {
                if (lightCursorActive) {
                    lightCursor.classList.remove('is-visible');
                    lightCursorActive = false;
                }
                return;
            }
            
            if (!lightCursorActive) {
                lightCursor.classList.add('is-visible');
                lightCursorActive = true;
            }
            
            const dx = Math.max(-14, Math.min(14, e.clientX - lastLightX));
            lastLightX = e.clientX;
            const tilt = dx * 0.6;
            
            lightCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            lightCursor.classList.remove('is-visible');
            lightCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!isCuriousLightActive()) return;
            
            lightCursor.classList.add('is-shining');
            setTimeout(() => lightCursor.classList.remove('is-shining'), 180);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .curious-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#fef08a', '#facc15', '#ffffff'], 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(880, 0.09, 'sine', 0.03);
        }, { passive: true });
    }
    function startCuriousLightContextMenu() {
        let curiousMenu = null;
        
        function isCuriousLightActive() {
            return document.body.classList.contains('theme-yellow')
            || document.body.classList.contains('theme-curious')
            || document.body.classList.contains('search-fx-cornerstone');
        }
        
        function closeCuriousMenu() {
            if (curiousMenu) {
                curiousMenu.remove();
                curiousMenu = null;
            }
        }
        
        function showCuriousWhisper(title, line) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner';
            banner.style.borderColor = '#fde047';
            banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.85), 0 0 28px rgba(250, 204, 21, 0.65)';
            banner.innerHTML = `<strong style="color:#fef08a;">✦ ${title}</strong><br><span style="font-size:12.5px;font-weight:600;color:#ffffff;">"${line}"</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4000);
        }
        
        function triggerStarlightBurst(x, y, fullRoom = false) {
            if (fullRoom) {
                const flash = document.createElement('div');
                flash.className = 'curious-illuminate-flash';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 850);
            }
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * (fullRoom ? 0.85 : 0.45),
                alpha: 1.0,
                color: '#fef08a'
            });
            
            spawnBurst(x, y, ['#fef08a', '#facc15', '#ffffff', '#fde68a'], fullRoom ? 60 : 32);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.24, 'sine', 0.045), idx * 65);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (curiousMenu && !e.target.closest('.curious-context-menu')) {
                closeCuriousMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCuriousMenu();
        });
        window.addEventListener('scroll', closeCuriousMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!isCuriousLightActive()) return;
            e.preventDefault();
            e.stopPropagation();
            closeCuriousMenu();
            
            const menu = document.createElement('div');
            menu.className = 'curious-context-menu';
            menu.innerHTML = `
            <div class="curious-ctx-header">
                <span>✦ CURIOUS LIGHT // THE ROOMS</span>
                <span class="curious-ctx-badge">A-000</span>
            </div>
            <div class="curious-ctx-item" data-act="whisper">
                <span>✨ Seek Guidance</span>
                <span class="curious-ctx-key">Hint</span>
            </div>
            <div class="curious-ctx-item" data-act="starlight">
                <span>🌟 Illuminate Room</span>
                <span class="curious-ctx-key">Pulse</span>
            </div>
            <div class="curious-ctx-item" data-act="codex">
                <span>📖 Inspect Secret Codex</span>
                <span class="curious-ctx-key">Vault</span>
            </div>
            <div class="curious-ctx-sep"></div>
            <div class="curious-ctx-item" data-act="nextdoor">
                <span>🚪 Advance to Next Room</span>
                <span class="curious-ctx-key">Roster</span>
            </div>
            <div class="curious-ctx-item" data-act="print">
                <span>📜 Preserve Playbill</span>
                <span class="curious-ctx-key">Ctrl+P</span>
            </div>
            <div class="curious-ctx-item" data-act="top">
                <span>⬆️ Return to A-000</span>
                <span class="curious-ctx-key">Top</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            curiousMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(1046.50, 0.1, 'sine', 0.038);
            
            menu.querySelectorAll('.curious-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeCuriousMenu();
                    
                    if (act === 'whisper') {
                        const whispers = Array.of(
                            'Oh, hello... I didn’t expect to see anyone wandering this far into Grade 7 – Psalms.',
                            'Hmm? You’re looking for secrets? Try triple-clicking the portraits... or typing familiar names.',
                            'Be careful around Abrena’s portrait. Once the yellow eye wakes up, it doesn’t like letting go.',
                            'December 17 is approaching fast. Make sure you’ve checked the floorplan before the doors open!',
                            'You seem determined. Keep shining—even in the darkest rooms of the Burj Khalifa.'
                        );
                        const picked = whispers.at(Math.floor(Math.random() * whispers.length));
                        triggerStarlightBurst(safeX + 80, safeY + 40, false);
                        showCuriousWhisper('CURIOUS LIGHT', picked);
                    } else if (act === 'starlight') {
                        triggerStarlightBurst(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) {
                            codexTrigger.click();
                        }
                        triggerStarlightBurst(safeX + 80, safeY + 40, false);
                    } else if (act === 'nextdoor') {
                        const roster = document.querySelector('.People');
                        if (roster) roster.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        playBeep(783.99, 0.12, 'sine', 0.04);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'top') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playBeep(1046.50, 0.12, 'sine', 0.04);
                    }
                });
            });
        }, true);
    }
    function startSolverCursor() {
        const solverCursor = document.createElement('div');
        solverCursor.className = 'solver-hex-cursor';
        solverCursor.innerHTML = `
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://w3.org">
            <g class="solver-cursor-core" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
                <polygon points="25,16 32.5,29 17.5,29" fill="none"/>
                <line x1="25" y1="16" x2="25" y2="5.5"/>
                <polygon points="25,2.5 21.8,7.5 28.2,7.5" fill="currentColor"/>
                <line x1="32.5" y1="29" x2="41.8" y2="34.4"/>
                <polygon points="44.8,36.2 39.2,36.2 42.2,31" fill="currentColor"/>
                <line x1="17.5" y1="29" x2="8.2" y2="34.4"/>
                <polygon points="5.2,36.2 10.8,36.2 7.8,31" fill="currentColor"/>
            </g>
            <circle cx="25" cy="24.5" r="2.6" fill="#ffffff"/>
        </svg>
    `;
        document.body.appendChild(solverCursor);
        
        let solverCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isSolver = document.body.classList.contains('theme-murderdrones');
            if (!isSolver) {
                if (solverCursorActive) {
                    solverCursor.classList.remove('is-visible');
                    solverCursorActive = false;
                }
                return;
            }
            
            if (!solverCursorActive) {
                solverCursor.classList.add('is-visible');
                solverCursorActive = true;
            }
            
            const isUzi = document.body.classList.contains('solver-uzi-mode');
            solverCursor.classList.toggle('is-uzi', isUzi);
            
            solverCursor.style.transform = `translate3d(${e.clientX - 25}px, ${e.clientY - 25}px, 0)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            solverCursor.classList.remove('is-visible');
            solverCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('theme-murderdrones')) return;
            solverCursor.classList.add('is-executing');
            setTimeout(() => solverCursor.classList.remove('is-executing'), 180);
        }, { passive: true });
    }
    function startPartyHackerCursor() {
        const hackCursor = document.createElement('div');
        hackCursor.className = 'party-hacker-cursor';
        hackCursor.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://w3.org">
            <polygon points="4,4 27,13 17,17 13,27" fill="#050814" stroke="#00ff88" stroke-width="1.9" stroke-linejoin="round"/>
            <polygon points="6,6 22,12.5 15.5,15.5" fill="#00f0ff"/>
            <path d="M24 22H34M29 17V27" stroke="#ff0055" stroke-width="1.6" stroke-linecap="round"/>
            <rect x="25.5" y="18.5" width="7" height="7" stroke="#00ff88" stroke-width="1.2"/>
        </svg>
    `;
        document.body.appendChild(hackCursor);
        
        let lastHackX = window.innerWidth / 2;
        let hackCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            const isParty = document.body.classList.contains('party-mode');
            if (!isParty) {
                if (hackCursorActive) {
                    hackCursor.classList.remove('is-visible');
                    hackCursorActive = false;
                }
                return;
            }
            
            if (!hackCursorActive) {
                hackCursor.classList.add('is-visible');
                hackCursorActive = true;
            }
            
            const dx = Math.max(-16, Math.min(16, e.clientX - lastHackX));
            lastHackX = e.clientX;
            const tilt = dx * 0.7;
            
            hackCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            hackCursor.classList.remove('is-visible');
            hackCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('party-mode')) return;
            
            hackCursor.classList.add('is-injecting');
            setTimeout(() => hackCursor.classList.remove('is-injecting'), 170);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .party-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#00ff88', '#00f0ff', '#ff0055', '#ffffff'], 16);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(920, 0.05, 'square', 0.03);
        }, { passive: true });
    }
    function startPartyHackerContextMenu() {
        let partyMenu = null;
        
        function closePartyMenu() {
            if (partyMenu) {
                partyMenu.remove();
                partyMenu = null;
            }
        }
        
        function runMatrixRainBurst(cx, cy) {
            const glyphs = Array.of('0', '1', '0x7F', 'ROOT', 'NULL', 'ACK', 'SYN', 'HEX');
            for (let i = 0; i < 16; i++) {
                setTimeout(() => {
                    const tag = document.createElement('div');
                    tag.className = 'quirk-star-glow';
                    tag.textContent = glyphs.at(Math.floor(Math.random() * glyphs.length));
                    const rx = cx + (Math.random() - 0.5) * 320;
                    const ry = cy + (Math.random() - 0.5) * 180;
                    tag.style.cssText = `left:${rx}px;top:${ry}px;font-family:Consolas,monospace;font-size:13px;font-weight:900;color:#00ff88;text-shadow:0 0 10px #00ff88,0 0 18px #00f0ff;`;
                    document.body.appendChild(tag);
                    setTimeout(() => tag.remove(), 1100);
                }, i * 35);
            }
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: cx,
                y: cy,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.6,
                alpha: 1.0,
                color: '#00ff88'
            });
            spawnBurst(cx, cy, ['#00ff88', '#00f0ff', '#ff0055', '#ffffff'], 45);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (partyMenu && !e.target.closest('.party-context-menu')) {
                closePartyMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePartyMenu();
        });
        window.addEventListener('scroll', closePartyMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('party-mode')) return;
            e.preventDefault();
            e.stopPropagation();
            closePartyMenu();
            
            const menu = document.createElement('div');
            menu.className = 'party-context-menu';
            menu.innerHTML = `
            <div class="party-ctx-header">
                <span>💻 ROOT@AFCS // OVERCLOCK</span>
                <span class="party-ctx-badge">SUDO</span>
            </div>
            <div class="party-ctx-item" data-act="inject">
                <span>⚡ ./inject_payload.sh</span>
                <span class="party-ctx-key">0xFF</span>
            </div>
            <div class="party-ctx-item" data-act="glitch">
                <span>📡 Force CRT Desync</span>
                <span class="party-ctx-key">Glitch</span>
            </div>
            <div class="party-ctx-item" data-act="unlock">
                <span>🔓 Dump Secret Codex</span>
                <span class="party-ctx-key">Vault</span>
            </div>
            <div class="party-ctx-sep"></div>
            <div class="party-ctx-item" data-act="exitparty">
                <span>🛑 kill -9 party_mode</span>
                <span class="party-ctx-key">Exit</span>
            </div>
            <div class="party-ctx-item" data-act="bsod">
                <span>💀 Trigger Kernel Panic</span>
                <span class="party-ctx-key">0x00</span>
            </div>
            <div class="party-ctx-item" data-act="reload">
                <span>↻ sudo reboot --now</span>
                <span class="party-ctx-key">Ctrl+R</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            partyMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(1180, 0.06, 'square', 0.038);
            
            menu.querySelectorAll('.party-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closePartyMenu();
                    
                    if (act === 'inject') {
                        runMatrixRainBurst(safeX + 80, safeY + 40);
                        triggerScreenGlitch(160);
                        [440, 554.37, 659.25, 880, 1108.73].forEach((f, idx) => {
                            setTimeout(() => playBeep(f, 0.08, 'square', 0.045), idx * 55);
                        });
                    } else if (act === 'glitch') {
                        triggerScreenGlitch(320);
                        document.body.classList.add('quirk-bomb-shake');
                        setTimeout(() => document.body.classList.remove('quirk-bomb-shake'), 320);
                        playBeep(180, 0.22, 'sawtooth', 0.05);
                    } else if (act === 'unlock') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                        playBeep(880, 0.09, 'square', 0.04);
                    } else if (act === 'exitparty') {
                        if (typeof togglePartyMode === 'function') {
                            togglePartyMode();
                        } else {
                            document.body.classList.remove('party-mode');
                        }
                        playBeep(320, 0.12, 'sawtooth', 0.045);
                    } else if (act === 'bsod') {
                        if (typeof window.triggerAFCSBsod === 'function') {
                            window.triggerAFCSBsod('ROOT_SHELL_KERNEL_PANIC', 'OVERCLOCK_DAEMON_0x1337', false);
                        }
                    } else if (act === 'reload') {
                        window.location.reload();
                    }
                });
            });
        }, true);
    }
    function startGuidingLightCursor() {
        function isGuidingLightActive() {
            const b = document.body.classList;
            return !b.contains('theme-griefer')
            && !b.contains('theme-hamilton') &&
            !b.classList.contains('theme-epic') &&
            !b.classList.contains('theme-doomsday') &&
            !b.classList.contains('theme-faithian') &&
            !b.classList.contains('theme-red') &&
            !b.classList.contains('theme-reactor') &&
            !b.classList.contains('theme-yellow') &&
            !b.classList.contains('theme-curious') &&
            !b.classList.contains('search-fx-cornerstone') &&
            !b.classList.contains('theme-murderdrones') &&
            !b.classList.contains('party-mode');
        };
        
        const guideCursor = document.createElement('div');
        guideCursor.className = 'guiding-light-cursor';
        guideCursor.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://w3.org">
            <polygon points="4,4 26,13 16,17 12,27" fill="#bae6fd" stroke="#38bdf8" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M29 19C24.5 19 21 22.5 21 27C21 31.5 24.5 35 29 35C31.5 35 33.7 33.9 35.1 32.1C33.8 32.6 32.3 32.8 30.8 32.4C26.9 31.4 24.6 27.4 25.6 23.5C26.1 21.6 27.4 20 29 19Z" fill="#ffffff" stroke="#7dd3fc" stroke-width="1.1"/>
            <path d="M33 17L34.1 20.9L38 22L34.1 23.1L33 27L31.9 23.1L28 22L31.9 20.9L33 17Z" fill="#e0f2fe"/>
        </svg>
    `;
        document.body.appendChild(guideCursor);
        
        let lastGuideX = window.innerWidth / 2;
        let guideCursorActive = false;
        
        window.addEventListener('pointermove', (e) => {
            if (!isGuidingLightActive()) {
                if (guideCursorActive) {
                    guideCursor.classList.remove('is-visible');
                    guideCursorActive = false;
                }
                return;
            }
            
            if (!guideCursorActive) {
                guideCursor.classList.add('is-visible');
                guideCursorActive = true;
            }
            
            const dx = Math.max(-14, Math.min(14, e.clientX - lastGuideX));
            lastGuideX = e.clientX;
            const tilt = dx * 0.6;
            
            guideCursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) rotate(${tilt}deg)`;
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            guideCursor.classList.remove('is-visible');
            guideCursorActive = false;
        });
        
        window.addEventListener('pointerdown', (e) => {
            if (!isGuidingLightActive()) return;
            
            guideCursor.classList.add('is-guiding');
            setTimeout(() => guideCursor.classList.remove('is-guiding'), 180);
            
            if (e.button !== 0 || e.target.closest('button, input, .PeoplePics, .guiding-context-menu')) return;
            
            spawnBurst(e.clientX, e.clientY, ['#38bdf8', '#bae6fd', '#ffffff'], 14);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(659.25, 0.08, 'sine', 0.028);
        }, { passive: true });
    }
    function startGuidingLightContextMenu() {
        let guidingMenu = null;
        
        function isGuidingLightActive() {
            const b = document.body.classList;
            return !b.contains('theme-griefer') &&
            !b.contains('theme-hamilton')
            && !b.contains('theme-epic')
            && !b.contains('theme-doomsday')
            && !b.contains('theme-faithian')
            && !b.contains('theme-red')
            && !b.contains('theme-reactor')
            && !b.contains('theme-yellow')
            && !b.contains('theme-curious')
            && !b.contains('search-fx-cornerstone')
            && !b.contains('theme-murderdrones')
            && !b.contains('party-mode');
        }
        
        function closeGuidingMenu() {
            if (guidingMenu) {
                guidingMenu.remove();
                guidingMenu = null;
            }
        }
        
        function showGuidingMessage(title, text) {
            document.querySelectorAll('.theme-announce-banner').forEach(el => el.remove());
            const banner = document.createElement('div');
            banner.className = 'theme-announce-banner';
            banner.style.borderColor = '#38bdf8';
            banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.85), 0 0 28px rgba(56, 189, 248, 0.65)';
            banner.innerHTML = `<strong style="color:#bae6fd;">☾ ${title}</strong><br><span style="font-size:12.5px;font-weight:600;color:#ffffff;">"${text}"</span>`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4200);
        }
        
        function triggerBlueGuidance(x, y, fullFlash = false) {
            if (fullFlash) {
                const flash = document.createElement('div');
                flash.className = 'guiding-illuminate-flash';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 850);
            }
            
            STATE.particles.push({
                type: 'SHOCKWAVE',
                x: x,
                y: y,
                radius: 10,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * (fullFlash ? 0.85 : 0.45),
                alpha: 1.0,
                color: '#38bdf8'
            });
            
            spawnBurst(x, y, ['#38bdf8', '#7dd3fc', '#bae6fd', '#ffffff'], fullFlash ? 56 : 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            
            [392.00, 493.88, 587.33, 783.99, 987.77].forEach((freq, idx) => {
                setTimeout(() => playBeep(freq, 0.24, 'sine', 0.042), idx * 65);
            });
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (guidingMenu && !e.target.closest('.guiding-context-menu')) {
                closeGuidingMenu();
            }
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGuidingMenu();
        });
        window.addEventListener('scroll', closeGuidingMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!isGuidingLightActive()) return;
            e.preventDefault();
            e.stopPropagation();
            closeGuidingMenu();
            
            const menu = document.createElement('div');
            menu.className = 'guiding-context-menu';
            menu.innerHTML = `
            <div class="guide-ctx-header">
                <span>☾ GUIDING LIGHT // DOOR 001</span>
                <span class="guide-ctx-badge">AFCS</span>
            </div>
            <div class="guide-ctx-item" data-act="guidance">
                <span>🕯️ Illuminate the Path</span>
                <span class="guide-ctx-key">Guide</span>
            </div>
            <div class="guide-ctx-item" data-act="whisper">
                <span>💙 Listen to Guiding Light</span>
                <span class="guide-ctx-key">Hint</span>
            </div>
            <div class="guide-ctx-item" data-act="codex">
                <span>📖 Open Secret Codex</span>
                <span class="guide-ctx-key">Vault</span>
            </div>
            <div class="guide-ctx-sep"></div>
            <div class="guide-ctx-item" data-act="cast">
                <span>🎭 Guide to Cast & Crew</span>
                <span class="guide-ctx-key">Roster</span>
            </div>
            <div class="guide-ctx-item" data-act="floorplan">
                <span>🗺️ Burj Khalifa Floorplan</span>
                <span class="guide-ctx-key">Map</span>
            </div>
            <div class="guide-ctx-item" data-act="print">
                <span>🎟️ Export Official Playbill</span>
                <span class="guide-ctx-key">Ctrl+P</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            guidingMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - rect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - rect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            playBeep(783.99, 0.1, 'sine', 0.038);
            
            menu.querySelectorAll('.guide-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closeGuidingMenu();
                    
                    if (act === 'guidance') {
                        triggerBlueGuidance(window.innerWidth / 2, window.innerHeight * 0.45, true);
                    } else if (act === 'whisper') {
                        const hints = Array.of(
                            'It seems you have found Beyond The Manger. Take your time exploring every student’s story.',
                            'Whenever you feel lost in the tower, follow the blue light—it will always guide you back.',
                            'Try triple-clicking on certain classmates’ portraits... each one hides a soul of its own.',
                            'You can switch between Curious Light, Olympus, Latveria, and more using the search bar.',
                            'December 17 is fast approaching. Grade 7 – Psalms is ready to shine on stage!'
                        );
                        const picked = hints.at(Math.floor(Math.random() * hints.length));
                        triggerBlueGuidance(safeX + 80, safeY + 40, false);
                        showGuidingMessage('GUIDING LIGHT', picked);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                        triggerBlueGuidance(safeX + 80, safeY + 40, false);
                    } else if (act === 'cast') {
                        const roster = document.querySelector('.People');
                        if (roster) roster.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        playBeep(587.33, 0.12, 'sine', 0.04);
                    } else if (act === 'floorplan') {
                        const fp = document.querySelector('#floorplan, .floorplan-card');
                        if (fp) fp.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        playBeep(659.25, 0.12, 'sine', 0.04);
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    }
                });
            });
        }, true);
    }
    function startDoggieWaveCursor() {
        if (document.getElementById('doggieWaveCursor')) return;
        
        const trailCanvas = document.createElement('canvas');
        trailCanvas.id = 'doggieWaveTrailCanvas';
        trailCanvas.className = 'doggie-wave-trail-canvas';
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
        document.body.appendChild(trailCanvas);
        const tCtx = trailCanvas.getContext('2d');
        
        window.addEventListener('resize', () => {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }, { passive: true });
        
        const cursorEl = document.createElement('div');
        cursorEl.id = 'doggieWaveCursor';
        cursorEl.className = 'doggie-wave-cursor';
        cursorEl.innerHTML = `<svg viewBox="0 0 56 44" width="44" height="36" fill="none" xmlns="http://w3.org">
            <defs>
                <linearGradient id="doggieWaveGrad" x1="4" y1="22" x2="50" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#ff00dd"/>
                    <stop offset="52%" stop-color="#ff4db8"/>
                    <stop offset="78%" stop-color="#ffae42"/>
                    <stop offset="100%" stop-color="#fff04d"/>
                </linearGradient>
            </defs>
            <path d="M51 22 C51 11 40 7 29 8 L17 5 L22 12 L9 11 L18 17 L4 22 L18 27 L9 33 L22 32 L17 39 L29 36 C40 37 51 33 51 22 Z"
                  fill="url(#doggieWaveGrad)" stroke="#09090b" stroke-width="3.2" stroke-linejoin="round"/>
        </svg>`;
        document.body.appendChild(cursorEl);
        if (typeof startGriefContextMenu === 'function') startGriefContextMenu();
        
        let lastX = null;
        let lastY = null;
        let currentAngle = 0;
        const trailPoints = [];
        let trailLoopActive = false;
        
        const isGrieferActive = () => document.body.classList.contains('theme-griefer');
        
        function renderTrail() {
            tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            const now = performance.now();
            
            while (trailPoints.length && now - trailPoints[0].t > 380) {
                trailPoints.shift();
            }
            
            if (trailPoints.length > 1 && isGrieferActive() && !STATE.ldmActive) {
                for (let i = 1; i < trailPoints.length; i++) {
                    const p0 = trailPoints[i - 1];
                    const p1 = trailPoints[i];
                    const life = 1 - (now - p1.t) / 380;
                    if (life <= 0) continue;
                    
                    tCtx.save();
                    tCtx.lineCap = 'round';
                    tCtx.lineJoin = 'round';
                    
                    tCtx.strokeStyle = `rgba(255, 0, 221, ${life * 0.45})`;
                    tCtx.lineWidth = Math.max(2, life * 16);
                    tCtx.beginPath();
                    tCtx.moveTo(p0.x, p0.y);
                    tCtx.lineTo(p1.x, p1.y);
                    tCtx.stroke();
                    
                    tCtx.strokeStyle = `rgba(255, 240, 77, ${life * 0.92})`;
                    tCtx.lineWidth = Math.max(1.5, life * 7);
                    tCtx.beginPath();
                    tCtx.moveTo(p0.x, p0.y);
                    tCtx.lineTo(p1.x, p1.y);
                    tCtx.stroke();
                    tCtx.restore();
                }
            }
            
            if (trailPoints.length > 0) {
                requestAnimationFrame(renderTrail);
            } else {
                trailLoopActive = false;
            }
        }
        
        document.addEventListener('pointermove', (e) => {
            if (!isGrieferActive()) {
                cursorEl.classList.remove('is-visible');
                lastX = null;
                lastY = null;
                return;
            }
            
            if (lastX !== null && lastY !== null) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                if (Math.hypot(dx, dy) > 1.5) {
                    currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                }
            }
            lastX = e.clientX;
            lastY = e.clientY;
            
            cursorEl.classList.add('is-visible');
            cursorEl.style.transform = `translate3d(${e.clientX - 40}px, ${e.clientY - 18}px, 0) rotate(${currentAngle.toFixed(1)}deg)`;
            
            trailPoints.push({ x: e.clientX, y: e.clientY, t: performance.now() });
            if (trailPoints.length > 45) trailPoints.shift();
            if (!trailLoopActive) {
                trailLoopActive = true;
                requestAnimationFrame(renderTrail);
            }
        }, { passive: true });
        
        document.addEventListener('pointerdown', (e) => {
            if (!isGrieferActive()) return;
            cursorEl.classList.add('is-dashing');
            setTimeout(() => cursorEl.classList.remove('is-dashing'), 140);
            if (e.button === 0 && !e.target.closest('button, input, .PeoplePics, .griefer-context-menu')) {
                spawnBurst(e.clientX, e.clientY, ['#ff00dd', '#ffae42', '#fff04d', '#ffffff'], 16);
                if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                playBeep(146.83, 0.08, 'sawtooth', 0.032);
            }
        }, { passive: true });
        
        document.addEventListener('pointerleave', () => {
            cursorEl.classList.remove('is-visible');
            lastX = null;
            lastY = null;
        });
        
        new MutationObserver(() => {
            if (!isGrieferActive()) {
                cursorEl.classList.remove('is-visible');
                trailPoints.length = 0;
                tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            }
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    
    let griefMenuInitialized = false;
    function startGriefContextMenu() {
        if (griefMenuInitialized) return;
        griefMenuInitialized = true;
        
        let griefMenu = null;
        function closeGriefMenu() {
            if (griefMenu) {
                griefMenu.remove();
                griefMenu = null;
            }
        }
        
        window.addEventListener('pointerdown', (e) => {
            if (griefMenu && !e.target.closest('.griefer-context-menu')) closeGriefMenu();
        }, { passive: true });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGriefMenu();
        });
        window.addEventListener('scroll', closeGriefMenu, { passive: true });
        
        document.addEventListener('contextmenu', (e) => {
            if (!document.body.classList.contains('theme-griefer')) return;
            e.preventDefault();
            e.stopPropagation();
            closeGriefMenu();
            
            const isBordersOn = document.body.classList.contains('grief-highlights-active');
            
            const menu = document.createElement('div');
            menu.className = 'griefer-context-menu';
            menu.innerHTML = `
            <div class="grief-ctx-header">
                <span>🔥 GRIEF.EXE // DOGGIE WAVE</span>
                <span class="grief-ctx-badge">80%</span>
            </div>
            <div class="grief-ctx-item" data-act="roster">
                <span>🎭 Jump to Cast & Crew</span>
                <span class="grief-ctx-key">Roster</span>
            </div>
            <div class="grief-ctx-item" data-act="codex">
                <span>📖 Open Secret Codex</span>
                <span class="grief-ctx-key">Vault</span>
            </div>
            <div class="grief-ctx-item" data-act="print">
                <span>🎟️ Export Playbill</span>
                <span class="grief-ctx-key">Ctrl+P</span>
            </div>
            <div class="grief-ctx-sep"></div>
            <div class="grief-ctx-item" data-act="pulse">
                <span>⚡ Trigger Wave Pulse</span>
                <span class="grief-ctx-key">4×</span>
            </div>
            <div class="grief-ctx-item" data-act="verify">
                <span>🏆 Verify Grief (100%)</span>
                <span class="grief-ctx-key">GG</span>
            </div>
            <div class="grief-ctx-item" data-act="highlights">
                <span>⬜ ${isBordersOn ? 'Disable' : 'Enable'} Grief Borders</span>
                <span class="grief-ctx-key">UI</span>
            </div>
            <div class="grief-ctx-item" data-act="deadlocked">
                <span>🟦 Launch Deadlocked</span>
                <span class="grief-ctx-key">GD</span>
            </div>
            <div class="grief-ctx-sep"></div>
            <div class="grief-ctx-item" data-act="guiding">
                <span>🌙 Return to Guiding Light</span>
                <span class="grief-ctx-key">Reset</span>
            </div>
        `;
            
            document.body.appendChild(menu);
            griefMenu = menu;
            
            const rect = menu.getBoundingClientRect();
            const safeX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, e.clientX));
            const safeY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            
            if (typeof playBeep === 'function') playBeep(110, 0.09, 'sawtooth', 0.042);
            
            menu.querySelectorAll('.grief-ctx-item').forEach(item => {
                item.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const act = item.dataset.act;
                    closeGriefMenu();
                    
                    if (act === 'roster') {
                        document.querySelector('.People')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        if (typeof playBeep === 'function') playBeep(440, 0.1, 'triangle', 0.04);
                    } else if (act === 'codex') {
                        const codexTrigger = Array.from(document.querySelectorAll('button, [role="button"], div, span')).find(el =>
                            el.textContent.trim().toLowerCase().includes('secrets:')
                        );
                        if (codexTrigger) codexTrigger.click();
                    } else if (act === 'print') {
                        setTimeout(() => window.print(), 100);
                    } else if (act === 'pulse') {
                        const flash = document.createElement('div');
                        flash.className = 'griefer-wave-flash';
                        document.body.appendChild(flash);
                        setTimeout(() => flash.remove(), 850);
                        if (typeof STATE !== 'undefined' && Array.isArray(STATE.particles)) {
                            STATE.particles.push({
                                type: 'SHOCKWAVE',
                                x: safeX + 80,
                                y: safeY + 60,
                                radius: 10,
                                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.85,
                                alpha: 1.0,
                                color: '#ff00dd'
                            });
                        }
                        if (typeof spawnBurst === 'function') {
                            spawnBurst(safeX + 80, safeY + 60, ['#ff00dd', '#ffae42', '#fff04d', '#cc0000'], 48);
                        }
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        if (typeof playBeep === 'function') {
                            playBeep(110, 0.25, 'sawtooth', 0.14);
                            setTimeout(() => playBeep(82.41, 0.45, 'sawtooth', 0.16), 90);
                        }
                    } else if (act === 'verify') {
                        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(160);
                        const banner = document.createElement('div');
                        banner.className = 'theme-announce-banner';
                        banner.style.borderColor = '#fff04d';
                        banner.style.background = 'linear-gradient(135deg, rgba(20, 0, 0, 0.97), rgba(75, 0, 45, 0.95))';
                        banner.style.color = '#fff04d';
                        banner.style.boxShadow = '0 0 32px rgba(255, 0, 221, 0.85), 0 0 48px rgba(255, 240, 77, 0.55)';
                        banner.textContent = '🔥 NEW BEST! 80% ➔ 100% // GRIEF VERIFIED BY DOGGIE!';
                        document.body.appendChild(banner);
                        setTimeout(() => banner.remove(), 3000);
                        
                        if (typeof spawnBurst === 'function') {
                            spawnBurst(window.innerWidth / 2, window.innerHeight * 0.45, ['#ff00dd', '#fff04d', '#ffffff', '#cc0000'], 60);
                        }
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        if (typeof playBeep === 'function') {
                            [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                                setTimeout(() => playBeep(f, 0.18, 'triangle', 0.055), i * 80);
                            });
                        }
                    } else if (act === 'highlights') {
                        document.body.classList.toggle('grief-highlights-active');
                    } else if (act === 'deadlocked') {
                        const input = document.getElementById('searchInput');
                        if (input) {
                            input.value = 'deadlocked';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } else if (act === 'guiding') {
                        if (typeof window.applyTheme === 'function') window.applyTheme('blue');
                    }
                });
            });
        }, true);
    }
    
    let cynHistoryTrapped = false;
    
    function lockCynHistory() {
        if (cynHistoryTrapped) return;
        cynHistoryTrapped = true;
        history.pushState({ cynSolverTrap: true }, '', window.location.href);
    }
    
    window.addEventListener('popstate', () => {
        if (!cacebCard || !cacebCard.classList.contains('quirk-cyn-solver')) {
            cynHistoryTrapped = false;
            return;
        }
        history.pushState({ cynSolverTrap: true }, '', window.location.href);
        
        const trapLine = 'Giggle. Did you really think the Back button would save you?';
        lastCynSpeech = trapLine;
        spawnBadge(cacebCard, `⬡ [NAVIGATION DENIED] ${trapLine}`, 'quirk-cyn-badge', 1800);
        speakCynLine(trapLine);
        triggerScreenGlitch(160);
        syncCynSidePanel(trapLine);
        
        const rect = cacebCard.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#facc15', '#ef4444', '#ffffff'], 28);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
    });
    //#endregion
    