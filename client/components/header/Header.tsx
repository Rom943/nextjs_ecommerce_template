import React from 'react'
import { useDynamicStyles } from '../../hooks/useDynamicStyles'

type HeaderProps = {
    layoutName: string;
    pageName: string;
}

const Header:React.FC<HeaderProps> = ({layoutName,pageName}) => {
    const styles = useDynamicStyles(layoutName, pageName);

  return (
    <div className={styles.test}>Header</div>
  )
}

export default Header