// import React from 'react';
// import AuthComponent from '../authComponent';

// const AuthorsLogIn = () => {

//   const userType = 'author'; // user type as a string

//   return (
//     <div>
//       <h1>Authors Login</h1>

        
//        <AuthComponent user_type={userType} redirectUrl="../authors/addProject" />

//     </div>
//   );
// };

// export default AuthorsLogIn;

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AuthComponent from '../authComponent';

const AuthorsLogIn = () => {
  const userType = 'author'; // user type as a string

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" gutterBottom>
          Authors Login
        </Typography>
        <AuthComponent user_type={userType} redirectUrl="../authors/addProject" />
      </Box>
    </Container>
  );
};

export default AuthorsLogIn;
