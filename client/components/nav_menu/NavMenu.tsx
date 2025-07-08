import React, { useEffect, useState } from 'react'


type LinkType = {
    link:string;
    title:string;
}

export type NavLinks ={
    main: LinkType;
    sub?: LinkType[];
}

export type NavMenuProps = {
    defualtLayout: string;
    navMenu:{
    navLinks: NavLinks[];
    customLayout?: string;
    }

}

const NavMenu:React.FC<NavMenuProps> = ({defualtLayout,navMenu}) => {


const [screenWidth,setScreenWidth] = useState(0);
    useEffect(() => {
        // Now we're in the browser, so document is available
        setScreenWidth(window.document.documentElement.clientWidth);
        
        // Optional: Add resize listener to update width when window resizes
        const handleResize = () => {
            setScreenWidth(window.document.documentElement.clientWidth);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

console.log("screenWidth",screenWidth);

const NavMenuLayout = require(`../../layouts/${navMenu.customLayout?navMenu.customLayout:defualtLayout}/components/${screenWidth>800?'nav_menu/NavMenu.tsx':'nav_menu_mobile/NavMenuMobile.tsx'}`).default;

return <NavMenuLayout links={navMenu.navLinks} />

}
export default NavMenu