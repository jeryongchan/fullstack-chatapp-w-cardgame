import { io } from "socket.io-client";

const socket = new io(process.env.REACT_APP_SERVER_URL, {
    autoConnect: false,
    withCredentials: true,
    rejectUnauthorized: false,
});

export default socket;
