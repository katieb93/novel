// import React, { useState, useCallback } from "react";
// import axios from "axios";
// import { TextField, IconButton, Typography, Paper, Box, CircularProgress, Alert } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';

// function SearchAuthors({ onSelect }) {
//   const [searchInput, setSearchInput] = useState('');
//   const [uniqueAuthors, setUniqueAuthors] = useState(new Set());
//   const [searchOn, setSearchOn] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [newAuthor, setNewAuthor] = useState({ authorName: "" });
//   const [tagList, setTagList] = useState([]);

//   const apiKey = 'AIzaSyDVmj3OG-NQ-DC3QJSxEMeZ1nHHzgQIPCw';

//   const fillInput = (author) => {
//     if (!tagList.includes(author)) {
//       setNewAuthor({ authorName: author });
//       setSearchInput(author);
//       setSearchOn(false);
//       setUniqueAuthors(new Set());
//       setTagList(prevTags => [...prevTags, author]);
//       if (onSelect) {
//         onSelect(author);
//       }
//     }
//   };

//   const handleKeyDown = async (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       await makeRequest(newAuthor);
//       setNewAuthor({ authorName: "" });
//     }
//   };

//   const makeRequest = useCallback(async (requestData) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await axios.post("http://localhost:5000/api/authorsApi", requestData);
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsLoading(false);
//   }, []);

//   const handleChange = async (e) => {
//     setSearchOn(true);
//     setSearchInput(e.target.value);
//     await fetchData(e.target.value);
//   };

//   const fetchData = async (input) => {
//     if (!input) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${input}&languageRestrict=en&key=${apiKey}`;
//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error(`Error fetching data: ${response.statusText}`);
//       }
//       const responseData = await response.json();
//       if (responseData && responseData.items) {
//         const authorList = responseData.items
//           .map(item => item.volumeInfo.authors)
//           .flat()
//           .filter(Boolean);
//         setUniqueAuthors(new Set(authorList));
//       } else {
//         setUniqueAuthors(new Set());
//       }
//     } catch (err) {
//       setError(err.message);
//       setUniqueAuthors(new Set());
//     }
//     setIsLoading(false);
//   };

//   const handleDeleteTag = (tagToRemove) => {
//     setTagList(prevTags => prevTags.filter(tag => tag !== tagToRemove));
//   };

//   return (
//     <Paper className='search-authors-div' elevation={3} style={{ padding: '16px' }}>
//       <TextField
//         type="search"
//         fullWidth
//         placeholder="Search authors..."
//         onChange={handleChange}
//         value={searchInput}
//         onKeyDown={handleKeyDown}
//         variant="outlined"
//         style={{ marginBottom: '10px' }}
//       />
//       {isLoading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}
//       {searchInput.length >= 2 && (
//         <div>
//           {searchOn && (
//             <ul className='author-results' style={{ listStyleType: 'none', padding: 0 }}>
//               {uniqueAuthors.size > 0 ? (
//                 Array.from(uniqueAuthors).map((author) => (
//                   <li key={author} onClick={() => fillInput(author)} style={{ cursor: 'pointer' }}>
//                     {author}
//                   </li>
//                 ))
//               ) : (
//                 <Typography variant="body1" color="textSecondary" style={{ paddingLeft: '16px' }}>No authors found.</Typography>
//               )}
//             </ul>
//           )}
//         </div>
//       )}
//       <Box mb={2}>
//         <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
//           Author Comps
//         </Typography>
//         <Box display="flex" flexWrap="wrap">
//           {tagList.map((tag, index) => (
//             <Box
//               key={index}
//               style={{
//                 margin: '2px',
//                 border: '1px solid lightblue',
//                 backgroundColor: 'blue',
//                 padding: '5px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               <Typography variant="body1" component="div" style={{ fontSize: '12px', color: 'white', marginRight: '8px' }}>
//                 {tag}
//               </Typography>
//               <IconButton
//                 size="small"
//                 onClick={() => handleDeleteTag(tag)}
//                 sx={{
//                   color: 'white',
//                   padding: '2px',
//                   '& .MuiSvgIcon-root': {
//                     fontSize: '10px'
//                   }
//                 }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// export default SearchAuthors;

import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextField, IconButton, Typography, Paper, Box, CircularProgress, Alert } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function SearchAuthors({ onSelect, width = '100%' }) { // Accept a width prop with a default value
  const [searchInput, setSearchInput] = useState('');
  const [uniqueAuthors, setUniqueAuthors] = useState(new Set());
  const [searchOn, setSearchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newAuthor, setNewAuthor] = useState({ authorName: "" });
  const [tagList, setTagList] = useState([]);

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const fillInput = (author) => {
    if (!tagList.includes(author)) {
      setNewAuthor({ authorName: author });
      setSearchInput(author);
      setSearchOn(false);
      setUniqueAuthors(new Set());
      setTagList(prevTags => [...prevTags, author]);
      if (onSelect) {
        onSelect(author);
      }
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await makeRequest(newAuthor);
      setNewAuthor({ authorName: "" });
    }
  };

  const makeRequest = useCallback(async (requestData) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/authorsApi", requestData);
    } catch (err) {
      setError(err.message);
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
        setUniqueAuthors(new Set(authorList));
      } else {
        setUniqueAuthors(new Set());
      }
    } catch (err) {
      setError(err.message);
      setUniqueAuthors(new Set());
    }
    setIsLoading(false);
  };

  const handleDeleteTag = (tagToRemove) => {
    setTagList(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Paper className='search-authors-div' elevation={3} style={{ padding: '16px', width }}> {/* Apply width */}
      <TextField
        type="search"
        fullWidth
        placeholder="Search authors..."
        onChange={handleChange}
        value={searchInput}
        onKeyDown={handleKeyDown}
        variant="outlined"
        style={{ marginBottom: '10px' }}
      />
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {searchInput.length >= 2 && (
        <div>
          {searchOn && (
            <ul className='author-results' style={{ listStyleType: 'none', padding: 0 }}>
              {uniqueAuthors.size > 0 ? (
                Array.from(uniqueAuthors).map((author) => (
                  <li key={author} onClick={() => fillInput(author)} style={{ cursor: 'pointer' }}>
                    {author}
                  </li>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" style={{ paddingLeft: '16px' }}>No authors found.</Typography>
              )}
            </ul>
          )}
        </div>
      )}
      <Box mb={2}>
        <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
          Author Comps
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

export default SearchAuthors;
