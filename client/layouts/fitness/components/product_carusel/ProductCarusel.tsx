import React, { useState, useRef, useEffect } from 'react';
import { ProductCaruselProps } from '../../../../components/product_carusel/ProductCarusel';
import styles from './ProductCarusel.module.css';
import { useRouter } from 'next/router';

const ProductCarusel: React.FC<ProductCaruselProps> = ({ productCards, title,discountBadgeColor,discountBadgeTextColor,headerTextColor,headerFontSize,headerBackgroundColor}) => {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(()=>{
    const screenWidth = window.innerWidth;
    setScreenWidth(screenWidth);
  },[])

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (productId: string, productTitle: string) => {
    // This would normally add the product to cart
    console.log(`Added product ${productId} to cart`);
    // For now, just show an alert
    alert(`Added ${productTitle} to cart!`);
  };

  const navigateToProduct = (link: string) => {
    router.push(link);
  };

  if (!productCards || productCards.length === 0) {
    return null;
  }

  return (
    <div className={styles.productCarousel}>
      <div style ={{ backgroundColor: headerBackgroundColor?headerBackgroundColor:"" }} className={styles.carouselHeader} >
        <h2 style={{ color: headerTextColor?headerTextColor:"", fontSize: headerFontSize?headerFontSize:"" }} className={styles.carouselTitle} >{title || 'Featured Products'}</h2>
      </div>
      
      <div className={styles.productsContainer} ref={carouselRef}>
        {productCards.map((product, index) => (
          <div 
            key={`${product.productId}-${index}`} 
            className={styles.productCard}
            onMouseEnter={() => setHoveredProduct(product.productId)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className={styles.imageContainer}>
              <img 
                src={hoveredProduct === product.productId && product.imageUrls.length > 1 
                  ? product.imageUrls[1] 
                  : product.imageUrls[0]} 
                alt={product.title} 
                className={styles.productImage}
              />
              {product.discount && (
                <span className={styles.discountBadge} style={{backgroundColor:`${discountBadgeColor?discountBadgeColor:""}`,color:`${discountBadgeTextColor?discountBadgeTextColor:""}`}} >
                  {product.discount}% הנחה
                </span>
              )}
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <div className={styles.priceContainer}>
                {product.discount ? (
                  <>
                    <span className={styles.discountedPrice}>
                      ₪{product.price.toFixed(2)}
                    </span>
                    <span className={styles.productPrice}>
                      ₪{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className={styles.productPrice}>
                    ₪{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className={styles.attributesContainer}>
                {Object.entries(product.productAttributes).map(([key, value]) => (
                  <div className={styles.attributeBox} key={key}>
                    <span className={styles.attributeLabel}>{key}:</span>
                    <span className={styles.attributeValue}>{value}</span>
                  </div>
                ))}
              </div>
              
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.viewButton} 
                  onClick={() => navigateToProduct(product.link)}
                >
                  הצג מוצר
                </button>
                <button 
                  className={styles.cartButton} 
                  onClick={() => handleAddToCart(product.productId, product.title)}
                >
                  הוספה לסל
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {screenWidth > 768 &&
      <div className={styles.navigationControls}>
        <button onClick={scrollLeft} className={`${styles.navButton} ${styles.navButton_left}`}>
          &#10094;
        </button>
        <button onClick={scrollRight} className={`${styles.navButton} ${styles.navButton_right}`}>
          &#10095;
        </button>
      </div>}

    </div>
  );
};

export default ProductCarusel;