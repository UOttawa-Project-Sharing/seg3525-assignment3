import React, { useState } from 'react'
import './App.css'
import Title from "./components/Title.jsx";
import { Button, Card } from 'react-bootstrap';
import PopupWindow from "./components/PopupWindow.jsx";
import { useSelector, useDispatch } from 'react-redux'
import {clearLeaderboard, setScore, setTime, setTotalScore, setTotalTime} from './store.js'
import GameWindow from "./components/game/GameWindow.jsx";
import Leaderboard from './components/Leaderboard.jsx';
import GridPageBackground from "./components/GridPageBackground.jsx";
import MainPageButtons from "./components/MainPageButtons";
import DifficultySettings from "./components/DifficultySettings.jsx";

function App() {
  const { score, time, totalTime, totalScore } = useSelector(state => state.game)
  const customSettings = useSelector(state => state.customSettings);
  const dispatch = useDispatch()
  const [showGame, setShowGame] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const DIFFICULTY_STATES = [
    { label: "EASY", value: "easy", className: "green", settings: { width: 5, height: 2, colors: ['#c9c9c9'], displayTime: 3 } },
    { label: "MEDIUM", value: "medium", className: "blue", settings: { width: 5, height: 5, colors: ['#c9c9c9'], displayTime: 4 } },
    { label: "HARD", value: "hard", className: "red", settings: { width: 6, height: 6, colors: ['#FF0000', '#00FF00', '#0000FF'], displayTime: 5 } },
    { label: "EXPERT", value: "expert", className: "red", settings: { width: 7, height: 7, colors: ['#FF0000', '#00FF00', '#0000FF'], displayTime: 6 } },
    { label: "CUSTOM", value: "custom", className: "" },
  ];
  const [difficultyIdx, setDifficultyIdx] = useState(0);
  const hasOngoingGame = (score > 0 || time > 0 || totalTime > 0 || totalScore > 0) && !showGame;
  const [showDifficultyInline, setShowDifficultyInline] = useState(false);

  React.useEffect(() => {
    if (!selectedDifficulty) {
      setSelectedDifficulty(DIFFICULTY_STATES[0].value);
      setDifficultyIdx(0);
    }
  }, []);

  const handlePlay = () => {
    setShowDifficultyInline(true);
  };

  const handleSelectDifficulty = () => {
    if (selectedDifficulty) {
      setShowGame(true);
      setShowDifficultyInline(false);
    }
  };

  const handleBackToMain = () => {
    setShowGame(false);
  };

  const handleContinue = () => {
    setShowGame(true);
  };

  const handleNewGame = () => {
    dispatch(setScore(0));
    dispatch(setTime(0));
    dispatch(setTotalScore(0));
    dispatch(setTotalTime(0));
    setShowDifficultyInline(true);
  };

  return (
    <>
      <GridPageBackground/>
      <Card style={{ background: '#23272b', color: 'white', boxShadow: '0 2px 16px #0008', minWidth: '50vw' }}>
        <Card.Body className="d-flex flex-column align-items-center">
          <Title size="large">Tile Matcher</Title>
      {!showGame && !showDifficultyInline && (
        <MainPageButtons
          hasOngoingGame={hasOngoingGame}
          onContinue={handleContinue}
          onNewGame={handleNewGame}
          onPlay={handlePlay}
          onInfo={() => setShowInfo(true)}
          onLeaderboard={() => setShowLeaderboard(true)}
        />
      )}
      {!showGame && showDifficultyInline && (
        <DifficultySettings
          difficultyIdx={difficultyIdx}
          setDifficultyIdx={setDifficultyIdx}
          DIFFICULTY_STATES={DIFFICULTY_STATES}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          handleBack={() => setShowDifficultyInline(false)}
          handleSelectDifficulty={handleSelectDifficulty}
        />
      )}
      {showGame && <GameWindow
        difficulty={selectedDifficulty}
        customSettings={selectedDifficulty === 'custom' ? customSettings : undefined}
        difficultyStates={DIFFICULTY_STATES}
        presetSettings={selectedDifficulty !== 'custom' ? (DIFFICULTY_STATES.find(d => d.value === selectedDifficulty)?.settings) : undefined}
        onBackToMain={handleBackToMain}
      />}
        </Card.Body>
      </Card>
      <PopupWindow
          visible={showInfo}
          title="How to Play"
          onClose={() => setShowInfo(false)}
      >
        <div>
          <ul style={{ paddingLeft: 20 }}>
            <li>Click <strong>Play</strong> to start a new game, or <strong>Continue Game</strong> if you have an ongoing game.</li>
            <li>Select a difficulty or create a custom one.</li>
            <li>Memorize the pattern shown when the game starts.</li>
            <li>Recreate the pattern by clicking tiles. In color mode, click to cycle through colors.</li>
            <li>Use the <strong>Hint</strong> button to briefly show the reference pattern again.</li>
            <li>Click <strong>Finish</strong> when you think your pattern matches the reference.</li>
            <li>Use the color picker in custom mode to add up to 10 colors.</li>
          </ul>
          <hr />
          <div style={{ fontSize: '0.95em', color: '#666' }}>
            <strong>Credits:</strong> <br />
            Developed by Tristan Robichaud and Zachary Shewan for SEG3525 Assignment 3.<br />
            Powered by React, Redux, and Bootstrap.
          </div>
        </div>
      </PopupWindow>
      <PopupWindow
          visible={showLeaderboard}
          title="Leaderboard"
          onClose={() => setShowLeaderboard(false)}
          footer={
            <>
              <Button variant="danger" size="sm" onClick={() => dispatch(clearLeaderboard())}>Clear</Button>
              <Button variant="secondary" size="sm" onClick={() => setShowLeaderboard(false)}>Close</Button>
            </>
          }
      >
        <Leaderboard />
      </PopupWindow>
    </>
  )
}

export default App
