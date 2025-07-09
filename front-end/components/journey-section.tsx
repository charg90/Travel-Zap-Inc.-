import { ArrowRight, Film } from "lucide-react";
import React from "react";

type Props = {
  handleGetStarted: () => void;
};

function JourneySection({ handleGetStarted }: Props) {
  return (
    <section className="relative px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Start Your Movie Journey?
        </h2>
        <p className="text-xl text-white/80 mb-8">
          Join thousands of movie lovers and discover your next favorite film
          today.
        </p>

        <button
          onClick={handleGetStarted}
          className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <Film className="size-6" />
          Start Exploring
          <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}

export default JourneySection;
