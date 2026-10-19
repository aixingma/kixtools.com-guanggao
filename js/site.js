/* ============================================================
   全站统一注入配置（统计代码）
   ------------------------------------------------------------
   ★ 你只需要修改这一个文件，全站所有页面（含各语言版）自动生效 ★
   ============================================================ */

var SNIPPETS = [
  /* ---------- Umami 统计（已启用）---------- */
  `<script defer src="https://umami.aixmb.cn/script.js" data-website-id="7f0169c5-4b01-46de-b6b6-9b73c4075e5b"></script>`,
];

/* ============================================================
   以下为注入逻辑，无需修改
   ============================================================ */
(function () {
  function injectSnippet(raw) {
    try {
      var doc = new DOMParser().parseFromString(raw, 'text/html');
      var nodes = doc.querySelectorAll('script, link, meta');
      for (var i = 0; i < nodes.length; i++) {
        var old = nodes[i];
        if (old.tagName === 'SCRIPT') {
          var s = document.createElement('script');
          for (var j = 0; j < old.attributes.length; j++) {
            s.setAttribute(old.attributes[j].name, old.attributes[j].value);
          }
          if (!old.src) s.text = old.textContent;
          document.head.appendChild(s);
        } else {
          document.head.appendChild(old.cloneNode(true));
        }
      }
    } catch (e) { /* 忽略单条配置错误，不影响其他代码 */ }
  }
  for (var i = 0; i < SNIPPETS.length; i++) {
    if (SNIPPETS[i] && SNIPPETS[i].indexOf('<') !== -1) injectSnippet(SNIPPETS[i]);
  }
})();

/* ============================================================
   Cookie 同意横幅（AdSense 合规要求）
   ------------------------------------------------------------
   player.html 不加载本文件，天然不显示。
   按页面语言显示文案，Accept/Decline 状态存 localStorage。
   ============================================================ */
(function () {
  var COOKIE_KEY = 'm3u8lab_cookie_consent';
  var accepted = localStorage.getItem(COOKIE_KEY);
  if (accepted === 'accepted' || accepted === 'declined') return;

  var lang = (document.documentElement.lang || 'zh').slice(0, 2).toLowerCase();
  var TEXT = {
    zh: {
      msg: '本网站使用 Cookie 来改善体验、分析流量并显示相关内容。继续使用本站即表示您同意我们的 Cookie 政策。',
      accept: '同意',
      decline: '拒绝',
      policy: '隐私政策'
    },
    en: {
      msg: 'This site uses cookies to improve your experience, analyze traffic, and show relevant content. By continuing you agree to our Cookie Policy.',
      accept: 'Accept',
      decline: 'Decline',
      policy: 'Privacy Policy'
    },
    pt: {
      msg: 'Este site usa cookies para melhorar sua experiência, analisar o tráfego e mostrar conteúdo relevante. Ao continuar, você concorda com nossa Política de Cookies.',
      accept: 'Aceitar',
      decline: 'Recusar',
      policy: 'Política de Privacidade'
    },
    ja: {
      msg: 'このサイトでは、体験の向上、トラフィックの分析、関連コンテンツの表示のために Cookie を使用しています。使用を続けることで、Cookie ポリシーに同意したものとみなされます。',
      accept: '同意する',
      decline: '拒否する',
      policy: 'プライバシーポリシー'
    },
    ko: {
      msg: '이 사이트는 환경 개선, 트래픽 분석, 관련 콘텐츠 표시를 위해 쿠키를 사용합니다. 계속 사용하면 쿠키 정책에 동의하는 것으로 간주됩니다.',
      accept: '동의',
      decline: '거부',
      policy: '개인정보 처리방침'
    }
  };
  var t = TEXT[lang] || TEXT.zh;

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML =
    '<p>' + t.msg + ' <a href="/privacy.html">' + t.policy + '</a></p>' +
    '<div class="cb-actions">' +
    '<button class="decline" type="button">' + t.decline + '</button>' +
    '<button class="accept" type="button">' + t.accept + '</button>' +
    '</div>';

  function hideAndRemember(val) {
    localStorage.setItem(COOKIE_KEY, val);
    banner.classList.add('hidden');
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
  }
  banner.querySelector('.accept').addEventListener('click', function () { hideAndRemember('accepted'); });
  banner.querySelector('.decline').addEventListener('click', function () { hideAndRemember('declined'); });

  document.body.appendChild(banner);
})();

/* ============================================================
   代码块复制按钮（自动为全站所有 <pre> 添加，按页面语言显示文案）
   ============================================================ */
(function () {
  var L = {
    zh: ['复制', '已复制'],
    en: ['Copy', 'Copied'],
    pt: ['Copiar', 'Copiado'],
    ja: ['コピー', 'コピーしました'],
    ko: ['복사', '복사됨']
  };
  var lang = (document.documentElement.lang || 'zh').slice(0, 2).toLowerCase();
  var t = L[lang] || L.zh;

  function legacyCopy(str) {
    var ta = document.createElement('textarea');
    ta.value = str;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    return ok;
  }

  var pres = document.querySelectorAll('pre');
  for (var i = 0; i < pres.length; i++) {
    (function (pre) {
      var text = pre.textContent;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = t[0];
      btn.addEventListener('click', function () {
        var settled = false;
        function feedback() {
          if (settled) return;
          settled = true;
          btn.textContent = t[1];
          btn.classList.add('ok');
          setTimeout(function () { btn.textContent = t[0]; btn.classList.remove('ok'); }, 1600);
        }
        function fallback() { legacyCopy(text); feedback(); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(feedback, fallback);
          setTimeout(function () { if (!settled) fallback(); }, 600);
        } else {
          fallback();
        }
      });
      pre.appendChild(btn);
    })(pres[i]);
  }
})();
