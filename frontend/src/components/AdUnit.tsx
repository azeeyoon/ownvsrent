import { useEffect, useRef } from 'react';

// Set to true when AdSense is activated and serving ads
const ADS_ENABLED = false;

interface AdUnitProps {
  slot: string;
  format: 'leaderboard' | 'rectangle' | 'in-article';
  className?: string;
}

export function AdUnit({ slot, format, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED) return;
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

  // Ads disabled - render nothing
  if (!ADS_ENABLED) {
    return null;
  }

  // In development, show placeholder
  if (!import.meta.env.PROD) {
    const placeholderHeight = format === 'leaderboard' ? 90 : format === 'rectangle' ? 250 : 280;
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm w-full max-w-full ${className}`}
        style={{ height: placeholderHeight }}
      >
        Ad Placeholder ({format})
      </div>
    );
  }

  // In production, use responsive AdSense
  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block w-full ${className}`}
      style={{ display: 'block' }}
      data-ad-client={import.meta.env.VITE_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
