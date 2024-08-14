import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from '../supabaseClient'; // Adjust the path according to your project structure
import CustomCard from './CustomCard'; // Import the CustomCard component

function CardCarousel() {
    const [cardsData, setCardsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the current user's ID
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    throw new Error("User not logged in");
                }

                // Fetch project data for the current user
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects_author')
                    .select('*')
                    .eq('user_id', user.id); // Filter by the current user's ID

                if (projectsError) throw projectsError;

                // Fetch user's name
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles') // Assuming there is a 'profiles' table
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single(); // Fetch the single profile matching the user's ID

                if (profileError) throw profileError;

                // Combine project data with the user's name
                const combinedData = projectsData.map(project => ({
                    ...project,
                    userName: `${profileData.first_name} ${profileData.last_name}`,
                }));

                setCardsData(combinedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;

    // Divide cards into groups of 3
    const cardGroups = [];
    for (let i = 0; i < cardsData.length; i += 3) {
        cardGroups.push(cardsData.slice(i, i + 3));
    }

    return (
        <Carousel
            indicators={false} // Hide indicators if you prefer
            navButtonsAlwaysVisible // Always show navigation buttons
        >
            {cardGroups.map((group, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {group.map((card, idx) => (
                        <CustomCard
                            key={idx}
                            title={card.title}
                            userName={card.userName}
                            ageGroup={card.age_group}
                            genre={card.genre}
                            logline={card.logline}
                            evaluationsAverage={card.evaluations_average ?? 'N/A'}
                            numberOfEvaluations={card.number_of_evaluations ?? 'N/A'}
                            dateCreated={card.created_at}
                            dateUpdated={card.updated_at}
                        />
                    ))}
                </Box>
            ))}
        </Carousel>
    );
}

export default CardCarousel;
