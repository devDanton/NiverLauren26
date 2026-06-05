"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './LettersSection.module.css';

interface LettersSectionProps {
  letters: any[];
}

export default function LettersSection({ letters }: LettersSectionProps) {
  const [openLetterId, setOpenLetterId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!letters || letters.length === 0) return null;

  const getEnvelopeClass = (relationship: string) => {
    switch (relationship) {
      case 'esposo': return styles.envelopeEsposo;
      case 'pais': return styles.envelopePais;
      case 'irmaos': return styles.envelopeIrmaos;
      case 'avos': return styles.envelopeAvos;
      case 'amigos': return styles.envelopeAmigos;
      default: return styles.envelopeAmigos;
    }
  };

  const getPaperClass = (relationship: string) => {
    switch (relationship) {
      case 'esposo': return styles.esposoPaper;
      case 'pais': return styles.paisPaper;
      case 'irmaos': return styles.irmaosPaper;
      case 'avos': return styles.avosPaper;
      case 'amigos': return styles.amigosPaper;
      default: return styles.amigosPaper;
    }
  };

  const openedLetter = letters.find(l => l.id === openLetterId);

  return (
    <div className={styles.container}>
      <h2 className={`romantic-text title-glow ${styles.sectionTitle}`}>Mensagens Especiais</h2>
      <p className={styles.sectionSubtitle}>Algumas pessoas guardaram palavras preciosas para você...</p>

      <div className={styles.envelopesGrid}>
        {letters.map((letter) => (
          <div 
            key={letter.id} 
            className={`${styles.envelopeWrapper} ${getEnvelopeClass(letter.relationship)}`}
            onClick={() => setOpenLetterId(letter.id)}
          >
            <div className={styles.envelope}>
              <div className={styles.envelopeFlap}></div>
              <div className={styles.envelopeSeal}></div>
              <p className={styles.envelopeText}>
                Para: Lauren<br/>
                <span style={{ fontSize: '0.8em', opacity: 0.8 }}>De: {letter.sender_name}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {openedLetter && mounted && createPortal(
        <div className={styles.modalOverlay} onClick={() => setOpenLetterId(null)}>
          <div className={`${styles.letterPaperContainer} ${getPaperClass(openedLetter.relationship)}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setOpenLetterId(null)}>✕</button>
            
            {openedLetter.relationship === 'esposo' && <div className={styles.floatingHearts}>❤️❤️❤️</div>}
            {openedLetter.relationship === 'amigos' && <div className={styles.confetti}>✨🎉✨</div>}
            
            <h3 className={styles.letterHeader}>De: {openedLetter.sender_name}</h3>
            <div className={styles.letterContent}>
              {openedLetter.content}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
