const express =  require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine','ejs');
const { v4:uuidV4 } = require('uuid');

app.use(express.static('public'));


app.get('/', (req,res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req,res) => {
    res.render('room', { roomId: req.params.room })
})


io.on('connection',socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId);

    socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId);
    })
    })
})

server.listen(5000);
