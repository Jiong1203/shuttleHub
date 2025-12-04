-- 將 User.id 從 Int 改為 UUID
-- 將 Event.organizerId 從 Int 改為 String (UUID)
-- 將 Registration.userId 從 Int 改為 String (UUID)

-- 步驟 1: 刪除外鍵約束和唯一約束
ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_organizerId_fkey";
ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_userId_fkey";
ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_userId_eventId_key";

-- 步驟 2: 先移除 User.id 的預設值（它依賴於序列）
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;

-- 步驟 3: 現在可以安全地刪除序列
DROP SEQUENCE IF EXISTS "User_id_seq" CASCADE;

-- 步驟 4: 檢查是否有資料並遷移
-- 如果 User 表中有資料，需要為每個 User 生成 UUID 並更新關聯表

-- 為現有的 User 添加臨時的 UUID 欄位
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "id_new" UUID;

-- 為現有 User 生成 UUID（如果 id_new 為 NULL）
UPDATE "User" SET "id_new" = gen_random_uuid() WHERE "id_new" IS NULL;

-- 更新 Event 表：添加新欄位並遷移資料
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "organizerId_new" UUID;
UPDATE "Event" 
SET "organizerId_new" = (SELECT "id_new" FROM "User" WHERE "User"."id" = "Event"."organizerId")
WHERE "organizerId_new" IS NULL;

-- 更新 Registration 表：添加新欄位並遷移資料
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "userId_new" UUID;
UPDATE "Registration" 
SET "userId_new" = (SELECT "id_new" FROM "User" WHERE "User"."id" = "Registration"."userId")
WHERE "userId_new" IS NULL;

-- 步驟 5: 刪除舊欄位並重新命名新欄位

-- 刪除舊欄位
ALTER TABLE "Event" DROP COLUMN IF EXISTS "organizerId";
ALTER TABLE "Registration" DROP COLUMN IF EXISTS "userId";
ALTER TABLE "User" DROP COLUMN IF EXISTS "id";

-- 重新命名新欄位
ALTER TABLE "User" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Event" RENAME COLUMN "organizerId_new" TO "organizerId";
ALTER TABLE "Registration" RENAME COLUMN "userId_new" TO "userId";

-- 步驟 6: 設定主鍵和預設值
-- 確保 id 欄位不為 NULL
ALTER TABLE "User" ALTER COLUMN "id" SET NOT NULL;

-- 設定 UUID 預設值
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- 添加主鍵約束（因為舊的 id 欄位已被刪除，主鍵約束也應該被刪除了）
ALTER TABLE "User" ADD PRIMARY KEY ("id");

-- 確保新欄位不為 NULL
ALTER TABLE "Event" ALTER COLUMN "organizerId" SET NOT NULL;
ALTER TABLE "Registration" ALTER COLUMN "userId" SET NOT NULL;

-- 步驟 7: 重新創建外鍵約束
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" 
  FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 重新創建唯一約束
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_eventId_key" 
  UNIQUE ("userId", "eventId");

