import React, { useState, useEffect, useCallback } from 'react';
import { HeroCaruselProps } from '../../../../components/hero_carusel/HeroCarusel';
import styles from './HeroCarusel.module.css';

const HeroCarusel: React.FC<HeroCaruselProps> = ({ 
  slides, 
  autoPlay, 
  autoPlayInterval 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const nextSlide = useCallback(() => {
    setCurrentSlide(prevSlide => 
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide(prevSlide => 
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, nextSlide, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className={styles.heroCarousel}>
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          style={{ 
            backgroundImage: slide.backgroundType !== 'video' ? `url(${slide.backgroundUrl})` : 'none',
            backgroundColor: '#000' 
          }}
        >
          {slide.backgroundType === 'video' && (
            <video autoPlay loop muted style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}>
              <source src={slide.backgroundUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          
          <div className={styles.slideContent}>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            {slide.buttonText && (
              <button 
                className={styles.shopButton}
                onClick={() => window.location.href = slide.buttonLink || '#'}
              >
                {slide.buttonText}
              </button>
            )}
          </div>
        </div>
      ))}
      
      <div className={styles.play_control}>
        <button className={styles.controlButton} onClick={togglePlayPause}>
          {isPlaying ?"⏸":"▶"}
        </button>
      </div>

      {/* <div className = {styles.controls}>
                <button className={`${styles.controlButton} ${styles.controlButton_left}`} onClick={prevSlide}>
          ◀
        </button>
        <button className={`${styles.controlButton} ${styles.controlButton_right}`} onClick={nextSlide}>
          ▶
        </button>

      </div> */}
      
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default HeroCarusel;