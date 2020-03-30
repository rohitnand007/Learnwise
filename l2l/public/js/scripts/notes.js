/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

var topicId = "", notesId = "";

$.getScript('./js/controllers/toc_control.js', function () {

    $('#chapters_content').hide();
    $('#note_editor').hide();
    $('.selectpicker').selectpicker();

    function handleNoteEditor(toc, chapterIndex) {
        $('div').click(function () {
            var divId = this.id;

            if (divId.includes('topicId_')) {
                $('#preloader').show();
                $('#sections_content').hide();
                $('#note_editor').show();

                var indexes = divId.split("_");
                var chapterInfo = toc[chapterIndex];
                var sectionInfo = chapterInfo.sections[indexes[1]];
                var topicInfo = sectionInfo.topics[indexes[2]];
                topicId = topicInfo._id;
                if(topicId) {
                    tocControl.getNotes(topicId, function (notesData, error) {
                        if(notesData.notes) {
                            preloader();
                            notesId = notesData.notes.note_id;
                            $('#editInner').empty();
                            $('#editInner').append(notesData.notes.text);
                        } else if(notesData.message) {
                            preloader();
                            alert(notesData.message);
                            $('#editInner').empty();
                            var editorInnerHtml = '<p class="editor-text" contenteditable="false" id="chapter_section"></p>'
                                + '<h2 class="topic-color" contenteditable="false" id="topic_name"></h2>'
                                + '<p>Just start typing.....</p>';
                            $('#editInner').append(editorInnerHtml);
                            var chapterSectionName = chapterInfo._display_name + " - " + sectionInfo._display_name;
                            $('#chapter_section').append(chapterSectionName);
                            var topicName = topicInfo._display_name;
                            $('#topic_name').append(topicName);
                        }
                    });
                }
            }
        })
    }

    function handleShareAndPrint() {
        $('i').click(function (e) {
            e.preventDefault();
            var divId = this.id;

            if (divId.includes('print_')) {
                var topicId = divId.split("_")[1];
                if(topicId) {
                    tocControl.getNotes(topicId, function (notesData, error) {
                        if(notesData.notes) {
                            var mywindow = window.open('', '_blank', 'width=1000,height=650,text-align:center');
                            mywindow.document.writeln('<html><head/><body>' +notesData.notes.text+ '</body></html>');
                            $(mywindow).ready(function() {
                                setTimeout(
                                    function(){
                                        mywindow.document.close();
                                        mywindow.print();
                                        mywindow.close();
                                    },(1000));
                            });
                        }
                    });
                }
            } else if (divId.includes('share_')) {
                var topicId = divId.split("_")[1];
                var mywindow = window.open('', '_blank', 'width=1000,height=650,text-align:center');

                if(topicId) {
                    tocControl.getNotes(topicId, function (notesData, error) {
                        if(notesData.notes) {
                            var noteId = otesData.notes.note_id;
                            var email = $('#emailId').val();
                            var subject = $('#subjectText').val();
                            if(noteId) {
                                if(email != null & subject != null) {
                                    tocControl.shareNotes(noteId, email, subject, function (data, error) {
                                        console.log("Successfully shared");
                                    }, function (error) {
                                        console.log("error while sending email");
                                    })
                                }
                            }
                        }
                    });
                }
            }
        })
    }

    function displaySections(toc) {


        $('.chapter-font').on('click',function(){
            $('.chapter-font').removeClass('active');
            $(this).addClass('active');
        });

        $('div').click(function () {
            var divId = this.id;

            if (divId.includes('chapterId_')) {
                notesId = "";

                $('#chapter_section').empty();
                $('#topic_name').empty();
                $('#note_editor').hide();
                $('#sections_content').show();
                $('#sections_content').empty();

                var chapterIndex = divId.split("_");
                var chapterInfo = toc[chapterIndex[1]];
                var sectionsContent = chapterInfo.sections;

                var searchHtml = '<div class="row search-row"><div class="col-md-6"><input class="search-align" '
                    + 'type="text" placeholder="Search notes"></div><div class="col-md-6">'
                    + '<div class="pull-right"></div></div></div>';

                var sectionHtml = '<div class="row panel-content-height"><div class="search-border"></div>';

                for(var i in sectionsContent) {
                    var topicsContent = sectionsContent[i].topics;
                    sectionHtml += '<div class="row-alignment"><div class="col-md-1">'
                        + '<i class="fa fa-2x fa-book" aria-hidden="true"></i></div>'
                        + '<div class="col-md-10 padding-zero"><span class="heading-font">'+
                        sectionsContent[i]._display_name +'</span></div></div>';

                    var topicsHtml = '<div class="col-md-12"><div class="row row-alignment">';
                    for(var j in topicsContent) {
                        topicsHtml += '<div class="col-md-6"><div class="panel-icons">'
                            + '<i class="fa fa-share-alt" aria-hidden="true" data-toggle="modal" data-target="#shareModal" id="share_' + topicsContent[j]._id +'"></i>'
                            + '<i class="fa fa-print" aria-hidden="true" id="print_' + topicsContent[j]._id +'"></i></div><div class="panel panel-default" id="topicId_' + i + "_" + j +'">';
                        if(topicsContent[j].notes_present) {

                            topicsHtml += '<div class="panel-body">';

                        } else if(!topicsContent[j].notes_present) {

                            topicsHtml += '<div class="panel-body panel-body-no-notes">';

                        }
                        topicsHtml += '<div class="note-panel"><div class="col-md-2"><i class="fa fa-2x fa-book" aria-hidden="true">'
                            + '</i></div><div class="col-md-10">' + topicsContent[j]._display_name + '</div></div></div></div></div>';
                    }
                    topicsHtml += '</div></div>';
                    sectionHtml += topicsHtml;
                }

                sectionHtml += '</div>';
                searchHtml += sectionHtml;

                $('#no_content').hide();
                $('#sections_content').append(searchHtml);
                $('#chapters_content').show();
                handleNoteEditor(toc, chapterIndex[1]);
                handleShareAndPrint();
            }
        });
    }

    function getSelectedTOC(selectedSubject) {
        tocControl.getBooksTOC(selectedSubject, function (toc) {
            preloader();
            var tocContent = [];
            var chapters = toc.chapters;
            var chaptersHtml = "";
            for(var i in chapters) {
                tocContent.push(chapters[i]);
                chaptersHtml += '<div class="row center-align chaptername-bg" id="chapterId_' + i +'"><div class="col-md-2">'
                    + '<i class="fa fa-2x fa-book" aria-hidden="true"></i></div>'
                    + '<div class="col-md-10 chapter-font">' + chapters[i]._display_name + '</div></div>';
            }
            $('#chapters_name').append(chaptersHtml);
            displaySections(tocContent);
        })
    }

    function subjectSelectorListener() {
        $('#select_subject').on('change', function () {

            var selectedSubject = $('#select_subject').val();

            if(selectedSubject) {
                $('#preloader').show();
                $('#chapters_name').empty();
                getSelectedTOC(selectedSubject);
            }

        })
    }

    tocControl.getProductsByGrade("9", function (productsList) {
        var subjects = productsList.products;

        var subjectHtml = '<div class="pull-right"><label><select class="selectpicker" id="select_subject"'
            + 'title="Select" id="subject_select"><option data-hidden="true"></option>';

        $.each(subjects, function (i) {
            if(i == 0) {
                subjectHtml += '<option value="' + subjects[i].id + '" selected>' + subjects[i].name + '</option>';
                getSelectedTOC(subjects[i].id);
            } else {
                if(i < subjects.length - 1) {
                    subjectHtml += '<option value="' + subjects[i].id + '">' + subjects[i].name + '</option>';
                }
            }
        });

        subjectHtml += '</select></label></div>';
        $('#subject_list').append(subjectHtml);
        $('.selectpicker').selectpicker();
        subjectSelectorListener();
    });

    function preloader() {
        $('#preloader').fadeOut(1000, function () {
            $('#preloader').hide();
        });
    }

});

