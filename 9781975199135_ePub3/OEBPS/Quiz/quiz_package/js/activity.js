var data = data;
var mainBox = '';
var question = 1;
var currentQuestion;
var nMaxPage = data.nMaxPage;
var nMaxPageFlag = 1;
var correctAnswersPool, correctMultiAnswersPool;
var attemptedQues = [];
var attemptedQuesStatus = [];
var correctCount=0;
var incorrectCount=0;
var totalAttemptCount=0;
var preservedQuesStates = [];
var preservedJsonData = [];
var answerContainer = '';
var DragSet = '';
var tempParent = '';
var DropedDargbox = '';
var frameDragspot = 4;
var OptionArray = new Array();
var aSlidesArray = new Array();
var nSlideCounter = 0;
var nCount = 0;
var reviewQuizEnabled = false;
var isTooltipOpen = false;
var AnsDropped = new Array();
var dragging = false;
var isMobile;
var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
countAttempts = 1;
var currentattempt=[];
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
isAndroid = navigator.userAgent.indexOf('Android') != -1;
if(supportsTouch || isAndroid){offsetBottom = 120;}else{offsetBottom = 0;}
$(document).ready(function() {
	
    $(window).load(function(){            
        $('.loadDiv').delay(800).fadeOut(300);
		addShowAnswerFunctionality();
    });    
    $(document).keydown(function(e){
        var charCode = (e.which) ? e.which : e.keyCode;
        if($(e.target).hasClass('image-modal-close')){
            if(charCode ==40){
                $("#myModal").animate({scrollTop : $("#myModal").scrollTop()+100},300);
            }
            if(charCode ==38){
                $("#myModal").animate({scrollTop : $("#myModal").scrollTop()-100},300);
            }
        }
    })
    $(".task-container").attr('role','application');
    $('.icon-blue').attr('aria-hidden',true);
    nCurrentQuesNo = 1;
    function addWindowEvents() {
        $(window).click(function(e) {
            $('body').removeClass('keybord_outline');
            $(".control input:focus ~ .control-indicator").css('outline','none');
           
        });
            $(window).on('keydown', function(e) {
                if (e.keyCode === 9) {
                    $('body').addClass('keybord_outline');
                }
            });
        document.addEventListener('click', function(e) {
            $('body').removeClass('keybord_outline');
            $(".control input").css('outline','none');
            
        }); 
            $(document).on('touchmove', function(event) {
            // alert(event.type);
            event.preventDefault();
        });      
    }
    setTimeout(function() {
        var questionWrapper = $(window).height();
        $('.container.task-container').css({
            'height': questionWrapper-offsetBottom
        });
    },200);
    addWindowEvents();
    $('.task-container-col .pull-left h3').text(data.testTitle);
    var perPageCount = 7;
    isMobile = true;    
    setTimeout(function(){    
        $('.mxpage-previous,.mxpage-next,.mxpage-default,.beginBtn').addClass('tabindex');
        set_tabindex();
        $('.mxpage-previous,.mxpage-next,.mxpage-default,.resetButton,.resetButton2,.beginBtn').bind('click', function(e){
            if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){
                  return  true;
            }
            $('a').attr('tabindex','-1');
             setTimeout(function(){
                $('.mxpage-previous,.mxpage-next,.mxpage-default').addClass('tabindex');
                    set_tabindex();
                    setProgress();
                //$('[tabindex]').first().focus();    
                $('.modal-header').show();
                // $(".dragspot").bind('keydown touchstart', showDropList);
            },200);
            countAttempts = 1;
        })
        $('.resetButton3').unbind().bind('click', handleAckPopup);
        
    },500);   
    
    $('#sModal,#sModal1').bind('click keyup', function(e){
        if(e.type=="keyup" && e.keyCode !=13 && e.keyCode !=32 && e.keyCode != 9){
           return  true;
        }
        var target = $(e.target);
        if($(e.target).attr('class') == undefined){ 
           target = $(e.target).parent(); 
        }
        if(target.hasClass('close') && e.keyCode != 9){ 
            var targetId = $(this).attr('id');
            $(this).removeClass('in').hide();
            $('.modal-backdrop').removeClass('in').hide();
            $('body').removeClass('modal-open');
            $(this).find('[tabindex]').removeAttr('tabindex');
            set_tabindex();
            $(".task-container-col, .taskRow, .modal,.resultWrapper,.pull-left,.resetButton3").removeAttr('aria-hidden');
            $('button[data-target="#'+targetId+'"]').addClass('keybord_outline').focus();
        }
    });   
    isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    if (isMobile.any()) {
        perPageCount = 4;
    }    
    $('.footer-scroll').mxpage({
        perPage: perPageCount,
        currentPage: 1,
        maxPage: nMaxPage,
        previousText: '<div></div>',
        nextText: '<div></div>',
        frontPageText: 'First',
        lastPageText: 'Last',
        click: function(index, $element) {
            var CurQuestion = index-1;
            var isdraggable = data.questionsList[(CurQuestion)].isDraggable;            
            if(isdraggable){
                var all_dropped = true;
                $('#dragDropContainer-'+(CurQuestion)+' .dropspot').each(function(){
                    if($(this).attr("dropped") != 'true')
                        all_dropped = false;
                });
                if(all_dropped == true){
                    $('#question'+CurQuestion).find('.checkButton').removeAttr('disabled').removeClass('disabled').removeAttr('aria-hidden').css('pointer-events','auto');
                }else{
                   $('#question'+CurQuestion).find('.checkButton').attr('disabled',true).attr('aria-hidden',true).css('pointer-events','none');     
                }
            }else{                
                if($('#question'+CurQuestion).find('input:checked').length>0){
                    $('#question'+CurQuestion).find('.checkButton').removeAttr('disabled').removeClass('disabled').removeAttr('aria-hidden').css('pointer-events','auto');
                }else{
                   $('#question'+CurQuestion).find('.checkButton').attr('disabled',true).attr('aria-hidden',true).css('pointer-events','none');     
                }
            }
            
        }
    });    
            
    $('.iconBlue').attr('aria-label','To show quiz status, press this button.');
    $('.nextBtn').attr('aria-label','Next drag items button, press this button.');
    $('.prevBtn').attr('aria-label','previous drag items button, press this button.');
    $("body").on("click", ".posClose", closeFeedback);
    $("body").on("click", ".mxpage-default", gotoQuestion);
    $("body").on("click", ".mxpage-next", handleQuestionNavigation); //b
    $("body").on("click", ".mxpage-previous", handleQuestionNavigation); //b
    $("body").on("click", ".zoomText", showTooltip);    
    $('.leftArrow').unbind().bind('click',fnBack);
    $('.rightArrow').unbind().bind('click',fnNext);
    $(".checkButton").attr("aria-label","To submit your answer, press this button.");
   
    document.addEventListener('keyup', function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var el = document.activeElement;
       if (code == 9 &&  !$(el).is("html") && !$(el).is("body")) {
            $('.keybord_outline').removeClass('keybord_outline');
            $(el).addClass('keybord_outline');
            $(".control input:focus ~ .control-indicator").css('outline','none');
        }
    }, true);
    $('body').click(function(){
        $('.keybord_outline').removeClass('keybord_outline');
    });
    box = $('.task-container-col');
    mainBox = $('.mainBox');
    $(".pull-right").attr('aria-hidden',true).hide();
    if (typeof data == 'undefined') {
        return false;
    }
    //Set the main data to first page and then hide the loader
    if (typeof data.heading != 'undefined') box.find('.pull-left .heading').text(data.heading);
    if (typeof data.content != 'undefined') mainBox.find('.text .content').html(data.content);
    if (typeof data.innerContent != 'undefined' && data.innerContent) mainBox.find('.innerbox').html(data.innerContent);
    else mainBox.find('.innerbox').hide();
    if (typeof data.buttonText != 'undefined' && data.buttonText) mainBox.find('.button').text(data.buttonText);
    else mainBox.find('.button').text('Begin');
    setParameters();
    setupQuiz();
    $('.zoomImgBtn').unbind('click keypress').bind('click keypress',function(e){

        if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){
            return  true;
        }
        var modal = document.getElementById('myModal');
        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = $(this);
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        
        modal.style.display = "block";
        modalImg.src = $(this).find('img').attr('src');
        setTimeout(function(){
            reset_tabindex();
            $('[tabindex],a').attr('tabindex','-1').attr('aria-hidden',true);
            var vtabindex = 0;
            $('.modal:visible').find('.tabindex:visible').each(function(){
                $(this).attr('tabindex',vtabindex).removeAttr('aria-hidden');
            });
            //$('#myModal .image-modal-close').addClass('keybord_outline').focus(); 
        },800);
        $(".task-container-col, .taskRow, .modal, .task-description-footer").attr('aria-hidden',true);
        $("#myModal").removeAttr('aria-hidden');
        var _this = $(this);
        $('.image-modal-close').unbind('click').bind('click',function(){            
            $('#myModal').hide();
            set_tabindex();
            _this.addClass('keybord_outline').focus();
            $(".task-container-col, .taskRow, .modal, .task-description-footer").removeAttr('aria-hidden');
        });
        
    });    
    try{
        if(localStorage.getItem(data.testTitle)) {       
            preservedJsonData = JSON.parse(localStorage.getItem(data.testTitle));
            preservedQuesStates = preservedJsonData;
            for (var i = 0; i < preservedJsonData.length; i++) {            
               buildPreservedState(i, preservedJsonData[i].id);              
            }            
            correctCount = ($('.ACIBtn span.correctTickMark').length);
            incorrectCount = ($('.ACIBtn span.inCorrectTickMark').length);

            totalAttemptCount = incorrectCount + correctCount;
            
            $('#greenNo').text(correctCount); 
            $('#redNo').text(incorrectCount);
            $('#blueNo').text(totalAttemptCount);
            setTimeout(function(){
                setProgress();
                startQuiz();
            },10);      
        }
     }catch(e){ 
    // alert(e)
    }        
    $(window).bind('pagehide beforeunload', function(){ 
       if(preservedQuesStates.length > 0) {
        try{
            // localStorage.setItem(data.testTitle, JSON.stringify(preservedQuesStates));
        }catch(e){ 
        }
       }
    }); 
});
    function handleAckPopup(e){
        if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){
          return  true;
        }
        var targetModal = $(e.target).attr('data-target'); 
        $('.modal-header,.modal-dialog,.modal-content').show();
         setTimeout(function(){
            $('.mxpage-previous,.mxpage-next,.mxpage-default').addClass('tabindex');
                reset_tabindex();
                setPopup_tabindex();
                $('.close').attr('tabindex',0).addClass('keybord_outline').focus();
        },500);
         console.log(targetModal)
        $(".task-container-col, .taskRow, .modal").attr('aria-hidden',true);
        $(targetModal).attr('aria-hidden',false);
    }
    function scrollpopup(e){
      if(e.type=="keydown" && e.keyCode !=37 && e.keyCode !=38 && e.keyCode !=39 && e.keyCode !=40){
          return  true;
      }   
      var scrollElement = $(this).parent().find('.dragspot_txt');
      if(e.keyCode == 38) {          
        var scrollVal = scrollElement[0].scrollHeight/5;
        scrollElement.animate({scrollTop: scrollElement.scrollTop()-scrollVal},50);        
      }
      if(e.keyCode == 40) {
        var scrollVal = scrollElement[0].scrollHeight/5;
        scrollElement.animate({scrollTop: scrollElement.scrollTop()+scrollVal},50);        
      }   
    }
    function reset_tabindex(){
        $('[tabindex]').attr('tabindex','-1').attr('aria-hidden',true);
    }
    function setPopup_tabindex(){ 
        // $('[tabindex]').attr('tabindex','-1').attr('aria-hidden',true);
        var vtabindex = 1;
        $('.modal-content:visible').find('.tabindex:visible').each(function(){
            $(this).attr('tabindex',0).removeAttr('aria-hidden');
        });
    }
    function setCurrentAriaLable(){
        if(supportsTouch || isAndroid){
            return false;
        }
        $('.questionslist div.questionWrapper').eq(currentQuestion).each(function(){   
            var setAriaLabel = $('.chapter_heading').text()+', '+$(this).find(".directionHead").text()+' '+$(this).find(".question .number").text()+' '+$(this).find(".question .text").text();
            // $(this).attr('aria-label', setAriaLabel);
            $(this).parents('.row').find('.chapter_heading').attr('aria-label', setAriaLabel);
            if(isMac){
                var heading = $('.chapter_heading').attr('aria-label');
                $('.macp').remove();
                $('#chapter_heading').parent().prepend('<p class="macp" id="chapter_heading" aria-label="'+heading+'"></p>');
            }
        });    
    }
    function showTooltip(e) { 
        if(e.type=='keydown' && e.keyCode==9){
            $('#dragspot-tooltip').remove();                
            $("body").off("click", hideTooltip);       
        }else{
            if(isTooltipOpen){
                var data_id = $('.tooltipc .closeBtn').attr('data-id');
                var Cur_data_id = $(e.target).attr('data-id');         
                    if(data_id == Cur_data_id){
                       $('#dragspot-tooltip').remove();
                       $("body").off("click", hideTooltip);
                       isTooltipOpen = false;
                       return false; 
                }            
            }
            $('#popup,#dragspot-tooltip').remove();
            var str = $(this).parent().html();
            str = str.replace("Browser issues", " ");
            var tooltip= $('<div id="dragspot-tooltip" class="tooltipc"><div class="tooltip_text"><button class="closeBtn" tabindex="0" aria-label="To close this popup, press this button."><img src="../quiz_package/images/cross-black.svg" alt="close popup" /></button>'+str+'<span class="tooltipPointer"></span></div></div>');
            var $dropspot = $(this).closest('.dragspot');
            var $dropspot = $(this).closest('.dragspot');
            var tleft = $dropspot.width();
            var tbottom = $dropspot.height();
            // var close_tooltip = $('<button class="close_tooltip"></button>')
            $dropspot.parent().append(tooltip);

            $('.tooltip_text').find('.zoomText').remove();
            if(isAndroid){
                $(".zoomText").bind("click touchstart", hideTooltip);
            }else{
                $("body").on("click", hideTooltip);
            }

            isTooltipOpen = true;
            e.stopPropagation();
            e.preventDefault();
        }
          $(".tooltipPointer").css("left", ($(".tooltipc").width() - $(".tooltipPointer").width()-10)/2);
          var Tootip_arialabel = $('.tooltip_text').text()
          Tootip_arialabel = Tootip_arialabel.replace(Tootip_arialabel.substring(Tootip_arialabel.length-1), "");
          $('.video').attr('tabindex',0).attr('aria-hidden',false);
          $('.tooltipc .dragspot_txt').removeAttr('aria-label').css('overflow','auto').removeAttr('role').removeAttr('tabindex');
          $('.tooltip_text .closeBtn').attr('data-id',$(this).attr('data-id')).attr('tabindex',0).attr('aria-label',Tootip_arialabel+", Close read more popup, Press this button.");
          
          setTimeout(function(){
            $('.tooltipc').find('.jwp-video').removeAttr('tabindex');
            $('.tooltip_text .closeBtn').addClass('keybord_outline').focus();
          },200);     
          $('.closeBtn').bind('click', hideTooltip);
          $('.closeBtn').bind('keydown', scrollpopup);
  }

