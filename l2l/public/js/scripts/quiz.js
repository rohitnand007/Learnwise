/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/content_control.js', function () {
    $.getScript('./js/controllers/toc_control.js', function () {

        $('#next_question').prop('disabled', true);
        $('#answer_text').hide();
        $('#show_hint').hide();

        var topicId = localStorage.getItem("topicId");

        userControl.getUserDetails(function (data) {

            localStorage.removeItem("demoContentAttempts");
            tocControl.unlockLearningPathContent(topicId, "content_3");

        }, function error(err) {

            tocControl.unlockDemoLearningPathContent(topicId, "content_3");
            // tocControl.unlockNextContent("content_3");

        });

        var rightAnsHtml = '<i class="fa fa-check rightbackround-style icon-color" aria-hidden="true"></i><span class="text-font">Well done!</span>';

        var wrongAnsHtml = '<i class="fa fa-times wrongbackround-style icon-color" aria-hidden="true"></i><span class="text-font">No problem that was a tricky one. Try again!</span>';

        var questionCount = 0,
            questions = [],
            isRightAnswer = false;

        contentControl.getQuizData(topicId, function (quizData) {

            questions = quizData.questions;

            displayQuizContent(questions[0]);

        });

        $('#next_question').click(function () {

            isRightAnswer = false;
            $('#answer_text').hide();
            $('#show_hint').hide();
            $('#next_question').prop('disabled', true);
            questionCount++;
            if (questionCount < questions.length) {
                displayQuizContent(questions[questionCount]);
            }

        });

        function displayQuizContent(question) {

            var questionNo = questionCount + 1;
            if (questionNo == questions.length) {
                $('#next_question').hide();
            }
            $('#question').html(questionNo + ". " + question.text);
            $('#optn_1').html("A. " + question.options[0]);
            $('#optn_2').html("B. " + question.options[1]);
            $('#optn_3').html("C. " + question.options[2]);
            $('#optn_4').html("D. " + question.options[3]);

            $('#preloader').fadeOut(1000, function () {
                $('#preloader').hide();
            });

        }

        function handleWrongAnswer() {

            $('#answer_text').html(wrongAnsHtml);
            $('#answer_text').show();
            $('#show_hint').show();
            $('#next_question').hide();

        }

        var pauseVideoPlayer;
        var playerInit = false;

        function initPlayerClose(videoPlayer) {

            $('#close_modal').click(function () {

                pauseVideoPlayer.pause();
                $("#video_modal").modal('hide');

            });

        }

        $('#show_hint').click(function () {

            $("#video_modal").modal({ backdrop: 'static', keyboard: false });
            var quizVideoSrc = localStorage.getItem('topicVideoPath');

            var sproutPlayerIframeTag = "<iframe class='sproutvideo-player' height='100%' src='"
                + quizVideoSrc + "?type=sd&noBigPlay=false&showcontrols=false' width='100%' frameborder='0' allowfullscreen></iframe>";

            $('#quiz_video').html(sproutPlayerIframeTag);

            var myAudio = document.getElementById('audio');

            var _duration = 0, _playing = false, _volume = 1, _fullscreen = false, audioTime = 0, audioPlaying = false,
                replay = false;
            var seek = false;

            function displayCurrentTime(currentTime) {
                var currentTimeMins = Math.floor(currentTime / 60);
                var currentTimeSecs = Math.floor(currentTime % 60);
                var totalVideoTimeMins = Math.floor(_duration / 60);
                var totalVideoTimeSecs = Math.floor(_duration % 60);

                if (totalVideoTimeMins < 10) {
                    totalVideoTimeMins = "0" + totalVideoTimeMins;
                }

                if (totalVideoTimeSecs < 10) {
                    totalVideoTimeSecs = "0" + totalVideoTimeSecs;
                }

                if (currentTimeMins < 10) {
                    currentTimeMins = "0" + currentTimeMins;
                }

                if (currentTimeSecs < 10) {
                    currentTimeSecs = "0" + currentTimeSecs;
                }

                if ((currentTimeMins === totalVideoTimeMins) && (currentTimeSecs >= totalVideoTimeSecs)) {
                    currentTimeSecs = totalVideoTimeSecs;
                }

                $("#currentVideoTime").html(currentTimeMins + ':' + currentTimeSecs);
            }


            var learningPathVideoId = localStorage.getItem('topicVideoId');

            var videoPlayer = new SV.Player({videoId: learningPathVideoId});

            pauseVideoPlayer = videoPlayer;

            videoPlayer.bind('ready', function (event) {
                _duration = event.data.duration;
                // console.log(videoPlayer.getCurrentTime()+" / "+_duration);
                var totalVideoTimeMins = Math.floor(_duration / 60);
                var totalVideoTimeSecs = Math.floor(_duration % 60);

                if (totalVideoTimeMins < 10) {
                    totalVideoTimeMins = "0" + totalVideoTimeMins;
                }

                if (totalVideoTimeSecs < 10) {
                    totalVideoTimeSecs = "0" + totalVideoTimeSecs;
                }
                $("#totalVideoTime").html(totalVideoTimeMins + ':' + totalVideoTimeSecs);
                $("#currentVideoTime").html('00:00');

                $(".progress#video-slider").slider("option", "max", _duration);
//            $(".volume h4").html(100);
                $(".progress#volume-slider").slider("option", "max", 100).slider("option", "value", 100).hide();

                videoPlayer.play();

            });

            videoPlayer.bind('progress', function (event) {
                //console.log(event.data.time);
                audioTime = event.data.time;
                if (!seek) {
                    seek = true;
                    videoPlayer.seek(200);
                    displayCurrentTime(200);
                } else {
                    displayCurrentTime(event.data.time);
                }

                $('.progress#video-slider').slider("option", "value", (event.data.time));

            });

            videoPlayer.bind('completed', function (event) {
                replay = true;
                $('.play-pause a').html('<img src="images/icn_replay.svg" height="25px">');
            });

            videoPlayer.bind('pause', function (event) {

                var roundingTime = Math.floor(videoPlayer.getCurrentTime() * 1000) / 1000;
                videoPlayer.seek(roundingTime);
                _playing = false;
                if(audioPlaying){
                    $('.play-pause a').html('<img src="images/icn_pauseVideo.svg" height="25px">');
                }else {
                    $('.play-pause a').html('<img src="images/icn_play.svg" height="25px">');
                }

            });

            videoPlayer.bind('play', function (event) {
                console.log("play");
                if (audioPlaying) {
                    myAudio.pause();
                    audioPlaying = false;
                    videoPlayer.seek(myAudio.currentTime);
                }

                if (replay) {
                    replay = false;
                    videoPlayer.seek(0);
                }

                _playing = true;
                $('.ui-slider-handle').hide();
                $('.play-pause a').html('<img src="images/icn_pauseVideo.svg" height="25px">');
            });

            videoPlayer.bind('volume', function (event) {
                _volume = event.data;
                //console.log(_volume);

                if (_volume > 0.75) {
                    $('#volume-icon').html('<img src="images/icn_speaker.svg" height="25px">');
                } else if (_volume === 0) {
                    $('#volume-icon').html('<img src="images/icn_mute.svg" height="25px">')
                } else if (_volume >= 0.3 && _volume <= 0.7) {
                    $('#volume-icon').html('<img src="images/icn_volume_medium.svg" height="25px">')
                } else if (_volume < 0.3) {
                    $('#volume-icon').html('<img src="images/icn_volume_low.svg" height="25px">')
                }
            });


            $('.play-pause a').click(function () {
                if (!_playing) {
                    if (audioPlaying) {
                        //console.log(myAudio.currentTime);
                        myAudio.pause();
                        audioPlaying = false;
                        videoPlayer.seek(myAudio.currentTime);
                        videoPlayer.play();
                    } else {
                        videoPlayer.play();
                    }
                } else {
                    videoPlayer.pause();
                }
            });

            $('#volume-icon').click(function () {
                if (_volume === 0) {
                    _volume = 1;
                } else {
                    _volume = 0;
                }
                videoPlayer.setVolume(_volume);
//            $(".volume h4").html(_volume*100);
                $(".progress#volume-slider").slider("option", "value", _volume * 100);
            });

            $(".volume").on('mouseover', function () {
//           console.log("Mouse over");
                $(".progress#volume-slider").show();
            }).on('mouseout', function () {
//            console.log("Mouse Out");
                $(".progress#volume-slider").hide();
            });

            $('.settings a').click(function () {
                console.log(videoPlayer.getVolume());
                console.log(videoPlayer.getCurrentTime());
                console.log(videoPlayer.getPercentLoaded());
                console.log(videoPlayer.getDuration());
                //console.log(videoPlayer.getEmail());
                //console.log(videoPlayer.toggleHD());
            });

            $('.pause-video a').click(function () {
                if (!audioPlaying && _playing === true) {
                    audioPlaying = true;
                    videoPlayer.pause();
                    myAudio.currentTime = audioTime;
                    myAudio.play();
                } else if(audioPlaying){
                    myAudio.pause();
                    audioPlaying = false;
                    videoPlayer.seek(myAudio.currentTime);
                    videoPlayer.play();
                }
            });

            myAudio.ontimeupdate = function () {
                console.log("ss", myAudio.currentTime);
                $('.progress#video-slider').slider("option", "value", (myAudio.currentTime));
                displayCurrentTime(myAudio.currentTime)
            };

            $('.fullscreen a').click(function () {
                var elem = $('.video-player')[0];
                if (!_fullscreen) {
                    $('.learningpath-sprout-video').css('height', '100vh');

                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    }
                    // _fullscreen = true;
                    $('.fullscreen a').html('<img src="images/icn_exit%20fullscreen.svg" height="25px">');
                } else {
                    $('.learningpath-sprout-video').css('height', '80vh');

                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    // _fullscreen = false;
                    $('.fullscreen a').html('<img src="images/icn_Enter%20fullscreen.svg" height="25px">');
                }
            });

            $('.progress#video-slider').slider({
                value: 0,
                orientation: "horizontal",
                range: "min",
                animate: true,
                slide: function (event, ui) {
                    console.log(JSON.stringify(ui));
                    if (audioPlaying) {
                        myAudio.currentTime = ui.value;
                    } else {
                        videoPlayer.seek(ui.value);
                    }
                }
            });

            $('.progress#volume-slider').slider({
                value: 0,
                orientation: "horizontal",
                range: "min",
                animate: true,
                slide: function (event, ui) {
//                $(".volume h4").html(ui.value);
                    console.log(ui.value);
                    if (audioPlaying) {
                        myAudio.volume = ui.value / 100;
                    } else {
                        videoPlayer.setVolume(ui.value / 100);
                    }
//                $(".progress#volume-slider").slider("option", "value", _volume*100);
                }
            });

            if (!playerInit) {
                playerInit = true;
                initPlayerClose();
            }


            function fullScreenHandler() {
                if(_fullscreen){
                    $('.learningpath-sprout-video').css('height', '80vh');

                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    _fullscreen = false;
                    $('.fullscreen a').html('<img src="images/icn_Enter%20fullscreen.svg" height="25px">');
                }else {
                    _fullscreen = true;
                }
            }
            if('onfullscreenchange' in document){
                document.addEventListener('fullscreenchange', fullScreenHandler);
            }
            if('onmozfullscreenchange' in document){
                document.addEventListener('mozfullscreenchange', fullScreenHandler);
            }
            if('onwebkitfullscreenchange' in document){
                document.addEventListener('webkitfullscreenchange', fullScreenHandler);
            }
            if('onmsfullscreenchange' in document){
                console.log("onmsfullscreenchange");
                document.onmsfullscreenchange = fullScreenHandler;
            }
        });


        function handleRightAnswer() {

            $('#answer_text').html(rightAnsHtml);
            $('#answer_text').show();
            $('#show_hint').hide();
            $('#next_question').show();
            $('#next_question').prop('disabled', false);
        }

        $('#optn_1').click(function () {
            handleRightAnswer();
            isRightAnswer = true;
        });

        $('#optn_2').click(function () {
            if (!isRightAnswer) {
                handleWrongAnswer();
            }
        });

        $('#optn_3').click(function () {
            if (!isRightAnswer) {
                handleWrongAnswer();
            }
        });

        $('#optn_4').click(function () {
            if (!isRightAnswer) {
                handleWrongAnswer();
            }
        });

        $('#logo_icon').click(function () {

            userControl.getUserDetails(function (data) {

                if (data) {
                    window.location.href = '/curriculum.html';
                }

            }, function error(err) {
                window.location.href = '/index.html'
            });

        });

    });
});
