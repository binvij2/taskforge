import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EntityTableCard from '@/components/tables/EntityTableCard';
import DetailDrawer from '@/components/details/DetailDrawer';
import GradientHeader from '@/components/details/GradientHeader';
import SupportFab from '@/components/ai/SupportFab';
import { Task, taskAPI } from '@/lib/apiService';
import { Assignment as TaskIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';

export default function Backlog() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data.filter((task) => !task.sprint_id));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
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

  const columns = [
    {
      id: 'id',
      label: 'Task',
      minWidth: 200,
      format: (value: any) => {
        const task = tasks.find(t => t.id === value);
        if (!task) return value;
        return (
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                #{task.id}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {task.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {task.task_type}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        );
      },
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value}
          size="small"
          color={priorityColors[value as keyof typeof priorityColors] || 'default'}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value: string) => (
        <Chip label={value.replace('_', ' ')} size="small" variant="outlined" />
      ),
    },
    {
      id: 'story_points',
      label: 'Points',
      minWidth: 80,
      align: 'center' as const,
      format: (value: number) => (value ? value : '-'),
    },
    {
      id: 'assigned_to',
      label: 'Assignee',
      minWidth: 120,
      format: (value: number) =>
        value ? (
          <Avatar src={`https://i.pravatar.cc/150?img=${value}`} sx={{ width: 32, height: 32 }} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Unassigned
          </Typography>
        ),
    },
  ];

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
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Product Backlog
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unscheduled tasks and features
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Task
          </Button>
        </Stack>

        <EntityTableCard
          columns={columns}
          rows={tasks}
          onRowClick={handleRowClick}
          searchPlaceholder="Search backlog..."
          statusFilter={true}
          statusOptions={['todo', 'in_progress', 'in_review', 'done']}
        />
      </Container>

      <DetailDrawer open={drawerOpen} onClose={handleDrawerClose}>
        {selectedTask && (
          <>
            <GradientHeader
              title={selectedTask.title}
              subtitle={`#${selectedTask.id} • ${selectedTask.task_type}`}
              icon={<TaskIcon />}
              badge={selectedTask.status.replace('_', ' ').toUpperCase()}
              kpi={selectedTask.story_points ? selectedTask.story_points.toString() : undefined}
              onClose={handleDrawerClose}
            />

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Stack spacing={3}>
                <Paper
                  sx={{
                    p: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {selectedTask.description || 'No description provided'}
                  </Typography>
                </Paper>

                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" fullWidth>
                    Add to Sprint
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Edit
                  </Button>
                  <Button variant="contained" fullWidth>
                    Start Work
                  </Button>
                </Stack>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Task Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <FlagIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Priority"
                        secondary={
                          <Chip
                            label={selectedTask.priority}
                            size="small"
                            color={priorityColors[selectedTask.priority as keyof typeof priorityColors] || 'default'}
                          />
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Assigned To"
                        secondary={
                          selectedTask.assigned_to ? (
                            <Stack direction="row" spacing={1} alignItems="center">
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
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <CalendarIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Created"
                        secondary={format(new Date(selectedTask.created_at), 'PPP')}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Stack>
            </Box>
          </>
        )}
      </DetailDrawer>

      <SupportFab />
    </Box>
  );
}