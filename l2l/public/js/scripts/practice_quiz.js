/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/content_control.js', function () {
    $.getScript('./js/controllers/toc_control.js', function () {

        $('#next_question').prop('disabled', true);
        $('#answer_text').hide();
        $('#simplified_question').hide();
        $('#correct_answer').hide();

        var topicId = localStorage.getItem("topicId");

        tocControl.unlockLearningPathContent(topicId, "content_5");

        var rightAnsHtml = '<i class="fa fa-check rightbackround-style icon-color" aria-hidden="true"></i><span class="text-font">Well done!</span>';

        var wrongAnsHtml = '<i class="fa fa-times wrongbackround-style icon-color" aria-hidden="true"></i><span class="text-font">No problem that was a tricky one. Try again!</span>';

        var questionCount = 0, wrongAnswerCount = 0,
            questions = [],
            isRightAnswer = false;

        function hideLoaderImage() {
            $('#preloader').fadeOut(1000, function () {
                $('#preloader').hide();
            });
        }

        contentControl.getQuizData(topicId, function (quizData) {

            hideLoaderImage();

            questions = quizData.questions;

            displayQuizContent(questions[0]);

        });

        $('#next_question').click(function () {

            isRightAnswer = false;
            wrongAnswerCount = 0;
            $('#answer_text').hide();
            $('#simplified_question').hide();
            $('#correct_answer').hide();
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

            wrongAnswerCount++;

            console.log("c", wrongAnswerCount);

            $('#answer_text').html(wrongAnsHtml);
            $('#answer_text').show();
            $('#next_question').prop('disabled', true);

            if (wrongAnswerCount == 1) {
                $('#simplified_question').show();
            }

            if (wrongAnswerCount == 2) {
                $('#simplified_question').hide();
                $('#correct_answer').show();
                $('#next_question').prop('disabled', false);
                $('#answer_text').hide();
            }

        }

        function handleRightAnswer() {

            $('#answer_text').html(rightAnsHtml);
            $('#answer_text').show();
            $('#next_question').prop('disabled', false);
            //$('#simplified_question').hide();
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

        $('#mq_1').click(function () {
            handleRightAnswer();
            isRightAnswer = true;
        });

        $('#mq_2').click(function () {
            if (!isRightAnswer) {
                handleWrongAnswer();
            }
        });

        $('#mq_3').click(function () {
            if (!isRightAnswer) {
                handleWrongAnswer();
            }
        });

        $('#mq_4').click(function () {
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