$(function () {
    $('#edit').froalaEditor({
        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'align-left',
            'align-right', 'align-center', 'align-justify', 'formatOL', 'formatUL',
            'insertImage', 'insertVideo', 'insertLink', 'close', 'fullscreen',
            'textrightButton', 'print', 'shareButton', 'screenshotButton', 'saveButton'],

        pluginsEnabled: ['image', 'print', 'lists', 'align', 'align-right', 'video', 'link',
            'fullscreen', 'customPlugin'],

        height: 300,

        placeholderText: ''
    })
});

$.FroalaEditor.DefineIconTemplate('material_design', '<i class="fa fa-times" aria-hidden="true"></i>');
$.FroalaEditor.DefineIcon('close', {NAME: 'remove', template: 'material_design'});
$.FroalaEditor.RegisterCommand('close', {
    title: 'Close Editor',
    icon: 'close',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback: function () {
        // $('#userEditor').empty();
        // var editorHtml = '<p>Just start typing.....</p><div class="sigPad" id="smoothed">' +
        //     '<div class="sig sigWrapper" style="height:auto;"><div class="typed"></div>' +
        //     '<canvas class="pad" width="1200" height="600"></canvas>' +
        //     '<input type="hidden" name="output" class="output"></div></div>';
        // $('#userEditor').append(editorHtml);
        $('#chapter_section').empty();
        $('#topic_name').empty();
        $('#sections_content').show();
        $('#note_editor').hide();
        this.events.focus();
    }
});
// Define popup template.
$.extend($.FroalaEditor.POPUP_TEMPLATES, {
    "customPlugin.popup": '[_BUTTONS_][_CUSTOM_LAYER_]'
});
// Define popup buttons.
$.extend($.FroalaEditor.DEFAULTS, {
    popupButtons: ['popupClose', '|', 'popupButton1', 'popupButton2']
});
// Define popup template.
$.extend($.FroalaEditor.POPUP_TEMPLATES, {
    "customPlugin.popup": '[_BUTTONS_][_CUSTOM_LAYER_]'
});

