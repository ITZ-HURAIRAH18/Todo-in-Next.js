import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LogoutButton from "@/components/LogoutButton";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch todos directly from database
  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  // Calculate statistics on server
  const completed = todos.filter(todo => todo.completed).length;
  const pending = todos.filter(todo => !todo.completed).length;
  
  // Group by categories
  const categories: { [key: string]: number } = {};
  todos.forEach(todo => {
    if (todo.category) {
      categories[todo.category] = (categories[todo.category] || 0) + 1;
    }
  });
  
  // Get recent todos (last 5)
  const recentTodos = todos.slice(0, 5);

  return (
    <>
      <Navbar user={session.user} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-gray-600 dark:text-gray-300">Here's an overview of your todo activity</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Link href="/todos" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow block">
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todos.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Todos</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Click to manage →</p>
            </div>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0}% done
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Need attention</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">📊 Progress</h3>
              <span className="text-sm text-gray-600">
                {Math.round((completed / todos.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completed / todos.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completed} completed</span>
              <span>{pending} pending</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Todos */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">📌 Recent Todos</h3>
              <Link href="/todos" className="text-sm text-blue-600 hover:text-blue-700">
                View all →
              </Link>
            </div>
            {recentTodos && recentTodos.length > 0 ? (
              <div className="space-y-2">
                {recentTodos.map((todo) => (
                  <div key={todo.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}>
                          {todo.title}
                        </h4>
                        {todo.description && (
                          <p className="text-xs text-gray-500 truncate mt-1">{todo.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                          {todo.category && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {todo.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        todo.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {todo.completed ? '✓' : '⏳'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3 text-sm">No todos yet. Create your first one!</p>
                <Link 
                  href="/todos"
                  className="inline-block bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Create Todo
                </Link>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📂 Categories</h3>
            {Object.keys(categories).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(categories)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-900">{category}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {count} todo{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3 text-sm">No categories yet!</p>
                <Link 
                  href="/todos"
                  className="inline-block bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Add Categories
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
