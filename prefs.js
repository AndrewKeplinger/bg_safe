

oCONFIG = {
  language :"en",

  game_id: "ninjago-flight",
  show_trace: false,
  show_stats: false,
  show_debug: false,
	hideOfficialSite:1,
	back_color: "#000000", 
  build: 1,
  hub_url: "",
  more_url: "",
  movie_url: "",
  browser_alert: " ",
 portrait_target_width:10,
  load_hold_seconds: 0,
  page_width:644.0,
	page_height:1120.0,
	page_land_ratio:0.575,
	animationDelay:250,
	turnRate:120.0,
	freezeTurnRate:60.0,
	accuracy:3,
	wrong_penalty:250,
	game_duration:10000,
	time_meter_width:300,
	freeze_event_triger:5
};
// Overridden from en.json language file


var legal_links = [
  {msg: "legal_terms", link:"https://www.dreamworks.com/terms-of-use"},
  {msg: "legal_privacy", link:"https://www.nbcuniversal.com/privacy/pp-full-children#accordionheader4"},
  {msg: "legal_mpaa", link:"https://www.nbcuniversalprivacy.com/privacy/california-consumer-privacy-act?intake=Dreamworks_Animation"},
  {msg: "legal_parentalguide", link:"https://www.dreamworks.com/kids-help"}//,
  //{msg: "legal_ratings", link:"http://www.filmratings.com"}
];

var textAssets = {};

var oLANG = {
	"legal":"LEGAL",
	"legal_terms":"TERMS OF SERVICE",
	"legal_privacy":"PRIVACY POLICY",
	"legal_mpaa":"CA NOTICE",
	"legal_parentalguide":"KID'S HELP",
	"legal_copyright":"&copy;2025"
};


var legal_billing = null;

var legal_images = [
  "Media/rating.png"
];

var official_site_link = "https://tv.dreamworks.com/badguys/safecracker/";

var menu_list = [
  {title_msg: "menu_resume", action:"resume", link:""},
  {title_msg: "menu_exit", action:"exit", link:""},
  {title_msg: "menu_more", action:"hub"},
  {title_msg: "official_site", action:"official_site"},
];
