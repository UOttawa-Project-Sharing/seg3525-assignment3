import React, { useEffect, useState } from "react";

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

function GridPageBackground() {
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

    useEffect(() => {
        const interval = setInterval(() => {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((row) => [...row]);
                // Change 5 random squares per interval
                for (let i = 0; i < 5; i++) {
                    const r = Math.floor(Math.random() * newGrid.length);
                    const c = Math.floor(Math.random() * (newGrid[0]?.length || 0));
                    if (newGrid[r] && typeof newGrid[r][c] !== 'undefined') {
                        newGrid[r][c] = !newGrid[r][c];
                    }
                }
                return newGrid;
            });
        }, 300); // Change every 300ms
        return () => clearInterval(interval);
    }, []);

    const transitionStyle = {
        transition: "background 1s, opacity 1s",
        opacity: 1,
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                pointerEvents: "none",
            }}
        >
            {grid.map((row, rIdx) =>
                row.map((isGreen, cIdx) => (
                    <div
                        key={`${rIdx}-${cIdx}`}
                        style={{
                            position: "absolute",
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            top: rIdx * TILE_SIZE,
                            left: cIdx * TILE_SIZE,
                            boxSizing: "border-box",
                            border: "1.5px solid #fff",
                            background: isGreen ? "#b2e5b2" : "#ededed",
                            opacity: isGreen ? 1 : 0.5,
                            ...transitionStyle,
                        }}
                    />
                ))
            )}
        </div>
    );
}

export default GridPageBackground;
