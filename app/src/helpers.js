const helpers = (() => {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function areAllNumbersUnique(numbers) {
    const uniqueNumbers = new Set(numbers);
    return uniqueNumbers.size === numbers.length;
  }
  function randomArray(length, max) {
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(getRandomInt(max));
    }
    if (areAllNumbersUnique(arr)) return arr;
    else return randomArray(length, max);
  }
  function checkAllSelected(arrayOfCards) {
    let allAreSelected = true;
    console.log(arrayOfCards)
    for (let i = 0; i < arrayOfCards.length; i++) {
      
      if (arrayOfCards[i].selected === false) {
        allAreSelected = false;
        break;
      }
    }
    return allAreSelected;
  }
  function prepareCards(cards, limit, totalCards) {
    const arrayOfCards = [];
    const arrayOfIndexes = randomArray(limit, totalCards);
    for (let i = 0; i < arrayOfIndexes.length; i++) {
      arrayOfCards.push(cards[arrayOfIndexes[i]]);
    }
    if (checkAllSelected(arrayOfCards))
      return prepareCards(cards, limit, totalCards);
    return arrayOfCards;
  }
  //main card selector function
  function selectCardsForDisplay(cards, mode) {
    const limit =
      mode === "easy" ? 4 : mode === "normal" ? 7 : mode === "hard" ? 10 : null;
    if (checkAllSelected(cards)) return [];
    else return prepareCards(cards, limit, cards.length);
  }
  return { shuffleArray, selectCardsForDisplay };
})();
export { helpers };
