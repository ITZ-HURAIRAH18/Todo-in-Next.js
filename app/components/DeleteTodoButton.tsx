"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTodoButton({ todoId, todoTitle }: { todoId: string; todoTitle: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete todo "${todoTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/todo/${todoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete todo");
      }
    } catch (error) {
      alert("Failed to delete todo");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
    >
      {isDeleting ? "Deleting..." : "🗑️ Delete"}
    </button>
  );
}
