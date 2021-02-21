function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + JSON.stringify(cvalue) + ";";
}
function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
}

var readNoteCookies = function () {
    var noteCookies = [];
    var cookies = document.cookie.split(';');

    for(var index in cookies){
        cookies[index] = cookies[index].trim();
        if(cookies[index].indexOf('note') == 0){
           var c = cookies[index].split('=');
           var cName = parseInt(c[0].replace('note', ''));
           var cCont = JSON.parse(c[1]);
           noteCookies.push({id: cName, data: JSON.parse(cCont)});
        }
    }
    return noteCookies;
};

$(document).ready(function () {
    var windowW = window.outerWidth;
    var windowH = window.outerHeight;
    var windowPadding = 100;

    var template = $('#stickynote-template');
    var noteW = template.width();
    var noteH = template.height();

    var lastID   = 0;

    var editNote = function (note) {
        var id, content, x, y;
        var noteData = {};

        var cookieName, cookieCont;

        id = note.data('id');
        content = note.find('textarea').val();
        x = note.css('left');
        y = note.css('top');

        noteData.c = content;
        noteData.x = x;
        noteData.y = y;

        cookieName = 'note'+id;
        cookieCont = JSON.stringify(noteData);
        setCookie(cookieName, cookieCont);
    };

    var initActions = function () {
        $('.stickynote').draggable({
            handle: '.drag-icon',
            containment: 'window',
            stop: function () {
                editNote($(this));
            }
        });
        $('.stickynote textarea').blur(function () {
            editNote($(this).parent().parent());
        });
        $('.stickynote .close-icon').click(function () {
            var note = $(this).parent();
            delete_cookie('note' + note.data('id'));
            note.animate({opacity: 0}, function () {
                $(this).remove();
            });
        });
    };
    var createStickyNote = function () {
        var x, y;
        lastID++;


        x = Math.floor(Math.random() * (windowW - noteH - windowPadding*2) + windowPadding);
        y = Math.floor(Math.random() * (windowH - noteW - windowPadding*2) + windowPadding);

        var note = template.clone();
        note.attr('id', '');
        note.css({
            'top': y,
            'left': x
        });
        note.attr('data-id', lastID);

        var newNote = $('body').append(note);
        newNote.find('textarea').focus();
        initActions();
    };

    var printNotes = function (notes) {
        for(var i in notes){
            var n = notes[i];
            lastID = n.id;


            var note = template.clone();
            note.attr('id', '');
            note.css({
                'top': n.data.y,
                'left': n.data.x
            });
            note.attr('data-id', lastID);
            note.find('textarea').text(n.data.c);
            $('body').append(note);
        }
        initActions();
    };
    var loadedNotes = readNoteCookies();
    if(loadedNotes.length > 0){
        printNotes(loadedNotes);
    }


    $('#create-button').click(function () {
        createStickyNote();
    });


});



