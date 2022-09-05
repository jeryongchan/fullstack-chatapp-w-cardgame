const redisClient = require("../redis");
const { Deck } = require("./GameController.js")

module.exports.authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        next(new Error("Not authorized"))
    } else {
        next();
    }
};

module.exports.initializeUser = async socket => {
    socket.user = {...socket.request.session.user };
    console.log((socket.user.username) + " connected");
    socket.join(socket.user.userid);
    await redisClient.hmset(
        `userid:${socket.user.username}`,
        "userid",
        socket.user.userid,
        "connected",
        true,
    );
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`, 0, -1
    );
    const parsedFriendList = await parseFriendList(friendList);
    const friendRooms = parsedFriendList.map(friend => friend.userid);
    if (friendRooms.length > 0) {
        socket.to(friendRooms).emit("connected", true, socket.user.username);
    }
    socket.emit("friends", parsedFriendList);

    const messageQuery = await redisClient.lrange(`chat:${socket.user.userid}`, 0, -1);
    const messages = messageQuery.map(msg => {
        const parsedMsg = msg.split("."); //to.from.content
        return { to: parsedMsg[0], from: parsedMsg[1], content: parsedMsg[2] };
    });
    if (messages && messages.length > 0) {
        socket.emit("messages", messages);
    }
}

module.exports.onDisconnect = async(socket, io) => {
    console.log((socket.user.username) + " disconnected");
    // emit connected status
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "connected", false
    );
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`, 0, -1
    );
    const friendRooms = await parseFriendList(friendList)
        .then(friends => friends.map(friend => friend.userid));
    socket.to(friendRooms).emit("connected", false, socket.user.username);
    // emit game status
    const pin = await redisClient.hget(`userid:${socket.user.username}`, "lastGameRoom");
    console.log(pin)
    socket.leave(pin);
    const players = excludeElement(await getPlayers(io, pin), socket.user.username);
    res = { players: players };
    socket.broadcast.to(pin).emit("update_game", res);

}


module.exports.createGameRoom = async(socket, io, data, callback) => {
    const pin = generatepin();
    socket.join(pin);
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "lastGameRoom", pin
    );
    // const players = await getPlayers(io, pin);
    const res = { pin: pin }
    callback(res);

    console.log(socket.user.username, "created room", pin)
    console.log(socket.user.username, "joined room", pin)
}

module.exports.joinGameRoom = async(socket, io, data, callback) => {
    const numPlayersReq = 4;
    const pin = data.pin;
    console.log(pin)
    const players = await getPlayers(io, pin);
    if (players.length >= numPlayersReq) {
        callback({ errorMsg: "Max player reached" })
        return
    }

    socket.join(pin);
    players.push(socket.user.username)
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "lastGameRoom", pin
    );
    const res = { pin: pin, players: players }
    socket.broadcast.to(pin).emit("player_joined", res);
    callback(res);

    //start
    if (players.length === numPlayersReq) {
        var deck = new Deck();
        deck.shuffle();
        // const startingHandCount = deck.getCards().length / players.length
        const startingHands = deck.deal(players);
        var startingPlayer;
        players.forEach(player => {
            if (startingHands[player].includes("3D")) {
                startingPlayer = player;
            }
        })
        if (!startingPlayer) { startingPlayer = players[0] }
        const gameState = {
            turn: 0,
            playerOfTurn: "",
            playerOfNextTurn: startingPlayer,
            rank: "starting",
            combination: [],
            handCounts: getHandCount(startingHands),
        }
        const JSONPlayers = JSON.stringify(players)
        const privateGameState = {...gameState, hands: startingHands };
        const JSONPrivateGameState = JSON.stringify(privateGameState)
        await redisClient.lpush(`gamepin:${pin}`, JSONPlayers, JSONPrivateGameState);
        players.forEach(async player => {
            const userid = await redisClient.hget(`userid:${player}`, "userid");
            io.to(userid).emit("start_game", {...gameState, ownHand: startingHands[player] }, pin);
            // io.to(userid).emit("start_game", {
            // gameInitLogs: getGameInitLogs(players, startingHandCount, startingPlayer),
            // startingHand: startingHands[player],
            // startingHandCount: startingHandCount,
            // startingPlayer: startingPlayer
            // },
            // pin);

        })
    }
    console.log(socket.user.username, "joined room", pin)
}

