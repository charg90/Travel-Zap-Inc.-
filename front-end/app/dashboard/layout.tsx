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
  //   const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //   if (!user) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  //       </div>
  //     )
  //   }

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
