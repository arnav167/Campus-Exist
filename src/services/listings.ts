import { supabase } from "@/lib/supabase";

export type ListingType = "sell" | "rent" | "lend";
export type ListingInput = {
  title: string;
  description?: string;
  category: string;
  type: ListingType;
  price: number;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  image_url?: string | null;
};

export async function getListings(filters: { search?: string; type?: ListingType | "all"; category?: string } = {}) {
  let query = supabase.from("listings").select("*").eq("status", "available").order("created_at", { ascending: false });
  if (filters.type && filters.type !== "all") query = query.eq("type", filters.type);
  if (filters.category && filters.category !== "All") query = query.eq("category", filters.category);
  if (filters.search?.trim()) query = query.ilike("title", `%${filters.search.trim().replace(/[%_]/g, "\\$&")}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createListing(input: ListingInput) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Please sign in to list an item.");
  const { data, error } = await supabase.from("listings").insert({ ...input, owner_id: authData.user.id }).select().single();
  if (error) throw error;
  return data;
}

export async function updateListingStatus(id: string, status: "available" | "reserved" | "sold" | "unavailable") {
  const { data, error } = await supabase.from("listings").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function uploadItemImage(file: File) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Please sign in to upload an image.");
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${authData.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("item-images").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("item-images").getPublicUrl(path);
  return data.publicUrl;
}
