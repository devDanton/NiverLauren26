"use client";

import { useState, useEffect } from 'react';
import styles from './LockScreen.module.css';

interface LockScreenProps {
  onUnlock: () => void;
  targetDateStr: string; // ISO string e.g., "2026-06-05T00:00:00"
}

export default function LockScreen({ onUnlock, targetDateStr }: LockScreenProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const targetDate = new Date(targetDateStr).getTime();

    const checkTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsUnlocked(true);
        setShowEnterButton(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true; // time reached
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
        return false;
      }
    };

    if (checkTime()) return;

    const interval = setInterval(() => {
      if (checkTime()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!isLoaded) return null; // Avoid hydration mismatch

  if (!isUnlocked && !showEnterButton) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={`${styles.title} title-glow`}>Aventura Surpresa...</h1>
          <p className={styles.subtitle}>Algo especial está sendo preparado para você.</p>
          
          <div className={styles.timer}>
            <div className={styles.timeBox}>
              <span className={styles.timeValue}>{timeLeft.days}</span>
              <span className={styles.timeLabel}>Dias</span>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeValue}>{timeLeft.hours}</span>
              <span className={styles.timeLabel}>Horas</span>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeValue}>{timeLeft.minutes}</span>
              <span className={styles.timeLabel}>Min</span>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeValue}>{timeLeft.seconds}</span>
              <span className={styles.timeLabel}>Seg</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se já passou da data
  if (isUnlocked && showEnterButton) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={`${styles.title} romantic-text`}>Chegou a Hora!</h1>
          <p className={styles.subtitle}>A sua surpresa está pronta.</p>
          <button className={styles.enterButton} onClick={onUnlock}>
            Começar Aventura
          </button>
        </div>
      </div>
    );
  }

  return null;
}
