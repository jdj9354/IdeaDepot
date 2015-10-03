function GridPageGenerator(a_TargetDivElement,a_ItemTemplateArr){	
	var m_TargetDivElement = a_TargetDivElement;
	var m_ItemTemplateArr = a_ItemTemplateArr;
	
	var m_MaxRow = 8;
	var m_MaxCol = 4;	
	var m_PageLimit = 10;
	
	var m_ElementWidth = 110;
	var m_ElementHeight = 110;
	
	var m_CurPage = 1;
	var m_CurMinPage = 1;
	var m_CurMaxPage = 10;
	
	var self = this;
	
	this.setTargetDivElement = function(a_TargetDivElement){
		m_TargetDivElement = a_TargetDivElement;
	};
	
	this.getTargetDivElement = function(){
		return m_TargetDivElement;
	};	
	
	this.setItemTemplateArr = function(a_ItemTemplateArr){
		m_ItemTemplateArr = a_ItemTemplateArr;
	};
	
	this.getItemTemplateArr = function(){
		return m_ItemTemplateArr;
	};
	
	
	this.setMaxRow = function(a_MaxRow){
		m_MaxRow = a_MaxRow;
	};
	
	this.getMaxRow = function(){
		return m_MaxRow;
	};
	
	this.setMaxCol = function(a_MaxCol){
		m_MaxCol = a_MaxCol;
	};
	
	this.getPageLimit = function(){
		return m_PageLimit;
	};
	
	this.setPageLimit = function(a_PageLimit){
		m_PageLimit = a_PageLimit;
	};
	
	this.getElementWidth = function(){
		return m_ElementWidth;
	};
	
	this.setElementWidth = function(a_ElementWidth){
		m_ElementWidth = a_ElementWidth;
	};
	
	this.getElementHeight = function(){
		return m_ElementHeight;
	};
	
	this.setElementHeight = function(a_ElementHeight){
		m_ElementHeight = a_ElementHeight;
	};
	
	this.generate = function(){
		m_TargetDivElement.style.width = (m_MaxCol * m_ElementWidth) + "px";
		m_TargetDivElement.style.height = (m_MaxRow * m_ElementHeight) + "px";
		
	//	m_TargetDivElement.innerHTML  = InnerHTMLGenerator(1);
		
		changePageTo(1);		
	};
	
	this.onPageChanged = function(pageNum){
	};
	
	var InnerHTMLGenerator = function (curPage){
		var numCol = m_MaxCol;
		var numRow = m_MaxRow;				
		//var numRows = imgFileList.length / numCol;
		var html = "";
		var startIdx = (curPage-1)*numCol*numRow;
		for (var i = startIdx; i < startIdx+numCol*numRow; i++) {
			if(i == m_ItemTemplateArr.length)
				break;
			if(i%numCol == 0){
				if(i!=0){
					html+="</div>";
				}
				var rowWidth = m_MaxCol * m_ElementWidth;
				html += "<div id='r"+ parseInt(i/numCol) +"' style='display:flex; display:-webkit-flex;' width='"+rowWidth+"' height='"+m_ElementHeight+"'>";
				html+="<div id='r"+ parseInt(i/numCol)+"c"+i%numCol+"' width='"+m_ElementWidth+"' height='"+m_ElementHeight+"'>";
				html+= m_ItemTemplateArr[i]+"</div>";	
			}
			else{
				html+="<div id='r"+ parseInt(i/numCol)+"c"+i%numCol+"' width='"+m_ElementWidth+"' height='"+m_ElementHeight+"'>";
				html+= m_ItemTemplateArr[i]+"</div>";							
				//"<img id=img"+i+" src=http://"+CONTENTS_SERVER_ADDR+":"+CONTENTS_SERVER_FILE_ACCESS_PORT+"/"+UF+"/"+CF+"/"+imgFileList[i]+" width='110px' height='110px'><br><div style='overflow : hidden; text-overflow: ellipsis; max-width: 100px'>" + imgFileList[i] + "</div>
				
				
				if(i == numCol-1)
					html+="</div>";
			}
		}
		//IMAGE_CONTENTS_NUM_NEXT_PAGE
		html+="</div>";
		html+="<div class='pageIndicator' style='display:flex; display:-webkit-flex; margin:0 auto'>"
		var maxPage = parseInt(m_ItemTemplateArr.length / (m_MaxCol * m_MaxRow))+1;
		
		if(m_CurPage != 1)
			html+="<div class=prev style='cursor:pointer'>Previous</div>&nbsp;";		
		for (var i=m_CurMinPage; i<=m_CurMaxPage; i++){
			if(i == m_CurPage)
				html+="<div class=pageNum"+i+" style='cursor:pointer'><b>"+i+"</b></div>&nbsp;";
			else
				html+="<div class=pageNum"+i+" style='cursor:pointer'>"+i+"</div>&nbsp;";
		}
		if(m_CurPage != maxPage)
			html+="<div class=next style='cursor:pointer'>Next</div>&nbsp;";
		html+="</div>";
		return html;
	};	
	
	var pageNumberOnClickHandler = function (){
		var curPage = Number(this.className.substring(7));		
		
		changePageTo(curPage);
	};
	
	var nextPageOnClickHandler = function(){
		changePageTo(m_CurPage+1);
	};
	
	var prevPageOnClickHandler = function(){
		changePageTo(m_CurPage-1);
	};
	
	var changePageTo = function(pageNum){
		var maxPage = parseInt(m_ItemTemplateArr.length / (m_MaxCol * m_MaxRow))+1;
		
		m_CurPage = pageNum;
		m_CurMinPage = m_CurPage-5 >= 1 ? m_CurPage-5 : 1;
		m_CurMaxPage = m_CurMinPage+9 < maxPage ? m_CurMinPage+9 : maxPage;
		
		if(m_CurMaxPage == maxPage)
			m_CurMinPage = m_CurMaxPage - 9;
							
		m_TargetDivElement.innerHTML  = InnerHTMLGenerator(m_CurPage);
		
		var totalWidth = 0;
		
		if(m_CurPage != 1){
			var targetElem = m_TargetDivElement.getElementsByClassName("prev")[0];
			targetElem.onclick = prevPageOnClickHandler;			
			totalWidth += targetElem.offsetWidth;
		}
		
		for (var i = m_CurMinPage; i <= m_CurMaxPage; i++) {	
			var targetElem = m_TargetDivElement.getElementsByClassName("pageNum"+i)[0];
			targetElem.onclick = pageNumberOnClickHandler;			
			totalWidth += targetElem.offsetWidth;
		}
		
		if(m_CurPage != maxPage){
			var targetElem = m_TargetDivElement.getElementsByClassName("next")[0];
			targetElem.onclick = nextPageOnClickHandler;			
			totalWidth += targetElem.offsetWidth;
		}
		m_TargetDivElement.getElementsByClassName('pageIndicator')[0].style.width = totalWidth + "px";
		self.onPageChanged();	
	};

}



	


				

			
//("#storedImgs").parent().parent().scrollTop(0);										

	