// JavaScript Document
var mouse = new THREE.Vector2();
/*
//function keyDownEventHandler(event) {
window.addEventListener("keydown", function (event) {
	//console.log("keydown.listener:" + event.key);
	handleKeyEvent(event);
	event.preventDefault();
	return false;
}, true);

if (document.attachEvent !== undefined) {
	document.attachEvent("onkeydown", function (event) {
		//console.log("onkeydown.event:" + event.key);
		handleKeyEvent(event);
		return false;
	}, true);
}

function handleKeyEvent(event) {
	//window.addEventListener("keydown", function (event) {

	if (gameState !== 2) {
		//advanceGameState();
		return true;
	} else {
		//document.getElementById("headingText").style.visibility="hidden";
		currentMotion = -1;
		//endCelebration();
		switch (event.key) {
			case "Space":
			case " ":
				startPowerupSequence();
				break;
			case "ArrowDown":
			case "Down":
				currentMotion = 3;
				// code for "down arrow" key press.
				break;
			case "ArrowUp":
			case "Up":
				currentMotion = 1;
				// code for "up arrow" key press.
				break;
			case "ArrowLeft":
			case "Left":
				currentMotion = 4;
				// code for "left arrow" key press.
				break;
			case "ArrowRight":
			case "Right":
				currentMotion = 2;
				// code for "right arrow" key press.
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}
		if (currentMotion > -1) {
			lastActionTime = Date.now();
		}
	}
	// Cancel the default action to avoid it being handled twice
	event.preventDefault();

	return false;
} //,true);
*/
function enableGameTouches() {
	document.addEventListener('touchstart', F_event_Touch_onDocument_handle, false);
	document.addEventListener('touchend', F_event_Touch_onDocument_handle, false);
	window.addEventListener('touchmove', F_event_Touch_onDocument_handle, false);
	document.addEventListener('mousedown', F_event_Touch_onDocument_handle, false);
	document.addEventListener('mouseup', F_event_Touch_onDocument_handle, false);
	window.addEventListener('mousemove', F_event_Touch_onDocument_handle, false);
}

function disableGameTouches() {
	document.removeEventListener('touchstart', F_event_Touch_onDocument_handle, false);
	document.removeEventListener('touchend', F_event_Touch_onDocument_handle, false);
	window.removeEventListener('touchmove', F_event_Touch_onDocument_handle, false);
	document.removeEventListener('mousedown', F_event_Touch_onDocument_handle, false);
	document.removeEventListener('mouseup', F_event_Touch_onDocument_handle, false);
	window.removeEventListener('mousemove', F_event_Touch_onDocument_handle, false);
}
enableGameTouches();

//===========================================================================================
//console.log("addEventListener");
var thisTouch = {
	x: -100,
	y: -1
};
var LovelyPie = Math.PI * 1.25;
var lastActionTime = -1;
var nextPowerupTime = 0;
var next_tap_time = -1;

function F_event_Touch_onDocument_handle(evt) {

	if (gameState<2 && lastMusicPlay!="" && isMobile) {
		//console.log("play First Sound Mobile");
		if (firstEvent<3){
			//playSound("Jay_EndOfLevel");
			firstEvent++;
			playMusic(lastMusicPlay);
		}
	}
	
	//if (gameState>1) evt.preventDefault(); //... this prevents window from sliding about.
	//------------------------------------------------------------------------------------
	if (evt.type.indexOf("touch") > -1) {
		if (evt.touches.length > 1) {
			// || (evt.type == "touchend" && evt.touches.length > 0))
			//... if more than 1 touch detected then ignore.
			return;
		}
	}
	//------------------------------------------------------------------------------------
	var reaction_type = null;
	var touch = null;
	//... see here for event types  http://www.w3schools.com/jsref/dom_obj_event.asp  

	switch (evt.type) {
		case "touchstart":
			touch = evt.changedTouches[0]; //... specify which touch for later extraction of XY position values.
			reaction_type = "onclick";
			break;
		case "touchmove": 
			touch = evt.changedTouches[0];
			reaction_type = "mousemove";
			break;
		case "touchend": // I don't use this   
			touch = evt.changedTouches[0];
			reaction_type = "mouseup";
			break;
		case "mousedown":
			reaction_type = "onclick";
			touch = evt;
			break;
		case "mousemove":
			reaction_type = "mousemove";
			touch = evt;
			break;
		case "mouseup":
			touch = evt;
			reaction_type = "mouseup";
			break;
	}
	
	mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
	if (Date.now()>next_tap_time) {
		if (reaction_type === "onclick" && gameState==2) {
			next_tap_time=Date.now()+250;
			//if (thisTouch.x > -100) {
			if (flyState==1) {
				stopWheel();
			}
			if (flyState == 0) {
				//start spinner
				startRotate();
				flyState=1;
			}
			thisTouch.x = -100;
			//}
		}
	}
				
	/*
	if (reaction_type === "onclick") {
		if (flyState == 2) {
			if (isPaused || evt.target.id.indexOf("Button")>-1 || evt.target.id.indexOf("Options")>-1) {
				//trace("pu blocked");
				return;
			}
		} else {
			
			if (gameState==2 && flyState == 0) {
			}
		}
	} // if (reaction_type == "onclick").
	
	//return false;
	if (reaction_type === "mousemove") {

		evt.preventDefault();
	}*/
}

