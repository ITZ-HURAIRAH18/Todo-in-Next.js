import prisma from "@/lib/prisma";

export default async function AdminTodosPage() {
  const todos = await prisma.todo.findMany({
    where: { deleted: false },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">All Todos</h1>
        <p className="text-muted-foreground">
          Review every todo in the system. Completed entries are shown with a green border.
        </p>
      </header>

      <div className="grid gap-4">
        {todos.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
            No todos found.
          </div>
        ) : (
          todos.map((todo) => (
            <article
              key={todo.id}
              className={`border rounded-lg p-4 bg-card ${
                todo.completed ? "border-green-500" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{todo.title}</h2>
                  <p className="text-sm text-muted-foreground">{todo.description}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    todo.completed
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                  }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Created by: <span className="font-medium text-foreground">{todo.user?.email ?? "Unknown"}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
