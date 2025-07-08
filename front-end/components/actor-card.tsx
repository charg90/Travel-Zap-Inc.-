"use client";

import { Film } from "lucide-react";
import Link from "next/link";
import { Actor } from "../types";

interface ActorCardProps {
  actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
  return (
    <Link href={`/dashboard/actors/${actor.id}`}>
      <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {actor.name} {actor.lastName}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Film className="size-4" />
            <span>{actor.movies?.length || 0} movies</span>
          </div>

          {actor.movies && actor.movies.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Movies:</span>{" "}
              {actor.movies.slice(0, 3).join(", ")}
              {actor.movies.length > 3 && "..."}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
