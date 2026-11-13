/* Show the existing unit vocabulary PDF beside the learning content. */
(function(){
 'use strict';
 var script=document.currentScript,config=JSON.parse(script.getAttribute('data-vocab-pdfs')||'{}');
 var style=document.createElement('style');
 style.textContent='#vocab-pdf-download{box-sizing:border-box;display:flex;gap:10px;flex-wrap:wrap;clear:both;margin:14px 0 20px;padding:0;direction:rtl}#vocab-pdf-download a{box-sizing:border-box;display:flex;align-items:center;justify-content:center;flex:1 1 220px;min-width:0;min-height:58px;padding:12px 18px;border:2px solid #0b7c80;border-radius:14px;background:#e9f8f6;color:#123b50;text-align:center;text-decoration:none;font:700 20px/1.6 Cairo,Tahoma,Arial,sans-serif;overflow-wrap:anywhere}#vocab-pdf-download a:focus-visible{outline:3px solid #f4a62a;outline-offset:3px}#vocab-pdf-download a:hover{background:#d5f0ec}';
 document.head.appendChild(style);
 var pending=false;
 function currentLinks(){
  if(config.mode==='g1')return document.body.dataset.view==='words'?config.links:[];
  if(config.mode==='g2'){
   if(typeof view==='undefined'||view==='home')return [];
   if(view==='words')return config.links;
   if(view==='unit'&&typeof D!=='undefined'&&typeof unit!=='undefined')return config.links.filter(function(l){return l.id===D.units[unit].id});
   return [];
  }
  if(config.mode==='g10'){
   var parts=location.hash.replace(/^#/,'').split('/'),n=Number(parts[0])||1,page=parts[1]||'home';
   return ['words','verbs','unit'].indexOf(page)>=0?config.links.filter(function(l){return l.id===n}):[];
  }
  if(config.mode==='theme1')return ['words','verbs','theme'].indexOf(location.hash.replace(/^#/,''))>=0?config.links:[];
  return config.links;
 }
 function update(){
  pending=false;
  var target=document.querySelector(config.target||'#app')||document.querySelector('main')||document.querySelector('.wrap');
  if(!target)return;
  var links=currentLinks(),old=document.getElementById('vocab-pdf-download'),key=JSON.stringify(links);
  if(!links.length){if(old)old.remove();return}
  if(old&&old.getAttribute('data-links')===key&&old.parentNode===target)return;
  if(old)old.remove();
  var nav=document.createElement('nav');nav.id='vocab-pdf-download';nav.setAttribute('aria-label','تحميل كلمات الوحدة PDF');nav.setAttribute('data-links',key);
  links.forEach(function(l){var a=document.createElement('a');a.href=l.href;a.setAttribute('download','');a.textContent='📄 '+l.label;nav.appendChild(a)});
  target.insertBefore(nav,target.firstChild);
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('hashchange',schedule);update();
})();
