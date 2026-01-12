import { useEffect, useState } from 'react';
import type { Task } from '../types/task';
import { TaskStatus } from '../types/task';
import { tasksApi } from '../api/tasks';
import TaskItem from './TaskItem';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: string, status: TaskStatus) => {
    try {
      const updated = await tasksApi.update(id, { status });
      setTasks(tasks.map((task) => (task._id === id ? updated : task)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create one below!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

