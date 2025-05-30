import React, { useEffect, useState, useCallback } from 'react';
import { getResources, deleteResource, type Resource } from '../services/api';
import ResourceCard from './ResourceCard';
import ResourceForm from './ResourceForm';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const ResourceList: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources();
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        setResources(prevResources => prevResources.filter(r => r.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete resource');
      }
    }
  };
  
  const handleOpenCreateModal = () => {
    setEditingResource(null);
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingResource(null);
  };

  const handleResourceSaved = (savedResource: Resource) => {
    if (editingResource) {
      setResources(prevResources => 
        prevResources.map(r => (r.id === savedResource.id ? savedResource : r))
      );
    } else {
      setResources(prevResources => [savedResource, ...prevResources]);
    }
    fetchResources();
    handleModalClose();
  };

  if (loading && resources.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && resources.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchResources} sx={{mt: 2}}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Resources
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
          Create Resource
        </Button>
      </Box>
      {error && resources.length > 0 && <Alert severity="warning" sx={{mb: 2}}>Could not refresh all data: {error}</Alert>}
      {loading && resources.length > 0 && <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}><CircularProgress size={20}/></Box>}

      {resources.length === 0 && !loading && !error ? (
        <Typography>No resources found. Click "Create Resource" to add one.</Typography>
      ) : (
        resources.map(resource => (
          <ResourceCard 
            key={resource.id} 
            resource={resource} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ))
      )}
      
      <Dialog open={isCreateModalOpen || isEditModalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
        <DialogContent>
          <ResourceForm 
            resource={editingResource} 
            onSave={handleResourceSaved} 
            onClose={handleModalClose} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ResourceList; 