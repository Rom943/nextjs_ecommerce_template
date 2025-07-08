import { useRouter } from 'next/router';
import React from 'react'
import styles from './SiteLogo.module.css';

type SiteLogoProps = {
    logoUrl: string;
}

const SiteLogo:React.FC<SiteLogoProps> = ({logoUrl}) => {

    const router = useRouter();

  return (
    <div><img className={styles.logo_image} onClick={()=>router.push("/")} src={logoUrl} alt="Site Logo" width={50} height={50}/></div>
  )
}

export default SiteLogo