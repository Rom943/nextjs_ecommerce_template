import React from 'react'
import { useDynamicStyles } from '../../hooks/useDynamicStyles'



const Header = () => {
    const styles = useDynamicStyles('header')

  return (
    <div>Header</div>
  )
}

export default Header