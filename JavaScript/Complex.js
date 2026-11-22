function startFormalPortal() {
    if (!DOM.searchInput) return;
    
    STATE.onSearchInput.push((val) => {
        if (val === 'formal' || val === 'main') {
            DOM.searchInput.value = '';
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;top:28px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:999px;background:rgba(5,10,35,0.96);border:2px solid #facc15;color:#fef08a;font-weight:800;font-size:13px;letter-spacing:0.6px;z-index:999999;box-shadow:0 12px 32px rgba(0,0,0,0.85),0 0 24px rgba(250,204,21,0.6);';
            toast.textContent = '🏛️ Returning to Beyond The Manger: Official Showcase...';
            document.body.appendChild(toast);
            
            playBeep(587.33, 0.08, 'sine', 0.04);
            setTimeout(() => playBeep(783.99, 0.14, 'sine', 0.045), 75);
            
            setTimeout(() => {
                window.location.href = 'https://voxxiethelamb.github.io/beyondthemanger/';
            }, 650);
            return true;
        }
        return false;
    });
}
function startSupabaseBackend() {
  if (!window.supabase) return;
  const sb = window.supabase.createClient(
    'https://gpdlfljkcgnlcysmhjfj.supabase.co',
    'sb_publishable_eeCV9rkKJ7lIwkVNHst93g_AyXlOLm9'
  );
  window.AFCS_SUPABASE = sb;

  window.openFissionLeaderboardModal = async function () {
    const old = document.getElementById('fission-lb-modal');
    if (old) old.remove();

    const { data } = await sb
      .from('fission_leaderboard')
      .select('operator_name, energy, days_survived, cause_of_meltdown, coins_awarded')
      .order('days_survived', { ascending: false })
      .order('energy', { ascending: false })
      .limit(15);

    const rowsHtml = (data || []).map((r, idx) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-radius:8px;background:#090d16;border:1px solid ${idx === 0 ? '#facc15' : '#1e293b'};margin-bottom:6px;">
        <div>
          <strong style="color:${idx === 0 ? '#fde047' : '#38bdf8'};">#${idx + 1} ${r.operator_name}</strong>
          <div style="font-size:0.75rem;color:#94a3b8;">Cause: ${r.cause_of_meltdown}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:bold;color:#4ade80;">Day ${r.days_survived} • ${Number(r.energy).toLocaleString()} MW</div>
          <div style="font-size:0.75rem;color:#fde047;">+${r.coins_awarded} 🪙</div>
        </div>
      </div>
    `).join('') || '<p style="color:#94a3b8;text-align:center;">No reactor runs logged yet.</p>';

    const modal = document.createElement('div');
    modal.id = 'fission-lb-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,0.92);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;color:#f8fafc;font-family:system-ui,sans-serif;';
    modal.innerHTML = `
      <div style="width:100%;max-width:540px;max-height:85vh;overflow-y:auto;background:#0f172a;border:2px solid #00ff66;border-radius:16px;padding:20px;box-shadow:0 0 40px rgba(0,255,102,0.25);">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
          <span style="font-size:1.15rem;font-weight:900;color:#00ff66;">☢️ FISSION MAN1A! LEADERBOARD</span>
          <button id="flb-close" style="background:#450a0a;color:#fecaca;border:1px solid #991b1b;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:bold;">✕</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <input id="flb-code-input" type="text" placeholder="Enter Claim Code (FM-XXXXXX)" maxlength="10" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid #38bdf8;background:#090d16;color:#fff;font-family:monospace;text-transform:uppercase;">
          <button id="flb-claim-btn" style="background:#16a34a;color:#fff;border:1px solid #4ade80;padding:8px 14px;border-radius:8px;font-weight:bold;cursor:pointer;">Claim 🪙</button>
        </div>
        <div id="flb-claim-msg" style="font-size:0.8rem;min-height:18px;margin-bottom:10px;color:#fde047;">
          Win Days 2+ in Fission Mania! for +300 🪙 per day survived.
        </div>
        ${rowsHtml}
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('flb-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    document.getElementById('flb-claim-btn').onclick = async () => {
      const codeInput = document.getElementById('flb-code-input');
      const msgEl = document.getElementById('flb-claim-msg');
      const code = codeInput.value.trim();
      if (!code) return;

      const { data: res, error } = await sb.rpc('claim_fission_coins', { p_code: code });
      if (error || !res || !res.success) {
        msgEl.style.color = '#f87171';
        msgEl.textContent = (res && res.error) || 'Failed to claim code.';
        return;
      }

      const cur = parseInt(localStorage.getItem('afcs_coins') || '150', 10);
      const next = cur + res.coins_awarded;
      if (typeof window.afcsSyncCoins === 'function') {
        window.afcsSyncCoins(next);
      } else {
        localStorage.setItem('afcs_coins', String(next));
      }

      codeInput.value = '';
      msgEl.style.color = '#4ade80';
      msgEl.textContent = `Claimed +${res.coins_awarded} 🪙 from ${res.operator_name} (Day ${res.days_survived})!`;
    };
  };

  if (typeof STATE !== 'undefined' && Array.isArray(STATE.onSearchInput)) {
    STATE.onSearchInput.push((val) => {
      if (val === 'fission' || val === 'fission mania' || val === 'leaderboard') {
        DOM.searchInput.value = '';
        filterCards();
        window.openFissionLeaderboardModal();
        return true;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
    //#region START Everything
    function startAll() {
        createPeople();
        startSupabaseBackend();
        startAfcsCoinGuard();
        startFormalPortal();
        startAudioControls();
        startPraiseBGM();
        startDoomsdayRift();
        startNGuest();
        startSecretCodex();
        startDynamicTabPanel();
        startUziAlterEgo();
        startSolverOverhaul();
        startEpicStorm();
        bdayParty();
        startCynDesktopPet();
        startWhackACyn();
        startTradingCardData();
        startTradingCardBinderUI();
        startPortraitBadges();
        startCompareBattleData();
        startCompareBattleUI(); 
        startOnlineBattleNet();
        startOnlineBattleUI();
        startPjskData();
        startPjskUI();
        startBadgeLegend();
        startSimonLightboardGame();
        startChessBotsData();
        startChessBotsUI();
        alphaBetaThing();
        startConsoleSignature();
        navBarThing();
        startImageFallback();
        startDecorativeWaves();
        startHamiltonOverhaul();
        startParticleCanvas();
        startCursorGlow();
        startPortraitPhysics();
        startScrollEffects();
        startTimeOfDayTheme();
        startNightSkyStars();
        searchThings();
        filterCards();
        startSidePanel();
        startCompareModal();
        startPlaybillModal();
        startDoomsdayCursor();
        startDoomsdayRift();
        startFaithianCursorAndRally();
        startFaithianContextMenu();
        startDoomsdayContextMenu();
        startTourGuide();
        startScriptureCard();
        startWeatherWidget();
        startCalendarExport();
        startVenueFloorPlan();
        startVenueFacts();
        startTimeline();
        startCountdown();
        startModalsAndShortcuts();
        startSearchSecrets();
        lebronJames();
        startLeonhardEuler();
        startNewtonAlterEgo();
        startCurryGuest();
        startJordanAlterEgo();
        startHamiltonGuest();
        startBurrAlterEgo();
        startEinsteinGuest();
        startGalileoAlterEgo();
        startMusicalScale();
        startCharacterInteractions();
        startCornerstoneShimmer();
        startPersonRecognitionProtocol();
        startTrailerControls();
        startHiddenBugBSOD();
        startEpicCursorAndStorm();
        startEpicContextMenu();
        startMischievousLightCursor();
        startMischievousLightContextMenu(); 
        startCuriousLightCursor();
        startCuriousLightContextMenu();
        startSolverCursor();
        startPartyHackerCursor();
        startPartyHackerContextMenu();
        startGuidingLightCursor();
        startGuidingLightContextMenu();
        startDoorsGameData();
        startDoorsCore();
        startDoorsCorridor();
        startDoorsEntities();
        startDoorsLibrary();
        startDoorsKeyRoom();
        startDoorsFinaleAndRun();
        startBurjElevatorData();
        startBurjElevatorPuzzlesA();
        startBurjElevatorPuzzlesB();
        startBurjElevatorModal();
        startBurjElevatorController();
        startGdDeadlockedData();
        startGdDeadlockedLevel();
        startGdDeadlockedEngine();
        startGdDeadlockedUI();
        startBuckshotData();
        startBuckshotAI();
        startBuckshotModal();
        startBuckshotController();
        startArcadeHubData();
        startArcadeHubUI();
        startArcadeHubHook();
        startArcadeCompareEntry();
        startWordleData();
        startWordleUI();
        startHangmanData();
        startHangmanUI();
        startMinesweeperData();
        startMinesweeperEngine();
        startMinesweeperUI();
        startAfcsShopData();
        startAfcsShopEffects();
        startAfcsShopUI();
        start2048Data();
        start2048Engine();
        start2048UI();
        
    }
    startAll();
    //#endregion
});