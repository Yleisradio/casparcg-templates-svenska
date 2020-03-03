webcg.on('play', function () {
  const overlay = document.querySelector('.plansch')
  // Swap intro and outro classes
  overlay.style.opacity = 1;

  var clock = document.querySelector('.clock-small')
  function updateTime() {
    var d = new Date();
    clock.textContent = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  updateTime();
  setInterval(updateTime, 1000);
})
webcg.on('stop', function () {
  const overlay = document.querySelector('.plansch')
  // Swap intro and outro classes
  overlay.style.opacity = 0;
})
