import React from "react";
import "./MainPageBackground.css";
import { useNavigate } from "react-router-dom";

function MainPageMenu() {
    const navigate = useNavigate();
    return (
        <div className="main-bg-centerbox">
            <h1 className="main-bg-title">Tile Matcher</h1>
            <div className="main-bg-buttons">
                <button className="main-bg-btn start" onClick={() => navigate("/game")}>
                    Start <span className="main-bg-btn-icon">▶</span>
                </button>
                <button className="main-bg-btn settings" onClick={() => navigate("/settings")}>
                    Settings <span className="main-bg-btn-icon">⚙️</span>
                </button>
                <button className="main-bg-btn info" disabled>
                    Info <span className="main-bg-btn-icon">ⓘ</span>
                </button>
            </div>
        </div>
    );
}

export default MainPageMenu;
