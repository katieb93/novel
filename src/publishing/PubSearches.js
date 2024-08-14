import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const PubSearches = ({ userSearches }) => {
    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Your Searches
            </Typography>
            {userSearches.length > 0 ? (
                <List>
                    {userSearches.map((search, index) => (
                        <ListItem key={index} component={Paper} sx={{ mb: 2, padding: 2 }}>
                            <ListItemText
                                primary={`Search ${index + 1}`}
                                secondary={Object.entries(search)
                                    .map(([key, value]) => (
                                        <Typography key={key} variant="body2">
                                            <strong>{key.replace(/_/g, ' ')}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                                        </Typography>
                                    ))}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No searches found.</Typography>
            )}
        </Box>
    );
};

export default PubSearches;
