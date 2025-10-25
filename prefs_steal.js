//------------------------------------
// release dates
//------------------------------------

// The date string must be formatted as shown. These is used as date cuttoffs and is not displayed in the program.
var date_playing = "Aug 29, 2025";
var date_day_before = "Aug 28, 2025";
var date_week_before = "Aug 27, 2025";

window.oCONFIG = {
	game_id: "stealing",
	language_file :"language/en-us.xml",
	debug_trace: false,
	debug_panel: false,
	debug_stats: false,
	game_orientation: "portrait",
	browser_alert: "browser_alert/",
	back_color: "#444444",
	fog_near:140,
	fog_far:180,
	fog_color: 0x444444,
	legal_width:548,
	legal_height:935,
	legal_width_mobile: 548,
	opage_width:644.0,
	opage_height:1120.0,
	page_width:644.0,
	page_height:1120.0,
	page_land_ratio:0.575, 
	hit_range_x: 1,
	landscale_target_width: 25,
	portrait_target_width: 25,
	platform_offset:20,
	heart_scale:5,
	scorePerTile:5,	
	scorePerCash:20,
	scorePerPunch:10,
	fxCount:10,	
	frame_rate_fix:60,
	gravity:-0.005,
	immune_time:0.75,
	recap_mid_score:500,
	recap_high_score:2500,
	skip_instructions:true,
	cheats_on:false
}
var playerParams = {
	1: {
		id: "Hank",
		lives: 1,
		health: 1,
		moveRate: -0.6,
		jumpImpulse: 0.3,
		acceleration: -0.01,
		maxRate:-1.0,
		slideDuration:0.5,
		slideDelay: 0.25,
		punchDuration:0.25,
		punchDelay: 0.5,
		baseY: 9.0,
		baseX: -15.0,
		baseY: 9.0,
		baseX: -15.0,
		lane_assist: 0.5,
		spriteScale:6.0,
		baseZ: 0,
		runSound: "HankRun",
		jumpSound: "HankJump",
		specialSound: "HankAttack",
		duckSound: "HankSlide"
	}
};


//assets to be processed for threejs
var assets_threejs = {
  loaded: false,
  progress: 0,
  manifest: [	   
	  
	  {src:"media/sprites/hank_.png",	name:"hank_",	type:"texture"},
	  {src:"media/sprites/heart_.png",	name:"heart_",	type:"texture"},
	  //{src:"media/sprites/hank_.json",	name:"hank_atlas",	type:"json"},
	  //{src:"media/sprites/heart_.json",	name:"heart_atlas",	type:"json"},
	  //{src:"media/sprites/Enemies.json",	name:"Enemies_atlas",	type:"json"},
	{src:"media/lvl1/LV1_All.fbx",		name:"LV1_All",		type:"fbx"}
  ]
};

var assets_threejs_game = {
  loaded: false,
  progress: 0,
  manifest: [	  
	{src:"media/lvl1/Enemies.png",	name:"Enemies",	type:"texture"}, 
	{src:"media/lvl1/NPC_Friends.png",	name:"Level1_tex",	type:"texture"},
    {src:"media/game/game_speechballoon.png", name:"NPC_speechballoon",	type:"texture"},
    {src:"media/game/game_roman.png", name:"NPC_Roman",	type:"texture"},
    {src:"media/game/game_HM.png", name:"NPC_HM",	type:"texture"},
    {src:"media/game/game_PR.png", name:"NPC_PR",	type:"texture"},
    {src:"media/game/game_RM.png", name:"NPC_RM",	type:"texture"},
    {src:"media/game/game_russ.png", name:"NPC_Russ",	type:"texture"},
    {src:"media/game/game_zoe.png", name:"NPC_Zoe1",	type:"texture"}
]
};

var assets_threejs_1 = {
  loaded: false,
  progress: 0,
  manifest: [

	]
};

//© 2025 Sony Pictures Digital Productions Inc. All Rights Reserved.

