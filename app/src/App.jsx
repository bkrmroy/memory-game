import { useEffect, useState } from "react";
import { helpers } from "./helpers";
import "./style/App.css";
function App() {
  const [ui, updateUi] = useState("home");
  const [mode, updateMode] = useState("");
  const [cards, setCards] = useState([]);
  const [modifiedCards, setModifiedCards] = useState([]);
  const [score, updateScore] = useState(0);
  const [highestScore, setHighestScore] = useState({
    easy: 0,
    normal: 0,
    hard: 0,
  });
  const [result, setResult] = useState("");
  const modes = ["easy", "normal", "hard"];
  const [displayedCards, setDisplayedCards] = useState([]);

  function selectCardsToDisplay() {
    const a = helpers.selectCardsForDisplay(modifiedCards, mode);
    if (a.length === 0) {
      setResult("win");
      handleGameOver();
    }
    setDisplayedCards([...a]);
  }
  function Cards() {
    return (
      <>
        <div className="cards-container">
          {displayedCards.map((eachCard) => {
            return (
              <div
                onClick={onCardClicked}
                data-name={eachCard.name}
                // data-flipped="true"
                className="card"
                key={eachCard.name}
              >
                <div className="inner">
                  <div className="front">
                    <img
                      className="card-img"
                      src={eachCard.img}
                      alt={eachCard.name}
                    />
                    <h2 className="card-title">{eachCard.name}</h2>
                  </div>
                  <h2 className="back"></h2>
                </div>
              </div>
            );
          })}
        </div>
        {/* {toggleFlippedData("remove")} */}
      </>
    );
  }
  function handleGameOver() {
    // setModifiedCards([]);
    updateUi("game-over");
    if (score >= highestScore[mode]) {
      setHighestScore({
        ...highestScore,
        [mode]: score,
      });
    }
  }
  function onCardClicked(e) {
    const title = e.currentTarget.querySelector(".card-title").textContent;
    setTimeout(() => {
      const tempCards = modifiedCards.map((card) => {
        if (card.name === title) {
          if (card.selected === true) {
            handleGameOver();
            return card;
          } else {
            updateScore(score + 1);
            if (score >= highestScore[mode]) {
              setHighestScore({
                ...highestScore,
                [mode]: score + 1,
              });
            }
            return { ...card, selected: true };
          }
        } else return card;
      });
      setModifiedCards([...helpers.shuffleArray(tempCards)]);
      // toggleFlippedData("remove");
    }, 300);
  }
  function displayModes(_modes) {
    return (
      <div className="modes">
        {_modes.map((_mode) => {
          return (
            <button
              onClick={() => {
                updateMode(_mode);
                updateUi("start-game");
              }}
              className={_mode}
              key={_mode}
            >
              {_mode}
            </button>
          );
        })}
      </div>
    );
  }
  //fetching data from api
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/top/characters", { mode: "cors" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not fetch data");
        return response.json();
      })
      .then((response) => {
        setCards(
          response.data.map((item) => {
            return {
              name: item.name,
              img: item.images.jpg.image_url,
              selected: false,
            };
          })
        );
      })
      .catch((error) => alert(error));
  }, []);
  //starting main game
  useEffect(() => {
    function startGame() {
      updateUi("playing");
      if (mode == "easy") {
        setModifiedCards(
          helpers.shuffleArray(cards).filter((element, index) => index < 10)
        );
      }
      if (mode == "normal")
        setModifiedCards(
          helpers.shuffleArray(cards).filter((element, index) => index < 15)
        );
      if (mode == "hard")
        setModifiedCards(
          helpers.shuffleArray(cards).filter((element, index) => index < 25)
        );
    }
    if (ui === "start-game" && cards.length > 0 && mode) {
      startGame();
    }
    if (modifiedCards.length > 0) selectCardsToDisplay();
  }, [ui, cards, mode, modifiedCards]);
  function reset() {
    updateUi("home");
    updateMode("");
    setModifiedCards([]);
    updateScore(0);
    setResult("");
  }
  return (
    <>
      {(ui === "playing" || ui === "game-over") && (
        <>
          {" "}
          <div className="scoreboard">
            <div className="current-score">CURRENT SCORE = {score}</div>
            <div className="highest-score">
              HIGHEST SCORE ={highestScore[mode]}
            </div>
          </div>
          <div className="instruction">If you select one card twice, you lose.</div>
        </>
      )}
      {ui == "home" && (
        <button className="btn-play" onClick={() => updateUi("modes")}>
          Play
        </button>
      )}
      {ui === "modes" && displayModes(modes)}
      {ui === "start-game" && cards.length < 1 && (
        <h1 className="loading">loading...</h1>
      )}
      {ui === "playing" && <Cards />}
      {ui === "game-over" && (
        <div className="game-over">
          <h1 className="game-over-title">
            Game Over. {result === "win" ? <>You win</> : null}
          </h1>
          <button className="btn-play-again" onClick={reset}>
            Play again{" "}
          </button>
        </div>
      )}
    </>
  );
}

export default App;
