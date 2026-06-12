import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jesmjlalmyvnyojfdznp.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implc21qbGFsbXl2bnlvamZkem5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTUwNzksImV4cCI6MjA5Njc3MTA3OX0.HGtTMmaxaYyqxdxb_51uSVb7M1HWeFKYRiPEPfQUX_Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
