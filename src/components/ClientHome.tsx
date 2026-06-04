"use client";

import { useState } from 'react';
import LockScreen from '@/components/LockScreen';
import MainAdventure from '@/components/MainAdventure';

interface ClientHomeProps {
  targetDateStr: string;
  spotifyUrl: string;
  photos: any[];
  letters: any[];
}

export default function ClientHome({ targetDateStr, spotifyUrl, photos, letters }: ClientHomeProps) {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  return (
    <main>
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} targetDateStr={targetDateStr} />
      ) : (
        <MainAdventure spotifyUrl={spotifyUrl} photos={photos} letters={letters} />
      )}
    </main>
  );
}
