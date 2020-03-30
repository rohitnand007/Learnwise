/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/toc_control.js', function () {
    $.getScript('./js/controllers/cart_control.js', function () {

        var previousUrl = localStorage.getItem('previousUrl');
        if (!previousUrl.includes('curriculum')) {
            localStorage.removeItem('chapters');
            localStorage.removeItem('selectedContent');
            localStorage.removeItem("scrollInfo");
            localStorage.removeItem("section");
        }

        localStorage.setItem('previousUrl', window.location.href);

        $('.selectpicker').selectpicker();

        function hidePreLoader() {

            $('#preloader').fadeOut(1000, function () {
                $('#preloader').hide();
            });

        }

        var chapters = [],
            subscribedBooksList;

        var subjectPurchased = false;

        function slideIntialization(index) {

            $('i[id^="next_"]').click(function () {
                var nextId = this.id;
                var index = nextId.split("_");
                $('#slider' + index[1]).slick('slickNext');
            });

            $('i[id^="prev_"]').click(function () {
                var prevId = this.id;
                var index = prevId.split("_");
                $('#slider' + index[1]).slick('slickPrev');
            });

            $('#slider' + index).slick({
                dots: false,
                infinite: false,
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

        }

        function autoScrollToLastContent() {

            if (localStorage.getItem('scrollInfo')) {

                var scrollInfo = localStorage.getItem('scrollInfo').split("_");
                var divId = 'chap_' + scrollInfo[0];
                $('html, body').animate({
                    scrollTop: $('#' + divId).offset().top - 80
                }, 1000, function () {
                    $('#slider' + scrollInfo[0]).slick('slickGoTo', Number(scrollInfo[1]), false);
                    localStorage.removeItem("scrollInfo");
                    localStorage.removeItem("section");
                });

            }

        }

        var getSectionsHtml = function (section, chapterIndex, sectionIndex) {

            var sectionDataHtml = '';

            if(subjectPurchased && section._unlocked === true) {
                sectionDataHtml += '<div class="col-md-4 slick-margin" id="topic_' + chapterIndex + '_' + sectionIndex + '"><div class="panel panel-default">' +
                    '<div class="panel-body"><div><div class="logo-demo aliment-logo"><span class="custom-logo">'+section._learning_status+'%</span></div>';
            }else if(section._demo_content === "true"){
                sectionDataHtml += '<div class="col-md-4 slick-margin" id="topic_' + chapterIndex + '_' + sectionIndex + '"><div class="panel panel-default">' +
                    '<div class="panel-body"><div><div class="logo-demo aliment-logo"><span class="custom-logo">0%</span></div>';
            }else{
                sectionDataHtml += '<div class="col-md-4 slick-margin learning-content-disable" id="topic_' + chapterIndex + '_' + sectionIndex + '"><div class="panel panel-default">' +
                    '<div class="panel-body"><div><div class="logo-demo aliment-logo locked">' +
                    '<span class="custom-logo"><img src="../../images/icn_Lock.svg" class="curriculum-lock"></span></div>';
            }

            sectionDataHtml +=  '<div class="text-center subheading-font text-wrap">' + section._display_name + '</div>' +
                '<div class="text-center concept-text">1/1 concepts</div><div class="row text-center icon icons-alignment">' +
                '<div class="col-md-4 col-sm-4 col-xs-4"><i class="fa fa-2x fa-eye font-sizes"></i><span> 0</span></div><div class="col-md-4 col-sm-4 col-xs-4">' +
                '<i class="fa fa-2x fa-heart font-sizes"></i><span> 0</span></div><div class="col-md-4 col-sm-4 col-xs-4">' +
                '<i class="fa  fa-2x fa-share-alt font-sizes"></i><span> 0</span></div></div></div></div></div></div>';

            return sectionDataHtml;

        };

        function displaySections(chapterNameHtml, sections, index) {

            var sectionDataHtml = "";

            if (Array.isArray(sections)) {

                for (var j in sections) {
                    sectionDataHtml += getSectionsHtml(sections[j], index, j);
                }

            } else {

                sectionDataHtml += getSectionsHtml(sections, index, 0);

            }

            if (sections.length > 3) {

                var sectionHtml = '<section class="center slider" id="slider' + index + '">' + sectionDataHtml + '</section>';
                chapterNameHtml += sectionHtml;

            } else {

                chapterNameHtml += sectionDataHtml;
            }

            chapterNameHtml += '</div>';

            if (index < chapters.length - 1) {
                chapterNameHtml += '</div><hr class="horizontalline-color">';
            }

            $('#curriculum_content').append(chapterNameHtml);

            if (sections.length > 3) {

                slideIntialization(index);

            }

        }

        function displayChapters() {

            for (var i in chapters) {

                var sections = chapters[i].sections;

                var chapterNameHtml = "";

                if(subjectPurchased && chapters[i]._unlocked === true){
                    chapterNameHtml = '<div class="row row-alignment" id="chap_' + i + '" ><div class="col-md-1 col-sm-2 col-xs-2"><span class="logo-demo">' +
                        '<span class="custom-logo"> '+ chapters[i]._learning_status +'% </span></span></div><div class="col-md-9 col-sm-8 col-xs-6 padding-zero smallscreen-padding">' +
                        '<span class="heading-font">' + chapters[i]._display_name + '</span></div><div class="col-md-2 col-sm-2 col-xs-4">';
                }else if(chapters[i]._demo_content === "true"){
                    chapterNameHtml = '<div class="row row-alignment" id="chap_' + i + '" ><div class="col-md-1 col-sm-2 col-xs-2"><span class="logo-demo">' +
                        '<span class="custom-logo"> 0% </span></span></div><div class="col-md-9 col-sm-8 col-xs-6 padding-zero smallscreen-padding">' +
                        '<span class="heading-font">' + chapters[i]._display_name + '</span></div><div class="col-md-2 col-sm-2 col-xs-4">';
                }else{
                    chapterNameHtml = '<div class="row row-alignment" id="chap_' + i + '" ><div class="col-md-1 col-sm-2 col-xs-2"><span class="logo-demo locked">' +
                        '<span class="custom-logo"><img src="../../images/icn_Lock.svg" class="curriculum-lock"></span></span></div><div class="col-md-9 col-sm-8 col-xs-6 padding-zero smallscreen-padding">' +
                        '<span class="heading-font">' + chapters[i]._display_name + '</span></div><div class="col-md-2 col-sm-2 col-xs-4">';
                }


                if (sections) {

                    if (sections.length > 3) {

                        chapterNameHtml += '<span class="icon-padding cursor-pointer pull-right"><i class="fa fa-2x fa-angle-right font-color icon-background" id="next_' + i + '" ' +
                            'aria-hidden="true"></i></span><span class="cursor-pointer pull-right"><i class="fa fa-2x fa-angle-left font-color icon-background" id="prev_' + i + '" ' +
                            'aria-hidden="true"></i></span>';
                    }

                    chapterNameHtml += '</div></div><div class="row row-margin">';

                    displaySections(chapterNameHtml, sections, i);

                }

            }

            autoScrollToLastContent();

        }

        function getTopics() {
            $('div[id^="topic_"]').click(function () {
                var topicId = this.id.split('_');
                if (Array.isArray(chapters[topicId[1]].sections)) {
                    localStorage.setItem("scrollInfo", topicId[1] + "_" + topicId[2]);
                    localStorage.setItem("section", chapters[topicId[1]].sections[topicId[2]]._display_name);
                    localStorage.setItem("sectionInfo", JSON.stringify(chapters[topicId[1]].sections[topicId[2]]));
                } else {
                    localStorage.setItem("scrollInfo", topicId[1] + "_" + topicId[2]);
                    localStorage.setItem("section", chapters[topicId[1]].sections._display_name);
                    localStorage.setItem("sectionInfo", JSON.stringify(chapters[topicId[1]].sections));
                }
                window.location.href = '../../topics.html';
            });
        }

        function getSubjectTOC(selectedSubject) {

            // tocControl.getBooksTOC(selectedSubject, function (data) {
                tocControl.getSubjectTocChapters(selectedSubject, function (chapteresSectonData) {
                    chapters = chapteresSectonData.chapters;
                    console.log(JSON.stringify(chapters));

                    // var toc = data.toc;
                    // chapters = toc.ge;
                    localStorage.setItem("chapters", JSON.stringify(chapters));

                    $('#curriculum_content').empty();
                    displayChapters();
                    getTopics();
                });
            // });

        }

        function getSubjectsByGrade(selectedGrade) {

            cartControl.getSubjectsByGrade(selectedGrade, function (data) {

                var subjects = data.products;

                // var subjects = subscribedBooksList[selectedGrade].subjects;

                $('#subject').empty();

                var subjectHtml = '<label class="label-style">Subject</label><select class="selectpicker" ' +
                    'title="Select" id="select_subject"><option data-hidden="true"></option>';

                $.each(subjects, function (i) {
                    subjectHtml += '<option value="' + subjects[i].id + '">' + subjects[i].name + '</option>';
                });

                subjectHtml += '</select>';
                $('#subject').append(subjectHtml);
                $('.selectpicker').selectpicker();

                if (localStorage.getItem('selectedContent') && localStorage.getItem('chapters')) {
                    var selectedContent = JSON.parse(localStorage.getItem('selectedContent'));
                    $('#select_subject').selectpicker('val', selectedContent.selectedSubject);
                }
            });
        }

        function gradeSelectorListener() {

            $('#select_grade').on('change', function () {

                var selectedGrade = $('#select_grade').val();

                if (selectedGrade !== "") {
                    $('#errorText').html("");
                    getSubjectsByGrade(selectedGrade);
                }

            })
        }

        function addGradeSelector(gradesList) {

            var gradeHtml = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"><label class="label-style">Grade</label>' +
                '<select class="selectpicker" title="Select" id="select_grade"><option data-hidden="true"></option>';

            $.each(gradesList, function (i) {
                gradeHtml += '<option value="' + gradesList[i] + '">' + gradesList[i] + '</option>';
            });

            gradeHtml += '</select></div>';
            $('#selector_list').append(gradeHtml);
            $('.selectpicker').selectpicker();
            gradeSelectorListener();

        }

        function addSubjectSelector() {

            var subjectHtml = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" id="subject"><label class="label-style">Subject</label><select class="selectpicker" title="Select">' +
                '</select></div>';

            $('#selector_list').append(subjectHtml);
            $('.selectpicker').selectpicker();

            $('#subject').click(function () {

                var grade = $('#select_grade').val();

                if (grade === "") {
                    $('#select_grade').focus();
                    $('#errorText').html("Please select a grade");
                }

            });

        }

        function checkSubjectSubscription(grade, selectedSubject) {

            if(subscribedBooksList[grade]){
                var subjects = subscribedBooksList[grade].subjects;

                for(var i=0; i < subjects.length; i++){
                    if(subjects[i].id === selectedSubject){
                        subjectPurchased = true;
                        break;
                    }
                }
            }

            if(!subjectPurchased){
                $("#cart-div").show();
            }else{
                $("#cart-div").hide();
            }
        }

        function addTocComponents() {
            var gradeList = ["9", "10"];
            hidePreLoader();
            addGradeSelector(gradeList);
            addSubjectSelector();

            if (localStorage.getItem('chapters')) {

                if (localStorage.getItem('selectedContent')) {
                    var selectedContent = JSON.parse(localStorage.getItem('selectedContent'));
                    $('#select_grade').selectpicker('val', selectedContent.grade);
                    getSubjectsByGrade(selectedContent.grade);
                    $('#select_subject').selectpicker('val', selectedContent.selectedSubject);
                    if(subscribedBooksList) {
                        checkSubjectSubscription(selectedContent.grade, selectedContent.selectedSubject);
                    } else {
                        $("#cart-div").show();
                    }
                }
                chapters = JSON.parse(localStorage.getItem('chapters'));
                $('#curriculum_content').empty();
                displayChapters();
                getTopics();

            }
        }

        function getUserSubscribedBooks() {

            tocControl.getUserBooks(function (data) {

                subscribedBooksList = data.grades;
                addTocComponents();

            }, function error(err) {
                console.log(("Entered error"));
                addTocComponents();

            })

        }

        $('#explore_content').click(function () {

            var grade = $('#select_grade').val();
            var selectedSubject = $('#select_subject').val();

            subjectPurchased = false;

            if (grade === "") {
                $('#select_grade').focus();
                $('#errorText').html("Please select a grade");

            } else {
                if (!selectedSubject) {
                    $('#select_subject').focus();
                    $('#errorText').html("Please select a subject");
                }

                if (selectedSubject) {

                    if(subscribedBooksList) {
                        checkSubjectSubscription(grade, selectedSubject);
                    } else {
                        $("#cart-div").show();
                    }

                    $('#errorText').html("");
                    // if (localStorage.getItem('user')) {
                        var selectedContent = {
                            "grade": grade,
                            "selectedSubject": selectedSubject
                        };
                        localStorage.setItem("selectedContent", JSON.stringify(selectedContent));
                        getSubjectTOC(selectedSubject);
                    // } else {
                    //     $('#errorText').html("Please login to access the content");
                    // }
                }
            }

        });

        getUserSubscribedBooks();

        $('#logo_icon').click(function () {

            userControl.getUserDetails(function (data) {

                if(data) {
                    window.location.href = '/curriculum.html';
                }

            }, function error(err) {
                window.location.href = '/index.html'
            });

        });

        $('#cart-button').click(function () {

            if(localStorage.getItem("selectedContent")) {
                var selectedContent = JSON.parse(localStorage.getItem("selectedContent"));
                cartControl.addItemToCart(selectedContent.selectedSubject, false, function (data) {
                    console.log("Cart response:"+JSON.stringify(data));
                    alert(data.message);
                    /*cartControl.getCartItems(function (cartItems) {
                        console.log("Cart Items:"+JSON.stringify(cartItems));
                    });*/
                }, function error(err) {
                    // window.location.href = '/index.html'
                });
            }

        });
    });
});