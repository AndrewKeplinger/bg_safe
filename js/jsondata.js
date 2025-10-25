// JavaScript Document
var tAudioContext = window.AudioContext || window.webkitAudioContext;
var audioFallback = false;
if (tAudioContext===undefined) {
	audioPlanB = document.createElement("AUDIO");
	audioFallback=true;
}
// JavaScript Document
var gameLoadData = {};
var lowRes = false;
setTimeout(loadJSON,100);
function loadJSON() {
	if (!prepComplete) {
		setTimeout(loadJSON,100);
		return;
	}
	
	/*setLocalizedImage("ninjagoLogo","ninjago_logo");
	setLocalizedImage("ninjagoLogo2","ninjago_logo");
	setLocalizedImage("ninjagoLogo3","ninjago_logo");
	setLocalizedImage("ninjagoLogo4","ninjago_logo");
	*/
	
	var xmlhttp = new XMLHttpRequest();
	//if (window.devicePixelRatio) lowRes = (window.devicePixelRatio!=1);
	//if (window.innerHeight<480 || window.innerWidth<480)lowRes=true;
	
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var txt = this.responseText.replace(/\n/g,"").replace(/\r/g,"").replace(/\t/g,"");
			
			myArr = JSON.parse(txt);
			gameLoadData = mergeLocalizedAudio(myArr);
			loadProgressAmount=0;
			loadTotal = gameLoadData.length;
			
			loadSequence();

		}
	};
	xmlhttp.open("GET", "data/game.json", true);
	xmlhttp.send();
	
}

function mergeLocalizedAudio(sourceArray) {
	// two step process merging localized audio with fixed game audio
	// if the id in fixed audio matches the id of a localizaed definition, replace it.
	for (var idx = 0; idx<sourceArray.length; idx++) {
		var tId = sourceArray[idx].id;
		var merge = localSounds[tId];
		if (merge!=undefined) {
			//trace("Merged:"+localSounds[tId].value);
			sourceArray[idx].value = localSounds[tId].value;
			localSounds[tId] = undefined;
		}
	}
	// for any local sound which isn't in the fixed source Array, prepend it (so it gets loaded first)
	for  (var item in localSounds) { 
		if (localSounds[item]!=undefined) {
			//trace("Prepended:"+localSounds[item]);
			sourceArray.splice(0,0,localSounds[item]);
		}
	}
	return sourceArray;
}

function setLocalizedImage ( elementId, imageId ) {
	return;//AHK
	var elm = document.getElementById(elementId).style.backgroundImage="url("+oLANG[imageId]+")";
}
function getLocalizedText( textId ) {
	if (textAssets[textId].data) {
		return textAssets[textId].data.replace("![CDATA[","").replace("]]","");
	}
	return textAssets[textId].value.replace("![CDATA[","").replace("]]","");
}

// model
var manager = new THREE.LoadingManager();
manager.onProgress = function( item, loaded, total ) {
	//console.log( item, loaded, total );
};

var onProgress = function( xhr ) {

	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		//console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
	}
};

var onError = function( xhr ) {
	console.error( xhr );
};

var materials = {};
var models = {};
var mixers = [];
var sounds = [];
// load a resource
var currentLoadingTexture;

var loader = new THREE.TextureLoader();
var loaderIndex = 0;
var globalLastLoad = "";
var levelLoadedNumber = 0;

