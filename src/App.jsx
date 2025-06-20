import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Title from "./components/Title.jsx";
import CustomButton from "./components/CustomButton.jsx";
import PopupWindow from "./components/PopupWindow.jsx";
import { useSelector, useDispatch } from 'react-redux'
import { increment } from './store.js'

function App() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);

  return (
    <>
        <Title size="large">Welcome to Vite + React</Title>
        <CustomButton onClick={() => dispatch(increment())}>Count {count}</CustomButton>
        <CustomButton onClick={() => setShow(true)}>Popup</CustomButton>
        <PopupWindow
            visible={show}
            title="Popup Window"
            onClose={() => setShow(false)}>
            <p>This is a simple popup window.</p>
        </PopupWindow>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => dispatch(increment())} className="btn btn-primary">
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
