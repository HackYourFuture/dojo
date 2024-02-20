import "./SearchResult.css"

export const SearchResult = ({result}) => {
  return(
    // [TODO]: change alert in onClick to navigate to profile page
    <div className="search-result" onClick={(e) => alert(`You clicked on ${result.name}`)}>{result.name}</div>
  )
}