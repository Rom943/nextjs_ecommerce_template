import React, { useEffect, useRef } from 'react';
import { CategorieCaruselProps } from '../../../../components/categorie_carusel/CategorieCarusel';
import styles from './CategorieCarusel.module.css';
import { useRouter } from 'next/router';

const CategorieCarusel: React.FC<CategorieCaruselProps> = ({ categorySlides,title}) => {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = React.useState<number>(0);

  useEffect(()=>{
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -500,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 500,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (link: string) => {
    router.push(link);
  };

  if (!categorySlides || categorySlides.length === 0) {
    return null;
  }

  return (
    <div className={styles.categoryCarousel}>
      <h2 className={styles.carouselTitle}>{title}</h2>
      {screenWidth > 768 && 
            <div className={styles.navigationButtons}>
        <button className={styles.navButton} onClick={scrollLeft}>
          ‹
        </button>
        <button className={styles.navButton} onClick={scrollRight}>
          ›
        </button>
      </div>
      }

      
      <div className={styles.carouselContainer} ref={carouselRef}>
        {categorySlides.map((slide, index) => (
          <div key={index} className={styles.carouselItem}>
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className={styles.itemImage} 
            />
            <button 
              className={styles.categoryButton}
              onClick={() => handleCategoryClick(slide.link)}
            >
              {slide.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorieCarusel;