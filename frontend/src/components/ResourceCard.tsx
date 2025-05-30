import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { type Resource } from '../services/api';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: number) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit, onDelete }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {resource.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ID: {resource.id}
        </Typography>
        <Typography variant="body2">
          {resource.description || 'No description provided.'}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{mt:1}}>
          Created: {new Date(resource.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Updated: {new Date(resource.updatedAt).toLocaleString()}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => onEdit(resource)} sx={{ mr: 1 }}>Edit</Button>
          <Button size="small" color="error" onClick={() => onDelete(resource.id)}>Delete</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResourceCard; 