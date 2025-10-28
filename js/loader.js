// JavaScript Document

var nav = navigator.userAgent.toLowerCase();
var isIE = ((nav.indexOf("msie") != -1) || (nav.indexOf("edge") != -1) ||(navigator.appName == "Microsoft Internet Explorer") || ((navigator.appName == "Netscape") && (new RegExp("trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
var isFirefox = nav.indexOf("firefox") != -1;
var IEVersion = getIEVersion();
var isAndroid = nav.indexOf("android") > -1;

function getIEVersion() {
	var msie = nav.toLowerCase().indexOf('msie ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(nav.substring(msie + 5, nav.indexOf('.', msie)), 10);
	}

	var trident = nav.toLowerCase().indexOf('trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = nav.indexOf('rv:');
		return parseInt(nav.substring(rv + 3, nav.indexOf('.', rv)), 10);
	}
	var edge = nav.toLowerCase().indexOf('edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(nav.substring(edge + 5, nav.indexOf('.', edge)), 10);
	}
}

var loaderAnimController = setInterval( animateLoader, 20 );
var loadingPhase = 0;
var loadProgressAmount = 0;
var loadTotal = 10;
var logoReveal=0;

var ringRotation = 0;
var lastLoaderUpdate = Date.now();
var loaderStartTime = Date.now();

var loaderBar = document.getElementById("loader_bar_fill");
var loaderSwitched = false;

function animateLoader() {
	doInitResizer();
	doWindowResize();
	var delta = Date.now()-lastLoaderUpdate;
	lastLoaderUpdate = Date.now();
	ringRotation -= delta/10;
	if (ringRotation>360) ringRotation-=360;
	//loaderRing.style.transform = "rotate("+ringRotation+"deg)";
	//loaderRing.style.webkitTransform = "rotate("+ringRotation+"deg)";
	if (Date.now()>loaderStartTime+2000) {
		//loaderLogoArray[logoReveal].style.display="none";
		//loaderLogoArray[logoReveal].style.visibility="hidden";
		logoReveal++;
		loaderStartTime = Date.now();
		//if (logoReveal>=loaderLogoArray.length) {
		//	logoReveal=0;
		//}
		//console.log(loaderLogoArray[logoReveal]);
		//loaderLogoArray[logoReveal].style.display="inline";
		//loaderLogoArray[logoReveal].style.visibility="visible";		
	}
	if (loadingPhase===1){
		if (loaderSwitched===false ){
			loaderSwitched = true;
			loaderBar = document.getElementById("loader_bar_fill");
		}
	}
	if (loaderBar===undefined) {
		loaderBar = document.getElementById("loader_bar_fill");
	}
	loaderBar.style.width = Math.min(100,Math.floor(100.0*(loadProgressAmount+5)/loadTotal))+"%";
	if (loadingPhase===2) {
		console.log("Clear Load Bar");
		document.getElementById("loader_bar").style.visiblity="hidden";
		clearInterval(loaderAnimController);
	}
}

var ascii = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#";
var numbase = 64;
var numbase2 = 4096;
var numbase3 = 64 * 4096;

function toAscIINum( number) {
	return "" + ascii.substr (Math.floor (number / numbase2), 1) 
		+ ascii.substr (Math.floor ((number / numbase) % numbase), 1) 
		+ ascii.substr (Math.floor(number % numbase), 1);
}
function fromAscIINum( tStr) {
	return (ascii.indexOf (tStr.substr (0, 1)) * numbase2 
			+ ascii.indexOf (tStr.substr (1, 1)) * numbase 
			+ ascii.indexOf (tStr.substr (2, 1)));
}