module.exports.endTurn = async (socket, io, data) => {
    console.log("endturn")
    const JSONPlayers = await redisClient.lrange(`gamepin:${data.pin}`, -1, -1);
    const players = JSON.parse(JSONPlayers);
    const updatedPrivateGameState = await getUpdatedPrivateGameState(socket, players, data.pin, data.cardsPlayed, data.nextTurnRank)
    console.log("playerofnextturn", updatedPrivateGameState.playerOfNextTurn)
    console.log("playerofturn", updatedPrivateGameState.playerOfTurn)
    console.log("handcount", updatedPrivateGameState.handCounts)
    if (updatedPrivateGameState.handCounts[updatedPrivateGameState.playerOfTurn] === 0) {
        io.in(data.pin).emit("game_over", updatedPrivateGameState.playerOfTurn);
        return;
    }
    const { hands, ...updatedGameState } = updatedPrivateGameState;
    const JSONUpdatedPrivateGameState = JSON.stringify(updatedPrivateGameState)
    await redisClient.lpush(`gamepin:${data.pin}`, JSONUpdatedPrivateGameState);
    players.forEach(async player => {
            const userid = await redisClient.hget(`userid:${player}`, "userid");
            io.to(userid).emit("receive_game_state", {...updatedGameState, ownHand: hands[player] });
        })
        // io.in(data.pin).emit("test");
}
const getUpdatedPrivateGameState = async(socket, players, pin, cardsPlayed, nextTurnRank) => {
    const JSONPrevGameState = await redisClient.lrange(`gamepin:${pin}`, 0, 0);
    const prevGameState = JSON.parse(JSONPrevGameState);
    return {
        turn: prevGameState.turn + 1,
        playerOfTurn: socket.user.username,
        playerOfNextTurn: players[(players.indexOf(socket.user.username) + 1) % players.length],
        rank: nextTurnRank,
        combination: cardsPlayed,
        handCounts: {
            ...prevGameState.handCounts,
            [socket.user.username]: prevGameState.handCounts[socket.user.username] - cardsPlayed.length
        },
        hands: {
            ...prevGameState.hands,
            [socket.user.username]: prevGameState.hands[socket.user.username].filter(x => cardsPlayed.indexOf(x) == -1)
        }
    }
}
module.exports.receiveGameState = async(socket, io, data) => {
    console.log(data.gameState);
    var gameOver = false;
    if (data.gameState.turn === -1) {
        gameOver = true;
    }
    io.in(data.pin).emit("receive_game_state", {
        gameState: data.gameState,
        gameLogs: parseGameState(data.gameState, gameOver),
        gameOver: gameOver,
    });
}

module.exports.leaveGameRoom = async(socket, io, data, callback) => {
    const pin = data.pin;
    socket.leave(pin);
    const players = await getPlayers(io, pin);
    const res = { pin: pin, players: players }
    socket.broadcast.to(pin).emit("update_game", res);
    callback(res);

    console.log(socket.user.username, "left room", pin)
}



module.exports.addFriend = async(socket, friendName, callback) => {
    if (friendName === socket.user.username) {
        callback({ done: false, errorMsg: "Cannot add self!" });
        return;
    }
    const friend = await redisClient.hgetall(`userid:${friendName}`);
    const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
    if (!friend.userid) {
        callback({ done: false, errorMsg: "User doesn't exist!" });
        return;
    }
    const parsedFriendList = await parseFriendList(friendList)
    const friendListName = parsedFriendList.map(friend => friend.username);
    if (friendListName && friendListName.indexOf(friendName) !== -1) {
        callback({ done: false, errorMsg: "Friend already added!" });
        return;
    }
    await redisClient.lpush(`friends:${socket.user.username}`, [friendName, friend.userid].join("."));
    const newFriend = {
        username: friendName,
        userid: friend.userid,
        connected: friend.connected,
    };
    callback({ done: true, newFriend });
}

