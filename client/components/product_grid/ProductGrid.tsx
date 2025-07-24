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

export type ProductGridProps = {
    defualtLayout: string;
    customLayout?: string; // Optional custom layout for the product carousel
    discountBadgeColor?: string; // Optional color for the discount badge
    discountBadgeTextColor?: string; // Optional text for the discount badge
    productCards: ProductCard[]; // Array of product cards to display in the carousel
    title?: string; // Optional title for the product carousel
}

const ProductGrid:React.FC<ProductGridProps> = ({...props}) => {

    const ProductGridLayout = require(`../../layouts/${props.customLayout?props.customLayout:props.defualtLayout}/components/product_grid/ProductGrid.tsx`).default;

  return <ProductGridLayout {...props}/>
}


export default ProductGrid