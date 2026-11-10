(function () {
  var button = document.getElementById('toggle-compare');
  var demo = document.getElementById('map-demo');
  if (!button || !demo) return;
  button.addEventListener('click', function () {
    var enabled = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(enabled));
    demo.classList.toggle('single', !enabled);
    var screenshot = document.getElementById('hero-screenshot');
    screenshot.src = enabled ? './assets/map-compare-zh.png' : './assets/map-browse-zh.png';
    screenshot.alt = enabled ? 'MapLab 双图对比 / Map comparison' : 'MapLab 全屏地图 / Full-screen map';
    button.querySelector('.zh-only').textContent = '双图对比：' + (enabled ? '开启' : '关闭');
    button.querySelector('.en-only').textContent = 'Compare: ' + (enabled ? 'on' : 'off');
    demo.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
  });
}());
