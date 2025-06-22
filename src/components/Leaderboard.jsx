import React from 'react';
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

function formatTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Leaderboard() {
  const entries = useSelector(state => state.leaderboard.entries);

  return (
    <div className="d-flex justify-content-center align-items-center mt-4" style={{ minHeight: 400 }}>
          {entries.length === 0 ? (
            <div className="text-muted text-center">No entries yet.</div>
          ) : (
            <Table striped bordered hover size="sm" className="mt-2 rounded" style={{ overflow: 'hidden' }}>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Score</th>
                  <th>Time</th>
                  <th>Difficulty</th>
                  <th>Total Score</th>
                  <th>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} style={{ verticalAlign: 'middle' }}>
                    <td>{idx + 1}</td>
                    <td>{entry.score}</td>
                    <td>{formatTime(entry.time)}</td>
                    <td>{entry.difficulty}</td>
                    <td>{entry.totalScore}</td>
                    <td>{formatTime(entry.totalTime)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
    </div>
  );
}