function hideTooltip(e){    
    try{
        if(isAndroid){ 
            $('#dragspot-tooltip').remove();
            $(".zoomText").unbind().bind("click touchstart", showTooltip);
            isTooltipOpen = false;
        }else{
            if($(e.target).hasClass("closeBtn") || $(e.target).parent().hasClass("closeBtn")) {
                $('#dragspot-tooltip').remove();
                $("body").off("click", hideTooltip);
                isTooltipOpen = false;
             }
        }
        _this = $(this);
        setTimeout(function(){
           $('.zoomText[data-id="'+_this.attr('data-id')+'"]').addClass('keybord_outline').focus();
        },200);
        e.stopPropagation();
        e.preventDefault();
    }catch(e){}
          $('.video').attr('tabindex',-1).attr('aria-hidden',true);

}
function add3Dots(string, limit)
{
  var dots = "...";
  if(string.length > limit)
  {
    // you can also use substr instead of substring
    string = string.substring(0,limit) + dots;
  }
    return string;
}
function getRows(selector) {  
    var elementId = $(selector).attr('id');
    try{
    var height = (document.getElementById(elementId).scrollHeight - 20);
    }catch(e){}
    var line_height = $(selector).css('line-height');
    line_height = parseFloat(line_height)
    var rows = height / line_height;
    return Math.round(rows);
}

function buildPreservedState(index, questionId) {
    var ansStatus  = preservedJsonData[index].quesAnsStatus,
        selectedAns = preservedJsonData[index].selectedAns,
        noOfAttempts = preservedJsonData[index].noOfAttempts,
        vDndOptionsArray = preservedJsonData[index].dndOptionsArray,
        vEnteredShortAnsText = preservedJsonData[index].enteredShortAnsText,
        question = data.questionsList[questionId],
        allowedAttempts = question.allowedAttempts,
        answers = question.answers,
        $selectedOptWrapper = $('#answerWrap-'+ questionId).find('#option_'+ selectedAns),
        $radioInput = $("#question"+ questionId + '_' + selectedAns);    
    // dnd specific changes   
    if(question.isDraggable) {
        var isAllCorrect = true;
        $('#dragDropContainer-'+ questionId + ' .dropspot').each(function(i) {
            $(this).html(vDndOptionsArray[i]).attr('dropped',true);
            if($(this).find('.feedback').hasClass('correct')) {
                $(this).find('.feedback').attr('aria-label','correct');
                $(this).parent().css({'border': '2px solid #82C43E'});
                $(this).find('.dragspot .dragspot_txt').attr('aria-label', $(this).text().replace("Browser issues", " ")+", Dropped correctly.");
            }else{
                $(this).find('.feedback').attr('aria-label','incorrect');
                $(this).parent().css({'border': '2px solid #F32D2C'});
                isAllCorrect = false;
                $(".dragspot").draggable({ disabled: true });
                $(this).find('.dragspot .dragspot_txt').attr('aria-label', $(this).text().replace("Browser issues", " ")+", Dropped incorrectly.");
            }
        });
        if(isAllCorrect) {
            $('#question'+questionId).addClass('attempted');    
        }        
    }

    // Short Answer specific changes
    if(question.input){                
        if(question.verifyShortAnswer){
            // console.log(noOfAttempts)
            $('#question'+questionId+'_0').val(vEnteredShortAnsText).attr('disabled', 1).attr('aria-hidden',true);  
            $('#question'+questionId).find('.feedback').addClass('shortAnsfeedbacktick '+ ansStatus).attr('aria-label',ansStatus+' answer.'); 
            if(noOfAttempts >= allowedAttempts) {
                $('#question'+questionId+'_0').attr('disabled', 1).attr('aria-hidden',true);
                if(ansStatus == "incorrect"){
                    $('#shortAnswerfeedbackWrap-'+questionId).html('<h4><b>Here is the correct answer!</b></h4>' + question.answers[0].text).removeClass('hide');
                }                
            }
        }
        else{
            // $('#question'+questionId+'_0').val(vEnteredShortAnsText).attr('disabled', 1).attr('aria-hidden',true);
            // $('#shortAnswerfeedbackWrap-'+questionId).html('<h4><b>Here is the correct answer!</b></h4>' + question.answers[0].text).removeClass('hide');
        }   
    }

    $selectedOptWrapper.find('.feedback').addClass(ansStatus).removeAttr('aria-hidden');
    $radioInput.prop('checked', true);
    if(ansStatus == "incorrect") {
        $('.tickMark-'+ questionId).addClass('inCorrectTickMark');
        $('.ACIBtn span:eq('+(questionId)+')').addClass("inCorrectTickMark");
        $('.ACIBtn:eq('+(questionId)+')').addClass("adjustACIbtn");
        $('.ACIBtn:eq('+(questionId)+')').removeClass('disabled');
        // If incorrect answer and reached max allowed attempts, tickmark correct answer option
        if(noOfAttempts == allowedAttempts) {
            var trueAnswers = [];
            var lo = 0;
            for (var i in answers) {
                if (answers.hasOwnProperty(i)) {
                    var answer = answers[i];

                    if (answer.correct) {
                        trueAnswers.push(lo);
                    }
                }
                lo++;
            }
            for (var i = 0; i < trueAnswers.length; i++) {            
                $('#answerWrap-'+ questionId).find('#option_'+ trueAnswers[i]).find('.feedback').addClass('correct');
            }
        }
    }
    else {
        $('.tickMark-'+ questionId).addClass('correctTickMark');
        $('.ACIBtn span:eq('+(questionId)+')').addClass("correctTickMark");
        $('.ACIBtn:eq('+(questionId)+')').addClass("adjustACIbtn");
        $('.ACIBtn:eq('+(questionId)+')').removeClass('disabled');
        correctAnswersPool.push(questionId);        
    }
    if(noOfAttempts >= allowedAttempts) {
        // if number of attempts reached - disables submit and tryagain button
        $('#question'+questionId).addClass('attempted');        
        $('.questionslist div.questionWrapper').eq(questionId).find(".verifyAnsButton").addClass('hide');
        $('.questionslist div.questionWrapper').eq(questionId).find(".checkButton").addClass('hide');
        $('.questionslist div.questionWrapper').eq(questionId).find(".tryButton").addClass('hide');
    }
    else if(noOfAttempts < allowedAttempts) {
        $('.questionslist div.questionWrapper').eq(questionId).find(".verifyAnsButton").addClass('hide');
        $('.questionslist div.questionWrapper').eq(questionId).find(".checkButton").addClass('hide');
        if(ansStatus == "incorrect") {
            $('.questionslist div.questionWrapper').eq(questionId).find(".tryButton").removeClass('hide');
            $('.dragspot_txt:visible').off('touchend', showDropList).off('keydown', showDropList);
        }
    }
    $('#answerWrap-'+ questionId + ' .option').find('input[type="radio"]').attr('disabled', 1).attr('aria-hidden',true);
}


