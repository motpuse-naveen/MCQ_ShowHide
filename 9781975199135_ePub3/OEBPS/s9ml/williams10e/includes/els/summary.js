var Summary = function(){
	var evts = new Events();
	var oHtml;
	var reviewButton;
	var printButton;
	var oReviewQuesions;
	var mainBody;
	var btnNext;
	function createView(data) {
		var headerTitle;
		var startButtonId;
		oHtml = $('<div>', {id: 'summarymaincontainer'});
		mainBody = $('<div>', {class: 'mainBody'});
		printButton = $('<div>', {class: 'button tabindex', id:'startButton', 'data-type':'printresult'}).bind('click keyup',handleButtonEvents);
		reviewButton = $('<div>', {class: 'button tabindex', id:'resetButton', 'data-type':'review_quesions'}).bind('click keyup',handleButtonEvents);
		btnNext = $('<div>',{class:'nextBtn tabindex', 'data-type':'next'}).bind('click keyup', handleButtonEvents);
		btnNext.html('Next Section');
		printButton.html('Print Result');
		reviewButton.html('Review Questions');

		var footer = $('<div>', {class: 'footer'});
		var buttonContainer = $('<div>', {class: 'button-container'});
		buttonContainer.append(reviewButton);
		buttonContainer.append(printButton);
		buttonContainer.append(btnNext);

		footer.append(buttonContainer);
	
		oHtml.append(mainBody);
		var examUL = $('<ul>', {id: 'examList'});
		var examLI;
		var contentCheck;
		var contentCheckbox;
		var examUL = $('<ul>', {id: 'examList'});
		var mainListDiv = $('<div>', {id: 'mainListDiv'});
		checkboxArray = [];
		examLI = $('<li>');
		contentCheck = $('<div>', {class: 'contentCheck'});
		examLI.append(mainListDiv);

		mainListDiv.append('<div class="resultHeading tabindex" aria-label="' + Const.selected_section +' EXAM'+Const.examSeq[Const.currentSet]+' Result"> ' + Const.selected_section +' EXAM'+Const.examSeq[Const.currentSet]+' Result</div>');
		examLI.append(mainListDiv);
		examUL.append(examLI);

		var stundentDiv = $('<div>',{class:'student_name tabindex'});
		stundentDiv.append('<span class="heading" aria-label="Student Name:">Student Name:</span>');
		stundentDiv.append('<span aria-label="'+data.STUDENT_NAME+'">'+data.STUDENT_NAME+'</span>');

		//var totalQuestions = Const.questionData[Const.currentSet].length; // change if Exam
		var totalQuestions = Const.currentQuestionsSet.length; // change if Exam
		var answerData = Const.currectUserAnswers;
		var totalCorrectAns = 0;
		var totalWrongAns = 0;
		console.log('answerData', answerData)
		for (var i = 0 ; i < totalQuestions; i++) {
			if(typeof answerData[i] != 'undefined')
			if(answerData[i].type == 'Correct')
			{
				totalCorrectAns++;
			}
		}
		totalWrongAns = totalQuestions-totalCorrectAns;
		var percent = parseInt((totalCorrectAns/totalQuestions)*100);
		var grade = 'E';
		if(percent >= 90)
			grade = 'A';
		else if(percent >= 80)
			grade = 'B';
		else if(percent >= 70)
			grade = 'C';
		else if(percent >= 65)
			grade = 'D';
		var today = new Date();
		var formated_date = getFormattedDate(today);
		var dateTimeDiv = $('<div>',{class:'date_time tabindex'});
		var scoreDiv = $('<div>',{class:'score_div tabindex'});
		dateTimeDiv.append('<span class="heading" aria-label="Date and Time:">Date and Time:</span>');
		dateTimeDiv.append('<span aria-label="'+formated_date+'" >'+formated_date+'</span>');
		var resultTable = $('<table class="result-tbl tabindex">	\
			<tr><th>Section</th><th>Correct</th><th>Incorrect</th><th>Score</th><th>Percentage</th></tr>	\
				</table>');
		
		//Create array and store in result array to display final result table.
		var resultjson = {'Exam':(Const.examSeq[Const.currentSet]), 'Correct': totalCorrectAns, 'Incorrect': totalWrongAns, 'Scores1':totalCorrectAns+'/'+totalQuestions, 'Scores2':percent,'Scores3': grade};
		console.log('result', Const.totalSection);
		Const.resultArray.push(resultjson);
		//append previous result to table.
		
		for(var i = 0; i < Const.resultArray.length; i++) {
			console.log("array",Const.resultArray[i]);
			var resultTableRow = '<tr><td>Section '+(i+1)+'</td><td>'+Const.resultArray[i].Correct+'</td><td>'+Const.resultArray[i].Incorrect+'</td><td>'+Const.resultArray[i].Scores1+'</td><td>'+Const.resultArray[i].Scores2+'</td></tr>';
			resultTable.append(resultTableRow);
			
			
		}
		
		//console.log("Const.currentSet",Const.resultArray.length);
		if (Const.resultArray.length == Const.totalSection) {
			btnNext.html('End');
		}
		var gradesDiv = $('<div>',{class:'grades_div'});
		gradesDiv.append('<span class="heading">A</span>');
		gradesDiv.append('<span> - Excellent(90% - 100%),</span>');
		gradesDiv.append('<span class="heading">B</span>');
		gradesDiv.append('<span> - Above Average (80% - 89%),</span>');
		gradesDiv.append('<span class="heading">C</span>');
		gradesDiv.append('<span> - Average (70% - 79%),</span>');
		gradesDiv.append('<span class="heading">D</span>');
		gradesDiv.append('<span> - Pass (65% - 69%),</span>');
		gradesDiv.append('<span class="heading">E</span>');
		gradesDiv.append('<span> - Fail (0% - 64%)</span>');

		scoreDiv.append(resultTable);

		// mainBody.append(examUL);
		mainBody.append(stundentDiv);
		mainBody.append(dateTimeDiv);
		mainBody.append(scoreDiv);

		//mainBody.append(gradesDiv);
		oHtml.append(footer);
		setTimeout(function(){
			var mainBodyHeight = $(window).innerHeight() - ($(footer).height()+$(header).height());
        	mainBody.css({'height':mainBodyHeight});


			
		},1000);

		oReviewQuesions = new ReviewQuesions();
		var reviewHTML = oReviewQuesions.getHTML();
		$(mainBody).append(reviewHTML);
		$('.close_review_ques').unbind().bind('click', close_result);

		$(mainBody).css('overflow','hidden');
		$(this).css('pointer-events','none');
		$(this).css('display','none');
		Const.removeTabIndex();
		Const.addTabIndex();
		$('.reviewTableheadth1').focus();

		reviewButton.hide();
	}
	function handleButtonEvents(e){
		if (e.type === 'keyup' && (e.keyCode !== 13))
            return false;
		
		var type = $(e.target).attr('data-type');
		switch(type){
			case 'printresult':
				window.print();
			break;
			case 'review_quesions':
				oReviewQuesions = new ReviewQuesions();
				var reviewHTML = oReviewQuesions.getHTML();
				$(mainBody).append(reviewHTML);
				$('.close_review_ques').unbind().bind('click', close_result);

				$(mainBody).css('overflow','hidden');
				$(this).css('pointer-events','none');
				$(this).css('display','none');
				Const.removeTabIndex();
                Const.addTabIndex();
                $('.reviewTableheadth1').focus();
			break;
			case 'next':
				console.log('show next');
				evts.dispatchEvent('SUMMARY_SCREEN_NEXT',{'type':'SUMMARY_SCREEN_NEXT'});
			break;
		}
	}
	function close_result(){
		$('.reviewDiv').remove();
		$('#resetButton').show();
		$('#resetButton').css('pointer-events','auto');
	}
	function getFormattedDate(today)  {
	    var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	    var month = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December');
	    var day  = week[today.getDay()];
	    var mon  = month[today.getMonth()];
	    var dd   = today.getDate();
	    var mm   = today.getMonth()+1; //January is 0!
	    var yyyy = today.getFullYear();
	    var hour = today.getHours();
	 	var hours = today.getHours();
	  	var minutes = today.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
	    if(dd<10)  { dd='0'+dd } 
	    if(mm<10)  { mm='0'+mm } 
	    return day+', '+mon+' '+dd+' '+yyyy+', '+hours + ':' + minutes + ' ' + ampm;
	}
	return{
		evts:evts,
		getHTML:function(data) {
			createView(data);
			return oHtml;
		},
		destroy:function(){
			oHtml.remove();
		}
	}
}