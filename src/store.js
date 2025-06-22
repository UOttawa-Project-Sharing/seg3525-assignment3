import { configureStore, createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

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
    difficulty: 'easy',
    totalTime: 0,
    totalScore: 0,
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
    entries: [],
  },
  reducers: {
    addEntry: (state, action) => {
      state.entries.push(action.payload);
      state.entries.sort((a, b) => b.score - a.score || a.time - b.time);
      if (state.entries.length > 10) state.entries.length = 10;
    },
    clearLeaderboard: (state) => {
      state.entries = [];
    }
  }
});

const customSettingsSlice = createSlice({
  name: 'customSettings',
  initialState: {
    width: 4,
    height: 4,
    colors: ['#FF0000', '#00FF00', '#0000FF'],
    displayTime: 3,
  },
  reducers: {
    setCustomSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
    setWidth: (state, action) => {
      state.width = action.payload;
    },
    setHeight: (state, action) => {
      state.height = action.payload;
    },
    setColors: (state, action) => {
      state.colors = action.payload;
    },
    addColor: (state, action) => {
      state.colors.push(action.payload);
    },
    removeColor: (state, action) => {
      state.colors = state.colors.filter((color, idx) => idx !== action.payload);
    },
    setDisplayTime: (state, action) => {
      state.displayTime = action.payload;
    },
  },
});

const presetSettingsSlice = createSlice({
  name: 'presetSettings',
  initialState: {
    easy: { width: 5, height: 2, colors: ['#c9c9c9'], displayTime: 3 },
    medium: { width: 5, height: 5, colors: ['#c9c9c9'], displayTime: 4 },
    hard: { width: 6, height: 6, colors: ['#FF0000', '#00FF00', '#0000FF'], displayTime: 5 },
    expert: { width: 7, height: 7, colors: ['#FF0000', '#00FF00', '#0000FF'], displayTime: 6 },
  },
  reducers: {
    setPresetColors: (state, action) => {
      const { difficulty, colors } = action.payload;
      if (state[difficulty]) {
        state[difficulty].colors = colors;
      }
    },
    setPresetSetting: (state, action) => {
      const { difficulty, setting, value } = action.payload;
      if (state[difficulty]) {
        state[difficulty][setting] = value;
      }
    },
  },
});

const rootSlice = createSlice({
  name: 'root',
  initialState: {},
  reducers: {
    deleteAllData: (state, action) => {
      // This will be handled in the reducer below
    },
  },
});

export const { increment } = counterSlice.actions;
export const { setScore, incrementScore, setTime, incrementTime, setDifficulty, setTotalTime, setTotalScore } = gameSlice.actions;
export const { addEntry, clearLeaderboard } = leaderboardSlice.actions;
export const { setCustomSettings, setWidth, setHeight, setColors, addColor, removeColor, setDisplayTime } = customSettingsSlice.actions;
export const { setPresetColors, setPresetSetting } = presetSettingsSlice.actions;
export const { deleteAllData } = rootSlice.actions;

// Load state from localStorage
function loadState() {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

// Save state to localStorage
function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch {
    // ignore write errors
  }
}

const appReducer = {
  counter: counterSlice.reducer,
  game: gameSlice.reducer,
  leaderboard: leaderboardSlice.reducer,
  customSettings: customSettingsSlice.reducer,
  presetSettings: presetSettingsSlice.reducer,
  root: rootSlice.reducer,
};

const rootReducer = (state, action) => {
  if (action.type === deleteAllData.type) {
    localStorage.removeItem('reduxState');
    state = undefined;
  }
  return combineReducers(appReducer)(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export function getFormattedTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default store;
