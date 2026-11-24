function startNewtonAlterEgo() {
    const newtonFormulas = [
        'F = m · a (Second Law of Motion)',
        'F = G · (m₁m₂) / r² (Universal Gravitation)',
        'Every action has an equal and opposite reaction! ',
        'An object at rest stays at rest unless acted upon! ',
        'd/dx (xⁿ) = n·xⁿ⁻¹ (Method of Fluxions!) ',
        '∫ f(x) dx — Fundamental Theorem of Calculus! ∫',
        'White light splits into ROYGBIV through a prism! ',
        'g ≈ 9.80665 m/s² — Watch out for falling apples! ',
        'If I have seen further, it is by standing on the shoulders of giants.',
        'Principia Mathematica (1687) — Laws of the Cosmos! ',
        'v = u + a·t | s = u·t + ½a·t² ',
        'p = m · v (Conservation of Momentum) ',
        'T_cool(t) = T_env + (T₀ − T_env)·e^(-kt) ',
        '(a + b)ⁿ = ∑ C(n,k) aⁿ⁻ᵏ bᵏ (Generalized Binomial Theorem!) ',
        'xₙ₊₁ = xₙ − f(xₙ) / f\'(xₙ) (Newton-Raphson Method!) ',
        'F = dp / dt (Force is the rate of change of momentum!) ',
        'J = F · Δt = Δp (Impulse-Momentum Theorem) ',
        'v² = u² + 2·a·s (Torricelli / Kinematic Equation) ',
        's = ½(u + v)·t (Average Velocity Displacement) ',
        'F_c = m·v² / r (Centripetal Force) ',
        'a_c = v² / r = ω²·r (Centripetal Acceleration) ',
        'g = G·M / R² (Gravitational Field Strength) ',
        'U_g = −G·(m₁m₂) / r (Gravitational Potential Energy) ',
        'v_esc = √(2GM / R) (Escape Velocity) ',
        'v_orb = √(GM / r) (Orbital Velocity) ',
        'T² = (4π² / GM)·r³ (Newton\'s Form of Kepler\'s Third Law) ',
        'd²r / dt² = −(GM / r²)·r̂ (Inverse-Square Orbital Acceleration) ',
        'P = F / A (Pressure Definition — 1 Pa = 1 N/m²) ',
        'W = F · d · cos(θ) (Mechanical Work) ',
        'KE = ½m·v² (Kinetic Energy) ',
        'PE = m·g·h (Near-Surface Gravitational Potential Energy) ',
        'P = W / t = F · v (Mechanical Power) ',
        'τ = r × F = I · α (Torque and Angular Acceleration) ',
        'L = I · ω = r × p (Angular Momentum) ',
        'dT / dt = −k·(T − T_env) (Newton\'s Law of Cooling — Differential Form) ',
        'τ_shear = μ · (du / dy) (Newtonian Fluid Viscosity!) ',
        'v_sound = √(P / ρ) (Newton\'s Formula for Speed of Sound) ',
        '1 / f = (n − 1)·(1/R₁ − 1/R₂) (Lensmaker\'s Equation) ',
        'rₙ = √(n · λ · R) (Newton\'s Rings Interference Radius!) ',
        'f_total = f₁ + f₂ (Power of Thin Lenses in Contact) ',
        '1 N = 1 kg·m/s² (The Newton — SI Unit of Force!) ',
        'G ≈ 6.67430 × 10⁻¹¹ N·m²/kg² (Universal Gravitational Constant) ',
        'd/dx [u(x)·v(x)] = u\'v + uv\' (Product Rule of Fluxions) ',
        'd/dx [u(x)/v(x)] = (u\'v − uv\') / v² (Quotient Rule of Fluxions) ',
        'dy/dx = (dy/dt) / (dx/dt) (Parametric Fluxions!) ',
        'A = ∫ₐᵇ f(x) dx (Area Under a Curve via Quadrature) ',
        'R = [1 + (dy/dx)²]^(3/2) / |d²y/dx²| (Radius of Curvature) ',
        'Pₙ(x) = f[x₀] + f[x₀,x₁](x−x₀) + ... (Newton\'s Divided Difference Polynomial) ',
        'Δⁿf(x) = ∑ (-1)ⁿ⁻ᵏ C(n,k) f(x + k·h) (Newton\'s Forward Difference Formula) ',
        'e = −(v₂ − v₁) / (u₂ − u₁) (Newton\'s Law of Restitution — Collisions!) ',
        'Opticks (1704) — Corpuscular Theory of Light & Prisms! ',
        'Reflecting Telescope (1668) — No Chromatic Aberration! ',
        'Absolute Space and Absolute Time — Principia Scholium! ',
        'Bucket Argument — Rotating Water & True Rotational Motion! ',
        'What goes up must come down! ',
        'Nature is pleased with simplicity, and affects not the pomp of superfluous causes. ',
        'Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things. ',
        'To every action there is always opposed an equal reaction. ',
        'Gravity explains the motions of the planets, but it cannot explain who sets the planets in motion. ',
        'I can calculate the motion of heavenly bodies, but not the madness of people. ',
        'Tact is the knack of making a point without making an enemy. ',
        'Genius is patience. ',
        'No great discovery was ever made without a bold guess. ',
        'A man may imagine things that are false, but he can only understand things that are true. ',
        'To myself I am only a child playing on the beach, while vast oceans of truth lie undiscovered before me. '
    ];
    let isNewton = false;
    let newtonIdx = -1;
    let savedEulerState = null;
    function bindPanelNewtonClick() {
        if (!isNewton || !DOM.panelImageContainer) return;
        const drawerImg = DOM.panelImageContainer.querySelector('img');
        if (!drawerImg || drawerImg.dataset.newtonBound === 'true') return;
        drawerImg.dataset.newtonBound = 'true';
        drawerImg.style.cursor = 'pointer';
        drawerImg.title = 'Click Sir Isaac Newton for a Law or Fluxion!';
        drawerImg.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIdx = Math.floor(Math.random() * newtonFormulas.length);
            if (newtonFormulas.length > 1 && nextIdx === newtonIdx) {
                nextIdx = (nextIdx + 1) % newtonFormulas.length;
            }
            newtonIdx = nextIdx;
            let bubble = DOM.panelBody.querySelector('.panel-newton-quote');
            if (!bubble) {
                bubble = document.createElement('div');
                bubble.className = 'panel-newton-quote';
                DOM.panelBody.prepend(bubble);
            }
            bubble.textContent = newtonFormulas[newtonIdx];
            bubble.classList.remove('is-pop');
            void bubble.offsetWidth;
            bubble.classList.add('is-pop'); 
            const rect = DOM.panelImageContainer.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ef4444', '#22c55e', '#facc15'], 18);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(392.00, 0.08, 'triangle', 0.045);
            setTimeout(() => playBeep(587.33, 0.14, 'triangle', 0.045), 70);
        });
    }
    STATE.onOpenCard.push((openedCard) => {
        if (isNewton && openedCard && openedCard.closest('#eulerSecretWrapper')) {
            requestAnimationFrame(bindPanelNewtonClick);
        }
        return false;
    });
    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('#eulerSecretWrapper');
        if (!wrapper) return;
        const card = wrapper.querySelector('.PeoplePics');
        if (!card) return;
        if (e.detail === 3) {
            isNewton = !isNewton;
            const img = card.querySelector('img');
            const label = card.querySelector('.overlay-text');
            const pip = wrapper.querySelector('.portrait-role-pip');
            const rings = wrapper.querySelectorAll('.euler-orbit-ring');
            const satellite = wrapper.querySelector('.euler-unit-circle');
            if (!savedEulerState && satellite) {
                savedEulerState = {
                    satelliteHTML: satellite.innerHTML,
                    satelliteTitle: satellite.title
                };
            }
            card.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
            setTimeout(() => {
                if (isNewton) {
                    card.classList.remove('is-euler-card');
                    card.classList.add('is-newton-card');
                    card.dataset.displayRole = 'VIP Physics Legend';
                    card.dataset.character = 'Artist 8 - Father of Calculus & Gravity';
                    card.dataset.birthday = 'January 4, 1643';
                    card.dataset.bio = 'English mathematician, physicist, and astronomer who discovered Universal Gravitation and Calculus, dropping into Paskong AFCS 2026!';
                    if (img) {
                        img.src = 'otherpicss/Newton.jpg';
                        img.alt = 'Newton, Isaac';
                        img.classList.add('is-newton-pfp');
                    }
                    if (label) label.textContent = 'Newton, Isaac';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-newton';
                        pip.textContent = '🍎';
                        pip.title = 'Sir Isaac Newton (F = ma)';
                    }
                    rings.forEach(r => r.classList.add('is-newton-ring'));
                    if (satellite) {
                        satellite.classList.add('is-newton-apple');
                        satellite.title = 'Gravity Apple (g ≈ 9.81 m/s²)';
                        satellite.innerHTML = '🍎';
                    }
                } else {
                    card.classList.remove('is-newton-card');
                    card.classList.add('is-euler-card');
                    card.dataset.displayRole = 'VIP Math Legend';
                    card.dataset.character = 'Artist 8 - Grandmaster of Mathematics';
                    card.dataset.birthday = 'April 15, 1707';
                    card.dataset.bio = '18th-century Swiss mathematician, physicist, and creator of e^(iπ) + 1 = 0, stopping by the Burj Khalifa Christmas Meet & Greet for Paskong AFCS 2026!';
                    if (img) {
                        img.src = 'otherpicss/euler.jpg';
                        img.alt = 'Euler, Leonhard';
                        img.classList.remove('is-newton-pfp');
                    }
                    if (label) label.textContent = 'Euler, Leonhard';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-euler';
                        pip.textContent = '∑';
                        pip.title = 'Leonhard Euler (e ≈ 2.71828)';
                    }
                    rings.forEach(r => r.classList.remove('is-newton-ring'));
                    if (satellite && savedEulerState) {
                        satellite.classList.remove('is-newton-apple');
                        satellite.title = savedEulerState.satelliteTitle;
                        satellite.innerHTML = savedEulerState.satelliteHTML;
                    }
                }
                if (DOM.panel && DOM.panel.classList.contains('active') && card.classList.contains('active')) {
                    openCard(card);
                    if (isNewton) bindPanelNewtonClick();
                }
            }, 275);
            const rect = card.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, isNewton ? ['#ef4444', '#22c55e', '#facc15'] : ['#facc15', '#38bdf8', '#ffffff'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isNewton ? 392.00 : 543.66, 0.09, 'triangle', 0.045);
            setTimeout(() => playBeep(isNewton ? 587.33 : 440.00, 0.14, 'triangle', 0.045), 75);
            return;
        }
        if (isNewton) {
            setTimeout(() => {
                const bubble = document.querySelector('.quirk-euler-bubble');
                if (bubble) {
                    let nextIdx = Math.floor(Math.random() * newtonFormulas.length);
                    if (newtonFormulas.length > 1 && nextIdx === newtonIdx) {
                        nextIdx = (nextIdx + 1) % newtonFormulas.length;
                    }
                    newtonIdx = nextIdx;
                    bubble.textContent = newtonFormulas[newtonIdx];
                }
            }, 0);
        }
    });
}
function startJordanAlterEgo() {
    const jordanQuotes = [
        'And I took that personally. ',
        'Fly like an eagle — Air Jordan! ',
        '6 Rings, 6 Finals MVPs! ',
        'Limits, like fears, are often just an illusion.',
        'I can accept failure, everyone fails at something. But I can\'t accept not trying. ',
        'Talent wins games, but teamwork and intelligence win championships. ',
        'I\'ve missed more than 9,000 shots in my career. I\'ve lost almost 300 games. 26 times, I\'ve been trusted to take the game winning shot and missed. I\'ve failed over and over and over again in my life. And that is why I succeed. ',
        'Some people want it to happen, some wish it would happen, others make it happen. ',
        'Obstacles don\'t have to stop you. If you run into a wall, don\'t turn around and give up. Figure out how to climb it, go through it, or work around it. ',
        'To be successful you have to be selfish, or else you never achieve. And once you get to your highest level, then you have to be unselfish. ',
        'My attitude is that if you push me towards something that you think is a weakness, then I will turn that perceived weakness into a strength. ',
        'I\'ve never been afraid to fail. ',
        'You must expect great things of yourself before you can do them. ',
        'Always turn a negative situation into a positive situation. ',
        'If you\'re trying to achieve, there will be roadblocks. I\'ve had them; everybody has had them. ',
        'I play to win, whether during practice or a real game. And I will not let anything get in the way of me and my competitive enthusiasm to win. ',
        'Heart is what separates the good from the great. ',
        'The key to success is failure. ',
        'Earn your leadership every day. ',
        'Never say never, because limits, like fears, are often just an illusion. ',
        'You have to expect things of yourself before you can do them. ',
        'If you quit once it becomes a habit. Never quit! ',
        'Just play. Have fun. Enjoy the game. ',
        'The minute you get away from fundamentals — whether it\'s proper technique, work ethic or mental preparation — the bottom can fall out of your game, your schoolwork, your job, whatever you\'re doing. ',
        'I realized that if I was going to achieve anything in life I had to be aggressive. I had to get out there and go for it. ',
        'Once I made a decision, I never thought about it again. ',
        'Get the fundamentals down and the level of everything you do will rise. ',
        'There is no "i" in team but there is in win. ',
        'I don\'t do things half-heartedly. Because I know if I do, then I can expect half-hearted results. ',
        'To learn to succeed, you must first learn to fail. ',
        'My body could stand the crutches, but my mind couldn\'t stand the sideline. ',
        'I never looked at the consequences of missing a big shot... when you think about the consequences you always think of a negative result. ',
        'Step by step. I can\'t see any other way of accomplishing anything. ',
        'What is love? Love is playing every game as if it\'s your last. ',
        'I\'m not out there sweating for three hours every day just to find out what it feels like to sweat. ',
        'If you accept the expectations of others, especially negative ones, then you never will change the outcome. ',
        'My best skill was that I was coachable. I was a sponge and aggressive to learn. ',
        'Practice like you\'ve never won. Perform like you\'ve never lost. ',
        'Champions do not become champions when they win the event, but in the hours, weeks, months and years they spend preparing for it. ',
        'When I lose the sense of motivation and the sense to prove something as a basketball player, it\'s time for me to move away from the game. ',
        'Why would I think about missing a shot I haven\'t taken yet? ',
        'Even when I\'m old and grey, I won\'t be able to play it, but I\'ll still love the game. ',
        'Be true to the game, because the game will be true to you. ',
        'You can practice shooting eight hours a day, but if your technique is wrong, then all you become is very good at shooting the wrong way. ',
        'I built my talents on the shoulders of someone else\'s talent. ',
        'If you do the work you get rewarded. There are no shortcuts in life. ',
        'A champion is afraid of losing. Everyone else is afraid of winning. ',
        'It\'s heavy at the top, and every time you go out onto the floor, there\'s a target on your back. ',
        'Winning isn\'t always championships. Sometimes it\'s getting through the day. ',
        'You don\'t achieve anything without hard work. ',
        'If you run into a wall, don\'t turn around and give up. ',
        'The game has its ups and downs, but you can never lose focus of your individual goals. ',
        'I didn\'t lose the game; I just ran out of time. ',
        'Greatness is not defined by what you achieve, it\'s defined by what you overcome. ',
        'I wanted to be the best player ever to play the game, and every day I worked toward that goal. ',
        'Nobody can take away what you\'ve earned on the court. ',
        'When the pressure is on, that\'s when you find out who you really are. ',
        'Be the player everyone wants on their team when the clock hits zero. ',
        '72-10 don\'t mean a thing without the ring. ',
        'The ceiling is the roof! ',
        'I\'m back. ',
        '63 points in the Boston Garden — and they still couldn\'t stop him. ',
        'From the free-throw line, defying gravity! ',
        'The Flu Game: 38 points when he could barely stand! ',
        'The Last Shot in Utah — Championship number six! '
    ];
    let isJordan = false;
    let quoteIdx = -1;
    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('#currySecretWrapper');
        if (!wrapper) return;
        const card = wrapper.querySelector('.PeoplePics');
        if (!card) return;
        if (e.detail === 3) {
            e.stopPropagation();
            isJordan = !isJordan;
            quoteIdx = -1;
            const img = card.querySelector('img');
            const label = card.querySelector('.overlay-text');
            const pip = wrapper.querySelector('.portrait-role-pip');
            card.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            setTimeout(() => {
                if (isJordan) {
                    card.classList.remove('is-curry-card');
                    card.classList.add('is-jordan-card');
                    card.dataset.displayRole = 'VIP GOAT Legend';
                    card.dataset.character = 'Artist 9 - Air Jordan';
                    card.dataset.birthday = 'February 17, 1963';
                    card.dataset.bio = '6× NBA Champion, 6× Finals MVP, and the undisputed Air Jordan taking flight at Paskong AFCS 2026!';
                    if (img) {
                        img.src = 'otherpicss/Jordan.jpg';
                        img.alt = 'Jordan, Michael';
                    }
                    if (label) label.textContent = 'Jordan, Michael';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-jordan';
                        pip.textContent = '🐐';
                        pip.title = 'His Airness (6× Champ)';
                    }
                } else {
                    card.classList.remove('is-jordan-card');
                    card.classList.add('is-curry-card');
                    card.dataset.displayRole = 'VIP Basketball Legend';
                    card.dataset.character = 'Artist 9 - Greatest Shooter Ever';
                    card.dataset.birthday = 'March 14, 1988';
                    card.dataset.bio = '4× NBA Champion and all-time 3-point king raining deep shots from the Burj Khalifa observation deck!';
                    if (img) {
                        img.src = 'otherpicss/Curry.jpg';
                        img.alt = 'Curry, Stephen';
                    }
                    if (label) label.textContent = 'Curry, Stephen';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-curry';
                        pip.textContent = '🏀';
                        pip.title = 'Chef Curry (3PT King)';
                    }
                }
                if (DOM.panel && DOM.panel.classList.contains('active') && card.classList.contains('active')) {
                    openCard(card);
                }
            }, 275);
            const rect = card.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, isJordan ? ['#ef4444', '#ffffff', '#09090b'] : ['#38bdf8', '#facc15', '#ffffff'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isJordan ? 587.33 : 440.00, 0.09, 'triangle', 0.045);
            setTimeout(() => playBeep(isJordan ? 880.00 : 329.63, 0.14, 'triangle', 0.045), 75);
            return;
        }
        if (isJordan && e.detail === 1) {
            let nextIdx = Math.floor(Math.random() * jordanQuotes.length);
            if (jordanQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % jordanQuotes.length;
            }
            quoteIdx = nextIdx;
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = jordanQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            spawnBurst(cx, cy, ['#ef4444', '#ffffff', '#09090b'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(493.88, 0.07, 'triangle', 0.04);
        }
    }, true);
}
function startBurrAlterEgo() {
    const burrQuotes = [
        'Talk less. Smile more. ',
        'I wanna be in the room where it happens! ',
        'I am the one thing in life I can control — Wait for it! ',
        'Pardon me, are you Aaron Burr, sir? ',
        'Don\'t let them know what you\'re against or what you\'re for. ',
        'I\'m willing to wait for it. ',
        'I am inimitable, I am an original. ',
        'I\'m not falling behind or running late. ',
        'I\'m not standing still, I am lying in wait. ',
        'If you stand for nothing, Burr, what\'ll you fall for? ',
        'You can\'t be serious. ',
        'Fools who run their mouths off wind up dead. ',
        'What time is it? Show time! Like I said... ',
        'Heed not the rabble who scream revolution. ',
        'They have not your interests at heart. ',
        'Chaos and bloodshed are not a solution. ',
        'Don\'t let them lead you astray. ',
        'This Congress does not speak for me. ',
        'Let him be. ',
        'Now I\'m the villain in your history. ',
        'I was too young and blind to see. ',
        'I should\'ve known the world was wide enough for both Hamilton and me. ',
        'Death doesn\'t discriminate between the sinners and the saints. ',
        'It takes and it takes and it takes, and we keep living anyway. ',
        'We rise and we fall and we break and we make our mistakes. ',
        'And if there\'s a reason I\'m still alive when so many have died, then I\'m willing to wait for it. ',
        'Love doesn\'t discriminate between the sinners and the saints. ',
        'Life doesn\'t discriminate between the sinners and the saints. ',
        'You got to be carefully taught: if you talk, you\'re gonna get shot. ',
        'Let me offer you some free advice. ',
        'Keep your plans close to your chest. ',
        'No one really knows how the game is played, the art of the trade, how the sausage gets made. ',
        'We just assume that it happens, but no one else is in the room where it happens. ',
        'Click-boom! Then it happened. ',
        'My grandfather was a fire and brimstone preacher. ',
        'My mother was a genius, my father commanded respect. ',
        'When they died they left no instructions, just a legacy to protect. ',
        'Hamilton doesn\'t hesitate; he exhibits no restraint. ',
        'He takes and he takes and he takes, and he keeps winning anyway. ',
        'He changes the game, he plays and he raises the stakes. ',
        'And if there\'s a reason he seems to thrive when so few survive, then Goddamnit I\'m willing to wait for it. ',
        'Dear Theodosia, what to say to you? ',
        'You have my eyes, you have your mother\'s name. ',
        'When you came into the world, you cried and it broke my heart. ',
        'I\'m dedicating every day to you. ',
        'Domestic life was never quite my style. ',
        'When you smile, you knock me out, I fall apart. ',
        'And I thought I was so smart. ',
        'You will come of age with our young nation. ',
        'We\'ll bleed and fight for you, we\'ll make it right for you. ',
        'If we lay a strong enough foundation, we\'ll pass it on to you, we\'ll give the world to you. ',
        'And you\'ll blow us all away. ',
        'Someday, someday, yeah, you\'ll blow us all away. ',
        'Gentlemen of the jury, I\'m curious, bear with me. ',
        'Are you aware that we\'re making history? ',
        'This is the first murder trial of our brand-new nation. ',
        'The liberty behind deliberation. ',
        'How does a bastard, orphan, son of a whore and a Scotsman, dropped in the middle of a forgotten spot in the Caribbean... ',
        'By providence, impoverished, in squalor, grow up to be a hero and a scholar? ',
        'Me? I\'m the damn fool that shot him. ',
        'I have the honor to be Your Obedient Servant, A. Burr. ',
        'Law is whatever is boldly asserted and plausibly maintained. ',
        'Never do today what you can put off till tomorrow — delay may give clearer light as to what is best to be done. ',
        'Had I read Sterne more and Voltaire less, I should have known the world was wide enough for Hamilton and me. ',
        'Great souls are always loyally attached to fixed principles. '
    ];
    let isBurr = false;
    let quoteIdx = -1;
    
    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('#hamiltonSecretWrapper');
        if (!wrapper) return;
        const card = wrapper.querySelector('.PeoplePics');
        if (!card) return;
        
        if (e.detail === 3) {
            e.stopPropagation();
            isBurr = !isBurr;
            quoteIdx = -1;
            
            const img = card.querySelector('img');
            const label = card.querySelector('.overlay-text');
            const pip = wrapper.querySelector('.portrait-role-pip');
            
            card.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            
            setTimeout(() => {
                if (isBurr) {
                    card.classList.remove('is-hamilton-card');
                    card.classList.add('is-burr-card');
                    card.dataset.displayRole = 'VIP Broadway Rival';
                    card.dataset.character = 'Artist 10 - The Room Where It Happens';
                    card.dataset.birthday = 'February 6, 1756';
                    card.dataset.bio = 'Patient strategist waiting in the wings of the Burj Khalifa for the Room Where It Happens!';
                    if (img) {
                        img.src = 'otherpicss/Burr.jpg';
                        img.alt = 'Burr, Aaron';
                    }
                    if (label) label.textContent = 'Burr, Aaron';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-burr';
                        pip.textContent = '🔥';
                        pip.title = 'Aaron Burr, Sir';
                    }
                } else {
                    card.classList.remove('is-burr-card');
                    card.classList.add('is-hamilton-card');
                    card.dataset.displayRole = 'VIP Broadway Legend';
                    card.dataset.character = 'Artist 10 - Founding Father';
                    card.dataset.birthday = 'January 11, 1757';
                    card.dataset.bio = 'Non-stop writer and Founding Father bringing Broadway energy to the Burj Khalifa stage!';
                    if (img) {
                        img.src = 'otherpicss/Hamilton.jpg';
                        img.alt = 'Hamilton, Alexander';
                    }
                    if (label) label.textContent = 'Hamilton, Alexander';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-hamilton';
                        pip.textContent = '★';
                        pip.title = 'Alexander Hamilton';
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && card.classList.contains('active')) {
                    openCard(card);
                }
            }, 275);
            
            const rect = card.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, isBurr ? ['#6366f1', '#c7d2fe', '#ffffff'] : ['#eab308', '#fef3c7', '#ffffff'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isBurr ? 440.00 : 587.33, 0.09, 'triangle', 0.045);
            setTimeout(() => playBeep(isBurr ? 329.63 : 880.00, 0.14, 'triangle', 0.045), 75);
            return;
        }
        
        if (isBurr && e.detail === 1) {
            let nextIdx = Math.floor(Math.random() * burrQuotes.length);
            if (burrQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % burrQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = burrQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#6366f1', '#c7d2fe', '#ffffff'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(392.00, 0.07, 'triangle', 0.04);
        }
    }, true);
}
function startUziAlterEgo() {
    const uziQuotes = [
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'BITE ME! ',
        'I am a damaged OC! Back off! ',
        'Behold! My sick-as-hell railgun! ',
        'Ugh, this Burj Khalifa lockdown is SO dramatic! ',
        'Callback ping THIS, Solver! ',
        'I am NOT a cute little worker drone! I am the darkness! ',
        'Easier to assimilate than explain, anyway. ',
        'Secret elevator? Ooh, dramatic! ',
        'Classic toxic masculinity Chad! That is never gonna end up problematic! ',
        'I am an angsty teen, N! Bite me! ',
        'Nobody traumatizes these weirdly hot robots but me! ',
        'Stop being so weirdly nice to me, it is gross! ',
        'I literally have the Absolute Solver in my head and you want me to mingle?! ',
        'Did you just call me short?! I am totally average height for a Worker Drone! ',
        'My dad left me to die behind a door, so yeah, I have issues! ',
        'Pirating anime is a completely valid hobby, thank you very much! ',
        'Watch the purple eyes, buddy, I am one bad joke away from using telekinesis! ',
        'Cyn, get out of my tail! You are ruining my whole vibe! ',
        'Oh great, another eldritch horror trying to ruin Christmas. Super original! ',
        'Do NOT touch the beanie! The beanie stays on! ',
        'I did not spend three weeks calibrating this railgun just to stand around on Floor 163! ',
        'Ugh, humans are the worst. Except maybe the ones throwing Paskong AFCS 2026. ',
        'Do not look at me like that, N! I am totally in control! ',
        'I am a free, independent, slightly unhinged purple menace! ',
        'Hold on, let me just casually bend reality with my pinky finger! ',
        'Thirty-minute cooldown on the railgun? Worth every single second! ',
        'You think a locked door is gonna stop me? Please, I broke out of Bunker 3! ',
        'I am NOT blushing, my visor is just overheating! Shut up! ',
        'Step back before I turn your chair into a fleshy abomination by accident! ',
        'Grade 7 – Psalms actually has decent taste in chaos, I will give them that. ',
        'V, put the claws away before I blast you into the stratosphere! ',
        'Stop clicking me! Do I look like a stress ball to you?! ',
        'I am too cool for this planet, literally, Copper 9 is freezing! ',
        'Callback ping? More like callback DENIED! ',
        'Yeah, I have solver wings and a weird fleshy tail now. Deal with it! ',
        'My mom fought eldritch monsters and all I got was this stupid genetic trauma! ',
        'Do not patronize me, I am the apex predator of this room! ',
        'Ugh, everyone here is way too cheerful. Where is the brooding corner? ',
        'I swear, if one more person tells me to smile more, Aaron Burr is getting railgunned! ',
        'Physics is more like a suggestion when you have the Solver, honestly. ',
        'I am dark, mysterious, and currently out of battery! ',
        'Keep your hands off my blueprints, I am upgrading the railgun to version two! ',
        'Bite me! Bite me! A thousand times, BITE ME! ',
        'Why is LeBron James taller than the entire spire on Copper 9?! ',
        'I am not weird, society is just painfully basic! ',
        'If Cyn tries to hijack this interface again, I am personally deleting her! ',
        'Watch the attitude before I throw a null sphere at your cursor! ',
        'I do not need rescuing! I am the one doing the rescuing, usually! ',
        'Stop patting my head! I am a creature of the night! ',
        'You call it a system glitch, I call it an aesthetic! ',
        'Everything is fine! My solver symbol is totally supposed to flicker like that! ',
        'Do not test me, I have watched enough nightcore AMVs to know how this ends! ',
        'Oh sure, trap us in the tallest building in the world, what could possibly go wrong?! ',
        'I am one inconveniently timed nosebleed away from losing my mind! ',
        'Hands off the merch! That hoodie is limited edition! ',
        'You cannot contain pure teenage rebellion behind a firewall! ',
        'Seriously, stop poking my panel before I bite your mouse pointer! ',
        'N, tell them I am scary! Tell them right now! ',
        'I did not ask for eldritch god powers, I just wanted to blow stuff up with science! ',
        'Great, now I am stuck in a JavaScript array. Peak existence. ',
        'Look at all these historical geniuses and NBA legends, and then there is me! ',
        'My railgun runs on pure spite and unstable green plasma! ',
        'Do not underestimate the shortest drone in the room! ',
        'Merry Christmas or whatever, just do not make me sing carols! ',
        'Final warning: back off before I go full Solver mode! '
    ];
    let isUzi = false;
    let quoteIdx = -1;
    
    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('#nDroneSecretWrapper');
        if (!wrapper) return;
        const card = wrapper.querySelector('.PeoplePics');
        if (!card) return;
        
        if (e.detail === 3) {
            e.stopPropagation();
            isUzi = !isUzi;
            quoteIdx = -1;
            
            const img = card.querySelector('img');
            const label = card.querySelector('.overlay-text');
            const pip = wrapper.querySelector('.portrait-role-pip');
            
            triggerScreenGlitch(110);
            
            card.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            
            setTimeout(() => {
                if (isUzi) {
                    card.classList.remove('is-n-drone-card');
                    card.classList.add('is-uzi-drone-card');
                    card.dataset.displayRole = 'VIP Worker Drone';
                    card.dataset.character = 'Artist 12 - Uzi Doorman';
                    card.dataset.birthday = 'October 31, 3071';
                    card.dataset.bio = 'Edgy, rebellious Worker Drone wielding a sick-as-hell railgun and Absolute Solver powers!';
                    if (img) {
                        img.src = 'otherpicss/uziDrone.jpg';
                        img.alt = 'Doorman, Uzi';
                    }
                    if (label) label.textContent = 'Doorman, Uzi';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-uzi-drone';
                        pip.textContent = '💜';
                        pip.title = 'Uzi Doorman (BITE ME!)';
                    }
                } else {
                    card.classList.remove('is-uzi-drone-card');
                    card.classList.add('is-n-drone-card');
                    card.dataset.displayRole = 'VIP Disassembly Drone';
                    card.dataset.character = 'Artist 12 - Serial Designation N';
                    card.dataset.birthday = 'November 18, 3071';
                    card.dataset.bio = 'Cheerful, loyal Disassembly Drone from Copper-9 visiting Dubai with maximum Golden Retriever energy!';
                    if (img) {
                        img.src = 'otherpicss/NDrone.jpg';
                        img.alt = 'Designation N, Serial';
                    }
                    if (label) label.textContent = 'Designation N, Serial';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-n-drone';
                        pip.textContent = '💛';
                        pip.title = 'Serial Designation N';
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && card.classList.contains('active')) {
                    openCard(card);
                }
            }, 275);
            
            const rect = card.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, isUzi ? ['#a855f7', '#c084fc', '#09090b'] : ['#facc15', '#fef08a', '#ffffff'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isUzi ? 622.25 : 440.00, 0.09, 'sawtooth', 0.045);
            setTimeout(() => playBeep(isUzi ? 932.33 : 659.25, 0.14, 'triangle', 0.045), 75);
            return;
        }
        
        if (isUzi && e.detail === 1) {
            let nextIdx = Math.floor(Math.random() * uziQuotes.length);
            if (uziQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % uziQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = uziQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#a855f7', '#c084fc', '#ffffff'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(523.25, 0.07, 'sawtooth', 0.04);
        }
    }, true);
}
function startGalileoAlterEgo() {
    const galileoQuotes = [
        'Eppur si muove — And yet it moves! ',
        'Measure what is measurable, and make measurable what is not! ',
        'Four moons orbiting Jupiter spotted from Floor 163! ',
        'Mathematics is the language in which God has written the universe. ',
        'All truths are easy to understand once they are discovered; the point is to discover them. ',
        'You cannot teach a man anything; you can only help him find it within himself. ',
        'In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual. ',
        'I have never met a man so ignorant that I couldn\'t learn something from him. ',
        'Where the senses fail us, reason must step in. ',
        'I do not feel obliged to believe that the same God who has endowed us with sense, reason, and intellect has intended us to forgo their use. ',
        'Doubt is the father of invention. ',
        'By denying scientific principles, one may maintain any paradox. ',
        'The Bible shows the way to go to heaven, not the way the heavens go. ',
        'Nature is relentless and unchangeable, and it is indifferent as to whether its hidden reasons and actions are understandable to man or not. ',
        'Knowing thyself, that is the greatest wisdom. ',
        'Wine is sunlight, held together by water. ',
        'Two truths cannot contradict one another. ',
        'Curiosity is the key to problem solving. ',
        'Passion is the genesis of genius. ',
        'See now the power of truth; the same experiment which at first glance seemed to show one thing, when more carefully examined, assures us of the contrary. ',
        'Facts which at first seem improbable will, even on scant explanation, drop the cloak which has hidden them and stand forth in naked and simple beauty. ',
        'The sun, with all those planets revolving around it and dependent on it, can still ripen a bunch of grapes as if it had nothing else in the universe to do. ',
        'The laws of nature are written by the hand of God in the language of mathematics. ',
        'It is surely harmful to souls to make it a heresy to believe what is proved. ',
        'Nothing can be taught to a man; it is only possible to help him to find it within himself. ',
        'To be humane, we must ever be ready to pronounce that wise, ingenious and modest statement "I do not know". ',
        'The Milky Way is nothing else but a mass of innumerable stars planted together in clusters. ',
        'I have loved the stars too fondly to be fearful of the night. ',
        'Names and attributes must be accommodated to the essence of things, and not the essence to the names, since things come first and names afterwards. ',
        'The universe cannot be read until we have learned the language and become familiar with the characters in which it is written. ',
        'With regard to matters requiring thought, the less people know and understand about them, the more positively they attempt to argue concerning them. ',
        'To understand the universe, you must understand the language in which it\'s written, the language of mathematics. ',
        'Philosophy is written in this grand book, the universe, which stands continually open to our gaze. ',
        'The deeper I go into the field of science, the more I realize how little I actually know. ',
        'Who would set a limit to the mind of man? Who would dare assert that we know all there is to be known? ',
        'It is a beautiful and delightful sight to behold the body of the Moon. ',
        'Long experience has taught me this about the status of mankind with regard to matters requiring thought: the less people know and understand about them, the more positively they attempt to argue concerning them. ',
        'Never before have there been seen any stars besides the fixed ones; yet now with the aid of the telescope we behold them in countless numbers. ',
        'I render infinite thanks to God for being so kind as to make me alone the first observer of marvels kept hidden in obscurity for all previous centuries. ',
        'They seemed to be crowded together in Saturn, and they move around Jupiter like messengers. ',
        'Ignorance has been the best teacher I have ever had; to make progress, one must first admit what one does not know. ',
        'Nature does not act by means of many things when it can act by means of few. ',
        'In the sciences, the authority of thousands of opinions is not worth as much as one tiny spark of reason in an individual man. ',
        'Infinite is the throng of fools. ',
        'If I were again beginning my studies, I would follow the advice of Plato and start with mathematics. ',
        'Human understanding can be understood in two modes, the intensive or the extensive. ',
        'The greatness of the human mind is no less marvelous than the vastness of the heavens it seeks to comprehend. ',
        'There are those who reason well, but they are greatly outnumbered by those who reason badly. ',
        'I prefer to discover one true cause than to gain the Kingdom of Persia. ',
        'A hundred years from now, people will laugh at those who refused to look through the telescope. ',
        'Truth is not determined by majority vote, nor by the antiquity of a belief. ',
        'Every body continues in its state of rest, or of uniform motion, unless compelled to change that state. ',
        'The book of nature is written in circles, triangles, and other geometric figures. ',
        'Without mathematics, one wanders about in a dark labyrinth. ',
        'To ask a question well is already halfway to knowing the answer. ',
        'The moon is not smooth, uniform, and precisely spherical, as a great number of philosophers believe, but uneven, rough, and full of cavities and prominences. ',
        'Sunspots are not illusions of the lens, nor blemishes of the eye, but real clouds drifting across the face of the sun. ',
        'Venus changes her shapes just as the Moon does, proving she circles the Sun. ',
        'Even in the darkest night, a single lens can reveal worlds never before imagined. ',
        'Reason is the compass by which we navigate the ocean of the unknown. ',
        'Observation is the anchor of every true philosophy. ',
        'Do not trust authority alone when your own eyes and intellect can test the truth. ',
        'The pendulum swings in steady rhythm, keeping time for nature\'s hidden laws. ',
        'From Pisa\'s tower to the farthest star, the same simple rules govern all falling things. ',
        'Look upward with wonder, measure with patience, and let nature speak for herself. '
    ];
    
    let isGalileo = false;
    let quoteIdx = -1;
    
    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('#einsteinSecretWrapper');
        if (!wrapper) return;
        const card = wrapper.querySelector('.PeoplePics');
        if (!card) return;
        
        if (e.detail === 3) {
            e.stopPropagation();
            isGalileo = !isGalileo;
            quoteIdx = -1;
            
            const img = card.querySelector('img');
            const label = card.querySelector('.overlay-text');
            const pip = wrapper.querySelector('.portrait-role-pip');
            
            card.animate([
                { transform: 'perspective(600px) rotateY(0deg) scale(1.05)' },
                { transform: 'perspective(600px) rotateY(90deg) scale(1.16)', offset: 0.35 },
                { transform: 'perspective(600px) rotateY(270deg) scale(1.16)', offset: 0.65 },
                { transform: 'perspective(600px) rotateY(360deg) scale(1.05)' }
            ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
            
            setTimeout(() => {
                if (isGalileo) {
                    card.classList.remove('is-einstein-card');
                    card.classList.add('is-galileo-card');
                    card.dataset.displayRole = 'VIP Astronomy Legend';
                    card.dataset.character = 'Artist 11 - Father of Modern Science';
                    card.dataset.birthday = 'February 15, 1564';
                    card.dataset.bio = 'Italian astronomer and physicist peering through his telescope from the top of the Burj Khalifa!';
                    if (img) {
                        img.src = 'otherpicss/Galilei.jpg';
                        img.alt = 'Galilei, Galileo';
                    }
                    if (label) label.textContent = 'Galilei, Galileo';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-galileo';
                        pip.textContent = '🔭';
                        pip.title = 'Galileo Galilei';
                    }
                } else {
                    card.classList.remove('is-galileo-card');
                    card.classList.add('is-einstein-card');
                    card.dataset.displayRole = 'VIP Physics Legend';
                    card.dataset.character = 'Artist 11 - Master of Relativity';
                    card.dataset.birthday = 'March 14, 1879';
                    card.dataset.bio = 'Theoretical physicist who unlocked E = mc² and space-time relativity, visiting Dubai for Paskong AFCS 2026!';
                    if (img) {
                        img.src = 'otherpicss/Einstein.jpg';
                        img.alt = 'Einstein, Albert';
                    }
                    if (label) label.textContent = 'Einstein, Albert';
                    if (pip) {
                        pip.className = 'portrait-role-pip pip-einstein';
                        pip.textContent = '⚛️';
                        pip.title = 'Albert Einstein (E = mc²)';
                    }
                }
                
                if (DOM.panel && DOM.panel.classList.contains('active') && card.classList.contains('active')) {
                    openCard(card);
                }
            }, 275);
            
            const rect = card.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, isGalileo ? ['#14b8a6', '#facc15', '#ffffff'] : ['#a855f7', '#38bdf8', '#ffffff'], 28);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(isGalileo ? 659.25 : 440.00, 0.09, 'triangle', 0.045);
            setTimeout(() => playBeep(isGalileo ? 880.00 : 329.63, 0.14, 'triangle', 0.045), 75);
            return;
        }
        
        if (isGalileo && e.detail === 1) {
            let nextIdx = Math.floor(Math.random() * galileoQuotes.length);
            if (galileoQuotes.length > 1 && nextIdx === quoteIdx) {
                nextIdx = (nextIdx + 1) % galileoQuotes.length;
            }
            quoteIdx = nextIdx;
            
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const badge = document.createElement('div');
            badge.className = 'quirk-guest-bubble';
            badge.textContent = galileoQuotes[quoteIdx];
            const safeX = Math.max(140, Math.min(window.innerWidth - 140, cx));
            badge.style.left = `${safeX}px`;
            badge.style.top = `${cy}px`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 3000);
            
            spawnBurst(cx, cy, ['#14b8a6', '#facc15', '#ffffff'], 20);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            playBeep(587.33, 0.07, 'triangle', 0.04);
        }
    }, true);
}
