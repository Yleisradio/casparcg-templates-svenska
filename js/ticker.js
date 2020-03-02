// This CasparCG template is made for Svenska YLE by Niclas Hallgren 2018

// Template opacity
var maxOpacity = 1;

function play() {
	// Wait 40ms to load fonts before executing play command
	function delayed(){
			autoFetchFlockler();
			$( "#main" ).fadeTo( 500 , maxOpacity );
	}
	setTimeout(delayed, 400);
}

function stop() {
	// Fade out everything on stop
	$( "#main" ).fadeTo( 500 , 0, function() {
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
		if ((data.f4 == "" || typeof data.f4 == 'undefined') && (typeof data.f0 == 'undefined' || data.f0 == "" || data.f0 == 0)) {
			$( ".ticker_bg" ).css({"visibility": "hidden"});
		} else {
			$( ".ticker_bg" ).css({"visibility": "visible"});
		}
		
		// Check if f1 is set by user
		if (data.f1 != "" && typeof data.f1 != 'undefined') {
			var f1 = document.getElementById('f1_text');
			// Check if f1 is visible
			if (f1.innerHTML == "") {
				// Set input and fade in
				$(" .f1_bg ").css({"visibility": "visible"});
				f1.innerHTML = f1Last = data.f1.trim();
				$( "#f1_bg" ).fadeTo( 250, maxOpacity );
			} else {
				// If f1 visible, fade out, replace and fade in
				if (data.f1 != f1Last){
					$( "#f1_bg" ).fadeTo( 250 , 0, function() {
						$(" .f1_bg ").css({"visibility": "visible"});
						f1Last = f1.innerHTML = data.f1.trim();
					});
					$( "#f1_bg" ).fadeTo( 250 , maxOpacity );
				} 
			}
		} else {
			// If f1 is not set fade out and clear
			$( "#f1_bg" ).fadeTo( 250 , 0, function() {
				$( ".f1_bg" ).css({"visibility": "hidden"});
				f1Last = "";
			});
		}

		if (data.f2 != "" && typeof data.f2 != 'undefined') {
			var f2 = document.getElementById('f2_text');
			if (f2.innerHTML == "") {
				$(" .f2_bg ").css({"visibility": "visible"});
				f2.innerHTML = f2Last = data.f2.trim();
				$( "#f2_bg" ).fadeTo( 250, maxOpacity );
			} else {
				if (data.f2 != f2Last){
					$( "#f2_bg" ).fadeTo( 250 , 0, function() {
						$(" .f2_bg ").css({"visibility": "visible"});
						f2Last = f2.innerHTML = data.f2.trim();
					});
					$( "#f2_bg" ).fadeTo( 250 , maxOpacity );
				} 
			}
		} else {
			$( "#f2_bg" ).fadeTo( 250 , 0, function() {
				$( ".f2_bg" ).css({"visibility": "hidden"});
				f1Last = "";
			});
		}

		if (data.f3 != "" && typeof data.f3 != 'undefined') {
			var f3 = document.getElementById('f3_text');
			if (f3.innerHTML == "") {
				$(" .f3_bg ").css({"display": "block"});
				$( ".f3_bg" ).css({"visibility": "visible"});
				f3.innerHTML = f3Last = data.f3.trim();
				$( "#f3_bg" ).fadeTo( 250, maxOpacity );
			} else {
				if (data.f3 != f3Last){
					$( "#f3_bg" ).fadeTo( 250 , 0, function() {
						f3Last = f3.innerHTML = data.f3.trim();
					});
					$( "#f3_bg" ).fadeTo( 250 , maxOpacity );
				} 
			}
		} else {
			$( "#f3_bg" ).fadeTo( 250 , 0, function() {
				$(" .f3_bg ").css({"display": "none"});
			});	
			f3Last = "";
		}

		// Check if f5 is set and is a number (how many articles to show)
		if (typeof data.f5 != 'undefined' && data.f5 != "" && parseInt(data.f5) != 0 && Number.isInteger(parseInt(data.f5.trim()))) {
			f5 = parseInt(data.f5.trim());
		} else {
			// If f5 is not set, use 10 as default
			f5 = 10;
		}

		// Check if f6 is set (if true the template will only show text within <strong></strong> tags)
		if (typeof data.f6 != 'undefined' && data.f6 != "") {
			// If true set as true else as false
			if (data.f6 == "true") {
				f6 = true;
			} else if (data.f6 == "false") {
				f6 = false;
			}
		} else {
			f6 = false;
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

		// Is f4 set (user generated ticker content)
		if (data.f4 != "" && typeof data.f4 !== 'undefined') {
			// Is Flockler id 0 or unset
			if (data.f0 == "" || data.f0 == 0 || typeof data.f0 == 'undefined') {
				// Start ticker if not running
				if (!tickerOn) {
					startTicker();
					tickerOn = true;
				}
				f4 = data.f4.trim();
				// Convert user input to ticker data
				convertUserTicker(f4);
			} else {
				// Flockler id is set do not use user ticker input
				f4 = "";
			}
		} else {
			// f4 not set
			f4 = "";
		}

	} else {
		// Template input not JSON or not set at all, do not show anything
		$( ".f1_bg" ).css({"visibility": "hidden"});
		$( ".f2_bg" ).css({"visibility": "hidden"});
		$( ".f3_bg" ).css({"visibility": "hidden"});
		$( ".ticker_bg" ).css({"visibility": "hidden"});
		// Output error to CasparCG log (if set to log by CasparCG settings)
		console.log("Warning! Input data not JSON!")
	}

}