"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TodoForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to add todo:", errorText);
        alert("Failed to add todo. Please try again.");
        return;
      }

      setTitle("");
      setDescription("");
      router.refresh(); // 🔥 refresh server data
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">📝 Add Todo</h2>

      <form
        onSubmit={addTodo}
        className="grid grid-cols-1 gap-4 bg-white shadow-lg p-6 rounded-xl"
      >
        <input
          className="border p-3 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo Title"
        />

        <textarea
          className="border p-3 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
