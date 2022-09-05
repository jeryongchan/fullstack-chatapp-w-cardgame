import { Paper } from "@mui/material"
const ChatBubble = ({ message, friendUserId }) => {
    return (
        <Paper sx={{
            textAlign: `${message.to === friendUserId ? "right" : "left"}`,
            m: `${message.to === friendUserId ? "1rem 0 0 auto" : "1rem auto 0 0"}`,
            minWidth: "20px",
            justifyContent: "center",
            display: "flex",
            backgroundColor: `${message.to === friendUserId ? "#635666" : "#7A4069"}`,
            fontSize: 16,
            color: "#E7F6F2",
            maxWidth: "50%",
            padding: "0.5rem",
            borderRadius: "10px",
            overflowWrap: "anywhere",
            //  key={`msg:${friend.username}.${idx}`}
        }}>

            {message.content}
        </Paper>
    );
}

export default ChatBubble;