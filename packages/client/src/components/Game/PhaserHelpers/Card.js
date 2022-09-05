export default class Card {
    constructor(scene) {
        this.render = (x, y, value, radian) => {
            let card;
            if (value !== "cardback") {
                card = scene.add.image(x, y, value).setScale(0.25, 0.25).setInteractive().setData({
                    "card": value
                });
                scene.input.setDraggable(card);
            } else {
                card = scene.add.image(x, y, value).setScale(0.15, 0.15).setRotation(radian).setData({
                    "card": value
                });

            }
            return card;
        }
    }
}