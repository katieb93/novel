import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import subGenres from '../subGenres'; // Importing the static subGenres object

const PubSearchSubGenres = ({ onSelect, width = '100%' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubGenres, setSelectedSubGenres] = useState([]);

  const handleSubGenreClick = (genre, subGenre) => {
    if (!selectedSubGenres.some(sg => sg.genre === genre && sg.subGenre === subGenre)) {
      setSelectedSubGenres(prevSelected => [...prevSelected, { genre, subGenre }]);
      onSelect({ genre, subGenre }); // Call onSelect prop with the selected sub genre or object
    }
  };

  const handleRemoveSubGenre = (genre, subGenre) => {
    setSelectedSubGenres(prevSelected =>
      prevSelected.filter(sg => !(sg.genre === genre && sg.subGenre === subGenre))
    );
  };

  const renderSelectedSubGenres = () => (
    <Box mb={2}>
      <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
        Selected Sub Genres
      </Typography>
      <Box display="flex" flexWrap="wrap">
        {selectedSubGenres.map((sg, index) => (
          <Box
            key={index}
            style={{
              margin: '2px',
              border: '1px solid lightblue',
              backgroundColor: 'blue',
              padding: '5px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={() => handleRemoveSubGenre(sg.genre, sg.subGenre)}
          >
            <Typography variant="body1" component="div" style={{ fontSize: '12px', color: 'white', marginRight: '8px' }}>
              {sg.subGenre}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const filteredSubGenres = Object.keys(subGenres).reduce((acc, genre) => {
    acc[genre] = subGenres[genre].filter(subGenre =>
      subGenre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return acc;
  }, {});

  return (
    <Box sx={{ width }}>
      <Paper style={{ maxHeight: '400px', overflow: 'auto' }}>
        <Box p={2}>
          {selectedSubGenres.length > 0 && renderSelectedSubGenres()}

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sub genres"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          />

          <div className="sub-genres-container">
            {Object.keys(filteredSubGenres).map((genre) => (
              <div key={genre} className="genre-section">
                <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', margin: '2px', fontSize: '14px', textTransform: 'uppercase' }}>
                  {genre}
                </Typography>
                <div className="sub-genres-list">
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {filteredSubGenres[genre].map((subGenre, index) => (
                      <div
                        key={index}
                        className="sub-genre-item"
                        onClick={() => handleSubGenreClick(genre, subGenre)}
                        style={{
                          margin: '2px',
                          border: '1px solid lightblue',
                          backgroundColor: selectedSubGenres.some(sg => sg.genre === genre && sg.subGenre === subGenre) ? 'blue' : 'lightblue',
                          padding: '5px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Typography variant="body1" component="div" style={{ textAlign: 'left', fontSize: '12px', color: selectedSubGenres.some(sg => sg.genre === genre && sg.subGenre === subGenre) ? 'white' : 'black' }}>
                          {subGenre}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default PubSearchSubGenres;
