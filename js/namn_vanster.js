webcg.on('data', function (data) {
  for (var idCaspar in data) {
    var idTemplate = document.getElementById(idCaspar);
    if (idTemplate != undefined) {
      idTemplate.innerHTML = data[idCaspar].text || data[idCaspar];
    }
  }
})
webcg.on('play', function () {
  const overlay = document.querySelector('.overlay')
  // Swap intro and outro classes
  overlay.classList.add('intro')
  overlay.classList.remove('outro')
})
webcg.on('stop', function () {
  const overlay = document.querySelector('.overlay')
  // Swap intro and outro classes
  overlay.classList.remove('intro')
  overlay.classList.add('outro')
})
