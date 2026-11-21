(function () {
  var storageKey = "jerryt92.apps.language";
  var supported = { zh: true, en: true };

  function browserLanguage() {
    var languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || "en"];
    for (var i = 0; i < languages.length; i += 1) {
      var lang = String(languages[i]).toLowerCase();
      if (lang.indexOf("zh") === 0) return "zh";
      if (lang.indexOf("en") === 0) return "en";
    }
    return "en";
  }

  function pageTitle(lang) {
    var zh = document.body.getAttribute("data-title-zh");
    var en = document.body.getAttribute("data-title-en");
    return lang === "zh" ? (zh || en || document.title) : (en || zh || document.title);
  }

  function pageDescription(lang) {
    var zh = document.body.getAttribute("data-desc-zh");
    var en = document.body.getAttribute("data-desc-en");
    return lang === "zh" ? (zh || en) : (en || zh);
  }

  function setMeta(attr, key, value) {
    if (!value) return;
    var tag = document.querySelector("meta[" + attr + "=\"" + key + "\"]");
    if (tag) tag.setAttribute("content", value);
  }

  /* Keep share cards (og:* / description) in the language actually shown. */
  function syncShareMetadata(lang) {
    var desc = pageDescription(lang);
    setMeta("name", "description", desc);
    setMeta("property", "og:title", pageTitle(lang));
    setMeta("property", "og:description", desc);
    setMeta("property", "og:locale", lang === "zh" ? "zh_CN" : "en_US");
    setMeta("property", "og:locale:alternate", lang === "zh" ? "en_US" : "zh_CN");
  }

  function setLanguage(lang, persist) {
    if (!supported[lang]) lang = "en";
    document.body.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-Hans" : "en");
    document.title = pageTitle(lang);
    syncShareMetadata(lang);
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i += 1) {
      var active = buttons[i].getAttribute("data-set-lang") === lang;
      buttons[i].setAttribute("aria-pressed", active ? "true" : "false");
    }
    if (persist) {
      try { localStorage.setItem(storageKey, lang); }
      catch (error) { /* Ignore private browsing storage errors. */ }
    }
  }

  function initialLanguage() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (supported[saved]) return saved;
    } catch (error) { /* Ignore private browsing storage errors. */ }
    return browserLanguage();
  }

  setLanguage(initialLanguage(), false);
  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("[data-set-lang]");
    if (!button) return;
    setLanguage(button.getAttribute("data-set-lang"), true);
  });

  var year = String(new Date().getFullYear());
  var yearNodes = document.querySelectorAll("[data-year]");
  for (var i = 0; i < yearNodes.length; i += 1) {
    yearNodes[i].textContent = year;
  }
}());

/* WeChat's built-in browser silently blocks links to the App Store.
   Inside WeChat, intercept those clicks and show an "open in browser" guide. */
(function () {
  if (!/\b(?:MicroMessenger|WeChat|Weixin)\b/i.test(navigator.userAgent)) return;

  var blockedHref = /^(?:https?:\/\/(?:apps|testflight)\.apple\.com|itms(?:-apps|-services)?:)/i;
  var overlay = null;
  var savedOverflow = "";

  var copy = {
    zh: {
      title: "微信内无法直接打开 App Store",
      steps: [
        "点击屏幕右上角的「···」",
        "选择「在浏览器打开」（Safari）",
        "再次点击 App Store 下载按钮"
      ],
      close: "我知道了",
      dialog: "在浏览器中打开的引导"
    },
    en: {
      title: "The App Store can't open inside WeChat",
      steps: [
        "Tap “···” at the top right corner",
        "Choose “Open in Browser” (Safari)",
        "Tap the App Store download button again"
      ],
      close: "Got it",
      dialog: "Open-in-browser guide"
    }
  };

  function buildOverlay() {
    var style = document.createElement("style");
    style.textContent =
      ".wx-guide{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);" +
      "display:flex;align-items:center;justify-content:center;padding:24px;}" +
      ".wx-guide[hidden]{display:none;}" +
      ".wx-guide-arrow{position:absolute;top:6px;right:18px;width:88px;height:88px;pointer-events:none;}" +
      ".wx-guide-card{background:#fff;color:#1d1d1f;border-radius:16px;max-width:320px;width:100%;" +
      "padding:24px 22px;box-shadow:0 12px 40px rgba(0,0,0,.35);font-size:15px;line-height:1.6;" +
      "font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Helvetica Neue',sans-serif;}" +
      ".wx-guide-title{margin:0 0 12px;font-size:17px;font-weight:600;}" +
      ".wx-guide-steps{margin:0 0 18px;padding-left:1.4em;}" +
      ".wx-guide-steps li{margin:4px 0;}" +
      ".wx-guide-close{display:block;width:100%;padding:10px 0;border:0;border-radius:10px;" +
      "background:#0071e3;color:#fff;font-size:16px;font-weight:600;cursor:pointer;}" +
      "@media (prefers-color-scheme:dark){.wx-guide-card{background:#1c1c1e;color:#f5f5f7;}}";
    document.head.appendChild(style);

    overlay = document.createElement("div");
    overlay.className = "wx-guide";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.hidden = true;
    overlay.innerHTML =
      '<svg class="wx-guide-arrow" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M16 92 C 22 48, 46 26, 82 18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M84 16 L58 12 M84 16 L70 38" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>' +
      "</svg>" +
      '<div class="wx-guide-card">' +
      '<p class="wx-guide-title"></p>' +
      '<ol class="wx-guide-steps"><li></li><li></li><li></li></ol>' +
      '<button type="button" class="wx-guide-close"></button>' +
      "</div>";
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target.closest(".wx-guide-close")) hide();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !overlay.hidden) hide();
    });
  }

  function show() {
    if (!overlay) buildOverlay();
    var lang = document.body.getAttribute("data-lang") === "en" ? "en" : "zh";
    var text = copy[lang];
    overlay.setAttribute("aria-label", text.dialog);
    overlay.querySelector(".wx-guide-title").textContent = text.title;
    var items = overlay.querySelectorAll(".wx-guide-steps li");
    for (var i = 0; i < items.length; i += 1) items[i].textContent = text.steps[i];
    overlay.querySelector(".wx-guide-close").textContent = text.close;
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlay.hidden = false;
    overlay.querySelector(".wx-guide-close").focus();
  }

  function hide() {
    overlay.hidden = true;
    document.body.style.overflow = savedOverflow;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    if (!blockedHref.test(link.getAttribute("href") || "")) return;
    event.preventDefault();
    show();
  });
}());
