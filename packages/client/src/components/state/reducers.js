import { combineReducers } from "redux";

const gameReducer = (
    state = {
        pin: "",
        players: [],
        playersAvatar: [],
        gameStates: [
            // {
            //     turn: 0,
            //     playerOfTurn: "",
            //     playerOfNextTurn: startingPlayer,
            //     rank: "starting",
            //     combination: [],
            //     handCounts: getHandCount(startingHands),
            //     ownHand: []
            // }
        ]
    },
    action
) => {
    switch (action.type) {
        case "setPin":
            return {
                ...state,
                pin: action.payload
            };
        case "setPlayers":
            return {
                ...state,
                players: action.payload
            };
        case "setPlayersAvatar":
            return {
                ...state,
                playersAvatar: action.payload
            };
        case "addGameState":
            return {
                ...state,
                gameStates: [...state.gameStates, action.payload]
            };
        default:
            return state
    }
}

const userReducer = (
    state = { username: "", avatar: "", },
    action
) => {
    switch (action.type) {
        case "setUsername":
            return {
                ...state,
                username: action.payload
            };
        case "setUserid":
            return {
                ...state,
                userid: action.payload
            };
        case "setLoggedIn":
            return {
                ...state,
                loggedIn: action.payload
            };
        case "setAvatar":
            return {
                ...state,
                avatar: action.payload
            };
        default:
            return state;
    }
}

const friendsReducer = (
    state = [
        // {
        //     username: "",
        //     userid: "",
        //     avatar: "",
        //     connected: ""
        // }
    ],
    action
) => {
    switch (action.type) {
        case "addFriend":
            return [...state, action.payload];
        case "setFriends":
            return [...action.payload];
        case "setFriendsConnected":
            // const { status, username } = action.payload;
            return [...state].map(friend => {
                if (friend.username === action.payload.username) {
                    friend.connected = action.payload.status;
                }
                return friend;
            });
        case "setFriendsAvatar":
            return [...state].map(friend => {
                if (friend.username === action.payload.username) {
                    friend.avatar = action.payload.URL;
                }
                return friend;
            });
        default:
            return state;
    }
}


const messagesReducer = (
    state = [
        // {
        //     to: "",
        //     from: "",
        //     content: "",
        //     time: "",
        // }
    ],
    action
) => {
    switch (action.type) {
        case "addMessage":
            return [action.payload, ...state];
        case "setMessages":
            return [...action.payload, ...state];
        // case "setTime":
        //     return [...action.payload, ...state];
        default:
            return state;
    }
}

const reducers = combineReducers({
    user: userReducer,
    game: gameReducer,
    friends: friendsReducer,
    messages: messagesReducer
})

export default reducers