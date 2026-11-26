import { supabase } from "@/integrations/supabase/client";
import type { LandingPage } from "./types";

export async function fetchPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .is("deleted_at", null)
    .order("name");
  if (error) throw error;
  return (data ?? []) as unknown as LandingPage[];
}

export async function fetchDeletedPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as LandingPage[];
}

export async function fetchPageBySlug(slug: string) {
  const [{ data: page, error: pErr }, { data: content, error: cErr }] = await Promise.all([
    supabase.from("landing_pages").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("page_content").select("key,value").eq("slug", slug),
  ]);
  if (pErr) throw pErr;
  if (cErr) throw cErr;
  if (!page) return null;
  const map: Record<string, string> = {};
  for (const row of content ?? []) map[row.key] = row.value;
  return { page: page as unknown as LandingPage, content: map };
}