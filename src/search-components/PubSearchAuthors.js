import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
import { TextField, Autocomplete, CircularProgress, Box } from "@mui/material";

function PubSearchAuthors({ onSelect, width = '100%' }) {
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("ERROR", error)

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const fetchAuthors = useCallback(async (input) => {
    if (!input) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${input}&languageRestrict=en&key=${apiKey}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (responseData && responseData.items) {
        const authorList = responseData.items
          .map(item => item.volumeInfo.authors)
          .flat()
          .filter(Boolean);
        setOptions([...new Set(authorList)]); // Remove duplicates by using a Set
      } else {
        setOptions([]);
      }
    } catch (err) {
      setError(err.message);
      setOptions([]);
    }
    setIsLoading(false);
  }, [apiKey]);

  useEffect(() => {
    fetchAuthors(searchInput);
  }, [searchInput, fetchAuthors]);

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
            label="Search Authors"
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
        sx={{ width: '100%' }} // Ensure the Autocomplete matches the container width
      />
    </Box>
  );
}

export default PubSearchAuthors;
