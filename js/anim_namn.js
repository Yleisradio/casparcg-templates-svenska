webcg.on('data', function (data) {
  for (var idCaspar in data) {
    var idTemplate = document.getElementById(idCaspar);
    if (idTemplate != undefined) {
      idTemplate.innerHTML = data[idCaspar].text || data[idCaspar];
    }
  }
})
webcg.on('play', function () {
  const overlay = document.querySelector('.namn')
  // Swap intro and outro classes
  overlay.style.opacity = 1;
})
webcg.on('stop', function () {
  const overlay = document.querySelector('.namn')
  // Swap intro and outro classes
  overlay.style.opacity = 0;
})
