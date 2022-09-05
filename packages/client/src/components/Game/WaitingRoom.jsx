import { Typography, Button, Box } from "@mui/material";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import { store } from "../state/store"
import gameActions from "../state/actionCreators"
import { useSelector } from 'react-redux'
import { useTheme } from "@mui/material";
const { useEffect } = require("react")

const WaitingRoom = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const players = useSelector(state => state.game.players)
    useEffect(() => {
        // console.log("wait/leave", store.getState())
    }, [store])
    return (
        <div>
            <Box sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box sx={{
                    mt: 8,
                    width: "15vw",
                    alignItems: "center",
                    flexDirection: "column",
                    display: "flex",
                }}>
                    <Typography variant="h6">
                        Game PIN is:
                    </Typography>
                    <Typography variant="h5">
                        {store.getState().game.pin}

                    </Typography>
                </Box>
                <Box sx={{
                    mt: 8,
                    width: "15vw",
                    alignItems: "center",
                    flexDirection: "column",
                    display: "flex",
                }}>
                    <Typography variant="h6">
                        Joined Players:
                    </Typography>
                </Box>
                <Box>
                    {players.map(player => (
                        <Box label={player} key={player}>
                            <Typography variant="h5">{player}</Typography>
                        </Box>
                    ))}
                </Box>
                <Box sx={{
                    mt: 8,
                    width: "15vw",
                    alignItems: "center",
                    flexDirection: "column",
                    display: "flex",
                }}>
                    <Button variant="contained"
                        sx={{
                            ':hover': {
                                bgcolor: theme.palette.nav.purple, // theme.palette.primary.main
                                color: 'white',
                            },
                            bgcolor: theme.palette.nav.brown
                        }}
                        onClick={() => {
                            socket.emit("leave_game", { pin: store.getState().game.pin },
                                ((res) => {
                                    gameActions.setPin(res.pin)
                                    gameActions.setPlayers(res.players)
                                    // console.log("left game room", store.getState())
                                    navigate("../")
                                }))
                        }}>
                        Exit Game
                    </Button>
                </Box>
            </Box>
        </div >
    )
}

export default WaitingRoom;