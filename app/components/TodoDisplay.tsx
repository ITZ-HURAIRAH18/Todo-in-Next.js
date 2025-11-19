"use client";

import { useRouter } from "next/navigation";
import TodoItem from "./TodoItem";

type Todo = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
};

type TodoDisplayProps = {
  todos: Todo[];
};

export default function TodoDisplay({ todos }: TodoDisplayProps) {
  const router = useRouter();

  const refreshTodos = async () => {
    // Refresh the server component to fetch fresh data
    router.refresh();
  };

  if (todos.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No todos found. Add your first todo above!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={refreshTodos} />
      ))}
    </div>
  );
}