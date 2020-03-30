var productAPICall = (function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236/spree/api/v1';

    return {

        getSubjectsByGrade: function (selectedGrade, cb) {
            $.ajax(
                {
                    type: "GET",
                    url: url + '/products?grade=' + selectedGrade,
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
                        console.log(msg.responseText);
                    }
                });
        }
    };

}());