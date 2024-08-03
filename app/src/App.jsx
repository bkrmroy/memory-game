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

	function displayCards(_cards) {
		const displayedCards = helpers.selectCardsForDisplay(_cards, mode);
		if (displayedCards.length === 0) {
			setResult("win");
			handleGameOver();
		}
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
		setModifiedCards([]);
		updateUi("game-over");
		if (score >= highestScore[mode]) {
			setHighestScore({
				...highestScore,
				[mode]: score,
			});
		}
	}
	function toggleFlippedData(addOrRemove) {
		const innerCards = document.querySelectorAll(".inner");
		innerCards.forEach((item) => {
			if (addOrRemove === "add") item.dataset.flipped = "true";
			else item.dataset.flipped = "";
		});
	}
	function onCardClicked(e) {
		// console.log(e.currentTarget);
		// const innerCard = e.currentTarget.querySelector(".inner");
		// innerCard.dataset.flipped = "true";
		toggleFlippedData("add");
		const title = e.currentTarget.querySelector(".card-title").textContent;
		//take Time
		setTimeout(() => {
			const tempCards = modifiedCards.map((card) => {
				if (card.name === title) {
					if (card.selected === true) handleGameOver();
					else {
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
			toggleFlippedData("remove");
		}, 600);
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
			.then((response) => response.json())
			.then((response) => {
				// setTimeout(() => {
				console.log("data fetched");
				setCards(
					response.data.map((item) => {
						return {
							name: item.name,
							img: item.images.jpg.image_url,
							selected: false,
						};
					})
				);

				// }, 2000);
			})
			.catch((error) => console.error(error));
	}, []);
	//starting main game
	useEffect(() => {
		function startGame() {
			updateUi("playing");
			// console.log("starting game");
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
	}, [ui, cards, mode]);
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
				<div className="scoreboard">
					<div className="current-score">CURRENT SCORE = {score}</div>
					<div className="highest-score">
						HIGHEST SCORE ={highestScore[mode]}
					</div>
				</div>
			)}
			{ui == "home" && (
				<button className="btn-play" onClick={() => updateUi("modes")}>
					Play
				</button>
			)}
			{ui === "modes" && displayModes(modes)}
			{ui === "start-game" && cards.length < 1 && <h1 className="loading">loading...</h1>}
			{ui === "playing" && displayCards(modifiedCards)}
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
