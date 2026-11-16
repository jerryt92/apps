(function () {
  var timeline = document.getElementById('demo-timeline');
  var map = document.getElementById('demo-map');
  var shot = document.getElementById('hero-screenshot');
  if (!timeline || !map || !shot) return;

  function show(view) {
    var isMap = view === 'map';
    timeline.setAttribute('aria-pressed', String(!isMap));
    map.setAttribute('aria-pressed', String(isMap));
    shot.src = isMap ? './assets/photo-map-zh.png' : './assets/photo-grid-zh.png';
    shot.alt = isMap
      ? 'PhotoAssistant 照片地图实际运行截图 / PhotoAssistant photo map screenshot'
      : 'PhotoAssistant 时间线浏览实际运行截图 / PhotoAssistant timeline screenshot';
  }

  timeline.addEventListener('click', function () { show('timeline'); });
  map.addEventListener('click', function () { show('map'); });
}());