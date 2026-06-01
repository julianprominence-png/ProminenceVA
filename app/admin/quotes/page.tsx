"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { QuoteStatus } from "@/types/quote";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface QuoteRecord {
  id: string;
  quoteId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  projectDescription: string;
  budgetRange: string;
  status: QuoteStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  new: {
    label: "New",
    color: "text-blue-300",
    bg: "bg-blue-500/[0.08]",
    border: "border-blue-500/20",
  },
  contacted: {
    label: "Contacted",
    color: "text-amber-300",
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/20",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-purple-300",
    bg: "bg-purple-500/[0.08]",
    border: "border-purple-500/20",
  },
  won: {
    label: "Won",
    color: "text-emerald-300",
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/20",
  },
  lost: {
    label: "Lost",
    color: "text-red-300",
    bg: "bg-red-500/[0.08]",
    border: "border-red-500/20",
  },
};

const ITEMS_PER_PAGE = 12;

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function AdminQuotesPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Auth guard ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      else setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  /* ── Realtime listener ── */
  useEffect(() => {
    if (authLoading) return;
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data: QuoteRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          quoteId: d.data().quoteId || "",
          fullName: d.data().fullName || "",
          email: d.data().email || "",
          phone: d.data().phone || "",
          company: d.data().company || "",
          services: d.data().services || [],
          projectDescription: d.data().projectDescription || "",
          budgetRange: d.data().budgetRange || "",
          status: d.data().status || "new",
          createdAt: d.data().createdAt || null,
          updatedAt: d.data().updatedAt || null,
        }));
        setQuotes(data);
        setDataLoading(false);
      },
      (err) => {
        console.error("Quotes listener error:", err);
        setDataLoading(false);
      }
    );
    return () => unsub();
  }, [authLoading]);

  /* ── Filtering ── */
  const filtered = quotes.filter((q) => {
    const matchesStatus =
      statusFilter === "all" || q.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      q.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.quoteId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  /* ── Stats ── */
  const statCounts: Record<QuoteStatus | "all", number> = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === "new").length,
    contacted: quotes.filter((q) => q.status === "contacted").length,
    "in-progress": quotes.filter((q) => q.status === "in-progress").length,
    won: quotes.filter((q) => q.status === "won").length,
    lost: quotes.filter((q) => q.status === "lost").length,
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return "—";
    try {
      const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts as unknown as string);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020104] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-fuchsia-500/40 border-t-fuchsia-400 rounded-full animate-spin" />
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">
            Verifying Access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020104] text-white relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(126,34,206,0.2)_0%,transparent_60%)] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_60%)] rounded-full blur-[100px]" />
      </div>

      {/* Noise */}
      <div
        className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-medium tracking-tight">
                Quote Management
              </h1>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-bold mt-1">
                {quotes.length} total quotes · Realtime sync
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                await auth.signOut();
                router.push("/admin/login");
              }}
              className="px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 border border-white/10 rounded-full hover:bg-white/[0.05] hover:text-white transition-all"
            >
              Sign Out
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05]">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-[9px] tracking-[0.2em] uppercase text-emerald-400/80 font-bold">
                Live
              </span>
            </div>
          </div>
        </header>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(
            ["all", "new", "contacted", "in-progress", "won", "lost"] as const
          ).map((status) => {
            const isActive = statusFilter === status;
            const config =
              status === "all"
                ? { label: "All", color: "text-white/70", bg: "", border: "" }
                : STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 border ${
                  isActive
                    ? `${config.bg || "bg-white/[0.06]"} ${config.border || "border-white/15"} ${config.color}`
                    : "border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10"
                }`}
              >
                {config.label}
                <span className="ml-2 opacity-60">{statCounts[status]}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or quote ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-11 pr-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-fuchsia-500/30 focus:bg-white/[0.04] transition-all"
            />
          </div>
        </div>

        {/* Quote Cards Grid */}
        <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-[#020104]/90 backdrop-blur-[60px] border border-white/10 border-b-black/80 rounded-3xl">
          {dataLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-6 h-6 border-2 border-fuchsia-500/40 border-t-fuchsia-400 rounded-full animate-spin" />
                <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
                  Loading quotes...
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#010002]/80 border border-white/5 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">
                {searchQuery || statusFilter !== "all"
                  ? "No quotes match your filters"
                  : "No quotes yet"}
              </p>
              <p className="text-white/15 text-xs mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Quote submissions will appear here in realtime"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">
                        Quote ID
                      </th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">
                        Client
                      </th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">
                        Services
                      </th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((quote, idx) => {
                      const sc = STATUS_CONFIG[quote.status] || STATUS_CONFIG.new;
                      return (
                        <tr
                          key={quote.id}
                          onClick={() =>
                            router.push(`/admin/quotes/${quote.id}`)
                          }
                          className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer ${
                            idx % 2 === 0 ? "bg-white/[0.01]" : ""
                          } ${quote.status === "new" ? "bg-blue-500/[0.02]" : ""}`}
                        >
                          <td className="px-6 py-5">
                            <span className="text-xs text-fuchsia-300/80 font-mono font-medium">
                              {quote.quoteId}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div>
                              <span className="text-sm font-medium text-white/90 block">
                                {quote.fullName}
                              </span>
                              <span className="text-xs text-white/30">
                                {quote.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-1.5">
                              {quote.services.map((s) => (
                                <span
                                  key={s}
                                  className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-purple-500/[0.08] text-purple-300/70 border border-purple-500/10"
                                >
                                  {s === "Web Development"
                                    ? "Web"
                                    : s === "Graphic Design"
                                    ? "Design"
                                    : "Video"}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${sc.bg} ${sc.color} border ${sc.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[11px] text-white/40 font-light whitespace-nowrap">
                              {formatDate(quote.createdAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-white/[0.04]">
                {paginated.map((quote) => {
                  const sc = STATUS_CONFIG[quote.status] || STATUS_CONFIG.new;
                  return (
                    <div
                      key={quote.id}
                      className={`p-5 space-y-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                        quote.status === "new" ? "bg-blue-500/[0.02]" : ""
                      }`}
                      onClick={() =>
                        router.push(`/admin/quotes/${quote.id}`)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/90">
                          {quote.fullName}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase ${sc.bg} ${sc.color} border ${sc.border}`}
                        >
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-fuchsia-300/70 font-mono">
                        {quote.quoteId}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {quote.services.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-purple-500/[0.06] text-purple-300/60 border border-purple-500/10"
                          >
                            {s === "Web Development"
                              ? "Web"
                              : s === "Graphic Design"
                              ? "Design"
                              : "Video"}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/30">
                        <span>{quote.email}</span>
                        <span>{formatDate(quote.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 md:px-8 py-5 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className={`bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 border-b-black/60 rounded-full px-5 py-2.5 text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                      currentPage === 1
                        ? "opacity-30 cursor-not-allowed"
                        : "text-white/70 hover:text-white hover:border-fuchsia-500/40"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(totalPages, p + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 border-b-black/60 rounded-full px-5 py-2.5 text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                      currentPage === totalPages
                        ? "opacity-30 cursor-not-allowed"
                        : "text-white/70 hover:text-white hover:border-fuchsia-500/40"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center">
          <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase font-bold">
            © {new Date().getFullYear()} Prominence Admin · Quote Management
          </p>
        </footer>
      </div>
    </div>
  );
}
