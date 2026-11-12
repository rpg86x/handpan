// Handpan 1.2+: additions to the original offline instrument, no dependencies.
const copy = {
  nl: { title:'Studio · loop, opnemen, leren & ontspannen', tempo:'Tempo', bars:'Maten', loop:'Nieuwe loop', stop:'Stop loop', overdub:'Laag toevoegen', undo:'Laatste laag terug', click:'Metronoom', record:'Audio opnemen', finish:'Opname afronden', download:'Download opname', learn:'Luister & speel na', endLearn:'Stop les', drone:'Drone', nature:'Regenruis', timer:'Timer (min)', session:'Start sessie', endSession:'Einde sessie', damp:'Dempen', ready:'Klaar om te spelen.', recording:'Audio-opname loopt…', saved:'Opname klaar om te downloaden.', unsupported:'Audio opnemen wordt niet ondersteund in deze browser.', listen:'Luister naar het patroon…', repeat:'Speel het patroon na: ', correct:'Goed! Nog een keer of kies een nieuw patroon.', retry:'Probeer opnieuw: ', looprec:'Loop opnemen', playing:'Loop speelt', layer:'Laag opnemen', layers:'lagen', hint:'Loop: 4 tellen per maat; de opname begint direct en herhaalt automatisch. Voeg lagen toe en stop de laagopname met dezelfde knop. Backspace = tonen dempen. De audiorecorder neemt ook loops, drone, regen en metronoom op.', sessionDone:'Sessie afgerond.', error:'Dat lukte niet. Probeer het opnieuw.', scale:'Loop en les gestopt voor de nieuwe toonladder.', minutes:'Kies 1 tot 180 minuten.', waiting:'Sessie loopt', fading:'Sessie wordt zacht uitgefaded…' },
  en: { title:'Studio · loop, record, learn & relax', tempo:'Tempo', bars:'Bars', loop:'New loop', stop:'Stop loop', overdub:'Add layer', undo:'Undo last layer', click:'Metronome', record:'Record audio', finish:'Finish recording', download:'Download recording', learn:'Listen & repeat', endLearn:'Stop lesson', drone:'Drone', nature:'Rain noise', timer:'Timer (min)', session:'Start session', endSession:'End session', damp:'Damp', ready:'Ready to play.', recording:'Recording audio…', saved:'Recording ready to download.', unsupported:'Audio recording is not supported in this browser.', listen:'Listen to the pattern…', repeat:'Repeat the pattern: ', correct:'Well done! Repeat or choose a new pattern.', retry:'Try again: ', looprec:'Recording loop', playing:'Loop playing', layer:'Recording layer', layers:'layers', hint:'Loop: 4 beats per bar; recording starts immediately and repeats automatically. Add layers; press again to finish the layer. Backspace = damp tones. Audio recording includes loops, drone, rain and metronome.', sessionDone:'Session complete.', error:'Something went wrong. Please try again.', scale:'Loop and lesson stopped for the new scale.', minutes:'Choose 1 to 180 minutes.', waiting:'Session running', fading:'Fading out the session…' }
};
const tr = () => copy[lang] || copy.en;
const studio = { bpm:90, bars:2, mode:'idle', layers:[], pending:[], start:0, duration:0, scheduled:new Set(), beat:-1, metro:false, recorder:null, chunks:[], url:null, mime:'', lesson:null, lessonTimers:[], drone:null, rain:null, deadline:0, fading:false, fadeStart:0, fadeVolume:0, timerMinutes:10 };
const $ = id => document.getElementById(id);
function status(message) { $('studioStatus').textContent = message; }
function button(id,text,action) { const b=document.createElement('button'); b.id=id; b.type='button'; b.textContent=text; b.onclick=action; return b; }
function renderStudio() {
  const t=tr(); $('studioTitle').textContent=t.title;
  const body=$('studioBody'); body.replaceChildren();
  const row=()=>{const r=document.createElement('div');r.className='tools';body.append(r);return r;};
  const field=(r,text,input)=>{const l=document.createElement('label');l.append(document.createTextNode(text+' '),input);r.append(l);};
  const r=row(), bpm=document.createElement('input'); bpm.type='number';bpm.min=40;bpm.max=180;bpm.value=studio.bpm;bpm.id='bpm';
  bpm.onchange=()=>{studio.bpm=Math.max(40,Math.min(180,Number(bpm.value)||90));bpm.value=studio.bpm;};field(r,t.tempo,bpm);
  const bars=document.createElement('select');bars.id='bars';[1,2,4,8].forEach(n=>bars.add(new Option(n,n)));bars.value=studio.bars;bars.onchange=()=>studio.bars=+bars.value;field(r,t.bars,bars);
  r.append(button('newLoop',t.loop,startLoop),button('stopLoop',t.stop,()=>stopLoop()),button('overdub',t.overdub,toggleOverdub),button('undoLayer',t.undo,undoLayer),button('metro',t.click,()=>{initAudio();studio.metro=!studio.metro;studio.beat=-1;studio.metroStart=ctx.currentTime;updateStudio();}));
  const rec=row();rec.append(button('recordAudio',t.record,toggleRecording),button('downloadAudio',t.download,downloadRecording));
  const lesson=row();lesson.append(button('learn',t.learn,startLesson),button('endLearn',t.endLearn,()=>{stopLesson();status(t.ready);}));
  const relax=row();relax.append(button('drone',t.drone,()=>toggleAmbient('drone')),button('rain',t.nature,()=>toggleAmbient('rain')));
  const mins=document.createElement('input');mins.id='minutes';mins.type='number';mins.min=1;mins.max=180;mins.value=studio.timerMinutes;mins.onchange=()=>studio.timerMinutes=+mins.value;field(relax,t.timer,mins);
  relax.append(button('session',t.session,toggleSession));
  const hint=document.createElement('p');hint.textContent=t.hint;body.append(hint);
  const msg=document.createElement('p');msg.id='studioStatus';msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');msg.textContent=t.ready;body.prepend(msg);
  const percussion=$('touchPerc');percussion.replaceChildren();
  Object.keys(PERC).forEach(code=>{const kind=PERC[code];const b=button('touch-'+kind,LANGS[lang].perc[kind],()=>playPerc(kind,code));percussion.append(b);});
  const damp=button('damp',t.damp+' ⌫',dampTones);damp.className='damp';percussion.append(damp);
  updateStudio();
}
function updateStudio() {
  const t=tr(), running=studio.mode!=='idle';
  $('bpm').disabled=running;$('bars').disabled=running;$('newLoop').disabled=running;
  $('stopLoop').disabled=!running;$('overdub').disabled=!['play','overdub'].includes(studio.mode);
  $('overdub').setAttribute('aria-pressed',studio.mode==='overdub');
  $('undoLayer').disabled=studio.layers.length<2 || studio.mode!=='play';
  $('metro').setAttribute('aria-pressed',studio.metro);
  $('recordAudio').textContent=studio.recorder?t.finish:t.record;
  $('recordAudio').disabled=!window.MediaRecorder || studio.recorder?.state==='inactive';
  $('downloadAudio').disabled=!studio.url;
  $('drone').setAttribute('aria-pressed',!!studio.drone);$('rain').setAttribute('aria-pressed',!!studio.rain);
  $('session').textContent=studio.deadline?t.endSession:t.session;
  $('minutes').disabled=!!studio.deadline;
}
function dampTones() {
  if(!ctx)return;
  for(const v of voices) v.out.gain.setTargetAtTime(0,ctx.currentTime,.035);
  captureEvent({kind:'damp'});
}
function captureEvent(event) {
  if(studio.mode==='first'||studio.mode==='overdub') studio.pending.push({...event,at:(ctx.currentTime-studio.start)%studio.duration});
}
const originalTone=playTone, originalDing=playDing, originalPerc=playPerc;
playTone=function(k,vel){originalTone(k,vel);captureEvent({kind:'tone',k,vel});checkLesson(k);};
playDing=function(vel){originalDing(vel);captureEvent({kind:'ding',vel});};
playPerc=function(kind,code){originalPerc(kind,code);captureEvent({kind:'perc',perc:kind});};

