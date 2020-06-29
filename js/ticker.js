// This CasparCG template is made for Svenska YLE by Niclas Hallgren 2018

// Template opacity
var maxOpacity = 1;

function play() {
  // Wait 40ms to load fonts before executing play command
  function delayed(){
    autoFetchFlockler();
    $( "#main" ).fadeTo(500, maxOpacity);
  }
  setTimeout(delayed, 400);
}

function stop() {
  // Fade out everything on stop
  $( "#main" ).fadeTo(500, 0, function() {
    $("#webTicker").webTicker('stop');
  });
}

function next() {
  // The next function has no functionality in this template
}

function update(str) {
  // This function is executed every time the tempalte is played or updated
  var data = "";
  $( ".ticker_bg" ).css({"visibility": "hidden"});
  // Check if user input is empty
  if (str != "" || str != "<templateData></templateData>") {
    try {
      // Input JSON, parse to data variable
      data = JSON.parse(str);
    } catch (e) {
      data = "";
      // Input not JSON
    }
  }
  // If data not JSON, do nothing
  if (data!="") {
    if ((data.f2 == "" || typeof data.f2 == 'undefined') && (typeof data.f0 == 'undefined' || data.f0 == "" || data.f0 == 0)) {
      $( ".ticker_bg" ).css({"visibility": "hidden"});
    } else {
      $( ".ticker_bg" ).css({"visibility": "visible"});
    }

    if (data.f1 != "" && typeof data.f1 != 'undefined') {
      var f1 = document.getElementById('f1_text');
      if (f1.innerHTML == "") {
        $(" .f1_bg ").css({"display": "block"});
        $( ".f1_bg" ).css({"visibility": "visible"});
        f1.innerHTML = f1Last = data.f1.trim();
        $( "#f1_bg" ).fadeTo( 250, maxOpacity );
      } else {
        if (data.f1 != f1Last){
          $( "#f1_bg" ).fadeTo( 250 , 0, function() {
            f1Last = f1.innerHTML = data.f1.trim();
          });
          $( "#f1_bg" ).fadeTo( 250 , maxOpacity );
        } 
      }
    } else {
      $( "#f1_bg" ).fadeTo( 250 , 0, function() {
        $(" .f1_bg ").css({"display": "none"});
      });  
      f1Last = "";
    }

    // Check if f3 is set and is a number (how many articles to show)
    if (typeof data.f3 != 'undefined' && data.f3 != "" && parseInt(data.f3) != 0 && Number.isInteger(parseInt(data.f3.trim()))) {
      f3 = parseInt(data.f3.trim());
    } else {
      // If f3 is not set, use 10 as default
      f3 = 10;
    }

    // Check if f4 is set (if true the template will only show text within <strong></strong> tags)
    if (typeof data.f4 != 'undefined' && data.f4 != "") {
      // If true set as true else as false
      if (data.f4 == "true") {
        f4 = true;
      } else if (data.f4 == "false") {
        f4 = false;
      }
    } else {
      f4 = false;
    }

    // Check if Flockler id is set, is a number and has not changed since last fetch from server
    if (typeof data.f0 != 'undefined' && data.f0 != "" && data.f0 != 0 && Number.isInteger(parseInt(data.f0))) {
      if (flocklerIdLast != data.f0.trim()) {
        // Check if ticker is running, start if not
        if (!tickerOn) {
          startTicker();
          tickerOn = true;
        }
        // Set Flockler id based on user input
        flocklerId = flocklerIdLast = data.f0.trim();
        // Start auto fetch from Flockler
        autoFetchFlockler();
      }
    } else {
      // Flockler id not set, clear old Flockler id and articles
      flocklerId = flocklerIdLast = 0;
      articles = [];
      // Stop auto fetch from Flockler
      intervalRun = false;
      clearInterval(intervalId);
      if (tickerOn) {
        fadeOutTicker('<li>&nbsp;</li>');
      }
    }

    // Is f2 set (user generated ticker content)
    if (data.f2 != "" && typeof data.f2 !== 'undefined') {
      // Is Flockler id 0 or unset
      if (data.f0 == "" || data.f0 == 0 || typeof data.f0 == 'undefined') {
        // Start ticker if not running
        if (!tickerOn) {
          startTicker();
          tickerOn = true;
        }
        f2 = data.f2.trim();
        // Convert user input to ticker data
        convertUserTicker(f2);
      } else {
        // Flockler id is set do not use user ticker input
        f2 = "";
      }
    } else {
      // f2 not set
      f2 = "";
    }

  } else {
    // Template input not JSON or not set at all, do not show anything
    $( ".f1_bg" ).css({"visibility": "hidden"});
    $( ".ticker_bg" ).css({"visibility": "hidden"});
    // Output error to CasparCG log (if set to log by CasparCG settings)
    console.log("Warning! Input data not JSON!")
  }

}