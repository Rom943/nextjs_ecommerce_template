import React from 'react'
import { useDynamicStyles } from '../../hooks/useDynamicStyles'
import defualtStyles from './Header.module.css'

type HeaderProps = {
    layoutName: string;
    pageName: string;
    page:{
        header: {
            position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
        }
    }
}

const Header:React.FC<HeaderProps> = ({layoutName,pageName,page}) => {
    const styles = useDynamicStyles(layoutName, pageName);

  return (
    <div className={defualtStyles.header_container} style={{position:page.header.position}}>
        <div className={styles.test}>
        Header
        </div>
        </div>
  )
}

export default Header