import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count();
  const totalTodos = await prisma.todo.count();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-medium">Total Users</h2>
          <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-medium">Total Todos</h2>
          <p className="mt-2 text-3xl font-bold">{totalTodos}</p>
        </div>

      </div>
    </div>
  );
}
