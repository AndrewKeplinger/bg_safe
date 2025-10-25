import * as THREE from "./lib/three.module.js"
import {FBXLoader} from "./lib/FBXLoader.js"

var __snds, __utils, __localsaver, __input;
var oSTAGE, oLANG, oLANG_IMAGES, oVARS, oCONFIG, oUSER, oMODELS;
var LOADER, THREELOADER, SCREEN, CONTROLS, LEGAL;
var GAME;

window.THREE=THREE;
window.FBXLoader = FBXLoader;
var images;

window.update_queue = [];
window.actives = [];

var window_in_background = false;
var game_is_active = false;

var date_msg;
var stats;

var loader;
	
window.clock = new THREE.Clock(true);


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- init -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function doFrameLoop() {
	var active= window.actives;
	if (stats) {
		stats.begin();
	}

	//update all actives
	for (var i = 0; i < actives.length; i++) {
		if (actives[i].purge || actives[i].forget) {
			actives.splice(i, 1);
		} else if (actives[i].doUpdate) {
			actives[i].doUpdate();
		} else {
			actives.splice(i, 1);
		}
	}

	if (stats) {
		stats.end();
	}

	requestAnimationFrame(doFrameLoop);
}

function doBrowserAlert() {
  var e = document.getElementById("div_errors"),
    a = !1;
  if (date_playing) {
    var a = !0,
      b = new Date(date_day_before),
      d = new Date(date_week_before),
      c = new Date;
    date_msg = c >= new Date(date_playing) ? window.oLANG.date_msg_4 : c >= b ? window.oLANG.date_msg_3 : c >= d ? window.oLANG.date_msg_2 : window.oLANG.date_msg_1
  }
  b = '<table border="0" width="100%" height="100%" cellpadding="40"><tr><td align="center" valign="middle">' + ('<img border="0" src="' + window.oLANG_IMAGES.logo + '"/><br>');
  a && (b += '<div class="film_logo_date">' + date_msg.value + "</div><p>");
  b += window.oLANG.browser_alert.value + "<p>";
  e.innerHTML = b + '<a href="https://www.google.com/chrome/browser/"><img border="0" src="media/browser_icons/icon_chrome.png" width="64" height="64" alt="Chrome"/></a><a href="http://www.mozilla.org/firefox/new/"><img border="0" src="media/browser_icons/icon_firefox.png" width="64" height="64" alt="Firefox"/></a><a href="http://www.microsoft.com/InternetExplorer"><img border="0" src="media/browser_icons/icon_ie.png" width="64" height="64" alt="Internet Explorer"/></a><a href="https://www.microsoft.com/microsoft-edge"><img border="0" src="media/browser_icons/icon_edge.png" width="64" height="64" alt="Edge"/></a><a href="http://www.apple.com/safari/"><img border="0" src="media/browser_icons/icon_safari.png" width="64" height="64" alt="Safari"/></a><a href="http://www.opera.com/"><img border="0" src="media/browser_icons/icon_opera.png" width="64" height="64" alt="Opera"/></a></td></tr></table>';
  e.style.display = "inline-block"
};

