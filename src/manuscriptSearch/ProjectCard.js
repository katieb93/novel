import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';

// Function to safely clean a string, converting non-string values to empty strings
const cleanString = (str) => {
    if (typeof str !== 'string') {
        return ''; // Return an empty string if the input is not a string
    }
    return str.replace(/[{}"]/g, '').trim();  // Remove {}, "" and trim any leading or trailing spaces
};

const ProjectCard = ({ project, user, onInteractionChange }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const fetchUserInteractions = async () => {
            if (!user || !user.id) return;

            // Fetch the user_type from the profiles table
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user type:', error.message);
                return;
            }

            setUserType(profiles.user_type);

            // Fetch the user interactions (bookmark and like status)
            const { data: interaction } = await supabase
                .from('user_interactions')
                .select('is_liked, is_bookmarked')
                .eq('user_id', user.id)
                .eq('project_id', project.id)
                .single();

            if (interaction) {
                setIsLiked(interaction.is_liked);
                setIsBookmarked(interaction.is_bookmarked);
            }
        };

        fetchUserInteractions();
    }, [user, project.id]);

    const toggleBookmark = async () => {
        if (!user || !user.id) return;

        const { data: interaction } = await supabase
            .from('user_interactions')
            .select('id, is_bookmarked')
            .eq('user_id', user.id)
            .eq('project_id', project.id)
            .single();

        let newBookmarkStatus = !isBookmarked;

        if (interaction) {
            // Update the existing row
            await supabase
                .from('user_interactions')
                .update({ is_bookmarked: newBookmarkStatus })
                .eq('user_id', user.id)
                .eq('project_id', project.id);
        } else {
            // Insert a new row
            await supabase
                .from('user_interactions')
                .insert({
                    user_id: user.id,
                    project_id: project.id,
                    is_bookmarked: newBookmarkStatus,
                    is_liked: isLiked // Keep the current liked state
                });
        }

        setIsBookmarked(newBookmarkStatus);
        onInteractionChange('bookmark', newBookmarkStatus);
    };

    const toggleLike = async () => {
        if (!user || !user.id) return;

        const { data: interaction } = await supabase
            .from('user_interactions')
            .select('id, is_liked')
            .eq('user_id', user.id)
            .eq('project_id', project.id)
            .single();

        let newLikeStatus = !isLiked;

        if (interaction) {
            // Update the existing row
            await supabase
                .from('user_interactions')
                .update({ is_liked: newLikeStatus })
                .eq('user_id', user.id)
                .eq('project_id', project.id);
        } else {
            // Insert a new row
            await supabase
                .from('user_interactions')
                .insert({
                    user_id: user.id,
                    project_id: project.id,
                    is_liked: newLikeStatus,
                    is_bookmarked: isBookmarked // Keep the current bookmarked state
                });
        }

        setIsLiked(newLikeStatus);
        onInteractionChange('like', newLikeStatus);
    };

    return (
        <Card className="main-description">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="div" className="result-title">
                        {cleanString(project.title ? project.title.toUpperCase() : '')}
                    </Typography>
                    <Box>
                        {userType !== 1 && (
                            <>
                                <IconButton onClick={toggleBookmark}>
                                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                </IconButton>
                                <IconButton onClick={toggleLike}>
                                    {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {cleanString(project.logline || '')}
                </Typography>
                <Typography variant="h6" component="div" className="result-writer">
                    <Link to={`/profile/${project.author}`}>
                        {cleanString(project.author || '')}
                    </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {Array.isArray(project.genre) ? project.genre.map(cleanString).join(", ") : cleanString(project.genre || '')}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {Array.isArray(project.specific_genre) ? project.specific_genre.map(cleanString).join(", ") : cleanString(project.specific_genre || '')}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {Array.isArray(project.novel_comps) ? project.novel_comps.map(cleanString).join(", ") : cleanString(project.novel_comps || '')}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {Array.isArray(project.author_comps) ? project.author_comps.map(cleanString).join(", ") : cleanString(project.author_comps || '')}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {Array.isArray(project.movie_comps) ? project.movie_comps.map(cleanString).join(", ") : cleanString(project.movie_comps || '')}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="overlay-description">
                    {Array.isArray(project.tv_comps) ? project.tv_comps.map(cleanString).join(", ") : cleanString(project.tv_comps || '')}
                </Typography>
                <Box className="overlay-info">
                    {/* Additional fields and formatting */}
                    {project.pdf_url && (
                        <Typography variant="body2" component="p" className="sub-title Rating-data">
                            <b>
                                <span className="details">
                                    <a href={project.pdf_url} download target="_blank" rel="noopener noreferrer">
                                        Download excerpt
                                    </a>
                                </span>
                            </b>
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProjectCard;
