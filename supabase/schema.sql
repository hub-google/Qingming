-- ============================================================
-- 清明・家聚 (QingMing) Supabase Database Schema
-- 所有資料表前綴：QingMing_
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. 家族房間 (Family Rooms)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_family_rooms" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- 家族名稱，例：「陳家」
  created_by UUID REFERENCES auth.users(id),   -- 發起人 UID
  invite_code TEXT UNIQUE DEFAULT substring(gen_random_uuid()::text, 1, 8),
  deceased_name TEXT,                          -- 先人姓名
  deceased_birth DATE,
  deceased_death DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. 家族成員 & 出席意願 (Members & Attendance)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_members" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_room_id UUID REFERENCES "QingMing_family_rooms"(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  attendance_status TEXT CHECK (attendance_status IN ('attend', 'absent', 'pending')) DEFAULT 'pending',
  notes TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 3. 商品目錄 (Products)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_products" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,                      -- 單位：新台幣
  category TEXT CHECK (category IN ('attend_bundle', 'proxy_service', 'virtual_offering', 'affiliate')),
  icon_emoji TEXT,
  is_active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT -1,                    -- -1 = unlimited
  tag TEXT,                                    -- 標籤，例：「熱銷第一」
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 4. 訂單 (Orders)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_orders" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE DEFAULT 'QM-' || to_char(NOW(), 'YYYYMMDD') || '-' || substring(gen_random_uuid()::text, 1, 4),
  user_id UUID REFERENCES auth.users(id),
  family_room_id UUID REFERENCES "QingMing_family_rooms"(id),
  total_amount INTEGER NOT NULL,               -- 新台幣
  esg_donation INTEGER GENERATED ALWAYS AS (total_amount / 10) STORED, -- 10% 自動計算
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,                         -- 'credit_card', 'line_pay', 'jkopay'
  payment_ref TEXT,                            -- 金流回傳的交易代號
  pickup_date DATE,                            -- 供品取貨日期（親自出席者）
  pickup_location TEXT,                        -- 取貨地點
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 5. 訂單明細 (Order Items)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_order_items" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES "QingMing_orders"(id) ON DELETE CASCADE,
  product_id UUID REFERENCES "QingMing_products"(id),
  product_name TEXT NOT NULL,                  -- 快照，防止商品下架後無記錄
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER GENERATED ALWAYS AS (unit_price * quantity) STORED
);

-- ────────────────────────────────────────────────────────────
-- 6. 代客掃墓服務追蹤 (Proxy Service Jobs)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_proxy_jobs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES "QingMing_orders"(id),
  worker_name TEXT,
  job_status TEXT CHECK (job_status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  location_address TEXT,
  location_lat DECIMAL(10, 7),
  location_lng DECIMAL(10, 7),
  gps_checkin_at TIMESTAMPTZ,                 -- Worker GPS 打卡時間
  photo_before_url TEXT,                       -- 施工前照片（Supabase Storage URL）
  photo_after_url TEXT,                        -- 施工後照片
  video_url TEXT,                              -- 最高 15 分鐘影片
  live_stream_url TEXT,                        -- 即時直播連結（Twilio/WebRTC）
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- ────────────────────────────────────────────────────────────
-- 7. 追思牆留言 (Memorial Posts)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_memorial_posts" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_room_id UUID REFERENCES "QingMing_family_rooms"(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  deceased_name TEXT,
  message TEXT NOT NULL,
  photo_url TEXT,                              -- Supabase Storage URL
  ai_animated_url TEXT,                        -- D-ID/HeyGen 處理後的 GIF/MP4
  ai_status TEXT CHECK (ai_status IN ('none', 'pending', 'processing', 'done', 'failed')) DEFAULT 'none',
  is_pinned BOOLEAN DEFAULT false,             -- 置頂（主位先人）
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 8. 虛擬供品紀錄 (Virtual Offerings)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_virtual_offerings" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  family_room_id UUID REFERENCES "QingMing_family_rooms"(id),
  item_name TEXT NOT NULL,
  item_icon TEXT,
  amount INTEGER NOT NULL,                     -- 新台幣
  esg_amount INTEGER GENERATED ALWAYS AS (amount / 10) STORED,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'demo')) DEFAULT 'demo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 9. ESG 公益基金累計 (ESG Fund)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_esg_fund" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT CHECK (source_type IN ('order', 'virtual_offering')),
  source_id UUID,                              -- 對應 orders 或 virtual_offerings 的 ID
  amount INTEGER NOT NULL,
  month TEXT DEFAULT to_char(NOW(), 'YYYY-MM'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 10. 春遊導購連結 (Affiliate Links - Admin managed)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_affiliate_links" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,                      -- '旅遊保險', '租車服務', '家族餐廳', '春遊住宿'
  title TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  tag TEXT,
  url TEXT NOT NULL,                           -- 含 UTM 參數的完整連結
  click_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 11. 潛在客戶名單 (Leads)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "QingMing_leads" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  source TEXT DEFAULT 'spring_outing',         -- 來源頁面
  status TEXT CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
  assigned_to TEXT,                            -- 業務信箱
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) 設定
-- ============================================================

