import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { todos: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="p-4 border rounded-lg bg-card">
            <p className="text-lg font-medium">{u.name ?? u.email}</p>
            <p className="text-sm text-muted-foreground">
              Todos: {u.todos.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
