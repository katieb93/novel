import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

const GenreFilter = ({ label, genres = [], selectedGenres = [], onChange, includeSubGenres = false }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedGenres}
        onChange={onChange}
        renderValue={(selected) => selected.join(", ")}
      >
        {genres.map((genre) => (
          <MenuItem key={genre.value} value={genre.value}>
            <Checkbox checked={selectedGenres.includes(genre.value)} />
            <ListItemText primary={genre.label} />
            {includeSubGenres && genre.subGenres && genre.subGenres.length > 0 && (
              <div style={{ paddingLeft: 20 }}>
                {genre.subGenres.map((subGenre) => (
                  <MenuItem key={subGenre.value} value={subGenre.value}>
                    <Checkbox checked={selectedGenres.includes(subGenre.value)} />
                    <ListItemText primary={subGenre.label} />
                  </MenuItem>
                ))}
              </div>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenreFilter;
