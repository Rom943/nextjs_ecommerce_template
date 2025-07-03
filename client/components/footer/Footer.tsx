import React from 'react'
import { useDynamicStyles } from '../../hooks/useDynamicStyles'

type FooterProps = {
    layoutName: string;
    pageName: string;
}

const Footer:React.FC<FooterProps> = ({layoutName,pageName}) => {

    const styles = useDynamicStyles(layoutName, pageName);

  return (
    <div className={styles.footer}>Footer</div>
  )
}

export default Footer