function startLoop() {
  initAudio();stopLesson();studio.duration=studio.bars*4*60/studio.bpm;
  studio.start=ctx.currentTime;studio.mode='first';studio.layers=[];studio.pending=[];studio.scheduled.clear();studio.beat=-1;updateStudio();tick();
}
function commitLayer() { if(studio.pending.length)studio.layers.push(studio.pending.slice());studio.pending=[]; }
function stopLoop(show=true) {
  studio.mode='idle';studio.pending=[];studio.layers=[];studio.scheduled.clear();
  if(ctx)for(const v of voices)v.out.gain.setTargetAtTime(0,ctx.currentTime,.025);
  updateStudio();if(show)status(tr().ready);
}
function toggleOverdub(){if(studio.mode==='play'){studio.mode='overdub';studio.pending=[];}else if(studio.mode==='overdub'){commitLayer();studio.mode='play';}updateStudio();}
function undoLayer(){if(studio.layers.length>1)studio.layers.pop();updateStudio();}
function emitEvent(e,when){
  const s=SCALES[current()];
  if(e.kind==='tone')tone(freq(s.notes[e.k]),e.vel,when);
  else if(e.kind==='ding')tone(freq(s.ding),e.vel,when);
  else if(e.kind==='perc')perc(e.perc,when);
  // Audio is scheduled on the audio clock; visual feedback follows at the same instant.
  setTimeout(()=>{
    if(studio.mode==='idle')return;
    if(e.kind==='tone')flash(fieldEls[e.k],.7);
    else if(e.kind==='ding')flash(dingEl,.8);
    else if(e.kind==='damp'&&ctx)for(const v of voices)v.out.gain.setTargetAtTime(0,ctx.currentTime,.035);
  },Math.max(0,(when-ctx.currentTime)*1000));
}
function clickBeat(when,strong){
  const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=strong?1200:800;
  g.gain.setValueAtTime(.07,when);g.gain.exponentialRampToValueAtTime(.0001,when+.035);
  o.connect(g).connect(bus);o.start(when);o.stop(when+.04);o.onended=()=>{o.disconnect();g.disconnect();};
}
function tick(){
  if(!ctx)return;
  const now=ctx.currentTime,t=tr();
  if(studio.mode==='first'&&now>=studio.start+studio.duration){commitLayer();studio.mode='play';updateStudio();}
  if(studio.mode!=='idle'){
    const cycle=Math.floor((now-studio.start)/studio.duration);
    for(const key of studio.scheduled)if(+key.split(':')[0]<cycle-1)studio.scheduled.delete(key);
    if(studio.mode!=='first')for(let c=Math.max(1,cycle);c<=cycle+1;c++)studio.layers.forEach((layer,l)=>layer.forEach((e,i)=>{
      const at=studio.start+c*studio.duration+e.at,key=`${c}:${l}:${i}`;
      if(at>=now-.025&&at<now+.09&&!studio.scheduled.has(key)){studio.scheduled.add(key);emitEvent(e,Math.max(now,at));}
    }));
    const beat=Math.floor(((now-studio.start)%studio.duration)/(60/studio.bpm))+1;
    status(`${studio.mode==='first'?t.looprec:studio.mode==='overdub'?t.layer:t.playing} · ${beat}/${studio.bars*4} · ${studio.layers.length} ${t.layers}`);
  }
  if(studio.metro){
    const origin=studio.mode==='idle'?(studio.metroStart||0):studio.start;
    const beatLength=60/studio.bpm, beat=Math.floor((now-origin)/beatLength);
    for(let b=Math.max(0,beat);b<=beat+1;b++){const at=origin+b*beatLength;if(b>studio.beat&&at>=now-.025&&at<now+.09){clickBeat(Math.max(now,at),b%4===0);studio.beat=b;}}
  }
  if(studio.deadline){
    const remaining=studio.deadline-now;
    if(remaining<=5&&!studio.fading){studio.fading=true;studio.fadeStart=now;studio.fadeVolume=+vol.value;master.gain.cancelScheduledValues(now);master.gain.setValueAtTime(master.gain.value,now);master.gain.linearRampToValueAtTime(0,now+Math.max(.1,remaining));}
    if(remaining<=0)endSession();else if(studio.mode==='idle')status(studio.fading?t.fading:`${t.waiting} · ${Math.floor(remaining/60)}:${String(Math.floor(remaining%60)).padStart(2,'0')}`);
  }
}
setInterval(tick,25);

