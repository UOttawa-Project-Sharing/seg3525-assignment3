import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    score: 0,
    time: 0,
    difficulty: 'Easy',
  },
  reducers: {
    setScore: (state, action) => { state.score = action.payload; },
    incrementScore: (state) => { state.score += 1; },
    setTime: (state, action) => { state.time = action.payload; },
    incrementTime: (state) => { state.time += 1; },
    setDifficulty: (state, action) => { state.difficulty = action.payload; },
  },
});

export const { increment } = counterSlice.actions;
export const { setScore, setTime, setDifficulty, incrementScore, incrementTime } = gameSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    game: gameSlice.reducer,
  },
});

// Utility function to format time in mm:ss
export function getFormattedTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default store;
