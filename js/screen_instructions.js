//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- instructions screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////





function InstructionsScreen (){

	var me = this;

	//---------------------------
	// init
	//---------------------------

	var container = document.getElementById("div_screens");
	__utils.doDestroyAllChildren(container);

	var center_block = container.appendChild(document.createElement("div"));
	center_block.className="recap_container";
	center_block.style.backgroundColor="black";

	//Elements ,recap_legal_content
	var item_names ="instructions,inst_b_PLAY,recap_legal,recap_date,Title_copy,recap_top_rect,recap_RUSS,recap_HANK,inst_background".split(",");
	var reveal_items ="instructions,inst_b_PLAY,recap_RUSS,recap_HANK".split(",");
	var items = {};
	//recap_GET_TICKETS
	for (var idx=0; idx<item_names.length; idx++) {
		var tItem = center_block.appendChild(document.createElement("div"));
		tItem.className=item_names[idx];
		items[item_names[idx]]=tItem;
	}
	//
	if (!_isMobile) {
		items.instructions.className+="_PC";
	}
	
	
	__utils.doHTMLText(items.recap_date, date_msg);
	
	__utils.doHTMLText(items.inst_b_PLAY, oLANG.play);
	
	var text_items = {
		"inst_b_PLAY":"play"
	};
		
	var b_play = items.inst_b_PLAY;		
	
	var keys = Object.keys(text_items);
	for (var idx=0; idx< keys.length; idx++) {
		__utils.doHTMLText(items[keys[idx]],oLANG[text_items[keys[idx]]]);
	}
	
	b_play.onmouseup = function(e){
		
		me.doDestroy();
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({'event': 'play_game_button','page_title':'caught stealing game pre-game','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		doFinishSecondLoading(
				function(){
				SCREEN = new GameScreen();
				window.GAME = new Game(1);
					window.LEGAL.doHide();
				}
			);
		window.__snds.playSound("snd_click", "interface");
	}
	b_play.onmouseover = b_play.ontouchstart = function(e){
		TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
	}
	b_play.onmouseout = b_play.ontouchend = function(e){
		TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
	}
		
	this.doStartMusic = function(){
		createjs.Sound.muted = !0;
		if (!window.__snds.mute) {
			setTimeout(	function(){if ( 
				createjs.Sound.activePlugin.context && ("interrupted" == createjs.Sound.activePlugin.context.state || "suspended" == createjs.Sound.activePlugin.context.state)) createjs.Sound.activePlugin.context.resume();
				createjs.Sound.muted = !1;
				window.__snds.playSound("music_title_loop", "music", -1, .25);
			},200);     
		}
    }
	

	//---------------------------
	// resize update
	//---------------------------

	this.doResizeUpdate = function(){

		var column_x;

		column_x = (oSTAGE.wrapper_width-center_block.offsetWidth) * 0.5;		
		center_block.style.left = column_x+"px";	
		
		/*
		var column_x = oSTAGE.wrapper_width * 0.5;
		var tscale = Math.min(oSTAGE.wrapper_width/644.0,oSTAGE.wrapper_height/1120.0 )
		
		//film_logo_block.style.left = (column_x - (film_logo_block.clientWidth * 0.5)) + "px";
		logo_date.style.left = (column_x - (logo_date.clientWidth * 0.5)) + "px";
		inst_shadow.style.left = (column_x - (inst_shadow.clientWidth * 0.5)) + "px";
		
		b_play.style.left = (column_x - (b_play.clientWidth * 0.5)) + "px";
		
		if(oSTAGE.is_landscape){
			b_play.style.bottom = "58px";
		}else{
			b_play.style.bottom = "80px";
		}


		var y1 = logo_date.offsetTop + logo_date.clientHeight + 20;
		var y2 = b_play.offsetTop - 20;
		var s = ((y2-y1) * 0.5)-100;
		var sw = Math.min(oSTAGE.wrapper_width - 200,(y2-y1));

		instructions_image.style.top = (y1) + "px";
		instructions_image.style.height = sw + "px";//(y2-y1) + "px";
		instructions_image.style.width = sw + "px";//Math.min(768, (oSTAGE.wrapper_width - 200)) + "px";

		instructions_image.style.left = ((container.clientWidth - instructions_image.clientWidth) * 0.5 ) + "px";
		
		var inst_scale= 20*sw/942.0;
		
		instructions_image_frame.style.top = (y1-inst_scale) + "px";
		instructions_image_frame.style.height = (sw+(2*inst_scale)) + "px";//(y2-y1) + "px";
		instructions_image_frame.style.width = (sw+(2*inst_scale)) + "px";//Math.min(768, (oSTAGE.wrapper_width - 200)) + "px";

		instructions_image_frame.style.left = ((container.clientWidth - (sw+(2*inst_scale))) * 0.5 ) + "px";
		*/
		
	}


	//---------------------------
	// transition
	//---------------------------

	this.doReveal = function(){
		
		items.inst_background.style.opacity=0;
		TweenLite.to(items.inst_background, 3.0, {opacity:"1", overwrite:true, ease: Elastic.easeOut.config(1.0, .8)});
		
		for (var idx=0; idx< reveal_items.length; idx++) {
			var item = reveal_items[idx];
			if (items[item].offsetLeft<322) {
				items[item].style.transform = "translateX(" + ( - items[item].offsetWidth-oSTAGE.wrapper_width) + "px)";
				TweenLite.to(items[item], 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeIn.config(0.5,0.5), delay: (idx*0.1)});
			} else {
				items[item].style.transform = "translateX(" + (oSTAGE.wrapper_width - items[item].offsetLeft) + "px)";
				TweenLite.to(items[item], 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeIn.config(0.5,0.5), delay: (idx*0.1)});
			}
			
		}
	}
	

	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function(){
		container.style.backgroundColor = "";
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
	
.inst_b_PLAY 	"media/title/btn_play_up.png"
.arrowR 		"media/arrowR.png"
.arrowL 		"media/arrowL.png"
.Speechballoon_copy "media/inst_balloon.png"
.instructions 	"media/instructions.gif"
.inst_background "media/inst_background.jpg"

*/

