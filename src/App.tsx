import { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    // Force TaskList to refresh by changing key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Task Manager</h1>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <TaskList key={refreshKey} />
    </div>
  );
}

export default App;
