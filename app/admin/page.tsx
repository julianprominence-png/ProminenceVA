"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  readByAdmin: boolean;
  emailSent: boolean;
  status: string;
  createdAt: Timestamp | null;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // REALTIME listener — replaces one-time getDocs
  useEffect(() => {
    if (authLoading) return;
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: ContactRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          name: d.data().name || "",
          email: d.data().email || "",
          message: d.data().message || "",
          readByAdmin: d.data().readByAdmin ?? true,
          emailSent: d.data().emailSent ?? false,
          status: d.data().status || "unknown",
          createdAt: d.data().createdAt || null,
        }));
        setContacts(data);
        setDataLoading(false);
      },
      (err) => {
        console.error("Realtime listener error:", err);
        setDataLoading(false);
      }
    );
    return () => unsubscribe();
  }, [authLoading]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), { readByAdmin: true });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const unreadCount = contacts.filter((c) => !c.readByAdmin).length;
  // Safe date extractor
  const getDate = (val: any): Date | null => {
    if (!val) return null;
    if (typeof val.toDate === "function") return val.toDate();
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const contactsToday = contacts.filter((c) => {
    const d = getDate(c.createdAt);
    return d && d >= todayStart;
  }).length;
  const contactsWeek = contacts.filter((c) => {
    const d = getDate(c.createdAt);
    return d && d >= weekStart;
  }).length;
  const contactsMonth = contacts.filter((c) => {
    const d = getDate(c.createdAt);
    return d && d >= monthStart;
  }).length;

  const formatDate = (ts: any) => {
    const d = getDate(ts);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020104] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-fuchsia-500/40 border-t-fuchsia-400 rounded-full animate-spin" />
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">Verifying Access</p>
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

      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-3 h-3 rounded-full bg-fuchsia-500/60 animate-ping" />
              <div className="relative w-2 h-2 rounded-full bg-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,1)]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-medium tracking-tight">
                Command Center
              </h1>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-bold mt-1">
                Prominence Admin Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Realtime indicator */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05]">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-[9px] tracking-[0.2em] uppercase text-emerald-400/80 font-bold">Live</span>
            </div>
            {/* Unread badge */}
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/[0.08]">
                <span className="text-[9px] tracking-[0.2em] uppercase text-fuchsia-300 font-bold">{unreadCount} Unread</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 border-b-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full px-5 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase text-red-300/80 hover:text-red-200 hover:border-red-500/40 transition-all"
            >
              Disconnect
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
          {[
            { label: "Total Signals", value: contacts.length, glow: "rgba(217,70,239,0.3)" },
            { label: "Unread", value: unreadCount, glow: "rgba(251,146,60,0.3)" },
            { label: "Today", value: contactsToday, glow: "rgba(52,211,153,0.3)" },
            { label: "This Week", value: contactsWeek, glow: "rgba(96,165,250,0.3)" },
            { label: "This Month", value: contactsMonth, glow: "rgba(168,85,247,0.3)" },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[60px] border border-white/10 border-b-black/80 border-r-black/50 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.5)] rounded-2xl p-5 md:p-6 group hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.9)] transition-all duration-500"
            >
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${stat.glow}, transparent)` }}
              />
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/40 mb-3 relative z-10">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-light tracking-tight relative z-10">
                {dataLoading ? <span className="inline-block w-10 h-8 bg-white/5 rounded-lg animate-pulse" /> : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Contacts Table */}
        <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-[#020104]/90 backdrop-blur-[60px] border border-white/10 border-b-black/80 shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-3xl">
          {/* Table header */}
          <div className="px-6 md:px-8 py-5 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium">Contact Records</h2>
              <p className="text-white/30 text-[10px] tracking-[0.15em] uppercase mt-1">
                {contacts.length} total transmissions · Realtime sync active
              </p>
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          {dataLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-6 h-6 border-2 border-fuchsia-500/40 border-t-fuchsia-400 rounded-full animate-spin" />
                <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Syncing records...</p>
              </div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#010002]/80 border border-white/5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">No contact records yet</p>
              <p className="text-white/15 text-xs mt-2">Submissions will appear here in realtime</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      <th className="w-4 px-4 py-4" />
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">Name</th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">Email</th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">Message</th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">Status</th>
                      <th className="text-left px-6 py-4 text-[9px] font-bold tracking-[0.25em] uppercase text-white/30">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContacts.map((contact, idx) => (
                      <tr
                        key={contact.id}
                        onClick={() => {
                          setExpandedId(expandedId === contact.id ? null : contact.id);
                          if (!contact.readByAdmin) markAsRead(contact.id);
                        }}
                        className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer ${
                          idx % 2 === 0 ? "bg-white/[0.01]" : ""
                        } ${!contact.readByAdmin ? "bg-fuchsia-500/[0.03]" : ""}`}
                      >
                        <td className="px-4 py-5">
                          {!contact.readByAdmin && (
                            <div className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-sm font-medium ${!contact.readByAdmin ? "text-white" : "text-white/90"}`}>{contact.name}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-fuchsia-300/80 font-light">{contact.email}</span>
                        </td>
                        <td className="px-6 py-5 max-w-xs">
                          <p className="text-sm text-white/60 font-light truncate">{contact.message}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${contact.emailSent ? "bg-emerald-400" : "bg-yellow-400"}`} />
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">{contact.emailSent ? "Email sent" : "Stored"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[11px] text-white/40 font-light whitespace-nowrap">{formatDate(contact.createdAt)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-white/[0.04]">
                {paginatedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-5 space-y-3 ${!contact.readByAdmin ? "bg-fuchsia-500/[0.03]" : ""}`}
                    onClick={() => {
                      setExpandedId(expandedId === contact.id ? null : contact.id);
                      if (!contact.readByAdmin) markAsRead(contact.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!contact.readByAdmin && <div className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />}
                        <span className="text-sm font-medium text-white/90">{contact.name}</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-light">{formatDate(contact.createdAt)}</span>
                    </div>
                    <p className="text-xs text-fuchsia-300/80">{contact.email}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{expandedId === contact.id ? contact.message : contact.message.slice(0, 100) + (contact.message.length > 100 ? "…" : "")}</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${contact.emailSent ? "bg-emerald-400" : "bg-yellow-400"}`} />
                      <span className="text-[9px] text-white/30 uppercase tracking-wider">{contact.emailSent ? "Email sent" : "Stored only"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 md:px-8 py-5 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 border-b-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full px-5 py-2.5 text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                      currentPage === 1 ? "opacity-30 cursor-not-allowed" : "text-white/70 hover:text-white hover:border-fuchsia-500/40"
                    }`}
                  >
                    ← Previous
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all duration-300 ${
                          page === currentPage
                            ? "bg-gradient-to-b from-fuchsia-500 to-purple-700 text-white shadow-[0_4px_15px_rgba(217,70,239,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                            : "text-white/30 hover:text-white/60 hover:bg-white/[0.05]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 border-b-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full px-5 py-2.5 text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                      currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "text-white/70 hover:text-white hover:border-fuchsia-500/40"
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
            © {new Date().getFullYear()} Prominence Admin · Authorized Access Only
          </p>
        </footer>
      </div>
    </div>
  );
}