function doInit() {
	/*
	if (window.oCONFIG.debug_stats) {
		stats = new Stats();
		stats.showPanel(0);
		document.body.appendChild(stats.dom);
	}
	*/

	window.__utils = new window.BlitTools();
	window.__snds = new window.myNameSpace.BlitSounds();
	window.__localsaver = new window.BlitSaver();
	window.__input = new window.BlitInputs();

	loader = new createjs.LoadQueue(false);
	loader.installPlugin(createjs.Sound);


	//begin frame loop
	doFrameLoop();

	//parse query string
	window.oVARS = oVARS = window.__utils.getQueryString();

	//holder for stage size and scale data
	window.oSTAGE = oSTAGE = {};

	//set up threejs renderer
	var canvas_game = document.getElementById("canvas_game");
	canvas_game.renderer = new THREE.WebGLRenderer({
		canvas: canvas_game,
		antialias: true,
		alpha: false,
		shadows: false
	});
	canvas_game.renderer.autoClear = false;
	canvas_game.renderer.shadowMap.enabled = true;

	//user
	window.oUSER = window.__localsaver.doGetData("user");
	if (!window.oUSER) {
		window.oUSER = {};
		window.oUSER.is_mute = false;
		window.oUSER.best_score = 0;
		window.__localsaver.doSaveData("user", window.oUSER);
	}
	//window.oUSER = oUSER;

	//begin
	doInitResizer();
	doWindowResize();


	//generalet release date
	var date_release = new Date(date_playing);
	var date_tomorrow = new Date(date_day_before);
	var date_friday = new Date(date_week_before);
	var today_date = new Date();

	if (today_date >= date_release) {
		//now playing
		window.date_msg = window.oLANG.date_msg_4;
	} else if (today_date >= date_tomorrow) {
		//tomorrow
		window.date_msg = window.oLANG.date_msg_3;
	} else if (today_date >= date_friday) {
		//this friday
		window.date_msg = window.oLANG.date_msg_2;
	} else {
		//date
		window.date_msg = window.oLANG.date_msg_1;
	}

	window.__utils.doInitFocusManager(doLoseFocus, doGetFocus);

	//start loading
	doPreloadAssets();

}


function doLoseFocus() {
	trace("doLoseFocus");
	window.__snds.forceMute();
	window_in_background = true;
	if(window.GAME){
      window.GAME.doPause();
    }
}

function doGetFocus() {
	trace("doGetFocus");
	window_in_background = false;
	createjs.Sound.muted = !0;
	if(!window.GAME){
		window.__snds.unforceMute();	  
		if (window.SCREEN && window.SCREEN.doStartMusic) {
			window.SCREEN.doStartMusic();
		}
    }else if(!window.GAME.is_paused){
      window.__snds.unforceMute();
    }
}


function doPreloadAssets() {
	var photo_name;
	//add legal images
	for (var i = 0; i < legal_images.length; i++) {
		var src = legal_images[i].src;
		photo_name = src.substr(src.lastIndexOf("/") + 1);
		assets_preload.manifest.push({
			src: src,
			id: photo_name
		});
	}

	var start_load_time = my_performance.now();
	
    if(window.platform.isMobile){
		assets_preload.manifest.push ({src:"media/instructions.gif", id:"instructions"});
	}else{
		assets_preload.manifest.push ({src:"media/instructions_PC.gif", id:"instructions"});
	}
	
	window.__utils.doLoadAssets(assets_preload);

	LOADER = new Loader(true);
	LOADER.doUpdate = function () {
		var prog = assets_preload.progress;
		this.doUpdateBar(prog);
		if (assets_preload.loaded) {
			this.forget = true;

			var elapsed_load_time = my_performance.now() - start_load_time;
			var delay = Math.max(0, (window.oCONFIG.splash_hold * 1000) - elapsed_load_time);
			window.setTimeout(function () {
				doStart();
				LOADER.doFadeAndDestroy();
			}, delay);

		}
	}
	window.actives.push(LOADER);

}

function trace(a) {
	window.trace(a);
}
function doStart() {

	window.LEGAL = LEGAL = new LegalPanel();
	window.CONTROLS = CONTROLS = new ControlsPanel();
	window.SCREEN = SCREEN = new TitleScreen();//new RecapScreen();//

	//holder remaining assets
	window.__utils.doLoadAssets(assets_additional);

	//load 3d assets
	window.oMODELS = {};
	window.__utils.doLoad3dAssets(assets_threejs, window.oMODELS);

	/*
	  doFinishLoading(function(){
	     trace("--> Loaded!");
	      SCREEN = new GameScreen();
	      GAME = new Game();
	    });
	*/

}


window.doFinishLoading = function(callback) {


	LOADER = new Loader(true);
	LOADER.doUpdate = function () {
		var prog = (assets_additional.progress + assets_threejs.progress) * 0.5;
		this.doUpdateBar(prog); //Missing?
		if (assets_additional.loaded && assets_threejs.loaded) {
			this.purge = true;
			if (callback) {
				callback();
			}
			LOADER.doFadeAndDestroy();
		}
	}
	window.actives.push(LOADER);
}








