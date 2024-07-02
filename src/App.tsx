// src/App.tsx
import React from 'react';
import TodoList from './components/Todolist';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
};

export default App;
