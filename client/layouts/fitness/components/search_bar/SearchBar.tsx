import React, { useState } from 'react'
import styles from './SearchBar.module.css'
import searchIcon from './search-interface-symbol.png'


const SearchBar = () => {

    const [displaySearchInput,setDisplaySearchInput] =useState<boolean>(false);

    return (
    <>
    <div className={styles.search_bar_icon_container} onClick={()=>setDisplaySearchInput(!displaySearchInput)}>
        <img src={searchIcon.src} width={25} height={25}/>
        </div>
    {displaySearchInput &&
        <div className={styles.search_bar_container} onMouseLeave={()=>setDisplaySearchInput(false)}>
        <input placeholder='search'/>
    </div>
    }

    </>
  )
}

export default SearchBar