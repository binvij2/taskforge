import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid,
} from '@mui/material';
import { taskAPI, projectAPI, sprintAPI, userAPI, Project, Sprint, User } from '@/lib/apiService';

interface TaskCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultProjectId?: number;
  defaultSprintId?: number;
}

export default function TaskCreateDialog({
  open,
  onClose,
  onSuccess,
  defaultProjectId,
  defaultSprintId,
}: TaskCreateDialogProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'task',
    priority: 'medium',
    status: 'todo',
    story_points: '',
    project_id: defaultProjectId || '',
    sprint_id: defaultSprintId || '',
    assigned_to: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [projectsRes, sprintsRes, usersRes] = await Promise.all([
        projectAPI.getAll(),
        sprintAPI.getAll(),
        userAPI.getAll(),
      ]);
      setProjects(projectsRes.data);
      setSprints(sprintsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.project_id) {
      alert('Title and Project are required');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        task_type: formData.task_type,
        priority: formData.priority,
        status: formData.status,
        project_id: Number(formData.project_id),
        created_by: 1, // Default to user 1 (John Doe)
      };

      if (formData.story_points) {
        payload.story_points = Number(formData.story_points);
      }
      if (formData.sprint_id) {
        payload.sprint_id = Number(formData.sprint_id);
      }
      if (formData.assigned_to) {
        payload.assigned_to = Number(formData.assigned_to);
      }
      if (formData.due_date) {
        payload.due_date = new Date(formData.due_date).toISOString();
      }

      await taskAPI.create(payload);
      setFormData({
        title: '',
        description: '',
        task_type: 'task',
        priority: 'medium',
        status: 'todo',
        story_points: '',
        project_id: defaultProjectId || '',
        sprint_id: defaultSprintId || '',
        assigned_to: '',
        due_date: '',
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Project</InputLabel>
                <Select
                  value={formData.project_id}
                  label="Project"
                  onChange={(e) => handleChange('project_id', e.target.value)}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sprint</InputLabel>
                <Select
                  value={formData.sprint_id}
                  label="Sprint"
                  onChange={(e) => handleChange('sprint_id', e.target.value)}
                >
                  <MenuItem value="">None (Backlog)</MenuItem>
                  {sprints.map((sprint) => (
                    <MenuItem key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={formData.task_type}
                  label="Task Type"
                  onChange={(e) => handleChange('task_type', e.target.value)}
                >
                  <MenuItem value="story">Story</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                  <MenuItem value="bug">Bug</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Story Points"
                type="number"
                value={formData.story_points}
                onChange={(e) => handleChange('story_points', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={formData.assigned_to}
                  label="Assign To"
                  onChange={(e) => handleChange('assigned_to', e.target.value)}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}