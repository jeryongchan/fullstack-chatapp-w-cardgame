import { useState } from "react";
import Chat from "./Chat";
import ChatList from "./ChatList";
import { Grid } from "@mui/material";

import { useSelector } from "react-redux";

const Home = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const friendList = useSelector(state => state.friends);
    return (
        <Grid container sx={{ height: "100%" }}>
            <Grid item xs={3} sx={{
                height: "100%",
                padding: "0.5rem",
                boxSizing: "border-box"
            }}>
                <ChatList tabIndex={tabIndex} setTabIndex={setTabIndex} />
            </Grid>
            <Grid item xs={9} sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Chat tabIndex={tabIndex} userid={friendList[tabIndex]?.userid} />
            </Grid>
        </Grid>
    )
}

export default Home;