import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
import { tasksApi } from '../api/tasks';
import type { Task } from '../types/task';
import { TaskStatus } from '../types/task';

vi.mock('../api/tasks');

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      _id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task list', async () => {
    vi.mocked(tasksApi.getAll).mockResolvedValue(mockTasks);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Tasks')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(tasksApi.getAll).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<TaskList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty message when no tasks', async () => {
    vi.mocked(tasksApi.getAll).mockResolvedValue([]);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Create one below!')).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    vi.mocked(tasksApi.getAll).mockRejectedValue(new Error('API Error'));

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
    });
  });
});

