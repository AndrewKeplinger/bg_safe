function __utility() {
	this.doHTMLText = function (element, o, append) {

		if ((typeof o === "object") && (o !== null)) {

		} else {
			var o = {
				value: o
			};
		}

		var msg = o.value;
		if (msg.indexOf("![CDATA")==0) {
			msg = msg.substr(7,msg.length-9);
		}
		//loop through overrides
		for (var s in o) {
			if (s != "value") {

				//trace(s + " = " + o[s]);
				element.style[s] = o[s];
			}
		}

		//alert missing text
		if (!msg && msg != 0) {
			msg = "MISSING TEXT";
			element.style.color = "#FF0000";
		}

		if (append) {
			element.innerHTML += msg;
		} else {
			element.innerHTML = msg;
		}
	}

}
var __utils = new __utility();

//--------------------------
// legal block
//--------------------------


var actionTime = 0;
var legal_panel = document.getElementById("legal_panel");
var legal_block = legal_panel.appendChild(document.createElement("div"));
//legal_block.id="legal_block_id";

legal_block.className = "legal_block";
legal_block.is_shown = false;

//legal button
var legal_button_holder = legal_block.appendChild(document.createElement("div"));
legal_button_holder.className = "legal_button_holder";


var b_legal = legal_button_holder.appendChild(document.createElement("a"));
/*b_legal.className = "b_legal";
__utils.doHTMLText(b_legal, oLANG.legal);
b_legal.innerHTML =  b_legal.innerHTML ;
*/
function setLegalText() {
	/*__utils.doHTMLText(b_legal, oLANG.legal);
	
	for (var i = 0; i < legal_links.length; i++) {
		__utils.doHTMLText(legal_link[i], oLANG[legal_links[i].msg]);
	}
	if (oLANG.legal_copyright) {
		__utils.doHTMLText(copyright, oLANG.legal_copyright);
	}
	*/
}
function setBottom() {
	
	legal_block.my_top = legal_block.my_bottom = (window.innerHeight - (legal_block.clientHeight*oSTAGE.scale))*oSTAGE.scale_inv;//-(legal_block.clientHeight - b_legal.clientHeight);
	//console.log(b_legal.clientHeight);
	//legal_block.my_bottom = (window.innerHeight - (b_legal.clientHeight*oSTAGE.scale))*oSTAGE.scale_inv+3;
}
 

b_legal.onmouseover = function () {
	if (isMobile) {
		return;
	}
	if (!legal_block.is_shown) {
		//open it
		setBottom();
		
		if (Date.now()<actionTime) return;
		actionTime = Date.now()+500;
		legal_block.style.pointerEvents = "auto";
		TweenLite.to(legal_block, .33, {
			top: (legal_block.my_top+"px"),//bottom: "0px",
			backgroundColor: "rgba(0, 0, 0, .85)",
			ease: Power1.easeOut,
			overwrite: true
		});
		//__utils.doHTMLText(b_legal, oLANG.legal);
		//b_legal.innerHTML = b_legal.innerHTML;
		legal_block.is_shown = true;
	}
};

legal_block.onmouseout = function (event) {//legal_block.onblur =
	var e = event.toElement || event.relatedTarget;
	while (e && e.parentNode && e.parentNode != window) {
		if (e.parentNode == this || e == this) {
			if (e.preventDefault) e.preventDefault();
			return false;
		}
		e = e.parentNode;
	}
	if (legal_block.is_shown) {
		//close it
		
		if (Date.now()<actionTime) return;
		legal_block.style.pointerEvents = "none";

		setBottom();
		console.log("onmouseout");
		TweenLite.to(legal_block, .33, {
			top:  (legal_block.my_bottom) + "px",//bottom:
			backgroundColor: "rgba(0, 0, 0, 0)",
			overwrite: true
		});
		actionTime = Date.now()+500;
		//__utils.doHTMLText(b_legal, oLANG.legal);
		//b_legal.innerHTML = b_legal.innerHTML;
		legal_block.is_shown = false;
	}
	return true;
};

b_legal.onclick = b_legal.ontouchend = function (evt) {
	
	//console.log("onclick "+legal_block.is_shown+"  "+legal_block.my_bottom);
	setBottom();
	
	if (Date.now()<actionTime) return;
	actionTime = Date.now()+500;

	if (legal_block.is_shown) {
		//close it
		legal_block.style.pointerEvents = "none";

		
		TweenLite.to(legal_block, .33, {
			top: (legal_block.my_bottom) + "px",//bottom: 
			backgroundColor: "rgba(0, 0, 0, 0)",
			overwrite: true
		});
		//__utils.doHTMLText(b_legal, oLANG.legal);
		//b_legal.innerHTML = b_legal.innerHTML;
		legal_block.is_shown = false;
	} else {
		//open it
		legal_block.style.pointerEvents = "auto";
		TweenLite.to(legal_block, .33, {
			top: legal_block.my_top+"px", //bottom: ((document.documentElement.clientHeight - window.innerHeight)) + "px",//
			backgroundColor: "rgba(0, 0, 0, .85)",
			ease: Power1.easeOut,
			overwrite: true
		});
		__utils.doHTMLText(b_legal, oLANG.legal);
		b_legal.innerHTML = b_legal.innerHTML;
		legal_block.is_shown = true;
	}
	return true;
};


