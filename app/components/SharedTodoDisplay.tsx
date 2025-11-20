"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SharedTodo = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
  sharedBy?: {
    name: string | null;
    email: string;
  };
  canEdit: boolean;
  isShared: boolean;
};

type SharedTodoDisplayProps = {
  todos: SharedTodo[];
};

export default function SharedTodoDisplay({ todos }: SharedTodoDisplayProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const refreshTodos = () => {
    router.refresh();
  };

  const toggleComplete = async (todoId: string, currentStatus: boolean, canEdit: boolean) => {
    if (!canEdit) {
      alert("You don't have permission to edit this todo");
      return;
    }

    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to toggle todo");
      }

      refreshTodos();
    } catch (error: any) {
      console.error("Error toggling todo:", error);
      alert(error.message || "Failed to update todo. Please try again.");
    }
  };

  const startEdit = (todo: SharedTodo) => {
    if (!todo.canEdit) {
      alert("You only have view permission for this todo");
      return;
    }
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
        const text = await res.text();
        throw new Error(text || "Failed to update todo");
      }

      setEditingId(null);
      refreshTodos();
    } catch (error: any) {
      console.error("Error updating todo:", error);
      alert(error.message || "Failed to update todo. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">🔗</span>
        <p className="text-muted-foreground mt-4">No shared todos yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div key={todo.id} className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-pulse" style={{animationDuration: '4s'}}>
          <div className="bg-background rounded-lg h-full">
            <div className="bg-card rounded-lg border p-6">
              {editingId === todo.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-background border border-input p-2 rounded text-sm font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    placeholder="Todo Title"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="bg-background border border-input p-2 rounded text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                      placeholder="Description"
                      rows={2}
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="bg-background border border-input p-2 rounded text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                      placeholder="Category"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-xl font-semibold ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {todo.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          todo.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                        }`}>
                          {todo.completed ? "✓ Completed" : "○ Pending"}
                        </span>
                      </div>
                      {todo.description && (
                        <p className={`text-sm text-muted-foreground mt-1 ${todo.completed ? 'line-through' : ''}`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {todo.category && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            📂 {todo.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          👤 Shared by: <span className="font-medium text-foreground">{todo.sharedBy?.name || todo.sharedBy?.email}</span>
                        </span>
                        <span className={`text-xs font-medium ${
                          todo.canEdit 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-muted-foreground"
                        }`}>
                          {todo.canEdit ? "✏️ Can Edit" : "👁️ View Only"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(todo.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {todo.canEdit && (
                    <div className="flex gap-1 pt-3 border-t border-border">
                      <button
                        onClick={() => toggleComplete(todo.id, todo.completed, todo.canEdit)}
                        className={`px-3 py-1 rounded text-xs text-white font-medium transition-colors ${
                          todo.completed 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {todo.completed ? 'Undo' : 'Done'}
                      </button>
                      <button
                        onClick={() => startEdit(todo)}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
