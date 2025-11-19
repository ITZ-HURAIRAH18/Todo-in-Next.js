"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Todo = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type TodoDisplayProps = {
  todos: Todo[];
};

export default function TodoDisplay({ todos }: TodoDisplayProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const refreshTodos = async () => {
    // Refresh the server component to fetch fresh data
    router.refresh();
  };

  const toggleComplete = async (todoId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle todo");
      }

      refreshTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
      alert("Failed to update todo. Please try again.");
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditCategory(todo.category || "");
  };

  const saveEdit = async (todoId: string) => {
    if (!editTitle.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      setEditingId(null);
      refreshTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
  };

  const deleteTodo = async (todoId: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) {
      return;
    }

    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }

      refreshTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo. Please try again.");
    }
  };

  if (todos.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No todos found. Add your first todo above!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div key={todo.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          {editingId === todo.id ? (
            /* Edit Mode - Compact */
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border p-2 rounded text-sm font-medium"
                placeholder="Todo Title"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-2 rounded text-sm"
                  placeholder="Description"
                  rows={2}
                />
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="border p-2 rounded text-sm"
                  placeholder="Category"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Display Mode - Compact */
            <div>
              {/* Main Info Row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-semibold truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${todo.completed ? 'line-through' : ''}`}>
                      {todo.description}
                    </p>
                  )}
                </div>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  todo.completed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {todo.completed ? '✓ Done' : '⏳ Pending'}
                </span>
              </div>

              {/* Secondary Info Row */}
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <div className="flex gap-4">
                  {todo.category && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      📂 {todo.category}
                    </span>
                  )}
                  <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(todo.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex gap-1 pt-2 border-t">
                <button
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                  className={`px-3 py-1 rounded text-xs text-white font-medium ${
                    todo.completed 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {todo.completed ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => startEdit(todo)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}