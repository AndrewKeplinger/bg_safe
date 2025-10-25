
function LegalPanel (){
	var me = this;

	var container = document.getElementById("div_legal");
	var my_bottom;

	var is_opened = false;
	var is_hidden = false;
	var scale, scaled_height;

	var legal_block = container.appendChild(document.createElement("div"));
	legal_block.className = "legal_block";
	legal_block.id = "legal_block";

	//legal button
	var b_legal = legal_block.appendChild(document.createElement("a"));
	b_legal.className = "b_legal";

	__utils.doHTMLText(b_legal, oLANG.legal);

	b_legal.innerHTML = "+ " + b_legal.innerHTML + " +";

	b_legal.allow_touch = true;
	b_legal.onmousedown = function(){

		if(is_opened){
			//close it
			legal_block.style.pointerEvents = "none";
			TweenLite.to(legal_block, .33, {top: "0px", overwrite:true});
			__utils.doHTMLText(b_legal, oLANG.legal);
			b_legal.innerHTML = "+ " + b_legal.innerHTML + " +";
			is_opened = false;
		}else{
			//open it
			legal_block.style.pointerEvents = "auto";
	  		TweenLite.to(legal_block, .33, {top: (-legal_block.clientHeight) + "px", ease:Power1.easeOut, overwrite:true});
	  		__utils.doHTMLText(b_legal, oLANG.legal);
			b_legal.innerHTML = "- " + b_legal.innerHTML + " -";
			is_opened = true;
		}
	};


	b_legal.onmouseover = function(){
		if(!platform.isMobile && !legal_block.is_shown){
			legal_block.style.pointerEvents = "auto";
	  		TweenLite.to(legal_block, .33, {top: (-legal_block.clientHeight) + "px", ease:Power1.easeOut, overwrite:true});
	  		__utils.doHTMLText(b_legal, oLANG.legal);
			b_legal.innerHTML = "- " + b_legal.innerHTML + " -";
			is_opened = true;
		}
	};

	legal_block.onmouseout = function(event){
		var e = event.toElement || event.relatedTarget;
		while(e && e.parentNode && e.parentNode != window) {
		    if (e.parentNode == this ||  e == this) {
		        if(e.preventDefault) e.preventDefault();
		        return false;
		    }
		    e = e.parentNode;
		}
		if(is_opened){
			//close it
			legal_block.style.pointerEvents = "none";
			TweenLite.to(legal_block, .33, {top: "0px", overwrite:true});
			__utils.doHTMLText(b_legal, oLANG.legal);
			b_legal.innerHTML = "+ " + b_legal.innerHTML + " +";
			is_opened = false;
		}
	}

	var doCloseLegal = function(){
		legal_block.style.pointerEvents = "none";
		TweenLite.to(legal_block, .33, {top: "0px", overwrite:true});
		__utils.doHTMLText(b_legal, oLANG.legal);
		b_legal.innerHTML = "+ " + b_legal.innerHTML + " +";
	}


	//links
	for(var i = 0; i<legal_links.length; i++){
		var legal_link;
		if(legal_links[i].link){
			legal_link = legal_block.appendChild(document.createElement("a"));
			legal_link.style.whiteSpace = "nowrap";
			legal_link.setAttribute("href", legal_links[i].link);
			legal_link.setAttribute("target", "_blank");
			legal_link.onclick = function(e){
				//sCode.trackOutboundClick(e.target.href, 'external_link');
			}
		}else{
			legal_link = legal_block.appendChild(document.createElement("div"));
			legal_link.style.whiteSpace = "nowrap";
			legal_link.style.fontSize = "16px";
			legal_link.style.pointerEvents = "none";
		}
		__utils.doHTMLText(legal_link, oLANG[legal_links[i].msg]);
		if(legal_links[i].after){
			var divider = legal_block.appendChild(document.createElement("a"));
			divider.innerHTML = legal_links[i].after;
		}
	}


	legal_block.appendChild(document.createElement("br"));


	//add images
	for(var i=0; i<legal_images.length; i++){
		var o = legal_images[i];
	    var img = legal_block.appendChild(document.createElement("img"));
	    img.className = "legal_image";
	    img.src = o.src;
	    img.alt = o.alt;
	    img.draggable = "false";
		img.ondragstart = function(){return false;};
	 }



	


  //---------------------------
  // resize update
  //---------------------------

	this.doResizeUpdate = function(){

		if(oSTAGE.is_landscape){
			scale = Math.min(1, (oSTAGE.screen_width/960));
		}else{
			scale = Math.min(1, (oSTAGE.screen_width/640));
		}
		container.style.transform = container.style.webkitTransform = "scale(" + scale + "," + scale + ")";
		container.style.width = (oSTAGE.screen_width * (1/scale)) + "px";
		scaled_height = container.clientHeight * scale;
		container.style.top = (oSTAGE.screen_height ) + "px";

		container.style.left = "0px";
		if(is_hidden){
			container.style.top = (oSTAGE.screen_height + (b_legal.clientHeight * scale)) + "px";
		}else{
			container.style.top = oSTAGE.screen_height + "px";
		}

	}

	this.doHide = function(){
		is_hidden = true;
		container.style.pointerEvents = "none";
		TweenLite.to(container, .33, {top: (oSTAGE.screen_height + (b_legal.clientHeight * scale)) + "px", ease:Power1.easeOut, overwrite:true});
	}

	this.doShow = function(){
		is_hidden = false;
		container.style.pointerEvents = "auto";
		TweenLite.to(container, .33, {top: oSTAGE.screen_height + "px", ease:Power1.easeOut, overwrite:true});
	}


	me.doResizeUpdate();

	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	update_queue.push(resize_updater);

}



