import prisma from "@/lib/prisma";
import DeleteTodoButton from "@/components/DeleteTodoButton";
import Link from "next/link";

export default async function AdminTodosPage() {
  const todos = await prisma.todo.findMany({
    where: { deleted: false },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">📋 Todo Management</h1>
            <p className="text-muted-foreground">Review and manage all todos in the system</p>
          </div>
          <Link href="/admin/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-pulse" style={{animationDuration: '3s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Todos</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{todos.length}</p>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <span className="text-3xl">📋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-green-500 via-green-600 to-green-500 animate-pulse" style={{animationDuration: '3.2s', animationDelay: '0.2s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{completedCount}</p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.4s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{pendingCount}</p>
                  </div>
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <span className="text-3xl">⏳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 animate-pulse" style={{animationDuration: '2.8s', animationDelay: '0.6s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rate</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{completionRate}%</p>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-full">
                    <span className="text-3xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Todos List */}
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Todos</h2>
          
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">📋</span>
              <p className="text-muted-foreground mt-4">No todos found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <div key={todo.id} className={`relative overflow-hidden rounded-xl p-1 ${
                  todo.completed 
                    ? "bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 animate-pulse" 
                    : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-pulse"
                }`} style={{animationDuration: '4s'}}>
                  <div className="bg-background rounded-lg h-full">
                    <div className="bg-card rounded-lg border p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Todo Info */}
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-full ${
                            todo.completed 
                              ? "bg-green-500/10" 
                              : "bg-orange-500/10"
                          }`}>
                            <span className="text-2xl">{todo.completed ? "✅" : "⏳"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-foreground break-words">
                              {todo.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 break-words">
                              {todo.description || "No description"}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                todo.completed
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                              }`}>
                                {todo.completed ? "✓ Completed" : "○ Pending"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Category: <span className="font-medium text-foreground">{todo.category || "None"}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* User & Actions */}
                        <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                          <div className="flex-1 lg:flex-none text-left lg:text-right">
                            <p className="text-sm text-muted-foreground">Created by</p>
                            <p className="text-sm font-medium text-foreground">
                              {todo.user?.name || todo.user?.email || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <DeleteTodoButton todoId={todo.id} todoTitle={todo.title} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
