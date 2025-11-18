"use client";

import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import Loading from "../app/loading";
import { useRouter } from "next/navigation";
type Todo = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
};

type TodoListProps = {
  initialTodos?: Todo[];
};

export default function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [loading, setLoading] = useState(!initialTodos.length);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
const router = useRouter();

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/todo", { credentials: "include", cache: "no-store" });
      if (!res.ok) {
        setTodos([]);
        return;
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

const addTodo = async () => {
  if (!newTitle.trim()) return alert("Title is required");

  const res = await fetch("/api/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title: newTitle, description: newDesc }),
  });

  if (!res.ok) {
    console.error("Failed to add todo", await res.text());
    return;
  }

  setNewTitle("");
  setNewDesc("");

  // ❌ Instead of router.refresh(), call fetchTodos
  await fetchTodos();
};


  useEffect(() => {
    if (!initialTodos.length) fetchTodos();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>

      {/* Add new todo */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="New todo title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description (optional)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white rounded p-2"
        >
          Add Todo
        </button>
      </div>

      {todos.length === 0 && <p>No todos found</p>}

      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
      ))}
    </div>
  );
}
