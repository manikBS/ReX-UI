import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  Select,
  ListSubheader,
  SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEventHandler, useRef, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import ConstructionIcon from "@mui/icons-material/Construction";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SchemaIcon from "@mui/icons-material/Schema";
import GenerateSchema from "generate-schema";
import OfficeInteropManager from "../../utils/officeFunctions";
import { generateRandomName } from "../../utils/randomUtils";
import { StackedBarChart } from "@mui/icons-material";

interface ISchemaFormProps {
  schemaDetails: {
    schemaId: string;
    schemaName: string;
    schemaSource: { type: number; uri: string };
    schemaTree: object;
  };
  updateSchemaDetails: (schemaDetails: ISchemaFormProps["schemaDetails"]) => void;
}

interface IInferFromJsonProps {
  handleFileChange: ChangeEventHandler<HTMLInputElement>;
  selectedFile: string;
}

interface IJsonSchemaProps {
  handleFileChange: ChangeEventHandler<HTMLInputElement>;
  selectedFile: string;
}

interface IRedashProps {}

const SchemaForm: React.FC<ISchemaFormProps> = ({ schemaDetails, updateSchemaDetails }) => {
  const updateMode = schemaDetails ? true : false;
  const [schemaName, setSchemaName] = useState(updateMode ? schemaDetails.schemaName : generateRandomName());
  const [selectedSchemaType, setSelectedSchemaType] = useState(updateMode ? schemaDetails.schemaSource.type : 0);
  const [schemaTree, setSchemaTree] = useState(updateMode ? schemaDetails.schemaTree : null);
  const [selectedFile, setSelectedFile] = useState(updateMode ? schemaDetails.schemaSource.uri : "");

  const createSchema = () => {
    console.log(schemaTree);
    const schemaId = updateMode ? schemaDetails.schemaId : nanoid();
    const sd = {
      schemaId,
      schemaName,
      schemaSource: { type: selectedSchemaType, uri: selectedFile },
      schemaTree,
    };
    OfficeInteropManager().createRexSchemaBinding(sd);
    updateSchemaDetails(sd);
  };

  const handleSchemaTypeChange = (event: SelectChangeEvent<number>) => {
    setSelectedSchemaType(Number(event.target.value));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSchemaName(event.target.value);
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        setSchemaTree(GenerateSchema.json("root", content));
        setSelectedFile(file.name);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextField
            id="input-with-icon-textfield"
            label="Schema Name"
            onChange={handleNameChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchemaIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
            size="small"
            value={schemaName}
          />
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <Grid container>
        <Select
          value={selectedSchemaType}
          onChange={handleSchemaTypeChange}
          displayEmpty
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 0,
            padding: "4px",
            fontSize: "12px", // Smaller font size
            height: "30px", // Adjust the height for compact size
            minHeight: "30px",
          }}
        >
          <ListSubheader sx={{
      fontSize: "10px", 
      padding: "2px 8px",  
      lineHeight: "1", 
      backgroundColor: "transparent",  
    }}>File</ListSubheader>
          <MenuItem
            value={0}
            sx={{
              padding: "4px 8px", // Less padding
              fontSize: "12px",
              minHeight: "30px", // Compact height
            }}
          >
            <ConstructionIcon style={{ marginRight: "8px" }} />
            Infer from JSON
          </MenuItem>
          <MenuItem
            value={1}
            sx={{
              padding: "4px 8px",
              fontSize: "12px",
              minHeight: "30px",
            }}
          >
            <SettingsSuggestIcon style={{ marginRight: "8px" }} />
            JSON Schema
          </MenuItem>

          <ListSubheader sx={{
      fontSize: "10px", 
      padding: "2px 8px",  
      lineHeight: "1", 
      backgroundColor: "transparent",  
    }}>API</ListSubheader>
          <MenuItem
            value={2}
            sx={{
              padding: "4px 8px",
              fontSize: "12px",
              minHeight: "30px",
            }}
          >
            <CloudDoneIcon style={{ marginRight: "8px" }} />
            API (OpenAPI Spec)
          </MenuItem>

          <ListSubheader sx={{
      fontSize: "10px", 
      padding: "2px 8px",  
      lineHeight: "1", 
      backgroundColor: "transparent",  
    }}>Database</ListSubheader>
          <MenuItem
            value={3}
            sx={{
              padding: "4px 8px",
              fontSize: "12px",
              minHeight: "30px",
            }}
          >
            <img src='./../../../../assets/mongodb.svg' alt="MongoDB" style={{ height: "20px", marginRight: "8px" }} />
            MongoDB
          </MenuItem>
          <MenuItem
            value={4}
            sx={{
              padding: "4px 8px",
              fontSize: "12px",
              minHeight: "30px",
            }}
          >
            <img src='./../../../../assets/postgresql.svg' alt="Postgres" style={{ height: "20px", marginRight: "8px" }} />
            PostgreSQL
          </MenuItem>

          <ListSubheader sx={{
      fontSize: "10px", 
      padding: "2px 8px",  
      lineHeight: "1", 
      backgroundColor: "transparent",  
    }}>Business Intelligence</ListSubheader>
          <MenuItem
            value={5}
            sx={{
              padding: "4px 8px",
              fontSize: "12px",
              minHeight: "30px",
            }}
          >
            <img src='./../../../../assets/powerbi.svg' alt="PowerBI" style={{ height: "20px", marginRight: "8px" }} />
            PowerBI
          </MenuItem>
          <MenuItem
            value={6}
            sx={{
              padding: "4px 8px",
              fontSize: "12px",
              minHeight: "30px",
            }}
          >
            <StackedBarChart style={{ marginRight: "8px" }} />
            Redash
          </MenuItem>
        </Select>
      </Grid>

      <Grid container>
        {selectedSchemaType === 0 && <InferFromJson handleFileChange={handleFileChange} selectedFile={selectedFile} />}
        {selectedSchemaType === 1 && <JsonSchema handleFileChange={handleFileChange} selectedFile={selectedFile} />}
        {selectedSchemaType === 6 && <RedashSchema />}
        {/* Add handling for the other schema types as necessary */}
      </Grid>
      <Divider variant="middle" />

      <Button variant="contained" color="primary" sx={{ ml: 2, marginTop: 2 }} onClick={createSchema}>
        {updateMode ? "Update" : "Create"}
      </Button>
    </Container>
  );
};

const InferFromJson: React.FC<IInferFromJsonProps> = ({ handleFileChange, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleTextFieldClick = () => {
    fileInputRef.current?.click(); // Manually trigger the file selection dialog
  };
  return (
    <Box mt={2}>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: "none" }} />
      <TextField
        label="Upload JSON File"
        value={selectedFile ? selectedFile : ""}
        onClick={handleTextFieldClick}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <FileUploadIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
        size="small"
      />
    </Box>
  );
};

const JsonSchema: React.FC<IJsonSchemaProps> = ({ handleFileChange, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleTextFieldClick = () => {
    fileInputRef.current?.click(); // Manually trigger the file selection dialog
  };
  return (
    <Box mt={2}>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: "none" }} />
      <TextField
        label="Upload JSON Schema File"
        value={selectedFile ? selectedFile : ""}
        onClick={handleTextFieldClick}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <FileUploadIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
        size="small"
      />
    </Box>
  );
};

const RedashSchema: React.FC<IRedashProps> = () => {
  return (
    <Box mt={2}>
      <TextField
        label="Add Redash URL"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CloudDoneIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
        size="small"
      />
    </Box>
  );
};

export default SchemaForm;
