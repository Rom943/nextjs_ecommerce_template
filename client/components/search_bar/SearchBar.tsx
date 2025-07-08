import React from 'react'

export type SearchBarProps = {
  defualtLayout: string;
  customLayout?: string; // Optional custom layout for the search bar
  }

const SearchBar:React.FC<SearchBarProps> = ({defualtLayout,customLayout}) => {

    const SearchBarLayout = require(`../../layouts/${customLayout ? customLayout : defualtLayout}/components/search_bar/SearchBar.tsx`).default;

  return <SearchBarLayout />
}

export default SearchBar