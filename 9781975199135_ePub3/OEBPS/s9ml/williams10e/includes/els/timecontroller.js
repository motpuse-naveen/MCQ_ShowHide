var TimeController = function() {
    var evts = new Events();
    var timeout = null;
    //var timer = 120;
    var timer = Const.timer;

    oTimerHTML = $('<div>');
    var timeControls = $('<div>', {
        class: 'timeControls'
    });
    btnStart = $('<div>', {
        class: 'btnStartTime',
        title: 'Start Timer'
    })
    btnPause = $('<div>', {
        class: 'btnPauseTime',
        title: 'Pause Timer'
    })
    var displayTime = $('<div>', {
        'id': 'timeText',
		'class':'tabindex'
    })
    //displayTime.append(Const.timer);
    btnStart.bind('click', startTimer);
    btnPause.bind('click', pauseTimer);
    timeControls.append(btnPause);
    timeControls.append(btnStart);

    /*		oTimerHTML.append(timeControls)
    		oTimerHTML.append(displayTime)	*/
    startTimer();

    function startTimer() {
        if (timer <= 0) {
            //timer = 120;
            timer = Const.timer;
        }
        console.log('timeout::', timeout);
        if (Const.section) {
            clearInterval(timeout);
            $('.btnStartTime').remove();
            $('.btnPauseTime').remove();
            btnStart = $('<div>', {
                class: 'btnStartTime',
                title: 'Start Timer'
            })
            btnPause = $('<div>', {
                class: 'btnPauseTime',
                title: 'Pause Timer'
            })
            btnStart.bind('click', startTimer);
            btnPause.bind('click', pauseTimer);
            $('.footer').append(btnStart);
            $('.footer').append(btnPause);
            btnPause.show();
            btnStart.hide();
            Const.section = false;
            Const.timeUp = false;
            //var displayTime = $('<div>',{'id':'timeText'})
            //displayTime.append(Const.timer);
        }
        timeout = setInterval(function() {
            TimeCountDown(timer);
        }, 1000);


        btnPause.show();
        btnStart.hide();
        evts.dispatchEvent('TIME_CONTINUE', {
            'type': 'TIME_CONTINUE'
        });
    }

    function pauseTimer() {
        console.log(timer);
        clearInterval(timeout);
        btnPause.hide();
        btnStart.show();

        evts.dispatchEvent('TIME_PAUSE', {
            'type': 'TIME_PAUSE'
        });

    }

    function clearTimer(disableBtns) {
        if (Const.timed) {
            clearInterval(timeout);
            if (disableBtns)
                btnPause.addClass('disabled');
        }
    }

    function TimeCountDown(duration) {
        //duration= 60 * duration;
        timer = timer - 1;

        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10)
        seconds = parseInt(timer % 60, 10);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        displayTime.html(hours + ':' + minutes + ':' + seconds);
        //console.log('timer',timer)
        if (timer > 0) {
            var display = document.querySelector('#time');
            //timeout = setInterval(function(){ TimeCountDown(timer); }, 1000);
        } else {
            clearInterval(timeout);
            btnPause.addClass('disabled');
            evts.dispatchEvent('TIME_UP', {
                'type': 'Incorrect'
            });
        }
    }

    return {
        evts: evts,
        getHTML: function() {
            return [displayTime, timeControls];
        },
        pauseTimer: pauseTimer,
        startTimer: startTimer,
        clearTimer: clearTimer
    }
}