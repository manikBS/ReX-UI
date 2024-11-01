import { IconButton, TextField, InputAdornment, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, Switch, FormControlLabel } from "@mui/material";
import React, { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";

interface IFooterProps {}

const Footer: React.FC<IFooterProps> = () => {
  const officeFileInputRef = useRef(null);
  const dataFileInputRef = useRef(null);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [currentOfficeFile, setCurrentOfficeFile] = useState<File | null>(null);
  const [currentDataFile, setCurrentDataFile] = useState<File | null>(null);
  const [isPdfConversion, setIsPdfConversion] = useState(false);
  const [outputFileName, setOutputFileName] = useState("");

  const handleTextFieldClick = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click(); // Manually trigger the file selection dialog
      ref.current.value = ""; // Reset input value
    }
  };

  const handleOfficeFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) setCurrentOfficeFile(file);
  };

  const handleDataFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) setCurrentDataFile(file);
  };

  const handleRunAction = async () => {
    if (!currentOfficeFile || !currentDataFile) {
      console.error('Office file or data file not selected.');
      return;
    }

    const formData = new FormData();
    formData.append('OfficeFile', currentOfficeFile);
    formData.append('DataFile', currentDataFile);
    formData.append('IsPdfConversion', isPdfConversion.toString());
    formData.append('OutputFileName', outputFileName);
    console.log(`Calling https://localhost:7069/ReportBuilder/generate?isPdfConversion=${isPdfConversion}&outputFileName=${outputFileName} ...`)
    try {
      const response = await fetch(`https://localhost:7069/ReportBuilder/generate?isPdfConversion=${isPdfConversion}&outputFileName=${outputFileName}`, {
        method: 'POST',
        body: formData,
        headers: {
          "access-control-allow-origin": "*",
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const filename = outputFileName || 'downloaded-file';
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }

    setIsRunDialogOpen(false);
  };

  return (
    <>
        <Toolbar sx={{position: "fixed", bottom: 0}}>
          <input ref={officeFileInputRef} type="file" onChange={handleOfficeFileChange} style={{ display: "none" }} />
          <TextField
            hiddenLabel
            placeholder="Save current file and Select the saved file to enable Run button"
            value={currentOfficeFile ? currentOfficeFile.name : ""}
            onClick={()=>handleTextFieldClick(officeFileInputRef)}
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
          <Tooltip title="Click to Run Report">
            <IconButton 
              onClick={()=>{setIsRunDialogOpen(true)}} 
              sx={{ verticalAlign: "bottom", padding: 0 }} 
              disabled={null===currentOfficeFile}
            >
              <PlayArrowTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Dialog open={isRunDialogOpen} onClose={() => setIsRunDialogOpen(false)}>
        <DialogTitle>Run Report</DialogTitle>
        <DialogContent>
          <input ref={dataFileInputRef} type="file" onChange={handleDataFileChange} style={{ display: "none" }} />
          <TextField
            hiddenLabel
            placeholder="Select Data File"
            value={currentDataFile ? currentDataFile.name : ""}
            onClick={() => handleTextFieldClick(dataFileInputRef)}
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
          <FormControlLabel
            control={
              <Switch
                checked={isPdfConversion}
                onChange={(e) => setIsPdfConversion(e.target.checked)}
                color="primary"
                inputProps={{ 'aria-label': 'pdf conversion switch' }}
                size="small"
              />
            }
            label="Is PDF Conversion Req."
          />
          <TextField
            label="Output File Name"
            value={outputFileName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOutputFileName(e.target.value)}
            variant="standard"
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRunAction}>Run</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Footer;
