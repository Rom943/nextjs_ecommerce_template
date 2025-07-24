import React from 'react'


export type CategorieSlide ={
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

export type CategorieCaruselProps = {
    title: string;
    defualtLayout: string;
    customLayout?: string; // Optional custom layout for the category carousel
    categorySlides: CategorieSlide[];
}

const CategorieCarusel:React.FC<CategorieCaruselProps> = ({...props}) => {

const CategorieCaruselLayout = require(`../../layouts/${props.customLayout? props.customLayout:props.defualtLayout}/components/categorie_carusel/CategorieCarusel.tsx`).default;

  return <CategorieCaruselLayout {...props} />
}

export default CategorieCarusel