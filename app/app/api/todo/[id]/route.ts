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
    // Check if user owns the todo
    const todo = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!todo) {
      return new Response("Todo not found", { status: 404 });
    }

    const isOwner = todo.userId === session.user.id;
    
    // If not owner, check if user has edit permission through sharing
    let hasEditPermission = isOwner;
    
    if (!isOwner) {
      try {
        const sharedTodoModel = (prisma as any).sharedTodo;
        if (sharedTodoModel) {
          const sharedTodo = await sharedTodoModel.findUnique({
            where: {
              todoId_userId: {
                todoId: id,
                userId: session.user.id,
              },
            },
          });
          hasEditPermission = sharedTodo?.canEdit === true;
        }
      } catch (error) {
        console.error("Error checking shared permissions:", error);
      }
    }

    if (!hasEditPermission) {
      return new Response("You don't have permission to edit this todo", { status: 403 });
    }

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
    // Only the owner can delete a todo
    const todo = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!todo) {
      return new Response("Todo not found", { status: 404 });
    }

    if (todo.userId !== session.user.id) {
      return new Response("Only the owner can delete this todo", { status: 403 });
    }

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
