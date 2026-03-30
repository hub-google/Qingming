import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

// CORS headers for browser interaction
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, totalAmount, itemName } = await req.json()

    // 2. Fetch Secrets (MerchantID, HashKey, HashIV)
    const MERCHANT_ID = Deno.env.get('ECPAY_MERCHANT_ID') || '2000132' // Demo default
    const HASH_KEY = Deno.env.get('ECPAY_HASH_KEY') || '5294y06JbCWpE5vG'
    const HASH_IV = Deno.env.get('ECPAY_HASH_IV') || 'v77hoKGq4qzC8s9Y'

    const tradeDate = new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '/')

    // 3. Prepare Parameters (Must be alphabetically sorted for ECPay)
    const params: Record<string, string> = {
      CheckMacValue: '',
      ChoosePayment: 'ALL',
      EncryptType: '1',
      ItemName: itemName || '清明祭拜服務',
      MerchantID: MERCHANT_ID,
      MerchantTradeDate: tradeDate,
      MerchantTradeNo: `QM${Date.now()}`, // Unique ID
      OrderResultURL: 'https://hub-google.github.io/Qingming/order',
      PaymentType: 'aio',
      ReturnURL: 'https://your-api.com/callback', // Your webhook for server sync
      TotalAmount: totalAmount.toString(),
      TradeDesc: '清明・家聚 祭拜訂單',
    }

    // 4. Calculate CheckMacValue
    const sortedKeys = Object.keys(params).sort()
    let rawStr = `HashKey=${HASH_KEY}`
    for (const key of sortedKeys) {
      if (key !== 'CheckMacValue') {
        rawStr += `&${key}=${params[key]}`
      }
    }
    rawStr += `&HashIV=${HASH_IV}`

    // URL Encode & Replace specific characters as per ECPay spec
    const encodedStr = encodeURIComponent(rawStr)
      .toLowerCase()
      .replace(/%20/g, '+')
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')

    // Generate SHA256 Hash
    const encoder = new TextEncoder()
    const data = encoder.encode(encodedStr)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const checkMacValue = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    params.CheckMacValue = checkMacValue

    // 5. Return JSON to Frontend (Production URL)
    return new Response(
      JSON.stringify({
        url: "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5", // 🚩 已切換為正式環境網址
        params
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
