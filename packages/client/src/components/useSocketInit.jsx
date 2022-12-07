import socket from "../socket";
import { useNavigate } from "react-router-dom";
import actions from "./state/actionCreators"
import { store } from "./state/store";
import { fetchAvatar } from "./utils/fetchAvatar"
import { useEffect } from "react";

const useSocketInit = () => {
    const navigate = useNavigate();
    console.log("nav");
    useEffect(() => {
        console.log("pre", socket);
        socket.connect();
        console.log("post", socket);
        socket.on("start_game", (res, pin) => {
            actions.addGameState(res)
            navigate("game/" + pin)
        })

        socket.on("player_joined", ({pin, players}) => {
            actions.setPin(pin);
            actions.setPlayers(players);
        });
        socket.on("friends", friendList => {
            console.log("friends2")
            actions.setFriends(friendList);
            store.getState().friends.map(async friend => {
                const username = friend.username;
                const URL = await fetchAvatar(username);
                actions.setFriendsAvatar({URL, username});
            })
        })
        socket.on("messages", messages => {
            console.log("msg")
            actions.setMessages(messages)
        })
        socket.on("dm", message => {
            console.log("dm", message)
            actions.addMessage(message)
        })
        socket.on("connected", (status, username) => {
            console.log("friends")
            actions.setFriendsConnected({ status, username });
        })
        socket.on("connect_error", (err) => {
            console.log("connecterror", err)
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
