import clamp from 'lodash-es/clamp'
import { cardSpacing } from './const';
import Phaser from 'phaser';
import { store } from "../../state/store"
import gameActions from "../../state/actionCreators"
import socket from "../../../socket"
import combinationIsValid from "./gameLogic"

export default class InteractiveHandler {
    constructor(scene) {
        this.username = store.getState().user.username;
        this.players = store.getState().game.players;
        this.playersExcludeUser = this.players.filter(x => x !== this.username);

        this.curRankCardsRequired = 5 // playable cards at start
        scene.GameHandler.playerHand.lifted = [];
        scene.GameHandler.playerHand.dragStartFromLifted = false;
        scene.GameHandler.playerHand.draggedAboveHand = false;
        if (store.getState().game.gameStates.slice(-1).pop().playerOfNextTurn === this.username) {
            this.turnChangeComplete = true;
        } else {
            this.turnChangeComplete = false;
        }

        // player plays card
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            this.dropped = true;
            socket.emit("end_turn", { pin: store.getState().game.pin, cardsPlayed: this.cardsSelected, nextTurnRank: this.nextTurnRank },);
            this.playCards(gameObject);
            this.turnChangeComplete = false;
            if (this.errorTimeline) {
                this.errorTimeline.stop()
                this.errorTimeline.destroy()
                this.errorText.destroy()
            }
        })
        // opponents played card
        socket.on("receive_game_state", (res) => {

            this.turnChangeComplete = false;
            gameActions.addGameState(res);
            const latestGameState = store.getState().game.gameStates.slice(-1).pop();
            if (this.username !== latestGameState.playerOfTurn) {
                this.opponentPlaysCard(latestGameState.playerOfTurn, latestGameState.combination);
                scene.GameHandler.opponentHandCounts[latestGameState.playerOfTurn].setText(latestGameState.handCounts[latestGameState.playerOfTurn]);
            }

        })
        // game over
        socket.on("game_over", (res) => {
            console.log(res + " has won!");
            alert(res + " has won!");
        })

        this.changeTurnToOpponents = () => {
            // shift turn cursor
            const players = store.getState().game.players;
            // const players = ["jeryong", "jirachi", "player12", "brinashong"]
            const playerOfNextTurn = players[(players.indexOf(this.username) + 1) % players.length];
            scene.GameHandler.turnCursor.visible = true;
            if (scene.GameHandler.turnCursor.x === 1200) {
                scene.GameHandler.turnCursor.setX(0);
            }
            const playerIndex = this.playersExcludeUser.indexOf(playerOfNextTurn)
            const x = (200 + playerIndex * 400);
            this.cursorShiftTween = scene.tweens.add({
                targets: scene.GameHandler.turnCursor,
                ease: 'Expo.easeOut',
                duration: 900,
                x: x,
            });
            // change turn message
            this.cursorShiftTween.on("complete", () => {
                scene.GameHandler.turnMessages[playerOfNextTurn].visible = true;
                this.selfTextEnter = scene.tweens.add({
                    targets: scene.GameHandler.turnMessages[playerOfNextTurn],
                    ease: 'Expo.easeOut',
                    duration: 600,
                    x: 600,
                });
                this.selfTextEnter.on("complete", () => {
                    this.selfTextExit = scene.tweens.add({
                        targets: scene.GameHandler.turnMessages[playerOfNextTurn],
                        ease: 'Expo.easeIn',
                        duration: 600,
                        x: 1200,
                        origin: 0,
                        delay: 600,
                    });
                    this.selfTextExit.on("complete", () => {
                        scene.GameHandler.turnMessages[playerOfNextTurn].visible = false;
                        scene.GameHandler.turnMessages[playerOfNextTurn].setX(0);
                    })
                })
            })
        }

        this.changeTurnFromOpponents = () => {
            // shift turn cursor
            const playerOfNextTurn = store.getState().game.gameStates.slice(-1).pop().playerOfNextTurn;
            var x;
            if (playerOfNextTurn === this.username) {
                x = 1200;
            } else {
                const playerIndex = this.playersExcludeUser.indexOf(playerOfNextTurn)
                x = (200 + playerIndex * 400);
            }
            this.cursorMoveRightOffScreenTween = scene.tweens.add({
                targets: scene.GameHandler.turnCursor,
                ease: 'Expo.easeIn',
                duration: (1200 - scene.GameHandler.turnCursor.x),
                x: x,
            });
            this.cursorMoveRightOffScreenTween.on("complete", () => {
                if (playerOfNextTurn === this.username) {
                    scene.GameHandler.turnCursor.visible = false;
                }
                console.log("store.getState().game.gameStates", store.getState().game.gameStates)
                console.log(scene.GameHandler.turnMessages)
                console.log(playerOfNextTurn)
                scene.GameHandler.turnMessages[playerOfNextTurn].visible = true;
                this.selfTextEnter = scene.tweens.add({
                    targets: scene.GameHandler.turnMessages[playerOfNextTurn],
                    ease: 'Expo.easeOut',
                    duration: 600,
                    x: 600,
                });
                this.selfTextEnter.on("complete", () => {
                    this.selfTextExit = scene.tweens.add({
                        targets: scene.GameHandler.turnMessages[playerOfNextTurn],
                        ease: 'Expo.easeIn',
                        duration: 600,
                        x: 1200,
                        origin: 0,
                        delay: 300,
                    });
                    this.selfTextExit.on("complete", () => {
                        scene.GameHandler.turnMessages[playerOfNextTurn].visible = false;
                        scene.GameHandler.turnMessages[playerOfNextTurn].setX(0)
                        if (playerOfNextTurn === this.username) {
                            console.log("bbbbb")
                            console.log(scene.GameHandler.turnMessages)
                            console.log(playerOfNextTurn)
                            this.revealPassButtonTween = scene.tweens.add({
                                targets: scene.GameHandler.passButton,
                                ease: 'Linear',
                                duration: 300,
                                alpha: 1,
                                delay: 100
                            })
                            scene.GameHandler.passButton.setInteractive();
                            // if next player is you only enable dropzone
                            this.turnChangeComplete = true;
                        }

                    })
                })
            })
            // change turn message
        }

        this.opponentPlaysCard = (player, cardsPlayed) => {
            if (store.getState().game.gameStates.slice(-1).pop().combination.length === 0) {
                this.changeTurnFromOpponents();
                return;
            }
            for (var i = 0; i < scene.GameHandler.lastPlayed.length; i++) {
                const target = scene.GameHandler.lastPlayed.getAt(i);
                scene.GameHandler.discarded.add(target)
                scene.tweens.add({
                    targets: target,
                    ease: 'Expo.easeOut',
                    duration: 900,
                    x: 1050,
                    y: 501,
                    depth: 1,
                    scale: (0.25, 0.25)
                });
            }
            scene.GameHandler.lastPlayed = new Phaser.Structs.List(scene)
            // opponent plays card tweens
            for (let i = 0; i < cardsPlayed.length; i++) {
                scene.GameHandler.lastPlayed.add(scene.GameHandler.opponentHands[player].list[i])
                const timeline = scene.tweens.createTimeline();
                const target = scene.GameHandler.opponentHands[player].list[i];
                scene.GameHandler.lastPlayed.add(target);
                scene.GameHandler.opponentHands[player].remove(target);
                // console.log(i, scene.GameHandler.opponentHands[player].list[i].y + 125)
                timeline.add({
                    targets: target,
                    ease: 'Expo.easeOut',
                    duration: 400,
                    // y: scene.GameHandler.opponentHands[player].list[i].y + 225,
                    y: 340,
                    scale: (0.16, 0.16),
                });
                timeline.add({
                    targets: target,
                    ease: 'Expo.easeOut',
                    duration: 800,
                    x: 600 - ((cardsPlayed.length - 1) / 2) * (cardSpacing * 2.9) +
                        i * cardSpacing * 2.9,
                    y: 501,
                    scale: (0.25, 0.25),
                });
                timeline.play();
                timeline.on("complete", () => {
                    this.flipTween = scene.add.tween({
                        targets: target,
                        ease: 'Linear',
                        duration: 200,
                        scaleX: 0.005,
                        scaleY: 0.25
                    })
                    this.flipTween.on("complete", () => {
                        target.setTexture(cardsPlayed[i]);
                        this.flipTweenEnd = scene.add.tween({
                            targets: target,
                            ease: 'Linear',
                            duration: 200,
                            scaleX: 0.25,
                            scaleY: 0.25
                        })
                        this.flipTweenEnd.on("complete", () => {
                            this.changeTurnFromOpponents();
                        })
                    })
                })
            }
        }

        this.playCards = (target) => {
            // discard tween
            // const timeline = scene.tweens.createTimeline();
            var discardedTween;
            for (var i = 0; i < scene.GameHandler.lastPlayed.length; i++) {
                const target = scene.GameHandler.lastPlayed.getAt(i);
                scene.GameHandler.discarded.add(target)
                discardedTween = scene.tweens.add({
                    targets: target,
                    ease: 'Expo.easeOut',
                    duration: 900,
                    x: 1050,
                    y: 501,
                    depth: store.getState().game.gameStates.slice(-1).pop().turn + 1,
                    scale: (0.25, 0.25)
                });
            }

            if (discardedTween) {
                discardedTween.on("complete", () => {
                    this.changeTurnToOpponents();
                })
            } else {
                this.changeTurnToOpponents()
            }
            scene.GameHandler.lastPlayed = new Phaser.Structs.List(scene)

            // self play cards tween
            if (this.cardsSelected.length === 1) {
                scene.GameHandler.lastPlayed.add(target);
                scene.GameHandler.playerHand.remove(target);
                target.setInteractive(false);
                scene.input.setDraggable(target, false);
                scene.tweens.add({
                    targets: target,
                    ease: 'Expo.easeOut',
                    duration: 400,
                    x: 600,
                    y: 501,
                    depth: 1,
                    scale: (0.25, 0.25)
                });
            } else if (this.cardsSelected.length > 1) {
                for (var i = 0; i < scene.GameHandler.playerHand.lifted.length; i++) {
                    const target = scene.GameHandler.playerHand.lifted[i];
                    scene.GameHandler.lastPlayed.add(target)
                    scene.GameHandler.playerHand.remove(target)
                    console.log("selfplaycards, scene.GameHandler.playerHand.lifted", scene.GameHandler.playerHand.lifted)
                    scene.tweens.killTweensOf(target)
                    scene.tweens.add({
                        targets: target,
                        ease: 'Expo.easeOut',
                        duration: 400,
                        x: 600 - ((scene.GameHandler.playerHand.lifted.length - 1) / 2) * (cardSpacing * 2.9) +
                            scene.GameHandler.playerHand.liftedByHandOrder[i] * cardSpacing * 2.9,
                        y: 501,
                        depth: scene.GameHandler.playerHand.liftedByHandOrder[i],
                        scale: (0.25, 0.25)
                    });
                    target.setInteractive(false);
                    scene.input.setDraggable(target, false);
                }
            }
            scene.GameHandler.playerHand.lifted = [];

            // disable pass
            scene.tweens.add({
                targets: scene.GameHandler.passButton,
                ease: 'Linear',
                duration: 300,
                alpha: 0,
                delay: 100
            })
            scene.GameHandler.passButton.disableInteractive();
        }

        //////////////////////////////////////////////////////////

        scene.GameHandler.passButton.on('pointerdown', () => {
            this.pass();
            this.changeTurnToOpponents();
            scene.tweens.add({
                targets: scene.GameHandler.passButton,
                ease: 'Linear',
                duration: 300,
                alpha: 0,
                delay: 100
            })
            scene.GameHandler.passButton.disableInteractive();
        });

        this.pass = () => {
            const gameStates = store.getState().game.gameStates;
            const players = store.getState().game.players;
            // const players = ["jeryong", "jirachi", "player12", "brinashong"]
            var allPassed = true;
            if (gameStates.length >= players.length) { // check if next turn can be free combination
                for (let i = 0; i < players.length - 2; i++) {
                    if (gameStates[gameStates.length - i - 1].combination.length > 0) {
                        allPassed = false;
                    }
                }
            } else {
                allPassed = false;
            }
            socket.emit("end_turn", {
                pin: store.getState().game.pin,
                cardsPlayed: [],
                nextTurnRank: allPassed ? "starting" : store.getState().game.gameStates.slice(-1).pop().rank
            });
        }

        scene.input.on('dragstart', (pointer, gameObject) => {
            this.unableToDropError = "";
            this.cardsSelected = getCardsSelected(gameObject);
            if (!this.cardsSelected) {
                throw 'No cards selected!'
            }
            scene.dropZone.setInteractive();
            if (!this.turnChangeComplete) {
                scene.dropZone.disableInteractive();
            }
            const latestGameState = store.getState().game.gameStates.slice(-1).pop();
            // check if cards attempted to be played is valid
            // console.log(combinationIsValid(this.cardsSelected, latestGameState))
            const { isValid, error, rank, cardsRequired } = combinationIsValid(this.cardsSelected, latestGameState);
            // this.curRank = latestGameState.rank;
            this.nextTurnRank = rank;
            this.curRankCardsRequired = cardsRequired ? cardsRequired : 5;
            if (!isValid) {
                this.unableToDropError = error;
                scene.dropZone.disableInteractive();
            }
            if (this.username !== store.getState().game.gameStates.slice(-1).pop().playerOfNextTurn) {
                this.unableToDropError = "Not your turn"
                scene.dropZone.disableInteractive();
            }
            console.log("gameobjectpre", gameObject)
            scene.tweens.killTweensOf(gameObject)
            console.log("gameObjectpost", gameObject)
            const curIndex = this.getCurIndex(gameObject)
            scene.GameHandler.playerHand.dragStartFromLifted = scene.GameHandler.playerHand.lifted.includes(gameObject);
            for (var i = 0; i < scene.GameHandler.playerHand.length; i++) {
                if (i === curIndex) {
                    this.addTween(i, 200, undefined, undefined, (0.28, 0.28), scene.GameHandler.playerHand.length)
                    continue;
                } else if (i < curIndex) {
                    this.addTween(i, 600, 0, undefined, undefined, i)
                } else {
                    this.addTween(i, 600, -4.5, undefined, undefined, i)
                }
            }
        })

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            const curIndex = this.getCurIndex(gameObject)
            const newIndex = this.getNewIndex(gameObject)
            const liftedLength = scene.GameHandler.playerHand.lifted.length;
            if (gameObject.y < 750) { //top
                scene.GameHandler.playerHand.draggedAboveHand = true;
                if (scene.GameHandler.playerHand.dragStartFromLifted && scene.GameHandler.playerHand.lifted.length) {
                    for (var i = 0; i < liftedLength; i++) {
                        if (scene.GameHandler.playerHand.lifted[i] === gameObject) {
                            gameObject.setDepth(scene.GameHandler.playerHand.liftedByHandOrder[i]);
                            continue;
                        }
                        const gameObjectIndexInLifted = scene.GameHandler.playerHand.lifted.indexOf(gameObject)
                        const gameObjectIndexInLiftedByHandOrder = scene.GameHandler.playerHand.liftedByHandOrder[gameObjectIndexInLifted];
                        console.log("scene.GameHandler.playerHand.lifted", scene.GameHandler.playerHand.lifted)
                        scene.tweens.add({
                            targets: scene.GameHandler.playerHand.lifted[i],
                            ease: 'Expo.easeOut',
                            duration: 600,
                            y: gameObject.y,
                            x: gameObject.x + 45 * (scene.GameHandler.playerHand.liftedByHandOrder[i] - gameObjectIndexInLiftedByHandOrder),
                            depth: scene.GameHandler.playerHand.liftedByHandOrder[i],
                            scale: (0.28, 0.28)
                        });
                    }
                    var prev = -1;
                    var j = 0;
                    for (var i = 0; i < scene.GameHandler.playerHand.length; i++) {
                        if (i === curIndex || scene.GameHandler.playerHand.lifted.includes(scene.GameHandler.playerHand.getAt(i))) {
                            j += 1;
                            continue;
                        }
                        while (j - prev > 1) { j -= 1 }
                        scene.tweens.add({
                            targets: scene.GameHandler.playerHand.list[i],
                            ease: 'Expo.easeOut',
                            duration: 600,
                            x: 600 - (scene.GameHandler.playerHand.length - 2 - liftedLength) * (cardSpacing / 2) + j * cardSpacing,
                        });
                        prev = j;
                        j += 1;
                    }
                } else {
                    for (var i = 0; i < scene.GameHandler.playerHand.length; i++) {
                        if (i === curIndex) { continue; } else if (i < curIndex) { this.addTween(i, 600, -2, undefined, undefined, i) } else { this.addTween(i, 600, 0, undefined, undefined, i) }
                    }
                }
            } else { //gameObject.y > 750 (bottom)
                if (scene.GameHandler.playerHand.draggedAboveHand && scene.GameHandler.playerHand.lifted.length > 1) { //means bring down multiple
                    const liftedLength = scene.GameHandler.playerHand.lifted.length
                    for (var i = 0; i < scene.GameHandler.playerHand.lifted.length; i++) {
                        const indexMoveToBySeq = scene.GameHandler.playerHand.liftedByHandOrder.indexOf(i);
                        const gameObjectToMove = scene.GameHandler.playerHand.lifted[indexMoveToBySeq];
                        scene.GameHandler.playerHand.moveTo(gameObjectToMove, newIndex + i)
                    }
                    for (var i = 0; i < liftedLength; i++) {
                        if (scene.GameHandler.playerHand.lifted[i] === gameObject) {
                            gameObject.setDepth(scene.GameHandler.playerHand.liftedByHandOrder[i] + 15);
                            continue;
                        }
                        const gameObjectIndexInLifted = scene.GameHandler.playerHand.lifted.indexOf(gameObject)
                        const gameObjectIndexInLiftedByHandOrder = scene.GameHandler.playerHand.liftedByHandOrder[gameObjectIndexInLifted];
                        scene.tweens.add({
                            targets: scene.GameHandler.playerHand.lifted[i],
                            ease: 'Expo.easeOut',
                            duration: 600,
                            x: gameObject.x + 45 * (scene.GameHandler.playerHand.liftedByHandOrder[i] - gameObjectIndexInLiftedByHandOrder),
                            y: gameObject.y,
                            depth: scene.GameHandler.playerHand.liftedByHandOrder[i] + 15,
                            scale: (0.28, 0.28)
                        });
                    }
                    for (var i = 0; i < scene.GameHandler.playerHand.length - liftedLength; i++) {
                        if (scene.GameHandler.playerHand.lifted.includes(scene.GameHandler.playerHand.list[i])) {
                            continue;
                        } else if (i < newIndex) {
                            this.addTween(i, 600, 0, undefined, undefined, i)
                        } else {
                            this.addTween(i + liftedLength, 600, -4.5, undefined, undefined, i)
                        }
                    }
                } else {
                    scene.GameHandler.playerHand.moveTo(gameObject, newIndex);
                    for (var i = 0; i < scene.GameHandler.playerHand.length; i++) {
                        if (i === newIndex) {
                            scene.GameHandler.playerHand.list[i].setDepth(scene.GameHandler.playerHand.length);
                            continue;
                        } else if (i < newIndex) { this.addTween(i, 600, 0, undefined, undefined, i) } else { this.addTween(i, 600, -4.5, undefined, undefined, i) }
                    }
                }
            }
        })

        scene.input.on('dragend', (pointer, gameObject, dropped) => {
            if (isInDropZone(gameObject.y)) {
                if (this.turnChangeComplete) {
                    // createPopup while animation continues
                    if (this.errorTimeline) {
                        this.errorTimeline.stop()
                        this.errorTimeline.destroy()
                        this.errorText.destroy()
                    }
                    this.errorText = scene.add.text(
                        600, 330, this.unableToDropError,
                        {
                            fontFamily: 'Raleway',
                            fontSize: '24px',
                            color: "#ff0000",
                        }).setOrigin(0.5);
                    this.errorTimeline = scene.tweens.createTimeline();
                    this.errorTimeline.add({
                        targets: this.errorText,
                        ease: 'Linear',
                        duration: 500,
                        scale: 1.1
                    });
                    this.errorTimeline.add({
                        targets: this.errorText,
                        ease: 'Linear',
                        duration: 500,
                        scale: 1.0
                    });
                    this.errorTimeline.add({
                        targets: this.errorText,
                        ease: 'Linear',
                        duration: 600,
                        alpha: 0,
                        delay: 3000
                    })
                    this.errorTimeline.play()
                    this.errorTimeline.on("complete", () => {
                        this.errorText.destroy();
                        this.errorTimeline.destroy();
                    })
                }

            }
            if (!dropped) {
                if (gameObject.y < gameObject.input.dragStartY - 20) {
                    if (!scene.GameHandler.playerHand.lifted.includes(gameObject)) {
                        scene.GameHandler.playerHand.lifted.push(gameObject);
                    }
                    if (scene.GameHandler.playerHand.lifted.length > this.curRankCardsRequired) {
                        scene.GameHandler.playerHand.lifted.shift()
                    }
                } else if (gameObject.y > gameObject.input.dragStartY + 10) {
                    if (scene.GameHandler.playerHand.draggedAboveHand && scene.GameHandler.playerHand.lifted.length > 1) {
                        scene.GameHandler.playerHand.lifted = [];
                    } else {
                        const index = scene.GameHandler.playerHand.lifted.indexOf(gameObject)
                        if (index > -1) {
                            scene.GameHandler.playerHand.lifted.splice(index, 1);
                        }
                    }
                }
                this.updateLiftedByHandOrder();
                for (var i = 0; i < scene.GameHandler.playerHand.length; i++) {
                    const y = scene.GameHandler.playerHand.lifted.includes(scene.GameHandler.playerHand.getAt(i))
                    this.addTween(i, 600, -1, y ? 800 : 860, (0.25, 0.25), i)
                }
                scene.GameHandler.playerHand.draggedAboveHand = false;
            }
        })

        this.updateLiftedByHandOrder = () => {
            const liftedLength = scene.GameHandler.playerHand.lifted.length;
            var playerHandIndex = [];
            for (var i = 0; i < liftedLength; i++) {
                const target = scene.GameHandler.playerHand.lifted[i]
                var obj = {}
                obj.index = i;
                obj.indexInHand = this.getCurIndex(target)
                playerHandIndex.push(obj)
            }
            playerHandIndex.sort((a, b) => parseFloat(a.indexInHand) - parseFloat(b.indexInHand));
            var finalIndex = [];
            for (var i = 0; i < liftedLength; i++) {
                const index = playerHandIndex.findIndex(object => {
                    return object.index === i;
                });
                finalIndex.push(index)
            }
            scene.GameHandler.playerHand.liftedByHandOrder = finalIndex;
        }

        this.getCurIndex = (gameObject) => {
            return scene.GameHandler.playerHand.getIndex(gameObject)
        }

        this.getNewIndex = (gameObject) => {
            const liftedLength = scene.GameHandler.playerHand.draggedAboveHand && scene.GameHandler.playerHand.dragStartFromLifted ? scene.GameHandler.playerHand.lifted.length - 1 : 0;
            return clamp(Math.round((gameObject.x - 600 + (scene.GameHandler.playerHand.length - 1 - liftedLength) * (cardSpacing / 2)) / cardSpacing), 0, scene.GameHandler.playerHand.length - 1 - liftedLength)
        }

        this.getCard = (gameObject) => {
            return gameObject.data.list.card;
        }

        this.addTween = (i, duration, cardXOffset, y, scale, depth) => {
            scene.tweens.add({
                targets: scene.GameHandler.playerHand.list[i],
                ease: 'Expo.easeOut',
                duration: duration,
                ...(cardXOffset !== undefined && { x: 600 - (scene.GameHandler.playerHand.length + cardXOffset) * (cardSpacing / 2) + i * cardSpacing }),
                ...(y && { y: y }),
                ...(scale && { scale: scale }),
                ...(depth + 1 && { depth: depth + 1 })
            });
        }

        const getCardsSelected = (gameObject) => {
            var cardsSelected = []
            if (!scene.GameHandler.playerHand.lifted.length) {
                cardsSelected.push(this.getCard(gameObject));
                return cardsSelected;
            } else {
                scene.GameHandler.playerHand.lifted.forEach(gameObject => {
                    cardsSelected.push(this.getCard(gameObject));
                })
                return cardsSelected;
            }
        }

        const isInDropZone = (y) => {
            return y < 650 && y > 225;
        }

    }
}
