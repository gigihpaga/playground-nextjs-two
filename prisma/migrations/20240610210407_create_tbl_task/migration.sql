-- CreateTable
CREATE TABLE "dev_task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" INTEGER NOT NULL,
    CONSTRAINT "dev_task_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "dev_collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
