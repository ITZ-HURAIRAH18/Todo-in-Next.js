"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TodoForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

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
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to add todo:", errorText);
        alert("Failed to add todo. Please try again.");
        return;
      }

      setTitle("");
      setDescription("");
      setCategory("");
      router.refresh(); // 🔥 refresh server data
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold text-foreground mb-3 text-center">📝 Add Todo</h2>

      <form
        onSubmit={addTodo}
        className="bg-card border shadow-lg p-4 rounded-xl space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="bg-background border border-input p-2 rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Todo Title"
          />

          <input
            className="bg-background border border-input p-2 rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
          />

          <button
            type="submit"
            className="bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Add Todo
          </button>
        </div>

        <textarea
          className="bg-background border border-input p-2 rounded-lg w-full text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
        />
      </form>
    </div>
  );
}
