// app/(user)/todos/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TodoForm from "@/components/TodoForm";
import TodoDisplay from "@/components/TodoDisplay";
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
    <div className="max-w-3xl mx-auto p-6">
      <TodoForm />

      <h3 className="text-xl font-semibold mt-8 mb-4">📋 Todo Records</h3>

      <TodoDisplay todos={todos} />
    </div>
  );
}
