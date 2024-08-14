import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProjectCard from '../manuscriptSearch/ProjectCard';
import { supabase } from '../supabaseClient';


const PubBookmarks = ({ userId, userInteractions, onInteractionChange }) => {
    const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarkedProjects = async () => {
            try {
                const projectIds = Object.keys(userInteractions)
                    .filter(id => userInteractions[id].isBookmarked);
                const projects = await supabase
                    .from('projects_author')
                    .select('*')
                    .in('id', projectIds);

                setBookmarkedProjects(projects.data);
            } catch (error) {
                console.error('Error fetching bookmarks:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkedProjects();
    }, [userInteractions]);

    const handleInteractionChange = (interactionType, isActive, projectId) => {
        onInteractionChange(projectId, interactionType, isActive);
        if (interactionType === 'bookmark' && !isActive) {
            setBookmarkedProjects(prev => prev.filter(p => p.id !== projectId));
        }
    };

    if (loading) {
        return <div>Loading bookmarks...</div>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Bookmarked Projects
            </Typography>
            {bookmarkedProjects.length > 0 ? (
                bookmarkedProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        user={{ id: userId }}
                        isBookmarked={userInteractions[project.id]?.isBookmarked}
                        isLiked={userInteractions[project.id]?.isLiked}
                        onInteractionChange={(interactionType, isActive) =>
                            handleInteractionChange(interactionType, isActive, project.id)
                        }
                    />
                ))
            ) : (
                <Typography>No bookmarked projects found.</Typography>
            )}
        </Box>
    );
};

export default PubBookmarks;
