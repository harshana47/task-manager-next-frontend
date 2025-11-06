"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { taskApi } from "@/lib/tasks";
import { Task, TaskFilters, TaskStatus, TaskPriority } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<TaskFilters>({
    page: 0,
    size: 10,
    sort: "dueDate,asc",
  });
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks(filters);
      setTasks(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error: any) {
      console.error("Failed to load tasks:", error);

      // Handle 403 specifically
      if (error.response?.status === 403) {
        alert(
          "Access denied. Please make sure you are logged in with valid credentials."
        );
      } else if (error.response?.status === 401) {
        // This should be handled by interceptor, but just in case
        alert("Session expired. Please login again.");
      } else {
        alert(
          "Failed to load tasks. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await taskApi.deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task");
      }
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DONE":
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
                  Tasks
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and track your tasks efficiently
                </p>
              </div>
              <Link
                href="/tasks/new"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Task
              </Link>
            </div>

            {/* Filters */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-t-4 border-green-500 mb-8">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter Tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        status: (e.target.value as TaskStatus) || undefined,
                        page: 0,
                      })
                    }
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="" style={{ color: "black" }}>
                      All Statuses
                    </option>
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
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
                    Priority
                  </label>
                  <select
                    value={filters.priority || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priority: (e.target.value as TaskPriority) || undefined,
                        page: 0,
                      })
                    }
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="" style={{ color: "black" }}>
                      All Priorities
                    </option>
                    <option value="LOW" style={{ color: "black" }}>
                      🟢 Low
                    </option>
                    <option value="MEDIUM" style={{ color: "black" }}>
                      🟡 Medium
                    </option>
                    <option value="HIGH" style={{ color: "black" }}>
                      🔴 High
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
                    Sort By
                  </label>
                  <select
                    value={filters.sort || "dueDate,asc"}
                    onChange={(e) =>
                      setFilters({ ...filters, sort: e.target.value, page: 0 })
                    }
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="dueDate,asc" style={{ color: "black" }}>
                      Due Date (Soon first)
                    </option>
                    <option value="dueDate,desc" style={{ color: "black" }}>
                      Due Date (Later first)
                    </option>
                    <option value="priority,desc" style={{ color: "black" }}>
                      Priority (High to Low)
                    </option>
                    <option value="title,asc" style={{ color: "black" }}>
                      Title (A-Z)
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-green-800 uppercase tracking-wide">
                    Per Page
                  </label>
                  <select
                    value={filters.size || 10}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        size: parseInt(e.target.value),
                        page: 0,
                      })
                    }
                    className="w-full px-4 py-3 text-black font-medium bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all cursor-pointer"
                    style={{ color: "black" }}
                  >
                    <option value="5" style={{ color: "black" }}>
                      5 tasks
                    </option>
                    <option value="10" style={{ color: "black" }}>
                      10 tasks
                    </option>
                    <option value="20" style={{ color: "black" }}>
                      20 tasks
                    </option>
                    <option value="50" style={{ color: "black" }}>
                      50 tasks
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
              <p className="mt-6 text-green-800 font-semibold text-lg">
                Loading tasks...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg font-medium">
                No tasks found
              </p>
              <p className="text-gray-500 mt-2">
                Create a new task to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-l-4 border-green-500"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {task.title}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority === "HIGH" && "🔴"}
                          {task.priority === "MEDIUM" && "🟡"}
                          {task.priority === "LOW" && "🟢"}
                          {task.priority}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(task.status)}`}
                        >
                          {task.status === "TODO"}
                          {task.status === "IN_PROGRESS"}
                          {task.status === "DONE"}
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                        <span className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                          {" "}
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {task.assignedUser && (
                          <span className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                            👤 {task.assignedUser.username}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="flex-1 lg:flex-none px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/tasks/${task.id}/edit`)}
                        className="flex-1 lg:flex-none px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="flex-1 lg:flex-none px-4 py-2 text-sm font-bold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                onClick={() =>
                  setFilters({ ...filters, page: currentPage - 1 })
                }
                disabled={currentPage === 0}
                className="px-6 py-3 bg-white border-2 border-green-500 text-green-700 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
              >
                ← Previous
              </button>
              <span className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl shadow-md">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setFilters({ ...filters, page: currentPage + 1 })
                }
                disabled={currentPage >= totalPages - 1}
                className="px-6 py-3 bg-white border-2 border-green-500 text-green-700 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
