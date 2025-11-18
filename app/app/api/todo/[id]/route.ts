import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: any }) {
  // await the params
  const { id } = await params;  
  if (!id) return new Response("Todo ID missing", { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const data: any = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.completed !== undefined) data.completed = body.completed;
  if (body.category !== undefined) data.category = body.category;

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data,
    });
    return new Response(JSON.stringify(updatedTodo), { status: 200 });
  } catch (err: any) {
    console.error("PATCH error:", err);
    return new Response("Failed to update todo: " + err.message, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  const { id } = await params;
  if (!id) return new Response("Todo ID missing", { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  try {
    const deletedTodo = await prisma.todo.update({
      where: { id },
      data: { deleted: true },
    });
    return new Response(JSON.stringify(deletedTodo), { status: 200 });
  } catch (err: any) {
    console.error("DELETE error:", err);
    return new Response("Failed to delete todo: " + err.message, { status: 500 });
  }
}
