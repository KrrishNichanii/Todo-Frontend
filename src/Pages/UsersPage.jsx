import React, { useEffect, useState } from "react";
import { 
  getAllUsers, 
  changeUserRole, 
  toggleUserActiveStatus 
} from "../services/AuthService";
import { toast } from "react-hot-toast";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed.user || parsed);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        const userList = response.data.users;
        setUsers(userList);
        toast.success("Users loaded successfully!");
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(
          error.response?.data?.message || "Failed to load users"
        );
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await changeUserRole(userId, newRole);

      // Update state instantly
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success(res.message || `User role changed to ${newRole}`);
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error(
        error.response?.data?.message || "Failed to change user role"
      );
    }
  };

  const handleActivityChange = async (userId) => {
    try {
      const res = await toggleUserActiveStatus(userId);

      // Update UI instantly
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );

      toast.success(res.message || "User activity status updated!");
    } catch (error) {
      console.error("Error toggling activity:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user activity status"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">
        Manage Users
      </h1>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-800 text-indigo-300">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Role</th>
                {currentUser?.role === "admin" && (
                  <th className="p-3 text-center">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{user.username}</td>
                  <td className="p-3 text-gray-400">{user.email}</td>

                  {/* ✅ Status */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isActive
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ✅ Role */}
                  <td className="p-3 text-center capitalize">{user.role}</td>

                  {/* ✅ Admin Controls */}
                  {currentUser?.role === "admin" && (
                    <td className="p-3 flex justify-center items-center gap-4">
                      {/* Change Role Dropdown */}
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>

                      {/* Toggle Active/Inactive */}
                      <button
                        onClick={() => handleActivityChange(user._id)}
                        className={`px-3 py-1 rounded-lg font-semibold transition ${
                          user.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-6">No users found.</p>
      )}
    </div>
  );
}

export default UsersPage;
