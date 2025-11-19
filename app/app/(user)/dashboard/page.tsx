// src/app/dashboard/page.tsx  (drop-in replacement)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.filter((t) => !t.completed).length;
  const recentTodos = todos.slice(0, 5);

  const categories = todos.reduce<Record<string, number>>((acc, t) => {
    if (t.category) acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Navbar user={session.user} />
      {/* ⬇️  NEW: full-width blue banner (your theme colours) */}
      <header className="bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold">Welcome back, {session.user?.name}!</h1>
          <p className="text-primary-foreground/80 mt-1">Here's your todo overview</p>
        </div>
      </header>

      {/* ⬇️  page body on soft gradient (matches your theme) */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard label="Total Todos" value={todos.length} />
            <MetricCard label="Completed" value={completed} />
            <MetricCard label="Pending" value={pending} />
          </div>

          {/* progress bar */}
          {todos.length > 0 && (
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">Progress</h3>
                <span className="text-sm text-muted-foreground">{Math.round((completed / todos.length) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(completed / todos.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{completed} completed</span>
                <span>{pending} pending</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* recent todos */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Recent Todos</h3>
                <Link href="/todos" className="text-sm text-primary hover:underline">View all →</Link>
              </div>
              {recentTodos.length ? (
                <ul className="space-y-3">
                  {recentTodos.map((todo) => (
                    <li key={todo.id} className="flex items-start justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium ${todo.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                          {todo.title}
                        </h4>
                        {todo.description && (
                          <p className="text-xs text-muted-foreground truncate mt-1">{todo.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                          {todo.category && (
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{todo.category}</span>
                          )}
                        </div>
                      </div>
                      <span className={`ml-3 px-2 py-0.5 rounded text-xs ${todo.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {todo.completed ? "✓" : "⏳"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-3">No todos yet.</p>
                  <Link href="/todos" className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm hover:opacity-90 transition">
                    Create your first todo
                  </Link>
                </div>
              )}
            </div>

            {/* categories */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Categories</h3>
              {Object.keys(categories).length ? (
                <ul className="space-y-3">
                  {Object.entries(categories)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <li key={category} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="text-sm font-medium text-card-foreground">{category}</span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{count}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-3">No categories yet.</p>
                  <Link href="/todos" className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm hover:opacity-90 transition">
                    Add categories
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- components ---------- */
function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border p-6 text-center">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}