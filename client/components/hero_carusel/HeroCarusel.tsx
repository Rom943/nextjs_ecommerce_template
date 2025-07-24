import React from 'react'

export type HeroSlide ={
    backgroundUrl: string; // URL of the background image
    title: string; // Title of the slide
    description: string; // Description of the slide
    buttonText?: string; // Optional text for a button
    buttonLink?: string; // Optional link for the button
    backgroundType?: "image" | "video"; // Type of background, either image or video
}

export type HeroCaruselProps = {
  defualtLayout: string; // Default layout for the hero carousel
  customLayout?: string; // Optional custom layout for the hero carousel
  slides: HeroSlide[]; // Array of slides for the carousel
  autoPlay?: boolean; // Optional autoplay feature for the carousel
  autoPlayInterval?: number; // Optional interval for autoplay in milliseconds
}

const HeroCarusel:React.FC<HeroCaruselProps> = ({...props}) => {

    const HeroCaruselLayout = require(`../../layouts/${props.customLayout ? props.customLayout : props.defualtLayout}/components/hero_carusel/HeroCarusel.tsx`).default;

  return <HeroCaruselLayout {...props}/>
}

export default HeroCarusel