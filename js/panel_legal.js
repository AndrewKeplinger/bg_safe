
function LegalPanel (container_id){
	
	var me = this;

	var container = document.getElementById(container_id || "div_legal");
	container.style.pointerEvents = "none";
	container.style.backgroundColor = "black" ;//rgba(0,0,0,.5)";
	var my_bottom;
	var scale, scaled_height;
	var legal_width = oCONFIG.legal_width;
	if (_isMobile) legal_width = oCONFIG.legal_width_mobile;
	var anchor = document.getElementById("div_screens"); 
	var fit_ratio = 1.0*oCONFIG.legal_width/oCONFIG.legal_height;
	var hidden = false;
	var manually_hidden=false;
  //---------------------------
  // resize update
  //---------------------------

	this.doResizeUpdate = function(){
		scale = oSTAGE.screen_width/(oCONFIG.legal_width);
		var ratio = oSTAGE.screen_width/(fit_ratio*oSTAGE.screen_height);
		if (ratio>1) {
			scale = scale/ratio;
		}
		
		container.style.transform = container.style.webkitTransform = "scale(" + scale + "," + scale + ")";
		container.style.width = (oCONFIG.legal_width) + "px";
		scaled_height = Math.max(container.clientHeight) * scale ;
		container.style.left = far_black_backdrop.style.left = ((oSTAGE.screen_width-(oCONFIG.legal_width*scale))/2)+"px";
		var topper = (oSTAGE.screen_height-(scaled_height));	
		var foredrop = oCONFIG.legal_height;  //black_foredrop
		
		//if (anchor) topper = Math.min(topper, oCONFIG.legal_height*scale);		
		//var gap = -18-(oSTAGE.screen_height)+anchor.offsetHeight*scale+scaled_height;
		var gap = -18-(window.outerHeight)+(anchor.offsetHeight*scale)+scaled_height;
		if (hidden) {
			topper = Math.max(oSTAGE.screen_height,oCONFIG.legal_height*scale);
			gap -=scaled_height;
			foredrop=-4;
		}
		var oct = container.offsetTop;
		
		black_foredrop.style.top = ((black_foredrop.offsetTop*0.9) + (0.1*foredrop))+ "px";
		container.style.top = ((container.offsetTop*0.9) + (0.1*topper))+ "px";
		
		far_black_backdrop.style.width = (oCONFIG.legal_width*scale)+"px";
		//far_black_backdrop.style.left = anchor.offsetLeft+"px";
		
		if (Math.abs(container.offsetTop - oct)>1 || Math.abs(black_foredrop.offsetTop-foredrop)>1) {
			setTimeout(me.doResizeUpdate,20);
		} else {
			container.style.top=topper+"px";
			black_foredrop.style.top =foredrop+"px";
		}
	}
	
	container.style.top = oSTAGE.screen_height+"px";
	
	var black_backdrop = container.appendChild(document.createElement("div"));
	black_backdrop.className="black_backdrop";
	
	var far_black_backdrop = document.getElementById("div_backer");//container.appendChild(document.createElement("div"));
	far_black_backdrop.className="black_backdrop";
	far_black_backdrop.style.zIndex=0;
	far_black_backdrop.style.height="1000%";
	far_black_backdrop.style.top = "0px";
	//far_black_backdrop.style.top="-500px";
	
	var black_foredrop = container.appendChild(document.createElement("div"));
	black_foredrop.className="black_backdrop";
	black_foredrop.style.top=oCONFIG.legal_height+"px";
	black_foredrop.style.zIndex="6000";
	
	var legal_hide_show = container.appendChild(document.createElement("div"));
	legal_hide_show.className="legal_hide_show";
	__utils.doHTMLText(legal_hide_show, oLANG.legal_hide);
	legal_hide_show.onmouseup = function(e) {
		window.__snds.playSound("snd_click", "interface");
		if (hidden) {
			manually_hidden=false;
			me.doShow();
		} else {
			manually_hidden=true;
			me.doHide();
		}
		
	}
	var already_triggered = false;
	this.legalLinkTriggered = function() {
		if (!already_triggered) {
			//already_triggered=true;
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({'event': 'legal_links_button','page_title':'caught stealing game main lander','gpms_id':'11444936','property_title':'caught stealing','property_type':'game web app','site_country':countryCode,'genres':'comedy, crime, thriller','content_type':'us microsite','subcontent_type':'caught stealing us game','division':'mp','spe_subgroup':'mp'});
		}
	}
	var main_table = container.appendChild(document.createElement("table"));
	main_table.style.margin = "0px";
	main_table.setAttribute("width", "100%");
	main_table.border = 0;

	var tr = main_table.appendChild(document.createElement("tr"));

	var center_column = tr.appendChild(document.createElement("td"));
	center_column.id = "center_column";
	center_column.setAttribute("valign", "bottom");
	center_column.setAttribute("cellpadding", "0");
	
	var image_column = center_column.appendChild(document.createElement("div"));
	image_column.id = "logo_legal";
	image_column.className = "legal_block";
	image_column.style.textAlign = "center";
	image_column.style.maxWidth = "644px";
	image_column.style.textAlign = "center";
	image_column.style.pointerEvents= "auto";

	var legal_block = center_column.appendChild(document.createElement("div"));
	legal_block.id = "regular_legal";
	legal_block.className = "legal_block";
	legal_block.style.textAlign = "center";
	legal_block.style.background = "transparent";
	legal_block.style.textShadow = "0px 0px 8px black, 0px 0px 8px black";

	//add images
	for(var i=0; i<legal_images.length; i++){
		var o = legal_images[i];
	    var img = image_column.appendChild(document.createElement("img"));
	    img.className = "legal_image";
	    img.src = o.src;
	    img.alt = o.alt;
		img.prohibit_touch = true;
	    img.draggable = "false";
		img.ondragstart = function(){return false;};
		img.onload = function() {me.doResizeUpdate();};
	 }

	
	//links
	var credits_section;
	var di = 0;
	for(var i = 0; i<legal_links.length; i++){
		var legal_link;
		if(legal_links[i].link){
			//if (oLANG[legal_links[i]].link)
			legal_link = legal_block.appendChild(document.createElement("a"));
			if(platform.isMobile){
				legal_link.className = "legal_link_mobile";
			}else{
				legal_link.className = "legal_link";
			}
			legal_link.setAttribute("href", oLANG[legal_links[i].msg+"_link"].value);
			legal_link.onclick= this.legalLinkTriggered;
			if (oLANG[legal_links[i].msg+"_link"].value.indexOf("javascript")==-1) legal_link.setAttribute("target", "_blank");

		}else{
			legal_link = legal_block.appendChild(document.createElement("div"));
			legal_link.style.whiteSpace = "nowrap";
			legal_link.style.pointerEvents = "none";
			legal_link.prohibit_touch = true;
			credits_section=legal_link;
		}
		// BGDPRS
		
		legal_link.style.fontSize = "14px";
		__utils.doHTMLText(legal_link, oLANG[legal_links[i].msg]);
		
		if(legal_links[i].after && di < legal_links.length-1){
			if (oLANG[legal_links[i].msg].display=="none") continue;
			di++;
			var divider = legal_block.appendChild(document.createElement("div"));
			divider.style.position = "relative";
			divider.style.marginLeft = "4px";
			divider.style.marginRight = "4px";
			divider.style.display = "inline-block";
			divider.innerHTML = legal_links[i].after;
			divider.prohibit_touch = true;
		} else {
			legal_block.appendChild(document.createElement("br"));
		}
	}
	//var grpr_a = document.getElementById("_legal_gdpr");
	//legal_block.appendChild(grpr_a);
	legal_link.style.whiteSpace = "nowrap";
	legal_link.style.pointerEvents = "pointer";
	
	me.doResizeUpdate();
	//var creditspoint = document.getElementById('creditspoint');

	image_column.style.visibility = "hidden";
	image_column.style.display = "none";
	this.legal_show_credits = function(){
		//creditspoint.style.transform="rotateZ(180)";
		image_column.style.visibility="visible";
		image_column.style.display = "block";	
		setTimeout(me.doResizeUpdate,50);	
	}
	this.legal_hide_credits = function(){
		//creditspoint.style.transform="rotateZ(0)";
		image_column.style.visibility="hidden";
		image_column.style.display = "none";	
		setTimeout(me.doResizeUpdate,50);
	}
	
	var close_credits = image_column.appendChild(document.createElement("img"))
	close_credits.className = "legal_close_credits";
	close_credits.src="./media/legal_close_credits.png";
	close_credits.onclick = this.legal_hide_credits;
	image_column.onclick = this.legal_hide_credits;
	
	image_column.onmouseup=()=>{};
	image_column.onmouseover=()=>{};
	image_column.onmouseout=()=>{};
	
	this.doHide = function(type=0){
		hidden=true;
		me.legal_hide_credits();
		__utils.doHTMLText(legal_hide_show, oLANG.legal_show);
		if (type==1) container.style.visibility="hidden";
	}

	this.doShow = function(delay=0){
		container.style.visibility="visible";
		if (!manually_hidden) {
			me.doResizeUpdate();
			hidden=false;
			__utils.doHTMLText(legal_hide_show, oLANG.legal_hide);
		}
	}

	
	this.doShow(2.5);
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	update_queue.push(resize_updater);

}
function legal_show_credits() {
	window.LEGAL.legal_show_credits();
}


