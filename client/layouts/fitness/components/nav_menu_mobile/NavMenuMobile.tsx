import React, { useState } from 'react'
import { LinkType, NavLinks, NavMenuProps } from "../nav_menu/NavMenu"
import navIcon from "./menu.png"
import { useRouter } from 'next/router';
import styles from './NavMenuMobile.module.css';
import Link from 'next/link';

const NavMenuMobile:React.FC<NavMenuProps> = ({links,direction}) => {
    const [displayMenu, setDisplayMenu] = useState<boolean>(false);
    const [displaySubMenu, setDisplaySubMenu] = useState<LinkType[]>();
    const router = useRouter();

    const handleEnterSubMenu=(link:NavLinks)=>{
        if(link.sub && link.sub.length > 0){
            setDisplaySubMenu(link.sub);
        } else {
            setDisplaySubMenu(undefined);
            router.push(`/${link.main.link}`);
            setDisplayMenu(false);
        }
    }

  return (
    <>
    <div className={styles.nav_menu_icon_container} onClick={()=>setDisplayMenu(!displayMenu)}>
        <img src={navIcon.src} alt='navIcon' width={30} height={30}/>
    </div>
    {displayMenu && (
        <div style={{direction:direction}} className={styles.nav_menu_container}>
            <div className={styles.nav_menu_header}>
            <button className={styles.cancel_button} onClick={()=>setDisplayMenu(false)}>X</button>
            {displaySubMenu && <button className ={styles.cancel_button} style={{fontSize:"20px"}} onClick={()=>setDisplaySubMenu(undefined)}>{'<'} חזרה</button>}
            </div>
            {links && displaySubMenu === undefined && links.map((link,index)=>(
                <div className={styles.nav_menu_header} key={index}>
                <h4 key={index} onClick={()=>handleEnterSubMenu(link)}>{link.main.title}</h4>
                </div>
            ))}
            {displaySubMenu && displaySubMenu.length > 0 && displaySubMenu.map((subLink, subIndex) => (
                <div  key={subIndex}>
                    <h4 className={styles.nav_menu_header} onClick={()=>router.push(`/${subLink.link}`)}>{subLink.title}</h4>
                    {subLink.sub && subLink.sub.map((sub, index) => (
                        <div  key={index} className={styles.sub_link_container}>
                            <Link href={`/${sub.link}`}>{sub.title}</Link>
                            <div>
                                {`>`}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )}
    </>
  )
}

export default NavMenuMobile