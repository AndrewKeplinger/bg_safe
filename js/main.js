function purgePreroll() {

}


function LoadComplete() {
	links_block.style.visibility = "visible";
	
	document.getElementById("headingText").style.visibility = "hidden";
	// Set text from JSON

	setFieldText("Pause_Menu_Heading", "pauseGameHeadingText");
	setFieldText("Pause_Menu_Continue", "pauseGameOptions1");

	if (oCONFIG.hideOfficialSite == 1) {
		document.getElementById("pauseGameOptions4").style.visibility = "hidden";
		document.getElementById("pauseGameOptions4").style.display = "none";
	}
	
	setFieldText("recap_SCORE_Label", "recap_SCORE_Label");
	setFieldText("recap_PLAY_MORE", "recap_PLAY_MORE");
	setFieldText("recap_INSTRUCTIONS", "recap_INSTRUCTIONS");
	setFieldText("recap_WATCH_TRAILER", "recap_WATCH_TRAILER");
	setFieldText("recap_date", "recap_date");
	setFieldText("Title_copy", "Title_copy");
	setFieldText("run_Title", "run_Title");
	setFieldText("title_film_logo_date", "title_film_logo_date");
	setFieldText("b_play", "b_play");
	setFieldText("b_instructions", "b_instructions");
	setFieldText("inst_b_PLAY", "inst_b_PLAY");
	setFieldText("pauseGameHeadingText", "pauseGameHeadingText");
	
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
	//gameScoreField.innerHTML = "" + gameScore;
	//gameDistance = 0;
	//gameDistField.innerHTML = "" + gameDistance; //+"m";
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

var anim_sync=Date.now();
function animate() {
	var deltaTime = Date.now()-anim_sync;
	anim_sync=Date.now();
	
	anim_step(deltaTime);
	
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
			alarmOff:1,
			GameLoss_Lasers: 0,
			laser_01:0,
			laser_02:0,
			laser_03:0,
			laser_04:0,
			laser_darker:0,
			snake: 1,
			wolf: 0,
			turners: 1,
			turner_02: 0,
			turner_03: 0,
			iceRing: 0,
			turner_scramble: 0,
			safecarrot_on:0,
			safecarrot_missed:0,
			safe2: 0,
			safe3: 0,
			loot:0,
			//safe_cases: 1,
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
			action: "anim1",
			safe2: 1,
			safecarrot_on:0,
			turnmarker_1:0,
			turnmarker_fill_1:0,
			turnmarker_missed_1:0,
			safe2_door: 1,
			safe2_open_01: 0,
			safe2_open_02: 0,
			safe2_open_03: 0,
			Safe2_case: 1,
			turners:0,
			turner_01: 0,
			turnmarkers:0,
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
			safecarrot_on:0,
			action: "initDial"
		}
	},
	safe2: {
		1: {
			action: "anim2",
			safe3: 1,
			safecarrot_on:0,
			turnmarker_1:0,
			turnmarker_missed_1:0,
			turnmarker_2:0,
			turnmarker_missed_2:0,
			safe3_door: 1,
			safe3_open_01: 0,
			safe3_open_02: 0,
			safe3_open_03: 0,
			//Safe3_case: 1,
			turners:0,
			turner_02: 0,
			turnmarkers:0,
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
			safecarrot_on:0,
			action: "initDial"
		}
	},
	safe3: {
		1: {
			safecarrot_on:0,
			turnmarker_1:0,
			turnmarker_missed_1:0,
			turnmarker_2:0,
			turnmarker_missed_2:0,
			turnmarker_3:0,
			turnmarker_missed_3:0,
			action: "anim3",
			turner_03: 0,
			turnmarkers:0,
			turners:0,
			safe3_open_01: 1,
			safe3_door: 0,
		},
		2: {action:"stopclock",
			loot:1,
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
			action: "loop",
			alarmOn:1,
			alarmOff:0,
			laser_darker: 1,
			laser_01: 1
		},
		2: {
			laser_02: 1
		},
		3: {
			laser_03: 1
		},
		4: {
			laser_04: 1,
			action: "lose"
		}
	},
	freeze: {
		1: {
			action: "wolf_reveal",
			wolf: 1
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
			//turner_iced: 0,
			//iceRing: 0,
			action: "wolf_exit"
		}
	}
}
var iceRing=document.getElementById("iceRing");
function anim_step(deltaTime) {
	/*if (iceRing.style.visibility=="visible") {
		iceRing.style.rotate=rnd(360)+"deg";	
	}*/
	if (isPaused) {
		gV.clockStart += deltaTime;
		//console.log(gV.clockStart);
		return;
	}
	updateClock();
	if (gV.anim) {
		if (Date.now() > gV.nextStep) {
			gV.animStep++;
			if (!game_parts[gV.anim][gV.animStep]) {
				console.log("End Anim:"+gV.anim);
				gV.anim = null;
			} else {
				renderAnim(gV.anim, gV.animStep);
				gV.nextStep = Date.now() + oCONFIG.animationDelay;
			}
		}
	}
}
var safe_zs={"safe1":40,"safe2":17,"safe3":10};
function renderAnim(name, phase) {
	var anim = game_parts[name][phase];
	var keys = Object.keys(anim);
	for (var idx = 0; idx < keys.length; idx++) {
		switch (keys[idx]) {
			case "action":
				switch (anim[keys[idx]]) {
					case "iceFx":
						break;
					case "freeze":
						gV.turnRate=oCONFIG.freezeTurnRate;
						break;
					case "wolf_reveal":
						gV.anim="freeze";
						gV.animStep=1;
						gV.nextStep = Date.now() + oCONFIG.animationDelay;
						var wolf=document.getElementById("wolf");
						wolf.style.opacity=0;
						TweenLite.to(wolf, 1.0, {opacity:1, overwrite:true, ease: Elastic.easeOut.config(1.0, .8)});									
						break;
					case "stopclock":
						gobj(document.getElementById("loot"),"on");
						stopClock();
						break;
					case "win":
					case "lose":
						setTimeout(triggerGameOver,1000);
						break;
					case "wolf_exit":
						var wolf=document.getElementById("wolf");
						TweenLite.to(wolf, 1.0, {opacity:0, overwrite:true, ease: Elastic.easeOut.config(1.0, .8)});
						break;
					case "initDial":
						initDial();
						break;
					case "anim1":
					case "anim2":
					case "anim3":
						//var animnum=anim[keys[idx]].substring(4,5);
						
						// special code to move turner layer then fall through to loop
						var turners = document.getElementById("turners");
						turners.style.rotate="0deg";
						//turners.style.zIndex=Number(safe_zs["safe"+animnum]);
						
						
					case "loop":
						if (gV.anim) {
							//if any existing animations are playing, stop
						}
						flyState=2; //prevent touches from activating anything
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
//meterWidth 300
	gV.clockObject=document.getElementById("meterFill");
function startClock() {
	gV.clockObject.style.width=oCONFIG.time_meter_width+"px";
	gV.clockStart=Date.now();
}
function updateClock() {
	if (gV.clockStart==-1)return;
	if (isPaused) {
		gV.clockStart = Date.now()-(Date.now()-gV.clockStart);
		return;
	}
	
	var dTime = (Date.now()-gV.clockStart)/oCONFIG.game_duration;
	if (dTime>1) {
		gV.clockStart=-1;
		playSound("Safe_Alarm");
		renderAnim("lasers", 1);
	} else {
		gV.clockObject.style.width=(oCONFIG.time_meter_width*dTime)+"px";
	}
}
function stopClock() {
	gV.playTime=((Date.now()-gV.clockStart)/1000);
	gV.clockStart=-1;
	gV.gameWon=true;
	gobj(document.getElementById("loot_0"+gV.loot),"on");
}
function initGame() {
	//Start up.
	startClock();
	flyState = 0;
	gV.level = 1;
	gV.gameStep = 1;
	gV.opening = -1;
	gV.animRate = 0.1;
	gV.gameWon=false;
	gV.playTime=0;
	gV.missCount=0;
	gV.loot=rnd(3)+1;
	for (var idx=1; idx<4; idx++) {
		gobj(document.getElementById("loot_0"+idx),"off");
	}//gobj(document.getElementById("loot_0"+gV.loot),"on");
	gobj(document.getElementById("loot"),"off");
	renderAnim("initalState", 1);
}
var dbg="";
function gobj(obj, state) {
	/*if (dbg!=obj.id+state){
		console.log(obj.id+" "+state);
		dbg=obj.id+state;
	}*/
	//
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
function initDial() {
	gV.gameStep = 1;
	flyState=0;
	targetNum=0;
	gobj(document.getElementById("numberMark"),"on");
	gobj(document.getElementById("turners"), "on");
	gobj(document.getElementById("turner_iced"), "off");
	gobj(document.getElementById("iceRing"), "off");
	for (var idx = 0; idx < 3; idx++) {
		gobj(document.getElementById("turnmarker_" + (idx + 1)), idx < gV.level?"on":"off");
		gobj(document.getElementById("turnmarker_fill_" + (idx + 1)), "off");	
		gobj(document.getElementById("turnmarker_missed_" + (idx + 1)), "off");			
		turner = document.getElementById("turner_0" + (idx + 1));
		gobj(document.getElementById("turner_0" + (idx + 1)), (idx+1) == gV.level?"on":"off");
	}
	newNumber();
}
function newNumber() {
	if (gV.gameStep==1) targetNum=0;
	var newNum = rnd(12)*3;
	gV.turnRate=oCONFIG.turnRate; 

	while (Math.abs(newNum-targetNum)<7) {
		newNum = rnd(12)*3;
	}
	targetNum = newNum;
	//if (targetNum>35) targetNum=0;
	
	var angleNum = Math.PI * targetNum /18.0;
	var numberMark = document.getElementById("numberMark");
	var turner_01 = document.getElementById("turner_01");
	var h = numberMark.offsetLeft-turner_01.offsetLeft;
	var v = numberMark.offsetTop-turner_01.offsetTop;
	var ch = turner_01.offsetLeft+(turner_01.offsetWidth/2);
	var cv = turner_01.offsetTop+(turner_01.offsetHeight/2);
	var radius = 132-(numberMark.offsetWidth/2);
	var nh = ch+(Math.sin(angleNum)*radius);
	var nv = cv+(-Math.cos(angleNum)*radius);
	numberMark.style.left = (nh-numberMark.offsetWidth/2)+"px";
	numberMark.style.top = (nv-numberMark.offsetWidth/2)+"px";
	flyState=0;
	if (gV.rotateTimeout) clearTimeout(gV.rotateTimeout);
}
function get_turner_rot(){
	var rawrot = document.getElementById("turners").style.rotate;
	return Number(rawrot.substr(0,rawrot.length-3));
}
var nextWheelTime=-1;
function stopWheel() {
	if (nextWheelTime>Date.now()) {
		return;
	}
	var rotation = get_turner_rot();
	
	var diffrot = ((360-(targetNum*10))-rotation);
	if (diffrot>270) diffrot-=360;
	
	if (Math.abs(diffrot)<oCONFIG.accuracy) {
		document.getElementById("turners").style.rotate=(360-(targetNum*10))+"deg";
		gobj(document.getElementById("iceRing"),"off");
		gobj(document.getElementById("turner_iced"),"off");
		if (gV.rotateTimeout) clearTimeout(gV.rotateTimeout);
		gobj(document.getElementById("turnmarker_fill_"+gV.gameStep),"on");
		gV.gameStep++;		
		playSound("Safe_ComboTurn");
		//gobj(document.getElementById("turners"), "off");
		if (gV.gameStep<=gV.level) {
			newNumber();	
			flyState=0;	
			
			//startRotate();
		} else {
			flyState=2;
			setTimeout(advanceSafe,1000);
			
		}
	} else {		
		flyState=2;
		restart_safe();
	}
}
function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
async function restart_safe() {
	console.log("miss");
	gobj(safecarrot_on,"off");
	gobj(document.getElementById("safecarrot_missed"),"on");
	if (gV.rotateTimeout) clearTimeout(gV.rotateTimeout);
	playSound("Safe_Negative");
	while (gV.gameStep>1) {
		if (gV.gameStep<3) {
			gobj(document.getElementById("turnmarker_missed_"+(1+gV.gameStep)),"off");
		}
		gobj(document.getElementById("turnmarker_fill_"+gV.gameStep),"off");
		gobj(document.getElementById("turnmarker_missed_"+gV.gameStep),"on");
		await wait(0.5);
		gV.gameStep--;
	}
	await wait(0.5);
	gobj(document.getElementById("turnmarker_missed_2"),"off");
	gobj(document.getElementById("turnmarker_missed_1"),"on");
	gobj(document.getElementById("turnmarker_fill_1"),"off");
	gobj(document.getElementById("numberMark"),"off");
	await wait(0.5);
	gobj(document.getElementById("turnmarker_missed_1"),"off");
	gobj(document.getElementById("turner_scramble"),"on");
	var blurturner = document.getElementById("turners");
	var rotation = get_turner_rot() + 360;
	while (rotation>0) {
		blurturner.style.rotate= rotation+"deg";
		rotation-=22;
		await wait(0.05);
	}
	blurturner.style.rotate= "0deg";
	newNumber();
	
	gobj(document.getElementById("safecarrot_missed"),"off");
	gobj(document.getElementById("turner_scramble"),"off");	
	gobj(document.getElementById("numberMark"),"on");
	await wait(1);
	gV.missCount++;
	if (gV.missCount==oCONFIG.freeze_event_triger) {		
		gV.missCount=0;
		playSound("Safe_IceSpray");
		renderAnim("freeze", 1);
	} 
} 
function advanceSafe() {	
	gobj(document.getElementById("numberMark"),"off");
	for (var idx=1; idx<4; idx++) {
		gobj(document.getElementById("turnmarker_"+idx),"off");
		gobj(document.getElementById("turnmarker_fill_"+idx),"off");
		gobj(document.getElementById("turnmarker_missed_"+idx),"off");
	}
	playSound("Safe_Door Open");
	renderAnim("safe"+gV.level, 1);
	gV.level++;
}

function startRotate(){
	flyState=0;
	gV.startTime=Date.now();
	gV.turnRate=oCONFIG.turnRate; 
	gV.direction=(gV.gameStep%2==0)?-1:1;
	gV.rotateTimeout = setTimeout(rotateDial,10);
}

var safecarrot_on = document.getElementById("safecarrot_on");
function rotateDial() {
	if (!isPaused) {
		var rotation = get_turner_rot();
		var diffrot = ((360-(targetNum*10))-rotation);
		gobj(safecarrot_on,(Math.abs(diffrot)<oCONFIG.accuracy)?"on":"off");

		var dTime = 0.001*( Date.now()-gV.startTime);
		gV.startTime=Date.now();
		var rot = gV.turnRate*dTime*gV.direction + get_turner_rot();
		if (rot>360) rot-=360;
		if (rot<0) rot+=360;
		document.getElementById("turners").style.rotate=rot+"deg";
	}
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













