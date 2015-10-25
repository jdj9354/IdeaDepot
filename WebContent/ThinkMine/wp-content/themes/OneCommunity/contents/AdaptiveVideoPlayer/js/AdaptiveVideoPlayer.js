if(!window.AdaptiveVideoPlayer)
	AdaptiveVideoPlayer = {};

AdaptiveVideoPlayer = new function(undefined){
	this.init = function (){
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
	this.player = function(divElem, srcURL){
		var mDivElem = divElem;
		var mSrcURL = srcURL;
		var playerWidth = 400;
		var playerHeight = 250;	
		var vdType = "html5";
		
		this.setPlayerWidth = function(aWidth){
			playerWidth = aWidth;
		};
		
		this.getPlayerWidth = function(){
			return playerWidth;
		};
		
		this.setPlayerHeight = function(aHeight){
			playerHeight = aHeight;
		};
		
		this.getPlayerWidth = function(){
			return playerHeight;
		};
		
		this.setURL = function(url){
			mSrcURL = url;
			var youtubePlayer;
			while (mDivElem.firstChild) {
				mDivElem.removeChild(mDivElem.firstChild);
			}
			
			function onPlayerReady(event) {
				event.target.playVideo();					
			}
			function onPlayerStateChange(event) {
				;
			}
			function stopVideo() {
				youtubePlayer.stopVideo();
			}
			
			if(url.startsWith("https://youtu.be")){
				vdType = "youtube";
				var vdElemInnerHtml = "<div id='youTubeVideoPlayer'> </div>";
				mDivElem.innerHTML = vdElemInnerHtml;
				
				var youtubeId = mediaParseIdFromUrl('youtube',mSrcURL);//url.substring(url.lastIndexOf("/")+1);
				youtubePlayer =	new YT.Player('youTubeVideoPlayer', {
												height: playerHeight,
												width: playerWidth,
												videoId: youtubeId,
												events: {
												'onReady': onPlayerReady,
												'onStateChange': onPlayerStateChange
											}
										});
				mDivElem.appendChild(youtubePlayer.f);
				mDivElem.stopVideo = stopVideo;

				/*var youtubeSrc = "https://www.youtube.com/embed/"+youtubeId;
				youtubeVDObj.src = youtubeSrc;
				document.getElementById('vdName').innerHTML = youtubeSrc;
			
				html5VDObj.style.display = "none";*/
			}
			else{
				vdType = "html5";
				var vdElemInnerHtml = "<video src='"+mSrcURL+"' width='"+playerWidth+"px' height='"+playerHeight+"px' controls='controls' autoplay='autoplay'> </video>";
				mDivElem.innerHTML = vdElemInnerHtml;
				/*activeObj = mDivElem.getElementsByClassName('defaultVideoPlayer')[0];
				activeObj.src = elementObj.src;
				activeObj.play();				
				
				var children = mDivElem.children;
				
				for(var i=0; i<children.length; i++){
					if(children[i] != activeObj)
						children[i].style.display = "none";				
				}*/				
			}
		};
		this.getURL = function(){
			return mSrcURL;
		};
		this.stopPlay = function(){
			switch(vdType){
			case "youtube" :
				mDivElem.stopVideo();
				break;
			case "html5" :
				mDivElem.pause();
				break;
			}
		};
		this.setURL(mSrcURL);
	}
	function mediaParseIdFromUrl(provider, url) {
		if (provider === 'youtube') {
			var youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var youtubeMatch = url.match(youtubeRegex);
			if (youtubeMatch && youtubeMatch[7].length == 11) {
				return youtubeMatch[7];
			} 
			else {
				return undefined;
			}
		} 
		else if (provider === 'vimeo') {
			var vimeoRegex = /^.*vimeo.com\/(\d+)/;
			var vimeoMatch = url.match(vimeoRegex);
			if (vimeoMatch && vimeoMatch[1].length == 8) {
				return vimeoMatch[1];
			} 
			else {
				return undefined;
			}
		} 
		else if (provider === 'viddler') {
			var viddlerRegex = /^.*((viddler.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var viddlerMatch = url.match(viddlerRegex);
			if (viddlerMatch && viddlerMatch[7].length == 8) {
				return viddlerMatch[7];
			} 
			else {
				return undefined;
			}
		} 
		else if (provider === 'dailymotion') {
			var dailymotionRegex = /^.+dailymotion.com\/((video|hub)\/([^_]+))?[^#]*(#video=([^_&]+))?/;
			var dailymotionMatch = url.match(dailymotionRegex);
			if (dailymotionMatch && (dailymotionMatch[5] || dailymotionMatch[3])) {
				if (dailymotionMatch[5]) {
					return dailymotionMatch[5];
				}
				if (dailymotionMatch[3]) {
					return dailymotionMatch[3];
				}
				return undefined;
			} 
			else {
				return undefined;
			}
		}/* not works yet
		else if (provider === 'html5') {
		var html5Regex = /.(?:wav|mp3|ogg|mp4|wma|webm|mp3)$/i;
		var html5Match = url.match(html5Regex);
		var data = {
			extension: html5Match,
			link: url
		};
		return data;
		}*/ 
		else {
			return;
		}
	}
};