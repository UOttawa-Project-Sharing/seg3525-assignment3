import React from 'react';
import PropTypes from 'prop-types';

function TitleBar({ score, time, difficulty }) {
  return (
    <div className="title-bar d-flex justify-content-between align-items-center p-2 bg-light border-bottom">
      <div className="title-bar-section">
        <strong>Score:</strong> {score}
      </div>
      <div className="title-bar-section">
        <strong>Time:</strong> {time}
      </div>
      <div className="title-bar-section">
        <strong>Difficulty:</strong> {difficulty}
      </div>
    </div>
  );
}

TitleBar.propTypes = {
  score: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
};

export default TitleBar;

