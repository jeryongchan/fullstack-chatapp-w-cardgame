import { Stack } from "@mui/material";
import { UserContext } from "../UserContext";
import { useContext } from "react";

const GameLogs = () => {
    const { game } = useContext(UserContext)

    return (
        <Stack sx={{
            m:"1rem"
        }}>
            {game.gameLogs
                .map((log) => (
                    <div>
                        {log}
                    </div>
                ))}
        </Stack>
    )
}

export default GameLogs;