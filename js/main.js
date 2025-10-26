function purgePreroll() {

}

function LoadComplete() {
	links_block.style.visibility = "visible";

	document.getElementById("headingText").style.visibility = "hidden";
	// Set text from JSON
	setFieldText("Title", "titleGameName");
	setFieldText("Description", "titleDescription");
	//setFieldText("Action_Button", "Action_Button");
	setFieldText("Description", "titleDescription");
	setFieldText("hitResponse", "hitResponseText");
	setFieldText("End_Play_Again", "playAgainButton");
	setFieldText("End_More", "moreGamesButton");

	setFieldText("StartDate", "ninjaLogoText");
	setFieldText("StartDate", "ninjaLogoText2");
	setFieldText("StartDate", "ninjaLogoText3");
	setFieldText("StartDate", "ninjaLogoText4");
	setFieldText("WebLinkPrompt", "siteLinkText");
	setFieldText("WebLinkPrompt", "siteLinkText2");

	setFieldText("Pause_Menu_Heading", "pauseGameHeadingText");
	setFieldText("Pause_Menu_Continue", "pauseGameOptions1");
	//setFieldText("Pause_Menu_Start_Over", "pauseGameOptions2");
	//setFieldText("Pause_Menu_More_Games", "pauseGameOptions3");
	//setFieldText("Pause_Menu_Official_Site", "pauseGameOptions4");
	if (oCONFIG.hideOfficialSite == 1) {
		document.getElementById("pauseGameOptions4").style.visibility = "hidden";
		document.getElementById("pauseGameOptions4").style.display = "none";
	}

	//setFieldText("WebLinkPrompt", "siteLinkText3");
	// AHL
	/*
	if (isMobile) {
		setFieldText("IntroPrompt_Mobile", "titleInstructions");
		document.getElementById("titleInstructionsImage_PC").style.visibility = "hidden";
	} else {
		setFieldText("IntroPrompt_PC", "titleInstructions");
		document.getElementById("titleInstructionsImage").style.visibility = "hidden"; 
	}
	*/


	//preroll = makePlane([10,0.5,-00],"playerPreRoll", materials["Jay_0"], [7.5,7.5],[1,1],false,0);
	//preroll.baseAnim = "Jay_";
	//startAnim("default",preroll, purgePreroll);

	changeGameState(0);
	gameState = 1;
	changeGameState(1);

	animate();
	setCanvasSize();
	orientLegal();
}

var obstacle2;
resetGame = function (showTitle) {

	flyState = 0;
	gameScore = 0;
	gameScoreField.innerHTML = "" + gameScore;
	gameDistance = 0;
	gameDistField.innerHTML = "" + gameDistance; //+"m";
	isPaused = false;

	repopulationRange = -15;
	generateLevel();
	changeGameState(0);
	changeGameState(1);
	if (!showTitle) {
		changeGameState(2);
	}

}

var repopulationRange = -15;
var rndVList = [5, 12.5, 10, 7.5, 17.5, 5, 10, 15];
var rndVIndex = 2;

function generateLevel() {


}


setTimeout(startUpLoaderUI, 100);

function startUpLoaderUI() {
	if (startPlayingMenuMusic == 0) {
		setTimeout(startUpLoaderUI, 100);
	}
	if (startPlayingMenuMusic == 1) {
		playMusic("MenuLoop");
		startPlayingMenuMusic = 2;
	}
}


function animate() {
	var deltaTime = Date.now();

	window.requestAnimationFrame(animate);
}

