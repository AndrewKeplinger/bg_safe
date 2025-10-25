function purgePreroll() {
	/*if (preroll!==undefined) {
		scene.remove(preroll);
		preroll=undefined;
	}*/
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
	if (oCONFIG.hideOfficialSite==1) {
		document.getElementById("pauseGameOptions4").style.visibility="hidden";
		document.getElementById("pauseGameOptions4").style.display="none";
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
	
	setFieldText("End_Score","EndScoreLabel");
	setFieldText("End_Distance","EndDistanceLabel");
	setFieldText("Best_Score","BestScoreLabel");
	setFieldText("Best_Distance","BestDistanceLabel");
	
	heartBar = new hearts();
	
	//console.log("setupBackground");
	bkgroup = new THREE.Group();
	var plane0 = makePlane([1000, -178, 128], "background0", materials["BG_Flight"], [2048, 512], [1, 1], false,0);
	var plane1 = makePlane([1000, -178, 2176], "background1", materials["BG_Flight"], [2048, 512], [1, 1], false,0);
	var plane2 = makePlane([1000, -178, -1920], "background2", materials["BG_Flight"], [2048, 512], [1, 1], false,0);
	plane0.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2); 
	plane1.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	plane2.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	bkgroup.add(plane0);
	bkgroup.add(plane1);
	bkgroup.add(plane2);
	
	plane0 = makePlane([1000, 334, 128],  "background0h", materials["highSky"], [2048, 512], [1, 1], false,0);
	plane1 = makePlane([1000, 334, 2176], "background1h", materials["highSky"], [2048, 512], [1, 1], false,0);
	plane2 = makePlane([1000, 334, -1920], "background2h", materials["highSky"], [2048, 512], [1, 1], false,0);
	plane0.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2); 
	plane1.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	plane2.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	bkgroup.add(plane0);
	bkgroup.add(plane1);
	bkgroup.add(plane2);
	/* 1024, -236, 1024 */
	plane0 = makePlane([1000, -490, 128],  "background0w", materials["BG_Water"], [2048, 128], [1, 1], false,0);
	plane1 = makePlane([1000, -490, 2176], "background1w", materials["BG_Water"], [2048, 128], [1, 1], false,0);
	plane2 = makePlane([1000, -490, -1920], "background2w", materials["BG_Water"], [2048, 128], [1, 1], false,0);
	plane0.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2); 
	plane1.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	plane2.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	bkgroup.add(plane0);
	bkgroup.add(plane1);
	bkgroup.add(plane2);
	
	//bkgroup.scale= new THREE.Vector3(1,1,1);
	bkgroup.rotateY(-Math.PI/2);
	scene.add(bkgroup);
	
	//console.log("setupForeground");
	fggroup = new THREE.Group();
	//for (var dist = 10; dist<25;dist+=3) {
	var dist = 1;
	var jitt = rnd(20)-10;
	var foreGround0 = makePlane([dist*2, -18-dist*0.2, -40+jitt ], "foreground0", materials["FG_Grass"], [80, 10], [1, 1], false,0.8);
	var foreGround1 = makePlane([dist*2, -18-dist*0.2, 40+jitt ], "foreground1", materials["FG_Grass"], [80, 10	], [1, 1], false,0.8);
	var foreGround2 = makePlane([dist*2, -18-dist*0.2, 120+jitt ], "foreground2", materials["FG_Grass"], [80, 10], [1, 1], false,0.8);
	foreGround0.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	foreGround1.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2);
	foreGround2.rotation.set(Math.PI/2,-Math.PI/2,Math.PI/2); 
	fggroup.add(foreGround0);
	fggroup.add(foreGround1);
	fggroup.add(foreGround2);
	var foreGround0 = makePlane([dist*2, -28-dist*0.2, -40+jitt ], "foreground0", materials["FG_Grass"], [80, 10], [1, 1], false,0.8);
	var foreGround1 = makePlane([dist*2, -28-dist*0.2, 40+jitt ], "foreground1", materials["FG_Grass"], [80, 10	], [1, 1], false,0.8);
	var foreGround2 = makePlane([dist*2, -28-dist*0.2, 120+jitt ], "foreground2", materials["FG_Grass"], [80, 10], [1, 1], false,0.8);
	foreGround0.rotation.set(Math.PI/2,-Math.PI/2,-Math.PI/2);
	foreGround1.rotation.set(Math.PI/2,-Math.PI/2,-Math.PI/2);
	foreGround2.rotation.set(Math.PI/2,-Math.PI/2,-Math.PI/2); 
	fggroup.add(foreGround0);
	fggroup.add(foreGround1);
	fggroup.add(foreGround2);
	//}
	fggroup.rotateY(-Math.PI/2);
	//fggroup.scale= new THREE.Vector3(1,1,1);
	scene.add(fggroup);
	generateLevel();
	
	slingShotBase = makePlane( [0,-6,-0.5], "SlingShot",  materials["LauncherBase"], [10,14], [1,1], false, 1);
	slingShotBase.rotateY(Math.PI);
	slingShotSeat = makePlane( [1.3,-.3,0.5], "SlingShotSeat", materials["LauncherSeat"], [3,3],   [1,1], false, 1 );
	slingShotSeat.rotateY(Math.PI);

	slingObj = new slingObject();
	playerObj = new player();
	var pad = makePlane([1.5,0.5,0],"player", materials["Jay_0"], [6,6],[1,1],false, 0.95);
	pad.dynamic = true;
	playerObj.obj = pad;
	playerObj.obj.baseAnim = "Jay_";
	startAnim("idle0",playerObj.obj);
	idleStateTime = Date.now()+1000;
	idleState = 0;
	pad.rotateY(Math.PI);

	//preroll = makePlane([10,0.5,-00],"playerPreRoll", materials["Jay_0"], [7.5,7.5],[1,1],false,0);
	//preroll.baseAnim = "Jay_";
	//startAnim("default",preroll, purgePreroll);
	
	changeGameState(0);
	gameState = 1;
	changeGameState(1);
	
	animate();
	setCanvasSize();
	fitGameUI();
	heartBar.reposition();
	revealTitleScreen();
	//render();
	orientLegal();
}

