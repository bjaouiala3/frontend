import { useState } from 'react';
import type { CreateTaskDto, Task } from '../types/task';
import { TaskStatus } from '../types/task';
import { tasksApi } from '../api/tasks';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const createDto: CreateTaskDto = {
        title: title.trim(),
        description: description.trim(),
        status: TaskStatus.TODO,
      };
      const newTask = await tasksApi.create(createDto);
      onTaskCreated(newTask);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
      <h2>Create New Task</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div style={{ marginBottom: '10px' }}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            disabled={loading}
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '5px', minHeight: '80px' }}
            disabled={loading}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}

