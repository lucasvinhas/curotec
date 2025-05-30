import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getResources, deleteResource, type Resource, type ResourceFilters } from '../services/api';
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
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

// No DialogActions needed if form has its own cancel/save

// Debounce function
function debounce<F extends (...args: unknown[]) => unknown>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
}

const ResourceList: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for filters
  const [filters, setFilters] = useState<ResourceFilters>({ name: '', description: '' });

  const fetchResources = useCallback(async (currentFilters: ResourceFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources(currentFilters);
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced version of fetchResources
  const debouncedFetchResources = useMemo(() => {
    return debounce(fetchResources, 500); // 500ms debounce
  }, [fetchResources]);

  useEffect(() => {
    fetchResources(filters); // Initial fetch with default filters
  }, [fetchResources]); // filters removed from here to prevent re-fetch on every keystroke before debounce

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    debouncedFetchResources(newFilters);
  };

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
    fetchResources(filters);
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
        <Button onClick={() => fetchResources(filters)} sx={{mt: 2}}>Try Again</Button>
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

      {/* Filter Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Filter by Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Filter by Description"
            name="description"
            value={filters.description}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

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