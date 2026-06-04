"use client";

import { useState } from 'react';
import LockScreen from '@/components/LockScreen';
import MainAdventure from '@/components/MainAdventure';

export default function Home() {
  const [isLocked, setIsLocked] = useState(true);

  // Data do aniversário: 05/06/2026 meia-noite
  const targetDateStr = "2026-06-05T00:00:00"; 

  const handleUnlock = () => {
    setIsLocked(false);
  };

  return (
    <main>
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} targetDateStr={targetDateStr} />
      ) : (
        <MainAdventure />
      )}
    </main>
  );
}
