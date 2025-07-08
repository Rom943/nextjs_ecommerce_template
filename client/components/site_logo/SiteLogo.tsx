import React from 'react'

export type SiteLogoProps = {
    layoutName: string;
    logoUrl?: string;
}

const SiteLogo:React.FC<SiteLogoProps> = ({layoutName,logoUrl}) => {

    const LogoLayout = require(`../../layouts/${layoutName}/components/site_logo/SiteLogo.tsx`).default;

  return <LogoLayout logoUrl={logoUrl}/>
}

export default SiteLogo