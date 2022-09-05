import Phaser from 'phaser';
import { fetchAvatar } from '../../utils/fetchAvatar';
import { store } from "../../state/store"

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload() {
        
    }

    create() {
        this.add.text(600, 500, "Loading game assets...").setOrigin(0.5);
        const players = store.getState().game.players;
        // const players = ["jeryong", "jirachi","player12", "brinashong", ]
        const start = async () => {
            let playersURL = [];
            for (let i = 0; i < players.length; i++) {
                const playerURL = await fetchAvatar(players[i]);
                playersURL.push(playerURL);
            }
            this.scene.start("Scene", playersURL);
        };
        start();
    }

    update() {

    }
}