-- CreateTable
CREATE TABLE "BlogView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idBlog" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "counterView" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogView_idBlog_key" ON "BlogView"("idBlog");
