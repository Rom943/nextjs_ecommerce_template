import React from 'react'
import { NavMenuProps } from "../nav_menu/NavMenu"
import navIcon from "./menu.png"
import { useRouter } from 'next/router';
import styles from './NavMenuMobile.module.css';

const NavMenuMobile:React.FC<NavMenuProps> = ({links}) => {
    const [displayMenu, setDisplayMenu] = React.useState(false);
    const [displaySubMenu, setDisplaySubMenu] = React.useState([]);
    const router = useRouter();
  return (
    <>
    <div className={styles.nav_menu_icon_container} onClick={()=>setDisplayMenu(!displayMenu)}>
        <img src={navIcon.src} alt='navIcon' width={30} height={30}/>
    </div>
    {displayMenu && (
        <div className={styles.nav_menu_container}>
            <button className={styles.cancel_button} onClick={()=>setDisplayMenu(false)}>X</button>
            {links && links.map((link,index)=>(
                <div>
                <h4 key={index} onDoubleClick={()=>router.push(`${link.main.link}`)}>{link.main.title}</h4>
                </div>
            ))}
        </div>
    )}
    </>
  )
}

export default NavMenuMobile