const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// defini onde ficarão os arquivos publicos da aplicação
app.use(express.static(path.join(__dirname, 'public')));

// defini o caminho do view html
app.set('views', path.join(__dirname, 'public'));

// define que o view é html, por que o padrão do node e o ejs
app.engine('html', require('ejs').renderFile);

// define valor de view engine
app.set('view engine', 'html');

// define qual rota vai ser exibida quando site for acessado
app.use('/', (req, res) => res.render('index.html'));

/* 
    nesse ponto temos o servido funcionando da forma convecional
    trafegando no protocolo http node as requisições são criadas e destruidas
*/

let arrayMessage = [];

// observa toda vez que uma conexão socket for feita
io.on('connection', socket => {

    // envia todas as mensagens do server no reload
    socket.emit('allMessage', arrayMessage)

    // observa sempre o que evento e disparado
    socket.on('sendMessage', data => {
        
        arrayMessage.push(data);
        // emit para todos os clientes conectados a nova mensagem
        // tres principais metodos socket .on, .emit e broadcast.emit
        socket.broadcast.emit('updateMessage', data);

    });

});

server.listen(3000);
