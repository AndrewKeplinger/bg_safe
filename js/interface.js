// Set up scene, canvas, and camera
//"levelMessageBackground",

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

	doResizeUpdate();

}
function doResizeUpdate() {
	scene.background = new THREE.Color(oCONFIG.back_color);
	var limit_width = 644.0;//Math.min(oSTAGE.screen_width*oSTAGE.scale_inv,oCONFIG.page_land_ratio*oSTAGE.screen_height);
	camera.aspect = 0.575;//limit_width / oSTAGE.screen_height;
	camera.updateProjectionMatrix();

	var wrapper_ratio = (limit_width / 1120);//oSTAGE.screen_height);
	//oGAME.scene.background.repeat = new THREE.Vector2(wrapper_ratio * .5, 1);

	renderer.setSize(limit_width, 1120);
	//oGAME.renderer.setPixelRatio(__utils.getPixelRatio());

	//set camera to fit 20 units witch at 20 units distance (world center)
	var target_width = oCONFIG.portrait_target_width;
	
	//oGAME.camera.position.x = -3;

	var cam_dist = 30;
	var renderer_size = new THREE.Vector2(0,0);
	renderer_size = renderer.getSize(renderer_size);
	var renderer_ratio = renderer_size.width / renderer_size.height;
	var fov = 2 * Math.atan( ( target_width / renderer_ratio ) / ( 2 * cam_dist ) ) * ( 180 / Math.PI ); // in degrees
	if (flyState==1||flyState==2) fov*=1.5;
	var ofov = camera.fov;
	
	camera.fov = ofov*.95 + fov*0.05;
	camera.updateProjectionMatrix();

	var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
	var visible_height = 2 * Math.tan( vFOV / 2 ) * 1; // visible height
	var visible_width = visible_height * renderer_ratio;

	var width_pixel_ratio = visible_width / renderer_size.width;
	var height_pixel_ratio = visible_height / renderer_size.height;
	oSTAGE.pixelRatio = width_pixel_ratio;

	//canvas_game.style.left = ((oSTAGE.wrapper_width - renderer_size.width) * 0.5)+"px";
	//canvas_game.style.left = ((window.innerWidth - renderer_size.width) * 0.5)+"px";

	var scale_y = Math.tan(camera.fov * Math.PI / 180 * 0.5) * cam_dist * 2 ;
	var scale_x = scale_y * camera.aspect;

	//oGAME.camera.position.y = Math.max(0, -(15 - (scale_y * .5))) + 3.5;
	//oGAME.camera.lookAt.y = oGAME.camera.position.y - 3.5;

	renderer.render(scene, camera);
}


var readCSSIds = ["BR:titlePlayText","BR:playAgainButton", "BR:moreGamesButton","TR:siteLinkText","BL:siteLinkText2","BR:playButton","BR:playAgain", "BR:moreGames",
	"BL:levelMessageCharacter", "S:loadingScreen", "S:titleScreen", "S:levelMessage", "C:loadingMessage",
	"S:levelBackground","TR:exitButton2", "TR:soundButton2", "TR:soundButton2off", "TR:soundButton3", "TR:soundButton3off", "C:headingText", 
	"C:loadingBackground", "BL:loadingCharacter", "C:loadingGraphic","TR:endGameText",
	"C:loadingRing", "C:loadingRingCenter1", "C:loadingRingCenter2", "C:loadingRingCenter3", "C:loadingRingCenter4", "C:loadingRingCenter5", "C:loadingRingCenter6",
	"C:loadbarBackground","BR:loadbarBackground2",
	"S:titleBackground",  "TR:titleGameName", "TR:titleDescription", "BR:titleInstructions", "BR:titleInstructionsImage", "BR:titleInstructionsImage_PC", "BL:titleCharacter",
	"TR:exitButton", "TR:soundButton", "TR:advanceGameState", "BL:levelMessage1", "BL:levelMessage2", "BL:levelMessage3",
	"TR:pauseButton","TL:gameScore","TC:gameDistance",//"BC:gamePowerup0","BC:gamePowerup1","BC:gamePowerup2",
	"TL:ninjagoLogo","TL:ninjagoLogo2","BL:ninjagoLogo3","BL:ninjagoLogo4","TL:ninjaLogoText","TL:ninjaLogoText2","BL:ninjaLogoText3","BL:ninjaLogoText4",
	"TR:BestDistanceLabel","TR:BestDistance","TR:BestScore","TR:BestScoreLabel",
	"TR:EndDistanceLabel","TR:EndDistance","TR:EndScore","TR:EndScoreLabel", "BL:siteLink", "BL:siteLink2"
];
/*"loadingMessage","loadingPrompt",*/
var locationsInited = false;

