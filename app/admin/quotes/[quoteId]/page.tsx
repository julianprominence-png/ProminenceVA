"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { QUOTE_STATUSES, type QuoteStatus } from "@/types/quote";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface QuoteData {
  quoteId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  projectDescription: string;
  budgetRange: string;
  status: QuoteStatus;
  internalNotes: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

interface MessageData {
  id: string;
  sender: "client" | "admin";
  content: string;
  createdAt: Timestamp | null;
}

const STATUS_LABELS: Record<QuoteStatus, { label: string; dotColor: string }> =
  {
    new: { label: "New", dotColor: "bg-blue-400" },
    contacted: { label: "Contacted", dotColor: "bg-amber-400" },
    "in-progress": { label: "In Progress", dotColor: "bg-purple-400" },
    won: { label: "Won", dotColor: "bg-emerald-400" },
    lost: { label: "Lost", dotColor: "bg-red-400" },
  };

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function QuoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quoteDocId = params.quoteId as string;

  const [authLoading, setAuthLoading] = useState(true);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [notesContent, setNotesContent] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      else setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  /* ── Quote document listener ── */
  useEffect(() => {
    if (authLoading || !quoteDocId) return;
    const unsub = onSnapshot(
      doc(db, "quotes", quoteDocId),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setQuote({
            quoteId: d.quoteId || "",
            fullName: d.fullName || "",
            email: d.email || "",
            phone: d.phone || "",
            company: d.company || "",
            services: d.services || [],
            projectDescription: d.projectDescription || "",
            budgetRange: d.budgetRange || "",
            status: d.status || "new",
            internalNotes: d.internalNotes || "",
            createdAt: d.createdAt || null,
            updatedAt: d.updatedAt || null,
          });
          setNotesContent(d.internalNotes || "");
        }
      },
      (err) => console.error("Quote listener error:", err)
    );
    return () => unsub();
  }, [authLoading, quoteDocId]);

  /* ── Messages listener ── */
  useEffect(() => {
    if (authLoading || !quoteDocId) return;
    const q = query(
      collection(db, "quotes", quoteDocId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const msgs: MessageData[] = snap.docs.map((d) => ({
          id: d.id,
          sender: d.data().sender || "client",
          content: d.data().content || "",
          createdAt: d.data().createdAt || null,
        }));
        setMessages(msgs);
      },
      (err) => console.error("Messages listener error:", err)
    );
    return () => unsub();
  }, [authLoading, quoteDocId]);

  /* ── Auto-scroll messages ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Get auth token ── */
  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  };

  /* ── Send reply ── */
  const handleReply = async () => {
    if (!replyContent.trim() || replySending) return;
    setReplySending(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`/api/quotes/${quoteDocId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: replyContent.trim() }),
      });
      if (res.ok) {
        setReplyContent("");
      } else {
        const data = await res.json();
        console.error("Reply failed:", data.error);
      }
    } catch (err) {
      console.error("Reply error:", err);
    } finally {
      setReplySending(false);
    }
  };

  /* ── Update status ── */
  const handleStatusChange = async (newStatus: QuoteStatus) => {
    if (statusUpdating) return;
    setStatusUpdating(true);
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`/api/quotes/${quoteDocId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  /* ── Save notes ── */
  const handleSaveNotes = async () => {
    if (notesSaving) return;
    setNotesSaving(true);
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`/api/quotes/${quoteDocId}/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ internalNotes: notesContent }),
      });
    } catch (err) {
      console.error("Notes save error:", err);
    } finally {
      setNotesSaving(false);
    }
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return "—";
    try {
      const d =
        typeof ts.toDate === "function"
          ? ts.toDate()
          : new Date(ts as unknown as string);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const formatMessageTime = (ts: Timestamp | null) => {
    if (!ts) return "";
    try {
      const d =
        typeof ts.toDate === "function"
          ? ts.toDate()
          : new Date(ts as unknown as string);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleTimeString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  if (authLoading || !quote) {
    return (
      <div className="min-h-screen bg-[#020104] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-fuchsia-500/40 border-t-fuchsia-400 rounded-full animate-spin" />
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">
            Loading Quote
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[quote.status] || STATUS_LABELS.new;

  return (
    <div className="min-h-screen bg-[#020104] text-white relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(126,34,206,0.2)_0%,transparent_60%)] rounded-full blur-[100px]" />
      </div>
      <div
        className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/admin/quotes")}
            className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg md:text-xl font-medium tracking-tight">
              {quote.fullName}
            </h1>
            <p className="text-fuchsia-300/60 text-xs font-mono mt-0.5">
              {quote.quoteId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
            <select
              value={quote.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as QuoteStatus)
              }
              disabled={statusUpdating}
              className="bg-white/[0.04] border border-white/10 rounded-full px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-white/70 focus:outline-none focus:border-fuchsia-500/30 appearance-none cursor-pointer disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: "32px",
              }}
            >
              {QUOTE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s].label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quote Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client Info Card */}
            <div className="bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[60px] border border-white/10 border-b-black/80 rounded-2xl p-6">
              <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/30 mb-5">
                Client Details
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Email", value: quote.email },
                  { label: "Phone", value: quote.phone || "—" },
                  { label: "Company", value: quote.company || "—" },
                  { label: "Budget", value: quote.budgetRange || "—" },
                  { label: "Submitted", value: formatDate(quote.createdAt) },
                  { label: "Updated", value: formatDate(quote.updatedAt) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-white/70 font-light break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Card */}
            <div className="bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[60px] border border-white/10 border-b-black/80 rounded-2xl p-6">
              <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/30 mb-4">
                Services Requested
              </h3>
              <div className="flex flex-wrap gap-2">
                {quote.services.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/[0.1] text-purple-300/80 border border-purple-500/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Description Card */}
            <div className="bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[60px] border border-white/10 border-b-black/80 rounded-2xl p-6">
              <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/30 mb-4">
                Project Description
              </h3>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                {quote.projectDescription}
              </p>
            </div>

            {/* Internal Notes Card */}
            <div className="bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[60px] border border-white/10 border-b-black/80 rounded-2xl p-6">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-amber-400/60">
                  Internal Notes
                </h3>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/30"
                  style={{
                    transform: showNotes ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showNotes && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={notesContent}
                    onChange={(e) => setNotesContent(e.target.value)}
                    placeholder="Add private notes about this lead..."
                    className="w-full bg-amber-500/[0.04] border border-amber-500/10 rounded-xl px-4 py-3 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-amber-500/25 resize-none font-light leading-relaxed"
                    rows={4}
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={notesSaving}
                    className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all border ${
                      notesSaving
                        ? "opacity-50 cursor-wait border-white/5 text-white/30"
                        : "border-amber-500/20 text-amber-300/70 hover:bg-amber-500/[0.06] hover:text-amber-300"
                    }`}
                  >
                    {notesSaving ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Conversation */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[60px] border border-white/10 border-b-black/80 rounded-2xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}>
              {/* Conversation Header */}
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white/90">
                    Conversation
                  </h3>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-bold mt-0.5">
                    {messages.length} message{messages.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] tracking-[0.15em] uppercase text-emerald-400/70 font-bold">
                    Realtime
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/20 text-sm">
                      No messages yet
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                          msg.sender === "admin"
                            ? "bg-purple-500/[0.12] border border-purple-500/15 rounded-br-md"
                            : "bg-white/[0.04] border border-white/[0.06] rounded-bl-md"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`text-[9px] font-bold tracking-[0.2em] uppercase ${
                              msg.sender === "admin"
                                ? "text-purple-300/60"
                                : "text-white/30"
                            }`}
                          >
                            {msg.sender === "admin" ? "You" : quote.fullName}
                          </span>
                          <span className="text-[9px] text-white/15">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Composer with Client Context */}
              <div className="border-t border-white/[0.06] bg-[#020104]/50">
                {/* Client Context Header */}
                <div className="px-6 py-4 border-b border-white/[0.03] bg-purple-500/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2z" />
                    </svg>
                    <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-purple-300/80">
                      Reply to {quote.fullName}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4">
                    <div>
                      <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-bold mb-0.5">Email</p>
                      <p className="text-xs text-white/70 truncate">{quote.email}</p>
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-bold mb-0.5">Phone</p>
                      <p className="text-xs text-white/70 truncate">{quote.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-bold mb-0.5">Company</p>
                      <p className="text-xs text-white/70 truncate">{quote.company || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-bold mb-0.5">Budget</p>
                      <p className="text-xs text-white/70 truncate">{quote.budgetRange || "—"}</p>
                    </div>
                    <div className="col-span-2 md:col-span-4 mt-1">
                      <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-bold mb-1">Services Requested</p>
                      <div className="flex flex-wrap gap-1.5">
                        {quote.services.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-white/[0.05] text-[9px] text-white/60 uppercase tracking-wider">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex gap-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your email reply..."
                      className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-fuchsia-500/30 resize-none"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          handleReply();
                        }
                      }}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyContent.trim() || replySending}
                      className={`self-end px-5 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all ${
                        !replyContent.trim() || replySending
                          ? "bg-white/[0.03] text-white/20 cursor-not-allowed"
                          : "bg-gradient-to-b from-fuchsia-500 to-purple-700 text-white hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)]"
                      }`}
                    >
                      {replySending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          Sending
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          Send
                        </span>
                      )}
                    </button>
                  </div>
                  <p className="text-[9px] text-white/15 mt-2 ml-1">
                    Ctrl+Enter to send · Reply will be emailed directly to {quote.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
