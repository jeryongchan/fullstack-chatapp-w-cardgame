import GameHandler from './GameHandler';
import InteractiveHandler from './InteractiveHandler';
import { DECK_OF_CARDS } from './const';
import Phaser from 'phaser';
import { store } from "../../state/store"

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Scene',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexwebfontloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
                    start: true
                }]
            }
        });
    }

    init(playersURL) {
        this.playersURL = playersURL
    }

    preload() {
        const players = store.getState().game.players;
        // const players = ["jeryong", "jirachi", "player12", "brinashong",]
        this.load.image(players[0], this.playersURL[0]);
        this.load.image(players[1], this.playersURL[1]);
        this.load.image(players[2], this.playersURL[2]);
        this.load.image(players[3], this.playersURL[3]);
        this.load.plugin('rexcirclemaskimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcirclemaskimageplugin.min.js', true);
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);
        var config = {
            google: {
                families: ['Raleway:bold']
            },
        };
        this.load.rexWebFont(config);
        DECK_OF_CARDS.forEach(card => {
            this.load.image(card, '/assets/' + card + '.png')
        })
        this.load.image('image', 'path/to/image.png');
        this.load.image('blankprofilepic', '/assets/blankprofilepic.png');
        this.load.image('cardback', '/assets/cardback.png');
        this.load.image('greenbackground', '/assets/greenbackground.png');
        this.load.image('woodentexture', '/assets/woodentexture.png');
        this.load.image('woodentexture2', '/assets/woodentexture2.png');
        this.load.image('whitebackground', '/assets/whitebackground.png');
        this.load.image('whitebackground2', '/assets/whitebackground2.png');
        this.load.image('turncursor', '/assets/turncursor.png');
        this.load.image('handcount', '/assets/handcount.png');
    }

    create() {
        this.GameHandler = new GameHandler(this);
        this.GameHandler.buildGame();
        this.InteractiveHandler = new InteractiveHandler(this);
    }

    update() {

    }
}