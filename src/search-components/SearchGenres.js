import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, TextField, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GenreData from '../openGenres'; // Replace with your actual path to GenreData

const SearchGenres = ({ onSelect, setFormState, formState }) => {
    const [genres, setGenres] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    // const [maxSelections, setMaxSelections] = useState({
    //     'broad_genre': 1,   
    //     'category': 1,
    //     'age_group': 2,   
    //     'genre': 2,
    //     'specific_genre': 2
    //   });


    // console.log("SET", setFormState)
    // console.log("FORM", formState);


    useEffect(() => {
        // Simulating fetching data
        setGenres(GenreData);
    }, []);

    const handleGenreClick = (category, genre) => {
        const { text } = genre;
    
        let descriptionKey = GenreData[category]?.description;
        if (!descriptionKey) {
            console.error(`Description not found for category '${category}'`);
            return;
        }
    
        // Update formState with an array for each category key
        setFormState(prevState => ({
            ...prevState,
            [descriptionKey]: [...(prevState[descriptionKey] || []), text]
        }));
    
        // Update selectedGenres state
        if (!selectedGenres.some(g => g.text === text)) {
            setSelectedGenres(prevSelected => [...prevSelected, { text, description: descriptionKey }]);
        } else {
            console.log('Genre already selected:', text);
        }
    };
    
    // console.log("BLOOM SIX", formState)
    // Function to handle removing a genre from selected genres
    const handleRemoveGenre = (genre) => {
        setSelectedGenres(prevSelected => prevSelected.filter(g => g.text !== genre.text));
    };

    // Render selected genres in the list above the search bar
    const renderSelectedGenres = () => (
        <Box mb={2}>
            <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>
                Selected Genres
            </Typography>
            <Box display="flex" flexWrap="wrap">
                {selectedGenres.map((genre, index) => (
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
                            {genre.text}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => handleRemoveGenre(genre)}
                            style={{ color: 'white' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );

    // Utility function to group genres by category
    const groupGenresByCategory = (genres) => {
        if (typeof genres !== 'object' || Array.isArray(genres)) {
            return {};
        }

        // Iterate over each category in GenreData
        const groupedGenres = {};
        Object.keys(genres).forEach(category => {
            const categoryData = genres[category];
            if (categoryData && categoryData.items && Array.isArray(categoryData.items)) {
                groupedGenres[category] = categoryData.items;
            } else {
                groupedGenres[category] = [];
            }
        });

        return groupedGenres;
    };

    // Group genres by category
    const groupedGenres = groupGenresByCategory(genres);

    // Function to filter genres based on search term
    const filteredGenres = Object.keys(groupedGenres).reduce((acc, category) => {
        acc[category] = groupedGenres[category].filter(genre =>
            genre.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return acc;
    }, {});

    return (
        <Paper style={{ maxHeight: '400px', overflow: 'auto' }}>
            <Box p={2}>
                {selectedGenres.length > 0 && renderSelectedGenres()}

                <TextField
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    placeholder='Search for genres and sub-genres'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        style: { height: '40px', padding: '8px 12px' }
                    }}
                    InputLabelProps={{
                        shrink: true,
                        style: { marginTop: '-6px' }
                    }}
                    FormHelperTextProps={{
                        style: { marginTop: 0 }
                    }}
                    style={{ marginBottom: '16px' }}
                />

                <div className="genres-container">
                    {Object.keys(filteredGenres).map((category, index) => (
                        <div key={category} className="category-section">
                            {category === 'Non-Fiction' && <Divider style={{ margin: '8px 0' }} />}
                            <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'left', margin: '2px', fontSize: '14px', textTransform: 'uppercase' }}>{category}</Typography>
                            <div className="genres-list">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {filteredGenres[category].map((genre, index) => (
                                        <div
                                            key={index}
                                            className="genre-item"
                                            onClick={() => handleGenreClick(category, genre)}
                                            style={{
                                                margin: '2px',
                                                border: '1px solid lightblue',
                                                backgroundColor: selectedGenres.some(g => g.text === genre.text) ? 'blue' : 'lightblue',
                                                padding: '5px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Typography variant="body1" component="div" style={{ textAlign: 'left', fontSize: '12px', color: selectedGenres.some(g => g.text === genre.text) ? 'white' : 'black' }}>
                                                {genre.text}
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
    );
};

export default SearchGenres;
