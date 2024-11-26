import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xvkibkcnkqdfksxydmox.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a2lia2Nua3FkZmtzeHlkbW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NDMxNzcsImV4cCI6MjA0ODAxOTE3N30.AElwF1Hot5iG__bcRlD_3-uyWeHh1pqRtQIDjEm-x5g'
)