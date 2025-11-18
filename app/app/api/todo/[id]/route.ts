import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("PATCH request for todo ID:", params.id);
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const updatedTodo = await prisma.todo.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      completed: body.completed,
      category: body.category,
    },
  });

  return new Response(JSON.stringify(updatedTodo), { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const deletedTodo = await prisma.todo.update({
    where: { id: params.id },
    data: { deleted: true },
  });

  return new Response(JSON.stringify(deletedTodo), { status: 200 });
}
