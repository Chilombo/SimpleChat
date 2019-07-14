$(function (){
    "use strict";

    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    var myColor = false;
    var myName = false;

    //If running mozilla use built-in Websocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //case: browser does not support WebSocket
    if(!window.WebSocket){
        content.html($('<p>', 
        {text: 'Sorry, but your browser does not support WebSocket.'}));
        input.hide();
        $('span').hide();
        return;
    }

    //open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');
    
    connection.onopen = function(){
        input.removeAttr('disabled');
        status.text('Choose name:');
    };

    //casse: problem with connection
    connection.onerror = function(error){
        content.html($('<p>',{
            text: 'Sorry, but there is some problem with your connection or the server is down.'
        }));
    };

    connection.onmessage = function (message){
        try{
            var json = JSON.parse(message.data);
        }catch(e){
            console.log('Not a valid JSON: ' + message.data);
            return;
        }
        
        if(json.type === 'color'){
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
        }
        else if(json.type === 'history'){
            for (var i =0; i < json.data.length; i++){
                addMessage(json.data[i].author, json.data[i].text, json.data[i].color, new Date(json.data[i].time));
            }
        }
        else if(json.type === 'message'){
            input.removeAttr('disabled');
            addMessage(json.data.author, json.data.text, json.data.color, new Date(json.data.time));
        }
        else{
            console.log('What is this lol!: ', json);
        }
    };

    //Sends message when user presses Enter
    input.keydown(function(e){
        if(e.keyCode === 13){
            var msg = $(this).val();
            if(!msg){
                return;
            }
            connection.send(msg);
            $(this).val('');
            input.attr('disabled', 'disabled');

            if(myName == false){
                myName = msg;
            }
        }
    });

    //Give server a time to respond
    setInterval(function(){
        if(connection.readyState !==1){
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to communicate with the WebSocket server');
        }
    }, 3000);

    function addMessage(author, message, color, date){
        content.prepend('<p><span style="color:'+    color +'">'
            + author + '</span> @ '+ (date.getHours() < 10 ? '0'
            + date.getHours() : date.getHours()) + ':'
            + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
            + ': '+ message + '</p>');
    }
});