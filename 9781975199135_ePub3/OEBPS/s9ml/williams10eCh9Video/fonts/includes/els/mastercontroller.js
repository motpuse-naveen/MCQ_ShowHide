(function(player){
	var oPopup;
	var oQue;
	//document.ready and execute init
	$(document).ready(function(){
		init();
	});

	function init() {
		oMainSelection = new MainSelection();
		oPopup = new PopupManager();
		oMainSelection.evts.addEventListener('INFO_BTN_CLICK',handleMainEvents);
		oMainSelection.evts.addEventListener('STUDY_MODE_CLICK',handleMainEvents);
		oMainSelection.evts.addEventListener('EXAM_MODE_CLICK',handleMainEvents);
		oMainSelection.evts.addEventListener('HOME_BTN_CLICK',handleMainEvents);
		oMainSelection.evts.addEventListener('START_STUDY_BTN_CLICK',handleMainEvents);
		oMainSelection.evts.addEventListener('RESET_STUDY_BTN_CLICK',handleMainEvents);
		$('body').append(oMainSelection.getInitHTML());
		/*oQue = new QuestionController();
		$('body').append(oQue.getHTML());*/
	}
	function reset(){
		$('body').html('');
		init();
	}
	function handleMainEvents(e,type,data) {
		console.log('type',type)
		//console.log('data',data)
		switch(type){
			case 'INFO_BTN_CLICK':
			var popupTitle;
			var popupContents;
			if(data.type == 'STUDY_POPUP') {
				popupTitle = 'Study Mode';
				popupContents = Const.studyPopupInfo;
			}
			else{
				popupTitle = 'Exam Mode';
				popupContents = Const.examPopupInfo;
			}
				console.log(popupTitle +'Show study info popup');
				oPopup.createPopup(popupTitle, popupContents);
			break;
			case 'STUDY_MODE_CLICK':
				console.log('Show study  Page');
				$('body').html('');
				$('body').append(oMainSelection.getModeHTML('Study'));
			break;
			case 'EXAM_MODE_CLICK':
				console.log('Show exam  Page');
				oPopup.confirmPopup('Do you want Exam to be timed?');
			break;
			case 'HOME_BTN_CLICK':
				console.log('home button exam  Page');
				reset();
			break;
			case 'START_STUDY_BTN_CLICK' :
				$('.mainBody').html('');
				$('.footer').html('');
				//$('.mainBody').append(oMainSelection.getStudyModeHTML());
				oQue = new QuestionController();
				$('.mainBody').append(oQue.getHTML());
				//$('body').append(oQue.getHTML());
//				$('body').append(oMainSelection.getStudyModeHTML());
			break;
		}
	}
})(ELSExamView = ELSExamView || {})
var ELSExamView;