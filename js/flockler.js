// This CasparCG template is made for Svenska YLE by Niclas Hallgren 2018

var data = "";
var flocklerId = flocklerIdLast = 0;
var f1Last = f2 = "";
var f3 = 10;
var f4 = false;
var articles = tmpArticles = lastArticles = [];
var intervalRun = false;
var intervalId;
var tickerOn = false;

function autoFetchFlockler() {
	// Function to fetch articles from Flockler every 20 seconds
    if (flocklerId!=0 && intervalRun == false) {
        intervalId = setInterval(function() {
            fetchFlockler();
        }, 20000);
        fetchFlockler();
        intervalRun = true;
    }
}

function startTicker() {
	// Function to start ticker
    $('#webTicker').webTicker({
        height:'57px',
        speed: '125',
        hoverpause: false,
        duplicate: true
    });
}

function fadeOutTicker(articles) {
	// Function to fade out ticker
    $( "#ticker" ).fadeTo( 250 , 0, function() {
        replaceTicker(articles);
    });
}

function fadeInTicker() {
	// Function to fade in ticker
	$( "#ticker" ).fadeTo( 250 , 1 );
}

function replaceTicker(articles){
	// Function to update ticker content
    $("#webTicker").webTicker('update',
        articles,
        'swap',
        true,
        false
    );
	// If no articles, loop an invisible space
	if (articles != "<li>&nbsp;</li>") {
		setTimeout(fadeInTicker, 250);
	}
    
};

function sanitizeData(str) {
	// Function to sanitize user ticker input
    str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    return str.trim();
}

function sanitizeFlocklerData(str) {
	// Function to sanitize Flockler data (remove time)
    str = str.replace(/<p>/g, "").replace(/<\/p>/g, "");
    pos = str.indexOf("</strong>") + 9;
    //if (pos != -1 && pos < 30) {
        str = str.substring(pos);
    //}
    if (f4) {
		// If f4 is set to true, only output text between <strong></strong> tags
		var count = (str.match(/<strong>/g) || []).length;
        if (count == 0) {
            return null;
        } else {
            var tmpStr = "";
            var lastPos = 0;
            for (i = 0; i < count; i++) {
                var startPos = str.indexOf("<strong>", lastPos) + 8;
                var endPos = str.indexOf("</strong>", lastPos);
                tmpStr = tmpStr + " " + str.substring(startPos, endPos);
                lastPos = endPos + 1;
            }
            return tmpStr.trim();
        }
    } else {
        str = str.replace(/<strong>/g, "").replace(/<\/strong>/g, "");
        return str.trim();
    }
}

function articlesEqual(a1, a2) {
	// Function to check if articles shown are the same as before
    if (a1 === a2) return true;
    if (a1 == null || a2 == null) return false;
    if (a1.length != a2.length) return false;

    for (var i = 0; i < a1.length; ++i) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

function convertUserTicker(str) {
	// Function to convert user ticker data to ticker friendly format
    lastArticles = articles.slice();
    tmpArticles = [];
    articles = [];
    var userData = str.split("|");
    for (i = 0; i < userData.length; i++) {
        tmpArticles.push('<li>' + sanitizeData(userData[i]) + '&nbsp;&nbsp;&vert;&nbsp;</li>');
    }
    // How many articles to show (defaults to 10 if no value set in client (f3))
    articles = tmpArticles.slice(0, f3);
    // If fetched articles not equal to last fetch, update ticker
    if (!articlesEqual(articles, lastArticles)) { 
        fadeOutTicker(articles);
    }
}

function fetchFlockler() {
	// Fetch Flockler data
    lastArticles = articles.slice();
    tmpArticles = [];
    articles = [];
    // Fetch data from Flockler, output error message to CasparCG log if not successful
    $.getJSON('https://api.flockler.com/v1/sites/545/sections/' + flocklerId+ '/articles?fields=id,body')
        .done(function( jsonData) {
            $.each(jsonData, function(key,value) {
                if (key == "articles") {
                    for (j = 0; j < value.length; j++) {
                        var sanitized = sanitizeFlocklerData(value[j].body);
                        if (sanitized != null) {
                            tmpArticles.push('<li>' + sanitized + '&nbsp;&nbsp;&vert;&nbsp;</li>');
                        }
                    }
                }
            });
            // Reverse order, oldest article first
            //tmpArticles = tmpArticles.reverse();
            // How many articles to show (defaults to 10 if no value set in client (f3))
            articles = tmpArticles.slice(0, f3);
            // If fetched articles not equal to last fetch update ticker
            if (!articlesEqual(articles, lastArticles)) { 
                fadeOutTicker(articles);
            }
		})	
        .fail(function( jqxhr, textStatus, error ) {
			// Could not fetch from server, output error to CasparCG log
            var d = Date(Date.now());
            a = d.toString();
            var err = textStatus + ", " + error;
            console.log( a + " Flockler Request Failed: " + err );
        });
}