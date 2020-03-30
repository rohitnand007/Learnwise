var contentControl = (function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    return {

        getQuizData: function (topicId, cb) {
            $.ajax(
                {
                    type: "GET",
                    url: url + '/quiz/data/' + topicId + '.json',
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
        },

        getVideoContent: function (topicId, cb) {
            $.ajax({
                type: "GET",
                url: url+ "/contents/script/" + topicId + ".json",
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
                error: function (error) {
                    console.log("Error")
                }
            });
        },

        getVideoScreenshot: function (videoTime, cb) {
            console.log(videoTime);
            /*$.ajax({
                type: "GET",
                url: "https://www.cruiseandmaritime.com/slir/w740-h320-c740:320/components/com_cruises/images/ships/ship1-main.jpg",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                success: function (data) {
                    console.log("Success:")
                },
                error: function (error) {
                    console.log("Error")
                }
            });*/

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    console.log(this.response, typeof this.response);
                    var img = document.getElementById('sampleScreenshot');
                    var url = window.URL || window.webkitURL;
                    img.src = url.createObjectURL(this.response);
                    $("#videoScreenshotModal").modal("show");
                }
            };
            xhr.open('GET', 'https://www.cruiseandmaritime.com/slir/w740-h320-c740:320/components/com_cruises/images/ships/ship1-main.jpg');
            xhr.responseType = 'blob';
            xhr.send();
        },

        getKeywordsContent: function (topicId, cb) {
            $.ajax({
                type: "GET",
                url: url + "/contents/keyword/" + topicId + ".json",
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
                error: function (error) {
                    console.log("Error");
                }
            });
        }

    };

}());