var obstacle2;
resetGame = function(showTitle) {
	
	cameraPos = new THREE.Vector3(5,5,-40);
	playerPos = new THREE.Vector3(0,5,0);
	moveVelocity = new THREE.Vector3(0,0,0);
	fggroup.position.setX(0);
	heartBar.clearPowerups();
	heartBar.setHearts(3);
	heartBar.reposition();
	for (var idx=0; idx<4; idx++){
		heartBar.update();
	}
	gameState = 2;
	flyState = 0;
	gameScore = 0;
	gameScoreField.innerHTML = ""+gameScore;
	gameDistance = 0;
	gameDistField.innerHTML = ""+gameDistance;//+"m";
	isPaused = false;
	if (coinList.length>0) {
		for (var idx = 0; idx< coinList.length; idx++) {
			scene.remove(coinList[idx]);
		}
		coinList = [];
	}
	if (powerupList.length>0) {
		for (var idx = 0; idx< powerupList.length; idx++) {
			scene.remove(powerupList[idx]);
		}
		powerupList = [];
	}
	if (obscacleList.length>0) {
		for (var idx = 0; idx< obscacleList.length; idx++) {
			scene.remove(obscacleList[idx]);
		}
		obscacleList = [];
	}
	scene.remove(obstacle2);
	repopulationRange = -15;
	generateLevel();
	changeGameState(0);
	changeGameState(1);
	if (!showTitle){
		changeGameState(2);
	}
	
}

