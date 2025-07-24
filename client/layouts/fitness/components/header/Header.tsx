import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import NavMenu, { NavLinks } from "../../../../components/nav_menu/NavMenu"
import SiteLogo from "../site_logo/SiteLogo";

import { HeaderProps } from "../../../../components/header/Header";
import Cart from "../../../../components/cart/Cart";
import SearchBar from "../../../../components/search_bar/SearchBar";



const Header: React.FC<HeaderProps> = ({header,defualtLayout}) => {

  const [screenWidth,setScreenWidth] = useState<number>(0)

  
  useEffect(()=>{
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
  },[])

  return (
    <div
      className={styles.header_container}
      style={{ position: header.position, backgroundColor: header.backgroundColor || "" }}
    >
        <SiteLogo logoUrl={header.siteLogo.logoUrl}/>
        {screenWidth > 800 &&
        <NavMenu defualtLayout={defualtLayout} navMenu={header.navMenu} />
        }
        <div className={styles.utility_container}>
          <SearchBar defualtLayout={defualtLayout} customLayout={header.searchBar?.customLayout}/>
          <Cart defualtLayout={defualtLayout} customLayout={header.cart.customLayout} />
        {screenWidth < 800 &&
        <NavMenu defualtLayout={defualtLayout} navMenu={header.navMenu} />
        }
        </div>
    </div>
  );
};

export default Header;
