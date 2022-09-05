import Phaser from 'phaser'
import Scene from "./PhaserHelpers/scene.js";
import MainScene from "./PhaserHelpers/mainScene.js";
import { Box } from "@mui/material";
import { useEffect } from "react";

const Game = () => {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: 'game',
            scale: {
                mode: Phaser.Scale.FIT,
                width: 1200,
                height: 1000,
            },
            scene: [
                MainScene, Scene
            ],
            "resolution": window.devicePixelRatio,
        }
        let phaserGame = new Phaser.Game(config)
        return () => {
            phaserGame.destroy(true)
        }
    }, [])
    return (
        <Box id="game"
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
        </Box>
    )
}

export default Game;