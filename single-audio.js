/* One voice at a time: starting any audio stops the one already playing;
   pressing the same button again restarts from the beginning (never two overlapping).
   Looping background music is left alone. */
(function(){
  if(window.__singleAudio)return;window.__singleAudio=1;
  var P=window.HTMLMediaElement&&HTMLMediaElement.prototype;if(!P)return;
  var op=P.play,cur=null;
  function stopEl(a){try{a.pause();a.currentTime=0}catch(e){}}
  P.play=function(){
    var a=this;
    try{
      if(!a.loop){
        if(cur&&cur!==a&&!cur.paused&&!cur.ended)stopEl(cur);
        else if(cur===a&&!a.paused&&!a.ended)a.currentTime=0;
        cur=a;
      }
    }catch(e){}
    return op.apply(a,arguments);
  };
  /* audio started from native player controls */
  document.addEventListener('play',function(e){
    var a=e.target;if(!a||a.loop)return;
    try{if(cur&&cur!==a&&!cur.paused&&!cur.ended)stopEl(cur);cur=a}catch(x){}
  },true);
})();
