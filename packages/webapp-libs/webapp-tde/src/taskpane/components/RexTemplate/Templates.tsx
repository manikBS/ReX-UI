import { Container, Grid } from "@mui/material";
import React from "react";
import TemplateCard from "./TemplateCard";

const templates = [
    {
        id: 1,
        name: 'Template 1',
        createdBy: 'User 1',
        createdDate: '2024-01-28',
        lastModified: '2024-01-28',
    },{
        id: 2,
        name: 'Template 2',
        createdBy: 'User 2',
        createdDate: '2024-01-28',
        lastModified: '2024-01-28',
    },
];
const Templates: React.FC = () => {
  return (
      <Grid container spacing={2}>
          {templates.map((template) => (
              <Grid item key={template.id}>
                  <TemplateCard template={template} />
              </Grid>
          ))}
      </Grid>
  );
};

export default Templates;
