// SelectedItemsList.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const SelectedItemsList = ({ formState, type, handleDeleteSelection }) => (
  <>
    {['must', 'can', 'exclude'].map((condition) => (
      <React.Fragment key={condition}>
        {formState[`${type}_${condition}`].length > 0 && (
          <Box mt={1} pl={2}>
            {formState[`${type}_${condition}`].map((item, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Typography variant="body2" style={{ flexGrow: 1 }}>
                  {item} ({condition})
                </Typography>
                <DeleteOutlineIcon
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => handleDeleteSelection(type, index, condition)}
                />
              </Box>
            ))}
          </Box>
        )}
      </React.Fragment>
    ))}
  </>
);

export default SelectedItemsList;
