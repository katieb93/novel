import React from 'react';
import { Box, Typography } from '@mui/material';

function CustomCard({
    title,
    userName,
    ageGroup,
    genre,
    logline,
    evaluationsAverage,
    numberOfEvaluations,
    dateCreated,
    dateUpdated,
}) {
    return (
        <Box sx={{ 
            width: 300, 
            height: 400, 
            position: 'relative', 
            margin: 2, 
            padding: 2, 
            border: '1px solid #ccc', 
            borderRadius: 2, 
            background: '#f5f5f5', 
            userSelect: 'text'  // Enable text selection for copying
        }}>
            {/* Title */}
            <Typography 
                sx={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    marginBottom: 1, 
                    color: '#2D5A93', 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                {title}
            </Typography>

            {/* User Name */}
            <Typography 
                sx={{ 
                    fontSize: 16, 
                    fontWeight: 'medium', 
                    marginBottom: 1, 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                Author: {userName}
            </Typography>

            {/* Age Group(s) and Genre(s) */}
            <Typography 
                sx={{ 
                    fontSize: 14, 
                    marginBottom: 1, 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                Age Group: {ageGroup}
            </Typography>
            <Typography 
                sx={{ 
                    fontSize: 14, 
                    marginBottom: 1, 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                Genre: {genre}
            </Typography>

            {/* Logline */}
            <Typography 
                sx={{ 
                    fontSize: 14, 
                    fontStyle: 'italic', 
                    marginBottom: 2, 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                "{logline}"
            </Typography>

            {/* Evaluations */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginBottom: 2, 
                userSelect: 'text'  // Ensure this text can be selected
            }}>
                <Typography sx={{ fontSize: 12, fontWeight: 'bold', userSelect: 'text' }}>
                    Evaluations Average: {evaluationsAverage}
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 'bold', userSelect: 'text' }}>
                    Number of Evaluations: {numberOfEvaluations}
                </Typography>
            </Box>

            {/* Date Created & Updated */}
            <Typography 
                sx={{ 
                    fontSize: 12, 
                    color: '#666', 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                Date Created: {new Date(dateCreated).toLocaleDateString()}
            </Typography>
            <Typography 
                sx={{ 
                    fontSize: 12, 
                    color: '#666', 
                    userSelect: 'text'  // Ensure this text can be selected
                }}
            >
                Date Updated: {new Date(dateUpdated).toLocaleDateString()}
            </Typography>
        </Box>
    );
}

export default CustomCard;