// Define popup buttons.
$.extend($.FroalaEditor.DEFAULTS, {
    popupButtons: ['popupClose', '|', 'popupButton1', 'popupButton2'],
});

// The custom popup is defined inside a plugin (new or existing).
$.FroalaEditor.PLUGINS.customPlugin = function (editor) {
    // Create custom popup.
    function initPopup () {
        // Popup buttons.

        var popup_buttons = '';

        // Create the list of buttons.
        if (editor.opts.popupButtons.length > 1) {
            popup_buttons += '<div class="fr-buttons">';
            popup_buttons += editor.button.buildList(editor.opts.popupButtons);
            popup_buttons += '</div>';
        }

        // Custom layer.
        var custom_layer = '<div class="fr-my-layer fr-layer fr-active" id="fr-my-layer-' + editor.id + '">'
            + '<div class="fr-input-line"><input id="emailId" type="text" '
            + 'placeholder="' + editor.language.translate('Email Id') + '" tabIndex="1"></div><br/> '
            + '<div class="fr-input-line"><input id="subjectText" type="text" '
            + 'placeholder="' + editor.language.translate('Subject') + '" tabIndex="1"></div> '
            + '<div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" '
            + 'data-cmd="shareButton" tabIndex="2" role="button" id="sendMail">'
            + editor.language.translate('Send') + '</button></div></div>';

        // Load popup template.
        var template = {
            buttons: popup_buttons,
            custom_layer: custom_layer
        };
        // Create popup.
        var $popup = editor.popups.create('customPlugin.popup', template);

        $('#sendMail').on('click', function () {
            var email = $('#emailId').val();
            var subject = $('#subjectText').val();
            if(notesId) {
                if(email != null & subject != null) {
                    tocControl.shareNotes(notesId, email, subject, function (data, error) {
                        console.log("Successfully shared");
                    }, function (error) {
                        console.log("error while sending email");
                    })
                }
            }
        });

        return $popup;
    }


    // Show the popup
    function showPopup () {
        // Get the popup object defined above.
        var $popup = editor.popups.get('customPlugin.popup');

        // If popup doesn't exist then create it.
        // To improve performance it is best to create the popup when it is first needed
        // and not when the editor is initialized.
        if (!$popup) $popup = initPopup();

        // Set the editor toolbar as the popup's container.
        editor.popups.setContainer('customPlugin.popup', editor.$tb);

        // This will trigger the refresh event assigned to the popup.
        // editor.popups.refresh('customPlugin.popup');

        // This custom popup is opened by pressing a button from the editor's toolbar.
        // Get the button's object in order to place the popup relative to it.
        var $btn = editor.$tb.find('.fr-command[data-cmd="shareButton"]');

        // Set the popup's position.
        var left = $btn.offset().left + $btn.outerWidth() / 2;
        var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

        // Show the custom popup.
        // The button's outerHeight is required in case the popup needs to be displayed above it.
        editor.popups.show('customPlugin.popup', left, top, $btn.outerHeight());
    }

    // Hide the custom popup.
    function hidePopup () {
        editor.popups.hide('customPlugin.popup');
    }

    // Methods visible outside the plugin.
    return {
        showPopup: showPopup,
        hidePopup: hidePopup
    }
}


