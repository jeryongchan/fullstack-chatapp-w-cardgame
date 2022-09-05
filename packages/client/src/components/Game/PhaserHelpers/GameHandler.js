import { cardSpacing } from './const';
import { store } from "../../state/store"
import ZoneHandler from './ZoneHandler';
import Card from './Card';
import Phaser from 'phaser';

export default class GameHandler {
    constructor(scene) {
        this.players = store.getState().game.players;
        // this.players = ["jeryong", "jirachi", "player12", "brinashong"]
        this.playersExcludeUser = this.players.filter(x => x !== store.getState().user.username);

        this.zoneHandler = new ZoneHandler(scene);
        this.buildTextures = () => {
            scene.table = scene.add.image(600, 500, "greenbackground")
            scene.opponentArea = scene.add.image(0, 0, "whitebackground")
            scene.playerArea = scene.add.image(0, 0, "whitebackground2")
            Phaser.Display.Align.In.BottomCenter(scene.playerArea, scene.table)
            Phaser.Display.Align.In.TopCenter(scene.opponentArea, scene.table)
            scene.playerHandArea = scene.add.image(0, 0, "woodentexture2").setScale(1, 1)
            Phaser.Display.Align.In.Center(scene.playerHandArea, scene.playerArea)
        }
        const getAvatarScale = (imageName) => {
            const image = scene.textures.get(imageName).getSourceImage();
            const width = image.width;
            const height = image.height;
            const size = width > height ? height : width;
            const avatarSize = 128;
            return avatarSize / size;
        }

        this.buildZones = () => {
            scene.dropZone = this.zoneHandler.renderZone(600, 425);
            // this.zoneHandler.renderOutline(scene.dropZone);
        }

        this.buildPlayerArea = () => {
            this.playerHand = new Phaser.Structs.List(scene);
            const ownHand = store.getState().game.gameStates[0].ownHand;
            ownHand.forEach((card, i) => {
                let newCard = new Card(scene);
                this.playerHand.add(newCard.render(600 - (ownHand.length - 1) * cardSpacing / 2 + i * (cardSpacing), 860, card))
            })
        }

        this.buildTableArea = () => {
            this.lastPlayed = new Phaser.Structs.List(scene);
            this.discarded = new Phaser.Structs.List(scene);
        }

        this.buildOpponentArea = () => {
            this.opponents = {};
            this.opponentHands = {};
            this.opponentPics = {}
            this.opponentHandCounts = {}
            var count = 0;
            while (count < this.players.length - 1) {
                const curPlayer = this.playersExcludeUser[count];
                const handCount = store.getState().game.gameStates[0].handCounts[curPlayer] ?
                    store.getState().game.gameStates[0].handCounts[curPlayer] : 14;
                this.opponentHands[curPlayer] = new Phaser.Structs.List(scene);
                for (let i = 0; i < handCount; i++) {
                    let newCard = new Card(scene);
                    this.opponentHands[curPlayer]
                        .add(newCard.render(200 + count * 400, 140, "cardback"));
                }
                const avatarScale = getAvatarScale(curPlayer)
                // avatar
                this.opponentPics[curPlayer] = scene.add.rexCircleMaskImage(
                    200 + count * 400,
                    140,
                    curPlayer)
                    .setScale(avatarScale, avatarScale)
                let circle = scene.add.graphics();
                circle.lineStyle(3, 0x46323a);
                circle.strokeCircle(200 + count * 400, 140, 64);
                this.opponents[curPlayer] = scene.add.text(
                    200 + count * 400,
                    222,
                    curPlayer, {
                    fontFamily: 'Raleway',
                    fontSize: '20px',
                    color: "#000000",
                })
                    .setOrigin(0.5);
                // cardsLeft
                this.opponentHandCounts[curPlayer] = scene.add.text(
                    200 + count * 400 + 10,
                    252,
                    handCount)
                    .setFontSize(22)
                    .setFontFamily('Raleway')
                    .setColor("#000000")
                    .setOrigin(0.5);
                scene.add.image(200 + count * 400 - 20, 255, "handcount").setScale(0.25)

                this.opponentHandCounts[curPlayer].resolution = 10;
                count++;
            }
        }

        this.buildTurnCursor = () => {
            this.turnCursor = scene.add.image(0, 45, 'turncursor').setScale(0.30);
            if (store.getState().game.gameStates.slice(-1).pop().playerOfTurn === store.getState().user.username) {
                this.turnCursor.visible = false;
            } else {
                const playerIndex = this.playersExcludeUser.indexOf(store.getState().game.gameStates.slice(-1).pop().playerOfNextTurn)
                this.turnCursor.setX(200 + playerIndex * 400)
            }
        }

        this.buildTurnMessages = () => {
            this.turnMessages = {};
            for (let i = 0; i < this.playersExcludeUser.length; i++) {
                this.turnMessages[this.playersExcludeUser[i]] = scene.add.text(0, 330, this.playersExcludeUser[i] + "'s TURN")
                    .setFontSize(24)
                    .setFontFamily('Raleway')
                    .setColor("#FFFFFF")
                    .setOrigin(0.5)
                    // .setStroke("#FFFFFF", 3);
            }
            this.turnMessages[store.getState().user.username] = scene.add.text(0, 330, "YOUR TURN")
                .setFontSize(24)
                .setFontFamily('Raleway')
                .setColor("#FFFFFF")
                .setOrigin(0.5)
                // .setStroke("#FFFFFF", 3);
            for (const [player, turnMessage] of Object.entries(this.turnMessages)) {
                turnMessage.visible = false;
            }
        }

        this.buildPassButton = () => {
            this.passButton = scene.add.text(600, 640, 'PASS')
                .setFontSize(22)
                .setFontFamily('Raleway')
                .setColor("#FFFFFF")
                .setOrigin(0.5)
                .setAlpha(0)
                // .setStroke("#FFFFFF", 3);
            // this.passButton.visible = false;
            // this.passButton.setInteractive();
        }
        
        this.buildGame = () => {
            this.buildTextures();
            this.buildZones();
            this.buildPlayerArea();
            this.buildTableArea();
            this.buildOpponentArea();
            this.buildTurnCursor();
            this.buildTurnMessages();
            this.buildPassButton();
        }
    }

}