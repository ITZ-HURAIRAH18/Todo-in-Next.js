import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Share request - Session:", session?.user);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const todoId = resolvedParams.id;
    const body = await request.json();
    const { userId, canEdit } = body;

    console.log("Share request - todoId:", todoId, "userId:", userId, "canEdit:", canEdit);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the todo exists and belongs to the current user
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    console.log("Found todo:", todo);

    if (!todo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    if (todo.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only share your own todos" },
        { status: 403 }
      );
    }

    // Check if the target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("Target user:", targetUser);

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent sharing with yourself
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot share a todo with yourself" },
        { status: 400 }
      );
    }

    console.log("Creating shared todo...");
    
    // Try to access SharedTodo model - Prisma converts PascalCase to camelCase
    // Use dynamic access to handle potential missing model gracefully
    const sharedTodoModel = (prisma as any).sharedTodo;
    
    if (!sharedTodoModel || typeof sharedTodoModel.upsert !== 'function') {
      const availableModels = Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_'));
      console.error("Prisma client missing SharedTodo model.");
      console.error("Available models in Prisma client:", availableModels);
      return NextResponse.json(
        { 
          error: "SharedTodo model not available. Steps to fix:\n1. Stop the dev server completely (Ctrl+C)\n2. Run: npx prisma generate\n3. Restart the dev server\n\nImportant: You MUST fully restart the dev server after regenerating Prisma for the changes to take effect." 
        },
        { status: 500 }
      );
    }

    // Create or update the shared todo
    const sharedTodo = await sharedTodoModel.upsert({
      where: {
        todoId_userId: {
          todoId,
          userId,
        },
      },
      update: {
        canEdit: canEdit || false,
      },
      create: {
        todoId,
        userId,
        canEdit: canEdit || false,
      },
    });

    console.log("Shared todo created:", sharedTodo);

    return NextResponse.json(
      { message: "Todo shared successfully", sharedTodo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sharing todo:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to share todo", details: error.message },
      { status: 500 }
    );
  }
}
