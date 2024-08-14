import React from "react";
import { TextField } from "@mui/material";

const SearchField = ({ label, value, onChange }) => (
  <TextField
    value={value}
    onChange={onChange}
    placeholder={`Search for ${label}...`}
    variant="outlined"
    fullWidth
  />
);

export default SearchField;
