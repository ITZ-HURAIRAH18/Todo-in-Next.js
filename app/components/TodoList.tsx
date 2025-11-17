// components/TodoList.tsx
"use client";

import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;  
}

interface Props {
  initialTodos: Todo[];
}

function TodoList({ initialTodos }: Props) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const fetchTodos = async () => {
    const res = await fetch(`/api/todo?search=${search}`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!title) return;
    await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    });
    setTitle("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, [search]);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded">
          Add
        </button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;