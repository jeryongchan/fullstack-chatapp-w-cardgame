import ChatBox from "./ChatBox"
import { Stack, Paper, Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import TabPanel from "./TabPanel";
import { styled } from '@mui/system';
import ChatBubble from "./ChatBubble";
import { useSelector } from 'react-redux'
import Avatar from "../Avatar";

const Chat = (props) => {
    const { tabIndex, userid } = props;
    const friendList = useSelector(state => state.friends)
    const user = useSelector(state => state.user)
    const messages = useSelector(state => state.messages)
    const bottomDiv = useRef(null);
    useEffect(() => {
        bottomDiv.current?.scrollIntoView();
    })

    const ChatContainer = styled(Stack)({
        width: "80vw",
        height: "100%",
        maxWidth: "700px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        justiyContent: 'space-between',
        overflowX: "hidden",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        boxSizing: "border-box",
        // borderColor: 'grey.500',
        border: '1px solid grey',
        borderTop: 0,
        borderBottom: 0,
        
    });
    
    const FriendWrapper = styled(Box)({
        width: "100%",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        paddingLeft: "3rem",
        paddingTop: "0.5rem",
        paddingBottom: "1rem",
        
    })
    
    const TabPanelWrapper = styled(Paper)({
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        backgroundColor: "#c9ffe5"
        // backgroundColor: "#737486 ",
    })

    const ChatBoxWrapper = styled(Paper)({
        position: "relative",
        width: "700px",
        backgroundColor: "#FFFAFA",
        paddingLeft: "0.5rem",
        boxSizing: "border-box"
        // bottom: "20px",
    })

    return (
        <ChatContainer container direction="column" id="chatcontainer">
            <FriendWrapper>
                <Avatar
                    hideBadge={false}
                    username={useSelector(state => state.friends)[tabIndex]?.username}
                    avatar={useSelector(state => state.friends)[tabIndex]?.avatar}
                    connected={useSelector(state => state.friends)[tabIndex]?.connected}
                />
                <Typography sx={{fontSize: "20px", pl:"20px"}}>
                    {useSelector(state => state.friends)[tabIndex]?.username}
                </Typography>
            </FriendWrapper>
            <TabPanelWrapper>
                {useSelector(state => state.friends).map((friend, index) => (
                    <TabPanel friendIndex={index} tabIndex={tabIndex}>
                        <div ref={bottomDiv} />
                        {messages
                            .filter(
                                message => message.to === friend.userid || message.from === friend.userid
                            )
                            .map((message) => (
                                <ChatBubble message={message} friendUserId={friend.userid} />
                            ))}
                    </TabPanel>
                ))}
            </TabPanelWrapper>
            <ChatBoxWrapper>
                <ChatBox userid={userid} />
            </ChatBoxWrapper>
        </ChatContainer >
    )
}

export default Chat

// return friendList.length > 0 ? (
//     <Stack h="100%" justify="end">
//         <TabPanels overflowY="scroll">
//             {friendList.map(friend => (
//                 <Stack flexDir="column-reverse"
//                     as={TabPanel}
//                     key={`chat:${friend.username}`}
//                     w="100%"
//                 >
//                     <div ref={bottomDiv}/>
//                     {messages
//                         .filter(
//                             msg => msg.to === friend.userid || msg.from === friend.userid
//                         )
//                         .map((message, idx) => (
//                             <Text
//                                 m={message.to === friend.userid
//                                     ? "1rem 0 0 auto !important"
//                                     : "1rem auto 0 0 !important"
//                                 }
//                                 color="black"
//                                 maxW="50%"
//                                 key={`msg:${friend.username}.${idx}`}
//                                 fontSize="lg"
//                                 bg={message.to === friend.userid ? "blue.100" : "gray.100"}
//                                 borderRadius="10px"
//                                 p="0.5rem 1rem"
//                             >
//                                 {message.content}
//                             </Text>
//                     ))}
//                 </Stack>
//             ))}
//         </TabPanels>
//         <ChatBox userid={userid} />
//     </Stack>) : (
//     <Stack justify="center" pt="5rem" w="100%" textAlign="center" >
//         <TabPanels>
//             <TabPanel>No friend :( Click to add friend to start chatting.</TabPanel>
//         </TabPanels>
//     </Stack>
//     )