//assets needed before title screen
var assets_preload = {
  loaded: false,
  progress: 0,
  manifest: [
    //{src:"media/RedUIBG.jpg", id:"RedUIBG"},		
    {src:"media/sounds/music_title_loop.mp3", id:"music_title_loop"},  
    {src:"media/bg_title.jpg", id:"bg_title"},
    {src:"media/b_pause.svg", id:"b_pause"},
    {src:"media/b_pause_over.svg", id:"b_pause_over"},
    {src:"media/b_sound_off_over.png", id:"b_sound_off_over"},
    {src:"media/b_sound_on_over.png", id:"b_sound_on_over"},
    {src:"media/b_sound_off.png", id:"b_sound_off"},
    {src:"media/b_sound_on.png", id:"b_sound_on"},
	  
    {src:"media/legal_close_credits.png", id:"legal_close_credits"},
    {src:"media/uptriangle.png", id:"uptriangle"},
    {src:"media/Your_Privacy_Choices.png", id:"Your_Privacy_Choices"},
	  
	{src: 'media/instructions.gif', id: 'instructions'},
	{src: 'media/instructions_PC.gif', id: 'instructions_PC'},
	  
    {src:"media/title/title_char.png", id:"title_char"},
    {src:"media/title/title_char_mid.png", id:"title_char_mid"},
    {src:"media/title/Title_bar.png", id:"Title_bar"},
    {src:"media/title/btn_other_up.png", id:"btn_other_up"},
    {src:"media/title/btn_other_down.png", id:"btn_other_down"},
    {src:"media/title/btn_play_up.png", id:"btn_play_up"},
    {src:"media/title/btn_play_down.png", id:"btn_play_down"}	 
  ]
};


//assets needed before gameplay
var assets_additional = {
  loaded: false,
  progress: 0,
  manifest: [   
    {src:"media/game/title_logo.png", id:"title_logo"},
    {src:"media/sounds/music_game_in.mp3", id:"music_game_in"},
    {src:"media/sounds/music_game_loop.mp3", id:"music_game_loop"},
    {src:"media/sounds/music_game_end.mp3", id:"music_game_end"},
    {src:"media/sounds/music_game_end.mp3", id:"music_game_end"},	  
	  
	  
	{src: 'media/title/btn_play_up.png', id: 'inst_b_PLAY'},
	{src: 'media/inst_background.jpg', id: 'inst_background'},
	  
    {src:"media/sounds/jump.mp3", id:"jump"},	  
    {src:"media/sounds/slide.mp3", id:"slide"},
    {src:"media/sounds/punch.mp3", id:"punch"},
    {src:"media/sounds/heart.mp3", id:"heart"},
    {src:"media/sounds/cat.mp3", id:"cat"},
    {src:"media/sounds/cash.mp3", id:"cash"},
	   
	{src: 'media/recap/result_token_russ.png', id: 'recap_Russ'},
	{src: 'media/recap/result_token_zoe.png', id: 'recap_Zoe'},
	{src: 'media/recap/result_token_roman.png', id: 'recap_Roman'},
	{src: 'media/recap/result_token_RM.png', id: 'recap_RM'},
	{src: 'media/recap/result_token_HM.png', id: 'recap_HM'},
	{src: 'media/recap/result_token_PR.png', id: 'recap_PR'},
	{src: 'media/recap/result_token_off.png', id: 'recap_off'},
	{src: 'media/recap/recap_Speech.png', id: 'WELCOME_TO_NARNIA'},
	{src: 'media/recap/recap_Title.png', id: 'Title_copy'},
	{src: 'media/recap/recap_RUSS.png', id: 'recap_RUSS'},
	{src: 'media/recap/recap_HANK.png', id: 'recap_HANK'},
	{src: 'media/recap/recap_background.jpg', id: 'recap_background'}
  ]
};

/*var extraLoad = "recap_Russ,recap_Zoe,recap_Roman,recap_RM,recap_HM,recap_PR,recap_SCORE_Label,recap_SCORE_Label_shadow,recap_Score_Shadow,recap_Score,WELCOME_TO_NARNIA,recap_PLAY_MORE,recap_GET_TICKETS,recap_WATCH_TRAILER,recap_legal_content,recap_legal,recap_date,Title_copy,recap_top_rect,recap_RUSS,recap_HANK,recap_background".split(",");
var tdoc = document.createElement("div");
for (var idx=0;idx<extraLoad.length; idx++){
	tdoc.className=extraLoad[idx];
	var img = tdoc.style.backgroundImage;
	//if (img) {
		assets_additional.manifest.push({src:extraLoad[idx], id:extraLoad[idx]});
	//}
}
console.log(assets_additional.manifest);*/