//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- stage updater -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function doInitResizer() {

	var resizer = document.createElement("div");
	resizer.id = "resizer";
	resizer.w = null;
	resizer.h = null;
	resizer.keep = true;
	resizer.doUpdate = function () {
	    var e = document.body.offsetWidth,
        g = document.body.offsetHeight;
		oSTAGE.is_landscape = e >= g ? !0 : !1;
		oSTAGE.pixel_ratio = window.__utils.getPixelRatio();
		var k = document.getElementById("orientation_overlay");
		k && (_isMobile && "landscape" == window.oCONFIG.game_orientation && !window.oSTAGE.is_landscape ? (k.style.backgroundImage = "url('media/landscape_only.gif')", k.style.display = "block"/*, window.__snds.forceMute()*/) : window.platform.isMobile && "portrait" == window.oCONFIG.game_orientation && window.oSTAGE.is_landscape ? (k.style.backgroundImage = "url('media/portrait_only.gif')", k.style.display = "block"/*, window.__snds.forceMute()*/) : (k.style.display = "none"/*, window.__snds.unforceMute()*/));
		k = 0;
		if (this.w != window.innerWidth || this.h != window.innerHeight) {
			this.w = window.innerWidth;
			this.h = window.innerHeight;
			doWindowResize();
			window.scrollTo(0, 1);
		}
	}

	actives.push(resizer);

	window.addEventListener("orientationchange", function () {
		resizer.w = 0;
		resizer.h = 0;
	});

	//handle hidden window muting
	window.addEventListener("blur", function (evt) {
		window.__snds.forceMute();
		document_blurred = true;
	});

	window.addEventListener("focus", function (evt) {
		window.__snds.unforceMute();
		document_blurred = false;
		resizer.w = 0;
		resizer.h = 0;
	});

}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- window tools  -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function doWindowResize() {

	//measure window
	/*if (window.innerWidth > window.innerHeight) {
		oSTAGE.is_landscape = true;
		oSTAGE.scale = Math.min(Infinity, (Math.min(window.innerHeight / 644, window.innerWidth / 1120)));
	} else {*/
		oSTAGE.is_landscape = false;
		oSTAGE.scale = Math.min(Infinity, (Math.min(window.innerHeight / 1120 , window.innerWidth / 644)));
	//}


	oSTAGE.scale_inv = (1 / oSTAGE.scale);
	oSTAGE.screen_width = Math.ceil(window.innerWidth);
	oSTAGE.screen_height = Math.ceil(window.innerHeight);
	oSTAGE.window_width = Math.ceil(window.innerWidth * oSTAGE.scale_inv);
	oSTAGE.window_height = Math.ceil(window.innerHeight * oSTAGE.scale_inv);
	oSTAGE.wrapper_height = Math.ceil(window.innerHeight * oSTAGE.scale_inv);
	oSTAGE.wrapper_width = Math.ceil(window.innerWidth * oSTAGE.scale_inv);
	oSTAGE.wrapper_ratio = oSTAGE.wrapper_height / oSTAGE.wrapper_width;

	oSTAGE.physical_ppi = window.__utils.getPPI();
	oSTAGE.ppi_scale = oSTAGE.physical_ppi / 96;

	//scale the screen div
	var div_screens = document.getElementById("div_screens");

	div_screens.style.transform = div_screens.style.webkitTransform = "scale(" + oSTAGE.scale + "," + oSTAGE.scale + ")";
	div_screens.style.width = Math.ceil(oSTAGE.wrapper_width) + "px";
	div_screens.style.height = Math.ceil(oSTAGE.wrapper_height) + "px";



	//update queue
	for (var i = window.update_queue.length - 1; i >= 0; i--) {
		if (window.update_queue[i].forget) {
			window.update_queue.splice(i, 1);
		} else if (window.update_queue[i].doResizeUpdate) {
			window.update_queue[i].doResizeUpdate();
		} else {
			window.update_queue.splice(i, 1);
		}
	}

}
export {doInit,doInitResizer,doWindowResize,doFrameLoop,doLoseFocus,doGetFocus,doPreloadAssets,doStart,loader,LOADER,oSTAGE,oVARS};
