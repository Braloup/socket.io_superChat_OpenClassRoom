var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent') // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

//Chargement de la page html.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket, pseudo) {
    //Lorrsque l'on obtient un pseudo, on le stocke dans une varible et on informe les autres.
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    /*Lorsque l'on rçoit un message, récupération du pseudo de l'auteur,
    et on le transmet aux autres personnes*/
    socket.on('message', function(message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

});

server.listen(8080);