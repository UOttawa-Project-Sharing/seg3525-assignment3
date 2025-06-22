import React, { useState } from 'react'
import './App.css'
import Title from "./components/Title.jsx";
import { Button, Card } from 'react-bootstrap';
import PopupWindow from "./components/PopupWindow.jsx";
import { useSelector, useDispatch } from 'react-redux'
import {clearLeaderboard, setScore, setTime, setTotalScore, setTotalTime, deleteAllData} from './store.js'
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
  const [difficultyIdx, setDifficultyIdx] = useState(0);
  const hasOngoingGame = (score > 0 || time > 0 || totalTime > 0 || totalScore > 0) && !showGame;
  const [showDifficultyInline, setShowDifficultyInline] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePlay = () => setShowDifficultyInline(true);
  const handleSelectDifficulty = () => {
    if (selectedDifficulty) {
      setShowGame(true);
      setShowDifficultyInline(false);
    }
  };
  const handleBackToMain = () => setShowGame(false);
  const handleContinue = () => setShowGame(true);
  const handleNewGame = () => {
    dispatch(setScore(0));
    dispatch(setTime(0));
    dispatch(setTotalScore(0));
    dispatch(setTotalTime(0));
    setShowDifficultyInline(true);
  };
  const handleDeleteData = () => {
    setShowDeleteConfirm(true);
  };
  const confirmDeleteData = () => {
    dispatch(deleteAllData());
    setShowGame(false);
    setShowDifficultyInline(false);
    setSelectedDifficulty('');
    setDifficultyIdx(0);
    setShowInfo(false);
    setShowLeaderboard(false);
    setShowDeleteConfirm(false);
  };
  const cancelDeleteData = () => {
    setShowDeleteConfirm(false);
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
          onDeleteData={handleDeleteData}
        />
      )}
      {!showGame && showDifficultyInline && (
        <DifficultySettings
          difficultyIdx={difficultyIdx}
          setDifficultyIdx={setDifficultyIdx}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
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
      <PopupWindow
          visible={showInfo}
          title="How to Play"
          onClose={() => setShowInfo(false)}
      >
        <div>
          <ul style={{ paddingLeft: 20 }}>
            <li>Click <strong>Play</strong> to start a new game, or <strong>Continue Game</strong> if you have an ongoing game.</li>
            <li>Select a preset difficulty (Easy, Medium, Hard, Expert) or choose <strong>Custom</strong> to set your own grid size, display time, and up to 10 colors.</li>
            <li>Before starting, you can choose which colors to use for each mode in the settings window (including grayscale or color modes).</li>
            <li>When the game starts, memorize the reference pattern shown for a few seconds (display time depends on difficulty).</li>
            <li>Recreate the pattern by clicking tiles. In color mode, each click cycles through the available colors. In grayscale mode, tiles toggle between gray and white.</li>
            <li>Use the <strong>Hint</strong> button to briefly show the reference pattern again (pauses the timer).</li>
            <li>Click <strong>Finish</strong> when you think your pattern matches the reference. Your accuracy and time will be scored.</li>
            <li>Use the <strong>Pause</strong> button to pause/resume the game at any time.</li>
            <li>View your best scores and times in the <strong>Leaderboard</strong>. You can clear the leaderboard if desired.</li>
            <li>In custom mode, use the color picker to add or remove colors (up to 10) and adjust grid size and display time.</li>
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
      <PopupWindow
        visible={showDeleteConfirm}
        title="Delete All Data?"
        onClose={cancelDeleteData}
        footer={
          <>
            <Button variant="danger" onClick={confirmDeleteData}>Delete</Button>
            <Button variant="secondary" onClick={cancelDeleteData}>Cancel</Button>
          </>
        }
      >
        <div>
          Are you sure you want to delete all saved data? This will reset your progress, settings, and leaderboard. This action cannot be undone.
        </div>
      </PopupWindow>
    </>
  )
}

export default App
