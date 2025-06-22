# SEG3525 Assignment 3 - Interactive Game

## 📋 Overview

This project is a React-based game built with Vite. It provides an engaging user experience with a focus on interactivity, state management, and responsive design. Users can play the game, adjust settings, and compete for high scores.

## ✨ Features

- **Interactive Game Grid**: Play on a dynamic, visually appealing grid
- **Difficulty Settings**: Choose from multiple difficulty levels
- **Leaderboard**: Track and display top scores
- **Popup Windows**: For notifications and settings
- **Modern UI**: Responsive and accessible design

## 🛠️ Technologies Used

- **React**: Frontend library for building the UI
- **Vite**: Fast build tool and development server
- **JavaScript (ES6+)**: Application logic
- **CSS Modules**: Component-scoped styling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd seg3525-assignment3
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/seg3525-assignment3/`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
  App.jsx            # Main application component
  main.jsx           # Application entry point
  store.js           # State management
  components/        # Reusable UI components
    game/            # Game-specific components
  assets/            # Static assets (images, icons)
public/              # Static public files
```

### Key Components

- **App.jsx**: Main application logic and routing
- **Leaderboard.jsx**: Displays high scores
- **DifficultySettings.jsx**: Allows users to select game difficulty
- **GameWindow.jsx**: Core game interface
- **PopupWindow.jsx**: Modal popups for notifications/settings

## 📱 Features Showcase

- **Customizable gameplay** with real-time feedback
- **Leaderboard** to encourage competition
- **Difficulty adjustment** for all skill levels
- **Responsive design** for desktop and mobile

## 👥 Contributors

- Tristan Robichaud
- Zachary Shewan

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---
*This project was created for educational purposes as part of the University of Ottawa SEG3525 course.*
