/* Arabic/English grammar typography: phrases across inline tags on own lines; isolate single terms. */
(function () {
  'use strict';
  var arabic = /[\u0600-\u06ff]/;
  var english = /[A-Za-z]/;
  var runs = /[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*(?:(?:[ \t]+|[,;:!?\.][ \t]+)[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*)*(?:[.!?](?=\s|$))?/g;

  // Match visible English across existing bold/colour tags without flattening them.
  function joinInlinePhrases(root) {
    var candidates = [];
    if (root.nodeType === 1 && root.matches('p,li,small,summary,label,h2,h3,h4,.gar,.rule,.gea,.fb,.ar')) candidates.push(root);
    if (root.querySelectorAll) candidates = candidates.concat(Array.from(root.querySelectorAll('p,li,small,summary,label,h2,h3,h4,.gar,.rule,.gea,.fb,.ar')));
    candidates.reverse().forEach(function (block) {
      if (!arabic.test(block.textContent) || !english.test(block.textContent) || block.closest('script,style,bdi,pre,code') || block.querySelector('div,p,li,section,article')) return;
      var walk = document.createTreeWalker(block, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT), entries = [], flat = '', n;
      while ((n = walk.nextNode())) {
        if (n.nodeType === 1 && (n.tagName === 'BR' || n.classList.contains('grammar-en-sentence'))) flat += '\n';
        if (n.nodeType !== 3) continue;
        if (n.parentElement.closest('.grammar-en-sentence,script,style')) { flat += '\n'; continue; }
        entries.push({node:n,start:flat.length,end:flat.length+n.data.length}); flat += n.data;
      }
      var expression = /[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*(?:(?:[ \t]+|[,;:!?\.][ \t]+|[ \t]*[\/+][ \t]*)[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*)*(?:[.!?](?=\s|$))?/g;
      var matches = [], match;
      while ((match = expression.exec(flat))) if (match[0].trim().split(/\s+/).length >= 2) matches.push({start:match.index,end:match.index+match[0].length});
      matches.reverse().forEach(function (m) {
        var first = entries.find(function(e){return e.start <= m.start && e.end > m.start;});
        var last = entries.find(function(e){return e.start < m.end && e.end >= m.end;});
        if (!first || !last || !first.node.isConnected || !last.node.isConnected) return;
        var range = document.createRange(); range.setStart(first.node,m.start-first.start); range.setEnd(last.node,m.end-last.start);
        var wrap = document.createElement('bdi'); wrap.dir='ltr'; wrap.lang='en'; wrap.className='grammar-en grammar-en-sentence'; wrap.appendChild(range.extractContents()); range.insertNode(wrap);
      });
    });
  }

  function format(root) {
    joinInlinePhrases(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var texts = [], node;
    while ((node = walker.nextNode())) {
      var p = node.parentElement;
      if (!p || p.closest('script,style,noscript,textarea,input,select,option,bdi,code,pre,[contenteditable]')) continue;
      if (arabic.test(node.data) && english.test(node.data)) texts.push(node);
    }
    texts.forEach(function (text) {
      var p = text.parentElement;
      if (!p || !text.isConnected) return;
      var fragment = document.createDocumentFragment(), last = 0;
      text.data.replace(runs, function (word, index) {
        fragment.appendChild(document.createTextNode(text.data.slice(last, index)));
        var bdi = document.createElement('bdi');
        bdi.dir = 'ltr'; bdi.lang = 'en'; bdi.className = 'grammar-en'; if (word.trim().split(/\s+/).length >= 2 || /[.!?]$/.test(word)) bdi.classList.add('grammar-en-sentence'); bdi.textContent = word;
        fragment.appendChild(bdi); last = index + word.length;
        return word;
      });
      fragment.appendChild(document.createTextNode(text.data.slice(last)));
      // Arabic prose needs an RTL base as well as isolated English terms.
      if (p.matches('p,li,small,summary,label,h2,h3,h4,.ar,.gar,.rule,.gea,.fb') ||
          (p.matches('div,span') && p.childElementCount === 0)) {
        p.dir = 'rtl';
        p.classList.add('grammar-mixed');
      }
      text.replaceWith(fragment);
    });
  }
  var style = document.createElement('style');
  style.textContent = 'bdi.grammar-en{direction:ltr;unicode-bidi:isolate;font-family:Arial,sans-serif;overflow-wrap:break-word}bdi.grammar-en-sentence{display:block;text-align:left;margin:.3em 0;line-height:1.7}.grammar-mixed{unicode-bidi:isolate;line-height:1.9}.grammar-rule-row{display:block;direction:rtl;text-align:right;margin:.35em 0}.grammar-form-row{display:block;direction:ltr;unicode-bidi:isolate;text-align:center;margin:.35em 0;line-height:1.6}';
  document.head.appendChild(style);
  var observer = new MutationObserver(function (changes) {
    observer.disconnect();
    changes.forEach(function (change) {
      if (change.type === 'characterData') { if (change.target.parentElement) format(change.target.parentElement); }
      else change.addedNodes.forEach(function (n) { if (n.nodeType === 1) format(n); else if (n.nodeType === 3 && n.parentElement) format(n.parentElement); });
    });
    observe();
  });
  function observe() { observer.observe(document.body, {childList:true,subtree:true,characterData:true}); }
  format(document.body); observe();
})();
