var MainSelection = function(){
	var oHtml;
	var studyModeHTML;
	var studyHTML;
	var evts = new Events();
	var topDiv;
	var bottomDiv;
	var studyModeBtn;
	var examModeBtn;

	function createView(){
		oHtml = $('<div>', {id: 'maincontainer'});
		var topHeading1 = $('<h2>',{class:'topHeading1'});
		topHeading1.append(Const.topTitle1);
		var topHeading2 = $('<h1>' ,{class:'topHeading2'});
		topHeading2.append(Const.topTitle2);
		topDiv = $('<div>', {class: 'topDiv'});
		topDiv.append(topHeading1);
		topDiv.append(topHeading2);
		topDiv.append('<hr>');
		topDiv.append('<h2 class="authorName">'+Const.authorName+'</h2>');
		topDiv.append('<h4 class="editionText">'+Const.editionText+'</h4>');

		bottomDiv = $('<div>', {class: 'bottomDiv'});
		bottomTextDiv = $('<div>', {class: 'bottomTextDiv'});
		var buttonContainer = $('<div>', {class: 'button-container'});

		studyModeDiv = $('<div>', {class:'button'});
		var studyBtnInfo = $('<div>', {id: 'studyBtnInfo'});

		studyModeBtn = $('<div>', {id: 'studyModeBtn'});
		studyModeBtn.html('Study Mode');
		studyModeDiv.append(studyModeBtn);
		studyModeDiv.append(studyBtnInfo);
		
		examModeDiv = $('<div>', {class:'button'});
		var examBtnInfo = $('<div>', {id: 'examBtnInfo'});

		examModeBtn = $('<div>', {id: 'examModeBtn'});
		examModeBtn.html('Exam Mode');
		examModeDiv.append(examModeBtn);
		examModeDiv.append(examBtnInfo);

		buttonContainer.append(studyModeDiv);
		buttonContainer.append(examModeDiv);

		bottomTextDiv.append(Const.bottomDivText);
		bottomDiv.append(bottomTextDiv);
		bottomDiv.append(buttonContainer);

		oHtml.append(topDiv);
		oHtml.append('<div class="bottomShadow"></div>');

		oHtml.append(bottomDiv);
		studyBtnInfo.bind('click',handleButtonEvents);
		examBtnInfo.bind('click',handleButtonEvents);
		studyModeBtn.bind('click',handleButtonEvents);
		examModeBtn.bind('click',handleButtonEvents);
	}
	function creteStudyModeView() {
		studyModeHTML = $('<div>', {id: 'maincontainer'});
		var header = $('<div>', {class: 'header'});
		var mainBody = $('<div>', {class: 'mainBody'});
		homeButton = $('<div>', { class: 'homeButton'});
		homeImg = $('<img id="homeButton" src="images/home.svg" >');
		homeButton.append(homeImg);
		startButton = $('<div>', {class: 'button', id:'startButton'});
		resetButton = $('<div>', {class: 'button'});
		startButton.html('Start');
		resetButton.html('Reset');

		helpButton = $('<div>', {class: 'helpButton'});
		helpButton.append('<img src="images/help.svg" >');

		header.append(homeButton);
		header.append('<div class="modeTitle">Study Mode</div>');
		header.append(helpButton);

		var footer = $('<div>', {class: 'footer'});
		var buttonContainer = $('<div>', {class: 'button-container'});
		buttonContainer.append(startButton);
		buttonContainer.append(resetButton);
		footer.append(buttonContainer);
		studyModeHTML.append(header);
		studyModeHTML.append(mainBody);
		var examUL = $('<ul>', {id: 'examList'});
			examUL.append('<li><div class="contentHeading">Table of Content</div> <div class="contentCheck"> Select all <span class="check_box checkbox_unchecked" data-val="all"></span></div></li>') ;

		for (i=0;i<books.content.length;i++)
		{
			examUL.append('<li><div class="contentHeading">'+books.content[i].chapterName+'</div> <div class="contentCheck"> <span class="check_box checkbox_unchecked" data-value="'+books.content[i].chapterURL+'"></span></div></li>') ;
		} 
		mainBody.append(examUL);
		studyModeHTML.append(footer);
		setTimeout(function(){
			var mainBodyHeight = $(window).innerHeight() - ($(footer).height()+$(header).height());
        	mainBody.css({'height':mainBodyHeight});
			homeButton.bind('click',handleButtonEvents);
			$(".check_box").unbind().bind('keyup click',handleRadio);
			$(startButton).unbind().bind('keyup click',handleButtonEvents);
		},1200);
	}
	function creteStudyView() {
		studyModeHTML = $('<div>', {id: 'maincontainer'});
		var header = $('<div>', {class: 'header'});
		var mainBody = $('<div>', {class: 'mainBody'});
		homeButton = $('<div>', { class: 'homeButton'});
		homeImg = $('<img id="homeButton" src="images/home.svg" >');
		homeButton.append(homeImg);
		startButton = $('<div>', {class: 'button', id:'startButton'});
		resetButton = $('<div>', {class: 'button', id:'resetButton'});
		startButton.html('Start');
		resetButton.html('Reset');

		helpButton = $('<div>', {class: 'helpButton'});
		helpButton.append('<img src="images/help.svg" >');

		header.append(homeButton);
		header.append('<div class="modeTitle">Study Mode</div>');
		header.append(helpButton);

		var footer = $('<div>', {class: 'footer'});
		var buttonContainer = $('<div>', {class: 'button-container'});
		buttonContainer.append(startButton);
		buttonContainer.append(resetButton);
		footer.append(buttonContainer);
		studyModeHTML.append(header);
		studyModeHTML.append(mainBody);
		var examUL = $('<ul>', {id: 'examList'});
			examUL.append('<li><div class="contentHeading">Table of Content</div> <div class="contentCheck"> Select all <span class="check_box checkbox_unchecked" data-val="all"></span></div></li>') ;

		for (i=0;i<books.content.length;i++)
		{
			examUL.append('<li><div class="contentHeading">'+books.content[i].chapterName+'</div> <div class="contentCheck"> <span class="check_box checkbox_unchecked" data-value="'+books.content[i].chapterURL+'"></span></div></li>') ;
		} 
		mainBody.append(examUL);
		studyModeHTML.append(footer);
		setTimeout(function(){
			var mainBodyHeight = $(window).innerHeight() - ($(footer).height()+$(header).height());
        	mainBody.css({'height':mainBodyHeight});
			homeButton.bind('click',handleButtonEvents);
			$(".check_box").unbind().bind('keyup click',handleRadio);
			$(startButton).unbind().bind('keyup click',handleButtonEvents);
			$(resetButton).unbind().bind('keyup click',handleButtonEvents);
		},1200);
	}
	function handleRadio(e) {
        if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;
        console.log($(this));
        console.log($(this).attr('data-val'))
        if($(this).hasClass('checkbox_checked')){
        	//$(this).removeClass('checkbox_unchecked').attr('aria-label','radio button');
        	if($(this).attr('data-val') =='all'){
        		$('.check_box').removeClass('checkbox_checked');
        	}
        	$(this).removeClass('checkbox_checked');
        }
        else{
        	if($(this).attr('data-val') =='all'){
        		$('.check_box').addClass('checkbox_checked');
        		//$('.check_box').removeClass('checkbox_checked');
        	}
        	$(this).addClass('checkbox_checked');
        }
    }

	function handleButtonEvents(e) {
		var type = $(e.target).attr('id');
		console.log($(e.target));
		switch(type) {
			case 'studyBtnInfo' :
				evts.dispatchEvent('INFO_BTN_CLICK',{'type':'STUDY_POPUP'});
			break;
			case 'examBtnInfo' :
				evts.dispatchEvent('INFO_BTN_CLICK',{'type':'EXAM_POPUP'});
			break;
			case 'studyModeBtn' :
				evts.dispatchEvent('STUDY_MODE_CLICK',{'type':'STUDY_MODE'});
			break;
			case 'examModeBtn' :
				evts.dispatchEvent('EXAM_MODE_CLICK',{'type':'EXAM_MODE'});
			break;
			case 'homeButton' :
				evts.dispatchEvent('HOME_BTN_CLICK',{'type':'INIT_APP'});
			break;
			case 'startButton' :
				evts.dispatchEvent('START_STUDY_BTN_CLICK',{'type':'START_STUDY'});
			break;
			case 'resetButton' :
				$('.check_box').removeClass('checkbox_checked');
				$('.check_box').addClass('checkbox_unchecked');
			break;
			default:
			break;
		}
	}
	createView();
	creteStudyModeView();
	creteStudyView();
	return{
		evts:evts,
		getInitHTML:function(){
			return oHtml;
		},
		getStudyModeHTML:function(){
			return studyModeHTML;
		},
		getStudyHTML:function(){
			return studyHTML;
		}
	}
}