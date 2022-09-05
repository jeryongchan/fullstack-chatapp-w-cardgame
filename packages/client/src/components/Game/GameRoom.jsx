import { Button, FormGroup, TextField, Box } from "@mui/material";
import socket from "../../socket"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../state/store"
import gameActions from "../state/actionCreators"
import { useTheme } from '@mui/material/styles';

const GameRoom = () => {
    const joinRoomRef = useRef();
    const navigate = useNavigate();
    const username = store.getState().user.username;
    const theme = useTheme();
    return (
        <div>
            <Box sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box sx={{
                    mt: 8,
                    width: "15vw",
                }}>
                    <FormGroup>
                        <Button sx={{
                                    ':hover': {
                                        bgcolor: theme.palette.nav.purple, // theme.palette.primary.main
                                        color: 'white',
                                    },
                                    bgcolor: theme.palette.nav.brown
                        }}
                            variant="contained" onClick={() => {
                            socket.emit("create_game", "",
                            (res => {
                                    gameActions.setPin(res.pin)
                                    gameActions.setPlayers([username])
                                    // console.log("entered game room", store.getState())
                                    navigate("waitingroom");
                                })
                            )
                        }}>
                            Create Game
                        </Button>
                        <TextField
                            variant="outlined"
                            placeholder="Enter game PIN..."
                            inputRef={joinRoomRef}
                            sx={{ mt: 5 }} />
                        <Button sx={{
                                    ':hover': {
                                        bgcolor: theme.palette.nav.purple, // theme.palette.primary.main
                                        color: 'white',
                                    },
                                    bgcolor: theme.palette.nav.brown
                                }} variant="contained" onClick={() => {
                            socket.emit("join_game", { pin: joinRoomRef.current.value },
                                (res => {
                                    if (res.errorMsg) {
                                        alert(res.errorMsg);
                                        return
                                    }
                                    gameActions.setPin(res.pin)
                                    gameActions.setPlayers(res.players)
                                    // console.log("joined game room", store.getState())
                                    navigate("waitingroom");
                                })
                            )
                        }}>
                            Join Game
                        </Button>
                    </FormGroup>
                </Box>
            </Box>
        </div >
    )
}

export default GameRoom;