import { IconButton, TextField, InputAdornment, Toolbar, Button, Tooltip, Switch, FormControlLabel, MenuItem, ListSubheader, Select, Dialog, DialogTitle, DialogContent, DialogActions, SelectChangeEvent } from "@mui/material";
import React, { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import { TenantType } from '@sb/webapp-api-client/constants';
import { groupBy, head, prop } from 'ramda';
import { useCurrentTenant } from '@sb/webapp-tenants/providers';
import { useTenants } from "@sb/webapp-tenants/hooks/useTenants/useTenants.hook";

interface IFooterProps {}

const Footer: React.FC<IFooterProps> = () => {
  const { data: currentTenant } = useCurrentTenant();
  const tenants = useTenants();

  const tenantsGrouped = groupBy(prop<string>('type'), tenants);
  const personalTenant = head(tenantsGrouped[TenantType.PERSONAL]);
  const organizationTenants = groupBy(
    (tenant) => (tenant?.membership?.invitationAccepted ? 'organizations' : 'invitations'),
    tenantsGrouped[TenantType.ORGANIZATION] ?? []
  );

  const officeFileInputRef = useRef(null);
  const dataFileInputRef = useRef(null);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [currentOfficeFile, setCurrentOfficeFile] = useState<File | null>(null);
  const [currentDataFile, setCurrentDataFile] = useState<File | null>(null);
  const [isPdfConversion, setIsPdfConversion] = useState(false);
  const [outputFileName, setOutputFileName] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(currentTenant ? currentTenant.id : "");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const handleTextFieldClick = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click(); // Manually trigger the file selection dialog
      ref.current.value = ""; // Reset input value
    }
  };

  const handleTenantChange = (event: SelectChangeEvent<string>) => {
    const tenant = event.target.value;
    console.log(tenant);
    if (!tenant) return;
    setSelectedTenant(tenant);
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
    formData.append('office_file', currentOfficeFile);
    formData.append('json_file', currentDataFile);
    formData.append('isPdfConversion', isPdfConversion.toString());
    formData.append('outputFileName', outputFileName);
    console.log(`Calling http://localhost:5001/api/reports/report-templates/run?isPdfConversion=${isPdfConversion}&outputFileName=${outputFileName} ...`)
    try {
      const response = await fetch(`/api/reports/report-templates/run/`, {
        method: 'POST',
        body: formData,
        headers: {
          "access-control-allow-origin": "*",
        },
        credentials: 'include',
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

  const handleSaveAction = async () => {
    if (!reportName || !selectedTenant) {
      console.error('File, tenant, or output file name not provided.');
      return;
    }
  
    // Construct the payload
    const payload = {
      name: reportName,
      description: reportDescription,
      tenant: selectedTenant,
    };
  
    try {
      // Make the POST request to save the file information
      const response = await fetch('/api/reports/report-templates/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      console.log('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
    }
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

          <Tooltip title="Click to Save">
            <IconButton 
              onClick={()=>{setIsSaveDialogOpen(true)}} 
              sx={{ verticalAlign: "bottom", padding: 0 }} 
              disabled={!currentOfficeFile || !selectedTenant}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Click to Run Report">
            <IconButton 
              onClick={()=>{setIsRunDialogOpen(true)}} 
              sx={{ verticalAlign: "bottom", padding: 0 }} 
              disabled={!currentOfficeFile || !selectedTenant}
            >
              <PlayArrowTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        {/* Run Report Dialog */}
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
            <Select
            value={selectedTenant}
            onChange={handleTenantChange}
            displayEmpty
            fullWidth
            >
              <MenuItem value="" disabled>Select Tenant</MenuItem>
              {personalTenant && <MenuItem value={personalTenant.id}>{personalTenant.name}</MenuItem>}
              <ListSubheader>Organizations</ListSubheader>
              {organizationTenants.organizations
                .filter((tenant) => tenant)
                .map((tenant) => (
                  <MenuItem value={tenant.id} key={tenant.id}>{tenant.name}</MenuItem>
                ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRunAction}>Run</Button>
          </DialogActions>
        </Dialog>

        {/* Save Report Dialog */}
      <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)}>
        <DialogTitle>Save Report</DialogTitle>
        <DialogContent>
          <TextField
            label="Report Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            variant="standard"
            fullWidth
          />
          <TextField
            label="Description"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            variant="standard"
            fullWidth
          />
          <Select
            value={selectedTenant}
            onChange={handleTenantChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Tenant</MenuItem>
            {personalTenant && <MenuItem value={personalTenant.id}>{personalTenant.name}</MenuItem>}
            <ListSubheader>Organizations</ListSubheader>
            {organizationTenants.organizations
              .filter((tenant) => tenant)
              .map((tenant) => (
                <MenuItem value={tenant.id} key={tenant.id}>{tenant.name}</MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveAction}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Footer;
