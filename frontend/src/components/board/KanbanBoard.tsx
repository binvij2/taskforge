import React from 'react';
import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { Task } from '@/lib/apiService';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove: (taskId: number, newStatus: string) => void;
}

const columns = [
  { id: 'todo', title: 'To Do', color: '#6C7A93' },
  { id: 'in_progress', title: 'In Progress', color: '#F2C94C' },
  { id: 'in_review', title: 'In Review', color: '#6AA3F0' },
  { id: 'done', title: 'Done', color: '#6FCF97' },
];

export default function KanbanBoard({ tasks, onTaskClick, onTaskMove }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId;

    onTaskMove(taskId, newStatus);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack direction="row" spacing={3} sx={{ height: '100%', overflowX: 'auto', pb: 2 }}>
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <Box key={column.id} sx={{ minWidth: 320, maxWidth: 320 }}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: '#FAFBFC',
                  border: '1px solid #E4E7EB',
                  borderRadius: 3,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: column.color,
                      }}
                    />
                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: '0.9375rem', color: '#151B26' }}>
                      {column.title}
                    </Typography>
                  </Stack>
                  <Chip
                    label={columnTasks.length}
                    size="small"
                    sx={{
                      bgcolor: '#FFFFFF',
                      color: column.color,
                      fontSize: '0.75rem',
                      height: 24,
                      fontWeight: 600,
                      border: '1px solid #E4E7EB',
                    }}
                  />
                </Stack>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 200,
                        bgcolor: snapshot.isDraggingOver ? '#F4F6F8' : 'transparent',
                        borderRadius: 2,
                        transition: 'background-color 0.2s ease',
                        p: snapshot.isDraggingOver ? 1 : 0,
                      }}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.9 : 1,
                              }}
                            >
                              <TaskCard task={task} onClick={() => onTaskClick(task)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Box>
          );
        })}
      </Stack>
    </DragDropContext>
  );
}