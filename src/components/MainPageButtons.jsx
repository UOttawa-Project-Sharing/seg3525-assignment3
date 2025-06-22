import React from "react";
import { Button, Container } from "react-bootstrap";

export default function MainPageButtons({
  hasOngoingGame,
  onContinue,
  onNewGame,
  onPlay,
  onInfo,
  onLeaderboard
}) {
  return (
    <Container style={{ maxWidth: 220 }} className="d-flex flex-column align-items-center gap-2 my-3">
      {hasOngoingGame ? (
        <>
          <Button variant="primary" size="lg" className="w-100" onClick={onContinue}>Continue Game</Button>
          <Button variant="danger" size="lg" className="w-100" onClick={onNewGame}>New Game</Button>
        </>
      ) : (
        <Button variant="primary" size="lg" className="w-100" onClick={onPlay}>Play</Button>
      )}
      <Button variant="secondary" size="lg" className="w-100" onClick={onInfo}>Info</Button>
      <Button variant="success" size="lg" className="w-100" onClick={onLeaderboard}>Leaderboard</Button>
    </Container>
  );
}
