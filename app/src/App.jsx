import { useEffect, useState } from "react";
import { helpers } from "./helpers";
import "./style/App.css";
function App() {
	const [ui, updateUi] = useState("home");
	const [mode, updateMode] = useState("");
	const [cards, setCards] = useState([]);
	const [modifiedCards, setModifiedCards] = useState([]);
	const [score, updateScore] = useState(0);
	const modes = ["easy", "normal", "hard"];

	function displayCards(_cards) {
		console.log("displaying cards");
		return (
			<div className="cards-container">
				{_cards.map((eachCard) => {
					return (
						<div className="card" key={eachCard.name}>
							<img
								className="card-img"
								src={eachCard.img}
								alt={eachCard.name}
							/>
							<h2 className="card-title">{eachCard.name}</h2>
						</div>
					);
				})}
			</div>
		);
	}

	function displayModes(_modes) {
		return (
			<>
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
			</>
		);
	}
	//fetching data from api
	useEffect(() => {
		console.log("fetching data from api");
		fetch("https://api.jikan.moe/v4/top/characters", { mode: "cors" })
			.then((response) => response.json())
			.then((response) => {
				// setTimeout(() => {
				// console.log(response);
				setCards(
					response.data.map((item) => {
						return {
							name: item.name,
							img: item.images.jpg.image_url,
							selected: "unselected",
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
			console.log("starting game");
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
	return (
		<>
			{ui == "home" && (
				<button className="btn-play" onClick={() => updateUi("modes")}>
					Play
				</button>
			)}
			{ui === "modes" && displayModes(modes)}
			{ui === "start-game" && cards.length < 1 && <h1>loading...</h1>}
			{/* {ui == "start-game" && cards !== "" && startGame(mode)} */}
			{ui === "playing" && displayCards(modifiedCards)}
		</>
	);
}

export default App;
