"use client";

import { Menu, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="size-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {session?.user.name}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user.name}
                  </p>
                  <p className="text-xs text-gray-500">{session?.user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
