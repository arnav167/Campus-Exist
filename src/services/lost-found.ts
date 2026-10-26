import { supabase } from "@/lib/supabase";

export type ReportInput = { kind: "lost" | "found"; title: string; description?: string; location: string; report_date?: string; image_url?: string | null };

export async function getLostFoundReports(filters: { search?: string; kind?: "lost" | "found" | "all" } = {}) {
  let query = supabase.from("lost_found_reports").select("*").eq("status", "open").order("created_at", { ascending: false });
  if (filters.kind && filters.kind !== "all") query = query.eq("kind", filters.kind);
  if (filters.search?.trim()) query = query.or(`title.ilike.%${filters.search.trim()}%,location.ilike.%${filters.search.trim()}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createLostFoundReport(input: ReportInput) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Please sign in to create a report.");
  const { data, error } = await supabase.from("lost_found_reports").insert({ ...input, reporter_id: userData.user.id }).select().single();
  if (error) throw error;
  return data;
}

export async function updateReportStatus(id: string, status: "returned" | "closed") {
  const { data, error } = await supabase.from("lost_found_reports").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
