var UserAns = [];
var UserCorrectAns = 0;
var UserIncorrectAns = 0;

var MCQTableViewOnly = function(data, currentQues, totalQues, mode){
	var oData = data;
	var currentQuestion = currentQues;
	var totalQuestions = totalQues;

	var aOptions = new Array();
	var oMcqTable;
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
		oMcqTable = $('<div>');
		var oQuestionNumber = $('<div>', {class:'review_question_number tabindex'});
		var oQuestionLeft = $('<div>', {class:'question_left tabindex'});
		var oQuestionRight = $('<div>', {class:'question_right tabindex'});
		// oQuestionLeft.append(oData.question);
		var queStr = (Const.mode != "exam")?oData.question: oData.question
		// question_text_html.innerHTML = queStr;
		oQuestionLeft.append(queStr);
		oQuestionLeft.attr( "aria-label",queStr);

		var oTableOptions = $('<table>', {class:'table_div'});
		for(key in oData.choices) {
					var num = key.replace(/[^0-9]/g,'');
			//console.log("key",num);
			if(key.indexOf('@') == -1) {	
				
				//var oTableTr=$('<div>', {class:'table_div'});
					if(num == 0){ 
					var option_radioTable = $('<td>', {class:'option_radioTable'});
					var option_radioImgTable = $('<td>', {class:'option_radioTableimg'});
					var fbImage = $('<span>', {class:"feedback_imgTable"});
					var radioInput = $('<span>', {class:"radio_box tabindex radio_blank", 'data-value': key});
					option_radioImgTable.append(fbImage);
					option_radioTable.append(radioInput);
					var option_text = $('<tr>', {class:'optionTr tabindex'});
					/*option_text.append(option_radioImgTable);
					option_text.append(option_radioTable);*/
					var array = oData.choices[key].split('~');
					console.log("array ",array);
					
					
					for(var i=0;i<=array.length;i++){
						var header_text = $('<th>', {class:'optiontd tabindex'});
						if(i==0){
							var text = $('<th>', {class:'optiontd_text tabindex'});
							text.append(array[i]);
							
							header_text.append(option_radioImgTable);
							header_text.append(option_radioTable);
							header_text.append(text);
						}else{
							header_text.append(array[i]);
						}
						option_text.append(header_text);
					}
					
			
				}else{
					var option_radioTable = $('<td>', {class:'option_radioTable'});
					var option_radioImgTable = $('<td>', {class:'option_radioTableimg'});
					var option_text = $('<tr>', {class:'optionTr tabindex'});
					var fbImage = $('<span>', {class:"feedback_imgTable"});
					var radioInput = $('<span>', {class:"radio_box tabindex radio_unchecked", 'data-value': key});
					option_radioImgTable.append(fbImage);
					option_radioTable.append(radioInput);
					//option_text.append(option_radioImgTable);
					//option_text.append(option_radioTable);
					var array = oData.choices[key].split('~');
					for(var i=0;i<=array.length;i++){
						
						var header_text = $('<td>', {class:'optiontd tabindex'});
						if(i==0){
							var text = $('<td>', {class:'optiontd_text tabindex'});
							text.append(array[i]);
							
							header_text.append(option_radioImgTable);
							header_text.append(option_radioTable);
							header_text.append(text);
						}else{
							header_text.append(array[i]);
						}
						
						option_text.append(header_text);
					}
					
					//option_text.append(oData.choices[key]);
				}
				
				
				

				oOptions.push(radioInput);
				//radioInput.bind('click keyup',handleRadio);
				
				//oTableOptions.append(option_radio);
				//oTableTr.append(option_radio);
				//oTableTr.append(option_text);
				oTableOptions.append(option_text);
				oQuestionRight.append(oTableOptions);
			}
		}
		var clearDiv = $('<div>', {class:'clear'});
		
		oQuestionRight.append(clearDiv);
		oQuestionNumber.append('Question '+currentQuestion+' of '+totalQuestions);
		oMcqTable.append(oQuestionNumber);
		oMcqTable.append(oQuestionLeft);
		oMcqTable.append(oQuestionRight);
		nCorrectAnswer = Number(oData.choices['@option']);
	}
	
	function setFinalState(objUserAnswer)
	{
		console.log("objUserAnswer",objUserAnswer);
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
			oOptions[nCorrectAnswer].addClass('radio_checked');
			
			oOptions[nCorrectAnswer].closest('tr').find('.feedback_imgTable').addClass('fb_correct');	
		}
		catch(e){
			//console.log(oData);
			//console.log('oOptions', oOptions);

		}
		

		if(nCorrectAnswer != userAns)
		{
			if(userAns != null)
			{

				try{
				oOptions[userAns].addClass('radio_checked');
				
				oOptions[userAns].closest('tr').find('.feedback_imgTable').addClass('fb_incorrect');
			}
			catch(e){
				console.log(oData,userAns,"sdfsdfs");
				console.log('oOptions', oOptions);
			}
				
			}
		}
		/*//console.log('userAnswer ',userAnswer.userAnswer)
		$(oOptions).each(function(i, radioObj){
			var thisAnswer = i;//$(radioObj).attr('data-value').split('option')[1];
			//console.log('thisAnswer',thisAnswer)
			$(radioObj).css('cursor', 'auto');

			if(thisAnswer == userAns) {
				$(radioObj).parent('.option_radio').find('.feedback_img').addClass('fb_incorrect');
			}
			
		});*/
			//userAnswer = Number($(e.target).attr('data-value').split('option')[1]);
	}
    function revealAnswer(e){
    	$(oOptions).each(function(i, radioObj){
	        var correctAns = $(radioObj).attr('data-value').split('option')[1];
	        if(correctAns == nCorrectAnswer) {
	        	$(radioObj).addClass('radio_checked');
				$(radioObj).closest('tr').find('.feedback_imgTable').addClass('fb_correct');
	        }
	        $(radioObj).css('cursor', 'auto');
		});
    	nCurrentAttempt = 0;
		evts.dispatchEvent('SHOW_FEEDBACK',{'type':'Correct', 'currentattempt':nCurrentAttempt,'attempts':0,'contents': oData.rationale});
		
    }
	function onSubmit(e) {
		if(nCurrentAttempt < maxAttempts) {
			var answerType = 'Incorrect';
			console.log($(e.target).parent('.option_radio'));
			if(userAnswer == nCorrectAnswer) {
				answerType = 'Correct';
				userSelect.closest('tr').find('.feedback_imgTable').addClass('fb_correct');
				UserCorrectAns++;
				answeredCorrect = true;
			}
			else {
				userSelect.closest('tr').find('.feedback_imgTable').addClass('fb_incorrect');
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
		//console.log('correct count',UserCorrectAns);
		//console.log('incorrect count',UserIncorrectAns);
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
			return oMcqTable;
		}
	}
}