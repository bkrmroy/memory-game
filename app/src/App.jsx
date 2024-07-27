import { useState } from "react";
import "./style/App.css";
function App() {
	const [ui, updateUi] = useState("home");
	const [mode, updateMode] = useState("");
	const modes = ["easy", "normal", "hard"];

	function startGame(_mode) {
		return <h1>playing in {_mode} mode</h1>;
	}
	function displayModes(_modes) {
		return (
			<>
				{_modes.map((_mode) => {
					return (
						<button
							onClick={() => {
								updateMode(_mode);
								updateUi("game");
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

	return (
		<>
			{ui == "home" && (
				<button className="btn-play" onClick={() => updateUi("modes")}>
					Play
				</button>
			)}
			{ui == "modes" && displayModes(modes)}
			{ui == "game" && startGame(mode)}
		</>
	);
}

export default App;
