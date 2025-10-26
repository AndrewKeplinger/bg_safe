var wideMin = 1.333;
var portMax = .6;
var tallScaleMax = .701;
var tallMax = .75;
var squareMax = 1.20;
var tenEighty = 1.7777;

window.__utils = new window.BlitTools();
window.__snds = new window.myNameSpace.BlitSounds();
window.__localsaver = new window.BlitSaver();
window.__input = new window.BlitInputs();
window.update_queue = [];
window.actives = [];
window.oVARS = oVARS = window.__utils.getQueryString();

//holder for stage size and scale data
window.oSTAGE = oSTAGE = {};
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- stage updater -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var panelList = "levelMessage,pauseGameWindow,titleScreen,instructionPanel,canvas_container,gameUI".split(",");
var panels = {};
for (var idx = 0; idx<panelList.length; idx++) {
	panels[panelList[idx]]=document.getElementById(panelList[idx]);
}

//doInitResizer();
//doWindowResize();
function doInitResizer() {

	var resizer = document.createElement("div");
	resizer.id = "resizer";
	resizer.w = null;
	resizer.h = null;
	resizer.keep = true;
	
	resizer.doUpdate = function () {
	    var e = document.body.offsetWidth,
        g = document.body.offsetHeight;
		oSTAGE.is_landscape = 0;//e >= g ? !0 : !1;
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
function doWindowResize() {


	oSTAGE.is_landscape = false;
	oSTAGE.scale = Math.min(Infinity, (Math.min(window.innerHeight / 1120 , window.innerWidth / 644)));

	oSTAGE.scale_inv = (1.0 / oSTAGE.scale);
	oSTAGE.screen_width = Math.ceil(window.innerWidth);
	oSTAGE.screen_height = Math.ceil(window.innerHeight);
	oSTAGE.window_width = Math.ceil(window.innerWidth * oSTAGE.scale_inv);
	oSTAGE.window_height = Math.ceil(window.innerHeight * oSTAGE.scale_inv);
	oSTAGE.wrapper_width = Math.ceil(window.innerWidth * oSTAGE.scale_inv);
	oSTAGE.wrapper_height = Math.ceil(window.innerHeight * oSTAGE.scale_inv);
	//console.log(oSTAGE.screen_width+"  "+oSTAGE.screen_height+" | "+oSTAGE.window_width+"  "+oSTAGE.window_height+" | "+oSTAGE.wrapper_width+"  "+oSTAGE.wrapper_height );
	oSTAGE.wrapper_ratio = oSTAGE.wrapper_height / oSTAGE.wrapper_width;

	oSTAGE.physical_ppi = window.__utils.getPPI();
	oSTAGE.ppi_scale = 1;//oSTAGE.physical_ppi / 96;

	//scale the screen div
	
	var screen_div = document.getElementById("div_screens");
	screen_div.style.transform = screen_div.style.webkitTransform = "scale(" + oSTAGE.scale + "," + oSTAGE.scale + ")";
	screen_div.style.width = Math.ceil(oSTAGE.wrapper_width) + "px";
	screen_div.style.height = Math.ceil(oSTAGE.wrapper_height) + "px";
	
	var column_x = oSTAGE.wrapper_width * 0.5;
	var clientWidth = oSTAGE.scale * 644;
	var left_edge = (window.innerWidth - (644*oSTAGE.scale))*0.5*oSTAGE.scale_inv;
	//console.log(left_edge);
	for (var idx = 0; idx<panelList.length; idx++) {
		panels[panelList[idx]].style.left = left_edge+"px";//((column_x - ((panels[panelList[idx]].clientWidth * 0.5)-322 ) | 0)) + "px";
	}


}
/*"loadingMessage","loadingPrompt",*/
var locationsInited = false;

var gridOff = 3;
var gridScale = {
	cX: -0.2,
	cY: 0.2,
	sX: 1.5,
	sY: 1.2
};

var stagePortrait = {
	id:"portrait",
	portrait: true,
	wide: false,
	cameraWidth: 6,
	cameraZ:-60,
	cameraY:7,
	gameUIWidth: 6,
	gameUIHeight: 6,
	width: 644, 	//1200/2,
	height: 1120,	//1920/2,
	particleScale: 0.3,
	slingH:0,
	ratio: 1.25,	//1920 / 1200,
	invRatio: 0.75 	//1200 / 1920
};

//Animation status
var animatorTimeout = 0;
var currentAnimation = {};

var lastUpdate = Date.now();
var celebrating = false;
var lightSpotObj;
var resizeIteration = 0;
// Generate Hearts, all open


function setCanvasSize() {
	window.scrollTo(0, 0);
}
setCanvasSize();

 
var lastScaleRatio = 1;

function triggerGameOver() {
	console.log("triggerGameOver");
	//setCanvasSize();
	changeGameState(5);
	animationStartTime = Date.now();
}
var fadeoutLoaderTime = -1;
function fadeoutLoader(progress) {
	if (progress==1) fadeoutLoaderTime=Date.now();
	progress = Math.max(0,Math.min(0.99, 1-(Date.now()-fadeoutLoaderTime)/1000.0));
	loadingScreen.style.opacity= progress;
	if (progress>0) {
		setTimeout(fadeoutLoader,25,progress);
	} else {
		loadingScreen.style.visibility= "hidden";
		loadingScreen.style.display = "none";	
	}
}

function changeGameState(tState) {
	var tDiv;
	lastUpdate = Date.now();
	gameState = tState;
	var msgBox = document.getElementById("levelMessage");
	switch (gameState) {
		case 0: // LoadingScreen
			
			fadeoutLoader(1);
			tDiv = document.getElementById("pauseGameWindow").style;
			tDiv.visibility = "hidden";
			//tDiv.display = "none";
			tDiv = document.getElementById("levelMessage").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			tDiv = document.getElementById("titleScreen").style;
			tDiv.visibility = "visible";
			tDiv.display = "block";			
			tDiv = document.getElementById("instructionPanel").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			tDiv = document.getElementById("gameUI").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			
			
			
			
			break;
		case 1: //Title Screen
			var Title_bar=document.getElementById("film_logo_block");
			var title_background=document.getElementById("title_background");
			var character=document.getElementById("character_title");
			var character_mid=document.getElementById("character_title_mid");
			var run_Title=document.getElementById("game_logo");
			var b_play=document.getElementById("b_play");
			var b_instructions=document.getElementById("b_instructions");
			
			//Title_bar.style.transform = "translateX(" + (oSTAGE.wrapper_width - Title_bar.offsetLeft) + "px)";
			title_background.style.opacity = "translateX(" + (oSTAGE.wrapper_width - Title_bar.offsetLeft) + "px)";
			character.style.transform = "scale(0.001)";
			character_mid.style.transform = "scale(0.001)";
			run_Title.style.transform = "translateX(" + (oSTAGE.wrapper_width - run_Title.offsetLeft) + "px)";
			b_play.style.transform = "translateY(" + (oSTAGE.wrapper_height - b_play.offsetTop) + "px)";
			b_instructions.style.transform = "translateY(" + (oSTAGE.wrapper_height - b_instructions.offsetTop) + "px)";

			var delay = 0.5;
			//TweenLite.to(Title_bar, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
			TweenLite.to(title_background, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: 0});
			TweenLite.to(run_Title, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});

			delay += .2;
			TweenLite.to(character, 1.0, {transform:"scale(1)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});// , ease: Elastic.easeOut.config(1.0, .8)
			delay += 0.2;
			TweenLite.to(character_mid, 1.0, {transform:"scale(1)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});//, ease: Elastic.easeOut.config(1.0, .8)
			delay += 1.0;
			TweenLite.to(b_play, .75, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
			delay += .25;
			TweenLite.to(b_instructions, .75, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
			if (!music.isReallyPlaying) playMusic("MenuLoop");
			curScore = 0;
			
			break;
		case 7:
			//Instruction screen
			center_block = document.getElementById("instructionPanel").style;
			center_block.visibility = "visible";
			center_block.display = "block";
			
			tDiv = document.getElementById("titleScreen").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			tDiv = document.getElementById("gameUI").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			break;
		case 2:	
			
			document.getElementById("canvas_container").style.visiblity="visible";
			document.getElementById("canvas_container").style.display="block";
			
			tDiv = document.getElementById("gameUI").style;
			tDiv.visibility = "visible";
			tDiv.display = "block";
			initGame();
			tDiv = document.getElementById("pauseGameWindow").style;
			tDiv.visibility = "hidden";
			//tDiv.display = "none";
			playMusic("Jay_MusicLoop");
			tDiv = document.getElementById("loadingScreen").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			tDiv = document.getElementById("titleScreen").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			tDiv = document.getElementById("levelMessage").style;
			tDiv.visibility = "hidden";
			tDiv = document.getElementById("instructionPanel").style;
			tDiv.visibility = "hidden";
			tDiv = document.getElementById("legal_panel").style;
			tDiv.visibility = "hidden";
			//tDiv.display = "none";

			break;
		case 3: // Transition to next level
			break;
		case 4:
			//roundScores[levelNum - 1] = curScore;
			//console.log("Start Next Level");
			lastUpdate=Date.now();
			
			//document.getElementById("headingText").style.visibility = "hidden";
			//setFieldText("Level_Up_"+levelNum, "headingText");
			break;
		case 5: // Game End screen
			tDiv = document.getElementById("levelMessage").style;
			tDiv.visibility = "visible";
			tDiv.display = "block";
			tDiv = document.getElementById("legal_panel").style;
			tDiv.visibility = "visible";
			playMusic("MenuLoop");
			tDiv = document.getElementById("pauseGameWindow").style;
			tDiv.visibility = "hidden";
			tDiv = document.getElementById("gameUI").style;
			tDiv.visibility = "hidden";
			tDiv.display = "none";
			//tDiv.display = "none";
			playSound("Jay_EndofLevel");
			//console.log("END GAME!");
			
			document.getElementById("recap_SCORE").innerHTML=""+gameScore;
			//document.getElementById("recap_DISTANCE").innerHTML=""+gameDistance;
			
			saveState();
			var reveal_items="recap_RUSS,recap_HANK,recap_date,Title_copy,recap_SCORE_Label,recap_SCORE,recap_PLAY_MORE,recap_INSTRUCTIONS,recap_WATCH_TRAILER".split(",");
			var items={};
			for (var idx=0;idx<reveal_items.length;idx++) {
				items[reveal_items[idx]]=document.getElementById(reveal_items[idx]);
			}
			/*
			for (var idx=0; idx< reveal_items.length; idx++) {
				var item = reveal_items[idx];
				if (items[item].offsetLeft<322) {
					items[item].style.transform = "translateX(" + ( - items[item].offsetWidth-oSTAGE.wrapper_width) + "px)";
					TweenLite.to(items[item], 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeIn.config(0.5,0.5), delay: (idx*0.1)});
				} else {
					items[item].style.transform = "translateX(" + (oSTAGE.wrapper_width - items[item].offsetLeft) + "px)";
					TweenLite.to(items[item], 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeIn.config(0.5,0.5), delay: (idx*0.1)});
				}
			}
			*/
			break;
		case 11:

			break;
	}
}


function advanceGameState(nextState=-1) {
	document.getElementById("headingText").style.visibility="hidden";
	
	playSound("Jay_CoinCollect");
	changeGameState(nextState);
	/*switch (gameState) {
		case 1:
			playSound("Jay_HitPowerup");
			changeGameState(nextState);
			break;
		case 4: // Running to next level
			//alert("Start Next Level");
			changeGameState(2);
			//levelNum++;
			//loadLevel(levelNum);
			gameState = 2;
			//generateEnemies();
			changeGameState(2);
			lastUpdate = Date.now();
			break;
		
	}*/
	return (gameState==2);
}




var soundButtons = ["soundButton","soundButtonoff","soundButton2","soundButton2off","soundButton3","soundButton3off","soundButton4","soundButton4off"];

var tData = localSaver.doGetData("state");
if (tData!==null) {
	//isMuted = !tData.mute;
	bestScore = tData.score;
	bestDistance = tData.distance;
	//muteToggle(true);
}


function muteToggle(dontPlay) {
	
	
	isMuted = !isMuted;
	// hide all of the different mute buttons out there by just changing the opacity?
	var idskip = isMuted?1:0;
	for (var idx = 0; idx<3; idx++) {
		var tObj = document.getElementById(soundButtons[idx*2+idskip]);
		tObj.style.visiblity = "visible";
		tObj.style.opacity = 1;
		tObj = document.getElementById(soundButtons[idx*2+(1-idskip)])
		tObj.style.visiblity = "hidden";
		tObj.style.opacity = 0;
	}
	if (dontPlay) {return;}
	if (music!==undefined){
		if (audioFallback) {
			trace("muteToggle "+isMuted);
			if (isMuted) {
				if (music.isReallyPlaying && sounds[lastMusicPlay]) sounds[lastMusicPlay].pause();
				music.isReallyPlaying = false;
			} else {
				if (!music.isReallyPlaying) {
					playMusic(lastMusicPlay);
					music.isReallyPlaying = true;
				}
			}
		} else {
			if (isMuted) {
				if (music.isReallyPlaying) music.stop();
				music.isReallyPlaying = false;
			} else {
				if (!music.isReallyPlaying) {
					playMusic(lastMusicPlay);
					music.isReallyPlaying = true;
				}
			}
		}
	}
	//saveState();
	
}
/*
if(window.addEventListener && !isIE) {
	window.addEventListener("blur", pauseButtonAction, true);
	window.addEventListener("focus", onFocusAction, true);
} else {
	if (window.attachEvent) {
		//trace("window.attachEvent");
		window.attachEvent("onblur", pauseButtonAction, true);
		window.attachEvent("onfocus", onFocusAction, true);
	} else {
		window.onblur = pauseButtonAction;
		window.onfocus = onFocusAction;
	}
}
*/

setInterval(watchFocus, 100);
var document_blurred = false;
function watchFocus() {
	if (document_blurred) {
		if (document.hasFocus()) {
			onFocusAction();
			document_blurred = false;
		}
	} else {
		
		if (!document.hasFocus()) {
			pauseButtonAction(1);
			document_blurred = true;
		}
	}
}

var resumeMusic = false;
var wasBlurred = false;
function pauseButtonAction(event) {
	

	if (document.hasFocus() && event!=-1) return;
	
	doCloseLegal(true);
	//trace("pauseButtonAction:"+event+"  "+lastMusicPlay);
	if ( lastMusicPlay!="") {
		resumeMusic=true;
		stopMusic();
	}
	if (gameState>1 && gameState!==5 && gameState!==6){
		var tDiv = document.getElementById("pauseGameWindow");
		tDiv.style.visibility = "visible";
		isPaused = true;
	}
}

function onFocusAction() {
	if (resumeMusic && !isPaused) {
		resumeMusic=false;
		playMusic(lastMusicPlay);
	}
	if (gameState==2) {
		
	}
};

function pauseButtonButton(buttonIndex) {
	buttonIndex=1;
	switch (buttonIndex) {
		case 1:
			if (resumeMusic) {
				resumeMusic=false;
				playMusic(lastMusicPlay);
			}
			isPaused = false;
			var tDiv = document.getElementById("pauseGameWindow");
			tDiv.style.visibility = "hidden";
		
			
			break;
		case 2:
			music.isReallyPlaying=false;
			playAgainButtonAction(true);
			
			break;
		case 3:
			//location.assign(oCONFIG.more_url);
			moreGamesButtonAction();
			break;
		case 4:
			//location.assign(oCONFIG.movie_url);
			siteButtonAction();
			break;
	}
}
function getCurrentRotation(el){
  var st = window.getComputedStyle(el, null);
  var tm = st.getPropertyValue("-webkit-transform") ||
           st.getPropertyValue("-moz-transform") ||
           st.getPropertyValue("-ms-transform") ||
           st.getPropertyValue("-o-transform") ||
           st.getPropertyValue("transform") ||
           "none";
  if (tm != "none") {
    var values = tm.split('(')[1].split(')')[0].split(',');
    /*
    a = values[0];
    b = values[1];
    angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
    */
    //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
    var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
    return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
  }
  return 0;
}



