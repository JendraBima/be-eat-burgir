import { createClient } from "@supabase/supabase-js";
import { environment } from "../environment.js";

export const supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_KEY
) 