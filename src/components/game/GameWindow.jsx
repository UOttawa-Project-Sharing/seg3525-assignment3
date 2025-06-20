import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setScore, setTime, getFormattedTime } from '../../store.js';
import TitleBar from './TitleBar.jsx';
// import './GameWindow.css';

// Helper to generate a random grid
function generateGrid(rows, cols, colors) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)])
  );
}

function getGridConfig(difficulty) {
  switch (difficulty) {
    case 'easy':
      return { rows: 5, cols: 5, colors: ['gray', 'white'], colorMode: false };
    case 'medium':
      return { rows: 10, cols: 10, colors: ['gray', 'white'], colorMode: false };
    case 'hard':
      return { rows: 10, cols: 10, colors: ['red', 'blue', 'green', 'yellow'], colorMode: true };
    case 'expert':
      return { rows: 10, cols: 20, colors: ['red', 'blue', 'green', 'yellow'], colorMode: true };
    default:
      return { rows: 5, cols: 5, colors: ['gray', 'white'], colorMode: false };
  }
}

const SHOW_REFERENCE_TIME = 3; // seconds

function GameWindow({ difficulty }) {
  const dispatch = useDispatch();
  const { score, time } = useSelector(state => state.game);
  const [showReference, setShowReference] = useState(true);
  const [timer, setTimer] = useState(0);

  // Get config based on difficulty
  const { rows, cols, colors, colorMode } = getGridConfig(difficulty);

  // Generate grids based on difficulty
  const [referenceGrid, setReferenceGrid] = useState(() => generateGrid(rows, cols, colors));
  const [playerGrid, setPlayerGrid] = useState(() => generateGrid(rows, cols, Array(colors.length).fill('white')));

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

  // Check for win
  useEffect(() => {
    if (!showReference && JSON.stringify(playerGrid) === JSON.stringify(referenceGrid)) {
      dispatch(setScore(score + 1));
      alert('You win!');
      // Reset game with new grid based on difficulty
      setReferenceGrid(generateGrid(rows, cols, colors));
      setPlayerGrid(generateGrid(rows, cols, colorMode ? Array(colors.length).fill('white') : Array(cols).fill('white')));
      setShowReference(true);
      setTimer(0);
    }
  }, [playerGrid, referenceGrid, showReference, dispatch, score, rows, cols, colors, colorMode]);

  return (
    <div className="game-window">
      <TitleBar score={score} time={getFormattedTime(timer)} difficulty={difficulty} />
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
