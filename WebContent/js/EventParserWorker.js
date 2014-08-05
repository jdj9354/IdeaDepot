function runParse(){
	
	postMessage(0);
	setTimeout("runParse()",5);
	
	//runParse();
}

runParse();