function closeFeedback(e) {
    $(e.target).parent().slideUp(10, function() {
        set_tabindex();
    });
}
function setupQuiz() {
    if (typeof data.questionsList == 'undefined' || !data.questionsList.length) {
        return false;
    }
    currentQuestion = 0;
    correctAnswersPool = [];
    correctMultiAnswersPool = [];
    var questionsList = data.questionsList;
    var totalQuestion = data.questionsList.length;
    $(".pull-right h5 span").text(totalQuestion);
    var count = 1;
    var quiz = $('.questionslist').html('');
    // var navList = $('#naviList');
    var nav = $('<ul></ul>');
    attemptQuestionList();
    // Loop through questions object
    for (var i in questionsList) {
        if (questionsList.hasOwnProperty(i)) {
            var question = questionsList[i];
            var image = '';
            var newClass = '';
            currentattempt[i] = 1;
            // var questionlabel;
            if (question.queImage) {
                if(question.queImageThumbnail){
                    newClass = 'thumbnail';
                }
                if (question.allowCaption) {
                    image = '<img class="img-responsive '+newClass+'" src="' + question.queImage + '" width="' + question.queImageWidth + '%" height="' + question.queImageHeight + '"/><div class="caption">' + question.captiontext + '</div>';
                } else {
                    image = '<img class="img-responsive '+newClass+'" src="' + question.queImage + '" width="' + question.queImageWidth + '%" height="' + question.queImageHeight + '"/>';
                }

            } else {
                image = '';
            }

            var questionHTML = $('<div class="questionWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 hide question' + (count - 1) + '" id="question' + (count - 1) + '" data-que="' + (count - 1) + '"><div class="quesSection" ></div></div>');
            
            if(question.isDraggable) {
                questionHTML.append('<div  class="question" id="questiontext'+ (count ) +' "><div class="directionHead"><span class="direction">Directions: </span><span class="">Drag and drop a solid box into a corresponding dotted box to match.</span></div><div class="number ">' + question.step + '</div><div class="text">'+ question.question + '</div>'+ image + '</div>');
            }
            else {
                if(questionsList[i].input){
                    questionHTML.append('<label for="question'+(parseInt(question.step)-1)+'_0" class="question" id="questiontext'+ (count ) +' "><div class="number">' + question.step + '</div><div class="text" id="questiontext'+ (count ) +' ">'+ question.question + '</div>' + image + '</label>');       
                }else{
                    var ifImg = $('<div></div>');
                    ifImg.append(question.question);
                    if(ifImg.find('.img-responsive').length){
                        ifImg.find('.img-responsive').removeClass('tabindex');
                         ifImg.find('.img-responsive').parent('p').addClass('text-center');

                        ifImg.find('.img-responsive').wrap(function() {
                          return "<button class='zoomImgBtn tabindex' aria-label='"+$(this).parent().parent().find('.fignum').text()+", To open image zoom popup, press this button.'></button>";
                        });
                    }
                    questionHTML.append('<div class="question" id="questiontext'+ (count ) +' "><div class="number">' + question.step + '</div><div class="text">'+ ifImg.html() + '</div>' + image + '</div>');     
                }
             
            }

            // Count the number of true values
            var truths = 0;
            for (i in question.answers) {
                if (question.answers.hasOwnProperty(i)) {
                    var answer = question.answers[i];
                    if (answer.correct) {
                        truths++;
                    }
                }
            }
            // Now let's append the answers with checkboxes or radios depending on truth count
            var answerHTML = $('<div id="answerWrap-'+ (count - 1) +'" class="answerWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>');

            // Get the answers
            var answers = question.answers;
            // prepare a name for the answer inputs based on the question
            var inputName = 'question' + (count - 1),
                inputType = (truths > 1 ? 'checkbox' : 'radio');
            var lo = 0;
            if (question.isDraggable) {
                // if draggable activity
               var dndContainer =  $('<div id="dragDropContainer-'+ (count - 1) +'" class="dragDropContainer"></div>');
               for (var i in answers) {                   
                    if (answers.hasOwnProperty(i)) {                    
                       var answer = answers[i]
                       if(answer.droppableContainerText != undefined){
                           var dropZone = $('<div class="dropZone"><p class="">'+ answer.droppableContainerText +'</p><div class="dropspot tabindex ui-droppable" dropped="false"  data-answer="'+i+'" aria-label="Empty Drop box">droppable area</div></div>');

                            // var ifImg = $('<div></div>');
                            // ifImg.append(dropZone);
                            if(dropZone.find('.img-responsive').length){
                                dropZone.find('.img-responsive').removeClass('tabindex');
                                dropZone.find('.img-responsive').wrap(function() {
                                  return "<button class='zoomImgBtn tabindex' aria-label='"+$(this).parent().parent().find('.fignum').text()+", To open image zoom popup, press this button.'></button>";
                                });
                            }
                           dndContainer.append(dropZone);
                        }
                    }
                    lo++;
                }
                answerHTML.append(dndContainer);
                answerContainer = $('<div>', {id: 'answer-container-' + (count - 1), class:'answer-container hide'});
                $('#dragabalsWrapper').append(answerContainer);
                createFrames(answers);               
                answerContainer.append(DragSet); 

                              
            }
            else {
                if (question.input) {
                    if (!question.allowAnsImages) {
                        for (var i in answers) {
                            if (answers.hasOwnProperty(i)) {
                                var answer = answers[i],
                                    optionId = inputName + '_' + i.toString();
                                var input = '';                                                                
                                if(question.verifyShortAnswer){
                                    input = '<div class="text"><textarea  aria-label="Enter Your Answer" placeholder="Enter Your Answer" class="tabindex textOpt form-control" id="' + optionId + '" name="' + inputName +
                                    '"></textarea></div>';
                                   
                                }
                                else{
                                    input = '<div class="text shortans"><textarea aria-label="Enter Your Answer" placeholder="Enter Your Answer" class="tabindex textOpt form-control" id="' + optionId + '" name="' + inputName +
                                    '"></textarea></div>';                 
                                }
                                                                               
                                var optionLabel = '';
                                var answerContentHtml = $('<div id="option_'+ (count-1) +'" class="option padAdjust col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>');
                                answerContentHtml.append('<div class="feedback"></div>' + input + optionLabel);
                                answerHTML.append(answerContentHtml);                               
                            }
                            lo++;
                        }
                    } else {
                        for (var i in answers) {
                            if (answers.hasOwnProperty(i)) {
                                var answer = answers[i],
                                    optionId = inputName + '_' + i.toString();
                                var calMargin = (40 / answer.ansImgHeight) * 100;
                                // If question has >1 true answers and is not a select any, use checkboxes; otherwise, radios
                                var input = '<div class="control  ' + inputType + '" style="margin-top:' + calMargin + 'px"><input class="tabindex opt" id="' + optionId + '" aria-label="'+inputType+' button" name="' + inputName +
                                    '" type="' + inputType + '" aria-label="'+inputType+' button" value="' + lo + '" /><span class="control-indicator"></span></div>';

                                var optionLabel = '<div class="img-text tabindex" for="' + optionId + '"><img class="img-responsive" src="' + answer.ansImg + '" alt="' + answer.text + '" width="' + answer.ansImgWidth + '" height="' + answer.ansImgHeight + '"/></div>';
                                var answerContentHtml = $('<div id="option_'+ i +'" class="option col-lg-12 col-md-12 col-sm-12 col-xs-12 padAdjust" ></div>');
                                answerContentHtml.append('<div class="feedback" style="margin-top:' + calMargin + 'px"></div>' + input + optionLabel);
                                answerHTML.append(answerContentHtml);
                            }
                            lo++;
                        }
                    }
                } else {
                    if (!question.allowAnsImages) {
                        var fieldset = $('<fieldset></fieldset>');
                        for (var i in answers) {
                            if (answers.hasOwnProperty(i)) {
                                var answer = answers[i],
                                optionId = inputName + '_' + i.toString();
                                var optionTextObj = $("<div></div>");
                                optionTextObj.append(answer.text);
                                optionTextObj = optionTextObj.text();

                                // If question has >1 true answers and is not a select any, use checkboxes; otherwise, radios
                                var aria_label = ", press here to select this option or press arrow keys to move to the other options."
                                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                                    
                                    aria_label = ', Press here to select this option.'
                                
                                }
                                //below code is for option aria label to replace  tag for aria label
                                var updateAriaOpt = answer.text.replace(/&#60;/gi, ' less than ');
                                updateAriaOpt = updateAriaOpt.replace(/<\/sup>|<\/sub>|<i>|<\/i>|<b>|<\/b>/gi, '');
                                updateAriaOpt = updateAriaOpt.replace(/<sub>/gi, ' subscript ');
                                updateAriaOpt = updateAriaOpt.replace(/<sup>/gi, ' superscript ');
                                updateAriaOpt = updateAriaOpt.replace(/&#160;/gi, '');
                                updateAriaOpt = updateAriaOpt.replace(/(<([^>]+)>)/ig,"");//for all remaining tag
                                
                                var input = '<div class="control ' + inputType + '"><input class="tabindex opt" id="' + optionId + '" name="' + inputName +
                                    '" type="' + inputType + '" value="' + lo + '" aria-label="'+updateAriaOpt+ aria_label+'"/><span class="control-indicator"></span></div>';

                                var optionLabel = '<label aria-hidden="true" class="text MCQ_T" for="' + optionId + '"><div>' + answer.text + '</div></label>';
                                var answerContentHtml = $('<div id="option_'+ i +'" class="option padAdjust col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>');                               
                                // console.log(answer.text)
                                answerContentHtml.append('<div class="feedback" aria-hidden="true"></div>' + input + optionLabel);
                                fieldset.append(answerContentHtml);

                                // var optionTickLable = answer.correct == true ? "correct option is "+optionTextObj : "incorrect option is "+optionTextObj;
                                 setTimeout(function(){
                                    $('.feedback').each(function(){
                                        var optionTickLable = $(this).parent().find('.text').text().replace(/^\s+|\s+$/gm,'').replace(/(\r\n|\n|\r)/gm,", ");
                                        if($(this).hasClass('correct')){
                                            $(this).attr('aria-label', 'correct option is '+optionTickLable);
                                        }else if($(this).hasClass('incorrect')){
                                            $(this).attr('aria-label', 'incorrect option is '+optionTickLable);
                                        }
                                    });
                                },500);
                                                             
                            }
                            lo++;
                        }
                        fieldset.prepend('<legend aria-hidden="true" style="opacity: 0;height: 0px;margin: 0px;padding: 0px;visibility: hidden;">options</legend>');
                        answerHTML.append(fieldset);
                        // answerHTML.attr('role','application')
                    } else {

                        for (var i in answers) {
                            if (answers.hasOwnProperty(i)) {

                                var answer = answers[i],
                                    optionId = inputName + '_' + i.toString();
                                var calMargin = (40 / answer.ansImgHeight) * 100;
                                // If question has >1 true answers and is not a select any, use checkboxes; otherwise, radios

                                var input = '<div class="control ' + inputType + '" style="margin-top:' + calMargin + 'px"><input class="tabindex opt" id="' + optionId + '" aria-label="'+inputType+' button" name="' + inputName +
                                    '" type="' + inputType + '" value="' + lo + '" /><span class="control-indicator"></span></div>';

                                var optionLabel = '<div class="img-text tabindex" for="' + optionId + '"><img class="img-responsive" src="' + answer.ansImg + '" alt="' + answer.text + '" width="' + answer.ansImgWidth + '" height="' + answer.ansImgHeight + '"/></div>';
                                var answerContentHtml = $('<div id="option_'+ i +'" class="option col-lg-12 col-md-12 col-sm-12 col-xs-12 padAdjust" ></div>');
                                answerContentHtml.append('<div class="feedback" style="margin-top:' + calMargin + 'px"></div>' + input + optionLabel);
                                answerHTML.append(answerContentHtml);
                            }
                            lo++;
                        }

                    }
                }
            }

            

            // Append answers to question
            questionHTML.append(answerHTML);
            var addClass = 'topAlign'; // Add class to feedback popup
            // if short answer acivity add feedback container in question wrapper div
            if(question.input){                
                addClass = ''
            }

            // Now let's append the correct / incorrect response messages
            var responseHTML = $('<div class="fbtext row hide topAlign fbtext-question' + (count - 1) +' '+addClass+ '" role="dialog"></div>');            

            responseHTML.append('<p tabindex="-1" class="FeedbackTextWrapper hide"></p><button aria-label="To minimize feedback, press this button." class="mini fbBtn posmini tabindex">-</button><button class="posClose fbBtn tabindex" aria-label="To Close Feedback, press this button.">&#215;</button>');  

            
            responseHTML.find(".posClose").on('click', function(){
          
               $('.questionWrapper .buttons .button:visible').focus();
            });
         
            questionHTML.append('<div class="clearfloat"></div>');
            
            if (count === nMaxPage) {
                if(question.isDraggable) {
                    // dnd activity buttons
                    questionHTML.append('<div class="buttons"><button  class="button btn btn-default checkButton tabindex" aria-hidden="true" aria-label="To submit your answer, press this button.">Submit</button></div>');
                    questionHTML.append('<div class="buttons"><button activity-type="dnd" aria-label="To show answer, press this button."  class="button btn btn-default showAnswerButton hide tabindex">Show Answer</button></div>');
                    questionHTML.append('<div class="buttons"><button  class="button btn btn-default tryButton hide tabindex" aria-label="To try again, press this button.">Try Again</button></div>');
                } else if(question.input){
                    if(question.verifyShortAnswer){
                        //Verify short answers activity buttons
                        questionHTML.append('<div class="buttons"><button  disabled="true" class="button btn btn-default verifyAnsButton tabindex" aria-label="To submit your answer, press this button.">Submit</button></div>');    
                        questionHTML.append('<div class="buttons"><button  class="button btn btn-default tryButton hide tabindex" aria-label="To try again, press this button.">Try Again</button></div>');
                        questionHTML.append('<div class="buttons"><button activity-type="shortans"  class="button btn btn-default showAnswerButton hide tabindex" style="width:134px" aria-label="To show answer, press this button.">Show Answer</button></div>');
                        var shortAnsFeedbackWrap = $('<div id="shortAnswerfeedbackWrap-'+ (count - 1) +'" class="shortAnswerfeedbackWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 hide"></div>');
                        questionHTML.append(shortAnsFeedbackWrap);
                    }
                    else{                        
                        //No verification short answer activity buttons
                        questionHTML.append('<div class="buttons"><button activity-type="shortans"  class="button btn btn-default showAnswerButton hide tabindex" style="width:134px" aria-label="To show answer, press this button.">Show Answer</button></div>');
                    }
                }
                else{
                    // mcq activity buttons
                    questionHTML.append('<div class="buttons"><button  class="button btn btn-default checkButton tabindex" aria-hidden="true" aria-label="To submit your answer, press this button.">Submit</button>' +
                    '<button  class="button btn btn-default tryButton hide tabindex" aria-label="To try again, press this button.">Try Again</button>' +
					'<button  class="showbutton tabindex" aria-label="To try again, press this button.">Show Answer</button></div>');

                }      

            } else {
                if(question.isDraggable) {
                    // dnd activity buttons
                    questionHTML.append('<div class="buttons"><button  class="button btn btn-default checkButton tabindex" aria-hidden="true" aria-label="To submit your answer, press this button.">Submit</button></div>');
                    questionHTML.append('<div class="buttons"><button activity-type="dnd"  class="button btn btn-default showAnswerButton hide tabindex" aria-label="To show answer, press this button.">Show Answer</button></div>');
                    questionHTML.append('<div class="buttons"><button  class="button btn btn-default tryButton hide tabindex" aria-label="To try again, press this button.">Try Again</button></div>');
                } else if(question.input){
                    if(question.verifyShortAnswer){
                        //Verify short answers activity buttons
                        questionHTML.append('<div class="buttons"><button  disabled="true" class="button btn btn-default verifyAnsButton tabindex" aria-label="To submit your answer, press this button.">Submit</button></div>');    
                        questionHTML.append('<div class="buttons"><button  class="button btn btn-default tryButton hide tabindex" aria-label="To try again, press this button.">Try Again</button></div>');
                        questionHTML.append('<div class="buttons"><button activity-type="shortans"  class="button btn btn-default showAnswerButton hide tabindex" style="width:134px" aria-label="To show answer, press this button.">Show Answer</button></div>');
                        var shortAnsFeedbackWrap = $('<div id="shortAnswerfeedbackWrap-'+ (count - 1) +'" class="shortAnswerfeedbackWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 hide"></div>');
                        questionHTML.append(shortAnsFeedbackWrap);
                    }
                    else{                        
                        //No verification short answer activity buttons
                        questionHTML.append('<div class="buttons"><button activity-type="shortans"  class="button btn btn-default showAnswerButton hide tabindex" style="width:134px" aria-label="To show answer, press this button.">Show Answer</button></div>');
                    }
                }
                else{
                    // mcq activity buttons
                    questionHTML.append('<div class="buttons"><button disabled="true" class="button btn btn-default checkButton tabindex" aria-hidden="true" aria-label="To submit your answer, press this button.">Submit</button>' +
                    '<button class="button btn btn-default tryButton hide tabindex" aria-label="To try again, press this button.">Try Again</button>' +
                    '<button class="showbutton tabindex" aria-label="To check the answer, press this button.">Show Answer</button></div>');
                }                        
             
            }


            // Append responses to question
            // questionHTML.append(responseHTML);
            // Add the navigation
            nav.append('<li><span id="navigate' + (count - 1) + '" class="dot"></span></li>');

            // Append question & answers to quiz
            quiz.append(questionHTML);
            quiz.append(responseHTML);

            $('.posmini').unbind('click').bind('click',function(){
                if($(this).parent().hasClass('height-20')){
                    $(this).html('+').attr('aria-label','To maximize feedback, press this button.').parent().removeClass("height-20");
                }else{
                    $(this).html('-').attr('aria-label','To minimize feedback, press this button.').parent().addClass("height-20");                    
                }
                var isIpad = /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if(isMac || isIpad){
                    var _this = this;
                    $(_this).parent().fadeOut(10,function(){
                        $(_this).parent().fadeIn(10);
                    });
                }
                setTimeout(function() {
                    $('.posmini:visible').addClass('keybord_outline').focus();
                }, 100);

            });

            $(document).off('click keypress','.zoomImgBtn').on('click keypress','.zoomImgBtn',function(e){
                if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32 && e.keyCode !=9){
                    return  false;
                }
                if(e.keyCode != 9){
                    var modal = document.getElementById('myModal');
                    var img = $(this);
                    var modalImg = document.getElementById("img01");
                    var captionText = document.getElementById("caption");                
                    modal.style.display = "block";
                    modalImg.src = $(this).find('img').attr('src');
                    var altText = $(this).parent().parent().find('.fignum').text()+" image zoom popup.";
                    $(modal).find('.image-modal-close').attr('aria-label', altText+' To close this pop up, press this button');
                    $(".task-container-col, .taskRow, .modal, .task-description-footer").attr('aria-hidden',true);
                    $("#myModal").removeAttr('aria-hidden'); 
                    setTimeout(function(){
                        $('.image-modal-close').removeAttr('aria-hidden').attr('tabindex',0).focus();
                    },1000)
                }
                
            });

            count++;
            addVideoTag1();
        }

    }

    nextClickFinalFeedback();

    function nextClickFinalFeedback() {
        $('.nextButton').click(function() {
            $(".task-container-col").css({
                "background-color": "#007ac3",
                "color": "#fff",
                "height": "250px",
                "border-bottom": "1px solid #fff"
            });
            $(".task-description-footer").hide().attr('aria-hidden',true);
            $(".task-container-col .pull-right").hide().attr('aria-hidden',true);
        });
    }
    navigationProcess();

    $('.questionslist input').off().on('change', function() {
        $('.questionWrapper .checkButton').removeAttr('disabled').css('pointer-events','auto').attr('tabindex',0).removeAttr('aria-hidden');
    });
    $('.questionWrapper .checkButton').unbind().bind('click', checkAnswer);
    $('.questionWrapper .verifyAnsButton').unbind().bind('click', verifyShortAns);
    $('.questionWrapper .textOpt').unbind().bind('input', displayShowAnsBtn); 
    $('.questionWrapper .showAnswerButton').unbind().bind('click', showAnswer);
    mainBox.find('.button').unbind().bind('click', startQuiz);
    $('.questionWrapper .tryButton').unbind().bind('click', tryAgain);
    createTickMarks();
    var beignariaLabel = $(".pull-left").find('h3').text() + ', '+$(".pull-left").find('.heading ').text()+', '+ $('.innerbox').text(); 
    beignariaLabel = beignariaLabel.trim();
    if(supportsTouch || isAndroid){
     $('.beginBtn').attr('aria-label', 'Begin button, press this button.');
    }else{
        $('.beginBtn').attr('aria-label', beignariaLabel +', Begin button, press this button.');
    }
    set_tabindex();
}

function displayShowAnsBtn(){
    var question = data.questionsList[currentQuestion];
    if(question.verifyShortAnswer){
        if($("#question"+currentQuestion).find("textarea").val().length > 0){
            $(this).parents('.questionWrapper').find('.verifyAnsButton').removeAttr('disabled').css('pointer-events',"auto").attr('tabindex',0).removeAttr('aria-hidden');
        }else{
            $(this).parents('.questionWrapper').find('.verifyAnsButton').attr('disabled',true).css('pointer-events',"none").attr('aria-hidden',true);
        }
    }
    else{
        var showAnswerBtn = $(this).parents('.questionWrapper').find('.showAnswerButton');
        // showAnswerBtn.removeClass('hide');
    }
     
}

