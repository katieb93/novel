// // import React from 'react';
// // import Box from '@mui/material/Box';
// // import Typography from '@mui/material/Typography';
// // import Button from '@mui/material/Button';
// // import Grid from '@mui/material/Grid';

// // // import AuthComponent from './authComponent';

// // import SearchTV from './searchTV';

// // {/* <AuthComponent redirectUrl="/authors/addProject" /> */}





// // // import Typography from '@mui/material/Typography';
// // // import Button from '@mui/material/Button';
// // // import Grid from '@mui/material/Grid';

// // const Home = () => {
// //     const handleAuthorsClick = () => {
// //         // Handle click logic here
// //     };
// //     const handlePublishingClick = () => {
// //         // Handle click logic here
// //     };

// //     return (
// //         <Box component="section" sx={{ p: 4 }}>
// //             <Grid container spacing={2} justifyContent="center">
// //             {/* <AuthComponent /> */}

// //                 <Grid item xs={12} md={8}>
// //                     <Typography variant="h2" component="h2" gutterBottom>
// //                         First impressions for lasting success
// //                     </Typography>
// //                     <Typography variant="h1" component="h1" gutterBottom>
// //                         The Novel List
// //                     </Typography>
// //                     <Button 
// //                         variant="contained" 
// //                         color="primary" 
// //                         href="/authors/authorsLogIn" 
// //                         onClick={handleAuthorsClick}
// //                         sx={{ mt: 2 }}
// //                     >
// //                         For Authors
// //                     </Button>
// //                     <Button 
// //                         variant="contained" 
// //                         color="primary" 
// //                         href="/publishing/login" 
// //                         onClick={handlePublishingClick}
// //                         sx={{ mt: 2 }}
// //                     >
// //                         Agents and Editors
// //                     </Button>
// //                     <Typography variant="body1" component="p" sx={{ mt: 2 }}>
// //                         We take the query out of the equation and put the writing first.
// //                     </Typography>
// //                 </Grid>
// //             </Grid>
// //         </Box>
// //     );
// // };

// // export default Home;


// import React from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import { useNavigate } from 'react-router-dom';
// // import UserTypeSelection from './UserTypeSelection'; // Adjust the path as per your project structure

// const Home = () => {
//     const navigate = useNavigate();

//     const handleAuthorsClick = () => {
//         navigate('/authors/authorsLogIn');
//     };

//     // src/publishing/publishingLogIn.js

//     const handlePublishingClick = () => {
//         navigate('/publishing/publishingLogIn');
//     };

//     return (
//         <Box component="section" sx={{ p: 4 }}>
//             <Grid container spacing={2} justifyContent="center">
//                 <Grid item xs={12} md={8}>
//                     <Typography variant="h2" component="h2" gutterBottom>
//                         First impressions for lasting success
//                     </Typography>
//                     <Typography variant="h1" component="h1" gutterBottom>
//                         NOVLY
//                     </Typography>
//                     <Button 
//                         variant="contained" 
//                         color="primary" 
//                         href="/authors/authorsLogIn" 
//                         onClick={handleAuthorsClick}
//                         sx={{ mt: 2 }}
//                     >
//                         For Authors
//                     </Button>
//                     <Button 
//                         variant="contained" 
//                         color="primary" 
//                         href="/publishing/publishingLogIn" 
//                         onClick={handlePublishingClick}
//                         sx={{ mt: 2 }}
//                     >
//                         Agents and Editors
//                     </Button>
//                     {/* <UserTypeSelection /> */}
//                     <Typography variant="body1" component="p" sx={{ mt: 2 }}>
//                         We take the query out of the equation and put the writing first.
//                     </Typography>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default Home;

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleAuthorsClick = () => {
        navigate('/authors/authorsLogIn');
    };

    const handlePublishingClick = () => {
        navigate('/publishing/publishingLogIn');
    };

    return (
        <Box component="section" sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center">
                <Grid item xs={12}>
                    <Typography variant="h2" component="h2" gutterBottom>
                        First impressions for lasting success
                    </Typography>
                    <Typography variant="h1" component="h1" gutterBottom>
                        NOVELY
                    </Typography>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleAuthorsClick}
                        sx={{ mt: 2 }}
                    >
                        For Authors
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handlePublishingClick}
                        sx={{ mt: 2, ml: 2 }}
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
