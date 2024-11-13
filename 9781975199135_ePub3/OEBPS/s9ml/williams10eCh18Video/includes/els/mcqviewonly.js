var UserAns = [];
var UserCorrectAns = 0;
var UserIncorrectAns = 0;

var MCQViewOnly = function(data, currentQues, totalQues, mode){
	var oData = data;
	var currentQuestion = currentQues;
	var totalQuestions = totalQues;

	var aOptions = new Array();
	var oMcqHtml;
	var evts = new Events();
	var userAnswer = '';
	var userSelect;
	var nCurrentAttempt = 0;
	var maxAttempts = 3;
	var answeredCorrect = false;
	var nCorrectAnswer;
	var sMode = Const.mode;
	var oRevealAnswer;
	var oOptions = [];

	function constructActivity(){
		oMcqHtml = $('<div>');
		var oQuestionNumber = $('<div>', {class:'review_question_number tabindex'});
		var oQuestionLeft = $('<div>', {class:'question_left tabindex'});
		var oQuestionRight = $('<div>', {class:'question_right '});
		// oQuestionLeft.append(oData.question);
		var queStr = (Const.mode != "exam")?oData.question: oData.question
		// question_text_html.innerHTML = queStr;
		oQuestionLeft.append(queStr);
		oQuestionLeft.attr( "aria-label",queStr);
		for(key in oData.choices) {
			if(key.indexOf('@') == -1) {	
				var oDivOptions = $('<div>', {class:'radio_div'})
				var option_radio = $('<div>', {class:'option_radio'});
				var option_text = $('<div>', {class:'option_text tabindex'});
				var fbImage = $('<span>', {class:"feedback_img"});
				var radioInput = $('<span>', {class:"radio_box tabindex radio_unchecked", 'data-value': key});
				option_radio.append(fbImage);
				option_radio.append(radioInput);
				option_text.append(oData.choices[key]);

				oOptions.push(radioInput);

				oDivOptions.append(option_radio);
				oDivOptions.append(option_text);
				oQuestionRight.append(oDivOptions);
			}
		}
		var clearDiv = $('<div>', {class:'clear'});
		
		oQuestionRight.append(clearDiv);
		oQuestionNumber.append('Question '+currentQuestion+' of '+totalQuestions);
		oMcqHtml.append(oQuestionNumber);
		oMcqHtml.append(oQuestionLeft);
		oMcqHtml.append(oQuestionRight);
		nCorrectAnswer = Number(oData.choices['@option']);
	}
	
	function setFinalState(objUserAnswer)
	{
		var userAns = '-1';
		var correctAns = '-1';
		if(typeof objUserAnswer != 'undefined') {
			userAns = objUserAnswer.userAnswer;

			//correctAns = userAnswer.nCorrectAnswer;
		}
		else
		{
			userAns = null;
		}
		try{
			
			if (userAns == nCorrectAnswer) {
				oOptions[nCorrectAnswer].addClass('radio_checked');
			}
			oOptions[nCorrectAnswer].parent('.option_radio').find('.feedback_img').addClass('fb_correct');	
		}
		catch(e){
			
			

		}
		

		if(nCorrectAnswer != userAns)
		{
			if(userAns != null)
			{

				try{
				oOptions[userAns].addClass('radio_checked');
				oOptions[userAns].parent('.option_radio').find('.feedback_img').addClass('fb_incorrect');
			}
			catch(e){
				
				
			}
				
			}
		}
		
		
			//userAnswer = Number($(e.target).attr('data-value').split('option')[1]);
	}
    function revealAnswer(e){
    	$(oOptions).each(function(i, radioObj){
	        var correctAns = $(radioObj).attr('data-value').split('option')[1];
	        if(correctAns == nCorrectAnswer) {
	        	$(radioObj).addClass('radio_checked');
				$(radioObj).parent('.option_radio').find('.feedback_img').addClass('fb_correct');
	        }
	        $(radioObj).css('cursor', 'auto');
		});
    	nCurrentAttempt = 0;
		evts.dispatchEvent('SHOW_FEEDBACK',{'type':'Correct', 'currentattempt':nCurrentAttempt,'attempts':0,'contents': oData.rationale});
		
    }
	function onSubmit(e) {
		if(nCurrentAttempt < maxAttempts) {
			var answerType = 'Incorrect';
			
			if(userAnswer == nCorrectAnswer) {
				answerType = 'Correct';
				userSelect.parent('.option_radio').find('.feedback_img').addClass('fb_correct');
				UserCorrectAns++;
				answeredCorrect = true;
			}
			else {
				userSelect.parent('.option_radio').find('.feedback_img').addClass('fb_incorrect');
				UserIncorrectAns++;
			}
			nCurrentAttempt++;
			var attempts = maxAttempts - nCurrentAttempt;
			if(sMode == 'study') {
				evts.dispatchEvent('SHOW_FEEDBACK',{'type':answerType, 'currentattempt':nCurrentAttempt,'attempts':attempts,'contents': oData.rationale});
				if(answerType == 'Correct'){
					disableActivity();
				}
			}
			else{
				
				evts.dispatchEvent('QUESTION_ATTEMPT',{'type':answerType, 'userAnswer':userAnswer,'nCorrectAnswer':nCorrectAnswer});
			}
		}

		if(answeredCorrect || nCurrentAttempt >= maxAttempts || sMode == 'exam'){
			$(oOptions).each(function(i, radioObj){
		        $(radioObj).css('cursor', 'auto');
		        $(radioObj).removeClass('tabindex');
		     });
		}
		
		
		UserAns.push(userAnswer);
		//evts.dispatchEvent('SUBMIT_BTN_CLICK',{'mydata':2000, 'UserAns':UserAns})
	}
	function disableActivity(){
		$(oOptions).each(function(i, radioObj){
        	$(radioObj).unbind('click keyup');
        	$(radioObj).css('cursor', 'auto');
		});
		
		
	}
	function enableActivity(){
		$(oOptions).each(function(i, radioObj){
        	$(radioObj).unbind('click keyup');
        	$(radioObj).css('cursor', 'pointer');
			
		});
		
		
	}
	constructActivity();
	return{
		evts:evts,
		disableActivity:disableActivity,
		enableActivity:enableActivity,
		setFinalState:setFinalState,
		getHTML:function(){
			return oMcqHtml;
		}
	}
}