import { bindActionCreators } from 'redux'
import { store } from "./store"

const setUsername = payload => ({ type: 'setUsername', payload })
const setUserid = payload => ({ type: 'setUserid', payload })
const setLoggedIn = payload => ({ type: 'setLoggedIn', payload })
const setAvatar = payload => ({ type: 'setAvatar', payload })
const setPin = payload => ({ type: 'setPin', payload })
const setPlayers = payload => ({ type: 'setPlayers', payload })
const addGameState = payload => ({ type: 'addGameState', payload })
const addFriend = payload => ({ type: 'addFriend', payload })
const setFriends = payload => ({ type: 'setFriends', payload })
const setFriendsConnected = payload => ({ type: 'setFriendsConnected', payload })
const addMessage = payload => ({ type: 'addMessage', payload })
const setMessages = payload => ({ type: 'setMessages', payload })
const setFriendsAvatar = payload => ({ type: 'setFriendsAvatar', payload })
const setPlayersAvatar = payload => ({ type: 'setPlayersAvatar', payload })

const boundToDoActions = bindActionCreators({
    setPin: setPin,
    setPlayers: setPlayers,
    addGameState: addGameState,
    setUsername: setUsername,
    setUserid: setUserid,
    setLoggedIn: setLoggedIn,
    setAvatar: setAvatar,
    addFriend: addFriend,
    setFriends: setFriends,
    addMessage: addMessage,
    setMessages: setMessages,
    setFriendsConnected: setFriendsConnected,
    setFriendsAvatar: setFriendsAvatar,
    setPlayersAvatar: setPlayersAvatar
},
    store.dispatch
)


export default boundToDoActions;