function render() {

	var yScroll = window.scrollY == undefined ? window.pageYOffset : window.scrollY;
	if (yScroll != 0) { //|| window.scrollY
		trace("force Scroll:" + yScroll);
		window.scrollTo(0, 0);
	}
	switch (gameState) {
		case 1:
			curScore = 0;
			break;

		case 2:
			switch (flyState) {
				case 0:
					break;
				case 1:
				case 2:
					if (!isPaused) {}


					break;
				case 3:

					break;
				default:

					break;
			}

			break;
		case 3:


			break;
		case 4:

			break;
	}
	if (levelMeterObj !== undefined) {
		levelMeterObj.update();
	}
	//renderer.render(scene, camera);
}
var gameElements = document.getElementById("pieces");
var gV = {};
var game_parts = {

	initalState: {
		1: {
			alarmOn: 0,
			GameLoss_Lasers: 0,
			snake: 0,
			wolf: 0,
			turners: 1,
			turner_02: 0,
			turner_03: 0,
			iceRing: 0,
			safe2: 0,
			safe3: 0,
			safe_cases: 1,
			safe1_door: 1,
			safe1_open_01: 0,
			safe1_open_02: 0,
			safe1_open_03: 0,
			Safe1_case: 1,
			
			action: "initDial"
		}
	},
	safe1: {
		1: {
			action: "anim",
			safe2: 1,
			safe2_door: 1,
			safe2_open_01: 0,
			safe2_open_02: 0,
			safe2_open_03: 0,
			Safe2_case: 1,
			turner_01: 0,
			turner_02: 1,
			safe1_open_01: 1,
			safe1_door: 0
		},
		2: {
			safe1_open_01: 0,
			safe1_open_02: 1
		},
		3: {
			safe1_open_02: 0,
			safe1_open_03: 1,
			action: "initDial"
		}
	},
	safe2: {
		1: {
			action: "anim",
			safe3: 1,
			safe3_door: 1,
			safe3_open_01: 0,
			safe3_open_02: 0,
			safe3_open_03: 0,
			Safe3_case: 1,
			turner_02: 0,
			turner_03: 1,
			safe2_open_01: 1,
			safe2_door: 0
		},
		2: {
			safe2_open_01: 0,
			safe2_open_02: 1
		},
		3: {
			safe2_open_02: 0,
			safe2_open_03: 1,
			action: "initDial"
		}
	},
	safe3: {
		1: {
			action: "anim",
			turner_03: 0,
			safe3_open_01: 1,
			safe3_door: 0,
			action: "stopclock"
		},
		2: {
			safe3_open_01: 0,
			safe3_open_02: 1
		},
		3: {
			safe3_open_02: 0,
			safe3_open_03: 1,
			action: "win"
		}
	},
	lasers: {
		1: {
			action: "anim",
			laser_darker: 1,
			laser_02: 0,
			laser_01: 1
		},
		2: {
			laser_02: 1,
			laser_03: 0
		},
		3: {
			laser_03: 1,
			laser_04: 0
		},
		4: {
			laser_04: 1,
			laser_01: 0,
			action: "loop"
		}
	},
	freeze: {
		1: {
			wolf: 1,
			action: "wolf_reveal"
		},
		2: {
			iceRing: 1,
			action: "iceFx"
		},
		3: {
			turner_iced: 1,
			action: "freeze"
		},
		4: {
			turner_iced: 0,
			iceRing: 0,
			action: "wolf_exit"
		}
	}
}

function anim_step() {
	if (gV.anim) {
		if (Date.now() > gV.nextStep) {
			gV.animStep++;
			if (!game_parts[gV.animStep]) {
				gV.anim = null;
			} else {
				renderAnim(gV.anim, gV.animStep);
				gV.nextStep = Date.now() + oCONFIG.animationDelay;
			}
		}
	}
}

function renderAnim(name, phase) {
	var anim = game_parts[name][phase];
	var keys = Object.keys(anim);
	for (var idx = 0; idx < keys.length; idx++) {
		switch (keys[idx]) {
			case "action":
				switch (anim[keys[idx]]) {
					case "wolf_reveal":
						break;
					case "iceFx":
						break;
					case "freeze":
						break;
					case "wolf_reveal":
						break;
					case "stopclock":
						break;
					case "win":
						triggerGameOver();
						break;
					case "wolf_exit":
						break;
					case "initDial":
						initDial();
						break;
					case "anim":
					case "loop":
						if (gV.anim) {

						}
						gV.anim = name;
						gV.animStep = 1;
						gV.nextStep = Date.now() + oCONFIG.animationDelay;
						break;
				}
				break;
			default:

				var tObj = document.getElementById(keys[idx]);
				if (!tObj) console.log("missing:" + keys[idx]);
				switch (anim[keys[idx]]) {
					case 0:
						gobj(tObj, "off");
						break;
					case 1:
						gobj(tObj, "on");
						break;
				}
				break;
		}
	}
}

