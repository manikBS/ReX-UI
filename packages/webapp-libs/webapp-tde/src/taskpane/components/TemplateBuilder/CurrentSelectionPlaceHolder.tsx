import React, { useRef } from "react";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import ContentPasteGoSharpIcon from "@mui/icons-material/ContentPasteGoSharp";
import { useDispatch, useSelector } from "react-redux";
import {
  allPlaceholders,
  currentPlaceholderSelection,
  setCurrentSelectionField,
  addPlaceholder,
} from "../../../stateManagement/placeholdersSlice";
import OfficeInteropManager from "../../utils/officeFunctions";

interface IPlaceholderProps {}

const requiredPFields = ["placeHolderName", "jsonPath", "placeHolderType"];

const CurrentSelectionPlaceHolder: React.FC<IPlaceholderProps> = () => {
  const dispatch = useDispatch();
  const currentSelection = useSelector(currentPlaceholderSelection);
  const selectedPlaceholders = useSelector(allPlaceholders);
  const formRef = useRef(null);

  const validateIfElementExists = (currPlaceholderName) => {
    return selectedPlaceholders.filter((p) => p.placeholderName === currPlaceholderName).length > 0;
  };

  const validateNullFields = () => {
    const formFields = formRef.current.querySelectorAll("input");
    var res = true;
    formFields.forEach((field) => {
      if (requiredPFields.includes(field.name) && field.value.trim() === "") {
        res = false;
         
        console.log(field.name + " " + field.value + " is Empty!!");
      }
    });
    return res;
  };

  const handleSubmit = (placeholderName, action) => {
    if (validateNullFields()) {
      if (!validateIfElementExists(placeholderName)) {
        OfficeInteropManager().addPlaceholdersToSchemaBinding([currentSelection]);
        dispatch(addPlaceholder(currentSelection));
      }
      if (action === "paste") OfficeInteropManager().addTextInTemplate(placeholderName);
      else if (action === "copy") OfficeInteropManager().copyTextToClipboard(placeholderName);
    }
  };

  return null == currentSelection ? (
    <>
      <Typography variant="h6" sx={{ opacity: 0.5, position: "relative", top: "35%" }}>
        Please select a placeholder in schema tree
      </Typography>
    </>
  ) : (
    <form ref={formRef}>
      <Card variant="outlined">
        <CardContent>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Placeholder Name</TableCell>
                  <TableCell>
                    <TextField
                      name="placeHolderName"
                      onChange={(event) => dispatch(setCurrentSelectionField({ placeholderName: event.target.value }))}
                      variant="standard"
                      size="small"
                      value={currentSelection.placeholderName}
                      sx={{ marginTop: "0px", marginBottom: "2px" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Formula</TableCell>
                  <TableCell>
                    <TextField
                      name="jsonPath"
                      onChange={(event) => dispatch(setCurrentSelectionField({ jsonPath: event.target.value }))}
                      variant="standard"
                      size="small"
                      value={currentSelection.jsonPath}
                      sx={{ marginTop: "0px", marginBottom: "2px" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Data Type</TableCell>
                  <TableCell>
                    <TextField
                      name="dataType"
                      variant="standard"
                      size="small"
                      disabled
                      value={currentSelection.dataType}
                      sx={{ marginTop: "0px", marginBottom: "2px" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Placeholder Type</TableCell>
                  <TableCell>
                    <TextField
                      name="placeHolderType"
                      variant="standard"
                      size="small"
                      disabled
                      value={currentSelection.placeholderType}
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
                      value={currentSelection.format}
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
                      value={currentSelection.toType}
                      sx={{ marginTop: "0px", marginBottom: "2px" }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        <CardActions>
          <Tooltip title="Paste it in the template">
            <IconButton
              sx={{ verticalAlign: "bottom", padding: 0 }}
              onClick={() => handleSubmit(currentSelection.placeholderName, "paste")}
            >
              <ContentPasteGoSharpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy to Clipboard">
            <IconButton
              sx={{ verticalAlign: "bottom", padding: 0 }}
              onClick={() => handleSubmit(currentSelection.placeholderName, "copy")}
            >
              <ContentCopySharpIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </form>
  );
};

export default CurrentSelectionPlaceHolder;
