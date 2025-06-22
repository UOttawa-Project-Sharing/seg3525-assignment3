import React from 'react';
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';

export default function Leaderboard() {
  const entries = useSelector(state => state.leaderboard.entries);

  return (
    <div style={{ minWidth: 320 }}>
      {entries.length === 0 ? (
        <div className="text-muted">No entries yet.</div>
      ) : (
        <Table striped bordered hover size="sm" className="mt-2">
          <thead>
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
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{entry.score}</td>
                <td>{entry.time}</td>
                <td>{entry.difficulty}</td>
                <td>{entry.totalScore}</td>
                <td>{entry.totalTime}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
