import React, { useEffect, useState } from 'react';
import { logoutUser } from '../services/AuthService';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

function Authenticated() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

 useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      
      if (!parsedUser.isActive) {
        alert("Your account is inactive. Please contact the admin.");
        localStorage.removeItem('user');
        navigate('/signin');
        return;
      }

      setUser(parsedUser);

      if (location.pathname === '/auth') {
        navigate('/auth/todos', { replace: true });
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('todos_list');
      navigate('/signin');
    }
  } else {
    navigate('/signin');
  }
}, [navigate, location.pathname]);


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('todos_list');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/signin', { replace: true });
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="text-white text-center p-8 bg-gray-900 min-h-screen">
        Checking authentication...
      </div>
    );
  }
  console.log("Authenticated User:", user) ;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 bg-gray-800 shadow-lg sticky top-0 z-10">
        {/* ✅ Left side: Username */}
        <h1 className="text-xl font-bold text-indigo-400">
          Welcome, {user.username || user.user?.username || user.name || 'User'}
        </h1>

        {/* ✅ Middle: Show Admin badge if role is admin */}
        {user.role === 'admin' && (
          <span className="mr-20 text-sm font-semibold bg-yellow-500 text-black px-3 py-1 rounded-lg shadow-md">
            Admin
          </span>
        )}

        {/* ✅ Right side: Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md disabled:opacity-50 flex items-center justify-center"
        >
          {isLoggingOut ? 'Logging Out...' : 'Logout'}
        </button>
      </header>

      {/* ✅ This is where TodoPage (child) will render */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Authenticated;