var gridOff = 3;
var gridScale = {
	cX: -0.2,
	cY: 0.2,
	sX: 1.5,
	sY: 1.2
};
var stageWide = {
	id:"wide",
	portrait: false,
	wide: true,
	cameraWidth: 10,
	cameraZ:-30,
	cameraY:0,
	gameUIWidth:10,
	gameUIHeight: 5,
	width: 1920 / 2,
	height: 1080 / 2,
	particleScale: 0.3,
	slingH:-12,
	ratio: 1080.0 / 1920,
	invRatio: 1920.0 / 1080
};
var stageDesktop = {
	id:"desktop",
	portrait: false,
	wide: false,
	cameraWidth: 8,
	cameraZ:-30,
	cameraY:0,
	gameUIWidth:8,
	gameUIHeight: 6,
	width: 960,
	height: 720,
	particleScale: 0.3,
	slingH:-9,
	ratio: 720.0 / 960,
	invRatio: 960.0 / 720
};
var stageSquare = {
	id:"square",
	portrait: true,
	wide: false,
	cameraWidth: 6,
	cameraZ:-40,
	cameraY:2,
	gameUIWidth: 6,
	gameUIHeight: 6,
	width: 800,
	height: 800,
	particleScale: 0.3,
	slingH:-8,
	ratio: 1.0,
	invRatio: 1.0
};
var stageTall = {
	id:"tall",
	portrait: true,
	wide: false,
	cameraWidth: 6,
	cameraZ:-50,
	cameraY:5,
	gameUIWidth: 6,
	gameUIHeight: 6,
	width: 700,
	height: 800,
	slingH:-7,
	particleScale: 0.3,
	ratio: 1.0,
	invRatio: 1.0
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
var animationTimeout = 0;
var animatorTimeout = 0;
var currentAnimation = {};

setStage();

const canvas = document.getElementById("c");
const canvas_container = document.getElementById("canvas_container");
//canvas.style.position = "absolute";
//canvas.width = window.innerWidth;//stage.width;
//canvas.height = window.innerHeight;//stage.height;
var scene = new THREE.Scene();
var cameraWidth = 10;


//camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 2000 );
camera = new THREE.PerspectiveCamera( 60, 1080.0/1920.0, 0.1, 2000 );

//camera = new THREE.OrthographicCamera(-stage.cameraWidth, stage.cameraWidth, stage.cameraWidth * stage.ratio, -stage.cameraWidth * stage.ratio, 0.1, 1000);

camera.up.set(0,1,0);

if (!audioFallback){
	camera.add( listener );
	var soundChanNum = 0;
	var soundList = [];
	for (var idx= 0; idx<4; idx++) {
		soundList.push(new THREE.Audio( listener ));
	}
	var stepSound = new THREE.Audio( listener );


	var music = new THREE.Audio( listener );
	music.hasPlaybackControl = true;
}
camera.position.set(0, 0, -40);
//camera.position.set(0,0,10);

// Point the camera at a given coordinate
camera.lookAt(new THREE.Vector3(0, 0,0)); //camera.rotation.set(.5,0,0);

camera.position.set(stage.slingH, 5, -40);
var canvas_game = document.getElementById("3d_canvas");
renderer = canvas_game.renderer || new THREE.WebGLRenderer({
	canvas: canvas_game,
	antialias: false,
	alpha: true,
	shadows: false,
	fog: true
});

renderer.setSize(644,1120);//window.innerWidth, window.innerHeight);
//renderer.context.disable(renderer.context.DEPTH_TEST);
//document.body.appendChild(renderer.domElement);


var clock = new THREE.Clock();

var lastUpdate = Date.now();
var celebrating = false;
var lightSpotObj;
var resizeIteration = 0;
// Generate Hearts, all open
function hearts() {
	this.objs = [];
	this.objs.push(document.getElementById("gamePowerup0"));
	this.objs.push(document.getElementById("gamePowerup1"));
	this.objs.push(document.getElementById("gamePowerup2"));
	//var tStyle = window.getComputedStyle(img,false);//this.objs[0].currentStyle || 
	//console.log(tStyle);
	this.imageNameOn = "url('Media/UI/UI_PowerUp.png')";//tStyle.backgroundImage;
	this.imageNameOff = "url('Media/UI/UI_PowerUp_Off.png')";//tStyle.backgroundImage.replace(".png","_Off.png");
	//console.log(this.imageNameOn+"  "+this.imageNameOff);
	//this.slashes = [];
	this.curPowerups = 1;
	this.targetPowerups = 3;
	this.timing = -1;
	this.setHearts = function (num) {
		this.targetPowerups = num;
	}

	this.reposition = function(){
		if(gameState!=2){
			for (var idx=0; idx<this.objs.length; idx++ ) {
				var tObj = this.objs[idx];
				tObj.style.left =  "-10000px";
			}
			return;
		}
		const width_size = window.innerHeight* 1080.0/1920.0;
		const centering_left = 322;//(window.innerWidth-width_size)/2;
		var rowScale = (3.0/Math.max(3,this.objs.length));
		var ratio = oSTAGE.scale*rowScale;
		var baseLeft =(1650-rowScale*140*this.objs.length)/2;
		//var vOffset = stage.portrait?-70:-20;
		for (var idx=0; idx<this.objs.length; idx++ ) {
			var tObj = this.objs[idx];
			var tLeft = (baseLeft+rowScale*140*idx); 
			tObj.style.left =  Math.floor((((tLeft + 76)-480)*ratio)-(76*ratio/2))+ "px";
			tObj.style.top = (window.innerHeight-40) + "px";
			tObj.style.width = (152 * ratio) + "px";
			tObj.style.height = (175 * ratio) + "px";
			tObj.style.backgroundSize = (152 * ratio) + "px " + (175 * ratio) + "px";
			this.objs[idx].style.opacity = 1;
			if (idx + 1 <= this.curPowerups) {
				this.objs[idx].style.backgroundImage = this.imageNameOn;//opacity=1;
			} else {
				this.objs[idx].style.backgroundImage = this.imageNameOff;//opacity=.25;
			}
		}

	}
	
	this.usePowerup = function() {
		if (this.targetPowerups>3) {
			var mama = this.objs[this.objs.length-1].parentElement;
			mama.removeChild(this.objs[this.objs.length-1]);
			this.objs.pop();
			this.reposition();
		}
		this.targetPowerups--;
	}
	this.boostPowerup = function() {
		//if (this.targetPowerups<3)
			this.targetPowerups++;
	}
	this.clearPowerups = function() {
		
		for (var idx = 0; idx < this.objs.length; idx++) {
			this.objs[idx].style.opacity = 0;
			if (idx>2) {
				var mama = this.objs[idx].parentElement;
				mama.removeChild(this.objs[idx]);
			}
		}
		this.objs = [];
		for (var idx=0; idx<3; idx++) {
			this.objs.push(document.getElementById("gamePowerup"+idx));
			this.objs[idx].style.backgroundImage = this.imageNameOff;
		}
	}
	
	this.update = function () {
		if (this.targetPowerups != this.curPowerups) {
			var cTime = Date.now() / 1000;
			if (this.timing == -1) {
				this.timing = cTime;
			} else {
				var dTime = cTime - this.timing;
				var losing = this.targetPowerups < this.curPowerups;

				this.curPowerups = this.targetPowerups;

				if (this.curPowerups>this.objs.length) {
					var newObj = document.createElement("gamePowerup"+this.objs.length);
					newObj.className = "gamePowerupClass";
					this.objs[0].parentElement.appendChild(newObj);
					this.objs.push(newObj);
					this.reposition();
				}
				for (var idx = 0; idx <this.objs.length; idx++) {
					if (idx + 1 <= this.curPowerups) {
						this.objs[idx].style.backgroundImage = this.imageNameOn;//.opacity=1;
						//this.slashes[idx].position.set(-100,0,0);
					} else {
						this.objs[idx].style.backgroundImage = this.imageNameOff;//.opacity=.25;
					}
				}
			}
		}
	}
}

function powerup() {
	this.objs = [];
	this.meterObj = undefined;
	this.chargeLevel = 0;
	this.meterShader = undefined;
	this.setMeter = function (obj) {
		this.meterObj = obj;
		this.meterShader = this.meterObj.material;
	}
	this.update = function () {
		if (!celebrating) {
			this.chargeLevel += .001;
			if (this.chargeLevel > 1) this.chargeLevel = 1;
			this.meterShader.uniforms.tLevel.value = this.chargeLevel;
			this.meterShader.needsupdate = true;
		}
		if (this.chargeLevel===1){
			var pulseTime = 3.25+Math.sin(Date.now()/300.0)*.25;
			this.meterObj.scale.set(pulseTime,pulseTime,pulseTime);
			
		}
	}
}

function levelMeter() {
	this.objs = [];
	this.meterObj = undefined;
	this.chargeLevel = 0;
	this.currentLevel = 0;
	this.meterShader = undefined;
	this.meterShader2 = undefined;
	this.setMeter = function (obj, obj2) {
		meterObj = obj;
		this.meterShader = meterObj.material;
		this.meterShader2 = obj2.material;
	}
	this.update = function () {
		var dif = this.currentLevel - this.chargeLevel;
		if (dif !== 0) {
			if (Math.abs(dif) < .02) {
				this.currentLevel = this.chargeLevel;
			} else {
				this.currentLevel -= .02 * dif / Math.abs(dif);
			}
		}
		var tLevel = .1 + .6 * (1 - this.currentLevel);
		if (tLevel > 0.95) tLevel = 1;
		this.meterShader.uniforms.tLevel.value = tLevel;
		this.meterShader2.uniforms.tLevel.value = tLevel;
		this.meterShader.needsupdate = true;
		this.meterShader2.needsupdate = true;
	}
}

function setMessage(msgId) {
	//Look up text in gameLoadData, set values and this display the Message Dialog
}

function norm(val, min, max) {
	return (val-min)/(max-min);
}
function storeLerp( src, dest, val) {
	/*
	src.top = src.top*(1-val) + dest.top*val;
	src.left = src.left*(1-val) + dest.left*val;
	src.width = src.width*(1-val) + dest.width*val;
	src.height = src.height*(1-val) + dest.height*val;
	src.fontSize = src.fontSize*(1-val) + dest.fontSize*val;*/
	return src;
}

function setStage() {
	var winRatio = window.innerWidth/window.innerHeight;
	
	if (heartBar!==undefined) heartBar.reposition();
	var oldStage = (stage!==undefined?stage.id:"Start");
	stage = stagePortrait;
	/*
	if (winRatio>wideMin) {
		stage = stageWide;
	} else if (winRatio<=portMax) { 
		stage = stagePortrait;
	} else if (winRatio<=tallMax) {
		stage = stageTall;
	} else if (winRatio<=squareMax) { //
		stage = stageSquare;
	}else {
		stage = stageDesktop;
	}*/
	return;  //AHK
	var tDiv;
	if (storedLocations===undefined) {
		storedLocations=getGoodlocs();
		if (queryVal===undefined) shiftAudioButtons();
	}
	if ( storedLocations!==undefined) {
		storedLocations.titleCharacter.anchor="BL";
		storedLocations.levelMessageCharacter.anchor="BL";
		
		storedLocations.siteLink={"top":460,"left":0,"width":186,"height":50,"fontSize":16,"anchor":"BL"};
		storedLocations.siteLinkText={textScale:storedLocations.siteLinkText.textScale,"top":474,"left":-10,"width":210,"height":592,"fontSize":20,"anchor":"BL"};
		var endTextTop =92;
		switch (stage.id) {
			case ("square"): 
				//storedLocations.titleInstructionsImage= {"top":139,"left":486,"width":378,"height":192,"fontSize":12,"anchor":"BC"};
				//storedLocations.titleInstructionsImage_PC ={"top":139,"left":486,"width":378,"height":192,"fontSize":12,"anchor":"BC"};
				
				var n = norm(winRatio,tallMax,squareMax);
				var tnr = 0.5476;
				var store = storeLerp({"top":-140,"left":420+80,"width":320,"height":320*tnr,"fontSize":12,"anchor":"BC"},{"top":139,"left":486,"width":378,"height":192,"fontSize":12,"anchor":"BC"},n);
				storedLocations.titleInstructionsImage= store;
				storedLocations.titleInstructionsImage_PC =store;
				
				document.getElementById("titleGameName").style.textAlign = "center";
				document.getElementById("endGameText").style.textAlign = "center";
				document.getElementById("titleDescription").style.textAlign = "center";
				storedLocations.titleGameName = {textScale:storedLocations.titleGameName.textScale,top:100,left:50,width:860,height:135,fontSize:48, "anchor":"TCS"};
				storedLocations.titleDescription = {textScale:storedLocations.titleDescription.textScale,top:170,left:50,width:860,height:135,fontSize:20, "anchor":"TCS"};
				
				//storedLocations.endGameText={"top":92,"left":370,"width":520,"height":90,"fontSize":40,"anchor":"TR"};
				
				storedLocations.pauseButton={"top":460,"left":890,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3={"top":460,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3off={"top":460,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				//storedLocations.siteLink={"top":400,"left":0,"width":216,"height":80,"fontSize":16,"anchor":"BL"};
				//storedLocations.siteLinkText={"top":420,"left":5,"width":210,"height":508,"fontSize":16,"anchor":"BL"};
				
			break;
			case ("tall"): 

				var n = Math.max(0,norm(winRatio,tallScaleMax,tallMax)); 
				var tnr = 0.5476;
				var store = storeLerp({"top":-220,"left":250,"width":460,"height":251,"fontSize":12,"anchor":"BC"},{"top":-140,"left":420+80,"width":320,"height":320*tnr,"fontSize":12,"anchor":"BC"},n);
				storedLocations.titleInstructionsImage= store;
				storedLocations.titleInstructionsImage_PC =store;
				document.getElementById("titleGameName").style.textAlign = "center";
				document.getElementById("endGameText").style.textAlign = "center";
				document.getElementById("titleDescription").style.textAlign = "center";
				storedLocations.titleGameName = {textScale:storedLocations.titleGameName.textScale,top:100,left:50,width:860,height:135,fontSize:44, "anchor":"TCS"};
				storedLocations.titleDescription = {textScale:storedLocations.titleDescription.textScale,top:160,left:50,width:860,height:135,fontSize:16, "anchor":"TCS"};
				
				//storedLocations.endGameText={"top":200,"left":50,"width":860,"height":90,"fontSize":40,"anchor":"TCS"};
				//storedLocations.titleDescription = {top:275,left:50,width:860,height:135,fontSize:24*fontscale, "anchor":"TCS"};
				storedLocations.pauseButton={"top":460,"left":890,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3={"top":460,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3off={"top":460,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				//storedLocations.siteLink={"top":400,"left":0,"width":216,"height":80,"fontSize":16,"anchor":"BL"};
				//storedLocations.siteLinkText={"top":420,"left":5,"width":210,"height":508,"fontSize":16,"anchor":"BL"};
			break;
			case ("portrait"):
			
				storedLocations.titleInstructionsImage= {"top":-190,"left":270,"width":420,"height":230,"fontSize":12,"anchor":"BC"};
				storedLocations.titleInstructionsImage_PC ={"top":-190,"left":270,"width":420,"height":230,"fontSize":12,"anchor":"BC"};
				document.getElementById("titleGameName").style.textAlign = "center";
				document.getElementById("endGameText").style.textAlign = "center";
				document.getElementById("titleDescription").style.textAlign = "center";
				storedLocations.titleGameName = {textScale:storedLocations.titleGameName.textScale,top:100,left:50,width:860,height:135,fontSize:48, "anchor":"TCS"};
				storedLocations.titleDescription = {textScale:storedLocations.titleDescription.textScale,top:180,left:50,width:860,height:135,fontSize:18, "anchor":"TCS"};
				
				//storedLocations.endGameText={"top":200,"left":50,"width":860,"height":90,"fontSize":40,"anchor":"TCS"};
				//storedLocations.titleDescription = {top:350,left:50,width:860,height:135,fontSize:24, "anchor":"TCS"};
				storedLocations.pauseButton={"top":460,"left":890,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3={"top":460,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3off={"top":460,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				
				storedLocations.siteLink={"top":370,"left":0,"width":186,"height":50,"fontSize":16,"anchor":"BL"};
				storedLocations.siteLinkText={textScale:storedLocations.siteLinkText.textScale,"top":384,"left":-10,"width":210,"height":592,"fontSize":20,"anchor":"BL"};
				
			break;	
		default:
				
				var n = Math.min(1,norm(winRatio,squareMax,tenEighty));
				//console.log(n);
				
				var store = storeLerp({textScale:storedLocations.titleGameName.textScale,top:12,left:250,width:550,height:135,"fontSize":40, "anchor":"TR"},{textScale:storedLocations.titleGameName.textScale,top:12,left:375,width:450,height:135,"fontSize":48, "anchor":"TR"},n);
				storedLocations.titleGameName = store;
				storedLocations.titleDescription = storeLerp({textScale:storedLocations.titleDescription.textScale,top:62,left:250,width:640,height:135,"fontSize":18, "anchor":"TR"},{textScale:storedLocations.titleDescription.textScale,top:62,left:375,width:500,height:135,"fontSize":20, "anchor":"TR"},n);
				
				store = storeLerp({"top":59,"left":413,"width":480,"height":261,"fontSize":12,"anchor":"BR"},{"top":179,"left":423,"width":420,"height":229,"fontSize":12,"anchor":"BR"},n);
				storedLocations.titleInstructionsImage= store;
				storedLocations.titleInstructionsImage_PC =store;
				
				document.getElementById("titleGameName").style.textAlign = "left";
				document.getElementById("endGameText").style.textAlign = "left"; 

				document.getElementById("titleDescription").style.textAlign = "left";
				
				//storedLocations.endGameText={"top":92,"left":370,"width":520,"height":90,"fontSize":40,"anchor":"TR"};
				storedLocations.pauseButton={"top":470,"left":890,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3={"top":470,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				storedLocations.soundButton3off={"top":470,"left":810,"width":64,"height":64,"fontSize":16,"anchor":"BR"};
				
				//storedLocations.siteLink={"top":400,"left":0,"width":216,"height":80,"fontSize":16,"anchor":"BL"};
				//storedLocations.siteLinkText={"top":420,"left":5,"width":210,"height":508,"fontSize":16,"anchor":"BL"};
				storedLocations.titleCharacter.anchor="BC";
				storedLocations.levelMessageCharacter.anchor="BC";
				endTextTop = 0;
			break;
		}
		storedLocations.endGameText.top=endTextTop+20;
		storedLocations.EndDistanceLabel.top=endTextTop+98;
		storedLocations.EndDistance.top=endTextTop+98;
		storedLocations.EndScore.top=endTextTop+142;
		storedLocations.EndScoreLabel.top=endTextTop+142;
		storedLocations.BestDistanceLabel.top=endTextTop+188;
		storedLocations.BestDistance.top=endTextTop+188;
		storedLocations.BestScore.top=endTextTop+232;
		storedLocations.BestScoreLabel.top=endTextTop+232;
		
		if (oCONFIG.hideOfficialSite==1) {
			storedLocations.siteLink.top=-10000;
			storedLocations.siteLink2.top=-10000;
			storedLocations.siteLinkText.top=-10000;
			storedLocations.siteLinkText2.top=-10000;
		}
	}
	document.getElementById("blocker").style.visibility="hidden";
	if (gameState==2) {
		if (heartBar) {
			heartBar.reposition();
		}
	}
}
// Listen for resize changes
function resizeSequence() {
	return; //AHK
	//document.getElementById("blocker").style.visibility="visible";
	orientLegal();
	resizeIteration = 0;
	setCanvasSize();
}

function setCanvasSize() {
	return; //AHK
	window.scrollTo(0, 0);

	setStage();
	var renderScale=(window.devicePixelRatio) ? window.devicePixelRatio : 1;
	const width_size = window.innerHeight* 1080.0/1920.0
	const width_plus = (window.innerWidth-width_size)/2;
	camera.aspect = width_size / window.innerHeight;
	//canvas_container.style.left = 
		renderer.context.canvas.style.left = ((window.innerWidth-width_size)/2)+"px";
	
	//canvas.width = Math.floor(1.0 * width_size) + "px";//Math.floor(1.0 * window.innerWidth) + "px";
	//canvas.height = Math.floor(1.0 * window.innerHeight) + "px";
	renderer.setSize(width_size+width_plus, window.innerHeight, true); //renderer.setSize(window.innerWidth, window.innerHeight); 
	//renderer.setViewport( 0, 0, window.innerWidth*renderScale, window.innerHeight*renderScale );	
	renderer.setViewport( 0, 0, width_size*renderScale, window.innerHeight*renderScale );	
	//renderer.setPixelRatio(renderScale);
	
	
	camera.updateProjectionMatrix();
	setCSSRElative(); //interface.js

}
setCanvasSize();

function fitGameUI() {
	
}

//recordCSSPositions();
function recordCSSPositions() {
	if (!locationsInited) {
		var tObjs = getGoodlocs();
		var goodData = false;
		if (tObjs!=undefined) {
			storedLocations=tObjs;
			if (queryVal===undefined) shiftAudioButtons();
			goodData=true;
		}
		
		for (var idx = 0; idx < readCSSIds.length; idx++) {
			var def = readCSSIds[idx];
			var offset = def.indexOf(":");
			var anchor = "";
			if (offset>-1){
				anchor = def.substr(0,offset);
				def = def.substr(offset+1);
				//console.log("recordCSSPositions:"+anchor+"  :  "+def);
			}
			var tObj = document.getElementById(def);
			if (tObj==undefined) {
				return;
			}
			if (anchor!="F") tObj.style.position ="fixed";
			var storage = getCoords(tObj);
			storage.anchor = anchor;
			if (!goodData) storedLocations[def] = storage;
			readCSSIds[idx] = def;
		}
		locationsInited = true;
		//console.log(JSON.stringify(storedLocations));
	}
}
 
var lastScaleRatio = 1;
function setCSSRElative() {
	return;  //AHK remap
	resizeIteration++;
	const width_size = window.innerHeight * 1080.0/1920.0;
	 
	var winRatio = window.innerWidth/window.innerHeight;
	console.log(winRatio);
	var ratio = 1;
	
	ratio = (1.0 * window.innerWidth) / (1.0 * stage.width);
	
	var ratio2 = 1.0*window.innerHeight/ (1.0*stage.height);
	if ( ratio2<ratio) ratio = ratio2;
	var leftShift = (window.innerWidth - width_size)/2.0;
	var winTangent = 1;
	
	if (!locationsInited) {
		recordCSSPositions();
	}
	lastScaleRatio = ratio;
	var animationEnded = true;	
	var topOffset = (isMobile?-25:0);
	if (locationsInited) {
		for (var idx = 0; idx < readCSSIds.length; idx++) {
			var def = readCSSIds[idx];
			var tObj = document.getElementById(def);
			var storage = storedLocations[def];
			if (storage===undefined) console.log(def);
			var tTop = storage.top;
			
				if (oCONFIG.fontBaselineShift!=0 && idx<5){
					tTop-= oCONFIG.fontBaselineShift*ratio;
				}
			tTop-=topOffset
			var tLeft = storage.left;
			if (animationStartTime > -1) {
				var animDef = currentAnimation[readCSSIds[idx]];
				if (animDef !== undefined) {
					var dTime = (Date.now() - (animationStartTime + animDef.startTime)) / (animDef.endTime - animDef.startTime);
					dTime = Math.max(0, Math.min(1, dTime));
					if (dTime < 1) {
						animationEnded = false;
					}
					if (animDef.hide === true) {
						if (dTime > 0) {
							tObj.style.visibility = "visible";
							animDef.hide = false;
						}
					}
					if (animDef.fade === undefined) {
						if (dTime<1) {
							dTime = (dTime) * 1.3;
							if (dTime > 1) {
								dTime = 1 - 0.075 * Math.sin(Math.PI * 3 * (dTime - 1));
							} else {
								dTime *= dTime;
							}
						}
						tTop += animDef.sY * (1 - dTime) + animDef.dY * dTime;
						tLeft += animDef.sX * (1 - dTime) + animDef.dX * dTime;
					} else {
						if (animDef.fade > 0) {
							tObj.style.opacity = dTime*animDef.fade;
						} else {
							tObj.style.opacity = 1 - dTime;
						}
					}
				}
			}
			
			// New fun and games
			
			if (isMobile ) {//&& storage.anchor.indexOf("B")>-1) {
				tTop-=20;
			}
			var window_innerWidth=width_size;
			var setSize = true;
			switch (storage.anchor) {
				case "S":
					var tRatio = (window.innerHeight/window_innerWidth)*(storage.width/storage.height);
					if (tRatio<1){
						tObj.style.left = leftShift+"px";
						tObj.style.top = -Math.floor(((window_innerWidth*storage.height/storage.width) - window.innerHeight)/2)+"px";
						tObj.style.width = window_innerWidth+"px";
						tObj.style.height = Math.floor(window_innerWidth*storage.height/storage.width)+"px";
					}else{
						tObj.style.left = (leftShift-Math.floor(((window.innerHeight*storage.width/storage.height) - window_innerWidth)/2))+"px";
						tObj.style.top = "0px";
						tObj.style.width = Math.floor(window.innerHeight*storage.width/storage.height)+"px";
						tObj.style.height = window.innerHeight+"px";
					}
					setSize=false;
					break;
				case "L":
					tObj.style.left = leftShift+"px";
					tObj.style.top =  Math.floor(window.innerHeight/2+(((tTop + storage.height/2)-270)*ratio)-(storage.height*ratio/2))+ "px";
					break;
				case "C": // Centered
					tObj.style.left = Math.floor(window_innerWidth/2+(((tLeft + storage.width/2)-480)*ratio)-(storage.width*ratio/2)+leftShift)+ "px";
					tObj.style.top =  Math.floor(window.innerHeight/2+(((tTop + storage.height/2)-270)*ratio)-(storage.height*ratio/2))+ "px";
					break;
				case "TC":
					tObj.style.left =  Math.floor(window_innerWidth/2+(((tLeft + storage.width/2)-480)*ratio)-(storage.width*ratio/2)+leftShift)+ "px";
					
					tObj.style.top = Math.floor(tTop * ratio) + "px";
					break;
				case "TCS":
					tObj.style.width = Math.floor(window_innerWidth-50)+"px";
					tObj.style.left = (25+leftShift)+"px";
					tObj.style.top = Math.floor(tTop * ratio) + "px";
					
					tObj.style.height = Math.floor(storage.height * ratio) + "px";
					setSize=false;
					break;
				case "TL": // Top Left
					tObj.style.left = Math.floor(tLeft * ratio+leftShift) + "px";
					tObj.style.top = Math.floor(tTop * ratio) + "px";
					break;
				case "TR": // Top Right
					tObj.style.left = Math.floor(window_innerWidth-(((960-(tLeft+storage.width)) * ratio)+(storage.width*ratio))+leftShift) + "px";
					tObj.style.top = Math.floor(tTop * ratio) + "px";
					break;
				case "BL": //Bottom Left
					tObj.style.left = Math.floor(tLeft * ratio+leftShift) + "px";
					tObj.style.top = Math.floor(window.innerHeight-(((540-(tTop+storage.height)) * ratio)+(storage.height*ratio))) + "px";//+(storage.height*ratio))
					break;
				case "BC": // Bottom Center
					tObj.style.left =  Math.floor(window_innerWidth/2+(((tLeft + storage.width/2)-480)*ratio)-(storage.width*ratio/2)+leftShift)+ "px";
					tObj.style.top = Math.floor(window.innerHeight-(((540-(tTop+storage.height)) * ratio)+(storage.height*ratio))) + "px";
					break;	
				case "BR": // Bottom Right
					tObj.style.left = Math.floor(window_innerWidth-(((960-(tLeft+storage.width)) * ratio)+(storage.width*ratio))+leftShift) + "px";
					tObj.style.top = Math.floor(window.innerHeight-(((540-(tTop+storage.height)) * ratio)+(storage.height*ratio))) + "px";
					
					break;
				case "SC": // Stretch vertical, center horizontal
					
					break;
				case "F":
					setSize=false;
					break;
				default:
					tObj.style.top = Math.floor(tTop * ratio) + "px";
					tObj.style.left = Math.floor(tLeft * ratio+leftShift) + "px";
					break;
			}
			if (setSize) {
				tObj.style.width = Math.floor(storage.width * ratio) + "px";
				tObj.style.height = Math.floor(storage.height * ratio) + "px";
				tObj.style.backgroundSize = Math.floor(storage.width * ratio) + "px " + Math.floor(storage.height * ratio) + "px";
				tObj.style.backgroundRepeat = "no-repeat";
			}

			if (storage.fontSize !== undefined) {
				var relScale = storage.textScale?storage.textScale:1;
				if (storage.fontOverride!==undefined) {
					tObj.style.fontSize = (storage.fontOverride * ratio*relScale) + "px";
				} else {
					tObj.style.fontSize = (storage.fontSize * ratio*relScale) + "px";
				}
				tObj.style.paddingTop = (0.5*storage.fontSize*(1-relScale))+"px";
			}

			//if (idx < 6 && (animationStartTime==-1 ||animationEnded)) {
			//	tObj.style.top = Math.floor(Math.min(window.innerHeight,ratio * stage.height) - (ratio * storage.height)+1) + "px";
			//}
		}
	}
	var character = document.getElementById("levelMessageCharacter");

	//var bottomMask = document.getElementById("bottomMask");
	//bottomMask.style.top = stage.height * ratio + "px";
	//bottomMask.style.height = window.innerHeight + "px";
	orientLegal();
	if (animationStartTime > -1 || resizeIteration<5) {
		
		if (resizeIteration>1) {
			//document.getElementById("blocker").style.visibility="hidden";
		}
		if (animatorTimeout != -1) {
			clearTimeout(animatorTimeout);
		}
		if (animationEnded ) {
			//console.log("animended");
			animationStartTime = -1; 
			currentAnimation = {};
		} 
		if (!animationEnded ||  resizeIteration<5) {
			animatorTimeout = setTimeout(setCSSRElative, 25);
		}
	} else {
		animatorTimeout = -1;
	}
	
		//document.getElementById("blocker").style.visibility="hidden";
}
setCSSRElative();
//document.getElementById("hitResponse").style.visibility = "hidden";

function hideHitResponse() {
	if (animationTimeout != -1) {
		clearTimeout(animationTimeout);
		animationTimeout = -1;
	}
	animationStartTime = Date.now();
	currentAnimation = {};
	currentAnimation.hitResponseCharacter = {
		"startTime": 0,
		"endTime": 333,
		sX: 0,
		sY: 0,
		dX: 0,
		dY: 540
	};
	currentAnimation.hitResponseCharacterGlow = {
		"startTime": 0,
		"endTime": 333,
		sX: 0,
		sY: 0,
		dX: 0,
		dY: 540
	};
	currentAnimation.hitResponseText = {
		"startTime": 0,
		"endTime": 333,
		sX: 0,
		sY: 0,
		dX: 0,
		dY: 540
	};
	animationTimeout = setTimeout(endHitAnimation, 500);
	setCSSRElative();
}

function showHitResponse() {
	document.getElementById("hitResponse").style.visibility = "visible";
	if (animationTimeout != -1) {
		clearTimeout(animationTimeout);
		animationTimeout = -1;
	}
	animationStartTime = Date.now();
	currentAnimation = {};
	currentAnimation.hitResponseCharacter = {
		"startTime": 0,
		"endTime": 333,
		sX: 0,
		sY: 540,
		dX: 0,
		dY: 0
	};
	currentAnimation.hitResponseCharacterGlow = {
		"startTime": 0,
		"endTime": 333,
		sX: 0,
		sY: 540,
		dX: 0,
		dY: 0
	};
	currentAnimation.hitResponseText = {
		"startTime": 0,
		"endTime": 333,
		sX: 0,
		sY: 540,
		dX: 0,
		dY: 0
	};
	animationTimeout = setTimeout(hideHitResponse, 1500);
	setCSSRElative();
}

function endHitAnimation() {
	document.getElementById("hitResponse").style.visibility = "hidden";
}

function revealTitleScreen() {
	return; //AHK
	// Title reveal animation order
	//FADE "titleBackground",
	//MOVE "ninjagoLogo","titleCharacter",
	//MOVE "titleGameName","titleDescription","exitButton",
	// -- Extra objects may fade or slide in here
	//FADE "titleInstructions","titleInstructionsImage",
	//MOVE "playButton",
	if (animationTimeout != -1) {
		clearTimeout(animationTimeout);
		animationTimeout = -1;
	}
	document.getElementById("levelMessage1").style.visibility = "hidden";
	document.getElementById("levelMessage2").style.visibility = "hidden";
	document.getElementById("levelMessage3").style.visibility = "hidden";
	animationStartTime = Date.now();
	currentAnimation = {};
	currentAnimation.titleBackground = {
		"startTime": 0,
		"endTime": 500,
		fade: 1
	};
	currentAnimation.ninjagoLogo = {
		"startTime": 500,
		"endTime": 1000,
		sX: 0,
		sY: -700,
		dX: 0,
		dY: 0
	};
	currentAnimation.ninjaLogoText = {
		"startTime": 500,
		"endTime": 1000,
		sX: 0,
		sY: -700,
		dX: 0,
		dY: 0
	};
	currentAnimation.titleCharacter = {
		"startTime": 500,
		"endTime": 1000,
		sX: 0,
		sY: 540,
		dX: 0,
		dY: 0
	};
	currentAnimation.levelMessage1 = {
		"startTime": 900,
		"endTime": 1400,
		sX: 200,
		sY: 0,
		dX: 0,
		dY: 0,
		hide: true
	};
	currentAnimation.levelMessage2 = {
		"startTime": 1100,
		"endTime": 1600,
		sX: 200,
		sY: 0,
		dX: 0,
		dY: 0,
		hide: true
	};
	currentAnimation.levelMessage3 = {
		"startTime": 1300,
		"endTime": 1800,
		sX: 200,
		sY: 0,
		dX: 0,
		dY: 0,
		hide: true
	};
	currentAnimation.titleGameName = {
		"startTime": 1500,
		"endTime": 2000,
		sX: 1000,
		sY: 0,
		dX: 0,
		dY: 0
	};
	currentAnimation.titleDescription = {
		"startTime": 1500,
		"endTime": 2000,
		sX: 1000,
		sY: 0,
		dX: 0,
		dY: 0
	};
	currentAnimation.exitButton = {
		"startTime": 1500,
		"endTime": 2000,
		sX: 600,
		sY: 0,
		dX: 0,
		dY: 0
	};
	currentAnimation.titleInstructions = {
		"startTime": 1500,
		"endTime": 2000,
		fade: 1
	};
	currentAnimation.titleInstructionsImage = {
		"startTime": 1500,
		"endTime": 2000,
		fade: 1
	};
	currentAnimation.titleInstructionsImage_PC = {
		"startTime": 1500,
		"endTime": 2000,
		fade: 1
	};
	currentAnimation.playButton = {
		"startTime": 2000,
		"endTime": 2500,
		sX: 0,
		sY: 150,
		dX: 0,
		dY: 0
	};
	currentAnimation.titlePlayText = {
		"startTime": 2000,
		"endTime": 2500,
		sX: 0,
		sY: 150,
		dX: 0,
		dY: 0
	};
	currentAnimation.siteLink2 = {
		"startTime": 2250,
		"endTime": 2750,
		sX: -200,
		sY: 0,
		dX: 0,
		dY: 0
	};
	currentAnimation.siteLinkText2 = {
		"startTime": 2250,
		"endTime": 2750,
		sX: -200,
		sY: 0,
		dX: 0,
		dY: 0
	};
	setCSSRElative();

}

/*
Handling animation with CSS scaling system
Requires a currentAnimation status object. 
setCSSRElative() is called repeatedly while an animation is active.
This carries out it's normal positioning, but also looks up offset values in relativeOffset
If it detects that an animation is ongoing it sets up a setTimeout() to repeat calls to the function until animation consitions have ended
all coordinates are relative to the base positions of each element

currentAnimation = [{id:"divName",startTime:1000,endTime:2000,sX:0,sY:0,dX:0,dY:0}];

*/

function pixelMultiply(strPx, ratio) {
	console.log(strPx + "  " + strPx.substr(0, strPx.length - 2));
	var num = parseFloat(strPx.substr(0, strPx.length - 2));
	return (num * ratio) + "px";
}

function getCoords(elem) { // crossbrowser version 
	var box = elem.getBoundingClientRect();

	var body = document.body;
	var docEl = document.documentElement;

	var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

	var clientTop = docEl.clientTop || body.clientTop || 0;
	var clientLeft = docEl.clientLeft || body.clientLeft || 0;

	var top = box.top + scrollTop - clientTop;
	var left = box.left + scrollLeft - clientLeft;
	var style = window.getComputedStyle(elem, null).getPropertyValue('font-size');
	var curFontSize = parseFloat(style);
	if (curFontSize === NaN) {
		curFontSize = 48;
	}
if (top===undefined) console.log(elem);
	return {
		top: Math.round(top),
		left: Math.round(left),
		width: Math.round(box.width),
		height: Math.round(box.height),
		fontSize: curFontSize
	};
}

function triggerGameOver() {
	console.log("triggerGameOver");
	//setCanvasSize();
	changeGameState(5);
	if (animationTimeout != -1) {
		clearTimeout(animationTimeout);
		animationTimeout = -1;
	}
	animationStartTime = Date.now();
	currentAnimation = {};	
	currentAnimation.levelBackground = {
		"startTime": 0,
		"endTime": 500,
		fade: 1
	};
	currentAnimation.ninjagoLogo2 = {
		"startTime": 500,
		"endTime": 1000,
		sX: 0,
		sY: -700,
		dX: 0,
		dY: 0
	};
	currentAnimation.ninjaLogoText2 = {
		"startTime": 500,
		"endTime": 1000,
		sX: 0,
		sY: -700,
		dX: 0,
		dY: 0
	};
	currentAnimation.levelMessageCharacter = {
		"startTime": 500,
		"endTime": 1000,
		sX: 0,
		sY: 540,
		dX: 0,
		dY: 0
	};
	currentAnimation.endGameText = {
		"startTime": 1000,
		"endTime": 1500,
		fade: 1
	};
	currentAnimation.EndDistanceLabel = {
		"startTime": 1000,
		"endTime": 1500,
		fade: 1
	};
	currentAnimation.EndDistance = {
		"startTime": 1250,
		"endTime": 1750,
		fade: 1
	};
	currentAnimation.EndScoreLabel = {
		"startTime": 1500,
		"endTime": 2000,
		fade: 1
	};
	currentAnimation.EndScore = {
		"startTime": 1750,
		"endTime": 2250,
		fade: 1
	};
	currentAnimation.BestDistanceLabel = {
		"startTime": 2000,
		"endTime": 2500,
		fade: 1
	};
	currentAnimation.BestDistance = {
		"startTime": 2250,
		"endTime": 2750,
		fade: 1
	};
	currentAnimation.BestScoreLabel = {
		"startTime": 2500,
		"endTime": 3000,
		fade: 1
	};
	currentAnimation.BestScore = {
		"startTime": 2750,
		"endTime": 3250,
		fade: 1
	};
	currentAnimation.playAgainButton = {
		"startTime": 2000,
		"endTime": 2500,
		sX: 0,
		sY: 150,
		dX: 0,
		dY: 0
	};
	currentAnimation.playAgain = {
		"startTime": 2000,
		"endTime": 2500,
		sX: 0,
		sY: 150,
		dX: 0,
		dY: 0
	};
	currentAnimation.moreGamesButton = {
		"startTime": 2000,
		"endTime": 2500,
		sX: 0,
		sY: 150,
		dX: 0,
		dY: 0
	};
	currentAnimation.moreGames = {
		"startTime": 2000,
		"endTime": 2500,
		sX: 0,
		sY: 150,
		dX: 0,
		dY: 0
	};
	currentAnimation.siteLink = {
		"startTime": 2250,
		"endTime": 2750,
		sX: -200,
		sY: 0,
		dX: 0,
		dY: 0
	};
	currentAnimation.siteLinkText = {
		"startTime": 2250,
		"endTime": 2750,
		sX: -200,
		sY: 0,
		dX: 0,
		dY: 0
	};
	setCSSRElative();
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
function hideRenderer() {
	renderer.domElement.style.visibility = "hidden";
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
			/*
			var item_names ="instructionPanel,inst_b_PLAY,recap_legal,recap_date,Title_copy,inst_background".split(",");// recap_top_rect
			var reveal_items ="instructionPanel,inst_b_PLAY".split(",");
			var items = {};
			//recap_GET_TICKETS
			for (var idx=0; idx<item_names.length; idx++) {
				//var tItem = center_block.appendChild(document.createElement("div"));
				//tItem.className=item_names[idx];
				
				items[item_names[idx]]=document.getElementById(item_names[idx]);
				if (!items[item_names[idx]]) console.log("missing:"+item_names[idx]);
			}
			//items.instructionPanel.style.opacity=0;
			//TweenLite.to(items.instructionPanel, 3.0, {opacity:"1", overwrite:true, ease: Elastic.easeOut.config(1.0, .8)});

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
		case 2:	
			
			heartBar.reposition();
			document.getElementById("canvas_container").style.visiblity="visible";
			document.getElementById("canvas_container").style.display="block";
			renderer.domElement.style.visibility = "visible";
			tDiv = document.getElementById("gameUI").style;
			tDiv.visibility = "visible";
			tDiv.display = "block";
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
			setTimeout(hideRenderer,1500);
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
			document.getElementById("recap_DISTANCE").innerHTML=""+gameDistance;
			
			saveState();
			var reveal_items="recap_RUSS,recap_HANK,recap_date,Title_copy,recap_SCORE_Label,recap_SCORE,recap_DISTANCE_Label,recap_DISTANCE,recap_PLAY_MORE,recap_INSTRUCTIONS,recap_WATCH_TRAILER".split(",");
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


function startPowerupSequence() {
	
	lastActionTime = Date.now();
	if (powerupObj.chargeLevel >= 1) {
		
		particleSystem.makeBIGParticle(new THREE.Vector3(0,0,2),new THREE.Vector3(0,0,0));

		powerupObj.chargeLevel = 0;
		setAnim("NyaFBX_attack_P", playerObj.obj);
		for (var idx = enemyList.length - 1; idx >= 0; idx--) {
			setAnim(baseEnemyName+"_hit",enemyList[idx].obj);
			enemyList[idx].deathTime = Date.now() + 500;
			particleSystem.makeParticle(enemyList[idx], new THREE.Vector3(0, 0, 0));
		}
		//celebrating=true;
		setTimeout(endPowerUp,500);
	}
	
}
function endPowerUp() {
	celebrating=false;
	for (var idx = enemyList.length - 1; idx >= 0; idx--) {
		scene.remove(enemyList[idx].obj);
		enemyList.splice(idx, 1);
			
	}
}
var particleSystem = new particleFX();
function clearEnemies() {
	lastActionTime = Date.now();
	for (var idx = enemyList.length - 1; idx >= 0; idx--) {
		//particleSystem.makeParticle(enemyList[idx].obj.position,new THREE.Vector3(0,0,0));
		scene.remove(enemyList[idx].obj);
		enemyList.splice(idx, 1);

	}
}



function particleFX() {
	this.tick = 0;
	this.particleSystem = new THREE.GPUParticleSystem({maxParticles: 5000});
	scene.add(this.particleSystem);
	this.makeBIGParticle = function (position, direction) {
		BIGfxParams.size = BIGfxParams.sizeBase * stage.particleScale;
		BIGfxParams.position = position;
		BIGfxParams.velocity.x = direction.x * BIGfxSpawn.horizontalSpeed;// * stage.ratio;
		BIGfxParams.velocity.y = direction.y * BIGfxSpawn.verticalSpeed;//* stage.ratio;
		for (var idx=0; idx<BIGfxSpawn.spawnRate; idx++ ){
			this.particleSystem.spawnParticle(BIGfxParams);
		}
	}
	this.makeENEMYParticle = function (position, direction) {
		ENEMYfxParams.size = ENEMYfxParams.sizeBase * stage.particleScale;
		ENEMYfxParams.position = position;
		ENEMYfxParams.velocity.x = direction.x * ENEMYfxSpawn.horizontalSpeed;//* stage.ratio;
		ENEMYfxParams.velocity.y = direction.y * ENEMYfxSpawn.verticalSpeed;//* stage.ratio;
		for (var idx=0; idx<ENEMYfxSpawn.spawnRate; idx++ ){
			this.particleSystem.spawnParticle(ENEMYfxParams);
		}
	}
	this.makeParticle = function (position, direction) {
		fxParams.size = fxParams.sizeBase * stage.particleScale;
		fxParams.position = position;
		fxParams.velocity.x = direction.x * fxSpawn.horizontalSpeed;// * stage.ratio;
		fxParams.velocity.y = direction.y * fxSpawn.verticalSpeed;// * stage.ratio;
		for (var idx=0; idx<fxSpawn.spawnRate; idx++ ){
			this.particleSystem.spawnParticle(fxParams);
		}
	}
	this.update = function(delta){
		this.tick += delta*fxSpawn.timeScale;
		if (this.tick<0) this.tick=0;
		this.particleSystem.update(this.tick);
	}
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
	if (event!=-1) resizeSequence();
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
		if (heartBar) {
			heartBar.reposition();
		}
	}
	resizeSequence();
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




