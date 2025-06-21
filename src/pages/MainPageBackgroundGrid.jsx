import React, { useEffect, useState } from "react";
import "./MainPageBackground.css";

const TILE_SIZE = 60;

function generateGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const rowArr = [];
        for (let col = 0; col < cols; col++) {
            rowArr.push(Math.random() < 0.25);
        }
        grid.push(rowArr);
    }
    return grid;
}

function MainPageBackgroundGrid() {
    const [dimensions, setDimensions] = useState({
        rows: Math.ceil(window.innerHeight / TILE_SIZE),
        cols: Math.ceil(window.innerWidth / TILE_SIZE),
    });
    const [grid, setGrid] = useState(() => generateGrid(dimensions.rows, dimensions.cols));

    useEffect(() => {
        function handleResize() {
            const rows = Math.ceil(window.innerHeight / TILE_SIZE);
            const cols = Math.ceil(window.innerWidth / TILE_SIZE);
            setDimensions({ rows, cols });
            setGrid(generateGrid(rows, cols));
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setGrid(generateGrid(dimensions.rows, dimensions.cols));
    }, [dimensions]);

    return (
        <div className="main-bg-grid">
            {grid.map((row, rIdx) =>
                row.map((isGreen, cIdx) => (
                    <div
                        key={`${rIdx}-${cIdx}`}
                        className={`main-bg-tile${isGreen ? " green" : ""}`}
                        style={{
                            top: rIdx * TILE_SIZE,
                            left: cIdx * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                        }}
                    />
                ))
            )}
        </div>
    );
}

export default MainPageBackgroundGrid;
