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
    return DECK_OF_CARDS.indexOf(card);
}
const sortByRank = cards => {
    return cards.sort((a, b) => {
        return getRank(a) - getRank(b)
    })
}
const getHighestRank = (cards) => {
    var max = 0;
    cards.forEach(card => {
        const rank = getRank(card)
        if (rank > max) {
            max = rank;
        }
    })
    return max;
}
const getSuitRank = (card) => {
    return getRank(card) % 4;
}
const getFaceRank = (card) => {
    return Math.floor(getRank(card) / 4)
}
const hasSameFaceRank = (cards) => {
    for (let i = 0; i < cards.length - 1; i++) {
        if (getFaceRank(cards[i]) !== getFaceRank(cards[i + 1])) {
            return false;
        }
    }
    return true
}



const isStraight = (cards) => {
    const sorted = sortByRank(cards);
    var sortedRank = sorted.map(card => getFaceRank(card));
    while (sortedRank.some(rank => rank + 1 > 12)) {
        sortedRank = sortedRank.map(rank => (rank + 1) % 13);
    }
    sortedRank.sort();
    for (let i = 0; i < sortedRank.length - 1; i++) {
        if (sortedRank[i] + 1 !== sortedRank[i + 1]) {
            return false;
        }
    }
    return true;
}

const isFlush = (cards) => {
    for (let i = 0; i < cards.length - 1; i++) {
        if (getSuitRank(cards[i]) !== getSuitRank(cards[i + 1])) {
            return false;
        }
    }
    return true;
}

const isFullHouse = (cards) => {
    const sorted = sortByRank(cards);
    return (
        hasSameFaceRank(sorted.slice(0, 2)) && hasSameFaceRank(sorted.slice(2, 5)) ||
        hasSameFaceRank(sorted.slice(0, 3)) && hasSameFaceRank(sorted.slice(3, 5))
    )
}

const isFourOfAKind = (cards) => {
    const sorted = sortByRank(cards);
    return (
        hasSameFaceRank(sorted.slice(0, 4)) || hasSameFaceRank(sorted.slice(1, 5))
    )
}

const isRoyalFlush = (cards) => {
    return isStraight(cards) && isFlush(cards);
}

const fiveCardsHandRank = [
    "straight", "flush", "fullHouse", "FourOfAKind", "RoyalFlush"
]



const isSingles = (cards) => {
    return cards.length === 1;
}

const isDoubles = (cards) => {
    return cards.length === 2 && hasSameFaceRank(cards);
}
const isTriples = (cards) => {
    return cards.length === 3 && hasSameFaceRank(cards);
}

const getFiveCardsHandRank = (cards) => {
    var rank = "invalid";
    if (cards.length !== 5) {
        return rank;
    }
    if (isStraight(cards)) {
        rank = "straight";
    }
    if (isFlush(cards)) {
        rank = "flush";
    }
    if (isFullHouse(cards)) {
        rank = "fullHouse";
    }
    if (isFourOfAKind(cards)) {
        rank = "FourOfAKind";
    }
    if (isRoyalFlush(cards)) {
        rank = "RoyalFlush";
    }
    return rank;
}

const compareSingles = (prev, curr) => {
    if (!isSingles(curr)) {
        return { isValid: false, error: "please choose exactly one card for this turn." };
    }
    if (!(getHighestRank(curr) > getHighestRank(prev))) {
        return { isValid: false, error: "please choose a combination with a higher rank" };
    }
    return { isValid: true, rank: "singles", cardsRequired: 1 };
}

const compareDoubles = (prev, curr) => {
    if (!isDoubles(curr)) {
        return { isValid: false, error: "please choose exactly two cards with the same face values." };
    }
    if (!(getHighestRank(curr) > getHighestRank(prev))) {
        return { isValid: false, error: "please choose a combination with a higher rank" };
    }
    return { isValid: true, rank: "doubles", cardsRequired: 2 };
}

const compareTriples = (prev, curr) => {
    if (!isTriples(curr)) {
        return { isValid: false, error: "please choose exactly three cards with the same face values" };
    }
    if (!(getHighestRank(curr) > getHighestRank(prev))) {
        return { isValid: false, error: "please choose a combination with a higher rank" };
    }
    return { isValid: true, rank: "triples", cardsRequired: 3 };
}