function initGame() {
	//Start up.
	flyState = 0;
	gV.level = 1;
	gV.gameStep = 1;
	gV.opening = -1;
	gV.animRate = 0.1;
	renderAnim("initalState", 1);
}

function gobj(obj, state) {
	switch (state) {
		case "on":
			obj.style.visibility = "visible";
			break;
		case "off":
			obj.style.visibility = "hidden";
			break;
		case "get":
			return (obj.style.visibility == "visible");
			break;
	}
}
var targetNum=0;
var turner;
function initDial() {
	gV.gameStep = 1;
	gobj(document.getElementById("turner_iced"), "off");
	gobj(document.getElementById("iceRing"), "off");
	for (var idx = 0; idx < 3; idx++) {
		gobj(document.getElementById("turnmarker_" + (idx + 1)), idx < gV.level?"on":"off");
		gobj(document.getElementById("turnmarker_fill_" + (idx + 1)), idx < gV.level?"on":"off");		
		turner = document.getElementById("turner_0" + (idx + 1))
		gobj(document.getElementById("turner_0" + (idx + 1)), idx == gV.level?"on":"off");
	}
	targetNum= rnd(36);
	//if (targetNum>35) targetNum=0;
	console.log(targetNum);
	var angleNum = Math.PI * targetNum /18.0;
	var numberMark = document.getElementById("numberMark");
	var turner_01 = document.getElementById("turner_01");
	var h = numberMark.offsetLeft-turner_01.offsetLeft;
	var v = numberMark.offsetTop-turner_01.offsetTop;
	var ch = turner_01.offsetLeft+(turner_01.offsetWidth/2);
	var cv = turner_01.offsetTop+(turner_01.offsetHeight/2);
	var radius = 132-numberMark.offsetWidth/2;
	var nh = ch+(Math.sin(angleNum)*radius);
	var nv = cv+(-Math.cos(angleNum)*radius);
	numberMark.style.left = (nh-numberMark.offsetWidth/2)+"px";
	numberMark.style.top = (nv-numberMark.offsetWidth/2)+"px";
}
function stopWheel() {
	var rotation = getCurrentRotation(document.getElementById("turners")) % 360;
	
	var diffrot = ((targetNum*10)-rotation);
	console.log(rotation+"  "+diffrot);
	if (diffrot<0) diffrot+=360;
	if (Math.abs(diffrot)<7) {
		if (gV.rotateTimeout) clearTimeout(gV.rotateTimeout);
		gV.gameStep++;
		if (gV.gameStep<=gV.level) {
			startRotate();
		} else {
			
			renderAnim("safe"+gV.level, 1);
			gV.level++;
			
		}
	} else {
		//Missed
	}

}
function startRotate(){
	flyState=0;
	gV.startTime=Date.now();
	gV.turnRate=oCONFIG.turnRate; 
	gV.direction=gV.gameStep%2==0?1:-1;
	gV.rotateTimeout = setTimeout(rotateDial,10);
}
function rotateDial() {
	var dTime = 0.001*( Date.now()-gV.startTime);
	var rot = gV.turnRate*dTime*gV.direction;
	document.getElementById("turners").style.rotate=rot+"deg";
	if (gV.rotateTimeout) clearTimeout(gV.rotateTimeout);
	gV.rotateTimeout = setTimeout(rotateDial,10);
}

function complete_stage() {

}

function resizeSequence() {}

function enemyRemoveListener(e) {
	e.target.removeEventListener('finished', enemyRemoveListener);

	scene.remove(e.target);
}
window.addEventListener("orientationchange", resizeSequence, false);

window.addEventListener("resize", resizeSequence, false);













