import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Box,
  Chip,
  Avatar,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => React.ReactNode;
}

interface EntityTableCardProps {
  columns: Column[];
  rows: any[];
  onRowClick?: (row: any) => void;
  searchPlaceholder?: string;
  statusFilter?: boolean;
  statusOptions?: string[];
}

export default function EntityTableCard({
  columns,
  rows,
  onRowClick,
  searchPlaceholder = 'Search...',
  statusFilter = false,
  statusOptions = [],
}: EntityTableCardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilterValue, setStatusFilterValue] = useState('all');

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', md: 300 } }}
          />
          {statusFilter && (
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={statusFilterValue}
                  onChange={(e) => setStatusFilterValue(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton size="small">
                <FilterIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    bgcolor: 'background.default',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((row) => {
                const matchesSearch = Object.values(row).some((value) =>
                  String(value).toLowerCase().includes(searchTerm.toLowerCase())
                );
                const matchesStatus =
                  statusFilterValue === 'all' || row.status === statusFilterValue;
                return matchesSearch && matchesStatus;
              })
              .map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}