ALTER TABLE "QingMing_family_rooms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_proxy_jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_memorial_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_virtual_offerings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_esg_fund" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_affiliate_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QingMing_products" ENABLE ROW LEVEL SECURITY;

-- ── Family Rooms ──
-- 已登入用戶可讀取自己的家族
CREATE POLICY "QingMing: rooms read own" ON "QingMing_family_rooms"
  FOR SELECT USING (auth.uid() = created_by);

-- 已登入用戶可建立家族
CREATE POLICY "QingMing: rooms insert auth" ON "QingMing_family_rooms"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── Members ──
-- 同家族成員可互相查看
CREATE POLICY "QingMing: members read family" ON "QingMing_members"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "QingMing: members insert auth" ON "QingMing_members"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "QingMing: members update own" ON "QingMing_members"
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Memorial Posts ──
-- 所有人可讀（家族連結存取），只有本人可刪
CREATE POLICY "QingMing: memorial read all" ON "QingMing_memorial_posts"
  FOR SELECT USING (true);

CREATE POLICY "QingMing: memorial insert auth" ON "QingMing_memorial_posts"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "QingMing: memorial delete own" ON "QingMing_memorial_posts"
  FOR DELETE USING (auth.uid() = user_id);

-- ── Orders ──
CREATE POLICY "QingMing: orders read own" ON "QingMing_orders"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "QingMing: orders insert auth" ON "QingMing_orders"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── Virtual Offerings ──
CREATE POLICY "QingMing: offerings read own" ON "QingMing_virtual_offerings"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "QingMing: offerings insert auth" ON "QingMing_virtual_offerings"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── Products (公開讀取) ──
CREATE POLICY "QingMing: products read all" ON "QingMing_products"
  FOR SELECT USING (is_active = true);

-- ── Affiliate Links (公開讀取) ──
CREATE POLICY "QingMing: affiliate read all" ON "QingMing_affiliate_links"
  FOR SELECT USING (is_active = true);

-- ── Leads (只有後台可讀，前端只能寫入) ──
CREATE POLICY "QingMing: leads insert" ON "QingMing_leads"
  FOR INSERT WITH CHECK (true);

-- ── ESG Fund (公開讀取) ──
CREATE POLICY "QingMing: esg read all" ON "QingMing_esg_fund"
  FOR SELECT USING (true);

