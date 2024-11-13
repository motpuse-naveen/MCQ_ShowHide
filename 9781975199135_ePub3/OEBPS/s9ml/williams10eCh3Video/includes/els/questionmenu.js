var DropDownMenu = function(questionArray, menuName) {

    var oDropDown, isOpen = false,
        Evts;

    function generate(questionArray, menuName) {
        Evts = new Events();
        Lclass = menuName.split(" ").join("-");
        oDropDown = $('<div class="dd-main-container"><nav style=""><ul><li>' +
            '<div style="text-align: left;">' +
            '</div><div class="btnGoTo tabindex" role="button" aria-label="Press the enter  to jump to a specific available question " >' +
            '<div class="navTopSpan">Go To<span class="gotoImg"></span></div>' +
            '<div class="shape_dd_arrows ' + Lclass + '-arrow">' +
            '</div>' +
            '<ul class="topUL ' + Lclass + '-ul">' +
            '</ul>' +
            '</div></li></ul></nav></div>');
        for (var i = 0; i < questionArray.length; i++) {
            var index = Const.bookmarkData.indexOf(i);
            if (index > -1) {
                var oFlag = 'qflag';

            } else {
                var oFlag = 'qemptyflag';
            }

            var figureLi = ('<li  class="listItems tabindex">' +
                '<div tabindex="4" aria-label="Question ' + questionArray[i] + '" questionNumber="' + questionArray[i] + '" class="listdiv list' + questionArray[i] + '"><span class="' + oFlag + '"></span>Question ' + questionArray[i] + '</div>' +
                '</li>')
            oDropDown.find('ul.topUL').append(figureLi)
        }



        oDropDown.find('.btnGoTo').on('click keyup', function(e) {
            keyboardAccessibility(e);
            updateQuestionsarray();
        })
        // add button events
        oDropDown.find('ul.topUL li').bind('click keyup', handleButtonEvents)

        window.addEventListener("click", onWindowClick)

    }

    function updateQuestionsarray() {
        
        oDropDown.find('ul.topUL').html('');
        for (var i = 0; i < Const.questionsData.length; i++) {

            //qemptyflag
            //var CurrentQuestionCounter=Number(Const.questionsData[i])+Number(Const.CurrentActiveQuestion);
            var CurrentQuestionCounter = Number(Const.questionsData[i]);
            var index = Const.bookmarkData.indexOf(CurrentQuestionCounter);
            if (index > -1) {
                var oFlag = 'qflag';

            } else {
                var oFlag = 'qemptyflag';
            }
            
            if (CurrentQuestionCounter == Number(Const.CurrentActiveQuestion)) {
                var listDiv = 'listdivbg';
                
            } else {
                var listDiv = 'listdiv';

                //background-color: #F4F4F4;
            }
            
            var figureLi = ('<li  class="listItems tabindex">' +
                '<div tabindex="4" aria-label="Question ' + CurrentQuestionCounter + '" questionNumber="' + CurrentQuestionCounter + '" class="' + listDiv + ' list' + CurrentQuestionCounter + '"><span class="' + oFlag + '"></span>Question ' + CurrentQuestionCounter + '</div>' +
                '</li>');
            
            oDropDown.find('ul.topUL').append(figureLi);
        }
        oDropDown.find('ul.topUL li').unbind().bind('click keyup', handleButtonEvents);
        //$('#yourUL').scrollTop($('#yourUL li:nth-child(14)').position().top);

        var $container = oDropDown.find('ul.topUL');
        if (Number(Const.CurrentActiveQuestion) == 0) {
            question_number = 1;
        } else {
            question_number = Number(Const.CurrentActiveQuestion) - 1;
        }
        if (question_number == 0) {
            question_number = 1;
        }
        var $scrollTo = $('.list' + question_number);
        setTimeout(function() {
            $('.list' + Const.CurrentActiveQuestion).focus();
        }, 100);
        //$scrollTo = $('.list12');
        
        $container.scrollTop(
            $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
        );
    }


    function keyboardAccessibility(e) {
        if (e.type == 'keyup' && (e.keyCode != 13 && e.keyCode != 32))
            return false;

        if (isOpen == false) {
            //updateQuestionsarray();
            $('.topUL').css('display', 'block');
            //$('#shape_dd_img').attr('src','images/down_arrow.svg')
            isOpen = true;
        } else {
            $('.topUL').css('display', 'none');
            //$('#shape_dd_img').attr('src','images/up_arrow.svg')
            isOpen = false;
        }
        e.stopPropagation();
        $('.btnGoTo').blur()
        Const.removeTabIndex();
        Const.addTabIndex();
        setTimeout(function() {
            $('.ques_num').focus();
        }, 100);
    }

    function onWindowClick() {
        if (isOpen == true)
            $('.topUL').css('display', 'none');
        isOpen = false
    }

    function handleButtonEvents(e) {
        //Tracer.log($(e.target).attr('title'))
        if (e.type == 'keyup' && (e.keyCode != 13 && e.keyCode != 32))
            return false;
        Evts.dispatchEvent('OPTION_SELECTED', {
            'question_selected': $(e.target).attr('questionNumber')
        })

    }
    generate(questionArray, menuName)

    return {
        getHTML: function() {
            return oDropDown
        },
        updateQuestionsarray: updateQuestionsarray,
        Evts: Evts
    }
}