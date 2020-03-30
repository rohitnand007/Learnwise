var tocControl = (function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    return {

        saveNotes: function (topicId, textnotes, img, cb, error) {

            var notes = {
                topic_id: topicId,
                text: textnotes,
                image: img
            };

            $.ajax({
                type: "POST",
                url: url + '/user_data_upload/upload_user_note.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                data: JSON.stringify(notes),
                crossDomain: true,
                success: cb,
                error: error
            });
        },

        getNotes: function (topicId, cb, error) {
            $.ajax({
                type: "GET",
                url: url + '/user_data_upload/retrive_user_notes.json?topic_id=' + topicId,
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
                error: error
            });
        },

        shareNotes: function (notesId, mailId, subject, cb, error) {
            var notesData = {
                note_id: notesId,
                receiver_mail_id: mailId,
                mail_subject: subject
            };

            $.ajax({
                type: "POST",
                url: url + '/user_data_upload/sharing_note_mail.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                data: JSON.stringify(notesData),
                crossDomain: true,
                success: cb,
                error: error
            });
        },

        getUserBooks: function (cb, error) {
            $.ajax({
                type: "GET",
                url: url + '/products/my_subjects',
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
                error: error
            });
        },

        getProductsByGrade: function (selectedGrade, cb) {
            $.ajax({
                type: "GET",
                url: url + '/products.json?grade=' + selectedGrade,
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

                }
            });
        },

        getBooksTOC: function (productId, cb) {
            $.ajax({
                type: "GET",
                url: url + '/products/' + productId + '/complete_toc',
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

                }
            });
        },

        getSubjectTocChapters: function (productId, cb) {
            $.ajax({
                type: "GET",
                url: url + '/products/' + productId+'/chapters_and_sections',
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

                }
            });
        },

        getTopics: function (subjectId, sectionId, cb, err) {
            $.ajax({
                type: "GET",
                url: url + '/products/'+subjectId+'/topics/'+sectionId,
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

        getTopicAttemptedContentsList: function (topicId, cb) {
            $.ajax({
                type: "GET",
                url: url + '/learning_paths/my_status.json?topic_id=' + topicId,
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

                }
            });
        },

        saveContentAttempt: function (topicId, contentId, cb, error) {

            var contetInfo = {
                "learning_path":{
                    "content_id": contentId,
                    "topic_id": topicId,
                    "attempted": true
                }
            };

            $.ajax({
                type: "POST",
                url: url + '/learning_paths.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                data: JSON.stringify(contetInfo),
                crossDomain: true,
                success: cb,
                error: error
            });
        },

        unlockNextContent: function (lastAttemptedContentId) {

            console.log("lastAttemptedContentId"+ lastAttemptedContentId);
            var nextContentId = Number(lastAttemptedContentId.split("_")[1])+1;
            console.log("content_"+nextContentId);
            var nextContentListItem = $("#content_"+ nextContentId);

            if(nextContentListItem){
                console.log("Entered:"+nextContentListItem.hasClass("learning-content-disable"));
                if(nextContentListItem.hasClass("learning-content-disable")) {
                    nextContentListItem.removeClass("learning-content-disable");
                    nextContentListItem.find("img.lock-style").remove()
                }
            }

        },

        unlockLearningPathContent: function (topicId, contentId) {

            function saveAttempt() {
                tocControl.saveContentAttempt(topicId, contentId, function(contentAttempt){
                    console.log("Content Attempt: "+JSON.stringify(contentAttempt));
                    if(contentAttempt.saved){

                        tocControl.unlockNextContent(contentId);

                    }else{

                    }

                }, function(error){
                    console.log("Error content attempt save:"+JSON.stringify(error))
                });
            }

            this.getTopicAttemptedContentsList(topicId, function (data) {
                console.log("Topic contents attempted data..:"+JSON.stringify(data));
                if(data.length === 0){

                    saveAttempt();

                }else{

                    var contentAttemptCheck = false;

                    for(var i=0; i < data.length; i++){
                        var contentListItem = $("#"+ data[i].content_id);

                        if(contentListItem.hasClass("learning-content-disable")) {
                            contentListItem.removeClass("learning-content-disable");
                            contentListItem.find("img.lock-style").remove()
                        }

                        if(contentId === data[i].content_id){
                            contentAttemptCheck = true;
                        }
                    }

                    if(!contentAttemptCheck){
                        saveAttempt()
                    }else{
                        console.log("Already attempted this content");
                        tocControl.unlockNextContent(data[data.length - 1].content_id);
                    }

                }
            });

        },

        unlockDemoLearningPathContent: function (topicId, contentId) {

            var demoAttemptedContentList = JSON.parse(localStorage.getItem("demoContentAttempts"));

            if(demoAttemptedContentList){
                var contentAttemptCheck = false;

                if(demoAttemptedContentList[topicId]) {


                    var currentTopicAttemptedContents = demoAttemptedContentList[topicId];

                    for (var i = 0; i < currentTopicAttemptedContents.length; i++) {
                        var contentListItem = $("#" + currentTopicAttemptedContents[i]);

                        if (contentListItem.hasClass("learning-content-disable")) {
                            contentListItem.removeClass("learning-content-disable");
                            contentListItem.find("img.lock-style").remove()
                        }

                        if (contentId === currentTopicAttemptedContents[i]) {
                            contentAttemptCheck = true;
                        }
                    }

                    if (!contentAttemptCheck) {
                        demoAttemptedContentList[topicId].push(contentId);
                        localStorage.setItem("demoContentAttempts", JSON.stringify(demoAttemptedContentList));
                        tocControl.unlockNextContent(contentId);
                    } else {
                        console.log("Already attempted this content");
                        tocControl.unlockNextContent(currentTopicAttemptedContents[currentTopicAttemptedContents.length - 1]);
                    }
                } else {
                    demoAttemptedContentList[topicId] = [contentId];
                    localStorage.setItem("demoContentAttempts", JSON.stringify(demoAttemptedContentList));
                    tocControl.unlockNextContent(contentId);
                }
            } else {
                var contentList = {};
                contentList[topicId] = [contentId];
                // console.log("Content List:"+JSON.stringify(contentList));
                localStorage.setItem("demoContentAttempts", JSON.stringify(contentList));
                tocControl.unlockNextContent(contentId);
            }

        }

    };

}());