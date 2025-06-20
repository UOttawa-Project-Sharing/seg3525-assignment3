import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setScore, setTime } from '../../store.js';
import TitleBar from './TitleBar.jsx';
// import './GameWindow.css';

// Helper to generate a random grid
function generateGrid(rows, cols, colors) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)])
  );
}

const GRID_ROWS = 5;
const GRID_COLS = 5;
const COLORS = ['red', 'blue', 'green', 'yellow'];
const SHOW_REFERENCE_TIME = 3; // seconds

function GameWindow() {
  const dispatch = useDispatch();
  const { score, time, difficulty } = useSelector(state => state.game);
  const [referenceGrid, setReferenceGrid] = useState(() => generateGrid(GRID_ROWS, GRID_COLS, COLORS));
  const [playerGrid, setPlayerGrid] = useState(() => generateGrid(GRID_ROWS, GRID_COLS, Array(COLORS.length).fill('white')));
  const [showReference, setShowReference] = useState(true);
  const [timer, setTimer] = useState(0);

  // Hide reference after a few seconds
  useEffect(() => {
    if (showReference) {
      const timeout = setTimeout(() => setShowReference(false), SHOW_REFERENCE_TIME * 1000);
      return () => clearTimeout(timeout);
    }
  }, [showReference]);

  // Timer logic
  useEffect(() => {
    if (!showReference) {
      const interval = setInterval(() => {
        setTimer(t => t + 1);
        dispatch(setTime(time + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showReference, dispatch, time]);

  // Handle tile click
  function handleTileClick(row, col) {
    if (showReference) return;
    setPlayerGrid(grid => {
      const newGrid = grid.map(arr => arr.slice());
      // Cycle through COLORS
      const currentColor = newGrid[row][col];
      const nextColor = COLORS[(COLORS.indexOf(currentColor) + 1) % COLORS.length];
      newGrid[row][col] = nextColor;
      return newGrid;
    });
  }

  // Check for win
  useEffect(() => {
    if (!showReference && JSON.stringify(playerGrid) === JSON.stringify(referenceGrid)) {
      dispatch(setScore(score + 1));
      alert('You win!');
    }
  }, [playerGrid, referenceGrid, showReference, dispatch, score]);

  return (
    <div className="game-window">
      <TitleBar score={score} time={timer} difficulty={difficulty} />
      <div className="grid-container">
        {(showReference ? referenceGrid : playerGrid).map((row, rIdx) => (
          <div className="grid-row" key={rIdx}>
            {row.map((color, cIdx) => (
              <div
                key={cIdx}
                className="grid-tile"
                style={{ background: color, border: '1px solid #ccc', width: 40, height: 40, display: 'inline-block', cursor: showReference ? 'default' : 'pointer' }}
                onClick={() => handleTileClick(rIdx, cIdx)}
              />
            ))}
          </div>
        ))}
      </div>
      {showReference && <div className="reference-label">Memorize the pattern!</div>}
      {!showReference && <div className="instruction-label">Recreate the pattern!</div>}
    </div>
  );
}

export default GameWindow;