function navigationProcess() {
        
  if($("#question"+(question-1)).find("video").attr("class") && $("#question"+(nCurrentQuesNo-1)).find("video").attr('src') ==undefined){
        try {
            var videos=$("#question"+(nCurrentQuesNo-1)).find(".jwp-video");
            isIE9 = ((navigator.userAgent.indexOf('Windows') != -1) && (navigator.userAgent.indexOf('Awesomium') != -1));
        for(var i = 0; i < videos.length; i++) {
            addVideoTag1(videos[i]);
            var str = $(videos[i]).parent().text();
                str = str.replace("Browser issues", "");
                $(videos[i]).attr('aria-label', str+', Press tab key to explore the video controls.')
        }        
        } catch(e) {
            console.log("video loading error",e);
        }
    }else if($("#question"+(nCurrentQuesNo-1)).find("video").attr('src') !=undefined){
        var videos=$("#question"+(nCurrentQuesNo-1)).find(".jwp-video");
        $('video').bind('play', function () {
            var curDataId = $(this).attr('data-id');
             for(var i = 0; i < videos.length; i++) {
                var DataId = $(videos[i]).attr('data-id');
                var str = $(videos[i]).parent().text();
                str = str.replace("Browser issues", "");
                $(videos[i]).attr('aria-label', str+', Press tab key to explore the video controls.')
                if(curDataId !=DataId){
                    // videos[i].currentTime = 0;
                    videos[i].pause();
                }                    
            }
        });
    }
    var count = 0;
    $('#naviList li').each(function() {
        (((count) == currentQuestion) ? $(this).find('span').addClass('dot-selected') : '');
        (((count) != currentQuestion && currentQuestion > (count)) ? $(this).find('span').addClass('dot-completed') : '')
        count++;
    })

    /*Code added for preserve data - update tickmark in pagination bar*/
    $('.mxpage-container li a.mxpage-default').each(function(){
        var qId = ($(this).attr("data-page") - 1);
        var vClass = $('.ACIBtn span:eq('+(qId)+')').attr('class');
        var $tickMarkWarpper = $('.tickMark-'+ qId);
        
        if(vClass == 'correctTickMark') {
            $tickMarkWarpper.addClass('correctTickMark');
        }
        else if(vClass == 'inCorrectTickMark') {
            $tickMarkWarpper.addClass('inCorrectTickMark');
        }
    })
    /* update tickmark code block end*/
    setCurrentAriaLable();
    if(question.verifyShortAnswer){
     $('.showAnswerButton').hide();
    }

}
function verifyShortAns(){
     answerInputs = $(this).parents('.questionWrapper').find('.answerWrapper textarea');
    if(!answerInputs.val().length) return;
    var question = data.questionsList[currentQuestion],
    answers = question.answers,
    allowedAttempts = question.allowedAttempts,
    correctResponse= false,
    disableInputs = true,
    feedBackClass = "incorrect",
    noOfAttempts = countAttempts,
    dndOptionsArray = new Array(),
    separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':','\\\''],
    vUserEnteredAns = $.trim(answerInputs.val());//.toLowerCase().split(new RegExp(separators.join('|'), 'g')),
    vActualAns =   answers[0].text.toLowerCase().split(new RegExp(separators.join('|'), 'g'));        
    
    if (vUserEnteredAns.toLowerCase() == answers[0].text.toLowerCase()) {
        correctResponse = true;        
    } else {
        correctResponse = false;
    }
    countAttempts = currentattempt[currentQuestion];
    if (correctResponse) {
        // countAttempts = 1;
        feedBackClass = "correct";        
        attemptedQues.push(currentQuestion);
        attemptedQuesStatus.push("correct");
        correctAnswersPool.push(currentQuestion);
    } else if (countAttempts < allowedAttempts) {
        $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").removeClass('hide');
        $('.dragspot_txt:visible').off('touchend', showDropList).off('keydown', showDropList);     
        attemptedQues.push(currentQuestion);
        attemptedQuesStatus.push("incorrect");
    }

    if (countAttempts >= allowedAttempts && !correctResponse) {      
        // countAttempts = 1;
        answerInputs.parents('.option').find('.feedback').addClass('shortAnsfeedbacktick '+ feedBackClass).attr('aria-label',feedBackClass+' answer.');

        queId = $(this).parents('.questionWrapper').attr('id');

        $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('<h4>That&#8217;s Incorrect! </h4>' + question.incorrectFeedbackText).removeClass('hide').parent().slideDown('slow', function() {
            set_tabindex();
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .fbBtn').focus();

        });
        if (disableInputs) $(this).parents('.questionWrapper').find('.answerWrapper textarea').attr('disabled', 1).attr('aria-hidden',true);       
        $(this).addClass('hide');
        $(this).parents('.questionWrapper').find('.showAnswerButton').removeClass('hide');
    } else {
        answerInputs.parents('.option').find('.feedback').addClass('shortAnsfeedbacktick '+ feedBackClass).attr('aria-label',feedBackClass+' answer.');
        queId = $(this).parents('.questionWrapper').attr('id');
        $(this).parents('.questionslist').find('.fbtext-' + queId).find('span').addClass('hide');

        if(feedBackClass == "correct") {            
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('<h4>That&#8217;s Correct! </h4>' + question.correctFeedbackText).removeClass('hide').parent().slideDown('slow', function() {
                set_tabindex();
                $(this).parents('.questionslist').find('.fbtext-' + queId + ' .fbBtn').focus();
               
            });
        }
        else {
            $(this).parents('.questionWrapper').find('.tryButton').removeClass('hide');            
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('<h4>That&#8217;s Incorrect! </h4>' + question.incorrectFeedbackText).removeClass('hide').parent().slideDown('slow', function() {
                set_tabindex();
                $(this).parents('.questionslist').find('.fbtext-' + queId + ' .fbBtn').focus();
              
            });
        }
        if (disableInputs) $(this).parents('.questionWrapper').find('.answerWrapper textarea').attr('disabled', 1).attr('aria-hidden',true);      
        $(this).addClass('hide');
    }

    // check and push data into preservedQuesStates array
    var currentQuestionsate = new CurrentQuestionsState(currentQuestion, feedBackClass, '', noOfAttempts, dndOptionsArray, answerInputs.val());
    for (var i = 0; i < preservedQuesStates.length; i++) {            
        if(preservedQuesStates[i].id == currentQuestion) {
            preservedQuesStates.splice(i, 1);
        }
    } 
    arrIncorrect=[];
    arrCorrect=[];    
    preservedQuesStates.push(currentQuestionsate);
    applyTickMarks(feedBackClass);

    var minimizeButton = $(this).parents('.questionslist').find('.fbtext-' + queId).find('.posmini:visible');
    setTimeout(function(){
        if(minimizeButton.parent().find('.FeedbackTextWrapper').height()>minimizeButton.parent().height()){
            $(minimizeButton).html('+').attr('aria-label','To maximize feedback, press this button.').removeAttr('disabled').removeAttr('aria-hidden').parent().removeClass("height-20");
        }else{
           $(minimizeButton).html('-').attr('aria-label','').attr('disabled','true').attr('aria-hidden',true).parent().addClass("height-20");
        }
        var isIpad = /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if(isMac || isIpad){
            var _this = minimizeButton;
            $(_this).parent().fadeOut(10,function(){
                $(_this).parent().fadeIn(10);
            });
        }
    },500);
     var ShortAnsFeedbacklabel = $('.FeedbackTextWrapper:visible').text();
    setTimeout(function() {
        $('.posClose:visible').attr('aria-label', ShortAnsFeedbacklabel+' To Close Feedback, press this button.').addClass('keybord_outline').focus();
    }, 700);
    queId = $(this).parents('.questionWrapper').attr('id');
        $(this).parents('.questionslist').find('.fbtext-' + queId).css('opacity',1).css('z-index',9999);

}

function checkInputAns() {
    var question = data.questionsList[currentQuestion],
        answerInputs = $(this).parents('.questionWrapper').find('.answerWrapper textarea'),
        answers = question.answers,
        allowedAttempts = question.allowedAttempts;

    if (answerInputs.val() == answers[0].text && answers[0].correct) {
        correctResponse = true;
    } else {
        correctResponse = false;
    }

    var disableInputs = true;
    if (correctResponse) {
        currentattempt[currentQuestion] = 1;
        countAttempts = currentattempt[currentQuestion];
        var feedBackClass = "correct";        
        attemptedQues.push(currentQuestion);
        attemptedQuesStatus.push("correct");
        correctAnswersPool.push(currentQuestion);
    } else if (countAttempts < allowedAttempts) {

        $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").removeClass('hide');
        $('.dragspot_txt:visible').off('touchend', showDropList).off('keydown', showDropList);
        var feedBackClass = "incorrect";
        attemptedQues.push(currentQuestion);
        attemptedQuesStatus.push("incorrect");
    } else {
        var feedBackClass = "incorrect";
    }

    if (countAttempts == 2) {  
        answerInputs.parents('.option').find('.feedback').addClass('correct');

        queId = $(this).parents('.questionWrapper').attr('id');

        $(this).parents('.questionslist').find('.fbtext-' + queId).find('span').addClass('hide')

        $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html(question.remFeedbackText).removeClass('hide').parent().slideDown('slow', function() {   
            set_tabindex();
            answerInputs.val(answers[0].text);
        });

        if (disableInputs) $(this).parents('.questionWrapper').find('.answerWrapper textarea').attr('disabled', 1).attr('aria-hidden',true);       
        $('.checkButton').addClass('hide');
    } else {

        answerInputs.parents('.option').find('.feedback').addClass(feedBackClass);

        queId = $(this).parents('.questionWrapper').attr('id');

        $(this).parents('.questionslist').find('.fbtext-' + queId).find('span').addClass('hide');        
        var feedbackText = '';
            if(typeof(question.answers[answerInputs.val()].feedbackText) != "undefined"){
                feedbackText = question.answers[answerInputs.val()].feedbackText;
            }
        if(feedBackClass == "correct") {            
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('<h4>That&#8217;s Correct! </h4>' + feedbackText).removeClass('hide').parent().slideDown('slow', function() {
                set_tabindex();
            });
        }
        else {            
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('<h4>That&#8217;s Incorrect! </h4>' + feedbackText).removeClass('hide').parent().slideDown('slow', function() {
                set_tabindex();
            });
        }
        if (disableInputs) $(this).parents('.questionWrapper').find('.answerWrapper textarea').attr('disabled', 1).attr('aria-hidden',true);
        $('.checkButton').addClass('hide');
    }

    arrIncorrect=[];
    arrCorrect=[]; 
    applyTickMarks(feedBackClass);    
}

function gotoQuestion(e) {
    var quesNum = $(e.target).attr("data-page");
    nCurrentQuesNo = quesNum;    
    $('.fbtext').removeAttr('style');
     // preservedQuesStates.push(currentQuestionsate);
    var activeQuestion = $('.questionslist div.questionWrapper').eq(currentQuestion);
    nextQuestion = $('.questionslist div.questionWrapper').eq(quesNum - 1);

    if (nextQuestion.length) {
        activeQuestion.fadeOut(300, function() {
            currentQuestion = quesNum - 1;
            correctMultiAnswersPool = [];
            navigationProcess();
            nextQuestion.fadeIn(500, set_tabindex);            
        });
        if(!reviewQuizEnabled) {
            handleShowHideDragTray(quesNum);         
        }
    } else {
        completeQuiz();
    }
}

function gotoQuestionUsingNav(quesNum) {
    $('.fbtext').removeAttr('style');

    var activeQuestion = $('.questionslist div.questionWrapper').eq(currentQuestion);
    nextQuestion = $('.questionslist div.questionWrapper').eq(quesNum - 1);
     // preservedQuesStates.push(currentQuestionsate);

    if (nextQuestion.length) {
        activeQuestion.fadeOut(300, function() {
            currentQuestion = quesNum - 1;
            correctMultiAnswersPool = [];
            navigationProcess();
            nextQuestion.fadeIn(500, set_tabindex);
        });
    } else {
        completeQuiz();
    }
             
}

function CurrentQuestionsState (id, quesAnsStatus, selectedAns, noOfAttempts, dndOptionsArray, enteredShortAnsText) {
    this.id = id;
    this.quesAnsStatus = quesAnsStatus;
    this.selectedAns = selectedAns;
    this.noOfAttempts = noOfAttempts;
    this.dndOptionsArray = dndOptionsArray;
    this.enteredShortAnsText = enteredShortAnsText;
}

function checkAnswer(e) {
    //APT: Function gets called on Submit Button.
    var answerInputs = $(this).parents('.questionWrapper').find('.answerWrapper input:checked');
    $('.drag-tray .answer-container:visible').find('.dragspot .dragspot_txt').off('keydown', showDropList);
    var question = data.questionsList[currentQuestion];
    if(!answerInputs.length && !question.isDraggable) return; // If user not select any option

    var answers = question.answers;
    attemptedQues.push(currentQuestion);
    var dndOptionsArray = new Array();   
    $('.questionslist div.questionWrapper').eq(currentQuestion).find(".checkButton").addClass('hide');
    countAttempts = currentattempt[currentQuestion];
    var noOfAttempts = countAttempts;
    allowedAttempts = question.allowedAttempts;
    var feedBackClass = '';

    if(question.isDraggable) {
        // DND check answer code
        $('.drag-tray .answer-container:visible').find('.dragspot').off('touchend', showDropList);
        var allCorrect = true;
        $('#dragDropContainer-'+ currentQuestion + ' .dropspot').each(function(i) {
            
            if($(this).attr('data-answer') == $(this).find('.dragspot').attr('data-answer')) {
                $(this).find('.feedback').addClass('correct').attr('aria-label','correct');
                $(this).parent().css({'border': '2px solid #82C43E'});
                $(this).find('.dragspot .dragspot_txt').attr('aria-label',$(this).text().replace("Browser issues", " ")+", Dropped correctly.");
            }else{
                allCorrect = false;
                $(this).find('.feedback').addClass('incorrect').attr('aria-label','incorrect');
                   $(".dragspot").draggable({ disabled: true });
                $(this).parent().css({'border': '2px solid #F32D2C'});
                $(this).find('.dragspot .dragspot_txt').attr('aria-label', $(this).text().replace("Browser issues", " ")+", Dropped incorrectly.");
            }
            dndOptionsArray.push($(this).find('.dragspot').parent().html());
        });

        if(allCorrect) {
            // countAttempts = 1;
            feedBackClass = 'correct';
            correctAnswersPool.push(currentQuestion);
        } else if (countAttempts < allowedAttempts) {

            $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").removeClass('hide').addClass('keybord_outline').attr('tabindex',0).focus();
            $('.dragspot_txt:visible').off('touchend', showDropList).off('keydown', showDropList);

            feedBackClass = "incorrect";   

        } else {
            feedBackClass = "incorrect";
        }
        queId = Cur_qus = $(this).parents('.questionWrapper').attr('id');
        if (countAttempts >= allowedAttempts) {
            feedBackClass = "incorrect";
            $('.questionslist div.questionWrapper').eq(currentQuestion).find(".checkButton").addClass('hide');
            $('.questionslist div.questionWrapper').eq(currentQuestion).find(".showAnswerButton").removeClass('hide').css({'width':'134px'}).addClass('keybord_outline').attr('tabindex',0).focus();
             $(".dragspot").draggable({ disabled: true });
            $('.dragspot_txt:visible').off('touchend', showDropList).off('keydown', showDropList);
             $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('').html(question.feedBackText.remFeedback).removeClass('hide').parent().slideDown('slow', function() {   
                set_tabindex();
                $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").addClass('hide');
            });
        }else{   
            var feedbackText='';
            if(feedBackClass == "correct") {
                $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('').html('<h4>That&#8217;s Correct! </h4>' + question.feedBackText.datacorrect).removeClass('hide').parent().slideDown('slow', function() {
                    set_tabindex();
                    $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").addClass('hide');
                    var maxheight = $('.questionslist').outerHeight(true) + $('.drag-tray:visible').outerHeight(true);
                    $('.drag-tray').css('display','none');
                    $('.questionslist').css('height',maxheight+'px');
                });
            } else {
                $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('').html('<h4>That&#8217;s Incorrect! </h4>' + question.feedBackText.incorrect).removeClass('hide').parent().slideDown('slow', function() {
                    set_tabindex();
                });
            }
        }        
    }
    else {
        // MCQ check answer code
        // Collect the true answers needed for a correct response       

        var trueAnswers = [];
        var lo = 0;
        for (var i in answers) {
            if (answers.hasOwnProperty(i)) {
                var answer = answers[i];

                if (answer.correct) {
                    trueAnswers.push(lo);
                }
            }
            lo++;
        }   
        var isMultipleAns = (trueAnswers.length > 1);    
        // NOTE: Collecting .text() for comparison aims to ensure that HTML entities
        // and HTML elements that may be modified by the browser match up

        // Verify all/any true answers (and no false ones) were submitted
        if (isMultipleAns) {
            var selectedAnswers = [];
            answerInputs.each(function() {
                selectedAnswers.push(parseInt(this.value));
            });
        } else {
            var selectedAnswers = [parseInt(answerInputs.val())];
        }
        
        var correctResponse = compareAnswers(trueAnswers, selectedAnswers, isMultipleAns);
        var disableInputs = true;
        $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").removeClass('hide');
        $('.dragspot_txt:visible').off('touchend', showDropList).off('keydown', showDropList);
        if (correctResponse) {
            countAttempts = 1;
            feedBackClass = "correct";       
            if (!isMultipleAns) {
                correctAnswersPool.push(currentQuestion);
            } else {
                correctMultiAnswersPool = selectedAnswers;
                if (trueAnswers.length != selectedAnswers.length) {
                    disableInputs = false;
                } else {
                    correctAnswersPool.push(currentQuestion);
                }
            }
        } else if (countAttempts < allowedAttempts) {

            feedBackClass = "incorrect";   

        } else {
            feedBackClass = "incorrect";
        }
        var Cur_qus;               
        if (countAttempts >= 2) {       
            // countAttempts = 1;
            for (var i = 0; i < trueAnswers.length; i++) {
                $('.answerWrapper:visible .option:eq(' + trueAnswers[i] + ')').find('.feedback').addClass('correct');
            }
            answerInputs.parents('.option').find('.feedback').addClass(feedBackClass);

            queId = Cur_qus = $(this).parents('.questionWrapper').attr('id');

            $(this).parents('.questionslist').find('.fbtext-' + queId).find('span').addClass('hide');
            
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('').html(question.remFeedbackText).removeClass('hide').parent().slideDown('slow', function() {   
                set_tabindex();
                // $(this).parents('.questionslist').find('.fbtext-' + queId + ' .fbBtn').focus();
                 $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").addClass('hide');
            });

            if (disableInputs) $(this).parents('.questionWrapper').find('.answerWrapper input').attr('disabled', 1).attr('aria-hidden',true);
            $('.questionslist div.questionWrapper').eq(currentQuestion).find(".checkButton").addClass('hide');

        } else {
            queId = Cur_qus = $(this).parents('.questionWrapper').attr('id');

            answerInputs.parents('.option').find('.feedback').addClass(feedBackClass).removeAttr('aria-hidden');

            $(this).parents('.questionslist').find('.fbtext-' + queId).find('span').addClass('hide')
            var feedbackText = '';
            if(typeof(question.answers[answerInputs.val()].feedbackText) != 'undefined'){
                feedbackText = question.answers[answerInputs.val()].feedbackText;
            }
            if(feedBackClass == "correct") {
                $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('').html('<h4>That&#8217;s Correct! </h4>' + feedbackText).removeClass('hide').parent().slideDown('slow', function() {
                    set_tabindex();
                    // $(this).parents('.questionslist').find('.fbtext-' + queId + ' .fbBtn').focus();
                     $('.questionslist div.questionWrapper').eq(currentQuestion).find(".tryButton").addClass('hide');
                });
            }
            else {
                $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').html('').html('<h4>That&#8217;s Incorrect! </h4>' + feedbackText).removeClass('hide').parent().slideDown('slow', function() {
                    set_tabindex();
                    // $(this).parents('.questionslist').find('.fbtext-' + queId + ' .fbBtn').focus();
                });

            }
          
            if (disableInputs) $(this).parents('.questionWrapper').find('.answerWrapper input').attr('disabled', 1).attr('aria-hidden',true);
            $('.questionslist div.questionWrapper').eq(currentQuestion).find(".checkButton").addClass('hide');
        }         
        
    }
    
    // check and push data into preservedQuesStates array
    var currentQuestionsate = new CurrentQuestionsState(currentQuestion, feedBackClass, answerInputs.val(), noOfAttempts, dndOptionsArray, '');
    for (var i = 0; i < preservedQuesStates.length; i++) {            
        if(preservedQuesStates[i].id == currentQuestion) {
            preservedQuesStates.splice(i, 1);
        }
    }  
    arrIncorrect=[];
    arrCorrect=[]; 
    preservedQuesStates.push(currentQuestionsate);
    applyTickMarks(feedBackClass);
    queId = Cur_qus
    var minimizeButton = $(this).parents('.questionslist').find('.fbtext-' + queId).find('.posmini:visible');
    setTimeout(function(){
        if(minimizeButton.parent().find('.FeedbackTextWrapper').height()>minimizeButton.parent().height()){
            $(minimizeButton).html('+').attr('aria-label','To maximize feedback, press this button.').removeAttr('disabled').removeAttr('aria-hidden').parent().removeClass("height-20");
        }else{
           $(minimizeButton).html('-').attr('aria-label','').attr('disabled','true').attr('aria-hidden',true).parent().addClass("height-20");
        }
        var isIpad = /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if(isMac || isIpad){
            var _this = minimizeButton;
            $(_this).parent().fadeOut(10,function(){
                $(_this).parent().fadeIn(10);
            });
        }
    },500)
        var popuptext = $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').text();
        $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').attr("aria-label", popuptext); 

        var elemant = $('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').show();
        var isIphone = /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var timeout = 500;
        if(isIphone){
           timeout = 1500;
        }else{
           timeout = 500;
        }




        setTimeout(function(){
            elemant.attr('tabindex','-1').attr('role','list').focus();            
            // $('.questionslist').find('.fbtext-' + queId + ' .fbBtn').addClass('keybord_outline').focus();
            $('.feedback').each(function(){
                var optionTickLable = $(this).parent().find('.text').text().replace(/^\s+|\s+$/gm,'').replace(/(\r\n|\n|\r)/gm,", ");
                if($(this).hasClass('correct')){
                    $(this).attr('aria-label', 'correct option is '+optionTickLable);
                }else if($(this).hasClass('incorrect')){
                    $(this).attr('aria-label', 'incorrect option is '+optionTickLable);
                }
            });
        },timeout);

        if($(".fbtext").find('.img-responsive').length){
                        $(".fbtext").find('.img-responsive').removeClass('tabindex');
                         $(".fbtext").find('.img-responsive').parent('p').addClass('text-center');

                        $(".fbtext").find('.img-responsive').wrap(function() {
                          return "<button class='zoomImgBtn tabindex' aria-label='"+$(this).parent().parent().find('.fignum').text()+", To open image zoom popup, press this button.'></button>";
                        });
                    }

        $('.zoomImgBtn').unbind('click keypress').bind('click keypress',feedBackPopupImgFun);             
        e.preventDefault();
        e.stopPropagation();        
        addVideoTag1();
        return false;
}

