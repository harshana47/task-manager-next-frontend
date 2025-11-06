"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { taskApi } from "@/lib/tasks";
import { Task, TaskPriority, TaskStatus, User } from "@/types";
import api from "@/lib/api";

export default function EditTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);

  useEffect(() => {
    loadTask();
    loadUsers();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const task = await taskApi.getTask(taskId);
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate.split("T")[0]);
      setAssignedUserId(task.assignedUser?.id?.toString() || "");
    } catch (error) {
      console.error("Failed to load task:", error);
      alert("Failed to load task");
      router.push("/tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>("/users?size=100");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const taskData = {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedUser: assignedUserId
          ? users.find((u) => u.id === parseInt(assignedUserId))
          : undefined,
      };

      await taskApi.updateTask(taskId, taskData as any);
      router.push(`/tasks/${taskId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
            <p className="mt-4 text-green-800 font-semibold text-lg">
              Loading task...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href={`/tasks/${taskId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-green-700 font-semibold rounded-lg hover:bg-white hover:text-green-800 transition-all shadow-sm hover:shadow-md"
            >
              <span className="text-xl">←</span> Back to Task
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Edit Task</h1>
                <p className="text-gray-600 mt-1">Update task details</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-green-800 uppercase tracking-wide"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
                  placeholder="Enter task title"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-green-800 uppercase tracking-wide"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all resize-none"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="priority"
                    className="block text-sm font-bold text-green-800 uppercase tracking-wide"
                  >
                    Priority *
                  </label>
                  <select
                    id="priority"
                    required
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as TaskPriority)
                    }
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="LOW" style={{ color: "black" }}>
                      🟢 Low Priority
                    </option>
                    <option value="MEDIUM" style={{ color: "black" }}>
                      🟡 Medium Priority
                    </option>
                    <option value="HIGH" style={{ color: "black" }}>
                      🔴 High Priority
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-bold text-green-800 uppercase tracking-wide"
                  >
                    Status *
                  </label>
                  <select
                    id="status"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="TODO" style={{ color: "black" }}>
                      To Do
                    </option>
                    <option value="IN_PROGRESS" style={{ color: "black" }}>
                      In Progress
                    </option>
                    <option value="DONE" style={{ color: "black" }}>
                      Done
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-bold text-green-800 uppercase tracking-wide"
                  >
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
                    style={{ colorScheme: "light" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="assignedUser"
                    className="block text-sm font-bold text-green-800 uppercase tracking-wide"
                  >
                    Assign To
                  </label>
                  <select
                    id="assignedUser"
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="" style={{ color: "black" }}>
                      Unassigned
                    </option>
                    {users &&
                      users.length > 0 &&
                      users.map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                          style={{ color: "black" }}
                        >
                          {user.username} ({user.email})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <Link
                  href={`/tasks/${taskId}`}
                  className="px-8 py-4 bg-gray-200 text-gray-800 font-bold text-lg rounded-xl hover:bg-gray-300 transition-all text-center shadow-md hover:shadow-lg"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
