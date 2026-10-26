import { supabase } from "@/lib/supabase";

export async function getMyProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Please sign in to view your profile.");
  const { data, error } = await supabase.from("profiles").select("id,full_name,course,hostel,phone,avatar_url,created_at,updated_at").eq("id", userData.user.id).single();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(input: { full_name: string; course?: string; hostel?: string; phone?: string | null; avatar_url?: string | null }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Please sign in to update your profile.");
  const { data, error } = await supabase.from("profiles").update(input).eq("id", userData.user.id).select().single();
  if (error) throw error;
  return data;
}
