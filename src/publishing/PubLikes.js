import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProjectCard from '../manuscriptSearch/ProjectCard';
import { supabase } from '../supabaseClient';


const PubLikes = ({ userId, userInteractions, onInteractionChange }) => {
    const [likedProjects, setLikedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedProjects = async () => {
            try {
                const projectIds = Object.keys(userInteractions)
                    .filter(id => userInteractions[id].isLiked);
                const projects = await supabase
                    .from('projects_author')
                    .select('*')
                    .in('id', projectIds);

                setLikedProjects(projects.data);
            } catch (error) {
                console.error('Error fetching likes:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedProjects();
    }, [userInteractions]);

    const handleInteractionChange = (interactionType, isActive, projectId) => {
        onInteractionChange(projectId, interactionType, isActive);
        if (interactionType === 'like' && !isActive) {
            setLikedProjects(prev => prev.filter(p => p.id !== projectId));
        }
    };

    if (loading) {
        return <div>Loading liked projects...</div>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Liked Projects
            </Typography>
            {likedProjects.length > 0 ? (
                likedProjects.map((project) => (
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
                <Typography>No liked projects found.</Typography>
            )}
        </Box>
    );
};

export default PubLikes;
