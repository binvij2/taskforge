import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import KanbanBoard from '@/components/board/KanbanBoard';
import DetailDrawer from '@/components/details/DetailDrawer';
import GradientHeader from '@/components/details/GradientHeader';
import SupportFab from '@/components/ai/SupportFab';
import TaskCreateDialog from '@/components/tasks/TaskCreateDialog';
import { Task, taskAPI, projectAPI, Project } from '@/lib/apiService';
import { HiClipboardList, HiUser, HiCalendar, HiFlag } from 'react-icons/hi';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const filters = selectedProject !== 'all' ? { project_id: selectedProject as number } : {};
      const response = await taskAPI.getAll(filters);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleTaskMove = async (taskId: number, newStatus: string) => {
    try {
      await taskAPI.move(taskId, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedTask(null);
  };

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error',
  } as const;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: '#151B26' }}>
              Task Board
            </Typography>
            <Typography variant="body2" sx={{ color: '#6C7A93' }}>
              Manage and track your development tasks
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                label="Project"
                onChange={(e) => setSelectedProject(e.target.value as number | 'all')}
              >
                <MenuItem value="all">All Projects</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<HiPlus size={18} />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ bgcolor: '#F06A6A', '&:hover': { bgcolor: '#D84D4D' } }}
            >
              New Task
            </Button>
          </Stack>
        </Stack>

        <KanbanBoard tasks={tasks} onTaskClick={handleTaskClick} onTaskMove={handleTaskMove} />
      </Container>

      <DetailDrawer open={drawerOpen} onClose={handleDrawerClose}>
        {selectedTask && (
          <>
            <GradientHeader
              title={selectedTask.title}
              subtitle={`#${selectedTask.id} • ${selectedTask.task_type}`}
              icon={<HiClipboardList />}
              badge={selectedTask.status.replace('_', ' ').toUpperCase()}
              kpi={selectedTask.story_points ? selectedTask.story_points.toString() : undefined}
              onClose={handleDrawerClose}
            />

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Stack spacing={3}>
                <Paper
                  sx={{
                    p: 2.5,
                    border: '1.5px dashed #E4E7EB',
                    borderRadius: 3,
                    bgcolor: '#FAFBFC',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#6C7A93', mb: 1, fontWeight: 500 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#151B26', lineHeight: 1.6 }}>
                    {selectedTask.description || 'No description provided'}
                  </Typography>
                </Paper>

                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" fullWidth sx={{ borderWidth: '1.5px' }}>
                    Edit
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ borderWidth: '1.5px' }}>
                    Comment
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: '#F06A6A', '&:hover': { bgcolor: '#D84D4D' } }}
                  >
                    Complete
                  </Button>
                </Stack>

                <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E4E7EB' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#151B26' }}>
                    Task Details
                  </Typography>
                  <List sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HiFlag size={20} color="#6C7A93" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Priority"
                        secondary={
                          <Chip
                            label={selectedTask.priority}
                            size="small"
                            color={priorityColors[selectedTask.priority as keyof typeof priorityColors] || 'default'}
                            sx={{ mt: 0.5 }}
                          />
                        }
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: '#6C7A93' }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1.5 }} />
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HiUser size={20} color="#6C7A93" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Assigned To"
                        secondary={
                          selectedTask.assigned_to ? (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <Avatar
                                src={`https://i.pravatar.cc/150?img=${selectedTask.assigned_to}`}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography variant="body2">User {selectedTask.assigned_to}</Typography>
                            </Stack>
                          ) : (
                            'Unassigned'
                          )
                        }
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: '#6C7A93' }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1.5 }} />
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HiCalendar size={20} color="#6C7A93" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Created"
                        secondary={format(new Date(selectedTask.created_at), 'PPP')}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: '#6C7A93' }}
                        secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                      />
                    </ListItem>
                    {selectedTask.due_date && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <HiCalendar size={20} color="#6C7A93" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Due Date"
                            secondary={format(new Date(selectedTask.due_date), 'PPP')}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: '#6C7A93' }}
                            secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </Paper>
              </Stack>
            </Box>
          </>
        )}
      </DetailDrawer>

      <TaskCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={fetchTasks}
        defaultProjectId={selectedProject !== 'all' ? (selectedProject as number) : undefined}
      />

      <SupportFab />
    </Box>
  );
}