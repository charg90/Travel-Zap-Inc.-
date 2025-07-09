import { Film } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type Props = {
  session: Session | null;
};

function HomeNav({ session }: Props) {
  return (
    <nav className="relative z-10 px-4 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 bg-white/10 backdrop-blur-sm rounded-full">
            <Film className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Movie App</span>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-white/80">
                Welcome, {session.user?.name}
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default HomeNav;
