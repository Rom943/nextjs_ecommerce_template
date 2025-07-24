import React, { useState } from 'react'
import Link from 'next/link';
import styles from './NavMenu.module.css';

export type LinkType = {
    link:string;
    title:string;
    sub?:LinkType[];
}

export type NavLinks ={
    main: LinkType;
    sub?: LinkType[];
}

export type NavMenuProps = {
    links: NavLinks[];
    direction?: "ltr" | "rtl"; // Optional direction for the nav menu, default is "ltr"
    fontColor?: string; // Optional font color for the nav menu
    subMenuColor?: string; // Optional color for the sub-menu links
}

const NavMenu:React.FC<NavMenuProps> = ({links,direction}) => {
    const [mainHoverd,setMainHoverd] = useState("");

    const SubLinks =()=>{
        const subLinksIndex = links.findIndex(link => link.main.title === mainHoverd);
        if(subLinksIndex === -1 || !links[subLinksIndex].sub || links[subLinksIndex].sub.length === 0){
            return null;
        }
        return(
        <div className={styles.sub_menu_container} onMouseLeave={() => setMainHoverd("")}>
            { links[subLinksIndex].sub.map((subLink, subIndex) => (
                <div>
                <h4 key={subIndex}>
                    <Link href={`/${subLink.link}`}>{subLink.title}</Link>
                </h4>
                {subLink.sub && subLink.sub.map((sub,index)=>(
                    <div>
                    <Link key={index} href={`/${sub.link}`}>{sub.title}</Link>
                    </div>
                ))}
                </div>
            ))}
        </div>)
    }

  return (
    <>
      <nav className={styles.nav_menu_container}>
        {links.map((link, index) => (
          <div key={index} className={styles.nav_menu_header} onMouseEnter={() => setMainHoverd(link.main.title)} >
            {link.main.title} {link.sub?"▼":""}
            </div>
            ))}
            
      </nav>
      {mainHoverd && <SubLinks />}
      </>
  )
}

export default NavMenu