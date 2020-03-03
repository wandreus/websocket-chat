const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// define onde ficarão nossos arquivos publicos
app.use(express.static(path.join(__dirname, 'public')));

// define o caminho do view html
app.set('views', path.join(__dirname, 'public'));

// seta a ingene como html, pois o default é ejs
app.engine('html', require('ejs').renderFile);

// define o view index.html
app.set('view engine', 'html');

// criar a rota e aponta para o view
app.use('/', (req, res) => res.render('index.html'));

let arrayMessages = [];
// usando socket.io chat real-time
io.on('connection', socket => {

    socket.emit('historicMessages', arrayMessages);

    socket.on('sendMessage', data => {
        arrayMessages.push(data);
        // tres pincipais funções on, emit, broadcast.emit
        socket.broadcast.emit('updateMessages', data);   
    });

});

server.listen(3000);