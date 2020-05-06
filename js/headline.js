// This CasparCG template is made for Svenska YLE by Niclas Hallgren 2018

// Template opacity
var maxOpacity = 1;

function play() {
  // Wait 40ms to load fonts before executing play command
  function delayed(){
    $( "#main" ).fadeTo(500, maxOpacity);
  }
  setTimeout(delayed, 400);
}

function stop() {
  // Fade out everything on stop
  $( "#main" ).fadeTo(500, 0);
}

function next() {
  // The next function has no functionality in this template
}

function update(str) {
  // This function is executed every time the template is played or updated
  var data = "";
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
    // Check if f0 is set by user
    if (data.f0 != "" && typeof data.f0 != 'undefined') {
      var f0 = document.getElementById('f0_text');
      // Check if f1 is visible
      if (f0.innerHTML == "") {
        // Set input and fade in
        $(" .f0_bg ").css({"visibility": "visible"});
        f0.innerHTML = f0Last = data.f0.trim();
        $( "#f0_bg" ).fadeTo( 250, maxOpacity );
      } else {
        // If f1 visible, fade out, replace and fade in
        if (data.f0 != f0Last){
          $( "#f0_bg" ).fadeTo( 250 , 0, function() {
            $(" .f0_bg ").css({"visibility": "visible"});
            f0Last = f0.innerHTML = data.f0.trim();
          });
          $( "#f0_bg" ).fadeTo( 250 , maxOpacity );
        } 
      }
    } else {
      // If f1 is not set fade out and clear
      $( "#f0_bg" ).fadeTo( 250 , 0, function() {
        $( ".f0_bg" ).css({"visibility": "hidden"});
        f0Last = "";
      });
    }

    if (data.f1 != "" && typeof data.f1 != 'undefined') {
      var f1 = document.getElementById('f1_text');
      if (f1.innerHTML == "") {
        $(" .f1_bg ").css({"visibility": "visible"});
        f1.innerHTML = f1Last = data.f1.trim();
        $( "#f1_bg" ).fadeTo( 250, maxOpacity );
      } else {
        if (data.f1 != f1Last){
          $( "#f1_bg" ).fadeTo( 250 , 0, function() {
            $(" .f1_bg ").css({"visibility": "visible"});
            f1Last = f1.innerHTML = data.f1.trim();
          });
          $( "#f1_bg" ).fadeTo( 250 , maxOpacity );
        } 
      }
    } else {
      $( "#f1_bg" ).fadeTo( 250 , 0, function() {
        $( ".f1_bg" ).css({"visibility": "hidden"});
        f1Last = "";
      });
    }
  } else {
    // Template input not JSON or not set at all, do not show anything
    $( ".f0_bg" ).css({"visibility": "hidden"});
    $( ".f1_bg" ).css({"visibility": "hidden"});
    // Output error to CasparCG log (if set to log by CasparCG settings)
    console.log("Warning! Input data not JSON!")
  }

}