"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { userApi } from "@/lib/users";
import { User } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("Loading users...");
      const response = await userApi.getUsers(currentPage, pageSize);
      console.log("Users response:", response);
      console.log("Users count:", response.content?.length);
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      console.error("Error details:", error.response?.data);
      setUsers([]);
      if (error.response?.status === 403) {
        alert("Access denied. Admin privileges required.");
      } else if (error.response?.status === 500) {
        alert("Backend error loading users. Check backend logs.");
      } else {
        alert("Failed to load users: " + (error.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userApi.deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-black">
                  👥 User Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage system users and permissions
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create User
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
              <p className="mt-6 text-green-800 font-semibold text-lg">
                Loading users...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border-t-4 border-green-500">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-green-600 to-emerald-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users && users.length > 0 ? (
                        users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-green-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-bold text-gray-900">
                                    {user.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                  user.role === "ADMIN"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.role === "ADMIN"}
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-3">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="text-green-600 hover:text-green-800 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-800 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="text-6xl mb-4"></div>
                            <p className="text-gray-600 text-lg font-medium">
                              No users found
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-3">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-6 py-3 bg-white border-2 border-green-500 text-green-700 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
                  >
                    ← Previous
                  </button>
                  <span className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl shadow-md">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-6 py-3 bg-white border-2 border-green-500 text-green-700 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Create/Edit Modal */}
          {(showCreateModal || editingUser) && (
            <UserModal
              user={editingUser}
              onClose={() => {
                setShowCreateModal(false);
                setEditingUser(null);
              }}
              onSave={() => {
                setShowCreateModal(false);
                setEditingUser(null);
                loadUsers();
              }}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">(user?.role || "USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (user) {
        await userApi.updateUser(user.id, { username, email, role });
      } else {
        await userApi.createUser({ username, email, password, role } as any);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-t-4 border-green-500 animate-fadeIn">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">{user ? "✏️" : "➕"}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {user ? "Edit User" : "Create User"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-bold text-red-800">{error}</h3>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
              👤 Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
              Role *
            </label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
              className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all cursor-pointer"
              style={{ color: "black" }}
            >
              <option value="USER" style={{ color: "black" }}>
                User
              </option>
              <option value="ADMIN" style={{ color: "black" }}>
                Admin
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
