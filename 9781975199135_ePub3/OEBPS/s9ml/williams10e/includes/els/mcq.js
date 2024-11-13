var UserAns = [];
var UserCorrectAns = 0;
var UserIncorrectAns = 0;

var MCQ = function(data, currentQues, totalQues, mode){
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
		var oQuestionNumber = $('<div>', {class:'question_number '});
		

		var index=Const.bookmarkData.indexOf(currentQuestion);
		if(index > -1){
			var oFlag = $('<div>', {class:'bookmarkedFlag tabindex',title:'Remove Bookmark'});
		
		}else{
			var oFlag = $('<div>', {class:'bookmarkFlag tabindex',title:'Add Bookmark'});
		}
		var question_div = $('<div>',{class:'new_question_div'});
		var oQuestionLeft = $('<div>', {class:'question_left tabindex'});
		var oQuestionMiddle = $('<div>', {class:'question_middle'});
		var oQuestionRight = $('<div>', {class:'question_right '});
		var k = -1; 
		var question_text_html = document.createElement("div");

		console.log("oData.question_no> ",oData.question_no)
		console.log("oData.question_no> ",oData.question_no)
		var queStr = (Const.mode != "exam")?oData.question_no+" "+oData.question: oData.question
		question_text_html.innerHTML = queStr;
		oQuestionLeft.append(queStr);
		oQuestionLeft.attr( "aria-label",queStr);
		//APT: Call sort Choices to sort options in Ascending Order by string.
		sortChoices();
		for(key in oData.choices) {
			
			if(key.indexOf('@') == -1) {	
				var oDivOptions = $('<div>', {class:'radio_div'})
				var option_radio = $('<div>', {class:'option_radio'});
				var option_text = $('<div>', {class:'option_text tabindex'});
				var fbImage = $('<span>', {class:"feedback_img"});
				var radioInput = $('<span>', {class:"radio_box tabindex radio_unchecked", 'data-value': key});
				option_radio.append(fbImage);
				option_radio.append(radioInput);
				console.log("choice> ",oData.choices[key])
				option_text.append(oData.choices[key]);
				
				var option_text_html = document.createElement("div");
				option_text_html.innerHTML = oData.choices[key];
				option_text.attr( "aria-label",option_text_html.innerText);
				radioInput.attr( "aria-label", "Press enter or space to select option" );
				oOptions.push(radioInput);
				radioInput.bind('click keyup',handleRadio);

				oDivOptions.append(option_radio);
				oDivOptions.append(option_text);
				oQuestionRight.append(oDivOptions);
			}
			k++;
		}
		//console.log("k",k);
		if(k < maxAttempts ){
			maxAttempts = k;
		}
		//radioInput.addClass('radio_checked'); //
		userAnswer = Number($(radioInput).attr('data-value').split('option')[1]);

		oRevealAnswer = $('<div>', {class:'reveal-button tabindex'});
		var clearDiv = $('<div>', {class:'clear'});
		
		oQuestionRight.append(clearDiv);
		oQuestionRight.append(oRevealAnswer);
		var ques_num = $('<div>', {class:'ques_num tabindex','aria-label':"Question "+currentQuestion+" of "+totalQuestions+""});
		
		ques_num.append('Question '+currentQuestion+' of '+totalQuestions);
		
		oQuestionNumber.append(ques_num);
		if(sMode == 'study') {
			oQuestionNumber.append(oFlag);
		}
		oMcqHtml.append(oQuestionNumber);
		//oMcqHtml.append(oFlag);
		question_div.append(oQuestionLeft);
		question_div.append(oQuestionMiddle);
		question_div.append(oQuestionRight);
		oMcqHtml.append(question_div);
		oFlag.addClass('tabindex');
		oFlag.attr( "aria-label", "Press enter to bookmark the current question" );
		//oMcqHtml.append(oQuestionRight);
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
		
		oFlag.bind('click keyup',bookMarkQuestion);
		
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
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
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
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
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
		        oRevealAnswer.bind('click keyup',onSubmit);
				oRevealAnswer.css('pointer-events', 'auto');
	        }
	        $(this).addClass('radio_checked');
	        if(sMode == 'study'){
	        	onSubmit(e);
	        }
		}
		//console.log(nCurrentAttempt,maxAttempts)
    }
    function revealAnswer(e) {
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
	
    	//Number($(e.target).attr('data-value').split('option')[1])
    	$(oOptions).each(function(i, radioObj){
	        var correctAns = $(radioObj).attr('data-value').split('option')[1];
	        if(correctAns == nCorrectAnswer) {
	        	$(radioObj).addClass('radio_checked');
				$(radioObj).parent('.option_radio').find('.feedback_img').addClass('fb_correct');
	        }
	        $(radioObj).css('cursor', 'auto');
	        $(radioObj).unbind('click keyup');
		});
    	nCurrentAttempt = 0;
		evts.dispatchEvent('SHOW_FEEDBACK',{'type':'Correct', 'currentattempt':nCurrentAttempt,'attempts':3,'contents': oData.rationale});
		evts.dispatchEvent('REVEAL_ANSWER',{'type':'REVEAL_ANSWER'});
		//oRevealAnswer.unbind('click keyup');
		//oRevealAnswer.css('pointer-events', 'none');
    }
	function onSubmit(e) {
		if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
		
		if(nCurrentAttempt < maxAttempts) {
			var answerType = 'Incorrect';
			if(userAnswer == nCorrectAnswer) {
				answerType = 'Correct';
				if(sMode == 'study')
				userSelect.parent('.option_radio').find('.feedback_img').addClass('fb_correct');
				UserCorrectAns++;
				answeredCorrect = true;
			}
			else {
				if(sMode == 'study')
					userSelect.parent('.option_radio').find('.feedback_img').addClass('fb_incorrect');
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
		        //oRevealAnswer.unbind('click');
				//oRevealAnswer.addClass('disabled');
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
			//oRevealAnswer.unbind('click keyup');
		}
		if(sMode == 'study') {
			if(nCurrentAttempt >= maxAttempts ) {
				//show correct answer after three attempts in study mode.
				//if(answerType!='Correct')
				$(oOptions).each(function(i, radioObj){
					var thisAnswer = Number($(radioObj).attr('data-value').split('option')[1]);
					if(thisAnswer == nCorrectAnswer) {
		        		$(radioObj).addClass('radio_checked');
						$(radioObj).parent('.option_radio').find('.feedback_img').addClass('fb_correct');
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
		/*
		oRevealAnswer.unbind('click keyup');
		oRevealAnswer.css('pointer-events', 'none');*/
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
	function sortChoices(){
		//APT: new function is added to sort options in Ascending Order by string.
		var l_choices = [];
		var l_answer = []
		var regex = /[A-Za-z]+\.\s+/i;
		if(oData.skip_sort){
			return;
		}
		var isAllNumbers = true;
		for(key in oData.choices) {
			if(key.indexOf('@') == -1) {
				var choiceStr = oData.choices[key].replace(regex,'');
				if(isNaN(choiceStr)){
					isAllNumbers = false;
				}
				l_choices.push([key,choiceStr]);
			}
			else{
				l_answer = [key, oData.choices[key]];
			}
		}
		//Apply sort on choices.
		if(isAllNumbers){
			//Apply number sorting.
			l_choices.sort((x, y) => x[1] - y[1]);
		}
		else{
			//Apply string sorting.
			l_choices.sort((a, b) => {
				var fa = a[1].toLowerCase(),
					fb = b[1].toLowerCase();
				if (fa < fb) {return -1;}
				if (fa > fb) {return 1;}
				return 0;
			});
		}
		//Apply Format
		for (indx in l_choices) {
			l_choices[indx][1] = getFormattedOptionString(indx, l_choices[indx][1]);
		}
		l_choices.push(l_answer);
		//debugger;
		//Object.fromEntries not work for older versions of Bookshelf or 
        //Bookshelf app on windows. 
		//oData.choices = Object.fromEntries(l_choices);
        oData.choices = l_choices.reduce(function(obj, pair) {
			obj[pair[0]] = pair[1];
			return obj;
		}, {});
	}
	function getFormattedOptionString(optIndex, optStr){
		//APT: new function is added to apply/prepend formating extentions to option string.
		var alphabets = ["A", "B" ,"C", "D", "E", "F", "G", "H", "I", "J"]
		var numbers = ["1", "2" ,"3", "4", "5", "6", "7", "8", "9", "10"]
		var romanNumbers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
		//debugger;
		switch(oData.option_format){
			case "alpha":
				optStr = alphabets[optIndex] + ". " + optStr;
				break;
			case "lower-alpha":
				optStr = alphabets[optIndex].toLowerCase() + ". " + optStr;
				break;
			case "roman":
				optStr = romanNumbers[optIndex] + ". " + optStr;
				break;
			case "lower-roman":
				optStr = romanNumbers[optIndex].toLowerCase() + ". " + optStr;
				break;
			case "number":
				optStr = numbers[optIndex].toLowerCase() + ". " + optStr;
				break;
			case "none":
				optStr =  optStr;
				break;
			default:
				optStr = alphabets[optIndex] + ". " + optStr;
		}
		return optStr;
	}

	function restoreSubmitState(){
		if(oData.userAnswers!=undefined && oData.userAnswers.length>0){
			var hasCorrectAnswer = false;
			oData.userAnswers.forEach(userAns => {
				$(".radio_box[data-value='option" +userAns+ "']").addClass('radio_checked');
				if(userAns == nCorrectAnswer) {
					if(sMode == 'study'){
						$(".radio_box[data-value='option" +userAns+ "']").parent('.option_radio').find('.feedback_img').addClass('fb_correct');
					}
					hasCorrectAnswer = true;
				}
				else {
					if(sMode == 'study'){
						$(".radio_box[data-value='option" +userAns+ "']").parent('.option_radio').find('.feedback_img').addClass('fb_incorrect');
					}
				}
			});
			if(!hasCorrectAnswer && oData.userAnswers.length >= maxAttempts){
				$(".radio_box[data-value='option" +nCorrectAnswer+ "']").parent('.option_radio').find('.feedback_img').addClass('fb_correct');
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