function restartLoadSequence(){
	loaderIndex = 0;
	loadSequence();
}
var clearTimeoutRef = -1;
function nextLoad() {
	clearTimeoutRef = setTimeout("loadSequence()",0.0001);
}
var startPlayingMenuMusic = 0;
function loadSequence() {
	clearTimeout(clearTimeoutRef);
	if (animationStartTime>-1 || (gameState>1 && !betweenLevelPreloading) ){
		clearTimeoutRef = setTimeout(loadSequence,250);
		return;
	}
	currentLoadingTexture = gameLoadData[0];

	gameLoadData.splice(loaderIndex,1);
	loadProgressAmount++;
	switch (currentLoadingTexture.type) {
		case "Command":
			switch (currentLoadingTexture.id) {	
				case "DisplayLoadText":
					setFieldText("StartDate","ninjaLogoText");
					setFieldText("StartDate","ninjaLogoText2");
					setFieldText("StartDate","ninjaLogoText3");
					setFieldText("StartDate","ninjaLogoText4");
					setLegalText();
					//setFieldText("Loading_Bar","loadingMessage");
					setFieldText("Title","titleGameName");
					setFieldText("Description","titleDescription");
					setFieldText("Action_Button","titlePlayText");
					if (isMobile) {
						//setFieldText("Loading_Mobile","loadingPrompt");
						//setFieldText("IntroPrompt_Mobile","titleInstructions");
					} else {
						//setFieldText("Loading_PC","loadingPrompt");
						//setFieldText("IntroPrompt_PC","titleInstructions");
					}
					
					document.getElementById("blocker").style.visibility="hidden";
					break;
				case "StartGame":
					createLegalBlock();
					document.getElementById("loadbarBackground2").style.visibility = "hidden";
					document.getElementById("loadbar2").style.visibility = "hidden";
					loadingPhase=1;
					levelLoadedNumber = 1;
					LoadComplete();
					break;
				case "StartGameDemo":
					document.getElementById("loadbarBackground2").style.visibility = "hidden";
					document.getElementById("loadbar2").style.visibility = "hidden";
					loadingPhase=2;
					break;
				case "LevelLoaded":
					levelLoadedNumber = currentLoadingTexture.value;
					break;
				case "HubUrl":
					hubMenu = currentLoadingTexture.value;
					break;
			}
			if (gameLoadData.length>loaderIndex) {
				loadSequence();
			}
			break;
		case "audio":
			
			if (audioFallback){
				//trace("audioFallback:"+currentLoadingTexture.id);
				music.isReallyPlaying=false;
				var aud = document.createElement("audio");
				aud.src = currentLoadingTexture.value;	
				aud.loop = (currentLoadingTexture.loop=="1");
				
				sounds[currentLoadingTexture.id]=aud;
				if (currentLoadingTexture.id=="MenuLoop") {
					
					aud.addEventListener('loadeddata', function() {
						playMusic("MenuLoop");
					});
				}
				if (gameLoadData.length>loaderIndex) {
					loadSequence();
				}
			}else{
				var audioLoader = new THREE.AudioLoader();

				//Load a sound and set it as the Audio object's buffer
				audioLoader.load( currentLoadingTexture.value, function( buffer ) {	
					sounds[currentLoadingTexture.id] = buffer;
					//console.log(buffer);
					if (currentLoadingTexture.id=="MenuLoop") {
						//setTimeout(	playMusic,500,"MenuLoop");
					}

					if (gameLoadData.length>loaderIndex) {
						loadSequence();
					}
				});
			}
			break;
		case "json":
			var fbxLoader = new THREE.JSONLoader();
			fbxLoader.load(
			
				// resource URL
				currentLoadingTexture.value,
				function ( geometry, materials ) {
					models[currentLoadingTexture.id] = model;
					var model = new THREE.Mesh(geometry,materials[0]);
					//materials[currentLoadingTexture.id] = material[0];
					model.scale.set(5,5,5);
					model.position.set(0,0,0);
					scene.add(model);
					if (gameLoadData.length>loaderIndex) {
						loadSequence();
					} 
				},
				// Function called when download progresses
				function ( xhr ) {
					//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},
				// Function called when download errors
				function ( xhr ) {
					console.log( 'An error happened:'+currentLoadingTexture.value );
				}
			);
			break;
		case "image":
		case "plane":
			var mediaUrl = currentLoadingTexture.value;
			if (lowRes) mediaUrl = "Low"+mediaUrl;
			loader.load(
				// resource URL
				mediaUrl,
				// Function when resource is loaded
				function ( texture ) {					
					//console.log(currentLoadingTexture.id);
					var material;
					if (currentLoadingTexture.type==="plane" || currentLoadingTexture.type==="atlas") {
						material = new THREE.MeshBasicMaterial({transparent:true, map:texture, color: 0xffffff});
						//material.alphaTest = 0.01;
						
					} else {
						material = new THREE.SpriteMaterial( {
						color: 0xffffff,
						map: texture
					 });
					}
					material.srcInfo = currentLoadingTexture;
					materials[currentLoadingTexture.id] = material;
					if (gameLoadData.length>loaderIndex) {
						loadSequence();
					}
				},
				// Function called when download progresses
				function ( xhr ) {
					//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},
				// Function called when download errors
				function ( xhr ) {
					console.log( 'An error happened:'+currentLoadingTexture.value );
				}
			);
		break;
		case "atlas":
			var mediaUrl = currentLoadingTexture.value;
			if (lowRes) mediaUrl = "Low"+mediaUrl;
			loader.load(
				// resource URL
				mediaUrl,
				// Function when resource is loaded
				function ( texture ) {	
					var tSize = currentLoadingTexture.size;
					if (lowRes) tSize = tSize/2;
					texture.repeat.x = tSize/texture.image.width;
					texture.repeat.y =  (tSize/texture.image.height);
					var offsets = [];
					for (var frameNum = 0; frameNum< currentLoadingTexture.totalFrames; frameNum++) {
						var tPair = [(texture.repeat.x * (frameNum % currentLoadingTexture.cols)),1- (texture.repeat.y * Math.floor(1 + (frameNum/currentLoadingTexture.cols)))];
						offsets.push(tPair); 
					}
					texture.needsUpdate = true;
					var material;
					material = new THREE.MeshBasicMaterial({
						name:currentLoadingTexture.id+ "_0" , 
						transparent:true, 
						map:texture, 
						side:THREE.FrontSide
					});
					material.srcInfo = currentLoadingTexture;
					material.offsets = offsets;
					//material.dispatchEvent ( { type: 'update' });
					materials[currentLoadingTexture.id+ "_0" ] = material;
					//console.log(currentLoadingTexture.id+ "  "+text2.offset.x +"  " +text2.offset.y);

					if (gameLoadData.length>loaderIndex) {
						loadSequence();
					}
				},
				// Function called when download progresses
				function ( xhr ) {
					//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},
				// Function called when download errors
				function ( xhr ) {
					console.log( 'An error happened:'+currentLoadingTexture.value );
				}
			);
			break;
		default:
			//if (currentLoadingTexture.type=="Text"){
				textAssets[currentLoadingTexture.id] = currentLoadingTexture;
			//}
			if (currentLoadingTexture.id==="Title") {
				var pageTitle = currentLoadingTexture.data;
				pageTitle = pageTitle.replace("![CDATA[","").replace("]]","");
				document.title = pageTitle;
			}
			// definition specify's localization information
			if (gameLoadData.length>loaderIndex) {
				loadSequence();
			}
		break;
	}
}

function playerAnim( animName ) {
	startAnim("fly", playerObj.obj);
}

function startAnim(animName, model, callback, callbackParam) {
	//trace(model.name+" play "+animName);
	var def = model.material.srcInfo.anims[animName];
	model.def = def;
	model.currentAnim = animName;
	model.frameNum = def.start;
	model.animating = true;
	model.animCallback = callback;
	model.animCallbackParam = callbackParam;
	setFrame ( model.frameNum, model );
}

function stepAnimation(model) {
	if (model.animating) {
		if (model.frameNum===undefined) model.frameNum = 0;
		if (model.updateTime===undefined) model.updateTime = 0;
		if (Date.now()>model.updateTime) {
			model.updateTime = Date.now()+50;
			if (model.def.end<model.def.start) {
				model.frameNum--;
				if (model.frameNum<model.def.end) {
					if (model.def.loop===1) {
						model.frameNum = model.def.start;
					} else {
						model.frameNum =model.def.end;
						model.animating= false;
						if (model.animCallback!==undefined) {
							if (model.animCallbackParam!=="") {
								model.animCallback(model.animCallbackParam);
							} else {
								model.animCallback();
							}
							model.animCallback = undefined;
						}
					}
				}
			}else {
				model.frameNum++;
				if (model.frameNum>model.def.end) {
					if (model.def.loop===1) {
						model.frameNum = model.def.start;
					} else {
						model.frameNum =model.def.end;
						model.animating= false;
						if (model.animCallback!==undefined) {
							model.animCallback();
							model.animCallback = undefined;
						}
					}
				}
			}
			setFrame(model.frameNum, model);
		}
	}
}


function getLocalizedText( textId ) {
	if (textAssets[textId].data) {
		return textAssets[textId].data.replace("![CDATA[","").replace("]]","");
	}
	return textAssets[textId].value.replace("![CDATA[","").replace("]]","");
}

function setFieldText( sourceName, fieldName) {
	
	var tAsset = textAssets[sourceName];
	if (tAsset==undefined) return;
	var tField;
	if (fieldName!=""){
		tField = document.getElementById(fieldName);
	} else {
		tField = document.getElementById(tAsset.target);
	}
	if (tField==undefined) return;
	if (tField !== undefined && tAsset !== undefined) {
		//tField.style.visibility="visible";
		var itemText = tAsset.data;
		if (itemText!==undefined) {
			itemText = itemText.replace("![CDATA[","").replace("]]","");//![CDATA[Tap Anywhere to Start]]
			tField.innerHTML = itemText;
			tAsset.value = itemText;
			__utils.doHTMLText(tField,tAsset);
			if (tAsset.style) {
				if (tAsset.style!=""){
					tField.setAttribute("style",tAsset.style);
					if (tAsset.style.indexOf("font-size:")>-1||tAsset.style.indexOf("fontSize:")>-1){
						var tFontSize=tAsset.style.substr(1+tAsset.style.indexOf(":",Math.max(tAsset.style.indexOf("font-size"),tAsset.style.indexOf("fontSize"))));
						tFontSize = tFontSize.substr(0,tFontSize.indexOf("px;"));
						storedLocations[fieldName].fontOverride = parseInt(tFontSize);
					}
				}
			}
			if (tAsset.size && storedLocations!==undefined){
				if (storedLocations[fieldName]) {
					storedLocations[fieldName].textScale=tAsset.size;
				}
			}
		}
	}
}

function setFrame(frameNum, model) {

	var offsets = model.material.offsets;
	model.material.map.offset.set(offsets[frameNum][0], offsets[frameNum][1]);
}

function shiftAudioButtons() {
	//trace("shiftAudioButtons");
	//storedLocations.soundButton2=storedLocations.exitButton2;
	//storedLocations.soundButton2off==storedLocations.exitButton2;
	//storedLocations.soundButton=storedLocations.exitButton;
	//storedLocations.soundButtonoff==storedLocations.exitButton;
}

function getGoodlocs(){ // Used by scaling system to position nearly all UI elements/  Some are overridden inside interface:setStage()
	var baseLocs = JSON.parse('{"titleGameName":{"top":12,"left":375,"width":520,"height":135,"fontSize":30,"anchor":"TR"},'+ 
	'"titleDescription":{"top":62,"left":375,"width":550,"height":135,"fontSize":18,"anchor":"TR"},'+ 
	'"playButton":{"top":407,"left":708,"width":193,"height":133,"fontSize":16,"anchor":"BR"},'+ 
	'"titlePlayText":{"top":437,"left":708,"width":193,"height":85,"fontSize":42.66666793823242,"anchor":"BR"},'+ 
	'"playAgain":{"top":407,"left":465,"width":210,"height":133,"fontSize":16,"anchor":"BR"},'+ 
	'"moreGames":{"top":407,"left":710,"width":210,"height":133,"fontSize":16,"anchor":"BR"},'+ 
	'"playAgainButton":{"top":427,"left":465,"width":210,"height":85,"fontSize":28,"anchor":"BR"},'+ 
	'"moreGamesButton":{"top":427,"left":710,"width":210,"height":85,"fontSize":28,"anchor":"BR"},'+ 
	'"levelMessageCharacter":{"top":70,"left":0,"width":405,"height":470,"fontSize":16,"anchor":"BL"},'+ 
	'"loadingScreen":{"top":0,"left":0,"width":1064,"height":592,"fontSize":16,"anchor":"S"},'+ 
	'"titleScreen":{"top":0,"left":0,"width":1064,"height":592,"fontSize":16,"anchor":"S"},'+ 
	'"levelMessage":{"top":0,"left":0,"width":1064,"height":592,"fontSize":16,"anchor":"S"},'+ 
	'"loadingMessage":{"top":400,"left":100,"width":760,"height":0,"fontSize":24,"anchor":"C"},'+ 
	'"levelBackground":{"top":0,"left":0,"width":960,"height":540,"fontSize":16,"anchor":"S"},'+ 
	'"exitButton2":{"top":7,"left":890,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"soundButton2":{"top":5,"left":843,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"soundButton2off":{"top":5,"left":843,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"soundButton3":{"top":5,"left":843,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"soundButton3off":{"top":5,"left":843,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"headingText":{"top":92,"left":320,"width":320,"height":90,"fontSize":40,"anchor":"C"},'+ 
	'"loadingBackground":{"top":0,"left":0,"width":960,"height":540,"fontSize":16,"anchor":"C"},'+ 
	'"loadingCharacter":{"top":0,"left":0,"width":0,"height":0,"fontSize":16,"anchor":"BL"},'+ 
	'"loadingGraphic":{"top":230,"left":0,"width":960,"height":67,"fontSize":16,"anchor":"C"},'+ 
	'"endGameText":{"top":92,"left":420,"width":420,"height":90,"fontSize":40,"anchor":"TR"},'+ 
	'"loadingRing":{"top":164,"left":374,"width":212,"height":212,"fontSize":16,"anchor":"C"},'+ 
	'"loadingRingCenter1":{"top":250,"left":460,"width":40,"height":40,"fontSize":16,"anchor":"C"},'+ 
	'"loadingRingCenter2":{"top":250,"left":460,"width":40,"height":40,"fontSize":16,"anchor":"C"},'+ 
	'"loadingRingCenter3":{"top":250,"left":460,"width":40,"height":40,"fontSize":16,"anchor":"C"},'+ 
	'"loadingRingCenter4":{"top":250,"left":460,"width":40,"height":40,"fontSize":16,"anchor":"C"},'+ 
	'"loadingRingCenter5":{"top":250,"left":460,"width":40,"height":40,"fontSize":16,"anchor":"C"},'+ 
	'"loadingRingCenter6":{"top":250,"left":460,"width":40,"height":40,"fontSize":16,"anchor":"C"},'+ 
	'"loadbarBackground":{"top":400,"left":400,"width":160,"height":16,"fontSize":16,"anchor":"C"},'+ 
	'"loadbarBackground2":{"top":420,"left":720,"width":160,"height":16,"fontSize":16,"anchor":"BR"},'+ 
	'"titleBackground":{"top":0,"left":0,"width":960,"height":540,"fontSize":16,"anchor":"S"},'+ 
	'"titleInstructions":{"top":305,"left":523,"width":420,"height":55,"fontSize":16,"anchor":"BR"},'+ 
	'"titleInstructionsImage":{"top":122,"left":523,"width":420,"height":229,"fontSize":12,"anchor":"BR"},'+ 
	'"titleInstructionsImage_PC":{"top":122,"left":523,"width":420,"height":229,"fontSize":12,"anchor":"BR"},'+ 
	'"titleCharacter":{"top":40,"left":82,"width":423,"height":492,"fontSize":16,"anchor":"BL"},'+ 
	'"exitButton":{"top":7,"left":890,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"soundButton":{"top":5,"left":843,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"soundButtonoff":{"top":5,"left":843,"width":48,"height":48,"fontSize":16,"anchor":"TR"},'+ 
	'"levelMessage1":{"top":90,"left":0,"width":147,"height":164,"fontSize":16,"anchor":"BL"},'+ 
	'"levelMessage2":{"top":195,"left":0,"width":105,"height":227,"fontSize":16,"anchor":"BL"},'+ 
	'"levelMessage3":{"top":280,"left":40,"width":102,"height":107,"fontSize":16,"anchor":"BL"},'+ 
	'"pauseButton":{"top":7,"left":880,"width":64,"height":64,"fontSize":16,"anchor":"TR"},'+ 
	'"gameScore":{"top":20,"left":20,"width":100,"height":70,"fontSize":50.66666793823242,"anchor":"TL"},'+ 
	'"gameDistance":{"top":20,"left":430,"width":100,"height":70,"fontSize":50,"anchor":"TC"},'+ 
	'"gamePowerup0":{"top":435,"left":350,"width":100,"height":88,"fontSize":16,"anchor":"BC"},'+ 
	'"gamePowerup1":{"top":435,"left":436,"width":76,"height":88,"fontSize":16,"anchor":"BC"},'+ 
	'"gamePowerup2":{"top":435,"left":523,"width":76,"height":88,"fontSize":16,"anchor":"BC"},'+ 
	'"ninjagoLogo":{"top":17,"left":11,"width":215,"height":48,"fontSize":16,"anchor":"TL"},'+ 
	'"ninjagoLogo2":{"top":17,"left":11,"width":215,"height":48,"fontSize":16,"anchor":"TL"},'+ 
	'"ninjagoLogo3":{"top":450,"left":11,"width":215,"height":48,"fontSize":16,"anchor":"BL"},'+ 
	'"ninjaLogoText":{"top":66,"left":11,"width":215,"height":25,"fontSize":10.3,"anchor":"TL"},'+ 
	'"ninjaLogoText2":{"top":66,"left":11,"width":215,"height":25,"fontSize":10.3,"anchor":"TL"},'+ 
	'"ninjaLogoText3":{"top":497,"left":2,"width":233,"height":25,"fontSize":10.3,"anchor":"BL"},'+ 
	'"ninjagoLogo4":{"top":20,"left":372,"width":215,"height":48,"fontSize":16,"anchor":"TC"},'+ 
	'"ninjaLogoText4":{"top":70,"left":372,"width":215,"height":25,"fontSize":12,"anchor":"TC"},'+ 
	'"EndDistanceLabel":{"top":170,"left":320,"width":395,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"EndDistance":{"top":170,"left":735,"width":100,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"EndScore":{"top":220,"left":735,"width":100,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"EndScoreLabel":{"top":220,"left":320,"width":395,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"BestDistanceLabel":{"top":270,"left":320,"width":395,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"BestDistance":{"top":270,"left":735,"width":100,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"BestScore":{"top":320,"left":735,"width":100,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"BestScoreLabel":{"top":320,"left":320,"width":395,"height":39,"fontSize":32,"anchor":"TR"},'+ 
	'"siteLink":{"top":460,"left":0,"width":186,"height":50,"fontSize":16,"anchor":"BL"},'+ 
	'"siteLinkText":{"top":474,"left":-10,"width":210,"height":592,"fontSize":20,"anchor":"BL"},'+ 
	'"siteLink2":{"top":460,"left":0,"width":186,"height":50,"fontSize":16,"anchor":"BL"},'+ 
	'"siteLinkText2":{"top":474,"left":-10,"width":210,"height":592,"fontSize":20,"anchor":"BL"}}'); 
	if (isMobile) {
		baseLocs.siteLink.top=420;
		baseLocs.siteLink2.top=420;
		baseLocs.siteLinkText.top=434;
		baseLocs.siteLinkText2.top=434;
		baseLocs.ninjagoLogo3.top-=30;
		baseLocs.ninjaLogoText3.top-=30;
	}
	return baseLocs;
}
if (!audioFallback){
	var listener = new THREE.AudioListener();
	var soundChanNum = 0;
	var soundList = [];//
	for (var idx= 0; idx<2; idx++) {
		soundList.push(new THREE.Audio( listener ));
	}

	music = new THREE.Audio( listener );

	music.hasPlaybackControl = true;
}
function playSound(sndId) {
	if (isMuted) return false;

	if (audioFallback) {
		if (sounds[sndId]) {
			sounds[sndId].currentTime=0;
			sounds[sndId].play();
		} else {
			//trace("can't Play:"+sndId);
			return true;
		}
		return false;
	}
	var sound = soundList[soundChanNum];
	if (sound!=undefined) {
		var tBuf = sounds[sndId];
		if (tBuf!==undefined){
			//if (sound.isPlaying) {
			//	sound.stop();
				//setTimeout(playSound,10,sndId);
				//return false;
			//}
				sound = new THREE.Audio( listener );
			soundChanNum++;
			if (soundChanNum>=soundList.length) soundChanNum=0;
			sound.setBuffer( tBuf );
			sound.setLoop(false);
			sound.play();
		} else {
			return true;
		}
	}
	return false;
}

var lastMusicPlay = "";
var firstEvent = 0;
function playMusic(sndId) {
	
	if (isMuted) {
		
		lastMusicPlay = sndId;
		return false;
	}
	if (isMobile && !firstEvent) {
		//return;
	}
	if (audioFallback) {
		if (lastMusicPlay!=""&& lastMusicPlay!=undefined && sounds[lastMusicPlay]) sounds[lastMusicPlay].pause();
		if (sounds[sndId]) {
			lastMusicPlay = sndId;
			sounds[sndId].paused = false;
			sounds[sndId].loop=true;
			sounds[sndId].play();
			if (sounds[sndId].readyState>3){
				sounds[sndId].currentTime = 0;
			}
			music.isReallyPlaying = true;
			
		} else {
			return true;
		}
		return false;
	} 
	if (music===undefined){
		//console.log("Music is dead!");
	}
	
	if (music.isReallyPlaying ) {
		music.stop();
		music.isReallyPlaying = false;
		setTimeout(playMusic,5,sndId);
		return;
	}
	music = new THREE.Audio( listener );
	var tBuf = sounds[sndId];
	if (tBuf!==undefined){
		music.setBuffer( tBuf );
		music.setLoop(true);
		music.setVolume(0.5);
		music.play(); 
		//trace(music);
		music.isReallyPlaying = true;
	} else {
		return true;
	}
	
	lastMusicPlay = sndId;
	return false;
}

function stopMusic() {
	if (isMuted) {
		return;
	}
	if (audioFallback) {
		if ( lastMusicPlay!=""  && sounds[lastMusicPlay] ) {
			sounds[lastMusicPlay].pause();
		}
	} else {
		if (music.isReallyPlaying ) {
			music.isReallyPlaying=false;
			music.stop();
		}
	}
}





















