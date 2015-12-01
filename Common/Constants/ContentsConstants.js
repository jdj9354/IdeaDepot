//Client Constants
const REQ_PARAM_ENUM = {
	CT : "CT",
	UI : "UI",
	WP_URL : "WP_URL",
	WP_RESOLUTION : "WP_RESOLUTION",	
};
const CONTENTS_TYPE_ENUM = {
	Text : "TextContents",
	Image : "ImageContents",
	Movie : "MovieContents",
	Sound : "SoundContents",
	WebPreview : "WebPreviewContents"	
};

//Server Constants
if(typeof module != "undefined"){
	if(module != null){	
		module.exports.REQ_PARAM_ENUM = REQ_PARAM_ENUM;
		module.exports.CONTENTS_TYPE_ENUM = CONTENTS_TYPE_ENUM;
	}
}