var main_site_url = "https://caughtstealing.movie/";

var legal_images = [
  {src: "media/WBlogo.png", alt:"Columbia"},

];

var legal_links = [
	{msg: "legal_privacy", link:"https://www.sonypictures.com/corp/privacy.html", after:"  "},
	{msg: "legal_terms", link:"https://www.sonypictures.com/corp/tos.html", after:"  "},
	{msg: "legal_caprivacy", link:"https://www.sonypictures.com/corp/tos.html", after:"  "},
	{msg: "legal_adchoices", link:"https://www.sonypictures.com/corp/tos.html"},
	{msg: "legal_yourprivacy", link:"https://www.sonypictures.com/corp/tos.html", after:"<img class='legal_inline_image' src='./media/Your_Privacy_Choices.png'>"},
	{msg: "legal_cookie", link:'javascript:OneTrust.ToggleInfoDisplay();', after:"  "},	
	{msg: "legal_credits", link:"https://www.sonypictures.com/corp/tos.html", after:""},
	//{msg: "legal_credits", link:"javascript:"},
	{msg: "legal_copyright",link:null,after:null}
];

var animations = {
	"Hank": {
		"Run": 			{"loop":true,"cells":[8,9,10,11,12,13]},
		"Punch": 		{"loop":false,"cells":[7,7,7,7,7]},
		"Fall":  		{"loop":true,"cells":[1]},
		"JumpStart":  	{"loop":false,"cells":[6],"chain":"InAir"},	
		"InAir":  		{"loop":false,"cells":[5]},	
		//"Land":  		{"loop":false,"cells":[5],"chain":"Run"},
		"Hit":  		{"loop":false,"cells":[2,3,4]},
		"Slide":  		{"loop":true,"cells":[14]},
		"TurnL":		{"Loop":true,"cells":[15]},
		"TurnR":		{"Loop":true,"cells":[16]},
		//BAT
		"BRun": 		{"loop":true,"cells":[24,25,26,27,28,29]},
		"BPunch": 		{"loop":false,"cells":[23,23,23,23,23]},
		"BFall":  		{"loop":true,"cells":[17]},
		"BJumpStart":  	{"loop":false,"cells":[22],"chain":"BInAir"},	
		"BInAir":  		{"loop":false,"cells":[21]},	
		//"BLand":  		{"loop":false,"cells":[5],"chain":"BRun"},
		"BHit":  		{"loop":false,"cells":[18,19,20]},
		"BSlide":  		{"loop":true,"cells":[30]},
		"BTurnL":		{"Loop":true,"cells":[31]},
		"BTurnR":		{"Loop":true,"cells":[32]},
		//CAT
		"CRun": 		{"loop":true,"cells":[40,41,42,43,44,45]},
		"CPunch": 		{"loop":false,"cells":[39,39,39,39,39]},
		"CFall":  		{"loop":true,"cells":[33]},
		"CJumpStart":  	{"loop":false,"cells":[38],"chain":"CInAir"},	
		"CInAir":  		{"loop":false,"cells":[37]},	
		//"CLand":  		{"loop":false,"cells":[5],"chain":"CRun"},
		"CHit":  		{"loop":false,"cells":[34,35,36]},
		"CSlide":  		{"loop":true,"cells":[46]},
		"CTurnL":		{"Loop":true,"cells":[47]},
		"CTurnR":		{"Loop":true,"cells":[48]}
	},
	"Enemies" : {
		"HM_Hit": 		{"loop":false,"cells":[1,2,3]},
		"HM_Punch": 	{"loop":true,"cells":[4]},
		"HM_Stand":  	{"loop":false,"cells":[5,6]},
		"PR_Hit":  		{"loop":false,"cells":[7,8,9]},	
		"PR_Punch":  	{"loop":false,"cells":[10]},
		"PR_Stand": 	{"loop":true,"cells":[11,12]},
		"RM_Hit": 		{"loop":true,"cells":[13,14,15]},
		"RM_Punch":  	{"loop":false,"cells":[16]},
		"RM_Stand":  	{"loop":false,"cells":[17,18]}
	},
	"Heart" : {
		"Full" :		{"loop":false,"cells":[1]},
		"Break" :		{"loop":false,"cells":[2,3,4]}
	}
}



