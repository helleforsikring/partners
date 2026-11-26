import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { fetchPageBySlug } from "@/lib/data";
import { PageProvider } from "@/lib/page-context";
import type { LandingPage } from "@/lib/types";
import { LandingPageView } from "@/components/site/LandingPageView";

export default function Landing() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{ page: LandingPage; content: Record<string, string> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPageBySlug(slug).then((d) => {
      setData(d && d.page.deleted_at ? null : d);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-foreground">Siden findes ikke.</p>
        <Link to="/" className="text-primary underline">Tilbage til oversigten</Link>
      </div>
    );
  }
  return (
    <PageProvider page={data.page} content={data.content}>
      <LandingPageView />
    </PageProvider>
  );
}