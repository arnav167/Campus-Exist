import { supabase } from "@/lib/supabase";

export async function getBorrowRequests(direction: "sent" | "received") {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Please sign in to view borrowing requests.");
  const column = direction === "sent" ? "requester_id" : "owner_id";
  const { data, error } = await supabase.from("borrow_requests").select("*, listing:listings(id,title,type,image_url,price)").eq(column, authData.user.id).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createBorrowRequest(input: { listingId: string; startDate?: string | null; endDate?: string | null; message?: string }) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Please sign in to request an item.");
  const { data: listing, error: listingError } = await supabase.from("listings").select("owner_id,type,status").eq("id", input.listingId).single();
  if (listingError) throw listingError;
  if (listing.owner_id === authData.user.id) throw new Error("You cannot request your own listing.");
  if (listing.status !== "available" || !["rent", "lend"].includes(listing.type)) throw new Error("This listing is not available for borrowing.");
  const { data, error } = await supabase.from("borrow_requests").insert({
    listing_id: input.listingId,
    requester_id: authData.user.id,
    owner_id: listing.owner_id,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    message: input.message || "",
  }).select().single();
  if (error) throw error;
  return data;
}

export async function respondToBorrowRequest(requestId: string, status: "approved" | "declined" | "returned") {
  const { data, error } = await supabase.rpc("respond_to_borrow_request", { p_request_id: requestId, p_status: status });
  if (error) throw error;
  return data;
}

export async function createPurchaseEnquiry(input: { listingId: string; message?: string }) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Please sign in to enquire about an item.");
  const { data: listing, error: listingError } = await supabase.from("listings").select("owner_id,type,status").eq("id", input.listingId).single();
  if (listingError) throw listingError;
  if (listing.owner_id === authData.user.id) throw new Error("You cannot enquire about your own listing.");
  if (listing.status !== "available" || listing.type !== "sell") throw new Error("This item is not available for purchase enquiries.");
  const { data, error } = await supabase.from("borrow_requests").insert({
    listing_id: input.listingId,
    requester_id: authData.user.id,
    owner_id: listing.owner_id,
    request_type: "purchase",
    message: input.message || "",
  }).select().single();
  if (error) throw error;
  return data;
}