var tileDefs = {
//"bar_straight5": {"next":["bar_straight3","bar_straight7","bar_duck"],item:[]},
"bar_straight2": {pulane:1, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_duck","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight3": {pulane:-1, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight4": {pulane:1, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight5": {pulane:0, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight9","bar_duck","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight6": {pulane:0, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_straight6","bar_straight7","bar_straight8","bar_straight9","bar_duck","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight7": {pulane:-1, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_straight6","bar_straight7","bar_straight8","bar_straight9","bar_duck","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight8": {pulane:0, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_straight6","bar_straight7","bar_straight8","bar_straight9","bar_duck","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_straight9": {pulane:0, "next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5","bar_duck2","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_duck": {pulane:0, action:"duck","next":["bar_straight2","bar_straight3","bar_straight5","bar_straight4","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_duck2": {pulane:0, action:"duck","next":["bar_straight2","bar_straight3","bar_straight5","bar_straight4","bar_left","bar_right","bare_straight_exit"],item:[]}, 
"bar_left": {pulane:-1, type:"exit","next":["bar_straight2","bar_straight3","bar_straight5","bar_straight4"],item:[],build:"left"}, 
"bar_right": {pulane:0, type:"exit","next":["bar_straight2","bar_straight3","bar_straight5","bar_straight4"],item:[],build:"right"}, 
"bare_straight_exit": {pulane:0, type:"exit","next":["city_straight1","city_straight10","city_straight7","city_straight8"],item:[]}, 
"alley_straight2": {pulane:0, "next":["alley_straight_city","alley_straight6","alley_left","alley_right"],item:[]}, 
"alley_duck1": {pulane:0, "next":["alley_straight2","alley_straight1","alley_straight3","alley_left","alley_right","alley_straight_city"],item:[]}, 
"alley_jump": {pulane:0, action:"jump","next":["alley_straight1","alley_straight3","alley_left","alley_right","alley_straight_city","alley_straight_storage"],item:[]}, 
"alley_jump2": {pulane:0, action:"jump","next":["alley_straight1","alley_straight3","alley_left","alley_right","alley_straight_city"],item:[]}, 
"alley_left": {pulane:0, type:"exit","next":["alley_straight1","alley_straight3","alley_jump2","alley_straight_storage"],item:[],build:"left"}, 
"alley_pit": {pulane:0, action:"pit","next":["alley_straight1","alley_straight3","alley_left","alley_right","alley_straight_apartment"],item:[]}, 
"alley_right": {pulane:0, type:"exit","next":["alley_straight3","alley_straight1","alley_straight4","alley_straight_city"],item:[],build:"right"}, 
"alley_straight1": {pulane:-1, "next":["alley_straight4","alley_straight6","alley_duck1","alley_jump","alley_jump2","alley_pit","alley_left","alley_right","alley_straight_city"],item:[]}, 
"alley_straight3": {pulane:-1, "next":["alley_straight6","alley_duck1","alley_jump2","alley_pit","alley_straight_city","alley_straight_storage"],item:[]},
"alley_straight4": {pulane:0, "next":["alley_duck1","alley_jump2","alley_pit","alley_straight_city","alley_straight_storage"],item:[]},
"alley_straight5": {pulane:0, "next":["alley_straight1","alley_straight3","alley_straight4","alley_straight6"],item:[]},
"alley_straight6": {pulane:-1, "next":["alley_straight_city","alley_straight_storage","alley_duck1","alley_pit","alley_left","alley_right","alley_straight_city"],item:[]},
"alley_straight_apartment": {pulane:0, type:"exit","next":["hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6",],item:[]}, 
"alley_straight_city": {pulane:0, type:"exit","next":["city_straight12"],item:[]}, 
"alley_straight_storage": {pulane:-1, type:"exit","next":["storage_straight1","storage_straight2","storage_straight3"],item:[]},
"city_straight2": {pulane:1, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit","city_pit2","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_duck": {pulane:0, action:"duck","next":["city_straight2","city_straight3","city_straight6","city_straight7","city_straight8","city_straight9","city_right_bar"],item:[]}, 
"city_jump": {pulane:0, action:"jump","next":["city_straight2","city_straight3","city_straight6","city_straight7","city_straight8","city_straight9","city_right_bar"],item:[]}, 
"city_pit": {pulane:0, action:"pit","next":["city_straight2","city_straight3","city_straight6","city_straight7","city_straight8","city_straight9","city_right_bar"],item:[]}, 
"city_pit2": {pulane:0, action:"pit","next":["city_straight2","city_straight3","city_straight6","city_straight7","city_straight8","city_straight9","city_right_bar"],item:[]}, 
"city_right_bar": {pulane:0, type:"exit","next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5"],item:[],build:"right"},
"city_right_enter": {pulane:0, "next":["city_straight2","city_straight3","city_straight6","city_straight7","city_straight8","city_straight11","city_straight12","city_straight9"],item:[],build:"right"}, 
"city_straight1": {pulane:0, "next":["city_straight6","city_straight11","city_duck","city_pit","city_pit2","city_straight2","city_straight3","city_straight7"],item:[]}, 
"city_straight3": {pulane:0, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit2","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight5": {pulane:1, "next":["city_straight_grocery"],item:[]},	
"city_straight6": {pulane:0, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit2","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight7": {pulane:-1, "next":["city_straight1","city_straight10","city_straight8","city_straight16"],item:[]}, 
"city_straight8": {pulane:-1, "next":["city_straight_grocery","city_straight9","city_straight17","city_jump"],item:[]}, 
"city_straight9": {pulane:-1, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit","city_straight1","city_straight2","city_straight5","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight10": {pulane:-1, "next":["city_straight6","city_straight2","city_straight3","city_straight11","city_duck","city_straight_alley"],item:[]}, 
"city_straight11": {pulane:0, "next":["city_pit2","city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight12": {pulane:1, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit","city_pit2","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight13": {pulane:0, "next":["city_straight_hallway","city_duck","city_straight6","city_straight13"],item:[]}, 
"city_straight14": {pulane:0, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit2","city_straight1","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight15": {pulane:0, "next":["city_straight1","city_straight10","city_straight8","city_straight16"],item:[]}, 
"city_straight16": {pulane:-1, "next":["city_straight_grocery","city_straight9","city_straight17","city_jump"],item:[]}, 
"city_straight17": {pulane:0, "next":["city_straight_grocery","city_straight_alley","city_straight_hallway","city_duck","city_jump","city_pit","city_straight1","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16","city_right_bar"],item:[]}, 
"city_straight_alley": {pulane:0, build:"right","next":["alley_straight1","alley_straight3","alley_straight4","alley_straight6"],item:[]}, 
"city_straight_grocery": {pulane:0, type:"exit","next":["store_straight1","store_straight2","store_straight3","store_straight4","store_straight5"],item:[]}, 
"city_straight_bar": {pulane:0, type:"exit","next":["bar_straight2","bar_straight3","bar_straight4","bar_straight5"],item:[],build:"right"}, 
"city_straight_hallway": {pulane:0, type:"exit","next":["hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6",],item:[]}, 
"hallway_straight": {pulane:0, "next":["hallway_duck","hallway_left","hallway_right","hallway_exit","hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[]}, 
"hallway_duck": {pulane:0, action:"duck","next":["hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6","hallway_left","hallway_right","hallway_exit"],item:[]}, 
"hallway_exit": {pulane:0, type:"exit","next":["alley_straight1","alley_straight2","alley_straight3"],item:[]}, 
"hallway_left": {pulane:-1, type:"exit","next":["hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[],build:"left"}, 
"hallway_pit": {pulane:0, action:"pit","next":["hallway_straight","hallway_straight2","hallway_straight3","hallway_left","hallway_right","hallway_exit"],item:[]}, 
"hallway_right": {pulane:1, type:"exit","next":["hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[],build:"right"}, 
"hallway_straight2": {pulane:-1, "next":["hallway_duck","hallway_left","hallway_right","hallway_exit","hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[]},
"hallway_straight3": {pulane:1, "next":["hallway_duck","hallway_left","hallway_right","hallway_exit","hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[]}, 
"hallway_straight4": {pulane:-1, "next":["hallway_duck","hallway_left","hallway_right","hallway_exit","hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[]}, 
"hallway_straight5": {pulane:0, "next":["hallway_duck","hallway_left","hallway_right","hallway_exit","hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[]}, 
"hallway_straight6": {pulane:0, "next":["hallway_duck","hallway_left","hallway_right","hallway_exit","hallway_straight","hallway_straight2","hallway_straight3","hallway_straight4","hallway_straight6"],item:[]}, 
"storage_straight1": {pulane:0, "next":["storage_duck","storage_left","storage_pit","storage_right","storage_straight1","storage_straight2","storage_straight3","storage_straight4","storage_straight5","storage_straight6","storage_straight_exit"],item:[]}, 
"storage_duck": {pulane:0, action:"duck","next":["storage_straight1","storage_straight3","storage_right","storage_straight_exit"],item:[]}, 
"storage_left": {pulane:-1, type:"exit","next":["storage_straight1","storage_straight2","storage_straight3","storage_straight4","storage_straight5","storage_straight6"],item:[],build:"left"}, 
"storage_pit": {pulane:0, action:"pit","next":["storage_straight1","storage_straight3","storage_right","storage_straight_exit"],item:[]}, 
"storage_right": {pulane:0, type:"exit","next":["storage_straight1","storage_straight2","storage_straight3","storage_straight4","storage_straight5","storage_straight6"],item:[],build:"right"}, 
"storage_straight2": {pulane:0, "next":["storage_duck","storage_right","storage_straight1","storage_straight3","storage_straight4","storage_straight6","storage_straight_exit"],item:[]}, 
"storage_straight3": {pulane:-1, "next":["storage_duck","storage_left","storage_pit","storage_right","storage_straight1","storage_straight2","storage_straight3","storage_straight4","storage_straight5","storage_straight6","storage_straight_exit"],item:[]}, 
"storage_straight4": {pulane:1, "next":["storage_duck","storage_left","storage_pit","storage_right","storage_straight1","storage_straight2","storage_straight3","storage_straight4","storage_straight5","storage_straight6","storage_straight_exit"],item:[]}, 
"storage_straight5": {pulane:-1, "next":["storage_duck","storage_right","storage_straight1","storage_straight3","storage_straight4","storage_straight6","storage_straight_exit"],item:[]}, 
"storage_straight6": {pulane:1, "next":["storage_duck","storage_left","storage_pit","storage_right","storage_straight1","storage_straight2","storage_straight3","storage_straight4","storage_straight5","storage_straight6","storage_straight_exit"],item:[]}, 
"storage_straight_exit": {pulane:0, type:"exit","next":["city_straight5","city_straight6","city_straight7","city_straight8","city_straight9"],item:[]}, 
"store_straight1": {pulane:-1, "next":["store_left","store_straight_exit","store_jump","store_duck","store_right","store_straight1","store_straight2","store_straight3","store_straight4","store_straight5"],item:[]}, 
"store_jump": {pulane:0, action:"jump","next":["store_straight1","store_straight2","store_left","store_right"],item:[]}, 
"store_duck": {pulane:0, action:"duck","next":["store_straight1","store_straight2","store_left","store_right"],item:[]}, 
"store_left": {pulane:0, type:"exit","next":["store_straight1","store_straight2","store_duck","store_straight3"],item:[],build:"left"}, 
"store_right": {pulane:-1, type:"exit","next":["store_straight1","store_straight2","store_duck","store_straight3"],item:[],build:"right"}, 
"store_straight2": {pulane:0, "next":["store_straight_exit","store_right","store_jump","store_left","store_straight1","store_straight2","store_straight3","store_straight4","store_straight5"],item:[]}, 
"store_straight3": {pulane:0, "next":["store_right","store_straight_exit","store_left","store_straight1","store_straight2","store_straight4","store_duck","store_straight5"],item:[]}, 
"store_straight4": {pulane:0, "next":["store_right","store_straight_exit","store_jump","store_left","store_straight1","store_straight2","store_straight3","store_straight4","store_straight5"],item:[]}, 
"store_straight5": {pulane:1, "next":["store_right","store_straight_exit","store_jump"],item:[]}, 
"store_straight6": {pulane:-1, "next":["store_straight_exit","store_jump"],item:[]}, 
"store_straight7": {pulane:-1, "next":["store_left","store_straight_exit","store_jump","store_duck","store_right","store_straight1","store_straight2","store_straight3","store_straight4","store_straight5"],item:[]}, 
"store_straight8": {pulane:-1, "next":["store_right","store_straight_exit","store_jump"],item:[]}, 
"store_straight9": {pulane:1, "next":["store_straight_exit","store_jump"],item:[]}, 	
"store_straight_exit": {pulane:0, type:"exit","next":["alley_straight2","city_straight1","city_duck","city_jump","city_pit","city_straight2","city_straight3","city_straight7","city_straight8","city_straight11","city_straight12","city_straight14","city_straight15","city_straight16"],item:[]},
}
 
var paths={
	"Bar1": ["bar_straight2,bar_straight3,bar_duck,bar_straight4,bar_left,bar_straight5,bare_straight_exit","City1,City2,City3"],
	"Bar2": ["bar_straight6,bar_straight9,bar_straight8,bar_right,bar_straight7,bar_duck2,bare_straight_exit","Alley1,Alley2,Alley3"],//
	"Bar3": ["bar_straight2,bar_straight3,bar_straight4,bar_left,bar_straight5,bar_duck,bare_straight_exit","City1,City2,City3"],//
	"City1": ["city_straight7,city_straight8,city_straight9,city_jump,city_straight10,city_pit,city_straight5,city_duck,city_straight_hallway","Hallway1,Hallway2,Hallway3"],
	"City2": ["city_straight3,city_straight2,city_pit2,city_straight12,city_straight11,city_straight14,city_right_bar","Bar1,Bar2,Bar3"],//
	"City3": ["city_straight15,city_straight16,city_duck,city_straight5,city_straight6,city_pit2,city_straight2,city_pit,city_straight_grocery","Store1,Store2,Store3"],
	"City4": ["city_straight11,city_straight2,city_duck,city_straight5,city_straight13,city_straight8,city_straight9,city_pit2,city_straight3,city_straight1,city_jump,city_straight_grocery","Store1,Store2,Store3"],	
	"Alley1": ["alley_straight4,alley_pit,alley_straight1,alley_straight2,alley_right,alley_straight6,alley_duck1,alley_straight3,alley_left,alley_straight_city","City4,City2,City3"],//
	"Alley2": ["alley_straight6,alley_jump,alley_straight1,alley_duck1,alley_left,alley_straight_storage","Storage"],//
	"Alley3": ["alley_straight1,alley_pit,alley_straight3,alley_left,alley_straight4,alley_duck1,alley_right,alley_straight6,alley_pit,alley_straight_apartment","Hallway1,Hallway2,Hallway3"],//
	"Hallway1": ["hallway_straight2,hallway_straight,hallway_left,hallway_duck,hallway_straight6,hallway_pit,hallway_straight4,hallway_right,hallway_straight3,hallway_exit","Alley1,Alley2,Alley3"],//
	"Hallway2": ["hallway_straight3,hallway_pit,hallway_straight4,hallway_right,hallway_straight5,hallway_straight,hallway_duck,hallway_exit","City1,City2,City3,Alley1,Alley2,Alley3"],
	"Hallway3": ["hallway_straight3,hallway_duck,hallway_straight,hallway_left,hallway_pit,hallway_straight4,hallway_right,hallway_straight2,hallway_exit","City1,City2,City4"],//
	"Store1": ["store_straight1,store_straight3,store_duck,store_straight5,store_jump,store_left,store_straight2,store_straight_exit","City1,City2,City3"],//
	"Store2": ["store_straight6,store_jump,store_straight5,store_duck,store_straight4,store_jump,store_straight_exit","Store1,Store3"],//
	"Store3": ["store_straight7,store_jump,store_straight4,store_right,store_straight8,store_straight3,store_straight9,store_straight2,store_straight_exit","City4,City2,City3"],//
	"Storage": ["storage_straight1,storage_pit,storage_straight4,storage_straight2,storage_duck,storage_straight5,storage_right,storage_straight6,storage_left,storage_straight3,storage_straight_exit","City4,City2,City1"]//
}
