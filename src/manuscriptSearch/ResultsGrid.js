import React from "react";
import { Grid } from "@mui/material";
import ProjectCard from "./ProjectCard";

const ResultsGrid = ({ results, user }) => (
  <Grid container spacing={3} className="list-container">
    {results.map((project) => (
      <Grid item xs={12} sm={6} md={4} key={project.id} className="result-item">
        {/* <ProjectCard project={project} /> */}
        <ProjectCard project={project} user={user} />

      </Grid>
    ))}
  </Grid>
);

export default ResultsGrid;
