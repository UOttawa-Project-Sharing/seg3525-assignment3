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
    time: '00:00',
    difficulty: 'Easy',
  },
  reducers: {
    setScore: (state, action) => { state.score = action.payload; },
    incrementScore: (state) => { state.score += 1; },
    setTime: (state, action) => { state.time = action.payload; },
    incrementTime: (state, action) => { state.time = action.payload; },
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

export default store;
