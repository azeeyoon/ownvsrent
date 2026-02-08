import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format: 'leaderboard' | 'rectangle' | 'in-article';
  className?: string;
}

const formatStyles = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  'in-article': { width: 336, height: 280 },
};

export function AdUnit({ slot, format, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    if (!import.meta.env.PROD) return;

    const pubId = import.meta.env.VITE_ADSENSE_ID;
    if (!pubId) return;

    try {
      // @ts-expect-error - adsbygoogle is added by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch {
      // AdSense not loaded or blocked
    }
  }, []);

  const { width, height } = formatStyles[format];

  if (!import.meta.env.PROD) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ width, height }}
      >
        Ad Placeholder ({format})
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', width, height }}
      data-ad-client={import.meta.env.VITE_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
