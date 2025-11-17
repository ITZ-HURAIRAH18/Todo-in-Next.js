// app/api/todo/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(todos), { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      userId: session.user.id,
    },
  });

  return new Response(JSON.stringify(todo), { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, completed, deleted, title, description, category } = body;

  const todo = await prisma.todo.update({
    where: { id },
    data: { completed, deleted, title, description, category },
  });

  return new Response(JSON.stringify(todo), { status: 200 });
}
