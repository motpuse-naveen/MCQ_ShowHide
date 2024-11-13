var QuestionController = function(){
	var oMCQ;
	var evts = new Events();
	
	var oQueHtml
	var i = 0;
	var arr = [];
	//constructActivity(oData)
	//getHTML(oMCQ);
	oQueHtml = $('<div>',{class: 'question_div'})
	btnNext = $('<div>',{class:'btnNext'});
	btnPrev = $('<div>',{class:'btnPrev'});
	btnNext.bind('click',nextItem);
	btnPrev.bind('click',prevItem);
	attemptsDiv = $('<div>',{class:'attemptsDiv'});
	attemptsDiv.append('<div class="attemptstext">Attempts</div>');
	attempt1 = $('<div>',{class:'attempt'});
	attempt2 = $('<div>',{class:'attempt'});
	attempt3 = $('<div>',{class:'attempt'});
	attemptsDiv.append(attempt1);
	attemptsDiv.append(attempt2);
	attemptsDiv.append(attempt3);

	$('.footer').append(attemptsDiv);

	$('.footer').append(btnNext)
	$('.footer').append(btnPrev)
	
	$.ajax({
		type: 'GET', 
		url: 'content/json/Chapter_01.json', 
		data: { get_param: 'value' }, 
		dataType: 'json',
		success: function (data) { 
			arr=data
			console.log(arr);
			oMCQ = new MCQ(arr[0],1, arr.length);
			oQueHtml.append(oMCQ.getHTML());
		}
	});
	return{
		evts:evts,
		getHTML:function(){
			return oQueHtml;
		}
	}
	
	function nextItem() {
		i = i + 1; // 
		i = i % arr.length; 
		$(oMCQ.getHTML()).remove();
		oMCQ = new MCQ(arr[i], i, arr.length);
		oQueHtml.append(oMCQ.getHTML())
	}
	function prevItem() {
		if (i === 0) { 
			i = arr.length;
		}
		i = i - 1; 
		$(oMCQ.getHTML()).remove();
		oMCQ = new MCQ(arr[i], i, arr.length);
		oQueHtml.append(oMCQ.getHTML())
	}
}