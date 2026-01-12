import type { Task } from '../types/task';
import { TaskStatus } from '../types/task';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: TaskStatus) => void;
}

export default function TaskItem({ task, onDelete, onStatusUpdate }: TaskItemProps) {
  const statusOptions: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

  return (
    <li
      style={{
        border: '1px solid #ccc',
        margin: '10px 0',
        padding: '15px',
        borderRadius: '4px',
      }}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div style={{ marginTop: '10px' }}>
        <label>
          Status:
          <select
            value={task.status}
            onChange={(e) => onStatusUpdate(task._id, e.target.value as TaskStatus)}
            style={{ marginLeft: '10px' }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => onDelete(task._id)}
          style={{ marginLeft: '15px', backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
        >
          Delete
        </button>
      </div>
      <small style={{ color: '#666' }}>
        Created: {new Date(task.createdAt).toLocaleString()}
      </small>
    </li>
  );
}

