import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import SearchComponent from '../components/SearchComponent';

const Home = () => {
    const handleAuthorsClick = () => {
        // Handle click logic here
    };
    const handlePublishingClick = () => {
        // Handle click logic here
    };

    return (
        <Box component="section" sx={{ p: 4 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={8}>
                    <SearchComponent />
                    <Typography variant="h2" component="h2" gutterBottom>
                        First impressions for lasting success
                    </Typography>
                    <Typography variant="h1" component="h1" gutterBottom>
                        The Novel List
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        href="/authors/authorsLogIn" 
                        onClick={handleAuthorsClick}
                        sx={{ mt: 2 }}
                    >
                        For Authors
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        href="/publishing/login" 
                        onClick={handlePublishingClick}
                        sx={{ mt: 2 }}
                    >
                        Agents and Editors
                    </Button>
                    <Typography variant="body1" component="p" sx={{ mt: 2 }}>
                        We take the query out of the equation and put the writing first.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
