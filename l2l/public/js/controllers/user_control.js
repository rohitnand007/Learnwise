var userControl = (function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    return {

        isUserLoggedIn: function () {
            if (localStorage['user']) {
                return localStorage['user'];
            }
        },

        getUserDetails: function (cb, err) {
            $.ajax({
                type: "GET",
                url: url + '/get_user_details.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                success: cb,
                error: err
            });

        },

        userSignUp: function (user, cb, err) {
            $.ajax({
                type: 'POST',
                url: url + "/users.json",
                dataType: 'json',
                headers: {
                    'token': 'fpix2018',
                    'Access-Control-Allow-Origin': '*'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                data: {user: user},
                success: cb,
                error: err
            });
        },

        userLogin: function (credentials, cb, err) {
            $.ajax({
                method: "POST",
                url: url + '/users/sign_in.json?' + credentials,
                crossDomain: true,
                headers: {
                    'token': 'fpix2018',
                    'Access-Control-Allow-Origin': '*',
                    "Authorization": "Basic ZnBpeGFkbWluOnRlc3Rjb250ZW50dXNlcg=="
                },
                xhrFields: {
                    'withCredentials': true
                },

                dataType: "json",
                success: cb,
                error: err
            });
        },

        userLogout: function (cb) {
            $.ajax({
                type: "DELETE",
                url: url + '/users/sign_out.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                success: cb,
                error: function (msg) {
                    console.log(msg);
                }
            });
        },

        saveUserPreference: function (key, value, cb, err) {

            var profilePreference = {};

                profilePreference[key] = value;
            $.ajax({
                type: 'POST',
                url: url + "/add_user_preference.json",
                dataType: 'json',
                headers: {
                    'token': 'fpix2018',
                    'Access-Control-Allow-Origin': '*'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                data: {
                    "profile_preference": JSON.stringify(profilePreference)
                },
                success: cb,
                error: err
            });
        },

        getUserOrders: function (cb, err) {
            $.ajax({
                type: "GET",
                url: url + '/orders/order_history.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                success: cb,
                error: err
            });

        },

        userForgotPassword: function (userEmail, cb, err) {
            var user = { "email": userEmail };
            $.ajax({
                type: 'POST',
                url: url + "/users/password.json",
                dataType: 'json',
                headers: {
                    'token': 'fpix2018',
                    'Access-Control-Allow-Origin': '*'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                data: {
                    "user": user
                },
                success: cb,
                error: err
            });
        },

        userResetPassword: function (resetPasswordInfo, cb, err) {

            $.ajax({
                type: 'PUT',
                url: url + "/users/password.json",
                dataType: 'json',
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                data: {
                    "user": resetPasswordInfo
                },
                success: cb,
                error: err
            });
        }

    };

}());