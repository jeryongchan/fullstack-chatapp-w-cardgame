import socket from "../socket";
import { useNavigate } from "react-router-dom";
import actions from "./state/actionCreators"
import { store } from "./state/store";
import { fetchAvatar } from "./utils/fetchAvatar"
import { useEffect } from "react";

const useSocketInit = () => {
    const navigate = useNavigate();
    useEffect(() => {
        socket.connect();
        socket.on("start_game", (res, pin) => {
            actions.addGameState(res)
            navigate("game/" + pin)
        })

        socket.on("player_joined", ({pin, players}) => {
            actions.setPin(pin);
            actions.setPlayers(players);
        });
        socket.on("friends", friendList => {
            actions.setFriends(friendList);
            store.getState().friends.map(async friend => {
                const username = friend.username;
                const URL = await fetchAvatar(username);
                actions.setFriendsAvatar({URL, username});
            })
        })
        socket.on("messages", messages => {
            actions.setMessages(messages)
        })
        socket.on("dm", message => {
            actions.addMessage(message)
        })
        socket.on("connected", (status, username) => {
            actions.setFriendsConnected({ status, username });
        })
        socket.on("connect_error", () => {
            actions.setLoggedIn(false);
        });

        return () => {
            socket.off("connect_error");
            socket.off("connected");
            socket.off("friends");
            socket.off("messages");
            socket.off("player_joined");
            socket.off("start_game");
            socket.off("receive_game_state");
            socket.off("update_game");
        };
    }, []);

}

export default useSocketInit;