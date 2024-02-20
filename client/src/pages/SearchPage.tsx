import { useState } from "react"
import { SearchBar } from "../components/searchBarComponent"
import "./SearchPage.css"
import { SearchResultsList } from "../components/SearchResultsList";
import HYFLogo from '../assets/HYF.svg';


function SearchPage() {
  const [results, setResults] = useState([]);

  return (
    <div className='App'>
      <div className='search-bar-container'>
        <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img"/>
        <SearchBar setResults={setResults}/>
        <SearchResultsList results={results} />
    </div>

  </div>
  )
}

export default SearchPage
