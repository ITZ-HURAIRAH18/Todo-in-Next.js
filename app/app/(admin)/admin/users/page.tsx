import prisma from "@/lib/prisma";
import DeleteUserButton from "@/components/DeleteUserButton";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { 
      todos: {
        select: {
          id: true,
          completed: true
        }
      }
    },
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">👥 User Management</h1>
            <p className="text-muted-foreground">Manage all registered users and their activities</p>
          </div>
          <Link href="/admin/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-pulse" style={{animationDuration: '3s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{users.length}</p>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <span className="text-3xl">👥</span>
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
                    <p className="text-sm font-medium text-muted-foreground">Total Todos</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {users.reduce((acc, u) => acc + u.todos.length, 0)}
                    </p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <span className="text-3xl">📋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.4s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Todos/User</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {users.length > 0 ? Math.round(users.reduce((acc, u) => acc + u.todos.length, 0) / users.length) : 0}
                    </p>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-full">
                    <span className="text-3xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Users</h2>
          
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((u) => {
                const completedTodos = u.todos.filter(t => t.completed).length;
                const totalTodos = u.todos.length;
                const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

                return (
                  <div key={u.id} className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" style={{animationDuration: '4s'}}>
                    <div className="bg-background rounded-lg h-full">
                      <div className="bg-card rounded-lg border p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* User Info */}
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <span className="text-2xl">👤</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {u.name || "No Name"}
                              </h3>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Joined: {new Date(u.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground">{totalTodos}</p>
                              <p className="text-xs text-muted-foreground">Total Todos</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTodos}</p>
                              <p className="text-xs text-muted-foreground">Completed</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{completionRate}%</p>
                              <p className="text-xs text-muted-foreground">Rate</p>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div>
                            <DeleteUserButton userId={u.id} userName={u.name || u.email} />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {totalTodos > 0 && (
                          <div className="mt-4">
                            <div className="w-full bg-secondary/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl">👥</span>
              <p className="text-muted-foreground mt-4">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
