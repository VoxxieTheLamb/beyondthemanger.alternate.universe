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

document.addEventListener('DOMContentLoaded', () => {
  //#region START Everything
  function startAll() {
    createPeople();
    startSupabaseBackend();
    startAfcsCoinGuard();
    startFormalPortal();
    startAudioControls();
    startAfcsShopData();
    startAfcsShopEffects();
    if (typeof window.shopHookAudioPlay === 'function') window.shopHookAudioPlay();
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
    startFaqSection();
    startFeedbackSection();
    startScrollEffects();
    startTimeOfDayTheme();
    startNightSkyStars();
    searchThings();
    filterCards();
    startSidePanel();
    startCompareModal();
    startPlaybillModal();
    startDoomsdayCursor();
    startDoggieWaveCursor();
    startGriefContextMenu();
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
    startAfcsShopUI();
    start2048Data();
    start2048Engine();
    start2048UI();
    startHideUiToggle();
    startBlackjackData();
    startBlackjackEngine();
    startBlackjackUI();
    startSurviveSolverData();
    startSurviveSolverEngine();
    startSurviveSolverUI();
    
  }
  startAll();
  //#endregion
});