import React from 'react';
import { useDispatch } from 'react-redux';
//import { deleteTemplate } from '../redux/actions';
import { Card, CardContent, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const TemplateCard = ({ template }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
//        dispatch(deleteTemplate(template.id));
    };

    const handleDownload = () => {
        // Implement download logic here
    };

    return (
        <Card sx={{ maxWidth: 300, margin: 2, '&:hover': { transform: 'scale(1.05)' } }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {template.name}
                </Typography>
                <Typography variant="body2">Created by: {template.createdBy}</Typography>
                <Typography variant="body2">Created date: {template.createdDate}</Typography>
                <Typography variant="body2">Last modified: {template.lastModified}</Typography>
                
                <IconButton color="error" onClick={handleDownload} sx={{ marginTop: 1, marginLeft: 1 }}>
                    <CloudDownloadIcon />
                </IconButton>

                <IconButton color="error" onClick={handleDelete} sx={{ marginTop: 1, marginLeft: 1 }}>
                    <DeleteIcon />
                </IconButton> 
            </CardContent>
        </Card>
    );
};

export default TemplateCard;
