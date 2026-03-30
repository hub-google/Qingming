import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://unapiwajmgqqtdkixaab.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_L09XC4Tekm6cZaPTTczm3g_Aap-SOSy'

export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
