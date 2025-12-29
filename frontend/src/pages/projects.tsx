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
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import SupportFab from '@/components/ai/SupportFab';
import ProjectCreateDialog from '@/components/projects/ProjectCreateDialog';
import { Project, projectAPI, taskAPI } from '@/lib/apiService';
import { format } from 'date-fns';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<Record<number, { total: number; done: number }>>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      const projectsData = response.data;
      setProjects(projectsData);

      const stats: Record<number, { total: number; done: number }> = {};
      for (const project of projectsData) {
        const tasksResponse = await taskAPI.getAll({ project_id: project.id });
        const tasks = tasksResponse.data;
        stats[project.id] = {
          total: tasks.length,
          done: tasks.filter((t) => t.status === 'done').length,
        };
      }
      setProjectStats(stats);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
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
              Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your development projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Project
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {projects.map((project) => {
            const stats = projectStats[project.id] || { total: 0, done: 0 };
            const progress = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

            return (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
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
                        <Stack direction="row" spacing={2} flex={1}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                            }}
                          >
                            <FolderIcon />
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {project.name}
                            </Typography>
                            <Chip label={project.key} size="small" />
                          </Box>
                        </Stack>
                        <IconButton size="small">
                          <MoreIcon />
                        </IconButton>
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                        {project.description || 'No description provided'}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{
                          pt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Total Tasks
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {stats.total}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Completed
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="success.main">
                            {stats.done}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Progress
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {Math.round(progress)}%
                          </Typography>
                        </Box>
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        Created {format(new Date(project.created_at), 'PPP')}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <ProjectCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={fetchProjects}
      />

      <SupportFab />
    </Box>
  );
}