function feedBackPopupImgFun(e){
     if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){
            return  true;
        }
        var modal = document.getElementById('myModal');
        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = $(this);
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        
        modal.style.display = "block";
        modalImg.src = $(this).find('img').attr('src');
        setTimeout(function(){
            reset_tabindex();
            $('[tabindex],a').attr('tabindex','-1').attr('aria-hidden',true);
            var vtabindex = 0;
            $('.modal:visible').find('.tabindex:visible').each(function(){
                $(this).attr('tabindex',vtabindex).removeAttr('aria-hidden');
            });
        },800);
        $(".task-container-col, .taskRow, .modal, .task-description-footer").attr('aria-hidden',true);
        $("#myModal").removeAttr('aria-hidden');
        var _this = $(this);
        $('.image-modal-close').unbind('click').bind('click',function(){            
            $('#myModal').hide();
            set_tabindex();
            _this.addClass('keybord_outline').focus();
            $(".task-container-col, .taskRow, .modal, .task-description-footer").removeAttr('aria-hidden');
        });
}
// show Ans applys only for dnd and short Answer activity
function showAnswer() {
    var question = data.questionsList[currentQuestion],
        activityType = $(this).attr('activity-type');
    $(this).addClass('hide').attr('disabled');
    if(activityType == 'dnd'){
    // dnd block
        $('#dragDropContainer-'+ currentQuestion + ' .dropspot').each(function(i) {
            var currentObject = $(this);
            currentObject.html('');
            currentObject.parent().removeAttr('style');
            var vHtml = '<div class="dragspot ui-draggable ui-draggable-handle correct correct-answer" data-answer="'+i+'" id="dragspot_'+i+'" style="z-index: 1; left: 0px; top: 0px; position: relative;" aria-dropeffect="copy" aria-grabbed="true"><div class="dragspot_txt tabindex" tabindex="0" role="button">'+question.answers[i].draggableText+'</div></div><div class="feedback correct"></div>';
            currentObject.html(vHtml);
            currentObject.parent().css({'border': '2px solid #82C43E'});     
        });
        // countAttempts = 1;
        $('#question'+(currentQuestion)).addClass('attempted')
        if($('#question'+(currentQuestion)).hasClass('attempted')){
           var maxheight = $('.questionslist').outerHeight(true) + $('.drag-tray:visible').outerHeight(true);
           $('.drag-tray').hide();
           $('.questionslist').css('height',maxheight+'px');
       }
       $('.questionslist').find('.fbtext').removeAttr('style');
    }
    else if(activityType == 'shortans'){
        // short answers block
        var answerInputs = $(this).parents('.questionWrapper').find('.answerWrapper textarea'),
        feedBackClass = "correct",
        noOfAttempts = 1,
        dndOptionsArray =  new Array();
        queId = $(this).parents('.questionWrapper').attr('id');  
        answerInputs.attr('disabled', 1).attr('aria-hidden',true);       
        $(this).parents('.questionWrapper').find('.shortAnswerfeedbackWrap').html('<h4><b>Here is the correct answer!</b></h4>' + question.answers[0].text).removeClass('hide');
         var shortcorrectAnsLabel = $('.shortAnswerfeedbackWrap:visible').text();    
        $('.shortAnswerfeedbackWrap').attr('aria-label',shortcorrectAnsLabel);  
        if(!question.verifyShortAnswer){            
            correctAnswersPool.push(currentQuestion);        
            var currentQuestionsate = new CurrentQuestionsState(currentQuestion, feedBackClass, '', noOfAttempts, dndOptionsArray, answerInputs.val());
            for (var i = 0; i < preservedQuesStates.length; i++) {            
                if(preservedQuesStates[i].id == currentQuestion) {
                    preservedQuesStates.splice(i, 1);
                }
            }  
            arrIncorrect=[];
            arrCorrect=[];   
            preservedQuesStates.push(currentQuestionsate);
            applyTickMarks(feedBackClass);    
        } 
        else{
            $(this).parents('.questionslist').find('.fbtext-' + queId + ' .FeedbackTextWrapper').addClass('hide').parent().slideUp('slow', function() {
                set_tabindex();
            });
        }
        setTimeout(function(){
            $('.shortAnswerfeedbackWrap:visible').attr('tabindex',-1).addClass('keybord_outline').focus();
        },700)
    }   
    addVideoTag1();
}

// try again

function tryAgain() {

    var question = data.questionsList[currentQuestion];

    var activeQuestion = $('.questionslist div.questionWrapper').eq(currentQuestion);
    thisQuestion = $('.questionslist div.questionWrapper').eq(currentQuestion);  
    if(question.isDraggable) {
        // DND try again code
        $('#dragDropContainer-'+ currentQuestion + ' .dropspot').each(function(i) {
            var currentObject = $(this);
            if(currentObject.find('.feedback').hasClass('incorrect')){
                currentObject.html('');
                currentObject.attr('dropped', false);
                currentObject.parent().removeAttr('style');             
            }else{
                currentObject.attr('dropped', true);
               currentObject.draggable({ disabled: true });
            }   
            
        });
        $('#question'+currentQuestion+' .tryButton').addClass('hide');
        $('#question'+currentQuestion+' .checkButton').removeClass('hide').addClass('disabled').css({'pointer-events': 'none'}).attr('aria-hidden',true);
        var curtQuesNum = $('.questionWrapper:visible').attr('data-que');
        var all_dropped = true;
        $('#dragDropContainer-'+(curtQuesNum)+' .dropspot').each(function(){
            if($(this).attr("dropped") != 'true')
            all_dropped = false;
        });
        if(all_dropped == true){
            $('.droppable .dragspot').unbind('keydown touchend');
        }else{
            $('.drag-tray').css('display','block');
            $('.drag-tray .answer-container:visible .dragspot_txt').unbind('keydown').bind('keydown', showDropList);
            $('.drag-tray .answer-container:visible').find('.dragspot').off('touchend', showDropList).on('touchend', showDropList);
            $("#answer-container-"+(curtQuesNum)+" .dragspotWrapper .dragspot" ).each(function(){
                $(this).find('.dragspot_txt').attr('aria-label',$(this).text().replace("Browser issues", "")+", Press this to open the list of Drop Areas.")
            });
        }
        $('.questionslist').find('.fbtext').removeAttr('style');       
    }
    else {
        // MCQ try again code
        if (thisQuestion.length) {
            activeQuestion.fadeOut(300, function() {
                correctMultiAnswersPool = [];
                navigationProcess();
                $('#question'+currentQuestion+' .tryButton').addClass('hide');
                $('#question'+currentQuestion+' .checkButton').removeClass('hide').attr('disabled',true).css({'pointer-events': 'none'}).attr('aria-hidden',true);
                $('#question'+currentQuestion+' .verifyAnsButton').removeClass('hide');
                thisQuestion.fadeIn(500, set_tabindex);
            });
        }
        $('#question'+currentQuestion+' .option').find('.feedback').removeClass("incorrect");
        $('#question'+currentQuestion+' .option').find('.feedback').removeClass("correct");
        $('.questionslist').find('.fbtext').find('span').addClass('hide')
        $('.questionslist').find('.fbtext').removeAttr('style');
        $('.questionslist').find('.fbtext .incorrectFeedback').addClass('hide');
        $('.FeedbackTextWrapper').html('');
        $('#question'+currentQuestion+' .answerWrapper input').removeAttr('disabled').removeAttr('aria-hidden');
        $('#question'+currentQuestion+' .answerWrapper textarea').removeAttr('disabled').removeAttr('aria-hidden');
        if($('.answerWrapper textarea:visible').length>0){
            document.getElementById($('.answerWrapper textarea:visible').attr('id')).value = "";
        }        
        $('#question'+currentQuestion+' .answerWrapper input').removeAttr('checked');

    }
    countAttempts++;
    currentattempt[currentQuestion] = currentattempt[currentQuestion] + 1;

    $('.dropspot:visible[dropped="false"]').addClass('tabindex');
    set_tabindex();
    setTimeout(function(){
        if($("textarea.textOpt:visible").length){
         $("textarea.textOpt:visible").first().focus();
        }else if($("input.opt:visible").length){
          $("input.opt:visible").first().focus();

        }        
    },200);
    try{
        if($("textarea:visible").val().length > 0){
            activeQuestion.find('.verifyAnsButton').removeAttr('disabled').css('pointer-events',"auto").removeAttr('aria-hidden');
        }else{
            activeQuestion.find('.verifyAnsButton').attr('disabled',true).css('pointer-events',"none").attr('aria-hidden',true);
        }
    }catch(e){

    }
    $('.questionWrapper').each(function(){
        var CurrentQuestion = $(this).attr('id').split('question')[1];
        if(! $(this).find('.tryButton').hasClass('hide')){
            $('#answer-container-'+CurrentQuestion).find('.dragspot').draggable({disabled: true});  
        }else{
            $('#answer-container-'+CurrentQuestion).find('.dragspot').draggable('enable');
        }  
    })    
}

function completeQuiz() {

    var score = correctAnswersPool.length,
    resultWrapper = $('.resultWrapper'),
    percent = parseInt((score / data.questionsList.length) * 100),
    myStat = $('<div id="mystat" data-dimension="120" data-text="' + percent + '%" data-info="" data-width="10" data-fontsize="30" data-percent="' + percent + '" data-fgcolor="#007ac3" data-bgcolor="rgb(160, 210, 239)" role="progressbar" aria-valuenow="'+percent+'" aria-valuemin="0" aria-valuetext="Your score is '+percent+' percent." aria-valuemax="100"></div>');

    resultWrapper.find('#catext').text(score);
    resultWrapper.find('#tqtext').text(data.questionsList.length);
    $('.questionslist').fadeOut(300, function() {
        $('div.footer').addClass('hide');
        resultWrapper.find('.innerbox').html(data.resultContent);
        resultWrapper.find('.resetButton').text(data.retultResetButtonText).click(retakeQuiz);
        resultWrapper.find('.resetButton2').text(data.retultResetButtonText2).click(resetQuiz);
        resultWrapper.fadeIn(500, set_tabindex);
        resultWrapper.find('.graphic').html(myStat);
        resultWrapper.find('#mystat').circliful();
        var resultariaLabel = $('.pull-left h3').text()+', '+$('.resultCmpQuiz').text().trim()+' Quiz result '+$('.circle-text').text()+', '+$('.resultWrapper .innerbox').text();
        resultariaLabel = resultariaLabel.replace(/^\s+|\s+$/gm,'').replace(/(\r\n|\n|\r)/gm," ")
        $('#chapter_heading').addClass('keybord_outline').attr('tabindex',-1).attr('aria-label', resultariaLabel);        
    });
    
    $(".task-container-col").css({
        "background-color": "#007ac3",
        "color": "#fff",
        "height": "250px",
        "border-bottom": "1px solid #fff",
        "padding-top": "0px"
    });
    $(".task-description-footer").hide().attr('aria-hidden',true);
    $(".pull-right").hide().attr('aria-hidden',true);
    $(".graphic").show();

    $(".progress-bar").width("0.2%");
    $(".pull-left h3").css({
        
        "font-family": "FiraSans-Light"
    });
    setTimeout(function(){
        $('#chapter_heading').focus();    
    },500)    
}

function retakeQuiz(e) {
     try{
    localStorage.removeItem(data.testTitle);
        }catch(e){
        
    }
    preservedQuesStates.length = 0;
    countAttempts = 1;
    totalAttemptCount = 0;
    reviewQuizEnabled = false;

    $('.resultWrapper').fadeOut(300, function() {
        $('#dragabalsWrapper').html('');
        setupQuiz();
		addShowAnswerFunctionality();
		$('.answerWrapper,.tryButton,.checkButton,.showAnswerButton,.control,.opt,.dragspot,.leftArrow,.rightArrow').css("pointer-events", "");
        nCurrentQuesNo = 1;        
        $('.mxpage-front').trigger('click');        
        $('.mainBox').addClass('hide');

        startQuiz('retake');
        $(".progress-bar").width("0.2%");        
        set_tabindex();
        arrIncorrect.length = 0;
        arrCorrect.length = 0;
        $('.mxpage-default + span').removeClass('inCorrectTickMark');
        $('.mxpage-default + span').removeClass('correctTickMark');
        $('#blueNo').text('0');
        $('#greenNo').text('0');
        $('#redNo').text('0');
        $('.rightArrowEnable').removeAttr('disabled');

    })

        setCurrentAriaLable();
        addVideoTag1();
        setProgress();
}