const compareFiveCardsHand = (prev, curr) => {
    if (curr.length !== 5) {
        console.log("1")
        return { isValid: false, error: "please choose exactly five cards for this turn." };
    }
    console.log("2")

    const currCombination = getFiveCardsHandRank(curr);
    const prevCombination = getFiveCardsHandRank(prev);
    console.log("3")

    if (currCombination === "invalid") {
        console.log("4")

        return { isValid: false, error: "please select a valid 5-cards combination" };
    }
    if (currCombination === prevCombination) {
        console.log("5")

        const defaultReturn = { isValid: true, rank: "fiveCardsHand", cardsRequired: 5 };
        switch (currCombination) {
            case "straight":
                if (getHighestRank(curr) > getHighestRank(curr)) {
                    return defaultReturn;
                }
            case "flush":
                if (getSuitRank(curr[0]) > getSuitRank(prev[0])) {
                    return defaultReturn;
                }
            case "fullHouse":
                if (getRank(sortByRank(curr)[2]) > getRank(sortByRank(prev)[2])) {
                    return defaultReturn;
                }
            case "FourOfAKind":
                if (getRank(sortByRank(curr)[2]) > getRank(sortByRank(prev)[2])) {
                    return defaultReturn;
                }
            case "RoyalFlush":
                if (getHighestRank(curr) > getHighestRank(prev)) {
                    return defaultReturn;
                }
        }
    } else {
        console.log("6")

        if (fiveCardsHandRank.indexOf(currCombination) > fiveCardsHandRank.indexOf(prevCombination)) {
            return { isValid: true, rank: "fiveCardsHand", cardsRequired: 5 };
        }
    }
    console.log("7")

    return { isValid: false, error: "please choose a combination with a higher rank" };
}

const getStartingCombination = (cards, turn) => {
    if (turn === 0) {
        if (!cards.includes("3D")) {
            return { isValid: false, error: "you can only play a combination which includes 3 of Diamond." };
        }
    }
    if (isSingles(cards)) {
        return { isValid: true, rank: "singles", cardsRequired: 5 }
    }
    if (isDoubles(cards)) {
        return { isValid: true, rank: "doubles", cardsRequired: 5 }
    }
    if (isTriples(cards)) {
        return { isValid: true, rank: "triples", cardsRequired: 5 }
    }
    if (getFiveCardsHandRank(cards) !== "invalid") {
        return { isValid: true, rank: "fiveCardsHand", cardsRequired: 5 }
    }
    return { isValid: false, error: "please choose a valid combination of any rank" };
}

// const isNewTrick = gameStates => {}

const combinationIsValid = (selectedCards, latestGameState) => {
    // const [prevGameState] = gameStates.slice(-1);
    // console.log(latestGameState)
    const prevRank = latestGameState.rank;
    const curr = selectedCards;
    const prev = latestGameState.combination;
    // console.log(prevRank)
    switch (prevRank) {
        case "starting":
            // console.log(getStartingCombination(curr, latestGameState.turn))
            return getStartingCombination(curr, latestGameState.turn);
        case "singles":
            // console.log(compareSingles(prev, curr))
            return compareSingles(prev, curr);
        case "doubles":
            // console.log(compareDoubles(prev, curr))
            return compareDoubles(prev, curr);
        case "triples":
            // console.log(compareTriples(prev, curr))
            return compareTriples(prev, curr);
        case "fiveCardsHand":
            // console.log(compareFiveCardsHand(prev, curr))
            return compareFiveCardsHand(prev, curr);
        default:
            // console.log("default")
            return { isValid: false, error: "rank not defined" }
    }
}

export default combinationIsValid


// const isValidStartingCombination = cards => {
//     if (
//         isSingles(cards) ||
//         isDoubles(cards) ||
//         isTriples(cards) ||
//         getFiveCardsHandRank(cards) !== "invalid"
//     ) {
//         return { isValid: true };
//     }
//     return { isValid: false, error: "please choose a valid combination of any rank" };
// }