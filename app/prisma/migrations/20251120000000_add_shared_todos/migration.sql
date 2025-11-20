-- CreateTable
CREATE TABLE "SharedTodo" (
    "id" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedTodo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedTodo_todoId_userId_key" ON "SharedTodo"("todoId", "userId");

-- AddForeignKey
ALTER TABLE "SharedTodo" ADD CONSTRAINT "SharedTodo_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedTodo" ADD CONSTRAINT "SharedTodo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