// Define custom popup close button icon and command.
$.FroalaEditor.DefineIcon('popupClose', {NAME: 'times'});
$.FroalaEditor.RegisterCommand('popupClose', {
    title: 'Close',
    undo: false,
    focus: false,
    callback: function () {
        this.customPlugin.hidePopup();
    }
});

// Define custom popup 1.
$.FroalaEditor.DefineIcon('popupButton1', {NAME: 'envelope-o'});
$.FroalaEditor.RegisterCommand('popupButton1', {
    title: 'Email',
    undo: false,
    focus: false,
    callback: function (editor) {
        alert("popupButton1 was pressed");
    }
});

// Define custom popup 2.
$.FroalaEditor.DefineIcon('popupButton2', {NAME: 'whatsapp'});
$.FroalaEditor.RegisterCommand('popupButton2', {
    title: 'WhatsApp',
    undo: false,
    focus: false,
    callback: function () {
        alert("popupButton2");
    }
});

$.FroalaEditor.DefineIcon('shareIcon',
    {SRC: '../images/if_share4_216719.png', ALT: 'Share button', template: 'image'});
$.FroalaEditor.RegisterCommand('shareButton', {
    title: 'Share',
    icon: 'shareIcon',
    undo: false,
    focus: false,
    plugin: 'customPlugin',
    callback: function () {
        this.customPlugin.showPopup();
    }
});
$.FroalaEditor.DefineIcon('screenshotIcon',
    {SRC: '../images/screenshot.png', ALT: 'Screenshot button', template: 'image'});
$.FroalaEditor.RegisterCommand('screenshotButton', {
    title: 'Screenshot',
    icon: 'screenshotIcon',
    callback: function () {

        var node = document.getElementById('editInner');

        domtoimage.toPng(node)
        .then(function (dataUrl) {
            console.log('Content...screenshot success');
            var img = new Image();
            img.src = dataUrl;
            console.log(img);
            node.appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong! \n', error);
        });
    }
});

$.FroalaEditor.DefineIconTemplate('save_icon', '<i class="fa fa-floppy-o" aria-hidden="true"></i>');
$.FroalaEditor.DefineIcon('save', {NAME: 'remove', template: 'save_icon'});
$.FroalaEditor.RegisterCommand('saveButton', {
    title: 'Save Notes',
    icon: 'save',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback: function () {
        var htmlText = $('#editInner').html();
        if(topicId) {
            tocControl.saveNotes(topicId, htmlText, null, function (data, error) {
                console.log("Notes saved");
            }, function (error) {
                console.log("error while saving notes");
            })
        }
        this.events.focus();
    }
});