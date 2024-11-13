var PopupManager = function(){
	var evts = new Events();
	var pHtml;
	var pCloseBtn;
	function createPopup(popupTitle, contents){
		pHtml = $('<div>', {id:'myModal', class:'modal'});
		var modalContent = $('<div>', {class:'modal-content'});
		modalContent.append('<div class="popupHeaderMain">   \
	            	<p class="popupHeader">'+ popupTitle + '</p> \
	            	</div> \
	            <div class="popupContent">'+contents+'</div>');
        pCloseBtn = $('<span>', {class:'modal-close', 'aria-label': 'Close Popup'}).bind('click keyup',destroyPopup);
        pCloseBtn.append('<img src="images/close_win.svg" />');
        modalContent.append(pCloseBtn);
		pHtml.append(modalContent);

        $("#maincontainer").append(pHtml);
        pHtml.css("display", "block");
	}
	function confirmPopup(popupTitle, contents){
		pHtml = $('<div>', {id:'myModal', class:'modal'});
		var modalContent = $('<div>', {class:'modal-content modal-popup'});
		modalContent.append('<div class="popupHeaderMain"> </div>');
		var popupContent = $('<div>', { class:'popupContent'});
		popupContent.append(popupTitle);
		popupContent.append('<div class="clear"></div>');
		yesButton = $('<div>', {id: 'yesButton', class:'popup-button'});
		yesButton.html('Yes');
		NoButton = $('<div>', {id: 'NoButton', class:'popup-button'});
		NoButton.html('No');
		modalContent.append(popupContent);
		
		modalContent.append(yesButton)
		modalContent.append(NoButton)
	            
        pCloseBtn = $('<span>', {class:'modal-close', 'aria-label': 'Close Popup'}).bind('click keyup',destroyPopup);
        pCloseBtn.append('<img src="images/close_win.svg" />');
        modalContent.append(pCloseBtn);
		pHtml.append(modalContent);

        $("#maincontainer").append(pHtml);
        pHtml.css("display", "block");
	}
	function destroyPopup(){
		pHtml.remove();	
	}
	//createPopup();
	return{
		evts: evts,
		createPopup :createPopup,
		confirmPopup: confirmPopup,
	}
}