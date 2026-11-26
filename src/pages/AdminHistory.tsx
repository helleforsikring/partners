import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LogRow = {
  id: string;
  table_name: string;
  slug: string | null;
  action: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  actor_email: string | null;
  created_at: string;
};

const truncate = (v: string | null, n = 80) =>
  !v ? "—" : v.length > n ? v.slice(0, n) + "…" : v;

const actionLabel = (a: string) =>
  a === "create" ? "Oprettet" : a === "update" ? "Ændret" : a === "delete" ? "Slettet" : a;

export default function AdminHistory() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSlug, setFilterSlug] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error) setRows((data ?? []) as LogRow[]);
      setLoading(false);
    })();
  }, []);

  const slugs = Array.from(new Set(rows.map((r) => r.slug).filter(Boolean))) as string[];
  const filtered = filterSlug ? rows.filter((r) => r.slug === filterSlug) : rows;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">← Til admin</Link>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">Historik</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-2xl font-semibold text-foreground">Ændringer</h2>
          <select
            value={filterSlug}
            onChange={(e) => setFilterSlug(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="">Alle sider</option>
            {slugs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">Ingen ændringer endnu.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tidspunkt</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Handling</th>
                  <th className="px-4 py-3">Felt</th>
                  <th className="px-4 py-3">Før</th>
                  <th className="px-4 py-3">Efter</th>
                  <th className="px-4 py-3">Bruger</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("da-DK")}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{r.slug ?? "—"}</td>
                    <td className="px-4 py-3">{actionLabel(r.action)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.field ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs">{truncate(r.old_value)}</td>
                    <td className="px-4 py-3 text-foreground max-w-xs">{truncate(r.new_value)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.actor_email ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}