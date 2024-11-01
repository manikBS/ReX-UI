import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SchemaIcon from "@mui/icons-material/Schema";
import SchemaForm from "./SchemaForm";
import { useDispatch } from "react-redux";
import { setCurrentSelection } from "../../../stateManagement/placeholdersSlice";
import OfficeInteropManager from "../../utils/officeFunctions";

interface ISchemaProps {
  schemaDetails: {
    schemaId: string;
    schemaName: string;
    schemaSource: { type: number; uri: string };
    schemaTree: object;
  };
  updateSchemaDetails: (schemaDetails: ISchemaProps["schemaDetails"]) => void;
}

const Schema: React.FC<ISchemaProps> = ({ schemaDetails, updateSchemaDetails }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(schemaDetails != null);
  const [isAddUpdateDialogOpen, setIsAddUpdateDialogOpen] = useState(false);
  const [isDeteteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setIsAdded(schemaDetails != null);
  }, [schemaDetails]);

  const handleAddClick = () => {
    setIsAddUpdateDialogOpen(true);
  };

  const handleUpdateClick = () => {
    setIsAddUpdateDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      {isAdded ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                id="selected-schema"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchemaIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                size="small"
                disabled
                value={schemaDetails.schemaName}
              />
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="Update Schema Binding">
                <IconButton onClick={handleUpdateClick} sx={{ verticalAlign: "bottom", padding: 0 }}>
                  <IconButton>
                    <UpdateIcon />
                  </IconButton>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Schema Binding">
                <IconButton onClick={handleDeleteClick} sx={{ verticalAlign: "bottom", padding: 0 }}>
                  <IconButton>
                    <DeleteForeverIcon />
                  </IconButton>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </>
      ) : (
        <Tooltip title="Add Schema Binding">
          <IconButton onClick={handleAddClick} sx={{ verticalAlign: "bottom", padding: 0 }}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={isAddUpdateDialogOpen} onClose={() => setIsAddUpdateDialogOpen(false)}>
        <DialogTitle>{isAdded ? "Update" : "Add"} Schema Binding</DialogTitle>
        <DialogContent>
          <SchemaForm schemaDetails={schemaDetails} updateSchemaDetails={updateSchemaDetails} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddUpdateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setIsAdded(true);
              setIsAddUpdateDialogOpen(false);
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeteteDialogOpen}>
        <DialogTitle>Delete Schema Binding</DialogTitle>
        <DialogContent>
          Are you sure you want to Delete this!!. Make sure you remove all the placeholders from the template
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setIsDeleteDialogOpen(false);
              updateSchemaDetails(null);
              dispatch(setCurrentSelection(null));
              OfficeInteropManager().deleteRexSchemaBinding();
              setIsAdded(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Schema;
