(function(){
'use strict';
var p=new URLSearchParams(location.search);
if(p.get('l')!=='u3-frequency'&&p.get('rule')!=='frequency')return;
var style=document.createElement('style');
style.textContent='.sv-q:not([data-freq-reveal]) .sv-ans,.sv-q:not([data-freq-reveal]) .sv-answer,.g3-freq-pending .sv-ans,.g3-freq-pending .sv-answer{display:none!important}.sv-q:not([data-freq-reveal]) .sv-opts mark,.g3-freq-pending .sv-opts mark{background:none!important;color:inherit!important;box-shadow:none!important;font-weight:inherit!important;padding:0!important;border:0!important}.g3-freq-reveal{padding:10px 16px;margin:8px 0;border:2px solid #087f8c;border-radius:10px;background:#fff;color:#193b68;font:700 17px Tahoma,Arial,sans-serif;cursor:pointer}.g3-freq-reveal:focus-visible{outline:3px solid #ffb703;outline-offset:3px}';document.head.appendChild(style);
var answerTimes=[18.8,39.7,63.64,84.46,108.2];
function setup(){
 var root=document.getElementById('below')||document.getElementById('solved-recap');
 if(!root)return;
 var cards=[].slice.call(root.querySelectorAll('.sv-q'));
 if(cards.length!==20)return;
 cards.forEach(function(card,i){
  if(card.dataset.freqReveal)return;
  card.dataset.freqReveal='1';card.classList.add('g3-freq-pending');
  var btn=document.createElement('button');btn.type='button';btn.className='g3-freq-reveal';btn.textContent='إظهار الإجابة والسبب';btn.setAttribute('aria-expanded','false');
  var answer=card.querySelector('.sv-ans,.sv-answer');answer.id='freq-answer-'+i;btn.setAttribute('aria-controls',answer.id);
  btn.onclick=function(){var pending=card.classList.toggle('g3-freq-pending');btn.setAttribute('aria-expanded',String(!pending));btn.textContent=pending?'إظهار الإجابة والسبب':'إخفاء الإجابة والسبب'};
  card.insertBefore(btn,answer);
 });
 var audios=[].slice.call(root.querySelectorAll('audio')).filter(function(a){return /solved-audio\/u3-frequency\/02\.mp3/.test(a.getAttribute('src')||'')});
 audios.forEach(function(audio){
  if(audio.dataset.freqTiming)return;audio.dataset.freqTiming='1';
  audio.src='solved-audio/u3-frequency/02.mp3?v=hf20261113';
  function sync(){cards.slice(0,5).forEach(function(card,i){var revealed=audio.currentTime>=answerTimes[i];card.classList.toggle('g3-freq-pending',!revealed);var btn=card.querySelector('.g3-freq-reveal');btn.setAttribute('aria-expanded',String(revealed));btn.textContent=revealed?'إخفاء الإجابة والسبب':'إظهار الإجابة والسبب'})}
  var frame=0;function tick(){sync();if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(tick)}
  audio.addEventListener('play',function(){cancelAnimationFrame(frame);tick()});
  ['timeupdate','seeking','seeked','pause','ended','loadedmetadata'].forEach(function(e){audio.addEventListener(e,sync)});sync();
 });
 var intro=root.querySelector('.panel > p.sv-ar');if(intro&&!intro.dataset.freqIntro){intro.dataset.freqIntro='1';intro.textContent='اقرأ الجملة والاختيارات وفكّر أولًا. في تمارين ١ إلى ٥ تظهر الإجابة مع الصوت بعد مهلة التفكير. ويمكنك إظهار الإجابة والسبب بنفسك من الزر أسفل كل تمرين.'}
}
var queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;setup()})}).observe(document.body,{childList:true,subtree:true});setup();
})();
