
//var oLANG = {};

//fix IE console bug
if (!window.console || !window.console.log) console = {log: function() {}, error: function() {}};


// feature support detector
var support = {
    gzip: false,
    canvas: !! window.CanvasRenderingContext2D,
    webgl: ( function () {
        try {
            var canvas = document.createElement( 'canvas' );
            return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
        } catch ( e ) {
            return false;
        }
    } )(),
    workers: !! window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,
    clamped_array: window.Uint8ClampedArray

}


//----------------------------------------
// trace
//----------------------------------------

function trace(msg){
	if(oCONFIG.show_trace){
		console.log(msg);

		if(oCONFIG.show_debug){
			document.getElementById("debug").innerHTML = msg + "<br>" + document.getElementById("debug").innerHTML;
		}
	}
}


//----------------------------------------
// browser alert
//----------------------------------------

function getDateMessage() {
  var date_release = new Date(oCONFIG.date_playing);
  var date_tomorrow = new Date(oCONFIG.date_day_before);
  var date_friday = new Date(oCONFIG.date_week_before);
  var today_date = new Date();
  var date_msg;
  if(today_date >= date_release){
    //now playing
    date_msg = oLANG.date_msg_nowplaying.value;
  }else if(today_date >= date_tomorrow){
    //tomorrow
    date_msg = oLANG.date_msg_tomorrow.value;
  }else if(today_date >= date_friday){
    //this friday
    date_msg = oLANG.date_msg_friday.value;
  }else{
    //date
    date_msg = oLANG.date_msg_date.value;
  }
	console.log(date_msg);
	return date_msg;
}

function doBrowserAlert(){

  var date_msg = getDateMessage();
    
    //create error message
  var error_msg;
    if (!support.webgl && window.WebGLRenderingContext){
    error_msg = oLANG.error_webgl.value;
    }else{
    error_msg = oLANG.error_browser.value;
    }

	var base_url = location.href;
	var regExp = new RegExp("index.html" + "+$");
	base_url = base_url.replace(regExp, "");
	var regExp2 = new RegExp("index_devel.html" + "+$");
	base_url = base_url.replace(regExp2, "");
	base_url = base_url.split("?")[0].split("#")[0];
 
  window.location.href = oCONFIG.browser_alert + "?date=" + date_msg + "&msg=" + error_msg;

}


//----------------------------------------
// prep - load language first
//----------------------------------------
var localSounds = {};
var top_links = [];
var prepComplete=false;
function doPrep(){

	var http = new XMLHttpRequest();
  var url = oCONFIG.language_file;

  http.open("GET", url, true);
  http.onreadystatechange = function() {

    if(http.readyState == 4 && http.status == 200) {

      var myxml = http.responseXML || parseXml(http.responseText);
      var root = myxml.documentElement;

      oLANG = {};
      oLANG_IMAGES = {};

      var textnodes = root.getElementsByTagName("txt");
      if (textnodes) {
            for (var i = 0; i < textnodes.length; i++) {
              var my_node = textnodes[i];
              var o = {};
              o.id = my_node.getAttribute('id');
              for (var ii= 0; ii < my_node.attributes.length; ii++) {
                var attrib = my_node.attributes[ii];
                if (attrib.specified) {
                  o[attrib.name] = attrib.value;
                }
              }
              o.value = my_node.childNodes[0].nodeValue;
              oLANG[o.id] = o;
            }
      }

      var imagenodes = root.getElementsByTagName("img");
      if (imagenodes) {
            for (var i = 0; i < imagenodes.length; i++) {
              var my_node = imagenodes[i];
              var my_id = my_node.getAttribute('id');
              var my_value = my_node.childNodes[0].nodeValue;
              oLANG_IMAGES[my_id] = my_value;
            }
      }

        if (!support.canvas || !support.webgl || !support.clamped_array) {
            doBrowserAlert();
        }else{
		        //doInit();
				  prepComplete=true;
			  }
        }
    };
    http.send(null);  
}

var query = window.location.search.substring(1);
var qs = parse_query_string(query);
function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}


if (qs.lang!=undefined) {
	oCONFIG.language = qs.lang;
}

doPrep();