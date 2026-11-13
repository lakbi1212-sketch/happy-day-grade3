(function(){
'use strict';
var UN=['','الوحدة الأولى','الوحدة الثانية','الوحدة الثالثة'];
var id=new URLSearchParams(location.search).get('l');
var D=(window.WB_LESSONS||{})[id];
var app=document.getElementById('app');
if(!D){app.innerHTML='<div class="frame"><div class="board"><h1>Lesson not found</h1></div></div>';return}
document.title=D.en+' | Grade 3 whiteboard';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function bdi(s){return esc(s).replace(/[A-Za-z][A-Za-z0-9'\u2019\-\/+_]*(?: [A-Za-z0-9'\u2019\-\/+_]+)*/g,function(m){return '<bdi dir="ltr">'+m+'</bdi>'})}
function markup(s){return esc(s).replace(/\{(b?)(\d+):([^}]*)\}/g,function(_,b,n,t){return b?'<span class="bv bv'+n+'" data-k="b'+n+'">'+t+'</span>':'<span class="hk" data-k="'+n+'">'+t+'</span>'})}
function plain(s){return s.replace(/\{b?\d+:([^}]*)\}/g,'$1').replace(/\s{2,}.*$/,'').replace(/[\u2019]/g,"'").trim()}
var h='<div class="bar"><a class="back" href="grammar.html#u'+D.unit+'" aria-label="شرح القواعد">→ شرح القواعد</a><button id="play">▶ ابدأ الشرح</button><button class="sec" id="rst" title="من البداية">↺</button><select id="spd" aria-label="سرعة الشرح"><option value="0.85" selected>هادئ 0.85×</option><option value="0.75">أبطأ 0.75×</option><option value="1">عادي 1×</option></select></div><div class="progwrap"><input id="prog" type="range" min="0" max="1000" value="0" aria-label="موضع الشرح"><div class="pass" id="pass"></div></div>';
h+='<div class="frame"><div class="board" style="--c:'+D.color+'"><h1>'+esc(D.en)+'</h1><div id="lines">';
D.lines.forEach(function(l,i){var sum=l.charAt(0)==='#';h+='<div class="ln'+(sum?' sum':'')+'" data-i="'+i+'">'+markup(sum?l.slice(1):l)+'</div>'});
h+='</div><p class="note" id="note"></p></div></div><div class="sec2" id="below"></div>';
app.innerHTML=h;
var $=function(q){return document.querySelector(q)};
var lines=[].slice.call(document.querySelectorAll('.ln'));
var clips=[{k:'01',beats:D.p1},{k:'02',beats:D.p2}];
// weights: characters plus a pause for punctuation
function wt(s){return s.length+7*((s.match(/[.،؟!:؛?,]/g)||[]).length)}
clips.forEach(function(c){
  var total=0;c.cum=[];c.beats.forEach(function(b){c.cum.push(total);total+=wt(b.say)+4});c.total=total;
  c.ev=[];
  c.beats.forEach(function(b,bi){
    var start=c.cum[bi]/total,span=(wt(b.say))/total;
    (b.write||[]).forEach(function(li,j,arr){
      var p=plain(D.lines[li].replace(/^#/,'')),pos=b.say.indexOf(p),frac;
      if(pos>=0)frac=(c.cum[bi]+wt(b.say.slice(0,pos)))/total;
      else frac=start+span*(j+0.3)/(arr.length+0.6);
      c.ev.push({f:Math.max(0,frac-0.004),type:'w',i:li});
    });
    var hl=b.hl||[];
    hl.forEach(function(k,j){c.ev.push({f:start+span*(0.15+0.5*j/Math.max(1,hl.length)),type:'h',k:String(k)})});
  });
});
clips.forEach(function(c){var m=(window.WB_MAPS||{})[D.id+'-'+c.k]||[[0,0],[1,1]];
  function tm(f){if(f<=0)return 0;for(var i=1;i<m.length;i++){if(f<=m[i][0]){var a=m[i-1],b=m[i];return b[0]===a[0]?b[1]:a[1]+(b[1]-a[1])*(f-a[0])/(b[0]-a[0])}}return 1}
  c.ev.forEach(function(e){e.f=tm(e.f)})});
var ci=0,audio=new Audio(),virt=null,playing=false,raf=0,fallback=false,dur=[0,0],pace=0.85;
audio.preload='auto';audio.setAttribute('playsinline','');
function src(i){return 'wb-audio/'+D.id+'-'+clips[i].k+'.mp3'}
function curDur(){if(!fallback&&isFinite(audio.duration)&&audio.duration>0)return audio.duration;return clips[ci].total/13/pace}
function curTime(){return fallback?virt.t:audio.currentTime}
function apply(clip,t,D0,full){
  var f=full?2:t/D0;
  clips[clip].ev.forEach(function(e){
    if(e.type==='w'){var el=lines[e.i];if(e.f<=f){if(!el.classList.contains('on'))el.classList.add('on')}else if(el.classList.contains('on')&&!full)el.classList.remove('on')}
    else{[].forEach.call(document.querySelectorAll('[data-k="'+e.k+'"]'),function(el){if(e.f<=f){el.classList.add('on')}else if(!full)el.classList.remove('on')})}
  });
}
function reset(){lines.forEach(function(l){l.classList.remove('on')});[].forEach.call(document.querySelectorAll('.hk,.bv'),function(e){e.classList.remove('on')})}
function render(){
  if(ci===0){reset();apply(0,curTime(),curDur(),false)}
  else{reset();apply(0,0,1,true);apply(1,curTime(),curDur(),false)}
  var d=curDur(),t=curTime();$('#prog').value=Math.round(1000*((ci?0.5:0)+0.5*Math.min(1,t/d)));
  $('#pass').textContent=ci?'المرحلة ٢ من ٢: نلوّن':'المرحلة ١ من ٢: نكتب';
  var shown=lines.filter(function(l){return l.classList.contains('on')});
  if(shown.length&&playing){var last=shown[shown.length-1];var r=last.getBoundingClientRect();if(r.bottom>innerHeight-24||r.top<110)last.scrollIntoView({block:'center',behavior:'smooth'})}
}
function tick(){render();if(playing){if(fallback){var n=performance.now();virt.t+=(n-virt.last)/1000*pace;virt.last=n;if(virt.t>=curDur()){onEnd();return}}raf=requestAnimationFrame(tick)}}
function load(i,t){
  ci=i;fallback=false;audio.pause();audio.src=src(i);audio.playbackRate=pace;audio.preservesPitch=true;
  try{audio.currentTime=t||0}catch(e){}
}
audio.addEventListener('error',function(){fallback=true;virt={t:0,last:performance.now()};$('#note').textContent='الصوت لهذا الدرس قيد الإعداد، الكتابة تعمل بدون صوت.';if(playing){cancelAnimationFrame(raf);tick()}});
audio.addEventListener('ended',onEnd);
function onEnd(){
  if(ci===0){load(1,0);if(playing){audio.play().catch(function(){});cancelAnimationFrame(raf);tick()}}
  else{playing=false;cancelAnimationFrame(raf);$('#play').textContent='▶ أعد الشرح';apply(1,0,1,true);reset();apply(0,0,1,true);apply(1,0,1,true);$('#note').textContent='انتهى الشرح. انزل للأسفل لتشاهد عشرين سؤالًا محلولًا.';$('#prog').value=1000}
}
function play(){
  if(playing){playing=false;audio.pause();cancelAnimationFrame(raf);$('#play').textContent='▶ تابع';return}
  playing=true;$('#play').textContent='❚❚ إيقاف';$('#note').textContent='';
  if(!audio.src||audio.ended&&ci===1){load(0,0)}
  if(fallback){virt.last=performance.now()}else{audio.playbackRate=pace;var p=audio.play();if(p&&p.catch)p.catch(function(){})}
  cancelAnimationFrame(raf);tick();
}
function restart(){playing=false;audio.pause();cancelAnimationFrame(raf);fallback=false;load(0,0);$('#play').textContent='▶ ابدأ الشرح';$('#note').textContent='';render()}
$('#play').onclick=play;$('#rst').onclick=restart;
$('#spd').onchange=function(){pace=parseFloat(this.value);audio.playbackRate=pace};
$('#prog').oninput=function(){
  var v=+this.value/1000,c=v>=0.5?1:0,f=(v-(c?0.5:0))*2;
  var was=playing;if(c!==ci)load(c,0);
  var d=curDur();if(fallback)virt.t=f*d;else{try{audio.currentTime=f*d}catch(e){}}
  render()};
load(0,0);render();
// --- below the board: summary, 20 solved questions, practice
var S=(window.G3_SOLVED||{})[D.rule],below=$('#below'),b='';
var sumLines=D.lines.filter(function(l){return l.charAt(0)==='#'}).map(function(l){return esc(l.slice(1))});
b+='<div class="panel"><h2>الملخص</h2><div class="sumbox">'+sumLines.join('<br>')+'</div></div>';
if(S){
  var prefix='solved-audio/'+(S.unit||'u1')+'-'+D.rule+'/';
  b+='<div class="panel"><h2>عشرون سؤالًا محلولًا</h2><p class="sv-ar">اقرأ الجملة ثم الاختيارات، وشاهد الإجابة الصفراء والسبب. لا يوجد مؤقت، خذ وقتك.</p>';
  S.items.forEach(function(q,i){
    if(i%5===0&&S.audioReady)b+='<h2 style="font-size:17px;margin-top:14px">تمارين '+(i+1)+' إلى '+(i+5)+'</h2><audio controls preload="none" aria-label="شرح شموسة" src="'+prefix+String(2+Math.floor(i/5)).padStart(2,'0')+'.mp3'+(id==='u3-frequency'&&i<5?'?v=hf20261113':'')+'"></audio>';
    b+='<article class="sv-q"><div class="sv-num">تمرين '+(i+1)+'</div><div class="sv-en">'+esc(q[0])+'</div><div class="sv-ar">'+bdi(q[1])+'</div><div class="sv-opts">'+q[2].map(function(o){return o===q[3]?'<mark>'+esc(o)+'</mark>':'<span>'+esc(o)+'</span>'}).join('')+'</div><div class="sv-ans"><b>الإجابة والسبب</b><div class="sv-en">'+esc(q[3])+'</div><div class="sv-ar">'+bdi(q[4])+'</div></div></article>';
  });
  b+='</div>';
}
b+='<div class="panel"><h2>تدرّب بنفسك</h2><div class="btnrow"><a href="unit'+D.unit+'.html?rule='+D.rule+'">تدريب على هذا الدرس</a><a class="alt" href="grammar.html#u'+D.unit+'">كل دروس '+UN[D.unit]+'</a></div></div>';
below.innerHTML=b;
})();
