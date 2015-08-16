var TMO = require('../Common/ThinkMineObjects');
//Client Constants
const REQ_PARAM_ENUM = {
	CT : "CT",
	UI : "UI",
	WP_URL : "WP_URL",
	WP_RESOLUTION : "WP_RESOLUTION"
}
const CONTENTS_TYPE_ENUM = TMO.ContentsTypeEnum;

//Server Constants
if(typeof module != "undefined"){
	if(module != null){
		module.exports.REQ_PARAM_ENUM = REQ_PARAM_ENUM;
	}
}
