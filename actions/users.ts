"use server";

import { getSupabaseAuth , getUser } from "../utils/supabase/server";
import { Provider } from "@supabase/supabase-js";


export const loginAction = async (provider: Provider) => {
  try {
    const { data, error } = await (await getSupabaseAuth()).signInWithOAuth({
      provider,
      options: {
        redirectTo: `https://my-nextjs-exerice.vercel.app/api/auth`,
        
      },
    });
    
    if (error) throw error;

    return { errorMessage: null, url: data.url };
  } catch (error) {
    return { errorMessage: "Error logging in" };
  }
};

export const signOutAction = async () => {
  try {
    const { error } = await (await getSupabaseAuth()).signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: "Error signing out" };
  }
};
