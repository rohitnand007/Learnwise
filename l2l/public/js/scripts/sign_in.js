/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/user_control.js', function () {

    var emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/;

    userControl.getUserDetails(function (data) {

        window.location.href = '../../curriculum.html';

    }, function (error) {

        document.getElementById("email").focus();

        $('select').material_select();

        $('#preloader').fadeOut(1000, function () {
            $('#preloader').hide();
        });

    });

    function checkEmailPattern(email) {

        if (!emailRegex.test(email)) {
            $('#errorBox').html("Enter valid email");
            return false;
        } else {
            return true;
        }
    }

    function getUserData() {

        userControl.getUserDetails(function (data) {

            var url = window.location.protocol + '//' + window.location.hostname;

            if (window.location.port) {
                url = window.location.protocol + '//' + window.location.hostname + ':'
                    + window.location.port;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            var redirectUrl = localStorage.getItem('previousUrl');
            if(redirectUrl.includes("index.html") || redirectUrl == url+'/') {
                window.location.href = "../../curriculum.html";
            } else {
                window.location.href = redirectUrl;
            }

        }, function err () {
            console.log("error get user details");
        });

    }

    $('#login').click(function () {

        var email = $('#email').val();
        var password = $('#password').val();

        if (email === "") {

            $('#email').focus();
            $('#errorBox').html("Enter the email");

        } else if (password === "") {
            console.log(password);
            $('#password').focus();
            $('#errorBox').html("Enter the password");

        }

        if (email !== "") {

            if (checkEmailPattern(email) && password !== "") {
                $('#errorBox').html("");
                var credentials = "user[email]=" + email + "&user[password]=" + password;

                userControl.userLogin(credentials, function () {

                    getUserData();

                }, function err(error) {

                    var errorText = JSON.parse(error.responseText);
                    $('#errorBox').html(errorText.error);

                });

            }

        }

    });

});
