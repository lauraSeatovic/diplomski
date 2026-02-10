import { createClient } from '@supabase/supabase-js';

import { URL, ANON_KEY } from '../../../../config';

export const supabase = createClient(URL, ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
});