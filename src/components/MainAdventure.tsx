"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './MainAdventure.module.css';

export default function MainAdventure() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <header className={styles.header}>
        <h1 className="romantic-text">Feliz Aniversário, Meu Amor!</h1>
        <p>Bem-vinda à sua exposição de arte particular.</p>
      </header>

      <section className={styles.gallery}>
        <div className={styles.polaroid}>
          <div className={styles.photoPlaceholder}></div>
          <p className={styles.caption}>Nossos Momentos</p>
        </div>
        <div className={styles.polaroid}>
          <div className={styles.photoPlaceholder}></div>
          <p className={styles.caption}>Viagens Inesquecíveis</p>
        </div>
        <div className={styles.polaroid}>
          <div className={styles.photoPlaceholder}></div>
          <p className={styles.caption}>Nossa Família</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className="romantic-text">Com todo meu amor, para sempre.</p>
      </footer>
    </div>
  );
}
