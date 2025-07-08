import React, { useState } from 'react'
import Link from 'next/link';
import styles from './NavMenu.module.css';

type LinkType = {
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
}

const NavMenu:React.FC<NavMenuProps> = ({links}) => {
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
          <div key={index} onMouseEnter={() => setMainHoverd(link.main.title)} >
            {link.main.title}
            </div>
            ))}
            
      </nav>
      {mainHoverd && <SubLinks />}
      </>
  )
}

export default NavMenu