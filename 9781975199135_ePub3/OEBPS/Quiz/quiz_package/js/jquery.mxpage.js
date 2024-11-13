/**
 * @name MXPage.js
 * @version 0.0.2
 * @create 2015-09-15
 * @lastmodified 2015-09-15 17:36
 * @description jQuery page navigation plugin
 * @author MuFeng (http://mufeng.me)
 * @url http://mufeng.me
 **/
var arrIncorrect = [];
var arrCorrect = [];
;(function ($) {
    
    var array, MXPage = function (x, y) {
        this.settings = x;
        this.element = $(y);

        this.layout();
        
    };

    MXPage.prototype = {
        layout: function () {

            $(".mxpage-default + span.inCorrectTickMark").each(function(){
                var dataid = parseInt($(this).attr("data-page"));

                arrIncorrect.indexOf(dataid) === -1 ? arrIncorrect.push(dataid) : console.log("This item already exists");
            });
            $(".mxpage-default + span.correctTickMark").each(function(){
                var dataid = parseInt($(this).attr("data-page"));
                // arrCorrect.push(dataid);
                arrCorrect.indexOf(dataid) === -1 ? arrCorrect.push(dataid) : console.log("This item already exists");
            });

            if (this.settings.maxPage <= 1) return;

            this.fireEvent();

            //最前页
            this.build(1, 'mxpage-front', this.settings.frontPageText);

            //上一页
            this.build(Math.max(1, this.settings.currentPage - 1), 'mxpage-previous', this.settings.previousText);

            //中间页
            var start_page,
                end_page;

            if (this.settings.currentPage < this.settings.perPage / 2) {

                start_page = 1;
                end_page = Math.min(this.settings.maxPage, this.settings.perPage);
            } else if (this.settings.maxPage - this.settings.currentPage < this.settings.perPage / 2) {
                // alert(1)
                start_page = Math.max(1, this.settings.maxPage - this.settings.perPage + 1);
                end_page = this.settings.maxPage;
            } else {
                // start_page = Math.max(1, this.settings.maxPage - this.settings.perPage + 1);
                // end_page = this.settings.maxPage;
                
                start_page = Math.max(1,this.settings.currentPage - Math.ceil(this.settings.perPage / 2));
                end_page = start_page + this.settings.perPage - 1
            }

            for (start_page; start_page <= end_page; start_page++) {
                // alert(start_page);
                this.build(start_page, 'mxpage-default');
            }
            //下一页
            this.build(Math.min(this.settings.maxPage, this.settings.currentPage + 1), 'mxpage-next', this.settings.nextText);

            //最后页
            // this.build(this.settings.maxPage, 'mxpage-last', this.settings.lastPageText);

            //绑定点击事件
            this.addEvent();
            
        },

        build: function (index, className, title) {
            var addCLass = "";
            var indicatorImg = '';
            var nextPreImg = '';
            if(jQuery.inArray(index, arrIncorrect) !== -1){
                addCLass = "inCorrectTickMark";
                // indicatorImg = '<img src="../quiz_package/images/cross-small.svg" alt="" />';
            }
            else if(jQuery.inArray(index, arrCorrect) !== -1){
                addCLass = "correctTickMark";
                // indicatorImg = '<img src="../quiz_package/images/tick-small.svg" alt="" />';
            }
            title = title || index;
            if (className == 'mxpage-default') {
                if (this.settings.currentPage == index) {
                        className += ' active'
                }
            }

           /* if(className == 'mxpage-previous'){
                nextPreImg = '<img src="" alt="../images/arrow.svg" />';
            }else if(className == 'mxpage-previous'){
                nextPreImg = '<img src="" alt="../images/arrow.svg" />';
            }*/
            var html = '';
            if (className == 'mxpage-default' || className == 'mxpage-default active') {
                html = $('<li role="listitem"><button role="button" class="mxpage tabindex ' + className + '" data-page="' + index + '">' + title + '</button><span class="'+ addCLass + ' tickMark-' + (index - 1) +'" data-page="' + index + '"></span></li>')
            }
            else {
                html = $('<li role="listitem"><button role="button" class="mxpage tabindex ' + className + '" data-page="' + index + '"><img src="../quiz_package/images/arrow.svg" alt="" /></button><span class="'+ addCLass +'" data-page="' + index + '"></span></li>')    
            }  
            var that = this;
            that.element.children('.mxpage-container').append(html);

            setTimeout(function(){ 
                $('.mxpage').each(function(){
                    if($(this).hasClass('mxpage-default')){
                        var pno = $(this).attr('data-page');
                        if($(this).parent().find('.inCorrectTickMark').length>0){
                            $(this).attr('aria-label','Question '+pno+', Attempted incorrectly, Press this button to goto question '+pno+'.');
                        }else if($(this).parent().find('.correctTickMark').length>0){
                            $(this).attr('aria-label','Question '+pno+', Attempted correctly, Press this button to goto question '+pno+'.');
                        }else{
                           $(this).attr('aria-label','Question '+pno+', Not attempted, Press this button to goto question '+pno+'.');
                        }
                        
                    }else if($(this).hasClass('mxpage-next')){
                        $(this).attr('aria-label','Next question, press this button to goto next question.');
                    }else if($(this).hasClass('mxpage-previous')){
                        $(this).attr('aria-label','Previous question, press this button to goto previous question.');
                    }
                });
                $('.mxpage-previous,.mxpage-next,.mxpage-default').addClass('tabindex');
                                      
                    set_tabindex();
               
                $('.mxpage-previous,.mxpage-next,.mxpage-default,.resetButton,.resetButton2,.ACIBtn').on('click', function(event){
                     setTimeout(function(){
                        $('.mxpage-previous,.mxpage-next,.mxpage-default').addClass('tabindex');
                            set_tabindex();                        
                        $(".mxpage-next").attr('tabindex',0);   
                        $('.modal-header').show();
                        
                        var curtQuesNum = $('.questionWrapper:visible').attr('data-que');

                        var lastQuestion = $('.questionslist div.questionWrapper').eq(curtQuesNum + 1);
                        if(lastQuestion.length == 0)
                        {
                             $('.mxpage-next').attr('aria-label','Goto result page, press this button.');
                        }
                        var all_dropped = true;
                        var all_correct = true;
                        $('#dragDropContainer-'+(curtQuesNum)+' .dropspot').each(function(){
                            if($(this).attr("dropped") != 'true'){
                                all_dropped = false;
                            }
                            if($(this).find('.feedback').hasClass("incorrect")){
                                all_correct = false;
                            }
                        });
                        if(!reviewQuizEnabled){
                            $('.drag-tray').css('display','block');
                        }                        
                        if(all_dropped == true){
                            $('.droppable .dragspot').unbind('keydown touchend');
                            $("#answer-container-"+(curtQuesNum)+" .dragspotWrapper .dragspot" ).each(function(){
                                    // $(this).attr('aria-label',$(this).text().replace("Browser issues", ""))
                            })
                            if(all_correct){
                                var maxheight = $('.questionslist').outerHeight(true) + $('.drag-tray:visible').outerHeight(true);
                                $('.drag-tray').css('display','none');
                                $('.questionslist').css('height',maxheight+'px');
                            }
                        }else{
                            $('.drag-tray .answer-container:visible .dragspot_txt').unbind('keydown').bind('keydown', showDropList);
                            $('.drag-tray .answer-container:visible').find('.dragspot').off('touchend', showDropList).on('touchend', showDropList);
                        }
                         $('[data-tabindex]').each(function(){
                            $(this).attr('tabindex', $(this).attr('data-tabindex')).attr('aria-hidden',false);
                        });
                        displayReadMoreIcon();
                        setTimeout(function(){     
                            $('#chapter_heading').addClass('keybord_outline').attr('tabindex',-1).focus();
                        },600);                        

                    },400);
                })
            
            },300);
            

        },

        addEvent: function () {
            var that = this;

            that.element.on('click', '.mxpage,.ACIBtn', function (event) {
                var $this = $(this),

                    index = parseInt($this.attr('data-page'));
                if (that.settings.currentPage == index) return;
                that.settings.currentPage = index;
                that.layout();

                //回调
                that.settings.click(index, $this);
            });
            $('#confirmBox').on('click', '.ACIBtn', function (event) {
                var $this = $(this),

                    index = parseInt($this.attr('data-page'));
                if (that.settings.currentPage == index) return;
                that.settings.currentPage = index;
                that.layout();

                //回调
                that.settings.click(index, $this);
                gotoQuestion(event);
                $('#confirmOverlay').css('display','none');
            });
        },

        fireEvent: function () {
            if (this.element.children('.mxpage-container')) {
                this.element.children('.mxpage-container').remove();
                this.element.off('click');
            }

            this.element.append('<ul role="list" class="mxpage-container pagination"></ul>');
        }
    };

    $.mxpage = function (x, y) {
        //参数合并
        x = $.extend({
            perPage: 10,
            currentPage: 1,
            maxPage: 1,
            previousText: 'previous',
            nextText: 'next',
            frontPageText: 'front page',
            lastPageText: 'last page',
            click: function (index, $element) {}
        }, x);

        $.data(y, 'mxpage', new MXPage(x, y));

        return y;
    };

    $.fn.mxpage = function (x) {
        return $.mxpage(x, this);
    };
})(jQuery);