$(function (){
    "use strict";
    //If running mozilla use built-in Websocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://127.0.0.1:1337');
    
    connection.onopen = function(){
        //connection is opened and ready to use
    };

    connection.onerror = function(error){
        //an error occured seinding/receiving data
    };

    connection.onmessage = function (message){
        try{
            var json = JSON.parse(message.data);
        }catch(e){
            console.log('Not a valid JSON: ' + message.data);
            return;
        }
        //handle incoming message
    };
});