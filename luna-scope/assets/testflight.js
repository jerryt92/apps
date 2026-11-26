(function () {
  const userAgent = navigator.userAgent;
  const isAppleDevice = /\b(?:Macintosh|iPhone|iPad|iPod)\b/i.test(userAgent);
  const isWeChat = /\b(?:MicroMessenger|WeChat|Weixin)\b/i.test(userAgent);
  const isSafari = !isWeChat && navigator.vendor === "Apple Computer, Inc." &&
    /\bVersion\/[^ ]+.*\bSafari\//.test(userAgent) &&
    !/\b(?:Chrome|Chromium|CriOS|FxiOS|Edg(?:e|A|iOS)?|OPR|OPiOS|DuckDuckGo|YaBrowser|GSA|QQBrowser|Instagram|FBAN|FBAV|Line|Brave)\b/i.test(userAgent) &&
    !("brave" in navigator);

  if (!isAppleDevice) {
    document.querySelector("#device-required").hidden = false;
    return;
  }

  if (isSafari) {
    const join = document.querySelector("#join-beta");
    join.href = join.dataset.invite;
    document.querySelector(".beta-hero").hidden = false;
    return;
  }

  document.querySelector("#wechat-safari-guide").hidden = !isWeChat;
  document.querySelector("#safari-required").hidden = false;

  const manualCopy = document.querySelector("#manual-copy");
  const address = document.querySelector("#beta-address");
  const copied = document.querySelector("#link-copied");
  const copyButton = document.querySelector("#copy-beta-link");

  copyButton.addEventListener("click", async function () {
    const pageUrl = window.location.href;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(pageUrl);
        manualCopy.hidden = true;
        copied.hidden = false;
        return;
      } catch {
        // Try selection-based copy when the Clipboard API rejects the write.
      }
    }

    address.value = pageUrl;
    manualCopy.hidden = false;
    address.focus();
    address.select();
    try {
      copied.hidden = !document.execCommand("copy");
    } catch {
      copied.hidden = true;
    }
    if (!copied.hidden) {
      copyButton.focus();
      manualCopy.hidden = true;
    }
  });
}());
