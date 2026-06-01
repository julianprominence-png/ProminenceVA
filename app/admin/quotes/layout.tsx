import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quote Management — Prominence Admin",
  description: "Manage client quote requests and conversations",
};

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
