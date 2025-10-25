

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- recap screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function RecapScreen (gameData={"progress":6235}){
	window.GAME=undefined;
	var me = this;
	me.id = "screen";

	//---------------------------
	// init
	//---------------------------

	window.LEGAL.doShow(1);
	
	if(window.__snds.getNowPlaying("music") != "music_title_loop"){
	  window.__snds.playSound("music_title_loop", "music", -1, .25);
	}

	this.doStartMusic = function(){
		createjs.Sound.muted = !0;		
		if (!window.__snds.mute) {
			setTimeout(	function(){
				if ( createjs.Sound.activePlugin.context && ("interrupted" == createjs.Sound.activePlugin.context.state || "suspended" == createjs.Sound.activePlugin.context.state)) createjs.Sound.activePlugin.context.resume();

				createjs.Sound.muted = !1;
				window.__snds.playSound("music_title_loop", "music", -1, .25);
			},200);     
		}
    }

	var container = document.getElementById("div_screens");
	__utils.doDestroyAllChildren(container);

	var center_block = container.appendChild(document.createElement("div"));
	center_block.className="recap_container";
		
	//Elements
	var item_names ="recap_Russ,recap_Zoe,recap_Roman,recap_RM,recap_HM,recap_PR,recap_SCORE_Label,recap_SCORE_Label_shadow,recap_Score_Shadow,recap_Score,WELCOME_TO_NARNIA,recap_PLAY_MORE,recap_INSTRUCTIONS,recap_WATCH_TRAILER,recap_legal,recap_date,Title_copy,recap_top_rect,recap_RUSS,recap_HANK,recap_background".split(",");
	var reveal_items ="recap_RUSS,recap_HANK,recap_date,Title_copy,recap_SCORE_Label,recap_SCORE_Label_shadow,recap_Score_Shadow,recap_Score,recap_Russ,recap_Zoe,recap_Roman,recap_RM,recap_HM,recap_PR,WELCOME_TO_NARNIA,recap_PLAY_MORE,recap_INSTRUCTIONS,recap_WATCH_TRAILER".split(",");
	var items = {};
	//recap_GET_TICKETS
	for (var idx=0; idx<item_names.length; idx++) {
		var tItem = center_block.appendChild(document.createElement("div"));
		tItem.id = item_names[idx];
		tItem.className=item_names[idx];
		items[item_names[idx]]=tItem;
	}
	for (var idx=0; idx<6; idx++) {
		var find = item_names[idx].substring(item_names[idx].indexOf("_"));
		if (gameData.final.indexOf("NPC"+find)==-1) {
			document.getElementById(item_names[idx]).style.backgroundImage="url(media/recap/result_token_off.png)"
		}
	}
	if (gameData.progress<oCONFIG.recap_mid_score) {
		__utils.doHTMLText(items.WELCOME_TO_NARNIA, oLANG.Recap_Zero);
	} else {
		if (gameData.progress<oCONFIG.recap_high_score) {
			__utils.doHTMLText(items.WELCOME_TO_NARNIA, oLANG.Recap_Half);
		}
		else{
			__utils.doHTMLText(items.WELCOME_TO_NARNIA, oLANG.Recap_Full);
		}
	}

	
	__utils.doHTMLText(items.recap_date, date_msg);
	__utils.doHTMLText(items.recap_SCORE_Label, oLANG.Recap_Score_Label);
	__utils.doHTMLText(items.recap_SCORE_Label_shadow, oLANG.Recap_Score_Label);
	__utils.doHTMLText(items.recap_Score, oLANG.Recap_Score);
	__utils.doHTMLText(items.recap_Score_Shadow, oLANG.Recap_Score);
	items.recap_Score.innerHTML=""+gameData.progress;
	items.recap_Score_Shadow.innerHTML=""+gameData.progress;
	
	var text_items = {
		"recap_SCORE_Label":"Recap_Score_Label",
		"recap_SCORE_Label_shadow":"Recap_Score_Label",
		"recap_PLAY_MORE":"B_PLAY_MORE",
		"recap_INSTRUCTIONS":"B_INSTRUCTIONS",	
		"recap_WATCH_TRAILER":"B_WATCH_TRAILER"
	};
	//
	
	var b_play = items.recap_PLAY_MORE;
	var b_watch = items.recap_WATCH_TRAILER;
	var b_instructions = items.recap_INSTRUCTIONS;
		
	
	var keys = Object.keys(text_items);
	for (var idx=0; idx< keys.length; idx++) {
		__utils.doHTMLText(items[keys[idx]],oLANG[text_items[keys[idx]]]);
	}
	
	b_play.onmouseup = function(e){
		__snds.playSound("snd_click", "interface");
		me.doDestroy();
		window.dataLayer = window.dataLayer || []; 
		window.dataLayer.push({'event': 'play_more_button','page_title':'caught stealing game game over','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		doFinishLoading(function(){
			//CREEN = new PickerScreen();			
			SCREEN = new GameScreen();
			window.GAME = new Game(1);
		});
	}
	
	//watch button
	//var b_watch= center_obj.appendChild(document.createElement("div"));
	//b_watch.className = "B_WATCH_TRAILER";
	//__utils.doHTMLText(b_watch, oLANG.B_WATCH_TRAILER);
	b_watch.onmouseup = function(e){
		__snds.playSound("snd_click", "interface");
        window.dataLayer = window.dataLayer || []; 
		window.dataLayer.push({'event': 'get_tickets_button','page_title':'caught stealing game game over','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		window.open(oLANG["watch_link"].value ,"_blank");
	}
	
	//ticket button
	//var b_instructions= center_obj.appendChild(document.createElement("div"));
	//b_instructions.className = "B_GET_TICKETS";
	//__utils.doHTMLText(b_instructions, oLANG.B_GET_TICKETS);
	
	b_instructions.onmouseup = function(e){
		__snds.playSound("snd_click", "interface");
		window.dataLayer = window.dataLayer || []; 
		window.dataLayer.push({'event': 'how_to_play_button','page_title':'caught stealing game game over','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':'us','genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		SCREEN = new InstructionsScreen();
	}
	

	b_play.onmouseover = function(e){
		TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
	}
	b_play.onmouseout = function(e){
		TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
	}

	
	//---------------------------
	// resize update
	//---------------------------
	this.doResizeUpdate = function(){

		var column_x;

		column_x = (oSTAGE.wrapper_width-center_block.offsetWidth) * 0.5;		
		center_block.style.left = column_x+"px";//((column_x - (center_obj.clientWidth*0.5) -330 ) |0)+ "px";	
	}


	


	//---------------------------
	// transition
	//---------------------------

	this.doReveal = function(){
		
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
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	window.update_queue.push(resize_updater);
}