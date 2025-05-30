import React, { useState, useEffect } from 'react';
import { type Resource, createResource, updateResource } from '../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface ResourceFormProps {
  resource?: Resource | null; // For editing
  onSave: (savedResource: Resource) => void;
  onClose: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onSave, onClose }) => {
  const [name, setName] = useState(resource?.name || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setDescription(resource.description || '');
    } else {
      setName('');
      setDescription('');
    }
    // Reset errors when resource or form mode changes
    setError(null);
    setNameError(null);
  }, [resource]);

  const validate = (): boolean => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError(null);
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resourceData = { name, description };
      let savedResource: Resource;

      if (resource?.id) {
        savedResource = await updateResource(resource.id, resourceData);
      } else {
        savedResource = await createResource(resourceData);
      }
      onSave(savedResource);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to save resource: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Resource Name"
        name="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!nameError}
        helperText={nameError}
        disabled={loading}
      />
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description (Optional)"
        name="description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (resource?.id ? 'Save Changes' : 'Create Resource')}
        </Button>
      </Box>
    </Box>
  );
};

export default ResourceForm; 