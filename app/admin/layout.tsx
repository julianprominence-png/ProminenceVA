import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prominence Admin",
  description: "Admin dashboard for Prominence contact management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
