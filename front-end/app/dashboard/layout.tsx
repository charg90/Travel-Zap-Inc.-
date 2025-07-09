"use client";
import type React from "react";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full ">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="w-full transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
