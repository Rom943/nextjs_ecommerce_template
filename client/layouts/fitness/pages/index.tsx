import React from "react";
import HeroCarusel from "../../../components/hero_carusel/HeroCarusel";
import CategorieCarusel from "../../../components/categorie_carusel/CategorieCarusel";
import ProductCarusel from "../../../components/product_carusel/ProductCarusel";
import ProductGrid from "../../../components/product_grid/ProductGrid";

interface HomeProps {
  page?: any;
  defualtLayout: string;
}

const Home: React.FC<HomeProps> = ({ page, defualtLayout }) => {
  return (
    <div>
      <HeroCarusel
        slides={page.heroCarusel.heroSlides}
        defualtLayout={defualtLayout}
        autoPlay={page.heroCarusel.autoPlay}
        autoPlayInterval={page.heroCarusel.autoPlayInterval}
      />
      <ProductCarusel
        defualtLayout={page.productCarusel.defualtLayout}
        customLayout={page.productCarusel.customLayout}
        productCards={page.productCarusel.productCards}
        title={page.productCarusel.title}
        discountBadgeColor={page.productCarusel.discountBadgeColor}
        discountBadgeTextColor={page.productCarusel.discountBadgeTextColor}
      />
      <CategorieCarusel
        defualtLayout={defualtLayout}
        categorySlides={page.categoryCarusel.categorySlides}
        customLayout={page.categoryCarusel.customLayout}
        title={page.categoryCarusel.title}
      />
      <ProductGrid
        defualtLayout={page.productGrid.defualtLayout}
        customLayout={page.productGrid.customLayout}
        productCards={page.productGrid.productCards}
        title={page.productGrid.title}
        discountBadgeColor={page.productGrid.discountBadgeColor}
        discountBadgeTextColor={page.productGrid.discountBadgeTextColor}
      />
    </div>
  );
};

export default Home;
