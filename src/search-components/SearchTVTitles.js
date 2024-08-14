import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextField, IconButton, Typography, Paper, Box, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function SearchTVTitles({ onSelect, width = '100%' }) {
  const [searchInput, setSearchInput] = useState('');
  const [uniqueTV, setUniqueTV] = useState(new Set());
  const [searchOn, setSearchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTV, setNewTV] = useState({ TVTitle: "" });
  const [tagList, setTagList] = useState([]);

  const apiKey = process.env.REACT_APP_MOVIE_DB_API_KEY;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.REACT_APP_MOVIE_DB_BEARER_TOKEN,
    }
  };

  const fillInput = (TV) => {
    if (!tagList.includes(TV)) {
      setNewTV({ TVTitle: TV });
      setSearchInput(TV);
      setSearchOn(false);
      setUniqueTV(new Set());
      setTagList(prevTags => [...prevTags, TV]);
      if (onSelect) {
        onSelect(TV);
      }
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await makeRequest(newTV);
      setNewTV({ TVTitle: "" });
    }
  };

  const makeRequest = useCallback(async (requestData) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/TVApi", requestData);
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  }, []);

  const handleChange = async (e) => {
    setSearchOn(true);
    setSearchInput(e.target.value);
    await fetchData(e.target.value);
  };

  const fetchData = async (input) => {
    if (!input) return;
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = `https://api.themoviedb.org/3/search/tv?query=${input}&language=en-US&page=1&sort_by=vote_count.desc&include_adult=false&api_key=${apiKey}`;
      console.log("API URL: ", apiUrl);
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const responseData = await response.json();
      console.log("API Response: ", responseData);
      if (responseData && responseData.results) {
        const TVList = responseData.results.map(item => item.name).filter(Boolean);
        setUniqueTV(new Set(TVList));
      } else {
        setUniqueTV(new Set());
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch TV shows');
      setUniqueTV(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = (tagToRemove) => {
    setTagList(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Paper className='search-tv-div' elevation={3} style={{ padding: '16px', width }}>
      <TextField 
        type="search"
        fullWidth
        placeholder="Search TV..."
        onChange={handleChange}
        value={searchInput}
        onKeyDown={handleKeyDown}
        variant="outlined"
        style={{ marginBottom: '10px' }}
      />
      {isLoading && <CircularProgress />}
      {searchInput.length >= 2 && !isLoading && (
        <div>
          {searchOn && (
            <ul className='TV-results' style={{ listStyleType: 'none', padding: 0 }}>
              {uniqueTV.size > 0 ? (
                Array.from(uniqueTV).map((TV) => (
                  <li key={TV} onClick={() => fillInput(TV)} style={{ cursor: 'pointer' }}>
                    {TV}
                  </li>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" style={{ paddingLeft: '16px' }}>No TV found.</Typography>
              )}
            </ul>
          )}
        </div>
      )}
      <Box mb={2}>
        <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
          TV Comps
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {tagList.map((tag, index) => (
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
            >
              <Typography variant="body1" component="div" style={{ fontSize: '12px', color: 'white', marginRight: '8px' }}>
                {tag}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleDeleteTag(tag)}
                sx={{
                  color: 'white',
                  padding: '2px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '10px'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}

export default SearchTVTitles;
