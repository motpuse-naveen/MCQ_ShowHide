jqnc(document).ready(function(){
	jqnc('figure').each(function(){
		var imageData = jqnc(this).find('a').html();
		var link = jqnc(this).attr('href');
		if(imageData !=undefined){
			jqnc(this).addClass('zoomImageContainer');
			jqnc(this).find('a').each(function(){
				if(!jqnc(this).parent().is('figcaption')){
					jqnc(this).remove();
				}
			})
			jqnc(this).prepend(imageData);
			var zoomButton = jqnc('<button></button>');
			jqnc(zoomButton).attr('class','zoom-image');
			jqnc(this).prepend(zoomButton);
			// zoomButton.css('width',jqnc(this).find('img').width()+'px');
			// zoomButton.css({'height':jqnc(this).find('img').height()+'px', 'background': 'none','left': '0px'});	
			// setTimeout(function(){
			// 	zoomButton.css('height',jqnc(this).find('img').height()+'px');
			// },700);			
		}		
	})
	jqnc('.text-image, .zoom-image').bind('click keyup touchmove',onCommentClicked);
	jqnc('.close').bind('click keydown touchstart',onCommentCloseClicked);
});
var imgToLoadPath;
var isCommentOpen = false;
function onCommentClicked(e)
{		
	if(e.type == 'keyup' && (e.keyCode != 13))
		return false;


	if(e.type=='touchmove'){ //alert();
		return;
	}
	//e.stopPropagation();
	e.preventDefault();
	// alert("kkkhj");
	var n = location.href.search("ibook");

	if(n!=-1){
		//code if epub is opened on ibooks
		jqnc('.close').trigger('click');
		var newWin;
		if(jqnc(this).hasClass('zoom-image')){
			newWin = window.open('assets/image_zoom/index.xhtml?image='+ jqnc(e.target).parent().find('img').attr('src'),"_self");
			imgToLoadPath = jqnc(e.target).parent().find('img').attr('src');
		}
		else{
			newWin = window.open('assets/image_zoom/index.xhtml?image='+jqnc(e.target).attr('src'),"_self");
			imgToLoadPath = jqnc(e.target).attr('src');

		}
		newWin.imgToLoadPath = imgToLoadPath
		localStorage.setItem("imgPath", imgToLoadPath);


		return false;
	}
	
	ModalDiv = jqnc("<div/>");
	ModalDiv.attr('class','modalbg openModal vst-draggable');
	dialogDiv = jqnc("<div/>");
	dialogDiv.attr('class','dialog vst-draggable');
	ModalDiv.append(dialogDiv);
	var ImageSRC = jqnc(e.target).parent().find('img').attr('src');

	if(jqnc('body').width()>1000){
		var winWidth = jqnc('body').width()-70;
		var winHeight = jqnc(window).height()-70;	
	}else{
		var winWidth = jqnc('body').width();	
		var winHeight = jqnc(window).height()-200;	

	}

	dialogDiv.css('width',winWidth+'px');
	iframe = jqnc("<iframe/>");
	iframe.attr('src','../../assets/image_zoom/index.xhtml');
	iframe.attr('id','my_iframe');
	iframe.attr('scrolling','no');
	iframe.attr('data-img-path',ImageSRC);
	iframe.css('height',winHeight+'px');
	//iframe.css('width',winWidth+'px');
	iframe.css('width','100%');
	iframe.css('border','none');
	iframe.css('background','transparent');
	dialogDiv.append(iframe);

	closeDiv = jqnc("<div/>");
	closeDiv.attr('class','close');
	closeDiv.attr('title','Close');
	closeDiv.attr('aria-label','close popup');
	closeDiv.html('X');
	dialogDiv.append(closeDiv);

	jqnc('.modalbg').remove();

	var someImage = new Image()
    someImage.src = '../../assets/image_zoom/loading.gif';
    someImage.onload = function(e) {
        jqnc('body').append(ModalDiv);
        jqnc('body').css('overflow','hidden');
		jqnc('.close').bind('click keydown touchstart',onCommentCloseClicked);
    };		
}

function onCommentCloseClicked(e)
{	
	jqnc('.modalbg').remove();
	if(e.type == 'keydown' && (e.keyCode != 13))
		return false;
	isCommentOpen = true;
	jqnc('.modalbg').removeClass('modalbgAnimate');
	jqnc('.openModal').css('pointer-events','none');
	setTimeout(function () {
		// jqnc('.text-image').focus();
	},500);
	jqnc('body').css('overflow','auto');
}

