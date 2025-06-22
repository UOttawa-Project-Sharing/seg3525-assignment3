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
    totalTime: 0, // Total time spent in the game
    totalScore: 0, // Total score accumulated in the game
  },
  reducers: {
    setScore: (state, action) => { state.score = action.payload; },
    incrementScore: (state) => { state.score += 1; },
    setTime: (state, action) => { state.time = action.payload; },
    incrementTime: (state) => { state.time += 1; },
    setDifficulty: (state, action) => { state.difficulty = action.payload; },
    setTotalTime: (state, action) => { state.totalTime = action.payload; },
    setTotalScore: (state, action) => { state.totalScore = action.payload; },
  },
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    entries: [], // { score: number, time: number, difficulty: string, totalTime: number, totalScore: number }
  },
  reducers: {
    addEntry: (state, action) => {
      state.entries.push(action.payload);
      // Sort by score descending, then time ascending
      state.entries.sort((a, b) => b.score - a.score || a.time - b.time);
      // Keep only top 10
      if (state.entries.length > 10) state.entries.length = 10;
    },
    clearLeaderboard: (state) => {
      state.entries = [];
    }
  }
});

export const { increment } = counterSlice.actions;
export const { setScore, setTime, setTotalScore, setTotalTime, setDifficulty, incrementScore, incrementTime } = gameSlice.actions;
export const { addEntry, clearLeaderboard } = leaderboardSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    game: gameSlice.reducer,
    leaderboard: leaderboardSlice.reducer,
  },
});

// Utility function to format time in mm:ss
export function getFormattedTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default store;
