"use client";

import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

function TodoList({ initialTodos }) {
  const [todos, setTodos] = useState(initialTodos);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const fetchTodos = async () => {
    const res = await fetch(`/api/todo?search=${search}`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    await fetch("/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, [search]);

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search todos..."
        className="border p-2 mb-4 w-full rounded"
      />

      {/* Add Todo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button onClick={addTodo} className="bg-blue-600 text-white p-2 rounded">
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;