function resetQuiz() {
    reviewQuizEnabled = true;

    $('.resultWrapper').fadeOut(300, function() {
        $('.answer-container').hide();
        $('.drag-tray').hide();
        $('.answerWrapper input,.answerWrapper textarea').attr('disabled', 1).attr('aria-hidden',true);
        $('.mainBox').addClass('hide');
        $('.answerWrapper,.tryButton,.checkButton,.showAnswerButton,.control,.opt,.dragspot,.leftArrow,.rightArrow').css("pointer-events", "none").attr("disabled",true);
        $('.checkButton, .verifyAnsButton,.showAnswerButton,.tryButton').css('display','none');
        var tempQue = nCurrentQuesNo;
        nCurrentQuesNo = 1;
        $('.footer').removeClass('hide');
        $('.questionslist').fadeIn('slow').css("display", "inline-block");
        $(".mxpage-previous").css("pointer-events", "none").attr('aria-hidden',true);
        $(".task-description-footer").show().removeAttr('aria-hidden');
        $(".pull-right").show().removeAttr('aria-hidden');
        $(".task-container-col").css({
            "background-color": "#ffffff",
            "color": "#000",            
            "border-bottom": "1px solid #888",
            "padding-top": "0px"
        });
        $(".pull-left h3").css({
            "font-size": "22px",
            "font-family": "FiraSans-Regular"
        });
        gotoQuestionUsingNav(1);
        $('.mxpage-front').trigger('click');
        $('.text').css('pointer-events',"auto");
        set_tabindex();
        setProgress();
    })

    $('.heading').css('display',"none");
    $(".task-container-col").css({
        "background-color": "#007ac3",
        "color": "#fff",
        "height": "250px",
        "border-bottom": "1px solid #fff",
        "padding-top": "0px"
    });
    $(".task-description-footer").hide().attr('aria-hidden',true);
    $(".pull-right").hide().attr('aria-hidden',true);
    $(".progress-bar").width("0.2%");
    $(".pull-left h3").css({
        
        "font-family": "FiraSans-Light"
    });
    // $('[tabindex]').first().focus();
     addVideoTag1();
     
}

function startQuiz(para) {
    $('.heading').css('display',"none");
    $(".mxpage-previous").css("pointer-events", "none").attr('aria-hidden',true);    
    $(".pull-right").fadeIn(200).removeAttr('aria-hidden');
    $(".task-description-footer").fadeIn(200).removeAttr('aria-hidden');
    $(".task-container-col").css({
        "background-color": "#ffffff",
        "color": "#000",        
        "border-bottom": "1px solid #888",
        "padding-top": "0px"
    });
    $(".pull-left h3").css({
        "font-size": "22px",
        "font-family": "FiraSans-Regular"
    });
    // Starts the quiz (hides mainbox and displays first question)
    //Hide main box
    $('.iconBlue').html('<img src="../quiz_package/images/icon-blue.svg" alt=""/>').css('color','transparent');
    $('.mainBox').addClass('hide');
    $('.iconBlue').unbind().bind("click",function(e){
        if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){    
            return  false; 
        }
        var hederAriaLabel= $('.header').text().replace(/^\s+|\s+$/gm,'').replace(/(\r\n|\n|\r)/gm,", ");
        $('.ACIBtn').each(function(){
            if($(this).find('.inCorrectTickMark').length>0){
                $(this).attr('aria-label','Question '+$(this).text().replace("Browser issues", " ")+', Attempted incorrectly, Press this button to goto question '+$(this).text()+'.');
            }else if($(this).find('.correctTickMark').length>0){
                $(this).attr('aria-label','Question '+$(this).text().replace("Browser issues", " ")+', Attempted correctly, Press this button to goto question '+$(this).text()+'.');
            }else{
                $(this).attr('aria-label','Question '+$(this).text().replace("Browser issues", " ")+', Not attempted, Press this button to goto question '+$(this).text()+'.');
            }
        })
        $('#confirmOverlay').css('display','block');
        $('[tabindex]').each(function(){
            $(this).attr('data-tabindex', $(this).attr('tabindex')).attr('tabindex',-1).attr('aria-hidden',true);
        });        
        $(".correctIncorrectFeedback .ACIBtn").attr('tabindex',0).removeAttr('aria-hidden').removeAttr('style').removeClass('disabled');
        $(".correctIncorrectFeedback .ACIBtn:nth-child("+nCurrentQuesNo+")").attr('tabindex',-1).attr('aria-hidden',true).css('pointer-events','none').addClass('disabled');
        $(".taskRow, .task-description-footer, .modal,.pull-right .activityProgress, .pull-right .iconBlue").attr('aria-hidden',true);
        $(this).attr('aria-hidden',true);
        $('.closeBtn').attr('aria-label', hederAriaLabel+". To close the quiz status popup, press this button. Press tab key to check all questions status.");
        if(supportsTouch || isAndroid){
            $('.closeBtn').attr('aria-label', hederAriaLabel+". To close the quiz status popup, press this button.");
        }
        setTimeout(function() {
        $('.closeBtn').attr('tabindex',0).addClass('keybord_outline').focus();
        }, 500);
     });
    $('.closeBtn').on("click",function(e){
        if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){    
            return  false; 
        }
         $('#confirmOverlay').css('display','none');
         $(".taskRow, .task-description-footer, .modal,.pull-right .activityProgress, .pull-right .iconBlue").removeAttr('aria-hidden');
         set_tabindex();
         setTimeout(function() {
        set_tabindex();
         $('.iconBlue').addClass('keybord_outline').focus();
         }, 500);
         $('[data-tabindex]').each(function(){
            $(this).attr('tabindex', $(this).attr('data-tabindex')).attr('aria-hidden',false);
        });
    });
    //show first question box
    $('.questionslist').fadeIn('slow').css("display", "inline-block");
    var firstQuestion = $('.questionslist div.questionWrapper').eq(currentQuestion);
    if (firstQuestion.length) {
        firstQuestion.fadeIn(300,function(){
            $(".task-description-footer").removeAttr('aria-hidden');
        });
        setCurrentAriaLable();
    }
    if(data.questionsList[0].isDraggable) {
        $('.questionslist div.questionWrapper').eq(currentQuestion).find(".checkButton").addClass('disabled').css({'pointer-events': 'none'}).attr('aria-hidden',true);
        $('#answer-container-0').removeClass('hide');
        setParameters();
        // updateFrames();
        $('.drag-tray').show();      
        aSlidesArray = new Array();
        $("#answer-container-0 .frame").each(function() {           
            $(this).css('display', 'none');
            aSlidesArray.push($(this));
            nCount++;
        });
        $("#answer-container-0 .headerFrame0").show();
        nSlideCounter = 0;
        fnCheckNextBack();
        makeDraggable(1);
        makeDroppable(1);
        var curtQuesNum = $('.questionWrapper:visible').attr('data-que');
        var all_dropped = true;
        $('#dragDropContainer-'+(curtQuesNum)+' .dropspot').each(function(){
            if($(this).attr("dropped") != 'true')
            all_dropped = false;
        });
        if(all_dropped == true){
            $('.droppable .dragspot_txt').unbind('keydown');
            $('.droppable .dragspot').unbind("touchend");
        }else{
            $('.drag-tray .answer-container:visible .dragspot_txt').unbind('keydown').bind('keydown', showDropList);
            $('.drag-tray .answer-container:visible').find('.dragspot').off('touchend', showDropList).on('touchend', showDropList);
        }
    }
    else{
        $('.drag-tray').hide();
    }
    //show and create question navigation
    $('.footer').removeClass('hide');    
    set_tabindex();

    setTimeout(function(){     
        $('#chapter_heading').addClass('keybord_outline').attr('tabindex',-1).focus();
    },1000);

    //for navigation button events
    setTimeout(function(){    
        $('.mxpage-previous,.mxpage-next,.mxpage-default,.beginBtn').addClass('tabindex');
        set_tabindex();
        $('.resetButton').unbind('click');
        $('.mxpage-previous,.mxpage-next,.mxpage-default,.resetButton2,.beginBtn').bind('click', function(e){
            if(e.type=="keypress" && e.keyCode !=13 && e.keyCode !=32){
                  return  true;
            }
            $('a').attr('tabindex','-1');
             setTimeout(function(){
                $('.mxpage-previous,.mxpage-next,.mxpage-default').addClass('tabindex');
                    set_tabindex();
                    setProgress();
                //$('[tabindex]').first().focus();    
                $('.modal-header').show();
            },200);
            countAttempts = 1;
        })
        $('.resetButton3').unbind().bind('click', handleAckPopup);        
    },500);
    if(!reviewQuizEnabled) {
        handleShowHideDragTray(1);         
    }
    
}
function attemptQuestionList(){
    $('.correctIncorrectFeedback').empty();
    for(var i=1;i<=nMaxPage;i++){        
        $('.correctIncorrectFeedback').append("<button class='ACIBtn disabled row tabindex' data-page='"+i+"' aria-label='Goto question number "+i+", press this button.'>"+i+"<span class='' data-page='"+i+"'></span></button>");
    }
   
    $('#greenNo').text(correctCount);
    $('#redNo').text(incorrectCount);
    $('#blueNo').text(correctCount+incorrectCount);
}

// Compares selected responses with true answers, returns true if they match exactly
function compareAnswers(trueAnswers, selectedAnswers, isMultipleAns) {
    if (isMultipleAns) {
        return $.inArray(selectedAnswers[0], trueAnswers) > -1;
    } else {
        // crafty array comparison (http://stackoverflow.com/a/7726509)
        return ($(trueAnswers).not(selectedAnswers).length === 0 && $(selectedAnswers).not(trueAnswers).length === 0);
    }
}

function set_tabindex() {
    $(".tabindex").removeAttr("tabindex");
    $(".tabindex:visible").each(function(index) {
        if($(this).hasClass('disabled') || $(this).css('pointer-events')=='none' || $(this).attr('disabled')==1){
            $(this).attr("tabindex", '-1').attr('aria-hidden',true);
            if($(this).hasClass('ACIBtn')){
                $(this).attr("tabindex", 0).removeAttr('aria-hidden');
            }           
        }else{
            $(this).attr("tabindex", 0).removeAttr('aria-hidden');
            if($(this).hasClass('active') && $(this).hasClass('mxpage')){
                $(this).attr("tabindex", -1).attr('aria-hidden',true);
            }
        }
    });
    $('.mxpage').attr('tabindex',0).removeAttr('aria-hidden');
    if(nCurrentQuesNo == 1){
        $('.mxpage-previous[data-page="1"]').attr('tabindex',-1).attr('aria-hidden',true);
    }
    $('.mxpage.active').attr('tabindex',-1).attr('aria-hidden',true);
    $(".mxpage-next").attr('tabindex',0).removeAttr('aria-hidden');
    if($("#confirmOverlay:visible").length == 0 && $(".modal:visible").length == 0){
        $(".taskRow, .task-description-footer, .modal,.pull-right .activityProgress, .pull-right .iconBlue").removeAttr('aria-hidden');
    }
    $('.dropspot').removeAttr('tabindex').removeClass('tabindex');
    setTimeout(function() {
        var questionWrapper = $(window).height();
        var questionContentHeight = questionWrapper - ($('.task-container-col:visible').outerHeight(true)+$('.task-description-footer:visible').outerHeight(true));
        $('.questionslist').css({
            'height': questionContentHeight-offsetBottom
        });
        $('.container.task-container').css({
            'height': questionWrapper-offsetBottom
        });
        $('.drag-tray .dropspot:visible').attr('tabindex',0);
    },200);
}

function handleQuestionNavigation(e) {
    var isNext = $(this).hasClass("mxpage-next");
    var dataId = $(this).attr("data-page")
    nMaxPageFlag++;
    if (nCurrentQuesNo == 1) {
        $(".mxpage-previous").css("pointer-events", "none").attr('aria-hidden',true);
    }
    if (isNext) {
        nCurrentQuesNo++;
        $(".mxpage-previous").css("pointer-events", "").removeAttr('aria-hidden');   
    } else {
        if (nCurrentQuesNo !== 1) {
            nCurrentQuesNo--;
            $(".mxpage-previous").css("pointer-events", "").removeAttr('aria-hidden');
        }
    }   
    gotoQuestionUsingNav(nCurrentQuesNo);
    if(!reviewQuizEnabled) {
        handleShowHideDragTray(nCurrentQuesNo);    
    }
    try{
        if($('.rightArrow').hasClass('rightArrowEnable')){
            $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }else if($('.leftArrow').hasClass('leftArrowEnable')){
            $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }
    }catch(e){
        
    }
setCurrentAriaLable();

}

function createTickMarks() {
    var li_container = '';
    for (var i = 1; i <= nMaxPage; i++) {
        li_container += '<li><span class=""></span></li>'
    }
    $(".tickMarkUl").empty();
    $(".tickMarkUl").append(li_container);
}

function applyTickMarks(feedbackParamClass) {
    if (feedbackParamClass === "correct") {
        $('.mxpage-default').each(function(){
            var num = $(this).attr('data-page');
            if(num == nCurrentQuesNo){
                $(this).parent().find('span').removeClass("inCorrectTickMark").addClass("correctTickMark");
                $('.ACIBtn span:eq('+(num-1)+')').removeClass("inCorrectTickMark").addClass("correctTickMark");
                $('.ACIBtn:eq('+(num-1)+')').addClass("adjustACIbtn");
                $('.ACIBtn:eq('+(num-1)+')').removeClass('disabled');
            }  
        })
    } else {
        $('.mxpage-default').each(function(){
            var num = $(this).attr('data-page');
            if(num == nCurrentQuesNo){
                $(this).parent().find('span').removeClass("correctTickMark").addClass("inCorrectTickMark");
                $('.ACIBtn span:eq('+(num-1)+')').removeClass("correctTickMark").addClass("inCorrectTickMark");
                $('.ACIBtn:eq('+(num-1)+')').addClass("adjustACIbtn");
                $('.ACIBtn:eq('+(num-1)+')').removeClass('disabled');
            }  
        })   
    }
    correctCount = ($('.ACIBtn span.correctTickMark').length);
    incorrectCount = ($('.ACIBtn span.inCorrectTickMark').length);

    totalAttemptCount = incorrectCount + correctCount;
    
    $('#greenNo').text(correctCount); 
    $('#redNo').text(incorrectCount);
    $('#blueNo').text(totalAttemptCount);
    setProgress();
}
function setProgress() {
    var ratio = 100 / nMaxPage;
    var width = totalAttemptCount * ratio;
    if(width == 0) width = 0.2;
    $(".progress-bar").width(width + "%");
    $('.progress-bar').attr('role','progressbar').attr('aria-valuemin',0).attr('aria-valuemax',nMaxPage).attr('aria-valuenow',totalAttemptCount).attr('aria-valuetext',totalAttemptCount+' of '+nMaxPage+' questions attempted.');
}

