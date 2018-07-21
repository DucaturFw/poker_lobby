const IO = require('socket.io');
const clients = {};
const tables = {};
const GAME_TIMEOUT = 10000;
const updates = []; // list of user updates (new user lists) for next round

const getNewGameState = (players) => ({
    cards: shuffle(getCards()),
    currCard: 0,
    nextStep: 0,
    salt: getSalt(),
    nextPlayer: 0,
    players: players,
});

const getCards = () => {
    let arr = [];
    for (let i = 0; i < 52; i++) {
        arr.push(i);
    }
    return arr;
}

function getSalt(size = 16) {
    return crypto.randomBytes(size);
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function usersAreDone() {
    // check that users are done for actions
    return axios.post('api/program/method');
}

function putContractCards(cards, salt) {
    // put cards into contract
    return axios.post('api/program/method', { cards, salt });
}

function watchGame(table = 0) {
    usersAreDone().then(res => {
        if (!res.data.value) return;
        let { currCard } = tables[table].gameState;
        if (tables[table].gameState.nextStep == 0) {
            // update users, create new cardset, salt and provide 2 cards per user
            const
                cards = shuffle(getCards()),
                salt = getSalt();
            if (updates.length) {
                tables[table].gameState.players = updates[updates.length - 1];
                updates = [];
            }
            putContractCards(cards, salt)
                .then(res => {
                    tables[table].gameState.cards = cards;
                    tables[table].gameState.salt = salt;
                    for (let player in tables[table].players) {
                        IO.to(clients[player]).emit('getCards', [cards[currCard], cards[currCard + 1]]);
                        currCard += 2;
                    }
                    tables[table].gameState.currCard = currCard;
                    tables[table].gameState.nextStep = 1;
                })
                .catch(err => {
                    console.error(err);
                })
        } else if (tables[table].gameState.nextStep == 1) {
            // 3 more cards for all
            let { cards } = tables[table].gameState;

            putContractCards(cards, salt)
                .then(res => {
                    IO.emit('getPublicCards', [cards[currCard], cards[currCard + 1], cards[currCard + 2]]);
                    tables[table].gameState.currCard += 3;
                    tables[table].gameState.nextStep = 2;
                })
                .catch(err => {
                    console.error(err);
                })
        } else if (tables[table].gameState.nextStep == 2) {
            // 1 more card for all
            let { cards } = tables[table].gameState;
            putContractCards(cards, salt)
                .then(res => {
                    IO.emit('getPublicCards', [cards[currCard]]);
                    tables[table].gameState.currCard += 1;
                    tables[table].gameState.nextStep = 3;
                })
                .catch(err => {
                    console.error(err);
                })
        } else if (tables[table].gameState.nextStep == 3) {
            // 1 more card for all before next round
            let { cards } = tables[table].gameState;
            putContractCards(cards, salt)
                .then(res => {
                    IO.emit('getPublicCards', [cards[currCard]]);
                    tables[table].gameState.currCard += 1;
                    tables[table].gameState.nextStep = 0;
                })
                .catch(err => {
                    console.error(err);
                })
        }
    })
}

module.exports = server => {
    const io = IO(server.listener, { path: '/ws' });

    io.on('connection', function(socket) {
        socket.on('register', (data) => {
            clients[data.addr] = { 'sid': socket.id }
        });

        socket.on('gameUpdate', (players) => {
            updates.push(players);
        })

        socket.on('gameStart', ({ players, gameContract }) => {
            tables[0] = { contract: gameContract, gameState: getNewGameState(players) };
            tables[0].watcher = setInterval(watchGame, GAME_TIMEOUT);
            socket.broadcast.emit('gameStart', { players, gameContract });
        })

        socket.on('broadEvent', data => socket.broadcast.emit('broad', data));

        socket.on('gameEnd', () => {});
    });
};