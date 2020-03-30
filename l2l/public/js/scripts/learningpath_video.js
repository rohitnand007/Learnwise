/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/content_control.js', function () {
    $.getScript('./js/controllers/toc_control.js', function () {

        /*$('#preloader').fadeOut(1000, function () {
            $('#preloader').hide();
        });*/

        var topicId = localStorage.getItem("topicId");
        var videoScriptText = [];
        var unlockLearningQuiz = false;

        userControl.getUserDetails(function (data) {

            localStorage.removeItem("demoContentAttempts");
            tocControl.unlockLearningPathContent(topicId, "content_3");

        }, function error(err) {

            tocControl.unlockDemoLearningPathContent(topicId, "content_3");
            // tocControl.unlockNextContent("content_3");

        });

        var _fullscreen = false;
        contentControl.getVideoContent(topicId, function (scriptContent) {

            var learningPathSproutVideoSrc = localStorage.getItem('topicVideoPath');

            var sproutPlayerIframeTag = "<iframe class='sproutvideo-player' height='100%' src='"
                + learningPathSproutVideoSrc + "?type=sd&noBigPlay=false&showcontrols=false' width='100%' frameborder='0' allowfullscreen></iframe>";

            $('#learningpath_sprout_video').html(sproutPlayerIframeTag);

            // } else {
            //     $('#video_screenshot_button').show();
            // }


            videoScriptText = JSON.parse("[" + scriptContent.script_text + "]");

            var scriptText, scriptContentPTag;
            for (scriptText in videoScriptText) {
                scriptContentPTag = '<p>' + videoScriptText[scriptText] + '</p>';
                $('#script_content').append(scriptContentPTag);
            }


            var myAudio = document.getElementById('audio');

            var _duration = 0, _playing = false, _volume = 1, audioTime = 0, audioPlaying = false,
                replay = false;

            var learningQuizCheck = 0;

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

            videoPlayer.bind('ready', function (event) {
                $('#preloader').hide();
                _duration = event.data.duration;
                learningQuizCheck = _duration * 0.8;

                console.log(videoPlayer.getCurrentTime() + " / " + _duration + " / " + learningQuizCheck);
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

            });

            videoPlayer.bind('progress', function (event) {
                //console.log(event.data.time);
                audioTime = event.data.time;
                if (!unlockLearningQuiz && audioTime >= learningQuizCheck) {
                    unlockLearningQuiz = true;
                    $("#quizBtn").addClass("btn-quiz-active");
                    $(".right-arrow-icon").css("color", "#f03f69");
                }
                displayCurrentTime(event.data.time);
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
                displayCurrentTime(myAudio.currentTime);
                if (!unlockLearningQuiz && myAudio.currentTime >= learningQuizCheck) {
                    unlockLearningQuiz = true;
                    $("#quizBtn").addClass("btn-quiz-active");
                    $(".right-arrow-icon").css("color", "#f03f69");
                }
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

        });

        $('#takeScreenshot').click(function () {

            contentControl.getVideoScreenshot();

        });

        $('#quizBtn').click(function () {

            if (unlockLearningQuiz) {
                window.location.href = '../../quiz.html';
            } else {
                alert("Please complete atleast 80% of the video to unlock quiz");
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
});