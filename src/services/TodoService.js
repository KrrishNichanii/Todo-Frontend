import axiosInstance from '../helpers/axiosInstance';

const TODOS_STORAGE_KEY = 'todos_list';

const getTodosFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(TODOS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error parsing todos from localStorage:", error);
    return [];
  }
};

const setTodosToLocalStorage = (todos) => {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos.data || todos));
  } catch (error) {
    console.error("Error storing todos in localStorage:", error);
  }
};

const getAllTodos = async () => {
  try {
    const response = await axiosInstance.get('/todos');
    const fetchedTodos = response.data;

    setTodosToLocalStorage(fetchedTodos);
    return fetchedTodos;
  } catch (error) {
    console.warn("API fetch failed. Returning cached data as fallback.", error);
    return getTodosFromLocalStorage();
  }
};

const createTodo = async (title, description, status = 'pending') => {
  try {
    const payload = {
      title,
      description,
      status: status || 'pending',
    };
    console.log("Created Todo Payload:", payload);
    
    const response = await axiosInstance.post('/todos', payload);

    const newTodo = response.data.todo || response.data;

    // ✅ Update localStorage cache
    const currentTodos = getTodosFromLocalStorage();
    console.log("Current Todos from LS:", currentTodos);
    
    const updatedTodos = [newTodo, ...currentTodos];
    setTodosToLocalStorage(updatedTodos);

    return newTodo;
  } catch (error) {
    console.error("Error creating todo:", error.response?.data || error.message);
    throw error;
  }
};

const deleteTodo = async (todoId) => {
  const response = await axiosInstance.delete(`/todos/${todoId}`);
  const deletedTodo = response.data;
  const uniqueId = deletedTodo.id || deletedTodo._id;

  const currentTodos = getTodosFromLocalStorage();
  const updatedTodos = currentTodos.filter(
    (todo) => (todo.id || todo._id) !== uniqueId
  );
  setTodosToLocalStorage(updatedTodos);

  return deletedTodo;
};

const updateTodo = async (todoId, title, description, status) => {
  const payload = { title, description, status };
  console.log("TodoID " , todoId);
  
  const response = await axiosInstance.patch(`/todos/${todoId}`, payload);
  const updatedTodo = response.data;
  const uniqueId = updatedTodo.id || updatedTodo._id;

  const currentTodos = getTodosFromLocalStorage();
  const updatedTodos = currentTodos.map((todo) =>
    (todo.id || todo._id) === uniqueId ? updatedTodo : todo
  );
  setTodosToLocalStorage(updatedTodos);

  return updatedTodo;
};

export { getAllTodos, createTodo, updateTodo, deleteTodo };