var doCloseLegal = function (immediate) {
	legal_block.style.pointerEvents = "none";

	setBottom();
	if (immediate) {
		legal_block.style.top = (legal_block.my_bottom) + "px";
		legal_block.style.backgroundColor = "rgba(0, 0, 0, 0)";
	} else {
		TweenLite.to(legal_block, .33, {
			top: (legal_block.my_bottom) + "px",//bottom:
			backgroundColor: "rgba(0, 0, 0, 0)",
			overwrite: true
		});
	}
	//__utils.doHTMLText(b_legal, oLANG.legal);
	//b_legal.innerHTML = b_legal.innerHTML;
	legal_block.is_shown = false;
}


//links
var links_block;
var images_block;
var copyright_block;
var copyright;
var billing_block;
var legal_link;
function createLegalBlock() {
	links_block = legal_block.appendChild(document.createElement("div"));
	links_block.style.width = "100%";
	links_block.style.visibility = "hidden";
	
	for (var i = 0; i < top_links.length; i++) {	
		if (i>0) {
			var divider = legal_button_holder.appendChild(document.createElement("a"));
			divider.className = "b_legal";
			divider.style.margin="0px";
			divider.style.padding = "0px";
			divider.innerHTML = "|";
		}
		legal_link = legal_button_holder.appendChild(document.createElement("a"));
		legal_link.className = "b_legal";
		legal_link.style.whiteSpace = "nowrap";
		legal_link.href = top_links[i].link;
		legal_link.target = "_blank";

		__utils.doHTMLText(legal_link, oLANG[top_links[i].msg]);
	}
	
	for (var i = 0; i < legal_links.length; i++) {
		legal_link = links_block.appendChild(document.createElement("a"));
		legal_link.className = "b_legal";
		legal_link.style.whiteSpace = "nowrap";
		legal_link.href = legal_links[i].link;
		legal_link.style.zIndex=100;
		legal_link.target = "_blank";

		__utils.doHTMLText(legal_link, oLANG[legal_links[i].msg]);
		if (i < legal_links.length - 1) {
			var divider = links_block.appendChild(document.createElement("a"));
			divider.innerHTML = " | ";
		}
	}

	//copyright
	copyright_block = legal_block.appendChild(document.createElement("div"));
	copyright_block.style.width = "100%";
	if (oLANG.legal_copyright) {
		var copyright = copyright_block.appendChild(document.createElement("div"));
		__utils.doHTMLText(copyright, oLANG.legal_copyright);
	}

	//add billing

	if (legal_billing) {
		billing_block = legal_block.appendChild(document.createElement("img"));
		billing_block.className = "generic_relative";
		billing_block.src = legal_billing;
		billing_block.style.width = "100%";
		billing_block.style.maxWidth = billing_block.naturalWidth + "px";
		billing_block.style.marginTop = "10px";

		legal_block.appendChild(document.createElement("br"));
	}

	//add images
	images_block = legal_block.appendChild(document.createElement("div"));
	images_block.className = "generic_relative";
	images_block.style.marginBottom = "10px";

	for (var i = 0; i < legal_images.length; i++) {
		var src = legal_images[i];
		var img = images_block.appendChild(document.createElement("img"));
		img.className = "generic_relative";
		img.src = src;
		img.style.marginLeft = "20px";
		img.style.marginRight = "20px";
		img.style.height="20px";
		img.draggable = "false";
		img.ondragstart = function () {
			return false;
		};
	}

	setBottom();
	setTimeout(orientLegal,500);

	orientLegal();
	legal_block.style.top = (legal_block.my_bottom)+ "px";

	doCloseLegal(true);
	orientLegal();
	TweenLite.to(legal_block, .33, {
		top: (legal_block.my_bottom) + "px",// bottom:
		backgroundColor: "rgba(0, 0, 0, 0)",
		overwrite: true
	});
}
function orientLegal() {
	if (window.innerWidth/window.innerHeight<1) {
		legal_button_holder.style.textAlign="center";
	}
	setBottom();
	if (legal_block.is_shown) {
		legal_block.style.top = (legal_block.my_top) + "px";//(document.documentElement.clientHeight - window.innerHeight) + "px";
	} else {
		legal_block.style.top = (legal_block.my_bottom)+ "px";
	}
	//console.log(legal_block.my_bottom);
}








