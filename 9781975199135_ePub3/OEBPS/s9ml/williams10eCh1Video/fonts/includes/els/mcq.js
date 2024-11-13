var MCQ = function(data, currentQues, totalQues){
	var oData = data;
	var currentQuestion = currentQues;
	var totalQuestions = totalQues;

	var aOptions = new Array();
	var oMcqHtml;
	var evts = new Events();
	var btnSubmit;
	var userAnswer = '';
	var nCurrentAttempt = 0;
	var maxAttempts = 3;
	var nCorrectAnswer;
	var sMode = 'study';
	
	function constructActivity(){
		oMcqHtml = $('<div>');
		var oQuestionNumber = $('<div>', {class:'question_number'});

		var oQuestionLeft = $('<div>', {class:'question_left'});
		var oQuestionRight = $('<div>', {class:'question_right'});
		oQuestionLeft.append(oData.question);
		for(key in oData.choices) {
			if(key.indexOf('@') == -1) {	
				var oDivOptions = $('<div>')
				//var newinput = $('<input>',{'type':'radio','value':key,'name':'options'});
				var radioInput = $('<span>', {class:"radio_box radio_unchecked"});
				//newinput.bind('change',onInputChange);
				radioInput.bind('click',handleRadio);
				//aOptions.push(newinput)
				//oDivOptions.append(newinput)
				oDivOptions.append(radioInput)
				oDivOptions.append(oData.choices[key])
				oQuestionRight.append(oDivOptions)
			}
		}
		var oRevealAnswer = $('<div>', {class:'reveal-button'});
		oRevealAnswer.append('Reveal Answer');
		oQuestionRight.append(oRevealAnswer);
		oQuestionNumber.append('Question '+currentQuestion+' of '+totalQuestions);
		oMcqHtml.append(oQuestionNumber);
		oMcqHtml.append(oQuestionLeft);
		oMcqHtml.append(oQuestionRight);
		nCorrectAnswer = Number(oData.choices['@option'])
		btnSubmit = $('<div>')
		btnSubmit.html('submit')
		btnSubmit.bind('click',onSubmit)
		oQuestionRight.append(btnSubmit)
	}	
	function handleRadio(e){
        if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
        $('.radio_box').removeClass('radio_checked');
        $(this).addClass('radio_checked');
    }
	function onSubmit(e)
	{
		// if(nCurrentAttempt < maxAttempts)
		// {
		// 	if(userAnswer == nCorrectAnswer)
		// 	{
		// 		
		// 	}
		// 	else
		// 	{
		// 		
		// 	}
		// }
		nCurrentAttempt++;
	}
	
	function onInputChange(e)
	{
		// reset all
		userAnswer = Number($(e.target).val().split('option')[1])
		
		if(sMode != 'exam')
		{
			onSubmit(e)
		}
	}
	constructActivity();
	
	return{
		
		evts:evts,
		getHTML:function(){
			return oMcqHtml;
		}
	}
	//return oMcqHtml;
}