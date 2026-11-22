function startSupabaseBackend() {
    const SUPABASE_URL = 'https://gpdlfljkcgnlcysmhjfj.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_eeCV9rkKJ7lIwkVNHst93g_AyXlOLm9';
    const COIN_KEY = 'afcs_coins';
    
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('PASTE_YOUR')) return;
    
    const origSetItem = Storage.prototype.setItem;
    const origGetItem = Storage.prototype.getItem;
    let serverBalance = Math.max(0, parseInt(origGetItem.call(localStorage, COIN_KEY) || '150', 10) || 150);
    let sbClient = null;
    let syncing = false;
    
    function applyLocalMirror(val) {
        serverBalance = Math.max(0, Math.floor(Number(val) || 0));
        syncing = true;
        origSetItem.call(localStorage, COIN_KEY, String(serverBalance));
        syncing = false;
        const badge = document.getElementById('afcs-coin-display');
        if (badge) badge.textContent = serverBalance + ' 🪙';
    }
    
    function warnBlockedCoinEdit(attempted) {
        applyLocalMirror(serverBalance);
        if (typeof triggerScreenGlitch === 'function') triggerScreenGlitch(220);
        if (typeof playBeep === 'function') playBeep(135, 0.22, 'sawtooth', 0.06);
        const old = document.getElementById('afcs-anticheat-toast');
        if (old) old.remove();
        const toast = document.createElement('div');
        toast.id = 'afcs-anticheat-toast';
        toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:rgba(127,29,29,0.97);border:2px solid #facc15;color:#fef08a;padding:10px 20px;border-radius:999px;font-family:monospace;font-weight:900;font-size:12.5px;z-index:100001;box-shadow:0 0 28px rgba(239,68,68,0.9);text-align:center;';
        toast.textContent = '⬡ [SUPABASE_GUARD] Blocked unauthorized coin edit (' + attempted + ' 🪙)!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2800);
    }
    
    function loadSdk(cb) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            cb();
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://jsdelivr.net';
        s.onload = cb;
        document.head.appendChild(s);
    }
    
    Storage.prototype.setItem = function (key, value) {
        if (this === localStorage && key === COIN_KEY && !syncing) {
            const nextVal = parseInt(String(value), 10);
            const delta = nextVal - serverBalance;
            const maxAllowedDelta = Math.max(1000, serverBalance * 3);
            if (isNaN(nextVal) || nextVal < 0 || delta > maxAllowedDelta) {
                warnBlockedCoinEdit(value);
                return;
            }
            applyLocalMirror(nextVal);
            if (sbClient && delta !== 0) {
                sbClient.rpc('claim_afcs_coins', { p_delta: delta }).then(({ data, error }) => {
                    if (!error && typeof data === 'number') {
                        applyLocalMirror(data);
                    } else if (error) {
                        sbClient.rpc('init_or_get_vault').then(({ data: v }) => {
                            if (v && typeof v.coins === 'number') applyLocalMirror(v.coins);
                        });
                    }
                });
            }
            return;
        }
        return origSetItem.apply(this, arguments);
    };
    
    window.submitGlobalDeadlocked = async function (pct, customName) {
        if (!sbClient) return;
        await sbClient.rpc('submit_deadlocked_score', {
            p_pct: Math.floor(pct),
            p_name: customName || null
        });
    };
    
    window.fetchGlobalDeadlockedTop = async function () {
        if (!sbClient) return Array.of();
        const { data } = await sbClient
        .from('player_vault')
        .select('display_name, deadlocked_best')
        .gt('deadlocked_best', 0)
        .order('deadlocked_best', { ascending: false })
        .limit(10);
        return Array.isArray(data) ? data : Array.of();
    };
    
    loadSdk(async () => {
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: sessionData } = await sbClient.auth.getSession();
        if (!sessionData || !sessionData.session) {
            await sbClient.auth.signInAnonymously();
        }
        const { data: vault } = await sbClient.rpc('init_or_get_vault');
        if (vault && typeof vault.coins === 'number') {
            applyLocalMirror(vault.coins);
        }
    });
}
