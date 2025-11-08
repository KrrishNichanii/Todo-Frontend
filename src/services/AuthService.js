import axiosInstance from '../helpers/axiosInstance';


const loginUser = async (email, password) => {
    const payload = { email, password };
    const response = await axiosInstance.post('/users/login', payload);
    
    return response.data;
};


const registerUser = async (username, email, password) => {
    const payload = { username, email, password };
    const response = await axiosInstance.post('/users/register', payload);
    return response.data;
};


const logoutUser = async () => {
    const response = await axiosInstance.post('/users/logout');
    return response.data;
};

const getAllUsers = async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/users/users?page=${page}&limit=${limit}`);
    return response.data;
};

const changeUserRole = async (userId, newRole) => {
  const payload = { role: newRole };
  console.log("Change Role Payload:", payload);
  
  const response = await axiosInstance.patch(`/users/promote/${userId}`, payload);
  return response.data;
};

const toggleUserActiveStatus = async (userId) => {
  const response = await axiosInstance.patch(`/users/toggle-active/${userId}`);
  return response.data;
};

export { loginUser, registerUser, logoutUser , getAllUsers , changeUserRole, toggleUserActiveStatus };