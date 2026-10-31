/* Arabic/English grammar typography: full examples separate; patterns inline and punctuation attached. */
(function () {
  'use strict';
  var arabic = /[\u0600-\u06ff]/;
  var prose = 'p,li,small,summary,label,h2,h3,h4,.gar,.rule,.gea,.fb,.ar,.card .t';
  function sentence(s) {
    var t = s.replace(/[.!?]+$/, '').trim();
    if (!/[.!?]$/.test(s.trim())) return false; // fragments (It is polite to) stay inline with their Arabic
    if (/[\/+←→=]/.test(t) || /^V\d$/i.test(t)) return false;
    if (t.split(/\s+/).length < 3) return false;
    return /^(?:I|you|we|they|he|she|it|this|that|these|those|there|when|what|where|why|how|who|can|could|do|does|did|is|are|was|were|have|has|had|my|your|our|their|the|a|an|if|don't|let's)\b/i.test(t) && /\b(?:am|is|are|was|were|be|been|being|have|has|had|do|does|did|can|could|will|would|should|must|may|might|wish|like|likes|play|plays|go|goes|get|gets|work|works|finished|started|arrived|left|called|took|said|found|bought|saw|spent|lived|used|need|want|eat|read|watch|don't|doesn't|didn't|isn't|aren't|I'm|it's|I'd|he'd)\b/i.test(t);
  }
  function format(root) {
    var blocks=[];
    if(root.nodeType===1 && root.matches(prose)) blocks.push(root);
    if(root.querySelectorAll) blocks=blocks.concat(Array.from(root.querySelectorAll(prose)));
    blocks.reverse().forEach(function(block){
      if(!arabic.test(block.textContent) || block.closest('script,style,noscript,bdi,pre,code,textarea,input,select,option,button,[contenteditable]')) return;
      if(block.matches('.card .t')) {block.dir='rtl';return;}
      if(block.querySelector('div,p,li,section,article,h2,h3,h4,summary')) return;
      block.dir='rtl';block.classList.add('grammar-mixed');
      // Older pages already have partial bdi tags. Rebuild visible runs across them.
      block.querySelectorAll('bdi:not(.grammar-en)').forEach(function(b){b.replaceWith.apply(b,Array.from(b.childNodes));});
      var walk=document.createTreeWalker(block,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT),entries=[],flat='',n;
      while((n=walk.nextNode())){
        if(n.nodeType===1 && (n.tagName==='BR'||n.classList.contains('grammar-en'))) flat+='\n';
        if(n.nodeType!==3) continue;
        if(n.parentElement.closest('.grammar-en,script,style')){flat+='\n';continue;}
        entries.push({node:n,start:flat.length,end:flat.length+n.data.length});flat+=n.data;
      }
      // Periods end a run; slash, plus and arrows belong to the same formula.
      var re=/(?:[A-Za-z]+[ \t]*[←→][ \t]*[A-Za-z]+[.!]?[ \t]*){2,}|[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*(?:(?:[ \t]+|[,;:][ \t]+|[ \t]*[\/+←→=][ \t]*)[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*)*(?:[.!?]+)?/g;
      var matches=[],m;while((m=re.exec(flat)))if(/[A-Za-z]/.test(m[0]))matches.push({start:m.index,end:m.index+m[0].length,text:m[0]});
      matches.reverse().forEach(function(m){
        var first=entries.find(function(e){return e.start<=m.start&&e.end>m.start;});
        var last=entries.find(function(e){return e.start<m.end&&e.end>=m.end;});
        if(!first||!last||!first.node.isConnected||!last.node.isConnected)return;
        var range=document.createRange();range.setStart(first.node,m.start-first.start);range.setEnd(last.node,m.end-last.start);
        var wrap=document.createElement('bdi');wrap.dir='ltr';wrap.lang='en';wrap.className='grammar-en'+(sentence(m.text)?' grammar-en-sentence':'');wrap.appendChild(range.extractContents());
        var tw=document.createTreeWalker(wrap,NodeFilter.SHOW_TEXT),t;while((t=tw.nextNode())) t.data=t.data.replace(/←/g,'→');
        if(/[←→]/.test(m.text) && !wrap.querySelector('b,strong,em,i')){
          var formulas=wrap.textContent.match(/[A-Za-z]+\s*→\s*[A-Za-z]+[.!]?/g);
          if(formulas && formulas.length>1){wrap.textContent='';formulas.forEach(function(f,i){if(i)wrap.appendChild(document.createTextNode(' '));var part=document.createElement('span');part.style.whiteSpace='nowrap';part.textContent=f;wrap.appendChild(part);});}
        }
        range.insertNode(wrap);
      });
      // Do not leave a separator on an otherwise empty line between examples.
      Array.from(block.childNodes).forEach(function(n){if(n.nodeType===3 && /^[\s·•]+$/.test(n.data) && n.previousElementSibling?.classList.contains('grammar-en-sentence') && n.nextElementSibling?.classList.contains('grammar-en-sentence')) n.data='';});
      block.querySelectorAll('bdi.grammar-en:not(.grammar-en-sentence)').forEach(function(b){
        if(!/^(?:V[123]|s|es)[.!?]?$/.test(b.textContent))return;
        var prev=b.previousSibling;
        if(prev && prev.nodeType===3){var m=prev.data.match(/([\u0600-\u06ff]+)\s+$/);if(m){prev.data=prev.data.slice(0,-m[0].length);var group=document.createElement('span');group.style.whiteSpace='nowrap';b.before(group);group.appendChild(document.createTextNode(m[1]+' '));group.appendChild(b);}}
      });
    });
  }
  var style=document.createElement('style');style.textContent='bdi.grammar-en{display:inline-block;direction:ltr;unicode-bidi:isolate;font-family:Arial,sans-serif;overflow-wrap:break-word}bdi.grammar-en-sentence{display:block;text-align:left;margin:.3em 0;line-height:1.7}.grammar-mixed{unicode-bidi:isolate;line-height:1.9}.grammar-rule-row{display:block;direction:rtl;text-align:right;margin:.35em 0}.grammar-form-row{display:block;direction:ltr;unicode-bidi:isolate;text-align:center;margin:.35em 0;line-height:1.6}';document.head.appendChild(style);
  var observer=new MutationObserver(function(changes){observer.disconnect();changes.forEach(function(c){if(c.type==='characterData'){if(c.target.parentElement)format(c.target.parentElement);}else c.addedNodes.forEach(function(n){if(n.nodeType===1)format(n);else if(n.nodeType===3&&n.parentElement)format(n.parentElement);});});observe();});
  function observe(){observer.observe(document.body,{childList:true,subtree:true,characterData:true});}
  format(document.body);observe();
})();