var repopulationRange = -15;
var rndVList = [5,12.5,10,7.5,17.5,5,10,15];
var rndVIndex = 2;
function generateLevel() {
	
	
	// Place a total of 50 coins, 8 obstacles, and 3 powerups
	var allObstacles = [];
	coinList = [];
	powerupList = [];
	obscacleList = [];
	
	for (var idx = 0; idx<150; idx++) {
		var coin = makePlane([500,5+rnd(30),0],"Coin"+idx,materials["Coin_0"],[3,3],[1,1],false,0.9+idx/1000);
		coin.id = "coin";
		coin.dynamic = true;
		coin.baseAnim = "Coin_";
		startAnim("default",coin);
		coin.rotateY(Math.PI);
		coinList.push(coin);
		allObstacles.push(coin);
	}
	
	
	for (var idx = 0; idx<10; idx++) {
		var powerup = makePlane([500,5+rnd(30),0],"PowerUp"+idx,materials["PowerUp_0"],[3,3],[1,1],false,0.8+idx/1000);
		powerup.id = "powerup";
		powerup.dynamic = true;
		powerup.baseAnim = "PowerUp_";
		startAnim("default",powerup);
		powerup.rotateY(Math.PI);
		powerupList.push(powerup);
		allObstacles.push(powerup);
	}
	/*for (var idx = 0; idx<3; idx++){
		var obId = ["BG_Boat","BG_Enemy_01","BG_Enemy_02"][idx];
		for (var vdx = 0; vdx<6; vdx++) {
			var rndDist = [50,100,150,200][rnd(4)];
			var alt = (idx>0)?5+rnd(60):-rndDist*0.25;
			var obstacle = makePlane([-rnd(3000),alt,rndDist],"Obstacle"+idx+vdx,materials[obId],[32,32],[1,1],false,0.5+idx/1000);
			//console.log(obstacle);
			obstacle.id = "obstacle";	
			obstacle.rotateY(Math.PI);
			obscacleList.push(obstacle);
			//allObstacles.push(obstacle);
		}
	}*/
	//console.log("BG_Puffer:"+materials["BG_Puffer"]);
	//obstacle2 = makePlane([-500-rnd(750),75,250],"BG_PufferBlimp",materials["BG_Puffer"],[256,256],[1,1],false,0.3);
	//obstacle2.id = "obstacle";	
	//obstacle2.rotateY(Math.PI);
	var curPos = new THREE.Vector3(0,0,0);
	var tVel = rndVelocity();
	var nextDrop = 15;
	var nextSkip = 50;
	var tPowerupCount = 5;
	var segment = 0;
	
	var strayIndex = 0;
	var staryPowerupIndex = 0;
	while ( staryPowerupIndex<powerupList.length || strayIndex<coinList.length ) {		
		var rv = rndVList[rndVIndex];
		rndVIndex++;
		if (rndVIndex>7) rndVIndex= 0;
		var sprinklePos = new THREE.Vector3(repopulationRange,rv,0);
		//if (repopulationRange==-15) sprinklePos = new THREE.Vector3(repopulationRange,4+rnd(10),0);
		if (staryPowerupIndex<powerupList.length ) {
			powerupList[staryPowerupIndex].position.copy(sprinklePos);
			staryPowerupIndex++;
		}
		var ringCount = (coinList.length-strayIndex>8?8:coinList.length-strayIndex);
		var arrangement = rnd(4);
		if (arrangement>0) ringCount=Math.min(ringCount,4);
		for (var idx=0; idx<ringCount; idx++) {
			var ang = idx*Math.PI*2.0/ringCount;
			var dist = 4+ringCount/4.0;
			switch (arrangement) {
				case 0:
					coinList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(Math.cos(ang)*dist,Math.sin(ang)*dist,0)));
					break;
				case 1:
					coinList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(-5-5*idx,0,0)));
					break;
				case 2:
					coinList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(0,5+5*idx,0)));
					break;
				case 3:
					coinList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(-4-4*idx,4+4*idx,0)));
					break;
			}
			strayIndex++;
		}
		repopulationRange-=38;
	}
}

