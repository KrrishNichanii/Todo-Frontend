import React, { useEffect, useState } from 'react';
import TodoItem from '../Components/TodoItem';
import { getAllTodos, createTodo, deleteTodo, updateTodo } from '../services/TodoService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed.user || parsed);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ✅ Fetch Todos on Mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getAllTodos();
        const todoList = fetchedTodos.data || fetchedTodos;
        setTodos(todoList);
        console.log('Fetched Todos:', todoList);
        toast.success('Tasks loaded successfully!');
      } catch (error) {
        console.error('Error fetching todos:', error);
        toast.error('Failed to load tasks');
      }
    };

    fetchTodos();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Add Todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const createdTodo = await createTodo(
        newTodo.title,
        newTodo.description,
        newTodo.status
      );

      setTodos((prev) => [createdTodo.data || createdTodo, ...prev]);
      toast.success('Todo added successfully!');
      setShowForm(false);
      setNewTodo({ title: '', description: '', status: 'pending' });
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to add todo');
    }
  };

  // ✅ Handle Delete Todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      toast.success('Todo deleted successfully!');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  // ✅ Handle Update Todo
  const handleUpdate = async (id, newFields) => {
    try {
      const updatedTodo = await updateTodo(
        id,
        newFields.title,
        newFields.description,
        newFields.status
      );

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, ...updatedTodo.data || updatedTodo } : todo
        )
      );

      toast.success(`Todo "${newFields.title}" updated successfully!`);
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start gap-y-6 pt-10 px-6 bg-gray-900 min-h-screen">
      <h1 className="text-amber-50 text-5xl font-bold mb-4">Todos</h1>

      {/* ➕ Add Todo Button + 👑 Admin Manage Users Button */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
        >
          + Add Todo
        </button>

        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/auth/users')}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
          >
            👥 Manage Users
          </button>
        )}
      </div>

      {/* ✅ Todo List */}
      {Array.isArray(todos) && todos.length > 0 ? (
        todos.map((todo, index) => (
          <TodoItem
            key={todo._id || index}
            todo={todo}
            onUpdate={handleUpdate}
            onDelete={() => handleDelete(todo._id)}
          />
        ))
      ) : (
        <p className="text-gray-400 mt-6">No tasks found.</p>
      )}

      {/* ✅ Modal for Adding Todo */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] flex justify-center items-center transition-all duration-300"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <form
            onSubmit={handleAddTodo}
            className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 flex flex-col gap-4 transform transition-all duration-300 scale-100 animate-modalIn"
          >
            <h2 className="text-2xl font-bold text-center text-indigo-400">
              Add New Todo
            </h2>

            <input
              type="text"
              name="title"
              value={newTodo.title}
              onChange={handleChange}
              placeholder="Title"
              className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <textarea
              name="description"
              value={newTodo.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-modalIn {
          animation: modalIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

export default TodoPage;
