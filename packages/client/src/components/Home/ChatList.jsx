import AddFriendModal from "./AddFriendModal";
import { Grid, Tab, Tabs, Stack, Divider, Card } from "@mui/material";
import { styled } from '@mui/material/styles';
import Avatar from '../Avatar'
import { useSelector } from "react-redux";

const ChatList = (props) => {
    const { tabIndex, setTabIndex } = props;
    const friendList = useSelector(state => state.friends)
    const handleTabChange = (event, tabIndex) => {
        setTabIndex(tabIndex);
    };

    return (
        <>
            <Stack>
                <Grid container direction="row" alignItems="center" justifyContent="center">
                    <Grid item>
                        Add Friend
                    </Grid>
                    <Grid item>
                        <AddFriendModal />
                    </Grid>
                </Grid>
                <Divider sx={{ background: 'teal' }} />
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    tabIndex={tabIndex}
                    onChange={handleTabChange}
                    sx={{ borderRight: 1, borderColor: "divider" }}
                >
                    {friendList.map(friend => (
                        <Tab
                            label={
                                <Grid container sx={{
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",

                                }}>
                                    <Grid item xs={4} sx={{
                                        width: "100%",
                                        height: "100%",
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "right",
                                        pr: "10px"

                                    }}>
                                        <Avatar
                                            hideBadge={false}
                                            username={friend.username}
                                            avatar={friend.avatar}
                                            connected={friend.connected}
                                        />
                                    </Grid>
                                    <Grid item xs={8} sx={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        {friend.username}
                                    </Grid>
                                </Grid>}

                        />
                    ))};

                </Tabs>
            </Stack>
        </>
    )
}

export default ChatList;