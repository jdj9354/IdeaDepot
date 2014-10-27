function runAnimation(repeatCount, interval){
	
	if(repeatCount == 0){
	console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		postMessage(1);
		
		return;
	}
	console.log(repeatCount);
	postMessage(0);
	setTimeout(function(){runAnimation(repeatCount,interval);},interval);
	repeatCount--;
	//runParse();
}

self.addEventListener('message', function(e){
	var data = e.data;
	runAnimation(data.repeatCount, data.interval);
},false);

