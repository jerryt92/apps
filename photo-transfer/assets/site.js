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
