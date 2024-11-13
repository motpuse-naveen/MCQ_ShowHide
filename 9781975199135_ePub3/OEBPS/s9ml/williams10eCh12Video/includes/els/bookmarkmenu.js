var BookmarkMenu = function(questionArray, qType) {

    var oBookMark, isOpen = false,
        Evts;

    function generate(questionArray, qType) {


        Evts = new Events();
        Lclass = qType + '_menu';
        oBookMark = $('<div class="bm-main-container"><nav style=""><ul><li>' +
            '<div style="text-align: left;">' +
            '</div><div class="bookmark" aria-label="Press the enter to view bookmark questions" title="Bookmark List" >' +
            '<div class="navTopSpan"><span class="flag"></span></div>' +
            '<div class="shape_dd_arrows ' + Lclass + '-arrow">' +
            '</div>' +
            '<div class="modelContentBox"><ul class="bottomUL ' + Lclass + '-ul">' +
            '</ul></div>' +
            '</div></li></ul></nav></div>');
        oBookMark.find('.bottomUL').html('Bookmark');
        for (var i = 0; i < questionArray.length; i++) {
            var figureLi = ('<li  class="listItems">' +
                '<div tabindex="4" aria-label="Question' + questionArray[i] + '" questionNumber="' + questionArray[i] + '" class="listdiv list' + questionArray[i] + '"> Question' + questionArray[i] + '</div>' +
                '</li>');
            oBookMark.find('ul.bottomUL').append(figureLi)
        }


        oBookMark.find('.bookmark').on('click keyup', function(e) {
            keyboardAccessibility(e);
            updatebookMark();
        })
        // add button events

        //if(Const.bookmarkData.length > 0){ 
        oBookMark.find('ul.bottomUL li').unbind().bind('click keyup', handleButtonEvents);

        //}	
        window.addEventListener("click ", onWindowClick);
    }

    function updatebookMark() {
        
        oBookMark.find('ul.bottomUL').html('');
        var bookmark_title = $('<div>', {
            class: 'bookmark_title'
        });
        $(bookmark_title).html('Bookmarks');
        //oBookMark.find('ul.bottomUL').html('bookmark');
        oBookMark.find('ul.bottomUL').append(bookmark_title);
        Const.bookmarkData.sort(function(a, b) {
            return a - b;
        });
        var oFlag = 'qflag';
        for (var i = 0; i < Const.bookmarkData.length; i++) {
            var figureLi = ('<li  class="listItems tabindex">' +
                '<div tabindex="4" aria-label="' + Const.bookmarkData[i] + '" questionNumber="' + Const.bookmarkData[i] + '" class="listdiv list' + Const.bookmarkData[i] + '"><span class="' + oFlag + '"></span> Question ' + Const.bookmarkData[i] + '</div>' +
                '</li>');
            oBookMark.find('ul.bottomUL').append(figureLi);
        }
        oBookMark.find('ul.bottomUL li').unbind().bind('click keyup', handleButtonEvents);
		
		var $container = oBookMark.find('ul.Bookmark_menu-ul');
        var $scrollTo = $('.list' + Const.bookmarkData[0]);
        setTimeout(function() {
            $('.list' + Const.bookmarkData[0]).focus();
        }, 100);
        //$scrollTo = $('.list12');
        
        $container.scrollTop(
            $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
        );

    }

    function keyboardAccessibility(e) {
        if (e.type == 'keyup' && (e.keyCode != 13))
            return false;

        var leftpos = $('#maincontainer').width() + $('#maincontainer').offset().left - $('.bottomUL').width()
        $('.bottomUL').css('left', leftpos + 'px');

        if (isOpen == false) {
            if (Const.bookmarkData.length > 0) {
                oBookMark.find('ul.bottomUL').css('display', 'block');
                oBookMark.find('.modelContentBox').css('display', 'block');
                //$('#shape_dd_img').attr('src','images/down_arrow.svg')
                isOpen = true;
            }
        } else {

            oBookMark.find('ul.bottomUL').css('display', 'none');
            oBookMark.find('.modelContentBox').css('display', 'none');

            //$('#shape_dd_img').attr('src','images/up_arrow.svg')
            isOpen = false;
        }
        e.stopPropagation();
        $('.bookmark').blur()
        Const.removeTabIndex();
        Const.addTabIndex();
        setTimeout(function() {
            $('.ques_num').focus();
        }, 100);

    }

    function onWindowClick() {
       
        if (isOpen == true)
            oBookMark.find('ul.bottomUL').css('display', 'none');
        oBookMark.find('.modelContentBox').css('display', 'none');
        isOpen = false
    }

    function handleButtonEvents(e) {
        //Tracer.log($(e.target).attr('title'))
        if (e.type == 'keyup' && (e.keyCode != 13 && e.keyCode != 32))
            return false;
        Evts.dispatchEvent('BOOKMARK_OPTION_SELECTED', {
            'question_selected': $(e.target).attr('questionNumber')
        })

    }
    generate(questionArray, qType)

    return {
        getHTML: function() {
            return oBookMark
        },
        updatebookMark: updatebookMark,
        Evts: Evts
    }
}