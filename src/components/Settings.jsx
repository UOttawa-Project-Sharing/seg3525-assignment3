import React, { useState } from "react";
import MainPageBackgroundGrid from "../pages/MainPageBackgroundGrid";
import "./Settings.css";
import { useNavigate } from "react-router-dom";


const BUTTON_STATES = [
    { label: "EASY", className: "green" },
    { label: "MEDIUM", className: "yellow" },
    { label: "HARD", className: "red" },
];
const GRID_SIZES = [
    { label: "5 x 5", className: "green" },
    { label: "10 x 10", className: "yellow" },
    { label: "10 x 20", className: "red" },
];
const DRAG_STATES = [
    { label: "ON", className: "green" },
    { label: "OFF", className: "red" },
];

export default function Settings({ onStart }) {
    const [difficultyIdx, setDifficultyIdx] = useState(1); // default MEDIUM
    const [gridIdx, setGridIdx] = useState(0); // default 5x5
    const [dragIdx, setDragIdx] = useState(1); // default OFF
    const navigate = useNavigate();

    const handleDifficulty = () => setDifficultyIdx((difficultyIdx + 1) % BUTTON_STATES.length);
    const handleGrid = () => setGridIdx((gridIdx + 1) % GRID_SIZES.length);
    const handleDrag = () => setDragIdx((dragIdx + 1) % DRAG_STATES.length);
    const handleStart = () => {
        if (onStart) {
            onStart({
                difficulty: BUTTON_STATES[difficultyIdx].label,
                gridSize: GRID_SIZES[gridIdx].label,
                drag: DRAG_STATES[dragIdx].label === "ON"
            });
        }
        navigate("/game");
    };

    return (
        <div className="settings-overlay">
            <MainPageBackgroundGrid />
            <div className="settings-modal">
                <div className="settings-title">Settings</div>
                <div className="settings-row">
                    <span className="settings-label">Difficulty:</span>
                    <button
                        className={`settings-btn ${BUTTON_STATES[difficultyIdx].className}`}
                        onClick={handleDifficulty}
                        type="button"
                    >
                        {BUTTON_STATES[difficultyIdx].label}
                    </button>
                </div>
                <div className="settings-row">
                    <span className="settings-label">Grid Size:</span>
                    <button
                        className={`settings-btn ${GRID_SIZES[gridIdx].className}`}
                        onClick={handleGrid}
                        type="button"
                    >
                        {GRID_SIZES[gridIdx].label}
                    </button>
                </div>
                <div className="settings-row">
                    <span className="settings-label">Drag Tiles:</span>
                    <button
                        className={`settings-btn ${DRAG_STATES[dragIdx].className}`}
                        onClick={handleDrag}
                        type="button"
                    >
                        {DRAG_STATES[dragIdx].label}
                    </button>
                </div>
                <button
                    className="settings-start-btn"
                    onClick={handleStart}
                >
                    Start <span className="settings-start-icon">▶</span>
                </button>
            </div>
        </div>
    );
}
