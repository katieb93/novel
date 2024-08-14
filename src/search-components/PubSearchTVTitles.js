import React, { useState, useEffect, useCallback } from "react";
import { TextField, Autocomplete, CircularProgress, Typography, Box } from "@mui/material";

function PubSearchTVTitles({ onSelect, width = '100%' }) {
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_MOVIE_DB_API_KEY;
  const bearerToken = process.env.REACT_APP_MOVIE_DB_BEARER_TOKEN;

  const fetchTVShows = useCallback(async (input) => {
    if (!input) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `https://api.themoviedb.org/3/search/tv?query=${input}&language=en-US&page=1&sort_by=vote_count.desc&include_adult=false&api_key=${apiKey}`;
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
        const TVList = responseData.results.map(item => item.name).filter(Boolean);
        setOptions([...new Set(TVList)]); // Remove duplicates by using a Set
      } else {
        setOptions([]);
      }
    } catch (err) {
      setError('Failed to fetch TV shows');
      setOptions([]);
    }
    setIsLoading(false);
  }, [apiKey, bearerToken]);

  useEffect(() => {
    fetchTVShows(searchInput);
  }, [searchInput, fetchTVShows]);

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
            label="Search TV Shows"
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

export default PubSearchTVTitles;
