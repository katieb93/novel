
import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextField, IconButton, Typography, Paper, Box, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function SearchMovieTitles({ onSelect }) {
  const [searchInput, setSearchInput] = useState('');
  const [uniqueMovies, setUniqueMovies] = useState(new Set());
  const [searchOn, setSearchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMovie, setNewMovie] = useState({ movieTitle: "" });
  const [tagList, setTagList] = useState([]);

  const apiKey = '2e86fdf07364dbc226f56093c21d1a39';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTg2ZmRmMDczNjRkYmMyMjZmNTYwOTNjMjFkMWEzOSIsInN1YiI6IjY2NmYxZmY3MjlkZDA4ZjBhMGE2MzI4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KLZsIbcES50gM8iqhHjhos8yHjYIFT7a9PvJ4K-Bwck'
    }
  };

  const fillInput = (movie) => {
    if (!tagList.includes(movie)) {
      setNewMovie({ movieTitle: movie });
      setSearchInput(movie);
      setSearchOn(false);
      setUniqueMovies(new Set());
      setTagList(prevTags => [...prevTags, movie]);
      if (onSelect) {
        onSelect(movie);
      }
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await makeRequest(newMovie);
      setNewMovie({ movieTitle: "" });
    }
  };

  const makeRequest = useCallback(async (requestData) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/moviesApi", requestData);
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
      const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&language=en-US&page=1&sort_by=vote_count.desc&include_adult=false&api_key=${apiKey}`;
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (responseData && responseData.results) {
        const movieList = responseData.results.map(item => item.title).filter(Boolean);
        setUniqueMovies(new Set(movieList));
      } else {
        setUniqueMovies(new Set());
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch movies');
      setUniqueMovies(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = (tagToRemove) => {
    setTagList(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Paper className='search-movies-div' elevation={3} style={{ padding: '16px' }}>
      <TextField
        type="search"
        fullWidth
        placeholder="Search movies..."
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
            <ul className='movie-results' style={{ listStyleType: 'none', padding: 0 }}>
              {uniqueMovies.size > 0 ? (
                Array.from(uniqueMovies).map((movie) => (
                  <li key={movie} onClick={() => fillInput(movie)} style={{ cursor: 'pointer' }}>
                    {movie}
                  </li>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" style={{ paddingLeft: '16px' }}>
                  No movies found.
                </Typography>
              )}
            </ul>
          )}
        </div>
      )}
      <Box mb={2}>
        <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
          Selected Movies
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

export default SearchMovieTitles;
