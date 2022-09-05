const DECK_OF_CARDS = [
    "3D", "3C", "3H", "3S",
    "4D", "4C", "4H", "4S",
    "5D", "5C", "5H", "5S",
    "6D", "6C", "6H", "6S",
    "7D", "7C", "7H", "7S",
    "8D", "8C", "8H", "8S",
    "9D", "9C", "9H", "9S",
    "TD", "TC", "TH", "TS",
    "JD", "JC", "JH", "JS",
    "QD", "QC", "QH", "QS",
    "KD", "KC", "KH", "KS",
    "AD", "AC", "AH", "AS",
    "2D", "2C", "2H", "2S",
]

const getRank = (card) => {
    console.log(card, DECK_OF_CARDS.indexOf(card))
    return DECK_OF_CARDS.indexOf(card);
}
const sortByRank = cards => {
    return cards.sort((a, b) => {
        return DECK_OF_CARDS.indexOf(a) - DECK_OF_CARDS.indexOf(b)
    })
}

function Deck(cards) {
    if (cards) {
        this.cards = cards;
    } else {
        this.cards = [...DECK_OF_CARDS];
    }
    Deck.prototype.getCards = () => {
        return this.cards;
    };
    Deck.prototype.shuffle = () => {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            const temp = this.cards[j]
            this.cards[j] = this.cards[i]
            this.cards[i] = temp
        }
        return new Deck([...this.cards])
    }
    Deck.prototype.deal = (players) => {
        const handSize = Math.floor(this.cards.length / players.length);
        const playersHand = {};
        players.forEach((player, index) => {
            console.log(this.cards.slice(handSize * index, handSize * (index + 1)))
            const startingHand = [...this.cards.slice(handSize * index, handSize * (index + 1))];
            playersHand[player] = sortByRank(startingHand)
                // playersHand[player] = sortByRank(this.cards.slice(handSize * index, handSize * (index + 1)))
        })
        return playersHand;
    }
}

module.exports = {
    Deck: Deck
}