function coinCollectCycler() {
	setTimeout(delayedCoinCycler,1);
}
function delayedCoinCycler() {
	if (Math.random()<0.2) {
		playSound("Jay_CoinCollect0"+(rnd(4)+1));
	} else {
		playSound("Jay_CoinCollect");
	}
	
}

//changeGameState
function checkImpacts() {
	var dVec;
	var zero = new THREE.Vector3();
	var picking = false;
	var strayList = [];
	var strayPowerup = [];
	var other = [];
	var tDist;
	var hDist;
	for ( var idx=coinList.length-1; idx>-1 ; idx-- ) {
		var tDist = playerObj.obj.position.distanceTo(coinList[idx].position);
		var hDist = playerObj.obj.position.x-coinList[idx].position.x;
		if (hDist<-80) {
			picking = true;
		}
		if (picking && hDist<-40) {
			strayList.push(coinList[idx]);
		} else {
			if (tDist<5) {
				coinCollectCycler();
				particleSystem.makeParticle(playerPos,zero);
				//scene.remove(coinList[idx]);
				//coinList.splice(idx,1);
				coinList[idx].position.setX(playerObj.obj.positionx+35); 
				gameScore+=10;
				gameScoreField.innerHTML = ""+gameScore;
			} else {
				other.push(coinList[idx]);	
			}
		}
	}
	for ( var idx=powerupList.length-1; idx>-1 ; idx-- ) {		
		var tDist = playerObj.obj.position.distanceTo(powerupList[idx].position);
		var hDist = playerObj.obj.position.x-powerupList[idx].position.x;
		if (hDist<-80) {
			picking = true;
		}
		if (picking && hDist<-40) {
			strayPowerup.push(powerupList[idx]);
		} else {
			if (tDist<4) {
				coinCollectCycler()
				heartBar.boostPowerup();
				gameScore+=100;
				gameScoreField.innerHTML = ""+gameScore;
				particleSystem.makeENEMYParticle(playerPos,zero);
				scene.remove(powerupList[idx]);
				powerupList.splice(idx,1);
			} else {
				//other.push(powerupList[idx]);
			}
		}
	}
	//var range = -100;
	var strayIndex = 0;
	if (strayPowerup.length>0 ||strayList.length>8) {
		while (repopulationRange>playerObj.obj.position.x-40) repopulationRange-=28;
		//repopulationRange = Math.min (repopulationRange,playerObj.obj.position.x-40);
		while ( strayPowerup.length>0 || strayIndex<strayList.length ) {
			var rv = rndVList[rndVIndex];
			rndVIndex++;
			if (rndVIndex>7) rndVIndex= 0;
			var sprinklePos = new THREE.Vector3(repopulationRange,rv,0);//playerObj.obj.position.x+
			if (strayPowerup.length>0 ) strayPowerup.pop().position.copy( sprinklePos );
			var ringCount = (strayList.length-strayIndex>8?8:strayList.length-strayIndex);
			var arrangement = rnd(4);
			if (arrangement>0) {ringCount=Math.min(ringCount,4);}
			for (var idx=0; idx<ringCount; idx++) {
				var ang = idx*Math.PI*2.0/ringCount;
				var dist = 4+ringCount/4.0;

				switch (arrangement) {
					case 0:
						strayList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(Math.cos(ang)*dist,Math.sin(ang)*dist,0)));
						break;
					case 1:
						strayList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(-5*idx-5,0,0)));
						break;
					case 2:
						strayList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(0,5+5*idx,0)));
						break;
					case 3:
						strayList[strayIndex].position.copy( sprinklePos.clone().add(new THREE.Vector3(-4*idx-4,4+4*idx,0)));
						break;
				}
				strayIndex++;
			}
			repopulationRange-=28;	
		}
	}
}


function makeClone(objStr) {
	var object = parseFBX(objStr);

	object.updateMatrix();
	return object;
}

function hitPlayer() {

}

function endCelebration() {
	if (celebrating) {

	}
}

