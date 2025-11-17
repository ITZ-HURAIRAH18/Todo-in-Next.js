"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session } = useSession(); // get session data

  const handleLogout = async () => {
    await signOut({ redirect: false }); // prevent automatic redirect
    router.push("/login"); // redirect manually
  };

  if (!session) {
    return <p>Loading...</p>; // optional: show loading while session is fetched
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      <p>
        Welcome <span className="font-semibold">{session.user.name}</span>!
      </p>
      <p>
        Role: <span className="font-semibold">{session.user.role}</span>
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white p-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
