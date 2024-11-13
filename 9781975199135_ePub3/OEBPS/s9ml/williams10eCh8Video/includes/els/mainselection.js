var MainSelection = function() {
    var oHtml;
    var oPopup;

    var ModeHTML;
    var studyHTML;
    var evts = new Events();
    var topDiv;
    var bottomDiv;
    var homeButtonContainer;
    var studyModeBtn;
    var studyBtnInfo;
    var examModeBtn;
    var checkboxArray = [];
    var oJsonArray = [];
    var oHeader;
    var selected_section = books.clinicalpsychiatry;
    //bc="oncology";

    function createView() {
        oPopup = new PopupManager();
        oPopup.evts.addEventListener('EXAM_MODE_TIMED_CLICK', handlePopupSelction)
        oPopup.evts.addEventListener('EXAM_MODE_NO_TIMED_CLICK', handlePopupSelction)
        oHtml = $('<div>', {
            id: 'maincontainer'
        });
        var topHeading1 = $('<h2>', {
            class: 'topHeading1 tabindex'
        });
        topHeading1.append(Const.topTitle1);
		topHeading1.attr("aria-label",Const.topTitle1);
        var topHeading2 = $('<h1>', {
            class: 'topHeading2 tabindex'
        });
        topHeading2.append(Const.topTitle2);
        topDiv = $('<div>', {
            class: 'topDiv'
        });
		topHeading2.attr("aria-label",Const.topTitle2);
        topDiv.append(topHeading1);
        topDiv.append(topHeading2);
        topDiv.append('<hr/>');
       // topDiv.append('<h2 class="authorName tabindex">' + Const.authorName + '</h2>');
        topDiv.append('<h4 class="editionText tabindex" aria-label="' + Const.editionText + '">' + Const.editionText + '</h4>');

        bottomDiv = $('<div>', {
            class: 'bottomDiv '
        });
        bottomTextDiv = $('<div>', {
            class: 'bottomTextDiv'
        });
        homeButtonContainer = $('<div>', {
            class: 'home-button-container'
        });



        selectModelabel = $("<label/>", {
            class: 'select_option_label'
        }).text('Mode:');
        selectMode = $("<select/>", {
            class: 'select_option_exam tabindex',
			name:'select_mode'
        });
        // selectModeOption = $("<option/>").attr("value", "undefined").text("Select Mode Type");
        studyModeOption = $("<option/>").attr("value", "study").text("Study Mode");
        examModeOption = $("<option/>").attr("value", "exam").text("Exam Mode");
        //selectMode.append(selectModeOption);
        selectMode.append(studyModeOption);
        selectMode.append(examModeOption);
		selectMode.attr("aria-label", "Please use arrow key to choose the option");

        selectExamModelabel = $("<label/>", {
            class: 'exam_select_label'
        }).text('Exam:');
        selectExamMode = $("<select/>", {
            class: 'select_option tabindex',
			id:'select_exam'
        });
        //selectExamModeOption = $("<option/>").attr("value", "undefined").text("Select Exam Type");
        //selectExamMode.append(selectExamModeOption);
        for (i = 0; i < books.ExamContent.length; i++) {
            selectExamModeOption = $("<option/>").attr("value", books.ExamContent[i].ExamID).text(books.ExamContent[i].chapterName);
            selectExamMode.append(selectExamModeOption);

        }

        var selectSecLabDiv1 = $("<div class='lab_Select section_select'></div>")
        var selectSecLabDiv2 = $("<div class='lab_Select exam_select_op'></div>")
        var selectSecLabDiv3 = $("<div class='lab_Select'></div>")
        var selectSectionlabel = $("<label/>", {
            class: 'select_option_label'
        }).text('Section:');
        selectSection = $("<select/>", {
            class: 'select_option tabindex',
			name:'select_section'
        });

        //selectSectionOption = $("<option/>").attr("value", "undefined").text("Select Section");
        //selectSection.append(selectSectionOption);
        for (i = 0; i < sections.SectionContent.length; i++) {
            selectSectionOption = $("<option/>").attr("value", sections.SectionContent[i].SectionID).text(sections.SectionContent[i].chapterName);
            selectSection.append(selectSectionOption);

        }
		selectExamMode.attr("aria-label", "Please use arrow key to choose the option");
		selectSection.attr("aria-label", "Please use arrow key to choose the option");

        studyModeDiv = $('<div>', {
            class: 'button'
        });
        studyBtnInfo = $('<span>', {
            id: 'studyBtnInfo',
            class: 'studyBtnInfo tabindex',
			title:'Information',
			alt:'Infomation'
        });

        studyModeBtn = $('<div>', {
            id: 'studyModeBtn',
            class: 'tabindex'
        });
        studyModeBtn.html('Study Mode');
        studyModeDiv.append(studyModeBtn);
        studyModeDiv.append(studyBtnInfo);
		studyBtnInfo.attr("aria-label","Press Enter to listen to the information");

        examModeDiv = $('<div>', {
            class: 'button'
        });
        var examBtnInfo = $('<div>', {
            id: 'examBtnInfo',
            class: 'tabindex'
        });

        examModeBtn = $('<div>', {
            id: 'examModeBtn',
            class: 'tabindex'
        });
        examModeBtn.html('Exam Mode');
        examModeDiv.append(examModeBtn);
        examModeDiv.append(examBtnInfo);

        var headerTitle = 'Study Mode';
        var startButtonId = 'startButton';

        startButton = $('<div>', {
            class: 'button tabindex',
            id: startButtonId
        });


        startButton.html('Begin');
		startButton.attr("aria-label", "Press Enter to Begin");

        var footer = $('<div>', {
            class: 'footer'
        });
        var buttonContainer = $('<div>', {
            class: 'button-container'
        });

        buttonContainer.append(startButton);
        footer.append(buttonContainer);
        //ModeHTML.append(footer);


        //homeButtonContainer.append(studyModeDiv);
        //homeButtonContainer.append(examModeDiv);
        //homeButtonContainer.append(selectSectionlabel);
        selectSecLabDiv1.append(selectSectionlabel);
        selectSecLabDiv1.append(selectSection);
        homeButtonContainer.append(selectSecLabDiv1);
        // homeButtonContainer.append('<br/>');

        selectSecLabDiv2.append(selectExamModelabel)
        selectSecLabDiv2.append(selectExamMode)
        homeButtonContainer.append(selectSecLabDiv2);
        // homeButtonContainer.append(selectMode);
        selectSecLabDiv3.append(selectModelabel);
        selectSecLabDiv3.append(selectMode);
        selectSecLabDiv3.append(studyBtnInfo);
        homeButtonContainer.append(selectSecLabDiv3);
        // homeButtonContainer.append(studyBtnInfo);
        // homeButtonContainer.append(selectExamMode);




        //bottomTextDiv.append(Const.bottomDivText);
        bottomDiv.append(footer);

        oHtml.append(topDiv);
        oHtml.append('<div class="bottomShadow"></div>');
		oHtml.append(homeButtonContainer);
        oHtml.append(bottomDiv);
        

        studyBtnInfo.bind('click keyup', handleButtonEvents);
        examBtnInfo.bind('click keyup', handleButtonEvents);
        studyModeBtn.bind('click keyup', handleButtonEvents);
        examModeBtn.bind('click keyup', handleButtonEvents);

        selectSection.bind('change', SelectedSection);
        selectMode.bind('change', SelectedMode);
        $(startButton).unbind().bind('keyup click', Begin);
		
		

    }

    function SelectedSection(e) {
		if (e.type === 'keyup' && (e.keyCode !== 13))
            return false;
			
        gg = $(this).val();
        if ($(this).val() == 'clinicalpsychiatry') {
            selected_section = books.clinicalpsychiatry;
			Const.selected_section = "Clinicalpsychiatry"
        } else if ($(this).val() == 'treatmentacrosslifespan') {
            selected_section = books.treatmentacrosslifespan;
			Const.selected_section = "Treatmentacrosslifespan"
        } else if ($(this).val() == 'otherissuesrelevantpsychiatry') {
            selected_section = books.otherissuesrelevantpsychiatry;
			Const.selected_section = "Otherissuesrelevantpsychiatry"
        } else if ($(this).val() == 'contributionsfromssiencestopsychiatry') {
            selected_section = books.contributionsfromssiencestopsychiatry;
			Const.selected_section = "Contributionsfromssiencestopsychiatry"
        }
		 

    }

    function SelectedMode(e) {
		if (e.type === 'keyup' && (e.keyCode !== 13))
            return false;
        if ($(this).val() == 'exam') {
            // studyBtnInfo.attr('id', 'examBtnInfo');
        } else {
            studyBtnInfo.attr('id', 'studyBtnInfo');
        }
    }

    function Begin(e) {
		if (e.type === 'keyup' && (e.keyCode !== 13))
            return false;
	
        var exam_number = $('#select_exam').val();
        if ($(selectExamMode).val() == 'undefined') {
            oPopup.createPopup('Alert', 'Please select exam.');
        } else {
            if ($(selectMode).val() == 'exam') {
                oPopup.confirmPopup('Do you want Exam to be timed?');
            } else if ($(selectMode).val() == 'study') {
                $('body').html('');
                createModeView('study');
                //evts.dispatchEvent('STUDY_MODE_CLICK',{'mode_type':'STUDY'});
                $('body').append(ModeHTML);
                Const.addTabIndex();
                var oAllJson = new Array()
                for (var i = 0; i < selected_section.length; i++) {
                    oAllJson.push(selected_section[i].chapterURL)
                }
                //BACK_BUTTON_CLICK
                oJsonArray.push(exam_number);
                evts.dispatchEvent('START_STUDY_BTN_CLICK', {
                    'data': oAllJson,
                    'type': oJsonArray
                });
                //oHeader.showBackbtn();
            } else {
                oPopup.createPopup('Alert', 'Please select options.');
            }
        }
    }

    function createModeView(modeType) {
        var headerTitle;
        var startButtonId;
        if (typeof modeType == 'undefined')
            modeType = 'study';
        Const.mode = modeType;
        if (modeType == 'study') {
            headerTitle = 'Study Mode';
            startButtonId = 'startButton';
        } else {
            headerTitle = 'Exam Mode';
            startButtonId = 'ExamstartButton';
        }
        ModeHTML = $('<div>', {
            id: 'maincontainer'
        });
        var mainBody = $('<div>', {
            class: 'mainBody'
        });
        headerTitle = "Video 8";
        authorName = "";
        oHeader = new Header(authorName, headerTitle);
        oHeader.evts.addEventListener('HOME_BTN_CLICK', handleButtonEvents);
        oHeader.evts.addEventListener('BACK_BUTTON_CLICK', handleButtonEvents);
        startButton = $('<div>', {
            class: 'button tabindex',
            id: startButtonId
        });
        resetButton = $('<div>', {
            class: 'button tabindex',
            id: 'resetButton'
        });
        startButton.html('Start');
        resetButton.html('Reset');
        var footer = $('<div>', {
            class: 'footer'
        });
        var buttonContainer = $('<div>', {
            class: 'button-container'
        });
        buttonContainer.append(resetButton);
        buttonContainer.append(startButton);
        //footer.append(buttonContainer);

        header = oHeader.getHeader();
        ModeHTML.append(header);
        ModeHTML.append(mainBody);
        var examUL = $('<ul>', {
            id: 'examList'
        });
        var examLI;
        var contentCheck;
        var contentCheckbox;
        var examUL = $('<ul>', {
            id: 'examList'
        });
        var mainListDiv = $('<div>', {
            id: 'mainListDiv'
        });
        checkboxArray = [];
        examLI = $('<li>');
        contentCheck = $('<div>', {
            class: 'contentCheck'
        });
        examLI.append(mainListDiv);
        if (modeType == 'exam') {
            mainListDiv.append('<div class="contentHeading">Exams</div>');
            contentCheckbox = $('<span>', {
                class: 'check_box checkbox_unchecked chk_all',
                'data-value': 'all'
            });
            checkboxArray.push(contentCheckbox);
            contentCheck.append('<span class="select_all_div">Select all</span>');
            contentCheck.append(contentCheckbox);
            mainListDiv.append(contentCheck);
            examLI.append(mainListDiv);
            examUL.append(examLI);
            for (i = 0; i < books.ExamContent.length; i++) {
                examLI = $('<li>');
                mainListDiv = $('<div>', {
                    id: 'mainListDiv'
                });
                mainListDiv.append('<div class="contentHeading">' + books.ExamContent[i].chapterName + '</div>');
                contentCheck = $('<div>', {
                    class: 'contentCheck'
                });
                contentCheckbox = $('<span>', {
                    class: 'check_box checkbox_unchecked chk_single',
                    'data-value': books.ExamContent[i].ExamID
                });
                checkboxArray.push(contentCheckbox);
                contentCheck.append(contentCheckbox);
                mainListDiv.append(contentCheck);
                examLI.append(mainListDiv);
                examUL.append(examLI);
            }
        } else {
            mainListDiv.append('<div class="contentHeading tabindex">Table of Content</div>');
            contentCheckbox = $('<span>', {
                class: 'check_box checkbox_unchecked tabindex chk_all',
                'data-value': 'all'
            });
            checkboxArray.push(contentCheckbox);
            contentCheck.append('<span class="select_all_div">Select all</span>');
            contentCheck.append(contentCheckbox);
            mainListDiv.append(contentCheck);
            examLI.append(mainListDiv);
            examUL.append(examLI);
            for (i = 0; i < books.ExamContent.length; i++) {
                examLI = $('<li>');
                mainListDiv = $('<div>', {
                    id: 'mainListDiv'
                });
                mainListDiv.append('<div class="contentHeading">' + books.ExamContent[i].chapterName + '</div>');
                contentCheck = $('<div>', {
                    class: 'contentCheck'
                });
                contentCheckbox = $('<span>', {
                    class: 'check_box checkbox_unchecked chk_single',
                    'data-value': books.ExamContent[i].ExamID
                });
                checkboxArray.push(contentCheckbox);
                contentCheck.append(contentCheckbox);
                mainListDiv.append(contentCheck);
                examLI.append(mainListDiv);
                examUL.append(examLI);
            }
        }
        // mainBody.append(examUL);
        ModeHTML.append(footer);
        setTimeout(function() {
            var mainBodyHeight = $(window).innerHeight() - ($(footer).height() + $(header).height());
            mainBody.css({
                'height': mainBodyHeight
            });
        }, 1000);
        $('.new_class').css('height', '320px');
        $(checkboxArray).each(function(i, chkObject) {
            chkObject.unbind().bind('keyup click', handleCheckbox);
        });
        $(startButton).unbind().bind('keyup click', handleButtonEvents);
        $(resetButton).unbind().bind('keyup click', handleButtonEvents);
    }

    function handleCheckbox(e) {
        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
        if ($(this).hasClass('checkbox_checked')) {
            if ($(this).attr('data-value') == 'all') {
                $(checkboxArray).each(function(i, chkObject) {
                    $(chkObject).removeClass('checkbox_checked');
                });
            }
            $(this).removeClass('checkbox_checked');
            var index = oJsonArray.indexOf($(this).attr('data-value'));
            if (index >= 0) {
                oJsonArray.splice(index, 1);
            }
        } else {
            if ($(this).attr('data-value') == 'all') {
                $(checkboxArray).each(function(i, chkObject) {
                    $(chkObject).addClass('checkbox_checked');
                });
            }
            $(this).addClass('checkbox_checked');
        }
        oJsonArray = [];
        var all_checked = true;
        $(checkboxArray).each(function(i, chkObject) {
            if ($(chkObject).hasClass('checkbox_checked')) {
                if ($(chkObject).attr('data-value') != 'all')
                    oJsonArray.push($(this).attr('data-value'));
            }
            if ($(chkObject).hasClass('chk_single') && !$(chkObject).hasClass('checkbox_checked')) {
                all_checked = false;
            }
        });
        if (all_checked) {
            $(checkboxArray).each(function(i, chkObject) {
                $(chkObject).addClass('checkbox_checked');
            });
        } else {
            $(checkboxArray).each(function(i, chkObject) {
                if ($(chkObject).attr('data-value') == 'all') {
                    $(chkObject).removeClass('checkbox_checked');
                }
            });
        }
    }

    function handlePopupSelction(a, b, c) {
        switch (b) {
            case 'EXAM_MODE_NO_TIMED_CLICK':
                Const.timed = false;
                break;
            case 'EXAM_MODE_TIMED_CLICK':
                Const.timed = true;
                break;
        }
        var exam_number = $('#select_exam').val();
        //evts.dispatchEvent('EXAM_MODE_BTN_CLICK',{'data':oJsonArray}); // on start click of exam mode
        $('body').html('');
        createModeView('exam');
        $('body').append(ModeHTML);
        Const.addTabIndex();
		var exam = $(selectExamMode).val();
        var oAllJson = new Array()
        for (var i = 0; i < selected_section.length; i++) {
            oAllJson.push(selected_section[i].chapterURL)
        }
        //BACK_BUTTON_CLICK
        oJsonArray.push(exam_number);
        evts.dispatchEvent('EXAM_MODE_BTN_CLICK', {
            'data': oAllJson,
            'type': oJsonArray
        });
    }

    function handleButtonEvents(e, type) {
        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
        if (type == 'HOME_BTN_CLICK') {
            evts.dispatchEvent('HOME_BTN_CLICK', {
                'type': 'INIT_APP'
            });
        }
        if (type == 'BACK_BUTTON_CLICK') {
            evts.dispatchEvent('BACK_BUTTON_CLICK', {
                'type': 'INIT_APP'
            });
        }

        var type = $(e.target).attr('id');
        switch (type) {
            case 'studyBtnInfo':
                oPopup.createInfoPopup('Study Mode', Const.studyPopupInfo, 'Exam Mode', Const.examPopupInfo);
                break;
            case 'examBtnInfo':
                oPopup.createPopup('Exam Mode', Const.examPopupInfo);
                break;
            case 'studyModeBtn':
                $('body').html('');
                createModeView('study');
                //evts.dispatchEvent('STUDY_MODE_CLICK',{'mode_type':'STUDY'});
                $('body').append(ModeHTML);
                Const.addTabIndex();
                break;
            case 'examModeBtn':
                oPopup.confirmPopup('Do you want Exam to be timed?');
                break;
            case 'startButton':
                var checked = false;
                var oAllJson = new Array()
                for (var i = 0; i < selected_section.length; i++) {
                    oAllJson.push(selected_section[i].chapterURL)
                }
                $(checkboxArray).each(function(i, chkObject) {
                    if ($(chkObject).hasClass('checkbox_checked'))
                        checked = true;
                });
                if (checked) {
                    evts.dispatchEvent('START_STUDY_BTN_CLICK', {
                        'data': oAllJson,
                        'type': oJsonArray
                    });
                    oHeader.showBackbtn();
                } else {
                    oPopup.createPopup('Alert', 'Please select Exam(s).');
                }
                break;
            case 'ExamstartButton':
                var checked = false;
                $(checkboxArray).each(function(i, chkObject) {
                    if ($(chkObject).hasClass('checkbox_checked'))
                        checked = true;
                });
                if (checked) {
                    var oAllJson = new Array()
                    for (var i = 0; i < selected_section.length; i++) {
                        oAllJson.push(selected_section[i].chapterURL)
                    }
                    //BACK_BUTTON_CLICK
                    evts.dispatchEvent('EXAM_MODE_BTN_CLICK', {
                        'data': oAllJson,
                        'type': oJsonArray
                    });
                    oHeader.showBackbtn();
                } else {
                    oPopup.createPopup('Alert', 'Please select Exam(s).');
                }
                break;
            case 'resetButton':
                $(checkboxArray).each(function(i, chkObject) {
                    $(chkObject).removeClass('checkbox_checked');
                });
                $(checkboxArray).each(function(i, chkObject) {
                    $(chkObject).addClass('checkbox_unchecked');
                });
                break;
            default:
                break;
        }
    }
    createView();
    $(window).resize(function() {
        setParameters();
    });

    function setParameters() {
        //alert($(window).innerWidth())
        var bottomDivheight = $(window).innerHeight() - ($(topDiv).height() + $(homeButtonContainer).height() + 25);
        if ($(window).innerWidth() < 500) {
            $(bottomDiv).css('height', bottomDivheight);
            var buttonWidth = $(window).innerWidth() - 50;
            studyModeBtn.css('width', buttonWidth);
            examModeBtn.css('width', buttonWidth);
            $(bottomDiv).css('height', 'auto');
        } else {
            $(bottomDiv).css('height', 'auto');
            studyModeBtn.css('width', '185px');
            examModeBtn.css('width', '185px');
        }
    }
    return {
        evts: evts,
        getInitHTML: function() {
            return oHtml;
        },
        getModeHTML: function(type) {
            createModeView(type);
            return ModeHTML;
        },
        setParameters: setParameters
    }
}