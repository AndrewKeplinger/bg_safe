//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- game -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


var animations;
var document_blurred=false;
var Game = function(tCharacter){

	var THREE = window.THREE;
	var oMODELS = window.oMODELS;
	var LEGAL = window.LEGAL;
	var CONTROLS = window.CONTROLS;
	var SCREEN = window.SCREEN;
	
	window.focus();
	//enableGameTouches();
	var me = this;
	

	var playerId = 1;
	me.pieceWidth=20;
	me.shipPieces = [];
	me.moveRate = -0.25;//-0.15;
	me.shipPos	= 0;
	me.nextPiece= -me.pieceWidth;
	me.characterNum = 0; 
	var leftEdge = -me.pieceWidth*1.5;
	var foregroundPieces = false;
	// end delta
		
	var score_holder;
	var powerup_holder;
	var health_holder;
	var fx_System;

	me.score = 0;
	me.level = 1;
	me.difficulty = 0;
	me.is_paused = false;
	me.effectiveMoveRate = 0;
	me.maxRate=-1.0;
	me.acceleration=-0.01
	me.drop_reward = false;
	var is_playing = false;

	var frame_delta = 0;
	var delta;
	var game_time_now = 0;
	var game_actives = [];
	var ObstacleManager;
	var obstacleSets = {};
	
	var shipBuilder = tileDefs;//shipBuilder_sets["L1"];

	var obstaclePatterns = {};  
	//sets of obstacles which can be used together in an arrangement the is possible to jump or duck through
	//Each set defines 3 obstacles with x offsets inside the piece area.  It also defined next possible obstacle patterns.
	
	var device_tilt = 0;

	var resize_updater, frame_updater;

	game_actives = [];

	LEGAL.doHide();

	window.__snds.stopSound("music");
	music_playing = null;

	//create canvas
	var canvas_game = document.getElementById("canvas_game");

	var oGAME = {};

	//var splash_emitter;
	//var cloud_emitter;

	me.left_down = false;
	me.right_down = false;


																					//////////////////////////////
																					//
																					//	doInit
																					//
																					//////////////////////////////

this.doInit = function () {


	oGAME.renderer = canvas_game.renderer || new THREE.WebGLRenderer({
		canvas: canvas_game,
		antialias: true,
		alpha: true,
		shadows: false
	});

	window.trace(oMODELS);
	THREE.ColorManagement.enabled = true;

	//3d scene
	oGAME.scene = new THREE.Scene();

	//camera
	oGAME.camera = new THREE.PerspectiveCamera(40, oSTAGE.screen_width / oSTAGE.screen_height, 0.1, 1500);
	//oGAME.camera.rotateY(0.6);
	oGAME.scene.add(oGAME.camera);
	
	//score holder
	score_holder = new THREE.Group();
	score_holder.position.set(0, 0, -1);
	oGAME.camera.add(score_holder);
	//me.doCreateScoreDigits();

	powerup_holder = new THREE.Group();
	powerup_holder.position.set(0, 0, -1);
	oGAME.camera.add(powerup_holder);
	me.doCreatePowerUpMeter(playerId);

	health_holder = new THREE.Group();
	health_holder.position.set(0, 0, -1);
	oGAME.camera.add(health_holder);
	
	//lights
	var light = new THREE.AmbientLight(new THREE.Color(1,1,1),2);
	oGAME.scene.add(light);
	oGAME.masterLight = light;

	//sky
	//oGAME.scene.background = oMODELS["sky"+playerId];
	//oGAME.scene.background.repeat = new THREE.Vector2((oSTAGE.screen_width / oSTAGE.screen_height) * .25, 1);
	//oGAME.scene.background.wrapS = THREE.RepeatWrapping;

	//create ship
	oGAME.ship = new THREE.Group();
	oGAME.scene.add(oGAME.ship);

	//add deck
	var idx, deck, foreground;	
	me.shipPieces = [];
	oGAME.player = me.doCreatePlayer(1);
	oGAME.ship.add(oGAME.player);
	var hallnames = Object.keys(shipBuilder);
	
	for (idx = 0; idx < hallnames.length; idx++) {
		if (!oMODELS[hallnames[idx]]) {
			console.log(hallnames[idx]);
		}else {
			deck = oMODELS[hallnames[idx]].clone(true);
			deck.rotateY(Math.PI / 2);
			//deck.position.z=-6;
			var npcs = me.setMeshColor(deck);
			deck.castShadow = false;
			deck.receiveShadow = false;		
			shipBuilder[hallnames[idx]].obj = deck;
			shipBuilder[hallnames[idx]].id = hallnames[idx];
			shipBuilder[hallnames[idx]].npcs = npcs;			
		}
	}
	
	//Make a couple extra deck pieces for filler and start section of game
	var zPos = -me.pieceWidth;
	
	var tIndex = idx;
	for (idx = 0; idx < 2; idx++) {
	
		deck = oMODELS[hallnames[idx]].clone(true);
		//deck.position.z=-6;
		deck.rotateY(Math.PI / 2);
		deck.castShadow = false;
		deck.receiveShadow = false;
		me.setMeshColor(deck);
		//shipBuilder[tIndex+idx].obj = deck;
	
		shipBuilder[hallnames[idx]].active = true;
		me.shipPieces.push(shipBuilder[hallnames[idx]]);
		oGAME.ship.add(deck);
		deck.translateZ(zPos);
		zPos += me.pieceWidth;
	}
	me.makeSection(0);
	
	//add blobby
	
	//me.toy_drop_time=oCONFIG.first_toy_drop;
	
	//oGAME.fx_System = new this.doCreateFX();
	
	//ObstacleManager = me.doCreateObstacles();
	// Radial Meters

	me.doUpdateShip(0);

	//camera stuff
	oGAME.camera.position.set(-30, 25, 0); 
	console.log(player.baseX);
	oGAME.player.playerSprite.position.set(1.0*player.baseX,6,0);
	console.log(oGAME.player.playerSprite.position);
	oGAME.player.playerSprite.up.set(0,0,1);
	oGAME.player.playerSprite.lookAt(oGAME.camera.position);
	oGAME.player.playerSprite.setRotationFromEuler( new THREE.Euler(-Math.PI/2,-1,-Math.PI));
	//oGAME.camera.attach(oGAME.player);
	//console.log(oGAME.player.playerSprite.rotation);
	//oGAME.camera.position.set(-200, 150, 0); 
	oGAME.camera.lookAt(new THREE.Vector3(0,10, 0));
	oGAME.player.attach(oGAME.camera);
	//oGAME.camera.lookAt(new THREE.Vector3(30, -20, 0));
	oGAME.renderer.render(oGAME.scene, oGAME.camera);

	me.doResizeUpdate();
	resize_updater = {
		doResizeUpdate: me.doResizeUpdate
	};
	update_queue.push(resize_updater);

	frame_updater = {
		doUpdate: me.doFrameUpdate
	};
	actives.push(frame_updater);

	canvas_game.style.opacity = 1;
	canvas_game.style.display = "block";

	//var end_progress = oMODELS["end_progress"].clone();
	//oGAME.camera.add(end_progress);
	//end_progress.position.set(0,0,0);
	//SCREEN.doShowMessage(oLANG.msg_ready, null);

	//setTimeout(me.doGo, 50);
	
	
	me.doGo();
}
var atlasLibrary = {};
	this.setMeshColor = function(tObj) {		
		var setList = [tObj];
		var step=0;
		var npcs = [];
		while (step<setList.length) {
			if (setList[step].material) {
				
				if (setList[step].material.isMeshLambertMaterial) {
					var mapId = setList[step].material.map.source.data.currentSrc;
					mapId = mapId.substr(mapId.lastIndexOf("/")+1);
					var mat = new THREE.MeshBasicMaterial({
						color: new THREE.Color(0xFFFFFF),
						transparent: true,
						map: setList[step].material.map,
						fog:false,
						depthWrite:true
					});
					//mat.map.colorSpace=THREE.DisplayP3ColorSpace;
					setList[step].material = mat;
					if (mapId=="Enemies.png") {// || mapId=="NPC_Friends.png"
						var model = setList[step];
						var modelName = model.name;
						modelName = modelName.substr(modelName.indexOf("_")+1);
						//if (!atlasLibrary[modelName]) {
							model.animation = new Atlas();
							oMODELS[mapId]= setList[step].material.map;
							model.sprite = model.animation.Init(
								mapId, 
								7, 
								animations["Enemies"],
								"modelName_Atlas",
								"media/sprites/Enemies.json"
							);
							//atlasLibrary[model.name]=model.animation;
							model.animation.remapUVs(model.sprite.geometry,model.geometry);
							//model.sprite.geometry = model.geometry;
							model.sprite.position = model.position;
							//model.sprite.position.y=5;
							model.sprite.rotation = model.rotation;
							model.sprite.scale = model.scale;
							model.parent.attach(model.sprite);
							model.renderOrder = 1;
						model.material = model.sprite.material;
							//model.sprite.visible=false;
							//model.sprite.scale.set( 10, 10, 1 );
							//model.sprite.material.depthWrite=true;
							//console.log(model.material);
							//console.log(model.sprite.material);
							//model.position.y=20000;
							model.sprite.doubleSided = true;
							model.sprite.renderOrder = 1;
						//}
						model.animation.startAnim(modelName+"_Stand");
						model.animation.stepAnimation();
						//model.material=model.sprite.material;
						npcs.push(model);
						console.log(">>>"+model.name);
						//setList[step].position.y=20000;
					} else {
						var model = setList[step];
						switch (model.name) {
							case "NPC_Russ":
								npcs.push(model);
								break;
							case "NPC_Zoe1":
								npcs.push(model);
								break;
							case "NPC_Roman":
								npcs.push(model);
								break;
							case "PU_heart":
								npcs.push(model);								
								break;
							case "PU_bat":
								npcs.push(model);								
								break;
							case "PU_cat":
								npcs.push(model);								
								break;
						}
						if (npcs.length>0) {							
							model.renderOrder = 1;
							//console.log(model.name);
						}
					}
				}
			} 
			for (var idx=0; idx<setList[step].children.length;idx++)
				setList.push(setList[step].children[idx]);
			step++;
		}
		return npcs;
	}

	this.doCreateFX = function() {
		this.fxList=[];
		//window.trace(oMODELS["fx_pickup"]);
		for (var idx=0; idx<oCONFIG.fxCount*2; idx++){
			var modelName = (idx>=oCONFIG.fxCount)?"pickup_fx":"hitfx"; // 
			var obj = oMODELS[modelName].clone(true);
			if (idx>=oCONFIG.fxCount) obj.rotateY(Math.PI/2);
			obj.name = modelName+idx;
			resetClonedSkinnedMeshes(oMODELS[modelName],obj);
			me.setMeshColor(obj);
			obj.fx_active=false;
			//Simplified single animator
			var fx_obj = obj.children[0];	
			fx_obj.mixer = new THREE.AnimationMixer(fx_obj);
			fx_obj.motion=fx_obj.mixer.clipAction(THREE.AnimationUtils.subclip(oMODELS[modelName].children[0].animations[0],"FX",0,60));
			fx_obj.motion.name = "FX";
			fx_obj.motion.loop = THREE.LoopOnce;
			fx_obj.motion.timeScale = 1;
			obj.fx_obj = fx_obj;
			obj.scale.set(2,2,2);
			this.fxList.push(obj);
		}
		this.make_fx = function(pos, fxtype=0) {
			//window.trace("make_fx:"+pos.x+","+pos.y);
			var oof=fxtype*oCONFIG.fxCount;
			for (idx=0; idx<oCONFIG.fxCount; idx++) {
				if (!this.fxList[idx+oof].fx_active) {
					break;
				}
			}
			var obj = this.fxList[idx+oof];
			if (!obj) {
				window.trace(this.fxList);
			}
			obj.fx_active = true;
			obj.end_time = game_time_now + 1;
			oGAME.ship.add(obj);
			obj.position.set(pos.x,pos.y-3,pos.z);
			obj.fx_obj.motion.reset().setEffectiveTimeScale(1).setLoop(THREE.LoopOnce,1).play();
			obj.fx_obj.mixer.update(0.01);
		}
		this.doUpdate = function () {
			for (var idx=0; idx<this.fxList.length; idx++) {
				var obj = this.fxList[idx];
				if (obj.fx_active) {
					obj.fx_obj.mixer.update(frame_delta);		
					if (game_time_now>obj.end_time || obj.fx_obj.motion.paused) {
						obj.fx_active = false;
						obj.position.y = -1000;
						obj.removeFromParent();
					}
				}
			}
		}
		return this;
	};

																					//////////////////////////////
																					//
																					//	doCreatePowerUpMeter
																					//
																					//////////////////////////////
	
	this.doCreatePowerUpMeter = function( id ) {
		
		var sprite_map, sprite;
		
		powerup_holder.centerX = 0;
		powerup_holder.centerY = 0;
		var sFactor = 0.00045;
		var sMult = 0.72;
		var elements = [];
	}
	
																					//////////////////////////////
																					//
																					//	doCreateHealthMeter
																					//
																					//////////////////////////////
	
	this.doCreateHealthMeter = function( id ) {
	
		var offsetAngle = [0,1.0/12,0,1.0/12][id];
		var sprite;
		var centerX = 94;
		var centerY = 94;
		var sFactor = 0.0005;
		var cssBaseCoords;
		me.max_health=playerParams[id].health;
		
		switch(id){  // Adapted from UI PSD file, exported CSS 1156x650 image coordinates
			case 1: //Drac
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_3",  		left: 17,  top: 260,  width: 153,  height: 153, radialMeter: true},
					"PowerMeter" :{
					  image: "Jack_Health",  	left: 17,  top: 260,  width: 153,  height: 153}
				 }
				
				break;
			case 2: //Callum
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_4",  		left: 17,  top: 260,  width: 153,  height: 153, radialMeter: true},
					"PowerMeter" :{
					  image: "Callum_Health",  	left: 17,  top: 260,  width: 153,  height: 153}
				 }
				break;
			case 3: //Frank
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_6",  		left: 17,  top: 260,  width: 153,  height: 153, radialMeter: true},
					"PowerMeter" :{
					  image: "Garcia_Health",  	left: 17,  top: 260,  width: 153,  height: 153}
				 }
				break;			
		}
		var i = 0;
		var cssKeys = Object.keys(cssBaseCoords);
		cssKeys.forEach (function(s) {
			var o = cssBaseCoords[s];
			oMODELS[o.image].wrapS = oMODELS[o.image].wrapT = THREE.ClampToEdgeWrapping;
			oMODELS[o.image].magFilter=THREE.LinearFilter;
			oMODELS[o.image].minFilter=THREE.LinearFilter;
			if (o.radialMeter===true){
				o.sprite_map = health_holder.meterShader = RadialMask(oMODELS[o.image], 1, offsetAngle); 
			} else {
				//o.sprite_map = getMapTranformMaterial(oMODELS[o.image], 0, 0, 1, 1) ;
				o.sprite_map = new THREE.MeshBasicMaterial({
					name:o.image+ "_mat", 
					fog:false,
					transparent:true, 
					map:oMODELS[o.image], 
					side:THREE.FrontSide
				});
			}
			var plane = new THREE.PlaneGeometry(1,1,1,1);
			o.sprite = new THREE.Mesh( plane , o.sprite_map );
			o.sprite.position.set((o.left-centerX+o.width/2)*sFactor,(centerY-o.top-o.height/2)*sFactor, -i * 0.001);
			
			o.sprite.renderOrder = 13-i;
			o.sprite.scale.set(o.width*sFactor, o.height*sFactor, 1);
			i++;
			health_holder.add(o.sprite);
		});
		health_holder.cssBaseCoords = cssBaseCoords;
		
		
		health_holder.updateHealth = function ( ) {			
			health_holder.meterShader.uniforms.tLevel.value = (1.0*player.health/me.max_health);
			health_holder.meterShader.needsUpdate = true;
			
		}
	}
	
	
																					//////////////////////////////
																					//
																					//	doDestroy
																					//
																					//////////////////////////////


	this.doDestroy = function(){

		game_actives = [];
		//oGAME.particle_group.dispose();
	    resize_updater.forget = true;
	    frame_updater.forget = true;
	    
		//clear scene
		if(oGAME.scene){
			while(oGAME.scene.children.length > 0){ 
	    		//oGAME.scene.removeFromParent(oGAME.scene.children[0]); 
				oGAME.scene.children[0].removeFromParent();
			}
		}
		oGAME.scene = null;

		//fade out
		TweenLite.to(canvas_game, 0.5, {opacity: 0, overwrite:true, onComplete:function(){
			canvas_game.style.display = "none";
		}
		});

		is_active = false;
		GAME = null;
	}


																					//////////////////////////////
																					//
																					//	doResizeUpdate
																					//
																					//////////////////////////////

	this.doResizeUpdate = function(){
		oGAME.scene.background = new THREE.Color(oCONFIG.back_color);
		var limit_width = Math.min(oSTAGE.screen_width,oCONFIG.page_land_ratio*oSTAGE.screen_height);
		oGAME.camera.aspect = limit_width / oSTAGE.screen_height;
		oGAME.camera.updateProjectionMatrix();

		var wrapper_ratio = (limit_width / oSTAGE.screen_height);
		//oGAME.scene.background.repeat = new THREE.Vector2(wrapper_ratio * .5, 1);

		oGAME.renderer.setSize(limit_width, oSTAGE.screen_height);
		//oGAME.renderer.setPixelRatio(__utils.getPixelRatio());

		//set camera to fit 20 units witch at 20 units distance (world center)
		var target_width;
		if(oSTAGE.is_landscape){
			target_width = oCONFIG.landscale_target_width;
		}else{
			target_width = oCONFIG.portrait_target_width;
		}
		//oGAME.camera.position.x = -3;

		var cam_dist = 24;
		var renderer_size = new THREE.Vector2(0,0);
		oGAME.renderer.getSize(renderer_size);
		var renderer_ratio = renderer_size.width / renderer_size.height;
		var fov = 2 * Math.atan( ( target_width / renderer_ratio ) / ( 2 * cam_dist ) ) * ( 180 / Math.PI ); // in degrees
		oGAME.camera.fov = fov;
		oGAME.camera.updateProjectionMatrix();

 		var vFOV = oGAME.camera.fov * Math.PI / 180;        // convert vertical fov to radians
		var visible_height = 2 * Math.tan( vFOV / 2 ) * 1; // visible height
		var visible_width = visible_height * renderer_ratio;

		var width_pixel_ratio = visible_width / renderer_size.width;
		var height_pixel_ratio = visible_height / renderer_size.height;
		oSTAGE.pixelRatio = width_pixel_ratio;
		
		//canvas_game.style.left = ((oSTAGE.wrapper_width - renderer_size.width) * 0.5)+"px";
		canvas_game.style.left = ((window.innerWidth - renderer_size.width) * 0.5)+"px";

		var scale_y = Math.tan(oGAME.camera.fov * Math.PI / 180 * 0.5) * cam_dist * 2 ;
 		var scale_x = scale_y * oGAME.camera.aspect;

 		//oGAME.camera.position.y = Math.max(0, -(15 - (scale_y * .5))) + 3.5;
		//oGAME.camera.lookAt.y = oGAME.camera.position.y - 3.5;
		
		oGAME.renderer.render(oGAME.scene, oGAME.camera);
		//oGAME.scene.background =  oMODELS["sky"+playerId];
	}
	function rangeBetween(r1,r2,s1,s2,val) {
		// return value Lerp from r1-r2 based on difference of val between s1-s2
		val = Math.min(s2,Math.max(s1,val));
		var delta = (val-s1)/(s2-s1);
		return  delta*(r2-r1) + r1;
	}

	//----------------------------
	// pause
	//---------------------------

	this.doPause = function(){
		me.is_paused = true;
		var pause_buttons = [
			{snd:"snd_click", msg:oLANG.quit, callback:me.doQuit},
			{snd:"snd_click", msg:oLANG.resume, callback:me.doUnPause}
		];
		new PopupPause(pause_buttons);
	}

	this.doUnPause = function(){
		me.is_paused = false;
	}

	this.doQuit = function(){
		window.__snds.stopSound("music");
		CONTROLS.doHidePause();
		SCREEN = new TitleScreen();
		LEGAL.doShow();
		me.doDestroy();
	}

	
	//----------------------------
	// pause	
	//---------------------------

	this.doPause = function(){
		me.is_paused = true;
		var pause_buttons = [
			{snd:"snd_click", msg:oLANG.quit, callback:me.doQuit},
			{snd:"snd_click", msg:oLANG.resume, callback:me.doUnPause}
		];
		new PopupPause(pause_buttons);
	}

	this.doUnPause = function(){
		me.is_paused = false;
		window.__snds.playSound("music_game_loop", "music", -1, .25);
	}

	this.doQuit = function(){
		window.__snds.stopSound("music");
		CONTROLS.doHidePause();
		SCREEN = new TitleScreen();
		LEGAL.doShow();
		me.doDestroy();
	}

	
	//----------------------------
	// pause
	//---------------------------


	this.doGo = function(){

		trace("GO!");
		//window.clock.start();
		//SCREEN.doShowMessage(oLANG.msg_go, 1);
		
		timer_seconds = 0;
		is_playing = true;
		window.__snds.playSound("music_game_loop", "music", -1, .25);
		CONTROLS.doShowPause();
		me.doResizeUpdate();
		//me.doNextTilt();
	}
	
	var unlockMessage = 0; // calculated in dogameover and passed along in dogotrecap
	this.doGameOver = function(win=false){
		if (game_mode>0) return;
		
		//player.setAnim(player.playerfix+"Hit");
		//player.animation.mixer.update(0.2);
		trace("GAME OVER!");
		
		var progress = powerup_holder.progress;
		window.__snds.stopSound("running");
		
		//SCREEN.doShowMessage(win?oLANG.msg_youwin:oLANG.msg_gameover, null);
		//if (!player.splash) 
		//player.current_motion.setLoop(THREE.LoopRepeat,1);
		game_mode=1;
		is_playing = false;
		player.gravity = oCONFIG.gravity;
		player.jumping=false;
		player.jumpingx2=false;
		player.isFalling=false;
		player.ducking=false;
		player.incy=0;
		if (player.curY<0)player.curY=0;
		player.curY = player.baseY;
		//player.model.position.set(player.curX, player.curY, player.baseZ);
		
		window.oUSER[ "char"+playerId ]=Math.max(window.oUSER[ "char"+playerId ],progress);
	    __localsaver.doSaveData("user", window.oUSER);
		
		var final=oUSER[ "char"+playerId ] > 9 ? 1 : 0;
		if (window.oUSER[ "char1" ]>9&window.oUSER[ "char2" ]>9&window.oUSER[ "char3" ]>9) final = 2;
		
		unlockMessage = {"character":playerId, "progress":progress, "final":final };

		window.__snds.playSound("music_game_end", "music", 1, 0.25);
		CONTROLS.doHidePause();
		setTimeout(me.doGotoRecap, 3000);
	}

	this.doGotoRecap = function(){
		
		window.SCREEN = new RecapScreen(unlockMessage);
		LEGAL.doShow();
		me.doDestroy();
	}
	var proxyObj=-1;
	var endPieceObj = -1;
	this.makeSection = function(turn) {
		player.turning = "";
		console.log("makeSection");
		SCREEN.hideDialog();
		var endLevel = false;
		//clear everything except the last 2, which should be the case
		var endpiece = -1;
		if (turn!=0){
			if (proxyObj!=-1) {
				proxyObj.position.z = -proxyObj.position.z;//removeFromParent();
				//proxyObj.rotateZ(Math.PI);
			}
			if (endPieceObj!=-1) {
				endPieceObj.removeFromParent();
			}
			endpiece=this.shipPieces[0].id;
			while (this.shipPieces.length>1) {
				this.shipPieces[0].obj.removeFromParent();
				this.shipPieces[0].active=false;
				this.shipPieces.splice(0,1);
			}
			this.shipPieces.splice(0,0,{obj:proxyObj});
			var rObj = this.shipPieces[this.shipPieces.length-1];
			if (turn=="left") {
				rObj.obj.rotation.y=0;
			} else {
				rObj.obj.rotation.y=Math.PI;
			}
		}
		
		rObj = this.shipPieces[this.shipPieces.length-1];
		var rndLength = 4+rndInt(6)+(rObj.id.indexOf("city")>-1?4:0);
		var stillAdding = true;
		var changedPlace = false;
		while (stillAdding) {
			var nextPieces = rObj.next.concat([]);// Make sure the list is a copy
			var omitted = [];
			for (var idx=0; idx<this.shipPieces.length; idx++){
				var pIndex = nextPieces.indexOf(this.shipPieces[idx].id)
				if (pIndex>-1) {
					omitted.push(this.shipPieces[idx].id);
					nextPieces.splice(pIndex,1);
				}
			}
			
			var preList = nextPieces.concat([]);
			if (nextPieces.length<1) {
				console.log(rObj);
			}
			for (var idx=nextPieces.length-1;idx>=0;idx--){
				if (idx<nextPieces.length){
					if (turn==0) {
						if (shipBuilder[nextPieces[idx]]) {
							if (nextPieces[idx].indexOf("duck")>-1) {
								omitted.push(nextPieces[idx]);
								nextPieces.splice(idx,1);
							} 
						}
					}
					if (this.shipPieces.length<rndLength || changedPlace) {
						if (shipBuilder[nextPieces[idx]]) {
							if (shipBuilder[nextPieces[idx]].type=="exit" ) {
								omitted.push(nextPieces[idx]);
								nextPieces.splice(idx,1);
							} 
						}
						else {
							console.log(nextPieces);
						}
					} else
					if (this.shipPieces.length>rndLength && nextPieces.length>1) {
						if (shipBuilder[nextPieces[idx]]) {
							if (shipBuilder[nextPieces[idx]].type==undefined) {
								omitted.push(nextPieces[idx]);
								nextPieces.splice(idx,1);
							}
						}
						else {
							console.log(nextPieces[idx]);
						}
					}
				}
			}
			if (nextPieces.length==0) {
				nextPieces=preList;
			}
			
			var nextId = rndInt(Math.max(0, nextPieces.length));
			console.log(nextPieces[nextId]+"<="+omitted);
			var newPiece = shipBuilder[nextPieces[nextId]];
			if (!newPiece) {
				console.log(nextPieces[nextId]);
			}
			
			newPiece.active=true;
			this.shipPieces.push(newPiece);
			var piece = newPiece.obj;
			piece.rotation.y=Math.PI/2;
			oGAME.ship.add(piece);
			piece.position.x = rObj.obj.position.x+this.pieceWidth;
			piece.position.z = rObj.obj.position.z;
			rObj = this.shipPieces[this.shipPieces.length-1];
			stillAdding = rObj.build==undefined;
			if (newPiece.npcs && newPiece.npcs.length>0) {
				var NPC = newPiece.npcs[0];
				NPC.triggered=false;
				switch (NPC.name) {
					case "NPC_HM":
						NPC.animation.startAnim("HM_Stand");
						break;
					case "NPC_RM":
						NPC.animation.startAnim("RM_Stand");
						break;
					case "NPC_PR":
						NPC.animation.startAnim("PR_Stand");
						break;
					case "NPC_Russ":

						break;
					case "NPC_Zoe1":

						break;
					case "NPC_Roman":

						break;
					case "PU_heart":
						NPC.visible=!(player.hasHeart);														
						break;
					case "PU_bat":								
						NPC.visible=player.playerfix!="B";
						break;
					case "PU_cat":	
						NPC.visible=player.playerfix!="C";							
						break;
				}
			}
			if (rObj.type=="exit") changedPlace=true;
		}
		// after adding a corner add a clone of the first tile on it's list
		
		var proxyName = nextPieces[0];//rObj.next[0];
		console.log("proxyName=>"+proxyName);
		proxyObj = shipBuilder[proxyName].obj.clone();
		me.setMeshColor(proxyObj);
		proxyObj.castShadow = false;
		proxyObj.receiveShadow = false;	
		proxyObj.position.x = rObj.obj.position.x;
		if (rObj.build=="left") {
			proxyObj.position.z=rObj.obj.position.z-this.pieceWidth;
			proxyObj.rotation.y=0;
		} else {
			//if (proxyObj.name!="city_right_enter") {
				proxyObj.position.z=rObj.obj.position.z+this.pieceWidth;
				proxyObj.rotation.y=Math.PI;
			//}
		}
		oGAME.ship.add(proxyObj);
		// Add 
		
		if (endpiece!=-1) {
			if (endpiece.indexOf("city")>-1){
				console.log("city");
			}
			rObj = this.shipPieces[0];
			endPieceObj = shipBuilder[endpiece].obj.clone();
			me.setMeshColor(endPieceObj);
			endPieceObj.castShadow = false;
			endPieceObj.receiveShadow = false;	
			oGAME.ship.add(endPieceObj);
			//rObj = this.shipPieces[0];
			endPieceObj.position.x = rObj.obj.position.x;
			if (rObj.build=="left") {
				//endPieceObj.position.z=rObj.obj.position.z-this.pieceWidth;
				//endPieceObj.rotation.y=Math.PI;
			} else {
				//endPieceObj.position.z=rObj.obj.position.z+this.pieceWidth;
				//endPieceObj.rotation.y=0;
			}
		}
		
	}																			
																					//////////////////////////////
																					//
																					//	doUpdateShip
																					//
																					//////////////////////////////
	var hitable = -1;
	this.doUpdateShip = function(movement){
		
		me.shipPos += movement;
		//if (oGAME.scene.background.offset) {
		//	oGAME.scene.background.offset.x += 10*frame_delta* player.sky_scroll*movement;
		//}
		var tScore = me.score = Math.floor(Math.abs(me.shipPos/3));
		/*if (me.score!==tScore && game_mode===0 ) {
			me.score = tScore;
			me.doUpdateGameScore();
		}*/
		oGAME.ship.position.x = me.shipPos;
		oGAME.player.position.x = -me.shipPos-0;
		
		var curTile = this.shipPieces[1];
		var obstacle = curTile.action;
		var impact = (curTile.obj.position.x-oGAME.player.position.x)<-5;
		if (obstacle==undefined && curTile.npcs.length==0 && this.shipPieces[0].npcs) {
			curTile = this.shipPieces[0];
			obstacle = curTile.action;
			impact = (curTile.obj.position.x-oGAME.player.position.x)>3;
		}
		if (curTile.npcs.length>0) {
			for (var idx=0; idx<curTile.npcs.length; idx++) {
				var NPC = curTile.npcs[idx];
				if (impact) {
					//console.log(NPC.name);
					switch (NPC.name ){
						case "NPC_HM":
							if (!NPC.triggered) {
								NPC.triggered=true;
								NPC.animation.startAnim("HM_Punch");
								player.hit();
							}
							break;
						case "NPC_RM":
							if (!NPC.triggered) {
								NPC.triggered=true;
								NPC.animation.startAnim("RM_Punch");
								player.hit();
							}
							break;
						case "NPC_PR":
							if (!NPC.triggered) {
								NPC.triggered=true;
								NPC.animation.startAnim("PR_Punch");
								player.hit();
							}
							break;
						case "PU_heart":
							if (!player.hasHeart && NPC.visible) {
								NPC.visible=false;
								console.log("get heart");
								player.hasHeart=true;
							} 						
							break;
						case "PU_bat":								
							if (player.playerfix!="B" && NPC.visible) {						
								NPC.visible=false;
								player.playerfix="B";
								player.animation.startAnim("BRun");
								player.animation.stepAnimation();
								console.log("get bat");
							} 							
							break;
						case "PU_cat":							
							if (player.playerfix!="C" && NPC.visible) {
								NPC.visible=false;
								player.playerfix="C";
								player.animation.startAnim("CRun");
								player.animation.stepAnimation();
								console.log("get cat");
							} 								
							break;
					}
				} else {
					if (NPC && !NPC.triggered) {
						hittable = NPC;
						//console.log("hitable "+NPC.name);
					}
				}
			}
		} else {
			hittable = -1;
		}
		if (obstacle!=undefined && impact) {			
			switch (obstacle) {
				case "duck":
					if (!player.ducking) {
						player.hit();
					}
					break;
				case "pit":
					
					if (!player.jumping) {
						player.hit();
					}
					break;
				case "jump":
					
					if (!player.jumping) {
						player.hit();
					}
					break;
			}	
		}
		
		if (this.shipPieces.length>6) {
			var npcs = this.shipPieces[6].npcs;
			if (npcs.length>0) {
				var thisNPC = npcs[0];
				SCREEN.showDialog(thisNPC.name,thisNPC.name);
			}
		}
		
		//player.ground = 0;
		/*var track_position=Math.floor(((oCONFIG.platform_offset-oGAME.ship.position.x)%20)/6.66);
		//window.trace(track_position);
		if ( this.shipPieces[1].id===6 ) {
			if (track_position==2) player.ground = -10;
		}
		if ( this.shipPieces[1].id===11 && (track_position==1)) {
			 player.ground = -10;
		}
		if ( this.shipPieces[0].id===11 && track_position==0 ) { 
			player.ground = -10;
		} 
		/*if ( this.shipPieces[1].id===7 || this.shipPieces[1].id===8 ) {
			player.ground = (this.shipPieces[1].obj.position.x + me.shipPos < -13)?0:-1;
		}* /
		
		if (oGround !== player.ground) {
			if ( player.ground<0 && !player.jumping ) {
				window.trace("fall1");
				player.splash=false;
				//player.isFalling=true;
				player.jumping=true;
				player.jumpingx2=false;
				//player.curY=-1;
				me.effectiveMoveRate=0.01;
				player.animation.startAnim("JumpStart");
				player.incy = -0.5;
			} else {
				player.curY=Math.max(player.baseY,player.curY);
			}
		} else {
			if (player.curY<-1 && player.jumping ){
				//player.inPit();
			}
		}
		*/
		// Remove old ship sections
		/*
		We need to do a few things here
		1. Don't do anything if player hasn't reached a corner.  
		2. 
		
		*/
		
		if (this.shipPieces[0].obj.position.x+me.shipPos<leftEdge) {
			this.shipPieces[0].obj.removeFromParent();
			this.shipPieces[0].active=false;
			this.shipPieces.splice(0,1);
		}
		if (this.shipPieces[0].build && this.shipPieces.length<4) {
			if (this.shipPieces[0].build==player.turning) {
				player.setAnim(player.playerfix+"Turn"+player.turning.substring(0,1));
				me.moveRate=Math.max(me.moveRate+me.acceleration,me.maxRate);
				me.makeSection(this.shipPieces[0].build);
			} else {
				player.hit();
				if (game_mode==0) {
					player.setAnim(player.playerfix+"Turn"+this.shipPieces[0].build.substring(0,1));
					me.moveRate=Math.max(me.moveRate+me.acceleration,me.maxRate);
					me.makeSection(this.shipPieces[0].build);
				}
			}
		}
		// New logic.  Always build up to next hallway turn or exit.
		//groups of maybe 7 then force a door, then stop.  Add a corner piece for continuity
		
			/*var tObjs = [].concat(obstacleSets[tType]);
			if (newPiece.no && newPiece.no.length>0) {
				for (var idx=0; idx<newPiece.no.length; idx++) {
					for (var zzz=0; zzz<tObjs.length; zzz++){
						if (tObjs[zzz].name==newPiece.no[idx])
						{
							tObjs.splice(zzz,1);
						}
					}
				}
			}
			if (tObjs!==undefined && tObjs.length>0) {
				var obCount = (0.4+me.score*.02)>Math.random()?1:0;
				var xJitter = 0; // Math.min(me.score*.02,8);
				var obsPlace = 0;
				tObjs = tObjs.concat([]);
				if (game_time_now<oCONFIG.first_toy_drop ||  player.toy_time>-1 || me.toy_delay>-1) {					
					me.toy_delay-=1;
					for (var idx=tObjs.length-1;idx>=0;idx--) {
						if (tObjs[idx].mode=="toy") tObjs.splice(idx,1);
					}
				}
				if ( player.toy_time>-1 || me.drop_reward) {		
					obCount=1;
					for (var idx=tObjs.length-1;idx>=0;idx--) {
						if ( tObjs[idx].mode!="po") tObjs.splice(idx,1);//tObjs[idx].mode!="hi" &&
					}
				}
				
				xJitter = Math.random()*xJitter-(xJitter/2);
				if (obCount==1 && me.score>100) {
					obCount = (me.score*.001)>Math.random()?2:1;
				}	
				if (newPiece.pits) {
					obsPlace=newPiece.pits;
				}
				var placement = piece.position.clone(true);
				placement.z+=4;
				var firstType = "";
				obCount=Math.min(1,obCount);
				while ( obCount-- > 0 && tObjs.length>0) {
					if (shipBuilder[nextId].x!==undefined){
						placement.x+=shipBuilder[nextId].x;						
					}
					var picked = rndInt(tObjs.length);
					if (game_time_now>me.toy_drop_time) {
						var tList = [];
						for (var idx=0;idx<tObjs.length;idx++) {
							if (tObjs[idx].mode=="toy"){
								tList.push(idx);
							}
						}
						if (tList.length>0) picked=tList[rndInt(tList.length)];
					}
					
					var tObj = tObjs[picked];
					if (!tObj) {
						window.trace("INVALID OBJECT TO POPULATE");
						break;
					}
					// pick based on frequency
					var reject=Math.random()>tObj.o;
					while ( tObjs.length>1 && (tObj.active || reject || last_mode==tObj.mode)) {
						if (!reject) {
							tObjs.splice(tObjs.indexOf(tObj),1);
						} 
						tObj = tObjs[rndInt(tObjs.length)];
						reject=Math.random()>tObj.o;
					}
					last_mode=tObj.mode;
					if (tObj.active) break;
					firstType = tObj.mode;
					if (!tObj.active){
						trace("Generate:"+nextId+" "+tObj.id+" "+obsPlace );
						//Pick an open spot
						var piece_position = new THREE.Vector3(xJitter+piece.position.x+obsPlace,placement.y,player.baseZ);
						//if (tObj.hx)xJitter+=tObj.hx;
						var piece_hit = new THREE.Vector3(xJitter+piece.position.x+obsPlace,tObj.y+0.5+tObj.s/2,player.baseZ);	
						if (tObj.mode=="toy") me.toy_drop_time = game_time_now+(oCONFIG.toy_duration*2);
						 ///////////////////////////////////////////////////////////////////////////////// 
						/////////////////////////////////////////////////////////////////////////////////
						ObstacleManager.init(
							tObj,
							piece_hit,
							1.0*tObj.s,
							piece_position
						);						
					} else {
						//window.trace(tObj);
					
					}
					for (var idx = tObjs.length-1; idx>=0; idx--) {
						if (tObjs[idx].mode==firstType ) {
							tObjs.splice(idx,1);
						}
					}
					if (me.drop_reward) {
						me.drop_reward=false;
						obCount=1;
					}
				}
			}
		}*/
	};

																					//////////////////////////////
																					//
																					//	doCreatePlayer
																					//
																					//////////////////////////////
	
	var player;
	this.doCreatePlayer = function( playerNum ){
		
		player = new THREE.Group();	
		player.incy = 0;
		player.curX = player.targetX = 0;
		player.jumping = false;
		player.ducking = false;
		player.splash  = false;
		player.powerupTriggered = false;
		player.chargeLevel = 0;
		player.resetting   = false;
		player.ground = 0;
		player.sliding = -1;
		player.slidePause = -1;
		player.punching = -1;
		player.punchPause = -1;
		player.playerfix="";
		player.gravity = oCONFIG.gravity;
		player.hasHeart		= false;
		player.turning		= "";
		
		player.animation = new Atlas();
		
		player.health 		= playerParams[playerNum].health;
		me.moveRate 		= me.baseMoveRate 	= playerParams[playerNum].moveRate;
		me.acceleration		= playerParams[playerNum].acceleration;
		me.maxRate			= playerParams[playerNum].maxRate;
		player.jumpMoveRate = playerParams[playerNum].jumpMoveRate;
		player.brakeMoveRate = playerParams[playerNum].brakeMoveRate;
		player.baseY 		= player.curY 		= playerParams[playerNum].baseY;
		player.spriteScale	= playerParams[playerNum].spriteScale;
		player.jumpImpulse  = playerParams[playerNum].jumpImpulse;
		player.baseZ 		= playerParams[playerNum].baseZ;
		player.baseX 		= playerParams[playerNum].baseX;
		player.runSound		= playerParams[playerNum].runSound;
		player.duckSound	= playerParams[playerNum].duckSound;
		player.specialSound	= playerParams[playerNum].specialSound;
		player.slideDuration= playerParams[playerNum].slideDuration;
		player.slideDelay	= playerParams[playerNum].slideDelay;
		player.punchDuration= playerParams[playerNum].punchDuration;
		player.punchDelay	= playerParams[playerNum].punchDelay;
		
		if (window.oVARS.spriteScale) {
			player.spriteScale=window.oVARS.spriteScale;
		}
		if (window.oVARS.baseY) {
			player.baseY=window.oVARS.baseY;
		}
		if (window.oVARS.baseX) {
			player.baseX=window.oVARS.baseX;
		}
		
		player.playerSprite = player.animation.Init(
			"hank_", 
			player.spriteScale, 
			animations["Hank"],
			"Hank_Atlas",
			"media/sprites/hank_.json"
		);
		player.animation.startAnim("Run");
		player.add(player.playerSprite);
		//player.position.set(10,10,0);
		//player.playerSprite.rotateY(Math.PI);
		//player.scale.set( player.baseY*1, player.baseY*1, 1 );
		player.playerSprite.scale.set( player.baseY*1, player.baseY*1, 1 );
		player.playerSprite.doubleSided = true;
		player.playerSprite.renderOrder = 1;

		player.isFalling = false;
		player.immuneTime = 0;
		me.playerObj = player;
		player.doUpdate = function(){
			//=new THREE.Vector3(-25,22,0);
			//console.log(player.playerSprite.position);
			if (game_mode>0) {
				player.animation.stepAnimation();
				return;
			}
			//player.playerSprite.position.set(player.curX, player.curY, player.baseZ);
			
			/*
			if (player.animation_fix) {
				player.setAnim("Stand");
				player.animation_fix=false;
				return;
			}
			if (game_mode>0) {
				player.animation.stepAnimation();
				return;
			}
			if (player.toy_time>-1) {
				if (game_time_now>player.toy_time){
					player.release_toy();
				}
			}
			
			if (player.splash) {
				//splash_emitter.disable();
				me.moveRate*=.95;
				if (player.curY<-3) player.inPit();
				//player.inPit();
			} else {
				var tGrav = player.gravity;
				var tJMove = player.jumpMoveRate;
				if (player.toy_time>-1) {
					var toy_effects = oTOYS[player.toyObj.name];
					tJMove *= toy_effects.j_mod;
					me.effectiveMoveRate=me.effectiveMoveRate*.95+(me.baseMoveRate*0.05*toy_effects.r_mod);
					player.incy *= toy_effects.j_dampen;
					tGrav = player.gravity*toy_effects.g_mod;
					if (player.curY>18) {
						player.curY = 18;
						player.incy = 0;
					}
					player.toyObj.obj.rotation.x = 0.2*player.incy;
					switch (player.toyObj.name) {
						case "car":
							break;
						case "drone":
							player.jumpingx2=false;
							break;
						case "snowmobile":
							break;
					}
				}
			
				player.curX = player.curX*0.975+player.targetX*0.025;
				*/
				var tGrav = player.gravity;
				if (player.jumping) {
					
					player.curY += player.incy;
					player.incy +=tGrav*frame_delta*80;
					//window.trace(player.animation.currentAnim+" "+player.incy);
					switch (player.jumpPhase){
						case 0:
							player.jumpPhase=1;
							player.setAnim(player.playerfix+"JumpStart");
							break;
						case 1:
							if (player.incy<0.2) {
								player.jumpPhase=2;
								player.setAnim(player.playerfix+"InAir");
							}
							break;
						case 2:
							if (player.incy<-0.1) {
								player.jumpPhase=3;
								//player.setAnim(player.playerfix+"InAir");
							}
							break;
					}
					
					//if (player.curY<player.baseY+player.ground && player.incy<0) {
					if (player.curY<player.baseY && player.incy<0) {
						
						//console.log("Land");
						player.curY=player.baseY;//player.baseY+player.ground;
						//player.setAnim("Land");
						player.jumping= false;
						player.jumpingx2=false;
						player.restarting=false;
						player.incy=0;
						//me.moveRate = me.baseMoveRate;
					} else {
						//console.log("Jumping");
					}
					player.playerSprite.position.y=player.curY;
					//me.playerObj.position.set(0, player.curY,0);

				} else {
					//me.playerObj.position.set(0, player.curY,0 );
					if ( player.ground<0 && !player.onFloatie && !player.restarting ) {
						player.splash = true;
						player.jumping = false;
						player.jumpingx2 = false;
						player.setAnim("Splash");
						window.trace("SPLASH!");
						//player.hit();
						//var fxpos = oGAME.ship.position.clone();
						//fxpos.x=-fxpos.x;
						//fxpos.y+=4;
						//oGAME.fx_System.make_fx(rndVector3(fxpos,2,2));
						//splash_emitter.position.value= new THREE.Vector3(-7,0,0);
						//splash_emitter.enable();
					}
				}
			
			
			player.animation.stepAnimation();
		};
		/*
		player.inPit = function() {
			player.splash=false;
			player.jumping=true;
			player.jumpingx2=false;
			player.setAnim("Splash");
			player.incy = 0.75;
			player.curY = 0.5;
			player.model.position.set(player.curX, player.curY, player.baseZ);
			window.trace("SPLASH!");
			var sndName = rndInt(2)==0?"Red_Hit":"Red_Hit2";
			window.__snds.playSound(sndName, "sfx", 1, 0.25);
			player.hit();
			var fxpos = oGAME.ship.position.clone();
			fxpos.x=-fxpos.x;
			fxpos.y+=4;
			for (var idx=0;idx<2;idx++){				
				oGAME.fx_System.make_fx(rndVector3(fxpos,4,4));
			}
		}*/
		player.setAnim = function(animName) {
			if (game_mode!==0) return;
			console.log(animName);
			if (player.animation.currentAnim!==animName) 
				player.animation.startAnim(animName);
		};
		
		player.slide = function() {
			if (game_time_now>player.slidePause) {
				player.sliding = game_time_now+player.slideDuration
				player.slidePause = player.sliding+player.slideDelay;
				player.setAnim(player.playerfix+"Slide");
				player.ducking=true;
			} else {
				
			}
		}
		
		player.jump = function() {
			if (!player.jumping) {
				player.ducking=false;
				player.jumping = true;
				player.jumpingx2 = false;
				player.curY = player.baseY;
				player.jumpPhase = 0;
				//player.on_box = false;
				if (platform.isMobile)
					player.incy = 1.25*player.jumpImpulse;
				else				
					player.incy = player.jumpImpulse;
			}
		};
		player.hit = function() {
			//player.release_toy();
			player.curY = player.baseY;
			player.incy = 0;
			player.jumping = false;
			player.ducking = false;
			if (game_time_now>player.immuneTime) {
				player.immuneTime=game_time_now+1;
				if (player.hasHeart) {
					player.setAnim(player.playerfix+"Hit");
					player.hasHeart=false;
				} else {
					if (player.playerfix) {
						player.setAnim(player.playerfix+"Hit");
						player.playerfix="";
					} else {
						player.setAnim("Hit");
						player.ducking = false;
								//window.trace("hit powerupTriggered");
						player.powerupTriggered=false;
						player.targetX=0;
						player.health--;
						if (player.health<=0) {
							me.doGameOver();
						} else {

						}
					}
				}
				//health_holder.updateHealth();
				player.animation.stepAnimation();
			}
		}
		/*
		player.toy_time=-1;//Date.now()+oCONFIG.toy_duration;
		player.pickup = function(tObj) {
			switch (tObj.name) {
				case "pickup_fulllife":
					window.__snds.playSound("pickup_health", "sfx", 1, 0.25);
													
					player.health=me.max_health;
					health_holder.updateHealth();
					break;
				case "pickup_onelife":
					window.__snds.playSound("pickup_health", "sfx", 1, 0.25);
					player.health+=1;
					player.health = Math.min(player.health,me.max_health);
					health_holder.updateHealth();
					break;
				case "pickup_progress":
					window.__snds.playSound("pickup_progress", "sfx", 1, 0.25);
					powerup_holder.progress++;
					powerup_holder.doUpdate();
					if (powerup_holder.progress>9) {
						player.setAnim("Stand");
						var tObj = player.toyObj;
						player.release_toy();
						player.toyObj = tObj;
						me.doGameOver(true);
						
					}
					break;
				case "drone":
					tObj.obj.rotation.y=0;
					tObj.obj.scale.set(1,1,1);
					player.trigger_toy(tObj);
					break;
				case "car":					
					tObj.obj.rotation.y=0;//(Math.PI/2);
					tObj.obj.scale.set(1,1,1);
					player.trigger_toy(tObj);
					break;
				case "snowmobile":
					tObj.obj.rotation.y=0;//(Math.PI/2);
					tObj.obj.scale.set(1,1,1);
					player.trigger_toy(tObj);
					break;
			}
		}
		player.toyObj=-1;
		player.trigger_toy = function(tObj){
			window.trace("trigger_toy");
			window.__snds.playSound("music_toy_loop", "music", -1, .25);
			if (player.toyObj!=-1) player.release_toy();
			player.toy_time = game_time_now + oCONFIG.toy_duration;
			//tObj.obj.removeFromParent();
			
			for (var idx=0;idx<4;idx++){				
				oGAME.fx_System.make_fx(rndVector3(tObj.obj.position.clone(),5,3),true);
			}
			tObj.obj.position.set(0,0,0);
			player.model.add(tObj.obj);
			player.model.children[0].scale.set(0.01,0.01,0.01);
			tObj.obj.position.set(0,0,0);
			tObj.obj.rotation.set(0,0,0);
			player.toyObj=tObj;
			//tObj.obj.rotation.y=Math.PI;
			//window.trace(player.model);
		}
		player.release_toy = function(){
			window.__snds.playSound("music_game_loop", "music", -1, .25);
			//window.trace(player.model);
			if (player.toyObj && player.toyObj.obj && player.toyObj.obj.removeFromParent) {
				player.toyObj.obj.removeFromParent();
				oGAME.ship.add(player.toyObj.obj);
				player.toyObj.obj.position.set(-oGAME.ship.position.x-10,player.curY,0);
				//player.toyObj.obj.rotation.set(0,Math.PI/2,0);
				player.toyObj.spin_away=true;
				player.toyObj.obj.scale.set( 0.5,0.5,0.5 );
				player.toyObj.active=true;
				//player.toyObj.active=false;
				//player.toyObj.y=-1000;	
				for (var idx=0;idx<4;idx++){				
					oGAME.fx_System.make_fx(rndVector3(player.toyObj.obj.clone(),5,3),true);
				}
			}
			player.model.children[0].scale.set(1,1,1);
			player.toy_time=-1;
			player.toyObj=-1;
		}
		player.restartPlayer = function( water ){  // This is the player coming out of water
			if (!player.restarting){
				player.restarting = true;
				player.curX -=6;
				player.curY = player.baseY;
				player.jumping = true;
				player.ducking=false;
				powerupTriggered=false;
				player.incy = player.jumpImpulse;
				player.splash = false;
				player.setAnim("JumpStart");
				//splash_emitter.position.value= new THREE.Vector3(-10,0,0);
				//splash_emitter.enable();
			}
		}
		*/
		player.animation.startAnim("Run");
		//player.animation.stepAnimation();
		game_actives.push(player);

		return player;
	}

	// Obstacle library, limted number of obstacles drawing graphics from a single Atlas.
	/*
	
																					//////////////////////////////
																					//
																					//	doCreateObstacles
																					//
																					//////////////////////////////
	
	*/
	this.doCreateObstacles = function() {
		// three potential obstacles per section, 12 total? Maybe too many.
		// three power ups
		// 1 Henchman
		
		this.objs = [];
		var minime = this;
		this.curObject = 0;
		obstacleSets = {};
		var def1 = animations["Obstacles_"+playerId];
		var def2 = animations["PickUps"];
		const sourceDefs = {...def1, ...def2};
		me.toy_delay=-1;
		
		var objKeys = Object.keys(sourceDefs);
		this.numObjs = objKeys.length;
		objKeys.forEach( function(key){
			var tObj = sourceDefs[key];
			if (tObj.chain===undefined) tObj.chain="";
			tObj.is3D = true;
			tObj.hittable = true;
			
			if (!oMODELS[tObj.name]) {
				window.trace(oMODELS[tObj.name]);
			}
			if (tObj.mode=="hench") {
				tObj.obj = oMODELS[tObj.name].clone(true);
			} else {
				tObj.obj = oMODELS[tObj.name].clone(true);
			}
			
			tObj.obj.rotateY(Math.PI/2);
			me.setMeshColor(tObj.obj);
			if (tObj.mode=="po") {
				
			}
			tObj.isAnimated = false; 
			if ( tObj.mode=="toy" ) {
				tObj.isAnimated = true;
				tObj.scoring = 0;
			}
			if ( tObj.mode=="hench" ) {
				tObj.isAnimated = true;
				tObj.obj.rotateY(Math.PI);
				tObj.dying=0;
			}
			if (tObj.obj.children && tObj.obj.children[0].animations.length<1) tObj.isAnimated=false;
			if ( tObj.isAnimated ) { 
				resetClonedSkinnedMeshes(oMODELS[tObj.name],tObj.obj);
				var henchman = tObj.obj.children[0];
				var mAnim = animations[tObj.def];

				henchman.mixer = new THREE.AnimationMixer(henchman);
				var motions={};
				var animKeys = Object.keys(mAnim);
				var animDefault = animKeys[0];
				for (var idx=0; idx<animKeys.length; idx++ ) {
					var def = mAnim[animKeys[idx]];
					motions[animKeys[idx]]=henchman.mixer.clipAction(THREE.AnimationUtils.subclip(henchman.animations[0],animKeys[idx], def.frames[0],def.frames[1]));
					//window.trace(def);
					//window.trace(motions[animKeys[idx]]);
					motions[animKeys[idx]].name = animKeys[idx];
					motions[animKeys[idx]].loop = def.loop?THREE.LoopRepeat:THREE.LoopOnce;
					
				}

				tObj.animation = {
					def:mAnim,
					looping:true,
					model:henchman,
					mixer:henchman.mixer,
					motions:motions,
					startAnim:function(which, options = {"loop":false, "fade":0.01})
					{
						//window.trace("hench anim "+which);
						options.speed = 1;//options.speed || oCONFIG.animation_multiplier;
						options.loop = tObj.animation.def[which].loop?THREE.LoopRepeat:THREE.LoopOnce;
						
						if(tObj.current_motion.name == which){
							tObj.current_motion.loop = options.loop;
							tObj.current_motion.paused = false;
							tObj.current_motion.play();
							return;
						}						
						
						tObj.current_motion.fadeOut(0.1).setEffectiveWeight(0);
						var new_motion = tObj.animation.motions[which];
						
						if (!tObj.animation.def[which]) {
							window.trace("Anim missing "+which);
						} else {
							if(options.loop==THREE.LoopRepeat){
								tObj.current_motion = new_motion.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).setLoop(THREE.LoopRepeat,1000).play();								
							}else{	
								new_motion.clampWhenFinished=true;
								tObj.current_motion = new_motion.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).setLoop(THREE.LoopOnce,1).play();								
							}
							//tObj.animation.mixer.update(0.01);
							//return new_motion.getClip().duration * (1/options.speed);
						}
					},
					currentAnim:function(){return tObj.current_motion.name;},
					anim_status:function() {return tObj.current_motion.paused;},
					stepAnimation:function(){
						//window.trace("hench "+tObj.current_motion.name+" "+tObj.animation.mixer.time);
						tObj.animation.mixer.update(frame_delta);				
					}
				};
				tObj.current_motion = motions[animDefault].reset().play(); //"idle"+playerId
				tObj.animation.mixer.update(0.1);
			}
			tObj.obj.castShadow = false;
			tObj.obj.receiveShadow = false;
			
			
			tObj.id = key;
			var tType=[tObj.type];
			if (tObj.type==="all") {
				tType=Object.keys(obstacleSets);
			} else {
				if (tObj.type.indexOf(",")>-1) tType=tObj.type.split(",");
			}
			for (var idx=0; idx<tType.length;idx++){
				if (obstacleSets[tType[idx]] === undefined) {
					obstacleSets[tType[idx]] = [sourceDefs[key]];
				} else {
					obstacleSets[tType[idx]].push(sourceDefs[key]);
				}
			}
			tObj.obj.name = tObj.name;
			tObj.active = false;
			minime.objs.push(tObj);
		});
		
		this.init = function(animObj, loc, scale, piecePos) {
			var tObj = animObj;
			
			tObj.hitPos = loc;
			tObj.active = true;
			tObj.animationTime = 0;
			if (tObj.is3D) {
				tObj.obj.position.set( piecePos.x, piecePos.y+tObj.y-3, piecePos.z );
				tObj.hitPos.x = tObj.obj.position.x;
				switch (tObj.mode) {
					case "hench":						
						tObj.obj.rotation.set(0,-Math.PI/2,0);
						tObj.animation.startAnim("idle"+(rndInt(2)+2));
						tObj.animation.motions.hit.stop().setEffectiveWeight(0);
						tObj.animation.motions.punch.stop().setEffectiveWeight(0);
						tObj.henchpunch=8+rndInt(5);
						tObj.dying=0;
						tObj.animation_fix=true;
						break;
					case "toy":		
						me.toy_delay=oCONFIG.toy_drop_delay;	
						window.trace(tObj.obj.rotation);
						tObj.obj.scale.set( 0.5,0.5,0.5 );
						tObj.obj.rotation.set(0,Math.PI/2,0);
						//tObj.obj.rotation.y=Math.PI/2;
						tObj.spin_away=false;
						//tObj.obj.position.y=15;
						break;
					case "po":
						tObj.scoring = 0;
						tObj.obj.position.y = tObj.hitPos.y = 5+rndInt(12);
						tObj.obj.rotation.set(0,0,0);
						//tObj.hitPos.y=tObj.obj.position.y;
						break;
				}
				//tObj.obj.scale.set(piecePos.x,piecePos.y,piecePos.z);
				oGAME.ship.add(tObj.obj);
			} 
		}

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.doUpdate = function() {
			var tObj;
			player.onFloatie=false;
			//var prionbox = player.on_box;
			//var still_on_box = false;
			var tPlayer_pos = player.model.localToWorld(new THREE.Vector3());
			tPlayer_pos.y+=3;
			for (var idx=0; idx<me.numObjs; idx++) {
				tObj = minime.objs[idx];
				if (!tObj.obj.parent) continue;
				if (tObj.active) {
					if (tObj.scoring>0 || tObj.spin_away==true) {
						if (tObj.spin_away) {
							//tObj.obj.rotateZ(frame_delta);
						} else {
							if (tObj.obj.position.y>15){
								player.pickup(tObj);							
								//oGAME.fx_System.make_fx(tObj.obj.position,1);
								tObj.active=false;
								tObj.scoring=0;
								tObj.obj.position.y=-1000;
							} else {
								tObj.obj.rotateZ+=0.4;
								tObj.obj.position.y+=1;
							}
						}
					} else {		
						var tObj_pos = tObj.obj.localToWorld(new THREE.Vector3());
						if (tObj.hx) {
							if (tObj_pos.x-tObj.hx>tPlayer_pos.x){
								tObj_pos.x -= tObj.hx;
							} else if (tObj_pos.x+tObj.hx<tPlayer_pos.x){
								tObj_pos.x += tObj.hx;
							}
						}
						var t_dist = tPlayer_pos.distanceTo(tObj_pos);
						var vOffset = Math.abs(tObj.obj.position.y-player.model.position.y);
						//var pOffset = new THREE.Vector2(tObj.hitPos.x+me.shipPos+12-player.curX,tObj.obj.position.y-player.model.position.y).length()*0.1;
						var hOffset = Math.abs(tObj.hitPos.x+me.shipPos+12-player.curX);					
						if (tObj.isAnimated) { // tObj.mode=="hench") {
							var tY = tObj.hitPos.y;
							tObj.obj.position.set(tObj.hitPos.x,tY,tObj.hitPos.z);
							switch (tObj.mode) {
								case "hench":
									if (tObj.animation_fix) {
										tObj.animation.startAnim("idle"+(rndInt(3)+1));
										tObj.animation_fix=false;
									}
									if (tObj.animation.currentAnim()!="hit" && hOffset<tObj.henchpunch ) {
										/*if (tObj.dying<=0){
										} else {	
										}*/
									} else {
										//window.trace(Date.now());
										if (tObj.dying>0)
										{
											tObj.animation.mixer.update(frame_delta);
											tObj.dying-=frame_delta;
											if (tObj.dying<=0) {
												tObj.dying=-1;
												tObj.current_motion.setEffectiveTimeScale(0.5);
												//tObj.current_motion.halt(0.02);
												oGAME.fx_System.make_fx(tObj.obj.position,1);
												//window.trace("halt");//animation.startAnim("down");
											}
											//tObj.animation.stepAnimation();
										}
									}
									break;
								case "toy":
									tObj.obj.rotateY(-frame_delta*oCONFIG.pickup_rotate_rate);
									break;								
							}					
							//tObj.animation.stepAnimation();
						} else {
							switch (tObj.mode) {
								case "po":
									tObj.obj.rotateY(-frame_delta*oCONFIG.pickup_rotate_rate);
									break;
							}
						}		 					
						if ( tObj.hittable ) {
							var playerIsHit = false;
							//if (hOffset<tObj.w && game_mode===0 && vOffset<3){//} && vOffset<6) { // ||(playerId===1&&player.powerupTriggered&&hOffset<10) 
							if (game_mode===0 && t_dist<oCONFIG.hit_distance) {
								//window.trace(tObj.name+"  "+vOffset + "  "+ hOffset);
								
								switch (tObj.mode) {
									case "hench":
										if (tObj.dying==0) {
											if (!player.jumpingx2 || player.model.position.y<10){
												if (player.powerupTriggered || player.ducking) {
													tObj.animation.startAnim("hit");
													
													oGAME.fx_System.make_fx(tObj.obj.position,1);
													window.__snds.playSound(player.specialSound, "sfx", 1, 0.25);
													tObj.dying=1;
													me.drop_reward=true;
												} else {
													if (tObj.dying==0) playerIsHit=true;
												}
											}
										}else{
											
										}
										break;
									case "po":
										if (tObj.scoring!=1) oGAME.fx_System.make_fx(tObj.obj.position,1);
										tObj.scoring=1;
										 //player.pickup(tObj);
										 break;
									case "toy":
										 tObj.active=false;
										 //tObj.obj.position.z=-1000;
										 player.pickup(tObj);
										break;
									case "hilo":
										if (!player.jumping && !player.ducking) {
											playerIsHit=true;
										}
										break;
									case "ta":
										//trace(tObj.id+" ta"+player.curY+">"+(tObj.obj.position.y));
										if (!(player.jumping&&player.curY>tObj.obj.position.y)) { 
											playerIsHit=true;
										}
										break;
										
									case "lo":
										if (!player.jumping) playerIsHit=true;
										break;
									case "ice":
										if (player.sliding==-1 && !player.ducking && !(player.jumping&&player.curY > tObj.obj.position.y)) { 
											player.sliding=game_time_now+oCONFIG.ice_time;
											player.current_motion.timeScale=oCONFIG.ice_anim_rate;
										}
										break;
									case "hi":
										//trace(tObj.id+" hi"+player.curY+">"+(tObj.obj.position.y));
										if (!player.ducking && !(player.jumping&&player.curY > tObj.obj.position.y)) { 
											playerIsHit=true;
										}
										break;
									case "hi3d":
										if (!player.ducking) { 
											playerIsHit=true;
										}
										break;
									case "fl":

										break;
								}
								if (playerIsHit) {
									player.hit();
									player.isFalling = true;
									player.setAnim("Fall");

									//cloud_emitter.position.value= new THREE.Vector3(-7,3,0);
									//cloud_emitter.enable();
									if (tObj.is3D) {
										oGAME.fx_System.make_fx(tObj.obj.position);
										tObj.obj.removeFromParent();
										tObj.obj.position.y+=0.5;
									} else {
										var sndName = rndInt(2)==0?"Red_Hit":"Red_Hit2";
										window.__snds.playSound(sndName, "sfx", 1, 0.25);
										tObj.obj.removeFromParent();
									}
									tObj.active = false;
								}
							}
						}
					}
					if (me.game_mode==1) return;
					if (tObj.is3D) {
						if (tObj.obj.position.x+me.shipPos<leftEdge) {
							/*if (tObj.mode=="hench") {
								if (tObj.obj.position.x+me.shipPos<leftEdge-15) {
									//window.trace("purge hench");
									tObj.active = false;							
									oGAME.ship.remove(tObj.obj);
								}
							} else {*/
								tObj.active = false;							
								oGAME.ship.remove(tObj.obj);
								//tObj.obj.removeFromParent();
							//}
						}
					
					} else {
					}
					if (tObj.isAnimated) {
						if (tObj.obj.parent) {
							tObj.animation.stepAnimation();
						}
					}
				}
			}
		}
		
		game_actives.push(minime);
		
		return this;
	}
	//---------------------------------------------
	//---------------------------------------------
	//---------------------------------------------
	//---------------------------------------------

	var frame_counter = 0;
	var current_tilt = 0;
	var next_tilt = 0;
	var tilt_speed = 0;
	var current_speed = 0;

	var move_speed = 0;
	var move_factor = 0;

	var game_mode = 0;

	var pulse_ease = 1;
	var last_sign = 1;

	var timer_seconds = 0;


																					//////////////////////////////
																					//
																					//	doFrameUpdate
																					//
																					//////////////////////////////

	this.doFrameUpdate = function(){

		frame_delta = window.clock.getDelta();

		var using_keyboard = false;
		var using_buttons = false;
		var using_tilt = false;

		if(!oGAME.scene){return;}
		if(me.is_paused){return;}

		oGAME.ship.position.z = 0;
			
		switch(game_mode){

			case 99:
				//nothing
				break;

			case 0: //normal play
				if (document_blurred) break;
				game_time_now += frame_delta;
				
				var action=false;
				//oGAME.fx_System.doUpdate();
				
				if (me.doUpdateShip!==undefined) {
					me.effectiveMoveRate = me.effectiveMoveRate * 0.95 + me.moveRate*0.05;
					me.doUpdateShip( me.effectiveMoveRate * Math.min(0.5,frame_delta) * oCONFIG.frame_rate_fix  );
					if (game_mode!=0) action=true;
				}
				var powerup_pressed = false;
				if (window.__input.space || thisTouch.x>-100 ) {
					//window.trace((__input.mouse_x/window.innerWidth)+"&&"+(__input.mouse_y/window.innerHeight));
					if (window.__input.space ||( thisTouch.x<-0.6 && thisTouch.y<-0.6)) {
						powerup_pressed = true;
					}
				}
				if (powerup_pressed) {
					if (game_time_now>player.punchPause) {
						player.punching = game_time_now+player.punchDuration
						player.punchPause = player.punching+player.punchDelay;
						player.setAnim(player.playerfix+"Punch");
					} else {
						powerup_pressed=false;
					}
				}
				
				
				if (window.__input.keys_down.indexOf(65)!==-1) { 
					//game_mode=3;
				}
				if((window.__input.up||__lastSwipe===1) && !player.jumpingx2){//} && !player.powerupTriggered){
					
					//window.__snds.playSound( player.jumpSound, "running",0,0.5);
					window.__input.up=false;
					player.animation.startAnim(player.playerfix+"JumpStart");
					player.jump();
					action=true;
					//__lastSwipe=-1;
				}

				if((window.__input.dn||__lastSwipe===3)){//} && !player.powerupTriggered){
					if (player.jumping) {

					} else {
						player.slide();
					}
					
				}
				if (player.sliding>-1 && game_time_now<player.sliding) {
					action=true;
				}
				if (me.shipPieces.length<3) {
					if ((window.__input.left||__lastSwipe===4)) {
						/*if (player.animation.currentAnim!==player.playerfix+"Run"&& !player.jumping&&!player.ducking) {
							if (!player.powerupTriggered) player.animation.startAnim(player.playerfix+"Run");
						}*/
						player.turning = "left";
						player.setAnim(player.playerfix+"TurnL");
						action=true;
					}

					if ((window.__input.right||__lastSwipe===2))  {
						/*if (player.animation.currentAnim!==player.playerfix+"Run"&& !player.jumping&&!player.ducking) {
							if (!player.powerupTriggered) player.animation.startAnim(player.playerfix+"Run");
						}*/
						//if (player.curX>1.95) player.targetX=0;
						//else 
						player.turning = "right";
						player.setAnim(player.playerfix+"TurnR");
						action=true;
					} 
				}
				
				if (powerup_pressed) {
					//player.setAnim(player.playerfix+"Punch");
					if (hittable!=-1) {
						switch (hittable.name) {
							case "NPC_RM":
								hittable.animation.startAnim("RM_Hit",(a)=>{a.visible=false;},hittable);								
								break;
							case "NPC_HM":
								hittable.animation.startAnim("HM_Hit",(a)=>{a.visible=false;},hittable);							
								break;
							case "NPC_PR":
								hittable.animation.startAnim("PR_Hit",(a)=>{a.visible=false;},hittable);								
								break;								
						}
						hittable.triggered=true;
					}
					action=true;
				}
				
				if (!action && !player.jumping && player.turning=="") {
					//if (__snds.getNowPlaying("running") != player.runSound)
					//	__snds.playSound( player.runSound, "running",-1,0.5);
					player.targetX = 0;
					player.ducking=false;
					//player.jumping=false;
					if (player.animation.currentAnim!==player.playerfix+"Run") player.animation.startAnim(player.playerfix+"Run");
				}
				
				break;

		case 1: //game over
				game_time_now += frame_delta;
				//oGAME.fx_System.doUpdate();
				//me.doUpdateShip( -0.5*frame_delta );
				player.curY = player.baseY;
				me.moveRate*=0.95;
				player.animation.stepAnimation();
			break;

		case 2: //barf

			break;

		case 3: // Animation testing
		
				me.moveRate=0;
				if (window.__input.keys_down.indexOf(81)!==-1) { // q
					game_mode=0;
				}
				if (!player.testingAnims)player.testingAnims=Date.now();
				if (window.__input.space && Date.now()>player.testingAnims){
					var motions=Object.keys(player.animation.motions);
					var curanim=motions.indexOf(player.animation.currentAnim())+1;
					if (curanim>=motions.length)curanim=0;
					window.trace(motions[curanim]);
					player.animation.startAnim(motions[curanim]);
					player.testingAnims=Date.now()+1000;
				}
				/*if (window.__input.left){
					for (var idx=0; idx<me.numObjs; idx++) {
						var testObj = minime.objs[idx];
						var motions=Object.keys(player.animation.motions);
						var curanim=motions.indexOf(player.animation.currentAnim())+1;
						if (curanim>=motions.length)curanim=0;
						window.trace(motions[curanim]);
						player.animation.startAnim(motions[curanim]);
						player.testingAnims=Date.now()+1000;
					}
				}*/
		
			break;
		case 4:				
			break;
		}

		//update game actives
		if (document_blurred===false) {
			for(var i=0; i<game_actives.length; i++){
				game_actives[i].doUpdate();
			}
		}
		//render
		oGAME.renderer.render(oGAME.scene, oGAME.camera);
		//oGAME.scene.background =  oMODELS["sky"+playerId];
	}
	me.doInit();
}