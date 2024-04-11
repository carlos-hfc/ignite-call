-- CreateTable
CREATE TABLE "userTimeIntervals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "startTimeInMinutes" INTEGER NOT NULL,
    "endTimeInMinutes" INTEGER NOT NULL,
    CONSTRAINT "userTimeIntervals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
