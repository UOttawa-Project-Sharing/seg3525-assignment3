import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {setScore, setTime, setTotalTime, setTotalScore, getFormattedTime, addEntry, clearLeaderboard} from '../../store.js';
import TitleBar from './TitleBar.jsx';
import Leaderboard from '../Leaderboard.jsx';
import PopupWindow from '../PopupWindow.jsx';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

// Helper to generate a random grid
function generateGrid(rows, cols, colors) {
  return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)])
  );
}

function getGridConfig(difficulty) {
  const customSettings = useSelector(state => state.customSettings);
  if (difficulty === 'custom') {
    // add white to custom colors if not present
    let colors = customSettings.colors;
    if (!colors.includes('white')) {
      colors = [...colors, 'white'];
    }
    return {
      rows: customSettings.height,
      cols: customSettings.width,
      colors: colors,
      colorMode: colors.length > 1,
      showReferenceTime: customSettings.displayTime || 3
    };
  }
  switch (difficulty) {
    case 'easy':
      return { rows: 5, cols: 5, colors: ['gray', 'white'], colorMode: false, showReferenceTime: 3 };
    case 'medium':
      return { rows: 10, cols: 10, colors: ['gray', 'white'], colorMode: false, showReferenceTime: 3 };
    case 'hard':
      return { rows: 10, cols: 10, colors: ['red', 'blue', 'green', 'yellow'], colorMode: true, showReferenceTime: 3 };
    case 'expert':
      return { rows: 10, cols: 20, colors: ['red', 'blue', 'green', 'yellow'], colorMode: true, showReferenceTime: 3 };
    default:
      return { rows: 5, cols: 5, colors: ['gray', 'white'], colorMode: false, showReferenceTime: 3 };
  }
}

