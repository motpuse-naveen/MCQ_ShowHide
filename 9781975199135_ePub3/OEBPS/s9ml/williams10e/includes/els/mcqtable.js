var UserAns = [];
var UserCorrectAns = 0;
var UserIncorrectAns = 0;

var MCQTABLE = function(data, currentQues, totalQues, mode){
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
		oMcqHtml = $('<div>', {class:'new_class'});
		var oQuestionNumber = $('<div>', {class:'question_number'});
		

		var index=Const.bookmarkData.indexOf(currentQuestion);
			if(index > -1){
				var oFlag = $('<div>', {class:'bookmarkedFlag tabindex',title:'Remove Bookmark'});
			
			}else{
				var oFlag = $('<div>', {class:'bookmarkFlag tabindex',title:'Add Bookmark'});
			}
		
			oFlag.addClass('tabindex');
			oFlag.attr( "aria-label", "Press enter to bookmark the current question" );
		
		var oQuestionLeft = $('<div>', {class:'question_left tabindex'});
		var oQuestionRight = $('<div>', {class:'question_right'});
		var oQuestionMiddle = $('<div>', {class:'question_middle'});
		var question_text_html = document.createElement("div");
		// question_text_html.innerHTML = oData.question;
		// oQuestionLeft.append(oData.question);
		// oQuestionLeft.attr( "aria-label",question_text_html.innerText);
		var queStr = (Const.mode != "exam")?oData.question_no+" "+oData.question: oData.question
		question_text_html.innerHTML = queStr;
		oQuestionLeft.append(queStr);
		oQuestionLeft.attr( "aria-label",queStr);

		var oTableOptions = $('<table>', {class:'table_div'});
		for(key in oData.choices) {
			var num = key.replace(/[^0-9]/g,'');
			console.log("key",num);
			if(key.indexOf('@') == -1) {	
				
				//var oTableTr=$('<div>', {class:'table_div'});
				if(num == 0){ 
					var option_radioTable = $('<td>', {class:'option_radioTable'});
					var option_radioImgTable = $('<td>', {class:'option_radioTableimg'});
					var fbImage = $('<span>', {class:"feedback_imgTable"});
					var radioInput = $('<span>', {class:"radio_box  radio_blank", 'data-value': key});
					option_radioImgTable.append(fbImage);
					option_radioTable.append(radioInput);
					var option_text = $('<tr>', {class:'optionTr '});
					
					var array = oData.choices[key].split('~');
					console.log("array ",array);
					
					
					for(var i=0;i<array.length;i++){
						var header_text = $('<th>', {class:'optiontd tabindex'});
						
						if(i==0){
							var text = $('<th>', {class:'optiontd_text'});
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
					var option_text = $('<tr>', {class:'optionTr '});
					var fbImage = $('<span>', {class:"feedback_imgTable"});
					var radioInput = $('<span>', {class:"radio_box tabindex radio_unchecked", 'data-value': key});
					radioInput.attr( "aria-label", "Press enter to select option" );
					option_radioImgTable.append(fbImage);
					option_radioTable.append(radioInput);
					
					var array = oData.choices[key].split('~');
					for(var i=0;i<array.length;i++){
						
						var header_text = $('<td>', {class:'optiontd tabindex'});
						
						if(i == 0){
							var text = $('<td>', {class:'optiontd_text'});
							text.append(array[i]);
							header_text.append(option_radioImgTable);
							header_text.append(option_radioTable);
							
							header_text.append(text);
							
						}else{
							console.log(array[i])
							header_text.append(array[i]);
						}
						option_text.append(header_text);
					}
					
					//option_text.append(oData.choices[key]);
				}
				oOptions.push(radioInput);
				radioInput.bind('click keyup',handleRadio);
				
				//oTableOptions.append(option_radioTable);
				//oTableTr.append(option_radioTable);
				//oTableTr.append(option_text);
				oTableOptions.append(option_text);
				oQuestionRight.append(oTableOptions);
			}

		}
		//radioInput.addClass('radio_checked'); //
		userAnswer = Number($(radioInput).attr('data-value').split('option')[1]);

		oRevealAnswer = $('<div>', {class:'reveal-button tabindex'});
		var clearDiv = $('<div>', {class:'clear'});
		
		oQuestionRight.append(clearDiv);
		oQuestionRight.append(oRevealAnswer);
		var ques_num = $('<div>', {class:'ques_num tabindex' ,'aria-label':"Question "+currentQuestion+" of "+totalQuestions+""});
		
		ques_num.append('Question '+currentQuestion+' of '+totalQuestions);
		
		oQuestionNumber.append(ques_num);
		
		if(sMode == 'study') {
			oQuestionNumber.append(oFlag);
		}
		oMcqHtml.append(oQuestionNumber);
		//oMcqHtml.append(oFlag);
		oMcqHtml.append(oQuestionLeft);
		oMcqHtml.append(oQuestionMiddle);
		oMcqHtml.append(oQuestionRight);
		nCorrectAnswer = Number(oData.choices['@option']);
		if(sMode == 'exam'){
			oRevealAnswer.append('Submit');
			//oRevealAnswer.bind('click keyup',onSubmit); // 

			oRevealAnswer.css('pointer-events', 'none');
		}
		else{
			oRevealAnswer.append('Reveal Answer');
			oRevealAnswer.bind('click keyup',revealAnswer);
		}
		$(oMcqHtml).find('.image_data').bind('click keyup', handleImage);
		
		oFlag.bind('click',bookMarkQuestion);
		
		$('.bookmarkFlag').on('click keyup', function(e){
		
			console.log("bookmarked");
		})
		setTimeout(function() {
            var mainBodyHeight = $(window).innerHeight() - ($('.footer').height() + $('.header').height()+25);
            oMcqHtml.css({
                'max-height': mainBodyHeight
            });
        }, 100);
	}
	
	function bookMarkQuestion(e){
		if(e.type === 'keyup' && (e.keyCode !== 13  && e.keyCode !== 32))
            return false;
		
		
		if($(this).hasClass("bookmarkFlag")){
			Const.bookmarkData.push(currentQuestion);
			$(this).removeClass("bookmarkFlag");
			$(this).addClass("bookmarkedFlag");
			$(this).attr( "title", "Remove Bookmark" );
			$(this).attr( "aria-label", "Press enter to remove the current question from  bookmark" );
		}else{
			var index=Const.bookmarkData.indexOf(currentQuestion);
			if(index > -1){
				Const.bookmarkData.splice(index,1);
			}
			$(this).removeClass("bookmarkedFlag");
			$(this).addClass("bookmarkFlag");
			$(this).attr( "title", "Add Bookmark" );
			$(this).attr( "aria-label", "Press enter to bookmark the current question" );
		}
		if (Const.bookmarkData.length > 0){
			$('.bookmark').css('cursor','pointer');
			$('.bookmark').addClass('tabindex');
			$('.bookmark').attr('tabindex', 1);
		}else{
			$('.bookmark').css('cursor','auto');
		}
		
		evts.dispatchEvent('BOOKMARK_QUESTION',{'type':'BOOKMARK_QUESTION', 'contents': currentQuestion});
		
	}
	
	function handleImage(e){
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32 ))
            return false;

		var image_url = $(e.target).attr('data-url');
		var imagecontent = $('<img>', {src:image_url});

		evts.dispatchEvent('SHOW_IMAGE',{'type':'Image', 'contents': imagecontent});
	}
	function handleRadio(e){
        if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32 ))
            return false;
		if(nCurrentAttempt < maxAttempts) {
			userAnswer = Number($(e.target).attr('data-value').split('option')[1]);
			userSelect = $(e.target);
			if(sMode == 'exam'){
	        	$(oOptions).each(function(i, radioObj){
		        	$(radioObj).removeClass('radio_checked');
		        });
		        oRevealAnswer.bind('click',onSubmit);
				oRevealAnswer.css('pointer-events', 'auto');
	        }
	        $(this).addClass('radio_checked');
	        if(sMode == 'study'){
	        	onSubmit(e);
	        }
		}
		console.log(nCurrentAttempt,maxAttempts)
    }
    function revealAnswer(e) {
    	//Number($(e.target).attr('data-value').split('option')[1])
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
		
    	$(oOptions).each(function(i, radioObj){
	        var correctAns = $(radioObj).attr('data-value').split('option')[1];
	        if(correctAns == nCorrectAnswer) {
	        	$(radioObj).addClass('radio_checked');
				console.log("",$(radioObj).parent('.optionTr').find('.option_radioTableimg'));
				$(radioObj).closest('tr').find('.feedback_imgTable').addClass('fb_correct');
	        }
	        $(radioObj).css('cursor', 'auto');
	        $(radioObj).unbind('click keyup');
		});
    	nCurrentAttempt = 0;
		evts.dispatchEvent('SHOW_FEEDBACK',{'type':'Correct', 'currentattempt':nCurrentAttempt,'attempts':3,'contents': oData.rationale});
		evts.dispatchEvent('REVEAL_ANSWER',{'type':'REVEAL_ANSWER'});
		oRevealAnswer.unbind('click keyup');
		oRevealAnswer.css('pointer-events', 'none');
    }
	function onSubmit(e) {
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
	
		if(nCurrentAttempt < maxAttempts) {
			var answerType = 'Incorrect';
			if(userAnswer == nCorrectAnswer) {
				answerType = 'Correct';
				
				if(sMode == 'study')
				userSelect.closest('tr').find('.feedback_imgTable').addClass('fb_correct');
				UserCorrectAns++;
				answeredCorrect = true;
			}
			else {
				
				if(sMode == 'study')
					userSelect.closest('tr').find('.feedback_imgTable').addClass('fb_incorrect');
				UserIncorrectAns++;
			}
			nCurrentAttempt++;
			var attempts = maxAttempts - nCurrentAttempt;
			if(sMode == 'study') {
				evts.dispatchEvent('SHOW_FEEDBACK',{'type':answerType, 'userAnswer':userAnswer, 'currentattempt':nCurrentAttempt,'attempts':attempts,'contents': oData.rationale});
				if(answerType == 'Correct'){
					disableActivity();
				}
			}
			else{
		        oRevealAnswer.unbind('click');
				oRevealAnswer.addClass('disabled');
				evts.dispatchEvent('QUESTION_ATTEMPT',{'type':answerType, 'userAnswer':userAnswer,'nCorrectAnswer':nCorrectAnswer});
			}
			if(nCurrentAttempt >= maxAttempts){
				disableActivity();
			}
			//APT: Add userAnswers to question state.
			if(oData.userAnswers == undefined) oData.userAnswers = [];
			oData.userAnswers.push(userAnswer);
		}
		if(answeredCorrect || nCurrentAttempt >= maxAttempts || sMode == 'exam'){
			$(oOptions).each(function(i, radioObj){
		        $(radioObj).unbind('click keyup');
		        $(radioObj).css('cursor', 'auto');
		        $(radioObj).removeClass('tabindex');
		     });
			oRevealAnswer.unbind('click keyup');
		}
		if(sMode == 'study') {
			if(nCurrentAttempt >= maxAttempts ) {
				//show correct answer after three attempts in study mode.
				//if(answerType!='Correct')
				$(oOptions).each(function(i, radioObj){
					var thisAnswer = Number($(radioObj).attr('data-value').split('option')[1]);
					if(thisAnswer == nCorrectAnswer) {
		        		$(radioObj).addClass('radio_checked');
						$(radioObj).closest('tr').find('.feedback_imgTable').addClass('fb_correct');
					}
		        });
			}
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
		oRevealAnswer.unbind('click keyup');
		oRevealAnswer.css('pointer-events', 'none');
	}
	function enableActivity(){
		$(oOptions).each(function(i, radioObj){
        	$(radioObj).unbind('click keyup');
        	$(radioObj).css('cursor', 'pointer');
			$(radioObj).bind('click',handleRadio);
		});
		oRevealAnswer.css('pointer-events', 'auto');
		oRevealAnswer.bind('click',onSubmit);
	}
	function restoreSubmitState(){
		//debugger;
		if(oData.userAnswers!=undefined && oData.userAnswers.length>0){
			var hasCorrectAnswer = false;
			oData.userAnswers.forEach(userAns => {
				$(".radio_box[data-value='option" +userAns+ "']").addClass('radio_checked');
				if(userAns == nCorrectAnswer) {
					if(sMode == 'study'){
						$(".radio_box[data-value='option" +userAns+ "']").closest('tr').find('.feedback_imgTable').addClass('fb_correct');
					}
					hasCorrectAnswer = true;
				}
				else {
					if(sMode == 'study'){
						$(".radio_box[data-value='option" +userAns+ "']").closest('tr').find('.feedback_imgTable').addClass('fb_incorrect');
					}
				}
			});
			if(!hasCorrectAnswer && oData.userAnswers.length >= maxAttempts){
				$(".radio_box[data-value='option" +nCorrectAnswer+ "']").closest('tr').find('.feedback_imgTable').addClass('fb_correct');
			}

			if(hasCorrectAnswer || oData.userAnswers.length >= maxAttempts){
				$(oOptions).each(function(i, radioObj){
					$(radioObj).unbind('click keyup');
					$(radioObj).css('cursor', 'auto');
					$(radioObj).removeClass('tabindex');
				 });
			}
			//Set Current attempts from state data.
			nCurrentAttempt = oData.userAnswers.length;
		}
	}
	constructActivity();
	return{
		evts:evts,
		disableActivity:disableActivity,
		enableActivity:enableActivity,
		restoreSubmitState:restoreSubmitState,
		getHTML:function(){
			return oMcqHtml;
		}
	}
}