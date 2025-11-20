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
              <div className="space-y-4">
                {sharedTodos.map((todo) => (
                  <div key={todo.id} className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-pulse" style={{animationDuration: '4s'}}>
                    <div className="bg-background rounded-lg h-full">
                      <div className="bg-card rounded-lg border p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Todo Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`text-xl font-semibold ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {todo.title}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                todo.completed
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                              }`}>
                                {todo.completed ? "✓ Completed" : "○ Pending"}
                              </span>
                            </div>
                            {todo.description && (
                              <p className={`text-sm text-muted-foreground mt-1 ${todo.completed ? 'line-through' : ''}`}>
                                {todo.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              {todo.category && (
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                  📂 {todo.category}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                👤 Shared by: <span className="font-medium text-foreground">{todo.sharedBy?.name || todo.sharedBy?.email}</span>
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {todo.canEdit ? "✏️ Can Edit" : "👁️ View Only"}
                              </span>
                            </div>
                          </div>

                          {/* Date Info */}
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(todo.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Updated: {new Date(todo.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
