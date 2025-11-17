// components/TodoItem.tsx
"use client";

import { useState } from "react";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const [completed, setCompleted] = useState(todo.completed);

  const toggleComplete = async () => {
    // Call API to update completed
    await fetch(`/api/todo/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: !completed }),
      headers: { "Content-Type": "application/json" },
    });
    setCompleted(!completed);
  };

  return (
    <div className="p-4 border rounded flex justify-between items-center">
      <div>
        <h3 className={completed ? "line-through" : ""}>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={toggleComplete}
          className={`p-2 rounded ${completed ? "bg-green-500" : "bg-gray-300"}`}
        >
          {completed ? "Done" : "Mark"}
        </button>
        {/* Add Edit/Delete buttons here */}
      </div>
    </div>
  );
}
