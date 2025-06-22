import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setWidth, setHeight, setColors, addColor, removeColor, setDisplayTime, setPresetColors } from '../store';

const DIFFICULTY_LABELS = [
  { label: 'EASY', value: 'easy', className: 'green' },
  { label: 'MEDIUM', value: 'medium', className: 'blue' },
  { label: 'HARD', value: 'hard', className: 'red' },
  { label: 'EXPERT', value: 'expert', className: 'red' },
  { label: 'CUSTOM', value: 'custom', className: '' },
];

const DifficultySettings = ({
  difficultyIdx,
  setDifficultyIdx,
  selectedDifficulty,
  setSelectedDifficulty,
  handleBack,
  handleSelectDifficulty,
}) => {
  const dispatch = useDispatch();
  const customSettings = useSelector(state => state.customSettings);
  const presetSettings = useSelector(state => state.presetSettings);

  React.useEffect(() => {
    if (!selectedDifficulty) {
      setSelectedDifficulty('easy');
      setDifficultyIdx(0);
    }
  }, [selectedDifficulty, setSelectedDifficulty, setDifficultyIdx]);

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    if (name === 'width') dispatch(setWidth(Number(value)));
    else if (name === 'height') dispatch(setHeight(Number(value)));
    else if (name === 'displayTime') dispatch(setDisplayTime(Number(value)));
  };

  const handleColorChange = (idx, color) => {
    if (selectedDifficulty === 'custom') {
      const newColors = [...customSettings.colors];
      newColors[idx] = color;
      dispatch(setColors(newColors));
    } else {
      // Update preset colors in Redux store
      const preset = presetSettings[selectedDifficulty];
      if (preset) {
        const newColors = [...preset.colors];
        newColors[idx] = color;
        dispatch(setPresetColors({ difficulty: selectedDifficulty, colors: newColors }));
      }
    }
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
    const nextIdx = (difficultyIdx + 1) % DIFFICULTY_LABELS.length;
    setDifficultyIdx(nextIdx);
    setSelectedDifficulty(DIFFICULTY_LABELS[nextIdx].value);
  };

  const currentSettings = selectedDifficulty === 'custom'
    ? customSettings
    : presetSettings[selectedDifficulty] || {};

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
                {DIFFICULTY_LABELS[difficultyIdx].label}
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
                <Form.Control type="color" value={color} onChange={e => handleColorChange(idx, e.target.value)} style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }} />
                {currentSettings.colors.length > 1 && (
                  <Button type="button" variant="outline-danger" size="sm" className="px-2 py-0" style={{ fontSize: 18, lineHeight: 1, marginLeft: 2 }} onClick={() => handleRemoveColorRedux(idx)} disabled={selectedDifficulty !== 'custom'}>&minus;</Button>
                )}
              </span>
            ))}
            <Button type="button" variant="outline-success" size="sm" className="px-2 py-0" style={{ fontSize: 18, lineHeight: 1 }} onClick={handleAddColorRedux} disabled={selectedDifficulty !== 'custom' || (currentSettings.colors && currentSettings.colors.length >= 10)}>+</Button>
          </div>
        </div>
        <div className="d-flex gap-3 mt-3 w-100 justify-content-end">
          <Button variant="primary" style={{ minWidth: 110 }} onClick={handleSelectDifficulty}>Start Game</Button>
          <Button variant="secondary" style={{ minWidth: 80 }} onClick={handleBack}>Back</Button>
        </div>
    </div>
  );
};

export default DifficultySettings;
