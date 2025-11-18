"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (!session) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      <p>
        Welcome <span className="font-semibold">{session.user?.name}</span>!
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push("/todos")}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Go to Todos
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
