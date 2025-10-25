
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- picker screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var curTouch={x:-1000,y:-1000}; // 
var GAME;
function PickerScreen() {
	var images = window.images;
	var oMODELS = window.oMODELS;
	var me = this;
	me.characterNum = -1;
	var msg_timeout;
	var hScroll = 0;
	//---------------------------
	// init
	//---------------------------

	this.doStartMusic = function(){
		createjs.Sound.muted = !0;
		setTimeout(	function(){
			if ( createjs.Sound.activePlugin.context && ("interrupted" == createjs.Sound.activePlugin.context.state || "suspended" == createjs.Sound.activePlugin.context.state)) createjs.Sound.activePlugin.context.resume();
			createjs.Sound.muted = !1;
			window.__snds.playSound("music_title_loop", "music", -1, .25);
		},200);       
    }

	var container = document.getElementById("div_screens");
	__utils.doDestroyAllChildren(container);
	container.style.backgroundColor = "#ce3734";
	container.style.background = "url('media/RedUIBG.jpg')";
	container.style.backgroundSize="cover";
	
	var pickerElements = {
		"CHOOSE_A_LEVEL": {type:"text"},
		"Level_1_CALLUM": {type:"text"},
		"CALLUM": {type:"image",src:"media/picker/CALLUM_pick.png", button:"Play",id:2},
		"Level_2_JACK": {type:"text"},
		"JACK": {type:"image",src:"media/picker/JACK_pick.png", button:"Play",id:1},
		"Level_3_GARCIA": {type:"text"},
		"GARCIA": {type:"image",src:"media/picker/GARCIA_pick.png", button:"Play",id:3}
	}
	
	/*		
		"FrankLockLayer":{type:"group", hide:"Frank",align:"center"},
		"FrankLockImage":{type:"image", src:("media/picker/small_lock.png")},
		"FrankLockText":{type:"text"},
	*/
	if (window.oUSER.char1===undefined) window.oUSER.char1=0;
	if (window.oUSER.char2===undefined) window.oUSER.char2=0;
	if (window.oUSER.char3===undefined) window.oUSER.char3=0;
	
	var availableCharacters = [true,true,true];		
	
	var subContainer = container.appendChild(document.createElement("div"));
	subContainer.style.position="absolute";
	
	var keys = Object.keys(pickerElements);
	keys.forEach(function(key){
		var tObj = pickerElements[key];

		var elementType = "div";
		if (tObj.button!==undefined) {
			elementType="a";
		}
		var element = subContainer.appendChild(document.createElement("div"));
		tObj.element = element;
		element.id = element.className = key;
		//element = subContainer.appendChild(element);
		element.style.display="block";
		if (tObj.type==="text") {
			__utils.doHTMLText(element, oLANG[key]);
			//if (key==="PickerPlay") element.style.opacity=0.5;
		} else {
			element.style.backgroundSize="contain";
			element.style.backgroundImage="url("+(images[key].currentSrc||images[key].src)+")"
		}
		if (tObj.button!==undefined){
			element.style.cursor="pointer";
			element.style.pointerEvents="auto";
			switch (tObj.button){					
				case "Play":						
					//element.style.opacity=0.5;
					element.onmouseup = function(e){
						me.characterNum = tObj.id;						

						me.doDestroy();
						doFinishSecondLoading(me.characterNum, function(){
							SCREEN = new GameScreen();
							window.GAME = new Game(me.characterNum);
						});
						window.__snds.playSound("snd_click", "interface");							
					}
					element.onmouseover= function(e){
						TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
					}
					element.onmouseout = function(e){
						TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
					}
					break;
			}
		} else {
			element.style.pointerEvents="none";
		}
		
	});
	//if (GarciaAvailable) pickerElements["GarciaAvailable"].element.style.display="none";
	
	//---------------------------
	// show
	//---------------------------

	this.doResizeUpdate = function(){
		//scale everything
		var altScale = 1;
		var bottomShift = 0;
		var temp;
		//if (hScroll>1)hScroll=0;
		var column_x = oSTAGE.wrapper_width * 0.5;
		subContainer.style.left = ((column_x - (subContainer.clientWidth * 0.5)-330 ) | 0) + "px";
		
		/*
		if (oSTAGE.wrapper_ratio<0.5625){
			hScrollScaled = -((oSTAGE.scale_inv*window.innerHeight-((window.innerWidth*oSTAGE.scale_inv)*(540.0/960))));
			altScale = oSTAGE.scale_inv*window.innerWidth/960.0;
		} else {
			//if (oSTAGE.wrapper_ratio<1) hScroll=0.4;
			bottomShift = -((oSTAGE.scale_inv*window.innerWidth-((window.innerHeight*oSTAGE.scale_inv)*(960/540.0)))/2)/4;
			hScrollScaled = -((oSTAGE.scale_inv*window.innerHeight-((window.innerWidth*oSTAGE.scale_inv)*(540.0/960))))*(hScroll-0.25);
		}
		
		
		
		
		var keys = Object.keys(pickerElements);
		keys.forEach(function(key){
			var tObj =pickerElements[key];
			if (tObj.type=="group"){
				if (key==="PickerBackground") {
					if (altScale===1){
						temp = (window.innerHeight*oSTAGE.scale_inv)*(960/540.0);
						tObj.element.style.height = (window.innerHeight*oSTAGE.scale_inv)+"px";
						tObj.element.style.width = (temp)+"px";
						tObj.element.style.left = ((oSTAGE.scale_inv*window.innerWidth-temp)/2)+"px";
						tObj.element.style.top = "0px";
					} else {
						temp = (window.innerWidth*oSTAGE.scale_inv)*(540.0/960);
						tObj.element.style.width = (window.innerWidth*oSTAGE.scale_inv)+"px";
						tObj.element.style.height = (temp)+"px";
						tObj.element.style.top = ((oSTAGE.scale_inv*window.innerHeight-temp))+"px";
						tObj.element.style.left = "0px";
					}
				} else {
					if (tObj.align==="center"){
						tObj.element.style.bottom = bottomShift+"px";
						tObj.element.style.left = hScrollScaled+"px";
					}
				}
			}
		});*/
	}
	
	//---------------------------
	// show
	//---------------------------

	this.doReveal = function(){

	}

	
	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function(){
		clearInterval(me.pickerUpdate);
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	window.update_queue.push(resize_updater);
		
}

/*

function doFinishSecondLoading(characterId, callback){

  __utils.doLoad3dAssets(assets_threejs_game, oMODELS);
  var characterAssets;
	  switch (characterId){
		  case 1: characterAssets = assets_threejs_1;
			  break;
		  case 2: characterAssets = assets_threejs_2;
			  break;
		  case 3: characterAssets = assets_threejs_3;
			  break;
		  case 4: characterAssets = assets_threejs_4; 
			  break;
			  
	}
  __utils.doLoad3dAssets(characterAssets, oMODELS);

  LOADER = new Loader(true);
  LOADER.doUpdate = function(){
    var prog = (characterAssets.progress + assets_threejs_game.progress) * 0.5;
	  this.doUpdateBar(prog);//Missing?
    if(characterAssets.loaded && assets_threejs_game.loaded){
      this.purge = true;
      if(callback){
        callback();
      }
      LOADER.doFadeAndDestroy();
    }
  }
  actives.push(LOADER);
}
*/