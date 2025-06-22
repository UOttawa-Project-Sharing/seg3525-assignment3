import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {setWidth, setHeight, setColors, addColor, removeColor, setDisplayTime} from '../store';

const DifficultySettings = ({
  difficultyIdx,
  setDifficultyIdx,
  DIFFICULTY_STATES,
  selectedDifficulty,
  setSelectedDifficulty,
  handleCustomStart,
  handleBack,
  handleSelectDifficulty,
}) => {
  const dispatch = useDispatch();
  const customSettings = useSelector(state => state.customSettings);

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    if (name === 'width') dispatch(setWidth(Number(value)));
    else if (name === 'height') dispatch(setHeight(Number(value)));
    else if (name === 'displayTime') dispatch(setDisplayTime(Number(value)));
    // Add more fields as needed
  };

  const handleColorChange = (idx, color) => {
    const newColors = [...customSettings.colors];
    newColors[idx] = color;
    dispatch(setColors(newColors));
  };

  const handleRemoveColorRedux = (idx) => {
    dispatch(removeColor(idx));
  };

  const handleAddColorRedux = () => {
    if ((customSettings.colors || []).length < 10) {
      dispatch(addColor('#000000'));
    }
  };

  const handleCycleDifficulty = () => {
    const nextIdx = (difficultyIdx + 1) % DIFFICULTY_STATES.length;
    setDifficultyIdx(nextIdx);
    setSelectedDifficulty(DIFFICULTY_STATES[nextIdx].value);
  };

  // Get the settings to display: custom or from the selected difficulty preset
  const currentSettings = selectedDifficulty === 'custom'
    ? customSettings
    : DIFFICULTY_STATES.find(d => d.value === selectedDifficulty)?.settings || {};

  return (
    <div className="d-flex flex-column align-items-center gap-4 my-3" style={{ minWidth: '50%' }}>
        <div className="w-100 d-flex align-items-center justify-content-between mb-2">
            <label className="fw-semibold mb-0" style={{ fontSize: '1.1rem' }}>Difficulty:</label>
            <button
                type="button"
                className="btn btn-outline-primary px-3 py-1 fw-semibold"
                style={{ fontSize: '1.1rem', minWidth: 120, borderRadius: 4, border: '1px solid #ccc' }}
                onClick={handleCycleDifficulty}
            >
                {DIFFICULTY_STATES[difficultyIdx].label}
            </button>
        </div>
        <div className="w-100 d-flex align-items-center justify-content-between mb-2">
            <label className="fw-semibold mb-0" style={{ fontSize: '1.1rem' }}>Grid Size:</label>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <input type="number" name="width" min="2" max="20" value={currentSettings.width} onChange={handleCustomChange} style={{ width: 55, borderRadius: 4, border: '1px solid #ccc', padding: '2px 6px' }} disabled={selectedDifficulty !== 'custom'} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>x</span>
            <input type="number" name="height" min="2" max="20" value={currentSettings.height} onChange={handleCustomChange} style={{ width: 55, borderRadius: 4, border: '1px solid #ccc', padding: '2px 6px' }} disabled={selectedDifficulty !== 'custom'} />
          </span>
        </div>
        <div className="w-100 d-flex align-items-center justify-content-between mb-2">
          <label className="fw-semibold mb-0" style={{ fontSize: '1.1rem' }}>Display Time:</label>
          <input type="number" name="displayTime" min="1" max="30" value={currentSettings.displayTime} onChange={handleCustomChange} style={{ width: 80, borderRadius: 4, border: '1px solid #ccc', padding: '2px 6px' }} disabled={selectedDifficulty !== 'custom'} />
        </div>
        <div className="w-100 mb-2">
          <span className="fw-semibold" style={{ fontSize: '1.1rem' }}>Colors to Paint With:</span>
          <div className="d-flex flex-wrap align-items-center mt-2" style={{ gap: 8 }}>
            {(currentSettings.colors || []).map((color, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <Form.Control type="color" value={color} onChange={e => handleColorChange(idx, e.target.value)} style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }} disabled={selectedDifficulty !== 'custom'} />
                {currentSettings.colors.length > 1 && (
                  <Button type="button" variant="outline-danger" size="sm" className="px-2 py-0" style={{ fontSize: 18, lineHeight: 1, marginLeft: 2 }} onClick={() => handleRemoveColorRedux(idx)} disabled={selectedDifficulty !== 'custom'}>&minus;</Button>
                )}
              </span>
            ))}
            <Button type="button" variant="outline-success" size="sm" className="px-2 py-0" style={{ fontSize: 18, lineHeight: 1 }} onClick={handleAddColorRedux} disabled={selectedDifficulty !== 'custom' || (currentSettings.colors && currentSettings.colors.length >= 10)}>+</Button>
          </div>
        </div>
        <div className="d-flex gap-3 mt-3 w-100 justify-content-end">
          <Button variant="primary" style={{ minWidth: 110 }} onClick={() => {
              // if (selectedDifficulty === 'custom') {
              //   handleCustomStart();
              // } else {
                handleSelectDifficulty();
              // }
          }}>Start Game</Button>
          <Button variant="secondary" style={{ minWidth: 80 }} onClick={handleBack}>Back</Button>
        </div>
    </div>
  );
};

export default DifficultySettings;
