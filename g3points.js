// Happy Day · Grade 3 · Unit 1 — the single 100-point challenge.
// One shared counter for unit1.html (words, listening, picture quiz, clock, grammar)
// and arena.html (Shamousa arena games). Both pages read and show this same total.
window.G3PTS=(function(){
 var GOAL=100;
 function rd(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return{}}}
 function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 function arenaPts(){var a=rd('g3arena');return Math.min(100,a.pts||0)}
 function info(){
  var S=rd('happyday-g3u1-v1');var secDone=0;
  (window.SEC||[]).forEach(function(s){if(S.sec&&S.sec[s.id])secDone++});
  var b=S.best||{};var gram=0;var g=rd('g3gram');
  ['have','dont','when','time'].forEach(function(k){if(g[k]===6)gram++});
  var parts={
   words:secDone*6,
   listen:Math.min(10,b.listen||0),
   pics:Math.min(20,S.picPts||0),
   time:Math.min(16,(b.time||0)*2),
   gram:Math.min(4,gram),
   arena:Math.round(arenaPts()/5)
  };
  var total=parts.words+parts.listen+parts.pics+parts.time+parts.gram+parts.arena;
  return {parts:parts,total:Math.min(GOAL,total),goal:GOAL};
 }
 function resetAll(){
  var S=rd('happyday-g3u1-v1');S.stars={};S.sec={};S.best={};S.picPts=0;wr('happyday-g3u1-v1',S);
  var A=rd('g3arena');A.pts=0;wr('g3arena',A);
  try{localStorage.removeItem('g3gram')}catch(e){}
 }
 return {goal:GOAL,info:info,total:function(){return info().total},resetAll:resetAll};
})();
