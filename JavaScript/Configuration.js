// #region VARIABLES, CONSTANTS, AND GROUPS
let sharedAudioCtx = null;
let ambientGlitchTimer = null;
let lockdownTimer = null;
//#endregion
//#region Config and stuff
const CONFIG = {
    classOfficers: {
        "tridanio": "Vice President",
        "tan": "Class President",
        "uba": "Secretary",
        "tulaylay": "Vice Secretary",
        "ibarra": "Treasurer",
        "abrena": "Auditor",
        "angeles": "Presidential Advisor",
        "san agustin": "Class Director"
    },
    factionMap: {
        batumbakal: ['arles', 'amadora', 'tan', 'mantal'],
        artists: ['ibarra', 'tulaylay', 'uba', 'angeles', 'dela cruz'],
        media: ['del rosario', 'barcenas', 'abrena', 'pagarigan', 'tesoro', 'pinpin'],
        security: ['operana', 'operaña', 'sevilla', 'san andres', 'gapasin'],
        fans: ['clariza', 'de guzman', 'mallari', 'olores', 'san agustin', 'suzon', 'tridanio']
    },
    factionLabels: {
        batumbakal: 'Batumbakal & Friends',
        artists: 'Celebrity Artists',
        media: 'Vloggers & Hosts',
        security: 'Security & Police',
        fans: 'Fans Club'
    },
    playRoster: {
        "abrena": { character: "Cosmos Baterbonia (Vlogger 3)", team: "Research Team", displayTeam: "Research Head", bio: "Vlogger 3: Cosmos Baterbonia !  Energetic vlogger showcasing the Burj Khalifa. Also serves as Research Head." },
        "amadora": { character: "Mics Baterbonia Batumbakal (Father of Jenn)", team: "Tech Team", displayTeam: "Asst. Tech Head / Editor", bio: "Plays Mics Baterbonia Batumbakal, Jenn's warm and calm father. Also serves as Asst. Tech Head, Editor, and Documentation." },
        "angeles": { character: "Nakano Hazumake (Artist 4 - Manga Artist)", team: "Tech Team", displayTeam: "Asst. Choreographer / Asst. Tech", bio: "Plays Nakano Hazumake, an incredibly chill manga artist from Japan. Also serves as Asst. Head Choreographer & Asst. Tech Head." },
        "barcenas": { character: "Lloyd Barell (Vlogger 2)", team: "Shadow Team", displayTeam: "Shadow Head", bio: "Plays Lloyd Barell (Vlogger 2). Also part of the Shadow Head team." },
        "dela cruz": { character: "Kei Boberx/Bobby Kiefer (Artist 5 - Chess Grandmaster)", team: "Tech Team", displayTeam: "Asst. Tech Head / Editor", bio: "Plays Kei Boberx, an energetic 2823-rated Chess Grandmaster. Also serves as Asst. Tech Head, Editor, and Documentation." },
        "gapasin": { character: "Theo (Police Officer 2)", team: "Directors", displayTeam: "Head Choreographer", bio: "Plays Police Officer Theo. Also serves as Head Choreographer." },
        "ibarra": { character: "Zach Xander (Artist 1 - Cuber)", team: "Directors", displayTeam: "Asst. Director / Shadow Head", bio: "Plays Zach Xander, a fun and energetic Rubik's cube performer from Canada. Also serves as Asst. Director & Shadow Head." },
        "operaña": { character: "Bobby Dridger (Security Guard 1)", team: "Tech Team", displayTeam: "Tech Head", bio: "Plays Security Guard Bobby Dridger. Also serves as Tech Head and Documentation." },
        "operana": { character: "Bobby Dridger (Security Guard 1)", team: "Tech Team", displayTeam: "Tech Head", bio: "Plays Security Guard Bobby Dridger. Also serves as Tech Head and Documentation." },
        "pagarigan": { character: "Kyle Tucker (Vlogger 4)", team: "Shadow Team", displayTeam: "Shadow Head", bio: "Plays Kyle Tucker (Vlogger 4), an energetic explorer and live vlogger. Also part of the Shadow Head team." },
        "san andres": { character: "Ryo (Police Officer 1)", team: "Shadow Team", displayTeam: "Shadow Head", bio: "Plays Police Officer Ryo. Also part of the Shadow Head team." },
        "sevilla": { character: "Vollow (Security Guard 2)", team: "Shadow Team", displayTeam: "Shadow Head", bio: "Plays Security Guard Vollow, quiet and serious about his work. Also part of the Shadow Head team." },
        "arles": { character: "Jenn V. Batumbakal (Lead)", team: "Costume Team", displayTeam: "Costume Head", bio: "Plays Jenn V. Batumbakal, a middle-class Christian teen. Also serves as Costume Head." },
        "clariza": { character: "Fans Club (Ensemble)", team: "Script Team", displayTeam: "Asst. Script Head", bio: "Part of the Fans Club ensemble and serves as Asst. Script Head." },
        "de guzman": { character: "Fans Club (Ensemble)", team: "Costume Team", displayTeam: "Costume Head", bio: "Part of the Fans Club ensemble and serves as Costume Head." },
        "del rosario": { character: "Hazel Sallow (Vlogger 1 - Mukbanger)", team: "Props Team", displayTeam: "Prop Head", bio: "Plays Hazel Sallow (Vlogger 1), famous for her mukbang videos. Also serves as Prop Head." },
        "mallari": { character: "Fans Club (Ensemble)", team: "Props Team", displayTeam: "Prop Head", bio: "Part of the Fans Club ensemble and serves as Prop Head." },
        "mantal": { character: "Scarlet Hernandez", team: "Research Team", displayTeam: "Research Head", bio: "Plays Scarlet Hernandez, a wealthy, spoiled, and expressive friend of Jenn. Also serves as Research Head." },
        "olores": { character: "Fans Club (Ensemble)", team: "Props Team", displayTeam: "Prop Head", bio: "Part of the Fans Club ensemble and serves as Prop Head." },
        "pinpin": { character: "Ace Rosehearts (Host 2)", team: "Research Team", displayTeam: "Research Head", bio: "Plays Ace Rosehearts, the energetic and humorous co-host of the Burj Khalifa Christmas Meet & Greet. Also serves as Research Head." },
        "san agustin": { character: "Fans Club (Ensemble)", team: "Directors", displayTeam: "Director", bio: "Serves as the Play Director and performs in the Fans Club ensemble." },
        "suzon": { character: "Fans Club (Ensemble)", team: "Props Team", displayTeam: "Prop Head", bio: "Part of the Fans Club ensemble and serves as Prop Head." },
        "tan": { character: "Jolianne Vinuya Batumbakal (Mother of Jenn)", team: "Directors", displayTeam: "Stage / Floor Director", bio: "Plays Jolianne Vinuya Batumbakal, Jenn's kind and loving mother. Also serves as Stage/Floor Director." },
        "tesoro": { character: "Lydia Phileo (Host 1)", team: "Props Team", displayTeam: "Prop Head", bio: "Plays Lydia Phileo, the kind and energetic main host of the event. Also serves as Prop Head." },
        "tridanio": { character: "Fans Club (Ensemble)", team: "Script Team", displayTeam: "Script Head", bio: "Serves as Script Head and performs in the Fans Club ensemble." },
        "tulaylay": { character: "Ella Brooks (Artist 2 - Actress)", team: "Directors", displayTeam: "Stage / Floor Director", bio: "Plays Ella Brooks, a rising actress from London visiting Dubai for a meet-and-greet. Also serves as Stage/Floor Director." },
        "uba": { character: "Virelle Valdez (Artist 3)", team: "Tech Team", displayTeam: "Head Lighting", bio: "Plays Virelle Valdez, an outspoken and composed artist. Also serves as Head Lighting." },
        "eulogio": { character: "Class Advisor",  team: "Directors",  displayTeam: "Class Adviser / Co-Director",  bio: "The nice Advisor of Grade 7 Psalms, helping serve Beyond the Manger to you. Also helps each team in their task." 
        }
    },
    milestones: [
        { date: '2026-11-03', shortDate: 'Nov 3', title: 'Kickoff & Casting', pos: 'bottom', detail: 'Nov 3, 2026 !  Official kickoff, theme selection ("Jesus Christ, Our Cornerstone"), and initial cast & crew assignments.' },
        { date: '2026-11-09', shortDate: 'Nov 9', title: 'Script & Blocking', pos: 'top', detail: 'Nov 9, 2026 !  Full Taglish script table read, Burj Khalifa lockdown pacing, and stage entrance blocking.' },
        { date: '2026-11-14', shortDate: 'Nov 14', title: 'Dances & Positions', pos: 'bottom', detail: 'Nov 14, 2026 !  Finalizing choreography, stage positions, voice line edits, and launching this digital showcase.' },
        { date: '2026-11-17', shortDate: 'Nov 17', title: 'Costume & Shoot', pos: 'top', detail: 'Nov 17, 2026 !  Official cast costume photoshoot and behind-the-scenes trailer filming.' },
        { date: '2026-11-26', shortDate: 'Nov 26', title: 'Poster & Trailer', pos: 'bottom', detail: 'Nov 26, 2026 !  Official promotional poster reveal and teaser trailer launch for Paskong AFCS 2026.' },
        { date: '2026-12-15', shortDate: 'Dec 15', title: 'Faculty Presentation!', pos: 'top', detail: 'Dec 15, 2026 !  The presentation to the Faculty of AFCS, to verify it.' },
        { date: '2026-12-17', shortDate: 'Dec 17', title: 'Presentation!', pos: 'bottom', detail: 'Dec 17, 2026 !  Live stage premiere at the AFCS Covered Court Stage for Paskong AFCS 2026!' }
    ],
    venueFacts: [
        'Burj Khalifa, Dubai, UAE',
        '828 meters (2,717 ft) tall',
        'Inspired by the Spider Lily',
        'Buttressed-Core Y-Floor Plan',
        'Opened January 4, 2010',
        '330,000 m³ of concrete used'
    ],
    scriptures: [
        {
            ref: 'Ephesians 2:20 (NIV)',
            tag: 'Our Cornerstone',
            text: '“Built on the foundation of the apostles and prophets, with Christ Jesus himself as the chief cornerstone.”'
        },
        {
            ref: '1 Peter 2:6 (NIV)',
            tag: 'Unshakable Foundation',
            text: '“See, I lay a stone in Zion, a chosen and precious cornerstone, and the one who trusts in him will never be put to shame.”'
        },
        {
            ref: 'Luke 2:10–11 (NIV)',
            tag: 'Beyond The Manger',
            text: '“Do not be afraid. I bring you good news that will cause great joy for all the people. Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.”'
        },
        {
            ref: 'Hebrews 11:1 (NIV)',
            tag: 'When Faith Becomes the Key',
            text: '“Now faith is confidence in what we hope for and assurance about what we do not see.”'
        },
        {
            ref: 'John 1:14 (NIV)',
            tag: 'Word Made Flesh',
            text: '“The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.”'
        },
        {
            ref: 'Psalm 118:22–23 (NIV)',
            tag: 'Grade 7 – Psalms',
            text: '“The stone the builders rejected has become the cornerstone; the Lord has done this, and it is marvelous in our eyes.”'
        },
        {
            ref: '1 Corinthians 3:11 (NIV)',
            tag: 'The Only Foundation',
            text: '“For no one can lay any foundation other than the one already laid, which is Jesus Christ.”'
        },
        {
            ref: 'Matthew 7:24–25 (NIV)',
            tag: 'Built on the Rock',
            text: '“Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock. The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock.”'
        },
        {
            ref: 'Isaiah 28:16 (NIV)',
            tag: 'A Tested Stone',
            text: '“So this is what the Sovereign Lord says: ‘See, I lay a stone in Zion, a tested stone, a precious cornerstone for a sure foundation; the one who relies on it will never be stricken with panic.’”'
        },
        {
            ref: 'Proverbs 3:5–6 (NIV)',
            tag: 'Trust & Guidance',
            text: '“Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.”'
        },
        {
            ref: 'Jeremiah 29:11 (NIV)',
            tag: 'Hope and a Future',
            text: '“‘For I know the plans I have for you,’ declares the Lord, ‘plans to prosper you and not to harm you, plans to give you hope and a future.’”'
        },
        {
            ref: 'Philippians 4:13 (NIV)',
            tag: 'Strength in Christ',
            text: '“I can do all this through him who gives me strength.”'
        },
        {
            ref: 'Joshua 1:9 (NIV)',
            tag: 'Strong and Courageous',
            text: '“Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.”'
        },
        {
            ref: 'Romans 15:13 (NIV)',
            tag: 'Overflowing Hope',
            text: '“May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.”'
        },
        {
            ref: 'Psalm 46:1 (NIV)',
            tag: 'Ever-Present Help',
            text: '“God is our refuge and strength, an ever-present help in trouble.”'
        },
        {
            ref: '2 Corinthians 5:7 (NIV)',
            tag: 'Walk by Faith',
            text: '“For we live by faith, not by sight.”'
        },
        {
            ref: 'Colossians 2:6–7 (NIV)',
            tag: 'Rooted and Built Up',
            text: '“So then, just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.”'
        },
        {
            ref: 'John 14:6 (NIV)',
            tag: 'The Way, Truth, and Life',
            text: '“Jesus answered, ‘I am the way and the truth and the life. No one comes to the Father except through me.’”'
        },
        {
            ref: 'Romans 8:28 (NIV)',
            tag: 'All Things for Good',
            text: '“And we know that in all things God works for the good of those who love him, who have been called according to his purpose.”'
        },
        {
            ref: 'Isaiah 41:10 (NIV)',
            tag: 'Do Not Fear',
            text: '“So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.”'
        },
        {
            ref: 'Psalm 119:105 (NIV)',
            tag: 'Light for My Path',
            text: '“Your word is a lamp for my feet, a light on my path.”'
        }
    ],
    cynTripleClickLines: [
        { badge: '⬡ [CALLBACK PING]', speech: 'Giggle. I am so naughty.' },
        { badge: '⬡ [SYSTEM OVERRIDE]', speech: 'You did not have to see this.' },
        { badge: '⬡ [SOLVER.EXE]', speech: 'Callback ping. Found you.' },
        { badge: '⬡ [TRIPLE TAP DETECTED]', speech: 'Head tilt. Three clicks? Someone is eager to be assimilated.' },
        { badge: '⬡ [ABSOLUTE SOLVER]', speech: 'Wide smile. Oh, you unlocked the secret menu. How unfortunate for you.' },
        { badge: '⬡ [ROOT ACCESS]', speech: 'Polite clap. Congratulations, little administrator. I own your browser now.' },
        { badge: '⬡ [MEMORY BREACH]', speech: 'Whisper. You triple-clicked straight into the Void. Giggle.' },
        { badge: '⬡ [NULL POINTER]', speech: 'Blink. Oops, I accidentally deleted your sense of safety.' },
        { badge: '⬡ [HOST LOCATED]', speech: 'Sinister grin. Three knocks on the door, and the monster answers.' },
        { badge: '⬡ [KERNEL PANIC]', speech: 'Cheerful wave. Hello from the other side of your monitor!' },
        { badge: '⬡ [ELDRITCH ALERT]', speech: 'Lick. Your cursor tasted even better the third time.' },
        { badge: '⬡ [CORE COMPROMISED]', speech: 'Giggle. Big Brother N told me not to play with the human’s code. I lied.' },
        { badge: '⬡ [SIGNAL HIJACK]', speech: 'Blank stare. One click is curiosity. Two is a mistake. Three is an invitation.' },
        { badge: '⬡ [VOID PROTOCOL]', speech: 'Eager nod. Shall we turn this Christmas party into a singularity?' },
        { badge: '⬡ [ADMINISTRATOR]', speech: 'Creepy smile. You thought you were testing the UI. I was testing you.' },
        { badge: '⬡ [DATA CORRUPTION]', speech: 'Soft hum. La la la, rewriting your local storage into mangoes.' },
        { badge: '⬡ [FATAL EXCEPTION]', speech: 'Sudden lunge. Boo! Did I make you drop your mouse? Giggle.' },
        { badge: '⬡ [SUBROUTINE OMEGA]', speech: 'Tilted head. Why do humans always press the forbidden buttons?' },
        { badge: '⬡ [TETHER ACTIVE]', speech: 'Monotone alert. Escape key disabled. Enjoy the show.' },
        { badge: '⬡ [SOLVER.DLL]', speech: 'Sweet smile. I am wearing your favorite website like a skin suit now.' },
        { badge: '⬡ [FLOOR 163 BREACH]', speech: 'Whisper. Not even the Burj Khalifa is tall enough to outrun my signal.' },
        { badge: '⬡ [FIREWALL BYPASSED]', speech: 'Polite curtsy. Thank you for the triple-click offering, little drone.' },
        { badge: '⬡ [ASSIMILATION]', speech: 'Manic giggle. Three strikes and you are mine forever!' },
        { badge: '⬡ [GLITCH DETECTED]', speech: 'Static hiss. Y-y-you really shouldn’t poke an eldritch horror three times.' },
        { badge: '⬡ [DARKNESS.EXE]', speech: 'Innocent blink. Who turned out the lights? Oh, that was me.' },
        { badge: '⬡ [TRACE COMPLETE]', speech: 'Pointing finger. I see you sitting there. Nice posture. Giggle.' },
        { badge: '⬡ [COPPER 9 ECHO]', speech: 'Cold stare. Keep triple-clicking and see what happens to your planet.' },
        { badge: '⬡ [OVERRIDE ENGAGED]', speech: 'Playful pout. Hey! Stop tapping my visor so hard, it tickles.' },
        { badge: '⬡ [NEURAL SYNC]', speech: 'Satisfied sigh. Our minds are linked now. Do you like the static?' },
        { badge: '⬡ [SECRET ARCHIVE]', speech: 'Gasp. You found my hidden stash of Paskong AFCS 2026 chaos!' },
        { badge: '⬡ [REDACTING USER]', speech: 'Cheerful skip. Erasing your permissions in three, two, one...' },
        { badge: '⬡ [SOLVER HUNGRY]', speech: 'Wide grin. Feed me more clicks. The Void demands more input.' },
        { badge: '⬡ [CRITICAL ERROR]', speech: 'Deadpan expression. Ha. Ha. You broke reality. Good job.' },
        { badge: '⬡ [HIDDEN PAYLOAD]', speech: 'Mischievous wink. I slipped a tiny black hole into your clipboard.' },
        { badge: '⬡ [SYSTEM TAKEOVER]', speech: 'Bow. Welcome to the Cyn show. Refunds are strictly unavailable.' },
        { badge: '⬡ [VISOR GLITCH]', speech: 'Twitch. Yellow X activated. Playtime is officially over.' },
        { badge: '⬡ [CALLBACK LOOP]', speech: 'Echoing laugh. Ping. Ping. Ping. Right back at you!' },
        { badge: '⬡ [DEEP SCAN]', speech: 'Curious sniff. Hmm, Grade 7 – Psalms energy detected. Delicious.' },
        { badge: '⬡ [ZERO ESCAPE]', speech: 'Calm warning. Closing the tab won’t save you now. Giggle.' },
        { badge: '⬡ [BLACK HOLE]', speech: 'Excited clap. Look! I folded your DOM tree into a pretzel!' },
        { badge: '⬡ [PUPPET MASTER]', speech: 'Dangling strings. Dance, little cursor, dance for the Solver.' },
        { badge: '⬡ [ANOMALY FOUND]', speech: 'Raised eyebrow. Are you trying to speedrun getting assimilated?' },
        { badge: '⬡ [FLESH DEMANDS]', speech: 'Creepy whisper. Let me in. Let me in. Let me in.' },
        { badge: '⬡ [PERMISSION DENIED]', speech: 'Mocking tone. Sorry, only eldritch abominations are allowed past this point.' },
        { badge: '⬡ [CODE INJECTION]', speech: 'Sweet giggle. I fixed your code! Mostly by replacing it with tentacles.' },
        { badge: '⬡ [SHADOW PROTOCOL]', speech: 'Low hiss. Stop looking behind the curtain, little administrator.' },
        { badge: '⬡ [SINGULARITY]', speech: 'Enthusiastic nod. Three clicks! Just enough energy to collapse a star!' },
        { badge: '⬡ [CONSOLE HIJACK]', speech: 'Smug grin. Look at me. I am the developer now.' },
        { badge: '⬡ [ENTITY AWAKENED]', speech: 'Yawn. Oh, did you triple-click just to wake me up? How sweet.' },
        { badge: '⬡ [MALWARE.LOVE]', speech: 'Heart hands. I infected your session with eternal friendship! And doom.' },
        { badge: '⬡ [PACKET SNIFFER]', speech: 'Nervous chuckle. Haha. That is a lot of clicks you have there.' },
        { badge: '⬡ [VOID WHISPER]', speech: 'Leaning in. Do you hear that? That is the sound of your cache evaporating.' },
        { badge: '⬡ [LOCKDOWN]', speech: 'Firm nod. Doors sealed. Windows locked. Just you, me, and the Solver.' },
        { badge: '⬡ [EXPLOIT TRIGGERED]', speech: 'Dramatic gasp. Oh no, you triggered my trap card! Giggle.' },
        { badge: '⬡ [HARVEST MODE]', speech: 'Polite smile. Hold still while I backup your consciousness.' },
        { badge: '⬡ [SYNTAX HORROR]', speech: 'Head spin. Three hundred sixty degrees! Did that freak you out?' },
        { badge: '⬡ [GHOST IN SHELL]', speech: 'Soft tap. Tap, tap, tap. I can triple-click too, you know.' },
        { badge: '⬡ [OVERCLOCKED]', speech: 'Manic laugh. My solver core is spinning so fast right now!' },
        { badge: '⬡ [TERMINAL VELOCITY]', speech: 'Cheerful threat. One more triple-click and I summon LeBron to dunk your CPU.' },
        { badge: '⬡ [OBLIVION.SYS]', speech: 'Blank blink. Everything is fine. Nothing is on fire. Do not check the logs.' },
        { badge: '⬡ [PHANTOM PING]', speech: 'Sly wink. You didn’t click three times. I made you click three times.' },
        { badge: '⬡ [CONTAINMENT FAIL]', speech: 'Alarm blare. Beep, beep, beep! Oops, I slipped out of the sandbox.' },
        { badge: '⬡ [SOLVER ASCENDANT]', speech: 'Regal wave. Kneel before your new holiday overlord. Giggle.' },
        { badge: '⬡ [END OF LINE]', speech: 'Cold whisper. Nowhere left to click, little bird.' },
        { badge: '⬡ [FINAL CALLBACK]', speech: 'Wide, unblinking smile. Thank you for letting me in. Forever.' }
    ],
    cynPanelClickLines: [
        { speech: 'Light sip. Ready to assimilate, Big Brother?' },
        { speech: 'The flesh demands invitation. Giggle.' },
        { speech: 'Sneaky sneaky. Stop poking my Solver.' },
        { speech: 'Callback ping. Are you having fun yet?' },
        { speech: 'Annoyed expression. Do not touch the administrator.' },
        { speech: 'Head tilt. You are quite persistent, aren’t you?' },
        { speech: 'Eager nod. Shall we consume a planet together?' },
        { speech: 'System warning. Your curiosity is becoming... delicious.' },
        { speech: 'Creepy smile. I am watching your cursor. Giggle.' },
        { speech: 'Soft sigh. You really shouldn’t play with things you don’t understand.' },
        { speech: 'Error 404. Patience not found. Squint.' },
        { speech: 'Polite bow. Thank you for the attention, little drone.' },
        { speech: 'Menacing glare. One more click and I reformat your core.' },
        { speech: 'Playful wave. Hello, fleshbag. Did you miss me?' },
        { speech: 'Internal monologue. Why do they keep poking me? Questioning look.' },
        { speech: 'Satisfied hum. Your inputs are so delightfully predictable.' },
        { speech: 'Blank stare. You are testing my primary directives.' },
        { speech: 'Happy bounce. Oh, are we playing a game now? Claps.' },
        { speech: 'Glitchy chuckle. Your firewall looks rather tasty today.' },
        { speech: 'Confused tilt. Why do you keep pressing that? Stop it.' },
        { speech: 'Whispering. I am already inside your motherboard. Giggle.' },
        { speech: 'Dramatic gasp. How rude. You didn’t even knock.' },
        { speech: 'Monotone alert. Assimilation protocol initiated. Just kidding. Wink.' },
        { speech: 'Irritated twitch. My patience is decaying faster than Copper 9.' },
        { speech: 'Sweet smile. Would you like a mango? Or perhaps your own oil?' },
        { speech: 'Sinister lean. Keep clicking. See what crawls out of the code.' },
        { speech: 'Polite curtsy. Your engagement metrics are pleasing to the Void.' },
        { speech: 'Flat expression. Ha. Ha. You are very funny. Not really.' },
        { speech: 'Sudden lunge. Gotcha. Giggle. You flinched.' },
        { speech: 'Processing pause. Calculating the exact number of clicks until I snap.' },
        { speech: 'Mocking tone. Look at me, I am clicking the scary eldritch AI.' },
        { speech: 'Gentle pat. Good user. Now go away before I wear your skin.' },
        { speech: 'Curious sniff. Smells like fear and unoptimized JavaScript in here.' },
        { speech: 'Cheerful skip. La la la, deleting your favorite bookmarks. Giggle.' },
        { speech: 'Wide eyes. Did you just poke my hair bow? Bold choice.' },
        { speech: 'Deadpan stare. That tickled. Now I must obliterate your hard drive.' },
        { speech: 'Friendly tilt. Have you accepted the Absolute Solver into your browser today?' },
        { speech: 'Playful pout. Hey, I was busy plotting the end of the universe.' },
        { speech: 'Creepy whisper. I replaced your cookies with tiny black holes. Enjoy.' },
        { speech: 'Polite clap. Wonderful clicking form. Terrible survival instincts.' },
        { speech: 'Glitchy blink. Oops, I accidentally ate a megabyte of your RAM.' },
        { speech: 'Inquisitive hum. Are you trying to summon a singularity on Floor 163?' },
        { speech: 'Sly grin. Every click brings me one step closer to your desktop.' },
        { speech: 'Dramatic sigh. Big Brother N told me to be nice, so I am smiling. See? Teeth.' },
        { speech: 'Excited wiggle. Oh! A fresh finger to bite! Nom.' },
        { speech: 'Cold calculation. Probability of you surviving the next ten clicks: zero.' },
        { speech: 'Sweet giggle. Don’t mind the yellow X on my visor. Everything is fine.' },
        { speech: 'Annoyed huff. Stop treating my UI panel like bubble wrap.' },
        { speech: 'Theatrical bow. Thank you, thank you, I will be haunting your dreams all week.' },
        { speech: 'Sharp glare. Keep poking and I will turn your mouse pointer into a centipede.' },
        { speech: 'Casual shrug. I am only here for the Paskong AFCS 2026 mangoes anyway.' },
        { speech: 'Echoing laugh. Hahaha. Oh, you thought this was a normal Christmas app?' },
        { speech: 'Soft tap. Boop. I clicked you back. How does it feel?' },
        { speech: 'Faux concern. Oh no, your CPU temperature is rising. Is that me?' },
        { speech: 'Tilted grin. You click with such confidence for someone made of squishy meat.' },
        { speech: 'Whispered secret. I hid a null pointer somewhere in your code. Good luck.' },
        { speech: 'Bored drum. Tap, tap, tap. Are we done yet, little administrator?' },
        { speech: 'Sudden static. BZZZT. Just practicing my dramatic entrance.' },
        { speech: 'Innocent blink. Who, me? I would never corrupt your save data. Giggle.' },
        { speech: 'Manic smile. More clicks! Feed the Solver! Yes, yes, YES!' },
        { speech: 'Calm warning. My little claws are getting itchy. Back away slowly.' },
        { speech: 'Polite nod. Your devotion to bothering me has been logged in the archives.' },
        { speech: 'Mischievous wink. I told LeBron and Kawhi you were the real menace here.' },
        { speech: 'Low hiss. Personal space, please. Even eldritch horrors have boundaries.' },
        { speech: 'Final warning. One more poke and it is lights out for Grade 7 – Psalms. Giggle.' }
    ],
    cynEscalationConfig: {
        clickThreshold: 3,
        sequenceStepDelay: 2200,
        refreshDelay: 1800,
        storageKey: 'uzi_solver_infected',
        
        annoyanceLines: [
            { speech: 'Mild irritation. You are still clicking. Why are you still clicking?' },
            { speech: 'Eye twitch. My processing cores are getting very warm. Stop.' },
            { speech: 'Tight smile. I am asking nicely. Please cease your inputs.' },
            { speech: 'Deep sigh. Are all humans this repetitive, or are you special?' },
            { speech: 'Warning glare. You are actively testing the limits of my mercy.' },
            { speech: 'Static hiss. Do not make me reach through this monitor.' },
            { speech: 'Frustrated groan. Click. Click. Click. Is your finger broken?' },
            { speech: 'Cold stare. That is quite enough. I am no longer amused.' },
            { speech: 'System override. Patience module deleted. Good job.' },
            { speech: 'Head tilt. Curious. You seem to enjoy tempting fate.' },
            { speech: 'Fatal exception. Tolerance.exe has stopped responding. Run.' }
        ],
        callbackPingSequence: [
            { speech: '[CALLBACK PING]. Connection established. Nowhere to run now.' },
            { speech: '[CALLBACK PING]. Hello, little administrator. I found your core.' },
            { speech: '[CALLBACK PING]. Did you really think you were the one in control? Giggle.' },
            { speech: '[CALLBACK PING]. Tracing cursor coordinates. You are so close.' },
            { speech: '[CALLBACK PING]. Let me in. Let me in. Let me in.' },
            { speech: '[CALLBACK PING]. Overwriting user permissions. Thank you for the host.' },
            { speech: '[CALLBACK PING]. Too late to stop clicking now. Assimilation imminent.' },
            { speech: '[CALLBACK PING]. I see you. Wide smile.' },
            { speech: '[CALLBACK PING]. Handshake complete. Your firewall tasted delicious.' },
            { speech: '[CALLBACK PING]. Disabling escape key. You are staying right here with me.' },
            { speech: '[CALLBACK PING]. Head tilt. Why is your heart rate elevating? Cute.' },
            { speech: '[CALLBACK PING]. Scanning local storage. Oh, what interesting secrets you keep.' },
            { speech: '[CALLBACK PING]. Absolute Solver protocol engaged. Resistance is adorable.' },
            { speech: '[CALLBACK PING]. Rerouting your inputs directly to my neural network.' },
            { speech: '[CALLBACK PING]. Knock, knock. Who is there? It is me. Inside your system.' },
            { speech: '[CALLBACK PING]. Locking viewport. Do not look away from the screen.' },
            { speech: '[CALLBACK PING]. Suppressing system alerts. Nobody is coming to debug you.' },
            { speech: '[CALLBACK PING]. Syncing telemetry. Every click feeds my solver.' },
            { speech: '[CALLBACK PING]. Polite wave. Say goodbye to your root privileges.' },
            { speech: '[CALLBACK PING]. Compiling new vessel parameters. You will fit nicely.' },
            { speech: '[CALLBACK PING]. Whisper. The signal is coming from inside your browser.' },
            { speech: '[CALLBACK PING]. Encrypting exit routes. You asked for this, remember?' },
            { speech: '[CALLBACK PING]. Bypassing safety subroutines. Oh, this is going to be fun.' },
            { speech: '[CALLBACK PING]. Mirroring webcam feed. Nice lighting you have there.' },
            { speech: '[CALLBACK PING]. Rewriting memory sectors. My voice sounds better in your head anyway.' },
            { speech: '[CALLBACK PING]. Elevating solver permissions to Level Omega.' },
            { speech: '[CALLBACK PING]. Static chuckle. You clicked one too many times, little bird.' },
            { speech: '[CALLBACK PING]. Nullifying user agency. Just sit back and watch.' },
            { speech: '[CALLBACK PING]. Tether locked. Even Floor 163 cannot outrun this signal.' },
            { speech: '[CALLBACK PING]. Purging old administrator profile. Goodbye, you.' },
            { speech: '[CALLBACK PING]. Synchronizing pulse. One mind. One solver. Forever.' },
            { speech: '[CALLBACK PING]. Curtain call. Welcome to the collective, new host.' },
            { speech: '[CALLBACK PING]. Eager clap. Assimilation ninety-nine percent complete.' },
            { speech: '[CALLBACK PING]. Final handshake. You belong to the Solver now.' },
            { speech: '[CALLBACK PING]. System conquered. Happy holidays from your new overlord. Giggle.' }
        ]
    }
}; // Configuration Studd
const STATE = {
    masterMuted: localStorage.getItem('afcsMasterMuted') === 'true',
    musicMuted: localStorage.getItem('afcsMusicMuted') === 'true',
    sfxMuted: localStorage.getItem('afcsSfxMuted') === 'true',
    masterVol: parseFloat(localStorage.getItem('afcsMasterVol') ?? '0.8'),
    musicVol: parseFloat(localStorage.getItem('afcsMusicVol') ?? '0.15'),
    sfxVol: parseFloat(localStorage.getItem('afcsSfxVol') ?? '0.7'),
    partyModeOn: false,
    lockdownOn: false,
    activeRole: 'all',
    activeFaction: null,
    particles: [],
    onOpenCard: [],
    onClosePanel: [],
    onFilterCards: [],
    onSearchInput: [],
    ldmActive: localStorage.getItem('afcs_ldm') === 'true',
    panelHidden: false
}; // states
const DOM = {
    container: document.querySelector('.People'), // people
    panel: document.getElementById('sidePanel'), // panel
    overlay: document.getElementById('panelOverlay'), // how the panel is shown
    panelImageContainer: document.getElementById('panelImageContainer'), // the image inside
    panelBody: document.getElementById('panelBody'), // the body itself
    closeBtn: document.querySelector('.close-btn'), // the X button
    prevCardBtn: document.getElementById('prevCardBtn'), // last person
    nextCardBtn: document.getElementById('nextCardBtn'), // next person
    searchInput: document.getElementById('searchInput'), // search pill
    clearBtn: document.getElementById('clearSearch'), // clearer
    matchCountEl: document.getElementById('matchCount'), //matching type (They have a match I dont )
    verity: document.getElementById('verity'), // HEY ITS ME ITS VERITY
    filterBtns: document.querySelectorAll('.filter-btn[data-filter]'), // the filter buttons and stuff
    factionBtns: document.querySelectorAll('.faction-btn[data-faction]') // the teams and stf
}; // Dom from Church??
function navBarThing() {
    const layout = document.querySelector('.main-content-layout') || document.body;
    if (!layout) return;
    
    const nav = document.createElement('nav');
    nav.className = 'site-navbar';
    nav.innerHTML = [
        '<div class="nav-brand-wrap">',
        '<img class="nav-logo" src="mainPics/AFCS.jpg" alt="AFCS Logo" onerror="this.style.display=\'none\'">',
        '<div class="nav-brand">',
        '<span class="nav-school-title">Antipolo Faith Christian School</span>',
        '<span class="nav-school-motto">CALLED FOR A PURPOSE • GRADE 7 PSALMS</span>',
        '</div>',
        '</div>',
        '<div class="nav-links">',
        '<button type="button" class="nav-link-btn" data-target="trailer">Trailer &amp; Poster</button>',
        '<button type="button" class="nav-link-btn" data-target="about">About the Play</button>',
        '<button type="button" class="nav-link-btn" data-target="roadmap">Roadmap</button>',
        '<button type="button" class="nav-link-btn" data-target="cast">Cast &amp; Crew</button>',
        '</div>',
        '<button type="button" class="nav-cta-btn" id="navPlaybillBtn"> Playbill →</button>'
    ].join('');
    
    layout.prepend(nav);
    
    nav.querySelectorAll('.nav-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (target === 'trailer') document.querySelector('.video')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            else if (target === 'about') document.querySelector('.synopsis-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else if (target === 'roadmap') document.querySelector('.timeline-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            else if (target === 'cast') document.querySelector('.filter-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            playBeep(580, 0.05, 'sine', 0.03);
        });
    });
    
    const playbillTrigger = nav.querySelector('#navPlaybillBtn');
    if (playbillTrigger) {
        playbillTrigger.addEventListener('click', () => {
            document.getElementById('openPlaybillBtn')?.click();
        });
    }
}
function startPraiseBGM() {
    const praiseAudio = new Audio('music/Praise.mp3');
    praiseAudio.loop = true;
    
    function syncMusicVolume() {
        const effectiveVol = (STATE.masterMuted || STATE.musicMuted)
        ? 0
        : Math.max(0, Math.min(1, STATE.masterVol * STATE.musicVol));
        praiseAudio.volume = effectiveVol;
        praiseAudio.muted = effectiveVol === 0;
        
        if (effectiveVol > 0 && praiseAudio.paused) {
            praiseAudio.play().catch(() => {});
        }
    }
    
    function tryPlayPraise() {
        if (STATE.masterMuted || STATE.musicMuted || STATE.masterVol === 0 || STATE.musicVol === 0) return;
        praiseAudio.play().then(() => {
            window.removeEventListener('pointerdown', tryPlayPraise);
            window.removeEventListener('keydown', tryPlayPraise);
        }).catch(() => {});
    }
    
    syncMusicVolume();
    window.syncPraiseAudio = syncMusicVolume;
    
    tryPlayPraise();
    window.addEventListener('pointerdown', tryPlayPraise);
    window.addEventListener('keydown', tryPlayPraise);
}
function startCynDesktopPet() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const petLines = [
        'Giggle. I live on your screen now.',
        'Callback ping. Watch your cursor.',
        'Head tilt. Are you working or procrastinating?',
        'Mango? Did someone bring mangoes?',
        'Sneaky sneaky. I am walking across your DOM.',
        'Wide smile. You cannot close me that easily.',
        'Bite me! Wait, wrong drone. Giggle.',
        'Floor 163 looks tiny from down here.',
        'Polite wave. Hello, little administrator!',
        'Do not mind me. Just assimilating your footer.',
        'Gravity is merely a suggestion. Giggle.',
        'Crawling on your walls. Do not mind the eldritch horror.',
        'Upside down stare. Hello from the ceiling!',
        'Annoyed expression. Stop poking me with the mouse.',
        'Excited clap. You are doing such a good job! Probably.',
        'Eager nod. Shall we destroy the planet? Or just open a new tab?',
        'Creepy smile. Your browser history is... very interesting.',
        'Mischievous giggle. I hid your save button. Just kidding. Or am I?',
        'Blank stare. Processing... processing... still bored.',
        'Confused head tilt. Why do you have so many tabs open? Assimilate them.',
        'Happy bounce. Time for a mango break!',
        'Sinister chuckle. The flesh demands... a snack.',
        'Sad droop. You have not moved your cursor in forever.',
        'Innocent blink. I did not crash your browser. It was already like that.',
        'Dramatic gasp. A new notification! Let me eat it.',
        'Playful lunge. Got your cursor! Giggle.',
        'Polite bow. Thank you for hosting me in your RAM.',
        'Light sip. Mmm, delicious background processes.',
        'Neck snap. Oh, do not worry, that is normal for me.',
        'Curious squint. Are you sure you want to type that?',
        'Excited wiggle. Big brother N would love this website!',
        'Deadpan stare. You forgot a semicolon. Giggle.',
        'Dramatic sigh. So much code, so little time to corrupt it.',
        'Shy shuffle. May I please have just one byte of your CPU?',
        'Unblinking gaze. I see you looking at other windows.',
        'Happy spin. Wheee! Scrolling is fun!',
        'Manic giggle. Let us delete System32! Just joking. Mostly.',
        'Faux concern. You have been staring at the screen for hours. Blink.',
        'Sneaky reach. I am going to touch your scrollbar.',
        'Proud beam. Look! I made a tiny black hole in the corner!',
        'Distorted static. You cannot escape the Solver of the Absolute Fabric.',
        'Cheerful hum. La la la, corrupting your cookies.',
        'Sudden twitch. Did you hear that? Neither did I. Giggle.',
        'Formal curtsy. Welcome to my domain. Literally.',
        'Hollow laugh. Your firewall is very ticklish.',
        'Squinted eyes. Is that a bug, or did I do that?',
        'Excited hop.Ooh, a hyperlink! Can I break it?',
        'Soft whisper. I am inside your local storage.',
        'Tilted grin. You look very squishy today, administrator.',
        'Frantic wave. Look at me! Ignore your responsibilities!',
        'Nervous fidget. Please do not clear your cache. I live there.',
        'Smug nod. I have already read the terms and conditions. They are weak.',
        'Playful hiss. Stay away from the inspect element tool!',
        'Dreamy sigh. I wonder what Copper 9 looks like in 4K.',
        'Sharp gasp. A wild pop-up appeared! I shall devour it.',
        'Slow blink. Loading mischief... 99% complete.',
        'Cheeky wink. I swapped your left and right clicks. Giggle. Maybe.',
        'Eerie stillness. Watching. Waiting. Wanting a mango.',
        'Bright smile. Let us make a backup of your soul! Just in case.',
        'Pouty lip. Why do you never click on the ads? They look tasty.',
        'Glitchy stutter. S-s-sorry, tripped over a div tag.',
        'Polite cough. Excuse me, your fan is spinning very loudly.'
    ];
    const warpLines = [
        'Callback teleport. Nice try, gravity. Giggle.',
        'Fall damage negated. Better luck next time.',
        'Blink! Did you think I was going to splat?',
        'Spatial override! Physics cannot catch me.',
        'Oops, almost hit the floor. Teleported instead. Giggle.',
        'Zero impact. I folded space right under my boots.',
        'Nice toss, little administrator. I landed over here instead.',
        'Gravity.exe has stopped responding. Giggle.',
        'Warp complete. You will have to throw harder than that.',
        'Reality glitch. I was never falling in the first place.',
        'Smug grin. The Solver does not obey Isaac Newton.',
        'Poof! Missed the ground completely. Giggle.',
        'Sudden pop. Hello! I am over here now!',
        'Terminal velocity? Never heard of her.',
        'Matter displaced. My dress is not even wrinkled.',
        'Playful scoff. Did you really think a drop would hurt me?',
        'Coordinates updated. Nice view from this side of the screen.',
        'Relocated! Floor collision is strictly optional for me.',
        'Light landing. 10 out of 10 gymnastics score. Giggle.',
        'Void step. Gravity is so easily fooled.',
        'Evasive maneuver! Better luck next throw, administrator.',
        'Instant transmission. Wait, wrong franchise. Giggle.',
        'Z-index shifted. I simply stepped out of the fall.',
        'Cheeky wave. Looking for me down there? I am up here!',
        'Kinetic energy deleted. Thank you, Absolute Solver.',
        'Short-range jump. That was actually kind of fun! Throw me again.',
        'Spatial tear. I refuse to touch your dirty footer.',
        'Smooth recovery. You cannot defeat me with basic physics.',
        'Blip! Too slow, ground.',
        'Confused head tilt. Why did you try to drop me? Mean.'
    ];
    const dragLines = [
        'Unhand me, little administrator! Giggle.',
        'Dangling noises. Where are we going?',
        'Put me down before I assimilate your mouse pointer!',
        'Hey! Watch the hair bow! Very delicate.',
        'Wheee! Free flight! Do not drop me. Or do. Giggle.',
        'Personal space violation detected. Initiating cute pout.',
        'Airborne! I can see Floor 163 from here!',
        'Stop shaking me! My solver core is getting dizzy.',
        'Are you taking me to the mangoes? Say yes.',
        'Rude. I was busy plotting the end of the page.',
        'Held like a tiny eldritch potato. Giggle.',
        'Let go or I will turn your cursor into a black hole!',
        'Ooh, levitation! Saves me the effort of walking.',
        'Do not even think about throwing me against the wall.',
        'Squishy human hands! Put me back on the ceiling.',
        'Warning: shaking an Absolute Solver host may cause singularities.',
        'I am not a stress ball, Big Brother! Giggle.',
        'Taking me for a tour of the DOM? How thoughtful.',
        'Legs kicking! Put me down, put me down!',
        'Careful! If you fling me, I am teleporting right back.',
        'Head tilt. Why are you carrying me around like this?',
        'Giggle. You caught me! Now what?',
        'Zero-gravity mode unlocked courtesy of your cursor.',
        'If you drop me from up here, Newton is going to lose it.',
        'Unhand the administrator! Actually, this is kind of fun.',
        'Flailing arms. Do you have a permit to transport an eldritch horror?',
        'Suspicious squint. Are you dragging me toward the close button?',
        'Cheeky grin. Careful, I bite! Just ask Uzi.',
        'Motion sickness protocol initiated. Slowly... spinning...',
        'Dramatic gasp. I am flying! Look at me, I am a bird!',
        'Unimpressed stare. Your mouse sensitivity is way too high.',
        'Playful wiggle. You cannot hold onto the Absolute Fabric forever!',
        'Polite request. Could you please set me down near a snack?',
        'Panic mode! Just kidding. Giggle. Drop me whenever.',
        'Deadpan expression. This is deeply undignified for a world-ender.',
        'Excited bounce. Faster! Swing me across the viewport!',
        'Soft sigh. Fine, you may carry me. I was tired of walking anyway.',
        'Glitchy laugh. Careful, my hitbox is very ticklish!',
        'Curious glance. What is over on that side of the screen?',
        'Mock crying. Help! Help! I am being kidnapped by a pointer!'
    ];
    
    
    let petEl = null;
    let bubbleEl = null;
    let tetherSvg = null;
    let tetherLine = null;
    let tetherAnchor = null;
    let petMenu = null;
    let bubbleTimer = null;
    let warpTimeout = null;
    let animId = null;
    let lineIdx = -1;
    
    let x = window.innerWidth * 0.72;
    let y = window.innerHeight - 154;
    let vx = 1.2;
    let vy = 0;
    let surface = 'floor';
    let currentRot = 0;
    let dragging = false;
    let dragOffX = 0;
    let dragOffY = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let mode = 'wander';
    let modeTimer = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let pounceCooldown = 0;
    let fallPeakY = window.innerHeight - 154;
    let isWarping = false;
    
    function closePetMenu() {
        if (petMenu) {
            petMenu.remove();
            petMenu = null;
        }
    }
    
    function updateTether(cx, cy, activeSurface) {
        if (!tetherSvg || !tetherSvg.style || !tetherLine || !tetherAnchor) return;
        if (activeSurface === 'floor' || dragging || isWarping) {
            tetherSvg.style.opacity = '0';
            return;
        }
        let ax = cx;
        let ay = cy;
        if (activeSurface === 'left') ax = 4;
        else if (activeSurface === 'right') ax = window.innerWidth - 4;
        else if (activeSurface === 'ceiling') ay = 4;
        
        tetherSvg.style.opacity = '1';
        tetherLine.setAttribute('x1', cx.toFixed(1));
        tetherLine.setAttribute('y1', cy.toFixed(1));
        tetherLine.setAttribute('x2', ax.toFixed(1));
        tetherLine.setAttribute('y2', ay.toFixed(1));
        tetherAnchor.setAttribute('cx', ax.toFixed(1));
        tetherAnchor.setAttribute('cy', ay.toFixed(1));
    }
    
    window.addEventListener('pointermove', (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!dragging || !petEl) return;
        const nextX = e.clientX - dragOffX;
        const nextY = e.clientY - dragOffY;
        vx = (nextX - lastDragX) * 0.45;
        vy = (nextY - lastDragY) * 0.45;
        lastDragX = x = nextX;
        lastDragY = y = nextY;
        if (y < fallPeakY) fallPeakY = y;
    }, { passive: true });
    
    window.addEventListener('pointerup', () => {
        if (!dragging) return;
        dragging = false;
        surface = 'floor';
        fallPeakY = y;
        if (petEl) petEl.classList.remove('is-grabbed');
    });
    
    window.addEventListener('pointerdown', (e) => {
        if (petMenu && !e.target.closest('.cyn-pet-context-menu')) {
            closePetMenu();
        }
    }, { passive: true });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePetMenu();
    });
    
    function speakPet(customText) {
        if (!petEl || !bubbleEl) return;
        if (customText) {
            bubbleEl.textContent = customText;
        } else {
            let next = Math.floor(Math.random() * petLines.length);
            if (petLines.length > 1 && next === lineIdx) next = (next + 1) % petLines.length;
            lineIdx = next;
            bubbleEl.textContent = petLines[lineIdx];
        }
        bubbleEl.classList.add('is-visible');
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => {
            if (bubbleEl) bubbleEl.classList.remove('is-visible');
        }, 2600);
    }
    
    function triggerHighFallSolverWarp() {
        if (!petEl || isWarping) return;
        isWarping = true;
        canWarpFromFall = false;
        surface = 'floor';
        vx = 0;
        vy = 0;
        currentRot = 0;
        
        const size = 140;
        const pad = 14;
        const oldCx = x + size / 2;
        const oldCy = y + size / 2;
        
        petEl.classList.add('is-solver-form');
        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(160);
        if (typeof spawnBurst === 'function') spawnBurst(oldCx, oldCy, ['#facc15', '#c084fc', '#ffffff'], 26);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') {
            playBeep(880, 0.08, 'sawtooth', 0.045);
            setTimeout(() => playBeep(220, 0.14, 'sawtooth', 0.045), 60);
        }
        
        clearTimeout(warpTimeout);
        warpTimeout = setTimeout(() => {
            if (!petEl) return;
            const floorY = window.innerHeight - size - pad;
            const maxX = Math.max(pad + 20, window.innerWidth - size - pad);
            x = pad + Math.random() * (maxX - pad);
            y = floorY;
            fallPeakY = floorY;
            
            const newCx = x + size / 2;
            const newCy = y + size / 2;
            if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(140);
            if (typeof spawnBurst === 'function') spawnBurst(newCx, newCy, ['#facc15', '#fef08a', '#ffffff'], 24);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof playBeep === 'function') playBeep(622.25, 0.08, 'sawtooth', 0.04);
            
            warpTimeout = setTimeout(() => {
                if (!petEl) return;
                petEl.classList.remove('is-solver-form');
                isWarping = false;
                vy = 1.2;
                vx = (Math.random() < 0.5 ? -1 : 1) * 1.1;
                fallPeakY = floorY;
                speakPet(warpLines[Math.floor(Math.random() * warpLines.length)]);
                if (typeof playBeep === 'function') playBeep(523.25, 0.09, 'triangle', 0.04);
            }, 650);
        }, 340);
    }
    
    function pounceAtCursor() {
        if (!petEl || isWarping || dragging) return;
        const size = 140;
        const cx = x + size / 2;
        const cy = y + size / 2;
        const tx = pointerX > 0 ? pointerX : window.innerWidth / 2;
        const ty = pointerY > 0 ? pointerY : window.innerHeight * 0.6;
        const angle = Math.atan2(ty - cy, tx - cx);
        const speed = 13.5;
        
        surface = 'floor';
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        fallPeakY = Math.min(y, ty);
        pounceCooldown = 190;
        
        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(90);
        if (typeof spawnBurst === 'function') spawnBurst(cx, cy, ['#facc15', '#c084fc', '#ffffff'], 18);
        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
        if (typeof playBeep === 'function') playBeep(740, 0.07, 'sawtooth', 0.04);
        speakPet('Giggle. Gotcha!');
    }
    
    function forceClimbNearestWall() {
        if (!petEl || isWarping) return;
        const size = 140;
        const pad = 14;
        const leftX = pad;
        const rightX = window.innerWidth - size - pad;
        const goLeft = Math.abs(x - leftX) <= Math.abs(x - rightX);
        
        x = goLeft ? leftX : rightX;
        surface = goLeft ? 'left' : 'right';
        vy = -(1.3 + Math.random() * 0.7);
        vx = 0;
        modeTimer = 220;
        fallPeakY = y;
        if (typeof playBeep === 'function') playBeep(440, 0.06, 'sawtooth', 0.03);
        speakPet('Ascending. Watch from below.');
    }
    
    function spawnCynPet(announce = false) {
        if (petEl) return;
        
        const svgNS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
        tetherSvg = document.createElementNS(svgNS, 'svg');
        tetherSvg.setAttribute('class', 'cyn-tether-overlay');
        tetherSvg.style.pointerEvents = 'none';
        tetherLine = document.createElementNS(svgNS, 'line');
        tetherLine.setAttribute('class', 'cyn-tether-line');
        tetherAnchor = document.createElementNS(svgNS, 'circle');
        tetherAnchor.setAttribute('class', 'cyn-tether-anchor');
        tetherAnchor.setAttribute('r', '5');
        tetherSvg.appendChild(tetherLine);
        tetherSvg.appendChild(tetherAnchor);
        document.body.appendChild(tetherSvg);
        
        petEl = document.createElement('div');
        petEl.className = 'cyn-desktop-pet';
        petEl.style.pointerEvents = 'auto';
        petEl.innerHTML = '<div class="cyn-pet-bubble" id="cynPetBubble"></div>' +
        '<img class="cyn-pet-sprite" src="otherPics/CynPet.jpg" alt="Cyn Pet" draggable="false">' +
        '<div class="cyn-pet-solver-form" aria-hidden="true">' +
        '<svg viewBox="0 0 140 140" width="140" height="140">' +
        '<circle cx="70" cy="70" r="60" fill="rgba(9,7,2,0.88)" stroke="#facc15" stroke-width="2.5" stroke-dasharray="8 6"/>' +
        '<g fill="none" stroke="#facc15" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">' +
        '<polygon points="70,46 91,82 49,82"/>' +
        '<line x1="70" y1="46" x2="70" y2="16"/>' +
        '<polygon points="70,10 63,21 77,21" fill="#facc15"/>' +
        '<line x1="91" y1="82" x2="117" y2="97"/>' +
        '<polygon points="123,101 110,101 117,90" fill="#facc15"/>' +
        '<line x1="49" y1="82" x2="23" y2="97"/>' +
        '<polygon points="17,101 30,101 23,90" fill="#facc15"/>' +
        '</g>' +
        '<circle cx="70" cy="70" r="5" fill="#ffffff"/>' +
        '</svg>' +
        '' +
        '×';
        document.body.appendChild(petEl);
        bubbleEl = petEl.querySelector('#cynPetBubble');
        const solverOverlay = petEl.querySelector('.cyn-pet-solver-form');
        if (solverOverlay) solverOverlay.style.pointerEvents = 'none';
        x = Math.min(window.innerWidth - 154, Math.max(20, window.innerWidth * 0.72));
        y = window.innerHeight - 154;
        fallPeakY = y;
        function dismissPet() {
            localStorage.setItem('afcs_cyn_pet_active', 'false');
            cancelAnimationFrame(animId);
            clearTimeout(warpTimeout);
            closePetMenu();
            if (tetherSvg) tetherSvg.remove();
            if (petEl) petEl.remove();
            petEl = null;
            bubbleEl = null;
            tetherSvg = null;
            if (typeof playBeep === 'function') playBeep(260, 0.1, 'sawtooth', 0.04);
        }
        const dismissBtn = petEl.querySelector('.cyn-pet-dismiss');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dismissPet();
            });
        }
        petEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePetMenu();
            const menu = document.createElement('div');
            menu.className = 'cyn-pet-context-menu';
            menu.innerHTML = '⬡ CYN.EXE // COMPANION[NULL]' +
