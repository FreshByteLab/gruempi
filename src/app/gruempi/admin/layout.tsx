import { auth } from "@/lib/gruempi/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/gruempi/layout/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { template: "%s | Admin – Grümpelturnier", default: "Admin – Grümpelturnier" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/gruempi/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
