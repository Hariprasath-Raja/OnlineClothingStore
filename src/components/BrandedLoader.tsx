import React, { useState, useEffect } from 'react';

interface BrandedLoaderProps {
  onComplete: () => void;
  brandName?: string;
  tagline?: string;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  onComplete,
  brandName = 'AETHER ATELIER',
  tagline = 'GETTING YOUR STYLE READY...',
}) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Quick, smooth simulation from 0 to 100% over ~1.1s
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 400);
          }, 200);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 12;
        return Math.min(100, prev + increment);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111111] text-white transition-opacity duration-400 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        
        {/* Animated T-Shirt Illustration Outline */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg
            className="w-20 h-20 text-neutral-400 transition-all duration-300 transform scale-100"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* T-Shirt Neck and Collar */}
            <path
              d="M24 12 C 28 17, 36 17, 40 12"
              className="text-white animate-pulse"
              strokeWidth="2.5"
            />
            {/* T-Shirt Body Outline */}
            <path
              d="M24 12 L 14 18 L 8 28 L 18 33 L 20 25 L 20 54 L 44 54 L 44 25 L 46 33 L 56 28 L 50 18 L 40 12"
              className="stroke-neutral-300"
            />
            {/* Subtle Desi / Tamil Kolam dot inside */}
            <circle cx="32" cy="34" r="2.5" fill="white" className="animate-ping" />
          </svg>

          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full border border-white/20 animate-spin duration-3000 pointer-events-none" />
        </div>

        {/* Brand Lockup */}
        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-black uppercase tracking-tight font-display text-white">
            {brandName}
          </div>
          <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">
            CHENNAI · TIRUPPUR · MUMBAI
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-56 space-y-2">
          <div className="w-full bg-neutral-800 h-1 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>{tagline}</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
