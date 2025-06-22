import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Title from "./components/Title.jsx";
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import PopupWindow from "./components/PopupWindow.jsx";
import { useSelector, useDispatch } from 'react-redux'
import {getFormattedTime, increment, incrementTime, clearLeaderboard, setScore, setTime, setTotalScore, setTotalTime} from './store.js'
import TitleBar from "./components/game/TitleBar.jsx";
import GameWindow from "./components/game/GameWindow.jsx";
import Leaderboard from './components/Leaderboard.jsx';

function App() {
  const count = useSelector(state => state.counter.value)
  const { score, time, totalTime, totalScore } = useSelector(state => state.game)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [customSettings, setCustomSettings] = useState({
    width: 5,
    height: 2,
    displayTime: 3,
    colors: ['#ff0000']
  });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showDifficultyPopup, setShowDifficultyPopup] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handlePlay = () => {
    setShowDifficultyPopup(true);
  };

  const handleSelectDifficulty = () => {
    if (selectedDifficulty) {
      if (selectedDifficulty === 'custom') {
        setShowCustomForm(true);
      } else {
        setShowGame(true);
      }
      setShowDifficultyPopup(false);
    }
  };

  const handleCustomStart = () => {
    setShowGame(true);
    setShowCustomForm(false);
  };

  const handleCustomBack = () => {
    setShowCustomForm(false);
    setShowDifficultyPopup(true);
  };

  const handleCustomChange = (e) => {
    const { name, value, type } = e.target;
    setCustomSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleColorChange = (idx, color) => {
    setCustomSettings(prev => {
      const newColors = [...prev.colors];
      newColors[idx] = color;
      return { ...prev, colors: newColors };
    });
  };

  const handleAddColor = () => {
    setCustomSettings(prev => {
      if (prev.colors.length < 10) {
        return { ...prev, colors: [...prev.colors, '#000000'] };
      }
      return prev;
    });
  };

  const handleRemoveColor = (idx) => {
    setCustomSettings(prev => {
      if (prev.colors.length > 1) {
        const newColors = prev.colors.filter((_, i) => i !== idx);
        return { ...prev, colors: newColors };
      }
      return prev;
    });
  };

  // use customSettings variable to set the game difficulty
  const handleBackToMain = () => {
    setShowGame(false);
    setCustomSettings({
        width: 5,
        height: 2,
        displayTime: 3,
        colors: ['#ff0000']
    });
  };

  // Helper to determine if a game is in progress
  const hasOngoingGame = (score > 0 || time > 0 || totalTime > 0 || totalScore > 0) && !showGame;

  const handleContinue = () => {
    setShowGame(true);
  };

  const handleNewGame = () => {
    // Reset game state
    dispatch(setScore(0));
    dispatch(setTime(0));
    dispatch(setTotalScore(0));
    dispatch(setTotalTime(0));
    setShowDifficultyPopup(true);
  };

  return (
    <>
        <Title size="large">Tile Matcher</Title>
        {!showGame && (
          <Container style={{ maxWidth: 220 }} className="d-flex flex-column align-items-center gap-2 my-3">
            {hasOngoingGame ? (
              <>
                <Button variant="primary" size="lg" className="w-100" onClick={handleContinue}>Continue Game</Button>
                <Button variant="danger" size="lg" className="w-100" onClick={handleNewGame}>New Game</Button>
              </>
            ) : (
              <Button variant="primary" size="lg" className="w-100" onClick={handlePlay}>Play</Button>
            )}
            <Button variant="secondary" size="lg" className="w-100" onClick={() => setShowInfo(true)}>Info</Button>
            <Button variant="success" size="lg" className="w-100" onClick={() => setShowLeaderboard(true)}>Leaderboard</Button>
          </Container>
        )}
        <PopupWindow
          visible={showDifficultyPopup}
          title="Select Difficulty"
          onClose={() => setShowDifficultyPopup(false)}
          footer={
            <Button variant="primary" onClick={handleSelectDifficulty} disabled={!selectedDifficulty}>Continue</Button>
          }
        >
          <div className="difficulty-select">
            <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="easy">Easy (5x5, no color)</option>
              <option value="medium">Medium (10x10, no color)</option>
              <option value="hard">Hard (10x10, color)</option>
              <option value="expert">Expert (10x20, color)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </PopupWindow>
        <PopupWindow
          visible={showCustomForm}
          title="Custom Difficulty"
          onClose={handleCustomBack}
          footer={
            <>
              <Button variant="primary" onClick={handleCustomStart}>Start Game</Button>
              <Button variant="secondary" onClick={handleCustomBack}>Back</Button>
            </>
          }
        >
          <div className="custom-difficulty-form">
            <label>
              Width:
              <input type="number" name="width" min="2" max="20" value={customSettings.width} onChange={handleCustomChange} />
            </label>
            <label>
              Height:
              <input type="number" name="height" min="2" max="20" value={customSettings.height} onChange={handleCustomChange} />
            </label>
            <label>
              First Display Time (seconds):
              <input type="number" name="displayTime" min="1" max="30" value={customSettings.displayTime} onChange={handleCustomChange} />
            </label>
            <div style={{ marginBottom: 8 }}>
              <span>Colors to Paint With:</span>
              {customSettings.colors.map((color, idx) => (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 8 }}>
                  <input type="color" value={color} onChange={e => handleColorChange(idx, e.target.value)} />
                  {customSettings.colors.length > 1 && (
                    <button type="button" style={{ marginLeft: 2 }} onClick={() => handleRemoveColor(idx)}>-</button>
                  )}
                </span>
              ))}
              {customSettings.colors.length < 10 && (
                <button type="button" style={{ marginLeft: 4 }} onClick={handleAddColor}>+</button>
              )}
            </div>
          </div>
        </PopupWindow>
        <PopupWindow
          visible={showInfo}
          title="How to Play"
          onClose={() => setShowInfo(false)}
        >
          <div>
            <ul style={{ paddingLeft: 20 }}>
              <li>Click <strong>Play</strong> to start a new game.</li>
              <li>Select a difficulty or create a custom one.</li>
              <li>Memorize the pattern shown.</li>
              <li>Recreate the pattern by clicking tiles.</li>
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
        {showGame && <GameWindow
          difficulty={selectedDifficulty}
          customSettings={selectedDifficulty === 'custom' ? customSettings : undefined}
          onBackToMain={handleBackToMain}
        />}
    </>
  )
}

export default App
