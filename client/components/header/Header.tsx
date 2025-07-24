import React from "react";
import { NavLinks } from "../nav_menu/NavMenu";

export type HeaderProps = {
  defualtLayout: string;
  header: {
    backgroundColor?: string; // Optional background color for the header
    customLayout?: string; // Optional custom layout for the header
    position: "static" | "relative" | "absolute" | "fixed" | "sticky";
    navMenu:{
      fontColor?: string; // Optional font color for the nav menu
      subMenuBackgroundColor?: string; // Optional color for the sub-menu links
      direction?: "ltr" | "rtl"; // Optional direction for the nav menu, default is "ltr"
      customLayout?: string; // Optional custom layout for the nav menu
      navLinks: NavLinks[]; // Array of navigation links
    };
    siteLogo:{
      logoUrl: string; // URL of the site logo
    },
    cart:{
      customLayout?: string; // Optional custom layout for the cart
    },
    searchBar?: {
      customLayout?: string; // Optional custom layout for the search bar
    };
  };
};

const Header: React.FC<HeaderProps> = ({ defualtLayout, header }) => {
  const HeaderLayout = require(`../../layouts/${defualtLayout}/components/header/Header.tsx`).default;

  return <HeaderLayout defualtLayout={defualtLayout} header={header} />
};

export default Header;