function addVideoTag1() {
    function addVideoTag(element) {
        var videoId = element.getAttribute('data-id');
        var videoPlaylist = 'https://content.jwplatform.com/feeds/' + videoId + '.json';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', videoPlaylist);
        xhr.timeout = 4000;
        xhr.onerror = function() { showError(element); }

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) { // readyState 4 means the request is done.
            if (xhr.status === 200) { // status 200 is a successful return.
                    var values = JSON.parse(xhr.responseText);
                    if (values.playlist && values.playlist[0].sources) {
                        // we have valid json, let's find the HLS source and delete it
                        var sources = values.playlist[0].sources;
                        var source;
                        var poster = fixTrackFile(values.playlist[0].image);

                        // find the best resolution file first (they're ordered small to large)
                        for(var i = sources.length - 1; i > -1; i--) {
                            if (sources[i].type == 'video/mp4') {
                                source = sources.splice(i, 1)[0];
                                break;
                            }
                        }
                        source = fixTrackFile(source.file);
                        
                   

                        element.setAttribute('src', source);
                        element.setAttribute('poster', poster);

                        if (values.playlist[0].tracks && values.playlist[0].tracks.length > 0) {
                            var tracks = values.playlist[0].tracks;
                            for (var i = 0; i < tracks.length; i++) {
                                var sourceTrack = tracks[i];
                                var kind = sourceTrack.kind;

                                if (kind !== 'captions' && kind !== 'subtitles') {
                                    //this should be a more reliable check than filename containing .vtt
                                    continue; 
                                }

                                var track = document.createElement('track');
                                track.label = sourceTrack.label;
                                track.kind = sourceTrack.kind;
                                //valid srclang values do not appear to be available through JW api
                                //track.srclang = 'en';
                                track.src = fixTrackFile(sourceTrack.file);
                                element.appendChild(track);
                            }
                        }
                    }

            } else {
              showError(element);
            }
          }
        }
        xhr.send(null);
    }

    function showError(element) {
        if (element && element.parentNode) {
            element.parentNode.innerHTML = '<span style="color:#c00; font-weight:bold;">You need an Internet connection to view this video. Please connect and reload this page.</span>';
        }
    }

    // verify or force secure protocal
    function fixTrackFile(file) {
        var protocol = 'https://';
        var slashIndex = file.indexOf('\/\/');
        return (slashIndex === -1) ? protocol + file : protocol + file.substring(slashIndex+2);
    }

    try {
        var videos = document.getElementsByClassName('jwp-video');
        var isIE9 = ((navigator.userAgent.indexOf('Windows') != -1) && (navigator.userAgent.indexOf('Awesomium') != -1));
        for(var i = 0; i < videos.length; i++) {
            addVideoTag(videos[i]);
        }
        $('video').bind('play', function () {
            var curDataId = $(this).attr('data-id');
             for(var i = 0; i < videos.length; i++) {
                var DataId = $(videos[i]).attr('data-id');
                var str = $(videos[i]).parent().text();
                str = str.replace("Browser issues", "");
                $(videos[i]).attr('aria-label', str+', Press tab key to explore the video controls.')
                if(curDataId !=DataId){
                    // videos[i].currentTime = 0;
                    videos[i].pause();
                }                    
            }
        });
    } catch(e) {
        // error occured, do nothing
    }
    $('.frame').find('.video,.video *').attr('tabindex',-1).attr('aria-hidden',true);
    // $('.dragspotWrapper .dragspot .video').hide();
    setTimeout(function(){
        $('.dragspot_txt').animate({scrollTop:0},200);  
    },500);
    

}
    /* DND Activity methods start */
    function createFrames (CurrentAnswersObject) {
        var j = 0;
        var k = 0;
        var firstFrameDragElement = frameDragspot;
        var isOlOpen = true;
        DragSet = ''; 
        OptionArray = new Array();               
        for(var i=0; i<CurrentAnswersObject.length;i++) {
            var optionObj = {'data_answer': i, 'draggableText': CurrentAnswersObject[i].draggableText}
            OptionArray.push(optionObj);
        }
        OptionArray = shuffle(OptionArray);   
        DragSet += '<ol class="frame headerFrame'+j+'">'; 
        for (var i = 0; i < CurrentAnswersObject.length; i++) {  
            // console.log(OptionArray[i].draggableText);  
             
            DragSet += '<li class="dragspotWrapper" data-id="'+OptionArray[i].data_answer+'"><div class="dragspot" id="dragspot_'+i+'"  data-answer="'+OptionArray[i].data_answer+'"  aria-dropeffect="copy" aria-grabbed="true" draggable="true"><div class="dragspot_txt tabindex" role="button" tabindex="0" id="dragspot_txt_'+i+'">'+OptionArray[i].draggableText+'</div>';        
            DragSet += '<button id="zoomText_'+i+'" data-id="'+i+'" class="zoomText tabindex hide" aria-label="Read more button, press this button."></button></div></li>';
            if((i+1) % frameDragspot == 0) {
                DragSet += '</ol>';
                isOlOpen = false;
                j++;
                if(typeof CurrentAnswersObject[i+1] != 'undefined'){
                    DragSet += '<ol class="frame headerFrame'+j+'">';
                    isOlOpen = true;
                }
            }
            
        }
        if(isOlOpen /*frameDragspot > 1*/){
            DragSet += '</ol>';    
        }
        if($('.rightArrow').hasClass('rightArrowEnable')){
            $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }else if($('.leftArrow').hasClass('leftArrowEnable')){
            $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }               
    }

    updateFrames = function(e){       
        var j = 0, i = 0;
        var isNewFrameCreated = false;
        nSlideCounter = 0;        
        var currentFrame = $(".frame:visible").index();
        DragSet = '';
        var dragspots = $('#answer-container-'+currentQuestion+' .dragspot').length;        
        DragSet += '<ol class="frame headerFrame'+j+'">';
        var currentHTML;
        var currentDataAnswer;
        $('#answer-container-'+currentQuestion+' .dragspot').each(function(i){
        currentHTML = $(this).html();
        currentDataAnswer = $(this).attr('data-answer');
            DragSet += '<li class="dragspotWrapper" data-id="'+i+'"><div id="dragspot_'+i+'"  class="dragspot tabindex" role="button"  data-answer="'+currentDataAnswer+'" aria-dropeffect="copy" aria-grabbed="true">'+currentHTML+'</div></li>';
            if((i+1) % frameDragspot == 0) {
                DragSet += '</ol>';
                isNewFrameCreated = false;
                j++;
                if(typeof $('#answer-container-'+currentQuestion+' .dragspot')[i+1] != 'undefined'){
                    DragSet += '<ol class="frame headerFrame'+j+'">';
                    isNewFrameCreated = true;
                }
            }
            i++;
        });
             
        if(isNewFrameCreated || (frameDragspot = 3 && $('#answer-container-'+currentQuestion+' .dragspot').length == 2 ) ) {
            DragSet += '</ol>';    
        }        
        $('#answer-container-'+currentQuestion).html('');
        $('#answer-container-'+currentQuestion).append(DragSet);
        aSlidesArray = new Array();
        $("#answer-container-"+currentQuestion +" .frame").each(function() {
            $(this).css('display', 'none')
            aSlidesArray.push($(this))
            nCount++;
        });
       
        $("#answer-container-"+ currentQuestion +" .frame:nth-child(1)").show();
        makeDraggable((currentQuestion+1));
        fnCheckNextBack();
        if($('.frame').length == 1){
            DisableLeftArrow();
            DisableRightArrow();
        }                     
    
        $('#answer-container-'+currentQuestion+'frame').each(function(){
            if($(this).is(':empty')){
                $(this).remove();
            }
        });
        if($('.rightArrow').hasClass('rightArrowEnable')){
            $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }else if($('.leftArrow').hasClass('leftArrowEnable')){
            $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }
        setTimeout(function(){
            displayReadMoreIcon();    
        },200)
       
    }

    function displayReadMoreIcon(){
        $('.dragspot_txt').each(function(){
            var numberOflines = getRows($(this));
            
            if(numberOflines > 2 || ($(this)[0].scrollHeight > $(this).innerHeight()+6)){                
                $(this).parent().find('.zoomText').removeClass('hide');
            }else{
                $(this).parent().find('.zoomText').addClass('hide');
            }
        });
        $('#popup').remove();
    }
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

    function setParameters(){
        var innerWidth = $(window).innerWidth();
        if((innerWidth > 0) && (innerWidth <= 420))  {
            frameDragspot = 1;
        }
        else if((innerWidth > 420) && (innerWidth <= 1000))
        {
            frameDragspot = 2;
        }
        else{
            frameDragspot = 3;
        }
    }

