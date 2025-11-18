"use client";

import { useState } from "react";

type Todo = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
};

type TodoItemProps = {
  todo: Todo;
  onUpdate: () => Promise<void>;
};

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [completed, setCompleted] = useState(todo.completed);
  // For editing
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || "");

  // Toggle completed
  const toggleComplete = async () => {
    const res = await fetch(`/api/todo/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ completed: !completed }),
    });

    if (!res.ok) {
      console.error("Failed to toggle todo", await res.text());
      return;
    }

    setCompleted(!completed);
    await onUpdate();
  };

  // Delete Todo
  const deleteTodo = async () => {
    const res = await fetch(`/api/todo/${todo.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to delete todo", await res.text());
      return;
    }

    await onUpdate();
  };

  // Save Edits
  const saveEdit = async () => {
    if (!editTitle.trim()) return alert("Title cannot be empty");

    const res = await fetch(`/api/todo/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: editTitle,
        description: editDesc,
      }),
    });

    if (!res.ok) {
      console.error("Failed to save todo", await res.text());
      return;
    }

    setIsEditing(false);
    await onUpdate();
  };

  return (
    <>
      {/* Todo Item Display */}
      <div className="p-4 border rounded flex justify-between items-center">
        <div>
          <h3 className={completed ? "line-through text-gray-400" : ""}>
            {todo.title}
          </h3>
          {todo.description && <p className="text-gray-600">{todo.description}</p>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleComplete}
            className={`p-2 rounded ${
              completed ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
          >
            {completed ? "Done" : "Mark"}
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-yellow-500 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={deleteTodo}
            className="p-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-96 rounded shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Edit Todo</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Title"
            />

            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Description"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="p-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
