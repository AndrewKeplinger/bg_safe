
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- controls (mute, fullscreen, pause) -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function ControlsPanel (){

	var me = this;
	var scale=oSTAGE.screen_width/(oCONFIG.legal_width);
	//---------------------------
	// init
	//---------------------------

	var container = document.getElementById("div_controls");
	var fit_ratio = 1.0*oCONFIG.legal_width/oCONFIG.legal_height;
	var anchor = document.getElementById("div_screens"); 
	
	//fullscreen button
	var fullScreen_capable = false;//document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled ? true : false;
	if(fullScreen_capable){
		//fullscreen
		var b_fullscreen = container.appendChild(document.createElement("div"));
		b_fullscreen.className = "b_fullscreen";
		b_fullscreen.onclick = function(e){
			if(oSTAGE.is_fullscreen){
				__utils.doFullScreenOff();
				b_fullscreen.className = "b_fullscreen";
			}else{
				__utils.doFullScreenOn();
				b_fullscreen.className = "b_fullscreen_on";
			}
		};
		
		if(oSTAGE.is_fullscreen){
			b_fullscreen.className = "b_fullscreen_on";
		}else{
			b_fullscreen.className = "b_fullscreen";
		}
	}

	//mute
	var b_mute =  container.appendChild(document.createElement("div"));
	b_mute.className = "b_mute_on";
	b_mute.onclick = function(){
	    if(window.__snds.toggleMute() == 0){
	      b_mute.className = "b_mute_on";
	      window.oUSER.is_mute = false;
	    }else{
	      b_mute.className = "b_mute";
	      window.oUSER.is_mute = true;
	    }
	    __localsaver.doSaveData("user", window.oUSER);
	}
	if(window.oUSER.is_mute){
		b_mute.className = "b_mute";
	}else{
		b_mute.className = "b_mute_on";
	}


	//pause
	var b_pause =  container.appendChild(document.createElement("div"));
	b_pause.className = "b_pause";
	b_pause.style.pointerEvents = "none";
	b_pause.style.transform = "translateY("+(-300*scale)+"px)";
	b_pause.onclick = function(){
	    if(window.GAME.is_paused){
	    	window.GAME.doUnPause();
	    }else{
	    	window.GAME.doPause();
	    }

	}


	//---------------------------
	// resize update
	//---------------------------
	
	
	this.doResizeUpdate = function(){

		scale = oSTAGE.screen_width/(oCONFIG.legal_width);
		
		var ratio = oSTAGE.screen_width/(fit_ratio*oSTAGE.screen_height);
		if (ratio>1) {
			scale = scale/ratio;
		}
		
		var right=(oSTAGE.screen_width-(oCONFIG.legal_width*scale))*0.5;
		container.style.transform = container.style.webkitTransform = "scale(" + scale + "," + scale + ")";
		container.style.right = right+"px";
		container.style.top = "30px";
		//container.style.width = (oCONFIG.legal_width) + "px";
		//container.style.left = ((oSTAGE.screen_width-(oCONFIG.legal_width*scale))/2)+"px";
	}


	//---------------------------
	// manage pause
	//---------------------------

	this.doShowPause = function(){
		b_pause.style.pointerEvents = "auto";
		TweenLite.set(b_pause, {transform: "translateY("+(-300*scale)+"px)", overwrite:true});
		TweenLite.to(b_pause, 1.2, {transform: "translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
	}

	this.doHidePause = function(){
		b_pause.style.pointerEvents = "none";
		TweenLite.to(b_pause, .4, {transform: "translateY("+(-300*scale)+"px)", overwrite:true, ease: Back.easeIn.config(1.5)});
	}


	me.doResizeUpdate();
	

	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	update_queue.push(resize_updater);



}