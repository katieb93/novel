
import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextField, IconButton, Typography, Paper, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function SearchBookTitles({ onSelect }) {
  const [searchInput, setSearchInput] = useState('');
  const [uniqueTitles, setUniqueTitles] = useState(new Set());
  const [searchOn, setSearchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState({ titleName: "" });
  const [tagList, setTagList] = useState([]);

  const apiKey = 'AIzaSyDVmj3OG-NQ-DC3QJSxEMeZ1nHHzgQIPCw';

  const fillInput = (title) => {
    if (!tagList.includes(title)) {
      setNewTitle({ titleName: title });
      setSearchInput(title);
      setSearchOn(false);
      setUniqueTitles(new Set());
      setTagList(prevTags => [...prevTags, title]);
      if (onSelect) {
        onSelect(title);
      }
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await makeRequest(newTitle);
      setNewTitle({ titleName: "" });
    }
  };

  const makeRequest = useCallback(async (requestData) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/titlesApi", requestData);
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
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${input}&languageRestrict=en&key=${apiKey}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (responseData && responseData.items) {
        const titleList = responseData.items.map(item => item.volumeInfo.title).filter(Boolean);
        setUniqueTitles(new Set(titleList));
      } else {
        setUniqueTitles(new Set());
      }
    } catch (error) {
      setUniqueTitles(new Set());
    }
  };

  const handleDeleteTag = (tagToRemove) => {
    setTagList(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Paper className='search-titles-div' elevation={3} style={{ padding: '16px' }}>
      <TextField
        type="search"
        fullWidth
        placeholder="Search titles..."
        onChange={handleChange}
        value={searchInput}
        onKeyDown={handleKeyDown}
        variant="outlined"
        style={{ marginBottom: '10px' }}
      />
      {searchInput.length >= 2 && (
        <div>
          {searchOn && (
            <ul className='title-results' style={{ listStyleType: 'none', padding: 0 }}>
              {uniqueTitles.size > 0 ? (
                Array.from(uniqueTitles).map((title) => (
                  <li key={title} onClick={() => fillInput(title)} style={{ cursor: 'pointer' }}>
                    {title}
                  </li>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" style={{ paddingLeft: '16px' }}>No titles found.</Typography>
              )}
            </ul>
          )}
        </div>
      )}
      <Box mb={2}>
        <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
          Selected Titles
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
    </Paper>
  );
}

export default SearchBookTitles;
