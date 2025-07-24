import React, { useState } from 'react';
import { ProductGridProps } from '../../../../components/product_grid/ProductGrid';
import styles from './ProductGrid.module.css';
import { useRouter } from 'next/router';

const ProductGrid: React.FC<ProductGridProps> = ({ 
  productCards, 
  title,
  discountBadgeColor,
  discountBadgeTextColor 
}) => {
  const router = useRouter();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

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
    <div className={styles.productGrid}>
      <div className={styles.gridHeader}>
        <h2 className={styles.gridTitle}>{title || 'Featured Products'}</h2>
      </div>
      
      <div className={styles.productsContainer}>
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
                <span className={styles.discountBadge} style={{
                  backgroundColor: discountBadgeColor || '#ff5a5f',
                  color: discountBadgeTextColor || 'white'
                }}>
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
    </div>
  );
};

export default ProductGrid;