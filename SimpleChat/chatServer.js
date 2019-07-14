"use strict";

process.title = 'My First Chat';

//Server port
var webSocketServerPort = 1337;

var WebSocketServer = require('websocket').server;
var http = require('http');

var history =[];
var clients =[];

var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
colors.sort(function(a,b){return Math.random() > 0.5;});

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str){
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

var server = http.createServer(function(request, response){
});
server.listen(webSocketServerPort, function(){
    console.log((new Date()) + " Server is listening on port "+ webSocketServerPort);
});

//create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

//websocket server
wsServer.on('request', function(request){
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    //TODO: Make sure client is connecting from your website
    var connection = request.accept(null, request.origin);

    var index = clients.push(connection) - 1;
    var userName = false;
    var userColor = false;

    console.log((new Date()) + ' Connection accepted.');

    //send back chat history
    if(history.length > 0){
        connection.sendUTF(
            JSON.stringify({type: 'history', data: history})
        );
    }

    //handeling user messages
    connection.on('message', function(message){
        if(message.type == 'utf8'){
            if(userName === false){
                userName = htmlEntities(message.utf8Data);
                userColor = colors.shift();
                connection.sendUTF(
                    JSON.stringify({type:'color', data: userColor})
                );
                console.log((new Date()) + ' User is known as: ' + userName + ' with ' + userColor + ' colour.');
            }
            else{
                console.log((new Date()) + ' Recieved Message from '+ userName + ': '+ message.utf8Data);

                var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message.utf8Data),
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                //only keep 100 messages
                history = history.slice(-100);

                //broadcast the message
                var json = JSON.stringify({type:'message', data: obj});
                for(var i=0; i<clients.length; i++){
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    //user disconnected
    connection.on('close', function(connection){
        if(userName !== false && userColor !== false)
        {
            console.log((new Date()) + " Peer " + connection.remoteAddress + "disconnected.");

            clients.splice(index, 1);
            colors.push(userColor);
        }
    });
});