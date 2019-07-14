var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response){

});
server.listen(1337, function(){});

//create the server
wsServer = new WebSocketServer({
    httpServer: server
});

//websocket server
wsServer.on('request', function(request){
    var connection = request.accept(null, request.origin);

    //handeling user messages
    connection.on('message', function(message){
        if(message.type == 'utf8'){

        }
    });

    connection.on('close', function(connection){});
});