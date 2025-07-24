import React from 'react'

export type ProductCard = {
    imageUrls: string[]; // two images for the product
    productAttributes:Record<string,any> // attributes of the product, such as size, color, etc.
    productId: string; // Unique identifier for the product
    title: string;
    price: number;
    discount?: number; // Optional discount percentage
    link: string; // Link to the product details page
}

export type ProductCaruselProps = {
    defualtLayout: string;
    headerBackgroundColor?: string; // Optional background color for the header
    headerTextColor?: string; // Optional text color for the header
    headerFontSize?: string; // Optional font size for the header
    customLayout?: string; // Optional custom layout for the product carousel
    discountBadgeColor?: string; // Optional color for the discount badge
    discountBadgeTextColor?: string; // Optional text for the discount badge
    productCards: ProductCard[]; // Array of product cards to display in the carousel
    title?: string; // Optional title for the product carousel
}

const ProductCarusel:React.FC<ProductCaruselProps> = ({...props}) => {

    const ProductCaruselLayout = require(`../../layouts/${props.customLayout?props.customLayout:props.defualtLayout}/components/product_carusel/ProductCarusel.tsx`).default;

  return <ProductCaruselLayout {...props} />
}

export default ProductCarusel