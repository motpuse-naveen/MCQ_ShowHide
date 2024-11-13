var Header = function(authorName, headerTitle) {
    var evts = new Events();
    var headHTML;
    var hTitle = headerTitle;
    var hAuthor = authorName;
    var oHelpDiv;
    var backButton;
    var homeButton;

    function createView() {
        headHTML = $('<div>', {
            class: 'header'
        });

        homeButton = $('<div>', {
            class: 'homeButton tabindex',
            id: 'homeButton',
            title: 'Home'
        });
        backButton = $('<div>', {
            class: 'backButton tabindex',
            id: 'backButton',
            title: 'Back'
        });
        headHTML.append(homeButton);
        headHTML.append(backButton);
        headHTML.append('<div class="modeAuthor tabindex">' + hAuthor + '</div><div class="modeTitle tabindex">' + hTitle + '</div>');


        helpButton = $('<div>', {
            class: 'helpButton tabindex',
            id: 'helpButton',
            title: 'Help'
        });
        headHTML.append(helpButton);

        /*bookmarkButton = $('<div>', {class: 'bookmark tabindex', id:'bookmark'});
        headHTML.append(bookmarkButton);
        */
        homeButton.bind('click keyup', handleButtonEvents);
        backButton.bind('click keyup', handleButtonEvents);
        helpButton.bind('click keyup', handleButtonEvents);
    }

    function showHelp() {
        oHelpDiv = $('<div>', {
            class: 'helpDiv tabindex'
        });
        helpTitle = $('<div>', {
            class: 'helpTitle tabindex'
        });
        helpBody = $('<div>', {
            class: 'helpBody'
        });

        helpTitle.append('How to navigate');

        for (var i = 0; i < Const.helplist.length; i++) {
            helpRow = $('<div>', {
                class: 'helpRow'
            });
            helpRow.append('<div class="helpIcon ' + Const.helplist[i].class + '"><img src="images/' + Const.helplist[i].icon + '" alt="' + Const.helplist[i].alt + '" /></div><span class="tabindex" aria-label="' + Const.helplist[i].title + '">' + Const.helplist[i].title + '</span><br/><div class="helpDescription tabindex" aria-label="' + Const.helplist[i].description + '">' + Const.helplist[i].description + '</div>');
            helpBody.append(helpRow);
        }
        pCloseBtn = $('<span>', {
            class: 'modal-close tabindex',
            'aria-label': 'Close Popup'
        }).bind('click keyup', destroyHelp);
        pCloseBtn.append('<img src="images/close_win.svg" />');
        helpTitle.append(pCloseBtn);
        oHelpDiv.append(helpTitle);
        oHelpDiv.append(helpBody);
        $('#maincontainer').append(oHelpDiv);
        Const.removeTabIndex();
        //oHelpDiv.find('.helpTitle').attr('tabindex', 1);
        oHelpDiv.find('.tabindex').each(function(element) {
            $(this).attr('tabindex', 1);
        });
        setTimeout(function() {
            $(".helpTitle").focus();
        }, 100);

    }

    function destroyHelp(e) {
        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
        oHelpDiv.remove();
		Const.removeTabIndex();
        Const.addTabIndex();
        setTimeout(function() {
            $(".helpButton").focus();
        }, 100);
    }

    function showBackbtn() {
        backButton.show();
        homeButton.hide();
    }

    function handleButtonEvents(e) {
        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
        var type = $(e.target).attr('id');
        
        switch (type) {
            case 'homeButton':
                try {
                    Const.TimerInstance.clearTimer()
                } catch (e) {}
                Const.timed = false;
                Const.section = false;
                Const.currentQuestionsSet = '';
                Const.examData = '';
                Const.currentSet = 0;
				Const.selected_section = "ADHD A2";
                Const.CurrentActiveQuestion = 1;
                Const.resultArray = [];
                Const.bookmarkData = [];
                Const.questionsData = [];
                evts.dispatchEvent('HOME_BTN_CLICK', {
                    'type': 'INIT_APP'
                });
                break;
            case 'helpButton':
                showHelp();
                break;
            case 'backButton':
                try {
                    Const.TimerInstance.clearTimer()
                } catch (e) {}
                //Const.timed = false;
                Const.currentSet = 0
                evts.dispatchEvent('BACK_BUTTON_CLICK', {
                    'type': 'PREVIOUS_MODE'
                });
                break;
        }
    }
    return {
        evts: evts,
        getHeader: function() {
            createView();
            return headHTML;
        },
        showBackbtn: showBackbtn
    }
}