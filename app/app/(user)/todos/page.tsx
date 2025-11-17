// app/(user)/todos/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import TodoList from "@/components/TodoList";

export default async function TodosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <p>Please login to view todos</p>;

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return <TodoList initialTodos={todos} />;
}
