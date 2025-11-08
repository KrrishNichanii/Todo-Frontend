import { useState } from 'react';
import './App.css';
import SignUpPage from './Pages/SignUpPage';
import { Route, Routes } from 'react-router-dom';
import NotFound from './Pages/NotFound';
import LoginPage from './Pages/LoginPage';
import TodoPage from './Pages/TodoPage';
import Authenticated from './Pages/Authenticated'; // 👈 import it
import UsersPage from './Pages/UsersPage';

function App() {

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SignUpPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />

      {/*Protected Route Wrapper */}
      <Route path="/auth" element={<Authenticated />}>
        <Route path="todos" element={<TodoPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;

