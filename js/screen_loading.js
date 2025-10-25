//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- preloader -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function Loader (show_logo){

  var me = this;

  var container = document.getElementById("div_loading");
  window.__utils.doDestroyAllChildren(container);

  container.style.display = "block";
  container.style.opacity = 1;


  //---------------------------
  // resize update
  //---------------------------

  this.doResizeUpdate = function(){

    trace("loading -> doResizeUpdate()");

    var scale = Math.min(Infinity, (oSTAGE.screen_width/800), (oSTAGE.screen_height/800));
    
    container.style.transform = container.style.webkitTransform = "scale(" + scale + "," + scale + ")";
    container.style.width = (oSTAGE.screen_width * (1/scale)) + "px";
    container.style.height = (oSTAGE.screen_height * (1/scale)) + "px";

  }

  this.doUpdateBar = function(prog){
    loader_bar_fill.style.width = (prog * 100) + "%";
  }

  this.doFadeAndDestroy = function(){
    window.__utils.doDestroyAllChildren(container);
    TweenLite.to(container, 1, {opacity: 0, overwrite:true, onComplete: me.doDestroy});
  }

  this.doDestroy = function(){
    window.__utils.doDestroyAllChildren(container);
    resize_updater.forget = true;
    //clean and hide container
    container.style.display = "none";

  }




  var table = container.appendChild(document.createElement("table"));
  table.setAttribute("border", "0");
  table.setAttribute("width", "100%");
  table.setAttribute("height", "100%");

  var tr = table.appendChild(document.createElement("tr"));
  var td = tr.appendChild(document.createElement("td"));
  td.setAttribute("align", "center");
  td.setAttribute("valign", "middle");


  //film logo
  if(show_logo){

	
	
    var film_logo_block = td.appendChild(document.createElement("div"));
    film_logo_block.className = "film_logo_block";
    film_logo_block.style.position = "relative";
    film_logo_block.style.display = "block";
    film_logo_block.style.top = "0px";
    film_logo_block.style.left = "0px";
	
	var game_logo = film_logo_block.appendChild(document.createElement("div"));
	game_logo.className = "game_logo";	
    game_logo.style.top = "-32px";
    game_logo.style.left = "50%";
	game_logo.style.marginLeft = "-161px"
	__utils.doHTMLText(game_logo, oLANG.title);
	
/*
    var logo = film_logo_block.appendChild(document.createElement("img"));
    logo.className = "film_logo_img";
    logo.style.height = "100px";
    //logo.src = window.oLANG_IMAGES.logo;
    logo.onload = function(){
      me.doResizeUpdate();
    }

    var logo_date = film_logo_block.appendChild(document.createElement("div"));
    logo_date.className = "film_logo_date";
    window.__utils.doHTMLText(logo_date, window.date_msg);*/
  }



  var spinner = td.appendChild(document.createElement("div"));
  spinner.className = "loader_spinner";
  spinner.style.position = "relative";
  spinner.style.display = "block";


  var loader_bar = td.appendChild(document.createElement("div"));
  loader_bar.className = "loader_bar";
  loader_bar.style.position = "relative";
  loader_bar.style.display = "block";

 var loader_bar_fill = loader_bar.appendChild(document.createElement("div"));
  loader_bar_fill.className = "loader_bar_fill";




  me.doResizeUpdate();
  var resize_updater = {doResizeUpdate : me.doResizeUpdate};
  window.update_queue.push(resize_updater);
   

}