import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Title from "./components/Title.jsx";
import CustomButton from "./components/CustomButton.jsx";
import PopupWindow from "./components/PopupWindow.jsx";
import { useSelector, useDispatch } from 'react-redux'
import {getFormattedTime, increment, incrementTime} from './store.js'
import TitleBar from "./components/game/TitleBar.jsx";
import GameWindow from "./components/game/GameWindow.jsx";

function App() {
  const count = useSelector(state => state.counter.value)
  const { score, time, difficulty } = useSelector(state => state.game)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Format time for TitleBar
  const formattedTime = getFormattedTime(time);

  const handlePlay = () => {
    if (selectedDifficulty) {
      setShowGame(true);
      // Optionally, reset score/time here
    }
  };

  return (
    <>
        <Title size="large">Welcome to Vite + React</Title>
        <TitleBar score={score} time={formattedTime} difficulty={selectedDifficulty || difficulty} />
        {!showGame && (
          <div className="difficulty-select">
            <h3>Select Difficulty</h3>
            <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="easy">Easy (5x5, no color)</option>
              <option value="medium">Medium (10x10, no color)</option>
              <option value="hard">Hard (10x10, color)</option>
              <option value="expert">Expert (10x20, color)</option>
            </select>
            <CustomButton onClick={handlePlay} disabled={!selectedDifficulty}>Play</CustomButton>
          </div>
        )}
        {showGame && <GameWindow difficulty={selectedDifficulty} />}
        <CustomButton onClick={() => dispatch(increment())}>Count {count}</CustomButton>
        <CustomButton onClick={() => setShow(true)}>Popup</CustomButton>
        <PopupWindow
            visible={show}
            title="Popup Window"
            onClose={() => setShow(false)}>
            <p>This is a simple popup window.</p>
        </PopupWindow>
      {/*<div>*/}
      {/*  <a href="https://vite.dev" target="_blank">*/}
      {/*    <img src={viteLogo} className="logo" alt="Vite logo" />*/}
      {/*  </a>*/}
      {/*  <a href="https://react.dev" target="_blank">*/}
      {/*    <img src={reactLogo} className="logo react" alt="React logo" />*/}
      {/*  </a>*/}
      {/*</div>*/}
      {/*<h1>Vite + React</h1>*/}
      <div className="card">
        <button onClick={() => dispatch(incrementTime())} className="btn btn-primary">
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
