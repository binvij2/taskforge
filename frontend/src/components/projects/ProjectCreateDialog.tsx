import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { projectAPI } from '@/lib/apiService';

interface ProjectCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectCreateDialog({
  open,
  onClose,
  onSuccess,
}: ProjectCreateDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.key) {
      setError('Name and Key are required');
      return;
    }

    if (formData.key.length < 2 || formData.key.length > 10) {
      setError('Project key must be between 2 and 10 characters');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await projectAPI.create({
        name: formData.name,
        key: formData.key.toUpperCase(),
        description: formData.description || undefined,
      });
      
      setFormData({
        name: '',
        key: '',
        description: '',
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      
      // Extract error message from response
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Failed to create project. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        key: '',
        description: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <TextField
            label="Project Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
            placeholder="e.g., DevTaskBoard"
            disabled={loading}
            error={!formData.name && error !== null}
          />

          <TextField
            label="Project Key"
            value={formData.key}
            onChange={(e) => handleChange('key', e.target.value.toUpperCase())}
            required
            fullWidth
            placeholder="e.g., DTB"
            helperText="Short identifier (2-10 characters, will be uppercase)"
            inputProps={{ maxLength: 10 }}
            disabled={loading}
            error={!formData.key && error !== null}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Brief description of the project"
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}