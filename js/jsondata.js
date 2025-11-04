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
	var elm = document.getElementById(elementId).style.backgroundImage="url("+oLANG_IMAGES[imageId]+")";
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
					setLegalText();
					
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
	var tAsset = oLANG[sourceName];
	if (tAsset==undefined) {
		console.log("setFieldText( def "+sourceName+")");
		return;
	}
	var tField;
	if (fieldName!=""){
		tField = document.getElementById(fieldName);
	} else {
		tField = document.getElementById(tAsset.target);
	}
	if (tField==undefined) {
		console.log("setFieldText( missing "+fieldName+")");
		return;
	}
	if (tField !== undefined && tAsset !== undefined) {
		//tField.style.visibility="visible";
		
		__utils.doHTMLText(tField,tAsset);//element, o, append
		
		return;		
	}
}

function setFrame(frameNum, model) {

	var offsets = model.material.offsets;
	model.material.map.offset.set(offsets[frameNum][0], offsets[frameNum][1]);
}

function shiftAudioButtons() {

}
var listener;
var soundChanNum;
var soundList;

if (!audioFallback){
	initAudio();
}
function initAudio() {
	listener = new THREE.AudioListener();
	soundChanNum = 0;
	soundList = [];//
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
	if (sound.context && (sound.context.state=="suspended" || sound.context.state=="interupted")) sound.context.resume();
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
			//console.log("sound");
			//console.log(sound);
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
	//if (music) console.log(music.context.state);
	music = new THREE.Audio( listener );
	if (music && music.context && (music.context.state=="suspended" || music.context.state=="interupted")) music.context.resume();
	var tBuf = sounds[sndId];
	if (tBuf!==undefined){
		music.setBuffer( tBuf );
		music.setLoop(true);
		music.setVolume(0.5);
		music.play(); 
			//console.log("music");
			//console.log(music);
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
function stopAllSounds() {
	if (isMuted) {
		return;
	}
	for (var idx=0; idx<soundList.length; idx++) {
		if (soundList[idx].isPlaying) soundList[idx].stop();
	}
}

  

















