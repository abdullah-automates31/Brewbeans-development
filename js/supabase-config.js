/* Brew Beans - Supabase client configuration */
const SUPABASE_URL = 'https://rtqbpviegxwgaknmrrsg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7ob1dFT-sGzEZaKMH0Y8EA_hAmTu2XT';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