function toggleRecording(){
  if(studio.recorder){if(studio.recorder.state==='recording')studio.recorder.stop();updateStudio();return;}
  if(!window.MediaRecorder){status(tr().unsupported);return;}
  initAudio();studio.chunks=[];
  try{
    const mime=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/webm'].find(m=>MediaRecorder.isTypeSupported(m));
    const rec=new MediaRecorder(capture.stream,mime?{mimeType:mime}:undefined);studio.recorder=rec;
    rec.ondataavailable=e=>{if(e.data.size)studio.chunks.push(e.data);};
    rec.onstop=()=>{if(studio.url)URL.revokeObjectURL(studio.url);studio.mime=rec.mimeType;studio.url=URL.createObjectURL(new Blob(studio.chunks,{type:rec.mimeType}));studio.recorder=null;updateStudio();status(tr().saved);};
    rec.onerror=()=>{studio.recorder=null;updateStudio();status(tr().error);};
    rec.start(1000);status(tr().recording);updateStudio();
  }catch(e){studio.recorder=null;updateStudio();status(tr().error);console.error(e);}
}
function downloadRecording(){if(!studio.url)return;const a=document.createElement('a');a.href=studio.url;a.download='Handpan-'+new Date().toISOString().replace(/[:.]/g,'-')+(studio.mime.includes('ogg')?'.ogg':'.webm');a.click();}

