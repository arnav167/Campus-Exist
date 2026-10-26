import { supabase } from "@/lib/supabase";

export async function getBelongings() {
  const { data, error } = await supabase.from("belongings").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createBelonging(input: { name: string; category?: string; serial_or_note?: string; image_url?: string | null }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Please sign in to save belongings.");
  const { data, error } = await supabase.from("belongings").insert({ ...input, owner_id: userData.user.id }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBelonging(id: string) {
  const { error } = await supabase.from("belongings").delete().eq("id", id);
  if (error) throw error;
}
