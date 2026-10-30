/* Arabic/English grammar typography: preserve content, isolate direction. */
(function () {
  'use strict';
  var arabic = /[\u0600-\u06ff]/;
  var english = /[A-Za-z]/;
  var runs = /[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*(?:[ \t]+[A-Za-z0-9]+(?:[’'\-][A-Za-z0-9]+)*)*(?:[.!?](?=\s|$))?/g;
  function format(root) {
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
        bdi.dir = 'ltr'; bdi.lang = 'en'; bdi.className = 'grammar-en'; bdi.textContent = word;
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
  style.textContent = 'bdi.grammar-en{direction:ltr;unicode-bidi:isolate;font-family:Arial,sans-serif;overflow-wrap:break-word}.grammar-mixed{unicode-bidi:plaintext;line-height:1.9}.grammar-rule-row{display:block;direction:rtl;text-align:right;margin:.35em 0}.grammar-form-row{display:block;direction:ltr;unicode-bidi:isolate;text-align:center;margin:.35em 0;line-height:1.6}';
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
