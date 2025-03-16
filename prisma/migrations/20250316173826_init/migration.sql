-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT DEFAULT '',
ADD COLUMN     "dueDate" TIMESTAMP(3);
