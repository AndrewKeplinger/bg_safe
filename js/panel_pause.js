
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- instructions screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function PopupPause (buttons){

	var me = this;

	//---------------------------
	// init
	//---------------------------

	var container = document.getElementById("div_pause");
	__utils.doDestroyAllChildren(container);


	var pause_menu_block = container.appendChild(document.createElement("div"));
	pause_menu_block.className = "pause_menu_block";

	var instructions = pause_menu_block.appendChild(document.createElement("div"));
	instructions.className="instructions_pause";
	
	if (!_isMobile) {
		instructions.className+="_PC";
	}
	

	for(var i=0; i<buttons.length;i++){
		var o = buttons[i];
		var button = pause_menu_block.appendChild(document.createElement("div"));
		button.className = "pause_menu";
		__utils.doHTMLText(button, o.msg);
		button.callback = o.callback;
		button.snd = o.snd;
		button.onmouseup = function(e){
			e.target.callback();
			window.__snds.playSound(e.target.snd, "interface");
			me.doDestroy();
		}
	}

	

	//---------------------------
	// resize update
	//---------------------------

	this.doResizeUpdate = function(){

		 var scale = Math.min(Infinity, (oSTAGE.screen_width/oCONFIG.opage_width), (oSTAGE.screen_height/oCONFIG.opage_height));
    
	    container.style.transform = container.style.webkitTransform = "scale(" + scale + "," + scale + ")";
	    container.style.width = (oSTAGE.screen_width * (1/scale)) + "px";
	    container.style.height = (oSTAGE.screen_height * (1/scale)) + "px";
	    

		pause_menu_block.style.top = ((container.clientHeight - pause_menu_block.clientHeight) * 0.5) + "px";
	}


	//---------------------------
	// transition
	//---------------------------

	this.doReveal = function(){
		
		

	}
	

	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function(){
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
		container.style.display = "none";

		window.__snds.unforceMute();
	}


	window.__snds.forceMute();
	container.style.display = "block";
	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	update_queue.push(resize_updater);
}