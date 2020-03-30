/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/user_control.js', function () {

    var emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/;

    userControl.getUserDetails(function (data) {

        window.location.href = '../../curriculum.html';

    }, function (error) {

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

    $('#forgot_submit').click(function () {

        var email = $('#email').val();

        if (email === "") {

            $('#email').focus();
            $('#errorBox').html("Enter the email");

        }

        if (email !== "") {

            if (checkEmailPattern(email)) {
                $('#errorBox').html("");

                userControl.userForgotPassword(email, function (data) {

                    if(data.message === "check your registered mail once"){
                        $('#errorBox').html("A link has been sent to your registered email to reset your password");
                    }

                }, function err(error) {

                    var errorText = JSON.parse(error.responseText);
                    $('#errorBox').html(errorText.error);

                });

            }

        }
    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    $("#reset_password").click(function () {

        var newPassword = $('#password').val();
        var confirmPassword = $('#confirm_password').val();

        if (newPassword === "") {

            $('#password').focus();
            $('#errorBox').html("Please enter the new password");

        }else if(confirmPassword === ""){

            $('#confirm_password').focus();
            $('#errorBox').html("Please enter the confirm password");

        }

        if (newPassword !== "" && confirmPassword !== "") {

            if(newPassword === confirmPassword) {

                $('#errorBox').html("");
                var resetToken = getUrlParameter("reset_password_token");

                var resetPasswordInfo = {
                    "password": newPassword,
                    "password_confirmation": confirmPassword,
                    "reset_password_token": resetToken
                };

                userControl.userResetPassword(resetPasswordInfo, function (data) {

                    if(data && data.success){
                        $('#errorBox').html(data.message);

                        setTimeout(function () {
                            window.location.href = "/sign_in.html";
                        }, 3000);
                    }
                }, function err(error) {

                    $('#errorBox').html(error);

                });
            }else{
                $('#errorBox').html("Passwords don't match.");
            }
        }
    });

});