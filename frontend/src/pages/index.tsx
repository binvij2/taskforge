import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { HiPlus, HiClipboardList, HiCheckCircle, HiClock } from 'react-icons/hi';
import { MdBugReport } from 'react-icons/md';
import KpiCard from '@/components/dashboard/KpiCard';
import SupportFab from '@/components/ai/SupportFab';
import TaskCreateDialog from '@/components/tasks/TaskCreateDialog';
import { taskAPI } from '@/lib/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    done: 0,
    bugs: 0,
  });
  const [tasksByType, setTasksByType] = useState<any[]>([]);
  const [tasksByStatus, setTasksByStatus] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tasksResponse = await taskAPI.getAll();
      const tasks = tasksResponse.data;

      const total = tasks.length;
      const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
      const done = tasks.filter((t) => t.status === 'done').length;
      const bugs = tasks.filter((t) => t.task_type === 'bug').length;

      setStats({ total, inProgress, done, bugs });

      const typeData = [
        { name: 'Story', value: tasks.filter((t) => t.task_type === 'story').length },
        { name: 'Task', value: tasks.filter((t) => t.task_type === 'task').length },
        { name: 'Bug', value: tasks.filter((t) => t.task_type === 'bug').length },
      ];
      setTasksByType(typeData);

      const statusData = [
        { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length },
        { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length },
        { name: 'In Review', value: tasks.filter((t) => t.status === 'in_review').length },
        { name: 'Done', value: tasks.filter((t) => t.status === 'done').length },
      ];
      setTasksByStatus(statusData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const COLORS = ['#F06A6A', '#6FCF97', '#F2C94C', '#6AA3F0'];

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
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#6C7A93' }}>
              Overview of your projects and tasks
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<HiPlus size={18} />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              bgcolor: '#F06A6A',
              '&:hover': {
                bgcolor: '#D84D4D',
              },
            }}
          >
            Create Task
          </Button>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Total Tasks"
              value={stats.total}
              icon={<HiClipboardList />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="In Progress"
              value={stats.inProgress}
              icon={<HiClock />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Completed"
              value={stats.done}
              icon={<HiCheckCircle />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Bugs Reported"
              value={stats.bugs}
              icon={<MdBugReport />}
              color="secondary"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #E4E7EB' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#151B26' }}>
                Tasks by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasksByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tasksByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #E4E7EB' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#151B26' }}>
                Tasks by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tasksByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6C7A93' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6C7A93' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F06A6A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <TaskCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <SupportFab />
    </Box>
  );
}