setTimeout(startUpLoaderUI,100);
function startUpLoaderUI(){
	if (startPlayingMenuMusic==0){
		setTimeout(startUpLoaderUI,100);
	}
	if (startPlayingMenuMusic==1){
		playMusic("MenuLoop");
		startPlayingMenuMusic = 2;
	} 
}


function animate() {
	var deltaTime = clock.getDelta();

	window.requestAnimationFrame(animate);
	//if ( preroll!=undefined) {
	//	stepAnimation(preroll);
	//}
	if (!isPaused) {
		if (coinList.length>0)	{
			stepAnimation(coinList[0]);
		}
		if (powerupList.length>0)	stepAnimation(powerupList[0]);
		stepAnimation(playerObj.obj);
		if (particleSystem !== undefined) {
			particleSystem.update(deltaTime);
			//particleSystem.update(deltaTime);
		}
		render();
	} else {
		renderer.render(scene, camera);
	}
}

function render() {
	
	var yScroll = window.scrollY==undefined?window.pageYOffset:window.scrollY;
	if (yScroll!=0) { //|| window.scrollY
		trace("force Scroll:"+yScroll);
		window.scrollTo(0, 0);
	}
	switch (gameState) {
		case 1:
			//bkgroup.position.Set(0,bkgroup.position.y+0.0001,0);
			curScore = 0;
			break;

		case 2:
			switch (flyState) {
				case 0:
					if (Date.now()>idleStateTime) {
						idleStateTime = Date.now()+1000+2000*Math.random();
						idleState++;
						if (idleState>3) {
							idleState = 0;
						}
						startAnim("idle"+idleState, playerObj.obj);
					}
					if (thisTouch.x>-100) {
						var dX = mouse.x - thisTouch.x;
						var dY = mouse.y - thisTouch.y;
						playerPos.x = Math.max(0,Math.min(6,1.5-dX*20));
						playerPos.y = Math.max(-4,Math.min(4,0.5+dY*20));
						
						playerObj.obj.position.copy(playerPos);
					}
					slingObj.update();
					break;
				case 1:
				case 2:
					if (!isPaused) {
						gameDistance = Math.floor(-playerPos.x/4);
						gameDistField.innerHTML = Math.max(0,gameDistance);// + "m";
						checkImpacts();
						moveVelocity.add(gravity);
						playerPos.add(moveVelocity);

						slingObj.update();
						if (flyState===2 && playerPos.y<=groundLevel){
							setCanvasSize();
							flyState = 3;
							heartBar.clearPowerups();
							startAnim("land", playerObj.obj);
							setTimeout(triggerGameOver,2000);
						}
						playerObj.obj.position.copy(playerPos);
					}
					break;
				case 3:
					
					break;	
				default:
					
					break;
			}
			cameraPos = new THREE.Vector3(Math.min(stage.slingH,playerPos.x),Math.max(-8+stage.cameraY,-10+stage.cameraY+playerPos.y*0.65),stage.cameraZ);
			camLookPos.copy(playerPos);
			camLookPos.setY(Math.max(8+stage.cameraY,5+playerPos.y+stage.cameraY));
			camLookPos.setX(Math.min(stage.slingH,playerPos.x));
			camera.position.copy(cameraPos);
			//camera.lookAt(camLookPos);

			if (playerPos.x-fggroup.position.x<-80) {
				fggroup.position.setX(fggroup.position.x-80);
			}
			break;
		case 3:

			
			break;
		case 4:

			break;
	}
	if (heartBar !== undefined) {
		heartBar.update();
	}
	if (levelMeterObj !== undefined) {
		levelMeterObj.update();
	}
	renderer.render(scene, camera);
}
//document.getElementById("json").style.visibility="hidden";
function enemyRemoveListener(e) {
	e.target.removeEventListener('finished', enemyRemoveListener);

	scene.remove(e.target);
}
window.addEventListener("orientationchange", resizeSequence, false);

window.addEventListener("resize", resizeSequence, false);
