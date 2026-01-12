import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { tasksApi } from '../api/tasks';
import type { Task } from '../types/task';
import { TaskStatus } from '../types/task';

vi.mock('../api/tasks');

describe('TaskForm', () => {
  const mockOnTaskCreated = vi.fn();

  const mockTask: Task = {
    _id: '1',
    title: 'New Task',
    description: 'New Description',
    status: TaskStatus.TODO,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create task form', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('should create a task when form is submitted', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksApi.create).mockResolvedValue(mockTask);

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title:/i);
    const descriptionInput = screen.getByLabelText(/Description:/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(tasksApi.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TODO,
      });
      expect(mockOnTaskCreated).toHaveBeenCalledWith(mockTask);
    });

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  it('should show error when title and description are empty', async () => {
    const user = userEvent.setup();

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title and description are required')).toBeInTheDocument();
    });

    expect(tasksApi.create).not.toHaveBeenCalled();
  });

  it('should show error message on API failure', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksApi.create).mockRejectedValue(new Error('API Error'));

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title:/i);
    const descriptionInput = screen.getByLabelText(/Description:/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create task')).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });
});

