"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { taskApi } from "@/lib/tasks";
import { Task, TaskPriority, TaskStatus } from "@/types";

export default function TaskDetailPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getTask(taskId);
      setTask(data);
    } catch (error) {
      console.error("Failed to load task:", error);
      alert("Failed to load task");
      router.push("/tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await taskApi.deleteTask(taskId);
        router.push("/tasks");
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
            <p className="mt-6 text-green-800 font-semibold text-lg">
              Loading task...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-green-700 font-semibold rounded-lg hover:bg-white hover:text-green-800 transition-all shadow-sm hover:shadow-md"
            >
              <span className="text-xl">←</span> Back to Tasks
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 border-t-4 border-green-500">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {task.title}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority === "HIGH" && "🔴"}
                    {task.priority === "MEDIUM" && "🟡"}
                    {task.priority === "LOW" && "🟢"}
                    {task.priority}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(task.status)}`}
                  >
                    {task.status === "TODO"}
                    {task.status === "IN_PROGRESS"}
                    {task.status === "DONE"}
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Link
                  href={`/tasks/${task.id}/edit`}
                  className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <h2 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                  Description
                </h2>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
                  {task.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                    Due Date
                  </h3>
                  <p className="text-gray-900 font-bold text-lg">
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {task.assignedUser && (
                  <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                      👤 Assigned To
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {task.assignedUser.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-lg">
                          {task.assignedUser.username}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {task.assignedUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                  Task ID
                </h3>
                <p className="text-gray-900 font-mono font-bold text-xl">
                  #{task.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