function makeDraggable(quesNum) {
        $(function() {
            $("#answer-container-"+(quesNum - 1)+" .dragspotWrapper .dragspot" ).each(function(){
                if($(this).hasClass('draggable-disabled')){
                    $(this).find(".dragspot_txt").attr('aria-label',$(this).text().replace("Browser issues", " "))
                }else{                    
                    $(this).find(".dragspot_txt").attr('aria-label',$(this).text().replace("Browser issues", " ")+", Press this to open the list of Drop Areas.")
                }
            })
         $( "#answer-container-"+(quesNum - 1)+" .dragspotWrapper .dragspot" ).draggable({
            // cancel: ".dragspot .audio",
            revert: function(dropped,ui) {
               if(!(dropped) && $(this).parent().hasClass("dropspot")){
    
                $(this).parent().attr("dropped","false");
                $(this).removeClass('correct incorrect-answer');
                $(this).remove();
                } else{
                if(correctDropped)
                    return false;
                return true;
            }                 
        },
        tolerance: "touch",
        containment: '.container',
        reverting: function() {           
        },
        start: function(event, ui) { 
              $(".dropList").hide();
            $('body').addClass('stop-scrolling');
            $('#dragspot-tooltip').remove();        
            $(this).css('z-index', 10);
            tempParent = $(this).parent();
            DropedDargbox = $(this).clone();
            if($(this).parent().hasClass('dragspotWrapper')) {

            }
            if($(this).parent().hasClass('dropspot')) {
                $(this).parent().attr("dropped", 'false');
            }
            $( ".dragspot" ).css({'z-index':0});
                        $(this).css({'z-index':1});
            ui.helper.data('original-position', ui.helper.offset());
            correctDropped = false;
            $('.droppable .dragspot').unbind("touchend");
            dragging = true;
            
        },
        drag: function() {
            $('body').addClass('stop-scrolling');
            if($(this).parent().hasClass("dropspot")){
                $("#quiz-container").css({"overflow":"visible", "margin-right":"17px"});
            }
            
      },
        stop: function(event, ui) { 
            $('body').removeClass('stop-scrolling');
            var rejected = true;
            $('#quiz-container').css({"overflow-y":"scroll", "margin-right":"0px"});
            if(!correctDropped)  {
                if($(this).parent().hasClass('dragspotWrapper'))
                {
                }
                else  {
                    $(this).parent().attr("dropped", 'true');
                }
            }
            
            $(this).css('z-index', 1);
       
        }
     });
    });

    $('.questionWrapper').each(function(){
        var CurrentQuestion = $(this).attr('id').split('question')[1];
        if(! $(this).find('.tryButton').hasClass('hide')){
            $('#answer-container-'+CurrentQuestion).find('.dragspot').draggable({disabled: true});  
        }else{
            try{
            $('#answer-container-'+CurrentQuestion).find('.dragspot').draggable('enable');}catch(e){}
        }        
    })
 
}

 function makeDroppable(curtQuesNum){
   
        $( "#dragDropContainer-"+(curtQuesNum - 1)+" .dropZone" ).droppable({
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function( event, ui ) {
            $('body').addClass('stop-scrolling');
            if(! $(this).children().hasClass("ui-draggable-disabled") && $(event.target).find('.dropspot').find('.feedback.correct').length == 0){
                    var $dropSpot = $(this).find('.dropspot');
                    ui.draggable.unbind('keyup');
                    var this_hasChild = $(this).children().length;
                    ui.draggable.addClass( 'correct' );
                    ui.draggable.position( { of: $dropSpot} );
                    if(tempParent.parent().hasClass('frame')){
                        //ui.draggable.appendTo($dropSpot);
                        $($dropSpot).html(ui.draggable).removeAttr('aria-label');
                        $($dropSpot).find('.dragspot').draggable('disable');

                        $($dropSpot).append('<div class="feedback"></div>');
                        $(this).removeAttr('style');                
                        setConditionsToDragDrop($dropSpot);
                        autoUpdatedDragBox(curtQuesNum);                    
                    }else{
                      
                    }
                    function setConditionsToDragDrop(thisDrop){
                        $(thisDrop).attr("dropped", true);
                        $(thisDrop).find('.zoomText').remove();
                        $(thisDrop).find('.dragspot_txt').css({'max-height':'100%', 'height':'auto'})
                        ui.draggable.css( {'top':'0px','left':'0px','position':'relative'} );
                        correctDropped = true;
                        var correct_answer = $(thisDrop).attr('data-answer');
                        var dropped_answer = $(thisDrop).find('.dragspot').attr('data-answer');

                        if(correct_answer == dropped_answer) {
                            $(thisDrop).find('.dragspot').addClass('correct-answer');
                        }else{
                            $(thisDrop).find('.dragspot').addClass('incorrect-answer');
                            var data_id = $(thisDrop).find('.dragspot').attr('data-id');
                            setTimeout(function() {
                                ui.draggable.removeClass('incorrect-answer'); 
                                ui.draggable.parent().addClass('dotted-frame');
                            }, 1000);
                        }         
                    } 
                $('.dropZone').find('.dragspot').each(function(){
                    $(this).find('.dragspot_txt').attr('aria-label',$(this).text().replace("Browser issues", ""));
                    $('.dropZone').find('.dragspot').unbind('keydown touchend');
                });              
            }        

            var all_dropped = true;
            $('#dragDropContainer-'+(curtQuesNum - 1)+' .dropspot').each(function(){
                if($(this).attr("dropped") != 'true')
                    all_dropped = false;
            });
            $('.drag-tray .answer-container:visible .dragspot_txt').unbind('keydown').bind('keydown', showDropList);
            $('.drag-tray .answer-container:visible').find('.dragspot').off('touchend', showDropList).on('touchend', showDropList);
            if(all_dropped) {
                $('.questionslist div.questionWrapper').eq((curtQuesNum - 1)).find(".checkButton").removeAttr('disabled').removeClass('disabled').css({'pointer-events': 'auto'}).removeAttr('aria-hidden');
                $('.dropspot:visible').removeClass('tabindex').removeAttr('tabindex');
                set_tabindex();
                $('.questionslist div.questionWrapper').eq((curtQuesNum - 1)).find(".checkButton").focus();
            }
           
            $('.dropspot').find('.video *').removeAttr('tabindex');
            var videos = $("#question"+(curtQuesNum-1)).find(".jwp-video");
            if(videos.length>0){
                $('video').bind('play', function () {
                    var curDataId = $(this).attr('data-id');
                     for(var i = 0; i < videos.length; i++) {
                        var DataId = $(videos[i]).attr('data-id');
                        var str = $(videos[i]).parent().text();
                        str = str.replace("Browser issues", "");
                        $(videos[i]).attr('aria-label', str+', Press tab key to explore the video controls.')
                        if(curDataId !=DataId){
                            // videos[i].currentTime = 0;
                            videos[i].pause();
                        }                    
                    }
                });
            }
        }
    });
}

    function autoUpdatedDragBox(curtQuesNum) {
        lastFrame = $('#answer-container-'+(curtQuesNum - 1)+' > .frame').last();
        lastFrameDragSpot = $(lastFrame).children().first();
        currentFrame = $(tempParent).parent();
        $(tempParent).append($(DropedDargbox));               
            makeDraggable(curtQuesNum);
        if ($(lastFrame).is(':empty')) {
               nCount = 0;
               $(lastFrame).remove();
               aSlidesArray = new Array()
               $("#answer-container-"+(curtQuesNum - 1)+" .frame").each(function() {
                   aSlidesArray.push($(this))
                   nCount++;
               });
        }
        if ($(currentFrame).is(':empty')) {
            backSlide();
            $('.rightArrow').addClass('rightArrowDisable');
        }
        lastFrame = $('#answer-container-'+(curtQuesNum - 1)+' > .frame').last();
        if (($(lastFrame).attr('class')) == ($(currentFrame).attr('class'))) {
            $('.rightArrow').addClass('rightArrowDisable');
        }     
    }
    
    function EnableLeftArrow(){
        $(".leftArrow").removeClass("leftArrowDisable disabled").addClass("leftArrowEnable").css({"pointer-events":"auto", "cursor":"pointer"}).removeAttr('disabled');
        try{
        if($('.rightArrow').hasClass('rightArrowEnable')){
            $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }else if($('.leftArrow').hasClass('leftArrowEnable')){
            $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }
        }catch(e){
            console.log(e)
        }
        // $('.dragspotWrapper .dragspot').find('*').attr('tabindex',-1);
    }
    function DisableLeftArrow(){
        $(".leftArrow").removeClass("leftArrowEnable").addClass("leftArrowDisable disabled").css({"pointer-events":"none", "cursor":"default"});
        $(".leftArrow").attr('tabindex',-1).attr('aria-hidden',true);
    }
    function EnableRightArrow(){
        $(".rightArrow").removeClass("rightArrowDisable disabled").addClass("rightArrowEnable").css({"pointer-events":"auto", "cursor":"pointer"}).removeAttr('disabled');
        try{
        if($('.rightArrow').hasClass('rightArrowEnable')){
            $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }else if($('.leftArrow').hasClass('leftArrowEnable')){
            $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
        }
        }catch(e){
            console.log(e)
        }       
    }
    function DisableRightArrow(){
        $(".rightArrow").removeClass("rightArrowEnable").addClass("rightArrowDisable disabled").css({"pointer-events":"none", "cursor":"default"});
        $(".rightArrow").attr('tabindex',-1).attr('aria-hidden',true);
    }
     
    function fnCheckNextBack() {
        DisableLeftArrow();
        DisableRightArrow();
        if (nSlideCounter == 0) {
            if($(".frame").length > 1){
                EnableRightArrow();
            }
        }else if (nSlideCounter == aSlidesArray.length-1) {
            EnableLeftArrow();
        }else{
            EnableLeftArrow();
            EnableRightArrow();
        }
        displayReadMoreIcon();
        // $('.dragspotWrapper .dragspot').find('*').attr('tabindex',-1);
        set_tabindex();
        hideTooltip();
        
        setTimeout(function(){
            $('.dragspot_txt').animate({scrollTop:0},20);  
        },200)
    }

    function fnNext(ev){
       if(ev.type=="keyup" && ev.keyCode !=13 && ev.keyCode !=32){    
            return  true; 
        }
        $('.tooltipc').remove();
        if(nSlideCounter<(nCount-1)){
            nSlideCounter++;
            EnableRightArrow();
            $(".frame").hide();
             $(".headerFrame"+nSlideCounter).show();
             set_tabindex();
             var _this = $(this);
             setTimeout(function(){
                _this.parent().find('.frame:visible .dragspot:first').find('.dragspot_txt').addClass('keybord_outline').focus()
             },200)
             
        }else{
            DisableRightArrow();   
        }

        fnCheckNextBack()
        try{
            if($('.rightArrow').hasClass('rightArrowEnable')){
                $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
            }else if($('.leftArrow').hasClass('leftArrowEnable')){
                $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
            }
        }catch(e){
            console.log(e)
        }
    }
    function fnBack(ev){
        if(ev.type=="keyup" && ev.keyCode !=13){    
            return  true; 
        }
        backSlide();
        $('.tooltipc').remove();
        var _this = $(this);
        set_tabindex();
         setTimeout(function(){
            _this.parent().find('.frame:visible .dragspot:first').find('.dragspot_txt').addClass('keybord_outline').focus()
         },200)
         try{
            if($('.rightArrow').hasClass('rightArrowEnable')){
                $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
            }else if($('.leftArrow').hasClass('leftArrowEnable')){
                $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
            }
        }catch(e){
            console.log(e)
        }
    }
    function backSlide(ev){
        if(nSlideCounter>0){
             nSlideCounter--;
             $(".frame").hide();
             $(".headerFrame"+nSlideCounter).show();
        }else{
            DisableLeftArrow();
        }
        var _this = $(this);
        fnCheckNextBack();
        set_tabindex();
         setTimeout(function(){
            _this.parent().find('.frame:visible .dragspot:first').find('.dragspot_txt').addClass('keybord_outline').focus()
         },200)
         try{
            if($('.rightArrow').hasClass('rightArrowEnable')){
                $('.rightArrow').attr('tabindex',0).removeAttr('aria-hidden');
            }else if($('.leftArrow').hasClass('leftArrowEnable')){
                $('.leftArrow').attr('tabindex',0).removeAttr('aria-hidden');
            }
        }catch(e){
            console.log(e)
        }

    }
    
    function handleShowHideDragTray(quesNum){
        if(quesNum <= nMaxPage && !$('#question'+(quesNum - 1)).hasClass('attempted')) {
            var isdraggable = data.questionsList[(quesNum - 1)].isDraggable;               
            if(isdraggable) {
                var all_dropped = true;
                $('#dragDropContainer-'+(quesNum - 1)+' .dropspot').each(function(){
                    if($(this).attr("dropped") != 'true')
                        all_dropped = false;
                });
                if($('#question'+(quesNum - 1)+' .tryButton').hasClass('hide') && all_dropped == false) {
                    $('#question'+(quesNum - 1)+' .checkButton').removeClass('hide').addClass('disabled').css({'pointer-events': 'none'});
                }                
                $('#answer-container-'+(currentQuestion)).hide();
                $('#answer-container-'+(quesNum - 1)).show();
                // $('.questionWrapper').css({'height':'63.1vh'});
                $('.drag-tray').show();
                aSlidesArray = new Array();                
                $("#answer-container-"+(quesNum - 1)+" .frame").each(function() {
                    $(this).css('display', 'none');
                    aSlidesArray.push($(this));
                    nCount++;
                });
                $("#answer-container-"+(quesNum - 1)+" .headerFrame0").show();
                nSlideCounter = 0;
                fnCheckNextBack(); 
                makeDraggable(quesNum);
                makeDroppable(quesNum);
            }
            else{
                $('#answer-container-'+(currentQuestion)).hide();
                $('.drag-tray').hide();            
                // $('.questionWrapper').css({'height':'72.6vh'});
            }  
       }else if($('#question'+(quesNum - 1)).hasClass('attempted')){
           $('.drag-tray').hide();
       }
    }

    function EnableSubmit() {
        var DroppedAll = true;
        $('.dropspot:visible').each(function(){
            if ($(this).attr('dropped') == "false"){
                DroppedAll = false;
            }
        });
        if(DroppedAll){
            $(".feedback > button").hide();
            $('.checkButton').removeClass('disabled').attr('tabindex',0);            
                $('.checkButton').css('pointer-events', 'auto');
                 makeDraggable((currentQuestion+1));
            setTimeout(function() { 
                set_tabindex();
                $('.checkButton').css('cursor', 'pointer');
                $('.checkButton').css('display', 'inline-block !important');
                $('.checkButton').show().addClass('keybord_outline').focus();
                setParameters()
            }, 400);
        }
    }

    function showDropList(e) {  
        var charCode = (e.which) ? e.which : e.keyCode;  
        // console.log("showDropList", charCode)
        if((e.type === 'keydown') && (charCode !== 32) && (charCode !== 13) && (charCode !== 9)){
            return false;
        }
        console.log("dragging open",dragging,$(e.target).attr("class"),e.type)
        if (dragging){
            dragging = false;
            e.stopPropagation();
          return false;
        } 
        if((charCode !== 9) && !$(e.target).hasClass('zoomText')){           
        if(e) {
            e.stopPropagation();
            e.preventDefault();
        } 

        var currentDrag = $(this);
        DragID = $(this).attr("id");
        DropListContainer = "";
        DropList = "";
        $('#dragspot-tooltip').remove();
        $('#popup').remove();
        $(this).attr("aria-grabbed", "true");
        DropListContainer = $('<ul id="popup" role="menu" aria-label=""></ul>');

        $('.questionWrapper:visible').find(".dropspot").each(function(index){
            listText = $(this).parent().find('p').first().text();
            var aria_labellist = "Press to select this option or use Up and Down arrow keys to move to next or previous item."
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                aria_labellist = 'Press to select this option.';
            }
            if(!$(this).hasClass('inactive')){             
                if ($(this).children().hasClass('dragspot')){
                    $(this).attr("aria-dropeffect","move");
                    DropList += '<li tabindex="0" id="'+index+'" aria-label=" '+listText+' " role="button" class="dropList focus correct" data-id="'+$(this).attr("data-answer")+'">'+add3Dots(listText, 40)+'</li>';
                }else{                                    
                    $(this).attr("aria-dropeffect","move");
                    DropList += '<li tabindex="0" id="'+index+'" aria-label="'+listText+'. '+aria_labellist+'" role="button" class="dropList focus" data-id="'+$(this).attr("data-answer")+'">'+add3Dots(listText, 40)+'</li>';
                }
            }
        });       
        DropListContainer.append(DropList);
        if(!$(this).parent().hasClass('dragspot')){
            $(this).parent().append(DropListContainer);    
        }else{
            $(this).parent().parent().append(DropListContainer);
        }        
        $('#popup').css('top', -($('#popup').height()+30)+'px');
        $(".dropList").unbind().bind('keydown touchend', handleDropByList);
        $(".dropList").first().addClass('keybord_outline').focus();
     }
    }   

    function handleDropByList(e) {        
        var charCode = (e.which) ? e.which : e.keyCode;        
        if(e.type !== 'touchend'){
            if((e.type === 'keydown') && (charCode !== 13) && (charCode !== 32) && (charCode !== 9) && (charCode !== 37) && (charCode !== 38) && (charCode !== 39) && (charCode !== 40) && (charCode !== 27)){
              return false;
            }
        }else{
            charCode=32;
        }        
        var curtQuesNum = $('.questionWrapper:visible').attr('data-que');
        e.stopPropagation();
        e.preventDefault();
        switch (charCode)
        {
            case 38 : // Down arrow
            $('.keybord_outline').removeClass('keybord_outline');
            $(e.currentTarget).prev().addClass('keybord_outline').focus();
            break;
            case 40 : // Up arrow
            $('.keybord_outline').removeClass('keybord_outline');
            $(e.currentTarget).next().addClass('keybord_outline').focus();
            break; 
            case 27 : // Escape
            case 9 : //Tab
            $(this).parent().parent().find('.dragspot .dragspot_txt').addClass('keybord_outline').focus();
            $('#popup').remove();
            $(".dropspot, #dragContainer").removeAttr("aria-dropeffect");
            $(".dragspot").attr("aria-grabbed", "false");
            break;           
            case 13: // Enter
            case 32: // Space
            tempDragKey = $(this).parent().parent().find('.dragspot');
            if(tempDragKey.parent().hasClass("dropspot")){
                tempDragKey.parent().attr("dropped", 'false');
                tempDragKey.remove();
            }
            var targetDragNumber = $(e.target).attr('id');              
            var cloneDragKey = tempDragKey.clone();
            cloneDragKey.css({
                "z-index": "1",
                "position": "relative", 
                "top": "0px", 
                "left": "0px", 
            });
            if($('.questionslist div.questionWrapper').eq((curtQuesNum)).find('.dropspot[data-answer="'+targetDragNumber+'"]').find('.feedback.correct').length == 0){
                $('.questionslist div.questionWrapper').eq((curtQuesNum)).find('.dropspot[data-answer="'+targetDragNumber+'"]').html('').append(cloneDragKey).attr("dropped", 'true').append('<div class="feedback"></div>').removeAttr('aria-label');
                $('.questionslist div.questionWrapper').eq((curtQuesNum)).find('.dropspot[data-answer="'+targetDragNumber+'"]').find('.dragspot').addClass('ui-draggable-disabled');
                $('.questionslist div.questionWrapper').eq((curtQuesNum)).find('.dropspot[data-answer="'+targetDragNumber+'"]').find('.dragspot').find('video').attr('tabindex',0).removeAttr('aria-hidden').find('.video').removeAttr('aria-hidden');
                }
                $('.dropspot').find('.video,.video *').removeAttr('tabindex').removeAttr('aria-hidden');
                $('.dropspot').find('video').attr('tabindex',0);
                $(".frame:visible [tabindex]:first").addClass('keybord_outline').focus();
                $('#popup').remove();       
        
            try{
                $('.rightArrowEnable,.leftArrowEnable').attr('tabindex',0).removeAttr('aria-hidden');
            }catch(e){
                console.log(e)
            }
            var all_dropped = true;
            $('#dragDropContainer-'+(curtQuesNum)+' .dropspot').each(function(){
                if($(this).attr("dropped") != 'true')
                    all_dropped = false;
            });
            $('.drag-tray .answer-container:visible .dragspot_txt').unbind('keydown').bind('keydown', showDropList);
            $('.drag-tray .answer-container:visible').find('.dragspot').off('touchend', showDropList).on('touchend', showDropList);
            if(all_dropped) {
                $('.questionslist div.questionWrapper').eq((curtQuesNum)).find(".checkButton").removeClass('disabled').removeAttr('disabled').attr('tabindex',0).css({'pointer-events': 'auto'}).removeAttr('aria-hidden');
                $('.dropspot:visible').removeClass('tabindex').removeAttr('tabindex');
                set_tabindex();
                setTimeout(function(){
                    $('.questionslist div.questionWrapper').eq((curtQuesNum)).find(".checkButton").addClass('keybord_outline').focus();
                    // $('.drag-tray .answer-container:visible').find('.dragspot').unbind('keydown touchend').removeClass('tabindex');
                },200)
                
            }
            $('.dropZone').find('.dragspot').each(function(){
                $(this).find('.dragspot_txt').attr('aria-label',$(this).text().replace("Browser issues", ""));
            });
            break;             
        }
    }
    // function fnReplaceStr(str,wht,wid){
    //     return str.replace(wht,wid);

    // }
$(window).resize(function(){
    setParameters();
    if(isAndroid){
        $('.dragspotWrapper').css('width', "30%");
        if($('.dragspotWrapper .dragspot').length==1){
            $('.dragspotWrapper').css('width', "100%");
        }
        return false;
    }else{
        $('.dragspotWrapper').removeAttr("style");
    }
    setTimeout(function() {
        var questionWrapper = $(window).height();
        var questionContentHeight = questionWrapper - ($('.task-container-col').outerHeight(true)+$('.task-description-footer').outerHeight(true));
        $('.questionslist').css({
            'height': questionContentHeight-offsetBottom
        });
        $('.container.task-container').css({
            'height': questionWrapper-offsetBottom
        });
    },200);
    // updateFrames();    
});



        // Event handler for the "Show Answer" button
		function addShowAnswerFunctionality() {		
		if (!reviewQuizEnabled) {
        $('.showbutton').on('click', function() {
        //var correctAnswer = "Option A";
        var correctAnswer = '';
        var question = data.questionsList[currentQuestion];
        var answers = question.answers;
        if(question.isDraggable) {
            //APT: Need to set the correct answer for drag and drop.
        }
        else{
            //APT: Multiple Choice - Single Select Question
            //var trueAnswers = [];
            //var lo = 0;
            for (var i in answers) {
                if (answers.hasOwnProperty(i)) {
                    var answer = answers[i];
                    if (answer.correct) {
                        //trueAnswers.push(lo);
                        if(correctAnswer==''){
                            correctAnswer = answer.text
                        }
                        else{
                            correctAnswer += ", " + answer.text
                        }
                    }
                }
                //lo++;
            }
        }
        
        // Create a popup with the correct answer
        var popupHtml = '<div class="popup-overlay">';
        popupHtml += '<div class="popup">';
        popupHtml += '<p class="popup-text">';
        popupHtml += 'The correct answer is: ' + correctAnswer;

        popupHtml += '<button class="popup-close tabindex">&#215;</button>';
        popupHtml += '</p>';
        popupHtml += '</div>';
        popupHtml += '</div>';

        // Append the popup to the body
        $('body').append(popupHtml);

        // Event handler for the close button
        $('.popup-close').on('click', function() {
            $('.popup-overlay').remove();
        });
    });

}
}

