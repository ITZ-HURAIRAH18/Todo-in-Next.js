import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new Response("Unauthorized", { status: 401 });

  try {
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: { deleted: true },
    });

    return new Response(JSON.stringify(todo), { status: 200 });
  } catch (e) {
    return new Response("Not found", { status: 404 });
  }
}
