import { Box, Container, Divider, Grid, IconButton, InputAdornment, Switch, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConstructionIcon from "@mui/icons-material/Construction";
import Schema from "../Schema";
import SchemaTree from "./SchemaTree";
import CurrentSelectionPlaceHolder from "./CurrentSelectionPlaceHolder";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addAllPlaceholders } from "../../../stateManagement/placeholdersSlice";
import OfficeInteropManager from "../../utils/officeFunctions";
import PlaceHolder from "./PlaceHolder";
import { generateRandomName } from "../../utils/randomUtils";
import Footer from "./Footer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ITemplateBuilderProps {}

export interface ISchemaDetails {
  schemaId: string;
  schemaName: string;
  schemaSource: { type: number; uri: string };
  schemaTree: object;
}

const TemplateBuilder: React.FC<ITemplateBuilderProps> = () => {
  const dispatch = useDispatch();
  const [templateName, setTemplateName] = useState(generateRandomName());
  const [schemaDetails, setSchemaDetails] = useState<ISchemaDetails>(null);
  const [showSelectedPlaceholders, setshowSelectedPlaceholders] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      OfficeInteropManager().createRexTemplateSetting(nanoid());
      const sd = OfficeInteropManager().getSchemaDetailsFromSettings();
      if (sd !== null) {
        dispatch(addAllPlaceholders(sd.placeholders));
        setSchemaDetails({
          schemaId: sd.schemaId,
          schemaName: sd.schemaName,
          schemaSource: sd.schemaSource,
          schemaTree: sd.schemaTree,
        });
      }
    })();
  }, []);

  const updateSchemaDetails = (details) => {
    setSchemaDetails(details);
  };

  const handleNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  const showPlaceholders = (event) => {
    setIsExpanded(false);
    setshowSelectedPlaceholders(event.target.checked);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Container sx={{ background: "white", display: 'flex', flexDirection: 'column', overflow: "hidden" }}>
        {!isExpanded && (
          <>
            <div>
              <Typography variant="caption" gutterBottom>
                Template Name
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <TextField
                  id="template-name"
                  onChange={handleNameChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ConstructionIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                  size="small"
                  value={templateName}
                />
              </Grid>
            </Grid>
            <Divider variant="middle" />
            <Typography variant="caption" gutterBottom>
              Schema Binding
            </Typography>
            <Schema schemaDetails={schemaDetails} updateSchemaDetails={updateSchemaDetails} />
            <Divider variant="middle" />
            <Typography variant="caption" gutterBottom>
              Schema Tree
            </Typography>
            <Box sx={{ height: "46vh", flexGrow: 1, overflowY: "auto", background: "#f3f2f1" }}>
              <SchemaTree schemaDetails={schemaDetails} />
            </Box>
            <Divider variant="middle" />
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="caption" gutterBottom>
                Placeholders
              </Typography>
              <Grid item>
                <Switch
                  size="small"
                  onChange={(event) => showPlaceholders(event)}
                  checked={showSelectedPlaceholders}
                />
                <IconButton onClick={() => setIsExpanded(true)}>
                  <ExpandLessIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Box sx={{ height: "25vh", flexGrow: 1, overflowY: "auto", overflowX: "hidden", background: "#f3f2f1" }}>
              {showSelectedPlaceholders ? <PlaceHolder readonly /> : <CurrentSelectionPlaceHolder />}
            </Box>
          </>
        )}
        {isExpanded && (
          <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "white", zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
              <Typography variant="caption" gutterBottom>
                Placeholders
              </Typography>
              <Grid item>
                <Switch
                  size="small"
                  onChange={(event) => showPlaceholders(event)}
                  checked={showSelectedPlaceholders}
                />
                <IconButton onClick={() => setIsExpanded(false)}>
                  <ExpandMoreIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, overflowY: "auto", background: "#f3f2f1" }}>
              <PlaceHolder readonly />
            </Box>
          </Box>
        )}
        <Footer />
      </Container>
    </>
  );
};

export default TemplateBuilder;
