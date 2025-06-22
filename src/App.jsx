import React, { useState } from 'react'
import './App.css'
import Title from "./components/Title.jsx";
import { Button, Container, Row, Col, Modal, Form, Card } from 'react-bootstrap';
import PopupWindow from "./components/PopupWindow.jsx";
import { useSelector, useDispatch } from 'react-redux'
import {getFormattedTime, increment, incrementTime, clearLeaderboard, setScore, setTime, setTotalScore, setTotalTime} from './store.js'
import TitleBar from "./components/game/TitleBar.jsx";
import GameWindow from "./components/game/GameWindow.jsx";
import Leaderboard from './components/Leaderboard.jsx';
import GridPageBackground from "./components/GridPageBackground.jsx";
import MainPageButtons from "./components/MainPageButtons";
// import CustomDifficultyPopup from "./components/CustomDifficultyPopup.jsx";
import DifficultySettings from "./components/DifficultySettings.jsx";

function App() {
  const count = useSelector(state => state.counter.value)
  const { score, time, totalTime, totalScore } = useSelector(state => state.game)
  const customSettings = useSelector(state => state.customSettings);
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showDifficultyPopup, setShowDifficultyPopup] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Difficulty button states for cycling, matching Settings page
  const DIFFICULTY_STATES = [
    { label: "EASY", value: "easy", className: "green" },
    { label: "MEDIUM", value: "medium", className: "yellow" },
    { label: "HARD", value: "hard", className: "red" },
    { label: "EXPERT", value: "expert", className: "red" },
    { label: "CUSTOM", value: "custom", className: "" },
  ];
  const [difficultyIdx, setDifficultyIdx] = useState(0); // default EASY

  // Helper to determine if a game is in progress
  const hasOngoingGame = (score > 0 || time > 0 || totalTime > 0 || totalScore > 0) && !showGame;

  // New state to control showing the difficulty selection inline
  const [showDifficultyInline, setShowDifficultyInline] = useState(false);

  // Default to easy if no difficulty is preselected
  React.useEffect(() => {
    if (!selectedDifficulty) {
      setSelectedDifficulty(DIFFICULTY_STATES[0].value);
      setDifficultyIdx(0);
    }
    // Only run on mount
    // eslint-disable-next-line
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

  const handleCustomStart = () => {
    setShowGame(true);
    setShowCustomForm(false);
  };

  const handleBackToMain = () => {
    setShowGame(false);
  };

  const handleContinue = () => {
    setShowGame(true);
  };

  const handleNewGame = () => {
    // Reset game state
    dispatch(setScore(0));
    dispatch(setTime(0));
    dispatch(setTotalScore(0));
    dispatch(setTotalTime(0));
    setShowDifficultyInline(true);
  };

  return (
    <>
      <GridPageBackground/>
      <Card style={{ background: '#23272b', color: 'white', margin: '32px auto 0', boxShadow: '0 2px 16px #0008' }}>
        <Card.Body className="d-flex flex-column align-items-center p-4">
          <Title size="large">Tile Matcher</Title>
        {/*<Title size="large">Tile Matcher</Title>*/}

      {/* Only show MainPageButtons if not showing difficulty or custom forms and not in game */}
      {!showGame && !showDifficultyInline && !showCustomForm && (
        <MainPageButtons
          hasOngoingGame={hasOngoingGame}
          onContinue={handleContinue}
          onNewGame={handleNewGame}
          onPlay={handlePlay}
          onInfo={() => setShowInfo(true)}
          onLeaderboard={() => setShowLeaderboard(true)}
        />
      )}
      {/* Inline difficulty selection UI replaces MainPageButtons when showDifficultyInline is true */}
      {!showGame && showDifficultyInline && (
        <DifficultySettings
          difficultyIdx={difficultyIdx}
          setDifficultyIdx={setDifficultyIdx}
          DIFFICULTY_STATES={DIFFICULTY_STATES}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          handleCustomStart={handleCustomStart}
          handleBack={() => setShowDifficultyInline(false)}
          handleSelectDifficulty={handleSelectDifficulty}
        />
      )}
      {showGame && <GameWindow
        difficulty={selectedDifficulty}
        customSettings={selectedDifficulty === 'custom' ? customSettings : undefined}
        onBackToMain={handleBackToMain}
      />}
        </Card.Body>
      </Card>
      {/* Remove PopupWindow for difficulty selection */}
      {/* <PopupWindow
          visible={showDifficultyPopup}
          title="Select Difficulty"
          onClose={() => setShowDifficultyPopup(false)}
          footer={
            <Button variant="primary" onClick={handleSelectDifficulty} disabled={!selectedDifficulty}>Continue</Button>
          }
      >
        <div className="difficulty-select" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <span style={{ marginBottom: 8 }}>Difficulty:</span>
          <button
              className={`settings-btn ${DIFFICULTY_STATES[difficultyIdx].className}`}
              style={{ fontSize: '1.2rem', minWidth: 120 }}
              onClick={handleCycleDifficulty}
              type="button"
          >
            {DIFFICULTY_STATES[difficultyIdx].label}
          </button>
        </div>
      </PopupWindow> */}
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
