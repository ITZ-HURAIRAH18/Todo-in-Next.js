"use client";

import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

type Todo = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch("/api/todo");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>
      {loading && <p>Loading...</p>}
      {!loading && todos.length === 0 && <p>No todos found</p>}

      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
      ))}
    </div>
  );
}