function stopLesson(){studio.lessonTimers.forEach(clearTimeout);studio.lessonTimers=[];studio.lesson=null;}
function startLesson(){
  initAudio();stopLoop(false);stopLesson();
  const patterns=[[0,2,4,2],[0,1,3,1],[0,4,6,4],[2,3,5,3]];
  const pattern=patterns[Math.floor(Math.random()*patterns.length)];
  studio.lesson={pattern,pos:0,listening:true};status(tr().listen);
  pattern.forEach((k,i)=>studio.lessonTimers.push(setTimeout(()=>{originalTone(k,.7);},i*650+250)));
  studio.lessonTimers.push(setTimeout(()=>{studio.lesson.listening=false;status(tr().repeat+pattern.map(k=>keyName(TONE_KEYS[k])).join(' · '));},pattern.length*650+300));
}
function checkLesson(k){
  const l=studio.lesson;if(!l||l.listening)return;
  if(k===l.pattern[l.pos]){l.pos++;if(l.pos===l.pattern.length){l.pos=0;status(tr().correct);}else status(tr().repeat+l.pattern.map((n,i)=>(i<l.pos?'✓ ': '')+keyName(TONE_KEYS[n])).join(' · '));}
  else {l.pos=0;status(tr().retry+l.pattern.map(n=>keyName(TONE_KEYS[n])).join(' · '));}
}
function toggleAmbient(kind){
  initAudio();if(studio[kind]){stopAmbient(kind);updateStudio();return;}
  const out=ctx.createGain();out.gain.setValueAtTime(0,ctx.currentTime);out.gain.linearRampToValueAtTime(kind==='drone'?.09:.06,ctx.currentTime+1.5);out.connect(bus);
  const nodes=[];
  if(kind==='drone'){
    const f=freq(SCALES[current()].ding);[.5,1,1.5].forEach((r,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f*r;g.gain.value=i===0?.65:.22;o.connect(g).connect(out);o.start();nodes.push(o);});
  }else{
    const n=ctx.createBufferSource(),filter=ctx.createBiquadFilter();const buffer=ctx.createBuffer(1,ctx.sampleRate*6,ctx.sampleRate),d=buffer.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    n.buffer=buffer;n.loop=true;filter.type='lowpass';filter.frequency.value=1600;n.connect(filter).connect(out);n.start();nodes.push(n);
  }
  studio[kind]={out,nodes};updateStudio();
}
function stopAmbient(kind){const a=studio[kind];if(!a)return;a.out.gain.setTargetAtTime(0,ctx.currentTime,.2);a.nodes.forEach(n=>n.stop(ctx.currentTime+1));setTimeout(()=>a.out.disconnect(),1100);studio[kind]=null;}
function toggleSession(){
  if(studio.deadline){endSession();return;}initAudio();const minutes=+$('minutes').value;
  if(!Number.isFinite(minutes)||minutes<1||minutes>180){status(tr().minutes);return;}
  studio.timerMinutes=minutes;studio.deadline=ctx.currentTime+minutes*60;studio.fading=false;
  if(!studio.drone)toggleAmbient('drone');updateStudio();
}
function endSession(){
  studio.deadline=0;studio.fading=false;stopAmbient('drone');stopAmbient('rain');stopLoop(false);stopLesson();studio.metro=false;
  // Preserve the soft ending in a running audio recording, then finish it.
  if(studio.recorder?.state==='recording')studio.recorder.stop();
  setTimeout(()=>{master.gain.cancelScheduledValues(ctx.currentTime);applyMix();},1200);
  updateStudio();status(tr().sessionDone);
}
function studioScaleChanged(){stopLoop(false);stopLesson();if(studio.drone){stopAmbient('drone');setTimeout(()=>{if(!studio.drone)toggleAmbient('drone');},30);}status(tr().scale);}

