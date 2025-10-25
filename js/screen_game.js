//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- game screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function GameScreen() {

	var me = this;

	var msg_timeout;
	var show_logo = false;
	var legal_div;

	//---------------------------
	// init
	//---------------------------

	var container = document.getElementById("div_screens");
	var canvas = document.getElementById("canvas_game");
	window.LEGAL.doHide(1);
	
	__utils.doDestroyAllChildren(container);
	container.style.backgroundColor = "";
	container.style.background = "";

	var hud_messages = container.appendChild(document.createElement("div"));
	hud_messages.className = "hud_messages";
	hud_messages.style.display = "none";
	
	if (show_logo) {
		var logo_group = container.appendChild(document.createElement("div"));
		logo_group.className="logo_game_group";
		
		var film_logo_block = logo_group.appendChild(document.createElement("div"));
		film_logo_block.className = "film_game_logo_block";	
		
		var logo_date = film_logo_block.appendChild(document.createElement("div"));
		logo_date.className = "film_game_logo_date";
		__utils.doHTMLText(logo_date, date_msg);	
	}
	
	var popupCharacter = container.appendChild(document.createElement("div"));
	popupCharacter.id = popupCharacter.name = "popupCharacter";
	popupCharacter.style.backgroundSize="contain";
	var popupTextBox = container.appendChild(document.createElement("div"));
	popupTextBox.id = popupTextBox.name = "popupTextBox";
	//__utils.doHTMLText(popupTextBox, oLANG["NPC_Roman"]);
	
	var score_backdrop = container.appendChild(document.createElement("div"));
	score_backdrop.className="score_backdrop";
	score_backdrop.innerHTML="0";
	
	//var game_hide = container.appendChild(document.createElement("div"));
	//game_hide.className = "game_hide";
	
	
	var showingPopup="";
	
	this.updateScore=function(score) {
		score_backdrop.innerHTML=""+score;
	}
	
	this.showDialog = function(charId,textId)
	{		
		if (showingPopup!=charId) {
			showingPopup=charId;
			//console.log("Popup "+charId);
			__utils.doHTMLText(popupTextBox, oLANG[textId]);
			popupCharacter.style.backgroundImage="url('"+oLANG[charId].srcpng+"')";
			popupCharacter.style.visibility="visible";
			popupTextBox.style.visibility="visible";
			//popupCharacter.style.top = (oSTAGE.wrapper_height + popupCharacter.offsetTop) + "px";			
			//popupCharacter.style.transform = "translateY(" + (oSTAGE.wrapper_height + popupCharacter.offsetHeight) + "px)";	
			//popupTextBox.style.transform = "translateY(" + (oSTAGE.wrapper_height + popupTextBox.offsetHeight) + "px)";
			//TweenLite.to(popupCharacter, 1.0, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8),delay:0});
			//TweenLite.to(popupTextBox, 1.0, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8),delay:0});
		}
	}
	this.hideDialog = function()
	{
		showingPopup="";
		popupCharacter.style.visibility="hidden";
		popupTextBox.style.visibility="hidden";
		//popupCharacter.style.transform = "translateY(" + (oSTAGE.wrapper_height + popupCharacter.offsetHeight) + "px)";	
		//popupTextBox.style.transform = "translateY(" + (oSTAGE.wrapper_height + popupTextBox.offsetHeight) + "px)";
	}
	this.hideDialog();
	
	this.doUpdateScore = function (value) {
		hud_score_amt.innerHTML = value;
	}

	this.doShowMessage = function (lang_obj, timeout) {

		__utils.doHTMLText(hud_messages, lang_obj);
		hud_messages.style.opacity = 1;
		hud_messages.style.display = "block";

		hud_messages.style.left = ((container.clientWidth - hud_messages.clientWidth) * 0.5) + "px";
		hud_messages.style.top = ((container.clientHeight - hud_messages.clientHeight) * 0.5) + "px";

		clearTimeout(msg_timeout);

		if (timeout) {
			msg_timeout = setTimeout(me.doHideMessage, timeout * 1000);
		}
	}

	this.doHideMessage = function () {
		TweenLite.to(hud_messages, 0.5, {
			opacity: 0,
			overwrite: true,
			onComplete: function () {
				hud_messages.style.display = "none";
			}
		});
	}

	//---------------------------
	// resize update
	//---------------------------

	this.doResizeUpdate = function () {

		hud_messages.style.left = ((container.clientWidth - hud_messages.clientWidth) * 0.5) + "px";
		hud_messages.style.top = ((container.clientHeight - hud_messages.clientHeight) * 0.5) + "px";

		score_backdrop.style.left = ((container.clientWidth - score_backdrop.clientWidth) * 0.5) + "px";
		
		//hud_score_amt.style.left = ((container.clientWidth - hud_score_amt.clientWidth) * 0.5) + "px";
		if(show_logo){
			logo_group.style.left = ((container.clientWidth - logo_group.clientWidth)/2.0 ) + "px";
			//film_logo_block.style.bottom = ( film_logo_block.clientHeight + 20) + "px";
			logo_group.style.top = "10px";
		}
		var leftSpot = ((container.clientWidth - oCONFIG.opage_width)/2.0 );
		popupCharacter.style.left =  leftSpot+ "px";
		popupCharacter.style.top = (oSTAGE.wrapper_height - 267)+"px";
		//popupCharacter.style.bottom = "0px";
		popupTextBox.style.left = (leftSpot+644-popupTextBox.offsetWidth)+"px";
		popupTextBox.style.top = (oSTAGE.wrapper_height - 110)+"px";
	}

	me.doResizeUpdate();
	//---------------------------
	// transition
	//---------------------------

	this.doReveal = function () {

		var delay = 1.0;

	}


	this.doHide = function () {

	}


	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function () {
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
		window.GAME=undefined;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {
		doResizeUpdate: me.doResizeUpdate
	};
	window.update_queue.push(resize_updater);
}