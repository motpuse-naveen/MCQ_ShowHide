(function(player) {
    var oPopup;
    var oQue;
    var oSummary;
    var Evts = new Events();
    var _self = this;

    var objQuestionData
    var nTotalJSON = 0;
    var numJSONLoad = 0;
    var aJsonArr;
    var bEnd = false;

	$(window).load(function() {


        $(".loader").delay(800).fadeOut("slow");
        $('.loadDiv').delay(800).fadeOut(300);
        setTimeout(function() {
            $(".topHeading1").focus();
			$("#startButton").click();
			$("#maincontainer").css("opacity","1");
        }, 500);
        

    });
	
    //document.ready and execute init
    $(document).ready(function() {
        init();

    });

    function init() {
        
        oMainSelection = new MainSelection();
        oPopup = new PopupManager();
        oMainSelection.evts.addEventListener('EXAM_MODE_CLICK', handleMainEvents);
        oMainSelection.evts.addEventListener('HOME_BTN_CLICK', handleMainEvents);
        oMainSelection.evts.addEventListener('BACK_BUTTON_CLICK', handleMainEvents);

        oMainSelection.evts.addEventListener('START_STUDY_BTN_CLICK', handleMainEvents);
        oMainSelection.evts.addEventListener('EXAM_MODE_BTN_CLICK', handleMainEvents);
        oMainSelection.evts.addEventListener('RESET_STUDY_BTN_CLICK', handleMainEvents);
        Evts.addEventListener("JSONLoaded", onJsonLoaded)

        $('body').append(oMainSelection.getInitHTML()); //uncomment this for init
        oMainSelection.setParameters();
		var question_max_height = $(window).height();
		$('#maincontainer').css('height', question_max_height);
		
        Const.addTabIndex();
        //$('body').append(oMainSelection.getModeHTML()); //comment this
        /*oQue = new QuestionController();
        $('body').append(oQue.getHTML());*/
    }

    function reset() {
        $('body').html('');
        /*nTotalJSON = 0;
        numJSONLoad = 0;*/
        init();
    }

    /* Why is this function here if its not being used? -- Amit jain*/
    function loadJSON(uri) {

        $.ajax({
            type: 'GET',
            url: uri,
            //async:false,
            data: {
                get_param: 'value'
            },
            dataType: 'json',
            success: function(data) {
                objQuestionData.concat(data);
                numJSONLoad++

                if (numJSONLoad == aJsonArr.length) {
                    loadQuestionController(objQuestionData)
                } else {
                    Evts.dispatchEvent("JSONLoaded");
                }
            },
            error: function(e) {
            }
        });
    }

    /* Why is this function here if its not being used? -- Amit jain*/
    function onJsonLoaded() {
        loadJSON(aJsonArr[numJSONLoad])
    }

    function recursiveLoad() {
            $.getJSON(aJsonArr[numJSONLoad], function(data) { 
                numJSONLoad++
                // loader text change to "numJAONLoad/aJsonArr.length loaded"
                var percent = Math.round((numJSONLoad/aJsonArr.length)*100);               
                
                $('.progress-bar').css({'width': percent +'%'});
                $('.progress-bar').attr('aria-valuenow', percent +'%');
                $('.loader div span').text(percent+"% loaded");               

                
                if (objQuestionData == null) {
                    objQuestionData = data
                    recursiveLoad();
                } else {
                    for (var i = 0; i < data.length; i++) {
                        objQuestionData.push(data[i])
                    }
                    recursiveLoad();
                }
                if (numJSONLoad == aJsonArr.length) {
                    //if(obj.type != null)
                    //{

                    // hide loader //
                    $('.loader, .preloaderDiv').hide();

                    Const.examSeq = myObj.type;
                    Const.questionData = filterSeperateQuestions(myObj.type, objQuestionData)
                    //objQuestionData = filterQuestions(myObj.type,objQuestionData)
                    //}
                    loadQuestionController(Const.questionData[Const.currentSet])
                }else{
                    $('.loader, .preloaderDiv').show();
                }
            })
        }

    var myObj;

    function loadDataForQuestions(obj) {
        myObj = obj;      
        Const.questionData = new Array()
        objQuestionData = null
        sData = "";
        aJsonArr = obj.data
        nTotalJSON = obj.data.length
        numJSONLoad = 0;
        
        //for(var i=0;i<aJsonArr.length;i++)
        
        recursiveLoad();
        // initLoader //
        var mainWidth = $('.mainBody').width()/ 2;
        var mainLeft = $('.mainBody').offset().left + mainWidth/2;
        var loaderContainer = $('<div>', {class:'loader'});
        var loaderBar = $('<div>', {class:'progress-bar', role:'progressbar', style:'width: 0%', 'aria-valuenow':'0','aria-valuemin':'0','aria-valuemax':'100'});
        loaderContainer.css({'width': mainWidth+'px','left': mainLeft+'px'});
        loaderContainer.append(loaderBar);
        loaderContainer.append('<div class="progressText"><span>0% loaded</span></div>');
        var preloaderDiv = $('<div>', {class:"preloaderDiv"});
        var preloader = $('<div>', {class:"preloader"});
        var preloaderBase = $('<div>', {class:"preloaderBase"});
        var preloaderIcon = $('<div>', {class:"preloaderIcon"});
        preloaderBase.append(preloaderIcon);     
        preloader.append(preloaderBase);     
        preloaderDiv.append(preloader);
        for(i = 1; i<=12 ; i++){
            preloaderIcon.append('<div class="preloader-circle'+i+' preloader-child"></div>');
        }     
       
        $('body').append(preloaderDiv);
        $('body').append(loaderContainer);
        $('.loader').show();
    }

    function onSummaryScreenNext() {
        Const.currentSet++
            if (Const.currentSet < Const.questionData.length) {
                loadQuestionController(Const.questionData[Const.currentSet]);
            }
        else {
		
            var lasttext1 = $('<div class="end_heading">You have reached the End of the Test.</div>');
            var lasttext2 = $('<div class="end_heading">Click on the Home icon on the top left corner of the screen to go back to the home page.</div>');
            $('.mainBody .question_div').remove();
            $('.mainBody').append(lasttext1);
            $('.mainBody').append(lasttext2);
            $('#homeButton').show();
            $('#backButton').hide();
            bEnd = true;
        }
    }

    function filterSeperateQuestions(arrFilter, arrToFilter) {
        //var arrNew = new Array()
        var seperatedArray = new Array();

        for (var j = 0; j < arrFilter.length; j++) {
            var arr = new Array();
            for (var i = 0; i < arrToFilter.length; i++) {
                if (arrToFilter[i]['@exam'] == arrFilter[j]) {
                    arr.push(arrToFilter[i])
                    //arrNew.push(arrToFilter[i])
                }
            }
            seperatedArray.push(arr)
        }
        return seperatedArray;
    }

    function filterQuestions(arrFilter, arrToFilter) {
        var arrNew = new Array()
        //var seperatedArray = new Array();
        for (var i = 0; i < arrToFilter.length; i++) {
            for (var j = 0; j < arrFilter.length; j++) {
                if (arrToFilter[i]['@exam'] == arrFilter[j]) {
                    arrNew.push(arrToFilter[i])
                }
            }
        }
        return arrNew;
    }

    function loadQuestionController(data) {
        /*$('body').html('')
        oQue = new QuestionController(data);
        oQue.evts.addEventListener('SHOW_FEEDBACK_POPUP',handleMainEvents);
        $('body').append(oQue.getHTML());*/
        $('.mainBody').html('');
        $('.footer').html('');
        oQue = new QuestionController(data);
        oQue.evts.addEventListener('SHOW_FEEDBACK_POPUP', handleMainEvents);
        oQue.evts.addEventListener('SHOW_EXAM_RESULT', handleMainEvents);
        oQue.evts.addEventListener('EXAM_RESULT_CLICK', handleMainEvents);
        $('.mainBody').append(oQue.getHTML());
        $('#maincontainer>.footer').show();
        Const.addTabIndex();
		$('.homeButton').focus();
    }

    function showExamSummary(data) {
        oSummary = new Summary(data);
        oSummary.evts.addEventListener('SUMMARY_SCREEN_NEXT', handleMainEvents);

        //$('.mainBody').html('');
        //$('.footer').remove();
        oQue.timerPause(true);
        $(oQue.getHTML()).hide();
        $('#maincontainer>.footer').hide();

        $('.mainBody').append(oSummary.getHTML(data));
    }

    function handleMainEvents(e, type, data) {
        switch (type) {
            case 'HOME_BTN_CLICK':
                reset();
                if (bEnd) {
                    location.reload();
                }
                break;
            case 'BACK_BUTTON_CLICK':
                var ModeHTML = oMainSelection.getModeHTML(Const.mode);
                if (Const.timed)
                    Const.TimerInstance.clearTimer();
                $('body').html('');
                $('body').append(ModeHTML);
                Const.addTabIndex();

                break;
            case 'START_STUDY_BTN_CLICK':
            case 'EXAM_MODE_BTN_CLICK':
                loadDataForQuestions(data)
                break;
            case 'SHOW_FEEDBACK_POPUP':
                popupTitle = "<span class='feedback_img fb_incorrect'></span><span class='incorrect'>That's Incorrect!</span>";
                popupContents = 'Please try again! You have (' + data.attempts + ') chance remaining.';
				Const.atmpt = 0;
				if(data.attempts == 2){
					popupContents = 'Please try again! You have (' + data.attempts + ') chances remaining.';
					Const.atmpt = 0;
				}
				
                if (data.type == 'Correct' || data.attempts == 0) {
                    popupTitle = "<span class='feedback_img fb_correct'></span><span class='correct'>That's Correct!</span>";
                    popupContents = data.contents;
					$('.attemptsDiv').attr('tabindex',-1);
					$('.attemptsDiv').removeClass('tabindex');
					Const.atmpt = 1;
                }
                if (data.attempts == 0 && data.type != 'Correct') {
                    popupTitle = 'Answer';
					$('.attemptsDiv').attr('tabindex',-1);
					$('.attemptsDiv').removeClass('tabindex');
					Const.atmpt = 1;
                }
                if (data.attempts == 3) {
                    popupTitle = 'Answer';
					$('.attemptsDiv').attr('tabindex',-1);
					$('.attemptsDiv').removeClass('tabindex');
					Const.atmpt = 1;
                }
				$('.attemptsDiv').attr('aria-label',popupContents);
                oPopup.createPopup(popupTitle, popupContents);
                break;
            case 'SHOW_EXAM_RESULT':

                showExamSummary(data);
                break;
            case 'SUMMARY_SCREEN_NEXT':
                oSummary.destroy();
                if (oQue.getSetComplete()) {
                    onSummaryScreenNext();
                } else {
                    //timer play
                    $('#maincontainer .btnViewResult').hide();
                    oQue.timerPause(false);
                    $(oQue.getHTML()).show();
                    $('#maincontainer>.footer').show();
                    oQue.loadNextSet();
                }
                break;
        }
    }
    //remove focus for click    
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 9) {
        $('body').addClass('show-focus-outlines');
      }
    });
    document.addEventListener('click', function(e) {
      $('body').removeClass('show-focus-outlines');
    });


})(ELSExamView = ELSExamView || {})
var ELSExamView;