-- ============================================================
-- 預設商品資料
-- ============================================================
INSERT INTO "QingMing_products" (name, description, price, category, icon_emoji, tag) VALUES
  ('傳統祭拜懶人包 A', '包含：五果、三牲、米酒、金紙、香燭，一包搞定所有祭拜需求！', 880, 'attend_bundle', '🧺', '熱銷第一'),
  ('精緻花卉供品組', '季節鮮花搭配傳統紙錢，適合送給長輩在天之靈。', 580, 'attend_bundle', '🌸', '人氣推薦'),
  ('全素祭拜套餐', '精選全素供品，尊重信仰差異，誠心最重要。', 680, 'attend_bundle', '🍱', '素食首選'),
  ('家族豪華祭拜組', '適合 10 人以上大家族，內含三牲、五果、酒水、金紙完整組合。', 2880, 'attend_bundle', '🎁', '家族首選'),
  ('代客掃墓・基本方案', '專業人員前往掃墓、清理墓地、上香供品，並提供施工前後完整照片。', 1500, 'proxy_service', '🚗', '含前後照'),
  ('代客掃墓・直播方案', '線上即時影像直播，讓您在家也能「親眼」看見掃墓過程。', 2500, 'proxy_service', '📹', '含直播'),
  ('代燒金紙・標準包', '由專業人員代您燒化金紙，附上祈福文書與 GPS 打卡紀錄。', 800, 'proxy_service', '🔥', '最人氣'),
  ('代客掃墓・尊榮全包', '包含代掃、代燒、直播、鮮花供奉，再附電子公益收據。', 3880, 'proxy_service', '💎', '全包服務'),
  ('祈福燈', '點燈祈福，照亮天路', 50, 'virtual_offering', '🏮', NULL),
  ('鮮花一束', '敬獻芬芳，表達思念', 88, 'virtual_offering', '🌸', NULL),
  ('愛吃的麵', '供奉先人最愛的美食', 128, 'virtual_offering', '🍜', NULL),
  ('好茶一壺', '清香好茶，敬奉天上', 168, 'virtual_offering', '🍵', NULL),
  ('高粱酒', '一杯敬故人，一杯敬自己', 288, 'virtual_offering', '🥃', NULL),
  ('黃金元寶', '金光閃爍，護佑全家', 388, 'virtual_offering', '💰', NULL),
  ('傳統紙紮', '精緻紙紮，表達孝心', 688, 'virtual_offering', '🎎', NULL),
  ('豪宅紙紮', '極致榮耀，盡顯孝道', 1688, 'virtual_offering', '🏠', NULL);

-- 預設春遊導購連結
INSERT INTO "QingMing_affiliate_links" (category, title, description, icon_emoji, tag, url, sort_order) VALUES
  ('旅遊保險', '國泰旅平險・清明限定', '清明掃墓途中意外保障，最高 300 萬理賠，一鍵投保 5 分鐘搞定。', '🛡', '推薦', 'https://insurance.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=travel', 1),
  ('旅遊保險', '全家醫療保障方案', '特別設計給出席掃墓的家族成員，含意外與突發疾病保障。', '🏥', '家族首選', 'https://insurance.example.com/family?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=family', 2),
  ('租車服務', 'iRent 清明特惠租車', '家族出遊首選，7 人座 MPV 一日只要 NT$ 2,500，含清明免費升等。', '🚙', '限時折扣', 'https://irent.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=car', 3),
  ('租車服務', '葛瑪蘭・清明包車', '10~20 人大家族掃墓包車，專屬司機導覽，安心又省事。', '🚌', '大家族', 'https://bus.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=bus', 4),
  ('家族餐廳', '欣葉台菜・家族聚餐包廂', '清明掃墓後家族聚餐首選，預訂清明特惠套餐享 9 折優惠。', '🍜', '限量訂位', 'https://restaurant.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=restaurant', 5),
  ('家族餐廳', '鼎泰豐・特別預訂通道', '透過專屬連結享免排隊特殊預約席，清明節日限額 20 組。', '🥢', '免排隊', 'https://dtf.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=dtf', 6),
  ('春遊住宿', '礁溪老爺・清明溫泉包', '掃墓後帶著家人泡溫泉放鬆！清明夜晚 NT$ 3,888 起，含早餐。', '🏨', '春遊推薦', 'https://hotel.example.com?utm_source=qingming&utm_medium=app&utm_campaign=qingming2026&utm_term=hotel', 7);