module.exports.dm = async(socket, message) => {
    message.from = socket.user.userid;
    //to.from.content
    const messageString = [message.to, message.from, message.content].join(".");
    await redisClient.lpush(`chat:${message.to}`, messageString);
    await redisClient.lpush(`chat:${message.from}`, messageString);
    socket.to(message.to).emit("dm", message);
}

const parseFriendList = async(friendList) => {
    const parsedFriendList = [];
    for (let friend of friendList) {
        const parsedFriend = friend.split(".");
        const friendConnected = JSON.parse(await redisClient.hget(`userid:${parsedFriend[0]}`, "connected"));
        parsedFriendList.push({ username: parsedFriend[0], userid: parsedFriend[1], connected: friendConnected });
    }
    return parsedFriendList;
}

const generatepin = () => {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var pin = ""
    var chaactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        pin += characters.charAt(Math.floor(Math.random() * chaactersLength));
    }
    return pin
}
const getPlayers = async(io, room) => {
    const players = [];
    const sockets = await io.in(room).fetchSockets();
    sockets.forEach(socket => { players.push(socket.user.username) });
    return players
}

const excludeElement = (array, element) => {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array
}

const getGameInitLogs = (players, startingHandCount, startingPlayer) => {
    var startingHandCountLogs = []
    players.forEach(player => startingHandCountLogs.push(
        player + " is dealt " + startingHandCount + " cards."
    ))
    console.log(...startingHandCountLogs);
    return (
        [
            "Game started.",
            "Deck shuffled.",
            ...startingHandCountLogs,
            " ",
            "Turn 1: ",
            startingPlayer + " has received the three of Diamond",
            "It is now " + startingPlayer + "'s turn.",
            "Waiting for " + startingPlayer + " to make a move..."
        ]
    )
}


const interpret = card => {
    const face = card[0];
    const suit = card[1];
    return interpretDict[face] + " of " + interpretDict[suit];
}


const parseGameState = (gameState, gameOver) => {
        var phrase = ""
        switch (gameState.rank) {
            case "singles":
                phrase = "the "
                    // console.log(interpret(...gameState.combination))
                    // combinationDesc = "the " + interpret(...gameState.combination);
                break;
            case "doubles":
                phrase = "a pair containing the "
                break;
            case "triples":
                phrase = "a triple containing the "
                break;
            case "fiveCardsHand":
                phrase = "a five-card hand containing the "
                break;
        }
        var interpretedCards = []
        gameState.combination.forEach(
            (card) => {
                interpretedCards.push(interpret(card));
            }
        )
        const combinationDesc =
            phrase +
            interpretedCards.slice(0, -1).join(", the ") +
            " and the " +
            interpretedCards.slice(-1)[0];

        const gameLogs = [
            gameState.player + " have played down " + combinationDesc + ".",
            "  ",
            "Turn " + (gameState.turn + 1) + ":",
            "It is now " + gameState.nextPlayer + "'s turn.",
            "Waiting for " + gameState.nextPlayer + " to make a move...",
            gameOver ? gameState.player + " has played off all of his/her hand. " + gameState.player + " is the Winner!" : ""
        ];
        return gameLogs;
    }
    // const checkRoomSize = (io, pin) => {
    //     io.in(pin).allSockets().then(res => {
    //         console.log(res.size)
    //     })
    // }

const getHandCount = (hands) => {
    var handCount = {};
    for (const [player, hand] of Object.entries(hands)) {
        handCount[player] = hand.length;
    }
    return handCount;
}
const interpretDict = {
    "A": "Ace",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "T": "ten",
    "J": "Jack",
    "Q": "Queen",
    "K": "King",
    "D": "Diamonds",
    "C": "Clubs",
    "H": "Hearts",
    "S": "Spades"

}