function GameWindow({ difficulty, onBackToMain }) {
  const dispatch = useDispatch();
  const { score, time, totalTime, totalScore } = useSelector(state => state.game);
  const [showReference, setShowReference] = useState(true);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true); // Add running state
  const [hintActive, setHintActive] = useState(false); // Track if hint is active
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [pause, setPause] = useState(false); // Track if pause UI should show
  const [win, setWin] = useState(false); // Track if the user has won
  const [winScore, setWinScore] = useState(0); // Store win accuracy

  // Get config based on difficulty or custom
  const { rows, cols, colors, colorMode, showReferenceTime } = getGridConfig(difficulty);

  // Generate grids based on difficulty
  const [referenceGrid, setReferenceGrid] = useState(() => generateGrid(rows, cols, colors));
  const [playerGrid, setPlayerGrid] = useState(() => generateGrid(rows, cols, Array(colors.length).fill('white')));

  // Hide reference after a few seconds
  useEffect(() => {
    if (showReference) {
      const timeout = setTimeout(() => setShowReference(false), showReferenceTime * 1000);
      return () => clearTimeout(timeout);
    }
  }, [showReference, showReferenceTime]);

  // Timer logic
  useEffect(() => {
    if (!showReference && running) { // Only run timer if running is true
      const interval = setInterval(() => {
        setTimer(t => t + 1);
        dispatch(setTime(time + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showReference, running, dispatch, time]);

  // Handle tile click
  function handleTileClick(row, col) {
    if (showReference || !running) return;
    setPlayerGrid(grid => {
      const newGrid = grid.map(arr => arr.slice());
      if (colorMode) {
        // Cycle through COLORS
        const currentColor = newGrid[row][col];
        const nextColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
        newGrid[row][col] = nextColor;
      } else {
        // Toggle gray/white
        newGrid[row][col] = newGrid[row][col] === 'gray' ? 'white' : 'gray';
      }
      return newGrid;
    });
  }

  // Handle hint button
  function handleHint() {
    setPause(false); // Do not show pause UI for hint
    setRunning(false); // Pause the game logic
    setHintActive(true);
    setShowReference(true);
    setTimeout(() => {
      setShowReference(false);
      setHintActive(false);
      setRunning(true); // Resume the game
    }, showReferenceTime * 1000);
  }

  // Handle leaderboard button
  function handleShowLeaderboard() {
    setPause(true); // Show pause UI for leaderboard
    setRunning(false);
    setShowLeaderboard(true);
  }

  function handleCloseLeaderboard() {
    setShowLeaderboard(false);
    setRunning(true);
    setPause(false);
  }

  // // Check for win
  // useEffect(() => {
  //   if (!showReference && JSON.stringify(playerGrid) === JSON.stringify(referenceGrid)) {
  //     dispatch(setScore(score + 1));
  //     // Add to leaderboard
  //     dispatch(addEntry({
  //       score: score + 1,
  //       time: timer,
  //       difficulty: difficulty
  //     }));
  //     alert('You win!');
  //     // Reset game with new grid based on difficulty
  //     setReferenceGrid(generateGrid(rows, cols, colors));
  //     setPlayerGrid(generateGrid(rows, cols, colorMode ? Array(colors.length).fill('white') : Array(cols).fill('white')));
  //     setShowReference(true);
  //     setTimer(0);
  //   }
  // }, [playerGrid, referenceGrid, showReference, dispatch, score, rows, cols, colors, colorMode, timer, difficultyState, difficulty]);

  // Handle finish button
  function handleFinish() {
    if (showReference) return;
    // Calculate accuracy
    let correct = 0;
    let total = rows * cols;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (playerGrid[r][c] === referenceGrid[r][c]) correct++;
      }
    }
    const accuracy = (correct / total) * 100;
    const entryScore = totalScore + accuracy;
    const newTotalTime = totalTime + timer;
    dispatch(setScore(accuracy));
    dispatch(setTotalTime(newTotalTime));
    dispatch(setTotalScore(entryScore));
    dispatch(addEntry({
      score: accuracy,
      time: timer,
      difficulty: difficulty,
      totalTime: newTotalTime,
      totalScore: entryScore,
    }));
    setWin(true); // Show win overlay
    setWinScore(accuracy);
    setPause(false);
    setRunning(false);
  }

  function handleContinue() {
    setWin(false);
    setPause(false);
    setRunning(true);
    setShowReference(true);
    setReferenceGrid(generateGrid(rows, cols, colors));
    setPlayerGrid(generateGrid(rows, cols, colorMode ? Array(colors.length).fill('white') : Array(cols).fill('white')));
    setTimer(0);
  }

  return (
    <div className="game-window" style={{ position: 'relative' }}>
      {/* Overlay for pause or win */}
      {win && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: 'bold',
        }}>
          <div>You Win!</div>
          <div style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Score: {winScore.toFixed(2)}%</div>
        </div>
      )}
      {pause && !running && !win && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          pointerEvents: 'none',
        }}>
          Game Paused
        </div>
      )}
      <TitleBar score={totalScore} time={getFormattedTime(timer)} difficulty={difficulty} />
      <div className="grid-container">
        {(showReference ? referenceGrid : playerGrid).map((row, rIdx) => (
            <div className="grid-row" key={rIdx} style={{  height: 60 }}
            >
              {row.map((color, cIdx) => (
                  <div
                      key={cIdx}
                      className="grid-tile"
                      style={{ background: color, border: '1px solid #ccc', width: 60, height: 60, display: 'inline-block', cursor: showReference ? 'default' : 'pointer' }}
                      onClick={() => handleTileClick(rIdx, cIdx)}
                  />
              ))}
            </div>
        ))}
      </div>
      {showReference && <div className="reference-label">Memorize the pattern!</div>}
      {!showReference && <div className="instruction-label">Recreate the pattern!</div>}
      { win ? (
          <ButtonGroup style={{ zIndex: 20 }}>
            <Button variant="success" onClick={handleContinue}>Continue</Button>
            <Button variant="primary" onClick={() => {
              // Reset game state and return to difficulty selection (main menu new game behavior)
              dispatch(setScore(0));
              dispatch(setTime(0));
              dispatch(setTotalScore(0));
              dispatch(setTotalTime(0));
              setWin(false);
              handleContinue();
            }}>New Game</Button>
            <Button variant="secondary" onClick={onBackToMain}>Back to Main Menu</Button>
          </ButtonGroup>
      ) : (
      <ButtonGroup className="mb-2" style={{ position: 'relative', zIndex: 20, display: win ? 'none' : undefined }}>
        <Button variant={running ? 'warning' : 'success'} onClick={() => { setRunning(r => !r); setPause(p => !p); }}>
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
        </Button>
        <Button variant="info" onClick={handleHint} disabled={hintActive || showReference}>
          Hint
        </Button>
        <Button variant="success" onClick={handleShowLeaderboard}>
          Leaderboard
        </Button>
        <Button variant="secondary" onClick={onBackToMain}>
          Back to Main
        </Button>
        <Button variant="primary" onClick={handleFinish} disabled={showReference}>
          Finish
        </Button>
      </ButtonGroup>)}
      <PopupWindow visible={showLeaderboard} title="Leaderboard" onClose={handleCloseLeaderboard}
                   footer={
                     <>
                       <Button variant="danger" size="sm" onClick={() => dispatch(clearLeaderboard())}>Clear</Button>
                       <Button variant="secondary" size="sm" onClick={() => handleCloseLeaderboard()}>Close</Button>
                     </>
                   }>
        <Leaderboard />
      </PopupWindow>
    </div>
  );
}

export default GameWindow;
