import { Film } from "lucide-react";
import React from "react";

function Footer() {
  return (
    <footer className="relative px-4 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="flex items-center justify-center size-8 bg-white/10 backdrop-blur-sm rounded-full">
              <Film className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Movie App</span>
          </div>

          <div className="text-white/60 text-sm">
            © 2024 Movie App. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
