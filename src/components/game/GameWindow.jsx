import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {setScore, setTime, setTotalTime, setTotalScore, getFormattedTime, addEntry, clearLeaderboard} from '../../store.js';
import TitleBar from './TitleBar.jsx';
import Leaderboard from '../Leaderboard.jsx';
import PopupWindow from '../PopupWindow.jsx';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function generateGrid(rows, cols, colors) {
  return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)])
  );
}

function GameWindow({ difficulty, onBackToMain }) {
  const dispatch = useDispatch();
  const { time, totalTime, totalScore } = useSelector(state => state.game);
  const customSettings = useSelector(state => state.customSettings);
  const presetSettings = useSelector(state => state.presetSettings);
  const [showReference, setShowReference] = useState(true);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true);
  const [hintActive, setHintActive] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [pause, setPause] = useState(false);
  const [win, setWin] = useState(false);
  const [winScore, setWinScore] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);

  function getGridConfig() {
    if (difficulty === 'custom') {
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
    } else if (presetSettings && presetSettings[difficulty]) {
      let colors = presetSettings[difficulty].colors;
      if (!colors.includes('white')) {
        colors = [...colors, 'white'];
      }
      return {
        rows: presetSettings[difficulty].height,
        cols: presetSettings[difficulty].width,
        colors: colors,
        colorMode: colors.length > 1,
        showReferenceTime: presetSettings[difficulty].displayTime || 3
      };
    }
    return { rows: 4, cols: 4, colors: ['#FF0000', '#00FF00', '#0000FF', 'white'], colorMode: true, showReferenceTime: 3 };
  }

  const { rows, cols, colors, colorMode, showReferenceTime } = getGridConfig(difficulty);

  const [referenceGrid, setReferenceGrid] = useState(() => generateGrid(rows, cols, colors));
  const [playerGrid, setPlayerGrid] = useState(() => generateGrid(rows, cols, Array(colors.length).fill('white')));

  useEffect(() => {
    if (showReference) {
      const timeout = setTimeout(() => setShowReference(false), showReferenceTime * 1000);
      return () => clearTimeout(timeout);
    }
  }, [showReference, showReferenceTime]);

  useEffect(() => {
    if (!showReference && running) {
      const interval = setInterval(() => {
        setTimer(t => t + 1);
        dispatch(setTime(time + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showReference, running, dispatch, time]);

  function handleTileAction(row, col) {
    if (showReference || !running) return;
    setPlayerGrid(grid => {
      const newGrid = grid.map(arr => arr.slice());
      if (colorMode) {
        const currentColor = newGrid[row][col];
        const nextColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
        newGrid[row][col] = nextColor;
      } else {
        newGrid[row][col] = newGrid[row][col] === 'gray' ? 'white' : 'gray';
      }
      return newGrid;
    });
  }

  function handleHint() {
    setPause(false);
    setRunning(false);
    setHintActive(true);
    setShowReference(true);
    setTimeout(() => {
      setShowReference(false);
      setHintActive(false);
      setRunning(true);
    }, showReferenceTime * 1000);
  }

  function handleShowLeaderboard() {
    setPause(true);
    setRunning(false);
    setShowLeaderboard(true);
  }

  function handleCloseLeaderboard() {
    setShowLeaderboard(false);
    setRunning(true);
    setPause(false);
  }

  function handleFinish() {
    if (showReference) return;
    let correct = 0;
    let total = rows * cols;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (playerGrid[r][c] === referenceGrid[r][c]) correct++;
      }
    }
    const accuracy = Math.round((correct / total) * 100);
    const entryScore = Math.round(totalScore + accuracy);
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
    setWin(true);
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
    <div className="game-window" style={{ position: 'relative', width: '100%', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
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
          <div style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Score: {Math.round(winScore)}%</div>
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
      <TitleBar score={Math.round(totalScore)} time={getFormattedTime(timer)} difficulty={difficulty} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="grid-container"
          onMouseLeave={() => setMouseDown(false)}
        >
          {(showReference ? referenceGrid : playerGrid).map((row, rIdx) => (
            <div className="grid-row" key={rIdx} style={{  height: 60 }}>
              {row.map((color, cIdx) => {
                const isIncorrect = win && playerGrid[rIdx][cIdx] !== referenceGrid[rIdx][cIdx];
                return (
                  <div
                    key={cIdx}
                    className="grid-tile"
                    style={{ position: 'relative', background: color, border: '1px solid #ccc', width: 60, height: 60, display: 'inline-block', cursor: showReference ? 'default' : 'pointer' }}
                    onMouseDown={e => { e.preventDefault(); setMouseDown(true); handleTileAction(rIdx, cIdx); }}
                    onMouseUp={() => setMouseDown(false)}
                    onMouseEnter={() => { if (mouseDown) handleTileAction(rIdx, cIdx); }}
                  >
                    {isIncorrect && (
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: referenceGrid[rIdx][cIdx],
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 2,
                        textShadow: '2px 2px 6px #000, -2px -2px 6px #000, 2px -2px 6px #000, -2px 2px 6px #000'
                      }}>x</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {showReference && <div className="reference-label">Memorize the pattern!</div>}
        {!showReference && <div className="instruction-label">Recreate the pattern!</div>}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 'auto', marginBottom: 8 }}>
        { win ? (
            <ButtonGroup style={{ zIndex: 20 }}>
              <Button variant="success" onClick={handleContinue}>Continue</Button>
              <Button variant="primary" onClick={() => {
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
      </div>
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
