import React from 'react'

export type FooterLink = {
    name: string; // Name of the link
    url: string; // URL of the link
    icon?: string; // Optional icon for the link
}

export type FooterSection = {
    title: string; // Title of the footer section
    links: FooterLink[]; // Array of links in the section
    backgroundColor?: string; // Optional background color for the section
    textColor?: string; // Optional text color for the section
    fontSize?: string; // Optional font size for the section
}


export type FooterProps = {
    defaultLayout: string; // Default layout for the footer
    footer:{
    customLayout?: string; // Optional custom layout for the footer
    backgroundColor?: string; // Optional background color for the footer
    textColor?: string; // Optional text color for the footer
    fontSize?: string; // Optional font size for the footer
    position?: string; // Optional position for the footer
    siteLogoUrl?: string; // Optional URL for the site logo
    siteLogoAltText?: string; // Optional alt text for the site logo
    siteLogoSize?:{ width: string; height: string }; // Optional size for the site logo
    socialSection?: FooterSection; // Optional section for social media links
    linksSection?: FooterSection; // Optional section for general links
    contactSection?: FooterSection; // Optional section for contact information
    categorySection?: FooterSection; // Optional section for categories
    };
}

const Footer:React.FC<FooterProps> = ({...props}) => {

  const FooterLayout = require(`../../layouts/${props.footer.customLayout? props.footer.customLayout:props.defaultLayout}/components/footer/Footer.tsx`).default;

  return <FooterLayout {...props} />
}

export default Footer