import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import { HiCheckCircle, HiStar } from 'react-icons/hi';
import { MdBugReport } from 'react-icons/md';
import { Task } from '@/lib/apiService';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const taskTypeIcons = {
  bug: <MdBugReport size={14} />,
  task: <HiCheckCircle size={14} />,
  story: <HiStar size={14} />,
};

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error',
} as const;

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        mb: 1.5,
        border: '1px solid #E4E7EB',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.04)',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease',
          borderColor: '#C4CDD5',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#151B26', lineHeight: 1.5 }}>
            {task.title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              size="small"
              label={task.task_type}
              icon={taskTypeIcons[task.task_type as keyof typeof taskTypeIcons] || <HiCheckCircle size={14} />}
              sx={{
                fontSize: '0.75rem',
                height: 24,
                bgcolor: '#F4F6F8',
                color: '#6C7A93',
                border: '1px solid #E4E7EB',
                '& .MuiChip-icon': { color: '#6C7A93' },
              }}
            />
            <Chip
              size="small"
              label={task.priority}
              color={priorityColors[task.priority as keyof typeof priorityColors] || 'default'}
              sx={{ fontSize: '0.75rem', height: 24, fontWeight: 500 }}
            />
            {task.story_points && (
              <Chip
                size="small"
                label={`${task.story_points} pts`}
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  borderColor: '#E4E7EB',
                  color: '#6C7A93',
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: '#6C7A93', fontWeight: 500 }}>
              #{task.id}
            </Typography>
            {task.assigned_to && (
              <Avatar
                src={`https://i.pravatar.cc/150?img=${task.assigned_to}`}
                sx={{ width: 24, height: 24, border: '2px solid white' }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}