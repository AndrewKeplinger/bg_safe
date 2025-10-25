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
		
	//var score_holder;
	//var powerup_holder;
	//var health_holder;
	//var fx_System;

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

	var hittable=-1;
																					//////////////////////////////
																					//
																					//	doInit
																					//
																					//////////////////////////////

	this.doInit = function () {


		oGAME.renderer = canvas_game.renderer || new THREE.WebGLRenderer({
			canvas: canvas_game,
			antialias: false,
			alpha: true,
			shadows: false,
			fog: true
		});

		window.trace(oMODELS);
		THREE.ColorManagement.enabled = true;

		//3d scene
		oGAME.scene = new THREE.Scene();
		oGAME.scene.background =  oCONFIG.fog_color;
		oGAME.scene.fog = new THREE.Fog( oCONFIG.fog_color, oCONFIG.fog_near, oCONFIG.fog_far );
		//camera
		oGAME.camera = new THREE.PerspectiveCamera(40, oSTAGE.screen_width / oSTAGE.screen_height, 0.1, 1500);
		//oGAME.camera.rotateY(0.6);
		oGAME.scene.add(oGAME.camera);

		SCREEN.updateScore(0);

		this.seen_in_scene=[];
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
		me.pathList=[];
		me.pathOptions=["Bar1","Bar2","Bar3"];
		oGAME.playerMark = new THREE.Group();
		oGAME.ship.add(oGAME.playerMark);
		oGAME.player = me.doCreatePlayer(1);
		oGAME.playerMark.add(oGAME.player);
		var hallnames = Object.keys(shipBuilder);
		var last_straight = -1;
		for (idx = 0; idx < hallnames.length; idx++) {
			var modelName = hallnames[idx];
			if (!oMODELS[modelName]) {
				console.log("missing model = "+ modelName);
				modelName = modelName.substring(0,modelName.length-1);
			}
			deck = oMODELS[modelName].clone(true);
			deck.rotateY(Math.PI / 2);
			//deck.position.z=-6;
			var npcs = me.setMeshColor(deck, shipBuilder[hallnames[idx]].pulane);

			deck.castShadow = false;
			deck.receiveShadow = false;	
			//if (shipBuilder[hallnames[idx]].build) deck.children[0].material.opacity=0.5;
			shipBuilder[hallnames[idx]].active=false;
			shipBuilder[hallnames[idx]].obj = deck;
			shipBuilder[hallnames[idx]].id = hallnames[idx];
			shipBuilder[hallnames[idx]].npcs = npcs;			

		}

		//Make a couple extra deck pieces for filler and start section of game
		var zPos = -me.pieceWidth;

		var tIndex = idx;
		
		for (idx = 4; idx < 6; idx++) {

			deck = oMODELS[hallnames[idx]].clone(true);
			//deck.position.z=-6;
			deck.rotateY(Math.PI / 2);
			deck.castShadow = false;
			deck.receiveShadow = false;
			var npcs = me.setMeshColor(deck);
			for (var zzz=0; zzz<npcs.length;zzz++) {
				npcs[zzz].visible=false;
			}
			var tTile = Object.create(shipBuilder[hallnames[idx]]);
			tTile.id+=" Clone";
			tTile.obj = deck;
			//shipBuilder[hallnames[idx]].active = true;
			me.shipPieces.push(tTile);
			oGAME.ship.add(deck);
			deck.translateZ(zPos);
			zPos += me.pieceWidth;
		}
		me.makeSection(0);

		me.doUpdateShip(0);

		//camera stuff
		oGAME.camera.position.set(-30, 25, 0); 
		//console.log(player.baseX);
		oGAME.player.playerSprite.position.set(1.0*player.baseX,6,0);
		//console.log(oGAME.player.playerSprite.position);
		oGAME.player.playerSprite.up.set(0,0,1);
		oGAME.player.playerSprite.lookAt(oGAME.camera.position);
		oGAME.player.playerSprite.setRotationFromEuler( new THREE.Euler(-Math.PI/2,-1,-Math.PI));
		oGAME.player.playerSprite.visible=false;
		//oGAME.camera.attach(oGAME.player);
		//console.log(oGAME.player.playerSprite.rotation);
		//oGAME.camera.position.set(-200, 150, 0); 
		oGAME.camera.lookAt(new THREE.Vector3(0,10, 0));
		oGAME.playerMark.attach(oGAME.camera);

		oGAME.heart_box = new THREE.Group();
		oGAME.heart_box.animation = new Atlas();
		oGAME.heart_box.sprite = oGAME.heart_box.animation.Init(
			"heart_", 
			oCONFIG.heart_scale, 
			animations["Heart"],
			"Heart_Atlas",
			"media/sprites/heart_.json"
		);
		oGAME.heart_box.animation.heightMult=1.0;
		oGAME.heart_box.sprite.scale.set( oCONFIG.heart_scale*1, oCONFIG.heart_scale*1, 1 );
		oGAME.heart_box.sprite.doubleSided = true;
		oGAME.heart_box.sprite.renderOrder = 1;
		oGAME.heart_box.animation.startAnim("Full");	
		oGAME.heart_box.add(oGAME.heart_box.sprite);
		oGAME.player.attach(oGAME.heart_box);
		//oGAME.heart_box.position.set(0,10,0);
		oGAME.heart_box.sprite.position.set(1.0*player.baseX,20,0);
		oGAME.heart_box.sprite.up.set(0,0,1);
		//oGAME.heart_box.sprite.lookAt(oGAME.camera.position);
		oGAME.heart_box.sprite.setRotationFromEuler( new THREE.Euler(-Math.PI/2,-1,-Math.PI/2));
		//oGAME.camera.lookAt(new THREE.Vector3(30, -20, 0));
		oGAME.renderer.render(oGAME.scene, oGAME.camera);
		oGAME.heart_box.visible = false;
		
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

		me.doReady();
	}
	
	var lanetracker = {};
	this.tracklane = function(model, playerLane) {
		if (!lanetracker[model.parent.name]){
			lanetracker[model.parent.name]=model.lane;
			if (model.lane==0 && model.lane!=playerLane) console.log(model.parent.name+" "+playerLane);
		}
	}
	this.heart_show = function(onoff) {
		if (onoff) {
			if (!oGAME.heart_box.visible) {
				oGAME.heart_box.visible=true;
				oGAME.heart_box.animation.startAnim("Full");
			}
		} else {
			if (oGAME.heart_box.visible) {
				//oGAME.heart_box.visible=true;
				oGAME.heart_box.animation.startAnim("Break",()=>{oGAME.heart_box.visible=false;});
			}
		}
	}
	var atlasLibrary = {};
	this.setMeshColor = function(tObj, pulane=0) {		
		var setList = [tObj];
		var step=0;
		var npcs = [];
		while (step<setList.length) {
			if (setList[step].material) {
				
				if (setList[step].material.isMeshLambertMaterial) {
					setList[step].material.map.magFilter = THREE.NearestFilter;
					setList[step].material.map.minFilter = THREE.NearestFilter;
					var mapId = setList[step].material.map.source.data.currentSrc;
					mapId = mapId.substr(mapId.lastIndexOf("/")+1);
					var mat = new THREE.MeshBasicMaterial({
						color: new THREE.Color(0xFFFFFF),
						transparent: true,
						map: setList[step].material.map,
						fog:true,
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
							model.sprite.doubleSided = true;
							model.sprite.renderOrder = 1;
						//}
						model.animation.startAnim(modelName+"_Stand");
						model.animation.stepAnimation();
						//model.material=model.sprite.material;
						npcs.push(model);
						//console.log(">>> "+model.name);
						//setList[step].position.y=20000;
					} else {
						var model = setList[step];
						//console.log("<<<"+model.name);
						switch (model.name) {
							case "cash":
								model.lane = pulane;
								npcs.push(model);
								break;
							case "NPC_Russ":
								npcs.push(model);
								break;
							case "NPC_Zoe1":
							case "NPC_Zoe":
								npcs.push(model);
								break;
							case "NPC_Roman":
								npcs.push(model);
								break;
							case "PU_heart":
								model.lane = pulane;
								npcs.push(model);								
								break;
							case "PU_bat":
								npcs.push(model);								
								break;
							case "PU_cat":
								model.lane = pulane;
								npcs.push(model);								
								break;
							default:
								//console.log(model.name);
								break;
						}
						if (npcs.length>0) {							
							model.renderOrder = 1;
							/*var tPos = new THREE.Vector3();
							model.getWorldPosition(tPos);
							console.log("<<< "+model.name+"  "+Math.floor(tPos.x)+","+tPos.y+","+Math.floor(tPos.z));*/
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
	
	this.testPaths=function() {
		var keys = Object.keys(paths);
		
		for (var xxx=0; xxx<keys.length; xxx++){
			var oot = keys[xxx]+":";
			var tPath = paths[keys[xxx]][0].split(",");
			for (var yyy=0; yyy<tPath.length; yyy++) {
				if (oMODELS[tPath[yyy]]==undefined){
					oot += " "+tPath[yyy];
				}
			}
			console.log(oot);
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
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({'event': 'pause_button','page_title':'caught stealing game game playing','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		var pause_buttons = [
			{snd:"snd_click", msg:oLANG.quit, callback:me.doQuit},
			{snd:"snd_click", msg:oLANG.resume, callback:me.doUnPause}
		];
		new PopupPause(pause_buttons);
	}

	this.doUnPause = function(){
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({'event': 'continue_button','page_title':'caught stealing game game playing','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		me.is_paused = false;
		window.__snds.playSound("music_game_loop", "music", -1, .25);
	}

	this.doQuit = function(){
		window.dataLayer = window.dataLayer || []; 
		window.dataLayer.push({'event': 'instructions_restart_button','page_title':'caught stealing game game playing','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		window.__snds.stopSound("music");
		CONTROLS.doHidePause();
		SCREEN = new TitleScreen();
		LEGAL.doShow();
		me.doDestroy();
	}

	
	//----------------------------
	// pause
	//---------------------------
	
	this.doReady = function() {
		player.visible=false;
		player.animation.stepAnimation();
		setTimeout(me.doGo, 50);
	}

	this.doGo = function(){

		trace("GO!");
		player.visible=true;
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
		
		player.setAnim("Hit");
		var progress = me.score;//powerup_holder.progress;
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
		
		var final=1; //oUSER[ "char"+playerId ] > 9 ? 1 : 0;
		//if (window.oUSER[ "char1" ]>9&window.oUSER[ "char2" ]>9&window.oUSER[ "char3" ]>9) final = 2;
		
		unlockMessage = {"character":playerId, "progress":progress, "final":me.seen_in_scene };

		window.__snds.playSound("music_game_end", "music", 1, 0.25);
		CONTROLS.doHidePause();
		setTimeout(me.doGotoRecap, 1000);
	}

	this.doGotoRecap = function(){
		
		window.SCREEN = new RecapScreen(unlockMessage);
		LEGAL.doShow();
		me.doDestroy();
	}
	var farTurnObj=-1;
	var npc_scan_range = 2;
	var dialog_delay=-1;
	
	
	
	
	var usedPaths=[];
	this.fillPath=function(lastTile=0) {		
		var foundTurn=false;
		while(!foundTurn) {
			/*for (var idx=0; idx<me.pathList.length; idx++){
				if ((me.pathList[idx].indexOf("right")>-1)||(me.pathList[idx].indexOf("left")>-1)) {
					foundTurn=true;
				}
			}*/
			foundTurn=me.pathList.length+this.shipPieces.length>15;
			
			if (lastTile==0 || !foundTurn) {
				var tidx=rndInt(me.pathOptions.length);
				if (usedPaths.length>6) usedPaths.shift();
				usedPaths.push(me.pathOptions[tidx]);
				//console.log(usedPaths)
				var nextPathList = paths[me.pathOptions[tidx]];
				var nextPath = nextPathList[0].split(",");
				//nextPath cannot contain a tile in the pathList
				var goodPath = true;
				for (var idx=0; idx<nextPath.length; idx++){
					for (var zzz=0; zzz<this.shipPieces.length;zzz++){
						if (nextPath[idx]==this.shipPieces[zzz].id) {
							goodPath=false;
							break;
						}
					}
					if (me.pathList.indexOf(nextPath[idx])>-1) {						
						goodPath=false;
						break;
					}
				}
				//if (goodPath) {
					me.pathList=me.pathList.concat(nextPath);
				//}
				//if (goodPath || me.pathOptions.length<1 ) {
					me.pathOptions = nextPathList[1].split(",");
					var off;
					if (me.pathOptions.length>1){
						
						for (var idx=0; idx<usedPaths.length;idx++){
							off = me.pathOptions.indexOf(usedPaths[idx]);
							if (off>-1) {
								me.pathOptions.splice(off,1);
							}
						}
						if (me.pathOptions.length<1) {
							me.pathOptions = nextPathList[1].split(",");
						}
					}
				//}
			}
		}
		//console.log(me.pathList);
	}
	
	this.makeSection = function(turn,preTurn=-1) {
		me.fillPath(turn);
		player.turning = "";
		//console.log("makeSection");
		SCREEN.hideDialog();
		var endLevel = false;
		//clear everything except the last 2, which should be the case
		
		var cur_location;
		var cur_turns=[];
		var npcs_present = [];
		
		npc_scan_range = 2;

		rObj = this.shipPieces[this.shipPieces.length-1];
		cur_location = rObj.id.substring(0,rObj.id.indexOf("_"));
		var rndLength = 4+rndInt(6)+(rObj.id.indexOf("city")>-1?4:0);
		var stillAdding = true;
		var changedPlace = false;
		var npc_recent=0;
		while (stillAdding) {
			var newPiece;
			if (me.pathList.length>0){
				//console.log(me.pathList[0]);
				newPiece=shipBuilder[me.pathList.shift()];
				var isDuplicate=false;
				for (var idx=0; idx<this.shipPieces.length;idx++){
					if (this.shipPieces[idx].id==newPiece.id) 
					{
						isDuplicate=true;
						break;
					}
				}
				if (isDuplicate){//newPiece.obj.parent!=undefined){
					var tPiece = newPiece;
					//console.log("Replicating ***************** "+newPiece.id);
					newPiece = Object.create(tPiece);
					newPiece.id += " Clone";
					newPiece.obj = tPiece.obj.clone(true);
					//newPiece.obj.rotateY(Math.PI / 2);
					var npcs = me.setMeshColor(newPiece.obj, newPiece.pulane);
					newPiece.obj.castShadow = false;
					newPiece.obj.receiveShadow = false;		
					newPiece.npcs = npcs;
				}
			}
			newPiece.active=true;
			this.shipPieces.push(newPiece);
			var piece = newPiece.obj;
			/*if (!piece) {
				console.log(newPiece);
				piece = newPiece;
			}*/
			piece.rotation.y=Math.PI/2;
			oGAME.ship.add(piece);
			piece.position.x = rObj.obj.position.x+this.pieceWidth;
			piece.position.z = rObj.obj.position.z;
			rObj = this.shipPieces[this.shipPieces.length-1];
			
			stillAdding = this.shipPieces.length<12;//rObj.type!="exit";
			if (newPiece.npcs && newPiece.npcs.length>0) {					
				for (var idx=0;idx<newPiece.npcs.length;idx++){
					var NPC = newPiece.npcs[idx];
					//if (piece.position.x<50){
					//	NPC.visible=false;
					//} else {

						NPC.triggered=false;
						NPC.visible=true;
						switch (NPC.name) {
							case "cash":
								NPC.visible=true;
								break;
							case "NPC_HM":
								if (npcs_present.indexOf(NPC.name)>-1){
									NPC.visible=false;
								} else {
									NPC.animation.startAnim("HM_Stand");
									npc_recent=4;
									npcs_present.push(NPC.name);
								}
								break;
							case "NPC_RM":
								if (npcs_present.indexOf(NPC.name)>-1){
									NPC.visible=false;
								} else {
									NPC.animation.startAnim("RM_Stand");
									npc_recent=4;
									npcs_present.push(NPC.name);
								}
								break;
							case "NPC_PR":
								if (npcs_present.indexOf(NPC.name)>-1){
									NPC.visible=false;
								} else {
									NPC.animation.startAnim("PR_Stand");
									npc_recent=4;
									npcs_present.push(NPC.name);
								}
								break;
							case "NPC_Russ":
								if (npcs_present.indexOf(NPC.name)>-1){
									NPC.visible=false;
								} else {
									npc_recent=4;
									npcs_present.push(NPC.name);
								}
								break;
							case "NPC_Zoe1":
							case "NPC_Zoe":
								if (npcs_present.indexOf(NPC.name)>-1){
									NPC.visible=false;
								} else {
									npc_recent=4;
									npcs_present.push(NPC.name);
								}
								break;
							case "NPC_Roman":
								if (npcs_present.indexOf(NPC.name)>-1){
									NPC.visible=false;
								} else {
									npc_recent=4;
									npcs_present.push(NPC.name);
								}
								break;
							case "PU_heart":
								NPC.visible=!(player.hasHeart);														
								break;
							case "PU_bat":								
								NPC.visible=(player.playerfix!="B");
								break;
							case "PU_cat":	
								NPC.visible=(player.playerfix!="C");							
								break;
							default:
								//console.log(NPC.name);
								break;
						}
					//}
				}
			}
			if (this.shipPieces.length<3 && piece.npcs.length>0){
				for (var idx=0; idx<piece.npcs.length;idx++ ){
					piece.npcs[idx].visible=false;
				}
			}
			if (npc_recent>0) npc_recent--;
			cur_location = rObj.id.substring(0,rObj.id.indexOf("_"));
			if (rObj.type=="exit") changedPlace=true;
		}
		npc_shown="";
		dialog_delay=-1;
	}																			
																					//////////////////////////////
																					//
																					//	doUpdateShip
																					//
																					//////////////////////////////
	var hitable = -1;
	var tempV = new THREE.Vector3();
	var pPos =  new THREE.Vector3();
	this.doUpdateShip = function(movement){
		
		me.shipPos += movement;
		oGAME.ship.position.x = me.shipPos;
		oGAME.playerMark.position.x = -me.shipPos;
		
		var curTile = this.shipPieces[1];
		player.playerSprite.getWorldPosition(pPos);
		pPos.x+=12;
		pPos.y-=6;
		var player_lane = ((Math.abs(player.laneZ)<1)?0:(player.laneZ>1)?1:-1);
		
		var obstacle = curTile.action;
		var impact = (curTile.obj.position.x-oGAME.playerMark.position.x)<-5;
		var tNpcs = curTile.npcs.concat();
		tNpcs =	this.shipPieces[0].npcs.concat(tNpcs);

		
		if ( tNpcs.length>0) {
			for (var idx=0; idx<tNpcs.length; idx++) {
				var NPC = tNpcs[idx];
				NPC.getWorldPosition(tempV);
				
				var dist = Math.abs(pPos.x-tempV.x);
				if (NPC.name=="cash") dist = 0.5;
				var same_lane = player_lane==NPC.lane;//((Math.abs(NPC.position.z)<1)?0:(NPC.position.z>1)?1:-1) == ((Math.abs(player.position.z)<1)?0:(player.position.z>1)?1:-1);
				
				if (NPC.visible && dist<oCONFIG.hit_range_x) {//
					//if (NPC.visible) console.log(NPC.name+" "+Math.floor(dist*100)+ " "+ player_lane+" "+NPC.lane+" "+this.shipPieces[0].npcs.length+" "+this.shipPieces[1].npcs.length);
				
					switch (NPC.name ){
						case "cash":
							if (NPC.visible && same_lane) {	
								me.tracklane(NPC,player_lane);
								__snds.playSound("cash", "interface");
								me.addPoints(oCONFIG.scorePerCash);
								NPC.visible=false;								
							}
							break;
						case "NPC_HM":
							if (me.seen_in_scene.indexOf(NPC.name)==-1) me.seen_in_scene.push(NPC.name);
							if (!NPC.triggered) {
								NPC.triggered=true;
								NPC.animation.startAnim("HM_Punch");
								player.hit();
							}
							break;
						case "NPC_RM":
							if (me.seen_in_scene.indexOf(NPC.name)==-1) me.seen_in_scene.push(NPC.name);
							if (!NPC.triggered) {
								NPC.triggered=true;
								NPC.animation.startAnim("RM_Punch");
								player.hit();
							}
							break;
						case "NPC_PR":
							if (me.seen_in_scene.indexOf(NPC.name)==-1) me.seen_in_scene.push(NPC.name);
							if (!NPC.triggered) {
								NPC.triggered=true;
								NPC.animation.startAnim("PR_Punch");
								player.hit();
							}
							break;
						case "PU_heart":
							if (!player.hasHeart && NPC.visible && same_lane) {		
								me.tracklane(NPC,player_lane);													
								__snds.playSound("heart");
								NPC.visible=false;
								me.heart_show(true);
								//console.log("get heart");
								player.hasHeart=true;								
							} 						
							break;
						case "PU_bat":								
							if (player.playerfix!="B" && NPC.visible && !player.ducking) {									
								__snds.playSound("health", "interface");
								NPC.visible=false;
								player.playerfix="B";
								player.animation.startAnim("BRun");
								player.animation.stepAnimation();
								//console.log("get bat");								
							} 							
							break;
						case "PU_cat":							
							if (player.playerfix!="C" && NPC.visible && same_lane) {	
								me.tracklane(NPC,player_lane);									
								__snds.playSound("cat", "interface");
								NPC.visible=false;
								player.playerfix="C";
								player.animation.startAnim("CRun");
								player.animation.stepAnimation();
								//console.log("get cat");								
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

		if (this.shipPieces.length>4) {
			var npcs = this.shipPieces[4].npcs;
			if (npcs && npcs.length>0) {
				for (var idx=0; idx<npcs.length; idx++){
					var thisNPC = npcs[idx];
					if (thisNPC.name.indexOf("NPC_")>-1) {
						if (thisNPC.visible){
							//me.effectiveMoveRate=0;
							SCREEN.showDialog(thisNPC.name,thisNPC.name);
							switch (thisNPC.name) {
								case "NPC_Zoe1":
								case "NPC_Zoe":
									if (me.seen_in_scene.indexOf("NPC_Zoe")==-1) me.seen_in_scene.push("NPC_Zoe");
									break;
								default:
									if (me.seen_in_scene.indexOf(thisNPC.name)==-1) me.seen_in_scene.push(thisNPC.name);
									break;
							}
							//console.log(me.seen_in_scene);
							dialog_delay=4;							
						}
					}
				}
			}
		}
		
		var clipped=-1;
		if (this.shipPieces[0].obj.position.x+me.shipPos<leftEdge) {
			clipped=this.shipPieces[0];
			if (dialog_delay>-1) dialog_delay--;
			if (dialog_delay<=0) SCREEN.hideDialog();
			//console.log(this.shipPieces[0].id+"  "+this.shipPieces[0].pulane);
			this.shipPieces[0].obj.removeFromParent();
			this.shipPieces[0].active=false;
			this.shipPieces.splice(0,1);
			me.addPoints(oCONFIG.scorePerTile);
		}
		
		if (this.shipPieces.length<8) {//this.shipPieces[0].exit && 
			me.moveRate=Math.max(me.moveRate+me.acceleration,me.maxRate);
			me.makeSection("no",clipped);
		}
			
		/*
		if (this.shipPieces[0].build && this.shipPieces.length<4) {
			if (this.shipPieces[0].build==player.turning) {
				player.setAnim(player.playerfix+"Turn"+player.turning.substring(0,1).toUpperCase());
				me.moveRate=Math.max(me.moveRate+me.acceleration,me.maxRate);
				me.makeSection(this.shipPieces[0].build,clipped);
			} else {
				console.log("No turn");
				player.hit();
				if (game_mode==0) {
					player.setAnim(player.playerfix+"Turn"+this.shipPieces[0].build.substring(0,1).toUpperCase());
					me.moveRate=Math.max(me.moveRate+me.acceleration,me.maxRate);
					me.makeSection(this.shipPieces[0].build,clipped);
				}
			}
		}*/
	};
	this.addPoints = function (points) {
		if (player.playerfix=="C") points *=2;
		me.score+=points;
		SCREEN.updateScore(me.score);
	}

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
		player.laneZ		= 0.0;
		player.laneZ_targ	= 0.0;
		
		player.animation = new Atlas();
		
		player.health 		= playerParams[playerNum].health;
		me.moveRate 		= me.baseMoveRate 	= playerParams[playerNum].moveRate;
		me.acceleration		= 1.0*playerParams[playerNum].acceleration;
		me.maxRate			= 1.0*playerParams[playerNum].maxRate;
		//player.jumpMoveRate = playerParams[playerNum].jumpMoveRate;
		//player.brakeMoveRate = playerParams[playerNum].brakeMoveRate;
		player.baseY 		= player.curY 		= 1.0*playerParams[playerNum].baseY;
		player.spriteScale	= 1.0*playerParams[playerNum].spriteScale;
		player.jumpImpulse  = 1.0*playerParams[playerNum].jumpImpulse;
		player.baseZ 		= 1.0*playerParams[playerNum].baseZ;
		player.baseX 		= 1.0*playerParams[playerNum].baseX;
		player.runSound		= playerParams[playerNum].runSound;
		player.duckSound	= playerParams[playerNum].duckSound;
		player.specialSound	= playerParams[playerNum].specialSound;
		player.slideDuration= playerParams[playerNum].slideDuration;
		player.slideDelay	= playerParams[playerNum].slideDelay;
		player.punchDuration= playerParams[playerNum].punchDuration;
		player.punchDelay	= playerParams[playerNum].punchDelay;
		player.lane_assist	= playerParams[playerNum].lane_assist;
		
		/*if (window.platform.isMobile) {
			player.gravity*=1.25;
			me.acceleration/=1.25;
		}*/
		
		if (window.oVARS.spriteScale) {
			player.spriteScale=window.oVARS.spriteScale;
		}
		if (window.oVARS.baseY) {
			player.baseY=window.oVARS.baseY;
		}
		if (window.oVARS.baseX) {
			player.baseX=1.0*window.oVARS.baseX;
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
			player.laneZ = player.laneZ*player.lane_assist + player.laneZ_targ*(1-player.lane_assist);
			player.position.z = player.laneZ;
			if (game_mode>0) {
				player.animation.stepAnimation();
				return;
			}

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
							if (player.incy<0.0) {
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
					}
				}
			
			
			player.animation.stepAnimation();
		};

		player.setAnim = function(animName) {
			if (game_mode!==0) return;
			//console.log(animName);
			if (player.animation.currentAnim!==animName) 
				player.animation.startAnim(animName);
		};
		
		player.slide = function() {
			if (game_time_now>player.slidePause) {
				__snds.playSound("slide", "interface");
				player.sliding = game_time_now+player.slideDuration
				player.slidePause = player.sliding+player.slideDelay;
				player.setAnim(player.playerfix+"Slide");
				player.ducking=true;
			} else {
				
			}
		}
		
		player.jump = function() {
			if (!player.jumping) {
				__snds.playSound("jump", "interface");
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
			__snds.playSound("punch", "interface");
			player.playerSprite.position.y=player.curY = player.baseY;
			
			player.incy = 0;
			player.jumping = false;
			player.ducking = false;
			if (game_time_now>player.immuneTime) {
				//console.log("hit");
				me.effectiveMoveRate=0;
				player.immuneTime=game_time_now+oCONFIG.immune_time;
				if (player.hasHeart) {
					me.heart_show(false);
					player.setAnim(player.playerfix+"Hit");
					player.hasHeart=false;
					if (player.playerfix) {
						player.setAnim(player.playerfix+"Hit");
						player.playerfix="";
					}					
					
				} else {
					
						player.ducking = false;
						//window.trace("hit powerupTriggered");
						player.powerupTriggered=false;
						//player.targetX=0;
						player.health--;
						me.doGameOver();						
					//}
				}
				player.animation.stepAnimation();
			}
		}
		
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
					me.effectiveMoveRate = me.effectiveMoveRate * 0.98 + me.moveRate*0.02;
					me.doUpdateShip( me.effectiveMoveRate * Math.min(0.5,frame_delta) * oCONFIG.frame_rate_fix  );
					if (game_mode!=0) action=true;
					oGAME.heart_box.animation.stepAnimation();
				}
				var powerup_pressed = false;
				if (window.__input.space || thisTouch.x>-100 ) {
					//console.log(thisTouch);
					//window.trace((__input.mouse_x/window.innerWidth)+"&&"+(__input.mouse_y/window.innerHeight));
					
					if (window.__input.space ||( __lastSwipe===-1 && Math.abs(thisTouch.y)<0.5 )) {
						powerup_pressed = true;
					}
				}
				if (powerup_pressed) {
					if (game_time_now>player.punchPause) {
						player.punching = game_time_now+player.punchDuration;
						player.punchPause = player.punching+player.punchDelay;
						player.setAnim(player.playerfix+"Punch");
					} else {
						powerup_pressed=false;
					}
				}
				
				
				if (window.__input.keys_down.indexOf(65)!==-1) { 
					//game_mode=3;
					me.moveRate=-0.01;
					me.effectiveMoveRate = -0.01;
				}
				
				if (window.__input.keys_down.indexOf(66)!==-1) { 
					//game_mode=3;
					me.moveRate=-0.6;
				}
				
				if((window.__input.up||__lastSwipe===1) && !player.jumpingx2 && !action){//} && !player.powerupTriggered){
					
					//window.__snds.playSound( player.jumpSound, "running",0,0.5);
					window.__input.up=false;
					player.animation.startAnim(player.playerfix+"JumpStart");
					player.jump();
					action=true;
					//__lastSwipe=-1;
				}

				if((window.__input.dn||__lastSwipe===3) && !action){//} && !player.powerupTriggered){
					if (player.jumping) {
						player.incy=-2;
					} else {
						player.slide();
						player.ducking=true;
						player.jumping=false;
						action=true;
					}					
				}
			
				player.laneZ_targ=0;
				if (!player.ducking && (window.__input.left||__lastSwipe===4) && !action) {
					player.laneZ_targ=-4.0;
					player.setAnim(player.playerfix+"Run");
					action=true;
				}

				if (!player.ducking && (window.__input.right||__lastSwipe===2) && !action)  {
					player.laneZ_targ=4.0;
					player.setAnim(player.playerfix+"Run");
					action=true;
				} 
				
				if (powerup_pressed) {
					//player.setAnim(player.playerfix+"Punch");
					if (hittable!=-1) {
						switch (hittable.name) {
							case "NPC_RM":
								hittable.animation.startAnim("RM_Hit",(a)=>{a.visible=false;},hittable);	
								__snds.playSound("punch", "interface");
								break;
							case "NPC_HM":
								hittable.animation.startAnim("HM_Hit",(a)=>{a.visible=false;},hittable);	
								__snds.playSound("punch", "interface");
								break;
							case "NPC_PR":
								hittable.animation.startAnim("PR_Hit",(a)=>{a.visible=false;},hittable);	
								__snds.playSound("punch", "interface");
								break;								
						}
						
						me.addPoints(oCONFIG.scorePerPunch * (player.playerfix=="B"?2:1));
						
						hittable.triggered=true;
					}
					action=true;
				}
				
				if (!action && !player.jumping && player.turning=="" && game_time_now>player.punching) {
					player.targetX = 0;
					player.ducking=false;
					if (player.animation.currentAnim!==player.playerfix+"Run") player.animation.startAnim(player.playerfix+"Run");
				}
				
				break;

		case 1: //game over
				game_time_now += frame_delta;
				player.curY = player.baseY;
				me.moveRate*=0.95;
				player.animation.stepAnimation();
				oGAME.heart_box.animation.stepAnimation();
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