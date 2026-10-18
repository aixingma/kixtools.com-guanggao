/* ============================================================
   全站统一注入配置（统计代码）
   ------------------------------------------------------------
   ★ 你只需要修改这一个文件，全站所有页面（含各语言版）自动生效 ★

   使用方法：
   把广告平台 / 统计平台给你的整段 <script> 代码，原样粘贴到
   下方 SNIPPETS 数组中（每段代码用反引号 ` 包住，逗号分隔）。
   ============================================================ */

var SNIPPETS = [
  /* ---------- 广告代码（如 Google AdSense）---------- */
  // 示例：把 ca-pub-xxxxxxxx 换成你自己的客户 ID 后，去掉行首 //
  // `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxx" crossorigin="anonymous"></script>`,

  /* ---------- 统计代码（如 Google Analytics / 百度统计 / 51.la）---------- */
  // 示例 Google Analytics：
  // `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>`,
  // `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>`,

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
   广告位（已启用）
   ------------------------------------------------------------
   在页面指定锚点后自动插入广告容器，再加载广告脚本。
   player.html 不加载本文件，天然无广告。
   ============================================================ */
var AD_SCRIPT_SRC = 'https://pl31857358.profitableratecpmnetwork.com/0a44d2f22e81f19d07f5885e7add6eb5/invoke.js';
var AD_CONTAINER_ID = 'container-0a44d2f22e81f19d07f5885e7add6eb5';

(function () {
  /* 锚点优先级：播放器卡片 → 转换卡片 → 文章正文 → hero 区 → 首个内容区 */
  var anchors = [
    '#player .player-card',
    '.convert-wrap .convert-card',
    '.article-wrap',
    '.hero',
    'main .section'
  ];
  var host = null;
  for (var i = 0; i < anchors.length; i++) {
    host = document.querySelector(anchors[i]);
    if (host) break;
  }
  if (!host) return;

  var slot = document.createElement('div');
  slot.className = 'ad-slot';
  slot.id = AD_CONTAINER_ID;
  host.parentNode.insertBefore(slot, host.nextSibling);

  var s = document.createElement('script');
  s.async = true;
  s.setAttribute('data-cfasync', 'false');
  s.src = AD_SCRIPT_SRC;
  document.body.appendChild(s);
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

  // 兜底复制：现代剪贴板 API 在页面未聚焦等场景下可能一直不回调，用同步方案保证可用
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
          // 若剪贴板 API 迟迟不回调（部分浏览器未聚焦时会挂起），600ms 后走同步兜底
          setTimeout(function () { if (!settled) fallback(); }, 600);
        } else {
          fallback();
        }
      });
      pre.appendChild(btn);
    })(pres[i]);
  }
})();