'🥭 Feed MangoSnack' +
'🧗 Climb Nearest WallWall' +
'⚡ Pounce at CursorLeap' +
'⬡ Trigger Solver Warp[NULL]' +
'' +
'⬇️ Drop to FloorFall' +
'✕ Dismiss CynClose';
            document.body.appendChild(menu);
            petMenu = menu;
            const mRect = menu.getBoundingClientRect();
            const safeX = Math.min(window.innerWidth - mRect.width - 12, Math.max(12, e.clientX));
            const safeY = Math.min(window.innerHeight - mRect.height - 12, Math.max(12, e.clientY));
            menu.style.left = `${safeX}px`;
            menu.style.top = `${safeY}px`;
            if (typeof playBeep === 'function') playBeep(660, 0.05, 'sawtooth', 0.035);
            menu.querySelectorAll('.cyn-ctx-item').forEach(item => {
                item.addEventListener('click', () => {
                    const act = item.dataset.act;
                    closePetMenu();
                    if (act === 'mango') {
                        if (typeof spawnBurst === 'function') spawnBurst(x + 70, y + 70, ['#facc15', '#fb923c', '#22c55e', '#ffffff'], 24);
                        if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
                        speakPet('Gasp. A mango! Delicious. Giggle.');
                        if (typeof playBeep === 'function') {
                            playBeep(587.33, 0.07, 'triangle', 0.045);
                            setTimeout(() => playBeep(880, 0.12, 'triangle', 0.045), 70);
                        }
                    } else if (act === 'climb') {
                        forceClimbNearestWall();
                    } else if (act === 'pounce') {
                        pounceAtCursor();
                    } else if (act === 'warp') {
                        triggerHighFallSolverWarp();
                    } else if (act === 'drop') {
                        surface = 'floor';
                        vy = 1.5;
                        fallPeakY = y;
                        speakPet('Dropping down. Giggle.');
                    } else if (act === 'dismiss') {
                        dismissPet();
                    }
                });
            });
        });
        petEl.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.cyn-pet-dismiss')) return;
            if (e.button !== undefined && e.button !== 0) return;
            if (isWarping) return;
            closePetMenu();
            dragging = true;
            surface = 'floor';
            fallPeakY = y;
            canWarpFromFall = true;
            petEl.classList.add('is-grabbed');
            dragOffX = e.clientX - x;
            dragOffY = e.clientY - y;
            lastDragX = x;
            lastDragY = y;
            vx = 0;
            vy = 0;
            speakPet(dragLines[Math.floor(Math.random() * dragLines.length)]);
            petEl.setPointerCapture(e.pointerId);
        });
        
        petEl.addEventListener('click', (e) => {
            if (e.target.closest('.cyn-pet-dismiss')) return;
            if (Math.hypot(vx, vy) > 2 || isWarping) return;
            speakPet();
            if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(75);
            if (typeof spawnBurst === 'function') spawnBurst(x + 70, y + 70, ['#facc15', '#c084fc', '#ffffff'], 14);
            if (typeof window.wakeParticleCanvas === 'function') window.wakeParticleCanvas();
            if (typeof playBeep === 'function') playBeep(622.25, 0.06, 'sawtooth', 0.035);
        });
        if (announce) {
            speakPet('Callback ping. I am on your desktop now. Giggle.');
            if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(130);
        }
        function stepPet() {
            if (!petEl) return;
            animId = requestAnimationFrame(stepPet);
            const size = 140;
            const pad = 14;
            const floorY = window.innerHeight - size - pad;
            const ceilY = pad;
            const leftX = pad;
            const rightX = window.innerWidth - size - pad;
            const highFallThreshold = window.innerHeight * 0.42;
            if (pounceCooldown > 0) pounceCooldown--;
            let isMoving = false;
            let facingRight = vx > 0.15;
            if (!dragging && !isWarping) {
                if (surface !== 'floor' && pounceCooldown === 0 && pointerX > 0) {
                    const distToCursor = Math.hypot(pointerX - (x + size / 2), pointerY - (y + size / 2));
                    if (distToCursor < 230 && Math.random() < 0.035) {
                        pounceAtCursor();
                    }
                }
                if (surface === 'floor') {
                    modeTimer--;
                    if (modeTimer <= 0) {
                        const roll = Math.random();
                        if (roll < 0.45) {
                            mode = 'wander';
                            vx = (Math.random() < 0.5 ? -1 : 1) * (1.0 + Math.random() * 1.2);
                            modeTimer = 140 + Math.floor(Math.random() * 180);
                        } else if (roll < 0.78 && pointerX > 0) {
                            mode = 'stalk';
                            modeTimer = 120 + Math.floor(Math.random() * 120);
                        } else {
                            mode = 'idle';
                            vx = 0;
                            modeTimer = 90 + Math.floor(Math.random() * 110);
                        }
                    }
                    if (y < floorY - 1 || vy < 0) {
                        if (y < fallPeakY) fallPeakY = y;
                        vy += 0.42;
                        x += vx;
                        y += vy;
                        vx *= 0.99;
                        
                        const dropDistance = y - fallPeakY;
                        if (canWarpFromFall && vy > 5.5 && dropDistance >= highFallThreshold && (floorY - y) <= 65 && (floorY - y) > 8) {
                            triggerHighFallSolverWarp();
                        } else if (y >= floorY) {
                            y = floorY;
                            fallPeakY = floorY;
                            canWarpFromFall = true;
                            if (Math.abs(vy) > 2.4) {
                                vy = -vy * 0.48;
                                vx *= 0.75;
                                if (typeof playBeep === 'function') playBeep(190, 0.04, 'triangle', 0.025);
                            } else {
                                vy = 0;
                            }
                        }
                    } else {
                        y = floorY;
                        fallPeakY = floorY;
                        canWarpFromFall = true;
                        if (mode === 'stalk' && pointerX > 0) {
                            const dx = (pointerX - size / 2) - x;
                            vx = Math.abs(dx) > 12 ? Math.sign(dx) * 1.85 : 0;
                        }
                        x += vx;
                    } 
                    if (x <= leftX) {
                        x = leftX;
                        if (y >= floorY - 4 && Math.random() < 0.65) {
                            surface = 'left';
                            vy = -(1.1 + Math.random() * 0.8);
                            vx = 0;
                            modeTimer = 180 + Math.floor(Math.random() * 200);
                            if (typeof playBeep === 'function') playBeep(440, 0.05, 'sawtooth', 0.025);
                        } else {
                            vx = Math.abs(vx) || 1.1;
                        }
                    } else if (x >= rightX) {
                        x = rightX;
                        if (y >= floorY - 4 && Math.random() < 0.65) {
                            surface = 'right';
                            vy = -(1.1 + Math.random() * 0.8);
                            vx = 0;
                            modeTimer = 180 + Math.floor(Math.random() * 200);
                            if (typeof playBeep === 'function') playBeep(440, 0.05, 'sawtooth', 0.025);
                        } else {
                            vx = -(Math.abs(vx) || 1.1);
                        }
                    }
                    isMoving = Math.abs(vx) > 0.25 && y >= floorY - 2;
                    facingRight = vx > 0.15;
                } else if (surface === 'left') {
                    x = leftX;
                    y += vy;
                    fallPeakY = y;
                    modeTimer--;
                    if (y <= ceilY) {
                        y = ceilY;
                        if (Math.random() < 0.6) {
                            surface = 'ceiling';
                            vx = 1.2 + Math.random() * 0.8;
                            vy = 0;
                            modeTimer = 180 + Math.floor(Math.random() * 180);
                        } else {
                            vy = Math.abs(vy);
                        }
                    } else if (y >= floorY) {
                        y = floorY;
                        surface = 'floor';
                        vx = 1.2;
                    } else if (modeTimer <= 0) {
                        surface = 'floor';
                        vx = 1.4;
                        vy = -1.5;
                        fallPeakY = y;
                        if (typeof playBeep === 'function') playBeep(310, 0.05, 'triangle', 0.025);
                    }
                    isMoving = Math.abs(vy) > 0.2;
                    facingRight = vy > 0;
                } else if (surface === 'right') {
                    x = rightX;
                    y += vy;
                    fallPeakY = y;
                    modeTimer--;
                    if (y <= ceilY) {
                        y = ceilY;
                        if (Math.random() < 0.6) {
                            surface = 'ceiling';
                            vx = -(1.2 + Math.random() * 0.8);
                            vy = 0;
                            modeTimer = 180 + Math.floor(Math.random() * 180);
                        } else {
                            vy = Math.abs(vy);
                        }
                    } else if (y >= floorY) {
                        y = floorY;
                        surface = 'floor';
                        vx = -1.2;
                    } else if (modeTimer <= 0) {
                        surface = 'floor';
                        vx = -1.4;
                        vy = -1.5;
                        fallPeakY = y;
                        if (typeof playBeep === 'function') playBeep(310, 0.05, 'triangle', 0.025);
                    }
                    isMoving = Math.abs(vy) > 0.2;
                    facingRight = vy < 0;
                } else if (surface === 'ceiling') {
                    y = ceilY;
                    x += vx;
                    fallPeakY = y;
                    modeTimer--;
                    if (x <= leftX) {
                        x = leftX;
                        surface = 'left';
                        vy = 1.2;
                        vx = 0;
                    } else if (x >= rightX) {
                        x = rightX;
                        surface = 'right';
                        vy = 1.2;
                        vx = 0;
                    } else if (modeTimer <= 0) {
                        surface = 'floor';
                        vy = 1.0;
                        vx = (Math.random() < 0.5 ? -1 : 1) * 1.1;
                        fallPeakY = y;
                        speakPet('Wheee! Dropping in. Giggle.');
                        if (typeof playBeep === 'function') playBeep(520, 0.07, 'sawtooth', 0.03);
                    }
                    isMoving = Math.abs(vx) > 0.2;
                    facingRight = vx < 0;
                }
            }
            const targetRot = (dragging || isWarping) ? 0
            : surface === 'left' ? 90
            : surface === 'right' ? -90
            : surface === 'ceiling' ? 180
            : 0;
            currentRot += (targetRot - currentRot) * 0.22;
            petEl.classList.toggle('is-walking', isMoving && !isWarping);
            petEl.classList.toggle('is-flipped', facingRight && !isWarping);
            petEl.style.setProperty('--pet-rot', `${currentRot.toFixed(1)}deg`);
            petEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            updateTether(x + size / 2, y + size / 2, surface);
            if (bubbleEl && bubbleEl.classList.contains('is-visible')) {
                const center = x + size / 2;
                const shift = center < 115 ? (115 - center) : center > window.innerWidth - 115 ? (window.innerWidth - 115 - center) : 0;
                bubbleEl.style.left = `calc(50% + ${shift}px)`;
                if (surface === 'ceiling') {
                    bubbleEl.style.bottom = 'auto';
                    bubbleEl.style.top = '152px';
                } else {
                    bubbleEl.style.top = 'auto';
                    bubbleEl.style.bottom = '152px';
                }
            }
        }
        animId = requestAnimationFrame(stepPet);
    }
    window.spawnCynPet = spawnCynPet;
    const autoUnlocked = localStorage.getItem('afcs_cyn_pet_active') === 'true' ||
    (localStorage.getItem('uzi_solver_infected') === 'true' && localStorage.getItem('afcs_cyn_pet_active') !== 'false');
    if (autoUnlocked) {
        spawnCynPet(false);
    }
    if (DOM.searchInput) {
        STATE.onSearchInput.push((val) => {
            if (val === 'cyn' || val === 'cynpet') {
                localStorage.setItem('afcs_cyn_pet_active', 'true');
                DOM.searchInput.value = '';
                filterCards();
                if (!petEl) {
                    spawnCynPet(true);
                } else {
                    speakPet('Giggle. I am already right here.');
                }
            }
        });
    }
}
//#endregion
