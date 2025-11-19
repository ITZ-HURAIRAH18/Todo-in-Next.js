// app/(user)/todos/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TodoForm from "@/components/TodoForm";
import TodoDisplay from "@/components/TodoDisplay";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";

export default async function TodosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <p>Please login</p>;

  // 🔥 Fetch Todos directly from database
  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar user={session.user} />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Todos</h1>
            <p className="text-gray-600">Create, edit, and organize your tasks</p>
          </div>
          
          <TodoForm />

          <h3 className="text-xl font-semibold mt-8 mb-4">📋 Your Todo List ({todos.length})</h3>

          <TodoDisplay todos={todos} />
        </div>
      </div>
    </>
  );
}
