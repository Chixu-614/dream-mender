(() => {
  const $ = id => document.getElementById(id), button = $('sound-toggle');
  if (!button) return;
  const key = 'dream-audio-settings-v1';
  let config = { music:false, effects:false, musicVolume:50, effectsVolume:65, muted:false };
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const k of ['music','effects','muted']) if (typeof saved[k] === 'boolean') config[k] = saved[k];
      for (const k of ['musicVolume','effectsVolume']) if (Number.isFinite(saved[k])) config[k] = Math.max(0,Math.min(100,saved[k]));
    } else config.music = config.effects = localStorage.getItem('dream-sound') === 'on';
  } catch (_) {}
  let ctx, musicBus, effectsBus, timer, index = 0, revision = 0;
  const voices = new Set(), notes = [261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,329.63,392,440,349.23,329.63,293.66,261.63];
  const active = channel => !config.muted && config[channel] && config[channel+'Volume'] > 0;
  function render() {
    const on = active('music') || active('effects');
    button.classList.toggle('is-on',on); button.removeAttribute('aria-pressed');
    button.setAttribute('aria-label','声音设置'+(on ? '，声音已开启' : '，当前静音'));
    button.setAttribute('aria-haspopup','dialog'); button.title = '声音设置';
    for (const c of ['music','effects']) {
      $(c+'-enabled').checked = config[c]; $(c+'-volume').value = config[c+'Volume'];
      $(c+'-percent').textContent = config[c+'Volume']+'%';
    }
    $('sound-muted').checked = config.muted;
  }
  function gains() {
    if (!ctx) return;
    for (const [channel,bus,scale,smoothing] of [['music',musicBus,.35,.025],['effects',effectsBus,.40,.015]]) {
      const now = ctx.currentTime, current = bus.gain.value;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(current,now);
      bus.gain.setTargetAtTime(active(channel) ? scale*config[channel+'Volume']/100 : 0,now,smoothing);
    }
  }
  function stop() {
    clearInterval(timer); timer = undefined;
    for (const o of voices) { try { o.stop(); } catch (_) {} } voices.clear();
    if (ctx) {
      musicBus.gain.cancelScheduledValues(ctx.currentTime); effectsBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.value = effectsBus.gain.value = 0;
      if (ctx.state === 'running') ctx.suspend().catch(() => {});
    }
  }
  function tone(frequency,channel,softness=1) {
    if (!active(channel) || document.hidden || !ctx || ctx.state !== 'running') return;
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime, fx = channel === 'effects';
    o.type = fx ? 'sine' : 'triangle'; o.frequency.value = frequency; g.gain.setValueAtTime(.001,t);
    g.gain.linearRampToValueAtTime(fx ? .45*softness : .38,t+(fx ? .008 : .025));
    g.gain.exponentialRampToValueAtTime(.001,t+(fx ? .19 : 1.05));
    o.connect(g); g.connect(fx ? effectsBus : musicBus); voices.add(o);
    o.onended = () => { voices.delete(o); o.disconnect(); g.disconnect(); };
    o.start(); o.stop(t+(fx ? .22 : 1.1));
  }
  async function start() {
    if (document.hidden || (!active('music') && !active('effects'))) return false;
    const ticket = revision;
    try {
      if (!ctx) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('unavailable');
        ctx = new Audio(); musicBus = ctx.createGain(); effectsBus = ctx.createGain();
        musicBus.gain.value = effectsBus.gain.value = 0; musicBus.connect(ctx.destination); effectsBus.connect(ctx.destination);
      }
      if (ctx.state !== 'running') await ctx.resume();
      if (ctx.state !== 'running') { $('sound-status').textContent = '浏览器尚未允许播放，请再点一次试听'; return false; }
      if (ticket !== revision || document.hidden) {
        if (document.hidden || (!active('music') && !active('effects'))) stop();
        return false;
      }
      gains();
      if (active('music') && !timer) {
        tone(notes[index++ % notes.length],'music');
        timer = setInterval(() => tone(notes[index++ % notes.length],'music'),720);
      } else if (!active('music')) { clearInterval(timer); timer = undefined; }
      return true;
    } catch (_) { $('sound-status').textContent = '声音暂不可用，请再次点击试听重试'; return false; }
  }
  function save() {
    revision++;
    try { localStorage.setItem(key,JSON.stringify(config)); $('sound-status').textContent = '已自动保存到当前浏览器'; }
    catch (_) { $('sound-status').textContent = '当前浏览器无法保存设置，本次仍可使用'; }
    render(); gains();
    if (!active('music') && !active('effects')) stop(); else start();
  }
  button.addEventListener('click',() => { start(); render(); if (!$('sound-dialog').open) $('sound-dialog').showModal(); });
  $('close-sound').addEventListener('click',() => $('sound-dialog').close());
  for (const c of ['music','effects']) {
    $(c+'-enabled').addEventListener('change',e => { config[c] = e.target.checked; save(); });
    $(c+'-volume').addEventListener('input',e => { config[c+'Volume'] = Number(e.target.value); save(); });
    $('preview-'+c).addEventListener('click',async () => {
      if (!active(c)) { $('sound-status').textContent = '请先开启这一项声音、调高音量并取消全部静音'; return; }
      if (await start()) {
        const ticket = revision;
        (c === 'music' ? [261.63,329.63,392] : [523.25,659.25,783.99]).forEach((n,i) => setTimeout(() => {
          if (ticket === revision) tone(n,c);
        },i*(c === 'music' ? 400 : 140)));
      }
    });
  }
  $('sound-muted').addEventListener('change',e => { config.muted = e.target.checked; save(); });
  document.addEventListener('click',async e => {
    if (e.target.closest('#sound-dialog, #sound-toggle')) return;
    if (await start()) if (e.target.closest('button')) tone(620,'effects');
  },true);
  document.addEventListener('atelier-sound',async e => {
    if (!active('effects') || document.hidden) return;
    const ticket = revision;
    if (await start()) (e.detail === 'chime' ? [880,1174.66] : e.detail === 'success' ? [523.25,659.25,783.99] : [392,523.25]).forEach((n,i) => setTimeout(() => {
      if (ticket === revision) tone(n,'effects',e.detail === 'chime' ? .28 : 1);
    },i*140));
  });
  document.addEventListener('visibilitychange',() => { revision++; if (document.hidden) stop(); else if (ctx) start(); });
  window.addEventListener('pagehide',() => { revision++; stop(); });
  window.addEventListener('pageshow',e => { if (e.persisted && ctx) start(); });
  render();
})();