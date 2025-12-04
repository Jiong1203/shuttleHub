-- 將 Event.id 從 Int 改為 UUID
-- 將 Registration.id 從 Int 改為 UUID
-- 將 Registration.eventId 從 Int 改為 UUID

-- 步驟 1: 刪除外鍵約束和唯一約束
ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_eventId_fkey";
ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_userId_eventId_key";

-- 步驟 2: 先移除 Event.id 和 Registration.id 的預設值（它們依賴於序列）
ALTER TABLE "Event" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "Registration" ALTER COLUMN "id" DROP DEFAULT;

-- 步驟 3: 刪除序列
DROP SEQUENCE IF EXISTS "Event_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Registration_id_seq" CASCADE;

-- 步驟 4: 檢查是否有資料並遷移
-- 為現有的 Event 添加臨時的 UUID 欄位
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "id_new" UUID;

-- 為現有 Event 生成 UUID（如果 id_new 為 NULL）
UPDATE "Event" SET "id_new" = gen_random_uuid() WHERE "id_new" IS NULL;

-- 為現有的 Registration 添加臨時的 UUID 欄位
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "id_new" UUID;

-- 為現有 Registration 生成 UUID（如果 id_new 為 NULL）
UPDATE "Registration" SET "id_new" = gen_random_uuid() WHERE "id_new" IS NULL;

-- 更新 Registration 表：添加新的 eventId 欄位並遷移資料
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "eventId_new" UUID;
UPDATE "Registration" 
SET "eventId_new" = (SELECT "id_new" FROM "Event" WHERE "Event"."id" = "Registration"."eventId")
WHERE "eventId_new" IS NULL;

-- 步驟 5: 刪除舊欄位並重新命名新欄位
-- 刪除舊欄位
ALTER TABLE "Registration" DROP COLUMN IF EXISTS "eventId";
ALTER TABLE "Registration" DROP COLUMN IF EXISTS "id";
ALTER TABLE "Event" DROP COLUMN IF EXISTS "id";

-- 重新命名新欄位
ALTER TABLE "Event" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Registration" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Registration" RENAME COLUMN "eventId_new" TO "eventId";

-- 步驟 6: 設定主鍵和預設值
-- Event 表
ALTER TABLE "Event" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Event" ADD PRIMARY KEY ("id");

-- Registration 表
ALTER TABLE "Registration" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Registration" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Registration" ADD PRIMARY KEY ("id");

-- 確保 eventId 欄位不為 NULL
ALTER TABLE "Registration" ALTER COLUMN "eventId" SET NOT NULL;

-- 步驟 7: 重新創建外鍵約束
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 重新創建唯一約束
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_eventId_key" 
  UNIQUE ("userId", "eventId");

