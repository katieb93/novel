// GenreDropdown.js
import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

const GenreDropdown = ({ label, type, options, onSelect }) => (
  <Box mb={2}>
    <Autocomplete
      options={options || []}
      getOptionLabel={(option) => option.label}
      onChange={(event, value) => onSelect(type, value)}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      style={{ flexGrow: 1 }}
    />
  </Box>
);

export default GenreDropdown;
