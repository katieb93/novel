import React, { useState, useEffect, useCallback } from "react";
import { TextField, Autocomplete, CircularProgress, Typography, Box } from "@mui/material";

function PubSearchMovieTitles({ onSelect, width = '100%' }) {
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_MOVIE_DB_API_KEY;
  const bearerToken = process.env.REACT_APP_MOVIE_DB_BEARER_TOKEN;

  const fetchMovies = useCallback(async (input) => {
    if (!input) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&language=en-US&page=1&sort_by=vote_count.desc&include_adult=false&api_key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: bearerToken,
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (responseData && responseData.results) {
        const movieList = responseData.results.map(item => item.title).filter(Boolean);
        setOptions([...new Set(movieList)]); // Remove duplicates by using a Set
      } else {
        setOptions([]);
      }
    } catch (err) {
      setError('Failed to fetch movies');
      setOptions([]);
    }
    setIsLoading(false);
  }, [apiKey, bearerToken]);

  useEffect(() => {
    fetchMovies(searchInput);
  }, [searchInput, fetchMovies]);

  const handleInputChange = (event, value) => {
    setSearchInput(value);
  };

  return (
    <Box sx={{ width }}>
      <Autocomplete
        freeSolo
        options={options}
        loading={isLoading}
        onInputChange={handleInputChange}
        onChange={(event, value) => {
          if (onSelect) {
            onSelect(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Movies"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Typography variant="body2">{option}</Typography>
          </li>
        )}
        sx={{ width: '100%' }} // Ensure the Autocomplete matches the container width
      />
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default PubSearchMovieTitles;
