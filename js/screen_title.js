//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- title screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function TitleScreen (){

	var me = this;

	var res = "low";
	
	var s_character=Number(window.__utils.getQueryString().character);
	var s_progress=Number(window.__utils.getQueryString().progress);
	var s_final=Number(window.__utils.getQueryString().final);

	var doStartMusic = this.doStartMusic = function(){
		createjs.Sound.muted = !0;
		if (!window.__snds.mute) {
			setTimeout(	function(){
				if ( createjs.Sound.activePlugin.context && (
					"interrupted" == createjs.Sound.activePlugin.context.state || 
					"suspended" == createjs.Sound.activePlugin.context.state)) createjs.Sound.activePlugin.context.resume();

				createjs.Sound.muted = !1;
				window.__snds.playSound("music_title_loop", "music", -1, .25);
			},200);      
		}
        window.removeEventListener('touchstart', doStartMusic);
        window.removeEventListener('mousedown', doStartMusic);
    }

    if(window.__snds.getNowPlaying("music") != "music_title_loop"){
        if(platform.isMobile && !window.__snds.initialized){
            window.addEventListener('touchstart', doStartMusic, {passive:false, capture: false});
        }else{
            window.addEventListener('mousedown', doStartMusic, {passive:false, capture: false});
            //window.__snds.playSound("music_title_loop", "music", -1, .25);
        }
    }
	
	//---------------------------
	// init
	//---------------------------

	
	var container = document.getElementById("div_screens");
	__utils.doDestroyAllChildren(container);

	
	for (var idx=0; idx<3; idx++) {
		var loader_svg = container.appendChild(document.createElement("div"));
		loader_svg.id ="loadsvg"+idx;
	}
	
	var sub_wrapper = container.appendChild(document.createElement("div"));
	sub_wrapper.style.position="absolute";

	//Title_bar
	var Title_bar = sub_wrapper.appendChild(document.createElement("div"));
	Title_bar.className = "film_logo_block";
	
	var run_Title = sub_wrapper.appendChild(document.createElement("div"));
	run_Title.className = "run_Title";
	__utils.doHTMLText(run_Title, oLANG.run);
	
	//character
	var character = sub_wrapper.appendChild(document.createElement("div"));
	character.className = "character_title";
	
	//mid
	var character_mid = sub_wrapper.appendChild(document.createElement("div"));
	character_mid.className = "character_title_mid";
	
	var title_background = sub_wrapper.appendChild(document.createElement("div"));
	title_background.className = "title_background";

	//film logo
	//var film_logo_block = sub_wrapper.appendChild(document.createElement("div"));
	//film_logo_block.className = "film_logo_block";

	var logo_date = sub_wrapper.appendChild(document.createElement("div"));
	logo_date.className = "title_film_logo_date";
	__utils.doHTMLText(logo_date, date_msg);

	//game logo
	var game_logo = sub_wrapper.appendChild(document.createElement("div"));
	game_logo.className = "game_logo";
	//__utils.doHTMLText(game_logo, oLANG.title);

	//play button
	var b_play= sub_wrapper.appendChild(document.createElement("div"));
	b_play.className = "b_play";
	__utils.doHTMLText(b_play, oLANG.play);
	b_play.onmouseup = function(e){
		me.doDestroy();
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({'event': 'play_main_button','page_title':'caught stealing game main lander','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		doFinishLoading(function(){
			SCREEN = new InstructionsScreen();	
		});
		window.__snds.playSound("snd_click", "interface");
	}
	b_play.onmouseover= b_play.ontouchstart = function(e){
		TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
	}
	b_play.onmouseout = b_play.ontouchend = function(e){
		TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
	}

	//instructions button
	var b_instructions = sub_wrapper.appendChild(document.createElement("div"));
	b_instructions.className = "b_main";
	__utils.doHTMLText(b_instructions, oLANG.titlewatch);
	b_instructions.onmouseup = function(e) {
		window.__snds.playSound("snd_click", "interface"); 
        window.dataLayer = window.dataLayer || []; 
		window.dataLayer.push({'event': 'get_tickets_button','page_title':'caught stealing game main lander','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		
		window.open(oLANG["watch_link"].value ,"_blank");
	}
	
	b_instructions.onmouseover = b_instructions.ontouchstart = function(e){
		TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
	}
	b_instructions.onmouseout = b_instructions.ontouchend = function(e){
		TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
	}	
	
	//---------------------------
	// resize update
	//---------------------------

	this.doResizeUpdate = function(){

		var column_x;

		column_x = oSTAGE.wrapper_width * 0.5;
		b_play.style.left = "24px";
		b_instructions.style.right = "24px";
		b_play.style.bottom = "80px";
		b_instructions.style.bottom = "80px";
		var deg = 0;
		character.style.webkitTransform = 'rotate('+deg+'deg)'; 
		character.style.mozTransform    = 'rotate('+deg+'deg)'; 
		character.style.msTransform     = 'rotate('+deg+'deg)'; 
		character.style.oTransform      = 'rotate('+deg+'deg)'; 
		character.style.transform       = 'rotate('+deg+'deg)'; 

	
		sub_wrapper.style.left = ((column_x - (sub_wrapper.clientWidth * 0.5)-322 ) | 0) + "px";
		
	}
	

	//---------------------------
	// show
	//---------------------------

	this.doReveal = function(){
		Title_bar.style.transform = "translateX(" + (oSTAGE.wrapper_width - Title_bar.offsetLeft) + "px)";
		title_background.style.opacity = "translateX(" + (oSTAGE.wrapper_width - Title_bar.offsetLeft) + "px)";
		character.style.transform = "translateX(" + (oSTAGE.wrapper_width - character.offsetLeft) + "px)";
		character_mid.style.transform = "translateX(" + (oSTAGE.wrapper_width - character_mid.offsetLeft) + "px)";
		run_Title.style.transform = "translateX(" + (oSTAGE.wrapper_width - run_Title.offsetLeft) + "px)";
		b_play.style.transform = "translateY(" + (oSTAGE.wrapper_height - b_play.offsetTop) + "px)";
		b_instructions.style.transform = "translateY(" + (oSTAGE.wrapper_height - b_instructions.offsetTop) + "px)";

		var delay = 0.5;
		TweenLite.to(Title_bar, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		TweenLite.to(title_background, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: 0});
		TweenLite.to(run_Title, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		
		delay += .2;
		TweenLite.to(character, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		delay += 0.2;
		TweenLite.to(character_mid, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		delay += 1.0;
		TweenLite.to(b_play, .75, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		delay += .25;
		TweenLite.to(b_instructions, .75, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});

	}


	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function(){
		clearInterval(me.cheaterInterval);
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	window.update_queue.push(resize_updater);
	

}
function doFinishSecondLoading( callback ){

  __utils.doLoad3dAssets(assets_threejs_game, oMODELS);

  LOADER = new Loader(true);
  LOADER.doUpdate = function(){
    //var prog = (characterAssets.progress + assets_threejs_game.progress) * 0.5;
	//  this.doUpdateBar(prog);//Missing?
    //if(characterAssets.loaded && 
	  if(assets_threejs_game.loaded){
      this.purge = true;
      if(callback){
        callback();
      }
      LOADER.doFadeAndDestroy();
    }
  }
  actives.push(LOADER);
}