(function(app) {
    app.examData = '';
    app.userAnswer = [];
    app.scale = 1;
    app.currentSet = 0;
    app.blockStart = 0;
    app.blockEnd = 0;
    app.moved = false;
    app.section = false;
    app.timeUp = false;
    app.leftPos = 0
    app.topPos = 0
    app.maxX = 0
    app.maxY = 0
    app.atmpt = 0
    app.totalSection = 4
    app.uid = 0
    app.timed = false;
    app.questionData = new Array();
    app.timer = 1 * 3600;
	app.quesSets = 3;
    //app.timer = 12;
    app.loName;
    app.searchKeyword;
    app.topTitle1 = "";
    app.topTitle2 = 'Video 11';
    app.authorName = '';
    app.editionText = '';
    app.bottomDivText = '';
    app.studyPopupInfo = "In this mode, the student can take all the questions using next and previous buttons. The student is given 3 chances to provide the correct one. If not, the correct answer will display.";
    app.examPopupInfo = "In this mode, the time limit is set to 2 hours for each question block containing 60 questions each. There are 4 blocks in each exam. The questions will be asked randomly from the set. Once the student submits the answer, the next question is presented and so on. The student can pause the test when they want to do so. After completion of the test, the student will be able to view/print their results.";
    app.mode = 'study';
    app.helplist = [{
            'icon': 'next_help.svg',
            'class': 'next_ico',
            'title': 'Next button',
			'alt':'Next Button',
            'description': 'The Next button loads the next question.'
        },
        {
            'icon': 'back_help.svg',
            'class': 'previous_ico',
            'title': 'Previous button',
			'alt':'Previous Button',
            'description': 'The Previous button loads the previous question.'
        },
        {
            'icon': 'pause_help.svg',
            'class': 'pause_ico',
            'title': 'Pause button',
			'alt':'Pause Button',
            'description': 'The Pause button stops the test temporarily.'
        },
        {
            'icon': 'play_help.svg',
            'class': 'play_ico',
            'title': 'Play button',
			'alt':'Play Button',
            'description': 'The Play button starts the test.'
        },
        {
            'icon': 'help_help.svg',
            'class': 'help_ico',
            'title': 'Help button',
			'alt':'Help Button',
            'description': 'The Help button loads the current screen with brief explaination of the interface elements.'
        },
        {
            'icon': 'home_help.svg',
            'class': 'home_ico',
            'title': 'Home button',
			'alt':'Home Button',
            'description': 'The Home button takes you to the home page of current section.'
        },

        {
            'icon': 'submit_help.svg',
            'class': 'submit_ico',
            'title': 'Submit button',
			'alt':'Submit Button',
            'description': 'The Submit button submits the answer.'
        },
        {
            'icon': 'view_rslt_help.svg',
            'class': 'result_ico',
            'title': 'View Result button',
			'alt':'View Result Button',
            'description': 'The View Result button displays detailed report of your performance in each section.'
        },
        {
            'icon': 'rvl_help.svg',
            'class': 'reveal_ico',
            'title': 'Reveal Answer button',
			'alt':'Reveal Answer Button',
            'description': 'The Reveal Answer button shows the correct answer.'
        },
        {
            'icon': 'attempts_help.svg',
            'class': 'attempts_ico',
            'title': 'Attempts',
			'alt':'Attempts',
            'description': 'The attempts indicator displays the number of attempts available for each activity.'
        },
        {
            'icon': 'timer_help.svg',
            'class': 'timer_ico',
            'title': 'Timer',
			'alt':'Timer',
            'description': 'The timer displays time available for you to complete the section.'
        },
        {
            'icon': 'flag_grey.svg',
            'class': 'home_icoFlagGrey',
            'title': 'Add Bookmark',
			'alt':'Add Bookmark',
            'description': 'The Add Bookmark button bookmarks the current visible question.'
        },
        {
            'icon': 'flag_main.svg',
            'class': 'home_icoFlagMain',
            'title': 'View Bookmark',
			'alt':'View Bookmark',
            'description': 'The Bookmark button allows you to view and jump to a bookmarked question.'
        },
        {
            'icon': 'goto_help.svg',
            'class': 'result_ico',
            'title': 'Go To',
			'alt':'Go To',
            'description': 'The Go To button allows you to jump to a specific available question.'
        },
    ]
	app.selected_section = "ADHD A2";
    app.TimerInstance = "";
    app.CurrentActiveQuestion = 1;
    app.totalExamSET = 0;
    app.currentSection = 1;
    app.selected_section_video = 1;
   
    app.totalExamQuestions = 0;
    app.examSeq = new Array();
    app.currentQuestionsSet = ""
    app.currectUserAnswers = "";
    app.studentName = null;
    app.resultArray = [];
    app.bookmarkData = [];
    //app.questionsData =[1,2,3,4,5,6,7,8,9,10];
    app.questionsData = [];


    app.addTabIndex = function() {
        var tab_index = 0;
        $(".tabindex:visible").each(function(index) {
            if (!$(this).attr('disabed')) {
                $(this).attr("tabindex", 0);
                tab_index++;
            }
        });
    };
    app.removeTabIndex = function() {
        $(".tabindex:visible").each(function(index) {
            $(this).attr("tabindex", -1);
        });
    };
    app.isMobile = function() {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    };



})(Const = Const || {})
var Const