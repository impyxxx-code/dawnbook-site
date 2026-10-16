/* Invitation landing page logic. Runs in the browser (copied to site/contribute/contribute.js) and in tests (require). */
(function (root) {
  var MAX = 4000;

  /** Finds the invitation code in the page address. Returns null unless it is exactly our code shape. */
  function extractCode(hash, search) {
    var sources = [String(hash || '').replace(/^#/, ''), String(search || '').replace(/^\?/, '')];
    for (var i = 0; i < sources.length; i++) {
      var parts = sources[i].split('&');
      for (var j = 0; j < parts.length; j++) {
        var kv = parts[j];
        if (kv.slice(0, 2) !== 'c=') continue;
        var v;
        try { v = decodeURIComponent(kv.slice(2)); } catch (e) { return null; }
        v = v.replace(/[\s​-‏‪-‮⁠﻿]/g, '');
        if (v.length > MAX || v.indexOf('lb1.') !== 0 || !/^lb1\.[A-Za-z0-9_-]+$/.test(v)) return null;
        return v;
      }
    }
    return null;
  }

  function appLink(code) { return 'dawnbook://contribute?c=' + code; }

  function init(doc, loc) {
    var code = extractCode(loc.hash, loc.search);
    var ok = doc.getElementById('with-code');
    var bad = doc.getElementById('no-code');
    if (!code) { if (ok) ok.hidden = true; if (bad) bad.hidden = false; return; }
    if (bad) bad.hidden = true;
    if (ok) ok.hidden = false;
    var open = doc.getElementById('open-app');
    if (open) open.setAttribute('href', appLink(code));
    var box = doc.getElementById('code');
    if (box) box.textContent = code;
    var copy = doc.getElementById('copy');
    if (copy) copy.addEventListener('click', function () {
      var done = function () { copy.textContent = 'Copied'; };
      if (root.navigator && root.navigator.clipboard) root.navigator.clipboard.writeText(code).then(done, function () { copy.textContent = 'Select the code and copy it'; });
      else copy.textContent = 'Select the code and copy it';
    });
  }

  var api = { extractCode: extractCode, appLink: appLink, init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DawnbookContribute = api;
})(typeof window !== 'undefined' ? window : globalThis);
