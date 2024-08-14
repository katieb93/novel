// ConditionSelect.js
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ConditionSelect = ({ type, currentSelections, handleConditionChange }) => (
  <FormControl margin="normal" style={{ marginLeft: 10 }}>
    <InputLabel>Condition</InputLabel>
    <Select
      value={currentSelections[type].condition}
      onChange={(e) => handleConditionChange(type, e.target.value)}
    >
      <MenuItem value="must">Must Include</MenuItem>
      <MenuItem value="can">Can Include</MenuItem>
      <MenuItem value="exclude">Exclude</MenuItem>
    </Select>
  </FormControl>
);

export default ConditionSelect;
