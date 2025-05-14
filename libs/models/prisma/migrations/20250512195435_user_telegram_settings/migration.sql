-- CreateTable
CREATE TABLE "UserTelegramSettings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserTelegramSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTelegramSettings" ADD CONSTRAINT "UserTelegramSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
