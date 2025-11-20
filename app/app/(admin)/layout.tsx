import AdminNavbar from "@/components/AdminNavbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role?.toLowerCase();

  if (!session || role !== "admin") {
    redirect("/login");
  }

  return (
    <>
      <AdminNavbar />
      <div className="max-w-6xl mx-auto p-6">{children}</div>
    </>
  );
}
