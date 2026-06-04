"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './MainAdventure.module.css';

import LettersSection from './LettersSection';

interface MainAdventureProps {
  spotifyUrl?: string;
  photos: any[];
  letters: any[];
}

export default function MainAdventure({ spotifyUrl, photos, letters }: MainAdventureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
      );
    }
  }, []);

  const playlistUrls = spotifyUrl 
    ? spotifyUrl.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean)
    : [];

  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);

  const activeUrl = playlistUrls[selectedPlaylistIndex] || "";

  let embedUrl = "";
  if (activeUrl) {
    if (activeUrl.includes('/embed/')) {
      embedUrl = activeUrl;
    } else {
      embedUrl = activeUrl.replace('spotify.com/', 'spotify.com/embed/');
    }
  }

  const closeModal = () => setSelectedPhoto(null);

  return (
    <>
      <div className={styles.container} ref={containerRef}>
        <header className={styles.header}>
          <h1 className="romantic-text title-glow">Feliz Aniversário, Meu Amor!</h1>
          <p>Bem-vinda à sua exposição de arte particular.</p>
          
          {playlistUrls.length > 1 && (
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {playlistUrls.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedPlaylistIndex(i)}
                  style={{
                    background: selectedPlaylistIndex === i ? 'var(--color-her-pink)' : 'transparent',
                    color: selectedPlaylistIndex === i ? 'white' : 'var(--color-her-pink)',
                    border: '1px solid var(--color-her-pink)',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-romantic)',
                    fontSize: '1.2rem'
                  }}
                >
                  Playlist {i + 1}
                </button>
              ))}
            </div>
          )}

          {embedUrl && (
            <div className={styles.playerContainer}>
              <iframe 
                src={`${embedUrl}?theme=0`} 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          )}
        </header>

        <section className={styles.gallery}>
          {photos && photos.length > 0 ? (
            photos.map((photo, index) => (
              <div 
                className={styles.polaroid} 
                key={photo.id} 
                style={{ transform: `rotate(${index % 2 === 0 ? 4 : -3}deg)` }}
                onClick={() => setSelectedPhoto(photo.url)}
              >
                <div className={styles.photoPlaceholder} style={{ background: 'transparent' }}>
                  <img src={photo.url} alt="Moment" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                </div>
                <p className={styles.caption}>Lembrança {index + 1}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma foto foi enviada ainda. Adicione no painel administrativo!</p>
          )}
        </section>

        {letters && letters.length > 0 && (
          <LettersSection letters={letters} />
        )}

        <footer className={styles.footer}>
          <p className="romantic-text">Com todo meu amor, para sempre.</p>
        </footer>
      </div>

      {selectedPhoto && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <button className={styles.closeButton} onClick={closeModal}>✕</button>
          <img 
            src={selectedPhoto} 
            alt="Enlarged Moment" 
            className={styles.modalImage} 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
}
