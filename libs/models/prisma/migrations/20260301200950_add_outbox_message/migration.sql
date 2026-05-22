-- CreateTable
CREATE TABLE "public"."OutboxMessage" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "producer" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "OutboxMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboxMessage_publishedAt_idx" ON "public"."OutboxMessage"("publishedAt");

-- CreateIndex
CREATE INDEX "OutboxMessage_nextAttemptAt_idx" ON "public"."OutboxMessage"("nextAttemptAt");

-- CreateIndex
CREATE INDEX "OutboxMessage_createdAt_idx" ON "public"."OutboxMessage"("createdAt");