// Add accessible roles to Claude's existing SVG fields and key caps.
function accessiblePan(){
  svg.setAttribute('role','group');svg.setAttribute('aria-label','Handpan');
  [...fieldEls.map((f,k)=>({el:f.g,name:SCALES[current()].notes[k],action:()=>playTone(k,.85)})),{el:dingEl.g,name:'Ding '+SCALES[current()].ding,action:()=>playDing(.9)}].forEach(({el,name,action})=>{
    el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',name);
    el.addEventListener('keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();action();}});
  });
  document.querySelectorAll('.cap:not(.blank)').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',el.textContent);el.addEventListener('keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();el.dispatchEvent(new PointerEvent('pointerdown'));}});});
}
const originalBuildPan=buildPan,originalBuildKbd=buildKbd;
buildPan=function(){originalBuildPan();};
buildKbd=function(){originalBuildKbd();accessiblePan();};
// Position within a field changes the attack brightness/strength slightly.
svg.addEventListener('pointerdown',e=>{
  const field=e.target.closest('.field');if(!field)return;
  const box=field.getBoundingClientRect();
  // The original listener already supplies pressure. Edge taps add a quiet rim texture.
  const distance=Math.hypot((e.clientX-box.left-box.width/2)/(box.width/2),(e.clientY-box.top-box.height/2)/(box.height/2));
  if(distance>.75){initAudio();noiseBurst(bus,ctx.currentTime,'bandpass',2200,1,.025,.025);}
});
window.addEventListener('beforeunload',e=>{if(studio.recorder){e.preventDefault();e.returnValue='';}});
renderStudio();accessiblePan();
