import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { Add as AddIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import SupportFab from '@/components/ai/SupportFab';
import { Sprint, sprintAPI, taskAPI, Task } from '@/lib/apiService';
import { format, differenceInDays } from 'date-fns';

export default function Sprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [sprintTasks, setSprintTasks] = useState<Record<number, Task[]>>({});

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      const response = await sprintAPI.getAll();
      const sprintsData = response.data;
      setSprints(sprintsData);

      const tasksMap: Record<number, Task[]> = {};
      for (const sprint of sprintsData) {
        const tasksResponse = await taskAPI.getAll({ sprint_id: sprint.id });
        tasksMap[sprint.id] = tasksResponse.data;
      }
      setSprintTasks(tasksMap);
    } catch (error) {
      console.error('Failed to fetch sprints:', error);
    }
  };

  const getSprintProgress = (sprintId: number) => {
    const tasks = sprintTasks[sprintId] || [];
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    return (completedTasks / tasks.length) * 100;
  };

  const getSprintStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'planned':
        return 'info';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    return differenceInDays(new Date(endDate), new Date());
  };

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
              Sprints
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track your development sprints
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Sprint
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {sprints.map((sprint) => {
            const tasks = sprintTasks[sprint.id] || [];
            const progress = getSprintProgress(sprint.id);
            const daysRemaining = getDaysRemaining(sprint.end_date);

            return (
              <Grid item xs={12} md={6} lg={4} key={sprint.id}>
                <Card
                  sx={{
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {sprint.name}
                          </Typography>
                          <Chip
                            label={sprint.status}
                            size="small"
                            color={getSprintStatusColor(sprint.status) as any}
                          />
                        </Box>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          <CalendarIcon />
                        </Avatar>
                      </Stack>

                      {sprint.goal && (
                        <Typography variant="body2" color="text.secondary">
                          {sprint.goal}
                        </Typography>
                      )}

                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {Math.round(progress)}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Start Date
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {format(new Date(sprint.start_date), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            End Date
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {format(new Date(sprint.end_date), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                      </Stack>

                      {sprint.status === 'active' && daysRemaining >= 0 && (
                        <Chip
                          label={`${daysRemaining} days remaining`}
                          size="small"
                          color="warning"
                          sx={{ width: 'fit-content' }}
                        />
                      )}

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {tasks.length} tasks
                        </Typography>
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28 } }}>
                          {tasks
                            .filter((t) => t.assigned_to)
                            .slice(0, 4)
                            .map((task, idx) => (
                              <Avatar
                                key={idx}
                                src={`https://i.pravatar.cc/150?img=${task.assigned_to}`}
                              />
                            ))}
                        </AvatarGroup>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <SupportFab />
    </Box>
  );
}