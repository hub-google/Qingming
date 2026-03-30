import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    const CHANNEL_TOKEN = Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')

    if (!CHANNEL_TOKEN) {
      throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set in Supabase Secrets.")
    }

    // 1. Prepare Message (Messaging API format)
    const payload = {
      messages: [
        {
          type: "text",
          text: `📦 【清明・家聚】 新訂單已成立！\n----------------------\n訂單編號: #${record.id.slice(0, 8)}\n金額: NT$ ${record.total_amount}\n狀態: ${record.payment_status === 'paid' ? '✅ 已付款' : '⏳ 待付款'}\n----------------------\n🌱 公益參與：本次消費已為您累積 NT$ ${Math.round(record.total_amount * 0.1)} 公益金！\n\n🔗 前往訂單紀錄：\nhttps://hub-google.github.io/Qingming/order`
        }
      ]
    }

    // 2. Broadcast to all followers (Messaging API Broadcast endpoint)
    const response = await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHANNEL_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`LINE API error: ${JSON.stringify(result)}`)
    }

    return new Response(JSON.stringify({ status: "success", result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
