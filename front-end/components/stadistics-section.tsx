import React from "react";

function StadisticsSection() {
  return (
    <section className="relative px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70">Movies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5K+</div>
              <div className="text-white/70">Actors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-white/70">Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70">Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StadisticsSection;
