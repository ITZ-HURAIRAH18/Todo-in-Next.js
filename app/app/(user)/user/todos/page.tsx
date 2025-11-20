// app/(user)/todos/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TodoForm from "@/components/TodoForm";
import TodoDisplay from "@/components/TodoDisplay";
import SharedTodoDisplay from "@/components/SharedTodoDisplay";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";

export default async function TodosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <p>Please login</p>;

  // 🔥 Fetch user's own todos
  const ownTodos = await prisma.todo.findMany({
    where: { userId: session.user.id, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  // 🔥 Fetch shared todos (if SharedTodo model exists)
  let sharedTodos: any[] = [];
  try {
    const sharedTodoRecords = await prisma.sharedTodo.findMany({
      where: { userId: session.user.id },
      include: {
        todo: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { sharedAt: "desc" },
    });
    
    sharedTodos = sharedTodoRecords
      .filter(record => !record.todo.deleted)
      .map(record => ({
        ...record.todo,
        sharedBy: record.todo.user,
        canEdit: record.canEdit,
        isShared: true,
      }));
  } catch (error) {
    console.log("SharedTodo model not available yet");
  }

  return (
    <>
      <Navbar user={session.user} />
      <div className="bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-muted/20 min-h-screen">
        <div className="max-w-5xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">📋 Manage Todos</h1>
            <p className="text-muted-foreground">Create, edit, and organize your tasks</p>
          </div>
          
          {/* Create New Todo */}
          <div className="bg-card border rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">➕ Create New Todo</h2>
            <TodoForm />
          </div>

          {/* My Todos Section */}
          <div className="bg-card border rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">🎯 My Todos ({ownTodos.length})</h3>
            </div>
            <TodoDisplay todos={ownTodos} />
          </div>

          {/* Shared with Me Section */}
          {sharedTodos.length > 0 && (
            <div className="bg-card border rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">🔗 Shared with Me ({sharedTodos.length})</h3>
              </div>
              <SharedTodoDisplay todos={sharedTodos} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
