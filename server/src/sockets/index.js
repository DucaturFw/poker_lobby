const clients = {};

module.exports = server => {
    const io = require('socket.io')(server.listener, { path: '/ws' });

    io.on('connection', function(socket) {
        clients[socket.id] = { 'new': socket.id };
        socket.emit('getBuyResult', { data: clients[socket.id] })

        socket.on('POKER/ACCOUNT/REG', () => {
            console.log('reg');
            socket.emit('POKER/ACCOUNT/INFO_RES', { 'name': 'lololo', 'id': socket.id });
        });

        socket.on('getSell', () => {
            socket.emit('getSellResult', [1, 2, 3]);
        });

        socket.on('buy', order => {
            socket.broadcast.emit('buyAdd', { 'hell': 'no' });
        });
    });
};