import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count({
    where: { role: "USER" }
  });
  const totalTodos = await prisma.todo.count();
  const completedTodos = await prisma.todo.count({
    where: { completed: true }
  });
  const pendingTodos = totalTodos - completedTodos;

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: { todos: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your app.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users Card */}
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-pulse" style={{animationDuration: '3s'}}>
            <div className="bg-background rounded-lg h-full">
              <Link href="/admin/users" className="block bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{totalUsers}</p>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <span className="text-3xl">👥</span>
                  </div>
                </div>
                <p className="text-xs text-primary mt-3">View all users →</p>
              </Link>
            </div>
          </div>

          {/* Total Todos Card */}
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.2s'}}>
            <div className="bg-background rounded-lg h-full">
              <Link href="/admin/todos" className="block bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Todos</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{totalTodos}</p>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-full">
                    <span className="text-3xl">📋</span>
                  </div>
                </div>
                <p className="text-xs text-primary mt-3">View all todos →</p>
              </Link>
            </div>
          </div>

          {/* Completed Todos Card */}
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-green-500 via-green-600 to-green-500 animate-pulse" style={{animationDuration: '3.2s', animationDelay: '0.4s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{completedTodos}</p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                  {totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}% completion rate
                </p>
              </div>
            </div>
          </div>

          {/* Pending Todos Card */}
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 animate-pulse" style={{animationDuration: '2.8s', animationDelay: '0.6s'}}>
            <div className="bg-background rounded-lg h-full">
              <div className="bg-card rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{pendingTodos}</p>
                  </div>
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <span className="text-3xl">⏳</span>
                  </div>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-3">Tasks in progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users Section */}
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">👤 Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          
          {recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name || user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{user._count.todos} todos</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/users" className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-4 rounded-full group-hover:scale-110 transition-transform">
                <span className="text-3xl">👥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage all registered users</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/todos" className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/10 p-4 rounded-full group-hover:scale-110 transition-transform">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Manage Todos</h3>
                <p className="text-sm text-muted-foreground">View and manage all todo items</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
