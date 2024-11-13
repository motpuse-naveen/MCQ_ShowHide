var QuestionController = function(obj) {
    var aQuestionBlocks = new Array()
    var nCurrentBlock = 0;
    var quesSets = Const.quesSets;
    var bSetComplete = false;
    var totalQuestionToDisplay;
    
    if (Const.mode == 'exam') {
        totalQuestionToDisplay = 40;
		obj = shuffle(obj);
        // create question sets
        
        if (obj.length >= totalQuestionToDisplay) {
            obj = obj.slice(0, totalQuestionToDisplay);
			
			Const.totalExamQuestions = obj;
			var rem = obj.length % quesSets
			var numChunk = obj.length / quesSets
			var numChunk1 = numChunk;
			if (rem != 0)
				numChunk1 = numChunk - 1;

			Const.totalExamSET = numChunk1;
			// for (var i = 0; i < numChunk1; i++) {
			// 	aQuestionBlocks.push(quesSets * (i + 1))
			// }
			// if (rem != 0) {
			// 	aQuestionBlocks.push(rem + aQuestionBlocks[aQuestionBlocks.length - 1])
			// }
            aQuestionBlocks.push(totalQuestionToDisplay);
        }else{
            
			var numChunk = obj.length;
			aQuestionBlocks.push(numChunk);
		}
     
    }else if (Const.mode == 'study')
    {
        totalQuestionToDisplay = 30;
        obj = shuffle(obj);
        // create question sets
        if (obj.length >= totalQuestionToDisplay) {
            obj = obj.slice(0, totalQuestionToDisplay);
			
			Const.totalExamQuestions = obj;
			var rem = obj.length % quesSets
			var numChunk = obj.length / quesSets
			var numChunk1 = numChunk;
			if (rem != 0)
				numChunk1 = numChunk - 1;

			Const.totalExamSET = numChunk1;
			for (var i = 0; i < numChunk1; i++) {
				aQuestionBlocks.push(quesSets * (i + 1))
			}
			if (rem != 0) {
				aQuestionBlocks.push(rem + aQuestionBlocks[aQuestionBlocks.length - 1])
			}
        }else{
			var numChunk = obj.length;
			aQuestionBlocks.push(numChunk);
		}
    }
    Const.totalSection = aQuestionBlocks.length;
   
    Const.examData = obj;
    for (var i = 0; i < obj.length; i++) {
        Const.questionsData.push(i + 1);
    }


    oPopup = new PopupManager();
    oPopup.evts.addEventListener('EXAM_RESULT_CLICK', handlePopupSelction);
    var oActivity;
    var oTimer;
    var evts = new Events();

    var oQueHtml;
    var nQuestionCounter = 0;
    var arr = [];
    var oActivityData = '';
    var btnNext;
    var btnPrev;
    var btnGoTo;
    var attemptsDiv;
    var attempt1;
    var attempt2;
    var attempt3;
    var timerDivArr;
    var timerDiv1;
    var timerDiv2;
    var answerArray = [];
    var questionArray = [];
    var oBookmarkMenu;
    var oShapesDD;

    if (Const.mode == 'study') {
        bSetComplete = true;
        answerArray = new Array(obj.length)
    }

    Const.userAnswer = answerArray
    /*$.ajax({ 
    	type: 'GET', 
    	url: 'content/json/Chapter_01.json', 
    	data: { get_param: 'value' }, 
    	dataType: 'json',
    	success: function (data) { 
    		arr = data;
    		loadQuestion(nQuestionCounter)
    		if(Const.timed)
    		{
    			oTimer = new TimeController();
    			oQueHtml.append(oTimer.getHTML());
    		}
    	}
    });*/
    setupQuestionObjects(obj);

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function onDDSelected(e, type, data) {
       
        nQuestionCounter = data.question_selected - 1;

        //nQuestionCounter++;
        // if(nQuestionCounter < 70)
        // 	nQuestionCounter = 70;
        Const.CurrentActiveQuestion = nQuestionCounter + 1;
        loadQuestion(nQuestionCounter);
        oShapesDD.updateQuestionsarray();


    }

    function onBookmarkSelected(e, type, data) {
        
        nQuestionCounter = data.question_selected - 1;

        //nQuestionCounter++;
        // if(nQuestionCounter < 70)
        // 	nQuestionCounter = 70;

        Const.CurrentActiveQuestion = nQuestionCounter + 1;
        loadQuestion(nQuestionCounter);
        oShapesDD.updateQuestionsarray();

    }

    function setupQuestionObjects(data) {
       
        oQueHtml = $('<div>', {
            class: 'question_div'
        });

        if (Const.mode == 'exam') {
            var mode = "Exam Mode";
            var currentSection = Number(nCurrentBlock) + 1;
            Const.currentSection = currentSection;
            var totalSection = aQuestionBlocks.length;

            
            oQueHtml.append('<ul id="examList"><li><div id="mainListDiv"><div class="resultHeading tabindex">' + mode + ' > ' + Const.selected_section +' ></div></div></li></ul><div class="videoContainer">'+sections.SectionContent[Const.currentSection-1].videoLink+'</div><div class="question_middle_partition"></div>');
            // oQueHtml.append('<ul id="examList"><li><div id="mainListDiv"><div class="resultHeading tabindex">' + mode + ' > ' + Const.selected_section +' > Exam ' + (Const.examSeq[Const.currentSet]) + ' > Section ' + currentSection + ' of ' + totalSection + '</div></div></li></ul><div class="videoContainer">'+sections.SectionContent[Const.currentSection-1].videoLink+'</div><div class="question_middle_partition"></div>');
            buttonContainer = $('<div>', {
                class: 'button-container'
            });
        } else {
            var mode = "Study Mode";
            oQueHtml.append('<ul id="examList"><li><div id="mainListDiv"><div class="resultHeading tabindex">' + mode + ' > ' + Const.selected_section + ' ></div></div></li></ul><div class="videoContainer">'+sections.SectionContent[Const.currentSection-1].videoLink+'</div><div class="question_middle_partition"></div>');
            // oQueHtml.append('<ul id="examList"><li><div id="mainListDiv"><div class="resultHeading tabindex">' + mode + ' > ' + Const.selected_section + ' > Exam ' + (Const.examSeq[Const.currentSet]) + '</div></div></li></ul><div class="videoContainer">'+sections.SectionContent[Const.currentSection-1].videoLink+'</div><div class="question_middle_partition"></div>');
            buttonContainer = $('<div>', {
                class: 'button-container'
            });
        }
        
        

        //btnGoTo = $('<div>',{class:'btnGoTo tabindex', 'data-type':'next'});
        bookmarkButton = $('<div>', {
            class: 'bookmark tabindex',
            id: 'bookmark'
        });

        var labelArray = [(nQuestionCounter) + 11, (nQuestionCounter) + 12, (nQuestionCounter) + 13, (nQuestionCounter) + 14, (nQuestionCounter) + 15, (nQuestionCounter) + 16, (nQuestionCounter) + 17];
        var bookArray = Const.bookmarkData;

        oShapesDD = new DropDownMenu(Const.questionsData, "Shapes");
        oShapesDD.Evts.addEventListener('OPTION_SELECTED', onDDSelected);

        oBookmarkMenu = new BookmarkMenu(Const.bookmarkData, "Bookmark");
        oBookmarkMenu.Evts.addEventListener('BOOKMARK_OPTION_SELECTED', onBookmarkSelected);


        btnNext = $('<div>', {
            class: 'btnNext tabindex',
            'data-type': 'next',
            title: 'Next Question'
        });

        btnViewResult = $('<div>', {
            class: 'button btnViewResult tabindex',
            'data-type': 'ViewResult'
        });
        btnViewResult.append('View Result');
        btnPrev = $('<div>', {
            class: 'btnPrev ',
            'data-type': 'back',
            title: 'Previous Question'
        });
        btnNext.bind('click keyup', handleButtonEvents);
        btnPrev.bind('click keyup', handleButtonEvents);
        //if(Const.mode == 'exam')
        $('.footer').append(btnViewResult);
		var copyRight_text = $('<div class="divFooterPrint">ELS - Exam Review</div>');

        if (Const.mode == 'study') {
            //$('.footer').append(btnGoTo);
            //$('.header').append(bookmarkButton);
            $('.footer').append(oShapesDD.getHTML());
			$('.header').append(oBookmarkMenu.getHTML());
            $('.footer').append(btnNext);
            $('.footer').append(btnPrev);
		
			$('.bookmark').css('cursor','auto');
		
			//$('.bm-main-container').css('display','none');
        }
        //

        arr = data;
        loadQuestion(nQuestionCounter);
        // add Timer
        if (Const.timed) {
            clearIntervals();
            oTimer = new TimeController();
            Const.TimerInstance = oTimer
            oTimer.evts.addEventListener('TIME_UP', handleMainEvents);
            oTimer.evts.addEventListener('TIME_PAUSE', handleMainEvents);
            oTimer.evts.addEventListener('TIME_CONTINUE', handleMainEvents);

            timerDivArr = oTimer.getHTML();
            timerDiv1 = timerDivArr[0];
            timerDiv2 = timerDivArr[1];
            $('.footer').prepend(timerDiv1);
            $('.footer').append(timerDiv2);
        }

        //
        btnViewResult.bind('click keyup', handleButtonEvents);
    }

    function handlePopupSelction(e, type, data) {
        clearIntervals();
        evts.dispatchEvent('SHOW_EXAM_RESULT', {
            'type': 'EXAM_RESULT_CLICK',
            'STUDENT_NAME': data.STUDENT_NAME,
            'answerData': answerArray
        });
    }

    function handleButtonEvents(e) {
		if (e.type === 'keyup' && (e.keyCode !== 13))
            return false;
	
        switch ($(e.target).attr('data-type')) {
            case 'next':
                nQuestionCounter++;
                // if(nQuestionCounter < 70)
                // 	nQuestionCounter = 70;
                Const.CurrentActiveQuestion = nQuestionCounter + 1;
                loadQuestion(nQuestionCounter);
                if (Const.mode == 'study') {
                    oShapesDD.updateQuestionsarray(nQuestionCounter);
                }
				$('.btnNext').blur()
                Const.removeTabIndex();
                Const.addTabIndex();
                $('.ques_num').focus();
				
                break;
            case 'back':
                nQuestionCounter--;
                Const.CurrentActiveQuestion = nQuestionCounter + 1;
                loadQuestion(nQuestionCounter);
                if (Const.mode == 'study') {
                    oShapesDD.updateQuestionsarray(nQuestionCounter);
                }
				$('.btnPrev').blur()
                Const.removeTabIndex();
                Const.addTabIndex();
                $('.ques_num').focus();
				
                break;
            case 'ViewResult':
               
                if (Const.timed)
                    oTimer.clearTimer();
                if (Const.studentName == null)
                    oPopup.promptPopup('Enter Your Name');
                else
                    evts.dispatchEvent('SHOW_EXAM_RESULT', {
                        'type': 'EXAM_RESULT_CLICK',
                        'STUDENT_NAME': Const.studentName,
                        'answerData': answerArray
                    });

                break;
        }
    }

    function clearIntervals() {
        for (var i = 1; i < 1000; i++) {
            window.clearInterval(i);
            window.clearTimeout(i);
        }
    }

    function getBlockComplete() {
        if (aQuestionBlocks[nCurrentBlock] == (nQuestionCounter + 1)) {

            return true;
        }

        return false;

    }
    var revealArray = new Array();

    function handleMainEvents(e, type, data) {
        switch (type) {
            case 'BOOKMARK_QUESTION':
                oBookmarkMenu.updatebookMark();
                oShapesDD.updateQuestionsarray();
                break;
            case 'GOTO_QUESTIONS':
                oShapesDD.updateQuestionsarray();
                break;
            case 'SHOW_IMAGE':
                oPopup.createImagePopup('Image', data.contents);
                break;
            case 'REVEAL_ANSWER':
                revealArray.push(nQuestionCounter)
                break;
            case 'SHOW_FEEDBACK':
                answerArray[nQuestionCounter] = data;
                Const.userAnswer = answerArray;
                var oAttempt = null;
                if (data.currentattempt == 1)
                    oAttempt = attempt1;
                else if (data.currentattempt == 2)
                    oAttempt = attempt2;
                else if (data.currentattempt == 3)
                    oAttempt = attempt3;
                if (oAttempt) {
                    if (data.type == 'Incorrect') {
                        oAttempt.css('background', '#EA100F');
                    } else {
                        oAttempt.css('background', '#588123');
                    }
                }
                evts.dispatchEvent('SHOW_FEEDBACK_POPUP', {
                    'type': data.type,
                    'attempts': data.attempts,
                    'contents': data.contents
                });
                
                var startNum = 0;

                if (nQuestionCounter == arr.length - 1) {
                    Const.blockStart = startNum + 1;
                    Const.blockEnd = arr.length;
                    for (var i = 0; i < answerArray.length; i++) {
                        for (var j = 0; j < revealArray.length; j++) {
                            if (i == revealArray[j]) {
                                answerArray[i] = undefined;
                            }
                        }
                    }
                    Const.currectUserAnswers = answerArray;
                    Const.currentQuestionsSet = arr;
                    if (Const.mode == "exam") {
                        btnViewResult.css('display', 'inline-block');
						btnNext.removeClass('disabled');
						Const.removeTabIndex();
						Const.addTabIndex();
						$('.btnViewResult').focus();
                    }
                }
                break;
            case 'QUESTION_ATTEMPT':
                //if(Const.timed)
                //oTimer.clearTimer(true);
                answerArray.push(data);
				
                Const.userAnswer = answerArray;
                questionArray.push(arr[nQuestionCounter]);
                if (getBlockComplete()) {
                   
                    //
                    var answerArrTemp = new Array()
                    var questionArrayTemp = new Array()
                    var startNum = 0
                    if (nCurrentBlock > 0)
                        startNum = aQuestionBlocks[nCurrentBlock - 1]
                    Const.blockStart = startNum + 1
                    Const.blockEnd = aQuestionBlocks[nCurrentBlock]
                    for (var i = startNum; i < aQuestionBlocks[nCurrentBlock]; i++) {
                        answerArrTemp.push(answerArray[i])
                        questionArrayTemp.push(questionArray[i])
                    }
                    Const.currectUserAnswers = answerArrTemp;
                    Const.currentQuestionsSet = questionArrayTemp;
                
                    if (Const.mode == "exam") {
                        btnViewResult.css('display', 'inline-block');
						btnNext.removeClass('disabled');
						Const.removeTabIndex();
						Const.addTabIndex();
						$('.btnViewResult').focus();
                    }
                    if (nCurrentBlock == aQuestionBlocks.length - 1) {
                        bSetComplete = true;
                    }
                    nCurrentBlock++ // increase block
                    // show result button // if bSetComplete == true
                } else {
                   btnNext.removeClass('disabled');
					if(nQuestionCounter < arr.length-1){
						
						btnViewResult.hide();
						btnNext.trigger('click');
					}else{
						bSetComplete = true;
						var answerArrTemp = new Array()
						var questionArrayTemp = new Array()
						var startNum = 0
						if (nCurrentBlock > 0)
							startNum = aQuestionBlocks[nCurrentBlock - 1]
						Const.blockStart = startNum + 1
						Const.blockEnd = aQuestionBlocks[nCurrentBlock]
						for (var i = startNum; i < aQuestionBlocks[nCurrentBlock]; i++) {
							answerArrTemp.push(answerArray[i])
							questionArrayTemp.push(questionArray[i])
						}
						Const.currectUserAnswers = answerArrTemp;
						Const.currentQuestionsSet = questionArrayTemp;
					
						btnViewResult.css('display', 'inline-block');
						btnNext.removeClass('disabled');
						Const.removeTabIndex();
						Const.addTabIndex();
						$('.btnViewResult').focus();
					}
                }

                break;
            case 'TIME_UP':
				var correctAns=Const.questionData[0][nQuestionCounter]['choices']['@option'];
				var newarr={type:"Not Attempted", userAnswer:-1, nCorrectAnswer:correctAns};
				answerArray.push(newarr);
				Const.userAnswer = answerArray;
				questionArray.push(arr[nQuestionCounter]);
				oPopup.createTimeUpPopup('Time Up!');
				oActivity.disableActivity();
				btnViewResult.css('display', 'inline-block');
				btnNext.removeClass('disabled');
				Const.removeTabIndex();
				Const.addTabIndex();
				$('.btnViewResult').focus();
			
			
				
				while (nQuestionCounter < (aQuestionBlocks[nCurrentBlock]-1)){
					//nQuestionCounter = aQuestionBlocks[nCurrentBlock] - 1;
				
					var correctAns=Const.questionData[0][nQuestionCounter]['choices']['@option'];
					var newarr={type:"Not Attempted", userAnswer:-1, nCorrectAnswer:correctAns};
					answerArray.push(newarr);
					Const.userAnswer = answerArray;
					questionArray.push(arr[nQuestionCounter]);
					
					nQuestionCounter++;
				}
				if (getBlockComplete()) {
                
                    //
                    var answerArrTemp = new Array()
                    var questionArrayTemp = new Array()
                    var startNum = 0
                    if (nCurrentBlock > 0)
                        startNum = aQuestionBlocks[nCurrentBlock - 1]
                    Const.blockStart = startNum + 1
                    Const.blockEnd = aQuestionBlocks[nCurrentBlock]
                    for (var i = startNum; i < aQuestionBlocks[nCurrentBlock]; i++) {
                        answerArrTemp.push(answerArray[i])
                        questionArrayTemp.push(questionArray[i])
                    }
                    Const.currectUserAnswers = answerArrTemp;
                    Const.currentQuestionsSet = questionArrayTemp;
                    
                
                    if (Const.mode == "exam") {
                        btnViewResult.css('display', 'inline-block');
						btnNext.removeClass('disabled');
						Const.removeTabIndex();
						Const.addTabIndex();
						$('.btnViewResult').focus();
                    }
                    if (nCurrentBlock == aQuestionBlocks.length - 1) {
                        bSetComplete = true;
                    }
                   // nCurrentBlock++ // increase block
                    // show result button // if bSetComplete == true
                }
				
				
				nCurrentBlock++;
				
                break;
				
				
            case 'TIME_PAUSE':
                oActivity.disableActivity();
                break;
            case 'TIME_CONTINUE':
                oActivity.enableActivity();
                break;
        }
    }

    function showResult() {
    }

    function loadQuestion(num) {
        if (Const.mode == 'study') {
            $(attemptsDiv).remove();
            attemptsDiv = $('<div>', {
                class: 'attemptsDiv tabindex'
            });
            attemptsDiv.append('<div class="attemptstext">Attempts</div>');
            attempt1 = $('<div>', {
                class: 'attempt attempt1'
            });
            attempt2 = $('<div>', {
                class: 'attempt attempt2'
            });
            attempt3 = $('<div>', {
                class: 'attempt attempt3'
            });
            attemptsDiv.append(attempt1);
            attemptsDiv.append(attempt2);
            attemptsDiv.append(attempt3);
			attemptsDiv.attr('aria-label','You have 3 attempts remaining');
			$('.footer').append(attemptsDiv);
            oShapesDD.updateQuestionsarray();
        }
		
        $(oActivityData).remove();
        
		oActivity = new window[arr[num]['@activityType']](arr[num], num+1, arr.length,answerArray);
        //MCQ(arr[num], num+1, arr.length);
        oActivityData = oActivity.getHTML();
        oActivity.evts.addEventListener('SUBMIT_BTN_CLICK', handleMainEvents);
        oActivity.evts.addEventListener('SHOW_FEEDBACK', handleMainEvents);
        oActivity.evts.addEventListener('REVEAL_ANSWER', handleMainEvents);
        oActivity.evts.addEventListener('BOOKMARK_QUESTION', handleMainEvents);
        oActivity.evts.addEventListener('GOTO_QUESTIONS', handleMainEvents);

        oActivity.evts.addEventListener('SHOW_IMAGE', handleMainEvents);
        oActivity.evts.addEventListener('QUESTION_ATTEMPT', handleMainEvents);
        oQueHtml.append(oActivityData);
        //APT: restore the state of attempted question
        if(typeof oActivity.restoreSubmitState == 'function'){
            oActivity.restoreSubmitState();
        }
        
        var question_max_height = $(window).height() - (100 + $('.header').height() + $('#examList').height() + $('.footer').height());

    
        if (Const.mode == 'exam') {
            //$('.question_right').css('max-height', question_max_height);
        }
        var bookmark_max_height = $(window).height() - $('.footer').height();

        $('.bottomUL').css('min-height', bookmark_max_height);
		var question_max_height = $(window).height();
		$('#maincontainer').css('height', question_max_height);

        setNextBack();
    }

    function setNextBack() {
        btnNext.addClass('disabled');
        btnPrev.addClass('disabled');
        btnNext.attr('tabindex', -1);
        btnPrev.attr('tabindex', -1);
        if (nQuestionCounter == 0) {
            btnNext.removeClass('disabled');
            btnNext.attr('tabindex', 0);
        }
        if (nQuestionCounter > 0 && nQuestionCounter < arr.length - 1) {
            btnNext.removeClass('disabled');
            btnPrev.removeClass('disabled');
            btnNext.attr('tabindex', 0);
            btnPrev.addClass('tabindex');
            btnPrev.attr('tabindex', 0);
        }
        if (nQuestionCounter == arr.length - 1) {
            btnPrev.removeClass('disabled');
            btnPrev.addClass('tabindex');
            btnPrev.attr('tabindex', 0);
        }
        if (Const.mode == 'exam') {
            btnPrev.hide();
            btnNext.addClass('disabled');
        }
    }
    return {
        evts: evts,
        getHTML: function() {
            return oQueHtml;
        },
        getSetComplete: function() {
            return bSetComplete
        },
        timerPause: function(bool) {
            if (Const.timed) {
                if (bool) {
                    oTimer.pauseTimer()
                } else {
                    Const.section = true;
                    try {
                        Const.TimerInstance.clearTimer()
                    } catch (e) {}
                    //oTimer.startTimer();
                    $('.btnStartTime').remove();
                    $('.btnPauseTime').remove();
                    oTimer = new TimeController();
                    Const.TimerInstance = oTimer
                    oTimer.evts.addEventListener('TIME_UP', handleMainEvents);
                    oTimer.evts.addEventListener('TIME_PAUSE', handleMainEvents);
                    oTimer.evts.addEventListener('TIME_CONTINUE', handleMainEvents);
                    //Const.timer = 0;
                    timerDivArr = oTimer.getHTML();
                    timerDiv1 = timerDivArr[0];
                    timerDiv2 = timerDivArr[1];
                    $('#timeText').html('');
                    $('#timeText').remove();

                    //$('.footer').prepend(timerDiv1);
                    $('.footer').append(timerDiv1);

                }
            }
        },
        loadNextSet: function() {
            CurrentActiveQuestion = nQuestionCounter;
            btnNext.trigger('click');

        }
    }
}