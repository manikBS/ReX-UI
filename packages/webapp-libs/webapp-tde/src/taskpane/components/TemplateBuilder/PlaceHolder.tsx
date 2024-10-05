import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import ContentPasteGoSharpIcon from "@mui/icons-material/ContentPasteGoSharp";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy search
import { allPlaceholders, setCurrentSelectionField, PlaceholderType } from "../../../stateManagement/placeholdersSlice";
import OfficeInteropManager from "../../utils/officeFunctions";

interface IPlaceholderProps {
  readonly: boolean;
}

const PlaceHolder: React.FC<IPlaceholderProps> = ({ readonly }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedPlaceholders: PlaceholderType[] = useSelector(allPlaceholders);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [filteredPlaceholders, setFilteredPlaceholders] = useState<PlaceholderType[]>(selectedPlaceholders); // State for filtered placeholders
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  // Fuse.js configuration for fuzzy search
  const fuse = new Fuse(selectedPlaceholders, {
    keys: ["placeholderName", "jsonPath"], // Define keys to search on
    includeScore: true,
    threshold: 0.4, // Adjust the fuzzy search threshold as needed
  });

  // Function to update filtered placeholders based on search query
  const updateFilteredPlaceholders = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPlaceholders(selectedPlaceholders);
    } else {
      const results = fuse.search(query);
      setFilteredPlaceholders(results.map((result) => result.item));
    }
  };

  const handleSubmit = (placeholderName: String, action: "paste" | "copy") => {
    if (action === "paste") OfficeInteropManager().addTextInTemplate(placeholderName);
    else if (action === "copy") OfficeInteropManager().copyTextToClipboard(placeholderName);
  };

  const card = (pl: PlaceholderType) => {
    return (
      <Card variant="outlined" sx={{ position: 'relative', borderBottom: '1px solid black' }} 
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.borderBottom = `2px solid ${theme.palette.primary.main}`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderBottom = `1px solid black`;
        }}>
        <CardContent sx={{ bgcolor: '#f5f5f5', boxShadow: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Placeholder Name</TableCell>
                      <TableCell>
                        <TextField
                          onChange={(event) => dispatch(setCurrentSelectionField({ placeholderName: event.target.value }))}
                          variant="standard"
                          size="small"
                          disabled={readonly}
                          value={pl.placeholderName}
                          sx={{ marginTop: "0px", marginBottom: "2px", color: readonly ? "black" : "inherit" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Formula</TableCell>
                      <TableCell>
                        <TextField
                          onChange={(event) => dispatch(setCurrentSelectionField({ jsonPath: event.target.value }))}
                          variant="standard"
                          size="small"
                          disabled={readonly}
                          value={pl.jsonPath}
                          sx={{ marginTop: "0px", marginBottom: "2px" }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Collapse in={showDetails} timeout="auto" unmountOnExit sx={{width: '100%', marginLeft: '4px'}}>
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Data Type</TableCell>
                        <TableCell>
                          <TextField
                            variant="standard"
                            size="small"
                            disabled
                            value={pl.dataType}
                            sx={{ marginTop: "0px", marginBottom: "2px" }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Placeholder Type</TableCell>
                        <TableCell>
                          <TextField
                            variant="standard"
                            size="small"
                            disabled
                            value={pl.placeholderType}
                            sx={{ marginTop: "0px", marginBottom: "2px" }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Format</TableCell>
                        <TableCell>
                          <TextField
                            onChange={(event) => dispatch(setCurrentSelectionField({ format: event.target.value }))}
                            variant="standard"
                            size="small"
                            disabled={readonly}
                            value={pl.format}
                            sx={{ marginTop: "0px", marginBottom: "2px" }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>To Type</TableCell>
                        <TableCell>
                          <TextField
                            onChange={(event) => dispatch(setCurrentSelectionField({ toType: event.target.value }))}
                            variant="standard"
                            size="small"
                            disabled={readonly}
                            value={pl.toType}
                            sx={{ marginTop: "0px", marginBottom: "2px" }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Collapse>
          </Grid>
        </CardContent>
        <CardActions sx={{ bgcolor: '#f5f5f5', boxShadow: 3 }}>
          <Tooltip title="Paste it in the template">
            <IconButton
              sx={{ verticalAlign: "bottom", padding: 0 }}
              size="small"
              onClick={() => handleSubmit(pl.placeholderName, "paste")}
            >
              <ContentPasteGoSharpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy to Clipboard">
            <IconButton
              sx={{ verticalAlign: "bottom", padding: 0 }}
              size="small"
              onClick={() => handleSubmit(pl.placeholderName, "copy")}
            >
              <ContentCopySharpIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
              sx={{ verticalAlign: "bottom", horizontalAlign: "right", padding: 0 }}
              size="small"
              onClick={toggleDetails}
            >
              {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </CardActions>
    </Card>
    );
  };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1}}>
        <TextField style={{background: 'white'}}
          hiddenLabel
          onChange={(event) => updateFilteredPlaceholders(event.target.value)}
          placeholder="Search Placeholders"
          fullWidth
          variant="standard"
          size="small"
        />
      </div>
      {filteredPlaceholders.length > 0 ? (
        filteredPlaceholders.map((pl) => (
            card(pl)
        ))
      ) : (
        <Typography
          variant="h6"
          sx={{
            opacity: 0.6,
            position: "relative",
            top: "35%",
            textAlign: 'center',
          }}
        >
          No matching placeholders found.
        </Typography>
      )}
    </>
  );
};

export default PlaceHolder;
